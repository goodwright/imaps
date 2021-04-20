import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useMutation } from "@apollo/client";
import { ACCEPT_INVITATION, DECLINE_INVITATION } from "../mutations";
import { UserContext } from "../contexts";

const Invitation = props => {

  const { invitation, style } = props;
  const [banished, setBanished] = useState(false);
  const [user, setUser] = useContext(UserContext);

  const [accept, acceptMutation] = useMutation(ACCEPT_INVITATION, {
    onCompleted: data => setUser(data.processGroupInvitation.user),
    onError: () => setBanished(true)
  });

  const [decline, declineMutation] = useMutation(DECLINE_INVITATION, {
    onCompleted: data => setUser(data.processGroupInvitation.user),
    onError: () => setBanished(true)
  });

  if (banished) return <div />

  return (
    <div className="invitation" style={style}>
      <div className="info">You have been invited to join <Link to={`/@${invitation.slug}/`}>{invitation.name}</Link></div>
      <div className="buttons">
        <button className="button primary-button" onClick={() => accept({variables: {user: user.id, group: invitation.id}})}>
          {acceptMutation.loading ? <ClipLoader color="white" size="20px" /> : "Accept"}
        </button>
        <button className="button secondary-button" onClick={() => decline({variables: {user: user.id, group: invitation.id}})}>
          {declineMutation.loading ? <ClipLoader color="#9590B5" size="20px" /> : "Decline"}
        </button>
      </div>
    </div>
  );
};

Invitation.propTypes = {
  invitation: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

export default Invitation;