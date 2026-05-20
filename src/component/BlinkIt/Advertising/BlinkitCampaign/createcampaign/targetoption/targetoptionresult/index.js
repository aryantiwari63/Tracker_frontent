import React from "react";

const TargetResult = ({ campaignData }) => {
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
      <div className=" text-sm pt-1">
        Negative Keyword -{" "}
        {campaignData?.NegativeKeyword
          ? campaignData?.NegativeKeyword?.map((data) => data.name).join(",")
          : ""}
      </div>
    </>
  );
};
export default TargetResult;
