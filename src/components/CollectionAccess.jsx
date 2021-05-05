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

  const changeUserLink = (user, permission) => {
    updateAccess({variables: {
      id: collection.id,
      user,
      permission
    }})
  }

  const changeGroupLink = (group, permission) => {
    updateAccess({variables: {
      id: collection.id,
      group,
      permission
    }})
  }

  const addUserLink = () => {
    updateAccess({variables: {
      id: collection.id,
      user: selectedUser.value,
      permission: selectedUserPermission.value 
    }}).then(() =>{
      setSelectedUser(null);
      setSelectedUserPermission(null);
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
                <div className="users">{users.map(user => {
                  const isSoleOwner = owners.length === 1 && owners[0].id === user.id;
                  const higher = user.collectionPermission === 4 && !collection.isOwner;
                  return (
                    <div className="user" key={user.id}>
                      <div className="name">{user.name} ({user.username})</div>
                      <Select
                        options={usersOptions}
                        value={options[user.collectionPermission]}
                        onChange={option => changeUserLink(user.id, option.value)}
                        isDisabled={updateAccessMutation.loading || isSoleOwner || higher}
                        className="react-select"
                        classNamePrefix="react-select"
                      />
                    </div>
                  )
                })}</div>
              ) : <div className="access-info">No users have access</div> }
            </div>
            <div className="existing-groups">
              <h3>Groups with Access</h3>
              {groups.length > 0 ? (
                <div className="groups">{groups.map(group => (
                  <div className="group" key={group.id}>
                    <div className="name">{`@${group.slug}`}</div>
                    <Select
                      options={options.slice(0, 4)}
                      value={options[group.collectionPermission]}
                      onChange={option => changeGroupLink(group.id, option.value)}
                      isDisabled={updateAccessMutation.loading}
                      className="react-select"
                      classNamePrefix="react-select"
                    />
                  </div>
                ))}</div>
              ) : <div className="access-info">No groups have access</div> }
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
  
};

export default CollectionAccess;