import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import ReactTooltip from "react-tooltip";
import PekaDendrogram from "./PekaDendrogram";
import roundTo from "round-to";
import { getApiLocation } from "../api";

const PekaHeatmap = () => {

  const [data, setData] = useState(null);
  const [cellSize, setCellSize] = useState(6);
  const zooms = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];
  const [hoveredCell, setHoveredCell] = useState("");

  const canvasRef = useRef(null);
  const similarityRef = useRef(null);
  const ibaqRef = useRef(null);
  const recallRef = useRef(null);
  const intronsRef = useRef(null);
  const noncodingIdrRef = useRef(null);
  const totalIdrRef = useRef(null);

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
    let canvas = canvasRef.current;
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

    for (let map of [
      ["similarity", similarityRef], ["iBAQ", ibaqRef], ["recall", recallRef],
      ["introns", intronsRef], ["noncoding_IDR", noncodingIdrRef], ["total_IDR", totalIdrRef]
    ]) {
      canvas = map[1].current;

      canvas.width = json[map[0]].columns.length * size;
      canvas.style.width = `${canvas.width}px`;
      canvas.height = secondaryHeight * json[map[0]].rows.length;
      canvas.style.height = `${canvas.height}px`;
      const context = canvas.getContext("2d");

      for (let rowNum = 0; rowNum < json[map[0]].matrix.length; rowNum++) {
        for (let colNum = 0; colNum < json[map[0]].matrix[rowNum].length; colNum++) {
          const cell = json[map[0]].matrix[rowNum][colNum];
          context.fillStyle = cell.color;
          context.beginPath();
          context.rect(colNum * size, rowNum * secondaryHeight, size, secondaryHeight);
          context.fill();
        }
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
    canvas.style.height = `${(data.matrix.length * newSize) + (6 * (secondaryHeight + secondaryGap)) + (2 * secondaryHeight)}px`;
    setCellSize(newSize);
    drawCanvas(data, newSize);
  }

  const mouseMove = (e) => {
    if (data) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const rowNum = Math.max(Math.floor((y - 1) / (cellSize)), 0);
      const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
      if (rowNum < data.rows.length && colNum < data.columns.length) {
        const cell = `${data.columns[colNum]} - ${data.rows[rowNum]}\n${data.matrix[rowNum][colNum].value}`
        setHoveredCell(cell);
      }
    }
  }

  const similarityMouseMove = e => {
    const canvas = similarityRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (secondaryHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
    const cell = `${data.similarity.columns[colNum]} - ${data.similarity.rows[rowNum]}\n${roundTo(data.similarity.matrix[rowNum][colNum].value, 2)}`
    setHoveredCell(cell);
  }
  const ibaqMouseMove = e => {
    const canvas = ibaqRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (secondaryHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
    const cell = `${data.iBAQ.columns[colNum]} - ${data.iBAQ.rows[rowNum]}\n${roundTo(data.iBAQ.matrix[rowNum][colNum].value, 2)}`
    setHoveredCell(cell);
  }
  const recallMouseMove = e => {
    const canvas = recallRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (secondaryHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
    const cell = `${data.recall.columns[colNum]} - ${data.recall.rows[rowNum]}\n${roundTo(data.recall.matrix[rowNum][colNum].value, 2)}`
    setHoveredCell(cell);
  }
  const intronsMouseMove = e => {
    const canvas = intronsRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (secondaryHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
    const cell = `${data.introns.columns[colNum]} - ${data.introns.rows[rowNum]}\n${roundTo(data.introns.matrix[rowNum][colNum].value, 2)}`
    setHoveredCell(cell);
  }
  const noncodingIdrMouseMove = e => {
    const canvas = noncodingIdrRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (secondaryHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
    const cell = `${data.noncoding_IDR.columns[colNum]} - ${data.noncoding_IDR.rows[rowNum]}\n${roundTo(data.noncoding_IDR.matrix[rowNum][colNum].value, 2)}`
    setHoveredCell(cell);
  }
  const totalIdrMouseMove = e => {
    const canvas = totalIdrRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (secondaryHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
    const cell = `${data.total_IDR.columns[colNum]} - ${data.total_IDR.rows[rowNum]}\n${roundTo(data.total_IDR.matrix[rowNum][colNum].value, 2)}`
    setHoveredCell(cell);
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

      {!data ? <BarLoader color="#6353C6" /> : (
        <div className="graphic">
          <div className="zoom">
            <div className={cellSize === zooms[0] ? "disabled zoom-out" : "zoom-out"} onClick={() => zoom(false)}>-</div>
            <div className={cellSize === zooms[zooms.length - 1] ? "disabled zoom-in" : "zoom-in"} onClick={() => zoom(true)}>+</div>
          </div>

          <PekaDendrogram 
            data={data.dendrogram} cellSize={cellSize} 
            labelHeight={proteinsHeight} offset={motifsWidth}
          />

          <div className="main-row">
            <div className="motifs" style={{
              width: motifsWidth,
            }}>
              {data.rows.map(motif => (
                <div className="motif" key={motif} style={{
                  fontSize: cellSize * 0.75, opacity: cellSize >= 6 ? 1 : 0,
                  height: cellSize, width: motifsWidth,
                }}>{motif}</div>
              ))}
            </div>

            <div className="heatmaps">
              <canvas ref={canvasRef} onMouseMove={mouseMove} data-tip data-for="canvasTooltip" />
              <canvas ref={similarityRef} onMouseMove={similarityMouseMove} data-tip data-for="similarityTooltip" />
              <canvas ref={ibaqRef} onMouseMove={ibaqMouseMove} data-tip data-for="ibaqTooltip" />
              <canvas ref={recallRef} onMouseMove={recallMouseMove} data-tip data-for="recallTooltip" />
              <canvas ref={intronsRef} onMouseMove={intronsMouseMove} data-tip data-for="intronsTooltip" />
              <canvas ref={noncodingIdrRef} onMouseMove={noncodingIdrMouseMove} data-tip data-for="noncodingIdrTooltip" />
              <canvas ref={totalIdrRef} onMouseMove={totalIdrMouseMove} data-tip data-for="totalIdrTooltip" />
              <ReactTooltip id="canvasTooltip">
                {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : ""}
              </ReactTooltip>
              <ReactTooltip id="similarityTooltip">
                {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : ""}
              </ReactTooltip>
              <ReactTooltip id="ibaqTooltip">
                {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : ""}
              </ReactTooltip>
              <ReactTooltip id="recallTooltip">
                {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : ""}
              </ReactTooltip>
              <ReactTooltip id="intronsTooltip">
                {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : ""}
              </ReactTooltip>
              <ReactTooltip id="noncodingIdrTooltip">
                {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : ""}
              </ReactTooltip>
              <ReactTooltip id="totalIdrTooltip">
                {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : ""}
              </ReactTooltip>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

PekaHeatmap.propTypes = {
  
};

export default PekaHeatmap;