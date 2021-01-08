import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory, useRouteMatch } from "react-router";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { COLLECTION } from "../queries";
import Base from "./Base";
import PageNotFound from "./PageNotFound";

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
          <div className="papers">
            <h2>Associated Papers</h2>
          </div>
        </div>
      </div>
    </Base>
  );
};

CollectionPage.propTypes = {

};

export default CollectionPage;