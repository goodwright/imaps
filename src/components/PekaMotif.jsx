import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import roundTo from "round-to";
import ReactTooltip from "react-tooltip";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getApiLocation } from "../api";

const PekaMotif = props => {
  const { motif } = props;

  const [data, setData] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(" ");
  const heatmapsRef = useRef(null);
  const cellWidth = 2;
  const cellHeight = 14;
  const barWidth = 24;

  useEffect(() => {
    fetch(
      getApiLocation().replace("graphql", `peka/motif?sequence=${motif}`)
    ).then(resp => resp.json()).then(json => {
      setData(json);
      drawCanvases(json);
    })
  }, [])

  const drawCanvases = json => {
    for (let h = 0; h < json.heatmaps.length; h++) {
      const heatmap = json.heatmaps[h];

      let canvas = heatmapsRef.current.querySelectorAll(".heatmap")[h].querySelector(".rbp-canvas");
      canvas.width = heatmap.rbp_heatmap.columns.length * cellWidth;
      canvas.height = heatmap.rbp_heatmap.rows.length * cellHeight;
      let context = canvas.getContext("2d");
      context.lineWidth = "0";
      for (let r = 0; r < heatmap.rbp_heatmap.rows.length; r++) {
        const row = heatmap.rbp_heatmap.matrix[r];
        for (let c = 0; c < heatmap.rbp_heatmap.columns.length; c++) {
          const cell = row[c];
          context.fillStyle = cell.color;
          context.beginPath();
          context.rect(c * cellWidth, r * cellHeight, cellWidth, cellHeight);
          context.fill();
        }
      }

      canvas = heatmapsRef.current.querySelectorAll(".heatmap")[h].querySelector(".intron-canvas");
      canvas.width = heatmap["regional_%"].columns.length * barWidth;
      canvas.height = heatmap["regional_%"].rows.length * cellHeight;
      context = canvas.getContext("2d");
      context.lineWidth = "0";
      for (let r = 0; r < heatmap["regional_%"].rows.length; r++) {
        const row = heatmap["regional_%"].matrix[r];
        for (let c = 0; c < heatmap["regional_%"].columns.length; c++) {
          const cell = row[c];
          context.fillStyle = cell.color;
          context.beginPath();
          context.rect(c * barWidth, r * cellHeight, barWidth, cellHeight);
          context.fill();
        }
      }

      canvas = heatmapsRef.current.querySelectorAll(".heatmap")[h].querySelector(".recall-canvas");
      canvas.width = heatmap["recall"].columns.length * barWidth;
      canvas.height = heatmap["recall"].rows.length * cellHeight;
      context = canvas.getContext("2d");
      context.lineWidth = "0";
      for (let r = 0; r < heatmap["recall"].rows.length; r++) {
        const row = heatmap["recall"].matrix[r];
        for (let c = 0; c < heatmap["recall"].columns.length; c++) {
          const cell = row[c];
          context.fillStyle = cell.color;
          context.beginPath();
          context.rect(c * barWidth, r * cellHeight, barWidth, cellHeight);
          context.fill();
        }
      }

      canvas = heatmapsRef.current.querySelectorAll(".heatmap")[h].querySelector(".ibaq-canvas");
      canvas.width = heatmap["iBAQ"].columns.length * barWidth;
      canvas.height = heatmap["iBAQ"].rows.length * cellHeight;
      context = canvas.getContext("2d");
      context.lineWidth = "0";
      for (let r = 0; r < heatmap["iBAQ"].rows.length; r++) {
        const row = heatmap["iBAQ"].matrix[r];
        for (let c = 0; c < heatmap["iBAQ"].columns.length; c++) {
          const cell = row[c];
          context.fillStyle = cell.color;
          context.beginPath();
          context.rect(c * barWidth, r * cellHeight, barWidth, cellHeight);
          context.fill();
        }
      }
    }
  }

  const canvasHover = e => {
    const heatmap = data.heatmaps[e.target.dataset.heatmap];
    const canvas = heatmap[e.target.dataset.canvas];
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (cellHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / (e.target.dataset.canvas === "rbp_heatmap" ? cellWidth : barWidth)), 0);
    if (rowNum < canvas.matrix.length && colNum < canvas.matrix[rowNum].length) {
      const cell = `${canvas.columns[colNum]} - ${canvas.rows[rowNum].label || canvas.rows[rowNum]}\n${roundTo(canvas.matrix[rowNum][colNum].value, 2)}`
      setHoveredCell(cell);
    }
  }

  if (!data) return <BarLoader color="#6353C6" />

  function tooltipFormatter() {
    return `
      <div><strong>z-score</strong>: ${this.point.x}</div><br>
      <div><strong>max coverage</strong>: ${this.point.y}</div>
    `;
  }

  return (
    <div className="peka-motif">
      <h2>{motif} (Group: {data.group})</h2>
      <p className="peka-sub-text">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam asperiores, dolore consectetur incidunt perspiciatis beatae? <Link to="/apps/peka/">Back to Heatmap</Link>
      </p>

      <div className="graphics">

        <div className="scatter-plots">
          <div className="plots">
            {data.plots.map((plot, i) => {
              const options = {
                chart: {zoomType: "xy", padding: 0, spacingBottom: 0},
                credits: {enabled: false},
                title: {text: plot.title},
                legend: {enabled: false},
                tooltip: {
                  formatter: tooltipFormatter,
                  style: {lineHeight: "15"},
                  borderRadius: 6,
                  shadow: false
                },
                xAxis: {
                  title: "z-score", tickLength: 0, title: {text: "z-score"},
                  plotLines: [{color: "#555555", width: 1, value: 3, dashStyle: "LongDash"}]
                },
                yAxis: {gridLineWidth: 0, lineWidth: 1, title: {text: "max coverage per tXn (%)"}},
                series: [{
                  data: plot.data.map(point => ({...point, dataLabels: {enabled: Boolean(point.label), color: point.labelColor}})),
                  type: "scatter", marker: {radius: 1.5}
                }]
              }
              return <HighchartsReact highcharts={Highcharts} options={options} key={i} />
            })}
          </div>
          <div className="colors" style={{
            background: `linear-gradient(${data.scatterplot_colors.join(",")})`
          }}>
            <div className="value">150</div>
            <div className="value">100</div>
            <div className="value">50</div>
            <div className="value">0</div>
            <div className="value">-50</div>
            <div className="value">-100</div>
            <div className="value">-150</div>
          </div>
        </div>


        <div className="heatmaps" ref={heatmapsRef}>
          {data.heatmaps.map((heatmap, n) => (

            <div className="heatmap" key={n}>

              <div className="rbps" style={{marginTop: cellHeight * 2}}>
                {heatmap.rbp_heatmap.rows.map((rbp, i) => (
                  <div key={i} className="rbp" style={{fontWeight: rbp.fontweight, height: cellHeight}}>{rbp.label}</div> 
                ))}
              </div>

              <div className="matrix">
                <div className="title" style={{height: cellHeight * 2}}>{heatmap.rbp_heatmap.title}</div>

                  
                  <canvas className="rbp-canvas" data-heatmap={n} data-canvas="rbp_heatmap" onMouseMove={canvasHover} data-tip data-for="canvasTooltip" />

                
                <div className="offsets" style={{
                  height: heatmap.rbp_heatmap.columns.length * cellWidth,
                  marginBottom: heatmap.rbp_heatmap.columns.length * -cellWidth + 24
                }}>
                  {heatmap.rbp_heatmap.columns.filter(x => x % 10 === 0).map(
                    offset => <div key={offset} className="offset">{offset}</div>
                  )}
                </div>
                <div className="colors" style={{
                  background: `linear-gradient(90deg,${heatmap.rbp_heatmap.colors.join(",")})`,
                  width: heatmap.rbp_heatmap.columns.length * cellWidth
                }}>
                  <div className="value">0.2</div>
                  <div className="value">0.4</div>
                  <div className="value">0.6</div>
                  <div className="value">0.8</div>
                  <div className="value">1.0</div>
                </div>
              </div>
           
              <div className="introns"  style={{marginTop: cellHeight * 2}}>
                <div className="labels">
                  {heatmap["regional_%"].columns.map(label => <div key={label} className="label">
                    {label.replace(/_/g, " ").replace("percentage", "%")}
                  </div> )}
                </div>
                <canvas className="intron-canvas" data-heatmap={n} data-canvas="regional_%" onMouseMove={canvasHover} data-tip data-for="canvasTooltip" />

                <div className="colors" style={{
                  background: `linear-gradient(${heatmap["regional_%"].cmap.join(",")})`,
                  width: barWidth, height: barWidth * 2
                }}>
                  <div className="value">100</div>
                  <div className="value">50</div>
                  <div className="value">0</div>
                </div>
              </div>

              <div className="recall"  style={{marginTop: cellHeight * 2}}>
                <div className="labels">
                  {heatmap["recall"].columns.map(label => <div key={label} className="label">
                    {label.replace(/_/g, " ").replace("percentage", "%")}
                  </div> )}
                </div>
                <canvas className="recall-canvas" data-heatmap={n} data-canvas="recall" onMouseMove={canvasHover} data-tip data-for="canvasTooltip"/>

                <div className="colors" style={{
                  background: `linear-gradient(${heatmap["recall"].cmap.join(",")})`,
                  width: barWidth, height: barWidth * 2
                }}>
                  <div className="value">1.0</div>
                  <div className="value">0.5</div>
                  <div className="value">0.0</div>
                </div>
              </div>

              <div className="ibaq"  style={{marginTop: cellHeight * 2}}>
                <div className="labels">
                  {heatmap["iBAQ"].columns.map(label => <div key={label} className="label">
                    {label.replace(/_/g, " ").replace("percentage", "%")}
                  </div> )}
                </div>
                <canvas className="ibaq-canvas" data-heatmap={n} data-canvas="iBAQ" onMouseMove={canvasHover} data-tip data-for="canvasTooltip" />

                <div className="colors" style={{
                  background: `linear-gradient(${heatmap["iBAQ"].cmap.join(",")})`,
                  width: barWidth, height: barWidth * 2,
                  paddingTop: "30%"
                }}>
                  <div className="value">10<sup>9</sup></div>
                  <div className="value">10<sup>8</sup></div>
                  <div className="value">10<sup>7</sup></div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    
    
      <ReactTooltip id="canvasTooltip">
        {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : ""}
      </ReactTooltip>
    </div>
  );
};

PekaMotif.propTypes = {
  
};

export default PekaMotif;