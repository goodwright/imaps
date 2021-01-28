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

const CollectionPage = () => {
  
  const collectionId = useRouteMatch("/collections/:id").params.id;
  
  const { loading, data, error } = useQuery(COLLECTION, {
    variables: {id: collectionId}
  });

  useEffect(() => {
    document.title = `iMaps${data && data.group ? " - " + data.collection.name : ""}`;
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
  const samples = collection.samples.edges.map(edge => edge.node);

  return (
    <Base className="collection-page">
      <div className="collection-info">
        <div className="collection-text">
          <h1>{collection.name}</h1>
          <p className="description">{collection.description}</p>
        </div>
        <div className="collection-meta">
          <div className="dates">
            <div className="created">
              Created {moment(collection.creationTime * 1000).format("D MMMM, YYYY")}
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
      <SamplesTable samples={samples} />
      <div className="owner">
        Contributed by <Link to={`/users/${collection.owner.username}/`}>{collection.owner.name}</Link>
      </div>
    </Base>
  );
};

CollectionPage.propTypes = {

};

export default CollectionPage;