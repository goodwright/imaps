import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import { useMutation } from "@apollo/client";
import { INVITE_TO_GROUP } from "../mutations";
import { GROUP } from "../queries";
import { getMediaLocation } from "../api";
import anonymousUser from "../images/anonymous-user.svg";

const UserInviter = props => {

  const { group, allUsers } = props;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [users, setUsers] = useState([]);

  const usernamesInGroup = group.users.map(user => user.username);
  const inviteesInGroup = group.groupInvitations.map(invitation => invitation.user);
  const inviteeUsernamesInGroup = inviteesInGroup.map(user => user.username);

  const options = allUsers.map(user => ({
    value: user.username,
    label: <div><img src={user && user.image ? `${getMediaLocation()}${user.image}` : anonymousUser} height="30px" width="30px"/>{`${user.name}${usernamesInGroup.includes(user.username) ? " (Already in group)" : ""}${inviteeUsernamesInGroup.includes(user.username) ? " (Already invited)" : ""}`}</div>,
    isDisabled: usernamesInGroup.includes(user.username) || inviteeUsernamesInGroup.includes(user.username),
    id: user.id
  }));

  const [invite, inviteMutation] = useMutation(INVITE_TO_GROUP, {
    onCompleted: () => setUsers([]),
    refetchQueries: [{query: GROUP, variables: {slug: group.slug}}]
  });

  const formSubmit = async e => {
    e.preventDefault();
    for (let user of users) {
      await invite({variables: {user: user.id, group: group.id}});
    }
  }

  return (
    <form className="user-inviter" onSubmit={formSubmit}>
      <Select
        onInputChange={value => setShowDropdown(value.length >= 3)}
        onChange={setUsers}
        value={users}
        options={options}
        isMulti={true}
        openMenuOnClick={true}
        onFocus={() => setShowPlaceholder(false)}
        onBlur={() => setShowPlaceholder(true)}
        menuIsOpen={showDropdown}
        placeholder={showPlaceholder ? "Select users to invite to group..." : null}
        className="react-select"
        classNamePrefix="react-select"
      />
      <button className="button primary-button">
        {inviteMutation.loading ? <ClipLoader color="white" size="20px" /> : "Invite"}
      </button>
    </form>
  );
};

UserInviter.propTypes = {
  group: PropTypes.object,
  allUsers: PropTypes.array.isRequired
};

export default UserInviter;