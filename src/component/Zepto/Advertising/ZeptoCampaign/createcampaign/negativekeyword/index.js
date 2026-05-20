import React, { useState } from "react";
import BlockHeading from "../BlockHeading";
import LeftNegativeKeywordPanel from "./LeftNegativeKeywordPanel";
import RightNegativeKeywordPanel from "./RightNegativeKeywordPanel";
import NegativeKeywordsContext from "./negativeKeywordsContext";
// import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
// import Tooltip from "../Tooltip";

const NegativeKeywordTargeting = ({
  setCampaignData,
  campaignData,
  handleChange,
  addedProducts,
  setAddedProducts,
  setAddedKeywords,
  addedKeywords,
  error,
}) => {
  // const [addedKeywords, setAddedKeywords] = useState([]);
  // const [matchType, setMatchType] = useState("exact");
  // const [showMore, setShowMore] = useState(true);
  // const [showless, setShowLess] = useState();
  const [duplicateKeyword, setDuplicateKeyword] = useState([]);
  const [existingKeyword, setExistingKeyword] = useState([]);
  const [newKeyword, setNewKeyword] = useState([]);
  const [matchType, setMatchType] = useState("EXACT");
  // const [showMore, setShowMore] = useState(true);
  return (
    <NegativeKeywordsContext.Provider
      value={{ addedKeywords, setAddedKeywords, matchType, setMatchType }}
    >
      <div className="border">
        <BlockHeading
          // moreicon={
          //   <button
          //     className="pr-3 pt-2"
          //     onClick={() => {
          //       setShowMore(!showMore);
          //     }}
          //   >
          //     {showMore ? <AiOutlineUp /> : <AiOutlineDown />}
          //   </button>
          // }
          heading={"Negative Keyword Targeting"}
          subheading={""}
        >
          {/* <Tooltip /> */}
          {/* <label>Optional</label> */}
        </BlockHeading>

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
            error={error}
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
          />
        </div>
      </div>
    </NegativeKeywordsContext.Provider>
  );
};

export default NegativeKeywordTargeting;
