import React from "react";
import BlockHeading from "../BlockHeading";
import ManualTargetingOptions from "./ManualTargetingOptions";
import Tooltip from "../Tooltip";

const ManualTargeting=({
  setCampaignData,
  campaignData,
  handleChange
})=>{

    return (
      <>
      <div className="border">
      <BlockHeading
          heading={"Manual Targeting"}
          subheading={" How to use keywords or products for manual targeting"}
        >
        <Tooltip/>
        </BlockHeading>
       
      </div>
      <ManualTargetingOptions
       setCampaignData={setCampaignData}
       campaignData={campaignData}
       handleChange={handleChange}
      />
       
      </>
    );
  };
export default ManualTargeting