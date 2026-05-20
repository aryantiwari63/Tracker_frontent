import React, { useState } from "react";
import LeftKeywordTargetListPanel from "./LeftKeywordTargetListPanel";
import RightKeywordTargetListPanel from "./RightKeywordTargetListPanel";
import BlockHeading from "../../BlockHeading";
import Tooltip from "../../Tooltip";
import NegativeKeywordTargeting from "../../negativekeyword";
import ManualProductTargetingContext from "../ManualProductTargeting/manualProductTargetingContext";

const KeywordTargetingLists = ({
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [addedProducts, setAddedProducts] = useState([]);
  const [duplicateKeyword, setDuplicateKeyword] = useState([]);
  const [existingNegativeKeyword, setExistingNegativeKeyword] = useState([]);
  const [newKeyword, setNewKeyword] = useState([]);
  const [addedKeywords, setAddedKeywords] = useState([]);

  return (
    <ManualProductTargetingContext.Provider
      value={{ addedProducts, setAddedProducts }}
    >
      <div className="row border">
        <BlockHeading
          heading={"Keyword Targeting"}
          subheading={" How to choose keywords for targeting"}
        >
          <Tooltip />
        </BlockHeading>
        <div className="col_6 border-r">
          <LeftKeywordTargetListPanel
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            addedProducts={addedProducts}
            setAddedProducts={setAddedProducts}
            handleChange={handleChange}
            setDuplicateKeyword={setDuplicateKeyword}
            duplicateKeyword={duplicateKeyword}
            setNewKeyword={setNewKeyword}
            newKeyword={newKeyword}
            setExistingNegativeKeyword={setExistingNegativeKeyword}
            existingNegativeKeyword={existingNegativeKeyword}
            setAddedKeywords={setAddedKeywords}
            addedKeywords={addedKeywords}
          />
        </div>
        <div className="col ">
          <RightKeywordTargetListPanel
            addedProducts={addedProducts}
            setAddedProducts={setAddedProducts}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            setDuplicateKeyword={setDuplicateKeyword}
            duplicateKeyword={duplicateKeyword}
            setNewKeyword={setNewKeyword}
            setExistingNegativeKeyword={setExistingNegativeKeyword}
            existingNegativeKeyword={existingNegativeKeyword}
            newKeyword={newKeyword}
          />
        </div>
      </div>
      <div className="py-4">
        {" "}
        <NegativeKeywordTargeting
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
          addedProducts={addedProducts}
          setAddedProducts={setAddedProducts}
          setAddedKeywords={setAddedKeywords}
          addedKeywords={addedKeywords}
        />
      </div>
    </ManualProductTargetingContext.Provider>
  );
};
export default KeywordTargetingLists;
