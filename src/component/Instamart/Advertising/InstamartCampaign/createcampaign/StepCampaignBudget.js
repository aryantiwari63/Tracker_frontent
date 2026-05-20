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
    Budget: "",
  });

  React.useEffect(() => {
    setError({
      ...error,
      Budget: "",
    });
  }, [campaignData.Budget]);
  React.useEffect(() => {
    setError({
      ...error,
      pacing: "",
    });
  }, [campaignData?.do_not_include_ad_page]);

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
              // type="button"
              // placeholder="Enter Budget Value"
              disable={false}
              instamart
              click={() => {
                if (Number(campaignData?.Budget) < 100) {
                  setError({
                    ...error,
                    Budget: "Budget should not be less than Rs. 100.",
                  });
                } else if (!campaignData.include_ad_page) {
                  setError({
                    ...error,
                    pacing: "Please select at least one Pacing",
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
