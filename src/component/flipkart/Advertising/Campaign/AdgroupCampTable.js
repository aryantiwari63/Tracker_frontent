
import React from "react";
import FlipkartTable from "../../../common-components/flipkarttable";
import campData from "../../../../data/flipkart/reports/campData.json";

const AdgroupCampTable = () => {
    const headers = [
        "Adgroup Name",
        "Campaign Name",
        "Campaign Type",
        "Platform",
        "Campaign Budget",
        "Campaign Spent",
        "End Date",
        "Views",
        "Clicks",
        "CTR",
        "CPC",
        {
          title: "PPV",
          subTitles: ["Direct", "Indirect", "Total"],
        },
    
        {
          title: "Unit Solds",
          subTitles: ["Direct", "Indirect", "Total"],
        },
    
        {
          title: "Revenue(Clicks)",
          subTitles: ["Direct", "Indirect", "Total"],
        },
    
        {
          title: "CVR(Clicks)",
          subTitles: ["Direct", "Indirect", "Total"],
        },
    
        {
          title: "AOV(Clicks)",
          subTitles: ["Direct", "Indirect", "Total"],
        },
      ];
  return (
    <>
      <FlipkartTable bodyContent={campData.aaData} headers={headers} />
    </>
  );
};
export default AdgroupCampTable;


