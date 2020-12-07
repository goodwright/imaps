import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "../mutations";
import Logo from "./Logo";
import goodwright from "../images/by-goodwright.svg"
import { UserContext } from "../contexts";
import { createErrorObject } from "../forms";

const SignupForm = () => {

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [,setUser] = useContext(UserContext);
  const history = useHistory();

  const [signup, signupMutation] = useMutation(SIGNUP, {
    onCompleted: data => {
      setUser(data.signup.user);
      history.push("/");
    },
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
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

      {errors.general && <div className="error">There was an error.</div>}
      <div className={errors.username ? "input error-input" : "input"}>
        <label htmlFor="username">username</label>
        <div className="error-container">
          {errors.username && <div className="error">{errors.username}</div>}
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autocapitalize="none"
            autoComplete="username"
          />
        </div>
      </div>

      <div className={errors.name ? "input error-input" : "input"}>
        <label htmlFor="name">name</label>
        <div className="error-container">
          {errors.name && <div className="error">{errors.name}</div>}
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
      </div>

      <div className={errors.email ? "input error-input" : "input"}>
        <label htmlFor="email">email</label>
        <div className="error-container">
          {errors.email && <div className="error">{errors.email}</div>}
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
      </div>

      <div className={errors.password ? "input error-input" : "input"}>
        <label htmlFor="password">password</label>
        <div className="error-container">
          {errors.password && <div className="error">{errors.password}</div>}
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
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