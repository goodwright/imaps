import React from "react";
import PropTypes from "prop-types";
import CollectionCard from "../components/CollectionCard";

const CollectionsGrid = props => {

  const { collections } = props;

  return (
    <div className="collections-grid">
      {collections.reverse().map(collection => (
        <CollectionCard collection={collection} key={collection.id}/>
      ))}
    </div>
  );
};

CollectionsGrid.propTypes = {
  collections: PropTypes.array.isRequired
};

export default CollectionsGrid;