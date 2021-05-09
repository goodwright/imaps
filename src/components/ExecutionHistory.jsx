import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import Paginator from "./Paginator";
import moment from "moment";

const ExecutionHistory = props => {

  const { executions, useName, searchable } = props;
  const [offset, setOffset] = useState(1);
  const [query, setQuery] = useState("");
  const history = useHistory();
  const PER_PAGE = 12;

  const filteredExecutions = query.length ? executions.filter(e => (
    e.command.name.toLowerCase().includes(query.toLowerCase()) ||
    e.owners.filter(u => u.name.toLowerCase().includes(query.toLowerCase())).length ||
    Object.entries(JSON.parse(e.input)).filter(i => `${i[0]}=${i[1]}`.toLowerCase().includes(query.toLowerCase())).length
  )) : executions;

  if (!executions.length) {
    return (
      <div className="execution-history">
        <div className="no-data">Currently no analysis.</div>
      </div>
    )
  }

  return (
    <div className="execution-history">

      {searchable && <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Filter expression"
      />}
      {filteredExecutions.length > PER_PAGE && <Paginator
        count={filteredExecutions.length} itemsPerPage={PER_PAGE}
        currentPage={offset} onClick={setOffset}
      />}
      <table>
        <thead>
          <tr>
            <th>{useName ? "Name" : "Command"}</th>
            <th>Date</th>
            <th>Owners</th>
            <th>Basic Parameters</th>
          </tr>
        </thead>
        <tbody>
          {filteredExecutions.slice((offset - 1) * PER_PAGE, offset * PER_PAGE).map(execution => {
            const basicSchema = JSON.parse(execution.command.inputSchema).filter(i => i.type && i.type.includes("basic:") && !i.type.includes("file")).map(i => i.name);
            const params = Object.entries(JSON.parse(execution.input)).filter(i => basicSchema.includes(i[0]));
            return (
              <tr key={execution.id} onClick={() => history.push(`/executions/${execution.id}/`)}>
                <td>{useName ? execution.name : execution.command.name}</td>
                <td>{moment(execution.created * 1000).format("D MMM YYYY")}</td>
                <td>{execution.owners.map(u => u.name).join(", ")}</td>
                <td>{params.map(input => `${input[0]}=${input[1]}`).join(", ")}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

ExecutionHistory.propTypes = {
  executions: PropTypes.array.isRequired,
  useName: PropTypes.bool
};

export default ExecutionHistory;