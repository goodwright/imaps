import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { DELETE_EXECUTION } from "../mutations";
import { useHistory } from "react-router";
import { COLLECTION, SAMPLE } from "../queries";

const ExecutionDeletion = props => {

  const { execution } = props;
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const [deleteExecution, deleteExecutionMutation] = useMutation(DELETE_EXECUTION, {
    onCompleted: data => {
      history.push(execution.sample ? `/samples/${execution.sample.id}/` : execution.collection ? `/collections/${execution.collection.id}/` : "/");
    },
    refetchQueries: [{query: COLLECTION, variables: {id: execution.collection ? execution.collection.id : null}}],
    refetchQueries: [{query: SAMPLE, variables: {id: execution.sample ? execution.sample.id : null}}],
    awaitRefetchQueries: true
  });

  return (
    <div className="execution-deletion">
      <button className="secondary-button" onClick={() => setShowModal(true)}>Delete Execution</button>
      <Modal className="delete-execution-modal" showModal={showModal} setShowModal={setShowModal}>
        <h2>Delete {execution.name}</h2>
        <p>
          Deleting this execution is an irreversible step and will delete all
          associated information. Are you sure you wish to continue?
        </p>
        <div className="buttons">
          <button type="submit" className="primary-button" onClick={() => deleteExecution({variables: {id: execution.id}})}>
            {deleteExecutionMutation.loading ? <ClipLoader color="white" size="20px" /> : "Yes, delete execution"}
          </button>
          <button className="secondary-button" onClick={() => setShowModal(false)}>No, take me back</button>
        </div>
      </Modal>
    </div>
  );
};

ExecutionDeletion.propTypes = {
  execution: PropTypes.object.isRequired
};

export default ExecutionDeletion;