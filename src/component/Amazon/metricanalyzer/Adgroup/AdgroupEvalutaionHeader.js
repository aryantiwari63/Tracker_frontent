import React, { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { metricAnalyzerAvgAdgroup } from "../../../../services/dashboard";
import CustomSelectNew from "../../../common-components/CustomSelectNew";

const AdgroupEvalutionHeader = ({
  platform,
  dateRange,
  campType,
  compareValue,
  setCompareValue,
  value1,
  setValue1,
  value2,
  setValue2,
  selectedMetricOptions,
  setSelectedMetricOptions,
}) => {
  const [avgData, setAvgData] = useState([]);
  let currency = localStorage.getItem("currency");

  const metricsoptions = [
    {
      label: "Impression",
      value: "impressions",
      field: "",
    },
    {
      label: `Spend(${currency})`,
      value: "spend",
      field: currency,
    },
    {
      label: "Clicks",
      value: "clicks",
      field: "",
    },
    { label: "CTR", value: "ctr", field: "%" },
    { label: `CPC(${currency})`, value: "cpc", field: currency },
    { label: `Sales(${currency})`, value: "sales", field: currency },
    { label: "ACOS", value: "acos", field: "%" },
    { label: "ROAS", value: "roas", field: "" },
  ];

  const compareBy = [
    { label: ">", value: "greater_than" },
    { label: "<", value: "less_than" },
    { label: "<=>", value: "in_between" },
  ];
  const initLoad = async () => {
    const payload = {};
    payload.compare_by = compareValue;
    payload.value_1 = value1;
    payload.value_2 = value2;
    payload.type = campType.map((item) => {
      return item.value;
    });
    payload.account = platform.map((item) => {
      return item.value;
    });
    payload.start_date = dateRange[0].startDate;
    payload.end_date = dateRange[0].endDate;
    payload.compare = selectedMetricOptions;
    payload.groupBy = ["ad_group_id"];

    const res = await metricAnalyzerAvgAdgroup(payload);
    setAvgData(res.data.data);
  };
  useEffect(() => {
    if (platform.length > 0) {
      initLoad();
    } else {
      setAvgData([]);
    }
  }, [
    selectedMetricOptions,
    value1,
    value2,
    compareValue,
    platform,
    dateRange,
    campType,
  ]);
  const handleMetricOptionsChange = (eventValue) => {
    setSelectedMetricOptions(eventValue);
  };
  const selected = metricsoptions.find(
    (item) => item.value == selectedMetricOptions
  ).label;

  let fieldVal = metricsoptions.find(
    (x) => x.value === selectedMetricOptions
  )?.field;
  return (
    <div className="row bg-white">
      <div className="px-4 py-3">
        <button
          className="border px-4 py-2 pb-2"
          style={{ display: "flex", alignItems: "center" }}
        >
          <FiFilter style={{ marginRight: "4px", paddingRight: "2px" }} />
          Filter
        </button>
      </div>
      <label className="text-lg font-normal leading-6 px-2 py-4">
        Entities with minimum
      </label>
      <div className="px-4 py-3">
        {/* <select
          className="border p-2"
          value={selectedMetricOptions}
          onChange={handleMetricOptionsChange}
        >
          {metricsoptions.map((item, i) => (
            <option key={i} value={item.value}>
              {item.label}
            </option>
          ))}
        </select> */}
        <CustomSelectNew
          label={"Select"}
          options={metricsoptions}
          value={selectedMetricOptions}
          onChange={handleMetricOptionsChange}
          platform={"ams"}
          className="border p-2 w-32"
        />
      </div>
      <div className="py-3 ">
        {/* <select
          className="border p-2 px-2"
          onChange={(e) => setCompareValue(e.target.value)}
        >
          {compareBy.map((item, i) => (
            <option key={i} value={item?.value}>
              {item?.label}
            </option>
          ))}
        </select> */}
        <CustomSelectNew
          label={"Select"}
          options={compareBy}
          value={compareValue}
          onChange={setCompareValue}
          platform={"ams"}
          className="border py-2 px-4 w-16"
        />
      </div>
      <div className=" py-4 pr-1">
        <label className="text-base font-medium ml-2">of</label>
      </div>

      {compareValue !== "in_between" ? (
        <div className="py-3 pl-2 w-[100px]">
          <input
            className="border py-2 px-1 w-[100px] amsRing rounded-md"
            type="number"
            value={value1}
            min="0"
            onChange={(e) => {
              setValue1(Math.abs(e.target.value));
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      ) : (
        <>
          <div className="py-3 pl-2 w-[100px] mr-1">
            <input
              className="border py-2 px-1 w-[100px] amsRing rounded-md"
              type="number"
              value={value1}
              min="0"
              onChange={(e) => setValue1(Math.abs(e.target.value))}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div className="py-3 pl-2 w-[100px]">
            <input
              className="border py-2 px-1  w-[100px] amsRing rounded-md"
              type="number"
              value={value2}
              onChange={(e) => setValue2(Math.abs(e.target.value))}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </>
      )}
      <div className="ml-2 px-2 py-3">
        <div className="border p-2">
          <label className="pr-2 percentageBox">
            Avg.{selected}
            <span className="text-base pr-2 ml-1">
              {fieldVal != "%" && fieldVal}
              <input
                value={
                  isNaN(avgData?.average)
                    ? 0
                    : avgData?.average + (fieldVal == "%" ? fieldVal : "")
                }
                type="text"
                className="outline-none font-semibold"
              />
            </span>
          </label>
          <label className="pr-2 percentageBox">
            Max.{selected}
            <span className="text-base pr-2 ml-1">
              {fieldVal != "%" && fieldVal}
              <input
                value={
                  isNaN(avgData?.maximum)
                    ? 0
                    : avgData?.maximum + (fieldVal == "%" ? fieldVal : "")
                }
                type="text"
                className="outline-none font-semibold"
              />
            </span>
          </label>
          <label className="pr-2 percentageBox">
            Min.{selected}
            <span className="text-base font-semibold pr-2 ml-1">
              {fieldVal != "%" && fieldVal}
              <input
                value={
                  isNaN(avgData?.minimum)
                    ? 0
                    : avgData?.minimum + (fieldVal == "%" ? fieldVal : "")
                }
                type="text"
                className="outline-none font-semibold"
              />
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdgroupEvalutionHeader;
