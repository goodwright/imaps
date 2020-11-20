import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Logo from "./Logo";
import MiniLogo from "./MinoLogo";
import menuIcon from  "../images/menu-icon.svg";
import searchIcon from "../images/searchIcon.svg";
import { UserContext } from "../contexts";

const Nav = () => {

  const [searchText, setSearchText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const user = useContext(UserContext);
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
        {!user && <div className="auth-buttons">
          <Link className="button login-button" to="/login/">Log In</Link>
          <Link className="button signup-button primary-button" to="/signup/">Sign Up</Link>
        </div>}
      </div>
      {!user && <div className="menu-icon" onClick={() => setShowContent(!showContent)}>
        <div className="menu-icon-bar"></div>
        <div className="menu-icon-bar"></div>
        <div className="menu-icon-bar"></div>
      </div>}
      {user && <img src={menuIcon} />}
    </nav>
  );
};

Nav.propTypes = {
  
};

export default Nav;