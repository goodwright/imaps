import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { DELETE_SAMPLE } from "../mutations";
import { useHistory } from "react-router";
import { COLLECTION } from "../queries";

const SampleDeletion = props => {

  const { sample } = props;
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const [deleteSample, deleteSampleMutation] = useMutation(DELETE_SAMPLE, {
    onCompleted: data => {
      history.push(sample.collection ? `/collections/${sample.collection.id}/` : "/");
    },
    refetchQueries: [{query: COLLECTION, variables: {id: sample.collection.id}}],
    awaitRefetchQueries: true
  });

  return (
    <div className="sample-deletion">
      <button className="secondary-button" onClick={() => setShowModal(true)}>Delete Sample</button>
      <Modal className="delete-sample-modal" showModal={showModal} setShowModal={setShowModal}>
        <h2>Delete {sample.name}</h2>
        <p>
          Deleting this sample is an irreversible step and will delete all
          associated information. Are you sure you wish to continue?
        </p>
        <div className="buttons">
          <button type="submit" className="primary-button" onClick={() => deleteSample({variables: {id: sample.id}})}>
            {deleteSampleMutation.loading ? <ClipLoader color="white" size="20px" /> : "Yes, delete sample"}
          </button>
          <button className="secondary-button" onClick={() => setShowModal(false)}>No, take me back</button>
        </div>
      </Modal>
    </div>
  );
};

SampleDeletion.propTypes = {
  sample: PropTypes.object.isRequired
};

export default SampleDeletion;