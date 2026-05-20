import React, { useState } from "react";
// import BlockHeading from "../BlockHeading";
// import BidOptions from "./BidOptions";
// import EventHandlerContext from "../../../../../../context/eventHAndlerContext";
import EnterListKeywordTarget from "./EnterListKeywordTarget";
// import LeftKeywordTargetListPanel from "./KeywordTargeingLists/LeftKeywordTargetListPanel";
// import RightKeywordTargetListPanel from "./KeywordTargeingLists/RightKeywordTargetListPanel";

const LeftKeywordTargetListPanel = ({
  setCampaignData,
  campaignData,
  handleChange,
  addedProducts,
  setAddedProducts,
  setDuplicateKeyword,
  duplicateKeyword,

  setNewKeyword,
  newKeyword,
  setExistingNegativeKeyword,
  existingNegativeKeyword,
  setAddedKeywords,
  addedKeywords,
  error,
}) => {
  const [activeTab, setActiveTab] = useState("enterlist");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="bg-white">
        <div className="row space-x-4 border pb-2 px-3 py-4">
          {/* <button
            className={`tab-btn ${
              activeTab === "suggested" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("suggested")}
          >
            Suggested
          </button> */}
          <button
            className={`tab-btn ${
              activeTab === "enterlist" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("enterlist")}
          >
            Enter List
          </button>
          {/* <button
            className={`tab-btn ${
              activeTab === "upload" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("upload")}
          >
            Upload file
          </button> */}
        </div>
        <div className="tab-content min-h-[32rem] border">
          {
            {
              // suggested:< SuggestedBid/>,
              enterlist: (
                <EnterListKeywordTarget
                  setCampaignData={setCampaignData}
                  campaignData={campaignData}
                  handleChange={handleChange}
                  addedProducts={addedProducts}
                  setAddedProducts={setAddedProducts}
                  setDuplicateKeyword={setDuplicateKeyword}
                  duplicateKeyword={duplicateKeyword}
                  setNewKeyword={setNewKeyword}
                  newKeyword={newKeyword}
                  setExistingNegativeKeyword={setExistingNegativeKeyword}
                  existingNegativeKeyword={existingNegativeKeyword}
                  setAddedKeywords={setAddedKeywords}
                  addedKeywords={addedKeywords}
                  error={error}
                />
              ),
              // upload:<UploadListKeywordTarget/>
            }[activeTab]
          }
          {/* {activeTab === "suggested" && < SuggestedBid/>}
          {activeTab === "enterlist" && <EnterListKeywordTarget/>}
          {activeTab === "upload" && <UploadListKeywordTarget/>} */}
        </div>
        {/* <BidOptions/> */}
      </div>
    </>
  );
};

export default LeftKeywordTargetListPanel;
