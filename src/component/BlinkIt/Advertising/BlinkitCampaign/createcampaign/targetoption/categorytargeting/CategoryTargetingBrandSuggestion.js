import React from "react";
import CategoryKeywordContentBrandSuggestion from "./CategoryKeywordContentBrandSuggestion";

const CategoryTargetingBrandSuggestion = ({
  setCampaignData,
  campaignData,
  error,
}) => {
  return (
    <>
      <div className="border-t pt-2">
        <>
          <CategoryKeywordContentBrandSuggestion
            setCampaignData={setCampaignData}
            campaignData={campaignData}
          />
        </>

        {error.brandDetailsData && (
          <p className="errorText">{error.brandDetailsData}</p>
        )}
      </div>
    </>
  );
};
export default CategoryTargetingBrandSuggestion;
