/* eslint-disable */
import React from "react";
import TableSubHeader from "../../../common-components/amazon/TableSubHeader";
import AmazonTable from "../../../common-components/amazontable";
import TableTitle from "../../../common-components/amazontable/TableTitle";
import {
  convertDate,
  defaultDateRange,
  cancelRequest,
} from "../../../../utils/helpers";
import { _POST } from "../../../../services/axios.method";
import {
  LIMIT,
  amazonAdGroupHeaders,
  AMAZON_ADGROUP_REPORT_DOWNLOAD_API_URL,
} from "../../../../utils/constants";
const AdGroupList = () => {
  const dateFilters = defaultDateRange(); //for Local Storage
  const [campaignData, setCampaignData] = React.useState([]);
  const [campaignReportData, setCampaignReportData] = React.useState([]);
  const [option, setOption] = React.useState("Monthly");
  const [showCsvPopup, setShowCsvPopup] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalData, setTotalData] = React.useState();
  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [callApi, setCallApi] = React.useState(false);
  const [resetData, setResetData] = React.useState(false);
  const [brandsOption, setBrandOptions] = React.useState([]);

  const paginate = (direction) => {
    if (direction == "prev") {
      setPage(page - 1);
      setOffset(offset - LIMIT);
    } else {
      setPage(page + 1);
      setOffset(offset + LIMIT);
    }
  };

  // const [dateRange, setDateRange] = React.useState([
  //   {
  //     startDate: addDays(new Date(), -7),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);
  const [dateRange, setDateRange] = React.useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]); //For LOCAL STORAGE
  const [selectedAccountVal, setSelectedAccountVal] = React.useState([]);
  //console.log("selected account value",selectedAccountVal)
  const [loading, setLoading] = React.useState(false);
  const [downloadLoading, setDownloadLoading] = React.useState(false);

  const [selectedPlatformVal, setSelectedPlatformVal] = React.useState([]);
  const [selectedTypeVal, setSelectedTypeVal] = React.useState([]);
  const [showHeader, setShowHeader] = React.useState([...amazonAdGroupHeaders]);

  const [downloadHeader, setDownloadHeader] = React.useState([
    ...amazonAdGroupHeaders,
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
    key: "spend",
    order: -1,
  });

  async function onChangeDate(item) {
    defaultDateRange(item.selection); //For Local storage
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
    if (
      callApi &&
      !calState.showCalender &&
      !calState.fullCalender &&
      calState.dateApplied
    ) {
      campaignReportApi();
    }
  }, [calState]);
  const cancelFilter = () => {
    setShowHeader([...amazonAdGroupHeaders]);
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
    //console.log("postIS",post)
    let reset = true;
    campaignReportApi(reset);
  }, [showHeader, selectedAccountVal]); //added selectedAccountVal as it is giving no records when clicked apply with no change in filter

  const apply = () => {
    // campaignReportDownloadApi();
    setShowCsvPopup(false);
    setOption(null);
  };
  // React.useEffect(() => {
  // 	if (option) {
  // 		campaignReportDownloadApi();
  // 	}
  // }, [option]);

  const downloadApi = () => {
    campaignReportDownloadApi();
  };

  let post = {
    account: selectedAccountVal.length > 0 ? selectedAccountVal : [],
    // platform: selectedPlatformVal.length > 0 ? selectedPlatformVal : [],
    // type: selectedTypeVal.length > 0 ? selectedTypeVal : [],
    start_date: convertDate(dateRange[0].startDate),
    end_date: convertDate(dateRange[0].endDate),
    columsData: showHeader,
    sort: { [sortBy.key]: sortBy.order },
    // offset: offset,
    dataLIMIT: dataLIMIT,
  };

  const campaignReportApi = async (date = false) => {
    if (!resetData && !date && loading) {
      return true;
    }
    try {
      if (date && date[0]?.startDate) {
        post.start_date = convertDate(date[0].startDate);
        post.end_date = convertDate(date[0].endDate);
      }
      if (date) {
        post.dataLIMIT = 0;
      }

      setLoading(true);
      const headersDownload = [{ label: "Date", key: "daterange" }];
      const filteredHeaders = showHeader
        .filter((item) => item.checked)
        .map((item) => ({ label: item.title, key: item.value }));
      headersDownload.push(...filteredHeaders);
      setDownloadHeader(headersDownload);
      const ourRequest = await cancelRequest();
      const res = await _POST("amazon/adgroup_list", post, {
        cancelToken: ourRequest.token,
      });
      // console.log("resIs",res);
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
      console.log(e);
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
    setDataLIMIT(0);
  };

  // console.log("sortDataIs",sortData);

  let downloadFilter = {
    account: selectedAccountVal.length > 0 ? selectedAccountVal : [],
    // platform: selectedPlatformVal.length > 0 ? selectedPlatformVal : [],
    // type: selectedTypeVal.length > 0 ? selectedTypeVal : [],
    start_date: convertDate(dateRange[0].startDate),
    end_date: convertDate(dateRange[0].endDate),
    date: option,
    columsData: showHeader,
    sort: { [sortBy.key]: sortBy.order },
  };
  const campaignReportDownloadApi = async () => {
    try {
      setDownloadLoading(true);
      let headersDownload =
        downloadFilter?.date === "Cumulative"
          ? []
          : [{ label: "Date", key: "created_on" }];
      const filteredHeaders = showHeader
        .filter((item) => item.checked)
        .map((item) => ({ label: item.title, key: item.value }));
      headersDownload.push(...filteredHeaders);
      if (downloadFilter?.date === "Cumulative") {
        headersDownload = headersDownload.filter(
          (item) =>
            item.key !== "campaign_name" &&
            item.key !== "category_name" &&
            item.key !== "keyword"
        );
      }
      console.log("headers:::::::", headersDownload);
      setDownloadHeader(headersDownload);
      const res = await _POST(
        AMAZON_ADGROUP_REPORT_DOWNLOAD_API_URL,
        downloadFilter,
        {
          responseType: "arraybuffer",
          headers: {
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          },
        }
      );
      const blob = new Blob(["\ufeff", res.data], {
        type: "text/csv;charset=utf-8",
      });
      const pom = document.createElement("a");
      pom.href = URL.createObjectURL(blob);
      pom.setAttribute(
        "download",
        `Adgroup report_${
          brandsOption.length > 0 &&
          brandsOption.find((item) => item.value == selectedAccountVal).label
        }_${downloadFilter.start_date}-${downloadFilter.end_date}_${
          downloadFilter.date
        }_${Date.now()}.csv`
      );
      pom.click();

      setDownloadLoading(false);
      setCampaignReportData(res.data.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  // React.useEffect(() => {
  //   campaignReportApi();
  // }, []);
  let reset = true;
  React.useEffect(() => {
    if (selectedAccountVal.length < 1) {
      setCampaignData([]);
    } else {
      setCampaignData([]);
      //setResetData(true);
      setDataLIMIT(0);
      campaignReportApi(reset);
    }
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
  //   const dispatch = useDispatch();
  //   React.useEffect(() => {
  //     if (selectedAccountVal.length) {
  //       dispatch(getWallletBalance(selectedAccountVal));
  //     }
  //   }, [selectedAccountVal]);

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
          setBrandOptions={setBrandOptions}
        />
      </div>
      <section className="py-7 ">
        <div className="row campaignreport">
          <TableTitle
            title="Adgroup Report"
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
            downloadApi={downloadApi}
          />
        </div>
        <div className="px-3 bg-white">
          <AmazonTable
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
            source={"searchadgroup"}
          />
        </div>
      </section>

      <tfoot>
        <div className="flex"></div>
      </tfoot>
    </>
  );
};
export default AdGroupList;
