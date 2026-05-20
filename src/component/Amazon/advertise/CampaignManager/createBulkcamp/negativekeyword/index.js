import React, { useState } from "react";
import BlockHeading from "../BlockHeading";
import LeftNegativeKeywordPanel from "./LeftNegativeKeywordPanel";
import RightNegativeKeywordPanel from "./RightNegativeKeywordPanel";
import NegativeKeywordsBulkContext from "./negativeKeywordsContext";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import Tooltip from "../Tooltip";

const NegativeKeywordTargeting = ({
  setCampaignData,
  campaignData,
  handleChange,
  formIndex,
  addedProducts,
  setAddedProducts,
  setAddedKeywords,
  addedKeywords,
}) => {
  const [duplicateKeyword, setDuplicateKeyword] = useState([]);
  const [existingKeyword, setExistingKeyword] = useState([]);
  const [newKeyword, setNewKeyword] = useState([]);
  const [matchType, setMatchType] = useState("exact");
  const [showMore, setShowMore] = useState(true);
  return (
    <NegativeKeywordsBulkContext.Provider
      value={{ addedKeywords, setAddedKeywords, matchType, setMatchType }}
    >
      <div className="border">
        <BlockHeading
          moreicon={
            <button
              className="pr-3 pt-2"
              onClick={() => {
                setShowMore(!showMore);
              }}
            >
              {showMore ? <AiOutlineUp /> : <AiOutlineDown />}
            </button>
          }
          heading={"Negative Keyword Targeting"}
          subheading={"How to use negative keyword"}
        >
          <Tooltip />
          <label>Optional</label>
        </BlockHeading>
        {showMore && (
          <div className="row bg-white min-h-[32rem]">
            <LeftNegativeKeywordPanel
              campaignData={campaignData}
              setCampaignData={setCampaignData}
              addedProducts={addedProducts}
              setAddedProducts={setAddedProducts}
              setDuplicateNegativeKeyword={setDuplicateKeyword}
              duplicateNegativeKeyword={duplicateKeyword}
              setNewKeyword={setNewKeyword}
              newKeyword={newKeyword}
              setExistingKeyword={setExistingKeyword}
              existingKeyword={existingKeyword}
              formIndex={formIndex}
            />
            <RightNegativeKeywordPanel
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              setDuplicateKeyword={setDuplicateKeyword}
              duplicateKeyword={duplicateKeyword}
              setNewKeyword={setNewKeyword}
              newKeyword={newKeyword}
              setExistingKeyword={setExistingKeyword}
              existingKeyword={existingKeyword}
              formIndex={formIndex}
            />
          </div>
        )}
      </div>
    </NegativeKeywordsBulkContext.Provider>
  );
};

export default NegativeKeywordTargeting;
