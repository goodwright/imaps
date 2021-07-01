import React, { useRef, useState, useContext } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_IMAGE } from "../mutations";
import { UserContext } from "../contexts";
import { createErrorObject } from "../forms";
import Button from "./Button";
const colors = require("tailwindcss/colors");

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
    <div>
      <h2 className="text-primary-200 text-xl mb-2 md:mb-3">Edit Photo</h2>
      <form onSubmit={formSubmit} className="flex items-center flex-col sm:flex-row w-max">
        <div className="sm:mr-6">
          <label
            htmlFor="file"
            className="bg-gray-200 text-gray-500 mb-1 w-28 h-28 rounded-full flex justify-center items-center text-7xl leading-1 overflow-hidden cursor-pointer hover:bg-gray-300 hover:text-gray-600"
          >
            {user.image && !(fileRef.current&& fileRef.current.files.length) ? (
              <img src={`${process.env.REACT_APP_FILES}/${user.image}`} alt="" className="object-cover h-full w-full"/>
            ) : fileRef.current && fileRef.current.files.length ? (
              <img src={URL.createObjectURL(fileRef.current.files[0])} alt="" className="object-cover h-full w-full" />
            ): (
              <svg viewBox="0 0 14 14" fill="none" className="w-1/3 h-1/3">
                <path d="M6.98437 0.864746L6.98437 13.2715" strokeWidth="1.5" stroke={colors.gray[400]}/>
                <path d="M13.1885 6.90917L0.78176 6.90918" strokeWidth="1.5" stroke={colors.gray[400]}/>
              </svg>
            )}
          </label>
          <input type="file" id="file" ref={fileRef} onChange={imageChanged} accept="image/*" className="hidden" />
        </div>
        
        <div className="relative mt-3 sm:mt-0">
          {errors.image && <div className="text-red-800 absolute -top-5 text-sm">{errors.image}</div>}
          <Button type="submit" className={`btn-primary text-base py-1 w-48 ${!fileName && "opacity-50 cursor-auto hover:bg-primary-400"}`} disabled={!fileName} loading={updateImageMutation.loading}>
            Upload New Photo
          </Button>
        </div>
      </form>
    </div>
  );
};

UserImageEditor.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserImageEditor;