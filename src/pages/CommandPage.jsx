import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch, useLocation } from "react-router";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import ReactMarkdown from "react-markdown";
import Toggle from "react-toggle";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { COMMAND, COLLECTION_DATA, POSSIBLE_EXECUTIONS, COLLECTION } from "../queries";
import { detect404 } from "../forms";
import PageNotFound from "./PageNotFound";
import ExecutionHistory from "../components/ExecutionHistory";
import Base from "./Base";
import { RUN_COMMAND } from "../mutations";
import { BarLoader } from "react-spinners";
import Paginator from "../components/Paginator";
import CommandInputs from "../components/CommandInputs";

const createDefaults = inputSchema => {
  const inputs = {};
  for (let input of inputSchema) {
    let value = "";
    if (input.default !== undefined) {
      value = input.default;
    } else if (!input.type) {
      value = createDefaults(input.group);
    } else if (input.type.slice(0, 5) === "list:") {
      value = [];
    } else if (input.type.slice(0, 5) === "data:") {
      value = null;
    } else if (input.type === "basic:boolean:") {
      value = false;
    }
    inputs[input.name] = value;
  }
  return inputs;
}

const CommandPage = () => {

  const commandId = useRouteMatch("/commands/:id").params.id;

  const [inputValues, setInputValues] = useState(null);
  console.log(inputValues)
  const history = useHistory();

  // Has a collection been specified?
  const params = new URLSearchParams(useLocation().search);
  const collectionId = params.get("collection");

  // Get the command
  const { loading, data, error } = useQuery(COMMAND, {
    variables: {id: commandId},
    onCompleted: data => {
      // Parse JSON
      const inputSchema = JSON.parse(data.command.inputSchema);

      // Create the initial inputs object
      setInputValues(createDefaults(inputSchema))     
    }
  });

  // Get collection if required
  const collectionQuery = useQuery(COLLECTION, {
    skip: loading || !collectionId,
    variables: {id: collectionId}
  })

  // Update the page title
  useDocumentTitle(data ? `iMaps - ${data.command.name}` : "iMaps");

  // While fetching the command, the page is loading
  if (loading || collectionQuery.loading) return <Base className="command-page" loading={true} />

  // If there is no such command, return 404
  if (detect404(error)) return <PageNotFound />

  // Once loaded, get the command and collection
  const command = data.command;
  const collection = collectionQuery.data && collectionQuery.data.collection;

  // Can the form be shown?
  const canShowForm = inputValues && (!collectionId || collectionQuery.data);

  return (
    <Base className="command-page">
      <h1>{command.name}</h1>
      <ReactMarkdown className="description">{command.description}</ReactMarkdown>

      {!collectionId && <div className="no-collection">No collection specified.</div>}
      {collection && <div className="collection">{collection.name}</div>}

      {canShowForm && (
        <form>
          <CommandInputs
            inputSchema={JSON.parse(command.inputSchema)}
            inputValues={inputValues}
            setInputValues={setInputValues}
            collection={collection}
          />
        </form>
      )}
    </Base>
  )
};

CommandPage.propTypes = {
  
};

export default CommandPage;