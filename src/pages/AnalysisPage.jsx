import React from "react";
import { useDocumentTitle } from "../hooks";
import Base from "./Base";

const AnalysisPage = () => {

  useDocumentTitle("iMaps - Run Analysis");
  
  return (
    <Base>
      <h1>Analysis</h1>
      <p className="font-light max-w-4xl mt-8 bg-gray-50 shadow p-2 rounded italic">
        This is the page for running new analyses and uploading new data to
        iMaps. While iMaps is undergoing its redevelopment, this functionality
        is not yet available. Check back over July and August 2021 as we
        integrate our new Nextflow Pipelines into the system. In the meantime,
        analysis can still be performed on the&nbsp;
        <a href="https://imaps.genialis.com/iclip">legacy iMaps</a>.
      </p>
    </Base>
  );
};

AnalysisPage.propTypes = {
  
};

export default AnalysisPage;