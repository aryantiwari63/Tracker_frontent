import React from "react";
// import AddKeywordCategory from "./AddKeywordCategory";
import CampaignDuration from "./CampaignDuration";
import CampaignRegion from "./CampaignRegion";

const RegionTargeting = ({
  setCampaignData,
  campaignData,
  handleChange,
  selected,
  setSelected,
  selectedTime,
  setSelectedTime,
  // error,
}) => {
  return (
    <>
      <div className="border-t">
        <div className="border-b py-4">
          <CampaignDuration
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            selected={selected}
            setSelected={setSelected}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        </div>
        <div className="border-b py-4">
          <CampaignRegion
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            // error={error}
          />
        </div>
      </div>
    </>
  );
};
export default RegionTargeting;
