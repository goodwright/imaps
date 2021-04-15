import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useHistory, useLocation } from "react-router";
import Base from "./Base";
import Select from "react-select";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_COLLECTIONS, SEARCH_SAMPLES, SEARCH_EXECUTIONS } from "../queries";

const SearchPage = props => {

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [query, setQuery] = useState(params.get("q") || "");
  const [selectedSearchType, setSelectedSearchType] = useState(params.get("kind") || "collection");
  const [selectedSortType, setSelectedSortType] = useState(params.get("sort") || "name");
  const [collectionOwner, setCollectionOwner] = useState(params.get("kind") === "collection" ? (params.get("owner") || "") : "");
  const [collectionDate, setCollectionDate] = useState(params.get("kind") === "collection" ? (params.get("created") || null) : null);
  const [sampleOrganism, setSampleOrganism] = useState(params.get("kind") === "sample" ? (params.get("organism") || "") : "");
  const [sampleOwner, setSampleOwner] = useState(params.get("kind") === "sample" ? (params.get("name") || "") : "");
  const [sampleDate, setSampleDate] = useState(params.get("kind") === "sample" ? (params.get("created") || null) : null);
  const [executionCommand, setExecutionCommand] = useState(params.get("kind") === "execution" ? (params.get("command") || "") : "");
  const [executionOwner, setExecutionOwner] = useState(params.get("kind") === "execution" ? (params.get("name") || "") : "");
  const [executionDate, setExecutionDate] = useState(params.get("kind") === "execution" ? (params.get("created") || null) : null);
  const history = useHistory();

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
    let urlString = `q=${encodeURI(query)}&kind=${selectedSearchType}&sort=${selectedSortType}`
    if (selectedSearchType === "collection") {
      if (collectionOwner) urlString += `&owner=${encodeURI(collectionOwner)}`;
      if (collectionDate) urlString += `&date=${collectionDate}`;
      searchCollections({variables: {query, sort: selectedSortType, owner: collectionOwner, created: collectionDate}})
    } else if (selectedSearchType === "sample") {
      if (sampleOrganism) urlString += `&organism=${encodeURI(sampleOrganism)}`;
      if (sampleOwner) urlString += `&owner=${encodeURI(sampleOwner)}`;
      if (sampleDate) urlString += `&created=${sampleDate}`;
      searchSamples({variables: {query, sort: selectedSortType, organism: sampleOrganism, owner: sampleOwner, created: sampleDate}})
    } else if (selectedSearchType === "execution") {
      if (executionCommand) urlString += `&command=${encodeURI(executionCommand)}`;
      if (executionOwner) urlString += `&owner=${encodeURI(executionOwner)}`;
      if (executionDate) urlString += `&created=${executionDate}`;
      searchExecutions({variables: {query, sort: selectedSortType, command: executionCommand, owner: executionOwner, created: executionDate}})
    }
    history.push(`/search?${urlString}`);
  }

  const [searchCollections, { loading: collectionsLoading, data: collectionsData }] = useLazyQuery(SEARCH_COLLECTIONS);
  const [searchSamples, { loading: samplesLoading, data: samplesData }] = useLazyQuery(SEARCH_SAMPLES);
  const [searchExecutions, { loading: executionsLoading, data: executionsData }] = useLazyQuery(SEARCH_EXECUTIONS);

  useEffect(() => {
    if (query && selectedSearchType === "collection") {
      searchCollections({variables: {query, sort: selectedSortType, owner: collectionOwner, created: collectionDate}})
    }
    if (query && selectedSearchType === "sample") {
      searchSamples({variables: {query, sort: selectedSortType, organism: sampleOrganism, owner: sampleOwner, created: sampleDate}})
    }
    if (query && selectedSearchType === "execution") {
      searchExecutions({variables: {query, sort: selectedSortType, command: executionCommand, owner: executionDate, created: executionDate}})
    }
  }, [])


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
        {collectionsData && (
          <div>
            {collectionsData.searchCollections.edges.map(edge => edge.node).map(c => <div key={c.id}>{c.name}</div>)}
          </div>
        )}
        {samplesData && (
          <div>
            {samplesData.searchSamples.edges.map(edge => edge.node).map(s => <div key={s.id}>{s.name}</div>)}
          </div>
        )}
        {executionsData && (
          <div>
            {executionsData.searchExecutions.edges.map(edge => edge.node).map(e => <div key={e.id}>{e.name}</div>)}
          </div>
        )}
      </div>

    </Base>
  );
};

SearchPage.propTypes = {
  
};

export default SearchPage;