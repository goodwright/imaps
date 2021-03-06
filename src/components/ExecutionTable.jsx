import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
import Paginator from "./Paginator";

const ExecutionTable = props => {

  const { executions, noMessage, showCategory, pageLength, network } = props;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const rowCount = 10;

  if (executions.length === 0) {
    return <p className="font-light text-base">{noMessage}</p>
  }

  const networkPageCount = network ? Math.ceil(network[1] / pageLength) : null;

  const fitsOnOnePage = network ? networkPageCount === 1 : Math.ceil(executions.length / rowCount) === 1;

  const matching = query ? executions.filter(
    e => e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.command.outputType.toLowerCase().includes(query.toLowerCase()) ||
    e.command.name.toLowerCase().includes(query.toLowerCase())
  ) : executions;

  const pageCount = network ? networkPageCount : Math.ceil(matching.length / rowCount);
  const actualPage = network ? network[0] : page > pageCount ? pageCount : page;
  const visible = network ? executions : matching.slice((actualPage - 1) * rowCount, actualPage * rowCount);

  return (
    <div className={props.className || ""}>
      {!fitsOnOnePage && <div className="grid gap-3 mb-2 sm:flex mb-4">
        {!network && <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Filter"
          className="border-b text-sm w-40 mr-3 h-8 bg-transparent"
        />}
        <Paginator
          currentPage={actualPage}
          totalPages={pageCount}
          onChange={network ? network[2] : setPage}
        />
      </div>}
      <div className="overflow-y-scroll rounded-md w-max max-w-full shadow">
        <table className="border-collapse border-0 overflow-hidden">
          <tbody>
            {visible.map((upload, index) => (
              <tr key={upload.id} className={`bg-gray-100 ${index % 2 ? "bg-opacity-40" : "bg-opacity-90"} border-0 text-xs hover:bg-gray-200`}>
                <Td id={upload.id} className="text-xs border-0 p-0">{upload.name}</Td>
                <Td id={upload.id} className="whitespace-nowrap">{moment(upload.created * 1000).format("D MMM YYYY")}</Td>
                <Td id={upload.id} className="">{upload.command.name}</Td>
                {showCategory && <Td className="" id={upload.id}>{upload.command.category}</Td>}
                <Td className="" id={upload.id}>{upload.command.outputType}</Td>
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
      className="h-9 whitespace-nowrap px-3 hover:no-underline flex w-full items-center text-primary-200"
    >{props.children}</Link>
  </td>
}

ExecutionTable.propTypes = {
  executions: PropTypes.array.isRequired
};

export default ExecutionTable;