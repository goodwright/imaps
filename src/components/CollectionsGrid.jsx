import React, { useState } from "react";
import PropTypes from "prop-types";
import CollectionCard from "../components/CollectionCard";
import Paginator from "./Paginator";

const CollectionsGrid = props => {

  const { collections, noMessage } = props;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const rowCount = 10;

  if (!collections.length) {
    return <div className="font-light text-base">{noMessage}</div>
  }

  const fitsOnOnePage = Math.ceil(collections.length / rowCount) === 1;

  const matching = query ? collections.filter(
    c => c.name.toLowerCase().includes(query.toLowerCase())
  ) : collections;

  const pageCount = Math.ceil(matching.length / rowCount);
  const actualPage = page > pageCount ? pageCount : page;
  const visible = matching.slice((actualPage - 1) * rowCount, actualPage * rowCount);

  return (
    <div>
      {!fitsOnOnePage && <div className="grid gap-3 mb-2 ml-2 sm:flex mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Filter"
          className="border-b text-sm w-40 mr-3 h-8"
        />
        <Paginator
          currentPage={actualPage}
          totalPages={pageCount}
          onChange={setPage}
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
};

export default CollectionsGrid;