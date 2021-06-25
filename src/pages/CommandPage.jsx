import React, { useState } from "react";
import { useHistory, useRouteMatch, useLocation } from "react-router";
import { useMutation, useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import ReactMarkdown from "react-markdown";
import { COMMAND, COLLECTION_DATA, POSSIBLE_EXECUTIONS, COLLECTION } from "../queries";
import { detect404 } from "../forms";
import PageNotFound from "./PageNotFound";
import Base from "./Base";
import { RUN_COMMAND } from "../mutations";
import CommandInputs from "../components/CommandInputs";

const CommandPage = () => {

  const commandId = useRouteMatch("/commands/:id").params.id;

  // Get the command
  const { loading, data, error } = useQuery(COMMAND, {
    variables: {id: commandId},
  });

  // Update the page title
  useDocumentTitle(data ? `iMaps - ${data.command.name}` : "iMaps");

  // While fetching the command, the page is loading
  if (loading) return <Base className="command-page" loading={true} />

  // If there is no such command, return 404
  if (detect404(error)) return <PageNotFound />

  // Once loaded, get the command and collection
  const command = data.command;


  return (
    <Base className="command-page">
      <h1>{command.name}</h1>
      <ReactMarkdown className="description">{command.description}</ReactMarkdown>
    </Base>
  )
};

CommandPage.propTypes = {
  
};

export default CommandPage;