import React from "react";

const CampaignNameStep = ({ campaignData, handleChange, error }) => {
  return (
    <>
      <div className="border-b pb-3">
        <div className="row pt-4">
          <input
            type="text"
            className="form-control"
            id="campaign_name"
            name="campaign_name"
            placeholder="Enter campaign name"
            onChange={handleChange}
            value={campaignData.campaign_name}
          />
          {error.campaign_name && (
            <p className="errorText">{error.campaign_name}</p>
          )}
        </div>
      </div>
    </>
  );
};
export default CampaignNameStep;
