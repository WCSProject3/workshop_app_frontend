import React from 'react';


const SearchBar = (props) => {

    const { handleChange , searchValue} = props

  return (
    <div className="search-bar">
      <input type="text" onChange={handleChange} value={searchValue} placeholder="Search" />
    </div>
  );
}


export default SearchBar;
