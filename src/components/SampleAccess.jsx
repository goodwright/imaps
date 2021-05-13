import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import Select from "react-select";
import Modal from "./Modal";
import { SAMPLE } from "../queries";
import { UPDATE_SAMPLE_ACCESS } from "../mutations";

const SampleAccess = props => {

  const { sample, allUsers } = props;
  const [showModal, setShowModal] = useState(false);
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const [showUsersPlaceholder, setShowUsersPlaceholder] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserPermission, setSelectedUserPermission] = useState(null);
  const users = [...sample.users].sort((u1, u2) => u2.samplePermission - u1.samplePermission);
  const [userChanges, setUserChanges] = useState(users.map(() => null));

  const [updateAccess, updateAccessMutation] = useMutation(UPDATE_SAMPLE_ACCESS, {
    refetchQueries: [{query: SAMPLE, variables: {id: sample.id}}],
    awaitRefetchQueries: true
  });

  const options = [
    {value: 0, label: "No Access"},
    {value: 1, label: "Can View Only"},
    {value: 2, label: "Can Edit"},
    {value: 3, label: "Can Edit and Share"},
  ]

  const changeUserLink = (index, permission) => {
    const newUserChanges = [...userChanges];
    newUserChanges.splice(index, 1, permission === users[index].collectionPermission ? null : permission);
    setUserChanges(newUserChanges);
  }

  const changeAllUserLinks = async () => {
    for (let i = 0; i < userChanges.length; i++) {
      const change = userChanges[i];
      if (change !== null) {
        await updateAccess({variables: {
          id: sample.id,
          user: users[i].id,
          permission: change
        }})
      }
    }
    setUserChanges(users.map(() => null));
  }

  const addUserLink = () => {
    updateAccess({variables: {
      id: sample.id,
      user: selectedUser.value,
      permission: selectedUserPermission.value 
    }}).then(() =>{
      setSelectedUser(null);
      setSelectedUserPermission(null);
      setUserChanges(users.map(() => null).concat([null]));
    })
  }

  const possibleUsers = allUsers.filter(u => !users.map(u => u.id).includes(u.id)).map(user => (
    {value: user.id, label: `${user.name} (${user.username})`}
  ));

  return (
    <div className="sample-access">
      <button className="primary-button" onClick={() => setShowModal(true)}>Control Access</button>
      <Modal className="sample-access-modal" showModal={showModal} setShowModal={setShowModal}>
        <h2>Who can access this sample?</h2>
        <p className="access-info">
          Here you can control users' access to this specific sample. Any users
          with access to the sample's collection will also have the equivalent
          access to the sample, but you may wish you to give a collaborator
          access to just this sample without access to other samples in the
          collection. Users who only have access via the collection will not
          be shown here.
        </p>

        <div className="options">
          <div className="existing">
            <h3>Users with Access</h3>
            {users.length > 0 ? (
              <div className="users">{users.map((user, index) => {
                return (
                  <div className="user" key={user.id}>
                    <div className="name">{user.name} ({user.username})</div>
                    <Select
                      options={options}
                      value={userChanges[index] === null ? options[user.samplePermission] : options[userChanges[index]]}
                      onChange={option => changeUserLink(index, option.value)}
                      isDisabled={updateAccessMutation.loading}
                      className="react-select"
                      classNamePrefix="react-select"
                    />
                  </div>
                )
              })}</div>
            ) : <div className="access-info">No users have access</div> }
            {users.length > 0 && (
              <button
                className="primary-button"
                disabled={userChanges.every(change => change === null) /* || updateAccessMutation.loading */}
                onClick={changeAllUserLinks}
              >Update</button>
            )}
          </div>
        
          <div className="new">

            <h3>Provide User Access</h3>
            <div className="user">
              <Select
                options={possibleUsers}
                onInputChange={value => setShowUsersDropdown(value.length >= 3)}
                onChange={setSelectedUser}
                value={selectedUser}
                openMenuOnClick={true}
                onFocus={() => setShowUsersPlaceholder(false)}
                onBlur={() => setShowUsersPlaceholder(true)}
                isDisabled={updateAccessMutation.loading}
                menuIsOpen={showUsersDropdown}
                placeholder={showUsersPlaceholder ? "Select user..." : null}
                className="react-select"
                classNamePrefix="react-select"
              />
              <Select
                options={options.slice(1, 4)}
                value={selectedUserPermission}
                onChange={setSelectedUserPermission}
                isDisabled={updateAccessMutation.loading}
                className="react-select"
                classNamePrefix="react-select"
              />
              <button
                className="primary-button"
                onClick={addUserLink}
                disabled={selectedUser === null || selectedUserPermission === null || updateAccessMutation.loading}
              >Set</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

SampleAccess.propTypes = {
  sample: PropTypes.object.isRequired,
  allUsers: PropTypes.array.isRequired,
};

export default SampleAccess;