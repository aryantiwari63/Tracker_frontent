import React from "react";
import Keywords from "./Keywords";
import TargetKeywordContent from "./TargetKeywordContent";

const KeywordSelection = ({
  selectedKeywords,
  setSelectedKeywords,
  campaignData,
  setKeywordData,
  keywordData,
  setCampaignData,
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
          {/* <SuggestedKeywords
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            campaignData={campaignData}
            setKeywordData={setKeywordData}
            keywordData={keywordData}
          /> */}
          <TargetKeywordContent
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            setCampaignData={setCampaignData}
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
