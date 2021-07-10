import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import { EXECUTION } from "../queries";
import { UPDATE_EXECUTION } from "../mutations";
import Base from "./Base";
import PageNotFound from "./PageNotFound";
import ExecutionTable from "../components/ExecutionTable";
import File from "../components/File";
import { createErrorObject, detect404 } from "../forms";
import ExecutionDeletion from "../components/ExecutionDeletion";
import ExecutionAccess from "../components/ExecutionAccess";
import ExecutionInfo from "../components/ExecutionInfo";
import ExecutionProcess from "../components/ExecutionProcess";


const ExecutionPage = props => {
  const executionId = useRouteMatch("/executions/:id").params.id;
  const { edit } = props;
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

  const blockClass = "mb-10";
  const h2Class = "font-medium text-lg";
  const textClass = "font-light text-base mb-2";
  const linkClass = "flex text-sm font-medium";

  return (
    <Base className="relative">
      <ExecutionInfo execution={execution} className="mb-12" />
      <ExecutionProcess execution={execution} className="mb-12" />

      {execution.demultiplexExecution && (
        <div className={blockClass}>
          <h2 className={h2Class}>Demultiplexing</h2>
          <div className={textClass}>This reads file was created as part of demultiplexing:</div>
          <Link className={`${linkClass} -mt-2`} to={`/executions/${execution.demultiplexExecution.id}/`}>
            {execution.demultiplexExecution.name}
          </Link>
        </div>
      )}

      {execution.parent && (
        <div className={blockClass}>
          <h2 className={h2Class}>Workflows</h2>
          <div className={textClass}>This analysis was a component in a workflow:</div>
          <Link className={`${linkClass} -mt-2`} to={`/executions/${execution.parent.id}/`}>
            {execution.parent.name}
          </Link>
        </div>
      )}

      {fileInputs.length > 0 && (
        <div className={blockClass}>
          <h2 className={h2Class}>Uploads</h2>
          <div className={textClass}>This following files were uploaded:</div>
          <table>
            <tbody>
              {fileInputs.map(input => {
                const values = Array.isArray(input.value) ? input.value : [input.value]
                return (
                  <tr key={input.name}>
                    <td className="font-mono text-xs items-center mr-1 text-right">{input.name}:</td>
                    <td>
                      {values.map(file => <File name={file.file} size={file.size} execution={execution} />)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {dataInputs.length > 0 && (
        <div className={blockClass}>
          <h2 className={h2Class}>Upstream Analysis</h2>
          <div className={textClass}>This following previous analyses were used as input:</div>
          <table>
            <tbody>
              {dataInputs.map(input => {
                const values = Array.isArray(input.value) ? input.value : [input.value];
                return (
                  <tr key={input.name}>
                    <td className="font-mono text-xs items-center mr-1 text-right">{input.name}:</td>
                    <td>
                      {values.map(value => <Link key={value} className={linkClass} to={`/executions/${upstream[value].id}/`}>{upstream[value].name}</Link>)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {basicInputs.length > 0 && (
        <div className={blockClass}>
          <h2 className={h2Class}>{fileInputs.length || dataInputs.length ? "Basic " : ""}Inputs</h2>
          <div className={textClass}>The following {fileInputs.length || dataInputs.length ? " additional" : ""} inputs were provided:</div>
          <table>
            <tbody>
              {basicInputs.map(input => {
                const values = Array.isArray(input.value) ? input.value : [input.value]
                return (
                  <tr key={input.name}>
                    <td className="font-mono text-xs items-center mr-1 text-right py-0.5">{input.name}:</td>
                    <td className="font-mono text-xs font-bold">
                      {values.map(v => v.toString()).join(", ")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {execution.demultiplexed.length > 0 && (
        <div className={blockClass}>
          <h2 className={h2Class}>Demultiplexing</h2>
          <div className={textClass}>This demultiplexing produced the following reads files:</div>
          <ExecutionTable executions={execution.demultiplexed} />
        </div>
      )}

      {execution.children.length > 0 && (
        <div className={blockClass}>
          <h2 className={h2Class}>Steps</h2>
          <div className={textClass}>This following processes were carried out as part of this workflow:</div>
          <ExecutionTable executions={execution.children} />
        </div>
      )}

      {fileOutputs.length > 0 && (
        <div className={blockClass}>
          <h2 className={h2Class}>Files</h2>
          <div className={textClass}>This following files were produced:</div>
          <table>
            <tbody>
              {fileOutputs.map(output => {
                const values = Array.isArray(output.value) ? output.value : [output.value]
                return (
                  <tr key={output.name}>
                    <td className="font-mono text-xs items-center mr-1 text-right">{output.name}:</td>
                    <td>
                      {values.map(file => <File key={file.file} name={file.file} size={file.size} execution={execution} />)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {basicOutputs.length > 0 && (
        <div className={blockClass}>
          <h2 className={h2Class}>{fileOutputs.length ? "Additional " : ""}Outputs</h2>
          <div className={textClass}>The following {fileOutputs.length ? " additional" : ""} outputs were produced:</div>
          <table>
            <tbody>
              {basicOutputs.map(output => {
                const values = Array.isArray(output.value) ? output.value : [output.value]
                return (
                  <tr key={output.name}>
                    <td className="font-mono text-xs items-center mr-1 text-right py-0.5">{output.name}:</td>
                    <td className="font-mono text-xs font-bold">
                      {values.map(v => v.toString()).join(", ")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {execution.downstream.length > 0 && (
        <div className={blockClass}>
          <h2 className={h2Class}>Downstream Analysis</h2>
          <div className={textClass}>This following analyses use this execution as an input:</div>
          <ExecutionTable executions={execution.downstream} />
        </div>
      )}

      {!edit && execution.owners.length > 0 && (
        <div className="ml-auto w-max text-right flex text-base md:text-lg">
          Contributed by
          <div className="grid ml-2 font-medium">
            {execution.owners.map(user => <Link key={user.id} to={`/users/${user.username}/`}>{user.name}</Link>)}
          </div> 
        </div>
      )}

      {edit && execution.canShare && <div className="bottom-buttons">
        <ExecutionAccess execution={execution} allUsers={data.users} />
        {edit && execution.isOwner && <ExecutionDeletion execution={execution} />}
      </div>}
    </Base>
  )
};

ExecutionPage.propTypes = {
  
};

export default ExecutionPage;