import React, {useEffect } from "react";
import Div100vh from "react-div-100vh";
import Logo from "../components/Logo";

const PageNotFound = () => {

  useEffect(() => {
    document.title = "iMaps - Page Not Found";
  });

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