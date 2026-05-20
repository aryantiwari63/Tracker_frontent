import React from "react";
import Keywords from "./Keywords";
import SuggestedKeywords from "./SuggestedKeywords";

const KeywordSelection = ({
  selectedKeywords,
  setSelectedKeywords,
  campaignData,
  setKeywordData,
  keywordData,
}) => {
  return (
    <>
      <div className="flex pt-4 ">
        <div className=" ">
          <Keywords
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
          />
        </div>
        <div className="  keyword__leftcontainer">
          <SuggestedKeywords
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            campaignData={campaignData}
            setKeywordData={setKeywordData}
            keywordData={keywordData}
          />
        </div>
      </div>
    </>
  );
};
export default KeywordSelection;
