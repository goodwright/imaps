import React from "react";
import PropTypes from "prop-types";
import Logo from "./Logo";

const Nav = props => {
  return (
    <nav>
      <div className="logo"><Logo /></div>
      <div className="nav-main">
        <input />
        <div className="auth-links">
          <button>Log In</button>
          <button>Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

Nav.propTypes = {
  
};

export default Nav;