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
import { createErrorObject, detect404 } from "../forms";
import ExecutionDeletion from "../components/ExecutionDeletion";
import ExecutionAccess from "../components/ExecutionAccess";
import ExecutionInfo from "../components/ExecutionInfo";
import ExecutionProcess from "../components/ExecutionProcess";
import ExecutionSection from "../components/ExecutionSection";


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

  const linkClass = "flex text-sm font-medium";

  return (
    <Base className="relative">
      <ExecutionInfo execution={execution} className="mb-12" />
      <ExecutionProcess execution={execution} className="mb-12" />

      {execution.demultiplexExecution && (
        <ExecutionSection heading="Demultiplexing" text="This reads file was created as part of demultiplexing:">
          <Link className={`${linkClass} -mt-2`} to={`/executions/${execution.demultiplexExecution.id}/`}>
            {execution.demultiplexExecution.name}
          </Link>
        </ExecutionSection>
      )}

      {execution.parent && (
        <ExecutionSection heading="Workflows" text="This analysis was a component in a workflow:">
          <Link className={`${linkClass} -mt-2`} to={`/executions/${execution.parent.id}/`}>
            {execution.parent.name}
          </Link>
        </ExecutionSection>
      )}

      {fileInputs.length > 0 && (
        <ExecutionSection
          heading="Uploads" text="The following files were uploaded:"
          table={fileInputs} isFile={true} execution={execution}
        />
      )}

      {dataInputs.length > 0 && (
        <ExecutionSection
          heading="Upstream Analysis" text="The following previous analyses were used as input:"
          table={dataInputs} isLink={true} lookup={upstream}
        />
      )}

      {basicInputs.length > 0 && (
        <ExecutionSection
          heading={`${fileInputs.length || dataInputs.length ? "Basic " : ""}Inputs`}
          text={`The following ${fileInputs.length || dataInputs.length ? " additional" : ""} inputs were provided:`}
          table={basicInputs}
        />
      )}

      {execution.demultiplexed.length > 0 && (
        <ExecutionSection heading="Demultiplexing" text="This demultiplexing produced the following reads files:">
          <ExecutionTable executions={execution.demultiplexed} />
        </ExecutionSection>
      )}

      {execution.children.length > 0 && (
        <ExecutionSection heading="Steps" text="The following processes were carried out as part of this workflow:">
          <ExecutionTable executions={execution.children} />
        </ExecutionSection>
      )}

      {fileOutputs.length > 0 && (
        <ExecutionSection
          heading="Files" text="This following files were produced:"
          table={fileOutputs} isFile={true} execution={execution}
        />
      )}

      {basicOutputs.length > 0 && (
        <ExecutionSection
          heading={`${fileOutputs.length ? "Additional " : ""}Outputs`}
          text={`The following ${fileOutputs.length ? " additional" : ""} outputs were produced:`}
          table={basicOutputs}
        />
      )}

      {execution.downstream.length > 0 && (
        <ExecutionSection heading="Downstream Analysis" text="This following analyses use this execution as an input:">
          <ExecutionTable executions={execution.downstream} />
        </ExecutionSection>
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