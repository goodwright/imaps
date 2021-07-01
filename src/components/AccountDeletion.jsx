import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import Modal from "./Modal";
import { DELETE_USER } from "../mutations";
import { UserContext } from "../contexts";
import { createErrorObject } from "../forms";
import Button from "./Button";

const AccountDeletion = props => {

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
    <div className={`flex flex-col items-end ${props.className || ""}`}>
      <button className="btn-secondary py-2 w-44 mb-3 sm:py-3" onClick={() => setShowModal(true)}>Delete Account</button>
      <div className="font-light max-w-md text-right">Warning: This is an irreversible process and will remove all data associated solely with your account.</div>
      <Modal
        className="max-w-xl"
        showModal={showModal} setShowModal={setShowModal}
        title="Delete account"
        text="Deleting your account is an irreversible step and will delete all associated information. Are you sure you wish to continue?"
      >
        {error.user && <div className="text-red-800">{error.user}</div>}
        <div className="btn-box mt-6">
          <Button type="submit" className="btn-primary px-4 py-2 text-base" onClick={deleteUser} loading={deleteUserMutation.loading}>
            Yes, delete my account
          </Button>
          <button className="btn-secondary px-4 py-2 text-base" onClick={() => setShowModal(false)}>No, take me back</button>
        </div>
      </Modal>
    </div>
  );
};

AccountDeletion.propTypes = {
  
};

export default AccountDeletion;