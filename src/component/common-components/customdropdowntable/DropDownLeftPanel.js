import React, { useState } from "react";
import LeftPanelOptions from "./LeftPanelOptions";

const DropDownLeftPanel = ({
  metric,
  title,
  selectedMetric,
  setSelectedMetric,
  data,
}) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [totalMetrics, setTotalMetrics] = useState(0);
  return (
    <>
      <div className="metricpanel py-2">
        <div className="metricpanel__heading ">{`${title} (${totalMetrics})`}</div>
        <div className="row customedropdown--leftpanel">
          <div className="col py-1">
            <form className="relative  pr-2 ">
              <div className=" ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="keyword__searchimg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  className="keywordtab__search rounded"
                  onChange={(e) => setSearchFilter(e.target.value)}
                  value={searchFilter}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchFilter("")}
                >
                  x
                </button>
              </div>
            </form>
          </div>
          <div className="row">
            <div className="col"></div>
          </div>
          <div>
            <LeftPanelOptions
              metric={metric}
              selectedMetric={selectedMetric}
              setSelectedMetric={setSelectedMetric}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              setTotalMetrics={setTotalMetrics}
              data={data}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DropDownLeftPanel;
