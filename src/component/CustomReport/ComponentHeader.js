/* eslint-disable */
import React from "react";
import "./customreport.css";
import ReportCategory from "./ReportCategory";
import ActionType from "../../redux/types";
import { useDispatch } from "react-redux";
const ComponentHeader = ({
  filters,
  setCategory,
  reportCategory,
  viewMode,
  setViewMode,
  platform,
  setFilterDrawer,
  color,
  setSearch,
}) => {
  const totalElements = Object.values(filters?.quickFilters).reduce(
    (total, array) => total + array.length,
    0
  );
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch({
      type: ActionType.GENERATEDREPORTLIST,
      payload: [],
    });
    dispatch({
      type: ActionType.GENERATEDREPORTLISTTOTALDATA,
      payload: null,
    });
  }, []);

  return (
    <>
      <div className="col">
        <div className="row">
          <div className="w-[50%]">
            <div className="form-group has-search show-right-border">
              <span className="fa fa-search form-control-feedback"></span>
              <input
                type="text"
                className="form-control outline-none focus:border-blue-500"
                style={{ fontWeight: "bold" }}
                placeholder="Search Report"
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
          <div className="w-[50%]">
            <div className="flex justify-end space-x-4">
              <ReportCategory
                contentArray={reportCategory}
                setCategory={setCategory}
                active={filters?.category}
                color={color}
              />

              <img
                className="w-6 inline-block align-baseline mx-1 cursor-pointer"
                src={`/assets/images${
                  viewMode === "grid"
                    ? platform + "gridactive"
                    : "/gridinactive"
                }.svg`}
                alt="grid"
                onClick={() => setViewMode("grid")}
              />
              <img
                className="w-6 inline-block align-baseline mr-1 cursor-pointer"
                src={`/assets/images${
                  viewMode === "list"
                    ? platform + "listactive"
                    : "/listinactive"
                }.svg`}
                alt="list"
                onClick={() => setViewMode("list")}
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
          </div>
        </div>
      </div>
    </>
  );
};
export default ComponentHeader;
