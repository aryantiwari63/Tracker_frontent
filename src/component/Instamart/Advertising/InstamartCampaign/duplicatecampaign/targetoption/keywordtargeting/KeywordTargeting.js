import React from "react";
import TargetKeywordContent from "./TargetKeywordContent";
import KeywordSelection from "./KeywordSelection";

const KeywordTargeting = ({
  selectedKeywords,
  setSelectedKeywords,
  setCampaignData,
  campaignData,
  handleChange,
  error,
  inputKeywordError,
  setInputKeywordError,
  inputSmartKeywordError,
  setInputSmartKeywordError,
  cpmError,
}) => {
  const [keywordData, setKeywordData] = React.useState([]);

  return (
    <>
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
      </>

      {cpmError && <p className="errorText">{cpmError}</p>}

      {error?.inputKeywordError && (
        <p className="errorText">{error?.inputKeywordError}</p>
      )}
    </>
  );
};
export default KeywordTargeting;
