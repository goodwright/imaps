import React from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import { useDocumentTitle } from "../hooks";
import ReactMarkdown from "react-markdown";
import { COMMAND } from "../queries";
import { detect404 } from "../forms";
import PageNotFound from "./PageNotFound";
import Base from "./Base";
import CommandCategory from "../components/CommandCategory";

const CommandPage = () => {

  const commandId = useRouteMatch("/commands/:id").params.id;

  const { loading, data, error } = useQuery(COMMAND, {
    variables: {id: commandId},
  });

  useDocumentTitle(data ? `iMaps - ${data.command.name}` : "iMaps");

  if (loading) return <Base loading={true} />

  if (detect404(error)) return <PageNotFound />

  const command = data.command;

  return (
    <Base>
      <div className="flex items-start">
        <h1 className="flex-grow">{command.name}</h1>
        <CommandCategory category={command.category} />
      </div>
      <div className="text-xl text-primary-300 tracking-wide mb-4 -mt-2">{command.outputType}</div>
      <ReactMarkdown className="font-light pb-8 border-b max-w-4xl">
        {command.description}
      </ReactMarkdown>

      <p className="font-light max-w-4xl mt-8 bg-gray-50 shadow p-2 rounded italic">
        This is the page for running a command or uploading new data to
        iMaps. While iMaps is undergoing its redevelopment, this functionality
        is not yet available. Check back over July and August 2021 as we
        integrate our new Nextflow Pipelines into the system. In the meantime,
        analysis can still be performed on the&nbsp;
        <a href="https://imaps.genialis.com/iclip">legacy iMaps</a>.
      </p>
    </Base>
  )
};

CommandPage.propTypes = {
  
};

export default CommandPage;