import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import Select from "./Select";
import Modal from "./Modal";
import { EXECUTION } from "../queries";
import { UPDATE_EXECUTION_ACCESS } from "../mutations";

const ExecutionAccess = props => {

  const { execution, allUsers } = props;
  const [showModal, setShowModal] = useState(false);
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const [showUsersPlaceholder, setShowUsersPlaceholder] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserPermission, setSelectedUserPermission] = useState(null);
  const users = [...execution.users].sort((u1, u2) => u2.executionPermission - u1.executionPermission);
  const [userChanges, setUserChanges] = useState(users.map(() => null));

  const [updateAccess, updateAccessMutation] = useMutation(UPDATE_EXECUTION_ACCESS, {
    refetchQueries: [{query: EXECUTION, variables: {id: execution.id}}],
    awaitRefetchQueries: true
  });

  const options = [
    {value: 0, label: "No Access"},
    {value: 1, label: "Can View Only"},
    {value: 2, label: "Can Edit"},
    {value: 3, label: "Can Edit and Share"},
    {value: 4, label: "Is Owner"},
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
          id: execution.id,
          user: users[i].id,
          permission: change
        }})
      }
    }
    setUserChanges(users.map(() => null));
  }

  const addUserLink = () => {
    updateAccess({variables: {
      id: execution.id,
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

  const text = `
  Here you can control users' access to this specific execution. Any users
  with access to the execution's collection or sample will also have the
  equivalent access to the execution, but you may wish you to give a
  collaborator access to just this execution without access to other
  executions in the collection or sample. Users who only have access via
  the collection or sample will not be shown here.`;

  const h3Class = "font-medium text-lg mb-1 w-max";
  const nameClass = "text-base text-primary-500 mb-1";
  const primaryClass = "btn-primary w-full text-sm py-2 disabled:opacity-50";

  return (
    <div>
      <button className="btn-primary text-base py-2" onClick={() => setShowModal(true)}>Control Access</button>
      <Modal
        className="max-w-xl lg:max-w-3xl overflow-scroll no-scroll"
        showModal={showModal} setShowModal={setShowModal}
        title="Who can access this execution?"
        text={text}
      >
        <div className="border-t mt-8 pt-8 grid lg:grid-cols-max">
          <div className="lg:w-60">
            <h3 className={h3Class}>Users with Access</h3>
            {users.length > 0 ? (
              <div className="grid gap-3 mb-4">{users.map((user, index) => {
                return (
                  <div className="" key={user.id}>
                    <div className={nameClass}>{user.name} ({user.username})</div>
                    <Select
                      options={options}
                      value={userChanges[index] === null ? options[user.executionPermission] : options[userChanges[index]]}
                      onChange={option => changeUserLink(index, option.value)}
                      isDisabled={updateAccessMutation.loading}
                    />
                  </div>
                )
              })}</div>
            ) : <div className="text-base font-light">No users have access</div> }
            {users.length > 0 && (
              <button
                className={`${primaryClass} ${(userChanges.every(change => change === null) || updateAccessMutation.loading) ? "opacity-50 cursor-auto hover:bg-primary-400" : ""}`}
                disabled={userChanges.every(change => change === null)}
                onClick={changeAllUserLinks}
              >Update</button>
            )}
          </div>
        
          <div className="pt-6 lg:pt-0 lg:pl-8">

            <h3 className={h3Class}>Provide User Access</h3>
            <div className="grid gap-3 sm:flex sm:gap-0">
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
                options={options.slice(1, 5)}
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
        </div>
      </Modal>
    </div>
  );
};

ExecutionAccess.propTypes = {
  sample: PropTypes.object.isRequired,
  allUsers: PropTypes.array.isRequired,
};

export default ExecutionAccess;