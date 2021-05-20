import React from "react";
import { useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import { COMMANDS } from "../queries";
import Base from "./Base";
import { Link } from "react-router-dom";

const AnalysisPage = () => {

  useDocumentTitle("iMaps - Run Analysis");

  const { loading, data } = useQuery(COMMANDS);

  if (loading) return <Base className="analysis-page" loading={true} />

  const commands = [...data.commands];
  commands.sort((c1, c2) => c1.name.toLowerCase() < c2.name.toLowerCase() ? -1 : 1);

  const categories = [...new Set(commands.map(command => command.category))];
  categories.sort((c1, c2) => c1.toLowerCase() < c2.toLowerCase() ? -1 : 1);
  const slugs = commands.reduce((prev, curr) => ({...prev, [curr.slug]: curr}), {})
  const dataUpload = ["upload-iclip-annotation", "upload-fastq-single"].map(slug => slugs[slug]);
  const completeWorkflows = ["workflow-icount-demultiplex"].map(slug => slugs[slug]);
  const otherPipelines = [
    "workflow-icount", "workflow-icount-alternative",
    "workflow-icount-group-analysis", "workflow-icount-resequencing"
  ].map(slug => slugs[slug]);
  const preprocess = ["icount-segment", "icount-xlsites"].map(slug => slugs[slug]);
  const analyse = [
    "icount-annotate", "icount-clusters", "icount-group", "icount-peaks",
    "paraclu", "icount-summary", "icount-rnamaps", "kmers"
  ].map(slug => slugs[slug]);
  
  

  return (
    <Base className="analysis-page">
      <h1>Analysis</h1>

      <h2>Workflows</h2>
      <div className="category">
        <h3>Upload data</h3>
        {dataUpload.map(command => (
          <div key={command.name} className="command">
            <h4><Link to={`/commands/${command.id}/`}>{command.name}</Link></h4>
          </div>
        ))}
      </div>
      <div className="category">
        <h3>Complete workflow</h3>
        {completeWorkflows.map(command => (
          <div key={command.name} className="command">
            <h4><Link to={`/commands/${command.id}/`}>{command.name}</Link></h4>
          </div>
        ))}
      </div>
      <div className="category">
        <h3>Other iCount pipelines</h3>
        {otherPipelines.map(command => (
          <div key={command.name} className="command">
            <h4><Link to={`/commands/${command.id}/`}>{command.name}</Link></h4>
          </div>
        ))}
      </div>

      <h2>Other iCount pipelines</h2>
      <div className="category">
        <h3>Preprocess</h3>
        {preprocess.map(command => (
          <div key={command.name} className="command">
            <h4><Link to={`/commands/${command.id}/`}>{command.name}</Link></h4>
          </div>
        ))}
      </div>
      <div className="category">
        <h3>Analyse</h3>
        {analyse.map(command => (
          <div key={command.name} className="command">
            <h4><Link to={`/commands/${command.id}/`}>{command.name}</Link></h4>
          </div>
        ))}
      </div>

      <h2>Tool Catalogue</h2>
      {categories.map(category => (
        <div className="category" key={category}>
          <h3>{category}</h3>
          {commands.filter(command => command.category === category).map(command => (
            <div key={command.name} className="command">
              <h4><Link to={`/commands/${command.id}/`}>{command.name}</Link></h4>
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