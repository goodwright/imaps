import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import moment from "moment";
import { COLLECTION, SAMPLE, PUBLIC_COLLECTIONS, USER_COLLECTIONS } from "../queries";
import { UPDATE_SAMPLE } from "../mutations";
import tick from "../images/tick.svg";
import cross from "../images/cross.svg";
import { createErrorObject } from "../forms";
import Button from "./Button";

const SampleInfo = props => {

  const { sample, editing, possibleCollections } = props;
  const nameEl = useRef(null);
  const annotatorEl = useRef(null);
  const organismEl = useRef(null);
  const piEl = useRef(null);
  const sourceEl = useRef(null);
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const [selectedCollection, setSelectedCollection] = useState(sample.collection ? sample.collection.id : null);
  const collections = [...possibleCollections];
  if (sample.collection && !collections.map(c => c.id).includes(sample.collection.id)) {
    collections.push(sample.collection)
  }

  const [updateSample, updateSampleMutation] = useMutation(UPDATE_SAMPLE, {
    refetchQueries: [
      {query: COLLECTION, variables: {id: sample.collection.id}},
      {query: SAMPLE, variables: {id: sample.id}},
      {query: PUBLIC_COLLECTIONS, variables: {first: 24, last: 24}},
      {query: USER_COLLECTIONS}
    ],
    awaitRefetchQueries: true,
    onCompleted: data => {
      setErrors({});
      history.push(`/samples/${data.updateSample.sample.id}/`);
    },
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
  });

  const save = e => {
    e.preventDefault();
    updateSample({
      variables: {
        id: sample.id,
        name: nameEl.current.innerText,
        collection: selectedCollection,
        annotatorName: annotatorEl.current.innerText,
        piName: piEl.current.innerText,
        organism: organismEl.current.innerText,
        source: sourceEl.current.innerText,
      }
    })
  }

  const Element = editing ? "form" : "div";
  const canBreak = !sample.name.includes(" ");

  const pairClass = "flex sm:inline-flex mr-6 mb-1";
  const propertyClass = "font-semibold";
  const valueClass = "font-light border-b border-opacity-0";
  const editingClass = "outline-none border-opacity-100 border-primary-200";
  const buttonClass = "w-max py-px px-2 -ml-2 sm:px-3 sm:ml-2 text-xs sm:text-sm flex items-center hover:no-underline";

  return (
    <Element className={`flex relative justify-between ${props.className || ""}`} onSubmit={save}>
      {errors.name && <div className=" absolute -top-8 text-red-800 text-sm mt-2">{errors.name}</div>}
      <div className="flex-grow">
        <h1
          className={`border-b border-opacity-0 ${canBreak && "break-all"} ${editing && "outline-none border-opacity-100 border-primary-200 max-w-full"} ${errors.name ? "bg-red-100" : editing ? "bg-gray-100" : ""}`}
          contentEditable={editing} suppressContentEditableWarning={editing}
          ref={nameEl}
        >{sample.name}</h1>
        {sample.collection && (
          <div className="text-sm">
            <span>Collection:&nbsp;</span>
            {!editing && <Link to={`/collections/${sample.collection.id}/`}>{sample.collection.name}</Link>}
            {editing && (
              <select
                className="outline-none cursor-pointer"
                value={selectedCollection}
                onChange={e => setSelectedCollection(e.target.value)}
              >
                {possibleCollections.map(c => (
                  <option value={c.id} key={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
        )}
        <div className={`sm:flex items-center font-light text-primary-100 text-xs sm:text-sm mt-1 mb-4`}>
          <div className={`mb-1 sm:mb-0  ${editing && "opacity-0"}`}>
            Created {moment(sample.created * 1000).format("D MMMM, YYYY")}
          </div>
          <div className={`hidden sm:block mx-2 ${editing && "opacity-0"}`}>|</div>
          <div className={editing && "opacity-0"}>
            Modified {moment(sample.lastModified * 1000).format("D MMMM, YYYY")}
          </div>
          {sample.canEdit && !editing && (
            <Link
              className={`btn-tertiary text-primary-500 ${buttonClass}`}
              to={`/samples/${sample.id}/edit/`}
            >Edit Sample</Link>
          )}
          {editing && (
            <Button onClick={() =>{}} className={`btn-primary text-white ${buttonClass}`} loading={updateSampleMutation.loading}>
              Save Changes
            </Button>
          )}
        </div>

        {errors.annotator_name && <div className="text-red-800 text-sm mt-2">{errors.annotator_name}</div>}
        {errors.pi_name && <div className="text-red-800 text-sm mt-2">{errors.pi_name}</div>}
        {errors.source && <div className="text-red-800 text-sm mt-2">{errors.source}</div>}
        {errors.organism && <div className="text-red-800 text-sm mt-2">{errors.organism}</div>}
        <div className="text-sm md:text-base text-primary-300 -mr-6 -mb-1">
          <div className={pairClass}>
            <div className={propertyClass}>Annotator:&nbsp;</div>
            <div
              className={`${valueClass} ${editing && editingClass} ${errors.annotator_name ? "bg-red-100" : editing ? "bg-gray-100" : ""}`}
              contentEditable={editing} suppressContentEditableWarning={editing}
              ref={annotatorEl}
            >{sample.annotatorName || "N/A"}</div>
          </div>
          <div className={pairClass}>
            <div className={propertyClass}>Organism:&nbsp;</div>
            <div
              className={`${valueClass} ${sample.organism ? "italic" : ""} ${editing && editingClass} ${errors.organism ? "bg-red-100" : editing ? "bg-gray-100" : ""}`}
              contentEditable={editing} suppressContentEditableWarning={editing}
              ref={organismEl}
            >{sample.organism || "N/A"}</div>
          </div>
          <div className={pairClass}>
            <div className={propertyClass}>PI:&nbsp;</div>
            <div
              className={`${valueClass} ${editing && editingClass} ${errors.pi_name ? "bg-red-100" : editing ? "bg-gray-100" : ""}`}
              contentEditable={editing} suppressContentEditableWarning={editing}
              ref={piEl}
            >{sample.piName || "N/A"}</div>
          </div>
          <div className={pairClass}>
            <div className={propertyClass}>Source:&nbsp;</div>
            <div
              className={`${valueClass} ${editing && editingClass} ${errors.source ? "bg-red-100" : editing ? "bg-gray-100" : ""}`}
              contentEditable={editing} suppressContentEditableWarning={editing}
              ref={sourceEl}
            >{sample.source || "N/A"}</div>
          </div>
        </div>
      </div>

      <div className={`hidden lg:block w-max ml-3 ${editing && "opacity-0"}`}>
        {sample.qcPass !== null && (
          <div
            className={`${sample.qcPass ? "bg-green-500" : "bg-red-700"} shadow bg-opacity-80 w-max flex text-base text-white ml-auto rounded-sm px-2 py-0.5 mb-4`}
          >
            QC <img src={sample.qcPass ? tick : cross} alt="" className="ml-2 w-4" />
          </div>
        )}
        {sample.qcMessage && (
          <div className="text-right whitespace-nowrap font-light grid gap-1 text-gray-400 text-sm">{sample.qcMessage.replace(/\.$/, "").split("; ").map((s, i) => (
            <div key={i}>{s}</div>
          ))}</div>
        )}
      </div>
    </Element>
  )
};

SampleInfo.propTypes = {
  sample: PropTypes.object.isRequired
};

export default SampleInfo;