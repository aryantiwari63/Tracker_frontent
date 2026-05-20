import React from "react";
import { FiFilter } from "react-icons/fi";
import CustomSelectNew from "../../../common-components/CustomSelectNew";

const PlacementEvalationHeader = ({
  setPlacementLevelFilter,
  placementLevelFilter,
  valueFirst,
  setValueFirst,
  valueSecond,
  setValueSecond,
  setCompareValue,
  compareValue,
  metricFinder,
}) => {
  // console.log("AsinLevelFilter", asinLevelFilter);
  let currency = localStorage.getItem("currency");

  const metricsoptions = [
    {
      label: "Impression",
      value: "impressions",
    },
    {
      label: `Spend(${currency})`,
      value: "spend",
    },
    {
      label: "Clicks",
      value: "clicks",
    },
    { label: "CTR", value: "ctr" },
    { label: `CPC(${currency})`, value: "cpc" },
    { label: `Sales(${currency})`, value: "sales" },
    { label: "ACOS", value: "acos" },
    { label: "ROAS", value: "roas" },
  ];
  const compareBy = [
    { label: ">", value: ">" },
    { label: "<", value: "<" },
    { label: "<=>", value: "<=>" },
  ];

  // const handleMetricOptionsChange = (event) => {
  //   setAsinLevelFilter(event.target.value);
  // };

  const selected = metricsoptions.find(
    (item) => item.value === placementLevelFilter
  )?.label;
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
          value={placementLevelFilter}
          onChange={(e) => setPlacementLevelFilter(e.target.value)}
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
          value={placementLevelFilter}
          onChange={setPlacementLevelFilter}
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

      {compareValue !== "<=>" ? (
        <div className="py-3 pl-2 w-[100px]">
          <input
            className="border py-2 px-1  w-[100px] amsRing rounded-md"
            type="number"
            value={valueFirst}
            min="0"
            onChange={(e) => {
              setValueFirst(Math.abs(e.target.value));
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      ) : (
        <>
          <div className="py-3 pl-2 w-[100px] mr-1">
            <input
              className="border py-2 px-1  w-[100px] amsRing rounded-md"
              type="number"
              value={valueFirst}
              min="0"
              onChange={(e) => setValueFirst(Math.abs(e.target.value))}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div className="py-3 pl-2 w-[100px]">
            <input
              className="border py-2 px-1  w-[100px] amsRing rounded-md"
              type="number"
              value={valueSecond}
              onChange={(e) => setValueSecond(Math.abs(e.target.value))}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </>
      )}
      <div className="ml-2 px-2 py-3">
        <div
          className="border p-2 w-[45vw]"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className="pr-2 percentageBox">
            Avg.{selected}
            <span className="text-base pr-2 font-semibold">
              {" " + metricFinder?.avg}
            </span>
            {/* <input type="number" className="outline-none font-semibold" /> */}
          </div>
          <div className="pr-2 percentageBox">
            Max.{selected}
            <span className="text-base pr-2 font-semibold">
              {" " + metricFinder?.max}
            </span>
            {/* <input type="number" className="outline-none font-semibold" /> */}
          </div>
          <div className="pr-2 percentageBox">
            Min.{selected}
            <span className="text-base font-semibold pr-2">
              {" " + metricFinder?.min}
            </span>
            {/* <input type="number" className="outline-none font-semibold" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementEvalationHeader;
