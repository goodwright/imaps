import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import Toggle from "react-toggle";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { POSSIBLE_EXECUTIONS } from "../queries";
import ExecutionHistory from "../components/ExecutionHistory";
import { BarLoader } from "react-spinners";
import Paginator from "../components/Paginator";

const CommandInputs = props => {

  const { inputSchema, inputValues, setInputValues, collection } = props;
  const possibleExecutions = inputSchema.filter(input => input.type && input.type.includes("data:")).reduce(
    (prev, curr) => ({...prev, [curr.name]: {
      name: curr.name, page: 1, executions: null, limitToCollection: true,
      type: curr.type.slice(curr.type.indexOf("data:") + 5)
    }}), {}
  )
  const [executions, setExecutions] = useState(possibleExecutions);
  const PER_PAGE = 8;

  // From the current state, do any possible executions need to be loaded?
  let requiredData = null;
  if (executions) {
    const waitingInputs = Object.values(executions).filter(input => input.executions === null);
    if (waitingInputs.length) {
      requiredData = [waitingInputs[0].name, waitingInputs[0].type, waitingInputs[0].page, waitingInputs[0].limitToCollection]
    }
  }

  // Fetch possible executions if any are needed
  useQuery(POSSIBLE_EXECUTIONS, {
    skip: !requiredData,
    variables: requiredData && {
      dataType: requiredData[1],
      collection: requiredData[3] && collection ? collection.id : null,
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


  return (
    <div className="command-inputs">
      {inputSchema.map(input => {
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
                {collection && <div className="collection-checkbox">
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
          const parseFile = file => ({name: file.name, size: file.size})
          return (
            <div className="input" key={input.name}>
              <label htmlFor={input.name}>{input.name}</label>
              <div className="label">{input.label}</div>
              <input
                type="file"
                onChange={e => setInputValues({...inputValues, [input.name]: isMulti ? (
                  [...e.target.files].map(parseFile)
                ) : (
                  e.target.files.length ? parseFile(e.target.files[0]) : null
                )})}
                multiple={isMulti}
                accept={input.validate_regex || undefined}
                required={input.required}
                disabled={input.disabled}
              />
            </div>
          )
        }

        // Group input?
        if (!input.type && input.group) {
          return (
            <div className="input" key={input.name}>
              <label htmlFor={input.name}>{input.name}</label>
              <div className="label">{input.label}</div>
              <CommandInputs
                inputSchema={input.group}
                inputValues={inputValues[input.name]}
                setInputValues={inputs => setInputValues({...inputValues, [input.name]: inputs})}
                collection={collection}
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
    </div>
  );
};

CommandInputs.propTypes = {
  
};

export default CommandInputs;