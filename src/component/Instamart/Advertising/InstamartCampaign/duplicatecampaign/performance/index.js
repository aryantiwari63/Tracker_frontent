import React from "react";
import PerformanceOption from "./PerformanceOption";
import NewStepCaption from "../NewStepCaption";

const Performance = ({
  campaignData,
  setCampaignData,
  handleChange,
  error,
}) => {
  return (
    <>
      <div className="py-4">
        <NewStepCaption
          caption=" Choose an ad asset"
          subcaption="These are the recommended ad formats based on your advertising objective."
        />
        <div className="col_4">
          <PerformanceOption
            // adasset={adasset}
            // setAdasset={setAdasset}
            title={"Product Booster"}
            campaignData={campaignData}
            setCampaignData={setCampaignData}
            handleChange={handleChange}
            error={error}
          />
        </div>
        {/* <NewCampSteps stepno={2} stepname="Campaign Details" active={active}>
        
         </NewCampSteps> */}
        {/* <CampaignDetails/> */}
      </div>
    </>
  );
};
export default Performance;
