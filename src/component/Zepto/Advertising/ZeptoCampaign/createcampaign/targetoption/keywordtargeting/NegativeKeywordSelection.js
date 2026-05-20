import React from "react";
// import Keywords from "./Keywords";
// import TargetKeywordContent from "./TargetKeywordContent";
import NegativeKeywords from "./NegativeKeywords";
import NegativeTargetKeywordContent from "./NegativeTargetKeywordContent";

const NegativeKeywordSelection = ({
  campaignData,
  setCampaignData,
  setNegativeKeywordData,
  negativeKeywordData,
  setSelectedNegativeKeywords,
  selectedNegativeKeywords,
}) => {
  return (
    <>
      <div className="row pt-4 ">
        <div className="col_4 px-4  ">
          <NegativeKeywords
            selectedKeywords={selectedNegativeKeywords}
            setSelectedKeywords={setSelectedNegativeKeywords}
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
          <NegativeTargetKeywordContent
            selectedKeywords={selectedNegativeKeywords}
            setSelectedKeywords={setSelectedNegativeKeywords}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            setKeywordData={setNegativeKeywordData}
            keywordData={negativeKeywordData}
          />
        </div>
      </div>
    </>
  );
};
export default NegativeKeywordSelection;
