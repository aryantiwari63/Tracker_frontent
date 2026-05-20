// // import React from "react";
// import campData from "../../../../data/flipkart/reports/campData.json";

// import CustomizeDropDown from "../../../common-components/flipkart/CustomizeDropDown";
// import TableSubHeader from "../../../common-components/flipkart/TableSubHeader";
// import FlipkartTable from "../../../common-components/flipkarttable";
// import TableTitle from "../../../common-components/flipkarttable/TableTitle";
// import {
//   LIMIT,
//   PLACEMENT_REPORT_API_URL,
//   PLACEMENT_REPORT_DOWNLOAD_API_URL,
//   downloadplacementHeaders,
//   keywordHeaders,
//   placementHeaders,
// } from "../../../../utils/constants";
// import { addDays } from "date-fns";
// import { convertDate } from "../../../../utils/helpers";
// import { _POST } from "../../../../services/axios.method";
// import { cancelRequest } from "../../../../utils/helpers";

// const PlacementReport = () => {
//   const headers = [
//     "Placement Type",
//     "Campaign Type",
//     "Campaign Name",
//     "Platform",
//     "Spent",
//     "Placement Bids",
//     "Placement Bids %",
//     "Placement Spent",
//     "Placement Spent %",
//     "Views",
//     "Clicks",
//     "CTR",
//     "CPC",
//     "CTR",
//     {
//       title: "Unit Solds",
//       subTitles: ["Direct", "Indirect", "Total"],
//     },

//     {
//       title: "Revenue(Clicks)",
//       subTitles: ["Direct", "Indirect", "Total"],
//     },

//     {
//       title: "CVR(Clicks)",
//       subTitles: ["Direct", "Indirect", "Total"],
//     },
//     {
//       title: "ROI(Clicks)",
//       subTitles: ["Direct", "Indirect", "Total"],
//     },

//     {
//       title: "AOV(Clicks)",
//       subTitles: ["Direct", "Indirect", "Total"],
//     },
//   ];
//   const [campaignData, setCampaignData] = React.useState([]);
//   const [campaignReportData, setCampaignReportData] = React.useState([]);
//   const [option, setOption] = React.useState(null);
//   const [showCsvPopup, setShowCsvPopup] = React.useState(false);
//   const [offset, setOffset] = React.useState(0);
//   const [page, setPage] = React.useState(1);
//   const [totalData, setTotalData] = React.useState();
//   const [dataLIMIT, setDataLIMIT] = React.useState(0);
//   const [callApi, setCallApi] = React.useState(false);
//   const [resetData, setResetData] = React.useState(false);

//   const paginate = (direction) => {
//     if (direction == "prev") {
//       setPage(page - 1);
//       setOffset(offset - LIMIT);
//     } else {
//       setPage(page + 1);
//       setOffset(offset + LIMIT);
//     }
//   };

//   const [dateRange, setDateRange] = React.useState([
//     {
//       startDate: addDays(new Date(), -7),
//       endDate: new Date(),
//       key: "selection",
//     },
//   ]);
//   const [selectedAccountVal, setSelectedAccountVal] = React.useState([]);
//   const [loading, setLoading] = React.useState(false);
//   const [downloadLoading, setDownloadLoading] = React.useState(false);

//   const [selectedPlatformVal, setSelectedPlatformVal] = React.useState([]);
//   const [selectedTypeVal, setSelectedTypeVal] = React.useState([]);
//   const [showHeader, setShowHeader] = React.useState([...placementHeaders]);
//   const [downloadHeader, setDownloadHeader] = React.useState([
//     ...downloadplacementHeaders,
//   ]);
//   const [showFilter, setShowFilter] = React.useState(false);

//   // console.log("selectedVal", selectedAccountVal);
//   // console.log("selectedVal 1", selectedPlatformVal);
//   // console.log("selectedVal 2", selectedTypeVal);
//   const [calState, setCalState] = React.useState({
//     showCalender: false,
//     fullCalender: false,
//     dateApplied: false,
//   });
//   const [sortBy, setSortBy] = React.useState({
//     key: "created_on",
//     order: -1,
//   });
//   function onChangeDate(item) {
//     setDateRange([item.selection]);
//     if (!calState.fullCalender) {
//       setCampaignData([]);
//       setCalState({
//         ...calState,
//         showCalender: false,
//         dateApplied: true,
//       });
//       campaignReportApi([item.selection]);
//     }
//   }
//   const applyDate = () => {
//     setCampaignData([]);
//     setResetData(true);
//     setPage(1);
//     setOffset(0);
//     setDataLIMIT(0);
//     setCalState({
//       ...calState,
//       showCalender: false,
//       fullCalender: false,
//       dateApplied: true,
//     });
//     setCallApi(true);
//   };

