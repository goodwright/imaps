import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { DELETE_USER } from "../mutations";
import { UserContext } from "../contexts";
import { createErrorObject } from "../forms";

const AccountDeletion = () => {

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState({});
  const [,setUser] = useContext(UserContext);
  const history = useHistory();

  const [deleteUser, deleteUserMutation] = useMutation(DELETE_USER, {
    onCompleted: () => {
      setUser(false);
      history.push("/");
    },
    onError: ({graphQLErrors}) => {
      setError(createErrorObject(error, graphQLErrors))
    }
  })

  return (
    <div className="account-deletion">
      <button className="secondary-button" onClick={() => setShowModal(true)}>Delete Account</button>
      <p>Warning: This is an irreversible process and will remove all data associated solely with your account.</p>
      <Modal className="delete-account-modal" showModal={showModal} setShowModal={setShowModal}>
        <h2>Delete account</h2>
        <p>
          Deleting your account is an irreversible step and will delete all
          associated information. Are you sure you wish to continue?
        </p>
        {error.user && <div className="error">{error.user}</div>}
        <div className="buttons">
          <button type="submit" className="primary-button" onClick={deleteUser}>
            {deleteUserMutation.loading ? <ClipLoader color="white" size="20px" /> : "Yes, delete my account"}
          </button>
          <button className="secondary-button" onClick={() => setShowModal(false)}>No, take me back</button>
        </div>
      </Modal>
    </div>
  );
};

AccountDeletion.propTypes = {
  
};

export default AccountDeletion;