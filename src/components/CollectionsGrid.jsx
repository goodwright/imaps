import React, { useState } from "react";
import PropTypes from "prop-types";
import CollectionCard from "../components/CollectionCard";
import Paginator from "./Paginator";

const CollectionsGrid = props => {

  const { collections, noMessage, pageLength, network } = props;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  if (!collections.length) {
    return <div className="font-light text-base">{noMessage}</div>
  }

  const networkPageCount = network ? Math.ceil(network[1] / pageLength) : null;

  const fitsOnOnePage = network ? networkPageCount === 1 : Math.ceil(collections.length / pageLength) === 1;

  const matching = query ? collections.filter(
    c => c.name.toLowerCase().includes(query.toLowerCase())
  ) : collections;

  const pageCount = network ? networkPageCount : Math.ceil(matching.length / pageLength);
  const actualPage = network ? network[0] : page > pageCount ? pageCount : page;
  const visible = network ? collections : matching.slice((actualPage - 1) * pageLength, actualPage * pageLength);

  return (
    <div className={props.className || ""}>
      {!fitsOnOnePage && <div className="grid gap-3 mb-2 ml-2 sm:flex mb-4">
        {!network && <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Filter"
          className="border-b text-sm w-40 mr-3 h-8"
        />}
        <Paginator
          currentPage={actualPage}
          totalPages={pageCount}
          onChange={network ? network[2] : setPage}
        />
      </div>}
      <div className="grid gap-4 w-full md:grid-fill-120">
        {visible.map(collection => (
          <CollectionCard collection={collection} key={collection.id} className="w-full" />
        ))}
      </div>
    </div>
  );
};

CollectionsGrid.propTypes = {
  collections: PropTypes.array.isRequired,
  noMessage: PropTypes.string,
  pageLength: PropTypes.number.isRequired,
};

export default CollectionsGrid;