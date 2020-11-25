import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import classNames from "classnames";
import Logo from "./Logo";
import MiniLogo from "./MinoLogo";
import menuIcon from  "../images/menu-icon.svg";
import searchIcon from "../images/searchIcon.svg";
import { UserContext } from "../contexts";
import { LOGOUT } from "../mutations";
import { useMutation } from "@apollo/client";
import { ClipLoader } from "react-spinners";

const Nav = () => {

  const [searchText, setSearchText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const dropdownElement = useRef(null);
  const location = useLocation();
  const history = useHistory();

  const iconClicked = e => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  }

  const clickOutside = e => {
    if (dropdownElement.current && !dropdownElement.current.contains(e.target)) {
      setShowDropdown(false);
    }
  }

  const [logout, logoutMutation] = useMutation(LOGOUT, {
    onCompleted: () => {
      setUser(false);
      if (["/settings/"].includes(location.pathname)) {
        history.push("/");
      }
    }
  });

  useEffect(() => {
    const menuToggle = () => {
      setShowContent(false);
    };

    window.addEventListener("resize", menuToggle);
    window.addEventListener("click", clickOutside);
    return () => {
      window.removeEventListener("resize", menuToggle);
    }
  })

  const className = classNames({
    "show-content": showContent, "show-dropdown": showDropdown,
    "logging-out": logoutMutation.loading
  });

  return (
    <nav className={className}>
      <div className="logo-container"><Logo /><MiniLogo /></div>

      <div className="nav-main">
        <div className="input-icon">
          <img src={searchIcon} className="icon" alt="" />
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

      {user && (
        <div ref={dropdownElement} className="nav-dropdown-container">
          <img src={menuIcon} alt="menu" onClick={iconClicked} className="user-icon" />
          <div className="dropdown">
            {logoutMutation.loading && <ClipLoader size="40px" color="#6353C6" />}
            <Link className="option" to="/settings/">
              User Settings
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11.949 9.050C11.187 8.287 10.279 7.723 9.289
                7.381C10.350 6.651 11.046 5.429 11.046 4.046C11.046
                1.815 9.231 0 7 0C4.768 0 2.953 1.815 2.953
                4.046C2.953 5.429 3.649 6.651 4.710 7.381C3.720
                7.723 2.812 8.287 2.050 9.050C0.728 10.372 0
                12.130 0 14H1.093C1.093 10.743 3.743 8.093 7
                8.093C10.256 8.093 12.906 10.743 12.906 14H14C14 12.130
                13.271 10.372 11.949 9.050ZM7 7C5.371 7 4.046 5.675
                4.046 4.046C4.046 2.418 5.371 1.093 7 1.093C8.628
                1.093 9.953 2.418 9.953 4.046C9.953 5.675 8.628
                7 7 7Z" />
              </svg>
            </Link>
            <div className="option" onClick={logout}>
              Log Out
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9.871 10.718V11.812C9.871 13.018 8.890 14 7.683
                14H2.187C0.981 14 0 13.018 0 11.812V2.187C0 0.981 0.981 0 2.187
                0H7.683C8.890 0 9.871 0.981 9.871 2.187V3.281C9.871 3.583 9.626
                3.828 9.324 3.828C9.022 3.828 8.777 3.583 8.777
                3.281V2.187C8.777 1.584 8.287 1.093 7.683 1.093H2.187C1.584
                1.093 1.093 1.584 1.093 2.187V11.812C1.093 12.415 1.584 12.906
                2.187 12.906H7.683C8.287 12.906 8.777 12.415 8.777
                11.812V10.718C8.777 10.416 9.022 10.171 9.324 10.171C9.626
                10.171 9.871 10.416 9.871 10.718ZM13.600 6.060L12.375
                4.836C12.161 4.622 11.815 4.622 11.602 4.836C11.388 5.049 11.388
                5.395 11.602 5.609L12.473 6.480H5.906C5.604 6.480 5.359 6.725
                5.359 7.027C5.359 7.329 5.604 7.574 5.906 7.574H12.473L11.602
                8.445C11.388 8.658 11.388 9.005 11.602 9.218C11.708 9.325 11.848
                9.378 11.988 9.378C12.128 9.378 12.268 9.325 12.375 9.218L13.600
                7.994C14.133 7.461 14.133 6.593 13.600 6.060Z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

Nav.propTypes = {
  
};

export default Nav;