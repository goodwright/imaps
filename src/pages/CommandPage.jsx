import React from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import ReactMarkdown from "react-markdown";
import { COMMAND } from "../queries";
import { detect404 } from "../forms";
import PageNotFound from "./PageNotFound";
import Base from "./Base";

const CommandPage = () => {

  const commandId = useRouteMatch("/commands/:id").params.id;

  const { loading, data, error } = useQuery(COMMAND, {
    variables: {id: commandId}
  });

  useDocumentTitle(data ? `iMaps - ${data.command.name}` : "iMaps");

  if (detect404(error)) return <PageNotFound />

  if (loading) return <Base className="command-page" loading={true} />

  const command = data.command;

  return (
    <Base className="command-page">
      <h1>{command.name}</h1>

      <ReactMarkdown className="description">{command.description}</ReactMarkdown>
    </Base>
  );
};

CommandPage.propTypes = {
  
};

export default CommandPage;