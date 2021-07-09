import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import moment from "moment";
import { COLLECTION, PUBLIC_COLLECTIONS, USER_COLLECTIONS } from "../queries";
import { UPDATE_COLLECTION } from "../mutations";
import Button from "./Button";
import Toggle from "./Toggle";
import { createErrorObject } from "../forms";

const CollectionInfo = props => {

  const { collection, editing, papers } = props;
  const [specifiedPrivacy, setSpecifiedPrivacy] = useState(null);
  const [errors, setErrors] = useState({});
  const nameEl = useRef(null);
  const descriptionEl = useRef(null);
  const history = useHistory();

  const isPrivate = specifiedPrivacy === null ? collection.private : specifiedPrivacy;

  const [updateCollection, updateCollectionMutation] = useMutation(UPDATE_COLLECTION, {
    refetchQueries: [
      {query: COLLECTION, variables: {id: collection.id}},
      {query: PUBLIC_COLLECTIONS}, {query: USER_COLLECTIONS}
    ],
    awaitRefetchQueries: true,
    onCompleted: data => {
      setErrors({});
      history.push(`/collections/${data.updateCollection.collection.id}/`);
    },
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
  });

  const formSubmit = e => {
    e.preventDefault();
    updateCollection({
      variables: {
        id: collection.id, name: nameEl.current.innerText,
        description: descriptionEl.current.innerText,
        private: isPrivate,
        papers: papers.filter(p => p.title.length > 0 && p.url.length > 0 && p.year)
      }
    })
  }

  const buttonClass = "w-max py-px px-2 -ml-2 sm:px-3 sm:ml-2 text-xs sm:text-sm flex items-center hover:no-underline";

  const Element = editing ? "form" : "div";

  return (
    <Element className={`max-w-5xl 2xl:pb-8 2xl:border-b w-full ${props.className || ""}`} onSubmit={formSubmit}>
      {errors.name && <div className="text-red-800 text-sm mt-2">{errors.name}</div>}
      <h1
        className={`border-b border-opacity-0 ${editing && "outline-none border-opacity-100 border-primary-200 max-w-full"} ${errors.name ? "bg-red-100" : editing ? "bg-gray-100" : ""}`}
        contentEditable={editing} suppressContentEditableWarning={editing}
        ref={nameEl}
      >{collection.name}</h1>

      {errors.description && <div className="text-red-800 text-sm mt-2">{errors.description}</div>}
      <p
        className={`font-light mb-3 text-xs sm:text-sm md:text-base border-b border-opacity-0 ${editing && "min-w-20 border-opacity-100 border-primary-200 outline-none"} ${errors.description ? "bg-red-100" : editing ? "bg-gray-100" : ""}`}
        contentEditable={editing} suppressContentEditableWarning={editing}
        ref={descriptionEl}
      >{collection.description}</p>


      <div className={`sm:flex items-center font-light text-primary-100 text-xs sm:text-sm`}>
        {editing && (
          <Toggle
            checked={isPrivate}
            onChange={e => setSpecifiedPrivacy(e.target.checked)}
            trueLabel="Private"
            falseLabel="Public"
            className="absolute"
          />
        )}
        <div className={`mb-1 sm:mb-0  ${editing && "opacity-0"}`}>
          Created {moment(collection.created * 1000).format("D MMMM, YYYY")}
        </div>
        <div className={`hidden sm:block mx-2 ${editing && "opacity-0"}`}>|</div>
        <div className={editing && "opacity-0"}>
          Modified {moment(collection.lastModified * 1000).format("D MMMM, YYYY")}
        </div>
        {collection.canEdit && !editing && (
          <Link
            className={`btn-tertiary text-primary-500 ${buttonClass}`}
            to={`/collections/${collection.id}/edit/`}
          >Edit Collection</Link>
        )}
        {editing && (
          <Button onClick={() =>{}} className={`btn-primary text-white ${buttonClass}`} loading={updateCollectionMutation.loading}>
            Save Changes
          </Button>
        )}
      </div>
    </Element>
  );
};

CollectionInfo.propTypes = {
  collection: PropTypes.object.isRequired,
  editing: PropTypes.bool,
  papers: PropTypes.array.isRequired,
};

export default CollectionInfo;