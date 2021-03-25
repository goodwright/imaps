import React from "react";
import PropTypes from "prop-types";
import { fileSize } from "../utils";

const ParameterValue = props => {

  const { name, value, schema, dataLoc } = props;
  console.log(name)
  console.log(value)
  console.log(schema)
  console.log("")

  if (schema.type && schema.type.slice(0, 5) === "list:") {
    return (
      <div className="parameter-value multi">
        {value.map((sub, n) => (
          <ParameterValue
            key={n} name={name} value={sub} dataLoc={dataLoc}
            schema={{...schema, type: schema.type.slice(5)}}
          />
        ))}
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