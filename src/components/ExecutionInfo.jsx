import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import CommandCategory from "./CommandCategory";
import ReactMarkdown from "react-markdown";

const ExecutionInfo = props => {

  const { execution, editing } = props;

  return (
    <div>
      <div className="flex items-start">
        <h1 className="flex-grow">{execution.name}</h1>
        <CommandCategory category={execution.command.category} />
      </div>

      {execution.collection && (
        <div className="text-sm">
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
        <Link to={`/commands/${execution.command.id}`} className="px-4 mt-2 block font-medium">{execution.command.name}</Link>
        <div className="px-4 text-sm mb-2 text-primary-300 md:text-base">{execution.command.outputType}</div>
        <ReactMarkdown className="px-4 font-light text-xs md:text-sm">
          {execution.command.description}
        </ReactMarkdown>
      </div>
    </div>
  );
};

ExecutionInfo.propTypes = {
  
};

export default ExecutionInfo;