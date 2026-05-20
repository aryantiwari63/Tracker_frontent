import React, { useState } from "react";
import TargetingOptions from "./TargetingOptions";
import TargetKeywordContent from "./TargetKeywordContent";
import KeywordSelection from "./KeywordSelection";
import NegativeKeywordTargeting from "./NegativeKeywordTargeting";

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
        <>
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

          <KeywordSelection
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            setKeywordData={setKeywordData}
            keywordData={keywordData}
          />
          <div className="py-5 px-2">
            <NegativeKeywordTargeting
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
            />
          </div>
        </>
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
