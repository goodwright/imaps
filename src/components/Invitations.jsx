import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ACCEPT_INVITATION, DECLINE_INVITATION } from "../mutations";
import { UserContext } from "../contexts";
import Button from "./Button";

const Invitations = props => {

  const { invitations } = props;
  const [banished, setBanished] = useState([]);
  const [user, setUser] = useContext(UserContext);

  const [accept, acceptMutation] = useMutation(ACCEPT_INVITATION, {
    onCompleted: data => setUser(data.processGroupInvitation.user),
    onError: () => {}
  });

  const [decline, declineMutation] = useMutation(DECLINE_INVITATION, {
    onCompleted: data => setUser(data.processGroupInvitation.user),
    onError: () => {}
  });

  const acceptInvitation = id => {
    accept({variables: {user: user.id, group: id}}).then(() => {
      setBanished([...banished, id])
    })
  }

  const declineInvitation = id => {
    decline({variables: {user: user.id, group: id}}).then(() => {
      setBanished([...banished, id])
    })
  }

  return (
    <div className="absolute right-4 top-16">
      {invitations.filter(i => !banished.includes(i.id)).map((invitation, index) => (
        <div
          key={invitation.slug}
          className="bg-white border shadow-lg py-4 px-5 rounded-md w-96 absolute top-0 right-0"
          style={{
            top: (index + 1) * 12,
            right: (invitations.length - index) * 12
          }}
        >
          <div className="mb-5">
            You have been invited to join <Link to={`/@${invitation.slug}/`}>{invitation.name}</Link>
          </div>
          <div className="grid grid-cols-max gap-3">
            <Button
              className="btn-primary w-24 py-2"
              onClick={() => acceptInvitation(invitation.id)}
              loading={acceptMutation.loading}
            >Accept</Button>
            
            <Button
              className="btn-secondary w-24 py-2"
              onClick={() => declineInvitation(invitation.id)}
              loading={declineMutation.loading}
            >Decline</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

Invitations.propTypes = {
  invitations: PropTypes.array.isRequired
};

export default Invitations;