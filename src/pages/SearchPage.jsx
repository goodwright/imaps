import React, { useEffect, useState } from "react";
import Base from "./Base";
import Select from "react-select";
import { useLazyQuery } from "@apollo/client";
import Paginator from "../components/Paginator";
import { SEARCH_COLLECTIONS, SEARCH_SAMPLES, SEARCH_EXECUTIONS } from "../queries";

const SearchPage = () => {


  const [query, setQuery] = useState("");
  const [selectedSearchType, setSelectedSearchType] = useState("collection");
  const [selectedSortType, setSelectedSortType] = useState("name");
  const [collectionOwner, setCollectionOwner] = useState("");
  const [collectionDate, setCollectionDate] = useState(null);
  const [sampleOrganism, setSampleOrganism] = useState("");
  const [sampleOwner, setSampleOwner] = useState("");
  const [sampleDate, setSampleDate] = useState(null);
  const [executionCommand, setExecutionCommand] = useState("");
  const [executionOwner, setExecutionOwner] = useState();
  const [executionDate, setExecutionDate] = useState();
  const [page, setPage] = useState(1);
  const PER_PAGE = 2;

  const searchTypes = [
    {value: "collection", label: "Collection"},
    {value: "sample", label: "Sample"},
    {value: "execution", label: "Execution"}
  ]

  const sortTypes = [
    {value: "name", label: "Name (A-Z)"},
    {value: "-name", label: "Name (Z-A)"},
    {value: "created", label: "Creation Time (Earliest First)"},
    {value: "-created", label: "Creation Time (Latest First)"},
    {value: "created", label: "Last Created (Earliest First)"},
    {value: "-created", label: "Last Created (Latest First)"},
  ]

  const dateTypes = [
    {value: "day", label: "Past 24 Hours"},
    {value: "week", label: "Past Week"},
    {value: "month", label: "Past 30 Days"},
    {value: "6month", label: "Past 6 Months"},
    {value: "year", label: "Past 2 Years"},
  ]

  const formSubmit = e => {
    e.preventDefault();
    setPage(1);
    if (selectedSearchType === "collection") {
      searchCollections({variables: {query, sort: selectedSortType, owner: collectionOwner, created: collectionDate}})
    } else if (selectedSearchType === "sample") {
      searchSamples({variables: {query, sort: selectedSortType, organism: sampleOrganism, owner: sampleOwner, created: sampleDate}})
    } else if (selectedSearchType === "execution") {
      searchExecutions({variables: {query, sort: selectedSortType, command: executionCommand, owner: executionOwner, created: executionDate}})
    }
  }

  useEffect(() => {
    if (selectedSearchType === "collection" && query) {
      searchCollections({variables: {query, sort: selectedSortType, owner: collectionOwner, created: collectionDate}})
    } else if (selectedSearchType === "sample" && query) {
      searchSamples({variables: {query, sort: selectedSortType, organism: sampleOrganism, owner: sampleOwner, created: sampleDate}})
    } else if (selectedSearchType === "execution" && query) {
      searchExecutions({variables: {query, sort: selectedSortType, command: executionCommand, owner: executionOwner, created: executionDate}})
    }
  }, [page])

  const [searchCollections, { loading: collectionsLoading, data: collectionsData }] = useLazyQuery(SEARCH_COLLECTIONS);
  const [searchSamples, { loading: samplesLoading, data: samplesData }] = useLazyQuery(SEARCH_SAMPLES);
  const [searchExecutions, { loading: executionsLoading, data: executionsData }] = useLazyQuery(SEARCH_EXECUTIONS);

  return (
    <Base className="search-page">
      <form onSubmit={formSubmit}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          required
        />
        <Select
          options={searchTypes}
          value={selectedSearchType && searchTypes.filter(t => t.value === selectedSearchType)}
          onChange={e => setSelectedSearchType(e.value)}
        />
        <button type="submit">Search</button>
        <div>Filter Results</div>
        {selectedSearchType === "collection" && (
          <div>
            <label>Filter by owner</label>
            <input
              value={collectionOwner}
              onChange={e => setCollectionOwner(e.target.value)}
            />
            <label>Filter by date created</label>
            <Select
              options={dateTypes}
              value={collectionDate && dateTypes.filter(t => t.value === collectionDate)}
              onChange={e => setCollectionDate(e.value)}
            />
          </div>
        )}
        {selectedSearchType === "sample" && (
          <div>
            <label>Filter by organism</label>
            <input
              value={sampleOrganism}
              onChange={e => setSampleOrganism(e.target.value)}
            />
            <input />
            <label>Filter by collection owner</label>
            <input
              value={sampleOwner}
              onChange={e => setSampleOwner(e.target.value)}
            />
            <label>Filter by date created</label>
            <Select
              options={dateTypes}
              value={sampleDate && dateTypes.filter(t => t.value === sampleDate)}
              onChange={e => setSampleDate(e.value)}
            />
          </div>
        )}
        {selectedSearchType === "execution" && (
          <div>
            <label>Filter by command</label>
            <input
              value={executionCommand}
              onChange={e => setExecutionCommand(e.target.value)}
            />
            <input />
            <label>Filter by owner</label>
            <input
              value={executionOwner}
              onChange={e => setExecutionOwner(e.target.value)}
            />
            <label>Filter by date created</label>
            <Select
              options={dateTypes}
              value={executionDate && dateTypes.filter(t => t.value === executionDate)}
              onChange={e => setExecutionDate(e.value)}
            />
          </div>
        )}

        <div>Sort by</div>
        <Select
          options={sortTypes}
          value={selectedSortType && sortTypes.filter(t => t.value === selectedSortType)}
          onChange={e => setSelectedSortType(e.value)}
        />
      </form>

      <div className="results">
        {(collectionsLoading || samplesLoading || executionsLoading) && <div>Loading</div>}
        {collectionsData && selectedSearchType === "collection" && (
          <div>
            {collectionsData.searchCollections.length > PER_PAGE ? <Paginator
              count={collectionsData.searchCollections.length} itemsPerPage={PER_PAGE}
              currentPage={page} onClick={setPage}
            /> : <div className="paginator" /> }
            {collectionsData.searchCollections.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(c => <div key={c.id}>{c.name}</div>)}
          </div>
        )}
        {samplesData && selectedSearchType === "sample" && (
          <div>
            {samplesData.searchSamples.length > PER_PAGE ? <Paginator
              count={samplesData.searchSamples.length} itemsPerPage={PER_PAGE}
              currentPage={page} onClick={setPage}
            /> : <div className="paginator" /> }
            {samplesData.searchSamples.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(s => <div key={s.id}>{s.name}</div>)}
          </div>
        )}
        {executionsData && selectedSearchType === "execution" && (
          <div>
            {executionsData.searchExecutions.length > PER_PAGE ? <Paginator
              count={executionsData.searchExecutions.length} itemsPerPage={PER_PAGE}
              currentPage={page} onClick={setPage}
            /> : <div className="paginator" /> }
            {executionsData.searchExecutions.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(e => <div key={e.id}>{e.name}</div>)}
          </div>
        )}
      </div>

    </Base>
  );
};

SearchPage.propTypes = {
  
};

export default SearchPage;