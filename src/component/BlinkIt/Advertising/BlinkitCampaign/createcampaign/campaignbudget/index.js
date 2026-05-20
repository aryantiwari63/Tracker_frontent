import React, { useState } from "react";
import CampaignBudgetTargetblock from "./CampaignBudgetTargetblock";

const CampaignBudget = ({
  setCampaignData,
  campaignData,
  handleChange,
  error,
}) => {
  const [typeBudget, setTypeBudget] = useState("");
  const [initialset, setInitialset] = useState(true);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.Budget &&
      campaignData?.BudgetType &&
      initialset
    ) {
      setTypeBudget(campaignData?.BudgetType);
      setInitialset(false);
    }
  }, [campaignData?.Budget]);
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

        <div className="text-green-700 text-sm my-3">OR</div>
        <div className="row">
          <div className="col_5">
            <CampaignBudgetTargetblock
              title="Daily budget"
              subtitle="set an amount you want to spend on the campaign everyday"
              placeholder="Enter Budget Value"
              value="daily"
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
      {error.BudgetType && <p className="errorText">{error.BudgetType}</p>}
      {error.Budget && <p className="errorText">{error.Budget}</p>}
    </>
  );
};
export default CampaignBudget;
