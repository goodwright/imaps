import React from "react";
import PropTypes from "prop-types";
import Div100vh from "react-div-100vh";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";

const Base = props => {
  /**
   * Provides the basic logged in layout.
   */

  return (
    <Div100vh className="base">
      <Nav />
      <Sidebar />
      <main className={props.className}>
        {props.children}
      </main>
    </Div100vh>
  )
};

Base.propTypes = {
  
};

export default Base;