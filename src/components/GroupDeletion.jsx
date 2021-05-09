import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { DELETE_GROUP } from "../mutations";
import { UserContext } from "../contexts";
import { useHistory } from "react-router";

const GroupDeletion = props => {

  const { group } = props;
  const [showModal, setShowModal] = useState(false);
  const [,setUser] = useContext(UserContext);
  const history = useHistory();

  const [deleteGroup, deleteGroupMutation] = useMutation(DELETE_GROUP, {
    onCompleted: data => {
      setUser(data.deleteGroup.user);
      history.push("/");
    }
  });

  return (
    <div className="group-deletion">
      <button className="secondary-button" onClick={() => setShowModal(true)}>Delete Group</button>
      <Modal className="delete-group-modal" showModal={showModal} setShowModal={setShowModal}>
        <h2>Delete {group.name}</h2>
        <p>
          Deleting this group is an irreversible step and will delete all
          associated information. Are you sure you wish to continue?
        </p>
        <div className="buttons">
          <button type="submit" className="primary-button" onClick={() => deleteGroup({variables: {id: group.id}})}>
            {deleteGroupMutation.loading ? <ClipLoader color="white" size="20px" /> : "Yes, delete group"}
          </button>
          <button className="secondary-button" onClick={() => setShowModal(false)}>No, take me back</button>
        </div>
      </Modal>
    </div>
  );
};

GroupDeletion.propTypes = {
  group: PropTypes.object.isRequired
};

export default GroupDeletion;