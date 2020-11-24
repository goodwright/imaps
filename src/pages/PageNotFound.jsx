import React from "react";
import Div100vh from "react-div-100vh";
import Logo from "../components/Logo";

const PageNotFound = props => {
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