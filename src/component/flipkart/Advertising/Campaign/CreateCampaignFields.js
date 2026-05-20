import React from "react";
import AdForm from "../../../common-components/ad-form/AdForm";
import ChooseProductPanel from "./ChooseProductPanel";
import BusinessZoneSelection from "./BusinessZoneSelection";
import ActionType from "../../../../redux/types";
import { useDispatch } from "react-redux";
import { trackCampaignCreationSteps } from "../../../../analytics/EventController";

const CreateCampaignFields = ({
  setCampaignData,
  campaignData,
  handleChange,
  setError,
  error,
  setValues,
  values,
}) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch({
      type: ActionType.GETPRODUCTS,
      payload: [],
    });
    dispatch({
      type: ActionType.GETCATEGORIES,
      payload: [],
    });
    trackCampaignCreationSteps("Product Selection")           // Tracking campaign creation steps
  }, []);
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
          />
          {error.campaignName && (
            <p className="errorText">{error.campaignName}</p>
          )}
        </div>
        <div className="pt-2">
          <AdForm
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
              <ChooseProductPanel
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
          <BusinessZoneSelection
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </div>
      ) : null}
    </section>
  );
};
export default React.memo(CreateCampaignFields);
