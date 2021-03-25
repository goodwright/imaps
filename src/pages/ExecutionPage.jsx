import React, { useEffect } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { EXECUTION } from "../queries";
import { fileSize } from "../utils";
import Base from "./Base";
import PageNotFound from "./PageNotFound";
import ParameterValue from "../components/ParameterValue";

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

  const inputSchema = JSON.parse(execution.process.inputSchema);
  const outputSchema = JSON.parse(execution.process.outputSchema);
  const inputs = JSON.parse(execution.input);
  const outputs = JSON.parse(execution.output);
  const upstreamExecutions = execution.upstreamExecutions.reduce((prev, curr) => ({[curr.legacyId]: curr, ...prev}), {})

  return (
    <Base className="execution-page">
      <h1>{execution.name}</h1>
      <div>Created: {moment(execution.created * 1000).format("HH:mm, D MMM YYYY")}</div>
      <div>Scheduled: {moment(execution.scheduled * 1000).format("HH:mm, D MMM, YYYY")}</div>
      <div>Started: {moment(execution.started * 1000).format("HH:mm, D MMM, YYYY")}</div>
      <div>Finished: {moment(execution.finished * 1000).format("HH:mm, D MMM, YYYY")}</div>
      {execution.collection && <div>Collection: <Link to={`/collections/${execution.collection.id}/`}>{execution.collection.name}</Link></div>}
      {execution.sample && <div>Sample: <Link to={`/samples/${execution.sample.id}/`}>{execution.sample.name}</Link></div>}

      <br></br>
      <h2>Process</h2>
      <div className="process-name">{execution.process.name}</div>
      <div className="process-description">{execution.process.description}</div>
      <br></br>
      <h2>Inputs</h2>
      <div className="parameters">
        {Object.entries(inputs).map(input => (
          <div className="parameter">
            <div className="name">{input[0]}</div>
            <ParameterValue
              key={input[0]} name={input[0]} value={input[1]}
              schema={inputSchema.filter(i => i.name === input[0])[0]}
              dataLoc={execution.legacyId}
            />
          </div>
        ))}
      </div>
      {/* {JSON.parse(execution.process.inputSchema).filter(input => Object.keys(inputs).includes(input.name)).map(input => {
        let value = inputs[input.name].toString();
        if (input.type.slice(0, 5) === "data:") {
          const upstream = upstreamExecutions[inputs[input.name]];
          const file = JSON.parse(upstream.output)[input.name];
          value = <a href={`https://imaps.genialis.com/data/${upstream.legacyId}/${file.file}?force_download=1`}>{file.file} ({fileSize(file.size)})</a>
        }
        return (
          <div className="input">
            <span className="input-name">{input.name}: </span>
            <span className="input-value">{value}</span>
          </div>
        )
      })} */}
      <br></br>
      <h2>Output</h2>
      <div className="parameters">
        {Object.entries(outputs).map(output => (
          <div className="parameter">
            <div className="name">{output[0]}</div>
            <ParameterValue
              key={output[0]} name={output[0]} value={output[1]}
              schema={outputSchema.filter(o => o.name === output[0])[0]}
              dataLoc={execution.legacyId}
            />
          </div>
        ))}
      </div>
      {/* <h2>Outputs</h2>
      {JSON.parse(execution.process.outputSchema).filter(output => Object.keys(outputs).includes(output.name)).map(output => {
        let value = outputs[output.name].toString();
        if (output.type === "basic:file:") {
          value = <a href={`https://imaps.genialis.com/data/${execution.legacyId}/${outputs[output.name].file}?force_download=1`}>{outputs[output.name].file} ({fileSize(outputs[output.name].size)})</a>
        }
        if (output.type.slice(0, 16) === "list:basic:file:") {
          value = <span>{outputs[output.name].map(f => <a href={`https://imaps.genialis.com/data/${execution.legacyId}/${f.file}?force_download=1`}>{f.file} ({fileSize(f.size)})</a>)}</span>
        }
        
        return (
          <div className="output">
            <span className="output-name">{output.name}: </span>
            <span className="output-value">
              {value}
            </span>
          </div>
        )
      })} */}
    </Base>
  );
};

ExecutionPage.propTypes = {
  
};

export default ExecutionPage;