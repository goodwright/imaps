import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import GroupSummary from "./GroupSummary";

const GroupsList = props => {

  const { user, editable } = props;

  return (
    <div className="groups-list">
      <div className="title">Groups</div>
      <div className="groups">
        {user.groups.map(group => (
          <GroupSummary group={group} editable={editable} user={user} />
        ))}
        {editable && <Link to="/groups/new/" className="new-group">+</Link>  }
      </div>
    </div>
  );
};

GroupsList.propTypes = {
  
};

export default GroupsList;