//   React.useEffect(() => {
//     if (callApi) {
//       campaignReportApi();
//     }
//   }, [calState]);
//   const cancelFilter = () => {
//     setShowHeader([...keywordHeaders]);
//     setShowFilter(false);
//   };
//   const applyFilter = React.useCallback(() => {
//     setCampaignData([]);
//     setShowHeader(
//       showHeader.map((checkbox) =>
//         checkbox.checked === true
//           ? { ...checkbox, showCol: true }
//           : { ...checkbox, showCol: false }
//       )
//     );
//     setShowFilter(false);
//     post = { ...post, columsData: showHeader };
//     let reset = true;
//     campaignReportApi(reset);
//   }, [showHeader]);

//   const apply = () => {
//     // campaignReportDownloadApi();
//     setShowCsvPopup(false);
//     setOption(null);
//   };
//   React.useEffect(() => {
//     if (option) {
//       campaignReportDownloadApi();
//     }
//   }, [option]);

//   let post = {
//     account: selectedAccountVal.length > 0 ? selectedAccountVal : null,
//     platform: selectedPlatformVal.length > 0 ? selectedPlatformVal : null,
//     type: selectedTypeVal.length > 0 ? selectedTypeVal : null,
//     start_date: convertDate(dateRange[0].startDate),
//     end_date: convertDate(dateRange[0].endDate),
//     columsData: showHeader,
//     sort: { [sortBy.key]: sortBy.order },
//     offset: offset,
//     dataLIMIT: dataLIMIT,
//   };

//   const campaignReportApi = async (date = false) => {
//     if (!resetData && !date && loading) {
//       return true;
//     }
//     if (date && date[0]?.startDate) {
//       post.start_date = convertDate(date[0].startDate);
//       post.end_date = convertDate(date[0].endDate);
//     }

//     if (date) {
//       post.dataLIMIT = 0;
//     }
//     try {
//       setLoading(true);
//       const ourRequest = await cancelRequest();
//       const res = await _POST(PLACEMENT_REPORT_API_URL, post, {
//         cancelToken: ourRequest.token,
//       });
//       if (!res?.code) {
//         setLoading(false);
//       }

//       if (resetData || date) {
//         setCampaignData([...res.data.data.data]);
//       } else {
//         setCampaignData([...campaignData, ...res.data.data.data]);
//       }

//       if (res.data.data.data.length == 50) {
//         setCallApi(true);
//       } else {
//         setCallApi(false);
//       }
//       // setCampaignData(res.data.data.data);
//       // setTotalData(res.data.data.totalData);
//     } catch (e) {
//       console.log(e);
//     }
//   };
//   const sortData = (item, order) => {
//     setCampaignData([]);
//     setSortBy({
//       key: item,
//       order: order,
//     });
//     setPage(1);
//     setOffset(0);
//   };
//   let downloadFilter = {
//     account: selectedAccountVal.length > 0 ? selectedAccountVal : [],
//     platform: selectedPlatformVal.length > 0 ? selectedPlatformVal : [],
//     type: selectedTypeVal.length > 0 ? selectedTypeVal : [],
//     date: option,
//     columsData: showHeader,
//     sort: { [sortBy.key]: sortBy.order },
//   };
//   const campaignReportDownloadApi = async () => {
//     try {
//       setDownloadLoading(true);
//       const res = await _POST(
//         PLACEMENT_REPORT_DOWNLOAD_API_URL,
//         downloadFilter
//       );

//       setDownloadLoading(false);
//       setCampaignReportData(res.data.data.data);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   // React.useEffect(() => {
//   //   campaignReportApi();
//   // }, []);
//   let reset = true;
//   React.useEffect(() => {
//     setCampaignData([]);
//     setResetData(true);
//     setDataLIMIT(0);
//     campaignReportApi(reset);
//   }, [
//     selectedAccountVal,
//     selectedPlatformVal,
//     selectedTypeVal,
//     offset,
//     sortBy,
//   ]);
//   React.useEffect(() => {
//     setResetData(false);

//     if (callApi) {
//       campaignReportApi();
//     }
//   }, [dataLIMIT]);

