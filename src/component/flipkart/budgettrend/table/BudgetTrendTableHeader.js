import React, { useEffect, useState } from "react";
import Tabbtn from "../../Advertising/Tabbtn";
import BudgetTrendSummary from "./TrendSummary/index.js";
import BugetTrendDailyTable from "./TrendDaily/index.js";
import { trackCampaignManagerTabs } from "../../../../analytics/EventController.js";
import BudgetHistory from "./BudgetHistory/index.js";

const BudgetTrendTableHeader = () => {
  const [activeTab, setActiveTab] = useState("summary");
  useEffect(() => {
    trackCampaignManagerTabs(activeTab); //Analytics tracking
  }, [activeTab]);
  return (
    <>
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
        />
        <Tabbtn
          title="Daily"
          imgsrc={
            "http://13.234.176.50/amsfrontend/upload/avatar/daily-icon.svg"
          }
          onClick={() => setActiveTab("daily")}
          active={activeTab === "daily"}
        />
        <Tabbtn
          title="History"
          imgsrc={
            "http://13.234.176.50/amsfrontend/upload/avatar/daily-icon.svg"
          }
          onClick={() => setActiveTab("history")}
          active={activeTab === "history"}
        />
      </div>
      {activeTab === "summary" && <BudgetTrendSummary />}
      {activeTab === "daily" && <BugetTrendDailyTable />}
      {activeTab === "history" && <BudgetHistory />}
    </>
  );
};

export default BudgetTrendTableHeader;
