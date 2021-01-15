import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { ClipLoader } from "react-spinners";
import Logo from "./Logo";
import goodwright from "../images/by-goodwright.svg"
import { RESET_PASSWORD } from "../mutations";
import { useHistory, useLocation } from "react-router";
import { createErrorObject } from "../forms";

const PasswordResetForm = props => {

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const token = new URLSearchParams(useLocation().search).get("token");
  const history = useHistory();

  const [resetPassword, resetPasswordMutation] = useMutation(RESET_PASSWORD, {
    onCompleted: () => history.push("/login/"),
    onError: ({graphQLErrors}) => {
      const errors = createErrorObject({}, graphQLErrors);
      setError(errors.password || errors.token);
    }
  });

  const onSubmit = e => {
    e.preventDefault();
    if (password !== confirmedPassword) {
      setError("Passwords do not match.");
    } else {
      resetPassword({variables: {token, password}});
    }
  }

  return (
    <form onSubmit={onSubmit} className="signup-form password-reset-form">
      <div className="logo-container">
        <Logo inverted={true} />
        <img src={goodwright} alt="by goodwright" />
      </div>
      <h1>Create new password</h1>
      <div className="info">
        This will reset whatever your previous password was.
      </div>
      {error && <div className="error">{error}</div>}
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
      <div className="input">
        <label htmlFor="confirmedPassword">confirm</label>
        <input
          type="password"
          id="confirmedPassword"
          value={confirmedPassword}
          onChange={e => setConfirmedPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <button type="submit" className="primary-button">
        {resetPasswordMutation.loading ? <ClipLoader color="white" size="20px" /> : "Reset"}
      </button>
    </form>
  );
};

PasswordResetForm.propTypes = {
  
};

export default PasswordResetForm;