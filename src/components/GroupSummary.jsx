import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { useMutation } from "@apollo/client";
import { LEAVE_GROUP } from "../mutations";
import { UserContext } from "../contexts";
import { createErrorObject } from "../forms";

const GroupSummary = props => {

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState({});
  const { group, editable } = props;
  const [,setUser] = useContext(UserContext);

  const [leaveGroup, leaveGroupMutation] = useMutation(LEAVE_GROUP, {
    onCompleted: data => {
      setShowModal(false);
      setUser(data.leaveGroup.user);
    },
    onError: ({graphQLErrors}) => {
      setError(createErrorObject(error, graphQLErrors))
    }
  });

  return (
    <div className="group-container">
      <Link to={`/@${group.slug}/`} className="group">
        <div className="group-name"><span className="at">@</span>{group.slug}</div>
        <div className="user-count">
          <span className="number">{group.userCount}</span> member{group.userCount === 1 ? "" : "s"}
        </div>
      </Link>
      {editable && <>
        <div className="leave" onClick={() => setShowModal(true)}>leave</div>
        <Modal showModal={showModal} setShowModal={setShowModal} className="leave-group-modal">
          <h2>Leave {group.name}?</h2>
          <p>You will lose access to its private data and will have to be invited
            to rejoin.</p>
            {error.group && <div className="error">{error.group}</div> }
          <div className="buttons">
            <button type="submit" className="primary-button" onClick={() => leaveGroup({variables: {id: group.id}})}>
              {leaveGroupMutation.loading ? <ClipLoader color="white" size="20px" /> : "Yes, leave group"}
            </button>
            <button className="secondary-button" onClick={() => setShowModal(false)}>No, take me back</button>
          </div>
        </Modal>
      </>}
    </div>
  );
};

GroupSummary.propTypes = {
  group: PropTypes.object.isRequired,
  editable: PropTypes.bool
};

export default GroupSummary;