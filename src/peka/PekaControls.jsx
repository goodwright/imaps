import React from "react";
import PropTypes from "prop-types";
import Toggle from "../components/Toggle";

const PekaControls = props => {

  const {
    cellSize, zoom, zooms, truncated, setTruncated, showSimilarity, setShowSimilarity,
    showEric, setShowEric, showRecall, setShowRecall, showIntrons, setShowIntrons,
    showNoncodingIDR, setShowNoncodingIDR, showTotalIDR, setShowTotalIDR
  } = props;

  const zoomClass = "py-1 px-2 flex justify-center text-xl items-center w-1/2";
  const toggleClass = "mr-6 mb-5 w-64 justify-end";

  return (
    <div className="flex mb-6">
      <div className="rounded overflow-hidden cursor-pointer flex border w-20 h-full shadow flex-shrink-0">
        <div className={`${zoomClass} ${cellSize === zooms[0] ? "opacity-50 cursor-default" : "active:shadow-inner"}`} onClick={() => zoom(false)}>-</div>
        <div className={`${zoomClass} border-l ${cellSize === zooms[zooms.length - 1] ? "opacity-50 cursor-default" : "active:shadow-inner"}`} onClick={() => zoom(true)}>+</div>
      </div>
      <div className="flex flex-wrap ml-6 -mr-6">

        <Toggle
          id="truncated"
          checked={!truncated}
          onChange={e => setTruncated(!e.target.checked)}
          trueLabel="Full Heatmap"
          className={toggleClass}
        />
        <Toggle
          id="similarity"
          checked={showSimilarity}
          onChange={e => setShowSimilarity(e.target.checked)}
          trueLabel="Show Similarity"
          className={toggleClass}
        />
        <Toggle
          id="eric"
          checked={showEric}
          onChange={e => setShowEric(e.target.checked)}
          trueLabel="Show logF2 eRIC"
          className={toggleClass}
        />
        <Toggle
          id="recall"
          checked={showRecall}
          onChange={e => setShowRecall(e.target.checked)}
          trueLabel="Show Recall"
          className={toggleClass}
        />
        <Toggle
          id="introns"
          checked={showIntrons}
          onChange={e => setShowIntrons(e.target.checked)}
          trueLabel="Show tXn per region (%)"
          className={toggleClass}
        />
        <Toggle
          id="noncoding"
          checked={showNoncodingIDR}
          onChange={e => setShowNoncodingIDR(e.target.checked)}
          trueLabel="Show % noncoding peaks"
          className={toggleClass}
        />
        <Toggle
          id="total"
          checked={showTotalIDR}
          onChange={e => setShowTotalIDR(e.target.checked)}
          trueLabel="Show total number of peaks"
          className={toggleClass}
        />
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