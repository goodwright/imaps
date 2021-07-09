import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { ClipLoader } from "react-spinners";
import cross from "../images/red-cross.svg";
import warning from "../images/warning.svg";
const colors = require("tailwindcss/colors");
const imapsColors = require("../colors").colors;

const ExecutionProcess = props => {

  const { execution } = props;

  const timeClass = "bg-gray-100 w-max border px-2 py-2 rounded text-sm text-primary-300";
  const boxClass = "inline-flex items-center px-4 py-5 text-base rounded border-b-2 w-100 mb-3 mr-5 mb-5";
  const imgClass = "w-10 mr-4";
  const boxHeadingClass = "text-red-900 font-medium text-lg";
  const messageClass = "text-xs";

  if (!execution.started) {
    return (
      <div className="flex items-center text-primary-200">
        <ClipLoader color={colors.gray[400]} />
        <div className="ml-2 text-base">This job is currently in the queue, and has been for {moment(execution.created * 1000).fromNow(true)}.</div>
      </div>
    )
  }

  if (!execution.finished) {
    return (
      <div>
        <div className="flex items-center text-primary-400 mb-2">
          <ClipLoader color={imapsColors.primary[500]} />
          <div className="ml-2 text-base">This job is currently running, and has been for {moment(execution.started * 1000).fromNow(true)}.</div>
        </div>
        <div className="flex items-center w-100 justify-between">
          <div className={timeClass}>
            {moment(execution.started * 1000).format("HH:mm, D MMM YYYY")}
          </div>
          <div className="h-2 flex-grow bg-gradient-to-r from-gray-100 to-white border-t border-b -ml-px" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center w-100 justify-between">
        <div className={timeClass}>
          {moment(execution.started * 1000).format("HH:mm, D MMM YYYY")}
        </div>
        <div className="flex-grow text-xs relative font-medium text-primary-400 z-50">
          <div className="absolute w-full text-center -top-4">
            {moment.duration(moment(execution.finished * 1000) - moment(execution.started * 1000), "milliseconds").humanize(false)}
          </div>
          <div className="h-2 w-full bg-gray-100 border-t border-b -ml-px" />
        </div>
        <div className={`${timeClass} -ml-0.5`}>
          {moment(execution.finished * 1000).format("HH:mm, D MMM YYYY")}
        </div>
      </div>


      <div className="flex mt-5 flex-wrap -mr-5">
        {execution.error && (
          <div className={`${boxClass} bg-red-200 text-red-800 border-red-300`}>
            <img src={cross} className={imgClass} alt="" />
            <div>
              <div className={`${boxHeadingClass} text-red-900`}>Error</div>
              <div className={`${messageClass} text-red-500`}>{execution.error}</div>
            </div>
          </div>
        )}
        {execution.warning && (
          <div className={`${boxClass} bg-yellow-200 border-yellow-300`}>
            <img src={warning} className={imgClass} alt="" />
            <div>
              <div className={`${boxHeadingClass} text-yellow-900`}>Warning</div>
              <div className={`${messageClass} text-yellow-600`}>{execution.warning}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ExecutionProcess.propTypes = {
  execution: PropTypes.object.isRequired
};

export default ExecutionProcess;