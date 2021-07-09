import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import { EXECUTION } from "../queries";
import { UPDATE_EXECUTION } from "../mutations";
import Base from "./Base";
import PageNotFound from "./PageNotFound";
import warningIcon from "../images/warning.svg";
import errorIcon from "../images/error.svg";
import ReactTooltip from "react-tooltip";
import { fileSize, duration } from "../utils";
import fileIcon from "../images/file.svg";
import ExecutionHistory from "../components/ExecutionHistory";
import { createErrorObject, detect404 } from "../forms";
import { UserContext } from "../contexts";
import ExecutionDeletion from "../components/ExecutionDeletion";
import ExecutionAccess from "../components/ExecutionAccess";
import ExecutionInfo from "../components/ExecutionInfo";


const ExecutionPage = props => {
  const executionId = useRouteMatch("/executions/:id").params.id;
  const { edit } = props;
  const [user,] = useContext(UserContext);
  const nameEl = useRef(null);
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const { loading, data, error } = useQuery(EXECUTION, {
    variables: {id: executionId}
  });

  useDocumentTitle(data ? `iMaps - ${data.execution.name}` : "iMaps");

  const [updateExecution, updateExecutionMutation] = useMutation(UPDATE_EXECUTION, {
    refetchQueries: [
      {query: EXECUTION, variables: {id: executionId}},
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setErrors({});
      history.push(`/executions/${executionId}/`);
    },
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
  });

  if (detect404(error)) return <PageNotFound />

  if (loading) return <Base className="execution-page" loading={true} />

  const save = e => {
    e.preventDefault();
    updateExecution({
      variables: {
        id: execution.id, name: nameEl.current.innerText
      }
    })
  }

  const execution = data.execution;

  const input = JSON.parse(data.execution.input);
  const output = JSON.parse(data.execution.output);

  const basicInputs = input.filter(i => i.type && i.type.includes("basic:") && !i.type.includes("file:"));
  const fileInputs = input.filter(i => i.type && i.type.includes("basic:file:"));
  const dataInputs = input.filter(i => i.type && i.type.includes("data:"));
  const upstream = execution.upstream.reduce((prev, curr) => ({
    ...prev, [curr.id]: curr
  }), {});
  
  const basicOutputs = output.filter(o => o.type && o.value !== undefined && o.type.includes("basic:") && !o.type.includes("file:"));
  const fileOutputs = output.filter(o => o.type && o.value !== undefined && o.type.includes("basic:file:"));

  return (
    <Base className="execution-page">
      <ExecutionInfo execution={execution} />





      <div className="mt-80" />



      {edit && execution.canShare && <div className="bottom-buttons">
        <ExecutionAccess execution={execution} allUsers={data.users} />
        {edit && execution.isOwner && <ExecutionDeletion execution={execution} />}
      </div>}



      <div className="dates">
        {execution.started && <div>Started: {moment(execution.started * 1000).format("HH:mm, D MMM, YYYY")}</div>}
        {execution.finished && <div>Finished: {moment(execution.finished * 1000).format("HH:mm, D MMM, YYYY")}</div>}
      </div>

      <div className="process">
        {execution.status && <div>Status: {execution.status}</div>}
        {execution.warning && <div>Warning: {execution.warning}</div>}
        {execution.error && <div>Error: {execution.error}</div>}
      </div>
      <br />
      
      {execution.demultiplexExecution && <div className="demultiplex">
        Demultiplxed from:
        <div><Link to={`/executions/${execution.demultiplexExecution.id}/`}>{execution.demultiplexExecution.name}</Link></div>
        <br />
      </div>}

      {execution.demultiplexed.length > 0 && (
        <div>
          Demultiplexed into:
          {execution.demultiplexed.map(ex => (
            <div key={ex.id}><Link to={`/executions/${ex.id}/`}>{ex.name}</Link></div>
          ))}
          <br />
        </div>
      )}

      {execution.parent && (
        <div>
          Performed as part of a workflow:
          <div><Link to={`/executions/${execution.parent.id}/`}>{execution.parent.name}</Link></div>
          <div>{execution.parent.command.name}</div>
          <br />
        </div>
      )}

      {dataInputs.length > 0 && (
        <div>
          Data Inputs:
          {dataInputs.map(input => {
            const values = Array.isArray(input.value) ? input.value : [input.value]
            return (
              <div key={input.name}>
                <div>{input.name}:</div>
                <div>
                  {values.filter(value => value in upstream).map((value, index) => (
                    <div key={index}>
                      <Link to={`/executions/${value}/`}>{upstream[value].name}</Link>
                      <div>{upstream[value].command.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
            })}
          <br />
        </div>
      )}

      {fileInputs.length > 0 && (
        <div>
          File Inputs:
          {fileInputs.map(input => {
            const values = Array.isArray(input.value) ? input.value : [input.value]
            return (
              <div key={input.name}>
                <div>{input.name}:</div>
                <div>
                  {values.map((value, index) => <a key={index} href={`${process.env.REACT_APP_DATA}/${execution.id}/${value.file}`}>{value.file}</a>)}
                </div>
              </div>
            )
            })}
          <br />
        </div>
      )}

      {basicInputs.length > 0 && (
        <div>
          Basic Inputs:
          {basicInputs.map(input => {
            const values = Array.isArray(input.value) ? input.value : [input.value];
            return (
              <div key={input.name}>
                <span>{input.name}: </span><span>{values.map(v => v.toString()).join(", ")}</span>
              </div>
            )
            })}
          <br />
        </div>
      )}

      {basicOutputs.length > 0 && (
        <div>
          Basic Outputs:
          {basicOutputs.map(output => {
            const values = Array.isArray(output.value) ? output.value : [output.value];
            return (
              <div key={output.name}>
                <span>{output.name}:</span>
                <span>{values.map(v => v.toString()).join(", ")}</span>
              </div>
            )
            })}
          <br />
        </div>
      )}

      {fileOutputs.length > 0 && (
        <div>
          File Outputs:
          {fileOutputs.map(output => {
            const values = Array.isArray(output.value) ? output.value : [output.value]
            return (
              <div key={output.name}>
                <div>{output.name}:</div>
                <div>
                  {values.map((value, index) => <a key={index} href={`${process.env.REACT_APP_DATA}/${execution.id}/${value.file}`}>{value.file}</a>)}
                </div>
              </div>
            )
          })}
          <br />
        </div>
      )}

      {execution.children.length > 0 && (
        <div>
          Steps:
          {execution.children.map(child => (
            <div key={child.id}>{child.command.name}: <Link to={`/executions/${child.id}/`}>{child.name}</Link></div>
          ))}
        </div>
      )}

      {execution.downstream.length > 0 && (
        <div>
          Downstream:
          {execution.downstream.map(down => (
            <div key={down.id}>
                <Link to={`/executions/${down.id}/`}>{down.name}</Link>
            </div>
          ))}
          <br />
        </div>
      )}

      {execution.owners.length > 0 && <div className="owner">
        Contributed by <div className="names">{execution.owners.map(user => <Link key={user.id} to={`/users/${user.username}/`}>{user.name}</Link>)}</div> 
      </div>}


    </Base>
  )
  
  // Parse inputs
  const inputs = JSON.parse(execution.input);
  const inputSchema = JSON.parse(execution.command.inputSchema);

  // Assign schema to all inputs
  for (let schema of inputSchema) {
    if (Object.keys(inputs).includes(schema.name)) {
      inputs[schema.name] = {value: inputs[schema.name], schema}
    }
  }

  // Don't care about group inputs
  for (let key in inputs) {
    if ("group" in inputs[key].schema) delete inputs[key]
  }

  // Handle input lists
  for (let key in inputs) {
    inputs[key].schema.rawType = inputs[key].schema.type.replace("list:", "");
    if (!Array.isArray(inputs[key].value)) {
      inputs[key].value = [inputs[key].value];
    }
  }

  // Process upstream executions
  /* const dataInputs = {}
  const upstreamExecutions = execution.upstreamExecutions.reduce(
    (prev, curr) => ({[curr.id]: curr, ...prev}), {}
  );
  for (let input of Object.entries(inputs)) {
    if (input[1].schema.rawType.slice(0, 5) === "data:") {
      dataInputs[input[0]] = input[1]
      dataInputs[input[0]].value = input[1].value.map(id => upstreamExecutions[id])   
    }
  } */

  // Process upload inputs

  // Process basic inputs
  

  // Parse outputs
  const outputs = JSON.parse(execution.output);
  const outputSchema = JSON.parse(execution.command.outputSchema);

  // Assign schema to all inputs
  for (let schema of outputSchema) {
    if (Object.keys(outputs).includes(schema.name)) {
      outputs[schema.name] = {value: outputs[schema.name], schema}
    }
  }

  // Handle output lists
  for (let key in outputs) {
    outputs[key].schema.rawType = outputs[key].schema.type.replace("list:", "");
    if (!Array.isArray(outputs[key].value)) {
      outputs[key].value = [outputs[key].value];
    }
  }

  // Data outputs
  const componentExecutions = execution.componentExecutions.reduce(
    (prev, curr) => ({[curr.id]: curr, ...prev}), {}
  );
  const dataOutputs = [];
  for (let output of Object.entries(outputs).filter(
    o => o[1].schema.rawType.slice(0, 5) === "data:" && !o[1].schema.hidden
  )) {
    for (let step of output[1].value.map(id => componentExecutions[id])) {
      dataOutputs.push(step)
    }
  }

  // Process file outputs


  const downstreamExecutions = execution.downstreamExecutions;
  const InfoElement = edit ? "form" : "div";

  return (
    <Base className="execution-page">
      <InfoElement onSubmit={save}>
        {edit && errors.name && <div className="error">{errors.name}</div> }
        <h1
          contentEditable={edit} suppressContentEditableWarning={edit}
          className={edit ? "editable" : ""} ref={nameEl}
        >{execution.name}</h1>

        {user && execution.canEdit && !edit && (
          <Link to={`/executions/${execution.id}/edit/`} className="edit-button button tertiary-button">edit execution</Link>
        )}
        {edit && (
          <button type="submit" className="edit-button button tertiary-button">
            {updateExecutionMutation.loading ? <ClipLoader color="white" size="20px" /> : "save changes"}
          </button>
        )}
      </InfoElement>

      {edit && execution.canShare && <div className="bottom-buttons">
        <ExecutionAccess execution={execution} allUsers={data.users} />
        {edit && execution.isOwner && <ExecutionDeletion execution={execution} />}
      </div>}

      {!edit &&
        <>
          <div className="top-row">
            <div className="associations">
              {execution.collection && <div className="association">Collection: <Link to={`/collections/${execution.collection.id}/`}>{execution.collection.name}</Link></div>}
              {execution.sample && <div className="association">Sample: <Link to={`/samples/${execution.sample.id}/`}>{execution.sample.name}</Link></div>}
            </div>
            <div className="dates">
              {execution.created && <div>Created: {moment(execution.created * 1000).format("HH:mm, D MMM YYYY")}</div>}
              {execution.scheduled && <div>Scheduled: {moment(execution.scheduled * 1000).format("HH:mm, D MMM, YYYY")}</div>}
              {execution.started && <div>Started: {moment(execution.started * 1000).format("HH:mm, D MMM, YYYY")}</div>}
              {execution.finished && <div>Finished: {moment(execution.finished * 1000).format("HH:mm, D MMM, YYYY")}</div>}
            </div>
          </div>

          <div className="files">
            {Object.values(fileOutputs).map((f, n) => f.value.map((v, m) => (
              <div className="file" key={`${n}-${m}`}>
                <a className="file" href={`${process.env.REACT_APP_DATA}/${execution.id}/${v.file}`}>
                  <img src={fileIcon} alt="" />{v.file} 
                </a>
                <span>{fileSize(v.size)}</span>
              </div>
            )))}
          </div>

          <div className="command">
            <div className="command-name">{execution.command.name}</div>
            <ReactMarkdown className="command-description">{execution.command.description}</ReactMarkdown>
          </div>

          <div className="execution-details">
            {execution.started && (
              <div className="duration">
                Duration: {duration((execution.finished || (moment().unix() / 1000)) - execution.started)}
              </div>
            )}
            <div className="status">
              Status: {execution.status}
            </div>
            {execution.warning && (
              <div className="warning-message"><img src={warningIcon} alt="warning" />{execution.warning}</div>
            )}
            {execution.error && (
              <div className="error-message"><img src={errorIcon} alt="error" />{execution.error}</div>
            )}
          </div>

          <div className="io">
            <div className="all-inputs">
              {execution.parent && (
                <div className="parent">
                  <h2>This analysis was performed as part of a parent execution:</h2>
                  <Link className="parent-execution" to={`/executions/${execution.parent.id}/`}>{execution.parent.name}</Link>
                </div>
              )}
              {Object.values(dataInputs).length > 0 && (
                <div className="upstream">
                  <h2>This analysis uses the outputs of previous analysis:</h2>
                  <div className="executions">
                    {Object.entries(dataInputs).map((input, i) => (
                      <div className="map" key={i}>
                        <div className="key" data-tip data-for={input[0]}>{input[0]}:</div>
                        {input[1].schema.label && (
                          <ReactTooltip id={input[0]}>{input[1].schema.label}</ReactTooltip>
                        )}
                        <div className="values">
                          {input[1].value.map((value, v) => (
                            <div className="value" key={v}>
                              {value ? <Link to={`/executions/${value.id}/`}>{value.name}</Link> : <div className="error">Missing</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Object.values(fileInputs).length > 0 && (
                <div className="files">
                  <h2>Files uploaded:</h2>
                  <div className="files">
                    {Object.entries(fileInputs).map((input, i) => (
                      <div className="map" key={i}>
                        <div className="key" data-tip data-for={input[0]}>{input[0]}:</div>
                        {input[1].schema.label && (
                          <ReactTooltip id={input[0]}>{input[1].schema.label}</ReactTooltip>
                        )}
                        <div className="values">
                          {input[1].value.map((value, v) => (
                            <div className="value" key={v}>
                              <a href={`${process.env.REACT_APP_DATA}/${execution.id}/${value.file}`}>{value.file} <span>{fileSize(value.size)}</span></a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Object.values(basicInputs).length > 0 && (
                <div className="basic-inputs">
                  <h2>Basic inputs:</h2>
                  <div className="inputs">
                    {Object.entries(basicInputs).map((input, i) => (
                      <div className="map" key={i}>
                        <div className="key" data-tip data-for={input[0]}>{input[0]}:</div>
                        {input[1].schema.label && (
                          <ReactTooltip id={input[0]}>{input[1].schema.label}</ReactTooltip>
                        )}
                        <div className="values">
                          {input[1].value.length > 10 ? (
                            <>
                              {input[1].value.slice(0, 10).map((value, v) => (
                                <div className="value" key={v}>{value.toString()}</div>
                              ))}
                              <div className="value warning">{input[1].value.length - 10} more omitted</div>
                            </>
                          ) : (
                            input[1].value.map((value, v) => (
                              <div className="value" key={v}>{value.toString()}</div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="all-outputs">
              {Object.values(dataOutputs).length > 0 && (
                <div className="data-outputs">
                  <h2>This analysis spawned the following additional analyses:</h2>
                  <ExecutionHistory executions={dataOutputs} useName={true} />
                </div>
              )}

              {Object.values(fileOutputs).length > 0 && (
                <div className="files">
                  <h2>Files Generated:</h2>
                  <div className="files">
                    {Object.entries(fileOutputs).map((output, o) => (
                      <div className="map" key={o}>
                        <div className="key" data-tip data-for={output[0]}>{output[0]}:</div>
                        {output[1].schema.label && (
                          <ReactTooltip id={output[0]}>{output[1].schema.label}</ReactTooltip>
                        )}
                        <div className="values">
                          {output[1].value.map((value, v) => (
                            <div className="value" key={v}>
                              {value.file ? (
                                <a className="download" href={`${process.env.REACT_APP_DATA}/${execution.id}/${value.file}`}>{value.file} </a>
                              ) : <span>{value.dir} (directory) </span>
                              }<span className="size">{fileSize(value.size)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.values(basicOutputs).length > 0 && (
                <div className="basic-outputs">
                  <h2>Additional Output:</h2>
                  <div className="outputs">
                    {Object.entries(basicOutputs).map((output, o) => (
                      <div className="map" key={o}>
                        <div className="key" data-tip data-for={output[0]}>{output[0]}:</div>
                        {output[1].schema.label && (
                          <ReactTooltip id={output[0]}>{output[1].schema.label}</ReactTooltip>
                        )}
                        <div className="values">
                          {output[1].value.map((value, v) => (
                            <div className="value" key={v}>{output[1].schema.type.includes("json") ? "Not yet implemented in iMaps" : value.toString()}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {downstreamExecutions.length > 0 && (
                <div className="downstream">
                  <h2>The following analyses use the output of this analysis:</h2>
                  <ExecutionHistory executions={downstreamExecutions} useName={true} />
                </div>
              )}
            </div>
          </div>

          {execution.owners.length > 0 && <div className="owner">
            Contributed by <div className="names">{execution.owners.map(user => <Link key={user.id} to={`/users/${user.username}/`}>{user.name}</Link>)}</div> 
          </div>}
        </>
      }
    </Base>
  );
};

ExecutionPage.propTypes = {
  
};

export default ExecutionPage;