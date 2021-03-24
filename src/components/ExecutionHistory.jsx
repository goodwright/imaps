import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { duration } from "../utils";

const ExecutionHistory = props => {

  const { executions } = props;

  return (
    <div className="execution-history">
      <h2>Analysis History</h2>
      <div className="executions">
        {executions.map(execution => (
          <div className="execution" key={execution.id}>
            <div className="process-name">{execution.process.name}</div>
            <div className="execution-time">
              <time>{moment((execution.started || execution.created) * 1000).format("DD MMM, YYYY")}</time>
              {execution.started && <span className="duration"> ({duration((execution.finished || (moment().unix() / 1000)) - execution.started)})</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ExecutionHistory.propTypes = {
  
};

export default ExecutionHistory;