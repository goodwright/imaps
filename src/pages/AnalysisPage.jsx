import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import Select from "react-select";
import { COMMANDS } from "../queries";
import Base from "./Base";
import { Link } from "react-router-dom";

const AnalysisPage = () => {

  useDocumentTitle("iMaps - Run Analysis");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const { loading, data } = useQuery(COMMANDS);

  if (loading) return <Base className="analysis-page" loading={true} />

  const commands = [...data.commands];
  commands.sort((c1, c2) => c1.name.toLowerCase() < c2.name.toLowerCase() ? -1 : 1);

  const collectionOptions = data.user.ownedCollections.map(collection => ({
    label: collection.name, value: collection.id
  }))

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

  const makeUrl = command => `/commands/${command.id}${selectedCollection ? "?collection=" : "/"}${selectedCollection || ""}`
  
  

  return (
    <Base className="analysis-page">
      <h1>Analysis</h1>

      <div className="collection">
        <label className="collection-label">Select a Collection to perform the analysis within (or leave blank to work outside the context of a collection).</label>
        <Select
          options={collectionOptions}
          value={collectionOptions.filter(c => c.value === selectedCollection)[0]}
          onChange={({value}) => setSelectedCollection(value)}
          placeholder="Select a collection..."
          className="react-select"
          classNamePrefix="react-select"
        />
      </div>

      <div className="commands">
        <div className="column">
          <h2>Workflows</h2>
          <div className="category">
            <h3>Upload data</h3>
            {dataUpload.map(command => (
              <div key={command.name} className="command">
                <h4><Link to={makeUrl(command)}>{command.name}</Link></h4>
              </div>
            ))}
          </div>
          <div className="category">
            <h3>Complete workflow</h3>
            {completeWorkflows.map(command => (
              <div key={command.name} className="command">
                <h4><Link to={makeUrl(command)}>{command.name}</Link></h4>
              </div>
            ))}
          </div>
          <div className="category">
            <h3>Other iCount pipelines</h3>
            {otherPipelines.map(command => (
              <div key={command.name} className="command">
                <h4><Link to={makeUrl(command)}>{command.name}</Link></h4>
              </div>
            ))}
          </div>
        </div>

        <div className="column">
          <h2>Other iCount pipelines</h2>
          <div className="category">
            <h3>Preprocess</h3>
            {preprocess.map(command => (
              <div key={command.name} className="command">
                <h4><Link to={makeUrl(command)}>{command.name}</Link></h4>
              </div>
            ))}
          </div>
          <div className="category">
            <h3>Analyse</h3>
            {analyse.map(command => (
              <div key={command.name} className="command">
                <h4><Link to={makeUrl(command)}>{command.name}</Link></h4>
              </div>
            ))}
          </div>
        </div>
      </div>

    </Base>
  );
};

AnalysisPage.propTypes = {
  
};

export default AnalysisPage;