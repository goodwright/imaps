import React, { useEffect, useState, useRef } from "react";
import ReactTooltip from "react-tooltip";
import { getApiLocation } from "../api";
import Base from "./Base";

const PekaPage = () => {

  useEffect(() => {
    document.title = "iMaps - PEKA";
  });

  const [hoveredCell, setHoveredCell] = useState(null);

  const canvasRef = useRef(null);
  const cellSize = 5;
  
  useEffect(() => {
    fetch(
      getApiLocation().replace("graphql", "peka/")
    ).then(resp => resp.json()).then(data => {
      const canvas = canvasRef.current;
      canvas.width = data.matrix[0].length * cellSize;
      canvas.height = data.matrix.length * cellSize;
      const context = canvas.getContext("2d");
      context.lineWidth = "0";
      for (let rowNum = 0; rowNum < data.matrix.length; rowNum++) {
        const row = data.matrix[rowNum];
        for (let colNum = 0; colNum < row.length; colNum++) {
          const cell = row[colNum];
          context.fillStyle = cell.color;
          context.beginPath();
          context.rect(colNum * cellSize, rowNum * cellSize, cellSize, cellSize);
          context.fill();
        }
      }
      const rect = canvas.getBoundingClientRect();
      canvas.addEventListener("mousemove", e => {
        
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const rowNum = Math.max(Math.floor((y - 1) / cellSize), 0);
        const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
        const cell = `${data.proteins[rowNum]} - ${data.sequences[colNum]}\n${data.matrix[rowNum][colNum].value}`
        setHoveredCell(cell);
      })
    })
  }, [])


  return (
    <Base className="peka-page">
      <h1>PEKA</h1>
      <canvas ref={canvasRef}  data-tip data-for="canvasTooltip" />
      <ReactTooltip id="canvasTooltip">
        {hoveredCell ? hoveredCell.split("\n").map(t => <div>{t}</div>) : ""}
      </ReactTooltip>
    </Base>
  );
};

PekaPage.propTypes = {
    
};

export default PekaPage;