import React from "react";
import { useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import { COMMANDS } from "../queries";
import Base from "./Base";

const AnalysisPage = () => {

  useDocumentTitle("iMaps - Run Analysis");

  const { loading, data } = useQuery(COMMANDS);

  if (loading) return <Base className="analysis-page" loading={true} />

  const commands = [...data.commands];
  commands.sort((c1, c2) => c1.name.toLowerCase() < c2.name.toLowerCase() ? -1 : 1);

  const categories = [...new Set(commands.map(command => command.category))];
  categories.sort((c1, c2) => c1.toLowerCase() < c2.toLowerCase() ? -1 : 1);

  const iCountCommands = commands.filter(command => command.category.includes("icount"));
  console.log(iCountCommands)

  return (
    <Base className="analysis-page">
      <h1>Analysis</h1>

      <h2>Workflows</h2>
      <div className="category">
        <h3>Upload data</h3>
        <div className="command"><h4>Upload iCount sample annotation</h4></div>
        <div className="command"><h4>FASTQ file (single-end)</h4></div>
      </div>
      <div className="category">
        <h3>Complete workflow</h3>
        <div className="command"><h4>iCount demultiplex and analyse</h4></div>
      </div>
      <div className="category">
        <h3>Other iCount pipelines</h3>
        <div className="command"><h4>iCount Primary Analysis</h4></div>
        <div className="command"><h4>iCount Primary Analysis (Consensus mapping)</h4></div>
        <div className="command"><h4>iCount Group Analysis</h4></div>
        <div className="command"><h4>Analyse resequences sample</h4></div>
      </div>

      <h2>Other iCount pipelines</h2>
      <div className="category">
        <h3>Preprocess</h3>
        <div className="command"><h4>iCount segment</h4></div>
        <div className="command"><h4>iCount xlsites</h4></div>
      </div>
      <div className="category">
        <h3>Analyse</h3>
        <div className="command"><h4>iCount annotate</h4></div>
        <div className="command"><h4>iCount clusters</h4></div>
        <div className="command"><h4>iCount group</h4></div>
        <div className="command"><h4>iCount peaks</h4></div>
        <div className="command"><h4>Paraclu</h4></div>
        <div className="command"><h4>iCount summary</h4></div>
        <div className="command"><h4>iCount RNA-maps</h4></div>
        <div className="command"><h4>PEKA</h4></div>
      </div>

      <h2>Tool Catalogue</h2>
      {categories.map(category => (
        <div className="category" key={category}>
          <h3>{category}</h3>
          {commands.filter(command => command.category === category).map(command => (
            <div key={command.name} className="command">
              <h4>{command.name}</h4>
            </div>
          ))}
        </div>
      ))}
    </Base>
  );
};

AnalysisPage.propTypes = {
  
};

export default AnalysisPage;