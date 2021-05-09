import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { DELETE_COLLECTION } from "../mutations";
import { useHistory } from "react-router";

const CollectionDeletion = props => {

  const { collection } = props;
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const [deleteCollection, deleteCollectionMutation] = useMutation(DELETE_COLLECTION, {
    onCompleted: data => {
      history.push("/");
    }
  });

  return (
    <div className="collection-deletion">
      <button className="secondary-button" onClick={() => setShowModal(true)}>Delete Collection</button>
      <Modal className="delete-collection-modal" showModal={showModal} setShowModal={setShowModal}>
        <h2>Delete {collection.name}</h2>
        <p>
          Deleting this collection is an irreversible step and will delete all
          associated information. Are you sure you wish to continue?
        </p>
        <div className="buttons">
          <button type="submit" className="primary-button" onClick={() => deleteCollection({variables: {id: collection.id}})}>
            {deleteCollectionMutation.loading ? <ClipLoader color="white" size="20px" /> : "Yes, delete collection"}
          </button>
          <button className="secondary-button" onClick={() => setShowModal(false)}>No, take me back</button>
        </div>
      </Modal>
    </div>
  );
};

CollectionDeletion.propTypes = {
  collection: PropTypes.object.isRequired
};

export default CollectionDeletion;