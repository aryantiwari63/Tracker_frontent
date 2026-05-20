import React from "react";
import campData from "../../../../data/flipkart/reports/campData.json";
import FlipkartTable from "../../../common-components/flipkarttable";

const CreativeCampData = () => {
  const headers = [
    "Banner ID",
    "Banner Name",
    "Banner Status",
    "Adgroup Name",
    "Campaign Name",
    "Campaign Type",
    "Platform",
    "Banner Spent",
    "Campaign Budget Type",
    "Adgroup Type",
    "Campaign ID",
    "Adgroup End Date",
    "Views",
    "Clicks",
    "CTR",
    "CPC",
    "CPM",
    {
      title: "PPV",
      subTitles: ["Direct", "Indirect", "Total"],
    },
    {
      title: "Unit Solds(Views)",
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
  ];
  return (
    <>
      <FlipkartTable bodyContent={campData.aaData} headers={headers} />
    </>
  );
};
export default CreativeCampData;
