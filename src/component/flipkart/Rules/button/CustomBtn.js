import React, { useEffect, useState } from "react";
import { CustomTime } from "./CustomTime";

const CustomBtn = ({
  dateType,
  weeklyTiming1,
  dateFilter,
}) => {
  const [showdate, setShowDate] = useState("Weekly");
  const [selectedDays, setSelectedDays] = useState([]);
  const [dateTimePerDay, setDateTimePerDay] = useState([
    { day: "", timer: [{ time: "" }] },
  ]);
  useEffect(() => {
    dateFilter(dateTimePerDay);
  }, [dateTimePerDay]);
  const addDateTimeSlot = () => {
    setDateTimePerDay((prevState) => [
      ...prevState,
      { day: "", timer: [{ time: "" }] },
    ]);
  };

  const handleTimeChange = (dayIndex, timeIndex, value) => {
    setDateTimePerDay((prevState) => {
      const updatedDateTimePerDay = [...prevState];
      updatedDateTimePerDay[dayIndex].timer[timeIndex] = { time: value };
      return updatedDateTimePerDay;
    });
  };

  const handleDateChange = (dayIndex, value) => {
    setDateTimePerDay((prevState) => {
      const updatedDateTimePerDay = [...prevState];
      updatedDateTimePerDay[dayIndex].day = value;
      return updatedDateTimePerDay;
    });
  };

  const removeDateTimeSlot = (dayIndex) => {
    setDateTimePerDay((prevState) => {
      const updatedDateTimePerDay = [...prevState];
      updatedDateTimePerDay.splice(dayIndex, 1);
      return updatedDateTimePerDay;
    });
  };

  useEffect(() => {
    dateType(showdate);
  }, [showdate]);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <>
      <div className="row custombtn pl-4">
        <button
          className={["weekbtn ", showdate === "Weekly" && "active"].join(" ")}
          onClick={() => setShowDate("Weekly")}
        >
          Weekly
        </button>
        <button
          className={["weekbtn ", showdate === "Datewise" && "active"].join(" ")}
          onClick={() => setShowDate("Datewise")}
        >
          Datewise
        </button>
      </div>
      <div className="row pl-4 space-between">
        <h6 className="custom-heading">
          Maximum 4 time frames can be scheduled.
        </h6>
      </div>
      {showdate === "Weekly" ? (
        <>
          {showdate === "Weekly" &&
            daysOfWeek.map((day) => (
              <CustomTime
                key={day}
                day={day}
                weeklyTiming0={weeklyTiming1}
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
              />
            ))}
        </>
      ) : (
        <>
          {dateTimePerDay.map((dateTime, dayIndex) => (
            <div key={dayIndex} className="row mb-2 pl-2 pr-1">
              <div className="col_3 px-2 ">
                <input
                  type="date"
                  id={`appt_${dayIndex}`}
                  name={`appt_${dayIndex}`}
                  className="border-2 custom-clock w-full mb-2 h-[32px]"
                  value={dateTime.day}
                  onChange={(e) => handleDateChange(dayIndex, e.target.value)}
                />
              </div>
              {dateTime.timer.map((time, timeIndex) => (
                <div className="col_2 px-2" key={timeIndex}>
                  <div className="row border h-[32px] ">
                    <div className="col">
                      <select className="block py-2.5 px-1 w-full text-sm text-gray-500 bg-transparent border-0  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer" onChange={(e) => handleTimeChange(dayIndex, timeIndex, e.target.value)}>
                                                 <option selected disabled hidden>select time</option>

                        <option value="0">0:00</option>
                        <option value="1">1:00</option>
                        <option value="2">2:00</option>
                        <option value="3">3:00</option>
                        <option value="4">4:00</option>
                        <option value="5">5:00</option>
                        <option value="6">6:00</option>
                        <option value="7">7:00</option>
                        <option value="8">8:00</option>
                        <option value="9">9:00</option>
                        <option value="10">10:00</option>
                        <option value="11">11:00</option>
                        <option value="12">12:00</option>
                        <option value="13">13:00</option>
                        <option value="14">14:00</option>
                        <option value="15">15:00</option>
                        <option value="16">16:00</option>
                        <option value="17">17:00</option>
                        <option value="18">18:00</option>
                        <option value="19">19:00</option>
                        <option value="20">20:00</option>
                        <option value="21">21:00</option>
                        <option value="22">22:00</option>
                        <option value="23">23:00</option>
                      </select>
                      {/* <input
                        type="time"
                        id={`appt_${dayIndex}_${timeIndex}`}
                        name={`appt_${dayIndex}_${timeIndex}`}
                        className="border-2 custom-clock w-full"
                        value={time.time}
                        onChange={(e) =>
                          handleTimeChange(dayIndex, timeIndex, e.target.value)
                        }
                      /> */}
                      
                    </div>
                    {timeIndex > 0 && (
                      <div className="col_3 hover:bg-black hover:text-white  bg-gray-300 pt-1.5 text-center cursor-pointer h-[32px]">
                        <button
                          className=""
                          onClick={() =>
                            setDateTimePerDay((prevState) => {
                              const updatedDateTimePerDay = [...prevState];
                              updatedDateTimePerDay[dayIndex].timer.splice(
                                timeIndex,
                                1
                              );
                              return updatedDateTimePerDay;
                            })
                          }
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {dateTime.timer.length < 4 && (
                <div className="col_3 px-1">
                  <button
                    className="customtime-addbtn"
                    onClick={() => {
                      if (dateTime.timer.length < 4) {
                        setDateTimePerDay((prevState) => {
                          const updatedDateTimePerDay = [...prevState];
                          updatedDateTimePerDay[dayIndex].timer = [
                            ...updatedDateTimePerDay[dayIndex].timer,
                            { time: "" },
                          ];
                          return updatedDateTimePerDay;
                        });
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              )}
              {dateTimePerDay.length > 1 && dayIndex > 0 && (
                <div className="col_3 px-1 ml-1">
                  <button
                    className="col_2 hover:bg-black hover:text-white rounded-sm text-center cursor-pointer h-[32px] bg-red-400"
                    onClick={() => removeDateTimeSlot(dayIndex)}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          ))}
          {dateTimePerDay.length < 4 && (
            <div className="row pl-4">
              <button
                className="bg-[#0081f7] text-white px-5 h-9 rounded mt-2 hover:bg-black hover:text-white"
                onClick={addDateTimeSlot}
              >
                Add
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CustomBtn;
