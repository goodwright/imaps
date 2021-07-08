import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import Modal from "./Modal";
import { DELETE_SAMPLE } from "../mutations";
import { useHistory } from "react-router";
import { COLLECTION } from "../queries";
import Button from "./Button";

const SampleDeletion = props => {

  const { sample } = props;
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const [deleteSample, deleteSampleMutation] = useMutation(DELETE_SAMPLE, {
    onCompleted: () => {
      history.push(sample.collection ? `/collections/${sample.collection.id}/` : "/");
    },
    refetchQueries: [{query: COLLECTION, variables: {id: sample.collection.id}}],
    awaitRefetchQueries: true
  });

  const canBreak = !sample.name.includes(" ");

  return (
    <div className="sample-deletion">
      <button className="btn-secondary text-base py-2" onClick={() => setShowModal(true)}>Delete Sample</button>
      <Modal
        className="max-w-xl"
        showModal={showModal} setShowModal={setShowModal}
        title={`Delete ${sample.name}?`}
        breakTitle={canBreak}
        text="Deleting this sample is an irreversible step and will delete all associated information. Are you sure you wish to continue?"

      >
        <div className="btn-box mt-6">
          <Button type="submit" className="btn-primary px-4 py-2 text-base" onClick={() => deleteSample({variables: {id: sample.id}})} loading={deleteSampleMutation.loading}>
            Yes, delete sample
          </Button>
          <button className="btn-secondary px-4 py-2 text-base" onClick={() => setShowModal(false)}>No, take me back</button>
        </div>
      </Modal>
    </div>
  );
};

SampleDeletion.propTypes = {
  sample: PropTypes.object.isRequired
};

export default SampleDeletion;