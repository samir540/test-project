import React from "react";

const SearchInput = ({ setQuery, query }) => {
  return (
    <input
      type="text"
      value={query}
      placeholder="Search username"
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

export default SearchInput;
