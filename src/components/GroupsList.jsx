import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import GroupSummary from "./GroupSummary";

const GroupsList = props => {

  const { user, editable } = props;

  return (
    <div>
      <h2 className="text-primary-200 text-xl mb-3 md:mb-4">Groups</h2>
      <div className="grid gap-5 sm:gap-3">
        {user.memberships.map(group => (
          <GroupSummary key={group.id} group={group} editable={editable} user={user} />
        ))}
        {user.memberships.length === 0 && <p className="font-light mb-2">
          {editable ? "You are not currently a member of any groups." : "User does not belong to any groups."}
        </p>}
        {editable && <Link to="/groups/new/" className="text-primary-200 flex justify-center items-center pb-1 leading-1 border-2 opacity-60 hover:opacity-90 border-dashed border-primary-200 w-full max-w-xs sm:w-60 sm:max-w-none rounded-lg text-4xl hover:no-underline">+</Link>  }
      </div>
    </div>
  );
};

GroupsList.propTypes = {
  user: PropTypes.object.isRequired,
  editable: PropTypes.bool
};

export default GroupsList;