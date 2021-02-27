import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BarLoader from "react-spinners/BarLoader";
import ReactTooltip from "react-tooltip";
import { getApiLocation } from "../api";
import { Link } from "react-router-dom";
import roundTo from "round-to";

const PekaRbp = props => {

  const { rbp } = props;

  const [data, setData] = useState(null);
  const [tooltip, setTooltip] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    fetch(
      getApiLocation().replace("graphql", `peka/rbp?name=${rbp}`)
    ).then(resp => resp.json()).then(json => {
      setData(json);
    })
  }, [])

  const tableHover = e => {
    setTooltip(`${e.target.dataset.motif}: ${e.target.dataset.offset}\n${e.target.dataset.value}`)
  }

  const scoreHover = e => {
    setScore (`${e.target.dataset.motif}\n${e.target.dataset.value}`)
  }

  if (!data) return <BarLoader color="#6353C6" />

  return (
    <div className="peka-rbp">
      <h2>{rbp}</h2>
      <p className="peka-sub-text">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam asperiores, dolore consectetur incidunt perspiciatis beatae? <Link to="/apps/peka/">Back to Heatmap</Link>
      </p>
      <div className="graphic">
        <div className="table">
            <div className="row">{data.rbp_heatmap.columns.map(offset => <div className="offset cell" key={offset}>{offset}</div>)}</div>
            {data.rbp_heatmap.matrix.map((row, i) => (
              <div className="row" key={i}>
                <div className="motif cell">{data.rbp_heatmap.rows[i]}</div>
                {row.map((cell, c) => (
                  <div
                    style={{
                      backgroundColor: cell.color,
                      borderTop: data.rbp_heatmap.hlines.line_positions.includes(i) && c >= data.rbp_heatmap.hlines.line_start_end[0] && c <= data.rbp_heatmap.hlines.line_start_end[1] ? `1px solid ${data.rbp_heatmap.hlines.colors}` : "none"
                    }}
                    className={data.rbp_heatmap.columns[c] === 0 ? "center cell" : "cell"}
                    data-value={roundTo(cell.value, 2)}
                    data-motif={data.rbp_heatmap.rows[i]}
                    data-offset={data.rbp_heatmap.columns[c]}
                    onMouseMove={tableHover}
                    data-tip data-for="tableTooltip"
                    key={c}
                  />
                ))}
              </div>
            ))}
        </div>
        
        <div className="scores">
          {data.PEKA_score_heatmap.matrix.map((cell, i) => (
            <div
              className="score" style={{backgroundColor: cell[0].color}}
              data-tip data-for="scoreTooltip"
              data-motif={data.PEKA_score_heatmap.rows[i]}
              data-value={roundTo(cell[0].value, 2)}
              onMouseMove={scoreHover}
              key={i}
            />
          ))}
        </div>
        <div className="maps">
          <div className="map"><div className="start">{0}</div><div className="end">{5}</div></div>
          <div className="map"><div className="start">{0}</div><div className="end">{5}</div></div>
        </div>
        <ReactTooltip id="tableTooltip">
          {tooltip.split("\n").map((t, i) => <div key={i}>{t}</div>)}
        </ReactTooltip>
        <ReactTooltip id="scoreTooltip">
          {score.split("\n").map((t, i) => <div key={i}>{t}</div>)}
        </ReactTooltip>

      </div>
    </div>
  );
};

PekaRbp.propTypes = {
  rbp: PropTypes.string.isRequired
};

export default PekaRbp;