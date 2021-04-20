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
        {user.memberships.map(group => (
          <GroupSummary key={group.id} group={group} editable={editable} user={user} />
        ))}
        {user.memberships.length === 0 && <p className="no-data">
          {editable ? "You are not currently a member of any groups" : "User does not belong to any groups"}
        </p> }
        {editable && <Link to="/groups/new/" className="new-group">+</Link>  }
      </div>
    </div>
  );
};

GroupsList.propTypes = {
  user: PropTypes.object.isRequired,
  editable: PropTypes.bool
};

export default GroupsList;