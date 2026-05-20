import React from "react";
import CampaignBudget from "./campaignbudget";

const StepCampaignBudget = ({
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  // const [error, setError] = React.useState({
  //   BudgetType: "",
  //   Budget: "",
  // });
  // React.useEffect(() => {
  //   setError({
  //     ...error,
  //     BudgetType: "",
  //   });
  // }, [campaignData.BudgetType]);
  // React.useEffect(() => {
  //   setError({
  //     ...error,
  //     Budget: "",
  //   });
  // }, [campaignData.Budget]);
  // React.useEffect(() => {
  //   setError({
  //     ...error,
  //     campaign_name: "",
  //   });
  // }, [campaignData.campaign_name]);
  return (
    <>
      <CampaignBudget
        setCampaignData={setCampaignData}
        campaignData={campaignData}
        handleChange={handleChange}
        // error={error}
      />
    </>
  );
};

export default StepCampaignBudget;
