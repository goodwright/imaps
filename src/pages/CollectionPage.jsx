import React, { useContext, useRef, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import moment from "moment";
import Toggle from "react-toggle";
import { ClipLoader } from "react-spinners";
import { UserContext } from "../contexts";
import { COLLECTION, PUBLIC_COLLECTIONS, USER_COLLECTIONS } from "../queries";
import { UPDATE_COLLECTION } from "../mutations";
import Base from "./Base";
import PageNotFound from "./PageNotFound";
import paperIcon from "../images/paper.svg";
import SamplesTable from "../components/SamplesTable";
import ExecutionHistory from "../components/ExecutionHistory";
import CollectionDeletion from "../components/CollectionDeletion";
import CollectionAccess from "../components/CollectionAccess";
import { createErrorObject, detect404 } from "../forms";

const CollectionPage = props => {
  
  const collectionId = useRouteMatch("/collections/:id").params.id;
  const [user,] = useContext(UserContext);
  const { edit } = props;
  const nameEl = useRef(null);
  const descriptionEl = useRef(null);
  const [specifiedPrivacy, setSpecifiedPrivacy] = useState(null);
  const [newPapers, setNewPapers] = useState(null);
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const { loading, data, error } = useQuery(COLLECTION, {variables: {id: collectionId}});

  useDocumentTitle(data ? `iMaps - ${data.collection.name}` : "iMaps");

  const [updateCollection, updateCollectionMutation] = useMutation(UPDATE_COLLECTION, {
    refetchQueries: [
      {query: COLLECTION, variables: {id: collectionId}},
      {query: PUBLIC_COLLECTIONS, variables: {first: 24, last: 24}},
      {query: USER_COLLECTIONS}
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

  if (detect404(error)) return <PageNotFound />

  if (loading) return <Base className="collection-page" loading={true} />

  const collection = data.collection;
  const canBreak = !collection.name.includes(" ");

  if (user && edit && !collection.canEdit) return <PageNotFound />

  const isPrivate = specifiedPrivacy === null ? collection.private : specifiedPrivacy;
  const papers = newPapers || collection.papers.map(paper => ({
    title: paper.title, url: paper.url, year: paper.year
  })).concat([{title: "", year: "", url: ""}]);

  const updatePapers = (index, property, value) => {
    const updatedPapers = [...papers];
    updatedPapers[index][property] = value;
    setNewPapers(updatedPapers);
  }

  const addPaper = () => {
    const updatedPapers = [...papers].concat([{title: "", year: "", url: ""}]);
    setNewPapers(updatedPapers);
  }

  const removePaper = index => {
    const updatedPapers = papers.filter((paper,p) => p !== index);
    setNewPapers(updatedPapers);
  }
  const save = e => {
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

  const InfoElement = edit ? "form" : "div"

  return (
    <Base className="collection-page">
      <InfoElement className="collection-info" onSubmit={save}>
        <div className="collection-text">

          {edit && errors.name && <div className="error">{errors.name}</div> }

          <h1
            contentEditable={edit} suppressContentEditableWarning={edit}
            className={edit ? "editable" : canBreak ? "can-break" : ""} ref={nameEl}
          >{collection.name}</h1>

          {user && collection.canEdit && !edit && (
            <Link to={`/collections/${collection.id}/edit/`} className="edit-button button tertiary-button">edit collection</Link>
          )}
          {edit && (
            <button type="submit" className="edit-button button tertiary-button">
              {updateCollectionMutation.loading ? <ClipLoader color="white" size="20px" /> : "save changes"}
            </button>
          )}
          {edit && errors.description && <div className="error">{errors.description}</div> }
          <p
            contentEditable={edit} suppressContentEditableWarning={edit}
            className={edit ? "description editable" : "description"} ref={descriptionEl}
          >
            {collection.description}
          </p>

          {edit && <div className="binary-toggle">
            <label className={isPrivate ? "" : "selected"}>Public</label>
            <Toggle
              checked={isPrivate}
              onChange={() => setSpecifiedPrivacy(!isPrivate)}
              icons={false}
              />
            <label className={isPrivate ? "selected" : ""}>Private</label>
          </div>}
        </div>


        <div className="collection-meta">
          {!edit && <div className="dates">
            <div className="created">
              Created {moment(collection.created * 1000).format("D MMMM, YYYY")}
            </div>
            <div className="modified">
              Modified {moment(collection.lastModified * 1000).format("D MMMM, YYYY")}
            </div>
          </div>}
          {(collection.papers.length > 0 || edit) && <h2 className={edit ? "right" : ""}>Associated Papers</h2>}
          {collection.papers.length > 0 && !edit && <div className="papers">
            <div className="papers-grid">
              {collection.papers.map(paper => (
                <a href={paper.url} className="paper" key={paper.id}>
                  <img src={paperIcon} alt="paper"/>
                  <div className="title">({paper.year}) {paper.title}</div>
                </a>
              ))}
            </div>
          </div>}
          {edit && (
            <div className="paper-forms">
              {edit && (errors.title || errors.year || errors.url) && (
                <div className="error">There was a problem with one of the papers.</div>
              )}
              {papers.map((paper, p) => (
                <div className="paper-form" key={p}>
                  <div className="inputs">
                    <input
                      value={paper.title}
                      placeholder="Title"
                      onChange={e => updatePapers(p, "title", e.target.value)}
                      maxLength={250}
                    />
                    <input
                      value={paper.url}
                      type="url"
                      placeholder="URL"
                      onChange={e => updatePapers(p, "url", e.target.value)}
                    />
                    <input
                      value={paper.year}
                      placeholder="Year"
                      type="number"
                      onChange={e => updatePapers(p, "year", e.target.value)}
                    />
                  </div>
                  <button type="button" onClick={() => removePaper(p)} />
                </div>
              ))}
              <button type="button" className="new" onClick={addPaper}>+</button>
            </div>
          )}
        </div>
      </InfoElement>
        
      {!edit && <div className="children">
        <div className="samples">
          <h2>Samples</h2>
          <p className="info">
            These are the individual samples for this collection - each one is the
            result of a single experiment, and together they comprise the data for
            this collection.
          </p>
          <SamplesTable samples={collection.samples} />
        </div>
        <div className="executions">
          <h2>Analysis History</h2>
          <p className="info">
            A list of the analysis commands run on data in this collection from
            more than one sample. The samples may have their own analysis history.
          </p>
          <ExecutionHistory executions={collection.executions} searchable={true} />
        </div>
      </div>}
      {!edit && collection.owners.length > 0 && <div className="owner">
        Contributed by <div className="names">{collection.owners.map(user => <Link key={user.id} to={`/users/${user.username}/`}>{user.name}</Link>)}</div> 
      </div>}

      {edit && collection.canShare && <div className="bottom-buttons">
        <CollectionAccess collection={collection} allUsers={data.users} allGroups={data.groups}/>
        {edit && collection.isOwner && <CollectionDeletion collection={collection} />}
      </div>}
    </Base>
  );
};

CollectionPage.propTypes = {

};

export default CollectionPage;