import React, { useState } from "react";
import Button from "../../../../common-components/button/Button";
import Btn from "./button/Btn";
import TargetoptionKeywordResultBrandSuggestion from "./targetoption/targetoptionresult/TargetoptionKeywordResultBrandSuggestion";
import KeywordTargetingBrandSuggestion from "./targetoption/keywordtargeting/KeywordTargetingBrandSuggestion";
import CategoryTargetingKeywordBrandSuggestion from "./targetoption/categorytargeting/CategoryTargetingKeywordBrandSuggestion";
// import { useSelector } from "react-redux";

const StepTargetingKeywordOptionsBrandSuggestion = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [inputError, setInputError] = React.useState([]);
  const [inputKeywordError, setInputKeywordError] = React.useState([]);

  const [error, setError] = React.useState({
    targetingType: "",
    categoryData: "",
    keywords: "",
    keywordsValueError: "",
    keywordsCpmChange: 1,
  });

  React.useEffect(() => {
    setError({
      ...error,
      targetingType: "",
    });
  }, [campaignData.targetingType]);
  React.useEffect(() => {
    setError({
      ...error,
      categoryData: "",
    });
  }, [campaignData.categoryData]);
  React.useEffect(() => {
    setError({
      ...error,
      categoryValue: "",
    });
  }, [campaignData.categoryData]);
  React.useEffect(() => {
    setError({
      ...error,
      keywords: "",
    });
  }, [campaignData.keywords]);
  React.useEffect(() => {
    setError({
      ...error,
      keywordsValueError: "",
    });
    // console.log("campaignData debug");
  }, [campaignData.keywordsCpmChange]);
  React.useEffect(() => {
    setError({
      ...error,
      keywordsSmartValue: "",
    });
  }, [campaignData.keywords]);
  React.useEffect(() => {
    setError({
      ...error,
      inputError: "",
    });
  }, [inputError.length]);
  React.useEffect(() => {
    setError({
      ...error,
      inputKeywordError: "",
    });
  }, [inputKeywordError.length]);

  React.useEffect(() => {
    // console.log("campaignData errorerror", error);
  }, [error]);
  const [titleOption, setTitleOption] = React.useState([]);
  // React.useEffect(() => {
  //   setCampaignData({
  //     ...campaignData,
  //     titleOption: titleOption,
  //   });
  // }, [titleOption]);
  React.useEffect(() => {
    let targetingtype =
      campaignData?.keywords?.length && campaignData.categoryData?.length
        ? ["Keyword Targeting", "Category Targeting"]
        : campaignData?.keywords?.length
        ? ["Keyword Targeting"]
        : campaignData?.categoryData?.length
        ? ["Category Targeting"]
        : null;
    // eslint-disable-next-line no-console
    // console.log("campaignData targetingtype", targetingtype);
    setCampaignData({
      ...campaignData,
      titleOption: targetingtype,
    });
  }, [campaignData?.keywords, campaignData?.categoryData]);
  // const { categoryList } = useSelector(
  //   (state) => state?.BlinkitCreateCampaignReducer
  // );

  return (
    <>
      {active > 4 ? (
        <TargetoptionKeywordResultBrandSuggestion campaignData={campaignData} />
      ) : (
        <>
          <div className="text-xs py-2">
            {" "}
            You can select multiple targeting options to boost your product
            across the platform.
          </div>
          <KeywordTargetingBrandSuggestion
            selectedKeywords={selectedKeywords}
            setSelectedKeywords={setSelectedKeywords}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            error={error}
            titleOption={titleOption}
            setTitleOption={setTitleOption}
            inputKeywordError={inputKeywordError}
            setInputKeywordError={setInputKeywordError}
          />
          <CategoryTargetingKeywordBrandSuggestion
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
          />
        </>
      )}
      <div className="col text-end px-2">
        {active > 4 ? (
          <Btn
            title="Edit"
            onClick={() => {
              setActive(4);
            }}
          />
        ) : (
          <div className="pt-4">
            <Button
              title="Done"
              platform={"blinkit"}
              // disable={selectedKeywords.length ? false : true}
              blinkit
              click={() => {
                if (
                  campaignData?.titleOption?.length &&
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
                } else if (inputError.length) {
                  setError({
                    ...error,
                    inputError: "Please fill correct category's cpm values",
                  });
                } else if (inputKeywordError.length) {
                  setError({
                    ...error,
                    inputKeywordError:
                      "Please fill correct keyword's cpm values",
                  });
                } else if (
                  campaignData?.titleOption?.length &&
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
                } else {
                  setActive(active + 1);
                }
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default StepTargetingKeywordOptionsBrandSuggestion;
