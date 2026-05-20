import React from "react";

const TargetResultSpotLight = ({ campaignData }) => {
  return (
    <>
      <div className=" text-sm pt-1">
        Keywords -{" "}
        {campaignData?.keywords
          ? campaignData?.keywords?.map((data) => data.keyword).join(",")
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
export default TargetResultSpotLight;
