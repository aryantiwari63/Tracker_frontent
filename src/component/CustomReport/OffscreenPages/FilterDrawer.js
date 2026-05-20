/* eslint-disable */
import React, { useState } from "react";
import "../custommain.css";
import { convertDate } from "../report_constant";

const FilterDrawer = ({
  setFilterDrawer,
  platformFilters,
  filters,
  setQuickFilter,
  color,
  calendar,
  platform,
  setPlatformFilters,
  searchFieldRequired = true,
}) => {
  const [isOpen, setIsOpen] = useState(undefined);
  const [isHovered, setIsHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  //

  // Function to render the platformFilters heading
  const renderFilterHeading = () =>
    platformFilters.map((mainFilter) => (
      <div className="mt-1" key={`providedFilter-${mainFilter.id}`}>
        <div
          className={`${
            mainFilter.id === isOpen
              ? "border-y shadow-md bg-white"
              : "border-b"
          } cursor-pointer rounded `}
          onClick={() => {
            if (mainFilter.id === isOpen) {
              setIsOpen(undefined);
            } else {
              setIsOpen(mainFilter.id);
            }
          }}
          // style={{
          //   borderColor: mainFilter.id === isOpen ? color : "",
          // }}
          data-value={mainFilter.value}
        >
          <div className="flex justify-between px-[1rem] py-[0.5rem]">
            <div
              className={`text-[15px] font-inter ${
                mainFilter.id === isOpen ? "font-bold" : "font-normal"
              }`}
            >
              {mainFilter.name}
            </div>
            {isOpen === mainFilter.id ? (
              <img
                className="w-3 h-4"
                src={`/assets/images/${platform}activedropdown.svg`}
                alt="toggle"
              />
            ) : (
              <img
                className="w-3 h-4"
                src={`/assets/images/customDropDown.svg`}
                alt="toggle"
              />
            )}
          </div>
        </div>

        {isOpen === mainFilter.id && renderIncludedFilters(mainFilter)}
      </div>
    ));
  // Function to render included filters with checkboxes
  const renderIncludedFilters = (mainFilter) => (
    <>
      {mainFilter.value === "created_by" && (
        <div className="relative mt-2 px-[1rem] form-group has-search show-right-border ">
          <span className="fa fa-search form-control-feedback"></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search People"
            value={searchTerm}
            onChange={(e) => {
              if (e.keyCode == 13) {
                e.preventDefault();
              } else {
                // console.log(
                //   "mainFilter?.searchedValue>>>>>>>",
                //   mainFilter?.searchedValue,
                //   e.target.value.toLowerCase()
                // );
                setSearchTerm(e.target.value);
                setPlatformFilters((prevArray) =>
                  prevArray.map((item) =>
                    item.id === 3
                      ? {
                          ...item,
                          includedFilter:
                            e.target.value.trim().length > 0
                              ? mainFilter?.searchedValue.filter((item) =>
                                  item.title
                                    .toLowerCase()
                                    .includes(e.target.value.toLowerCase())
                                )
                              : mainFilter?.searchedValue,
                        }
                      : item
                  )
                );
              }
            }}
            style={{
              background: "#f5f5f5",
              borderRadius: 0,
            }}
          />
        </div>
      )}
      <div
        className={`mt-1 ${
          mainFilter.value === "created_by"
            ? "overflow-y-auto shadow-md rounded bg-white "
            : "shadow-md rounded"
        }`}
      >
        {mainFilter?.includedFilter && mainFilter?.includedFilter.length > 0 ? (
          mainFilter?.includedFilter.map((subFilter, i) => (
            <div
              key={`subfilter-${subFilter.id}`}
              className={`flex custom-checkbox ${platform}-custom-select items-center py-[0.8rem] border-b border-[#F2F2F2] rounded px-[1rem] cursor-pointer ${
                isHovered === `${mainFilter.value}-${subFilter.id}` ||
                filters[subFilter.parentKey].some(
                  (val) => val.id === subFilter.id
                )
                  ? "bg-[#f2f2f2]"
                  : "bg-white"
              }`}
              onMouseEnter={() =>
                setIsHovered(`${mainFilter.value}-${subFilter.id}`)
              }
              onMouseLeave={() => setIsHovered(undefined)}
              onClick={() => {
                setQuickFilter(subFilter);
              }}
            >
              <input
                type="checkbox"
                id={`includedFilters-${subFilter.id}`}
                checked={filters[subFilter.parentKey].some(
                  (val) => val.id === subFilter.id
                )}
                name={`includedFilters-${subFilter.id}`}
                value={subFilter.id}
                className="mr-2 cursor-pointer"
              />
              <label
                htmlFor={`includedFilters-${subFilter.id} `}
                className={`text-[14px] font-normal flex`}
              >
                {subFilter.title}
              </label>
              {subFilter.image && (
                <>
                  &nbsp;
                  <img className="w-4 h-4" src={subFilter.image} alt="filter" />
                </>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center py-[0.8rem]  px-[1rem] h-[15rem] justify-center ">
            No People found
          </div>
        )}
      </div>
    </>
  );

  const showDateRange = (filter) => {
    if (filter?.ranges?.startDate && filter?.ranges?.endDate) {
      return (
        <>
          {convertDate(filter?.ranges?.startDate) +
            "   To   " +
            (filter?.ranges?.endDate
              ? convertDate(filter?.ranges?.endDate)
              : convertDate(filter?.ranges?.startDate))}
        </>
      );
    }
  };

  const showTags = () =>
    Object.keys(filters).map((key) => (
      <div key={key} className="flex flex-wrap gap-1">
        {filters[key].map((filter, index) => (
          <div
            key={`${index}-listing-${filter.id}`}
            className={`flex border-[#91d5ff] border px-2 py-0.5 my-1 bg-[#e6f7ff] text-[${color}] text-[14px] items-center space-x-2`}
          >
            <div style={{ color }}>
              {filter.parentTitle} :{" "}
              {filter.value === "custom_date_range"
                ? showDateRange(filter)
                : filter.title}
            </div>
            <img
              className="w-3 h-3 cursor-pointer"
              src="/assets/images/closecustom.svg"
              alt="remove"
              onClick={() => setQuickFilter(filter)}
            />
          </div>
        ))}
      </div>
    ));

  return (
    <div
      className="popup popup--rightSide "
      style={{ zIndex: calendar.showCalendar ? 49 : 1000 }}
    >
      <div
        className={`popup__container popup__container--rightSide max-w-[20%] h-[100vh] bg-[#fafafa]`}
      >
        <div
          className={["popup__heading popup__heading--rightside"].join(" ")}
          style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
        >
          <div className="flex justify-between">
            <div>
              <b className="text-[16px]">Quick Filters</b>
            </div>
            <div>
              <i
                className="fa fa-times cursor-pointer"
                onClick={() => setFilterDrawer(false)}
              ></i>
            </div>
          </div>
        </div>
        <div className="popup__content popup__content--rightside p-[0px] border-b-[0px] mb-[20px] h-[90vh] max-h-[90vh]">
          <div className="px-[3%] my-[1rem]">{showTags()}</div>
          <div className=" my-[1rem]">{renderFilterHeading()}</div>
        </div>
      </div>
    </div>
  );
};
export default FilterDrawer;
