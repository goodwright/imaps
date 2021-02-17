import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import ReactTooltip from "react-tooltip";
import PekaDendrogram from "./PekaDendrogram";
import { getApiLocation } from "../api";

const PekaHeatmap = () => {

  const [data, setData] = useState(null);
  const [cellSize, setCellSize] = useState(6);
  const zooms = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];
  const canvasRef = useRef(null);

  // Get data
  useEffect(() => {
    fetch(
      getApiLocation().replace("graphql", "peka/")
      ).then(resp => resp.json()).then(json => {
        setData(json);
      drawCanvas(json, cellSize);
    })
  }, [])

  const drawCanvas = (json, size) => {
    const canvas = canvasRef.current;
    canvas.width = json.matrix[0].length * size;
    canvas.style.width = `${canvas.width}px`;
    canvas.height = json.matrix.length * size + (6 * (secondaryHeight + secondaryGap)) + (2 * secondaryHeight);
    canvas.style.height = `${canvas.height}px`;
    const context = canvas.getContext("2d");
    context.lineWidth = "0";
    for (let rowNum = 0; rowNum < json.matrix.length; rowNum++) {
      const row = json.matrix[rowNum];
      for (let colNum = 0; colNum < row.length; colNum++) {
        const cell = row[colNum];
        context.fillStyle = cell.color;
        context.beginPath();
        context.rect(colNum * size, rowNum * size, size, size);
        context.fill();
      }
    }

    let y = json.matrix.length * size + secondaryGap;

    for (let name of ["similarity", "iBAQ", "recall", "introns", "noncoding_IDR", "total_IDR"]) {
      context.beginPath();
      context.strokeStyle = "#cccccc";
      context.rect(0, y, size * json.columns.length, secondaryHeight);
      context.stroke();
      context.closePath();

      for (let rowNum = 0; rowNum < json[name].matrix.length; rowNum++) {
        for (let colNum = 0; colNum < json[name].matrix[rowNum].length; colNum++) {
          const cell = json[name].matrix[rowNum][colNum];
          context.fillStyle = cell.color;
          context.beginPath();
          context.rect(colNum * size, y, size, secondaryHeight);
          context.fill();
        }
        y += secondaryHeight;
      }
      y += secondaryGap;
    }
  }


  const zoom = zoomIn => {
    const index = zooms.indexOf(cellSize);
    let newSize = cellSize;
    if (!zoomIn && index !== 0) newSize = zooms[index - 1];
    if (zoomIn && index !== zooms.length - 1) newSize = zooms[index + 1];
    const canvas = canvasRef.current;
    canvas.style.width = `${data.matrix[0].length * newSize}px`;
    canvas.style.height = `${data.matrix.length * newSize}px`;
    setCellSize(newSize);
  }

  const proteinsHeight = cellSize >= 6 ? cellSize * 7 : 0;
  const motifsWidth = cellSize >= 6 ? cellSize * 3 : 0;
  const secondaryHeight = 30;
  const secondaryGap = 15;

  return (
    <div className="peka-heatmap">
      <h2>Heatmap</h2>
      <div className="peka-sub-text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam sed, odit dolore magnam quaerat aliquid explicabo incidunt omnis inventore iste ipsam.
      </div>

      <div className="zoom">
        <div className={cellSize === zooms[0] ? "disabled zoom-out" : "zoom-out"} onClick={() => zoom(false)}>-</div>
        <div className={cellSize === zooms[zooms.length - 1] ? "disabled zoom-in" : "zoom-in"} onClick={() => zoom(true)}>+</div>
      </div>
      {data && (
        <>
        <PekaDendrogram 
          data={data.dendrogram} cellSize={cellSize} 
          labelHeight={proteinsHeight} offset={motifsWidth}
        />
        <div className="main-row">
          <div className="motifs" style={{
            width: motifsWidth
          }}>
            {data && data.rows.map(motif => (
              <div className="motif" key={motif} style={{
                height: cellSize, fontSize: cellSize * 0.75, opacity: cellSize >= 6 ? 1 : 0
              }}>{motif}</div> 
            ))}
          </div>

          <canvas ref={canvasRef} />
        </div>
        </>
      )}

    </div>
  )
}

  /* const [data, setData] = useState(null);
  const [cellSize, setCellSize] = useState(8);
  const [hoveredCell, setHoveredCell] = useState(null);
  const canvasRef = useRef(null);
  const proteinsRef = useRef(null);
  const zooms = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];

  const drawCanvas = (json, size) => {
    const canvas = canvasRef.current;
    const proteins = proteinsRef.current;
    canvas.width = json.matrix[0].length * size;
    canvas.style.width = `${canvas.width}px`;
    proteins.style.width = `${canvas.width}px`;
    canvas.height = json.matrix.length * size;
    canvas.style.height = `${canvas.height}px`;
    const context = canvas.getContext("2d");
    context.lineWidth = "0";
    for (let rowNum = 0; rowNum < json.matrix.length; rowNum++) {
      const row = json.matrix[rowNum];
      for (let colNum = 0; colNum < row.length; colNum++) {
        const cell = row[colNum];
        context.fillStyle = cell.color;
        context.beginPath();
        context.rect(colNum * size, rowNum * size, size, size);
        context.fill();
      }
    }
  }

  const zoom = zoomIn => {
    const index = zooms.indexOf(cellSize);
    let newSize = cellSize;
    if (!zoomIn && index !== 0) newSize = zooms[index - 1];
    if (zoomIn && index !== zooms.length - 1) newSize = zooms[index + 1];
    const canvas = canvasRef.current;
    canvas.style.width = `${data.matrix[0].length * newSize}px`;
    canvas.style.height = `${data.matrix.length * newSize}px`;
    setCellSize(newSize);
  }

  const mouseMove = (e) => {
    if (data) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const rowNum = Math.max(Math.floor((y - 1) / (cellSize)), 0);
      const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
      const cell = `${data.proteins[colNum]} - ${data.motifs[rowNum]}\n${data.matrix[rowNum][colNum].value}`
      setHoveredCell(cell);
    }
  }

  useEffect(() => {
    fetch(
      getApiLocation().replace("graphql", "peka/")
    ).then(resp => resp.json()).then(json => {
      setData(json);
      drawCanvas(json, cellSize);
    })
  }, [])

  const proteinsHeight = cellSize >= 8 ? cellSize * 8 : 0;
  const motifsWidth = cellSize >= 8 ? cellSize * 3 : 0;

  if (!data) return <BarLoader color="#6353C6" />

  return (
    <div className="peka-heatmap">
      <h2>Heatmap</h2>
      <div className="peka-sub-text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam sed, odit dolore magnam quaerat aliquid explicabo incidunt omnis inventore iste ipsam.
      </div>
      <div className="peka-panel">
        <div className="color-map" style={{
            background: `linear-gradient(90deg, ${data.colors.join(", ")})`
        }}><div className="start">{data.min}</div><div className="end">{data.max}</div></div>
        <div className="zoom">
          <div className={cellSize === zooms[0] ? "disabled zoom-out" : "zoom-out"} onClick={() => zoom(false)}>-</div>
          <div className={cellSize === zooms[zooms.length - 1] ? "disabled zoom-in" : "zoom-in"} onClick={() => zoom(true)}>+</div>
        </div>
      </div>
      <div className="canvas" style={{gridTemplateColumns: `${motifsWidth}px 1fr`}}>
        <div className="motifs" style={{
          paddingTop: proteinsHeight, width: motifsWidth
        }}>
          {data && data.motifs.map(motif => (
            <div className="motif" key={motif} style={{
              height: cellSize, fontSize: cellSize * 0.75, opacity: cellSize >= 8 ? 1 : 0
            }}>{motif}</div> 
          ))}
        </div>
        <div className="right-column">
          <div ref={proteinsRef} className="proteins" style={{
            gridTemplateColumns: data ? `repeat(${data.proteins.length}, ${cellSize}px)` : "",
            height: proteinsHeight
          }}>
            {cellSize >= 8 && data && data.proteins.map(protein => (
              <Link className="protein" key={protein} to={`/apps/peka?rbp=${protein}`} style={{
                height: cellSize, width: proteinsHeight,
                left: (proteinsHeight - cellSize) / -2, fontSize: cellSize * 0.75,
                top: (proteinsHeight - cellSize) / 2
              }}>{protein}</Link>
            ))}
            <canvas onMouseMove={mouseMove} ref={canvasRef}  data-tip data-for="canvasTooltip" style={{top: proteinsHeight - cellSize}}/>
          </div>
        </div>
        
        <ReactTooltip id="canvasTooltip">
          {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : "PEKA"}
        </ReactTooltip>
      </div>
    </div>
  );
}; */

PekaHeatmap.propTypes = {
  
};

export default PekaHeatmap;