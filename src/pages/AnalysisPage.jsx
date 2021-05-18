import React from "react";
import Base from "./Base";
import useDocumentTitle from "@rehooks/document-title";

const AnalysisPage = () => {

  useDocumentTitle("iMaps - Run Analysis");

  return (
    <Base className="analysis-page">
      <h1>Analysis</h1>
    </Base>
  );
};

AnalysisPage.propTypes = {
  
};

export default AnalysisPage;