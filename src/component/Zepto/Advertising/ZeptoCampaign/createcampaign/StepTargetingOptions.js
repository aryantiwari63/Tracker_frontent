import React from "react";
// import KeywordTargeting from "./targetoption/keywordtargeting/KeywordTargeting";
// import CategoryTargeting from "./targetoption/categorytargeting/CategoryTargeting";
// import Button from "../../../../common-components/button/Button";
// import TargetResult from "./targetoption/targetoptionresult";
// import Btn from "./button/Btn";
// import { useSelector } from "react-redux";
import KeywordTargetingLists from "./KeywordTargeingLists";

const StepTargetingOptions = ({
  setCampaignData,
  campaignData,
  handleChange,
  error,
}) => {
  return (
    <>
      <>
        <div className="text-xs py-2"></div>
        <KeywordTargetingLists
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
          error={error}
        />
        {/* <CategoryTargeting
            active={active}
            setActive={setActive}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            error={error}
            titleOption={titleOption}
            setTitleOption={setTitleOption}
            inputError={inputError}
            setInputError={setInputError}
          /> */}
      </>

      {/* <div className="col text-end px-2">
        <div className="pt-4">
          <Button
            title="Done"
            // disable={selectedKeywords.length ? false : true}
            blinkit
            click={() => {
              if (!campaignData?.targetingType) {
                setError({
                  ...error,
                  targetingType: "Please select at least one type of targeting",
                });
              } else if (
                campaignData?.targetingType === "Keyword Targeting" &&
                !campaignData?.keywords?.length
              ) {
                setError({
                  ...error,
                  keywords:
                    "Either select a keyword or deselect the keyword targeting",
                });
              } else if (
                campaignData?.targetingType === "Category Targeting" &&
                !campaignData?.categoryData?.length &&
                categoryList &&
                categoryList.length
              ) {
                setError({
                  ...error,
                  categoryData:
                    "Either select a category or deselect the category targeting",
                });
              } else if (
                campaignData?.targetingType &&
                campaignData?.categoryData?.length &&
                campaignData?.categoryData
                  .map((data) =>
                    Object.prototype.hasOwnProperty.call(data, "cpm")
                  )
                  .includes(false)
              ) {
                setError({
                  ...error,
                  categoryValue:
                    "Please enter a cpm values of selected category",
                });
              } else if (inputKeywordError.length) {
                setError({
                  ...error,
                  inputKeywordError: "Please fill correct keyword's cpm values",
                });
              } else if (inputSmartKeywordError.length) {
                setError({
                  ...error,
                  inputSmartKeywordError:
                    "Please fill correct keyword's smart cpm values",
                });
              } else if (
                campaignData?.targetingType &&
                campaignData?.keywords?.length &&
                campaignData?.keywords
                  .map((data) =>
                    Object.prototype.hasOwnProperty.call(data, "cpm")
                  )
                  .includes(false)
              ) {
                setError({
                  ...error,
                  keywordsValueError:
                    "Please enter a cpm values of selected keywords",
                });
                setInputKeywordCPMError(
                  "Please enter a cpm values of selected keywords"
                );
              } else if (
                campaignData?.targetingType &&
                campaignData?.keywords?.length &&
                campaignData?.active &&
                campaignData?.active.length &&
                campaignData?.keywords
                  .map((data) => data?.smartcpm)
                  ?.filter((n) => n)?.length != campaignData?.active?.length
              ) {
                setError({
                  ...error,
                  keywordsSmartValue:
                    "Please enter a smart cpm values of selected keywords",
                });
              } else if (!campaignData?.location) {
                setError({
                  ...error,
                  location: "Campaign Region is required.",
                });
              } else if (
                campaignData?.location === "cities" &&
                !campaignData?.cities?.length
              ) {
                setError({
                  ...error,
                  cities: "Select at least one city.",
                });
              } else {
                // setActive(active + 1);
              }
            }}
          />
        </div>
      </div> */}
    </>
  );
};

export default StepTargetingOptions;
