import React from "react";
import BlockHeading from "../BlockHeading";
import ManualProductTargeting from "./ManualProductTargeting";
import Tooltip from "../Tooltip";
import NegativeManualProductTargeting from "./ManualProductTargeting/NegativeManualProductTargeting";


const ProductTargeting = () => {
  return (
    <>
    <div className="pb-4">
    <BlockHeading
        heading={"Product Targeting"}
        subheading={"How to product for targeting"}
      >
        <Tooltip/>
      </BlockHeading>
     <ManualProductTargeting/>
    </div>
    <div className="border"><NegativeManualProductTargeting/></div> 
     
     
    </>
  );
};

export default ProductTargeting;
