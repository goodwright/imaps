import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Paginator from "./Paginator";
import moment from "moment";
import { duration } from "../utils";

const ExecutionHistory = props => {

  const { executions, useName } = props;
  const [offset, setOffset] = useState(1);
  console.log(offset)
  const PER_PAGE = 15;

  return (
    <div className="execution-history">

      {executions.length > PER_PAGE && <Paginator
        count={executions.length} itemsPerPage={PER_PAGE}
        currentPage={offset} onClick={setOffset}
      />}
      {executions.slice((offset - 1) * PER_PAGE, offset * PER_PAGE).map(execution => (
        <div className="execution" key={execution.id}>
          <Link to={`/executions/${execution.id}/`} className="name">{useName ? execution.name : execution.command.name}</Link>
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