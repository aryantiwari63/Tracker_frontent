import React, { useState, useEffect } from "react";
import CustomBtn from "./button/CustomBtn";

const CreateRuleSchedule = ({
  schedule,
  dateType,
  selectedDate,
  selectedTime,
  weekTiming1,
  dateFilter,
}) => {
  const [showButton, setShowButton] = useState(false);
  const [scheduleType, setScheduleType] = useState("Continuously");

  useEffect(() => {
    schedule(scheduleType);
  }, [scheduleType]);
  const handleScheduleChange = (e) => {
    setScheduleType(e.target.value);
    setShowButton(e.target.value === "Custom");
  };
  return (
    <>
      <div className="row pt-2 pl-4 pr-3">
        <label  className="createrulepopup-forms mb-1">
          Schedule
        </label>

        <div className="row py-1">
          <label  className="createrulepopup-formsch">
            <input
              className="mx-1 accent-purple-900"
              type="radio"
              value="Continuously"
              name="continuously"
              checked={scheduleType === "Continuously"}
              onChange={(e) => handleScheduleChange(e)}
            />
            Continuously
          </label>
          <div className="row schedule-subheadding pl-5">
          Rule runs as often possible (usually every 2 hours).
        </div>
        </div>

       <div className="row py-1 accent-purple-900">
        <label  className="createrulepopup-formsch">
          <input
            className="mx-1"
            type="radio"
            value="Daily"
            name="daily"
            checked={scheduleType == "Daily"}
            onChange={(e) => handleScheduleChange(e)}
          />
          Daily
        </label>
        <div className="row schedule-subheadding pl-5">
        at 12:00 am Kolkata time
      </div> 
      </div>
      <div className="row py-1 ">
        <label  className="createrulepopup-formsch">
          <input
            className="mx-1 accent-purple-900"
            type="radio"
            value="Custom"
            name="custom"
            checked={scheduleType === "Custom"}
            onChange={(e) => {
              setShowButton(!showButton);
              handleScheduleChange(e);
            }}
          />
          Custom
        </label>
        <div className="row schedule-subheadding pl-5">
        Adjust the schedule to run on specific days and at specific times
      </div>
      </div>
      {showButton && (
        <CustomBtn
          setOpenState={setShowButton}
          dateType={dateType}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
          weeklyTiming1={weekTiming1}
          dateFilter={dateFilter}
        />
      )}
      
      </div>
      
     
     
      
    </>
  );
};

export default CreateRuleSchedule;
