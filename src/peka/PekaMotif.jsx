import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import roundTo from "round-to";
import ReactTooltip from "react-tooltip";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PekaMotif = props => {
  const { motif, download } = props;

  const [data, setData] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(" ");
  const heatmapsRef = useRef(null);
  const cellWidth = 2;
  const cellHeight = 14;
  const barWidth = 24;

  useEffect(() => {
    setData(null);
    fetch(
      `${process.env.REACT_APP_BACKEND}/graphql`.replace("graphql", `peka/motif?sequence=${motif}`)
    ).then(resp => resp.json()).then(json => {
      setData(json);
      drawCanvases(json);
    })
  }, [motif])

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
        if (heatmap.rbp_heatmap.hlines.line_positions.includes(r)) {
          context.beginPath();
          context.lineWidth = 1;
          context.strokeStyle = "white";
          context.moveTo(0, r * cellHeight + 0.5);
          context.lineTo(heatmap.rbp_heatmap.columns.length * cellWidth, r * cellHeight + 0.5);
          context.stroke();
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

      canvas = heatmapsRef.current.querySelectorAll(".heatmap")[h].querySelector(".eric-canvas");
      canvas.width = heatmap["eRIC log2FC"].columns.length * barWidth;
      canvas.height = heatmap["eRIC log2FC"].rows.length * cellHeight;
      context = canvas.getContext("2d");
      context.lineWidth = "0";
      for (let r = 0; r < heatmap["eRIC log2FC"].rows.length; r++) {
        const row = heatmap["eRIC log2FC"].matrix[r];
        for (let c = 0; c < heatmap["eRIC log2FC"].columns.length; c++) {
          const cell = row[c];
          context.fillStyle = cell.color;
          context.beginPath();
          context.rect(c * barWidth, r * cellHeight, barWidth, cellHeight);
          context.fill();
        }
      }
    }
  }

  const canvasHover = (e, usePower) => {
    const heatmap = data.heatmaps[e.target.dataset.heatmap];
    const canvas = heatmap[e.target.dataset.canvas];
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (cellHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / (e.target.dataset.canvas === "rbp_heatmap" ? cellWidth : barWidth)), 0);
    let value = canvas.matrix[rowNum]
    if (value) value = value[colNum];
    if (value) value = value.value;
    const col = canvas.columns[colNum];
    const row = canvas.rows[rowNum].label || canvas.rows[rowNum];
    if (rowNum < canvas.matrix.length && colNum < canvas.matrix[rowNum].length) {
      const cell = `${col} - ${row}\n${ value === null ? "N/A" : usePower ? power(value, true) : roundTo(value, 2)}`
      setHoveredCell(cell);
    }
  }

  const power = (n, isString) => {
    const sup = Math.floor(Math.log10(n));
    const num = roundTo(n / (10 ** sup), 3);
    if (isString) return `${num} × 10**${sup}`
    if (Math.log10(n) === sup) {
      return <div>10<sup>{sup}</sup></div>
    } else {
      return <div>{num} × 10<sup>{sup}</sup></div>
    }
  }

  if (!data) return <BarLoader color="#6353C6" css="margin: 64px 355px" />

  function tooltipFormatter() {
    const datum = this.series.chart.userOptions.fullData[this.point.index];
    return `
      <div><strong>RBP Name</strong>: ${datum.rbp_name}</div><br>
      <div><strong>z-score</strong>: ${this.point.x}</div><br>
      <div><strong>max coverage</strong>: ${this.point.y}</div><br>
      <div><strong>Max Peak Position</strong>: ${datum["max peak position"]}</div>
    `;
  }

  return (
    <div className="peka-motif">
      <h2>{motif} (Group: {data.group}) <button onClick={() => download(data, data.group)}>Download Data</button></h2>
      <p className="other-motifs">Other members: <span className="members">{data.group_members.filter(m => m !== motif).join(", ")}</span></p>
      <div className="peka-sub-text">
        <h3>Metaprofile of motif-group coverage</h3>
        <p>
          This page compares the enrichment of the {data.group} motif-group across
          all eCLIP datasets. The coverage of a given motif-group is visualised
          around high-confidence crosslink sites (tXn) across multiple transcriptomic
          regions, with or without repeating elements. Analysed regions were introns,
          3’ UTRs, other exonic regions of protein-coding genes (5’ UTRs & the
          coding sequences), and the “whole gene”, combining all previously listed regions.
        </p>
        <p>
          On top right of the page is the legend showing the colour-code for the position
          around tXn where the coverage of motifs is highest (i.e., max-position). Next to
          it are the scatterplots displaying, for this particular motif-group, the %
          coverage at the max-position for each dataset (y-axis), and the maximal enrichment
          in the selected dataset compared to all other datasets at the same position (z-score).
          Below, heatmaps display a weighted metaprofile of motif-group coverage for 40 RBP
          datasets with the highest maximal coverage values in the corresponding region.
          Datasets are clustered based on the metaprofile similarities, and the groups are
          arranged from top to bottom by falling max coverage values.
        </p>
        <Link className="back" to="/apps/peka/">Back to Main Heatmap</Link>
      </div>

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
                proteins: plot.data.map(point => point.label),
                xAxis: {
                  tickLength: 0, title: {text: "z-score"},
                  plotLines: [{color: "#555555", width: 1, value: 3, dashStyle: "LongDash"}]
                },
                yAxis: {gridLineWidth: 0, lineWidth: 1, title: {text: "max coverage per tXn (%)"}},
                fullData: plot.data,
                series: [{
                  data: plot.data.map(point => ({...point, dataLabels: {enabled: Boolean(point.label), color: point.labelColor, formatter: () => point.label}})),
                  type: "scatter", marker: {radius: 1.5}
                }]
              }
              return <HighchartsReact highcharts={Highcharts} options={options} key={i} />
            })}
          </div>
          <div className="colors" style={{
            background: `linear-gradient(${data.scatterplot_colors.slice().reverse().join(",")})`,
            
          }}>
            <div className="values" style={{
              top: `${(data.scatterplot_colorbar_ticks[0] - data.scatterplot_colorbar_vmin_vmax.vmin) / (data.scatterplot_colorbar_vmin_vmax.vmax - data.scatterplot_colorbar_vmin_vmax.vmin) * 100}%`,
              height: `${(data.scatterplot_colorbar_ticks[data.scatterplot_colorbar_ticks.length - 1] - data.scatterplot_colorbar_ticks[0]) / (data.scatterplot_colorbar_vmin_vmax.vmax - data.scatterplot_colorbar_vmin_vmax.vmin) * 100}%`,
            }}>
              {data.scatterplot_colorbar_ticks.slice().reverse().map((value, i) => (
                <div key={i} className="value">{value}</div>
              ))}
            </div>
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
                  width: heatmap.rbp_heatmap.columns.length * cellWidth,
                  paddingLeft: `${(heatmap.rbp_heatmap.colorbar_ticks[0] - heatmap.rbp_heatmap.colorbar_vmin_vmax.vmin) / (heatmap.rbp_heatmap.colorbar_vmin_vmax.vmax - heatmap.rbp_heatmap.colorbar_vmin_vmax.vmin) * 100}%`,
                  paddingRight: `${(heatmap.rbp_heatmap.colorbar_vmin_vmax.vmax - heatmap.rbp_heatmap.colorbar_ticks[heatmap.rbp_heatmap.colorbar_ticks.length - 1]) / (heatmap.rbp_heatmap.colorbar_vmin_vmax.vmax - heatmap.rbp_heatmap.colorbar_vmin_vmax.vmin) * 100}%`,
                }}>
                  <div className="color-title">k-mer group coverage</div>
                  {heatmap.rbp_heatmap.colorbar_ticks.map(value => (
                    <div className="value" key={value}>{value}</div>
                  ))}
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
                  background: `linear-gradient(${heatmap["regional_%"].cmap.slice().reverse().join(",")})`,
                  width: barWidth, height: barWidth * 2.5
                }}>
                  {heatmap["regional_%"].colorbar_ticks.slice().reverse().map(value => (
                    <div className="value" key={value}>{value}</div>
                  ))}
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
                  background: `linear-gradient(${heatmap["recall"].cmap.slice().reverse().join(",")})`,
                  width: barWidth, height: barWidth * 2.5
                }}>
                  {heatmap["recall"].colorbar_ticks.slice().reverse().map(value => (
                    <div className="value" key={value}>{value}</div>
                  ))}
                </div>
              </div>

              <div className="eric"  style={{marginTop: cellHeight * 2}}>
                <div className="labels">
                  {heatmap["eRIC log2FC"].columns.map(label => <div key={label} className="label">
                    {label.replace(/_/g, " ").replace("percentage", "%")}
                  </div> )}
                </div>
                <canvas className="eric-canvas" data-heatmap={n} data-canvas="eRIC log2FC" onMouseMove={canvasHover} data-tip data-for="canvasTooltip" />

                <div className="colors" style={{
                  background: `linear-gradient(${heatmap["eRIC log2FC"].cmap.slice().reverse().join(",")})`,
                  width: barWidth, height: barWidth * 2.5,
                  paddingTop: `${(heatmap["eRIC log2FC"].colorbar_ticks[0] - heatmap["eRIC log2FC"].colorbar_vmin_vmax.vmin) / (heatmap["eRIC log2FC"].colorbar_vmin_vmax.vmax - heatmap["eRIC log2FC"].colorbar_vmin_vmax.vmin) * 100}%`,
                  paddingBottom: `${(heatmap["eRIC log2FC"].colorbar_vmin_vmax.vmax - heatmap["eRIC log2FC"].colorbar_ticks[heatmap["eRIC log2FC"].colorbar_ticks.length - 1]) / (Math.log10(heatmap["eRIC log2FC"].colorbar_vmin_vmax.vmax) - heatmap["eRIC log2FC"].colorbar_vmin_vmax.vmin) * 100}%`,
                }}>
                  {heatmap["eRIC log2FC"].colorbar_ticks.slice().reverse().map(value => (
                    <div className="value" key={value}>{value}</div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    
    
      <ReactTooltip id="canvasTooltip">
        {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>
          {t.includes("**") ? <div>{t.split("**")[0]}<sup>{t.split("**")[1]}</sup></div> : t}
        </div>) : ""}
      </ReactTooltip>
    </div>
  );
};

PekaMotif.propTypes = {
  motif: PropTypes.string.isRequired
};

export default PekaMotif;