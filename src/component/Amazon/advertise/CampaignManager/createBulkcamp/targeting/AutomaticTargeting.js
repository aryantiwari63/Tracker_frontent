import React from "react";
import BlockHeading from "../BlockHeading";
import BidOptions from "./BidOptions";
import Tooltip from "../Tooltip";
import NegativeProductTargeting from "../negativeproducttargeting";
import NegativeKeywordTargeting from "../negativekeyword";

const AutomaticTargeting = () => {

  return (
    <>
    <div className="border ">
    <BlockHeading
        heading={"Automatic Targeting"}
        subheading={" How to set bit pricing"}
      >
        <Tooltip/>
      </BlockHeading>
      <BidOptions/>
    </div>
    <div className="py-4"><NegativeKeywordTargeting/></div> 
    <div className="py-4"><NegativeProductTargeting/></div> 
     
     
    </>
  );
};

export default AutomaticTargeting;
