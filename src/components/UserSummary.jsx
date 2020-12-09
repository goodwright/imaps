import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import classNames from "classnames";
import { UserContext } from "../contexts";
import { useMutation } from "@apollo/client";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { DECLINE_INVITATION, MAKE_ADMIN, REVOKE_ADMIN } from "../mutations";
import { GROUP } from "../queries";

const UserSummary = props => {

  const { user, link, group, invitation, edit } = props;
  const [showResignModal, setShowResignModal] = useState(false);
  const [showDemoteModal, setShowDemoteModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [loggedInUser,] = useContext(UserContext);
  const history = useHistory();

  const groupAdmins = group ? group.admins.map(user => user.username) : [];

  const className = classNames({"user-summary": true, faded: invitation})

  const Element = link && user ? Link : "div";

  const [makeAdmin, makeAdminMutation] = useMutation(MAKE_ADMIN, {
    refetchQueries: [{query: GROUP, variables: {slug: group ? group.slug : null}}],
    awaitRefetchQueries: true,
    onCompleted: () => setShowPromoteModal(false)
  });

  const [revokeAdmin, revokeAdminMutation] = useMutation(REVOKE_ADMIN, {
    refetchQueries: [{query: GROUP, variables: {slug: group ? group.slug : null}}],
    awaitRefetchQueries: true,
    onCompleted: data => {
      setShowDemoteModal(false);
      setShowResignModal(false);
      if (data.revokeGroupAdmin.user.id === loggedInUser.id) {
        history.push(`/@${group.slug}/`);
      }
    }
  });

  const [cancelInvitation, cancelInvitationMutation] = useMutation(DECLINE_INVITATION, {
    refetchQueries: [{query: GROUP, variables: {slug: group ? group.slug : null}}]
  })

  return (
    <Element className={className} to={`/users/${user && user.username}/`}>
      <div className="user-photo" />
      <div className="user-info">
        <div className="name">{user ? user.name : "Guest"}{invitation ? " (invited)" : ""}</div>
        {user && !group && !invitation && <div className="username">{user.username}</div>}

        {group && (
          <div className="group-status">
            {user && !edit && groupAdmins.includes(user.username) && "admin"}

            {edit && invitation && (
              <div className="demote" onClick={() => cancelInvitation({variables: {id: invitation ? invitation.id : null}})}>cancel</div>
            )}
            
            {/* Resign or promote or demote */}
            {edit && !invitation && loggedInUser.username === user.username && groupAdmins.includes(user.username) && (
              <>
                <div className="resign" onClick={() => setShowResignModal(true)}>resign as admin</div>
                <Modal showModal={showResignModal} setShowModal={setShowResignModal} className="resign-modal">
                  <h2>Resign as admin?</h2>
                  <p>
                    You will no longer have the ability to edit information for this group.
                  </p>
                  <div className="buttons">
                    <button type="submit" className="primary-button" onClick={() => revokeAdmin({variables: {group: group.id, user: user.id}})}>
                      {revokeAdminMutation.loading ? <ClipLoader color="white" size="20px" /> : "Yes, resign as admin"}
                    </button>
                    <button className="secondary-button" onClick={() => setShowResignModal(false)}>No, take me back</button>
                  </div>
                </Modal>
              </>
            )}
            {edit && !invitation && loggedInUser.username !== user.username && !groupAdmins.includes(user.username) && (
              <>
                <div className="promote" onClick={() => setShowPromoteModal(true)}>make admin</div>
                <Modal showModal={showPromoteModal} setShowModal={setShowPromoteModal} className="promote-modal">
                  <h2>Make user an admin?</h2>
                  <p>
                    They will be able to edit the group, and make other users an admin.
                  </p>
                  <div className="buttons">
                    <button type="submit" className="primary-button" onClick={() => makeAdmin({variables: {group: group.id, user: user.id}})}>
                      {makeAdminMutation.loading ? <ClipLoader color="white" size="20px" /> : "Yes, promote this user"}
                    </button>
                    <button className="secondary-button" onClick={() => setShowPromoteModal(false)}>No, take me back</button>
                  </div>
                </Modal>
              </>
            )}
            {edit && !invitation && loggedInUser.username !== user.username && groupAdmins.includes(user.username) && (
              <>
                <div className="demote" onClick={() => setShowDemoteModal(true)}>revoke admin status</div>
                <Modal showModal={showDemoteModal} setShowModal={setShowDemoteModal} className="demote-modal">
                  <h2>Remove as admin?</h2>
                  <p>
                    This user will no longer have the ability to edit information for this group.
                  </p>
                  <div className="buttons">
                    <button type="submit" className="primary-button" onClick={() => revokeAdmin({variables: {group: group.id, user: user.id}})}>
                      {revokeAdminMutation.loading ? <ClipLoader color="white" size="20px" /> : "Yes, revoke admin status"}
                    </button>
                    <button className="secondary-button" onClick={() => setShowDemoteModal(false)}>No, take me back</button>
                  </div>
                </Modal>
              </>
            )}
          </div>
        )}
      </div>
    </Element>
  );
};

UserSummary.propTypes = {
  user: PropTypes.object,
  link: PropTypes.bool
};

export default UserSummary;