import React, { useContext }  from "react";
import { Link, useLocation } from "react-router-dom";
import UserSummary from "./UserSummary";
import { UserContext } from "../contexts";
import yourCollectionsIcon from "../images/your-collections.svg"
import collectionsIcon from "../images/collections.svg"
import goodwright from "../images/goodwright.svg";
import goodwrightIcon from "../images/goodwright-icon.svg";
import githubIcon from "../images/github.svg"

const Sidebar = () => {

  const [user,] = useContext(UserContext);

  const onCollectionsPage = useLocation().pathname === "/collections/";
  const onUserCollectionsPage = useLocation().pathname === "/user-collections/";

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <UserSummary user={user || null} link={true} />
        {user && user.memberships.length > 0 && <div className="groups-section">
          <div className="label">Your groups:</div>
          <div className="groups">
            {user.memberships.map(group => (
              <Link to={`/@${group.slug}/`} key={group.id} className="group">
                <span className="at">@</span>{group.slug}
              </Link>
            ))}
          </div>
        </div>}

        {user ? (
          <div className="nav-links">
            <Link className={onCollectionsPage ? "selected" : ""} to="/collections/">
              <span className="full">Public Collections</span>
              <img src={collectionsIcon} alt="public-collections" className="mini" />
            </Link>
            <Link className={onUserCollectionsPage ? "selected" : ""} to="/user-collections/">
              <span className="full">Your Collections</span>
              <img src={yourCollectionsIcon} alt="your-collections" className="mini" />
            </Link>
          </div>
        ) : (
          <div className="nav-links">
            <Link className={onCollectionsPage ? "selected" : ""} to="/collections/">
              <span className="full">Collections</span>
              <img src={collectionsIcon} alt="collections" className="mini" />
            </Link>
          </div>
        )}
      </div>

      <div className="goodwright">
        <a href="https://goodwright.org">
          <img src={goodwright} alt="goodwright" className="goodwright-logo"/>
          <img src={goodwrightIcon} alt="goodwright-icon" className="goodwright-icon" />
        </a>
        <div className="links">
          <Link to="/privacy/">Privacy<span className="full"> Policy</span></Link>
          <Link to="/terms/">Terms<span className="full"> of Use</span></Link>
        </div>
        <div className="links gh-links">
          <a href="https://github.com/goodwright/imaps-api"><img src={githubIcon} alt="github" /> Backend code</a>
          <a href="https://github.com/goodwright/imaps"><img src={githubIcon} alt="github" /> Frontend code</a>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  
};

export default Sidebar;