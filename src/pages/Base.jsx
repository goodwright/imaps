import React from "react";
import PropTypes from "prop-types";
import Div100vh from "react-div-100vh";
import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";

const Base = props => {
  /**
   * Provides the basic logged in layout.
   */

  const { className, blank } = props;

  let fullClassName = className;
  if (blank) fullClassName += " blank";

  return (
    <Div100vh className="base">
      <Nav />
      <Sidebar />
      <main className={fullClassName}>
        {props.children}
      </main>
    </Div100vh>
  )
};

Base.propTypes = {
  
};

export default Base;