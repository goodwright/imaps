import React from "react";
import PropTypes from "prop-types";
import File from "./File";
import { Link } from "react-router-dom";

const ExecutionSection = props => {

  const { heading, text, children, table, isFile, isLink, execution, lookup } = props;

  return (
    <div className="mb-8 pb-8 border-b">
      <h2 className="font-medium text-lg">{heading}</h2>
      <div className="font-light text-base mb-2">{text}</div>
      {table && (
        <table className="whitespace-nowrap">
          <tbody>
            {table.map(row => {
              const values = Array.isArray(row.value) ? row.value : [row.value]
              return (
                <tr key={row.name}>
                  <td className="font-mono text-xs items-center mr-1 text-right">{row.name}:</td>
                  {isFile && (
                    <td>
                      {values.map(file => <File key={file.file} name={file.file} size={file.size} execution={execution} />)}
                    </td>
                  )}
                  {isLink && (
                    <td>
                      {values.map(value => (
                        <Link key={value} className="flex text-sm font-medium" to={`/executions/${lookup[value].id}/`}>
                          {lookup[value].name}
                        </Link>
                      ))}
                    </td>
                  )}
                  {!isLink && !isFile && (
                    <td className="font-mono text-xs font-bold">
                      {values.map(v => v.toString()).join(", ")}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {children}
    </div>
  );
};

ExecutionSection.propTypes = {
  heading: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  table: PropTypes.array,
  isFile: PropTypes.bool,
  isLink: PropTypes.bool,
  execution: PropTypes.object,
  lookup: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default ExecutionSection;