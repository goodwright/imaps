import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { DELETE_EXECUTION } from "../mutations";
import { useHistory } from "react-router";
import { COLLECTION, SAMPLE } from "../queries";
import Button from "./Button";

const ExecutionDeletion = props => {

  const { execution } = props;
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const [deleteExecution, deleteExecutionMutation] = useMutation(DELETE_EXECUTION, {
    onCompleted: () => {
      history.push(execution.sample ? `/samples/${execution.sample.id}/` : execution.collection ? `/collections/${execution.collection.id}/` : "/");
    },
    refetchQueries: [
      {query: COLLECTION, variables: {id: execution.collection ? execution.collection.id : null}},
      {query: SAMPLE, variables: {id: execution.sample ? execution.sample.id : null}}
    ],
    awaitRefetchQueries: true
  });

  const canBreak = !execution.name.includes(" ");

  return (
    <div>
      <button className="btn-secondary text-base py-2" onClick={() => setShowModal(true)}>Delete Execution</button>
      <Modal
        className="max-w-xl"
        showModal={showModal} setShowModal={setShowModal}
        title={`Delete ${execution.name}?`}
        breakTitle={canBreak}
        text="Deleting this execution is an irreversible step and will delete all associated information. Are you sure you wish to continue?"
      >
        <div className="btn-box mt-6">
          <Button type="submit" className="btn-primary px-4 py-2 text-base" onClick={() => deleteExecution({variables: {id: execution.id}})} loading={deleteExecutionMutation.loading}>
            Yes, delete execution
          </Button>
          <button className="btn-secondary px-4 py-2 text-base" onClick={() => setShowModal(false)}>No, take me back</button>
        </div>
      </Modal>
    </div>
  );
};

ExecutionDeletion.propTypes = {
  execution: PropTypes.object.isRequired
};

export default ExecutionDeletion;