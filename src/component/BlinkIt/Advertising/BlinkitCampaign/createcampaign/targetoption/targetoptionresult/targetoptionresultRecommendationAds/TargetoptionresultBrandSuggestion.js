import React from "react";

const TargetoptionresultBrandSuggestion = ({ campaignData }) => {
  return (
    <>
      <div className=" text-sm pt-1">
        Brands -{" "}
        {campaignData?.brandDetailsData
          ? campaignData?.brandDetailsData
              ?.map((data) => data.brand_name)
              .join(",")
          : ""}
      </div>
    </>
  );
};
export default TargetoptionresultBrandSuggestion;
