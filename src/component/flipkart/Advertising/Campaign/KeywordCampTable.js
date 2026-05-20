import React from "react";
import campData from "../../../../data/flipkart/reports/campData.json";
import FlipkartTable from "../../../common-components/flipkarttable";

const KeywordCampTable = () => {
  const headers = [
    "Keyword",
    "Match Type",
    "Campaign Type",
    "Adgroup Name",
    "Campaign Name",
    "Platform",
    "Campaign Budget Type",
    "AdGroup Id",
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
    "Campaign Status",
    "Adgroup Status",
  ];

  return (
    <>
      <FlipkartTable bodyContent={campData.aaData} headers={headers} />
    </>
  );
};
export default KeywordCampTable;
