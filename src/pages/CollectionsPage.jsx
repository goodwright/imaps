import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { PUBLIC_COLLECTIONS } from "../queries";
import Base from "./Base";
import Paginator from "../components/Paginator";
import CollectionsGrid from "../components/CollectionsGrid";

const CollectionsPage = () => {

  const [page, setPage] = useState(1);
  const count = useRef(null);
  const itemsPerPage = 24;

  const { loading, data } = useQuery(PUBLIC_COLLECTIONS, {
    variables: {
      first: page * itemsPerPage,
      last: count.current ? page * itemsPerPage > count.current ? (
        count.current - (itemsPerPage * (page - 1))
       ) : itemsPerPage : itemsPerPage
    },
    onCompleted: data => count.current = data.publicCollections.count
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
      {data.publicCollections.count > itemsPerPage && (
        <Paginator
          count={data.publicCollections.count} itemsPerPage={itemsPerPage}
          currentPage={parseInt(page)} onClick={setPage}
        />
      )}
      <CollectionsGrid collections={collections} />
    </Base>
  );
};

CollectionsPage.propTypes = {
};

export default CollectionsPage;