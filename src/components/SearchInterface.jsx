import React, { useState, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import Select from "../components/Select";
import { SEARCH_COLLECTIONS, SEARCH_SAMPLES, SEARCH_EXECUTIONS } from "../queries";
import Button from "./Button";
const config = require("tailwindcss/defaultConfig");

const SearchInterface = () => {

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
  const [page, setPage] = useState(1);
  const count = useRef(null);
  const PER_PAGE = 10;

  const searchTypes = [
    {value: "collection", label: "Collections"},
    {value: "sample", label: "Samples"},
    {value: "execution", label: "Executions"}
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
    {value: "year", label: "Past Year"},
  ]

  const [searchCollections, { loading: collectionsLoading }] = useLazyQuery(SEARCH_COLLECTIONS, {
    variables: {
      first: page * PER_PAGE,
      last: count.current ? page * PER_PAGE > count.current ? (
        count.current - (PER_PAGE * (page - 1))
       ) : PER_PAGE : PER_PAGE
    },
    onCompleted: data => count.current = data.searchCollections.count
  });
  const [searchSamples, { loading: samplesLoading }] = useLazyQuery(SEARCH_SAMPLES, {
    variables: {
      first: page * PER_PAGE,
      last: count.current ? page * PER_PAGE > count.current ? (
        count.current - (PER_PAGE * (page - 1))
       ) : PER_PAGE : PER_PAGE
    },
    onCompleted: data => count.current = data.searchSamples.count
  });
  const [searchExecutions, { loading: executionsLoading }] = useLazyQuery(SEARCH_EXECUTIONS, {
    variables: {
      first: page * PER_PAGE,
      last: count.current ? page * PER_PAGE > count.current ? (
        count.current - (PER_PAGE * (page - 1))
       ) : PER_PAGE : PER_PAGE
    },
    onCompleted: data => count.current = data.searchExecutions.count
  });

  const formSubmit = e => {
    e.preventDefault();
    setPage(1);
    if (selectedSearchType === "collection") {
      searchCollections({variables: {query, sort: selectedSortType, owner: collectionOwner, created: collectionDate}})
    } else if (selectedSearchType === "sample") {
      searchSamples({variables: {query, sort: selectedSortType, organimd: sampleOrganism, owner: sampleOwner, created: sampleDate}})
    } else if (selectedSearchType === "execution") {
      searchExecutions({variables: {query, sort: selectedSortType, command: executionCommand, owner: executionOwner, created: executionDate}})
    }
  }

  const height = "h-10";
  const inputClass = `text-primary-200 block ${height} bg-gray-200 text-sm`

  return (
    <form onSubmit={formSubmit} className="max-w-4xl mb-32 grid gap-8 w-full pb-24 border-b">
      <div className="block w-full md:flex justify-between">
        <input
          value={query}
          className={`w-full mb-3 md:flex-grow md:w-auto md:mr-3 md:mb-0 ${inputClass}`}
          onChange={e => setQuery(e.target.value)}
          required
          placeholder="Search..."
          type="text"
        />
        <Select
          options={searchTypes}
          value={selectedSearchType && searchTypes.filter(t => t.value === selectedSearchType)}
          onChange={e => setSelectedSearchType(e.value)}
          className={`w-full md:w-36 ${height}`}
          styles={{control: () => ({"height": config.theme.spacing[height.split("-")[1]]})}}
        />
      </div>

      <div>
        <div className="mb-1">Filter Results</div>
        <div className="block w-full md:flex">
          {selectedSearchType === "collection" && (
            <>
              <input
                value={collectionOwner}
                onChange={e => setCollectionOwner(e.target.value)}
                placeholder="Owner"
                type="text"
                className={`${inputClass} w-full md:w-36 mb-3 md:mr-3 md:mb-0`}
              />
              <Select
                options={dateTypes}
                value={collectionDate && dateTypes.filter(t => t.value === collectionDate)}
                onChange={e => setCollectionDate(e.value)}
                placeholder="Date created"
                className="w-full md:w-40"
                styles={{control: () => ({"height": config.theme.spacing[height.split("-")[1]]})}}
              />
            </>
          )}
          {selectedSearchType === "sample" && (
            <>
              <input
                value={sampleOrganism}
                onChange={e => setSampleOrganism(e.target.value)}
                placeholder="Organism"
                type="text"
                className={`${inputClass} w-full md:w-36 mb-3 md:mr-3 md:mb-0`}
              />
              <input
                value={sampleOwner}
                onChange={e => setSampleOwner(e.target.value)}
                placeholder="Owner"
                type="text"
                className={`${inputClass} w-full md:w-36 mb-3 md:mr-3 md:mb-0`}
              />
              <Select
                options={dateTypes}
                value={sampleDate && dateTypes.filter(t => t.value === sampleDate)}
                onChange={e => setSampleDate(e.value)}
                placeholder="Date created"
                className="w-full md:w-40"
                styles={{control: () => ({"height": config.theme.spacing[height.split("-")[1]]})}}
              />
            </>
          )}
          {selectedSearchType === "execution" && (
            <>
              <input
                value={executionCommand}
                onChange={e => setExecutionCommand(e.target.value)}
                placeholder="Command"
                type="text"
                className={`${inputClass} w-full md:w-36 mb-3 md:mr-3 md:mb-0`}
              />
              <input
                value={executionOwner}
                onChange={e => setExecutionOwner(e.target.value)}
                placeholder="Owner"
                type="text"
                className={`${inputClass} w-full md:w-36 mb-3 md:mr-3 md:mb-0`}
              />
              <Select
                options={dateTypes}
                value={executionDate && dateTypes.filter(t => t.value === executionDate)}
                onChange={e => setExecutionDate(e.value)}
                placeholder="Date created"
                className="w-full md:w-40"
                styles={{control: () => ({"height": config.theme.spacing[height.split("-")[1]]})}}
              />
            </>
          )}
        </div>
      </div>

      <div>
        <div className="mb-1">Sort By</div>
        <div className="block w-full md:flex justify-between">
          <Select
            options={sortTypes}
            value={selectedSortType && sortTypes.filter(t => t.value === selectedSortType)}
            onChange={e => setSelectedSortType(e.value)}
            className="mb-16 w-full md:w-60 md:mb-0"
            styles={{control: () => ({"height": config.theme.spacing[height.split("-")[1]]})}}
          />
          <Button
            type="submit"
            className={`btn-primary py-0 text-base w-full md:w-24 ${height}`}
            loading={collectionsLoading || samplesLoading || executionsLoading}
          >Search</Button>
        </div>
      </div>
    </form>
  );
};

SearchInterface.propTypes = {
  
};

export default SearchInterface;