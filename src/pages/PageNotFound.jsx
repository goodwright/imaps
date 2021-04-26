import React from "react";
import useDocumentTitle from "@rehooks/document-title";
import Div100vh from "react-div-100vh";
import Logo from "../components/Logo";

const PageNotFound = () => {

  useDocumentTitle("iMaps - Page Not Found");

  return (
    <Div100vh className="page-not-found">
      <Logo />
      <h1>Page Not Found</h1>
    </Div100vh>
  );
};

PageNotFound.propTypes = {
  
};

export default PageNotFound;