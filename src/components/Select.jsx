import React from "react";
import { default as ReactSelect } from "react-select";
const colors = require("tailwindcss/colors");
const config = require("tailwindcss/defaultConfig");
const imapsColors = require("../colors").colors;

const Select = props => {

  const baseStyles = {
    // Main body
    control: (provided) => ({
      ...provided,
      boxShadow: null,
      backgroundColor: colors.coolGray[200],
      borderWidth: 0,
      height: "100%",
      cursor: "pointer",
      fontSize: config.theme.fontSize.sm[0]
    }),

    singleValue: (provided) => ({
      ...provided,
      color: imapsColors.primary[200]
    }),

    // Placeholder
    placeholder: (provided) => ({
      ...provided,
      color: imapsColors.primary[100]
    }),

    // Vertical line
    indicatorSeparator: (provided) => ({
      ...provided,
      width: 0
    }),

    // Down arrow
    dropdownIndicator: provided => ({
      ...provided,
      color: imapsColors.primary[500],
      "&:hover": {
        color: imapsColors.primary[200],
      }
    }),

    // Floating menu
    menu: provided => ({
      ...provided,
      overflow: "hidden"
    }),

    // Dropdown container of options
    menuList: provided => ({
      ...provided,
      backgroundColor: colors.coolGray[100],
    }),

    // Selectable Option
    option: (provided, state) => ({
      ...provided,
      cursor: "pointer",
      fontSize: config.theme.fontSize.sm[0],
      color: state.isFocused ? "white" : imapsColors.primary[200],
      height: config.theme.spacing[10],
      display: "flex",
      alignItems: "center",
      padding: `0 ${config.theme.spacing[3]}`,
      backgroundColor: state.isFocused ? imapsColors.primary[200] : colors.coolGray[100],
      "&:hover": {
        backgroundColor: imapsColors.primary[200],
        color: "white",
      },
      "&:active": {
        backgroundColor: imapsColors.primary[400],
        color: "white",
      }
    })
  }

  const keys = Object.keys(baseStyles).concat(Object.keys(props.styles || {}));

  const customStyles = keys.reduce((prev, key) => ({
    ...prev, [key]: (provided, state) => ({
      ...(key in baseStyles ? baseStyles[key](provided, state) : {}),
      ...(key in (props.styles || {}) ? props.styles[key](provided, state) : {}),
    })
  }), {})

  return <ReactSelect {...props} styles={customStyles} />;
};

Select.propTypes = {
  
};

export default Select;