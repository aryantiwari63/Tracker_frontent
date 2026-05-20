import React from "react";
import BlockHeading from "../BlockHeading";
import ManualProductTargeting from "./ManualProductTargeting";
import Tooltip from "../Tooltip";
// import NegativeProductTargeting from "../negativeproducttargeting";
import NegativeManualProductTargeting from "./ManualProductTargeting/NegativeManualProductTargeting";

const ProductTargeting = () => {
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
      <div className="pb-4">
        <BlockHeading
          heading={"Product Targeting"}
          subheading={"How to product for targeting"}
        >
          <Tooltip />
        </BlockHeading>
        <ManualProductTargeting />
      </div>
      <div className="border">
        <NegativeManualProductTargeting />
      </div>
    </>
  );
};

export default ProductTargeting;
