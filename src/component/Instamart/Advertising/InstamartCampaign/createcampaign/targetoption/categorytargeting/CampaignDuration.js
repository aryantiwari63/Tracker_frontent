import React from "react";
// import moment from "moment";
import { MultiSelect } from "react-multi-select-component";

const CampaignDuration = ({ setCampaignData, campaignData, handleChange }) => {
  // React.useEffect(() => {
  //   setCampaignData({
  //     ...campaignData,
  //     no_end_date: "1",
  //   });
  // }, []);
  const options = [
    { label: "Monday", value: "MONDAY" },
    { label: "Tuesday", value: "TUESDAY" },
    { label: "Wednesday", value: "WEDNESDAY" },
    { label: "Thursday", value: "THURSDAY" },
    { label: "Friday", value: "FRIDAY" },
    { label: "Saturday", value: "SATURDAY" },
    { label: "Sunday", value: "SUNDAY" },
  ];
  const slotoptions = [
    {
      label: "Early Breakfast",
      value: "MEAL_SLOT_EARLY_BREAKFAST",
    },
    { label: "Breakfast", value: "MEAL_SLOT_BREAKFAST" },
    { label: "Lunch", value: "MEAL_SLOT_LUNCH" },
    { label: "Snacks", value: "MEAL_SLOT_SNACKS" },
    { label: "Dinner", value: "MEAL_SLOT_DINNER" },
    { label: "Late Night", value: "MEAL_SLOT_LATE_NIGHT" },
  ];
  const [selected, setSelected] = React.useState([]);
  const [selectedTime, setSelectedTime] = React.useState([]);
  React.useEffect(() => {
    if (selected && selected?.length) {
      setCampaignData({
        ...campaignData,
        days: selected,
      });
    }
  }, [selected]);
  React.useEffect(() => {
    if (selected && selected?.length) {
      setCampaignData({
        ...campaignData,
        timeslots: selectedTime,
      });
    }
  }, [selectedTime]);
  React.useEffect(() => {
    if (campaignData && campaignData?.days && campaignData?.days?.length) {
      setSelected(campaignData?.days);
    }
    if (
      campaignData &&
      campaignData?.timeslots &&
      campaignData?.timeslots?.length
    ) {
      setSelectedTime(campaignData?.timeslots);
    }
  }, []);

  // const noEndDateFunc = (check) => {
  //   if (check) {
  //     setCampaignData({
  //       ...campaignData,
  //       no_end_date: "1",
  //       have_end_date: "0",
  //       end_duration: "",
  //     });
  //   } else {
  //     setCampaignData({
  //       ...campaignData,
  //       no_end_date: "0",
  //       have_end_date: "1",
  //     });
  //   }
  // };
  // const haveEndDateFunc = (check) => {
  //   if (check) {
  //     setCampaignData({
  //       ...campaignData,
  //       have_end_date: "1",
  //       no_end_date: "0",
  //       end_duration: moment().add(30, "days").format("YYYY-MM-DD"),
  //     });
  //   } else {
  //     setCampaignData({
  //       ...campaignData,
  //       no_end_date: "1",
  //       have_end_date: "0",
  //       end_duration: "",
  //     });
  //   }
  // };
  React.useEffect(() => {
    if (campaignData?.end_duration) {
      let endDate = new Date(campaignData?.end_duration);
      let startDate = new Date(campaignData?.start_duration);

      // Compare dates
      let isEndDateGreaterThanStartDate = endDate > startDate;

      if (!isEndDateGreaterThanStartDate) {
        setCampaignData({
          ...campaignData,
          end_duration: "",
        });
      }
    }
  }, [campaignData.start_duration]);
  return (
    <>
      <div className="row  py-4 ">
        <div className="w-full py-2 border-t  text-xs font-semibold">
          Select Campaign Duration
        </div>
      </div>
      <div className="row">
        <div className="col_2 text-xs">Start Date</div>
        <div className="col_2">
          <input
            type="date"
            className="border px-0.5"
            id="start_duration"
            name="start_duration"
            onChange={handleChange}
            value={
              campaignData.start_duration
                ? campaignData.start_duration
                : new Date().toISOString().slice(0, -14)
            }
            min={new Date().toLocaleDateString("en-CA")}
          />
        </div>
      </div>
      <div className="row py-4">
        <div className="col_2 text-xs">End Date</div>
        <div className="col_2">
          <input
            type="date"
            className="border px-0.5"
            id="end_duration"
            name="end_duration"
            // disabled={campaignData.have_end_date != "1"}
            min={campaignData.start_duration}
            onChange={handleChange}
            value={campaignData.end_duration}
          />
        </div>
        {/* <div className="col_2">
          <input
            // type="radio"
            placeholder="No End Date"
            className=""
            type="checkbox"
            id="no_end_date"
            name="no_end_date"
            // disabled={!disableinput}
            checked={campaignData.no_end_date == "1"}
            value={campaignData.no_end_date}
            onChange={(e) => {
              noEndDateFunc(e.target.checked);
            }}
          />
          <label className="pl-2 text-xs">No End Time</label>
        </div> */}
      </div>
      {/* <div className="row ">
        <div className="col_2 "></div>
        <div className="col_2">
          <input
            // type="radio"
            placeholder="Have End Date"
            className="pr-3"
            type="checkbox"
            id="have_end_date"
            name="have_end_date"
            // disabled={!disableinput}
            checked={campaignData.have_end_date == "1"}
            value={campaignData.have_end_date}
            onChange={(e) => {
              haveEndDateFunc(e.target.checked);
            }}
          />
          <input
            type="date"
            className="border px-0.5 text-xs "
            id="end_duration"
            name="end_duration"
            disabled={campaignData.have_end_date != "1"}
            min={campaignData.start_duration}
            onChange={handleChange}
            value={campaignData.end_duration}
          />
        </div>
      </div> */}
      <div className="row py-4">
        <div className="col_2 text-xs">Choose days of week</div>
        <div className="col_2">
          <MultiSelect
            options={options}
            className="rmsc "
            value={selected}
            onChange={setSelected}
            labelledBy="Select"
          />
        </div>
      </div>
      <div className="row  py-4 ">
        <div className="col_2 text-xs">Choose time slot</div>

        <div className="col_2">
          <MultiSelect
            options={slotoptions}
            value={selectedTime}
            onChange={setSelectedTime}
            labelledBy="Select"
          />
        </div>
      </div>
    </>
  );
};

export default CampaignDuration;
