import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BarLoader from "react-spinners/BarLoader";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import roundTo from "round-to";

const PekaRbp = props => {

  const { rbp, download } = props;

  const [data, setData] = useState(null);
  const [tooltip, setTooltip] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND}/graphql`.replace("graphql", `peka/rbp?name=${rbp}`)
    ).then(resp => resp.json()).then(json => {
      setData(json);
    })
  }, [rbp])

  const tableHover = e => {
    setTooltip(`${e.target.dataset.motif}: ${e.target.dataset.offset}\n${e.target.dataset.value}`)
  }

  const scoreHover = e => {
    setScore (`${e.target.dataset.motif}\n${e.target.dataset.value}`)
  }

  if (!data) return <BarLoader color="#6353C6" css="margin: 64px 355px" />

  return (
    <div className="peka-rbp">
      <h2>{rbp} <button onClick={() => download(data, rbp)}>Download Data</button></h2>
      <div className="peka-sub-text">
        <p>
          Heatmap visualises the relative occurrence of 40 5-mers with the highest PEKA
          score around the high-confidence crosslink sites (tXn). 5-mers are clustered
          based on sequence similarity, the clusters are separated by white lines and
          arranged from top to bottom by descending maximal value of PEKA score within
          the cluster. Grayscale heatmap on the right shows the PEKA score of each k-mer.
        </p>
        <Link className="back" to="/apps/peka/">Back to Main Heatmap</Link>
      </div>
      <div className="graphic">
        <div className="table">
          <div className="title">{rbp} - Relative occurence around tXn for top 40 motifs</div>
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
          <div className="row">{data.rbp_heatmap.columns.map(offset => <div className="offset cell" key={offset}>{offset}</div>)}</div>
          <div className="label">nt position relative to tXn</div>
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
            <div className="color-title" style={{top: data.PEKA_score_heatmap.matrix.length * 18 + 4}}>Average PEKA Score</div>
        </div>
        <div className="maps">
          <div className="map" style={{
            background: `linear-gradient(${data.rbp_heatmap.colors.slice().reverse().join(",")})`,
            paddingBottom: `${(data.rbp_heatmap.colorbar_ticks[0] - data.rbp_heatmap.colorbar_vmin_vmax.vmin) / (data.rbp_heatmap.colorbar_vmin_vmax.vmax - data.rbp_heatmap.colorbar_vmin_vmax.vmin) * 300}px`,
            paddingTop: `${(data.rbp_heatmap.colorbar_vmin_vmax.vmax - data.rbp_heatmap.colorbar_ticks[data.rbp_heatmap.colorbar_ticks.length - 1]) / (data.rbp_heatmap.colorbar_vmin_vmax.vmax - data.rbp_heatmap.colorbar_vmin_vmax.vmin) * 300}px`,
          }}>
            <div className="color-title">Relative k-mer occurrence</div>
            {data.rbp_heatmap.colorbar_ticks.slice().reverse().map(tick => <div className="tick" key={tick}>{tick}</div> )}
          </div>
          
          <div className="map" style={{
            background: `linear-gradient(${data.PEKA_score_heatmap.cmap.slice().reverse().join(",")})`,
            paddingBottom: `${(data.PEKA_score_heatmap.colorbar_ticks[0] - data.PEKA_score_heatmap.colorbar_vmin_vmax.vmin) / (data.PEKA_score_heatmap.colorbar_vmin_vmax.vmax - data.PEKA_score_heatmap.colorbar_vmin_vmax.vmin) * 300}px`,
            paddingTop: `${(data.PEKA_score_heatmap.colorbar_vmin_vmax.vmax - data.PEKA_score_heatmap.colorbar_ticks[data.PEKA_score_heatmap.colorbar_ticks.length - 1]) / (data.PEKA_score_heatmap.colorbar_vmin_vmax.vmax - data.PEKA_score_heatmap.colorbar_vmin_vmax.vmin) * 300}px`,
          }}>
            <div className="color-title">Average PEKA score (ntop= 50)</div>
            {data.PEKA_score_heatmap.colorbar_ticks.slice().reverse().map(tick => <div className="tick" key={tick}>{tick}</div> )}</div>
          
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