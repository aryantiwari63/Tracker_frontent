import NewStepCaption from "./NewStepCaption";
import SearchProductFiled from "./campaigndetails/SearchProductFiled";

const StepCampaignDetails = ({
  active,
  setActive,
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
        active={active}
        setActive={setActive}
        setCampaignData={setCampaignData}
        campaignData={campaignData}
        handleChange={handleChange}
      />
    </>
  );
};

export default StepCampaignDetails;
