import { useState, useEffect } from "react";
import CustomSelectDirection from "../../../common-components/customselect/CustomSelectDirection";
import { timeArr } from "../../../common-components/customselect/constant";

export const CustomTime = ({
  day,
  weeklyTiming0,
  selectedDays,
  setSelectedDays,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [allSelectedDays, setAllSelectedDays] = useState([]);

  const handleToggleDay = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setSelectedDays(() => [
        ...selectedDays,
        { day: value, timer: [{ index: 0, time: "" }] },
      ]);
    } else {
      setSelectedDays((prev) => prev.filter((item) => item.day !== value));
    }
  };

  useEffect(() => {
    setAllSelectedDays(selectedDays);
  }, [selectedDays]);

  const handleTimeChange = (day, index, time) => {
    setSelectedDays((prev) =>
      prev.map((item) =>
        item.day === day
          ? {
              ...item,
              timer: item.timer.map((t, i) =>
                i === index ? { ...t, time } : t
              ),
            }
          : item
      )
    );
  };

  const handleClose = (day, index) => {
    setSelectedDays((prev) =>
      prev.map((item) =>
        item.day === day
          ? { ...item, timer: item.timer.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  const addTimeSlot = (day) => {
    setSelectedDays((prev) => {
      const selectedDay = prev.find((item) => item.day === day);
      if (selectedDay && selectedDay.timer.length < 4) {
        const updatedDay = {
          ...selectedDay,
          timer: [
            ...selectedDay.timer,
            { index: selectedDay.timer.length, time: "" },
          ],
        };
        return prev.map((item) => (item.day === day ? updatedDay : item));
      }
      return prev;
    });
  };

  useEffect(() => {
    weeklyTiming0(selectedDays);
  }, [selectedDays]);

  return (
    <>
      <div className="row pt-2 custom-datelist">
        <div className="col_3 px-4">
          <label className="switch">
            <input
              className="instamart_btn"
              type="checkbox"
              value={day}
              onClick={handleToggleDay}
              defaultChecked={selectedDays.some((item) => item.day === day)}
            />
            <span className="slider slider--instamart round"></span>
          </label>
          <label htmlFor="" className="custombtn-day">
            {day}
          </label>
        </div>

        <div className="col">
          <div className="row">
            {selectedDays
              .filter((item) => item.day === day)
              .map((selectedDay) =>
                selectedDay.timer.map((time, index) => (
                  <div className="col_3 px-2" key={index}>
                    <div className="row  h-[32px] ">
                      <div className="col ">
                        {/* <select
                          className="block py-1.5 px-2  w-full text-sm text-gray-500 bg-transparent border-0  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                          onChange={(e) =>
                            handleTimeChange(
                              selectedDay.day,
                              index,
                              e.target.value
                            )
                          }
                        >
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
                        </select> */}
                        <CustomSelectDirection
                          label={"Select"}
                          options={timeArr}
                          value={time?.time}
                          onChange={(eventValue) => {
                            handleTimeChange(
                              selectedDay.day,
                              index,
                              eventValue
                            );
                          }}
                          platform={"instamart"}
                        />
                      </div>
                      {index > 0 && (
                        <div
                          className="customtime-addbtn h-[32px] ml-2"
                          onClick={() => handleClose(selectedDay.day, index)}
                        >
                          X
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            {/* add more time scheduler button */}
            {selectedDays.some((item) => item.day === day) &&
              selectedDays?.find((item) => item.day === day).timer.length <
                4 && (
                <div className="col_3 ">
                  <button
                    className="customtime-addbtn"
                    onClick={() => addTimeSlot(day)}
                  >
                    +
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};
