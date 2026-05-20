import React from "react";

const Searchbar = () => {
  return (
    <>
      <div className="row">
        <form action="#" className="campaign-search row">
          <input
            type="text"
            placeholder="Search"
            name="search"
            className="search-input"
          />
          <div className="pr-2">
            <button type="submit" className="row">
              <img
                src="/assets/images/save-icon.svg"
                alt=""
                className="pt-1 pr-1"
              />
              Save
            </button>
          </div>
          <div>
            <button type="submit" className="row ">
              <img
                src="/assets/images/clear-icon.svg"
                alt=""
                className="pt-1 "
              />
              Clear
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Searchbar;
