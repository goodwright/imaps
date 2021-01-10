import React from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { ClipLoader } from "react-spinners";
import { GROUP_COLLECTIONS } from "../queries";
import CollectionsGrid from "../components/CollectionsGrid";

const GroupCollections = props => {

  const { group } = props;

  const { loading, data } = useQuery(GROUP_COLLECTIONS, {
    variables: {slug: group.slug}
  })

  return (
    <div>
      <h2>Collections Shared with {group.name}</h2>
      { loading ? <ClipLoader /> : <CollectionsGrid collections={data.group.allCollections} /> }
    </div>
  );
};

GroupCollections.propTypes = {
  
};

export default GroupCollections;