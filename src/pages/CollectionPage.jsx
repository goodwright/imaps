import React, { useEffect } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { COLLECTION } from "../queries";
import Base from "./Base";
import PageNotFound from "./PageNotFound";
import paperIcon from "../images/paper.svg";
import SamplesTable from "../components/SamplesTable";
import ExecutionHistory from "../components/ExecutionHistory";

const CollectionPage = () => {
  
  const collectionId = useRouteMatch("/collections/:id").params.id;

  const { loading, data, error } = useQuery(COLLECTION, {variables: {id: collectionId}});

  useEffect(() => {
    document.title = `iMaps${data && data.collection ? " - " + data.collection.name : ""}`;
  });

  if ((error && error.graphQLErrors && error.graphQLErrors.length)) {
    const message = JSON.parse(error.graphQLErrors[0].message);
    if (message && Object.values(message).some(m => m === "Does not exist")) {
      return <PageNotFound />
    }
  }

  if (loading) {
    return <Base className="collection-page" loading={true} />
  }

  const collection = data.collection;
  const canBreak = !collection.name.includes(" ");

  return (
    <Base className="collection-page">
      <div className="collection-info">
        <div className="collection-text">
          <h1 className={canBreak ? "can-break" : ""}>{collection.name}</h1>
          <p className="description">{collection.description}</p>
        </div>
        <div className="collection-meta">
          <div className="dates">
            <div className="created">
              Created {moment(collection.created * 1000).format("D MMMM, YYYY")}
            </div>
            <div className="modified">
              Modified {moment(collection.lastModified * 1000).format("D MMMM, YYYY")}
            </div>
          </div>
          {collection.papers.length > 0 && <div className="papers">
            <h2>Associated Papers</h2>
            <div className="papers-grid">
              {collection.papers.map(paper => (
                <a href={paper.url} className="paper" key={paper.id}>
                  <img src={paperIcon} alt="paper"/>
                  <div className="title">({paper.year}) {paper.title}</div>
                </a>
              ))}
            </div>
          </div>}
        </div>
      </div>
        
      <div className="children">
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
          <ExecutionHistory executions={collection.executions} />
        </div>
      </div>
      {collection.owners.length > 0 && <div className="owner">
        Contributed by <div className="names">{collection.owners.map(user => <Link key={user.id} to={`/users/${user.username}/`}>{user.name}</Link>)}</div> 
      </div>}
    </Base>
  );
};

CollectionPage.propTypes = {

};

export default CollectionPage;