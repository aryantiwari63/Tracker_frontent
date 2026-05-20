import React, { useState } from "react";
import TargetingOptions from "./TargetingOptions";
import SuggestedKeywordsBrandSuggestion from "./SuggestedKeywordsBrandSuggestion";
import TargetKeywordContentBrandSuggestion from "./TargetKeywordContentBrandSuggestion";
const KeywordTargetingBrandSuggestion = ({
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
          <div className="flex my-4 gap-4 ">
            <div className="flex flex-col flex-[0.5] gap-4">
              <div className="  keyword__leftcontainer">
                <SuggestedKeywordsBrandSuggestion
                  selectedKeywords={selectedKeywords}
                  setSelectedKeywords={setSelectedKeywords}
                  campaignData={campaignData}
                  setKeywordData={setKeywordData}
                  keywordData={keywordData}
                />
              </div>
            </div>

            <TargetKeywordContentBrandSuggestion
              selectedKeywords={selectedKeywords}
              setSelectedKeywords={setSelectedKeywords}
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              inputKeywordError={inputKeywordError}
              setInputKeywordError={setInputKeywordError}
              setKeywordData={setKeywordData}
              keywordData={keywordData}
            />
          </div>
        </div>
      )}
      {error.keywords && <p className="errorText">{error.keywords}</p>}
      {inputKeywordCPMError && (
        <p className="errorText">{inputKeywordCPMError}</p>
      )}
    </>
  );
};
export default KeywordTargetingBrandSuggestion;
