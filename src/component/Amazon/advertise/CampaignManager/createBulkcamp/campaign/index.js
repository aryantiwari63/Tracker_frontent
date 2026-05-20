import React, { useState } from "react";
import BlockHeading from "../BlockHeading";
import CampaignBiddingOptions from "./CampaignBidOptions";
import AdjustBids from "./AdjustBids";
import Tooltip from "../Tooltip";

const CampaignBidding = ({
  setCampaignData,
  campaignData,
  handleChange,
  formIndex,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <>
      <div className="row border bg-white">
        <BlockHeading
          heading={"Campaign bidding strat"}
          subheading={"How to set your bidding startegy"}
        >
          <Tooltip />
        </BlockHeading>
        <div className="px-4 py-2">
          <CampaignBiddingOptions
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            formIndex={formIndex}
          />
          <AdjustBids
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            formIndex={formIndex}
          />
        </div>
      </div>
    </>
  );
};

export default CampaignBidding;
