import React, { useEffect } from "react";
import Base from "./Base";

const PekaPage = () => {

  useEffect(() => {
    document.title = "iMaps - PEKA";
  });

  return (
    <Base className="peka-page">
      <h1>PEKA</h1>
    </Base>
  );
};

PekaPage.propTypes = {
    
};

export default PekaPage;