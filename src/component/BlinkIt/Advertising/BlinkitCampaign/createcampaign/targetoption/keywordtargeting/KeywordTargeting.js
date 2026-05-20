import React, { useState } from "react";
import TargetingOptions from "./TargetingOptions";
import TargetKeywordContent from "./TargetKeywordContent";
// import KeywordSelection from "./KeywordSelection";
import NegativeKeywordTargeting from "./NegativeKeywordTargeting";
import SuggestedKeywords from "./SuggestedKeywords";
import Keywords from "./Keywords";

const KeywordTargeting = ({
  selectedKeywords,
  setSelectedKeywords,
  setCampaignData,
  campaignData,
  handleChange,
  error,
  titleOption,
  setTitleOption,
  inputKeywordError,
  setInputKeywordError,
  inputSmartKeywordError,
  setInputSmartKeywordError,
  inputKeywordCPMError,
}) => {
  const [keywordTargetingChecked, setKeywordTargetingChecked] = useState(true);
  const [keywordData, setKeywordData] = React.useState([]);

  return (
    <>
      <TargetingOptions
        title="Keyword Targeting"
        description="Select this for boosting your products on search keywords"
        targetoption="Search Listing"
        value={keywordTargetingChecked}
        setValue={setKeywordTargetingChecked}
        setCampaignData={setCampaignData}
        campaignData={campaignData}
        handleChange={handleChange}
        titleOption={titleOption}
        setTitleOption={setTitleOption}
      />
      {keywordTargetingChecked && (
        <div>
          <div className="flex mt-4 gap-4 ">
            <div className="flex flex-col flex-[0.45] gap-4">
              <div className="  keyword__leftcontainer">
                <SuggestedKeywords
                  selectedKeywords={selectedKeywords}
                  setSelectedKeywords={setSelectedKeywords}
                  campaignData={campaignData}
                  setKeywordData={setKeywordData}
                  keywordData={keywordData}
                />
              </div>
              <div className=" ">
                <Keywords
                  selectedKeywords={selectedKeywords}
                  setSelectedKeywords={setSelectedKeywords}
                />
              </div>
            </div>

            <TargetKeywordContent
              selectedKeywords={selectedKeywords}
              setSelectedKeywords={setSelectedKeywords}
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              inputKeywordError={inputKeywordError}
              setInputKeywordError={setInputKeywordError}
              inputSmartKeywordError={inputSmartKeywordError}
              setInputSmartKeywordError={setInputSmartKeywordError}
              setKeywordData={setKeywordData}
              keywordData={keywordData}
            />
          </div>
          <div className="py-5 px-2">
            <NegativeKeywordTargeting
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
            />
          </div>
        </div>
      )}
      {error.keywords && <p className="errorText">{error.keywords}</p>}
      {inputKeywordCPMError && (
        <p className="errorText">{inputKeywordCPMError}</p>
      )}
      {error.keywordsSmartValue && (
        <p className="errorText">{error.keywordsSmartValue}</p>
      )}
    </>
  );
};
export default KeywordTargeting;
