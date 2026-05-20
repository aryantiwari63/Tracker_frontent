import React, { useEffect, useState } from "react";
import Tabbtn from "../../flipkart/Advertising/Tabbtn.js";
// import BudgetTrendSummary from "./TrendSummary/index.js";
// import BugetTrendDailyTable from "./TrendDaily/index.js";

// import { trackCampaignManagerTabs } from "../../../../analytics/EventController.js";
// import BudgetHistory from "./BudgetHistory/index.js";
import { trackCampaignManagerTabs } from "../../../analytics/EventController.js";
const BudgetPacerHeaders = ({ summaryPage, dailyPage, historyPage }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const platform = localStorage.getItem('platform_type').replace(/"/g, '').substring(1)
  useEffect(() => {
    trackCampaignManagerTabs(activeTab); //Analytics tracking
  }, [activeTab]);

  return (
    <>
  
{/*   
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    --tw-text-opacity: 1;
    color: rgb(107 114 128 / var(--tw-text-opacity));
    background-color: white;
    /* padding-left: 15px;  
    display: flex;
    gap: 2; */}
      <div className="flex py-4 bg-white color-[#303030]">
        <b className="font-inter font-bold text-[16px] leading-6 pl-4 capitalize">
          {activeTab==="summary"?"Budget Summary":activeTab==="daily"?"Daily Budget":"Budget History"}
        </b>
      </div>
      <div className="mt-4 text-[0.875rem] leading-5 font-medium text-[#6b7280] flex bg-white pl-4">
        <Tabbtn
          title="Summary"
          imgsrc={
            "http://13.234.176.50/amsfrontend/upload/avatar/summary-icon.svg"
          }
          onClick={() => setActiveTab("summary")}
          active={activeTab === "summary"}
          platform={platform}
        />
        <Tabbtn
          title="Daily"
          imgsrc={
            "http://13.234.176.50/amsfrontend/upload/avatar/daily-icon.svg"
          }
          onClick={() => setActiveTab("daily")}
          active={activeTab === "daily"}
          platform={platform}
        />
        <Tabbtn
          title="History"
          imgsrc={
            "http://13.234.176.50/amsfrontend/upload/avatar/daily-icon.svg"
          }
          onClick={() => setActiveTab("history")}
          active={activeTab === "history"}
          platform={platform}
        />
      </div>
      {activeTab === "summary" && summaryPage}
      {activeTab === "daily" && dailyPage}
      {activeTab === "history" && historyPage}
    </>
  );
};

export default BudgetPacerHeaders;
