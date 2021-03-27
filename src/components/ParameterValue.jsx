import React from "react";
import PropTypes from "prop-types";
import { fileSize } from "../utils";
import { Link } from "react-router-dom";

const ParameterValue = props => {

  const { name, value, schema, dataLoc, executions } = props;

  if (schema.type && schema.type.slice(0, 5) === "list:") {
    return (
      <div className="parameter-value multi">
        {value.map((sub, n) => (
          <ParameterValue
            key={n} name={name} value={sub} dataLoc={dataLoc}
            schema={{...schema, type: schema.type.slice(5)}}
            executions={executions}
          />
        ))}
      </div>
    )
  }

  if (schema.type && schema.type === "basic:dir:") {
    return <div className="parameter-value">Directory</div>
  }

  if (schema.type && schema.type === "basic:json:") {
    return <div className="parameter-value">JSON</div>
  }

  if (schema.type && schema.type === "basic:secret:") {
    return <div className="parameter-value">***</div>
  }

  if (schema.type && schema.type === "basic:group") {
    return <div className="parameter-value">{Object.entries(value).map(kv => `${kv[0]}: ${kv[1]}`).join(", ")}</div>
  }

  if (Object.keys(schema).includes("group")) {
    return (
      <div className="parameter-value">
        {Object.entries(value).map(pair => (
          <div className="parameter">
            <div className="name">{pair[0]}</div>
            <ParameterValue
              name={pair[0]} value={pair[1]} dataLoc={dataLoc}
              executions={executions}
              schema={schema.group.filter(g => g.name === pair[0])[0]}
            />
          </div>
        ))}
      </div>
    )
  }

  if (schema.type && schema.type.slice(0, 5) === "data:") {
    const execution = executions[value];
    return (
      <div className="parameter-value">
        {execution ? <Link to={`/executions/${execution.id}/`}>{execution.name}</Link> : "-"}
      </div>
    )
  }

  if (schema.type && schema.type.slice(0, 11) === "basic:file:") {
    return (
      <div className="parameter-value">
        <a href={`https://imaps.genialis.com/data/${dataLoc}/${value.file}?force_download=1`}>{value.file}</a>
        <span className="size">{fileSize(value.size || value.total_size)}</span>
      </div>
    );
  }

  return (
    <div className="parameter-value">{value.toString()}</div>
  );
};

ParameterValue.propTypes = {
  
};

export default ParameterValue;