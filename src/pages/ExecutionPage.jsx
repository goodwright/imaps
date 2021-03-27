import React, { useEffect } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { EXECUTION } from "../queries";
import ReactMarkdown from "react-markdown";
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
  console.log(inputSchema)
  const outputSchema = JSON.parse(execution.process.outputSchema);
  const inputs = JSON.parse(execution.input);
  const outputs = JSON.parse(execution.output);
  const upstreamExecutions = execution.upstreamExecutions.reduce((prev, curr) => ({[curr.id]: curr, ...prev}), {});
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
          This analysis was performed as part of a parent execution:
          <Link className="parent-execution" to={`/executions/${execution.parent.id}/`}>{execution.parent.name}</Link>
        </div>
      )}


      <br></br>
      <h2>Inputs</h2>
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
      </div>
    </Base>
  );
};

ExecutionPage.propTypes = {
  
};

export default ExecutionPage;