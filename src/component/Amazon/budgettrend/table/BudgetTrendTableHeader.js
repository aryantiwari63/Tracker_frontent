import React, { useState } from "react";
import Tabbtn from "../../advertise/Tabbtn";
import BudgetTrendSummary from "./TrendSummary/index.js";
import BugetTrendDailyTable from "./TrendDaily/index.js";

const BudgetTrendTableHeader = () => {
  const [activeTab, setActiveTab] = useState("summary");
  return (
    <>
      <div className="campaign__navtab">
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
      </div>
      {activeTab === "summary" && <BudgetTrendSummary />}
      {activeTab === "daily" && <BugetTrendDailyTable />}
    </>
  );
};

export default BudgetTrendTableHeader;
