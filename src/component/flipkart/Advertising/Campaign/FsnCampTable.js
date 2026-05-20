import React from "react";
import FlipkartTable from "../../../common-components/flipkarttable";
import campData from "../../../../data/flipkart/reports/campData.json";

const FsnCampTable=()=>{
    const headers = [
        "Advertised FSN ID",
        "FSN Name",
        "FSN Status",
        "Campaign Type",
        "Adgroup Name",
        "Campaign Name",
        "Platform",
        "Campaign Budget",
        "Campaign Budget Type",
        "AdGropup Id",
        "Campaign Id",
        "Views",
        "Clicks",
        "CTR",
        "CPC",
        "CPM",
    
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
          title: "ROI(Clicks)",
          subTitles: ["Direct", "Indirect", "Total"],
        },
        {
          title: "AOV(Clicks)",
          subTitles: ["Direct", "Indirect", "Total"],
        },
        "AdGroup Status",
        "Camapign Status",
      ];
    
    
      return (
        <>
          <FlipkartTable bodyContent={campData.aaData} headers={headers} />
        </>
      );
    
}

export default FsnCampTable
