import React from "react";
import Button from "../../../../common-components/button/Button";
import Btn from "./button/Btn";
import CategoryTargetingBrandSuggestion from "./targetoption/categorytargeting/CategoryTargetingBrandSuggestion";
import TargetoptionresultBrandSuggestion from "./targetoption/targetoptionresult/targetoptionresultRecommendationAds/TargetoptionresultBrandSuggestion";
// import { useSelector } from "react-redux";

const StepTargetingOptionsBrandSuggestion = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
}) => {
  const [error, setError] = React.useState({
    brandDetailsData: "",
  });

  React.useEffect(() => {
    setError({
      ...error,
      brandDetailsData: "",
    });
  }, [campaignData.brandDetailsData]);

  return (
    <>
      {active > 3 ? (
        <TargetoptionresultBrandSuggestion campaignData={campaignData} />
      ) : (
        <>
          <div className="text-sm py-2"> Select campaign brands</div>
          <div className="text-xs pb-2">
            {" "}
            Choose the brands you want to boost through this campaign. You can
            select multiple brands mapped to your advertiser ID.
          </div>

          <CategoryTargetingBrandSuggestion
            active={active}
            setActive={setActive}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            error={error}
          />
        </>
      )}
      <div className="col text-end px-2">
        {active > 3 ? (
          <Btn
            title="Edit"
            onClick={() => {
              setActive(3);
            }}
          />
        ) : (
          <div className="pt-4">
            <Button
              title="Done"
              platform={"blinkit"}
              blinkit
              click={() => {
                if (
                  !campaignData?.brandDetailsData ||
                  campaignData?.brandDetailsData?.length == 0
                ) {
                  setError({
                    ...error,
                    brandDetailsData: "Please select at least one brand",
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

export default StepTargetingOptionsBrandSuggestion;
