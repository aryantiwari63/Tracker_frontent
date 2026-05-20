import React, { useState } from "react";
import KeywordTargeting from "./targetoption/keywordtargetingSpotLight/KeywordTargeting";
import Button from "../../../../common-components/button/Button";
import Btn from "./button/Btn";
import TargetResultSpotLight from "./targetoption/targetoptionresultSpotLight";
// import { useSelector } from "react-redux";

const StepfourSpotlight = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [inputKeywordError, setInputKeywordError] = React.useState([]);
  const [inputKeywordCPMError, setInputKeywordCPMError] = React.useState("");
  const [inputSmartKeywordError, setInputSmartKeywordError] = React.useState(
    []
  );

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
      {active > 4 ? (
        <TargetResultSpotLight campaignData={campaignData} />
      ) : (
        <>
          <div className="text-xs py-2">
            {" "}
            You can select multiple targeting options to boost your product
            across the platform.
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
                if (inputKeywordError.length) {
                  setError({
                    ...error,
                    inputKeywordError:
                      "Please fill correct keyword's cpm values",
                  });
                } else if (inputSmartKeywordError.length) {
                  setError({
                    ...error,
                    inputSmartKeywordError:
                      "Please fill correct keyword's smart cpm values",
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
                  setInputKeywordCPMError(
                    "Please enter a cpm values of selected keywords"
                  );
                } else if (
                  campaignData?.titleOption?.length &&
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

export default StepfourSpotlight;
