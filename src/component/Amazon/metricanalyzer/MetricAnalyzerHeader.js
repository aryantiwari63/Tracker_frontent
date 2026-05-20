import React from "react";
import MetricAnalyzerHeaderDropDown from "./MetricAnalyzerHeaderDropDown";
import MetricHeaderDropDown from "./MetricHeaderDropDown";

const MetricAnalyzerHeader = ({
  setSelectedMetric,
  selectedMetric,
  setShouldUpdate,
  platform,
  setPlatform,
  campType,
  setCampType,
  tags,
  setTags,
  dateRange,
  setDateRange,
  onApply,
}) => {
  return (
    <>
      <div className="row bg-white">
        <div className="row p-4">
          <label className="font-bold text-lg pr-4 pt-2">Metric Analyzer</label>
          <MetricAnalyzerHeaderDropDown
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            setShouldUpdate={setShouldUpdate}
          />
        </div>
        <div className="w-3/5">
          <MetricHeaderDropDown
            platform={platform}
            setPlatform={setPlatform}
            campType={campType}
            setCampType={setCampType}
            tags={tags}
            setTags={setTags}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onApply={onApply}
          />
        </div>
      </div>
    </>
  );
};

export default MetricAnalyzerHeader;
