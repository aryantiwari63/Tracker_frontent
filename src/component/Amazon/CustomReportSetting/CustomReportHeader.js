/* eslint-disable */
import React from "react";
import DatePicker from "../../DatePicker";
import { cancelRequest, defaultDateRange } from "../../../utils/helpers";
import SchedulePopup from "./SchedulePopup";
import { useSelector } from "react-redux";
import { _POST } from "../../../services/axios.method";
import { useLocation } from "react-router-dom";
import { ringThemeObj } from "../../../style/StyleConstants";

const CustomReportHeader = ({
  reportType,
  dateRange,
  setDateRange,
  color,
  platform,
  setReportname,
  reportname,
  error,
  setError,
  errorMessage,
  setErrorMessage,
  isOpen,
  setIsOpen,
  setScheduleState,
  scheduleState,
  postScheduleData,
  setReportnameError,
  reportnameerror,
  tempDate,
  setTempDate,
  edit,
  afterScheduleState,
  state,
  errorInName,
  setErrorInName,
}) => {
  const [callApi, setCallApi] = React.useState(false);
  const [resetData, setResetData] = React.useState(false);

  const [calState, setCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });

  // const [dateRange, setDateRange] = React.useState([
  //   {
  //     startDate: addDays(new Date(), -30),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);
  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("debugerrr scheduleState", scheduleState);
  // }, [scheduleState]);

  async function onChangeDate(item) {
    // defaultDateRange(item.selection); //For Local storage
    // setDateRange([item.selection]);
    // let dateRange = {};
    // if (dateRange) {
    //   dateRange = dateRange[0];
    // }
    setTempDate([{ ...dateRange[0], ...item.selection }]);
    if (!calState.fullCalender) {
      defaultDateRange(item.selection);
      setDateRange([{ ...dateRange[0], ...item.selection }]);

      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
    }
  }
  const applyDate = async () => {
    setDateRange(tempDate);
    defaultDateRange(tempDate[0]);
    await onChangeDate({ selection: tempDate[0] });

    setCalState({
      ...calState,
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
  };

  React.useEffect(() => {
    if (
      callApi &&
      !calState.showCalender &&
      !calState.fullCalender &&
      calState.dateApplied
    ) {
      // campaignReportApi();
    }
  }, [calState]);
  const { generatedreportlist } = useSelector((state) => state.Customreport);
  const cancelDate = () => {
    // this.setState({ tempDate: this.state.dateRange });
    setTempDate(dateRange);
  };
  const checkIfNameExist = async (value) => {
    setReportname(value.target.value);
    setReportnameError("");
    setErrorInName(false);
    let data = value.target.value;

    const ourRequest = await cancelRequest();
    let payload = {
      reportname: data.trim(),
      platform: platform,
      exist: false,
    };

    if (edit) {
      payload["reportId"] = state?.report_id;
      payload["exist"] = true;
    }
    const res = await _POST("/amazon/checkReportName", payload, {
      cancelToken: ourRequest.token,
    });
    if (res?.data?.data) {
      if (res?.data?.data?.isExist?.length > 0) setErrorInName(true);
    }
  };

  return (
    <>
      <div className="col">
        <div className="row">
          <div className="w-[50%]">
            {/* <b className="font-inter font-bold text-14">
              <span>
                {reportType?.charAt(0)?.toUpperCase() + reportType?.slice(1)} |
                Schedule at: _ _
              </span>
            </b> */}
            {/* {console.log(platform)} */}
            <input
              className={`border px-2 py-1 rounded-md ${ringThemeObj[platform]}`}
              type="text"
              name="report_name"
              id="report_name"
              placeholder="Enter Report Name"
              onChange={checkIfNameExist}
              value={reportname}
              // onFocus={() => setErrorInName(false)}
            />
            {reportnameerror ? (
              <p className="errorText">{reportnameerror}</p>
            ) : (
              ""
            )}
            {errorInName ? (
              <p className="errorText">This name already exist</p>
            ) : (
              ""
            )}
          </div>
          <div className="w-[50%]">
            <div className="flex justify-end space-x-4">
              <div className="w-[100%]">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className={`customreportschedule__btn ${platform}-button font-medium`}
                    onClick={() => setIsOpen(true)}
                    disabled={
                      generatedreportlist && generatedreportlist?.length == 0
                    }
                    // style={{ background: color }}
                  >
                    {afterScheduleState && afterScheduleState.time !== null
                      ? `Schedule on ${afterScheduleState.startDate} at 
                      ${afterScheduleState.time}:00`
                      : "Schedule"}
                  </button>

                  <div
                    className="customreport__calander"
                    style={{ width: "max-content", paddingRight: 0 }}
                  >
                    <DatePicker
                      onChangeDate={onChangeDate}
                      applyDate={applyDate}
                      cancelDate={cancelDate}
                      dashboard={"dashboard"}
                      state={tempDate}
                      setState={setDateRange}
                      calState={calState}
                      setCalState={setCalState}
                      positionLeft="calLeft"
                      platform={platform === "amazon" ? "ams" : platform}
                      component={"custom-report"}
                      className="border"
                    />
                  </div>
                  {isOpen && (
                    <SchedulePopup
                      error={error}
                      edit={edit}
                      setError={setError}
                      errorMessage={errorMessage}
                      setErrorMessage={setErrorMessage}
                      setOpenState={setIsOpen}
                      setScheduleState={setScheduleState}
                      scheduleState={scheduleState}
                      postScheduleData={postScheduleData}
                      color={color}
                      platform={platform}
                      permissionPlatform={platform}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CustomReportHeader;
