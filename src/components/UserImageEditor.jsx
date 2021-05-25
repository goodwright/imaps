import React, { useRef, useState, useContext } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { ClipLoader } from "react-spinners";
import { getMediaLocation } from "../api";
import { UPDATE_USER_IMAGE } from "../mutations";
import { UserContext } from "../contexts";
import { createErrorObject } from "../forms";

const UserImageEditor = props => {

  const { user } = props;

  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});
  const [,setUser] = useContext(UserContext);

  const [updateImage, updateImageMutation] = useMutation(UPDATE_USER_IMAGE, {
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors));
    },
    onCompleted: data => {
      setErrors({});
      setFileName("");
      setUser(data.updateUserImage.user);
    }
  });

  const imageChanged = e => {
    if (e.target.files.length) {
      setFileName(e.target.files[0].name);
    }
  }

  const formSubmit = e => {
    e.preventDefault();
    if (fileRef.current.files.length) {
      if (fileRef.current.files[0].size > 1048576) {
        setErrors({"image": "Image must be less than 1MB"})
      } else {
        updateImage({
          variables: {image: fileRef.current.files[0]}
        });
      }
    }
  }

  return (
    <div className="user-image-editor">
      <div className="title">Edit Photo</div>
      <form onSubmit={formSubmit}>
        <div className="file-upload">
          <label htmlFor="file" />
          <input type="file" id="file" ref={fileRef} onChange={imageChanged} accept="image/*"/>

          {user.image && !(fileRef.current&& fileRef.current.files.length) ? (
            <img src={`${process.env.REACT_APP_FILES}${user.image}`} alt=""/>
          ) : fileRef.current && fileRef.current.files.length ? (
            <img src={URL.createObjectURL(fileRef.current.files[0])} alt="" />
          ): (
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M6.98437 0.864746L6.98437 13.2715" strokeWidth="1.5"/>
              <path d="M13.1885 6.90917L0.78176 6.90918" strokeWidth="1.5"/>
            </svg>
          )}
        </div>
        
        <div className="error-container">
          {errors.image && <div className="error">{errors.image}</div> }
          <button type="submit" className="button primary-button" disabled={!fileName}>
            {updateImageMutation.loading ? <ClipLoader color="white" size="20px" /> : "Upload New Photo"}
          </button>
        </div>
      </form>
    </div>
  );
};

UserImageEditor.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserImageEditor;