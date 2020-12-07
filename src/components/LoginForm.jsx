import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { ClipLoader } from "react-spinners";
import Logo from "./Logo";
import goodwright from "../images/by-goodwright.svg"
import { useMutation } from "@apollo/client";
import { LOGIN } from "../mutations";
import { UserContext } from "../contexts";

const LoginForm = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [,setUser] = useContext(UserContext);
  const history = useHistory();
  const [error, setError] = useState(false);
  const className = classNames({
    "signup-form": true, "login-form": true, "error-form": error
  })

  const [login, loginMutation] = useMutation(LOGIN, {
    onCompleted: data => {
      setUser(data.login.user);
      history.push("/");
    },
    onError: () => setError(true)
  });

  const formSubmit = e => {
    e.preventDefault();
    setError(false);
    login({
      variables: {username, password}
    });
  }

  return (
    <form className={className} onSubmit={formSubmit}>
      <div className="logo-container">
        <Logo inverted={true} />
        <img src={goodwright} alt="by goodwright" />
      </div>

      {error && <div className="error">Those credentials aren't valid.</div>}
      <div className="input">
        <label htmlFor="username">username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
          autocapitalize="none"
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
      <button type="submit" className="primary-button">
        {loginMutation.loading ? <ClipLoader color="white" size="20px" /> : "Log In"}
      </button>
      <Link className="auth-link" to="/signup/">Sign Up</Link>
    </form>
  );
};

LoginForm.propTypes = {
  
};

export default LoginForm;