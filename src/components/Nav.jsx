import React, { useState } from "react";
import Logo from "./Logo";
import searchIcon from "../images/searchIcon.svg"

const Nav = props => {

  const [searchText, setSearchText] = useState("");

  return (
    <nav>
      <div className="logo"><Logo /></div>
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