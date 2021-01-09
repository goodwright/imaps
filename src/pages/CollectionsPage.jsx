import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { COLLECTIONS } from "../queries";
import Base from "./Base";
import CollectionCard from "../components/CollectionCard";

const CollectionsPage = () => {

  const { loading, data } = useQuery(COLLECTIONS);

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
      <div className="collections-grid">
        {collections.reverse().map(collection => (
          <CollectionCard collection={collection} key={collection.id}/>
        ))}
      </div>
    </Base>
  );
};

CollectionsPage.propTypes = {
};

export default CollectionsPage;