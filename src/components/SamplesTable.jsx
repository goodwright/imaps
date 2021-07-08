import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import ReactTooltip from "react-tooltip"
import Paginator from "./Paginator";
import tick from "../images/tick.svg";
import cross from "../images/cross.svg";
import { Link } from "react-router-dom";

const SamplesTable = props => {

  const { samples, noMessage } = props;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const rowCount = 10;

  const fitsOnOnePage = Math.ceil(samples.length / rowCount) === 1;

  const matching = query ? samples.filter(
    e => e.name.toLowerCase().includes(query.toLowerCase())
  ) : samples;

  const pageCount = Math.ceil(matching.length / rowCount);
  const actualPage = page > pageCount ? pageCount : page;
  const visible = matching.slice((actualPage - 1) * rowCount, actualPage * rowCount);

  if (samples.length === 0) {
    return <p className="font-light text-base">{noMessage}</p>
  }

  return (
    <div>
      {!fitsOnOnePage && <div className="grid gap-3 mb-2 sm:flex mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Filter"
          className="border-b text-sm w-40 mr-3 h-8"
        />
        <Paginator
          currentPage={actualPage}
          totalPages={pageCount}
          onChange={setPage}
        />
      </div>}

      <div className="overflow-y-scroll rounded-md w-max max-w-full shadow">
        <table className="border-collapse border-0 overflow-hidden">
          <tbody>
            {visible.map((sample, index) => (
              <tr key={sample.id} className={`bg-gray-100 ${index % 2 ? "bg-opacity-40" : "bg-opacity-90"} border-0 text-xs hover:bg-gray-200`}>
                <Td id={sample.id} className="text-xs border-0 p-0">{sample.name}</Td>
                <Td id={sample.id} className="">{sample.source || "-"}</Td>
                <Td id={sample.id} className="italic">{sample.organism || "-"}</Td>
                <Td id={sample.id} className="whitespace-nowrap">{moment(sample.created * 1000).format("D MMM YYYY")}</Td>
                <Td id={sample.id} className="w-max">
                  {sample.qcPass === null && "N/A"}
                  {sample.qcPass !== null && (
                    <div
                      data-tip data-for={sample.id}
                      className={`${sample.qcPass ? "bg-green-500" : "bg-red-700"} bg-opacity-80 w-max flex text-white rounded-sm px-1 py-0.5`}
                    >
                      QC <img src={sample.qcPass ? tick : cross} alt="" className="ml-2" />
                    </div>
                  )}
                  <ReactTooltip id={sample.id}>{sample.qcMessage}</ReactTooltip>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
};

const Td = props => {
  return <td {...props}>
    <Link
      to={`/samples/${props.id}/`}
      className="h-9 whitespace-nowrap px-3 hover:no-underline flex w-full items-center text-primary-200"
    >{props.children}</Link>
  </td>
}

SamplesTable.propTypes = {
  samples: PropTypes.array.isRequired,
  noMessage: PropTypes.string
};

export default SamplesTable;