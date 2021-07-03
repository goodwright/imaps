import React from "react";
import PropTypes from "prop-types";
import UserSummary from "../components/UserSummary";

const UsersGrid = props => {

  const { users, invitees, adminUsernames } = props;

  const className = `md:w-72 text-primary-700 ${!invitees && "hover:text-primary-500"}`;

  return (
    <div className="grid gap-4 py-4 md:grid-fill-80 md:gap-6 text-primary-700 sm:py-6 border-t border-b mb-8 md:mb-12">
      {users.map(user => (
        <UserSummary
          user={user} key={user.id} size={16}
          className={className} link={!invitees}
        >
          <div className="font-light">{user.name}</div>
          {adminUsernames.includes(user.username) && <div className="font-light text-xs">admin</div>}
        </UserSummary>
      ))}
      {invitees && invitees.map(user => (
        <UserSummary
          user={user} key={user.id} link={false} size={16}
          className={`${className} opacity-50`}
        >
          <div className="font-light">{user.name}</div>
        </UserSummary>
      ))}
    </div>
  );
};

UsersGrid.propTypes = {
  users: PropTypes.array.isRequired,
  invitees: PropTypes.array,
  adminUsernames: PropTypes.array.isRequired
};

export default UsersGrid;