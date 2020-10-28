import React from "react";
import PropTypes from "prop-types";

const UserSummary = props => {
  return (
    <div className="user-summary">
      <div className="user-info">
        <div className="user-photo">

        </div>
        <div className="user-name">
          Guest
        </div>
      </div>
    </div>
  );
};

UserSummary.propTypes = {
  
};

export default UserSummary;