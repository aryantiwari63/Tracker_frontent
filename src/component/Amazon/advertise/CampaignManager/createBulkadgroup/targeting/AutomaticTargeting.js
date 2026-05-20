import React from "react";
import BlockHeading from "../BlockHeading";
import BidOptions from "./BidOptions";
// import { AiOutlineInfoCircle } from "react-icons/ai";
import Tooltip from "../Tooltip";
import NegativeProductTargeting from "../negativeproducttargeting";
import NegativeKeywordTargeting from "../negativekeyword";

const AutomaticTargeting = () => {
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
      <div className="border ">
        <BlockHeading
          heading={"Automatic Targeting"}
          subheading={" How to set bit pricing"}
        >
          <Tooltip />
        </BlockHeading>
        <BidOptions />
      </div>
      <div className="py-4">
        <NegativeKeywordTargeting />
      </div>
      <div className="py-4">
        <NegativeProductTargeting />
      </div>
    </>
  );
};

export default AutomaticTargeting;
