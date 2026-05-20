import React from "react";
import BlockHeading from "../BlockHeading";
// import { BiMessageSquareError } from "react-icons/bi";
import ManualTargetingOptions from "./ManualTargetingOptions";
import Tooltip from "../Tooltip";
// import NegativeKeywordTargeting from "../negativekeyword";
// import NegativeProductTargeting from "../negativeproducttargeting";

const ManualTargeting = ({
  setCampaignData,
  campaignData,
  handleChange,
  formIndex,
  showAdgroup,
}) => {
  // const [showTooltip, setShowTooltip] = useState(false);
  // const [showHelp, setShowHelp] = useState(false);

  // const toggleTooltip = () => {
  //   setShowTooltip(!showTooltip);
  // };
  // const toggleHelp = () => {
  //   setShowHelp(!showHelp);
  // };
  return (
    <>
      {!showAdgroup?.includes(formIndex) ? (
        <div className="border">
          <BlockHeading
            heading={"Manual Targeting"}
            subheading={" How to use keywords or products for manual targeting"}
          >
            <Tooltip />
          </BlockHeading>
        </div>
      ) : null}
      <ManualTargetingOptions
        setCampaignData={setCampaignData}
        campaignData={campaignData}
        handleChange={handleChange}
        formIndex={formIndex}
        showAdgroup={showAdgroup}
      />
    </>
  );
};
export default ManualTargeting;
