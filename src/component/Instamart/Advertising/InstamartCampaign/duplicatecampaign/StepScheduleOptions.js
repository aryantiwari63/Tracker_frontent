import React from "react";
// import Button from "../../../../common-components/button/Button";
// import Btn from "./button/Btn";
// import Scheduleoptionresult from "./scheduleoptionresult";
import RegionTargeting from "./targetoption/categorytargeting/RegionTargeting";

const StepScheduleOptions = ({
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  // const [error, setError] = React.useState({
  //   location: "",
  //   cities: "",
  // });
  // React.useEffect(() => {
  //   setError({
  //     ...error,
  //     location: "",
  //   });
  // }, [campaignData.location]);
  // React.useEffect(() => {
  //   setError({
  //     ...error,
  //     cities: "",
  //   });
  // }, [campaignData.cities]);
  // React.useEffect(() => {
  //   setError({
  //     ...error,
  //     end_duration: "",
  //   });
  // }, [campaignData.end_duration]);
  // React.useEffect(() => {
  //   setError({
  //     ...error,
  //     days: "",
  //   });
  // }, [campaignData.days?.length]);
  // React.useEffect(() => {
  //   setError({
  //     ...error,
  //     timeslots: "",
  //   });
  // }, [campaignData.timeslots?.length]);
  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("campaignData error>>>>>>>>", error);
  // }, [error]);
  const [selected, setSelected] = React.useState([]);
  const [selectedTime, setSelectedTime] = React.useState([]);
  const [initialSet, setInitialSet] = React.useState(true);
  const [initialSetTime, setInitialSetTime] = React.useState(true);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.days &&
      campaignData?.days?.length &&
      initialSet
    ) {
      setTimeout(() => {
        setSelected(campaignData?.days);
      }, [2000]);
      setInitialSet(false);
    }

    if (
      campaignData &&
      campaignData?.timeslots &&
      campaignData?.timeslots?.length &&
      initialSetTime
    ) {
      setTimeout(() => {
        setSelectedTime(campaignData?.timeslots);
      }, [2000]);
      setInitialSetTime(false);
    }
  }, [campaignData]);

  return (
    <>
      {/* {active > 2 ? (
        <Scheduleoptionresult campaignData={campaignData} />
      ) : ( */}
      <>
        <RegionTargeting
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
          selected={selected}
          setSelected={setSelected}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          // error={error}
        />
      </>
      {/* )} */}
      {/* <div className="col text-end px-2">
        {active > 2 ? (
          <Btn
            title="Edit"
            onClick={() => {
              setActive(2);
            }}
          />
        ) : (
          <div className="pt-4">
            <Button
              title="Done"
              // disable={selectedKeywords.length ? false : true}
              instamart
              click={() => {
                if (!campaignData.end_duration) {
                  setError({
                    ...error,
                    end_duration: "End Duration is required.",
                  });
                } else if (!campaignData?.days?.length) {
                  setError({
                    ...error,
                    days: "Days are required.",
                  });
                } else if (!campaignData.timeslots?.length) {
                  setError({
                    ...error,
                    timeslots: "timeslots are required.",
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
      </div> */}
    </>
  );
};

export default StepScheduleOptions;
