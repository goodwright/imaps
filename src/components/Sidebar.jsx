import React from "react";
import { Link } from "react-router-dom";
import UserSummary from "./UserSummary";
import goodwright from "../images/goodwright.svg";

const Sidebar = props => {
  return (
    <div className="sidebar">
      <UserSummary />
      <div className="goodwright">
        <a href="https://goodwright.org"><img src={goodwright} alt="goodwright" /></a>
        <div className="links">
          <Link to="/privacy/">Privacy Policy</Link>
          <Link to="/terms/">Terms of Use</Link>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  
};

export default Sidebar;