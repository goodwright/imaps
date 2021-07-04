import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { QUICK_SEARCH } from "../queries";
import SearchResult from "./SearchResult";
import BarLoader from "react-spinners/BarLoader";
import searchIcon from "../images/searchIcon.svg";
const colors = require("../colors").colors;

const SearchBar = props => {

  const [query, setQuery] = useState("");

  const [search, { data, loading }] = useLazyQuery(QUICK_SEARCH);

  useEffect(() => {
    const dismiss = () => setQuery("");
    window.addEventListener("click", dismiss);
    return () => window.removeEventListener("click", dismiss);
  })

  const collections = data && data.quickSearch ? data.quickSearch.collections : [];
  const samples = data && data.quickSearch ? data.quickSearch.samples : [];
  const executions = data && data.quickSearch ? data.quickSearch.executions : [];
  const groups = data && data.quickSearch ? data.quickSearch.groups : [];
  const users = data && data.quickSearch ? data.quickSearch.users : [];
  const resultsCount = collections.length + samples.length + executions.length + users.length + groups.length;

  const showResults = query.length >= 3;

  const keyUp = e => {
    const query = e.target.value;
    if (query.length >= 2) {
      search({variables: {query}});
    }
  }

  return (
    <div className={`mr-4 ml-0 z-10 sm:mr-3 sm:relative ${props.className || ""}`}>

      <div className="w-full relative h-full py-2 flex items-center">
        <img src={searchIcon} className="absolute w-4 ml-2" alt="" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyUp={keyUp}
          placeholder="Search"
          className={`block w-full h-full pl-8 bg-gray-200 rounded ${showResults ? "rounded-b-none" : ""}`}
        />
      </div>

      {showResults && (
        <div className={`bg-white text-gray-800 w-full max-h-96 mx-auto border border-top-0 shadow-lg -mt-2 rounded-md max-h-120 overflow-scroll no-scroll ${showResults ? "rounded-t-none" : ""}`}>
          {Boolean(loading) && (
            <div className="h-14 flex justify-center items-center">
              <BarLoader color={colors.primary[500]} css="width: 50%; max-width: 300px" />
            </div>
          )}
          {Boolean(data) && resultsCount === 0 && (
            <div className="h-14 px-3 flex items-center text-primary-300 italic">No results</div>
          )}
          {Boolean(data) && resultsCount > 0 && (
            <div className="grid bg-gray-100 gap-px" onClick={() => setQuery("")}>
              {collections.map(collection => (
                <SearchResult collection={collection} key={collection.id} query={query} />
              ))}
              {samples.map(sample => (
                <SearchResult sample={sample} key={sample.id} query={query} />
              ))}
              {executions.map(execution => (
                <SearchResult execution={execution} key={execution.id} query={query} />
              ))}
              {groups.map(group => (
                <SearchResult group={group} key={group.id} query={query} />
              ))}
              {users.map(user => (
                <SearchResult user={user} key={user.id} query={query} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  
};

export default SearchBar;