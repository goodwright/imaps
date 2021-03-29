import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import { duration } from "../utils";

const ExecutionHistory = props => {

  const { executions, useName } = props;

  return (
    <div className="execution-history">
      {executions.map(execution => (
        <div className="execution" key={execution.id}>
          <Link to={`/executions/${execution.id}/`} className="name">{useName ? execution.name : execution.process.name}</Link>
          <div className="execution-time">
            <time>{moment((execution.started || execution.created) * 1000).format("DD MMM, YYYY")}</time>
            {execution.started && <span className="duration"> ({duration((execution.finished || (moment().unix() / 1000)) - execution.started)})</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

ExecutionHistory.propTypes = {
  
};

export default ExecutionHistory;