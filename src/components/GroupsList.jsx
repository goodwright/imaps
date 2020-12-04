import React from "react";
import PropTypes from "prop-types";

const GroupsList = props => {

  const { user } = props;

  return (
    <div className="groups-list">
      <div className="title">Groups</div>
      <div className="groups">
        {user.groups.map(group => (
          <div className="group" key={group.id}>
            <div className="group-name">{group.name}</div>
            <div className="user-count">
              <span className="number">{group.userCount}</span> member{group.userCount === 1 ? "" : "s"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

GroupsList.propTypes = {
  
};

export default GroupsList;