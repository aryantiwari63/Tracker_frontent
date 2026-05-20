import React, { useState } from "react";
import CampaignBudgetTargetblock from "./CampaignBudgetTargetblock";

const CampaignBudget = ({
  setCampaignData,
  campaignData,
  handleChange,
  error,
}) => {
  const [typeBudget, setTypeBudget] = useState("");
  return (
    <>
      <div className="border-b pb-3">
        <div className="row pt-4">
          <div className="col_5">
            <CampaignBudgetTargetblock
              title=" Overall campain budget"
              subtitle=" set an amount you want to spend on the entire campaign's lifetime"
              placeholder="Enter Budget Value"
              value="overall"
              name="budget"
              typeBudget={typeBudget}
              setTypeBudget={setTypeBudget}
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              error={error}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default CampaignBudget;
