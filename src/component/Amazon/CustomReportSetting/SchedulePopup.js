/* eslint-disable */

import React, { useEffect } from "react";
import Popup from "./Popup.js";
import { useSelector } from "react-redux";
// import DatePicker from "react-multi-date-picker";
import { dayIndex, PERMISSIONS, timeOptions } from "../../../utils/constants";
import "./styles.css";
import WhenPermitted from "../../common-components/WhenPermitted.js";

const SchedulePopup = ({
  setOpenState,
  setScheduleState,
  scheduleState,
  postScheduleData,
  error,
  setError,
  errorMessage,
  color,
  platform,
  edit,
  setErrorMessage,
  permissionPlatform
}) => {
  const userPermissions = useSelector(
    (state) => state.permissionsReducer || []
  );
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CUSTOM_REPORT_ACTION,
    platform: permissionPlatform,
  });

  const currentHour = new Date().getHours();
  const errorDivRef = React.useRef(null);
  const daysOfMonth = Array.from({ length: 31 }, (_, index) => index + 1);

  const handleEmailChange = (id, value) => {
    const newEmails = scheduleState?.emailArray.map((email) => {
      if (email.id === id) {
        const error = isValidEmail(value)
          ? ""
          : "Please enter valid email address";
        return { ...email, value, error };
      }
      return email;
    });
    setScheduleState({
      ...scheduleState,
      emailArray: newEmails,
    });
    // setEmails(newEmails);
  };

  const onBlurEmail = (e) => {
    // console.log("onBlur>>>>>>", e);

    let emails = getEmails();
    setScheduleState({
      ...scheduleState,
      emailArray: emails,
    });
    const relatedTargetId = e.relatedTarget?.id;
    // console.log("Related target id:", relatedTargetId);
    if (relatedTargetId === "add_email") {
      const element = document.getElementById("add_email");
      if (element) {
        element.click();
      }
    }
  };

  const getEmails = () => {
    let emails = scheduleState?.emailArray.map((val) => {
      let findValue =
        scheduleState?.emailArray.findIndex(
          (innerVal) =>
            innerVal.value === val.value &&
            innerVal.id !== val.id &&
            innerVal.value.trim().length > 0
        ) > -1;
      const error = findValue
        ? "Duplicate email address"
        : !isValidEmail(val.value)
        ? "Please enter valid email address"
        : "";
      // console.log("error>>>>>>>>>", error);
      return { ...val, error };
    });
    return emails;
  };

  const handleAddEmail = (index, e) => {
    // console.log("handleAddEmail>>>>>>", e);
    if (
      isValidEmail(scheduleState?.emailArray[index].value) &&
      !isDuplicateEmail(scheduleState?.emailArray[index].value)
    ) {
      let emails = getEmails();
      const maxId = emails.reduce(
        (max, email) => (email.id > max ? email.id : max),
        0
      );
      const newEmail = { id: maxId + 1, value: "", error: "" };

      setScheduleState({
        ...scheduleState,
        // eslint-disable-next-line no-unsafe-optional-chaining
        emailArray: [...emails, newEmail],
      });
    } else {
      // const newEmails = scheduleState?.emailArray.map((email, i) => {
      //   if (i === index) {
      //     const error = isDuplicateEmail(email.value)
      //       ? "Duplicate email address"
      //       : "Please enter valid email address";
      //     return { ...email, error };
      //   }
      //   return email;
      // });
      // setScheduleState({
      //   ...scheduleState,
      //   emailArray: newEmails,
      // });
      let emails = getEmails();
      setScheduleState({
        ...scheduleState,
        emailArray: emails,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const handleRemoveEmail = (idToRemove) => {
    if (scheduleState?.emailArray.length > 1) {
      // setEmails(scheduleState?.emailArray.filter((email) => email.id !== id));
      const removedEmail = scheduleState?.emailArray.find(
        (email) => email.id === idToRemove
      );
      const newEmails = scheduleState?.emailArray.filter(
        (email) => email.id !== idToRemove
      );

      if (removedEmail.error === "Duplicate email address") {
        const updatedEmails = newEmails.map((email) => {
          return { ...email, error: "" };
        });
        setScheduleState({
          ...scheduleState,
          emailArray: updatedEmails,
        });
      } else {
        setScheduleState({
          ...scheduleState,
          emailArray: newEmails,
        });
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isDuplicateEmail = (email) => {
    return (
      scheduleState?.emailArray.filter((e) => e.value === email).length > 1
    );
  };

  const handleSelection = () => {
    // setIsVisible(false);
    setScheduleState({
      ...scheduleState,
      isVisible: false,
      days: [...scheduleState.tempdays],
    });
    setError(false);
    setErrorMessage("");
  };
  const handleSelectionDate = () => {
    // setIsVisible(false);
    setScheduleState({
      ...scheduleState,
      isVisible: false,
      selectedDays: [...scheduleState.tempselectedDays],
    });
    setError(false);
    setErrorMessage("");
  };

  const handleDays = (day) => {
    if (scheduleState.tempdays.includes(day)) {
      let array = scheduleState.tempdays.filter((item) => item !== day);
      // setDays(array);
      setScheduleState({
        ...scheduleState,
        tempdays: array,
      });
    } else {
      setScheduleState({
        ...scheduleState,
        tempdays: [...scheduleState.tempdays, day],
      });
      // setDays([...days, day]);
    }
  };

  const handleTimeRange = (e) => {
    // setTimeRange(e.target.value);
    setScheduleState({
      ...scheduleState,
      timeRange: e.target.value,
    });
  };

  const handleCancel = () => {
    // setSelectedDays(dayIndex);
    // setDays([]);
    setScheduleState({
      ...scheduleState,
      // selectedDays: [],
      // days: [],
      days: [...scheduleState.days],
      tempdays: [...scheduleState.days],
      isVisible: false,
    });
  };
  const handleCancelDate = () => {
    // setSelectedDays(dayIndex);
    // setDays([]);
    setScheduleState({
      ...scheduleState,
      // selectedDays: [],
      // days: [],
      selectedDays: [...scheduleState.selectedDays],
      tempselectedDays: [...scheduleState.selectedDays],
      isVisible: false,
    });
  };

  // const handleSelectedDays = (index) => {
  //   const updatedDays = scheduleState.selectedDays.map((day, i) => {
  //     if (i === index) {
  //       return { ...day, isSelected: !day.isSelected };
  //     } else {
  //       return day;
  //     }
  //   });
  //   // setSelectedDays(updatedDays);
  //   setScheduleState({
  //     ...scheduleState,
  //     selectedDays: updatedDays,
  //   });
  // };
  const handleSelectedDays = (day) => {
    if (scheduleState.tempselectedDays.includes(day)) {
      const val = scheduleState.tempselectedDays.filter((item) => item != day);
      // setSelectedDays(val);
      setScheduleState({
        ...scheduleState,
        tempselectedDays: val,
      });
    } else {
      // setSelectedDays([...tempselectedDays, day]);
      setScheduleState({
        ...scheduleState,
        tempselectedDays: [...scheduleState.tempselectedDays, day],
      });
    }
  };

  const handleFormat = (e) => {
    // setFormat(e.target.value);
    setScheduleState({
      ...scheduleState,
      format: e.target.value,
    });
  };

  const handleStartDate = (e) => {
    // setStartDate(e.target.value);
    setScheduleState({
      ...scheduleState,
      startDate: e.target.value,
      time:
        e.target.value === new Date().toISOString().split("T")[0] &&
        parseInt(scheduleState?.time) <= currentHour
          ? currentHour + 1
          : scheduleState?.time,
    });
  };

  const handleTime = (e) => {
    // setTime(e.target.value);
    setScheduleState({
      ...scheduleState,
      time: e.target.value,
    });

    setError(false);
    setErrorMessage("");
  };

  const handleFrequency = (e) => {
    // console.error(e.target.value);
    // setFrequency(e.target.value);
    setScheduleState({
      ...scheduleState,
      frequency: e.target.value,
    });
  };

  useEffect(() => {
    if (error && errorDivRef.current) {
      // Scroll to the error message div
      errorDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [error]);

  useEffect(() => {
    // setIsVisible(true);
    // setSelectedDays(dayIndex);
    // setDays([]);
    if (!edit) {
      setScheduleState({
        ...scheduleState,
        isVisible: true,
        selectedDays: [],
        tempselectedDays: [],
        days: [],
        tempdays: [],
      });
    }
  }, [scheduleState.frequency]);
  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("debugerrr 222", scheduleState);
  // }, [scheduleState]);

  return (
    <Popup
      footerless={!hasPermission}
      title="Schedule Report"
      setShowPopup={setOpenState}
      edit={edit}
      extrasmall
      platform={platform === "amazon" ? "ams" : platform}
      applyAction={postScheduleData}
      discardAction={() =>
        setScheduleState({
          emailArray: [{ id: 1, value: "", error: "" }],
          days: [],
          tempdays: [],
          frequency: "Daily",
          startDate: new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
          }),
          time: "0",
          format: "csv",
          timeRange: "1",
          isVisible: true,
          selectedDays: [],
          tempselectedDays: [],
        })
      }
      component={"custom_report"}
    >
      <div className="p-4 text-xl col-auto gap-4 flex flex-col">
        <div>
          <label className="font-semibold text-[15px]">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border text-[14px] disable-pointer-events"
            value={scheduleState.startDate}
            onChange={handleStartDate}
            min={new Date().toISOString().split("T")[0]}
            onKeyDown={(e) => e.preventDefault()}
            disabled={!hasPermission}
          ></input>
        </div>
        <div>
          <label className="font-semibold text-[15px]">Time</label>

          <select
            className="w-full p-2 border text-[14px]"
            onChange={handleTime}
            value={scheduleState.time}
            disabled={!hasPermission}
          >
            <option selected disabled hidden value={null}>
              Select Time
            </option>
            {timeOptions.map((item) => (
              <option
                key={item.value}
                value={item.value}
                disabled={
                  parseInt(item.value) <= currentHour &&
                  new Date().toISOString().split("T")[0] ===
                    scheduleState.startDate
                }
              >
                {item.label}
              </option>
            ))}
          </select>
          {/* <input
            type="time"
            className="w-full p-2 border"
            value={time}
            onChange={handleTime}
            min={false}
          ></input> */}
        </div>
        <div>
          <label className="font-semibold text-[15px]">Frequency</label>
          <select
            className={`w-full p-2 border text-[14px] ${
              scheduleState.frequency ? "text-black" : "text-gray-500"
            }`}
            onChange={handleFrequency}
            value={scheduleState.frequency}
            disabled={!hasPermission}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>

          {scheduleState.frequency == "Monthly" && !scheduleState.isVisible && (
            <div
              className="border w-auto text-[14px] rounded px-1 bg-gray-200 hover:cursor-pointer"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={(e) => {
                // setIsVisible(true);
                setScheduleState({
                  ...scheduleState,
                  isVisible: true,
                });
                e.stopPropagation();
              }}
            >
              {scheduleState.days.length > 0 ? (
                scheduleState.days.map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    {index !== scheduleState.days.length - 1 && ","}
                  </React.Fragment>
                ))
              ) : (
                <>No dates selected</>
              )}
            </div>
          )}
          {scheduleState.frequency == "Weekly" && !scheduleState.isVisible && (
            <div
              className="border w-auto text-[14px] rounded px-1 bg-gray-200 hover:cursor-pointer"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onClick={(e) => {
                // setIsVisible(true);
                setScheduleState({
                  ...scheduleState,
                  isVisible: true,
                });
                e.stopPropagation();
              }}
            >
              {scheduleState.selectedDays.length > 0 ? (
                scheduleState.selectedDays.map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    {index !== scheduleState.selectedDays.length - 1 && ","}
                  </React.Fragment>
                ))
              ) : (
                <>No days selected</>
              )}
            </div>
          )}
          {scheduleState.frequency == "Monthly" && scheduleState.isVisible && (
            <div className="border p-2 flex-col">
              <div className="flex flex-wrap">
                {daysOfMonth.map((day) => (
                  <div
                    key={day}
                    className={` h-[37px] w-[37px] text-[14px] flex items-center justify-center border border-gray-300 cursor-pointer ${
                      scheduleState?.tempdays?.includes(day)
                        ? `bg-[${color}] text-white`
                        : ""
                    }`}
                    onClick={(e) => {
                      if (!hasPermission) {
                        return;
                      }
                      handleDays(day);
                      e.stopPropagation();
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <WhenPermitted permission={PERMISSIONS.CUSTOM_REPORT_ACTION} platform={permissionPlatform}>
              <div className="flex justify-end gap-3">
                <button onClick={handleCancel} className="text-[14px]">
                  Cancel
                </button>
                <button
                  onClick={handleSelection}
                  // className="text-[#11B07A] text-[14px]"
                  className={
                    `text-[${color}] text-[14px]`
                    // platform === "amazon"
                    //   ? "text-[#A45000] text-[14px]"
                    //   : platform === "blinkit"
                    //   ? "text-[#11B07A] text-[14px]"
                    //   : platform === "instamart"
                    //   ? "text-[#851853] text-[14px]"
                    //   : "text-[#3C006B] text-[14px]"
                  }
                >
                  Done
                </button>
              </div>
              </WhenPermitted>
            </div>
          )}
          {scheduleState.frequency == "Weekly" && scheduleState.isVisible && (
            <div className="flex-col col-auto p-1 gap-3 justify-around items-center border">
              <div className="flex justify-start gap-1 px-2">
                {dayIndex.map((item) => (
                  <p
                    className={`border p-1 rounded-full text-center text-[14px] ${
                      scheduleState?.tempselectedDays?.includes(item.value)
                        ? `bg-[${color}] text-white`
                        : "bg-slate-200"
                    } hover:cursor-pointer`}
                    style={{ width: "37px", height: "37px" }}
                    key={item.key}
                    onClick={() => hasPermission && handleSelectedDays(item.value)}
                  >
                    {item.label}
                  </p>
                ))}
              </div>
              <WhenPermitted platform={permissionPlatform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}>
              <div className="flex gap-5 justify-end mt-4">
                <button onClick={handleCancelDate} className="text-[14px]">
                  Cancel
                </button>
                <button
                  onClick={handleSelectionDate}
                  // className="text-[#11B07A] text-[14px]"
                  className={
                    `text-[${color}] text-[14px]`
                    // platform === "amazon"
                    //   ? "text-[#A45000] text-[14px]"
                    //   : platform === "blinkit"
                    //   ? "text-[#11B07A] text-[14px]"
                    //   : platform === "instamart"
                    //   ? "text-[#851853] text-[14px]"
                    //   : "text-[#3C006B] text-[14px]"
                  }
                >
                  Done
                </button>
                <p></p>
              </div>
              </WhenPermitted>
            </div>
          )}
        </div>
        <div>
          <label className="font-semibold text-[15px]">Time Range</label>
          <div className="row">
            <select
              name="time_range"
              id="time_range"
              className="w-full p-2 border text-[14px]"
              onChange={handleTimeRange}
              value={scheduleState.timeRange}
              disabled={!hasPermission}
            >
              <option value="maximum">Maximum</option>
              <option value="1">Yesterday</option>
              <option value="2">Last 2 days</option>
              <option value="3">Last 3 days</option>
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="28">Last 28 days</option>
              <option value="30">Last 30 days</option>
              <option value="60">Last 60 days</option>
            </select>
          </div>
        </div>
        <div>
          <label className="font-semibold text-[15px]">Format</label>
          <select
            className={`w-full p-2 border text-[14px] ${
              scheduleState.format ? "text-black" : "text-gray-500"
            } `}
            disabled={!hasPermission}
            value={scheduleState.format}
            onChange={handleFormat}
          >
            <option selected disabled hidden>
              Select
            </option>
            <option value="csv">CSV</option>
            <option value="xlsx">XLSX</option>
          </select>
        </div>
        <div>
          <label className="font-semibold text-[15px]">E-mail</label>
          <div className="w-full">
            {scheduleState?.emailArray.map((email, index) => (
              <div key={email.id} className="mb-2 ">
                <div className="flex items-center">
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email.value}
                    disabled={!hasPermission}
                    onChange={(e) =>
                      handleEmailChange(email.id, e.target.value)
                    }
                    onBlur={(e) => onBlurEmail(e)}
                    onKeyDown={handleKeyDown}
                    className={`p-2 border text-[14px] ${
                      email.error ? "border-red-500" : "border-gray-300"
                    }  ${
                      scheduleState?.emailArray.length > 1
                        ? "flex-grow"
                        : "w-full"
                    } mr-2 px-[0.5rem] py-[0.25rem]`}
                  />
                  <WhenPermitted platform={permissionPlatform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}>
                  {scheduleState?.emailArray.length > 1 && (
                    <button
                      onClick={() => handleRemoveEmail(email.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                    >
                      -
                    </button>
                  )}
                  
                  {index === scheduleState?.emailArray.length - 1 && (
                    <button
                      onClick={(e) => handleAddEmail(index, e)}
                      id="add_email"
                      className=" text-white px-2 py-1 rounded"
                      style={{ background: color }}
                    >
                      +
                    </button>
                  )}
                  </WhenPermitted>
                </div>
                {email.error && (
                  <div className="text-red-500 text-[12px] ">{email.error}</div>
                )}
              </div>
            ))}
          </div>
          {error && (
            <div ref={errorDivRef} className="text-red-500 text-[13px]">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default SchedulePopup;
