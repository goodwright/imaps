import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import ReactTooltip from "react-tooltip";
import ScrollContainer from "react-indiana-drag-scroll";
import PekaDendrogram from "./PekaDendrogram";
import PekaControls from "./PekaControls";
import roundTo from "round-to";
import { getApiLocation } from "../api";

const PekaHeatmap = props => {

  const [data, setData] = useState(null);
  const { download } = props;
  const [cellSize, setCellSize] = useState(6);
  const zooms = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];
  const [hoveredCell, setHoveredCell] = useState(" ");
  const [truncated, setTruncated] = useState(true);
  const [showSimilarity, setShowSimilarity] = useState(true);
  const [showIBAQ, setShowIBAQ] = useState(true);
  const [showRecall, setShowRecall] = useState(true);
  const [showIntrons, setShowIntrons] = useState(true);
  const [showNoncodingIDR, setShowNoncodingIDR] = useState(true);
  const [showTotalIDR, setShowTotalIDR] = useState(true);
  const [visibleHeight, setVisibleHeight] = useState(0);
  const canvasRef = useRef(null);
  const similarityRef = useRef(null);
  const ibaqRef = useRef(null);
  const recallRef = useRef(null);
  const intronsRef = useRef(null);
  const noncodingIdrRef = useRef(null);
  const totalIdrRef = useRef(null);

  const changeHeight = () => {
    const height = Math.max(0, window.innerHeight - canvasRef.current.getBoundingClientRect().top - 12)
    setVisibleHeight(height);
  }

  // Get data
  useEffect(() => {
    window.addEventListener("resize", changeHeight);
    const main = document.querySelector("main");
    main.addEventListener("scroll", changeHeight);
    fetch(
      getApiLocation().replace("graphql", "peka/")
    ).then(resp => resp.json()).then(json => {
      setData(json);
      drawCanvas(json, cellSize);
    })
    setTimeout(changeHeight, 1000)
    return () => {
      window.removeEventListener("resize", changeHeight);
      main.removeEventListener("scroll", changeHeight);
    }
  }, [cellSize])

  const drawCanvas = (json, size) => {
    let canvas = canvasRef.current;
    canvas.width = json.matrix[0].length * size;
    canvas.style.width = `${canvas.width}px`;
    canvas.height = json.matrix.length * size;
    canvas.style.height = `${canvas.height}px`;
    canvas.parentNode.parentNode.parentNode.style.gridTemplateColumns = `${size >= 6 ? size * 6 : 0}px ${canvas.width}px 100px`
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
    const value = data.similarity.matrix[rowNum][colNum].value === null ? "N/A" : roundTo(data.similarity.matrix[rowNum][colNum].value, 2)
    const cell = `${data.similarity.columns[colNum]} - ${data.similarity.rows[rowNum]}\n${value}`
    setHoveredCell(cell);
  }
  const ibaqMouseMove = e => {
    const canvas = ibaqRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (secondaryHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
    const value = data.iBAQ.matrix[rowNum][colNum].value === null ? "N/A" : power(roundTo(data.iBAQ.matrix[rowNum][colNum].value, 2), true)
    const cell = `${data.iBAQ.columns[colNum]} - ${data.iBAQ.rows[rowNum]}\n${value}`
    setHoveredCell(cell);
  }
  const recallMouseMove = e => {
    const canvas = recallRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (secondaryHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
    const value = data.recall.matrix[rowNum][colNum].value === null ? "N/A" : roundTo(data.recall.matrix[rowNum][colNum].value, 2)
    const cell = `${data.recall.columns[colNum]} - ${data.recall.rows[rowNum]}\n${value}`
    setHoveredCell(cell);
  }
  const intronsMouseMove = e => {
    const canvas = intronsRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (secondaryHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
    const value = data.introns.matrix[rowNum][colNum].value === null ? "N/A" : roundTo(data.introns.matrix[rowNum][colNum].value, 2)
    const cell = `${data.introns.columns[colNum]} - ${data.introns.rows[rowNum]}\n${value}`
    setHoveredCell(cell);
  }
  const noncodingIdrMouseMove = e => {
    const canvas = noncodingIdrRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (secondaryHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
    const value = data.noncoding_IDR.matrix[rowNum][colNum].value === null ? "N/A" : roundTo(data.noncoding_IDR.matrix[rowNum][colNum].value, 2)
    const cell = `${data.noncoding_IDR.columns[colNum]} - ${data.noncoding_IDR.rows[rowNum]}\n${value}`
    setHoveredCell(cell);
  }
  const totalIdrMouseMove = e => {
    const canvas = totalIdrRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const rowNum = Math.max(Math.floor((y - 1) / (secondaryHeight)), 0);
    const colNum = Math.max(Math.floor((x - 1) / cellSize), 0);
    const value = data.total_IDR.matrix[rowNum][colNum].value === null ? "N/A" : data.total_IDR.matrix[rowNum][colNum].value.toLocaleString()
    const cell = `${data.total_IDR.columns[colNum]} - ${data.total_IDR.rows[rowNum]}\n${value}`
    setHoveredCell(cell);
  }

  const power = (n, isString) => {
    const sup = Math.floor(Math.log10(n));
    const num = roundTo(n / (10 ** sup), 3);
    if (isString) return `${num} × 10**${sup}`
    if (Math.log10(n) === sup) {
      return <div>10<sup>{sup}</sup></div>
    } else {
      return <div>{num} × 10<sup>{sup}</sup></div>
    }
  }

  const proteinsHeight = cellSize >= 6 ? cellSize * 7 : 0;
  const motifsWidth = cellSize >= 6 ? cellSize * 6 : 0;
  const secondaryHeight = 30;
  const secondaryGap = 15;

  return (
    <div className="peka-heatmap">
      <h2>Heatmap <button onClick={() => download(data, "peka")}>Download Data</button></h2>
      
      <div className="peka-sub-text">
        <p>
          Heatmap shows the rank of 5-mers for 223 eCLIP datasets produced in either
          K562 or HepG2 cell lines, encompassing a total of 150 distinct proteins.
          Datasets are hierarchically clustered based on the similarity of motif ranks.
        </p>
        <p>
          Supplementary data is shown in heatmaps below:
        </p>
        <ul>
          <li><strong>Similarity</strong> score reports how much the top motif ranks of a specific dataset match those of all other datasets.</li>
          <li><strong>Recall</strong> measures the overlap of top motifs in each eCLIP dataset to its orthogonal in vitro dataset (RNA Bind-N-Seq or RNAcompete).</li>
          <li><strong>log2FC eRIC</strong> shows the log2-fold change in crosslinked over non-crosslinked samples of the proteins identified by enhanced RNA Interactome Capture (eRIC) in proliferating Jurkat cells <a href="https://paperpile.com/c/KEAU9t/E2nI">(Perez-Perri et al. 2018)</a>.</li>
          <li><strong>tXn per region (%)</strong> shows the percentage of high-confidence crosslink sites (tXn) for each RBP within introns, 3’ UTRs and other exonic regions of protein-coding genes (coding+5’UTRs).</li>
          <li><strong>% noncoding peaks</strong> shows the proportion of IDR (irreproducible discovery rate) peaks (as available for eCLIP datasets from (<a href="https://paperpile.com/c/KEAU9t/akVJ">Van Nostrand et al. 2020</a>)) in non-coding regions of the transcriptome (noncoding_exon, noncoding_5ss, noncoding_3ss, noncoding_proxintron, noncoding_distintron).</li>
          <li><strong>total number of peaks</strong> shows the total number of IDR peaks available for each dataset.</li>
        </ul>
      </div>

      {!data ? <BarLoader color="#6353C6" css="margin: 64px auto" /> : (
        <div className="graphic">

          <PekaControls
            cellSize={cellSize} zoom={zoom} zooms={zooms}
            truncated={truncated} setTruncated={setTruncated}
            showSimilarity={showSimilarity} setShowSimilarity={setShowSimilarity}
            showIBAQ={showIBAQ} setShowIBAQ={setShowIBAQ}
            showRecall={showRecall} setShowRecall={setShowRecall}
            showIntrons={showIntrons} setShowIntrons={setShowIntrons}
            showNoncodingIDR={showNoncodingIDR} setShowNoncodingIDR={setShowNoncodingIDR}
            showTotalIDR={showTotalIDR} setShowTotalIDR={setShowTotalIDR}
          />

          <ScrollContainer className="scrollable-graphic">

            <PekaDendrogram 
              data={data.dendrogram} cellSize={cellSize} 
              labelHeight={proteinsHeight} offset={motifsWidth}
            />

            <ScrollContainer className="main-row" style={{
              width: motifsWidth + (cellSize * data.matrix[0].length) + 100,
              height: truncated ? "auto": visibleHeight,
              overflow: truncated ? undefined : "scroll"
            }}>
              <div className="motifs" style={{
                width: motifsWidth, height: truncated ? 400 : "auto"
              }}>
                {data.rows.map(motif => (
                  <Link className="motif" key={motif} style={{
                    fontSize: cellSize * 0.75, opacity: cellSize >= 6 ? 1 : 0,
                    height: cellSize, lineHeight: cellSize, width: motifsWidth,
                  }} to={`/apps/peka?motif=${motif}`}>{motif}</Link>
                ))}
              </div>

              <div className={cellSize < 4 ? "small-maps heatmaps" : "heatmaps"}>
                <div className="canvas-container" style={truncated ? {height: 400, overflow: "hidden"} : null}>
                  <canvas ref={canvasRef} onMouseMove={mouseMove} data-tip data-for="canvasTooltip" />
                </div>

                <div className="supplementary" style={{display: showSimilarity ? "block" : "none"}}>
                  <div className="map-info" style={{display: cellSize < 3 ? "block" : ""}}>
                    <div className="horizontal-colors" style={{
                      background: `linear-gradient(90deg, black, white)`
                    }}>
                      <div className="values" style={{paddingRight: "20%"}}>
                        <div className="value">0</div>
                        <div className="value">0.2</div>
                        <div className="value">0.4</div>
                      </div>
                    </div>
                    <div className="map-name">Similarity</div>
                  </div>
                  <canvas ref={similarityRef} onMouseMove={similarityMouseMove} data-tip data-for="similarityTooltip" />
                </div>
                
                <div className="supplementary" style={{display: showIBAQ ? "block" : "none"}}>
                  <div className="map-info" style={{display: cellSize < 3 ? "block" : ""}}>
                    <div className="horizontal-colors" style={{
                      background: `linear-gradient(90deg, white, black)`
                    }}>
                      <div className="values" style={{justifyContent: "space-around", padding: "0 10px"}}>
                        <div className="value">10<sup>6</sup></div>
                        <div className="value">10<sup>7</sup></div>
                        <div className="value">10<sup>8</sup></div>
                        <div className="value">10<sup>9</sup></div>
                      </div>
                    </div>
                    <div className="map-name">iBAQ</div>
                  </div>
                  <canvas ref={ibaqRef} onMouseMove={ibaqMouseMove} data-tip data-for="ibaqTooltip" />
                </div>
                
                <div className="supplementary" style={{display: showRecall ? "block" : "none"}}>
                  <div className="map-info" style={{display: cellSize < 3 ? "block" : ""}}>
                    <div className="horizontal-colors" style={{
                      background: `linear-gradient(90deg, white, black)`
                    }}>
                      <div className="values">
                        <div className="value">0</div>
                        <div className="value">0.2</div>
                        <div className="value">0.4</div>
                        <div className="value">0.6</div>
                        <div className="value">0.8</div>
                        <div className="value">1.0</div>
                      </div>
                    </div>
                    <div className="map-name">Recall</div>
                  </div>
                  <canvas ref={recallRef} onMouseMove={recallMouseMove} data-tip data-for="recallTooltip" />
                </div>
                
                <div className="supplementary" style={{display: showIntrons ? "block" : "none"}}>
                  <div className="map-info" style={{display: cellSize < 3 ? "block" : ""}}>
                    <div className="horizontal-colors" style={{
                      background: `linear-gradient(90deg, white, black)`
                    }}>
                      <div className="values">
                        <div className="value">0</div>
                        <div className="value">20</div>
                        <div className="value">40</div>
                        <div className="value">60</div>
                        <div className="value">80</div>
                        <div className="value">100</div>
                      </div>
                    </div>
                    <div className="map-name">Percentage of thresholded crosslinks per region: {cellSize < 4 && <br />}3'UTR (top), intron (middle), 5'UTR + CDS (bottom)</div>
                  </div>
                  <canvas ref={intronsRef} onMouseMove={intronsMouseMove} data-tip data-for="intronsTooltip" />
                </div>
                
                <div className="supplementary" style={{display: showNoncodingIDR ? "block" : "none"}}>
                  <div className="map-info" style={{display: cellSize < 3 ? "block" : ""}}>
                    <div className="horizontal-colors" style={{
                      background: `linear-gradient(90deg, white, black)`
                    }}>
                      <div className="values">
                        <div className="value">0</div>
                        <div className="value">20</div>
                        <div className="value">40</div>
                        <div className="value">60</div>
                        <div className="value">80</div>
                        <div className="value">100</div>
                      </div>
                    </div>
                    <div className="map-name">% noncoding IDR peaks</div>
                  </div>
                  <canvas ref={noncodingIdrRef} onMouseMove={noncodingIdrMouseMove} data-tip data-for="noncodingIdrTooltip" />
                </div>
                
                <div className="supplementary" style={{display: showTotalIDR ? "block" : "none"}}>
                  <div className="map-info" style={{display: cellSize < 3 ? "block" : ""}}>
                    <div className="horizontal-colors" style={{
                      background: `linear-gradient(90deg, white, black)`
                    }}>
                      <div className="values" style={{paddingRight: "15%"}}>
                        <div className="value">10<sup>1</sup></div>
                        <div className="value">10<sup>2</sup></div>
                        <div className="value">10<sup>3</sup></div>
                        <div className="value">10<sup>4</sup></div>
                      </div>
                    </div>
                    <div className="map-name">total IDR peaks</div>
                  </div>
                  <canvas ref={totalIdrRef} onMouseMove={totalIdrMouseMove} data-tip data-for="totalIdrTooltip" />
                </div>
                
                <ReactTooltip id="canvasTooltip">
                  {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : ""}
                </ReactTooltip>
                <ReactTooltip id="similarityTooltip">
                  {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>{t}</div>) : ""}
                </ReactTooltip>
                <ReactTooltip id="ibaqTooltip">
                  {hoveredCell ? hoveredCell.split("\n").map((t, i) => <div key={i}>
                    {t.includes("**") ? <div>{t.split("**")[0]}<sup>{t.split("**")[1]}</sup></div> : t}
                  </div>) : ""}
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

              <div className="colors" style={{
                background: `linear-gradient(${data.colors.join(", ")})`
              }}>
                {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(val => (
                  <div className="value" key={val}>{val}</div>
                ))}    
              </div>
            </ScrollContainer>
          </ScrollContainer>
        </div>
      )}
    </div>
  )
}

PekaHeatmap.propTypes = {
  
};

export default PekaHeatmap;