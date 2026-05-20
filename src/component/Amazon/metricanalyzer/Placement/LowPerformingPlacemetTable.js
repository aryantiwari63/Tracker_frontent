// MetricAnalyzerTable.js
import React from "react";
import LoaderSpinner from "../../../common-components/loader-spinner";

const LowPerformingKeywordTable = ({
  callFrom,
  headers,
  loading,
  lowCallApi,
  lowLevelData,
  platform,
  lowDataLimit,
  setDataLimit,
}) => {
  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;

    if (bottom && lowCallApi && !loading) {
      // Handle scrolling logic here (e.g., setDataLIMIT)
      setDataLimit(lowDataLimit + 50);
    }
  };

  return (
    <div className="bg-white">
      <div className=" max-h-[440px] overflow-auto " onScroll={handleScroll}>
        <table className="text-left w-[100%] campaignsTable ">
          <thead className="sticky  top-0 left-0 z-[35]">
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
            {lowLevelData.map((item, key) => (
              <tr key={key}>
                {headers.map(
                  (header, headerIndex) =>
                    header.showCol && (
                      <td
                        className={`${
                          header.bgColor ? "metricanalyzerCampaignNameLow" : ""
                        }`}
                        key={headerIndex}
                        style={{ wordBreak: "break-word" }}
                      >
                        {item[header.value] ? item[header.value] : "-"}
                      </td>
                    )
                )}
              </tr>
            ))}
            {lowLevelData.length < 1 && (
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

            {loading && callFrom === "low" && (
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

export default LowPerformingKeywordTable;
