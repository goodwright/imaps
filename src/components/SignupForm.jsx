import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "../mutations";
import Logo from "./Logo";
import goodwright from "../images/by-goodwright.svg"
import { TokenContext, UserContext } from "../contexts";

const SignupForm = () => {

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setToken = useContext(TokenContext);
  const [,setUser] = useContext(UserContext);
  const history = useHistory();

  const [signup, signupMutation] = useMutation(SIGNUP, {
    onCompleted: data => {
      setUser(data.signup.user);
      setToken(data.signup.accessToken);
      history.push("/");
    },
  });

  const formSubmit = e => {
    e.preventDefault();
    signup({
      variables: {username, password, name, email}
    });
  }

  return (
    <form className="signup-form" onSubmit={formSubmit}>
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
        <label htmlFor="name">name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          autoComplete="name"
        />
      </div>

      <div className="input">
        <label htmlFor="email">email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
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
      <Link className="terms-link" to="/terms/">Terms and Conditions</Link>
      <button type="submit" className="primary-button">
        {signupMutation.loading ? <ClipLoader color="white" size="20px" /> : "Sign Up"}
      </button>
      <Link className="auth-link" to="/login/">Log In</Link>
    </form>
  );
};

SignupForm.propTypes = {
  
};

export default SignupForm;