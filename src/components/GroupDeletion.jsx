import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import Modal from "./Modal";
import { DELETE_GROUP } from "../mutations";
import { UserContext } from "../contexts";
import { useHistory } from "react-router";
import Button from "./Button";

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
    <div className={`flex flex-col items-end ${props.className || ""}`}>
      <button className="btn-secondary py-2 w-44 sm:py-3" onClick={() => setShowModal(true)}>Delete Group</button>
      <Modal
        className="max-w-xl"
        showModal={showModal} setShowModal={setShowModal}
        title={`Delete ${group.name}?`}
        text="Deleting this group is an irreversible step and will delete all associated information. Are you sure you wish to continue?"
      >
        <div className="btn-box mt-6">
          <Button type="submit" className="btn-primary px-4 py-2 text-base" onClick={deleteGroup} loading={deleteGroupMutation.loading}>
            Yes, delete group
          </Button>
          <button className="btn-secondary px-4 py-2 text-base" onClick={() => setShowModal(false)}>No, take me back</button>
        </div>
      </Modal>
    </div>
  );
};

GroupDeletion.propTypes = {
  group: PropTypes.object.isRequired
};

export default GroupDeletion;