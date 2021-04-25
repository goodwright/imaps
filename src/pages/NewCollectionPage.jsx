import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import Toggle from "react-toggle";
import { ClipLoader } from "react-spinners";
import { USER, PUBLIC_COLLECTIONS, USER_COLLECTIONS } from "../queries";
import { CREATE_COLLECTION } from "../mutations";
import { UserContext } from "../contexts";
import { createErrorObject } from "../forms";
import Base from "./Base";

const NewCollectionPage = () => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [errors, setErrors] = useState({});
  const [user] = useContext(UserContext);
  const history = useHistory();

  const [createCollection, createCollectionMutation] = useMutation(CREATE_COLLECTION, {
    refetchQueries: [
      {query: USER}, {query: USER, variables: {username: user.username}},
      {query: PUBLIC_COLLECTIONS}, {query: USER_COLLECTIONS}
    ],
    onCompleted: data => {
      history.push(`/collections/${data.createCollection.collection.id}/`);
    },
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
  });

  const formSubmit = e => {
    e.preventDefault();
    createCollection({
      variables: {name, description, private: isPrivate}
    })
  }

  return (
    <Base className="new-collection-page">
      <div className="page-content">
        <h1>Create a collection</h1>
        <p>
          Collections are the top-level container for data in iMaps. They are used
          to group related samples and other data which together contribute to a
          single overall research question. They may be associated with a particular
          published paper, and you can decide whether to make it private or public.
        </p>

        <form onSubmit={formSubmit}>
          <div className={errors.name ? "input error-input" : "input"}>
            <label htmlFor="name">Name</label>
            <div className="error-container">
              {errors.name && <div className="error">{errors.name}</div>}
              <input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={errors.description ? "input error-input" : "input"}>
            <label htmlFor="description">Description</label>
            <div className="error-container">
              {errors.description && <div className="error">{errors.description}</div>}
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input">
            <label htmlFor="private">Privacy</label>
            <div>
              <div className="binary-toggle">
                <label className={isPrivate ? "" : "selected"}>Public</label>
                <Toggle
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                  icons={false}
                  />
                <label className={isPrivate ? "selected" : ""}>Private</label>
              </div>
              <div className="info">(You can change this setting later if, for example, you wanted to make a dataset public upon publication of a paper.)</div>
            </div>
          </div>

          <button type="submit" className="primary-button">
            {createCollectionMutation.loading ? <ClipLoader color="white" size="20px" /> : "Create Collection"}
          </button>
        </form>
      </div>
    </Base>
  );
};

NewCollectionPage.propTypes = {
  
};

export default NewCollectionPage;