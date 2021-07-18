import React from "react";
import PropTypes from "prop-types";
import fileIcon from "../images/file.svg";
import roundTo from "round-to";

const File = props => {

  const { name, size, execution } = props;

  const fileSize = bytes => {
    if (!bytes) return "";
    if (bytes < 10 ** 3) return `${bytes}B`;
    if (bytes < 10 ** 6) return `${(bytes / 10 ** 3).toPrecision(3)}KB`;
    if (bytes < 10 ** 9) return `${(bytes / 10 ** 6).toPrecision(3)}MB`;
    if (bytes < 10 ** 12) return `${(bytes / 10 ** 9).toPrecision(3)}GB`;
    return `${roundTo(bytes / 10 ** 12, 2)}TB`;
  }

  return (
    <div className="flex items-center text-sm">
      <img className="w-4 mr-1 opacity-70" src={fileIcon} alt="" />
      <div>
        <a href={`${process.env.REACT_APP_DATA}/${execution.id}/${name}`}>{name}</a>
        <span className="text-2xs pl-0.5">{fileSize(size)}</span>
      </div>
    </div>
  );
};

File.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  execution: PropTypes.object.isRequired
};

export default File;