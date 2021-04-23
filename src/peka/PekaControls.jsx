import React from "react";
import PropTypes from "prop-types";
import ReactToggle from "react-toggle";

const PekaControls = props => {

  const {
    cellSize, zoom, zooms, truncated, setTruncated, showSimilarity, setShowSimilarity,
    showEric, setShowEric, showRecall, setShowRecall, showIntrons, setShowIntrons,
    showNoncodingIDR, setShowNoncodingIDR, showTotalIDR, setShowTotalIDR
  } = props;

  return (
    <div className="peka-controls">
      <div className="zoom">
        <div className={cellSize === zooms[0] ? "disabled zoom-out" : "zoom-out"} onClick={() => zoom(false)}>-</div>
        <div className={cellSize === zooms[zooms.length - 1] ? "disabled zoom-in" : "zoom-in"} onClick={() => zoom(true)}>+</div>
      </div>
      <div className="toggles">

        <div className="toggle">
          <ReactToggle
            id="truncated"
            icons={false}
            checked={!truncated}
            onChange={e => setTruncated(!e.target.checked)}
          />
          <label htmlFor="truncated">Full Heatmap</label>
        </div>
        <div className="toggle">
          <ReactToggle
            id="similarity"
            icons={false}
            checked={showSimilarity}
            onChange={e => setShowSimilarity(e.target.checked)}
          />
          <label htmlFor="similarity">Show Similarity</label>
        </div>
        <div className="toggle">
          <ReactToggle
            id="eric"
            icons={false}
            checked={showEric}
            onChange={e => setShowEric(e.target.checked)}
          />
          <label htmlFor="eric">Show logF2 eRIC</label>
        </div>
        <div className="toggle">
          <ReactToggle
            id="recall"
            icons={false}
            checked={showRecall}
            onChange={e => setShowRecall(e.target.checked)}
          />
          <label htmlFor="recall">Show Recall</label>
        </div>
        <div className="toggle">
          <ReactToggle
            id="introns"
            icons={false}
            checked={showIntrons}
            onChange={e => setShowIntrons(e.target.checked)}
          />
          <label htmlFor="introns">Show tXn per region (%)</label>
        </div>
        <div className="toggle">
          <ReactToggle
            id="noncoding"
            icons={false}
            checked={showNoncodingIDR}
            onChange={e => setShowNoncodingIDR(e.target.checked)}
          />
          <label htmlFor="noncoding">Show % noncoding peaks</label>
        </div>
        <div className="toggle">
          <ReactToggle
            id="total"
            icons={false}
            checked={showTotalIDR}
            onChange={e => setShowTotalIDR(e.target.checked)}
          />
          <label htmlFor="total">Show total number of peaks</label>
        </div>
      </div>
    </div>
  );
};

PekaControls.propTypes = {
  cellSize: PropTypes.number.isRequired,
  zoom: PropTypes.func.isRequired,
  zooms: PropTypes.array.isRequired,
  truncated: PropTypes.bool.isRequired,
  setTruncated: PropTypes.func.isRequired,
  showSimilarity: PropTypes.bool.isRequired,
  setShowSimilarity: PropTypes.func.isRequired,
  showEric: PropTypes.bool.isRequired,
  setShowEric: PropTypes.func.isRequired,
  showRecall: PropTypes.bool.isRequired,
  setShowRecall: PropTypes.func.isRequired,
  showIntrons: PropTypes.bool.isRequired,
  setShowIntrons: PropTypes.func.isRequired,
  showNoncodingIDR: PropTypes.bool.isRequired,
  setShowNoncodingIDR: PropTypes.func.isRequired,
  showTotalIDR: PropTypes.bool.isRequired,
  setShowTotalIDR: PropTypes.func.isRequired,
};

export default PekaControls;