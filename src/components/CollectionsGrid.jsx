import React from "react";
import PropTypes from "prop-types";
import CollectionCard from "../components/CollectionCard";

const CollectionsGrid = props => {

  const { collections } = props;

  if (!collections.length) {
    return (
      <div className="no-data">
        Currently no collections.
      </div>
    )  
}


  return (
    <div className="collections-grid">
      {collections.map(collection => (
        <CollectionCard collection={collection} key={collection.id}/>
      ))}
    </div>
  );
};

CollectionsGrid.propTypes = {
  collections: PropTypes.array.isRequired
};

export default CollectionsGrid;