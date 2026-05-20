import React, { useState, useEffect } from "react";
import _ from "lodash";
import SchedulerModal from "./OffscreenPages/SchedulerModal";
import DoubleClickLink from "./doubleClick/DoubleClickLink";
import { useSelector } from "react-redux";
import { ALL_BUTTON_FLAGS, PERMISSIONS } from "../../utils/constants";
import LoaderSpinner from "../common-components/loader-spinner";
import { convertDate } from "./report_constant";
import WhenPermitted from "../common-components/WhenPermitted";

const styleScheduledInfo = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

function RecordGrid({
  customReportData,
  reportId,
  reportIcon,
  loadingState,
  actionStatusDropdown,
  setActionStatusDropdown,
  triggerHandler,
  platform,
  isScheduledOpen,
  setScheduled,
  color,
  setConfirmation,
  setSchedulerOpen,
  edit_path,
  permissionPlatform,
}) {
  const [schedulerPosition, setSchedulerPosition] = useState({
    top: 0,
    left: 0,
  });
  const userPermissions = useSelector(
    (state) => state.permissionsReducer || []
  );
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CUSTOM_REPORT_ACTION,
    platform: permissionPlatform,
  });
  
  const [particularContent, setContent] = useState([]);
  const { loading } = useSelector((state) => state.CommonReducer);
  // console.log("actionStatusDropdown>>>>>>>>>>>", actionStatusDropdown);
  // const { generatedreportlist } = useSelector((state) => state.Customreport);
  // const { loading } = useSelector((state) => state.CommonReducer);

  const handleClickOutside = (event) => {
    if (!event.target.dataset.dropdown) setActionStatusDropdown(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const renderStatusDropDown = (activeValue, report_id) => {
    if (activeValue === "active") {
      return (
        <li
          onClick={() => triggerHandler("status", "paused", report_id)}
          className="cursor-pointer px-2 py-2 "
        >
          <img
            className="w-[5.5rem] inline-block align-middle cursor-pointer transform transition duration-300 hover:scale-110 m-0"
            src="/assets/images/pauseddropdown.svg"
            alt="status"
          />
        </li>
      );
    } else {
      return (
        <li
          onClick={() => triggerHandler("status", "active", report_id)}
          className="cursor-pointer px-2 py-2 "
        >
          <img
            className="w-[5.5rem] inline-block cursor-pointer align-middle transform transition duration-300 hover:scale-110 m-0"
            src="/assets/images/activedropdown.svg"
            alt="status"
          />
        </li>
      );
    }
  };
  function stringToPastelColor(str) {
    let hash = 0;
    if (str !== null && str) {
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const pastel = (hash & 0x00ffffff).toString(16).toUpperCase();
      return "#" + ("00000" + pastel).slice(-6);
    }
  }

  const actionScheduler = (e, content) => {
    if (content?.status.toLowerCase() === "active") {
      // Calculate button position relative to the viewport
      const buttonRect = e.target.getBoundingClientRect();
      setSchedulerPosition({
        top: buttonRect.bottom,
        left: buttonRect.left,
      });
      const element = document.getElementById("header-custom");
      const header_element = document.getElementById("for-custom");
      if (element) {
        element.style.zIndex = "0";
      }
      if (header_element) {
        header_element.style.zIndex = "0";
      }
    }
    const contents = customReportData.find(
      (val) => val.report_id === content?.report_id
    );
    setContent(contents);
    setScheduled(content?.report_id);
  };

  function convertToTime(number) {
    const period = number < 12 ? "AM" : "PM";

    const hour = number % 12 === 0 ? 12 : number % 12;

    const paddedHour = hour < 10 ? "0" + hour : hour;

    // Return the time format
    return `${paddedHour}:00 ${period}`;
  }

  function addOrdinalSuffix(date) {
    const j = date % 10,
      k = date % 100;

    if (j === 1 && k !== 11) {
      return date + "st";
    }
    if (j === 2 && k !== 12) {
      return date + "nd";
    }
    if (j === 3 && k !== 13) {
      return date + "rd";
    }
    return date + "th";
  }

  const returnScheduledInfo = (data, time, status) => {
    // console.log("data>>>>>>>>>>>>>", data, time);
    if (
      typeof data === "object" &&
      // data?.schedule_time &&
      data?.custom_type
      // data?.schedule_time.length > 0
    ) {
      if (data?.custom_type === "Weekly")
        return (
          <div
            className="w-full"
            title={data?.schedule_time.map(
              (val, index) =>
                val?.custom_day +
                `${data?.schedule_time.length - 1 > index ? "" : " of week"}`
            )}
          >
            <div
              className={`flex text-[#262626] text-[12px] ${
                status
                  ? "hover:text-[13px] hover:underline transition-all duration-300"
                  : ""
              }`}
            >
              <p className="max-w-[50%] " style={styleScheduledInfo}>
                {data?.schedule_time.map(
                  (val, index) =>
                    val?.custom_day +
                    `${data?.schedule_time.length - 1 > index ? " , " : " , "}`
                )}
              </p>
              {convertToTime(time)}
            </div>
          </div>
        );
      else if (data?.custom_type === "Monthly") {
        return (
          <div
            className="w-full"
            title={data?.schedule_time.map(
              (val, index) =>
                addOrdinalSuffix(Number(val?.custom_day)) +
                `${data?.schedule_time.length - 1 > index ? "" : " of month"}`
            )}
          >
            <div
              className={`flex text-[#262626] text-[12px] ${
                status
                  ? "hover:text-[13px] hover:underline transition-all duration-300"
                  : ""
              }`}
            >
              <p style={styleScheduledInfo} className="max-w-[50%]">
                {data?.schedule_time.map(
                  (val, index) =>
                    addOrdinalSuffix(Number(val?.custom_day)) +
                    `${data?.schedule_time.length - 1 > index ? " , " : " , "}`
                )}
              </p>
              {convertToTime(time)}
            </div>
          </div>
        );
      } else {
        return (
          <div className="w-full" title={"daily"}>
            <div
              className={`flex text-[#262626] text-[12px] ${
                status
                  ? "hover:text-[13px] hover:underline transition-all duration-300"
                  : ""
              }`}
            >
              <p style={styleScheduledInfo} className="max-w-[50%]">
                Daily,
              </p>{" "}
              {convertToTime(time)}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div
      className={`${
        customReportData.length === 0
          ? "flex justify-center items-center h-auto mt-[30vh]"
          : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 rounded-tl-tr border border-gray-100"
      }`}
    >
      {isScheduledOpen && (
        <SchedulerModal
          content={particularContent}
          schedulerPosition={schedulerPosition}
          permissionPlatform={permissionPlatform}
          color={color}
          setEmailList={(value) =>
            triggerHandler("emails", value, isScheduledOpen)
          }
          setScheduled={() => {
            setContent([]);
            const element = document.getElementById("header-custom");
            const header_element = document.getElementById("for-custom");
            if (element) {
              element.style.zIndex = "50";
            }
            if (header_element) {
              header_element.style.zIndex = "50";
            }
            // console.log(header_element.style.zIndex);
            setScheduled(false);
            setSchedulerPosition({
              top: 0,
              left: 0,
            });
          }}
          setConfirmation={setConfirmation}
        />
      )}
      {!loadingState ? (
        customReportData && customReportData.length > 0 ? (
          customReportData.map((content, index) => (
            <DoubleClickLink key={index} path={edit_path} content={content}>
              <div className="overflow-hidden cursor-pointer">
                <div className={`flex justify-center `}>
                  <div className="w-full sm:w-auto md:w-full  overflow-hidden px-3 py-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center ">
                      <img
                        className="size-5 rounded  mr-4"
                        src={reportIcon}
                        alt="Logo"
                      />
                      <div
                        className={`text-[14px] font-medium font-inter text-[#333333] leading-[24px] overflow-hidden whitespace-nowrap overflow-ellipsis`}
                        title={content?.report_name}
                      >
                        {content?.report_name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`flex justify-center `}>
                  <div className="flex flex-col w-full sm:w-auto md:w-full  overflow-hidden px-3 pb-4 pt-1 bg-white ">
                    <span className="text-gray-500 text-[12px] font-normal font-inter leading-[16px] ">
                      Created By
                    </span>
                    <span className="text-[#000000] mt-1 text-[12px] font-normal leading-[22px] font-inter ">
                      {content?.created_by},{" "}
                      <span className="text-[#6B7280] text-[12px]">
                        {convertDate(content?.created_at)}
                      </span>
                    </span>
                    <span className="mt-2 text-gray-500 text-[12px] font-normal font-inter leading-[16px] ">
                      Last Edit
                    </span>
                    <span className="mt-1 text-[#000000] text-[12px] font-normal leading-[22px] font-inter ">
                      {content?.last_edit},{" "}
                      <span className="text-[#6B7280] text-[12px]">
                        {convertDate(content?.last_edited_at)}
                      </span>
                    </span>
                    <div className={`flex mt-2 `}>
                      <div className="flex flex-col flex-1">
                        <span className="text-gray-500 text-[12px] font-normal font-inter leading-4 ">
                          Schedule
                        </span>
                      </div>
                    </div>
                    {content.is_scheduled ? (
                      <div className={`flex  `}>
                        <div
                          className={`flex flex-col flex-1 w-[50%] ${
                            content?.status.toLowerCase() === "paused"
                              ? "disabled-div"
                              : "cursor-pointer"
                          }`}
                        >
                          <span
                            className={`mt-1 text-[14px] font-normal leading-4 font-inter ${
                              content?.status.toLowerCase() === "paused"
                                ? "text-[#737373]"
                                : "text-[#000000]"
                            }`}
                          >
                            {/* {content?.scheduled_at} */}
                            <div
                              onClick={() => {
                                if (
                                  content?.status.toLowerCase() === "active" &&
                                  content?.columnsdata?.length
                                )
                                  setSchedulerOpen(content);
                              }}
                            >
                              {returnScheduledInfo(
                                content["reportSchedulers.custom_schedule"],
                                content["reportSchedulers.scheduled_time"] ||
                                  [],
                                content?.status.toLowerCase() === "active"
                              )}
                            </div>
                          </span>

                          <div className="flex -space-x-2 mt-3 w-[100%]">
                            {content["reportSchedulers.emails"] !== null &&
                              content["reportSchedulers.emails"].map(
                                (item, index) => {
                                  if (index < 3 && item && item !== null) {
                                    return (
                                      <div
                                        key={index}
                                        className={` inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full `}
                                        title={item}
                                        style={{
                                          background:
                                            content?.status.toLowerCase() ===
                                            "active"
                                              ? stringToPastelColor(item)
                                              : " bg-gray-100 ",
                                        }}
                                      >
                                        <span
                                          className={`font-medium ${
                                            content?.status.toLowerCase() ===
                                            "active"
                                              ? "text-white"
                                              : "text-gray-600 dark:text-gray-300"
                                          }`}
                                        >
                                          {item && item.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    );
                                  }
                                }
                              )}

                            <div
                              className=" inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
                              onClick={(e) => {
                                if (content?.status.toLowerCase() === "active")
                                  actionScheduler(e, content);
                              }}
                            >
                              <span className="font-medium text-gray-600 dark:text-gray-300">
                                +
                                {content["reportSchedulers.emails"] !== null &&
                                  content["reportSchedulers.emails"].length >
                                    3 &&
                                  content["reportSchedulers.emails"].length - 3}
                              </span>
                              {/* Ensure this condition is evaluated properly */}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end ">
                          <div className="relative custom-dropdown">
                            <div
                              className="dropdown-header"
                              data-dropdown={true}
                              onClick={() => {
                                if (!hasPermission) {
                                  return;
                                }
                                setActionStatusDropdown(content?.report_id)
                              }
                            }
                            >
                              <div
                                className={`cursor-pointer px-2 py-2 ${
                                  actionStatusDropdown === content?.report_id
                                    ? "bg-[#F2F2F2] border shadow-l"
                                    : ""
                                }`}
                              >
                                <img
                                  data-dropdown={true}
                                  className="w-[5.5rem] inline-block align-middle mr-1 cursor-pointer"
                                  src={`/assets/images/${
                                    content?.status.toLowerCase() === "active"
                                      ? "activeTag"
                                      : "pausedTag"
                                  }.svg`}
                                  alt="status"
                                />
                              </div>
                            </div>
                            {actionStatusDropdown === content?.report_id && (
                              <ul className="absolute top-10 left-0 z-10 w-full bg-white border shadow-l shadow-lg">
                                {renderStatusDropDown(
                                  content?.status.toLowerCase(),
                                  content?.report_id
                                )}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col mt-3 ">
                        <div className="mt-1 leading-4 invisible">Dummmy</div>
                        <div
                          className="flex items-center text-[12px] font-normal text-[#262626] h-10 cursor-pointer w-fit"
                          onClick={() => setSchedulerOpen(content)}
                        >
                          <img
                            className="w-4 h-4 mr-4 cursor-pointer align-middle"
                            src={`/assets/images${platform}customscheduled.svg`}
                            alt="schedule"
                          />
                          Not Scheduled
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`flex justify-center `}>
                  <div className="w-full sm:w-auto md:w-full  overflow-hidden px-3 py-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center text-gray-500">
                      <div className="border-r">
                        {loading &&
                        loading.buttonFlag == ALL_BUTTON_FLAGS.CUSTOMREPORT &&
                        loading.state &&
                        content?.report_id == reportId ? (
                          <div className="loadingDownload">
                            <LoaderSpinner />
                          </div>
                        ) : (
                          <img
                            className="w-4 h-4 mr-4 cursor-pointer"
                            src={`/assets/images/downloadCustom.svg`}
                            alt="download"
                            title="Download"
                            onClick={() =>
                              triggerHandler("download", null, content)
                            }
                          />
                        )}
                      </div>
                      <WhenPermitted platform={permissionPlatform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}>
                      <div className="border-r">
                        <img
                          className="w-4 h-4 mx-4 cursor-pointer"
                          src={`/assets/images/copyCustom.svg`}
                          alt="copy"
                          title="Copy"
                          onClick={() =>
                            triggerHandler("copy", null, content?.report_id)
                          }
                        />
                      </div>
                      </WhenPermitted>
                      <WhenPermitted platform={permissionPlatform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}>
                      <div className="">
                        <img
                          className="w-4 h-4 mx-4 cursor-pointer"
                          src={`/assets/images/deleteCustom.svg`}
                          alt="delete"
                          title="Delete"
                          onClick={() =>
                            triggerHandler("delete", null, content?.report_id)
                          }
                        />
                      </div>
                      </WhenPermitted>
                    </div>
                  </div>
                </div>
              </div>
            </DoubleClickLink>
          ))
        ) : (
          <div className="grid ">
            <div className="h-[100%]">No data Found</div>
          </div>
        )
      ) : (
        <div>
          <LoaderSpinner />
        </div>
      )}
    </div>
  );
}

export default RecordGrid;
