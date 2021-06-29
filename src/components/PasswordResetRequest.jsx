import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import Modal from "./Modal";
import { REQUEST_PASSWORD_RESET } from "../mutations";
import Button from "./Button";
import emailIcon from "../images/email.svg";

const PasswordResetRequest = props => {
  /**
   * Modal for taking a user's email and then reporting it has been submitted.
   */

  const { showModal, setShowModal } = props;
  const [email, setEmail] = useState("");
  const [emailUp, setEmailUp] = useState(false);

  const [requestReset, requestResetMutation] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: () => setTimeout(() => setEmailUp(true), 500)
  })

  const onSubmit = e => {
    e.preventDefault();
    requestReset({variables: {email}})
  }

  if (requestResetMutation.data) {
    return (
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title={"Check your Inbox"}
        text={`We have sent password recovery instructions to ${email}`}
        className="max-w-lg w-max"
      >
        <div className="text-primary-200 text-xs -mt-1 mb-2">Didn't receive an email? Check your spam filter.</div>
        <img src={emailIcon} className={`h-28 mx-auto opacity-50 -mb-2 transition duration-1000 transform  relative ${emailUp ? "translate-y-0" : "translate-y-36"}`} alt="email" />
      </Modal>
    )
  }

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Reset Password"
      text="Enter the email associated with your account and we'll send an email with instructions to reset your password."
      className="max-w-lg"
    >
      <form id="reset" onSubmit={onSubmit}>
        <input
          type="email"
          className="bg-gray-100 text-lg mb-4 w-full text-primary-400 mt-3 placeholder-gray-400 placeholder-opacity-70"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="btn-primary w-full" loading={requestResetMutation.loading}>
          Request Password Reset
        </Button>
      </form>
    </Modal>
  )
};

PasswordResetRequest.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};

export default PasswordResetRequest;