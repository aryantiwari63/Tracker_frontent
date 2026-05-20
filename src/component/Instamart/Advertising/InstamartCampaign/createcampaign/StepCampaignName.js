import React from "react";
// import CampaignBudget from "./campaignbudget";
// import BudgetResult from "./targetoption/budgetresult";
import Btn from "./button/Btn";
import Button from "../../../../common-components/button/Button";
import Campaignresult from "./targetoption/campaignresult";
import CampaignNameStep from "./campaignNameStep";

const StepCampaignName = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [error, setError] = React.useState({
    campaign_name: "",
  });

  React.useEffect(() => {
    setError({
      ...error,
      campaign_name: "",
    });
  }, [campaignData.campaign_name]);
  return (
    <>
      {active > 1 ? (
        <Campaignresult campaignData={campaignData} />
      ) : (
        <CampaignNameStep
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
          active={active}
          setActive={setActive}
          error={error}
        />
      )}
      <div className="col text-end px-2">
        {active > 1 ? (
          <Btn
            title="Edit"
            onClick={() => {
              setActive(1);
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
                if (!campaignData.campaign_name) {
                  // setError("Campaign name cannot be empty");
                  setError({
                    ...error,
                    campaign_name: "Campaign name cannot be empty",
                  });
                } else {
                  setActive(2);
                }
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default StepCampaignName;
