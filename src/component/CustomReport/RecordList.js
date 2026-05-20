import React, { useState, useRef, useEffect } from "react";
import LoaderSpinner from "../common-components/loader-spinner";
import SchedulerModal from "./OffscreenPages/SchedulerModal";
import { ALL_BUTTON_FLAGS, PERMISSIONS } from "../../utils/constants";
import { useSelector } from "react-redux";
// import DoubleClickLink from "./doubleClick/DoubleClickLink";
import { convertDate } from "./report_constant";
import { useHistory } from "react-router-dom";
import WhenPermitted from "../common-components/WhenPermitted";

const underlineStyle = {
  // textUnderlineOffset: "0.3em",
  textDecoration: "underline",
  // textDecorationThickness: "0.1em",
};

const styleScheduledInfo = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

// function formattedDate(dateStr) {
//   const date = new Date(dateStr);
//   return `${monthNames[date.getMonth()]}, ${date.getDate()}th of the month`;
// }

function RecordList({
  listHeader,
  sortBy,
  setSortBy,
  setDataLimit,
  dataLimit,
  customReportData,
  loadingState,
  color,
  actionStatusDropdown,
  setActionStatusDropdown,
  triggerHandler,
  isScheduledOpen,
  setScheduled,
  setConfirmation,
  setSchedulerOpen,
  platform,
  reportId,
  edit_path,
  permissionPlatform
}) {
  const history = useHistory();
  const containerRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [height, setHeight] = useState(100);
  const { loading } = useSelector((state) => state.CommonReducer);

  const [schedulerPosition, setSchedulerPosition] = useState({
    top: 0,
    left: 0,
  });
  const [particularContent, setContent] = useState([]);
  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;
    if (bottom) {
      setDataLimit(dataLimit + 50);
    }
  };

  const handleClickOutside = (event) => {
    if (!event.target.dataset.dropdown) setActionStatusDropdown(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (report_id) => {
    setIsHovered(report_id);
  };

  const handleMouseLeave = () => {
    setIsHovered(undefined);
  };

  function convertToTime(number) {
    const period = number < 12 ? "AM" : "PM";

    const hour = number % 12 === 0 ? 12 : number % 12;

    const paddedHour = hour < 10 ? "0" + hour : hour;

    // Return the time format
    return `${paddedHour}:00 ${period}`;
  }

  useEffect(() => {
    setHeight(containerRef.current?.getBoundingClientRect().top);
  }, [containerRef.current]);

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
    if (typeof data === "object" && data?.custom_type) {
      if (data?.custom_type === "Weekly")
        return (
          <div
            title={data?.schedule_time.map(
              (val, index) =>
                val?.custom_day +
                `${data?.schedule_time.length - 1 > index ? "" : " of week"}`
            )}
            className={`text-[14px]  ${
              status
                ? "hover:text-[15px] hover:underline transition-all duration-300"
                : ""
            }`}
          >
            <p className="max-w-[60%]" style={styleScheduledInfo}>
              {data?.schedule_time.map(
                (val, index) =>
                  val?.custom_day +
                  `${data?.schedule_time.length - 1 > index ? " , " : ""}`
              )}
            </p>

            <p className="text-gray-500">{convertToTime(time)}</p>
          </div>
        );
      else if (data?.custom_type === "Monthly") {
        return (
          <div
            title={data?.schedule_time.map(
              (val, index) =>
                addOrdinalSuffix(Number(val?.custom_day)) +
                `${data?.schedule_time.length - 1 > index ? "" : " of month"}`
            )}
            className={`text-[14px]  ${
              status
                ? "hover:text-[15px] hover:underline transition-all duration-300"
                : ""
            }`}
          >
            <p style={styleScheduledInfo} className="max-w-[60%]">
              {data?.schedule_time.map(
                (val, index) =>
                  addOrdinalSuffix(Number(val?.custom_day)) +
                  `${data?.schedule_time.length - 1 > index ? " , " : ","}`
              )}
            </p>
            <p className="text-gray-500">{convertToTime(time)}</p>
          </div>
        );
      } else {
        return (
          <div
            title={"daily"}
            className={`text-[14px]  ${
              status
                ? "hover:text-[15px] hover:underline transition-all duration-300"
                : ""
            }`}
          >
            <p style={styleScheduledInfo} className="max-w-[60%]">
              Daily,
            </p>
            <p className="text-gray-500">{convertToTime(time)}</p>
          </div>
        );
      }
    } else {
      return (
        <div
          className={`flex items-center text-[14px] ${
            status
              ? "hover:text-[15px] hover:underline transition-all duration-300"
              : ""
          } font-normal text-[#262626] h-10 w-fit`}
        >
          <img
            className="w-4 h-4 mr-2 cursor-pointer align-middle"
            src={`/assets/images${platform}customscheduled.svg`}
            alt="schedule"
          />
          Not Scheduled
        </div>
      );
    }
  };

  const valueRenderer = (
    value,
    header,
    multiValue,
    simpleDate,
    headerIndex
  ) => {
    // if (value[header]) {
    if (header === "breakdowns") {
      return (
        <td
          className={`p-2 text-[14px] font-normal text-wrap `}
          key={headerIndex}
        >
          <div
            className="max-w-[90%] whitespace-nowrap overflow-ellipsis overflow-hidden"
            title={
              value[header] !== null && value[header].length > 0
                ? value[header].map((val) => `${val.title}`)
                : "-"
            }
          >
            {value[header] !== null && value[header].length > 0
              ? value[header].map((val, index) => (
                  <span key={val.id}>
                    {index === 0 ? "" : ", "}
                    {val.title}
                  </span>
                ))
              : "-"}
          </div>
        </td>
      );
    } else if (multiValue) {
      if (simpleDate)
        return (
          <td className={`p-2 text-[14px] font-normal `} key={headerIndex}>
            {multiValue.map((innerHeader, index) => (
              <div
                className={`${index === 1 ? "text-gray-500" : ""}`}
                key={index}
              >
                {innerHeader === "created_at" ||
                innerHeader === "last_edited_at"
                  ? convertDate(value[innerHeader].split(" ")[0])
                  : value[innerHeader]}
              </div>
            ))}
          </td>
        );
      else
        return (
          <td className={`p-2 text-[14px] font-normal `} key={headerIndex}>
            {multiValue.map((innerHeader, index) => (
              <div
                className={`${
                  value?.status.toLowerCase() === "active" ||
                  !value?.is_scheduled
                    ? "cursor-pointer"
                    : "text-gray-700 cursor-not-allowed"
                } ${index === 1 ? "text-gray-500" : ""}`}
                key={index}
                onClick={() => {
                  if (
                    value.status.toLowerCase() === "active" ||
                    !value?.is_scheduled
                  )
                    setSchedulerOpen(value);
                }}
              >
                {returnScheduledInfo(
                  value["reportSchedulers.custom_schedule"],
                  value["reportSchedulers.scheduled_time"] || [],
                  value["status"].toLowerCase() === "active"
                )}
              </div>
            ))}
          </td>
        );
    } else if (header === "report_name") {
      return (
        <td
          className={`p-2 text-[14px] font-normal `}
          key={headerIndex}
          onMouseEnter={() => handleMouseEnter(value.report_id)}
          onMouseLeave={() => handleMouseLeave(value.report_id)}
        >
          <div
            className={`text-[${color}]  max-w-[90%] cursor-pointer `}
            style={
              isHovered === value?.report_id
                ? { ...underlineStyle, ...styleScheduledInfo }
                : { ...styleScheduledInfo }
            }
            onClick={() => {
              value["edit"] = true;
              history.push(edit_path, value);
            }}
            title={value[header]}
          >
            {/* <DoubleClickLink
              key={headerIndex}
              path={edit_path}
              content={value}
              from={"list"}
            > */}
            {value[header]}
            {/* </DoubleClickLink> */}
          </div>
          {isHovered === value?.report_id && (
            <div className="flex mt-2 items-center text-gray-500 text-[12px]">
              <div
                className="flex text-[#000000] mr-2 cursor-pointer"
                onClick={() => triggerHandler("download", null, value)}
              >
                {/* <img
                  className="w-3 h-4"
                  src={`/assets/images/downloadCustom.svg`}
                  alt="download"
                /> */}
                {loading &&
                loading.buttonFlag == ALL_BUTTON_FLAGS.CUSTOMREPORT &&
                loading.state &&
                value?.report_id == reportId ? (
                  <div className="loadingDownloadListView">
                    <LoaderSpinner />
                  </div>
                ) : (
                  <img
                    className="w-3 h-4"
                    src={`/assets/images/downloadCustom.svg`}
                    alt="download"
                  />
                )}

                <>&nbsp;&nbsp;Download</>
              </div>
              <WhenPermitted platform={permissionPlatform} permission={PERMISSIONS.CUSTOMREPORT}>
              <div
                className="flex text-[#000000] mx-2 cursor-pointer"
                onClick={() => triggerHandler("copy", null, value?.report_id)}
              >
                <img
                  className="w-3 h-4"
                  src={`/assets/images/copyCustom.svg`}
                  alt="copy"
                />
                &nbsp;&nbsp;Copy
              </div>
              <div
                className="flex text-[#000000] mx-2 cursor-pointer"
                onClick={() => triggerHandler("delete", null, value?.report_id)}
              >
                <img
                  className="w-3 h-4"
                  src={`/assets/images/deleteCustom.svg`}
                  alt="delete"
                />
                &nbsp;&nbsp;Delete
              </div>
              </WhenPermitted>
            </div>
          )}
        </td>
      );
    } else if (header === "status") {
      return (
        <td className={`py-2 width`} key={headerIndex}>
          <div className="relative custom-dropdown w-max">
            <div
              className="dropdown-header"
              onClick={() => {
                if (value?.is_scheduled)
                  setActionStatusDropdown(value?.report_id);
              }}
              data-dropdown={true}
            >
              <div
                className={`cursor-pointer py-2 ${
                  actionStatusDropdown === value?.report_id
                    ? "bg-[#F2F2F2] border shadow-l"
                    : ""
                }`}
              >
                <img
                  className={`w-[5.5rem] inline-block align-middle mr-1 cursor-pointer  ${
                    !value?.is_scheduled
                      ? "pointer-events-none opacity-50 grayscale"
                      : ""
                  }`}
                  src={`/assets/images/${
                    value[header].toLowerCase() === "active"
                      ? "activeTag"
                      : "pausedTag"
                  }.svg`}
                  alt="status"
                  data-dropdown={true}
                />
              </div>
            </div>
            <WhenPermitted platform={permissionPlatform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}>
            {actionStatusDropdown === value?.report_id && (
              <ul className="absolute top-10 left-0 z-10 w-full bg-white border shadow-l shadow-lg">
                {renderDropDown(value[header].toLowerCase(), value?.report_id)}
              </ul>
            )}
            </WhenPermitted>
          </div>
        </td>
      );
    } else {
      return (
        <td className={`p-2 text-[14px] font-normal `} key={headerIndex}>
          {value[header]}
        </td>
      );
    }
    // } else return <td>-</td>;
  };

  const renderDropDown = (activeValue, report_id) => {
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

  return (
    <>
      {isScheduledOpen && (
        <SchedulerModal
          content={particularContent}
          schedulerPosition={schedulerPosition}
          color={color}
          permissionPlatform={permissionPlatform}
          setEmailList={(value) =>
            triggerHandler("emails", value, isScheduledOpen)
          }
          setScheduled={() => {
            setContent([]);
            setScheduled(false);
            setSchedulerPosition({
              top: 0,
              left: 0,
            });
          }}
          setConfirmation={setConfirmation}
        />
      )}
      <div
        className="custom-table "
        onScroll={handleScroll}
        style={{
          // height: "calc(100vh - " + height + "px)",
          height: "calc(100vh - " + height + "px)",
          maxHeight: "calc(100vh - " + height + "px)",
          overflowY: "auto",
        }}
        ref={containerRef}
      >
        <table className="w-full " id="list-view-selection">
          <thead className="sticky top-0 left-0 z-[15] bg-[#F3F4F6]">
            <tr className="">
              {listHeader?.map((item) => {
                if (item.showCol)
                  return (
                    <th className="" key={item.report_id}>
                      <div
                        className={
                          "tableHead text-[14px] py-5 px-1.5 pl-[20px]"
                        }
                      >
                        <p className="text-[14px] font-medium">{item.title}</p>
                        {customReportData &&
                          customReportData.length > 0 &&
                          item.show && (
                            <div className={"sortArrow cursor-pointer"}>
                              <div>
                                <div
                                  onClick={() => setSortBy(item?.value, 1)}
                                  style={{
                                    color:
                                      sortBy.key === item.value &&
                                      sortBy.order === 1
                                        ? "black"
                                        : "grey",
                                    marginBottom: 2,
                                  }}
                                >
                                  ▲
                                </div>
                              </div>
                              <div>
                                <div
                                  className="downArrow"
                                  onClick={() => setSortBy(item?.value, -1)}
                                  style={{
                                    color:
                                      sortBy.key === item.value &&
                                      sortBy.order === -1
                                        ? "black"
                                        : "grey",
                                  }}
                                >
                                  ▼
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    </th>
                  );
              })}
            </tr>
          </thead>
          <tbody>
            {customReportData && customReportData.length > 0 ? (
              customReportData?.map((item, index) => (
                // {
                // if (index <= 30)
                // return (
                <tr
                  className="custom-tablecontent h-[64px] max-h-[64px]"
                  key={index}
                >
                  {listHeader.map(
                    (header, headerIndex) =>
                      header.showCol && (
                        <>
                          {valueRenderer(
                            item,
                            header.value,
                            header.multiValue,
                            header.simpleDate,
                            headerIndex
                          )}
                        </>
                      )
                  )}
                </tr>
              ))
            ) : // }

            !loadingState &&
              customReportData &&
              customReportData.length === 0 ? (
              <td
                className="p-2"
                colSpan={10}
                rowSpan={2}
                style={{ alignItems: "center", verticalAlign: "middle" }}
              >
                <div className="loaderStyle row sticky font-semibold">
                  No Data Found
                </div>
              </td>
            ) : null}

            {loadingState && (
              <>
                <td
                  className="p-2"
                  colSpan={16}
                  rowSpan={3}
                  style={{ alignItems: "center", verticalAlign: "middle" }}
                >
                  <div className="loaderStyle p-2 row sticky">
                    <LoaderSpinner />
                  </div>
                </td>
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RecordList;
