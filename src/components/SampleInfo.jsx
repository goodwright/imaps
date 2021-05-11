import React, { useContext, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import moment from "moment";
import ClipLoader from "react-spinners/ClipLoader";
import Select from "react-select";
import ReactTooltip from "react-tooltip";
import tick from "../images/tick.svg";
import cross from "../images/cross.svg";
import { UserContext } from "../contexts";
import { COLLECTION, SAMPLE, PUBLIC_COLLECTIONS, USER_COLLECTIONS } from "../queries";
import { UPDATE_SAMPLE } from "../mutations";
import { createErrorObject } from "../forms";

const SampleInfo = props => {

  const { sample, edit, collections } = props;
  const [user,] = useContext(UserContext);
  const canBreak = !sample.name.includes(" ");
  const InfoElement = edit ? "form" : "div";
  const nameEl = useRef(null);
  const [collection, setCollection] = useState(null);
  const [annotatorName, setAnnotatorName] = useState(null);
  const [piName, setPi] = useState(null);
  const [organism, setOrganism] = useState(null);
  const [source, setSource] = useState(null);
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const collectionOptions = collections.map(c => ({value: c.id, label: c.name}));
  const selectedCollection = collectionOptions.filter(c => c.value === (
    collection === null ? sample.collection.id : collection
  ))[0]

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
        collection: collection || sample.collection.id,
        annotatorName: annotatorName || sample.annotatorName,
        piName: piName || sample.piName,
        organism: organism || sample.organism,
        source: source || sample.source,
      }
    })
  }

  return (
    <InfoElement className="sample-info" onSubmit={save}>
      <div className="left-column">
        {edit && errors.name && <div className="error">{errors.name}</div>}
        <h1
          contentEditable={edit} suppressContentEditableWarning={edit}
          className={edit ? "editable" : canBreak ? "can-break" : ""} ref={nameEl}
        >{sample.name}</h1>
        {sample.collection && !edit && <div className="collection">Collection: <Link to={`/collections/${sample.collection.id}/`}>{sample.collection.name}</Link></div>}
        {errors.collection && <div className="error">{errors.collection}</div>}
        {sample.collection && edit && <div className="collection">
          <label>Collection:</label>
          <Select
            options={collectionOptions}
            value={selectedCollection}
            onChange={({value}) => setCollection(value)}
            className="react-select"
            classNamePrefix="react-select"
          />
        </div>}

        {user && sample.canEdit && !edit && (
          <Link to={`/samples/${sample.id}/edit/`} className="edit-button button tertiary-button">edit sample</Link>
        )}
        {edit && (
          <button type="submit" className="edit-button button tertiary-button">
            {updateSampleMutation.loading ? <ClipLoader color="#9590B5" size="20px" /> : "save changes"}
          </button>
        )}
        {edit ? (
          <div className="inputs">
            <div className="input">
              <label htmlFor="annotatorName">Annotator:</label>
              <div className="error-container">
                {edit && errors.annotator_name && <div className="error">{errors.annotator_name}</div>}
                <input
                  id="annotatorName"
                  value={annotatorName === null ? sample.annotatorName : annotatorName}
                  onChange={e => setAnnotatorName(e.target.value)}
                />
              </div>
            </div>
            <div className="input">
              <label htmlFor="piName">PI:</label>
              <div className="error-container">
                {edit && errors.pi_name && <div className="error">{errors.pi_name}</div>}
                <input
                  id="piName"
                  value={piName === null ? sample.piName : piName}
                  onChange={e => setPi(e.target.value)}
                />
              </div>
            </div>
            <div className="input">
              <label htmlFor="organism">Organism:</label>
              <div className="error-container">
                {edit && errors.organism && <div className="error">{errors.organism}</div>}
                <input
                  id="organism"
                  value={organism === null ? sample.organism : organism}
                  onChange={e => setOrganism(e.target.value)}
                />
              </div>
            </div>
            <div className="input">
              <label htmlFor="source">Source:</label>
              <div className="error-container">
                {edit && errors.source && <div className="error">{errors.annotator_name}</div>}
                <input
                  id="source"
                  value={source === null ? sample.source : source}
                  onChange={e => setSource(e.target.value)}
                />
              </div>
            </div>

          </div>
        ) : (
          <table>
            <tbody>
              <tr>
                <th>Annotator:</th>
                <td>{sample.annotatorName || "N/A"}</td>
                <th>Organism:</th>
                <td>{sample.organism || "N/A"}</td>
              </tr>
              <tr>
                <th>PI:</th>
                <td>{sample.piName || "N/A"}</td>
                <th>Source:</th>
                <td>{sample.source || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      {!edit && <div className="right-column">
        {sample.qcPass !== null && sample.qcPass === true && (
          <div className="quality-status pass">
            QC <img src={tick} alt="pass" />
          </div>
        )}
        {sample.qcPass !== null && sample.qcPass === false && (
          <div className="quality-status fail">
            QC <img src={cross} alt="fail" />
          </div>
        )}

        {sample.qcMessage && (
          <div className="qc-message">{sample.qcMessage.replace(/\.$/, "").split("; ").map((s, i) => (
            <div key={i}>{s}</div>
          ))}</div>
        )}

        <div className="dates">
          <div className="created" data-tip data-for="creation">
            Created <time>{moment(sample.created * 1000).format("DD MMM, YYYY")}</time>
          </div>
          <ReactTooltip id="creation">
            <span>{moment(sample.created * 1000).format("DD MMMM YYYY - HH:mm UTC")}</span>
          </ReactTooltip>
          <div className="modified" data-tip data-for="modified">
            Modified <time>{moment(sample.lastModified * 1000).format("DD MMM, YYYY")}</time>
          </div>
          <ReactTooltip id="modified">
            <span>{moment(sample.lastModified * 1000).format("DD MMMM YYYY - HH:mm UTC")}</span>
          </ReactTooltip>
        </div>
      </div>}


    </InfoElement>
  );
};

SampleInfo.propTypes = {
  sample: PropTypes.object.isRequired
};

export default SampleInfo;