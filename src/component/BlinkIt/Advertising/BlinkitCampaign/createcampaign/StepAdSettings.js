import React from "react";
import Button from "../../../../common-components/button/Button";
import Btn from "./button/Btn";
import CampaignDuration from "./targetoption/categorytargeting/CampaignDuration";
import CampaignRegion from "./targetoption/categorytargeting/CampaignRegion";
import RegionAndDurationResult from "./targetoption/targetoptionresult/RegionAndDurationResult";
// import { useSelector } from "react-redux";

const StepAdSettings = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [error, setError] = React.useState({
    location: "",
    cities: "",
    end_duration: "",
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
      end_duration: "",
    });
  }, [campaignData.end_duration, campaignData?.no_end_date]);

  return (
    <>
      {active > 2 ? (
        <RegionAndDurationResult campaignData={campaignData} />
      ) : (
        <>
          <div className="border-b py-4">
            <CampaignDuration
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              error={error}
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
        </>
      )}
      <div className="px-2">
        {active > 2 ? (
          <div className="text-end">
            <Btn
              title="Edit"
              onClick={() => {
                setActive(2);
              }}
            />
          </div>
        ) : (
          <div className="pt-4">
            <Button
              title="Done"
              platform={"blinkit"}
              // disable={selectedKeywords.length ? false : true}
              blinkit
              click={() => {
                if (
                  campaignData?.no_end_date != "1" &&
                  !campaignData?.end_duration
                ) {
                  setError({
                    ...error,
                    end_duration: "End duration is required.",
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

export default StepAdSettings;
