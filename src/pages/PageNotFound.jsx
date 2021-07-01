import React from "react";
import useDocumentTitle from "@rehooks/document-title";
import Div100vh from "react-div-100vh";
import Logo from "../components/Logo";

const PageNotFound = () => {

  useDocumentTitle("iMaps - Page Not Found");

  return (
    <Div100vh className="flex flex-col items-center justify-center">
      <Logo svgClassName="w-20 mb-6" />
      <h1 className="text-primary-100 font-light text-4xl mt-6">Page Not Found</h1>
    </Div100vh>
  );
};

PageNotFound.propTypes = {
  
};

export default PageNotFound;