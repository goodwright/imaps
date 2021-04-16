import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useLazyQuery } from "@apollo/client";
import Select from "react-select";
import moment from "moment";
import Base from "./Base";
import searchIcon from "../images/searchIcon.svg";
import Paginator from "../components/Paginator";
import { SEARCH_COLLECTIONS, SEARCH_SAMPLES, SEARCH_EXECUTIONS } from "../queries";
import { BarLoader } from "react-spinners";

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
  const [executionOwner, setExecutionOwner] = useState("");
  const [executionDate, setExecutionDate] = useState(null);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

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
    {value: "modified", label: "Last Modified (Earliest First)"},
    {value: "-modified", label: "Last Modified (Latest First)"},
  ]

  const dateTypes = [
    {value: null, label: "---"},
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
        <div className="top-row">
          <div className="input-icon">
            <img src={searchIcon} alt="" className="icon" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              required
            />
          </div>
          <Select
            options={searchTypes}
            value={selectedSearchType && searchTypes.filter(t => t.value === selectedSearchType)}
            onChange={e => setSelectedSearchType(e.value)}
            className="react-select"
            classNamePrefix="react-select"
          />
        </div>
        
        <h2>Filter Results</h2>
        {selectedSearchType === "collection" && (
          <div className="options-row">
            <input
              value={collectionOwner}
              onChange={e => setCollectionOwner(e.target.value)}
              placeholder="Owner"
            />
            <Select
              options={dateTypes}
              value={collectionDate && dateTypes.filter(t => t.value === collectionDate)}
              onChange={e => setCollectionDate(e.value)}
              placeholder="Date created"
              className="react-select"
              classNamePrefix="react-select"
            />
          </div>
        )}
        {selectedSearchType === "sample" && (
          <div className="options-row">
            <input
              value={sampleOrganism}
              onChange={e => setSampleOrganism(e.target.value)}
              placeholder="Organism"
            />
            <input
              value={sampleOwner}
              onChange={e => setSampleOwner(e.target.value)}
              placeholder="Owner"
            />
            <Select
              options={dateTypes}
              value={sampleDate && dateTypes.filter(t => t.value === sampleDate)}
              onChange={e => setSampleDate(e.value)}
              placeholder="Date created"
              className="react-select"
              classNamePrefix="react-select"
            />
          </div>
        )}
        {selectedSearchType === "execution" && (
          <div className="options-row">
            <input
              value={executionCommand}
              onChange={e => setExecutionCommand(e.target.value)}
              placeholder="Command"
            />
            <input
              value={executionOwner}
              onChange={e => setExecutionOwner(e.target.value)}
              placeholder="Owner"
            />
            <Select
              options={dateTypes}
              value={executionDate && dateTypes.filter(t => t.value === executionDate)}
              onChange={e => setExecutionDate(e.value)}
              placeholder="Date created"
              className="react-select"
              classNamePrefix="react-select"
            />
          </div>
        )}

        <h2>Sort by</h2>

        <div className="bottom-row">
          <Select
            options={sortTypes}
            value={selectedSortType && sortTypes.filter(t => t.value === selectedSortType)}
            onChange={e => setSelectedSortType(e.value)}
            className="react-select"
            classNamePrefix="react-select"
          />
          <button type="submit" className="primary-button">Search</button>
        </div>


        
      </form>

      <div className="results">
        {(collectionsLoading || samplesLoading || executionsLoading) && (
          <div className="loader">
            <BarLoader color="#6353C6" />
          </div>
        )}

        {((collectionsData && collectionsData.searchCollections.length === 0) || (samplesData && samplesData.searchSamples.length === 0) || (executionsData && executionsData.searchExecutions.length === 0)) && (
          <div className="no-data">
            No results for this query.
          </div>
        )}

        {collectionsData && collectionsData.searchCollections.length > 0 && selectedSearchType === "collection" && (
          <div className="results">
            {collectionsData.searchCollections.length > PER_PAGE ? <Paginator
              count={collectionsData.searchCollections.length} itemsPerPage={PER_PAGE}
              currentPage={page} onClick={setPage}
            /> : <div className="paginator" /> }
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Owners</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {collectionsData.searchCollections.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(c => (
                  <tr key={c.id} onClick={() => history.push(`/collections/${c.id}/`)}>
                    <td>{c.name}</td>
                    <td>{c.owners.map(u => u.name).join(", ")}</td>
                    <td>{moment(c.created * 1000).format("D MMM YYYY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {samplesData && samplesData.searchIcon.length > 0 && selectedSearchType === "sample" && (
          <div className="results">
            {samplesData.searchSamples.length > PER_PAGE ? <Paginator
              count={samplesData.searchSamples.length} itemsPerPage={PER_PAGE}
              currentPage={page} onClick={setPage}
            /> : <div className="paginator" /> }
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Organism</th>
                  <th>Owners</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {samplesData.searchSamples.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(s => (
                  <tr key={s.id} onClick={() => history.push(`/samples/${s.id}/`)}>
                    <td>{s.name}</td>
                    <td>{s.organism}</td>
                    <td>{s.collection.owners.map(u => u.name).join(", ")}</td>
                    <td>{moment(s.created * 1000).format("D MMM YYYY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {executionsData && executionsData.searchExecutions.length > 0 && selectedSearchType === "execution" && (
          <div className="results">
            {executionsData.searchExecutions.length > PER_PAGE ? <Paginator
              count={executionsData.searchExecutions.length} itemsPerPage={PER_PAGE}
              currentPage={page} onClick={setPage}
            /> : <div className="paginator" /> }
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Command</th>
                  <th>Owners</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {executionsData.searchExecutions.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(e => (
                  <tr key={e.id} onClick={() => history.push(`/executions/${e.id}/`)}>
                    <td>{e.name}</td>
                    <td>{e.command.name}</td>
                    <td>{[...new Set((e.collection.owners || []).concat(e.sample.collection.owners || []).map(u => u.name))].join(", ")}</td>
                    <td>{moment(e.created * 1000).format("D MMM YYYY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </Base>
  );
};

SearchPage.propTypes = {
  
};

export default SearchPage;