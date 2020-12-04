import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const UserSummary = props => {

  const { user, link, useAdmin } = props;

  const Element = link && user ? Link : "div";

  return (
    <Element className="user-summary" to={`/users/${user.username}/`}>
      <div className="user-photo" />
      <div className="user-info">
        <div className="name">{user ? user.name : "Guest"}</div>
        {user && !useAdmin && <div className="username">{user.username}</div>}
        {user && useAdmin && <div className="admin">{user.admin ? "admin" : ""}</div>}
      </div>
    </Element>
  );
};

UserSummary.propTypes = {
  user: PropTypes.object.isRequired,
  link: PropTypes.bool
};

export default UserSummary;