import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import Toggle from "../components/Toggle";
import { USER, PUBLIC_COLLECTIONS, USER_COLLECTIONS } from "../queries";
import { CREATE_COLLECTION } from "../mutations";
import { UserContext } from "../contexts";
import { createErrorObject } from "../forms";
import Base from "./Base";
import Button from "../components/Button";

const NewCollectionPage = () => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [errors, setErrors] = useState({});
  const [user] = useContext(UserContext);
  const history = useHistory();

  useDocumentTitle("iMaps - New Collection");

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

  const rowClass = "sm:flex items-center mb-8 w-full";
  const offset = "sm:ml-20 sm:pl-2";
  const inputClass = "bg-gray-100 w-full sm:w-auto sm:flex-grow rounded outline-none px-2 py-2";
  const labelClass = "mr-2 block w-20 whitespace-nowrap text-xs block sm:text-right md:text-sm md:w-20";
  const errorClass = `${offset} text-red-800 text-sm mb-1`;

  return (
    <Base>
      <h1>Create a collection</h1>
      <div className="font-light mb-6 md:mb-10 max-w-2xl">
        Collections are the top-level container for data in iMaps. They are used
        to group related samples and other data which together contribute to a
        single overall research question. They may be associated with a particular
        published paper, and you can decide whether to make it private or public.
      </div>

      <form onSubmit={formSubmit} className="max-w-2xl">
        {errors.name && <div className={errorClass}>{errors.name}</div>}
        <div className={rowClass}>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input
            id="name"
            type="text"
            className={inputClass}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        {errors.description && <div className={errorClass}>{errors.description}</div>}
        <div className={`${rowClass} items-start`}>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea
            id="description"
            value={description}
            className={`${inputClass} h-24 resize-none sm:h-30 md:h-36 text-sm`}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        <Toggle
          checked={isPrivate}
          onChange={() => setIsPrivate(!isPrivate)}
          icons={false}
          trueLabel="Private"
          falseLabel="Public"
          className={`w-max ${offset} mb-2`}
        />
        <div className={`text-sm mb-8 font-light ${offset}`}>
          (You can change this setting later if, for example, you wanted to make a dataset public upon publication of a paper.)
        </div>

        <div className={offset}>
          <Button type="submit" className="btn-primary py-2 sm:py-3" loading={createCollectionMutation.loading}>
            Create Collection
          </Button>
        </div>
      </form>
    </Base>
  );
};

NewCollectionPage.propTypes = {
  
};

export default NewCollectionPage;