import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import Paginator from "./Paginator";
import moment from "moment";

const ExecutionHistory = props => {

  const { executions, useName, searchable, selected, setSelected } = props;
  const [offset, setOffset] = useState(1);
  const [query, setQuery] = useState("");
  const history = useHistory();
  const PER_PAGE = 12;

  const parseType = type => (type || "").split(":").filter(Boolean).filter(s => !["data", "list"].includes(s)).join(" / ");

  const filteredExecutions = query.length ? executions.filter(e => (
    e.command.name.toLowerCase().includes(query.toLowerCase()) ||
    parseType(e.command.type).toLowerCase().includes(query.toLowerCase()) ||
    Object.entries(JSON.parse(e.input)).filter(i => `${i[0]}=${i[1]}`.toLowerCase().includes(query.toLowerCase())).length
  )) : executions;

  const updateSelected = executionId => {
    if (Array.isArray(selected)) {
      if (selected.includes(executionId)) {
        setSelected(selected.filter(e => e !== executionId))
      } else {
        setSelected([...selected, executionId])
      }
    } else {
      if (selected === executionId) {
        setSelected(null)
      } else {
        setSelected(executionId)
      }
    }
  }

  if (!executions.length) {
    return (
      <div className="execution-history">
        {selected === undefined && <div className="no-data">Currently no analysis.</div>}
      </div>
    )
  }

  const pageCount = Math.ceil(filteredExecutions.length / PER_PAGE)
  const page = offset > pageCount ? pageCount : offset;

  return (
    <div className="execution-history">

      {searchable && <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Filter expression"
      />}
      {filteredExecutions.length > PER_PAGE && <Paginator
        count={filteredExecutions.length} itemsPerPage={PER_PAGE}
        currentPage={page} onClick={setOffset}
      />}
      <table>
        <thead>
          <tr>
            {selected !== undefined && <th></th>}
            <th>{useName ? "Name" : "Command"}</th>
            <th>Date</th>
            <th>Data Type</th>
            <th>Basic Parameters</th>
          </tr>
        </thead>
        <tbody>
          {filteredExecutions.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(execution => {
            const basicSchema = JSON.parse(execution.command.inputSchema).filter(i => i.type && i.type.includes("basic:") && !i.type.includes("file")).map(i => i.name);
            const params = Object.entries(JSON.parse(execution.input)).filter(i => basicSchema.includes(i[0]));
            return (
              <tr key={execution.id} onClick={selected !== undefined ? () => updateSelected(parseInt(execution.id)) : () => history.push(`/executions/${execution.id}/`)}>
                {selected !== undefined && (
                  <td>
                    <input
                      type="checkbox"
                      readOnly={true}
                      checked={Array.isArray(selected) ? selected.includes(parseInt(execution.id)) : selected === parseInt(execution.id)}
                    />
                  </td>
                )}
                <td>{useName ? execution.name : execution.command.name}</td>
                <td>{moment(execution.created * 1000).format("D MMM YYYY")}</td>
                <td>{parseType(execution.command.type)}</td>
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