import React, { useState, useContext } from "react";
import { UserContext } from "../contexts";
import { useMutation } from "@apollo/client";
import { UPDATE_PASSWORD, UPDATE_USER } from "../mutations";
import { createErrorObject } from "../forms";
import Button from "./Button";

const SettingsForm = props => {

  const [user, setUser] = useContext(UserContext);

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [userErrors, setUserErrors] = useState({});

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});

  const [updateUser, updateUserMutation] = useMutation(UPDATE_USER, {
    onCompleted: data => {
      setUser(data.updateUser.user);
      setUserErrors({});
    },
    onError: ({graphQLErrors}) => {
      setUserErrors(createErrorObject(userErrors, graphQLErrors))
    }
  });

  const [updatePassword, updatePasswordMutation] = useMutation(UPDATE_PASSWORD, {
    onCompleted: () => {
      setCurrentPassword("");
      setNewPassword("");
      setPasswordErrors({});
    },
    onError: ({graphQLErrors}) => {
      setPasswordErrors(createErrorObject(passwordErrors, graphQLErrors))
    }
  });

  const userFormSubmit = e => {
    e.preventDefault();
    updateUser({
      variables: {username, name, email},
    })
  }

  const passwordFormSubmit = e => {
    e.preventDefault();
    updatePassword({
      variables: {new: newPassword, current: currentPassword}
    })
  }

  const offset = "ml-14 pl-2 md:ml-16";
  const formClass = "max-w-xl xl:max-w-full xl:w-100";
  const h2Class = `text-primary-200 text-xl mb-3 ${offset} md:mb-4`
  const labelClass = "mr-2 block w-14 text-xs block text-right md:text-sm md:w-16"
  const buttonClass = "btn-primary w-32 text-sm py-2";
  const errorClass = `${offset} text-red-800 text-sm`;


  return (
    <div className={`grid gap-10 md:gap-14 xl:grid-cols-max ${props.className || ""}`}>

      <form onSubmit={userFormSubmit} className={formClass}>

        <h2 className={h2Class}>Edit details</h2>

        {userErrors.general && <div className={errorClass}>There was an error.</div>}
        
        {userErrors.username && <div className={errorClass}>{userErrors.username}</div>}
        <div className="flex items-center mb-6 w-full">
          <label htmlFor="username" className={labelClass}>username</label>
          <input
            id="username"
            type="text"
            className={`bg-gray-100 flex-grow ${userErrors.username ? "error" : ""}`}
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoCapitalize="none"
            autoComplete="username"
            required
          />
        </div>

        {userErrors.email && <div className={errorClass}>{userErrors.email}</div>}
        <div className="flex items-center mb-6 w-full">
          <label htmlFor="email" className={labelClass}>email</label>
          <input
            id="email"
            type="email"
            className={`bg-gray-100 flex-grow ${userErrors.email ? "error" : ""}`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        {userErrors.name && <div className={errorClass}>{userErrors.name}</div>}
        <div className="flex items-center mb-6 w-full">
          <label htmlFor="name" className={labelClass}>name</label>
          <input
            id="name"
            type="text"
            className={`bg-gray-100 flex-grow ${userErrors.name ? "error" : ""}`}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className={offset}>
          <Button
            type="submit"
            className={buttonClass}
            loading={updateUserMutation.loading}
          >Save details</Button>
        </div>
      </form>


      <form onSubmit={passwordFormSubmit} className={formClass}>
        <h2 className={h2Class}>Edit password</h2>

        {passwordErrors.general && <div className={errorClass}>There was an error.</div>}
        
        {passwordErrors.current && <div className={errorClass}>{passwordErrors.current}</div>}
        <div className="flex items-center mb-6 w-full">
          <label htmlFor="currentPassword" className={labelClass}>current</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            className={`bg-gray-100 flex-grow ${passwordErrors.current ? "error" : ""}`}
            onChange={e => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {passwordErrors.new && <div className={errorClass}>{passwordErrors.new}</div>}
        <div className="flex items-center mb-6 w-full">
          <label htmlFor="newPassword" className={labelClass}>new</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            className={`bg-gray-100 flex-grow ${passwordErrors.new ? "error" : ""}`}
            onChange={e => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className={offset}>
          <Button
            type="submit"
            className={buttonClass}
            loading={updatePasswordMutation.loading}
          >Save password</Button>
        </div>
      </form>
    </div>
  );
};

SettingsForm.propTypes = {
  
};

export default SettingsForm;