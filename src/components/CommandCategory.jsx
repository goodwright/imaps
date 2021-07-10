import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

const CommandCategory = props => {

  const { category, small } = props;

  const categoryColor = {
    "process": "bg-blue-400",
    "import": "bg-pink-500",
    "internal-import": "bg-gray-500",
    "workflow": "bg-yellow-500",
  }[category];

  const categoryHelp = {
    "process": "A process command uses the outputs of previous commands as its inputs.",
    "import": "An import command is for uploading new data.",
    "internal-import": "An internal import command is used internally to prepare the products of demultiplxing.",
    "workflow": "A workflow is a series of other processes run one after the other.",
  }[category];

  return (
    <>
      <div className={`text-white w-max rounded ${small ? "text-xs md:text-sm" : "text-sm md:text-base"} px-2 py-0.5 cursor-default shadow ${categoryColor}`} data-tip data-for="category">
        {category}
      </div>
      <ReactTooltip id="category">{categoryHelp}</ReactTooltip>
    </>
  );
};

CommandCategory.propTypes = {
  category: PropTypes.string.isRequired,
  small: PropTypes.bool
};

export default CommandCategory;