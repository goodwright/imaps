import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Select from "react-select";
import { useMutation } from "@apollo/client";
import { UPDATE_COLLECTION_ACCESS } from "../mutations";
import { COLLECTION } from "../queries";

const CollectionAccess = props => {

  const { collection, allUsers, allGroups } = props;
  const [showModal, setShowModal] = useState(false);
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const [showUsersPlaceholder, setShowUsersPlaceholder] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserPermission, setSelectedUserPermission] = useState(null);
  const [showGroupsDropdown, setShowGroupsDropdown] = useState(false);
  const [showGroupsPlaceholder, setShowGroupsPlaceholder] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupPermission, setSelectedGroupPermission] = useState(null);
  const users = [...collection.users].sort((u1, u2) => u2.collectionPermission - u1.collectionPermission);
  const groups = [...collection.groups].sort((g1, g2) => g2.collectionPermission - g1.collectionPermission);
  const [userChanges, setUserChanges] = useState(users.map(() => null));
  const [groupChanges, setGroupChanges] = useState(groups.map(() => null));
  const owners = users.filter(u => u.collectionPermission === 4);
  
  const options = [
    {value: 0, label: "No Access"},
    {value: 1, label: "Can View Only"},
    {value: 2, label: "Can Edit"},
    {value: 3, label: "Can Edit and Share"},
    {value: 4, label: "Is Owner"},
  ]
  const possibleUsers = allUsers.filter(u => !users.map(u => u.id).includes(u.id)).map(user => (
    {value: user.id, label: `${user.name} (${user.username})`}
  ));
  const possibleGroups = allGroups.filter(g => !groups.map(g => g.id).includes(g.id)).map(group => (
    {value: group.id, label: `@${group.slug}`}
  ));

  const [updateAccess, updateAccessMutation] = useMutation(UPDATE_COLLECTION_ACCESS, {
    refetchQueries: [{query: COLLECTION, variables: {id: collection.id}}],
    awaitRefetchQueries: true
  });

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
          id: collection.id,
          user: users[i].id,
          permission: change
        }})
      }
    }
    setUserChanges(users.map(() => null));
  }

  const changeGroupLink = (index, permission) => {
    const newGroupChanges = [...groupChanges];
    newGroupChanges.splice(index, 1, permission === groups[index].collectionPermission ? null : permission);
    setGroupChanges(newGroupChanges);
  }

  const changeAllGroupLinks = async () => {
    for (let i = 0; i < groupChanges.length; i++) {
      const change = groupChanges[i];
      if (change !== null) {
        await updateAccess({variables: {
          id: collection.id,
          group: groups[i].id,
          permission: change
        }})
      }
    }
    setGroupChanges(groups.map(() => null));
  }

  const addUserLink = () => {
    updateAccess({variables: {
      id: collection.id,
      user: selectedUser.value,
      permission: selectedUserPermission.value 
    }}).then(() =>{
      setSelectedUser(null);
      setSelectedUserPermission(null);
      setUserChanges(users.map(() => null).concat([null]));
    })
  }

  const addGroupLink = () => {
    updateAccess({variables: {
      id: collection.id,
      group: selectedGroup.value,
      permission: selectedGroupPermission.value 
    }}).then(() =>{
      setSelectedGroup(null);
      setSelectedGroupPermission(null);
      setGroupChanges(groups.map(() => null).concat([null]));
    })
  }
  const usersOptions = collection.isOwner ? options : options.slice(0, 4);

  return (
    <div className="collection-access">
      <button className="primary-button" onClick={() => setShowModal(true)}>Control Access</button>
      <Modal className="collection-access-modal" showModal={showModal} setShowModal={setShowModal}>
        <h2>Who can access this collection?</h2>
        <p className="access-info">
          Here you can decide which users and groups should have what level of
          access to the collection. Where a user has access themselves and via
          their group, the more permissive permission applies. You cannot give
          someone a higher level of permission than you yourself have, and you
          cannot demote yourself if it would leave no owners. Be wary when
          creating new owners - they will have full permissions over the
          collection, including the ability to remove other owners.
        </p>

        <div className="options">
          <div className="existing">
            <div className="existing-users">
              <h3>Users with Access</h3>
              {users.length > 0 ? (
                <div className="users">{users.map((user, index) => {
                  const isSoleOwner = owners.length === 1 && owners[0].id === user.id;
                  const higher = user.collectionPermission === 4 && !collection.isOwner;
                  return (
                    <div className="user" key={user.id}>
                      <div className="name">{user.name} ({user.username})</div>
                      <Select
                        options={usersOptions}
                        value={userChanges[index] === null ? options[user.collectionPermission] : options[userChanges[index]]}
                        onChange={option => changeUserLink(index, option.value)}
                        isDisabled={updateAccessMutation.loading || isSoleOwner || higher}
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
                  disabled={userChanges.every(change => change === null) || updateAccessMutation.loading}
                  onClick={changeAllUserLinks}
                >Update</button>
              )}
            </div>
            <div className="existing-groups">
              <h3>Groups with Access</h3>
              {groups.length > 0 ? (
                <div className="groups">{groups.map((group, index) => (
                  <div className="group" key={group.id}>
                    <div className="name">{`@${group.slug}`}</div>
                    <Select
                      options={options.slice(0, 4)}
                      value={groupChanges[index] === null || !groupChanges.length ? options[group.collectionPermission] : options[groupChanges[index]]}
                      onChange={option => changeGroupLink(index, option.value)}
                      isDisabled={updateAccessMutation.loading}
                      className="react-select"
                      classNamePrefix="react-select"
                    />
                  </div>
                ))}</div>
              ) : <div className="access-info">No groups have access</div> }
              {groups.length > 0 && (
                <button
                  className="primary-button"
                  disabled={groupChanges.every(change => change === null) || updateAccessMutation.loading}
                  onClick={changeAllGroupLinks}
                >Update</button>
              )}
            </div>
          </div>
          <div className="new">
            <div className="users">
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
                options={usersOptions.slice(1, 5)}
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
            <div className="groups">
              <h3>Provide Group Access</h3>
              <div className="group">
              <Select
                options={possibleGroups}
                onInputChange={value => setShowGroupsDropdown(value.length >= 3)}
                onChange={setSelectedGroup}
                value={selectedGroup}
                isDisabled={updateAccessMutation.loading}
                openMenuOnClick={true}
                onFocus={() => setShowGroupsPlaceholder(false)}
                onBlur={() => setShowGroupsPlaceholder(true)}
                menuIsOpen={showGroupsDropdown}
                placeholder={showGroupsPlaceholder ? "Select group..." : null}
                className="react-select"
                classNamePrefix="react-select"
              />
              <Select
                options={options.slice(1, 4)}
                value={selectedGroupPermission}
                isDisabled={updateAccessMutation.loading}
                onChange={setSelectedGroupPermission}
                className="react-select"
                classNamePrefix="react-select"
              />
              <button
                className="primary-button"
                onClick={addGroupLink}
                disabled={selectedGroup === null || selectedGroupPermission === null || updateAccessMutation.loading}
              >Set</button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

CollectionAccess.propTypes = {
  collection: PropTypes.object.isRequired,
  allUsers: PropTypes.array.isRequired,
  allGroups: PropTypes.array.isRequired,
};

export default CollectionAccess;