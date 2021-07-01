import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import { useMutation } from "@apollo/client";
import { LEAVE_GROUP } from "../mutations";
import { UserContext } from "../contexts";
import { createErrorObject } from "../forms";
import Button from "./Button";

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
    <div className="sm:flex items-center">
      <Link to={`/@${group.slug}/`} className="text-primary-200 bg-gray-50 flex justify-between w-full max-w-xs sm:w-60 sm:max-w-none rounded-lg text-sm px-3 py-4 hover:no-underline hover:bg-gray-100">
        <div className="font-bold"><span className="font-medium">@</span>{group.slug}</div>
        <div className="text-primary-100">
          <span className="text-primary-500">{group.userCount}</span> member{group.userCount === 1 ? "" : "s"}
        </div>
      </Link>
      {editable && (
        <>
          <div className="text-red-400 text-sm hover:text-red-500 cursor-pointer mt-1 sm:ml-3 sm:mt-0" onClick={() => setShowModal(true)}>leave</div>
          <Modal
            showModal={showModal}
            className="max-w-md"
            setShowModal={setShowModal}
            title={`Leave ${group.name}?`}
            text="You will lose access to its private data and will have to be invited to rejoin."
          >
            {error.group && <div className="text-red-800">{error.group}</div> }
            <div className="btn-box mt-7 w-full">
              <Button
                type="submit"
                className="btn-primary text-sm py-2 w-full sm:w-36 block"
                onClick={() => leaveGroup({variables: {id: group.id}})}
                loading={leaveGroupMutation.loading}
              >Yes, leave group</Button>
              <button className="btn-secondary text-sm py-2 w-full sm:w-36 block" onClick={() => setShowModal(false)}>No, take me back</button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

GroupSummary.propTypes = {
  group: PropTypes.object.isRequired,
  editable: PropTypes.bool
};

export default GroupSummary;