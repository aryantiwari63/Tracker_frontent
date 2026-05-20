import React from "react";
import ChooseProductPanel from "./ChooseProductPanel";
import NewStepCaption from "./NewStepCaption";
// import SearchProductFiled from "./campaigndetails/SearchProductFiled";

const StepCampaignDetails = ({
  setCampaignData,
  campaignData,
  handleChange,
  error,
}) => {
  const [values, setValues] = React.useState([]);

  return (
    <>
      <NewStepCaption
        caption="Campaign Products"
        subcaption="Select products you want to promote through this campaign"
      />
      {/* <SearchProductFiled
        active={active}
        setActive={setActive}
        setCampaignData={setCampaignData}
        campaignData={campaignData}
        handleChange={handleChange}
      /> */}
      <ChooseProductPanel
        setCampaignData={setCampaignData}
        campaignData={campaignData}
        handleChange={handleChange}
        setValues={setValues}
        values={values}
        // setError={setError}
        error={error}
      />
    </>
  );
};

export default StepCampaignDetails;
