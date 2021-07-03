import React from "react";
import { default as ReactSelect } from "react-select";
const colors = require("tailwindcss/colors");
const imapsColors = require("../colors").colors;

const Select = props => {

  const baseStyles = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: null,
      borderColor: colors.gray[200],
      backgroundColor: colors.gray[200],
      cursor: "text",
      borderBottomLeftRadius: state.menuIsOpen ? 0 : null,
      borderBottomRightRadius: state.menuIsOpen ? 0 : null,
      borderBottomWidth: state.menuIsOpen ? 0 : 1,
      paddingBottom: state.menuIsOpen ? 1 : 0,
      "&:hover": {
        borderColor: colors.gray[200]
      }
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: "pointer",
      backgroundColor: state.isFocused ? colors.gray[100] : null,
      "&:active": {
        backgroundColor: colors.gray[100]
      }
    }),
    menu: provided => ({
      ...provided,
      marginTop: 0,
      borderWidth: 0,
      borderColor: colors.gray[200],
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderTopWidth: 0,
      left: 0,
      backgroundColor: colors.gray[200],
      boxShadow: null,
    }),
    multiValue: provided => ({
      borderWidth: 1,
      borderColor: colors.gray[300],
      backgroundColor: colors.gray[100],
      borderRadius: 6,
      display: "flex"
    }),
    multiValueRemove: provided => ({
      ...provided,
      cursor: "pointer",
      "&:hover": {
        backgroundColor: colors.red[100]
      }
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: imapsColors.primary[500]
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