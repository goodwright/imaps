import React from "react";
import PropTypes from "prop-types";
import UserSummary from "./UserSummary";
import goodwright from "../images/goodwright.svg";

const Sidebar = props => {
  return (
    <div className="sidebar">
      <UserSummary />
      <a className="goodwright" href="https://goodwright.org">
        <img src={goodwright} alt="goodwright" />
      </a>
    </div>
  );
};

Sidebar.propTypes = {
  
};

export default Sidebar;