import React, { useState } from "react";
import PropTypes from "prop-types";
import Base from "./Base";
import Select from "react-select";
import { useHistory } from "react-router";

const SearchPage = props => {

  const [query, setQuery] = useState("");
  const [selectedSearchType, setSelectedSearchType] = useState("collection");
  const [selectedSortType, setSelectedSortType] = useState("name");
  const [collectionOwner, setCollectionOwner] = useState("");
  const [collectionDate, setCollectionDate] = useState(null);
  const [sampleSpecies, setSampleSpecies] = useState("");
  const [sampleOwner, setSampleOwner] = useState("");
  const [sampleDate, setSampleDate] = useState(null);
  const [executionCommand, setExecutionCommand] = useState("");
  const [executionOwner, setExecutionOwner] = useState("");
  const [executionDate, setExecutionDate] = useState(null);
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
    {value: "modified", label: "Last Modified (Earliest First)"},
    {value: "-modified", label: "Last Modified (Latest First)"},
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
    } else if (selectedSearchType === "sample") {
      if (sampleSpecies) urlString += `&species=${encodeURI(sampleSpecies)}`;
      if (sampleOwner) urlString += `&owner=${encodeURI(sampleOwner)}`;
      if (sampleDate) urlString += `&date=${sampleDate}`;
    } else if (selectedSearchType === "execution") {
      if (executionCommand) urlString += `&command=${encodeURI(executionCommand)}`;
      if (executionOwner) urlString += `&owner=${encodeURI(executionOwner)}`;
      if (executionDate) urlString += `&date=${executionDate}`;
    }
    history.push(`/search?${urlString}`);
  }


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
            <label>Filter by date modified</label>
            <Select
              options={dateTypes}
              value={collectionDate && dateTypes.filter(t => t.value === collectionDate)}
              onChange={e => setCollectionDate(e.value)}
            />
          </div>
        )}
        {selectedSearchType === "sample" && (
          <div>
            <label>Filter by species</label>
            <input
              value={sampleSpecies}
              onChange={e => setSampleSpecies(e.target.value)}
            />
            <input />
            <label>Filter by collection owner</label>
            <input
              value={sampleOwner}
              onChange={e => setSampleOwner(e.target.value)}
            />
            <label>Filter by date modified</label>
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
            <label>Filter by date modified</label>
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

    </Base>
  );
};

SearchPage.propTypes = {
  
};

export default SearchPage;