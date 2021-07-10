import React from "react";
import Base from "./Base";

const SearchPage = () => {

  return (
    <Base className="search-page">
      
      <h1>Advanced Search</h1>

      <p className="font-light max-w-4xl mt-8 bg-gray-50 shadow p-2 rounded italic">
        This is the page for performing complex queries on the iMaps data. It will
        be implemented in September 2021. In the meantime you can use the searchbar
        above for performing quick searches.
      </p>

    </Base>
  );
};

SearchPage.propTypes = {
  
};

export default SearchPage;