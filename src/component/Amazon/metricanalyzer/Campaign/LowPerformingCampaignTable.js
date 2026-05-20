// MetricAnalyzerTable.js
import React from "react";

import LoaderSpinner from "../../../common-components/loader-spinner";

const LowPerformingCampaignTable = ({
  headers,
  loading,
  platform,
  dataLIMIT,
  setDataLIMIT,
  campaignData
}) => {

  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;
    if (bottom) {
      setDataLIMIT(dataLIMIT + 50);
    }
  };

  return (
    <div className="bg-white">
    <div
    className=" max-h-[440px] overflow-auto max-w-max"
    onScroll={handleScroll}
  >
    <table className="text-left w-full campaignsTable ">
      <thead className="sticky table-fixed top-0 left-0 z-[35] " >
          <tr
            className={[
              "bg-slate-100",
              platform === "ams" && "bg-[#F9F7EB]",
            ].join(" ")}
          >
            {headers?.map((item) => (
                item.showCol && (<th
                  key={item.title}
                  className="flex-column"
                  style={{
                    paddingLeft: "1rem",
                  }}
                >
                  <div
                    className="flex items-center"
                    style={{
                      width:
                        item.size === "l"
                          ? 90
                          : item.size === "xl"
                          ? 110
                          : item.value === "sales" || item.value === "spend" 
                          ? 90
                          : item.value==="campaign_name"
                          ? 150
                          :60,
                    }}
                  >
                    <span>{item.title}</span>
                  </div>
                </th>)
              ))}
          </tr>
        </thead>
        <tbody>
        {campaignData.map((item, i) => (
              <tr key={i}>
                {headers.map(
                  (header, headerIndex) =>
                    header.showCol && (
                      <td
                        className={`${
                          headerIndex==0 ? "metricanalyzerCampaignNameLow" : ""
                        }`}
                        key={headerIndex}
                        style={{ wordBreak: "break-word" }}
                      >
                        {item[header.value] ? item[header.value] : "-"}
                      </td>
                    )
                )}
              </tr>
              
            ))} {
              campaignData.length < 1 &&
            (
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
            ) }
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

export default LowPerformingCampaignTable;
