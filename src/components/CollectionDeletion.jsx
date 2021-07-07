import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import { PUBLIC_COLLECTIONS, USER_COLLECTIONS } from "../queries";
import { DELETE_COLLECTION } from "../mutations";
import Modal from "./Modal";
import Button from "./Button";

const CollectionDeletion = props => {

  const { collection } = props;
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const [deleteCollection, deleteCollectionMutation] = useMutation(DELETE_COLLECTION, {
    refetchQueries: [{query: PUBLIC_COLLECTIONS}, {query: USER_COLLECTIONS}],
    onCompleted: () => {
      history.push("/");
    }
  });

  return (
    <div>
      <button className="btn-secondary text-base py-2" onClick={() => setShowModal(true)}>Delete Collection</button>
      <Modal
        className="max-w-xl"
        showModal={showModal} setShowModal={setShowModal}
        title={`Delete ${collection.name}?`}
        text="Deleting this collection is an irreversible step and will delete all associated information. Are you sure you wish to continue?"
      >
        <div className="btn-box mt-6">
          <Button type="submit" className="btn-primary px-4 py-2 text-base" onClick={() => deleteCollection({variables: {id: collection.id}})} loading={deleteCollectionMutation.loading}>
            Yes, delete collection
          </Button>
          <button className="btn-secondary px-4 py-2 text-base" onClick={() => setShowModal(false)}>No, take me back</button>
        </div>
      </Modal>
    </div>
  );
};

CollectionDeletion.propTypes = {
  collection: PropTypes.object.isRequired
};

export default CollectionDeletion;