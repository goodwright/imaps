import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { useMutation } from "@apollo/client";
import { INVITE_TO_GROUP } from "../mutations";

const UserInviter = props => {

  const { group, allUsers } = props;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [users, setUsers] = useState([]);

  const usernamesInGroup = group.users.map(user => user.username);

  const options = allUsers.map(user => ({
    value: user.username,
    label: `${user.name}${usernamesInGroup.includes(user.username) ? " (Already in group)" : ""}`,
    isDisabled: usernamesInGroup.includes(user.username),
    id: user.id
  }));

  const [invite, inviteMutation] = useMutation(INVITE_TO_GROUP, {

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
        Invite
      </button>
    </form>
  );
};

UserInviter.propTypes = {
  
};

export default UserInviter;