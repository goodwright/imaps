import React, { useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { BarLoader } from "react-spinners";
import { GROUP_COLLECTIONS } from "../queries";
import CollectionsGrid from "../components/CollectionsGrid";
import Paginator from "./Paginator";

const GroupCollections = props => {

  const { group } = props;
  const collectionsPerPage = 12;
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, data } = useQuery(GROUP_COLLECTIONS, {variables: {
    slug: group.slug, first: collectionsPerPage,
    offset: (pageNumber - 1) * collectionsPerPage
  }})

  return (
    <div className="group-collections">
      <h2>Collections Shared with {group.name}</h2>
      { loading ? <BarLoader color="#6D6699" /> : (
        <>
          {data.group.allCollectionsCount > collectionsPerPage && <Paginator
            count={data.group.allCollectionsCount} itemsPerPage={collectionsPerPage}
            currentPage={pageNumber} onClick={setPageNumber}
          />}
          <CollectionsGrid collections={data.group.allCollections.edges.map(edge => edge.node)} />

        </>
      ) }
    </div>
  );
};

GroupCollections.propTypes = {
  
};

export default GroupCollections;