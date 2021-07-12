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

  const cellSize = 18;
  const col1Width = 72;

  return (
    <div>
      <h2 className="font-semibold relative text-3xl mb-2">{rbp}
        <button className="absolute text-xs -top-1.5 pl-1 text-primary-500"onClick={() => download(data, rbp)}>Download Data</button>
      </h2>
      <div className="text-xs sm:text-sm max-w-4xl pb-4 mb-6">
        <p>
          Heatmap visualises the relative occurrence of 40 5-mers with the highest PEKA
          score around the high-confidence crosslink sites (tXn). 5-mers are clustered
          based on sequence similarity, the clusters are separated by white lines and
          arranged from top to bottom by descending maximal value of PEKA score within
          the cluster. Grayscale heatmap on the right shows the PEKA score of each k-mer.
        </p>
        <Link className="block mt-1" to="/apps/peka/">Back to Main Heatmap</Link>
      </div>
      <div className="flex max-w-full overflow-x-auto no-scroll">
        <div className="text-2xs table">
          <div className="text-primary-500 text-sm text-center font-medium" style={{
            marginLeft: col1Width, width: cellSize * 51, height: cellSize
          }}>
            {rbp} - Relative occurence around tXn for top 40 motifs
          </div>
          {data.rbp_heatmap.matrix.map((row, i) => (
            <div className="flex whitespace-nowrap" key={i} style={{height: cellSize}}>
              <div className="inline-flex items-center font-mono justify-end pr-1 relative" style={{
                width: col1Width, height: cellSize, paddingLeft: col1Width
              }}>
                {data.rbp_heatmap.rows[i]}
              </div>
              {row.map((cell, c) => (
                <div
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: cell.color,
                    borderTop: data.rbp_heatmap.hlines.line_positions.includes(i) && c >= data.rbp_heatmap.hlines.line_start_end[0] && c <= data.rbp_heatmap.hlines.line_start_end[1] ? `1px solid ${data.rbp_heatmap.hlines.colors}` : "none",
                    ...data.rbp_heatmap.columns[c] === 0 || data.rbp_heatmap.columns[c - 1] === 0 ? {
                      backgroundImage: "linear-gradient(white 50%, #ffffff00 0%)",
                      backgroundPosition: "left",
                      backgroundSize: "1px 10px",
                      backgroundRepeat: "repeat-y"
                    } : {}
                  }}
                  className={data.rbp_heatmap.columns[c] === 0 ? "center cell" : "inline-block"}
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
          <div className="block whitespace-nowrap text-3xs pl-1 -mt-1" style={{
            height: cellSize, marginLeft: col1Width}}>
            {data.rbp_heatmap.columns.map(offset => (
              <div className="inline-flex items-center justify-center" key={offset} style={{width: cellSize, height: cellSize}}>{offset}</div>
            ))}
          </div>
          
          <div className="text-primary-500 text-sm text-center font-medium" style={{
            marginLeft: col1Width, width: cellSize * 51
          }}>nt position relative to tXn</div>
        </div>
        
        <div className="relative border ml-4" style={{
          marginTop: cellSize, marginBottom: cellSize * 2
        }}>
          {data.PEKA_score_heatmap.matrix.map((cell, i) => (
            <div
              style={{width: cellSize * 2, height: cellSize, backgroundColor: cell[0].color}}
              data-tip data-for="scoreTooltip"
              data-motif={data.PEKA_score_heatmap.rows[i]}
              data-value={roundTo(cell[0].value, 2)}
              onMouseMove={scoreHover}
              key={i}
            />
            ))}
            <div className="absolute text-xs whitespace-nowrap" style={{top: data.PEKA_score_heatmap.matrix.length * 18 + 4}}>
              Average PEKA Score
            </div>
        </div>

        <div className="flex flex-col justify-between ml-4" style={{
          height: cellSize * 40, width: cellSize
        }}>
          <div className="relative w-full flex flex-col justify-between" style={{
            height: 300,
            marginTop: cellSize,
            background: `linear-gradient(${data.rbp_heatmap.colors.slice().reverse().join(",")})`,
            paddingBottom: `${(data.rbp_heatmap.colorbar_ticks[0] - data.rbp_heatmap.colorbar_vmin_vmax.vmin) / (data.rbp_heatmap.colorbar_vmin_vmax.vmax - data.rbp_heatmap.colorbar_vmin_vmax.vmin) * 300}px`,
            paddingTop: `${(data.rbp_heatmap.colorbar_vmin_vmax.vmax - data.rbp_heatmap.colorbar_ticks[data.rbp_heatmap.colorbar_ticks.length - 1]) / (data.rbp_heatmap.colorbar_vmin_vmax.vmax - data.rbp_heatmap.colorbar_vmin_vmax.vmin) * 300}px`,
          }}>
            <div className="absolute text-2xs -top-6 whitespace-nowrap pr-1">Relative k-mer occurrence</div>
            {data.rbp_heatmap.colorbar_ticks.slice().reverse().map(tick => (
              <div className="relative text-xs" key={tick} style={{left: cellSize + 3}}>{tick}</div>
            ))}
          </div>
          
          <div className="relative w-full flex flex-col justify-between" style={{
            height: 300,
            width: cellSize,
            marginTop: cellSize,
            background: `linear-gradient(${data.PEKA_score_heatmap.cmap.slice().reverse().join(",")})`,
            paddingBottom: `${(data.PEKA_score_heatmap.colorbar_ticks[0] - data.PEKA_score_heatmap.colorbar_vmin_vmax.vmin) / (data.PEKA_score_heatmap.colorbar_vmin_vmax.vmax - data.PEKA_score_heatmap.colorbar_vmin_vmax.vmin) * 300}px`,
            paddingTop: `${(data.PEKA_score_heatmap.colorbar_vmin_vmax.vmax - data.PEKA_score_heatmap.colorbar_ticks[data.PEKA_score_heatmap.colorbar_ticks.length - 1]) / (data.PEKA_score_heatmap.colorbar_vmin_vmax.vmax - data.PEKA_score_heatmap.colorbar_vmin_vmax.vmin) * 300}px`,
          }}>
            <div className="absolute text-2xs -top-6 whitespace-nowrap pr-1">Average PEKA score (ntop= 50)</div>
            {data.PEKA_score_heatmap.colorbar_ticks.slice().reverse().map(tick => (
              <div className="relative text-xs" key={tick} style={{left: cellSize + 3}}>{tick}</div>
            ))}
          </div>
          
        </div>
        <ReactTooltip id="tableTooltip" className="p-0">
          {tooltip.split("\n").map((t, i) => <div className={i === 0 ? "text-xs" : "text-lg"} key={i}>{t}</div>)}
        </ReactTooltip>
        <ReactTooltip id="scoreTooltip" className="p-0">
          {score.split("\n").map((t, i) => <div className={i === 0 ? "text-xs" : "text-lg"} key={i}>{t}</div>)}
        </ReactTooltip>
      </div>
    </div>
  );
};

PekaRbp.propTypes = {
  rbp: PropTypes.string.isRequired
};

export default PekaRbp;