/* eslint-disable */
import React, { useState, useReducer, useEffect } from "react";
import _ from "lodash";
import { _POST } from "../../services/axios.method";
import { format } from "date-fns";

import {
  reportState,
  reportCategory,
  stateSetter,
  platformConstant,
  listHeader,
  // DummyValues,
  platformWise,
  providedFilters,
  DummyValues,
} from "./report_constant";
import { defaultDateRange } from "../../utils/helpers";

import CategoryCard from "./CategoryCard";
import RecordGrid from "./RecordGrid.js";
import ComponentHeader from "./ComponentHeader";
import FilterDrawer from "./OffscreenPages/FilterDrawer.js";
import DatePickerModal from "./OffscreenPages/DatePickerModal.js";

import { cancelRequest } from "../../utils/helpers";
import RecordList from "./RecordList.js";
import "./custommain.css";
import Toast from "../common-components/toast";
import { setToastMessageHandler } from "../../redux/action-creator/commonAction";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "./OffscreenPages/ConfirmationModal";
import SchedulePopup from "../Amazon/CustomReportSetting/SchedulePopup";
import {
  generatecustomreport,
  savecustomreport,
} from "../../redux/action-creator/amazon/customreport";
import { useLocation } from "react-router-dom";
import ActionType from "../../redux/types";

// const debounce = (func, delay) => {
//   let timeoutId;
//   return (...args) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => {
//       func(...args);
//     }, delay);
//   };
// };

const messages = {
  emails:
    "Your unsaved changes will be lost. Are you sure you want to proceed?",
  delete: "Are you sure you want to delete this report?",
  copy: "Are you sure you want to duplicate this report?",
  status: "Are you sure you want to update the status for this report?",
};

// function getSchedulerInfo(content) {
//   let data = {
//     emailCounter: 1,
//     validEmail: [],
//     emailArray: [],
//     days: [],
//     frequency: "Daily",
//     startDate: new Date().toISOString().substr(0, 10),
//     time: "0",
//     format: "csv",
//     timeRange: "1",
//     isVisible: true,
//     selectedDays: [],
//   };
//   if (content["reportSchedulers.report_id"] !== null) {
//     console.log(content["reportSchedulers.custom_schedule"].schedule_time);
//     data["emailCounter"] = 1;
//     data["validEmail"] = [];
//     data["emailArray"] = [];
//     data["days"] =
//       content["reportSchedulers.custom_schedule"].custom_type === "Daily"
//         ? []
//         : [] || [];
//     data["frequency"] =
//       content["reportSchedulers.custom_schedule"].custom_type || "Daily";
//     data["startDate"] =
//       content["reportSchedulers.start_date"] ||
//       new Date().toISOString().substr(0, 10);
//     data["time"] = content["reportSchedulers.scheduled_time"] || "0";
//     data["format"] = content["reportSchedulers.report_format"] || "csv";
//     data["timeRange"] = content["reportSchedulers.time_range"] || "1";
//     data["isVisible"] = true;
//     data["selectedDays"] =
//       content["reportSchedulers.custom_schedule"].custom_type === "Daily"
//         ? []
//         : [] || [];
//   }
//   return data;
// }

