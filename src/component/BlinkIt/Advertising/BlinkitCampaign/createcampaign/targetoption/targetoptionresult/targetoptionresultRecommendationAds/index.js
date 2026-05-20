import React from "react";

const TargetoptionresultRecommendationAds = ({ campaignData }) => {
  return (
    <>
      <div className=" text-sm pt-1">
        Assets -{" "}
        {campaignData?.assetData
          ? campaignData?.assetData?.map((data) => data.asset).join(",")
          : ""}
      </div>
    </>
  );
};
export default TargetoptionresultRecommendationAds;
