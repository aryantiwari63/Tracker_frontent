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
      <div className="row pt-4 ">
        <div className="col_4 px-4  ">
          <Keywords
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
          />
        </div>
        <div className="col_8  keyword__leftcontainer">
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
