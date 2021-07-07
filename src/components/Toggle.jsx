import React from "react";
import PropTypes from "prop-types";
import { default as ReactToggle } from "react-toggle";
import "react-toggle/style.css";
import "../toggle.css";

const Toggle = props => {

  const { trueLabel, falseLabel } = props;

  const toggleProps = {...props};
  delete toggleProps.falseLabel;
  delete toggleProps.trueLabel;
  delete toggleProps.className;

  return (
    <div className={`grid grid-cols-max cursor-pointer text-sm items-center z-50 ${props.className || ""}`}>
      <div
        className={`w-max font-semibold pr-1 ${props.checked ? "text-primary-500" : "text-gray-400"}`}
        onClick={() => props.onChange({target: {checked: true}})}
      >{trueLabel}</div>
      <ReactToggle {...toggleProps} icons={false} />
      <div
        className={`w-max font-semibold pl-1 ${props.checked ? "text-gray-400" : "text-primary-500"}`}
        onClick={() => props.onChange({target: {checked: false}})}
      >{falseLabel}</div>
    </div>
  )
};

Toggle.propTypes = {
  trueLabel: PropTypes.string,
  falseLabel: PropTypes.string,
};

export default Toggle;