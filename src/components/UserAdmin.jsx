import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import { GROUP } from "../queries";
import { DECLINE_INVITATION, MAKE_ADMIN, REMOVE_USER, REVOKE_ADMIN } from "../mutations";
import { createErrorObject } from "../forms";
import Modal from "./Modal";
import Button from "./Button";

const UserAdmin = props => {

  const { group, user, isSelf, isAdmin, isInvited } = props;
  const [errors, setErrors] = useState({});
  const [showResignModal, setShowResignModal] = useState(false);
  const [showDemoteModal, setShowDemoteModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const history = useHistory();

  const [cancelInvitation,] = useMutation(DECLINE_INVITATION, {
    refetchQueries: [{query: GROUP, variables: {slug: group.slug}}],
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
  })

  const [makeAdmin, makeAdminMutation] = useMutation(MAKE_ADMIN, {
    refetchQueries: [{query: GROUP, variables: {slug: group ? group.slug : null}}],
    awaitRefetchQueries: true,
    onCompleted: () => setShowPromoteModal(false),
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
  });

  const [revokeAdmin, revokeAdminMutation] = useMutation(REVOKE_ADMIN, {
    refetchQueries: [{query: GROUP, variables: {slug: group ? group.slug : null}}],
    awaitRefetchQueries: true,
    onCompleted: data => {
      if (isSelf) {
        history.push(`/@${group.slug}/`);
        return
      }
      setShowDemoteModal(false);
      setShowResignModal(false);
    },
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
  });

  const [removeUser, removeUserMutation] = useMutation(REMOVE_USER, {
    refetchQueries: [{query: GROUP, variables: {slug: group ? group.slug : null}}],
    awaitRefetchQueries: true,
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
  });

  const className = "cursor-pointer text-xs font-light";
  const redClass = `${className} text-red-500 hover:text-red-700`;
  const greenClass = `${className} text-green-500 hover:text-green-700`;


  return (
    <div className="flex">

      {isInvited && (
        <div
          className={redClass}
          onClick={() => cancelInvitation({variables: {user: user.id, group: group.id, accept: false}})}
        >revoke invitation</div>
      )}

      {isSelf && (
        <>
          <div className={redClass} onClick={() => setShowResignModal(true)}>resign as admin</div>
          <Modal
            showModal={showResignModal} setShowModal={setShowResignModal}
            title="Resign as admin?"
            text="You will no longer have the ability to edit information for this group."
          >
            {errors.user && <div className="text-red-800 text-sm">{errors.user}</div> }
            <div className="grid sm:grid-cols-max gap-3 text-base mt-6">
              <Button type="submit" loading={revokeAdminMutation.loading} className="btn-primary sm:w-48 y-2" onClick={() => revokeAdmin({variables: {group: group.id, user: user.id}})}>
                Resign as admin
              </Button>
              <button className="btn-secondary sm:w-48 y-2" onClick={() => setShowResignModal(false)}>No, take me back</button>
            </div>
          </Modal>
        </>
      )}

      {!isSelf && !isInvited && isAdmin && (
        <>
          <div className={redClass} onClick={() => setShowDemoteModal(true)}>revoke admin status</div>
          <Modal
            showModal={showDemoteModal} setShowModal={setShowDemoteModal}
            title="Remove as admin?"
            text="This user will no longer have the ability to edit information for this group."
          >
            {errors.user && <div className="text-red-800 text-sm">{errors.user}</div> }
            <div className="grid sm:grid-cols-max gap-3 text-base mt-6">
              <Button type="submit" loading={revokeAdminMutation.loading} className="btn-primary sm:w-48 y-2" onClick={() => revokeAdmin({variables: {group: group.id, user: user.id}})}>
                Revoke admin status
              </Button>
              <button className="btn-secondary sm:w-48 y-2" onClick={() => setShowDemoteModal(false)}>No, take me back</button>
            </div>
          </Modal>
        </>
      )}

      {!isSelf && !isInvited && !isAdmin && (
        <>
          <div className={greenClass} onClick={() => setShowPromoteModal(true)}>made admin</div>
          <Modal
            showModal={showPromoteModal} setShowModal={setShowPromoteModal}
            title="Make user an admin?"
            text="They will be able to edit the group, and make other users an admin."
          >
            {errors.user && <div className="text-red-800 text-sm">{errors.user}</div> }
            <div className="grid sm:grid-cols-max gap-3 text-base mt-6">
              <Button type="submit" loading={makeAdminMutation.loading} className="btn-primary sm:w-48 y-2" onClick={() => makeAdmin({variables: {group: group.id, user: user.id}})}>
                Promote this user
              </Button>
              <button className="btn-secondary sm:w-48 y-2" onClick={() => setShowPromoteModal(false)}>No, take me back</button>
            </div>
          </Modal>
        </>
      )}

      {!isSelf && !isInvited && (
        <>
          <div className={redClass}>
            <span className="mx-1 text-primary-100">|</span>
            <span onClick={() => setShowRemoveModal(true)}>remove</span>
          </div>
          <Modal
            showModal={showRemoveModal} setShowModal={setShowRemoveModal}
            title="Remove user?"
            text="This user will no longer be a member of this group, and any admin status will be removed."
          >
            {errors.user && <div className="text-red-800 text-sm">{errors.user}</div> }
            <div className="grid sm:grid-cols-max gap-3 text-base mt-6">
              <Button type="submit" loading={removeUserMutation.loading} className="btn-primary sm:w-48 y-2" onClick={() => removeUser({variables: {group: group.id, user: user.id}})}>
                Remove the user
              </Button>
              <button className="btn-secondary sm:w-48 y-2" onClick={() => setShowRemoveModal(false)}>No, take me back</button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

UserAdmin.propTypes = {
  group: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  isSelf: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isInvited: PropTypes.bool.isRequired,
};

export default UserAdmin;