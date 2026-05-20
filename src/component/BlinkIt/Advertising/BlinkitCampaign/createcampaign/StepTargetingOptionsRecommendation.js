import React from "react";
import Button from "../../../../common-components/button/Button";
import Btn from "./button/Btn";
import CategoryTargetingRecommendation from "./targetoption/categorytargeting/CategoryTargetingRecommendation";
import TargetoptionresultRecommendationAds from "./targetoption/targetoptionresult/targetoptionresultRecommendationAds";
// import { useSelector } from "react-redux";

const StepTargetingOptionsRecommendation = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [inputError, setInputError] = React.useState([]);

  const [error, setError] = React.useState({
    assetData: "",
  });

  React.useEffect(() => {
    setError({
      ...error,
      assetData: "",
    });
  }, [campaignData.assetData]);

  React.useEffect(() => {
    setError({
      ...error,
      inputError: "",
    });
  }, [inputError.length]);

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
        <TargetoptionresultRecommendationAds campaignData={campaignData} />
      ) : (
        <>
          <div className="text-xs py-2">
            {" "}
            You can select multiple targeting options to boost your product
            across the platform.
          </div>

          <CategoryTargetingRecommendation
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
                  campaignData?.assetData &&
                  campaignData?.assetData?.length > 0 &&
                  campaignData?.assetData
                    .map((data) =>
                      Object.prototype.hasOwnProperty.call(data, "cpm")
                    )
                    .includes(false)
                ) {
                  setError({
                    ...error,
                    assetData: "Please enter a cpm values of selected asset",
                  });
                } else if (inputError.length) {
                  setError({
                    ...error,
                    inputError: "Please fill correct category's cpm values",
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

export default StepTargetingOptionsRecommendation;
