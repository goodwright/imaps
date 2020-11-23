import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const UserSummary = props => {

  const { user, link } = props;

  const Element = link ? Link : "div";

  return (
    <Element className="user-summary" to={`/@${user.username}/`}>
      <div className="user-photo" />
      <div className="user-info">
        <div className="name">{user ? user.name : "Guest"}</div>
        {user && <div className="username"><span className="at">@</span>{user.username}</div>}
      </div>
    </Element>
  );
};

UserSummary.propTypes = {
  
};

export default UserSummary;