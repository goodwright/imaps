import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
import { useLazyQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import Select from "../components/Select";
import moment from "moment";
import Base from "./Base";
import searchIcon from "../images/searchIcon.svg";
import Paginator from "../components/Paginator";
import { SEARCH_COLLECTIONS, SEARCH_SAMPLES, SEARCH_EXECUTIONS } from "../queries";
import { BarLoader } from "react-spinners";
import SearchInterface from "../components/SearchInterface";
import CollectionsGrid from "../components/CollectionsGrid";
import SamplesTable from "../components/SamplesTable";
import ExecutionTable from "../components/ExecutionTable";

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
  const [collections, setCollections] = useState(null);
  const [samples, setSamples] = useState(null);
  const [executions, setExecutions] = useState(null);
  const count = useRef(null);
  const PER_PAGE = 12;

  useDocumentTitle("iMaps - Advanced Search");

  

  

  useEffect(() => {
    if (selectedSearchType === "collection" && query) {
      searchCollections({variables: {query, sort: selectedSortType, owner: collectionOwner, created: collectionDate}})
    } else if (selectedSearchType === "sample" && query) {
      searchSamples({variables: {query, sort: selectedSortType, organism: sampleOrganism, owner: sampleOwner, created: sampleDate}})
    } else if (selectedSearchType === "execution" && query) {
      searchExecutions({variables: {query, sort: selectedSortType, command: executionCommand, owner: executionOwner, created: executionDate}})
    }
  }, [page])

  const [searchCollections, { loading: collectionsLoading, data: collectionsData }] = useLazyQuery(SEARCH_COLLECTIONS, {
    variables: {
      first: page * PER_PAGE,
      last: count.current ? page * PER_PAGE > count.current ? (
        count.current - (PER_PAGE * (page - 1))
       ) : PER_PAGE : PER_PAGE
    },
    onCompleted: data => {
      count.current = data.searchCollections.count;
      setCollections(data.searchCollections.edges.map(edge => edge.node))
    }
  });
  const [searchSamples, { loading: samplesLoading, data: samplesData }] = useLazyQuery(SEARCH_SAMPLES, {
    variables: {
      first: page * PER_PAGE,
      last: count.current ? page * PER_PAGE > count.current ? (
        count.current - (PER_PAGE * (page - 1))
       ) : PER_PAGE : PER_PAGE
    },
    onCompleted: data => {
      count.current = data.searchSamples.count;
      setSamples(data.searchSamples.edges.map(edge => edge.node))
    }
  });
  const [searchExecutions, { loading: executionsLoading, data: executionsData }] = useLazyQuery(SEARCH_EXECUTIONS, {
    variables: {
      first: page * PER_PAGE,
      last: count.current ? page * PER_PAGE > count.current ? (
        count.current - (PER_PAGE * (page - 1))
       ) : PER_PAGE : PER_PAGE
    },
    onCompleted: data => {
      count.current = data.searchExecutions.count;
      setExecutions(data.searchExecutions.edges.map(edge => edge.node))
    }
  });

  const showCollections = selectedSearchType === "collection" && collectionsData && collectionsData.searchCollections;
  const showSamples = selectedSearchType === "sample" && samplesData && samplesData.searchSamples;
  const showExecutions = selectedSearchType === "execution" && executionsData && executionsData.searchExecutions;

  return (
    <Base className="search-page">
      
      <h1>Advanced Search</h1>

      <SearchInterface
        searchCollections={searchCollections}
        searchSamples={searchSamples}
        searchExecutions={searchExecutions}
        loading={collectionsLoading || samplesLoading || executionsLoading}
      />

      {collections && (
        <CollectionsGrid
          collections={collections}
          pageLength={PER_PAGE}
          noMessage="No results for this query."
          network={[page, count.current, setPage]}
          className={collectionsLoading ? "opacity-50 pointer-events-none" : ""}
        />
      )}

      {samples && (
        <SamplesTable
          samples={samples}
          pageLength={PER_PAGE}
          noMessage="No results for this query."
          network={[page, count.current, setPage]}
          className={samplesLoading ? "opacity-50 pointer-events-none" : ""}
        />
      )}

      {executions && (
        <ExecutionTable
          executions={executions}
          pageLength={PER_PAGE}
          noMessage="No results for this query."
          network={[page, count.current, setPage]}
          showCategory={true}
          className={executionsLoading ? "opacity-50 pointer-events-none" : ""}
        />
      )}
     
      <div className="results">
        {/* {(collectionsLoading || samplesLoading || executionsLoading) && (
          <div className="loader">
            <BarLoader color="#6353C6" />
          </div>
        )} */}

        {/* {((showCollections && collectionsData.searchCollections.edges.length === 0) || (showSamples && samplesData.searchSamples.edges.length === 0) || (showExecutions && executionsData.searchExecutions.edges.length === 0)) && (
          <div className="no-data">
            No results for this query.
          </div>
        )} */}


        {showSamples && samplesData.searchSamples.edges.length > 0 && (
          <div className="results">
            {samplesData.searchSamples.count > PER_PAGE ? <Paginator
              count={samplesData.searchSamples.count} itemsPerPage={PER_PAGE}
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
                {samplesData.searchSamples.edges.map(edge => edge.node).map(s => (
                  <tr key={s.id} onClick={() => history.push(`/samples/${s.id}/`)}>
                    <td>{s.name}</td>
                    <td>{s.organism}</td>
                    <td>{s.collection ? s.collection.owners.map(u => u.name).join(", ") : ""}</td>
                    <td>{moment(s.created * 1000).format("D MMM YYYY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showExecutions && executionsData.searchExecutions.edges.length > 0 && (
          <div className="results">
            {executionsData.searchExecutions.count > PER_PAGE ? <Paginator
              count={executionsData.searchExecutions.count} itemsPerPage={PER_PAGE}
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
                {executionsData.searchExecutions.edges.map(edge => edge.node).map(e => (
                  <tr key={e.id} onClick={() => history.push(`/executions/${e.id}/`)}>
                    <td>{e.name}</td>
                    <td>{e.command.name}</td>
                    <td>{[...new Set((e.collection ? e.collection.owners : []).concat(e.sample && e.sample.collection ? e.sample.collection.owners : []).map(u => u.name))].join(", ")}</td>
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