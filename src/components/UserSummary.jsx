import React from "react";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "../contexts";

const UserSummary = props => {

  const { link } = props;
  const [user,] = useContext(UserContext);

  return (
    <div className="user-summary">
      <div className="user-photo" />
      <div className="user-info">
        <div className="name">{user ? user.name : "Guest"}</div>
        {user && <div className="username"><span className="at">@</span>{user.username}</div>}
      </div>
    </div>
  );
};

UserSummary.propTypes = {
  
};

export default UserSummary;