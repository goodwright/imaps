import React, { useState } from "react";
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

  const [inputValues, setInputValues] = useState(null);

  const { loading, data, error } = useQuery(COMMAND, {
    variables: {id: commandId},
    onCompleted: data => setInputValues(JSON.parse(data.command.inputSchema).reduce(
      (prev, curr) => ({...prev, [curr.name]: (curr.default === undefined ? "" : curr.default)}), {}
    ))
  });

  useDocumentTitle(data ? `iMaps - ${data.command.name}` : "iMaps");

  if (detect404(error)) return <PageNotFound />

  if (loading || inputValues === null) return <Base className="command-page" loading={true} />

  const command = data.command;

  const inputs = JSON.parse(command.inputSchema);

  return (
    <Base className="command-page">
      <h1>{command.name}</h1>

      <ReactMarkdown className="description">{command.description}</ReactMarkdown>

      <form>
        <div className="inputs">
          {inputs.map(input => (
            <div className="input" key={input.name}>
              <label htmlFor={input.name}>{input.name}</label>
              <div className="label">{input.label}</div>
              <input
                required={input.required}
                value={inputValues[input.name]}
                onChange={e => setInputValues({...inputValues, [input.name]: e.target.value})}
              />
            </div>
          ))}
        </div>

        <button type="submit" className="primary-button">Run Command</button>
      </form>
      
    </Base>
  );
};

CommandPage.propTypes = {
  
};

export default CommandPage;