import React from "react";
import { Link } from "react-router-dom";
import UserSummary from "./UserSummary";
import goodwright from "../images/goodwright.svg";
import goodwrightIcon from "../images/goodwright-icon.svg";
import { useContext } from "react";
import { UserContext } from "../contexts";

const Sidebar = () => {

  const [user,] = useContext(UserContext);

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <UserSummary user={user || null} link={true} />
        {user && user.groups.length > 0 && <div className="groups-section">
          <div className="label">Your groups:</div>
          <div className="groups">
            {user.groups.map(group => (
              <Link to={`/@${group.slug}/`} key={group.id} className="group">
                <span className="at">@</span>{group.slug}
              </Link>
            ))}
          </div>
        </div>}
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
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  
};

export default Sidebar;