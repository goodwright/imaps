import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import tick from "../images/tick.svg";
import cross from "../images/cross.svg";

const SampleInfo = props => {

  const { sample } = props;

  const canBreak = !sample.name.includes(" ");

  return (
    <div className="sample-info">
      <div className="left-column">
        <h1 className={canBreak ? "can-break" : ""}>{sample.name}</h1>
        <Link className="collection" to={`/collections/${sample.collection.id}/`}>{sample.collection.name}</Link>

        <table>
          <tbody>
            <tr>
              <th>Annotator:</th>
              <td>{sample.annotatorName || "N/A"}</td>
              <th>Organism:</th>
              <td>{sample.organism || "N/A"}</td>
            </tr>
            <tr>
              <th>PI:</th>
              <td>{sample.piName || "N/A"}</td>
              <th>Source:</th>
              <td>{sample.source || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="right-column">
        {sample.qcPass !== null && sample.qcPass === true && (
          <div className="quality-status pass">
            QC <img src={tick} alt="pass" />
          </div>
        )}
        {sample.qcPass !== null && sample.qcPass === false && (
          <div className="quality-status fail">
            QC <img src={cross} alt="fail" />
          </div>
        )}

        {sample.qcMessage && (
          <div className="qc-message">{sample.qcMessage.replace(/\.$/, "").split("; ").map((s, i) => (
            <div key={i}>{s}</div>
          ))}</div>
        )}

        <div className="dates">
          <div className="created" data-tip data-for="creation">
            Created <time>{moment(sample.creationTime * 1000).format("DD MMM, YYYY")}</time>
          </div>
          <ReactTooltip id="creation">
            <span>{moment(sample.creationTime * 1000).format("DD MMMM YYYY - HH:mm UTC")}</span>
          </ReactTooltip>
          <div className="modified" data-tip data-for="modified">
            Modified <time>{moment(sample.lastModified * 1000).format("DD MMM, YYYY")}</time>
          </div>
          <ReactTooltip id="modified">
            <span>{moment(sample.lastModified * 1000).format("DD MMMM YYYY - HH:mm UTC")}</span>
          </ReactTooltip>
        </div>
      </div>


    </div>
  );
};

SampleInfo.propTypes = {
  
};

export default SampleInfo;