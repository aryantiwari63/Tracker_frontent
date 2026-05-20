// MetricAnalyzerTable.js
import React, { useState, useEffect } from "react";
import {
  metricAnalyzerAdgroup
} from "../../../../services/dashboard";
import LoaderSpinner from "../../../common-components/loader-spinner";

const LowPerformingAdgroupTable = ({
 value1, value2, compareValue,
  headers,
  platform,
  selectedMetric,
  campType,
  dateRange,
  selectedMetricOptions,
  lowBreakdown,
}) => {
  const [adgroupdata, setAdgroupdata] = useState([]);
  const [dataLimit, setDataLimit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [callApi,setCallApi] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [resetData, setResetData] = useState(false);

  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 400;
    if (bottom && callApi && !loading) {
      // Handle scrolling logic here (e.g., setDataLIMIT)
      setDataLimit(dataLimit + 50);
    }
  };
  const initLoad = async (reset= false) => {
    try {
      if((callApi || reset)) {
        if(platform.length >0) {
      setLoading(true)
      let filters = {};
      filters.sort = { [selectedMetric]: 1 };
      filters.selectedMetricOptions = selectedMetricOptions;
      filters.compareValue = compareValue;
      filters.value1 = value1;
      filters.value2 = value2;
      filters.campType = campType.map((item) => {
        return item.value
      });
      filters.platform = platform.map((item) => {
        return item.value
      });
      filters.dataLimit = reset ? 0 : dataLimit;
      filters.start_date = dateRange[0].startDate;
      filters.end_date = dateRange[0].endDate;
      filters.breakdown = lowBreakdown.map((item) => {
        if(item.checked) {
          return item.value
        }
       
      }).filter(n => n)
      let dashData = await metricAnalyzerAdgroup(filters);
      if(reset) {
        setAdgroupdata([...dashData.data.data.data])
      }
      else {
      setAdgroupdata([...adgroupdata, ...dashData.data.data.data])
      }
      if(dashData.data.data.data.length === 50) { setCallApi(true) }
      else {setCallApi(false)}
      setResetData(false);
      setLoading(false) }
      else {
        setAdgroupdata([])
      }
    }
     
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }

  useEffect(() => { 
    setResetData(true);
    setAdgroupdata([])
    let reset = true;
    setCallApi(false)
    setLoading(false)
    initLoad(reset)
    setDataLimit(0)
  },[selectedMetric, selectedMetricOptions, value1, value2, compareValue, platform, dateRange, campType, lowBreakdown])

  useEffect(() => {
    if(dataLimit > 0) {
    initLoad()
    }
  }, [dataLimit])
  return (
    <div className="bg-white">
      <div
        className=" max-h-[440px] overflow-auto max-w-max"
        onScroll={handleScroll}
      >
        <table className="text-left w-[100%] campaignsTable ">
          <thead className="sticky table-fixed top-0 left-0 z-[35]">
            <tr
              className={[
                "bg-slate-100",
                platform === "ams" && "bg-[#F9F7EB]",
              ].join(" ")}
            >
              {headers?.map((item) => (
                <th key={item.title} className="flex-column w-40">
                  <div className="flex items-center">
                    <span className=" flex">
                      {item.title === "Metrics" ? selectedMetric : item.title}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adgroupdata?.map((item, i) => (
              <tr key={i}>
                {headers?.map((headerItem, i) => (
                  <td key={i} className={headerItem.id < 3 ? "metricanalyzerCampaignNameLow" : ""}
                  style={{ wordBreak: headerItem.id < 3 ?"break-word" : "" }}
                  >
                    <div>{item[headerItem.value]}</div>
                  </td>
                ))}
              </tr>

            ))}
             {adgroupdata.length < 1 &&(
              <tr>
                <td
                  className="p-2"
                  colSpan={10}
                  rowSpan={2}
                  style={{ alignItems: "center", verticalAlign: "middle" }}
                >
                  <div className="loaderStyle  row sticky font-semibold">
                    No Data Found
                  </div>
                </td>
              </tr>
            )}
            {loading && (

              <tr>
                <td colSpan="4">
                  <LoaderSpinner />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowPerformingAdgroupTable;
