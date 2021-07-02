import React from "react";
import PropTypes from "prop-types";
import CollectionCard from "../components/CollectionCard";

const CollectionsGrid = props => {

  const { collections, noMessage } = props;

  if (!collections.length) {
    return <div className="font-light text-base">{noMessage}</div>
  }

  return (
    <div className="grid gap-4 grid-fill-120 w-full">
      {collections.map(collection => (
        <CollectionCard collection={collection} key={collection.id} className="w-full" />
      ))}
    </div>
  );
};

CollectionsGrid.propTypes = {
  collections: PropTypes.array.isRequired,
  noMessage: PropTypes.string,
};

export default CollectionsGrid;