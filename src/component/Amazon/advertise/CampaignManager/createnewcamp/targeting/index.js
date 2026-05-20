import React, { useState } from "react";
import ManualTargeting from "./ManualTargeting";
import {AiOutlineInfoCircle } from "react-icons/ai";
import BlockHeading from "../BlockHeading";

const TargetingOptions = ({
  setCampaignData,
         campaignData,
         handleChange
}) => {
  const [selectedOption, setSelectedOption] = useState("manual");
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };


  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  React.useEffect(()=>{
    setCampaignData({
      ...campaignData,
      target:"manual"
    })

  },[])
  React.useEffect(()=>{
    setCampaignData({
      ...campaignData,
      target:selectedOption
    })

  },[selectedOption])


  return (
    <div className=" rounded-lg">
      <div className="row border">
        <BlockHeading
          heading={"Targeting"}
          subheading={"How to choose a targeting strategy"}
        >
          <div
            className="tooltip-container"
            onMouseEnter={toggleTooltip}
            onMouseLeave={toggleTooltip}
          >
            <AiOutlineInfoCircle className="h-4 pt-1" />
            {showTooltip && (
              <span className="tooltip-text">
                Ad groups are a way to organize and manage ads within a
                campaign.
                <button className="tooltip-close" onClick={toggleTooltip}>
                  X
                </button>
              </span>
            )}
          </div>
        </BlockHeading>
      </div>

      <div className=" px-3 py-4  bg-white border mb-3">
      {/* <div>
        <label>
          <input
            type="radio"
            value="automatic"
            checked={selectedOption === "automatic"}
            onChange={handleOptionChange}
          />
          Automatic Targeting
          <div className="px-3">Amazon will target keywords and products that are similar to the product in your ad.</div>
        </label>
      </div> */}
      <div className="pt-1">
        <label>
          <input
            type="radio"
            value="manual"
            name="selectedOption"
            checked={selectedOption === "manual"}
            onChange={handleOptionChange}
          />
          Manual Targeting
          <div className="px-3">Choose keywords or products to target shopper searches and set custom bid.</div>
        </label>
      </div>
     
     
    </div>
    {/* <div className="">
      {selectedOption === "automatic" ? (
        <AutomaticTargeting />
      ) : selectedOption === "manual" ? (
        <ManualTargeting />
      ) : null}
    </div> */}
     <div className="">
      {selectedOption === "manual" ? (
        <ManualTargeting 
        setCampaignData={setCampaignData}
        campaignData={campaignData}
        handleChange={handleChange}
        />
      ) : null}
    </div>
    </div>
    
  );
};

export default TargetingOptions;
