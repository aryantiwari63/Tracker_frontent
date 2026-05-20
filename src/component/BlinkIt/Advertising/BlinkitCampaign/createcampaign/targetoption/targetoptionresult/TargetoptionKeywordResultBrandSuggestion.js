import React from "react";

const TargetoptionKeywordResultBrandSuggestion = ({ campaignData }) => {
  return (
    <>
      <div className=" text-sm pt-1">
        Keywords -{" "}
        {campaignData?.keywords
          ? campaignData?.keywords?.map((data) => data.keyword).join(",")
          : ""}
      </div>
      <div className=" text-sm pt-1">
        Category -{" "}
        {campaignData?.categoryData
          ? campaignData?.categoryData?.map((data) => data.keyword).join(",")
          : ""}
      </div>
    </>
  );
};
export default TargetoptionKeywordResultBrandSuggestion;
