import React, { useEffect } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { EXECUTION } from "../queries";
import ReactMarkdown from "react-markdown";
import Base from "./Base";
import PageNotFound from "./PageNotFound";
import ReactTooltip from "react-tooltip";
import { fileSize } from "../utils";

const ExecutionPage = () => {
  const executionId = useRouteMatch("/executions/:id").params.id;

  const { loading, data, error } = useQuery(EXECUTION, {
    variables: {id: executionId}
  });

  useEffect(() => {
    document.title = `iMaps${data && data.execution ? " - " + data.execution.name : ""}`;
  });

  if ((error && error.graphQLErrors && error.graphQLErrors.length)) {
    const message = JSON.parse(error.graphQLErrors[0].message);
    if (message && Object.values(message).some(m => m === "Does not exist")) {
      return <PageNotFound />
    }
  }

  if (loading) {
    return <Base className="execution-page" loading={true} />
  }

  const execution = data.execution;
  
  // Parse inputs
  const inputs = JSON.parse(execution.input);
  const inputSchema = JSON.parse(execution.process.inputSchema);

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
  const dataInputs = {}
  const upstreamExecutions = execution.upstreamExecutions.reduce(
    (prev, curr) => ({[curr.id]: curr, ...prev}), {}
  );
  for (let input of Object.entries(inputs)) {
    if (input[1].schema.rawType.slice(0, 5) === "data:") {
      dataInputs[input[0]] = input[1]
      dataInputs[input[0]].value = input[1].value.map(id => upstreamExecutions[id])   
    }
  }

  // Process upload inputs
  const fileInputs = Object.entries(inputs).filter(
    input => input[1].schema.rawType.slice(0, 11) === "basic:file:" && !input[1].schema.hidden
  ).reduce((prev, curr) => ({[curr[0]]: curr[1],  ...prev}), {})

  // Process basic inputs
  const basicInputs = Object.entries(inputs).filter(
    input => input[1].schema.rawType.slice(0, 6) === "basic:" &&
    input[1].schema.rawType.slice(6, 10) !== "file" && !input[1].schema.hidden
  ).reduce((prev, curr) => ({[curr[0]]: curr[1],  ...prev}), {})


  const outputSchema = JSON.parse(execution.process.outputSchema);
  const outputs = JSON.parse(execution.output);
  const downstreamExecutions = execution.downstreamExecutions.reduce((prev, curr) => ({[curr.id]: curr, ...prev}), {});

  return (
    <Base className="execution-page">
      <h1>{execution.name}</h1>

      <div className="top-row">
        <div className="associations">
          {execution.collection && <div className="association">Collection: <Link to={`/collections/${execution.collection.id}/`}>{execution.collection.name}</Link></div>}
          {execution.sample && <div className="association">Sample: <Link to={`/samples/${execution.sample.id}/`}>{execution.sample.name}</Link></div>}
        </div>
        <div className="dates">
          <div>Created: {moment(execution.created * 1000).format("HH:mm, D MMM YYYY")}</div>
          <div>Scheduled: {moment(execution.scheduled * 1000).format("HH:mm, D MMM, YYYY")}</div>
          <div>Started: {moment(execution.started * 1000).format("HH:mm, D MMM, YYYY")}</div>
          <div>Finished: {moment(execution.finished * 1000).format("HH:mm, D MMM, YYYY")}</div>
        </div>
      </div>

      <div className="process">
        <div className="process-name">{execution.process.name}</div>
        <ReactMarkdown className="process-description">{execution.process.description}</ReactMarkdown>
      </div>

      {execution.parent && (
        <div className="parent">
          <h2>This analysis was performed as part of a parent execution:</h2>
          <Link className="parent-execution" to={`/executions/${execution.parent.id}/`}>{execution.parent.name}</Link>
        </div>
      )}

      {Object.values(dataInputs).length > 0 && (
        <div className="upstream">
          <h2>This analysis uses the outputs of the following previous executions:</h2>
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
                      <Link to={`/executions/${value.id}/`}>{value.name}</Link>
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
          <h2>This analysis has the following files uploaded:</h2>
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
                      <a href={`https://imaps.genialis.com/data/${execution.dataLocation}/${value.file}?force_download=1`}>{value.file} <span>{fileSize(value.size)}</span></a>
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
          <h2>This analysis has the following basic inputs:</h2>
          <div className="inputs">
            {Object.entries(basicInputs).map((input, i) => (
              <div className="map" key={i}>
                <div className="key" data-tip data-for={input[0]}>{input[0]}:</div>
                {input[1].schema.label && (
                  <ReactTooltip id={input[0]}>{input[1].schema.label}</ReactTooltip>
                )}
                <div className="values">
                  {input[1].value.map((value, v) => (
                    <div className="value" key={v}>{value.toString()}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* <h2>Inputs</h2>
      <div className="parameters">
        {Object.entries(inputs).map((input, i) => (
          <div className="parameter" key={i}>
            <div className="name">{inputSchema.filter(i => i.name === input[0])[0].label}</div>
            <ParameterValue
              key={input[0]} name={input[0]} value={input[1]}
              schema={inputSchema.filter(i => i.name === input[0])[0]}
              dataLoc={execution.id} executions={upstreamExecutions}
            />
          </div>
        ))}
      </div>
      <br></br>
      <h2>Output</h2>
      <div className="parameters">
        {Object.entries(outputs).map(output => (
          <div className="parameter">
            <div className="name">{outputSchema.filter(o => o.name === output[0])[0].label}</div>
            <ParameterValue
              key={output[0]} name={output[0]} value={output[1]}
              schema={outputSchema.filter(o => o.name === output[0])[0]}
              dataLoc={execution.id} executions={downstreamExecutions}
            />
          </div>
        ))}
      </div> */}
    
    </Base>
  );
};

ExecutionPage.propTypes = {
  
};

export default ExecutionPage;