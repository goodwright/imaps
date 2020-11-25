import React, { useState, useContext } from "react";
import { ClipLoader } from "react-spinners";
import { UserContext } from "../contexts";
import { useMutation } from "@apollo/client";
import { UPDATE_PASSWORD, UPDATE_USER } from "../mutations";
import { createErrorObject } from "../forms";

const SettingsForm = () => {

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


  return (
    <div className="settings-form">
      <div className="left-column">
        <form className="user-form" onSubmit={userFormSubmit}>
          <h2>Edit details</h2>

          {userErrors.general && <div className="error">There was an error.</div>}
          <div className={userErrors.username ? "input error-input" : "input"}>
            <label htmlFor="username">username</label>
            <div className="error-container">
              {userErrors.username && <div className="error">{userErrors.username}</div>}
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={userErrors.email ? "input error-input" : "input"}>
            <label htmlFor="email">email</label>
            <div className="error-container">
              {userErrors.email && <div className="error">{userErrors.email}</div>}
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={userErrors.name ? "input error-input" : "input"}>
            <label htmlFor="name">name</label>
            <div className="error-container">
              {userErrors.name && <div className="error">{userErrors.name}</div>}
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-button">
            {updateUserMutation.loading ? <ClipLoader color="white" size="20px" /> : "Save details"}
          </button>
        </form>
      </div>

      <div className="right-column">
        <form className="password-form" onSubmit={passwordFormSubmit}>
          <h2>Edit password</h2>
          {passwordErrors.general && <div className="error">There was an error.</div>}
          <div className={passwordErrors.current ? "input error-input" : "input"}>
            <label htmlFor="currentPassword">current</label>
            <div className="error-container">
              {passwordErrors.current && <div className="error">{passwordErrors.current}</div>}
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={passwordErrors.new ? "input error-input" : "input"}>
            <label htmlFor="newPassword">new</label>
            <div className="error-container">
              {passwordErrors.new && <div className="error">{passwordErrors.new}</div>}
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-button">
            {updatePasswordMutation.loading ? <ClipLoader color="white" size="20px" /> : "Save password"}
          </button>
          
        </form>
      </div>
    </div>
  );
};

SettingsForm.propTypes = {
  
};

export default SettingsForm;