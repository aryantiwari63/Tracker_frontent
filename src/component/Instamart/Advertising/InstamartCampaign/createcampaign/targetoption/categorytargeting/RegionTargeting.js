import React from "react";
// import AddKeywordCategory from "./AddKeywordCategory";
import CampaignDuration from "./CampaignDuration";
import CampaignRegion from "./CampaignRegion";

const RegionTargeting = ({
  setCampaignData,
  campaignData,
  handleChange,
  error,
}) => {
  return (
    <>
      <div className="border-t">
        <div className="border-b py-4">
          <CampaignDuration
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </div>
        <div className="border-b py-4">
          <CampaignRegion
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            error={error}
          />
        </div>
      </div>
    </>
  );
};
export default RegionTargeting;
