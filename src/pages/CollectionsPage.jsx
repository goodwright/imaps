import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { COLLECTIONS } from "../queries";
import Base from "./Base";
import CollectionCard from "../components/CollectionCard";
import { useLocation } from "react-router";

import Paginator from "../components/Paginator";

const CollectionsPage = () => {

  const page = new URLSearchParams(useLocation().search).get("page") || 1;
  const itemsPerPage = 24;

  const { loading, data } = useQuery(COLLECTIONS, {
    variables: {first: itemsPerPage, offset: (parseInt(page) - 1) * itemsPerPage}
  });

  useEffect(() => {
    document.title = `iMaps - Public Collections`;
  });

  if (loading) {
    return <Base className="collections-page" loading={true} />
  }

  const collections = data.collections.edges.map(edge => edge.node);

  

  return (
    <Base className="collections-page">
      <h1>Collections</h1>
      {data.collectionCount > itemsPerPage && (
        <Paginator
          count={data.collectionCount} itemsPerPage={itemsPerPage}
          currentPage={parseInt(page)} pathBase="/collections"
        />
      )}
      <div className="collections-grid">
        {collections.reverse().map(collection => (
          <CollectionCard collection={collection} key={collection.id}/>
        ))}
      </div>
      {data.collectionCount > itemsPerPage && (
        <Paginator
          count={data.collectionCount} itemsPerPage={itemsPerPage}
          currentPage={parseInt(page)} pathBase="/collections"
        />
      )}
    </Base>
  );
};

CollectionsPage.propTypes = {
};

export default CollectionsPage;