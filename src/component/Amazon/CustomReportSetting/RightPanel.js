import React, { useState } from "react";
// import ToggleButton from "../../common-components/toggle-button";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { generatecustomreport } from "../../../redux/action-creator/amazon/customreport";
// import NavButton from "./NavButton";
import { platformWise } from "../../CustomReport/report_constant";
import ListingCustomRight from "./ListingCustomRight";
import CustomMetric from "./CustomMetric";
import ActionType from "../../../redux/types";
import { convertDate } from "../../../utils/helpers";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction";
import { PERMISSIONS } from "../../../utils/constants";
// import LoaderSpinner from "../../common-components/loader-spinner";

const RightPanel = ({
  reportType,
  platform,
  color,
  setShowHeader,
  platformId,
  dateRange,
  filters,
  setHeader,
  header,
  firstInitialized,
  setFirstInitialized,
  customMetric,
  setCustomMetric,
  toggle,
  setToggle,
  parameterList,
  breakdownList,
  list,
  loading_custom,
  length,
  setDisabledData,
  disabledData,
  setEnableButton,
  enableButton,
  reportname,
  accepetedParameter,
  dataLIMIT,
  setReportData,
  accountLoading,
  edit,
}) => {
  // const { generatedreportlist } = useSelector((state) => state.Customreport);
  // let headersLength = header.filter(
  //   (val) => val.type === "breakdown" && val.id !== "hard_coded_periodic"
  // );
  // console.log("length>>>>>>>>", headersLength.length);
  // let firstInitialized = false;
  // console.log(
  //   "parameterList, breakdownList >>>>>>",
  //   parameterList,
  //   breakdownList
  // );

  // console.log("header>>>>>>>>>>>>>>>", header, list);
  const { addIcon } = platformWise["/" + platform];

  // const [disabledData, setDisabledData] = useState([]);

  const dispatch = useDispatch();
  const userPermissions = useSelector(
    (state) => state?.permissionsReducer || []
  );
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CUSTOM_REPORT_ACTION,
    platform,
  });  

  const [customEditValue, setCustomEditValue] = useState(undefined);

  const generateReport = async () => {
    let scrollContainer = document.getElementById("table-container");
    if (scrollContainer) scrollContainer.scrollLeft = 0; // Scroll to the extreme left

    setEnableButton(true);
    setReportData([]);

    setShowHeader([...header]);
    let payload = {
      columsData: header,
      platform: platform,
      start_date: convertDate(dateRange[0].startDate),
      end_date: convertDate(dateRange[0].endDate),
      platform_id: platformId,
      dataLIMIT: dataLIMIT,
      download: false,
      ...filters,
    };
    dispatch({
      type: ActionType.GENERATEDREPORTLIST,
      payload: [],
    });
    dispatch({
      type: ActionType.GENERATEDREPORTLISTTOTALDATA,
      payload: null,
    });
    // eslint-disable-next-line no-console
    // console.log("debugerrr 3");
    let data = await dispatch(generatecustomreport(payload));

    setReportData([...data]);
  };

  React.useEffect(() => {
    if (
      reportType !== "blank" &&
      firstInitialized &&
      !loading_custom &&
      parameterList.length > 0 &&
      breakdownList.length > 0 &&
      !accountLoading &&
      !edit
    ) {
      let data = header;
      let addprefix, addsuffix;
      if (platform === "amazon") {
        let suffixchecker =
          reportType != "placement" &&
          reportType != "creative" &&
          reportType != "search_term" &&
          reportType != "asin";
        addprefix = reportType == "adgroup" ? "ad_group" : reportType;
        addsuffix =
          reportType == "keyword" ? "_text" : suffixchecker ? "_name" : "";
      } else if (platform === "blinkit") {
        addprefix = reportType;
        addsuffix = reportType === "keyword" ? "" : "_name";
      } else if (platform === "instamart") {
        addprefix = reportType;
        addsuffix = reportType === "keyword" ? "" : "_name";
      } else if (platform === "zepto") {
        addprefix = reportType;
        addsuffix =
          reportType === "keyword" || reportType === "category" ? "" : "_name";
      } else if (platform === "flipkart") {
        // let newReportType = reportType === "creative" ? "banner" : reportType;
        let suffixchecker =
          reportType !== "placement" &&
          reportType !== "keyword" &&
          reportType !== "search_term" &&
          reportType !== "fsn" &&
          reportType !== "creative";
        addprefix = reportType == "adgroup" ? "ad_group" : reportType;
        addsuffix = suffixchecker ? "_name" : "";
      }

      let findIndex = data.findIndex(
        (val) => val.id === 10000 && val.value === addprefix + addsuffix
      );
      // let reporttitlename =
      //   reportType == "search_term" ? "Search Term" : reportType;
      let reporttitlename;
      if (reportType == "search_term") {
        reporttitlename = "Search Term";
      } else if (reportType == "asin") {
        reporttitlename = "ASIN";
      } else {
        reporttitlename = reportType;
      }
      let Reporttitle;
      ////////////
      if (platform === "amazon") {
        let namesuffixchecker =
          reportType != "placement" &&
          reportType != "keyword" &&
          reportType != "asin";

        let namesuffix = namesuffixchecker ? " Name" : "";

        Reporttitle =
          reporttitlename.charAt(0).toUpperCase() +
          reporttitlename.slice(1) +
          namesuffix;
      } else {
        Reporttitle =
          reporttitlename.charAt(0).toUpperCase() +
          reporttitlename.slice(1) +
          " Name";
      }
      if (findIndex === -1)
        data.push({
          id: 10000,
          title: Reporttitle,
          value: addprefix + addsuffix,
          showSortButton: false,
          showColumn: true,
          format: null,
          entity_name: reportType,
          type: toggle,
        });

      let parameterData = parameterList?.filter((data) => data.show_column);
      if (parameterData && parameterData?.length > 0) {
        parameterData?.map((item) => {
          let findIndex = data.findIndex(
            (val) =>
              val.id === item.id && val.column_value === item.column_value
          );
          if (findIndex === -1)
            data.push({
              id: item.id,
              title: item.column_name,
              value: item.column_value,
              showSortButton: false,
              showColumn: true,
              format: null,
              entity_name: reportType,
              type: "parameters",
            });
        });
      }
      let breakdownData = [...breakdownList];
      let disabledHeader = [...breakdownList].filter(
        (data) => data.entity_name == reportType
      );

      if (toggle == "breakdown") {
        breakdownData.forEach((item, i) => {
          if (
            (item.level === disabledHeader[0]?.level ||
              disabledHeader[0]?.disallowed_breakdowns.includes(
                item.column_value
              )) &&
            disabledHeader[0].level !== 1 &&
            item.column_value !== disabledHeader[0].column_value &&
            !item.allowed_breakdowns.includes(disabledHeader[0]?.column_value)
          ) {
            breakdownData[i].disabled = true;
          }
          if (platform === "amazon") {
            if (reportType === "portfolio" && item.id === "hard_coded_tag") {
              breakdownData[i].disabled = true;
            }
          }
        });
      }
      setDisabledData(breakdownData);
      let seenValues = new Set();
      let filteredData = data.filter((item) => {
        if (seenValues.has(item.value)) {
          return false;
        } else {
          seenValues.add(item.value);
          return true;
        }
      });

      setHeader(filteredData);

      generateReport();

      setFirstInitialized(false);
    }
  }, [loading_custom, accountLoading]);

  const triggerDownload = async () => {
    try {
      let payload = {
        columsData: header,
        platform: platform,
        start_date: convertDate(dateRange[0].startDate),
        end_date: convertDate(dateRange[0].endDate),
        platform_id: platformId,
        dataLIMIT: dataLIMIT,
        download: true,
        ...filters,
      };
      let data = await dispatch(generatecustomreport(payload));
      const headers = header?.map((data) => data.title);
      const rowsData = header?.map((data) => data.value);
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
        // const blob = new Blob([csvContent], {
        //   type: "text/csv;charset=utf-8;",
        // });
        const blob = new Blob(["\ufeff", csvContent], {
          type: "text/csv;charset=utf-8",
        });
        // Define report name and type
        let report_name = reportname ? reportname : "dummy";
        let report_type = reportType;
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
        // Programmatically click the link to trigger the download
        link.click();

        // Remove link from the document
        document.body.removeChild(link);
        dispatch(
          setToastMessageHandler("Report downloaded Successfully", true)
        );
      } else {
        dispatch(setToastMessageHandler("No data found in report", false));
      }
    } catch (error) {
      console.error(error, "testError");
    }
  };

  return (
    <>
      {!customMetric ? (
        <ListingCustomRight
          color={color}
          addIcon={addIcon}
          list={list}
          length={length}
          toggle={toggle}
          setToggle={setToggle}
          setCustomMetric={setCustomMetric}
          generateReport={generateReport}
          setCustomEditValue={setCustomEditValue}
          header={header}
          setHeader={setHeader}
          reportType={reportType}
          platform={platform}
          breakdownList={breakdownList}
          parameterList={parameterList}
          disabledData={disabledData}
          setDisabledData={setDisabledData}
          setEnableButton={setEnableButton}
          enableButton={enableButton}
          reportname={reportname}
          accepetedParameter={accepetedParameter}
          triggerDownload={triggerDownload}
        />
      ) : (
        <CustomMetric
          color={color}
          addIcon={addIcon}
          list={list}
          setCustomMetric={() => setCustomMetric(false)}
          generateReport={generateReport}
          reportType={reportType}
          platform={platform}
          header={header}
          setHeader={setHeader}
          toggle={toggle}
          setToggle={setToggle}
          customMetric={customMetric}
          customEditValue={customEditValue}
          enableButton={enableButton}
          triggerDownload={triggerDownload}
          hasPermission={hasPermission}
          // setCustomMetric={setCustomMetric(false)}
        />
      )}
    </>
  );
};

export default RightPanel;
