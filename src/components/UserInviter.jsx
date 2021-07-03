import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "./Select";
import { useMutation } from "@apollo/client";
import { INVITE_TO_GROUP } from "../mutations";
import { GROUP } from "../queries";
import Button from "./Button";
import UserSummary from "./UserSummary";

const UserInviter = props => {

  const { group, allUsers } = props;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [user, setUser] = useState(null);

  const usernamesInGroup = group.members.map(user => user.username);
  const inviteesInGroup = group.invitees;
  const inviteeUsernamesInGroup = inviteesInGroup.map(user => user.username);

  const options = allUsers.map(user => ({
    value: user.username,
    label: (
      <UserSummary user={user} size={8} noGap={true}>
        <div className="font-medium ml-2 ">
          {`${user.name}${usernamesInGroup.includes(user.username) ? " (Already in group)" : ""}${inviteeUsernamesInGroup.includes(user.username) ? " (Already invited)" : ""}`}
        </div>
      </UserSummary>
    ),
    isDisabled: usernamesInGroup.includes(user.username) || inviteeUsernamesInGroup.includes(user.username),
    id: user.id
  }))

  const [invite, inviteMutation] = useMutation(INVITE_TO_GROUP, {
    onCompleted: () => setUser(null),
    refetchQueries: [{query: GROUP, variables: {slug: group.slug}}]
  });

  const formSubmit = e => {
    e.preventDefault();
    invite({variables: {user: user, group: group.id}});
    setUser(null);
  }

  return (
    <form className={`grid gap-3 max-w-xl md:flex ${props.className || ""}`} onSubmit={formSubmit}>
      <Select
        onInputChange={value => setShowDropdown(value.length >= 3)}
        onChange={e => setUser(e.id)}
        value={options.filter(option => option.id === user)[0] || null}
        options={options}
        openMenuOnClick={true}
        onFocus={() => setShowPlaceholder(false)}
        onBlur={() => setShowPlaceholder(true)}
        menuIsOpen={showDropdown}
        placeholder={showPlaceholder ? "Select users to invite to group..." : null}
        className="flex-grow text-base h-full"
      />
      <Button className="btn-primary text-base py-2 h-full md:ml-0 md:w-24 md:py-1" loading={inviteMutation.loading}>
        Invite
      </Button>
    </form>
  );
};

UserInviter.propTypes = {
  group: PropTypes.object,
  allUsers: PropTypes.array.isRequired
};

export default UserInviter;