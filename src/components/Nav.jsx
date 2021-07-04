import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useApolloClient, useMutation } from "@apollo/client";
import Logo from "./Logo";
import menuIcon from  "../images/menu-icon.svg";
import { UserContext } from "../contexts";
import { TOKEN } from "../queries";
import { LOGOUT } from "../mutations";
import SearchBar from "./SearchBar";
const colors = require("../colors").colors;

const Nav = () => {

  const [showContent, setShowContent] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const dropdownElement = useRef(null);
  const location = useLocation();
  const history = useHistory();
  const client = useApolloClient();

  const iconClicked = e => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  }

  const clickOutside = e => {
    if (dropdownElement.current && !dropdownElement.current.contains(e.target)) {
      setShowDropdown(false);
    }
  }

  const [logout,] = useMutation(LOGOUT, {
    onCompleted: () => {
      setUser(false);
      client.cache.writeQuery({query: TOKEN, data: {accessToken: null}});
      client.cache.reset();
      for (let path of [
        /\/settings\//, /\/@(.+?)\/edit\//, /\/user-collections\//,
        /\/collections\/new\//
      ]) {
        if (path.test(location.pathname)) {
          history.push("/");
          break;
        }
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

  return (
    <nav className="grid grid-cols-mob-base areas-nav sm:grid-cols-base">

      <div className="logo-container flex items-center">
        <Logo className="hidden mx-auto sm:block" svgClassName="h-9"/>
        <Logo className="mx-auto sm:hidden" svgClassName="h-9" hideChars={true} />
      </div>

      <div className="flex justify-between h-14">
        <SearchBar className="w-full max-w-md" />

        {!user && <div className="w-8 flex justify-center flex-col h-14 mr-3 cursor-pointer sm:hidden" onClick={() => setShowContent(!showContent)}>
          <div className="w-full h-px my-1 bg-primary-200"></div>
          <div className="w-full h-px my-1 bg-primary-200"></div>
          <div className="w-full h-px my-1 bg-primary-200"></div>
        </div>}

        {!user && <div className={`${showContent ? "absolute flex -mt-px left-0 w-screen py-2 justify-center right-0 top-14 bg-gray-100 w-full" : "hidden"} sm:flex items-center mr-3 font-medium`}>
          <Link className="btn-tertiary py-2 w-24 mr-3 hover:no-underline" to="/login/">Log In</Link>
          <Link className="btn-primary py-2 w-24 hover:no-underline" to="/signup/">Sign Up</Link>
        </div>}

        {user && (
          <div ref={dropdownElement} className="flex items-center">
            <img src={menuIcon} alt="menu" onClick={iconClicked} className="mr-3 cursor-pointer" />
            <div className={`absolute right-2 top-12 bg-white border shadow-md flex flex-col items-end rounded ${showDropdown ? "block": "hidden"}`}>
              <Link className="flex px-3 pt-3 pb-1 text-primary-200 items-center hover:no-underline hover:text-primary-400" to="/settings/">
                User Settings
                <svg width="14" height="14" viewBox="0 0 14 14" fill={colors.primary[400]} className="ml-2 w-4 h-4">
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
              <div className="flex px-3 pt-1 pb-3 text-primary-200 items-center cursor-pointer hover:no-underline hover:text-primary-400" onClick={logout}>
                Log Out
                <svg width="14" height="14" viewBox="0 0 14 14" fill={colors.primary[400]} className="ml-2 w-4 h-4">
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
      </div>
    </nav>
  );
};

Nav.propTypes = {
  
};

export default Nav;