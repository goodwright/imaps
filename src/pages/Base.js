import React from "react";
import PropTypes from "prop-types";
import Div100vh from "react-div-100vh";
import { Link } from "react-router-dom";

const Base = props => {
  /**
   * Provides the basic logged in layout.
   */

  return (
    <Div100vh className="base">
      <nav>
          <Link to="/">Home</Link>
          <Link to="/privacy/">Privacy Policy</Link>
      </nav>
      <main className={props.className}>
        {props.children}
      </main>
    </Div100vh>
  )
};

Base.propTypes = {
  
};

export default Base;