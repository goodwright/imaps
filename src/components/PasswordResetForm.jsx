import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Logo from "./Logo";
import { RESET_PASSWORD } from "../mutations";
import Button from "./Button";
import { useHistory, useLocation } from "react-router";
import { createErrorObject } from "../forms";

const PasswordResetForm = () => {

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const token = new URLSearchParams(useLocation().search).get("token");
  const history = useHistory();

  const [resetPassword, resetPasswordMutation] = useMutation(RESET_PASSWORD, {
    onCompleted: () => history.push("/login/"),
    onError: ({graphQLErrors}) => {
      const errors = createErrorObject({}, graphQLErrors);
      console.log(errors)
      setError(errors.password || errors.token || errors.general);
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
    <form onSubmit={onSubmit} className="bg-primary-400 px-8 py-12 w-full h-full relative sm:rounded-lg sm:max-w-md sm:h-auto sm:px-12">
      <Logo inverted={true} showGoodwright={true} className="mx-auto mb-10" svgClassName="h-16 sm:h-20" />

      <div className="ml-16 pl-3">
        <h1 className="text-white text-2xl font-normal">Create new password</h1>
        <div className="text-white cursor-pointer mb-7 font-light">
          This will reset whatever your previous password was.
        </div>
      </div>

      {error && <div className="ml-16 pl-3 mb-2 text-red-800 font-medium">{error}</div>}
      <div className="flex items-center mb-6 w-full">
        <label htmlFor="password" className="text-white mr-3 w-16 block text-right">password</label>
        <input
          type="password"
          id="password"
          className={`big-input bg-white text-primary-500 font-medium flex-grow ${error ? "error" : ""}`}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <div className="flex items-center mb-8 w-full">
        <label htmlFor="confirmedPassword" className="text-white block mr-3 w-16 text-right">confirm</label>
        <input
          type="password"
          id="confirmedPassword"
          className={`big-input bg-white text-primary-500 font-medium flex-grow ${error ? "error" : ""}`}
          value={confirmedPassword}
          onChange={e => setConfirmedPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      <div className="ml-3">
        <Button
          type="submit"
          className="ml-16 btn-primary bg-primary-500 w-36 py-2 rounded-md text-lg font-medium hover:bg-primary-600"
          loading={resetPasswordMutation.loading}
        >Reset</Button>
      </div>

    </form>
  );
};

PasswordResetForm.propTypes = {
  
};

export default PasswordResetForm;