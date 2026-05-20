import React from "react";
import NewStepCaption from "./NewStepCaption";
import CardAdvertise from "./CardAdvertise";
// import Performance from "./performance";
import Button from "../../../../common-components/button/Button";
import Btn from "./button/Btn";

const StepCampaignFormat = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [error, setError] = React.useState({
    campaign_type: "",
    campaign_name: "",
  });
  React.useEffect(() => {
    setError({
      ...error,
      campaign_type: "",
    });
  }, [campaignData.campaign_type]);
  React.useEffect(() => {
    setError({
      ...error,
      campaign_name: "",
    });
  }, [campaignData.campaign_name]);

  return (
    <>
      {active === 1 ? (
        <>
          <NewStepCaption
            caption="Add a campaign name"
            subcaption="Add a title to your campaign for easy reference"
          />

          <div className="flex flex-col my-2">
            <input
              type="text"
              className="form-control-blinkit outline-green-600 !mb-1"
              id="campaign_name"
              name="campaign_name"
              placeholder="Enter campaign name"
              onChange={handleChange}
              value={campaignData.campaign_name}
            />
            {error.campaign_name && (
              <p className="errorText text-xs">{error.campaign_name}</p>
            )}
          </div>

          <div className="text-md font-semibold pt-2">Select the Ad asset</div>
          <div className="text-xs pb-2 pt-1">
            These are recommended ad assets based on your advertising objective
          </div>
          <div className="row border-b mt-2">
            <CardAdvertise
              title="Product Booster"
              caption="Boost your product's search and category listing performance"
              campaignData={campaignData}
              setCampaignData={setCampaignData}
              handleChange={handleChange}
              error={error}
              disabled={false}
              image={"/assets/images/blinkitproductbooster.svg"}
            />
            <CardAdvertise
              title="Listing Spotlight"
              caption="Enhance brand visibility and acquire new customers"
              campaignData={campaignData}
              setCampaignData={setCampaignData}
              handleChange={handleChange}
              error={error}
              disabled={false}
              image={"/assets/images/blinkitlistingspotlight.svg"}
            />
            <CardAdvertise
              title="Recommendation Ads"
              caption="Boost your product's performance in recommendations engines"
              campaignData={campaignData}
              setCampaignData={setCampaignData}
              handleChange={handleChange}
              error={error}
              disabled={false}
              image={"/assets/images/blinkitrecommendationads.svg"}
            />
            <CardAdvertise
              title="Brand Booster"
              caption="Enhance your brands visibility on search and category listings"
              campaignData={campaignData}
              setCampaignData={setCampaignData}
              handleChange={handleChange}
              error={error}
              disabled={false}
              image={"/assets/images/blinkitbrandbooster.svg"}
              isNew={true}
            />
          </div>
          {error.campaign_type && (
            <p className="errorText">{error.campaign_type}</p>
          )}

          <div className="row pt-4 border-t ">
            <Button
              title="Done"
              platform={"blinkit"}
              blinkit
              type="button"
              click={() => {
                if (!campaignData.campaign_name) {
                  setError({
                    ...error,
                    campaign_name: "Campaign name can not be empty.",
                  });
                } else if (!campaignData.campaign_type) {
                  setError({
                    ...error,
                    campaign_type: "Please select asset type.",
                  });
                } else {
                  setActive(2);
                  setCampaignData({
                    campaign_name: campaignData.campaign_name,
                    campaign_type: campaignData.campaign_type,
                    start_duration: new Date().toISOString().slice(0, -14),
                    no_end_date: "1",
                  });
                }
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="row pt-2 px-1">
            <div className="col_4 ">
              <p className="text-[11px] text-gray-600 font-semibold">
                Campaign name
              </p>
              <p className="font-semibold text-base">
                {campaignData?.campaign_name}
              </p>
            </div>
            <div className="col_4">
              <p className="text-[11px] text-gray-600 font-semibold">
                Ad asset
              </p>
              <p className="font-semibold text-base">
                {campaignData?.campaign_type}
              </p>
            </div>
            <div className="col_4 text-end ">
              <Btn
                title="Edit"
                onClick={() => {
                  setActive(1);
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StepCampaignFormat;
