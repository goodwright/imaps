import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Logo from "./Logo";
import MiniLogo from "./MinoLogo";
import searchIcon from "../images/searchIcon.svg"

const Nav = props => {

  const [searchText, setSearchText] = useState("");
  const [showContent, setShowContent] = useState(false);

  const className = classNames({"show-content": showContent});

  useEffect(() => {
    const menuToggle = () => {
      setShowContent(false);
    };

    window.addEventListener("resize", menuToggle);
    return () => {
      window.removeEventListener("resize", menuToggle);
    }
  })

  return (
    <nav className={className}>
      <div className="logo-container"><Logo /><MiniLogo /></div>
      <div className="nav-main">
        <div className="input-icon">
          <img src={searchIcon} className="icon" />
          <input
            className="search"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Search"
          />
        </div>
        <div className="auth-buttons">
          <button className="login-button">Log In</button>
          <Link className="button signup-button primary-button" to="/signup/">Sign Up</Link>
        </div>
      </div>
      <div className="menu-icon" onClick={() => setShowContent(!showContent)}>
        <div className="menu-icon-bar"></div>
        <div className="menu-icon-bar"></div>
        <div className="menu-icon-bar"></div>
      </div>
    </nav>
  );
};

Nav.propTypes = {
  
};

export default Nav;