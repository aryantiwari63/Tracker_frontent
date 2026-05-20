import React, { useRef } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import CustomReportHeader from "./CustomReportHeader";
import CustomReportType from "./CustomReportType";
import { useLocation, useHistory } from "react-router-dom";
import CustomReportSearch from "./CustomReportSearch";
import Toast from "../../common-components/toast";
import { useDispatch, useSelector } from "react-redux";
// import { addDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import {
  generatecustomreport,
  // generatecustomreport,
  savecustomreport,
  updatecustomreport,
} from "../../../redux/action-creator/amazon/customreport";
import { convertDate, defaultDateRange } from "../../../utils/helpers";
import { APPLICATION_ROUTES } from "../../../utils/constants";
import { platformWise } from "../../CustomReport/report_constant";
import { customreport } from "../../../redux/action-creator/amazon/customreport";
import ActionType from "../../../redux/types";

import "./styles.css";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction";

// import ActionType from "../../../redux/types";

// function isObject(value) {
//   return value !== null && typeof value === "object";
// }
const CustomReportSetting = () => {
  const location = useLocation();
  const history = useHistory();
  let color = {
    amazon: "#EF880F",
    blinkit: "#11B07A",
    instamart: "#851853",
    // instamart: "#963C71",
    zepto: "#3C006B",
    flipkart: "#0081F7",
  };
  let platform = location?.pathname?.split("/")[1];

  const [reportType, setReportType] = React.useState("");
  const [showDialog, setShowDialog] = React.useState(false);

  const rightPanelRef = useRef();
  // platform = platform.slice(1);

  // let reportType = location?.state;
  const state = location.state;
  // console.log("state>>>>>>>>>>>", state);
  // Destructure the state object and set default values if keys are not present
  if (!state) {
    history.push(`/${platform}/customreport`);
  }

  let { reportTypeValue, edit } = state || {};
  React.useLayoutEffect(() => {
    if (edit) {
      setReportType(state.report_type);
    } else {
      setReportType(reportTypeValue);
    }
  }, []);

  // eslint-disable-next-line no-console

  // let edit = false;
  // if (isObject(reportType)) {
  //   reportType = reportType?.report_type;
  //   // edit = reportType?.edit;
  // }
  const dispatch = useDispatch();
  // if (!platform || !reportType) {
  //   history.go(-1);
  // }

  const client_id = localStorage.getItem("client_id");
  const client_name = localStorage.getItem("client_name");
  const [platformId, setPlatformId] = React.useState([]);
  const [filters, setFilters] = React.useState({
    ...platformWise[platform]?.filters,
  });

  const [prefilledfilters, setPrefilledfilters] = React.useState({});
  const [defaultFilterValue, setDefaultFilterValue] = React.useState("{}");

  const [header, setHeader] = React.useState([]);
  const [showHeader, setShowHeader] = React.useState([]);
  const [firstInitialized, setFirstInitialized] = React.useState(true);
  const dateFilters = defaultDateRange();

  const [dateRange, setDateRange] = React.useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]);
  const [tempDate, setTempDate] = React.useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]);

  const [reportname, setReportname] = React.useState("");
  const [reportnamerror, setReportnameError] = React.useState("");
  const [errorInName, setErrorInName] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [scheduleInfo, setScheduleInfo] = React.useState({
    is_scheduled: false,
  });
  const [customMetric, setCustomMetric] = React.useState(false);
  const [enableButton, setEnableButton] = React.useState(true);
  const [toggle, setToggle] = React.useState("breakdown");
  const [disabledData, setDisabledData] = React.useState([]);
  const [filterAccount, setFilterAccount] = React.useState([]);
  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [reportData, setReportData] = React.useState([]);

  const [accountLoading, setAccountLoading] = React.useState(true);

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
    tempDays: [],
  });
  const [afterScheduleState, setAfterScheduleState] = React.useState({
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
  const { rightPanelList, loading_custom } = useSelector(
    (state) => state.Customreport
  );
  const { parameterList, breakdownList, accepetedParameter } = rightPanelList;
  let list = toggle === "breakdown" ? breakdownList : parameterList;
  let length;
  if (list) length = list.filter((val) => val.show_column)?.length;

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
    setAfterScheduleState({
      ...scheduleState,
    });
    setError(false);
    setErrorMessage("");
    // setIsScheduled();

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

  const postScheduleData = async () => {
    if (!validation()) {
      return;
    }
    let post = {
      schedule: "Custom", // to discuss
      media_type: platform,
      report_format: scheduleState.format,
      start_date: scheduleState.startDate,
      scheduled_time: scheduleState.time,
      frequency: scheduleState.frequency,
      time_range: scheduleState.timeRange,
      custom_schedule: formatSchedule(scheduleState.frequency),
      emails: scheduleState?.emailArray.map((val) => val.value),

      created_by: client_name,
      client_id: client_id,
      execution_status: "inProgress",
      entity: "Campaign",
      is_scheduled: true,
      forSettingIn: true,
    };
    // eslint-disable-next-line no-console
    console.log("scheduleState post", post);
    setScheduleInfo(post);

    // await _POST(AMAZON_SCHEDULE_DATA, post);
    setIsOpen(false);
  };

  const saveCustomReport = () => {
    // eslint-disable-next-line no-console
    console.log("scheduleState saveCustomReport");
    if (reportname == "") {
      setReportnameError("Report Name is required");
    } else if (errorInName) {
      setErrorInName(true);
    } else {
      let payload = {
        name: reportname,
        report_id: uuidv4(),
        is_scheduled: scheduleInfo.is_scheduled,
        reportType: reportType,
        platform: platform,
        reportInfo: {
          columnsData: showHeader,
          platform: platform,
          start_date_filter: convertDate(dateRange[0].startDate),
          end_date_filter: convertDate(dateRange[0].endDate),
          platform_id: platform != "blinkit" ? platformId : null,
          filters: filters,
          prefilledfilters: prefilledfilters,
        },
        scheduleInfo: scheduleInfo,
      };
      dispatch(setToastMessageHandler("Report Saved Successfully", true));
      dispatch(
        savecustomreport(payload, () => {
          let route = platform.toUpperCase() + "CUSTOMREPORT";
          history.push(APPLICATION_ROUTES[route]);
        })
      );
    }
  };
  const updateCustomReport = () => {
    setShowDialog(false);

    if (reportname == "") {
      setReportnameError("Report Name is required");
    } else if (errorInName) {
      setErrorInName(true);
    } else {
      let payload = {
        name: reportname,
        report_id: state?.report_id,
        is_scheduled: scheduleInfo.is_scheduled,
        existingreport: state?.["reportSchedulers.id"] ? true : false,
        reportType: reportType,
        platform: platform,
        reportInfo: {
          columnsData: showHeader,
          platform: platform,
          start_date_filter: convertDate(dateRange[0].startDate),
          end_date_filter: convertDate(dateRange[0].endDate),
          platform_id: platform != "blinkit" ? platformId : null,
          filters: filters,
          prefilledfilters: prefilledfilters,
        },
        scheduleInfo: scheduleInfo,
        forSettingIn: scheduleInfo.forSettingIn,
      };
      dispatch(setToastMessageHandler("Report Updated Successfully", true));
      dispatch(
        updatecustomreport(payload, () => {
          let route = platform.toUpperCase() + "CUSTOMREPORT";
          history.push(APPLICATION_ROUTES[route]);
        })
      );
    }
  };

  React.useEffect(() => {
    if (reportType !== "") {
      if (reportType === "blank") {
        let reportType = "blank";
        if (header && header.length > 0) {
          let newheader = header?.filter(
            (data) =>
              data?.type === "breakdown" &&
              !["periodic_group_daily", "hard_coded_tag"].includes(data.id)
          );
          if (newheader && newheader?.length) {
            reportType = newheader[newheader?.length - 1]["entity_name"];
          }
        }
        // eslint-disable-next-line no-console
        // console.log("debugerrr", reportType, header);

        // eslint-disable-next-line no-console

        dispatch(customreport({ platform, type: toggle, reportType }));
      } else {
        dispatch(customreport({ platform, type: toggle, reportType }));
      }
    }
  }, [toggle, customMetric, reportType]);
  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("debugerrr header", header);
  // }, [header]);

  const forScheduler = () => {
    let emailArray = [{ id: 1, value: "", error: "" }];
    if (
      state?.["reportSchedulers.emails"] &&
      state?.["reportSchedulers.emails"].length > 0
    ) {
      emailArray = state?.["reportSchedulers.emails"].map((val, index) => ({
        id: index + 1,
        value: val,
        error: "",
      }));
    }
    setAfterScheduleState({
      ...afterScheduleState,

      startDate: state?.["reportSchedulers.start_date"]
        ? state?.["reportSchedulers.start_date"]
        : new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
      time: state?.["reportSchedulers.scheduled_time"]
        ? state?.["reportSchedulers.scheduled_time"]
        : null,
      frequency:
        state?.["reportSchedulers.custom_schedule"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"]
          ? state?.["reportSchedulers.custom_schedule"]["custom_type"]
          : "Daily",
      timeRange: state?.["reportSchedulers.time_range"]
        ? state?.["reportSchedulers.time_range"]
        : "1",
      format: state?.["reportSchedulers.report_format"]
        ? state?.["reportSchedulers.report_format"]
        : "csv",
      emailArray: emailArray,

      selectedDays:
        state?.["reportSchedulers.custom_schedule"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] == "Weekly"
          ? state?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => data.custom_day
            )
          : [],
      tempselectedDays:
        state?.["reportSchedulers.custom_schedule"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] == "Weekly"
          ? state?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => data.custom_day
            )
          : [],
      days:
        state?.["reportSchedulers.custom_schedule"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] == "Monthly"
          ? state?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => Number(data.custom_day)
            )
          : [],
      tempdays:
        state?.["reportSchedulers.custom_schedule"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] == "Monthly"
          ? state?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => Number(data.custom_day)
            )
          : [],
    });
    setScheduleState({
      ...scheduleState,

      startDate: state?.["reportSchedulers.start_date"]
        ? state?.["reportSchedulers.start_date"]
        : new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
      time: state?.["reportSchedulers.scheduled_time"]
        ? state?.["reportSchedulers.scheduled_time"]
        : null,
      frequency:
        state?.["reportSchedulers.custom_schedule"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"]
          ? state?.["reportSchedulers.custom_schedule"]["custom_type"]
          : "Daily",
      timeRange: state?.["reportSchedulers.time_range"]
        ? state?.["reportSchedulers.time_range"]
        : "1",
      format: state?.["reportSchedulers.report_format"]
        ? state?.["reportSchedulers.report_format"]
        : "csv",
      emailArray: emailArray,

      selectedDays:
        state?.["reportSchedulers.custom_schedule"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] == "Weekly"
          ? state?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => data.custom_day
            )
          : [],
      tempselectedDays:
        state?.["reportSchedulers.custom_schedule"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] == "Weekly"
          ? state?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => data.custom_day
            )
          : [],
      days:
        state?.["reportSchedulers.custom_schedule"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] == "Monthly"
          ? state?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => Number(data.custom_day)
            )
          : [],
      tempdays:
        state?.["reportSchedulers.custom_schedule"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] &&
        state?.["reportSchedulers.custom_schedule"]["custom_type"] == "Monthly"
          ? state?.["reportSchedulers.custom_schedule"]["schedule_time"]?.map(
              (data) => Number(data.custom_day)
            )
          : [],
    });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (edit) {
        setReportname(state?.report_name);
        setFilterAccount(state?.account);
        if (state?.columnsdata && state?.columnsdata?.length) {
          let seenValues = new Set();
          let filteredData = state?.columnsdata.filter((item) => {
            if (seenValues.has(item.value)) {
              return false;
            } else {
              seenValues.add(item.value);
              return true;
            }
          });
          setHeader(filteredData);
          setShowHeader(filteredData);

          let payload = {
            columsData: filteredData,
            platform: state?.platform,
            start_date: state?.start_date_filter,
            end_date: state?.end_date_filter,
            platform_id: state?.account,
            download: false,
            dataLIMIT: dataLIMIT,
            ...state?.filters,
          };
          dispatch({
            type: ActionType.GENERATEDREPORTLIST,
            payload: [],
          });
          dispatch({
            type: ActionType.GENERATEDREPORTLISTTOTALDATA,
            payload: null,
          });
          // dispatch(generatecustomreport(payload));
          try {
            // eslint-disable-next-line no-console
            // console.log("debugerrr 1");

            let data = await dispatch(generatecustomreport(payload));
            if (data && data?.length) {
              setReportData([...data]);
            }
          } catch (error) {
            setReportData([]);
            console.error("Failed to generate custom report:", error);
          }
        }
        setFilters(state?.filters);
        // setPrefilledfilters(state?.prefilledfilters);
        setDefaultFilterValue(JSON.stringify(state?.prefilledfilters));
        let prefilledDate = [
          {
            startDate: new Date(state?.start_date_filter),
            endDate: new Date(state?.end_date_filter),
            key: "selection",
          },
        ];

        setDateRange(prefilledDate);
        setTempDate(prefilledDate);
        setScheduleInfo({ is_scheduled: state?.is_scheduled });
        forScheduler();

        // eslint-disable-next-line no-console
        // console.log("debugerrr 1", prefilledDate);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (isOpen) setScheduleState({ ...afterScheduleState });
  }, [isOpen]);

  React.useEffect(() => {
    setEnableButton(false);
    setDataLIMIT(0);
  }, [dateRange[0], platformId, header, filters]);
  const { generatedreportlisttotaldata } = useSelector(
    (state) => state.Customreport
  );

  React.useEffect(() => {
    const fetchData = async () => {
      if (dataLIMIT) {
        let breakdownItems = header.filter((item) => item.type === "breakdown");
        let search_term_included =
          breakdownItems.length === 1 &&
          breakdownItems[0].value === "search_term";
        let limit;
        if (search_term_included) {
          limit = 1;
        } else {
          limit = 3;
        }
        const totalPages = Math.ceil(generatedreportlisttotaldata / limit);
        const currentPage = Math.floor(dataLIMIT / limit) + 1;
        if (currentPage <= totalPages) {
          let payload = {
            columsData: header,
            platform: platform,
            start_date: convertDate(dateRange[0].startDate),
            end_date: convertDate(dateRange[0].endDate),
            platform_id: platformId,
            dataLIMIT: dataLIMIT,
            ...filters,
          };

          try {
            let data = await dispatch(generatecustomreport(payload));
            if (data && data?.length) {
              setReportData((prevData) => [...prevData, ...data]);
            }
          } catch (error) {
            console.error("Failed to generate custom report:", error);
          }
        }
      }
    };

    fetchData();
  }, [dataLIMIT]);
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log("debugerrr filters", filters);
  }, [filters]);

  return (
    <>
      <Toast />
      <div className="row " id="main-custom-container">
        <div className="custom-card flex py-3 bg-white">
          <CustomReportType
            errorInName={errorInName}
            reportType={reportType}
            edit={edit}
            platform={platform}
            color={color[platform]}
            saveCustomReport={saveCustomReport}
            updateCustomReport={updateCustomReport}
            setShowDialog={setShowDialog}
            showDialog={showDialog}
          />
        </div>
        <div className="custom-card flex py-3 bg-white">
          <CustomReportHeader
            setReportname={setReportname}
            edit={edit}
            state={state}
            reportname={reportname}
            errorInName={errorInName}
            setErrorInName={setErrorInName}
            setReportnameError={setReportnameError}
            reportnameerror={reportnamerror}
            reportType={reportType}
            dateRange={dateRange}
            tempDate={tempDate}
            setTempDate={setTempDate}
            setDateRange={setDateRange}
            platform={platform}
            color={color[platform]}
            error={error}
            setError={setError}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setScheduleState={setScheduleState}
            scheduleState={scheduleState}
            afterScheduleState={afterScheduleState}
            postScheduleData={postScheduleData}
          />
        </div>

        <div className="custom-card flex py-3 bg-white">
          <CustomReportSearch
            reportType={reportType}
            edit={edit}
            filterAccount={filterAccount}
            setPlatformId={setPlatformId}
            platformId={platformId}
            filters={filters}
            prefilledfilters={prefilledfilters}
            defaultFilterValue={defaultFilterValue}
            setPrefilledfilters={setPrefilledfilters}
            setFilters={setFilters}
            platform={platform}
            header={header.filter((val) => {
              if (val.type === "breakdown") return val.value;
            })}
            color={color[platform]}
            setAccountLoading={setAccountLoading}
          />
        </div>

        <div className="col pr-3 w-[75%]">
          <LeftPanel
            showHeader={showHeader}
            setShowHeader={setShowHeader}
            setDataLIMIT={setDataLIMIT}
            dataLIMIT={dataLIMIT}
            reportData={reportData}
            platform={platform}
          />
        </div>
        <div
          ref={rightPanelRef}
          className="rounded-md w-[25%] bg-[#f8f8f8] "
          style={{
            height:
              "calc(100vh - " +
              rightPanelRef.current?.getBoundingClientRect().top +
              "px)",
            maxHeight:
              "calc(100vh - " +
              rightPanelRef.current?.getBoundingClientRect().top +
              "px)",
            overflowY: "auto",
          }}
        >
          <RightPanel
            edit={edit}
            setEnableButton={setEnableButton}
            enableButton={enableButton}
            setPlatformId={setPlatformId}
            platformId={platformId}
            dateRange={dateRange}
            setDateRange={setDateRange}
            showHeader={showHeader}
            setShowHeader={setShowHeader}
            reportType={reportType}
            platform={platform}
            color={color[platform]}
            filters={filters}
            setFilters={setFilters}
            setHeader={setHeader}
            header={header}
            setFirstInitialized={setFirstInitialized}
            firstInitialized={firstInitialized}
            customMetric={customMetric}
            setCustomMetric={setCustomMetric}
            toggle={toggle}
            setToggle={setToggle}
            parameterList={parameterList}
            breakdownList={breakdownList}
            list={list}
            loading_custom={loading_custom}
            length={length}
            setDisabledData={setDisabledData}
            disabledData={disabledData}
            reportname={reportname}
            accepetedParameter={accepetedParameter}
            dataLIMIT={dataLIMIT}
            setReportData={setReportData}
            accountLoading={accountLoading}
          />
        </div>
      </div>
    </>
  );
};

export default CustomReportSetting;
