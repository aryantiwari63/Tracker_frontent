import React from "react";
// import { BiMessageSquareError } from "react-icons/bi";
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
  // const [selectedOption, setSelectedOption] = useState("");
  // const [showTooltip, setShowTooltip] = useState(false);
  // const [showHelp, setShowHelp] = useState(false);

  // const toggleTooltip = () => {
  //   setShowTooltip(!showTooltip);
  // };
  // const toggleHelp = () => {
  //   setShowHelp(!showHelp);
  // };

  // const handleOptionChange = (e) => {
  //   setSelectedOption(e.target.value);
  // };
  return (
    <>
      <div className="row border bg-white">
        <BlockHeading
          heading={"Campaign bidding strategy"}
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
