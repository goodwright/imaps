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

const CommandPage = () => {

  const commandId = useRouteMatch("/commands/:id").params.id;

  const [inputValues, setInputValues] = useState(null);
  const [executions, setExecutions] = useState(null);
  console.log(inputValues)

  const history = useHistory();
  const PER_PAGE = 8;

  // Has a collection been specified?
  const params = new URLSearchParams(useLocation().search);
  const collectionId = params.get("collection");

  // From the current state, do any possible executions need to be loaded?
  let requiredData = null;
  if (executions) {
    const waitingInputs = Object.values(executions).filter(input => input.executions === null);
    if (waitingInputs.length) {
      requiredData = [waitingInputs[0].name, waitingInputs[0].type, waitingInputs[0].page, waitingInputs[0].limitToCollection]
    }
  }

  // Get the command
  const { loading, data, error } = useQuery(COMMAND, {
    variables: {id: commandId},
    onCompleted: data => {
      // Parse JSON
      const inputSchema = JSON.parse(data.command.inputSchema);

      // Create the initial inputs object
      setInputValues(inputSchema.reduce(
        (prev, curr) => ({...prev, [curr.name]: (curr.default === undefined ? (
          curr.type && curr.type.slice(0, 5) === "list:" ? [] : (
            curr.type && curr.type.slice(0, 5) === "data:"
          ) ? null : (
            curr.type && curr.type === "basic:boolean:"
          ) ? false : ""
        ) : curr.default)}), {}
      ))

      // Create the executions object
      setExecutions(inputSchema.filter(input => input.type && input.type.includes("data:")).reduce(
        (prev, curr) => ({...prev, [curr.name]: {
          name: curr.name, page: 1, executions: null, limitToCollection: true,
          type: curr.type.slice(curr.type.indexOf("data:") + 5)
        }}), {}
      ))      
    }
  });

  // Get collection if required
  const collectionQuery = useQuery(COLLECTION, {
    skip: loading || !collectionId,
    variables: {id: collectionId}
  })

  // Fetch possible executions if any are needed
  useQuery(POSSIBLE_EXECUTIONS, {
    skip: !requiredData,
    variables: requiredData && {
      dataType: requiredData[1],
      collection: requiredData[3] ? collectionId : null,
      first: PER_PAGE * requiredData[2],
      last: PER_PAGE
    },
    onCompleted: data => {
      setExecutions({...executions, [requiredData[0]]: {
        ...executions[requiredData[0]],
        executions: data.executions
      }})
    }
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
  const canShowForm = inputValues && executions && (!collectionId || collectionQuery.data);

  return (
    <Base className="command-page">
      <h1>{command.name}</h1>
      <ReactMarkdown className="description">{command.description}</ReactMarkdown>

      {!collectionId && <div className="no-collection">No collection specified.</div>}
      {collection && <div className="collection">{collection.name}</div>}

      {canShowForm && (
        <form>
          {JSON.parse(command.inputSchema).map(input => {
            // Data input?
            if (input.type && input.type.includes("data:")) {
              if (!executions[input.name].executions) {
                return (
                  <div className="input" key={input.name}>
                    <label htmlFor={input.name}>{input.name}</label>
                    <div className="label">{input.label}</div>
                    <BarLoader color="#6353C6" css="margin-top: 16px" />
                  </div>
                )
              } else {
                return (
                  <div className="input" key={input.name}>
                    <label htmlFor={input.name}>{input.name}</label>
                    <div className="label">{input.label}</div>
                    {collectionId && <div className="collection-checkbox">
                      <input
                        type="checkbox"
                        checked={executions[input.name].limitToCollection}
                        onChange={() => setExecutions({...executions, [input.name]: {
                          ...executions[input.name],
                          executions: null,
                          page: 1,
                          limitToCollection: !executions[input.name].limitToCollection
                        }})}
                      />
                      <label>Limit options to collection</label>
                    </div>}
                    {executions[input.name].executions.count > PER_PAGE && (
                      <Paginator
                        count={executions[input.name].executions.count}
                        currentPage={executions[input.name].page}
                        itemsPerPage={PER_PAGE}
                        onClick={page => setExecutions({...executions, [input.name]: {
                          ...executions[input.name],
                          executions: null,
                          page
                        }})}
                      />
                    )}
                    <ExecutionHistory
                      executions={executions[input.name].executions.edges.map(edge => edge.node)}
                      selected={inputValues[input.name]}
                      setSelected={value => setInputValues({...inputValues, [input.name]: value})}
                    />
                    {executions[input.name].executions.count === 0 && (
                      <div className="no-data">No data of the correct type available.</div>
                    )}
                  </div>
                )
              }
            }

            // Boolean input?
            if (input.type && input.type === "basic:boolean:") {
              return (
                <div className="input" key={input.name}>
                  <label htmlFor={input.name}>{input.name}</label>
                  <div className="label">{input.label}</div>
                  <div className="binary-toggle">
                    <label className={inputValues[input.name] ? "" : "selected"}>false</label>
                    <Toggle
                      checked={inputValues[input.name]}
                      onChange={() => setInputValues({...inputValues, [input.name]: !inputValues[input.name]})}
                      icons={false}
                      disabled={input.disabled}
                    />
                    <label className={!inputValues[input.name] ? "" : "selected"}>true</label>
                  </div>
                </div>
              )
            }

            // String input?
            if (input.type && (input.type.includes("string:") || input.type.includes("text:"))) {
              console.log(input)
              // List of strings
              if (input.type.slice(0, 5) === "list:") {
                return (
                  <div className="input" key={input.name}>
                    <label htmlFor={input.name}>{input.name}</label>
                    <div className="label">{input.label}</div>
                    <Creatable
                      isMulti={true}
                      value={inputValues[input.name].map(s => ({label: s, value: s}))}
                      onChange={values => setInputValues({...inputValues, [input.name]: (
                        values ? values.map(value => value.value) : []
                      )})}
                      noOptionsMessage={() => ""}
                      formatCreateLabel={label => label}
                      placeholder={input.placeholder || ""}
                      className="react-select"
                      classNamePrefix="react-select"
                    />
                  </div>
                )
              // Choices, can create
              } else if (input.choices && input.allow_custom_choice) {
                return (
                  <div className="input" key={input.name}>
                    <label htmlFor={input.name}>{input.name}</label>
                    <div className="label">{input.label}</div>
                    <Creatable
                      options={input.choices}
                      onChange={value => setInputValues({...inputValues, [input.name]: (
                        value.value
                      )})}
                      isDisabled={input.disabled}
                      placeholder={input.placeholder || ""}
                      className="react-select"
                      classNamePrefix="react-select"
                    />
                  </div>
                )
              // Choices, can't create
              } else if (input.choices) {
                return (
                  <div className="input" key={input.name}>
                    <label htmlFor={input.name}>{input.name}</label>
                    <div className="label">{input.label}</div>
                    <Select
                      options={input.choices}
                      onChange={value => setInputValues({...inputValues, [input.name]: (
                        value.value
                      )})}
                      placeholder={input.placeholder || ""}
                      isDisabled={input.disabled}
                      className="react-select"
                      classNamePrefix="react-select"
                    />
                  </div>
                )
              // Free text
              } else {
                return (
                  <div className="input" key={input.name}>
                    <label htmlFor={input.name}>{input.name}</label>
                    <div className="label">{input.label}</div>
                    <input
                      value={inputValues[input.name]}
                      onChange={e => setInputValues({...inputValues, [input.name]: e.target.value})}
                      required={input.required}
                      disabled={input.disabled}
                    />
                  </div>
                )
              }
            }

            // Numeric input?
            if (input.type && (input.type.includes("integer:") || input.type.includes("decimal:"))) {
              const parse = input.type.includes("integer:") ? parseInt : parseFloat
              return (
                <div className="input" key={input.name}>
                  <label htmlFor={input.name}>{input.name}</label>
                  <div className="label">{input.label}</div>
                  <input
                    type="number"
                    value={inputValues[input.name]}
                    onChange={e => setInputValues({...inputValues, [input.name]: parse(e.target.value)})}
                    min={input.range ? input.range[0] : null}
                    max={input.range ? input.range[1] : null}
                    required={input.required}
                    disabled={input.disabled}
                  />
                </div>
              )
            }

            // File input?
            if (input.type && input.type.includes("file:")) {
              const isMulti = input.type.slice(0, 5) === "list:";
              return (
                <div className="input" key={input.name}>
                  <label htmlFor={input.name}>{input.name}</label>
                  <div className="label">{input.label}</div>
                  <input
                    type="file"
                    onChange={e => setInputValues({...inputValues, [input.name]: isMulti ? (
                      [...e.target.files]
                    ) : (
                      e.target.files.length ? e.target.files[0] : null
                    )})}
                    multiple={isMulti}
                    accept={input.validate_regex || undefined}
                    required={input.required}
                    disabled={input.disabled}
                  />
                </div>
              )
            }

            // Return not implemented
            return (
              <div className="input" key={input.name}>
                <label htmlFor={input.name}>{input.name}</label>
                <div className="label">{input.label}</div>
                <div>Not yet implemented</div>
              </div>
            )
          })}
        </form>
      )}

    </Base>
  )
};

CommandPage.propTypes = {
  
};

export default CommandPage;