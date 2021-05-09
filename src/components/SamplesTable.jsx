import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import moment from "moment";
import ReactTooltip from "react-tooltip"
import Paginator from "./Paginator";
import tick from "../images/tick.svg";
import cross from "../images/cross.svg";

const SamplesTable = props => {
  const { samples } = props;
  const [offset, setOffset] = useState(1);
  const PER_PAGE = 20;
  const history = useHistory();

  if (!samples.length) {
    return (
      <div className="samples-table">
        <div className="no-data">Currently no samples.</div>
      </div>
    )
  }

  return (
    <div className="samples-table">
      {samples.length > PER_PAGE ? <Paginator
        count={samples.length} itemsPerPage={PER_PAGE}
        currentPage={offset} onClick={setOffset}
      /> : <div className="paginator" />}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Owners</th>
            <th>Source</th>
            <th>Organism</th>
            <th>Date</th>
            <th>QC</th>
          </tr>
        </thead>
        <tbody>
          {samples.slice((offset - 1) * PER_PAGE, offset * PER_PAGE).map(sample => (
            <tr key={sample.id} onClick={() => history.push(`/samples/${sample.id}/`)}>
              <td className="name">{sample.name}</td>
              <td className={sample.annotatorName ? "" : "centered"}>{sample.annotatorName || "-"}</td>
              <td className={sample.source ? "" : "centered"}>{sample.source || "-"}</td>
              <td className={sample.organism ? "organism" : "organism centered"}>{sample.organism || "-"}</td>
              <td>{moment(sample.created * 1000).format("MMM DD, YYYY")}</td>
              <td>
                {sample.qcPass === null ? "N/A" : sample.qcPass === true ? (
                  <>
                    <div className="quality-status pass" data-tip data-for={sample.id}>
                      QC <img src={tick} alt="pass" />
                    </div>
                    <ReactTooltip id={sample.id}>
                      <span>{sample.qcMessage}</span>
                    </ReactTooltip>
                  </>
                ) : (
                  <>
                    <div className="quality-status fail" data-tip data-for={sample.id}>
                      QC <img src={cross} alt="fail" />
                    </div>
                    <ReactTooltip id={sample.id}>
                      <span>{sample.qcMessage}</span>
                    </ReactTooltip>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

SamplesTable.propTypes = {
  samples: PropTypes.array.isRequired,
};

export default SamplesTable;