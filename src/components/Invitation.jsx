import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Invitation = props => {

  const { invitation, style } = props;

  return (
    <div className="invitation" style={style}>
      <div className="info">You have been invited to join <Link to={`/@${invitation.group.slug}/`}>{invitation.group.name}</Link></div>
      <div className="buttons">
        <button className="button primary-button">Accept</button>
        <button className="button secondary-button">Decline</button>
      </div>
    </div>
  );
};

Invitation.propTypes = {
  
};

export default Invitation;