import React from "react";
import EditAdForm from "./EditAdForm";
import EditChooseProductPanel from "./EditChooseProductPanel";
import EditBusinessZoneSelection from "./EditBusinessZoneSelection";

const EditCampaignFields = ({
  setCampaignData,
  campaignData,
  handleChange,
  setError,
  error,
  setValues,
  values,
}) => {
  return (
    <section>
      <div>
        <div className=" createnewcamp__campname">
          <h4 className=" createnewcamp-name">
            Campaign Name
            <span className="inline   createnewcamp-error">*</span>
          </h4>
          <input
            type="text"
            className="form-control"
            id="campaign_name"
            name="campaign_name"
            placeholder="Enter campaign name"
            onChange={handleChange}
            value={campaignData.campaign_name}
            disabled
          />
          {error.campaignName && (
            <p className="errorText">{error.campaignName}</p>
          )}
        </div>
        <div className="pt-2">
          <EditAdForm
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </div>
        {campaignData && campaignData?.platform ? (
          <div>
            <h2 className=" createnewcamp-product">Choose Products</h2>
            <p className=" createnewcamp--subheading ">
              Choose products by selecting the Brand and Category or uploading a
              CSV of products or both.
            </p>
            <div>
              <EditChooseProductPanel
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
                setValues={setValues}
                values={values}
                setError={setError}
                error={error}
              />
            </div>
          </div>
        ) : null}
      </div>
      {campaignData && campaignData?.platform ? (
        <div>
          <EditBusinessZoneSelection
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </div>
      ) : null}
    </section>
  );
};
export default React.memo(EditCampaignFields);
