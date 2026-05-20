import React, { useState } from "react";
import TargetingOptions from "../keywordtargeting/TargetingOptions";
import CategoryKeywordBrandSuggestion from "./CategoryKeywordBrandSuggestion";

const CategoryTargetingKeywordBrandSuggestion = ({
  setCampaignData,
  campaignData,
  handleChange,
  error,
  titleOption,
  setTitleOption,
  inputError,
  setInputError,
}) => {
  const [keywordTargetingChecked, setKeywordTargetingChecked] = useState(true);

  return (
    <>
      <div className="border-t">
        <TargetingOptions
          title="Category Targeting"
          description="Select this for boosting your products on their category listings"
          targetoption="Category Listing"
          value={keywordTargetingChecked}
          setValue={setKeywordTargetingChecked}
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
          titleOption={titleOption}
          setTitleOption={setTitleOption}
        />
        {keywordTargetingChecked && (
          <>
            <CategoryKeywordBrandSuggestion
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              error={error}
              inputError={inputError}
              setInputError={setInputError}
            />
          </>
        )}
        {error.targetingType && (
          <p className="errorText">{error.targetingType}</p>
        )}
        {error.categoryData && (
          <p className="errorText">{error.categoryData}</p>
        )}
      </div>
    </>
  );
};
export default CategoryTargetingKeywordBrandSuggestion;
