import NewStepCaption from "./NewStepCaption";
import SearchProductFiled from "./campaigndetails/SearchProductFiled";

const StepCampaignDetails = ({
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  return (
    <>
      <NewStepCaption
        caption="Campaign Products"
        subcaption="Select products you want to promote through this campaign"
      />
      <SearchProductFiled
        setCampaignData={setCampaignData}
        campaignData={campaignData}
        handleChange={handleChange}
      />
    </>
  );
};

export default StepCampaignDetails;
