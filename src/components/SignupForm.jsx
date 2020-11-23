import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import goodwright from "../images/by-goodwright.svg"

const SignupForm = () => {

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="signup-form">
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
        {false ? <ClipLoader color="white" size="20px" /> : "Sign Up"}
      </button>
      <Link className="auth-link" to="/login/">Log In</Link>
    </form>
  );
};

SignupForm.propTypes = {
  
};

export default SignupForm;