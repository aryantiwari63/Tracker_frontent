import React from "react";
import CampaignBudget from "./campaignbudget";
import BudgetResult from "./targetoption/budgetresult";
import Btn from "./button/Btn";
import Button from "../../../../common-components/button/Button";

const StepCampaignBudget = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [error, setError] = React.useState({
    BudgetType: "",
    Budget: "",
  });
  React.useEffect(() => {
    setError({
      ...error,
      BudgetType: "",
    });
  }, [campaignData.BudgetType]);
  React.useEffect(() => {
    setError({
      ...error,
      Budget: "",
    });
  }, [campaignData.Budget]);
  React.useEffect(() => {
    setError({
      ...error,
      campaign_name: "",
    });
  }, [campaignData.campaign_name]);
  return (
    <>
      {active > 4 ? (
        <BudgetResult campaignData={campaignData} />
      ) : (
        <CampaignBudget
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
          active={active}
          setActive={setActive}
          error={error}
        />
      )}
      <div className="col text-end px-2">
        {active > 4 ? (
          <Btn
            title="Edit"
            onClick={() => {
              setActive(4);
            }}
          />
        ) : (
          <div className="pt-4">
            <Button
              title="Done"
              // type="button"
              // placeholder="Enter Budget Value"
              disable={false}
              blinkit
              click={() => {
                if (!campaignData.BudgetType) {
                  setError({
                    ...error,
                    BudgetType: "Please select a budget type.",
                  });
                } else if (Number(campaignData.Budget) < 500) {
                  setError({
                    ...error,
                    Budget: "Budget should not be less than Rs. 500.",
                  });
                } else if (!campaignData.campaign_name) {
                  // setError("Campaign name cannot be empty");
                  setError({
                    ...error,
                    campaign_name: "Campaign name cannot be empty",
                  });
                } else {
                  setActive(5);
                }
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default StepCampaignBudget;
