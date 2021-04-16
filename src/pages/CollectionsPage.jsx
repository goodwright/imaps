import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { PUBLIC_COLLECTIONS } from "../queries";
import Base from "./Base";
import { useLocation } from "react-router";
import Paginator from "../components/Paginator";
import CollectionsGrid from "../components/CollectionsGrid";

const CollectionsPage = () => {

  const page = new URLSearchParams(useLocation().search).get("page") || 1;
  const itemsPerPage = 24;

  const { loading, data } = useQuery(PUBLIC_COLLECTIONS, {
    variables: {first: itemsPerPage, offset: (parseInt(page) - 1) * itemsPerPage}
  });

  useEffect(() => {
    document.title = `iMaps - Public Collections`;
  });

  if (loading) {
    return <Base className="collections-page" loading={true} />
  }

  const collections = data.publicCollections.edges.map(edge => edge.node);

  return (
    <Base className="collections-page">
      <h1>Public Collections</h1>
      <div className="info">
        These are the iMaps Collections which have been set to be publicly available by their owners.
      </div>
      {data.collectionCount > itemsPerPage && (
        <Paginator
          count={data.collectionCount} itemsPerPage={itemsPerPage}
          currentPage={parseInt(page)} pathBase="/collections"
        />
      )}
      <CollectionsGrid collections={collections} />
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