import React, { useState } from "react";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "../contexts";

const SettingsForm = props => {

  const [user,] = useContext(UserContext);

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");


  return (
    <div className="settings-form">
      <div className="left-column">
        <form className="user-form">
          <h2>Edit details</h2>

          <div className="input">
            <label htmlFor="username">username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <label htmlFor="email">email</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <label htmlFor="name">name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primary-button">Save details</button>
        </form>
      </div>

      <div className="right-column">
        <form className="password-form">
          <h2>Edit password</h2>

          <div className="input">
            <label htmlFor="currentPassword">current</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <label htmlFor="newPassword">new</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primary-button">Save password</button>
          
        </form>
      </div>
    </div>
  );
};

SettingsForm.propTypes = {
  
};

export default SettingsForm;