import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../contexts";
import { useMutation } from "@apollo/client";
import { MAKE_ADMIN, REVOKE_ADMIN } from "../mutations";
import { GROUP } from "../queries";

const UserSummary = props => {

  const { user, link, group, edit } = props;
  const [loggedInUser,] = useContext(UserContext);
  const history = useHistory();

  const groupAdmins = group ? group.admins.map(user => user.username) : [];

  const Element = link && user ? Link : "div";

  const [makeAdmin, makeAdminMutation] = useMutation(MAKE_ADMIN, {
    refetchQueries: [{query: GROUP, variables: {slug: group ? group.slug : null}}],
    awaitRefetchQueries: true,
  });

  const [revokeAdmin, revokeAdminMutation] = useMutation(REVOKE_ADMIN, {
    refetchQueries: [{query: GROUP, variables: {slug: group ? group.slug : null}}],
    awaitRefetchQueries: true,
    onCompleted: data => {
      if (data.revokeGroupAdmin.user.id === loggedInUser.id) {
        history.push(`/@${group.slug}/`);
      }
    }
  });

  


  return (
    <Element className="user-summary" to={`/users/${user.username}/`}>
      <div className="user-photo" />
      <div className="user-info">
        <div className="name">{user ? user.name : "Guest"}</div>
        {user && !group && <div className="username">{user.username}</div>}

        {group && (
          <div className="group-status">
            {user && !edit && groupAdmins.includes(user.username) && "admin"}
            
            {/* Resign or promote or demote */}
            {edit && loggedInUser.username === user.username && groupAdmins.includes(user.username) && (
              <div className="resign" onClick={() => revokeAdmin({variables: {user: user.id, group: group.id}})}>resign as admin</div>
            )}
            {edit && loggedInUser.username !== user.username && !groupAdmins.includes(user.username) && (
              <div className="promote" onClick={() => makeAdmin({variables: {user: user.id, group: group.id}})}>make admin</div>
            )}
            {edit && loggedInUser.username !== user.username && groupAdmins.includes(user.username) && (
              <div className="demote" onClick={() => revokeAdmin({variables: {user: user.id, group: group.id}})}>revoke admin status</div>
            )}


          </div>
        )}
      </div>
    </Element>
  );
};

UserSummary.propTypes = {
  user: PropTypes.object.isRequired,
  link: PropTypes.bool
};

export default UserSummary;