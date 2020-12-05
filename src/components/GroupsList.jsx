import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const GroupsList = props => {

  const { user, editable } = props;

  return (
    <div className="groups-list">
      <div className="title">Groups</div>
      <div className="groups">
        {user.groups.map(group => (
          <Link to={`/@${group.slug}/`} className="group" key={group.id}>
            <div className="group-name"><span className="at">@</span>{group.slug}</div>
            <div className="user-count">
              <span className="number">{group.userCount}</span> member{group.userCount === 1 ? "" : "s"}
            </div>
          </Link>
        ))}
        {editable && <Link to="/groups/new/" className="new-group">+</Link>  }
      </div>
    </div>
  );
};

GroupsList.propTypes = {
  
};

export default GroupsList;