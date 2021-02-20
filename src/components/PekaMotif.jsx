import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getApiLocation } from "../api";

const PekaMotif = props => {
  const { motif } = props;

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(
      getApiLocation().replace("graphql", `peka/motif?sequence=${motif}`)
    ).then(resp => resp.json()).then(json => {
      setData(json);
    })
  }, [])

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
                chart: {zoomType: "xy"},
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


        <div className="heatmaps">

        </div>


      </div>
    </div>
  );
};

PekaMotif.propTypes = {
  
};

export default PekaMotif;