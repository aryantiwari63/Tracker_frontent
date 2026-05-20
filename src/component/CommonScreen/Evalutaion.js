import React, { useEffect, useState } from "react";
import {
  AMAZON_COMMON_SCREEN_ALERT,
  BLINKIT_COMMON_SCREEN_ALERT,
  FLIPKART_COMMON_SCREEN_ALERT,
  INSTAMART_COMMON_SCREEN_ALERT,
  ZEPTO_COMMON_SCREEN_ALERT,
} from "../../utils/constants";
import { _POST } from "../../services/axios.method";
const Evalution = ({
  amazonPerformanceData,
  amazonReachData,
  blinkitPerformanceData,
  blinkitReachData,
  flipkartPerformanceData,
  flipkartReachData,
  amazonTotal,
  blinkitTotal,
  flipkartTotal,
  zeptoPerformanceData,
  zeptoReachData,
  zeptoTotal,
  instamartPerformanceData,
  instamartTotal,
}) => {
  const [selectedMetricOptions, setSelectedMetricOptions] =
    useState("impressions");
  const [dayType, setDayType] = useState("weekly");
  const [compareValue, setCompareValue] = useState("greater_than");
  const [value1, setValue1] = useState("10");
  const [value2, setValue2] = useState(null);
  let currency = localStorage.getItem("currency");

  const metricsoptions = [
    { label: "Impression", value: "impressions" },
    { label: `Spend(${currency})`, value: "spend" },
    // "Clicks",
    { label: "CTR", value: "ctr" },
    { label: `CPC(${currency})`, value: "cpc" },
    // "Sales(INR)",
    // "ACOS",
    { label: "ROAS", value: "roas" },
    // " NTB orders",
  ];
  const duration = [
    { label: "7 days", value: "weekly" },
    { label: "1 day", value: "daily" },
  ];

  const compareBy = [
    { label: ">", value: "greater_than" },
    { label: "<", value: "less_than" },
    { label: "<=>", value: "in_between" },
  ];

  const amazonAlertApi = async () => {
    try {
      let data;
      data = {
        date_range: dayType,
        filter_by: selectedMetricOptions,
        value_1: value1,
        value_2: value2,
        compare_by: compareValue,
      };
      const result = await _POST(AMAZON_COMMON_SCREEN_ALERT, data);
      amazonPerformanceData(result?.data?.data?.amazonDataPerformanceCal[0]);
      amazonReachData(result?.data?.data?.amazonDataReachCal[0]);
      amazonTotal(result?.data?.data?.amazonTotal);
    } catch (error) {
      console.error(error);
    }
  };

  const zeptoAlertApi = async () => {
    try {
      let data;
      data = {
        date_range: dayType,
        filter_by: selectedMetricOptions,
        value_1: value1,
        value_2: value2,
        compare_by: compareValue,
      };
      const result = await _POST(ZEPTO_COMMON_SCREEN_ALERT, data);
      zeptoPerformanceData(result?.data?.data?.zeptoDataPerformanceCal[0]);
      zeptoReachData(result?.data?.data?.zeptoDataReachCal[0]);
      zeptoTotal(result?.data?.data?.zeptoTotal);
    } catch (error) {
      console.error(error);
    }
  };

  const blinkitAlertApi = async () => {
    try {
      let data;

      data = {
        date_range: dayType,
        filter_by: selectedMetricOptions,
        value_1: value1,
        value_2: value2,
        compare_by: compareValue,
      };
      const result = await _POST(BLINKIT_COMMON_SCREEN_ALERT, data);
      // console.log(result, "<<<<<<<<<<< result blinkit")
      blinkitPerformanceData(result?.data?.data?.blinkitDataPerformanceCal[0]);
      blinkitReachData(result?.data?.data?.blinkitDataReachCal[0]);
      blinkitTotal(result?.data?.data?.blinkitTotal);
    } catch (error) {
      console.error(error);
    }
  };

  const flipkartAlertApi = async () => {
    try {
      let data;
      data = {
        date_range: dayType,
        filter_by: selectedMetricOptions,
        value_1: parseInt(value1),
        value_2: parseInt(value2),
        compare_by: compareValue,
      };
      const result = await _POST(FLIPKART_COMMON_SCREEN_ALERT, data);
      flipkartPerformanceData(
        result?.data?.data?.flipkartDataPerformanceCal[0]
      );
      flipkartReachData(result?.data?.data?.flipkartDataReachCal[0]);
      flipkartTotal(result?.data?.data?.flipkartTotal);
    } catch (error) {
      console.error(error);
    }
  };

  const instamartAlertApi = async () => {
    try {
      let data;
      data = {
        date_range: dayType,
        filter_by: selectedMetricOptions,
        value_1: value1,
        value_2: value2,
        compare_by: compareValue,
      };
      const result = await _POST(INSTAMART_COMMON_SCREEN_ALERT, data);
      instamartPerformanceData(
        result?.data?.data?.instamartDataPerformanceCal[0]
      );
      instamartTotal(result?.data?.data?.instamartTotal);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    amazonAlertApi();
    blinkitAlertApi();
    flipkartAlertApi();
    zeptoAlertApi();
    instamartAlertApi();
  }, [dayType, selectedMetricOptions, compareValue, value1, value2]);

  const handleMetricOptionsChange = (event) => {
    setSelectedMetricOptions(event.target.value);
  };
  return (
    <>
      <div className="border">
        <div className="flex bg-white">
          <div className="px-4 py-3">
            <div className="font-semibold  py-2 ">Alerts</div>
          </div>
          <div className="px-2 py-3">
            <select
              className="border p-2"
              onChange={(e) => setDayType(e.target.value)}
            >
              {duration.map((item, i) => (
                <option key={i} value={item?.value}>
                  {item?.label}
                </option>
              ))}
            </select>
          </div>
          <label className="font-semibold text-[16px] flex items-center">
            Entities with minimum
          </label>
          <div className="px-4 py-3">
            <select
              className="border p-2"
              value={selectedMetricOptions}
              onChange={handleMetricOptionsChange}
            >
              {metricsoptions.map((item, i) => (
                <option key={i} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="py-3 ">
            <select
              className="border p-2"
              onChange={(e) => setCompareValue(e.target.value)}
            >
              {compareBy.map((item, i) => (
                <option key={i} value={item?.value}>
                  {item?.label}
                </option>
              ))}
            </select>
          </div>
          <div className=" py-4 pr-1 flex items-center">
            <label className="ml-2 font-semibold text-[16px]">of</label>
          </div>

          {compareValue !== "in_between" ? (
            <div className="py-3 pl-2 w-[100px]">
              <input
                className="border py-2 px-1  w-[100px]"
                type="number"
                value={value1}
                min="0"
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  setValue1(Math.abs(e.target.value));
                }}
              />
            </div>
          ) : (
            <>
              <div className="py-3 pl-2 w-[100px] mr-1">
                <input
                  className="border py-2 px-1  w-[100px]"
                  type="number"
                  value={value1}
                  min="0"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setValue1(Math.abs(e.target.value))}
                />
              </div>
              <div className="py-3 pl-2 w-[100px]">
                <input
                  className="border py-2 px-1  w-[100px]"
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(Math.abs(e.target.value))}
                />
              </div>
            </>
          )}
          {/* <div className="py-3 pl-2 mt-2">
            <div className="">
              <label className="pr-2 percentageBox py-3 px-1 mt-1 ml-1 border">
                Avg {selectedMetricOptions}:
                <span className="text-base pr-2"> 10</span>

              </label>
              <label className="pr-2 percentageBox py-3 px-1 mt-1 ml-1 border">
                Max {selectedMetricOptions}:
                <span className="text-base pr-2"> 10</span>

              </label>
              <label className="pr-2 percentageBox py-3 px-1 mt-1 ml-1  border">
                Min {selectedMetricOptions}:
                <span className="text-base font-semibold pr-2"> 10</span>

              </label>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Evalution;
