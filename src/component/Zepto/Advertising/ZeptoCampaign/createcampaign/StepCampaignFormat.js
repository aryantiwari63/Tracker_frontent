import React from "react";
import NewStepCaption from "./NewStepCaption";
import CardAdvertise from "./CardAdvertise";
import Performance from "./performance";
// import Button from "../../../../common-components/button/Button";
// import Btn from "./button/Btn";

const StepCampaignFormat = ({
  // active,
  // setActive,
  setCampaignData,
  campaignData,
  handleChange,
  error,
}) => {
  return (
    <>
      <>
        <NewStepCaption caption="  What's your campaign type?" subcaption="" />
        <div className="row border-b">
          <CardAdvertise
            title="Awareness"
            caption="Click to make awareness campaign"
            // value={advertiseObject}
            // setValue={setAdvertiseObject}
            campaignData={campaignData}
            setCampaignData={setCampaignData}
            handleChange={handleChange}
            error={error}
          />
          <CardAdvertise
            title="Performance"
            caption="Click to make performance campaign"
            // value={advertiseObject}
            // setValue={setAdvertiseObject}
            campaignData={campaignData}
            setCampaignData={setCampaignData}
            handleChange={handleChange}
            error={error}
          />
        </div>

        <Performance
          // adasset={adasset}
          // setAdasset={setAdasset}
          campaignData={campaignData}
          setCampaignData={setCampaignData}
          handleChange={handleChange}
          error={error}
        />

        {/* 
        <div className="row pt-4 border-t ">
          <Button
            title="Done"
            blinkit
            type="button"
            // disable={
            //   campaignData?.campaign_type === "" ||
            //   campaignData?.product_booster === ""
            // }
            click={() => {
              if (!campaignData.campaign_type) {
                setError({
                  ...error,
                  campaign_type: "Please select an campaign type.",
                });
              } else if (!campaignData.campaign_name) {
                setError({
                  ...error,
                  product_booster: "Please select an campaign name.",
                });
              } else if (!campaignData.campaign_budget) {
                setError({
                  ...error,
                  product_booster: "Please select an campaign budget.",
                });
              } else {
                // setActive(active + 1);
              }
            }}
          />
        </div> */}
      </>
    </>
  );
};

export default StepCampaignFormat;
