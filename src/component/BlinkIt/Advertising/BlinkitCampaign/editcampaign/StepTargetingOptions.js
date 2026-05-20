import React, { useState } from "react";
import KeywordTargeting from "./targetoption/keywordtargeting/KeywordTargeting";
import CategoryTargeting from "./targetoption/categorytargeting/CategoryTargeting";
// import { useSelector } from "react-redux";

const StepTargetingOptions = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [inputError, setInputError] = React.useState([]);
  const [inputKeywordError, setInputKeywordError] = React.useState([]);
  const [inputKeywordCPMError, setInputKeywordCPMError] = React.useState("");
  const [inputSmartKeywordError, setInputSmartKeywordError] = React.useState(
    []
  );

  const [error, setError] = React.useState({
    location: "",
    cities: "",
    targetingType: "",
    categoryData: "",
    keywords: "",
    keywordsValueError: "",
    keywordsCpmChange: 1,
  });
  React.useEffect(() => {
    setError({
      ...error,
      location: "",
    });
  }, [campaignData.location]);
  React.useEffect(() => {
    setError({
      ...error,
      cities: "",
    });
  }, [campaignData.cities]);
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
    setInputKeywordCPMError("");
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
    setError({
      ...error,
      inputSmartKeywordError: "",
    });
  }, [inputSmartKeywordError.length]);
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
      <div className="text-xs py-2">
        {" "}
        You can select multiple targeting options to boost your product across
        the platform.
      </div>
      <KeywordTargeting
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
        inputSmartKeywordError={inputSmartKeywordError}
        setInputSmartKeywordError={setInputSmartKeywordError}
        inputKeywordCPMError={inputKeywordCPMError}
      />
      <CategoryTargeting
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
  );
};

export default StepTargetingOptions;
