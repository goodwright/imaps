import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Select from "./Select";
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

  const text = `
  Here you can decide which users and groups should have what level of
  access to the collection. Where a user has access themselves and via
  their group, the more permissive permission applies. You cannot give
  someone a higher level of permission than you yourself have, and you
  cannot demote yourself if it would leave no owners. Be wary when
  creating new owners - they will have full permissions over the
  collection, including the ability to remove other owners.`;

  const h3Class = "font-medium text-lg mb-1 w-max";
  const nameClass = "text-base text-primary-500 mb-1";
  const primaryClass = "btn-primary w-full text-sm py-2 disabled:opacity-50";

  return (
    <div>
      <button className="btn-primary text-base py-2" onClick={() => setShowModal(true)}>Control Access</button>
      <Modal
        className="max-w-xl xl:max-w-7xl overflow-scroll no-scroll"
        showModal={showModal} setShowModal={setShowModal}
        title="Who can access this collection?"
        text={text}
      >
        <div className="border-t mt-8 pt-8 grid xl:grid-cols-2">
          <div className="grid sm:grid-cols-2 gap-6 border-b pb-8 xl:pr-8 xl:pb-0 xl:border-r xl:border-b-0">
            <div>
              <h3 className={h3Class}>Users with Access</h3>
              {users.length > 0 ? (
                <div className="grid gap-3 mb-4">{users.map((user, index) => {
                  const isSoleOwner = owners.length === 1 && owners[0].id === user.id;
                  const higher = user.collectionPermission === 4 && !collection.isOwner;
                  return (
                    <div className="" key={user.id}>
                      <div className={nameClass}>{user.name} ({user.username})</div>
                      <Select
                        options={usersOptions}
                        value={userChanges[index] === null ? options[user.collectionPermission] : options[userChanges[index]]}
                        onChange={option => changeUserLink(index, option.value)}
                        isDisabled={updateAccessMutation.loading || isSoleOwner || higher}
                      />
                    </div>
                  )
                })}</div>
              ) : <div>No users have access</div> }
              {users.length > 0 && (
                <button
                  className={`${primaryClass} ${(userChanges.every(change => change === null) || updateAccessMutation.loading) ? "opacity-50 cursor-auto hover:bg-primary-400" : ""}`}
                  disabled={userChanges.every(change => change === null) || updateAccessMutation.loading}
                  onClick={changeAllUserLinks}
                >Update</button>
              )}
            </div>
            <div className="">
              <h3 className={h3Class}>Groups with Access</h3>
              {groups.length > 0 ? (
                <div className="grid gap-3 mb-4">{groups.map((group, index) => (
                  <div className="" key={group.id}>
                    <div className={nameClass}>{`@${group.slug}`}</div>
                    <Select
                      options={options.slice(0, 4)}
                      value={groupChanges[index] === null || !groupChanges.length ? options[group.collectionPermission] : options[groupChanges[index]]}
                      onChange={option => changeGroupLink(index, option.value)}
                      isDisabled={updateAccessMutation.loading}
                    />
                  </div>
                ))}</div>
              ) : <div className="font-light text-base">No groups have access</div> }
              {groups.length > 0 && (
                <button
                  className={`${primaryClass} ${(groupChanges.every(change => change === null) || updateAccessMutation.loading) ? "opacity-50 cursor-auto hover:bg-primary-400" : ""}`}
                  disabled={groupChanges.every(change => change === null) || updateAccessMutation.loading}
                  onClick={changeAllGroupLinks}
                >Update</button>
              )}
            </div>
          </div>
          <div className="pt-6 xl:pt-0 xl:pl-8">
            <div className="mb-8">
              <h3 className={h3Class}>Provide User Access</h3>
              <div className="grid gap-3 sm:flex">
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
                  className="flex-grow sm:mr-3"
                />
                <Select
                  options={usersOptions.slice(1, 5)}
                  value={selectedUserPermission}
                  onChange={setSelectedUserPermission}
                  isDisabled={updateAccessMutation.loading}
                  className="sm:w-40 sm:mr-3"
                />
                <button
                  className="btn-primary w-full sm:w-16 text-base py-1"
                  onClick={addUserLink}
                  disabled={selectedUser === null || selectedUserPermission === null || updateAccessMutation.loading}
                >Set</button>
              </div>
            </div>
            <div className="">
              <h3 className={h3Class}>Provide Group Access</h3>
              <div className="grid gap-3 sm:flex">
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
                  className="flex-grow sm:mr-3"
                />
                <Select
                  options={options.slice(1, 4)}
                  value={selectedGroupPermission}
                  isDisabled={updateAccessMutation.loading}
                  onChange={setSelectedGroupPermission}
                  className="sm:w-40 sm:mr-3"
                />
                <button
                  className="btn-primary w-full sm:w-16 text-base py-1"
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