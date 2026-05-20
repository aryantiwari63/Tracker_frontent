import React from "react";
import NewStepCaption from "./NewStepCaption";
import SearchProductFiled from "./campaigndetails/SearchProductFiled";

const StepCampaignDetails = ({
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [selectedData, setSelectedData] = React.useState([]);

  return (
    <>
      <NewStepCaption
        caption="Campaign Products"
        subcaption={
          selectedData && selectedData?.length
            ? ""
            : "Select products you want to promote through this campaign"
        }
      />

      <SearchProductFiled
        setCampaignData={setCampaignData}
        campaignData={campaignData}
        handleChange={handleChange}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </>
  );
};

export default StepCampaignDetails;
