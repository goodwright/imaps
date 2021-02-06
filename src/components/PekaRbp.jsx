import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BarLoader from "react-spinners/BarLoader";
import ReactTooltip from "react-tooltip";
import { getApiLocation } from "../api";

const PekaRbp = props => {

  const { rbp } = props;

  const [data, setData] = useState(null);
  const [tooltip, setTooltip] = useState("");

  useEffect(() => {
    fetch(
      getApiLocation().replace("graphql", `peka/rbp?name=${rbp}`)
    ).then(resp => resp.json()).then(json => {
      setData(json);
    })
  }, [])

  const tableHover = e => {
    setTooltip(e.target.dataset.value)
  }

  if (!data) return <BarLoader color="#6353C6" />

  return (
    <div className="peka-rbp">
      <div className="table">
          <div className="row">{data.offsets.map(offset => <div className="offset cell" key={offset}>{offset}</div>)}</div>
          {data.matrix.map((row, i) => (
            <div className="row" key={i}>
              <div className="motif cell">{data.motifs[i]}</div>
              {row.map((cell, c) => (
                <div
                  style={{backgroundColor: cell.color}}
                  className={data.offsets[c] === 0 ? "center cell" : "cell"}
                  data-value={cell.value}
                  onMouseMove={tableHover}
                  data-tip data-for="tableTooltip"
                  key={c}
                />
              ))}
            </div>
          ))}
      </div>
      <div className="map"><div className="start">{0}</div><div className="end">{5}</div></div>
      <ReactTooltip id="tableTooltip">
        {tooltip}
      </ReactTooltip>
    </div>
  );
};

PekaRbp.propTypes = {
  rbp: PropTypes.string.isRequired
};

export default PekaRbp;