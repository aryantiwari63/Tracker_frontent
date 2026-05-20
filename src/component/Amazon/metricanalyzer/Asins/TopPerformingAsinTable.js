// MetricAnalyzerTable.js
import React from "react";
import LoaderSpinner from "../../../common-components/loader-spinner";

const TopPerformingAsinTable = ({
  headers,
  loading,
  topLevelData,
  topCallApi,
  setDataLimit,
  topDataLimit,

  platform,
}) => {
  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;
    if (bottom && topCallApi && !loading) {
      setDataLimit(topDataLimit + 50);
      // Handle scrolling logic here (e.g., setDataLIMIT)
    }
  };

  return (
    <div className="bg-white">
      <div className=" max-h-[440px] overflow-auto " onScroll={handleScroll}>
        <table
          className="text-left w-[100%] campaignsTable"
          // style={{ tableLayout: "fixed" }}
        >
          <thead className="sticky top-0 left-0 z-[35] ">
            <tr
              className={[
                "bg-slate-100",
                platform === "ams" && "bg-[#F9F7EB]",
              ].join(" ")}
            >
              {headers?.map((item) => (
                <th
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
                          : item.value === "sales" ||
                            item.value === "spend" ||
                            item.value === "impressions"
                          ? 90
                          : 60,
                    }}
                  >
                    <span>{item.title}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          { topLevelData.map((item, i) => (
              <tr key={i}>
                {headers.map(
                  (header, headerIndex) =>
                    header.showCol && (
                      <td
                        className={`${
                          header.bgColor ? "metricanalyzerCampaignName" : ""
                        }`}
                        key={headerIndex}
                        style={{ wordBreak: "break-word" }}
                      >
                        {item[header.value] ? item[header.value] : "-"}
                      </td>
                    )
                )}
              </tr>
              
            ))}  {
              topLevelData.length < 1 &&
            
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

export default TopPerformingAsinTable;
