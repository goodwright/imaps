import React, { useState } from "react";
import Logo from "./Logo";
import searchIcon from "../images/searchIcon.svg"
import MiniLogo from "./MinoLogo";

const Nav = props => {

  const [searchText, setSearchText] = useState("");

  return (
    <nav>
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
          <button className="signup-button primary-button">Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

Nav.propTypes = {
  
};

export default Nav;