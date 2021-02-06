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

  const offsets = Object.keys(data[Object.keys(data)[0]]).map(s => parseInt(s)).sort((a, b) => a - b);

  return (
    <div className="peka-rbp">
      <div className="table">

          <div className="row">{offsets.map(offset => <div className="offset cell" key={offset}>{offset}</div>)}</div>
          {Object.entries(data).map(([motif, row]) => (
            <div className="row">
              <div className="motif cell">{motif}</div>
              {offsets.map(offset => (
                <div
                  style={{backgroundColor: row[offset].color}}
                  className={offset === 0 ? "center cell" : "cell"}
                  data-value={row[offset].value}
                  onMouseMove={tableHover}
                  data-tip data-for="tableTooltip"
                />
              ))}
            </div>
          ))}

      </div>
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