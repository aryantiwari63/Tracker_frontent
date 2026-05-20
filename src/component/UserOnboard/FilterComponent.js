/* eslint-disable */
import React from "react";
import "../Amazon/CustomReportSetting/styles.css";

const FilterComponent = ({
  filters,
  setFilterDrawer,
  color,
  setSearch,
  openModal,
}) => {
  const totalElements = Object.values(filters?.quickFilters).reduce(
    (total, array) => total + array.length,
    0
  );

  return (
    <>
      <div className="col">
        <div className="row">
          <div className="w-[50%] row">
            <div className=" w-auto">
              <button
                type="button"
                className="customreport__btn w-full px-[15px] h-full"
                style={{
                  background: color,
                  color: "#fff",
                  justifyContent: "center",
                }}
                onClick={() => openModal(undefined, "full")}
              >
                <span className="text-[18px]"> + </span>&nbsp;&nbsp;{" "}
                <span>Add People</span>
              </button>
            </div>
            <div className="w-[2%]"></div>
            <div className="form-group has-search show-right-border w-[68%]">
              <span className="fa fa-search form-control-feedback"></span>
              <input
                type="text"
                className="form-control outline-none focus:border-blue-500"
                style={{ fontWeight: "bold" }}
                placeholder="Search"
                value={filters?.search}
                onKeyPress={(e) => {
                  // console.log(filters?.search.length, "e>>>>>>>>", e.charCode);
                  if (filters?.search.length === 0 && e.charCode === 32) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  // console.log("e>>>>>>>>>>>", e.target.value);
                  setSearch(e.target.value.replace(/^\s+/, ""));
                }}
              />
            </div>
          </div>
          {/* <div className="w-[50%]">
            <div className="flex justify-end space-x-4">
              <img
                className="w-6 inline-block align-baseline mr-1 cursor-pointer"
                src={`/assets/images/downloaduser.svg`}
                alt="list"
                // onClick={() => setViewMode("list")}
              />
              <div className="flex relative">
                <img
                  className="w-6 inline-block align-baseline mr-1 cursor-pointer"
                  src="/assets/images/filterscustom.svg"
                  alt="filter"
                  onClick={() => setFilterDrawer(true)}
                />
                {totalElements > 0 && (
                  <span
                    className={`absolute top-0 right-0 block h-4 w-4 text-xs rounded-full bg-[${color}] text-white flex items-center justify-center`}
                  >
                    {totalElements}
                  </span>
                )}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};
export default FilterComponent;
