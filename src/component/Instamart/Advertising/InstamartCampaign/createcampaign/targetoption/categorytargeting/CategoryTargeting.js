import React, { useState } from "react";
import TargetingOptions from "../keywordtargeting/TargetingOptions";
import CategoryKeywordContent from "./CategoryKeywordContent";
// import AddKeywordCategory from "./AddKeywordCategory";
import CampaignDuration from "./CampaignDuration";
import CampaignRegion from "./CampaignRegion";

const CategoryTargeting = ({
  setCampaignData,
  campaignData,
  handleChange,
  error,
  titleOption,
  setTitleOption,
  inputError,
  setInputError,
}) => {
  const [keywordTargetingChecked, setKeywordTargetingChecked] = useState(false);

  return (
    <>
      <div className="border-t">
        <TargetingOptions
          title="Category Targeting"
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
            <CategoryKeywordContent
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              error={error}
              inputError={inputError}
              setInputError={setInputError}
            />
            {/* <AddKeywordCategory /> */}
          </>
        )}
        {error.targetingType && (
          <p className="errorText">{error.targetingType}</p>
        )}
        {error.categoryData && (
          <p className="errorText">{error.categoryData}</p>
        )}
        <div className="border-b py-4">
          <CampaignDuration
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </div>
        <div className="border-b py-4">
          <CampaignRegion
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            error={error}
          />
        </div>
      </div>
    </>
  );
};
export default CategoryTargeting;