const CustomReport = () => {
  const location = useLocation();
  // const { generatedreportlist } = useSelector((state) => state.Customreport);

  const dateFilters = defaultDateRange();
  // const platform = JSON.parse(localStorage.getItem("platform_type"));
  const platform = "/" + location?.pathname?.split("/")[1];
  const client_id = localStorage.getItem("client_id");
  const client_name = localStorage.getItem("client_name");
  const initialFilters = reportState[platform];
  const { reportIcon, path, edit_path } = platformWise[platform];
  const typesOfReport = platformConstant[platform]?.reportType;
  const [filters, dispatch] = useReducer(stateSetter, initialFilters);
  const [platformFilters, setPlatformFilters] = useState(providedFilters);
  const [viewMode, setViewMode] = useState("grid"); // Initial view mode is set to grid
  const [sortBy, setSortBy] = React.useState({
    key: "spend",
    order: -1,
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(dateFilters["startDate"]),
    endDate: new Date(dateFilters["endDate"]),
    key: dateFilters["key"],
  });

  const useNewDispatch = useDispatch();
  const [customReportData, setCustomReportData] = useState([]);
  const [dataLimit, setDataLimit] = React.useState(0);
  const [reportId, setReportId] = React.useState(null);
  const [savedDates, setSavedDates] = useState([]);

  const [loading, setLoading] = useState(false);
  const [openFilterDrawer, setFilterDrawer] = useState(false);
  const [actionStatusDropdown, setActionStatusDropdown] = useState(false);
  const [isScheduledOpen, setScheduled] = useState(false);
  const [isConfirmationOpen, setConfirmation] = useState({
    type: undefined,
    option: undefined,
    report_id: undefined,
  });
  const [isOpenScheduler, setSchedulerOpen] = useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [scheduleState, setScheduleState] = React.useState({
    emailArray: [{ id: 1, value: "", error: "" }],
    days: [],
    tempdays: [],
    frequency: "Daily",
    startDate: new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    }),
    time: null,
    format: "csv",
    timeRange: "1",
    isVisible: true,
    selectedDays: [],
    tempselectedDays: [],
  });

  const brands = useSelector((state) => {
    const accounts = _.find(_.get(state, 'AuthReducer.platforms'), ele => ele.platform_value == platform.slice(1));
    if (accounts) {
      const platformValue = accounts.platform_value;
  
      if (platformValue === 'blinkit') {
        return [];
      } else if (platformValue === 'zepto') {
        return _.map(accounts.brands, 'brand_name');
      } else {
        return _.map(accounts.brands, 'brand_id');
      }
    }
    return [];
  });
  useEffect(() => {
    getReportList();
    return () => {};
  }, [filters]);

  useEffect(() => {
    getClientList();
    // loadCompData();

    useNewDispatch({
      type: ActionType.RIGHTPANEL_LIST,
      payload: {
        parameterList: [],
        breakdownList: [],
        showHeader: [],
      },
    });
  }, []);

  const getClientList = async () => {
    try {
      if (filters.category !== "standard") {
        setLoading(true);
        const ourRequest = await cancelRequest();
        const res = await _POST(
          `/${platform.slice(1)}/getClientNames`,
          { filters, platform: platform.slice(1) },
          {
            cancelToken: ourRequest.token,
          }
        );

        if (res?.data.status?.code === 200) {
          setPlatformFilters((prevArray) =>
            prevArray.map((item) =>
              item.id === 3
                ? {
                    ...item,
                    includedFilter: res?.data?.data,
                    searchedValue: res?.data?.data,
                  }
                : item
            )
          );
        } else {
          useNewDispatch(setToastMessageHandler("Something went wrong", false));
        }
        setLoading(false);
      } else {
        setPlatformFilters((prevArray) =>
          prevArray.map((item) =>
            item.id === 3
              ? {
                  ...item,
                  includedFilter: [],
                  searchedValue: [],
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error(error, "testError");
    }
  };

  const getReportList = async () => {
    try {
      if (filters.category !== "standard") {
        setLoading(true);
        const ourRequest = await cancelRequest();
        const res = await _POST(
          `/${platform.slice(1)}/reportList`,
          { filters, platform: platform.slice(1), brands },
          {
            cancelToken: ourRequest.token,
          }
        );

        if (res?.data.status?.code === 200) {
          setCustomReportData(res?.data?.data);
        } else {
          useNewDispatch(setToastMessageHandler("Something went wrong", false));
        }
        setLoading(false);
      } else {
        setCustomReportData([]);
      }
    } catch (error) {
      console.error(error, "testError");
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

  const validation = () => {
    if (scheduleState.time == "" || scheduleState.time === null) {
      setError(true);
      setErrorMessage("Please select time");
      return false;
    }
    if (scheduleState.frequency == "") {
      setError(true);
      setErrorMessage("Please select frequency");
      return false;
    }
    if (
      scheduleState.frequency !== "Daily" &&
      scheduleState.days.length < 1 &&
      scheduleState.selectedDays.length < 1
    ) {
      setError(true);
      setErrorMessage("Please select days/day!");
      // setIsVisible(true);
      setScheduleState({
        ...scheduleState,
        isVisible: true,
      });
      return false;
    }
    if (scheduleState.format == "") {
      setError(true);
      setErrorMessage("Please select format");
      return false;
    }
    const newEmails = scheduleState?.emailArray.map((email) => {
      const error = isValidEmail(email.value)
        ? isDuplicateEmail(email.value)
          ? "Duplicate email address"
          : ""
        : "Invalid email address";
      return { ...email, error };
    });

    setScheduleState({
      ...scheduleState,
      emailArray: newEmails,
    });

    const isValidForm = newEmails.every((email) => email.error === "");

    if (!isValidForm) {
      // Proceed with form submission
      // console.log("Form submitted successfully!", newEmails);
      setError(true);
      // setErrorMessage("Please add atleast 1 email address");
      return false;
    }

    setError(false);
    setErrorMessage("");
    return true;
  };

  const formatSchedule = (frequency) => {
    let val = {};
    if (frequency == "Daily") {
      val.custom_type = frequency;
    }
    if (frequency == "Weekly") {
      val.custom_type = frequency;
      val.schedule_time = scheduleState.selectedDays.map((item) => ({
        custom_day: item,
      }));
    }
    if (frequency == "Monthly") {
      val.custom_type = frequency;
      val.schedule_time = scheduleState.days.map((item) => ({
        custom_day: `${item}`,
      }));
    }
    return val;
  };

  // const handleSelectOption = async (option, report_id) => {
  //   try {
  //     const ourRequest = await cancelRequest();
  //     const res = await _POST(
  //       `/amazon/customReportActionHandler`,
  //       {
  //         data: { status: option },
  //         report_id,
  //         platform: platform.slice(1),
  //         type: "status",
  //       },
  //       {
  //         cancelToken: ourRequest.token,
  //       }
  //     );

  //     if (res?.data?.status?.code === 200) {
  //       setCustomReportData((prevItems) =>
  //         prevItems.map((item) => {
  //           if (item.report_id === report_id) {
  //             return res?.data.data?.updatedRecord;
  //           }
  //           return item;
  //         })
  //       );
  //       setActionStatusDropdown(false);
  //       useNewDispatch(setToastMessageHandler(res?.data?.data?.message, true));
  //     } else {
  //       useNewDispatch(setToastMessageHandler("Something went wrong", false));
  //     }
  //   } catch (error) {
  //     console.error(error, "testError");
  //   }
  // };

  // useEffect(() => {
  //   const delayedGetReportList = debounce(getReportList, 5000); // 5000 milliseconds = 5 seconds
  //   delayedGetReportList();
  // }, [filters.search]);

  const sortData = (item, order) => {
    setCustomReportData([]);
    setSortBy({
      key: item,
      order: order,
    });
    setDataLimit(0);
  };

  const applyDate = (fromFilter) => {
    let data = fromFilter;
    data["ranges"] = {
      startDate: format(dateRange.startDate, "yyyy-MM-dd"),
      endDate: format(dateRange.endDate, "yyyy-MM-dd"),
    };
    dispatch({ type: "QUICK_FILTERS_DATE", value: data });
    setDateRange({
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    });
  };

  const triggerHandler = async (type, option, report_id) => {
    try {
      const ourRequest = await cancelRequest();
      const res = await _POST(
        `/amazon/customReportActionHandler`,
        {
          type,
          platform: platform.slice(1),
          value: option,
          report_id,
        },
        {
          cancelToken: ourRequest.token,
        }
      );

      if (res?.data?.status?.code === 200) {
        if (type === "status" || type === "emails" || type === "scheduler") {
          let id = type === "scheduler" ? report_id?.report_id : report_id;
          setCustomReportData((prevItems) =>
            prevItems.map((item) => {
              if (item.report_id === id) {
                return res?.data.data?.updatedRecord;
              }
              return item;
            })
          );
          if (type === "scheduler") {
            setError(false);
            setErrorMessage("");
            setScheduleState({
              emailCounter: 1,
              validEmail: [],
              emailArray: [],
              days: [],
              frequency: "Daily",
              startDate: new Date().toLocaleDateString("en-CA", {
                timeZone: "Asia/Kolkata",
              }),
              time: null,
              format: "csv",
              timeRange: "1",
              isVisible: true,
              selectedDays: [],
            });
          }
          if (type === "emails") setScheduled(false);

          if (type === "status") setActionStatusDropdown(false);
          const element = document.getElementById("header-custom");
          if (element) {
            element.style.zIndex = "50";
          }
        } else if (type === "delete") {
          setCustomReportData((prevItems) =>
            prevItems.filter((item) => item.report_id !== report_id)
          );
        } else if (type === "copy") {
          console.log(res?.data.data?.updatedRecord);
          setCustomReportData((prevArray) => [
            res?.data.data?.updatedRecord,
            ...prevArray,
          ]);
        }
        useNewDispatch(setToastMessageHandler(res?.data?.data?.message, true));
      } else {
        useNewDispatch(setToastMessageHandler("Something went wrong", false));
      }
    } catch (error) {
      console.error(error, "testError");
    }
  };
  const triggerDownload = async (reportdata) => {
    try {
      dispatch({
        type: ActionType.GENERATEDREPORTLIST,
        payload: [],
      });
      setReportId(reportdata?.report_id);
      let payload = {
        columsData: reportdata.columnsdata,
        platform: reportdata.platform,
        start_date: reportdata.start_date_filter,
        end_date: reportdata.end_date_filter,
        platform_id: reportdata.account,
        download: true,
        ...reportdata.filters,
      };

      let data = await useNewDispatch(generatecustomreport(payload));
      // let data = generatedreportlist;
      // console.log("data>>>>>>>>>>", data);
      if (data.length > 0) {
        const headers = reportdata.columnsdata?.map((data) => data.title);
        const rowsData = reportdata.columnsdata?.map((data) => data.value);
        if (data && data?.length && headers && headers?.length) {
          // Function to convert array of objects to CSV string
          const arrayToCSV = (arr) => {
            const header = headers.join(",");
            const rows = arr.map((row) =>
              rowsData
                .map((fieldName) => {
                  const value = row[fieldName];
                  return value === null || value === undefined
                    ? ""
                    : JSON.stringify(value);
                })
                .join(",")
            );

            return [header, ...rows].join("\n");
          };
          // Process data in chunks
          const CHUNK_SIZE = 1000; // Adjust based on your data size
          let csvContent = "";
          for (let i = 0; i < data.length; i += CHUNK_SIZE) {
            const chunk = data.slice(i, i + CHUNK_SIZE);
            csvContent += arrayToCSV(chunk) + "\n";
          }

          // Create a Blob from the CSV string
          const blob = new Blob(["\ufeff", csvContent], {
            type: "text/csv;charset=utf-8;",
          });

          // Define report name and type
          let report_name = reportdata.report_name;
          let report_type = reportdata.report_type;
          const currentDate = new Date();
          // Format date (example: YYYY-MM-DD)
          const formattedDate = `${currentDate.getFullYear()}-${(
            currentDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${currentDate
            .getDate()
            .toString()
            .padStart(2, "0")}`;

          // Generate a dynamic filename
          const filename = `${report_name}-${report_type}-${formattedDate}.csv`;

          // Generate a URL for the Blob
          const url = URL.createObjectURL(blob);

          // Create a link element
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);

          // Append link to the body (required for Firefox)
          document.body.appendChild(link);
          console.log(link);
          // Programmatically click the link to trigger the download
          link.click();

          // Remove link from the document
          document.body.removeChild(link);
          useNewDispatch(
            setToastMessageHandler("Report downloaded Successfully", true)
          );
        }
      } else {
        useNewDispatch(
          setToastMessageHandler("No data found in report", false)
        );
      }
      setReportId(null);
    } catch (error) {
      setReportId(null);

      console.error(error, "testError");
    }
  };

  const postScheduleData = () => {
    // eslint-disable-next-line no-console
    if (!validation()) {
      return;
    }

    let payload = {
      schedule: "Custom", // to discuss
      media_type: platform.slice(1),
      report_format: scheduleState.format,
      start_date: scheduleState.startDate,
      scheduled_time: scheduleState.time,
      frequency: scheduleState.frequency,
      time_range: scheduleState.timeRange,
      custom_schedule: formatSchedule(scheduleState.frequency),
      emails: scheduleState.emailArray.map((val) => val.value),
      emailCounter: scheduleState.emailCounter,
      validEmail: scheduleState.validEmail,
      created_by: client_name,
      client_id: client_id,
      execution_status: "inProgress",
      entity: "Campaign",
      is_scheduled: true,
    };
    triggerHandler("scheduler", payload, isOpenScheduler);
    setSchedulerOpen(false);
  };

  // const loadCompData = async () => {
  //   try {
  //     const post = {
  //       platform: platform.slice(1),
  //     };
  //     const res = await _POST("/flipkart/allcomparisonDate", post);
  //     setSavedDates({ ...res?.data?.data?.result });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  React.useEffect(() => {
    // console.log("debugerrr scheduleState", scheduleState);
  }, [scheduleState]);

  const schedulerOpen = (content) => {
    setError(false);
    setErrorMessage("");
    let emailArray = [{ id: 1, value: "", error: "" }];
    if (
      content?.["reportSchedulers.emails"] &&
      content?.["reportSchedulers.emails"].length > 0
    ) {
      emailArray = content?.["reportSchedulers.emails"].map((val, index) => ({
        id: index + 1,
        value: val,
        error: "",
      }));
    }
    setScheduleState({
      ...scheduleState,

      startDate: content?.["reportSchedulers.start_date"]
        ? content?.["reportSchedulers.start_date"]
        : new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
      time: content?.["reportSchedulers.scheduled_time"]
        ? content?.["reportSchedulers.scheduled_time"]
        : null,
      frequency:
        content?.["reportSchedulers.custom_schedule"] &&
        content?.["reportSchedulers.custom_schedule"]["custom_type"]
          ? content?.["reportSchedulers.custom_schedule"]["custom_type"]
          : "Daily",
      timeRange: content?.["reportSchedulers.time_range"]
        ? content?.["reportSchedulers.time_range"]
        : "1",
      format: content?.["reportSchedulers.report_format"]
        ? content?.["reportSchedulers.report_format"]
        : "csv",
      emailArray: emailArray,
      emailCounter: content?.["reportSchedulers.emails"]?.length
        ? content?.["reportSchedulers.emails"]?.length
        : 1,
      selectedDays:
        content?.["reportSchedulers.custom_schedule"] &&
        content?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        content?.["reportSchedulers.custom_schedule"]["custom_type"] == "Weekly"
          ? content?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => data.custom_day
            )
          : [],
      tempselectedDays:
        content?.["reportSchedulers.custom_schedule"] &&
        content?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        content?.["reportSchedulers.custom_schedule"]["custom_type"] == "Weekly"
          ? content?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => data.custom_day
            )
          : [],
      days:
        content?.["reportSchedulers.custom_schedule"] &&
        content?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        content?.["reportSchedulers.custom_schedule"]["custom_type"] ==
          "Monthly"
          ? content?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => Number(data.custom_day)
            )
          : [],
      tempdays:
        content?.["reportSchedulers.custom_schedule"] &&
        content?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        content?.["reportSchedulers.custom_schedule"]["custom_type"] ==
          "Monthly"
          ? content?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => Number(data.custom_day)
            )
          : [],
    });
    setSchedulerOpen(content);
  };

  return (
    <>
      <Toast />
      <div id="main-custom-container">
        {openFilterDrawer && (
          <FilterDrawer
            setFilterDrawer={() => setFilterDrawer(false)}
            platformFilters={platformFilters}
            setPlatformFilters={setPlatformFilters}
            filters={filters["quickFilters"]}
            calendar={filters["calendar"]}
            setQuickFilter={(value) =>
              dispatch({ type: "QUICK_FILTERS", value })
            }
            color={initialFilters?.color}
            platform={platform.slice(1)}
          />
        )}
        {isOpenScheduler && (
          // <></>
          <SchedulePopup
            error={error}
            edit={true}
            setError={setError}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            setOpenState={setSchedulerOpen}
            setScheduleState={setScheduleState}
            scheduleState={scheduleState}
            postScheduleData={postScheduleData}
            color={initialFilters?.color}
            platform={platform.slice(1)}
            permissionPlatform={_.trimStart(platform, '/')}
          />
        )}
        {isConfirmationOpen?.type && (
          <ConfirmationModal
            message={messages[isConfirmationOpen?.type]}
            color={initialFilters?.color}
            isConfirmationOpen={isConfirmationOpen}
            onConfirm={(e) => {
              const element = document.getElementById("header-custom");
              if (element) {
                element.style.zIndex = "50";
              }
              if (isConfirmationOpen?.type === "emails") {
                setConfirmation(e);
                setScheduled(false);
              } else {
                const { type, option, report_id } = isConfirmationOpen;
                triggerHandler(type, option, report_id);
                setConfirmation(e);
              }
            }}
            onCancel={(e) => setConfirmation(e)}
          />
        )}
        {filters?.calendar?.showCalendar && (
          <DatePickerModal
            setQuickFilter={(value) =>
              dispatch({ type: "QUICK_FILTERS", value })
            }
            calendar={filters["calendar"]}
            dateRange={dateRange}
            setDateRange={(item) => setDateRange(item?.selection)}
            color={initialFilters?.color}
            savedDates={savedDates}
            onCancel={() =>
              setDateRange({
                startDate: new Date(dateFilters["startDate"]),
                endDate: new Date(dateFilters["endDate"]),
                key: dateFilters["key"],
              })
            }
            component={"custom-report"}
            applyDate={applyDate}
          />
        )}
        <div
          className={` ${
            filters?.calendar.showCalendar || isScheduledOpen
              ? "z-0"
              : "z-40 sticky"
          } top-14 bg-bgclr`}
        >
          <div className="custom-card flex py-4 bg-white color-[#303030]">
            <b className="font-inter font-bold text-[16px] leading-6">
              Manage Reports
            </b>
          </div>

          <div className="custom-card flex py-3 bg-white z-[10]">
            <ComponentHeader
              filters={filters}
              reportCategory={reportCategory}
              setCategory={(value) => dispatch({ type: "CATEGORY", value })}
              setSearch={(value) => dispatch({ type: "SEARCH", value })}
              viewMode={viewMode}
              platform={platform}
              setViewMode={(mode) => {
                if (mode !== viewMode) {
                  setViewMode(mode);
                  setActionStatusDropdown(false);
                }
              }}
              color={initialFilters?.color}
              setFilterDrawer={(val) => setFilterDrawer(val)}
            />
          </div>
        </div>
        <section>
          <div className=" bg-bgclr z-10 mb-4">
            <CategoryCard
              typesOfReport={typesOfReport}
              color={initialFilters?.color}
              path={path}
            />
          </div>
          <div className={`${viewMode === "list" ? "bg-white p-3 " : ""}`}>
            {viewMode === "grid" ? (
              <RecordGrid
                platform={platform}
                permissionPlatform={_.trimStart(platform, '/')}
                customReportData={customReportData}
                reportIcon={reportIcon}
                reportId={reportId}
                loadingState={loading}
                color={initialFilters?.color}
                actionStatusDropdown={actionStatusDropdown}
                setActionStatusDropdown={(report_id) => {
                  if (report_id === actionStatusDropdown) {
                    setActionStatusDropdown(false);
                  } else {
                    setActionStatusDropdown(report_id);
                  }
                }}
                // handleSelectOption={handleSelectOption}
                triggerHandler={(type, option, report_id) => {
                  if (type === "download") {
                    triggerDownload(report_id);
                  } else if (type === "emails") {
                    triggerHandler(type, option, report_id);
                  } else {
                    setConfirmation({ type, option, report_id });
                  }
                }}
                isScheduledOpen={isScheduledOpen}
                setScheduled={(e) => {
                  console.log(e);
                  setScheduled(e);
                }}
                setConfirmation={setConfirmation}
                setSchedulerOpen={(content) => {
                  // console.log("debugerrr content", content);
                  schedulerOpen(content);
                }}
                edit_path={edit_path}
              />
            ) : (
              <RecordList
                listHeader={listHeader}
                permissionPlatform={_.trimStart(platform, '/')}
                reportId={reportId}
                sortBy={sortBy}
                setSortBy={(key, order) => sortData(key, order)}
                setDataLimit={setDataLimit}
                dataLimit={dataLimit}
                customReportData={customReportData}
                loadingState={loading}
                color={initialFilters?.color}
                actionStatusDropdown={actionStatusDropdown}
                setActionStatusDropdown={(report_id) => {
                  if (report_id === actionStatusDropdown) {
                    setActionStatusDropdown(false);
                  } else {
                    setActionStatusDropdown(report_id);
                  }
                }}
                // handleSelectOption={handleSelectOption}
                // triggerHandler={(type, option, report_id) => {
                //   if (type === "download" || type === "emails")
                //     triggerHandler(type, option, report_id);
                //   else {
                //     setConfirmation({ type, option, report_id });
                //   }
                // }}
                triggerHandler={(type, option, report_id) => {
                  if (type === "download") {
                    triggerDownload(report_id);
                  } else if (type === "emails") {
                    triggerHandler(type, option, report_id);
                  } else {
                    setConfirmation({ type, option, report_id });
                  }
                }}
                isScheduledOpen={isScheduledOpen}
                setScheduled={(e) => {
                  console.log(e);
                  setScheduled(e);
                }}
                setConfirmation={setConfirmation}
                setSchedulerOpen={(content) => {
                  schedulerOpen(content);
                }}
                platform={platform}
                edit_path={edit_path}
              />
            )}
          </div>
        </section>

        <tfoot>
          <div className="flex"></div>
        </tfoot>
      </div>
    </>
  );
};
export default CustomReport;
