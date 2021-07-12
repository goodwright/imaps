import React from "react";
import { useQuery } from "@apollo/client";
import { useDocumentTitle } from "../hooks";
import { PUBLIC_COLLECTIONS } from "../queries";
import Base from "./Base";
import CollectionsGrid from "../components/CollectionsGrid";

const CollectionsPage = () => {

  const { loading, data } = useQuery(PUBLIC_COLLECTIONS);

  useDocumentTitle("iMaps - Public Collections");

  if (loading) return <Base loading={true} />

  const collections = data.publicCollections.edges.map(edge => edge.node);

  return (
    <Base>
      <h1>Public Collections</h1>
      <div className="font-light mb-6 md:mb-10 text-primary-100">
        These are the iMaps Collections which have been set to be publicly available by their owners.
      </div>

      <CollectionsGrid
        collections={collections} pageLength={24}
        noMessage="There are currently no public collections."
      />
    </Base>
  );
};

CollectionsPage.propTypes = {
  
};

export default CollectionsPage;