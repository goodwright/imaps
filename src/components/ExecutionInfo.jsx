import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import tick from "../images/tick.svg";
import cross from "../images/cross.svg";
import moment from "moment";
import CommandCategory from "./CommandCategory";
import ReactMarkdown from "react-markdown";
import { ClipLoader } from "react-spinners";
const colors = require("tailwindcss/colors");
const imapsColors = require("../colors").colors;

const ExecutionInfo = props => {

  const { execution, editing } = props;

  const ok = execution.status !== "ER";

  return (
    <div className={props.className || ""}>
      <div className="flex items-start">
        <h1 className="flex-grow">{execution.name}</h1>
        {!execution.finished && (
          <ClipLoader color={execution.started ? imapsColors.primary[500] : colors.gray[400]} />
        )}
        {execution.finished && <div className={`text-white font-semibold flex text-xs w-max px-2 shadow py-1.5 cursor-default rounded ${ok ? "bg-green-400 border-green-500" : "bg-red-400"}`}>
          {ok ? "COMPLETE" : "ERROR"} <img src={ok ? tick : cross} alt="" className="ml-1.5 w-3.5" />
        </div>}
      </div>

      {execution.collection && (
        <div className="text-sm mb-1">
          <span>Collection:&nbsp;</span>
          {!editing && <Link to={`/collections/${execution.collection.id}/`}>{execution.collection.name}</Link>}
        </div>
      )}
      {execution.sample && (
        <div className="text-sm">
          <span>Sample:&nbsp;</span>
          {!editing && <Link to={`/samples/${execution.sample.id}/`}>{execution.sample.name}</Link>}
        </div>
      )}
      <div className={`sm:flex items-center font-light text-primary-100 text-xs sm:text-sm mt-1 mb-8`}>
        <div className={`mb-1 sm:mb-0  ${editing && "opacity-0"}`}>
          Created {moment(execution.created * 1000).format("D MMMM, YYYY")}
        </div>
        <div className={`hidden sm:block mx-2 ${editing && "opacity-0"}`}>|</div>
        <div className={editing && "opacity-0"}>
          Modified {moment(execution.lastModified * 1000).format("D MMMM, YYYY")}
        </div>
      </div>

      <div className="bg-gray-50 border pb-2 pt-0 sm:pb-3 sm:pt-0 md:pb-4 md:pt-0 shadow rounded max-w-2xl">
        <div className="text-xs bg-gray-100 font-bold text-primary-300 h-6 leading-3 flex items-center justify-center text-center border-b">COMMAND</div>
        <div className="flex items-start mt-2 px-4">
          <Link to={`/commands/${execution.command.id}`} className="block font-medium flex-grow">{execution.command.name}</Link>
          <CommandCategory category={execution.command.category} small={true} />
        </div>
        <div className="px-4 text-sm mb-2 text-primary-300 md:text-base">{execution.command.outputType}</div>
        <ReactMarkdown className="px-4 font-light text-xs md:text-sm">
          {execution.command.description}
        </ReactMarkdown>
      </div>
    </div>
  );
};

ExecutionInfo.propTypes = {
  execution: PropTypes.object.isRequired,
  editing: PropTypes.bool
};

export default ExecutionInfo;