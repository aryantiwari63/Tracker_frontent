import React, { useState } from "react";
import TargetingOptions from "../keywordtargeting/TargetingOptions";
import CategoryKeywordContentRecommendation from "./CategoryKeywordContentRecommendation";

const CategoryTargetingRecommendation = ({
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
          title="Select asset group"
          description="Choose the assets on which you would like to run recommendation booster ads"
          targetoption="Asset Listing"
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
            <CategoryKeywordContentRecommendation
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              error={error}
              inputError={inputError}
              setInputError={setInputError}
            />
          </>
        )}

        {error.assetData && <p className="errorText">{error.assetData}</p>}
        {error.inputError && <p className="errorText">{error.inputError}</p>}
      </div>
    </>
  );
};
export default CategoryTargetingRecommendation;
