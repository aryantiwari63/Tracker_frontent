import React, { useState } from "react";
import LeftKeywordTargetListPanel from "./LeftKeywordTargetListPanel";
import RightKeywordTargetListPanel from "./RightKeywordTargetListPanel";
// import EventBulkHandlerContext from "../../../../../../../context/eventBulkHandlerContext";
import BlockHeading from "../../BlockHeading";
// import { BiMessageSquareError } from "react-icons/bi";
// import { AiFillInfoCircle } from "react-icons/ai";
import Tooltip from "../../Tooltip";
import NegativeKeywordTargeting from "../../negativekeyword";
import ManualProductTargetingBulkContext from "../ManualProductTargeting/manualProductTargetingContext";

const KeywordTargetingLists = ({
  setCampaignData,
  campaignData,
  handleChange,
  formIndex,
  showAdgroup,
}) => {
  // const [showTooltip, setShowTooltip] = useState(false);
  // const [showHelp, setShowHelp] = useState(false);
  const [addedProducts, setAddedProducts] = useState([]);
  // const { selectedItems } = useContext(EventBulkHandlerContext);
  // const [activeTab, setActiveTab] = useState("suggested");
  const [duplicateKeyword, setDuplicateKeyword] = useState([]);
  const [existingNegativeKeyword, setExistingNegativeKeyword] = useState([]);
  const [newKeyword, setNewKeyword] = useState([]);
  const [addedKeywords, setAddedKeywords] = useState([]);

  // const handleTabClick = (tab) => {
  //   setActiveTab(tab);
  // };

  // const toggleTooltip = () => {
  //   setShowTooltip(!showTooltip);
  // };
  // const toggleHelp = () => {
  //   setShowHelp(!showHelp);
  // };
  return (
    <ManualProductTargetingBulkContext.Provider
      value={{ addedProducts, setAddedProducts }}
    >
      {!showAdgroup?.includes(formIndex) ? (
        <>
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
                formIndex={formIndex}
              />
            </div>
            <div className="col ">
              <RightKeywordTargetListPanel
                addedProducts={addedProducts}
                setAddedProducts={setAddedProducts}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                formIndex={formIndex}
                setDuplicateKeyword={setDuplicateKeyword}
                duplicateKeyword={duplicateKeyword}
                setNewKeyword={setNewKeyword}
                setExistingNegativeKeyword={setExistingNegativeKeyword}
                existingNegativeKeyword={existingNegativeKeyword}
                newKeyword={newKeyword}
              />
            </div>
          </div>
        </>
      ) : null}
      <div className="py-4">
        {" "}
        <NegativeKeywordTargeting
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
          formIndex={formIndex}
          addedProducts={addedProducts}
          setAddedProducts={setAddedProducts}
          setAddedKeywords={setAddedKeywords}
          addedKeywords={addedKeywords}
          showAdgroup={showAdgroup}
        />
      </div>
    </ManualProductTargetingBulkContext.Provider>
  );
};
export default KeywordTargetingLists;
