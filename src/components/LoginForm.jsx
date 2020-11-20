import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import goodwright from "../images/by-goodwright.svg"
import { useMutation } from "@apollo/client";
import { LOGIN } from "../mutations";
import { TokenContext } from "../contexts";

const LoginForm = props => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setToken = useContext(TokenContext);
  const history = useHistory();

  const [login, loginMutation] = useMutation(LOGIN, {
    onCompleted: data => {
      setToken(data.login.accessToken);
      history.push("/");
    }
  });

  const formSubmit = e => {
    e.preventDefault();
    login({
      variables: {username, password}
    });
  }

  return (
    <form className="login-form signup-form" onSubmit={formSubmit}>
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
          required
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
          required
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