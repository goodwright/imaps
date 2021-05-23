import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { useLazyQuery, useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import ReactMarkdown from "react-markdown";
import Toggle from "react-toggle";
import Select from "react-select";
import { COMMAND, COLLECTION_DATA } from "../queries";
import { detect404 } from "../forms";
import PageNotFound from "./PageNotFound";
import Base from "./Base";

const CommandPage = () => {

  const commandId = useRouteMatch("/commands/:id").params.id;

  const [inputValues, setInputValues] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  console.log(inputValues)

  const { loading, data, error } = useQuery(COMMAND, {
    variables: {id: commandId},
    onCompleted: data => setInputValues(JSON.parse(data.command.inputSchema).reduce(
      (prev, curr) => ({...prev, [curr.name]: (curr.default === undefined ? (
        curr.type && curr.type.slice(0, 5) === "list:" ? [] : ""
      ) : curr.default)}), {}
    ))
  });

  const [getCollection, collectionQuery] = useLazyQuery(COLLECTION_DATA);

  useEffect(() => {
    if (selectedCollection) getCollection({variables: {id: selectedCollection}})
  }, [selectedCollection])

  useDocumentTitle(data ? `iMaps - ${data.command.name}` : "iMaps");

  if (detect404(error)) return <PageNotFound />

  if (loading || inputValues === null) return <Base className="command-page" loading={true} />

  const command = data.command;

  const inputs = JSON.parse(command.inputSchema);
  
  const collectionOptions = data.user.ownedCollections.map(collection => ({
    label: collection.name, value: collection.id
  }))

  return (
    <Base className="command-page">
      <h1>{command.name}</h1>

      <ReactMarkdown className="description">{command.description}</ReactMarkdown>

      <Select
        options={collectionOptions}
        value={collectionOptions.filter(c => c.value === selectedCollection)[0]}
        onChange={({value}) => setSelectedCollection(value)}
        placeholder="Select a collection..."
        className="react-select"
        classNamePrefix="react-select"
      />

      <form>
        <div className="inputs">
          {inputs.map(input => {
            if (!input.type) {
              return (
                <div className="input" key={input.name}>
                  <label htmlFor={input.name}>{input.name}</label>
                  <div className="label">{input.label}</div>
                  <div>Not yet implemented</div>
                </div>
              )
            }
            if (input.type.includes("data:")) {
              const type = input.type.slice(input.type.indexOf("data:") + 5);
              const options = collectionQuery.data ? collectionQuery.data.collection.executions.filter(
                execution => execution.command.type.includes(`data:${type}`)
              ).map(execution => ({
                label: execution.name, value: execution.id
              })) : [];
              return (
                <div className="input" key={input.name}>
                  <label htmlFor={input.name}>{input.name}</label>
                  <div className="label">{input.label}</div>
                  <Select
                    options={options}
                    value={options.filter(c => c.value === inputValues[input.name])[0]}
                    onChange={({value}) => setInputValues({...inputValues, [input.name]: value})}
                    isMulti={input.type && input.type.slice(0, 5) === "list:"}
                    placeholder="Select a ..."
                    isDisabled={!collectionQuery.data}
                    className="react-select"
                    classNamePrefix="react-select"
                  />
                </div>
                
              )
            }
            if (input.type.includes("basic:boolean")) {
              return (
                <div className="input" key={input.name}>
                  <label htmlFor={input.name}>{input.name}</label>
                  <div className="label">{input.label}</div>
                  <div className="binary-toggle">
                    <label>false</label>
                    <Toggle
                      checked={inputValues[input.name]}
                      onChange={() => setInputValues({...inputValues, [input.name]: !inputValues[input.name]})}
                      icons={false}
                    />
                    <label>true</label>
                  </div>
                </div>
              )
            }
            const type = (
              input.type.includes("integer") || input.type.includes("decimal")
            ) ? "number" : (
              input.type.includes("basic:file")
            ) ? "file" : "text";

            if (type === "file") {
              const isMulti = input.type.slice(0, 5) === "list:";
              return (
                <div className="input" key={input.name}>
                  <label htmlFor={input.name}>{input.name}</label>
                  <div className="label">{input.label}</div>
                  <input
                    required={input.required}
                    //value={inputValues[input.name]}
                    multiple={isMulti}
                    type="file"
                    onChange={e => setInputValues({...inputValues, [input.name]: isMulti ? e.target.files : e.target.files[0]})}
                  />
                </div>
              )
            }
            
            return (
              <div className="input" key={input.name}>
                <label htmlFor={input.name}>{input.name}</label>
                <div className="label">{input.label}</div>
                <input
                  required={input.required}
                  value={inputValues[input.name]}
                  multiple={input.type && input.type.slice(0, 5) === "list:"}
                  type={type}
                  onChange={e => setInputValues({...inputValues, [input.name]: e.target.value})}
                />
              </div>
            )
          })}
        </div>

        <button type="submit" className="primary-button">Run Command</button>
      </form>
      
    </Base>
  );
};

CommandPage.propTypes = {
  
};

export default CommandPage;