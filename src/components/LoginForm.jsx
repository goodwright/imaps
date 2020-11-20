import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import goodwright from "../images/by-goodwright.svg"

const LoginForm = props => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="login-form signup-form">
      <div className="logo-container">
        <Logo inverted={true} />
        <img src={goodwright} alt="by goodwright" />
      </div>

      <div className="input">
        <label htmlFor="username">username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>

      <div className="input">
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>
      <input type="submit" value="Log In" className="primary-button" />
      <Link className="auth-link" to="/signup/">Sign Up</Link>
    </form>
  );
};

LoginForm.propTypes = {
  
};

export default LoginForm;