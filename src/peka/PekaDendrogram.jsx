import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PekaDendrogram = props => {

  const { data, cellSize, labelHeight, offset } = props;

  const colCount = data.labels.length;
  const canvasRef = useRef(null);
  const lineHeight = cellSize;

  useEffect(() => {
    const nodes = [];
    for (let link of data.linkage_matrix) {
      const node = {};
      if (link[0] <= data.linkage_matrix.length) {
        node.left = link[0];
        node.x1 = (link[0]) * cellSize + (cellSize / 2)
        node.y1 = 0;
      } else {
        node.left = nodes[link[0] - 1 - data.linkage_matrix.length];
        node.left.parent = node;
        node.x1 = (node.left.x1 + node.left.x2) / 2;
        node.y1 = node.left.y;
      }
      if (link[1] <= data.linkage_matrix.length) {
        node.right = link[1];
        node.x2 = (link[1]) * cellSize + (cellSize / 2);
        node.y2 = 0;
      } else {
        node.right = nodes[link[1] - 1 - data.linkage_matrix.length];
        node.right.parent = node;
        node.x2 = (node.right.x1 + node.right.x2) / 2;
        node.y2 = node.right.y;
      }
      node.y = (Math.max(node.y1, node.y2) + lineHeight)
      node.separateClusters = link[2] > data.color_threshold;
      node.childCount = link[3];
      node.level = Math.max((node.left.level || 0), (node.right.level || 0)) + 1;
      nodes.push(node);
    }
    nodes.sort((a, b) => b.x1 - a.x1)
    const clusters = nodes.filter(node => (
      !node.separateClusters && node.parent && node.parent.separateClusters
    ));
    for (let c = 0; c < clusters.length; c++) {
      clusters[c].color = data.link_color_palette[c % 6];
    }
    const height = Math.max(...nodes.map(node => node.level)) * lineHeight;
    const canvas = canvasRef.current;
    canvas.width = cellSize * colCount;
    canvas.height = height;
    const context = canvas.getContext("2d");
    for (let node of nodes) {
      let color = node.color || "#000000";
      let parent = node.parent;
      while (parent) {
        if (parent.color) {
          color = parent.color;
          break;
        }
        parent = parent.parent;
      }
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(node.x1 + 0.5, height - node.y1+ 1.5);
      context.lineTo(node.x1 + 0.5, height - node.y+ 1.5);
      context.lineTo(node.x2 + 0.5, height - node.y+ 1.5);
      context.lineTo(node.x2 + 0.5, height - node.y2+ 1.5);
      context.stroke();
      context.closePath();
    }
    canvasRef.current.parentNode.style.height = labelHeight + height + "px";
    canvasRef.current.parentNode.style.width = `${window.innerWidth - canvas.getBoundingClientRect().left}px`;

  }, [data, cellSize, labelHeight, offset, colCount, lineHeight])


  return (
    <div className="peka-dendrogram" style={{
      width: cellSize * colCount, marginLeft: offset
    }}>
      <canvas ref={canvasRef} />
      {cellSize >= 6 && (
        <div className="proteins" style={{
          fontSize: cellSize * 0.75, width: labelHeight - 4, top: labelHeight - 4
        }}>
          {data.labels.map(label => (
            <Link key={label} className="protein" to={`/apps/peka?rbp=${label}`} style={{
              height: cellSize
            }}>{label}</Link>
          ))}
        </div>
      )}
    </div>
  );
};

PekaDendrogram.propTypes = {
  data: PropTypes.object.isRequired,
  cellSize: PropTypes.number.isRequired,
  labelHeight: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
};

export default PekaDendrogram;