//   return (
//     <>
//       <div>
//         <TableSubHeader
//           onChangeDate={onChangeDate}
//           applyDate={applyDate}
//           state={dateRange}
//           setState={setDateRange}
//           calState={calState}
//           setCalState={setCalState}
//           setSelectedAccountVal={setSelectedAccountVal}
//           selectedAccountVal={selectedAccountVal}
//           setSelectedPlatformVal={setSelectedPlatformVal}
//           selectedPlatformVal={selectedPlatformVal}
//           setSelectedTypeVal={setSelectedTypeVal}
//           selectedTypeVal={selectedTypeVal}
//         />
//       </div>
//       <section className="py-7 ">
//         <div className="row campaignreport ">
//           <TableTitle
//             title="Placement"
//             setOption={setOption}
//             option={option}
//             setShowCsvPopup={setShowCsvPopup}
//             showCsvPopup={showCsvPopup}
//             apply={apply}
//             loading={downloadLoading}
//             campaignReportData={campaignReportData}
//             setShowHeader={setShowHeader}
//             showHeader={showHeader}
//             downloadHeader={downloadHeader}
//             applyFilter={applyFilter}
//             cancelFilter={cancelFilter}
//             setShowFilter={setShowFilter}
//             showFilter={showFilter}
//           />
//         </div>
//         <div className="px-3 bg-white">
//           <FlipkartTable
//             headers={showHeader}
//             bodyContent={campaignData}
//             sortBy={sortBy}
//             loading={loading}
//             sortData={sortData}
//             paginate={paginate}
//             totalData={totalData}
//             page={page}
//             offset={offset}
//             setDataLIMIT={setDataLIMIT}
//             dataLIMIT={dataLIMIT}
//             source={"placement"}
//           />
//         </div>
//       </section>

//       <tfoot>
//         <div className="flex"></div>
//       </tfoot>
//     </>
//   );
// };
// export default PlacementReport;
import React from "react";
import TableSubHeader from "../../../common-components/flipkart/TableSubHeader";
import FlipkartTable from "../../../common-components/flipkarttable";
import TableTitle from "../../../common-components/flipkarttable/TableTitle";
import {
  LIMIT,
  PLACEMENT_REPORT_API_URL,
  PLACEMENT_REPORT_DOWNLOAD_API_URL,
  downloadplacementHeaders,
  keywordHeaders,
  placementHeaders,
} from "../../../../utils/constants";
import { addDays } from "date-fns";
import { convertDate } from "../../../../utils/helpers";
import { _POST } from "../../../../services/axios.method";
import { cancelRequest } from "../../../../utils/helpers";

