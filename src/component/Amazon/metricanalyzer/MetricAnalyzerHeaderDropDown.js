// MetricAnalyzerHeaderDropDown.js
import React from "react";
import CustomSelectNew from "../../common-components/CustomSelectNew";

const MetricAnalyzerHeaderDropDown = ({
  selectedMetric,
  setSelectedMetric,
  setShouldUpdate,
}) => {
  // const metrics = [
  //   "CTR",
  //   "CPC",
  //   "Orders",
  //   "Sales",
  //   "ACOS",
  //   "ROAS",
  //   "Impressions",
  //   "Spend",
  // ];
  const metricsArr = [
    { label: "CTR", value: "ctr" },
    { label: "CPC", value: "cpc" },
    { label: "Orders", value: "orders" },
    { label: "Sales", value: "sales" },
    { label: "ACOS", value: "acos" },
    { label: "ROAS", value: "roas" },
    { label: "Impressions", value: "impressions" },
    { label: "Spend", value: "spend" },
  ];

  const handleMetricChange = (newMetric) => {
    setSelectedMetric(newMetric);
    setShouldUpdate(true);
  };

  // const dropdownStyles = {
  //   container: {
  //     position: "relative",
  //     width: "150px",
  //     border: "1px solid #ccc",
  //     borderRadius: "4px",
  //     overflow: "hidden",
  //     backgroundColor: "#fff",
  //   },
  //   select: {
  //     width: "100%",
  //     padding: "10px",
  //     border: "none",
  //     outline: "none",
  //     backgroundColor: "transparent",
  //     cursor: "pointer",
  //   },
  //   option: {
  //     cursor: "pointer",
  //   },
  //   optionHover: {
  //     backgroundColor: "red",
  //     color: "white",
  //   },
  // };
  
  return (
    <div className="z-[299]">
      {/* <div style={dropdownStyles.container}>
        <select
          id="metric-select"
          value={selectedMetric}
          onChange={handleMetricChange}
          style={dropdownStyles.select}
        >
          {metrics.map((metric) => (
            <option
              key={metric}
              value={metric.toLowerCase()}
              style={dropdownStyles.option}
            >
              {metric}
            </option>
          ))}
        </select>
      </div> */}
      <CustomSelectNew
        label={"Select"}
        options={metricsArr}
        value={selectedMetric}
        onChange={handleMetricChange}
        platform={"ams"}
        className="py-2 w-[150px] rounded-md"
      />
    </div>
  );
};

export default MetricAnalyzerHeaderDropDown;
