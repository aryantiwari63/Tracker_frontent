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

  return (
    <>
      {active > 5 ? (
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
        {active > 5 ? (
          <Btn
            title="Edit"
            onClick={() => {
              setActive(5);
            }}
          />
        ) : (
          <div className="pt-4">
            <Button
              title="Done"
              platform={"blinkit"}
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
                } else if (Number(campaignData.Budget) < 250) {
                  setError({
                    ...error,
                    Budget: "Budget should not be less than Rs. 250.",
                  });
                } else {
                  setActive(6);
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
