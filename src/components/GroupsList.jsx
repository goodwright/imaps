import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const GroupsList = props => {

  const { user } = props;

  return (
    <div className="groups-list">
      <div className="title">Groups</div>
      <div className="groups">
        {user.groups.map(group => (
          <Link to={`/@${group.name}/`} className="group" key={group.id}>
            <div className="group-name"><span className="at">@</span>{group.name}</div>
            <div className="user-count">
              <span className="number">{group.userCount}</span> member{group.userCount === 1 ? "" : "s"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

GroupsList.propTypes = {
  
};

export default GroupsList;