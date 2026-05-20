import React, { useState } from "react";
import BlockHeading from "../BlockHeading";
import { BiMessageSquareError } from "react-icons/bi";


const KeywordTargeting = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const [activeTab, setActiveTab] = useState("suggested");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  return (
    <>
    <div className="">
    <BlockHeading
        heading={"Keyword Targeting"}
        subheading={" How to choose keywords for targeting"}
      >
        <div
          className="tooltip-container"
          onMouseEnter={toggleTooltip}
          onMouseLeave={toggleTooltip}
        >
          <BiMessageSquareError className="h-4 pt-1 " />
          {showTooltip && (
            <span className="tooltip-text">
              Ad groups are a way to organize and manage ads within a campaign.
              <button className="tooltip- close" onClick={toggleTooltip}>
                X
              </button>
            </span>
          )}
        </div>
      </BlockHeading>
      <div className="row space-x-4 border-b pb-2 px-3 py-4">
          <button
            className={`tab-btn ${
              activeTab === "suggested" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("suggested")}
          >
            Suggested
          </button>
          <button
            className={`tab-btn ${
              activeTab === "enterlist" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("enterlist")}
          >
            Enter List
          </button>
          <button
            className={`tab-btn ${
              activeTab === "upload" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("upload")}
          >
            Upload file
          </button>
        </div>
        <div className="tab-content]">
          {/* {activeTab === "suggested" && < />}
          {activeTab === "enterlist" && </>} */}
          {/* {activeTab === "upload" && <UploadListProduct/>} */}
        </div>
      {/* <BidOptions/> */}
    </div>
     
     
    </>
  );
};

export default KeywordTargeting;
