import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";
import classNames from "classnames";
import Modal from "./Modal";
import { REQUEST_PASSWORD_RESET } from "../mutations";
import { useMutation } from "@apollo/client";
import emailIcon from "../images/email.svg";

const PasswordResetRequest = props => {

  const { showModal, setShowModal } = props;
  const [email, setEmail] = useState("");
  const [emailUp, setEmailUp] = useState(false);
  const emailClass = classNames({up: emailUp});

  const [requestReset, requestResetMutation] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: () => setTimeout(() => setEmailUp(true), 500)
  })

  const onSubmit = e => {
    e.preventDefault();
    requestReset({variables: {email}})
  }

  return (
    <Modal className="password-reset-request" showModal={showModal} setShowModal={setShowModal}>
      {requestResetMutation.data ? (
        <div className="success">
          <h2>Check your Inbox</h2>
          <div className="info">We have sent password recovery instructions to {email}</div>
          <div className="small-info">Didn't receive an email? Check your spam filter.</div>
          <img src={emailIcon} className={emailClass} alt="email" />
        </div>
      ): (
        <form id="reset" onSubmit={onSubmit}>
          <h2>Reset Password</h2>
          <div className="info">Enter the email associated with your account and we'll send an email with instructions to reset your password.</div>
          <label>Email</label>
          <input type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="button primary-button">
            {requestResetMutation.loading ? <ClipLoader color="white" size="20px" /> : "Request Password Reset"}
          </button>
        </form>
      )}
    </Modal>
  );
};

PasswordResetRequest.propTypes = {
  
};

export default PasswordResetRequest;