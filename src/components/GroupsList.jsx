import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import GroupSummary from "./GroupSummary";

const GroupsList = props => {

  const { user, editable, noMessage } = props;

  return (  
    <div className={`grid ${editable ? "gap-5" : "gap-3"} sm:gap-3`}>
      {user.memberships.map(group => (
        <GroupSummary key={group.id} group={group} editable={editable} user={user} />
      ))}
      {user.memberships.length === 0 && <p className="font-light text-base mb-2">
        {noMessage}
      </p>}
      {editable && <Link to="/groups/new/" className="text-primary-200 flex justify-center items-center pb-1 leading-1 border-2 opacity-60 hover:opacity-90 border-dashed border-primary-200 w-full max-w-xs sm:w-60 sm:max-w-none rounded-lg text-4xl hover:no-underline">+</Link>  }
    </div>
  );
};

GroupsList.propTypes = {
  user: PropTypes.object.isRequired,
  editable: PropTypes.bool
};

export default GroupsList;