import React, { useEffect, useState, useRef } from "react";
import ReactTooltip from "react-tooltip";
import { getApiLocation } from "../api";
import Base from "./Base";

const PekaPage = () => {

  useEffect(() => {
    document.title = "iMaps - PEKA";
  });

  const [data, setData] = useState(null);
  const [cellSize, setCellSize] = useState(4);
  const [hoveredCell, setHoveredCell] = useState(null);
  const canvasRef = useRef(null);
  const zooms = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20];

  const drawCanvas = (json, size) => {
    const canvas = canvasRef.current;
    canvas.width = json.matrix[0].length * size;
    canvas.style.width = `${canvas.width}px`;
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
    setTimeout(() => drawCanvas(data, newSize), 200);
  }
  
  useEffect(() => {
    fetch(
      getApiLocation().replace("graphql", "peka/")
    ).then(resp => resp.json()).then(json => {
      setData(json);
      drawCanvas(json, cellSize);
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.addEventListener("mousemove", e => {
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const rowNum = Math.max(Math.floor((y - 1) / (cellSize)), 0);
        const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
        const cell = `${json.proteins[rowNum]} - ${json.sequences[colNum]}\n${json.matrix[rowNum][colNum].value}`
        setHoveredCell(cell);
      })
    })
  }, [])


  return (
    <Base className="peka-page">
      <h1>PEKA</h1>
      <div className="peka-panel">
        <div className="zoom">
          <div className={cellSize === zooms[zooms.length - 1] ? "disabled zoom-in" : "zoom-in"} onClick={() => zoom(true)}>+</div>
          <div className={cellSize === zooms[0] ? "disabled zoom-out" : "zoom-out"} onClick={() => zoom(false)}>-</div>
        </div>
      </div>
      <div className="canvas">
        <canvas ref={canvasRef}  data-tip data-for="canvasTooltip" />
        
        <ReactTooltip id="canvasTooltip">
          {hoveredCell ? hoveredCell.split("\n").map(t => <div>{t}</div>) : "PEKA"}
        </ReactTooltip>
      </div>
    </Base>
  );
};

PekaPage.propTypes = {
    
};

export default PekaPage;