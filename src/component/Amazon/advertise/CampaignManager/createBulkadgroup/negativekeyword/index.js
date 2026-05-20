import React, { useState } from "react";
import BlockHeading from "../BlockHeading";
import LeftNegativeKeywordPanel from "./LeftNegativeKeywordPanel";
import RightNegativeKeywordPanel from "./RightNegativeKeywordPanel";
// import { BiMessageSquareError } from "react-icons/bi";
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
  showAdgroup,
  setAddedKeywords,
  addedKeywords,
}) => {
  // const [showTooltip, setShowTooltip] = useState(false);
  // const [showHelp, setShowHelp] = useState(false);
  // const toggleTooltip = () => {
  //   setShowTooltip(!showTooltip);
  // };
  // const toggleHelp = () => {
  //   setShowHelp(!showHelp);
  // };
  // const [addedKeywords, setAddedKeywords] = useState([]);
  const [duplicateKeyword, setDuplicateKeyword] = useState([]);
  const [existingKeyword, setExistingKeyword] = useState([]);
  const [newKeyword, setNewKeyword] = useState([]);
  const [matchType, setMatchType] = useState("exact");
  const [showMore, setShowMore] = useState(true);
  // const [showless, setShowLess] = useState();
  return (
    <NegativeKeywordsBulkContext.Provider
      value={{ addedKeywords, setAddedKeywords, matchType, setMatchType }}
    >
      {!showAdgroup?.includes(formIndex) ? (
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
      ) : null}
    </NegativeKeywordsBulkContext.Provider>
  );
};

export default NegativeKeywordTargeting;
