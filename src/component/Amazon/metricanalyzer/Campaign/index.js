import React, { useState, useEffect } from "react";
import { FiFilter } from "react-icons/fi";
import CampaignEvalationHeader from "./CampaignEvalationHeader";
import CampaignTopPerformingTable from "./CampaignTopPerformingTable";
import CampaignLowPerformingTable from "./CampaignLowPerformingTable";
import { AMAZON_METRIC_ANALYZER_CAMPAIGN_VALUE } from "../../../../utils/constants";
import { convertDate } from "../../../../utils/helpers";
import { _POST } from "../../../../services/axios.method";
import CustomSelectNew from "../../../common-components/CustomSelectNew";

const Campaign = ({
  selectedMetric,
  setSelectedMetric,
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
  const [selectedMetricOptions, setSelectedMetricOptions] =
    useState("impressions");
  const [camapignValue, setCampaignValue] = React.useState({
    average: 0,
    maximum: 0,
    minimum: 0,
  });

  let currency = localStorage.getItem("currency");

  const [compareValue, setCompareValue] = useState("greater_than");
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = React.useState(false);

  const compareBy = [
    { label: ">", value: "greater_than" },
    { label: "<", value: "less_than" },
    { label: "<=>", value: "in_between" },
  ];

  const metricsoptions = [
    {
      label: "Impressions",
      value: "impressions",
      field: "",
    },
    {
      label: `Spend (${currency})`,
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

  let filterAccount = platform.map((item) => item.value);
  let filterCampType = campType.map((item) => item.value);
  let filterTags = tags.map((item) => item.value);

  let post = {
    start_date: convertDate(dateRange[0]?.startDate),
    end_date: convertDate(dateRange[0]?.endDate),
    account: filterAccount,
    type: filterCampType.length > 0 ? filterCampType : null,
    tags: filterTags.length > 0 ? filterTags : null,
    offset: 0,
    value_1: value1,
    value_2: value2,
    compare: selectedMetricOptions,
    compare_by: compareValue,
    groupBy: ["campaign_id"],
  };

  const campaignValue = async () => {
    try {
      setLoading(true);
      const result = await _POST(AMAZON_METRIC_ANALYZER_CAMPAIGN_VALUE, post);
      setLoading(false);
      setCampaignValue(result?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (platform.length > 0) {
      campaignValue();
    } else {
      setCampaignValue({
        average: 0,
        maximum: 0,
        minimum: 0,
      });
    }
  }, [
    selectedMetricOptions,
    platform,
    compareValue,
    value1,
    value2,
    selectedMetric,
    campType,
    tags,
    dateRange,
  ]);

  const handleMetricOptionsChange = (event) => {
    setSelectedMetricOptions(event);
  };
  const selected = metricsoptions.find(
    (item) => item.value == selectedMetricOptions
  ).label;

  const handleCompareOption=(value)=>{
    setCompareValue(value);
    setValue1(0);
    setValue2(0);
  }

  return (
    <>
      <div className="pt-4">
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

          <label className="text-lg font-normalit  px-2 py-4">
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
              onChange={(e) => {
                handleCompareOption(e.target.value)
              }}
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
              onChange={handleCompareOption}
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
                min={"0"}
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
                  min={"0"}
                  onChange={(e) => {
                    setValue1(Math.abs(e.target.value));
                  }}
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div className="py-3 pl-2 w-[100px]">
                <input
                  className="border py-2 px-1 w-[100px] amsRing rounded-md"
                  type="number"
                  value={value2}
                  min={"0"}
                  onChange={(e) => {
                    setValue2(Math.abs(e.target.value));
                  }}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </>
          )}
          <CampaignEvalationHeader
            camapignValue={camapignValue}
            selected={selected}
            selectedMetricOptions={selectedMetricOptions}
          />
        </div>
      </div>
      <div className="row">
        <div className="col_6">
          <CampaignTopPerformingTable
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            selectedMetricOptions={selectedMetricOptions}
            platform={platform}
            setPlatform={setPlatform}
            campType={campType}
            setCampType={setCampType}
            tags={tags}
            setTags={setTags}
            dateRange={dateRange}
            setDateRange={setDateRange}
            compareValue={compareValue}
            value1={value1}
            value2={value2}
            onApply={onApply}
          />
        </div>
        <div className="col_6 ">
          <CampaignLowPerformingTable
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            selectedMetricOptions={selectedMetricOptions}
            platform={platform}
            setPlatform={setPlatform}
            campType={campType}
            setCampType={setCampType}
            tags={tags}
            setTags={setTags}
            dateRange={dateRange}
            setDateRange={setDateRange}
            compareValue={compareValue}
            value1={value1}
            value2={value2}
            onApply={onApply}
          />
        </div>
      </div>
    </>
  );
};
export default Campaign;
