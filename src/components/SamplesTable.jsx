import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import moment from "moment";
import Paginator from "./Paginator";
import tick from "../images/tick.svg";
import cross from "../images/cross.svg";

const SamplesTable = props => {
  const { samples, sampleCount, itemsPerPage, currentPage, setPageNumber } = props;
  const history = useHistory();

  return (
    <div className="samples-table">
      {sampleCount > itemsPerPage && (
        <Paginator
          count={sampleCount} itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onClick={setPageNumber}
        />
      )}
      <table>
        <tbody>
          {samples.map(sample => (
            <tr key={sample.id} onClick={() => history.push(`/samples/${sample.id}/`)}>
              <td className="name">{sample.name}</td>
              <td className={sample.annotatorName ? "" : "centered"}>{sample.annotatorName || "-"}</td>
              <td className={sample.source ? "" : "centered"}>{sample.source || "-"}</td>
              <td className={sample.organism ? "organism" : "organism centered"}>{sample.organism || "-"}</td>
              <td>{moment(sample.creationTime * 1000).format("MMM DD, YYYY")}</td>
              <td>
                {sample.qcPass === null ? "N/A" : sample.qcPass === true ? (
                  <div className="quality-status pass">
                    QC <img src={tick} alt="pass" />
                  </div>
                ) : (
                  <div className="quality-status fail">
                    QC <img src={cross} alt="fail" />
                  </div>
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
  
};

export default SamplesTable;