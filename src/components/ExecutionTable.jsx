import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
import Paginator from "./Paginator";

const ExecutionTable = props => {

  const { executions } = props;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const rowCount = 10;

  const matching = query ? executions.filter(
    e => e.name.toLowerCase().includes(query.toLowerCase()) || e.command.outputType.toLowerCase().includes(query.toLowerCase())
  ) : executions;

  const pageCount = Math.ceil(matching.length / rowCount);
  const actualPage = page > pageCount ? pageCount : page;
  const visible = matching.slice((actualPage - 1) * rowCount, actualPage * rowCount);

  return (
    <div>
      <div className="grid gap-3 mb-2 ml-2 sm:flex">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Filter"
          className="border-b text-sm w-40 mr-3 h-8"
        />
        {pageCount > 1 && <Paginator
          currentPage={actualPage}
          totalPages={pageCount}
          onChange={setPage}
        />}
      </div>
      <div className="overflow-y-scroll mt-4">
        <table className="border-collapse border-0">
          <tbody>
            {visible.map(upload => (
              <tr key={upload.id} className="hover:bg-gray-100 border-0 text-xs">
                <Td id={upload.id} className="text-xs border-0 p-0 rounded-md rounded-r-none">{upload.name}</Td>
                <Td id={upload.id} className="whitespace-nowrap">{moment(upload.created * 1000).format("D MMM YYYY")}</Td>
                <Td className="rounded-md rounded-l-none" id={upload.id}>{upload.command.outputType}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Td = props => {
  return <td {...props}>
    <Link
      to={`/executions/${props.id}/`}
      className="h-8 whitespace-nowrap px-2 hover:no-underline flex w-full items-center text-primary-200"
    >{props.children}</Link>
  </td>
}

ExecutionTable.propTypes = {
  executions: PropTypes.object.isRequired
};

export default ExecutionTable;