const PlacementReport = () => {
  const [campaignData, setCampaignData] = React.useState([]);
  const [campaignReportData, setCampaignReportData] = React.useState([]);
  const [option, setOption] = React.useState(null);
  const [showCsvPopup, setShowCsvPopup] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);
  // eslint-disable-next-line no-unused-vars
  const [totalData, setTotalData] = React.useState();
  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [callApi, setCallApi] = React.useState(false);
  const [resetData, setResetData] = React.useState(false);

  const paginate = (direction) => {
    if (direction == "prev") {
      setPage(page - 1);
      setOffset(offset - LIMIT);
    } else {
      setPage(page + 1);
      setOffset(offset + LIMIT);
    }
  };

  const [dateRange, setDateRange] = React.useState([
    {
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [selectedAccountVal, setSelectedAccountVal] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [downloadLoading, setDownloadLoading] = React.useState(false);

  const [selectedPlatformVal, setSelectedPlatformVal] = React.useState([]);
  const [selectedTypeVal, setSelectedTypeVal] = React.useState([]);
  const [showHeader, setShowHeader] = React.useState([...placementHeaders]);
  // eslint-disable-next-line no-unused-vars
  const [downloadHeader, setDownloadHeader] = React.useState([
    ...downloadplacementHeaders,
  ]);
  const [showFilter, setShowFilter] = React.useState(false);
  // console.log("selectedVal", selectedAccountVal);
  // console.log("selectedVal 1", selectedPlatformVal);
  // console.log("selectedVal 2", selectedTypeVal);
  const [calState, setCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: -1,
  });
  function onChangeDate(item) {
    setDateRange([item.selection]);
    if (!calState.fullCalender) {
      setCampaignData([]);
      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
      campaignReportApi([item.selection]);
    }
  }
  const applyDate = () => {
    setCampaignData([]);
    setResetData(true);
    setPage(1);
    setOffset(0);
    setDataLIMIT(0);
    setCalState({
      ...calState,
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
    setCallApi(true);
  };

  React.useEffect(() => {
    if (callApi) {
      campaignReportApi();
    }
  }, [calState]);
  const cancelFilter = () => {
    setShowHeader([...keywordHeaders]);
    setShowFilter(false);
  };
  const applyFilter = React.useCallback(() => {
    setCampaignData([]);
    setShowHeader(
      showHeader.map((checkbox) =>
        checkbox.checked === true
          ? { ...checkbox, showCol: true }
          : { ...checkbox, showCol: false }
      )
    );
    setShowFilter(false);
    post = { ...post, columsData: showHeader };
    let reset = true;
    campaignReportApi(reset);
  }, [showHeader]);

  const apply = () => {
    // campaignReportDownloadApi();
    setShowCsvPopup(false);
    setOption(null);
  };
  React.useEffect(() => {
    if (option) {
      campaignReportDownloadApi();
    }
  }, [option]);

  let post = {
    account: selectedAccountVal.length > 0 ? selectedAccountVal : null,
    platform: selectedPlatformVal.length > 0 ? selectedPlatformVal : null,
    type: selectedTypeVal.length > 0 ? selectedTypeVal : null,
    start_date: convertDate(dateRange[0].startDate),
    end_date: convertDate(dateRange[0].endDate),
    columsData: showHeader,
    sort: { [sortBy.key]: sortBy.order },
    offset: offset,
    dataLIMIT: dataLIMIT,
  };

  const campaignReportApi = async (date = false) => {
    if (!resetData && !date && loading) {
      return true;
    }
    if (date && date[0]?.startDate) {
      post.start_date = convertDate(date[0].startDate);
      post.end_date = convertDate(date[0].endDate);
    }

    if (date) {
      post.dataLIMIT = 0;
    }
    try {
      setLoading(true);
      const ourRequest = await cancelRequest();
      const res = await _POST(PLACEMENT_REPORT_API_URL, post, {
        cancelToken: ourRequest.token,
      });
      if (!res?.code) {
        setLoading(false);
      }

      if (resetData || date) {
        setCampaignData([...res.data.data.data]);
      } else {
        setCampaignData([...campaignData, ...res.data.data.data]);
      }

      if (res.data.data.data.length == 50) {
        setCallApi(true);
      } else {
        setCallApi(false);
      }
      // setCampaignData(res.data.data.data);
      // setTotalData(res.data.data.totalData);
    } catch (e) {
      console.error(e);
    }
  };
  const sortData = (item, order) => {
    setCampaignData([]);
    setSortBy({
      key: item,
      order: order,
    });
    setPage(1);
    setOffset(0);
  };
  let downloadFilter = {
    account: selectedAccountVal.length > 0 ? selectedAccountVal : [],
    platform: selectedPlatformVal.length > 0 ? selectedPlatformVal : [],
    type: selectedTypeVal.length > 0 ? selectedTypeVal : [],
    date: option,
    columsData: showHeader,
    sort: { [sortBy.key]: sortBy.order },
  };
  const campaignReportDownloadApi = async () => {
    try {
      setDownloadLoading(true);
      const res = await _POST(
        PLACEMENT_REPORT_DOWNLOAD_API_URL,
        downloadFilter
      );

      setDownloadLoading(false);
      setCampaignReportData(res.data.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  // React.useEffect(() => {
  //   campaignReportApi();
  // }, []);
  let reset = true;
  React.useEffect(() => {
    setCampaignData([]);
    setResetData(true);
    setDataLIMIT(0);
    campaignReportApi(reset);
  }, [
    selectedAccountVal,
    selectedPlatformVal,
    selectedTypeVal,
    offset,
    sortBy,
  ]);
  React.useEffect(() => {
    setResetData(false);

    if (callApi) {
      campaignReportApi();
    }
  }, [dataLIMIT]);

  return (
    <>
      <div>
        <TableSubHeader
          onChangeDate={onChangeDate}
          applyDate={applyDate}
          state={dateRange}
          setState={setDateRange}
          calState={calState}
          setCalState={setCalState}
          setSelectedAccountVal={setSelectedAccountVal}
          selectedAccountVal={selectedAccountVal}
          setSelectedPlatformVal={setSelectedPlatformVal}
          selectedPlatformVal={selectedPlatformVal}
          setSelectedTypeVal={setSelectedTypeVal}
          selectedTypeVal={selectedTypeVal}
        />
      </div>
      <section className="py-7 ">
        <div className="row campaignreport ">
          <TableTitle
            title="Placement"
            setOption={setOption}
            option={option}
            setShowCsvPopup={setShowCsvPopup}
            showCsvPopup={showCsvPopup}
            apply={apply}
            loading={downloadLoading}
            campaignReportData={campaignReportData}
            setShowHeader={setShowHeader}
            showHeader={showHeader}
            downloadHeader={downloadHeader}
            applyFilter={applyFilter}
            cancelFilter={cancelFilter}
            setShowFilter={setShowFilter}
            showFilter={showFilter}
          />
        </div>
        <div className="px-3 bg-white">
          <FlipkartTable
            headers={showHeader}
            bodyContent={campaignData}
            sortBy={sortBy}
            loading={loading}
            sortData={sortData}
            paginate={paginate}
            totalData={totalData}
            page={page}
            offset={offset}
            setDataLIMIT={setDataLIMIT}
            dataLIMIT={dataLIMIT}
            source={"placement"}
            headerClassName="!text-[15px]"
          />
        </div>
      </section>

      <tfoot>
        <div className="flex"></div>
      </tfoot>
    </>
  );
};
export default PlacementReport;
