import React, { useEffect, useState, useRef } from "react";
import { BarLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import { getApiLocation } from "../api";
import Base from "./Base";

const PekaPage = () => {

  useEffect(() => {
    document.title = "iMaps - PEKA";
  });

  const [data, setData] = useState(null);
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
      const cell = `${data.proteins[colNum]} - ${data.sequences[rowNum]}\n${data.matrix[rowNum][colNum].value}`
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
  const sequencesWidth = cellSize >= 8 ? cellSize * 3 : 0;


  return (
    <Base className="peka-page">
      <h1>PEKA</h1>

      {!data ? <BarLoader color="#6353C6" /> : (
        <>
          <div className="peka-panel">
            <div className="color-map" style={{
                background: `linear-gradient(90deg, ${data.colors.join(", ")})`
            }}><div className="start">{data.min}</div><div className="end">{data.max}</div></div>
            <div className="zoom">
              <div className={cellSize === zooms[0] ? "disabled zoom-out" : "zoom-out"} onClick={() => zoom(false)}>-</div>
              <div className={cellSize === zooms[zooms.length - 1] ? "disabled zoom-in" : "zoom-in"} onClick={() => zoom(true)}>+</div>
            </div>
          </div>
          <div className="canvas" style={{gridTemplateColumns: `${sequencesWidth}px 1fr`}}>
            <div className="sequences" style={{
              paddingTop: proteinsHeight, width: sequencesWidth
            }}>
              {data && data.sequences.map(sequence => (
                <div className="sequence" key={sequence} style={{
                  height: cellSize, fontSize: cellSize * 0.75, opacity: cellSize >= 8 ? 1 : 0
                }}>{sequence}</div> 
              ))}
            </div>
            <div className="right-column">
              <div ref={proteinsRef} className="proteins" style={{
                gridTemplateColumns: data ? `repeat(${data.proteins.length}, ${cellSize}px)` : "",
                height: proteinsHeight
              }}>
                {cellSize >= 8 && data && data.proteins.map(protein => (
                  <div className="protein" key={protein} style={{
                    height: cellSize, width: proteinsHeight,
                    left: (proteinsHeight - cellSize) / -2, fontSize: cellSize * 0.75,
                    top: (proteinsHeight - cellSize) / 2
                  }}>{protein}</div>
                ))}
                <canvas onMouseMove={mouseMove} ref={canvasRef}  data-tip data-for="canvasTooltip" style={{top: proteinsHeight - cellSize}}/>
              </div>
            </div>
            
            <ReactTooltip id="canvasTooltip">
              {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : "PEKA"}
            </ReactTooltip>
          </div>
        </>
      )}
    </Base>
  );
};

PekaPage.propTypes = {
    
};

export default PekaPage;