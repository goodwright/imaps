import React from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import ReactTooltip from "react-tooltip";
import ReactMarkdown from "react-markdown";
import { COMMAND } from "../queries";
import { detect404 } from "../forms";
import PageNotFound from "./PageNotFound";
import Base from "./Base";

const CommandPage = () => {

  const commandId = useRouteMatch("/commands/:id").params.id;

  const { loading, data, error } = useQuery(COMMAND, {
    variables: {id: commandId},
  });

  useDocumentTitle(data ? `iMaps - ${data.command.name}` : "iMaps");

  if (loading) return <Base loading={true} />

  if (detect404(error)) return <PageNotFound />

  const command = data.command;

  const categoryColor = {
    "process": "bg-blue-400",
    "import": "bg-pink-500",
    "internal-import": "bg-gray-500",
    "workflow": "bg-yellow-500",
  }[command.category]

  const categoryHelp = {
    "process": "A process command uses the outputs of previous commands as its inputs.",
    "import": "An import command is for uploading new data.",
    "internal-import": "An internal import command is used internally to prepare the products of demultiplxing.",
    "workflow": "A workflow is a series of other processes run one after the other.",
  }[command.category]


  return (
    <Base>
      <div className="flex items-start">
        <h1 className="flex-grow">{command.name}</h1>
        <div className={`text-white w-max rounded text-sm md:text-base px-2 py-0.5 cursor-default shadow ${categoryColor}`} data-tip data-for="category">
          {command.category}
        </div>
        <ReactTooltip id="category">{categoryHelp}</ReactTooltip>
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