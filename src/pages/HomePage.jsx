import React from "react";
import useDocumentTitle from "@rehooks/document-title";
import Base from "./Base";

const HomePage = () => {

  useDocumentTitle("iMaps");
  

  return (
    <Base className="home-page">
      iMaps
    </Base>
  );
};

HomePage.propTypes = {
    
};

export default HomePage;