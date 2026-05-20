import React from "react";
import TableSubHeader from "../../../common-components/flipkart/TableSubHeader";
import FlipkartTable from "../../../common-components/flipkarttable";
import TableTitle from "../../../common-components/flipkarttable/TableTitle";
import { _POST } from "../../../../services/axios.method";
import {
  LIMIT,
  ZEPTO_CAMPAIGN_REPORT,
  ZEPTO_CAMPAIGN_REPORT_DOWNLOAD,
  headersDataZepto,
} from "../../../../utils/constants";
import { convertDate } from "../../../../utils/helpers";
import {
  cancelRequest,
  defaultDateRange,
  defaultFilterCheck,
} from "../../../../utils/helpers";

const CampaignReport = () => {
  const dateFilters = defaultDateRange();
  const [campaignData, setCampaignData] = React.useState([]);
  const [campaignReportData, setCampaignReportData] = React.useState([]);
  const [option, setOption] = React.useState('Monthly');
  const [showCsvPopup, setShowCsvPopup] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);
  // eslint-disable-next-line no-unused-vars
  const [totalData, setTotalData] = React.useState();
  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [callApi, setCallApi] = React.useState(false);
  const [resetData, setResetData] = React.useState(false);
  const [previousValue, setPreviousValue] = React.useState([
    ...headersDataZepto,
  ]);
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

  const brandOption = [
    { label: "Awareness", value: "Awareness" },
    { label: "performance", value: "performance" },
  ];
  let filters = defaultFilterCheck(brandOption, "/zepto");
  // console.log(filters["blinkit"]["multi"]);

  const [selectedAccountVal, setSelectedAccountVal] = React.useState(
    filters["zepto"]["multi"]
  );
  const [loading, setLoading] = React.useState(false);
  const [downloadLoading, setDownloadLoading] = React.useState(false);
  const [selectedPlatformVal, setSelectedPlatformVal] = React.useState([]);
  const [selectedTypeVal, setSelectedTypeVal] = React.useState([]);
  const [showHeader, setShowHeader] = React.useState([...headersDataZepto]);
  const [downloadHeader, setDownloadHeader] = React.useState([]);
  const [showFilter, setShowFilter] = React.useState(false);
  const [calState, setCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });
  const [sortBy, setSortBy] = React.useState({
    key: "spend",
    order: "DESC",
  });
  function onChangeDate(item) {
    let dateRangePrev = dateRange[0];
    setTempDate([{ ...dateRangePrev, ...item.selection }]);
    //console.log("changetemp",tempDate);
    
    if (!calState.fullCalender) {
      setCampaignData([]);
      setDateRange([item.selection]);
      defaultDateRange(item.selection);
      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
      campaignReportApi([item.selection]);
    }
  }
  const applyDate = () => {
    let appdaterange=tempDate[0];
    setDateRange([{...appdaterange}]);
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
  const cancelDate=()=>{
    let dateRangePrev = dateRange[0];
    
    setTempDate([{ ...dateRangePrev}]);
    //setTempDate([dateRange[0]]);
  }

  React.useEffect(() => {
    if (callApi) {
      campaignReportApi();
    }
  }, [calState]);

  const cancelFilter = () => {
    setShowHeader(previousValue);
    setShowFilter(false);
  };

  const applyFilter = React.useCallback(() => {
    setCampaignData([]);
    setResetData(true);
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
  }, [showHeader,selectedPlatformVal]);

  const apply = () => {
    // campaignReportDownloadApi();
    setShowCsvPopup(false);
    setOption(null);
  };
  // React.useEffect(() => {
  //   if (option) {
  //     campaignReportDownloadApi();
  //   }
  // }, [option]);

  

  let post = {
    campaign_type: selectedAccountVal.length > 0 ? selectedAccountVal : [],
    platform: selectedPlatformVal.length > 0 ? selectedPlatformVal : [],
    type: selectedTypeVal.length > 0 ? selectedTypeVal : [],
    start_date: convertDate(dateRange[0].startDate),
    end_date: convertDate(dateRange[0].endDate),
    columsData: showHeader,
    sort: [sortBy.key, sortBy.order],
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
      const res = await _POST(ZEPTO_CAMPAIGN_REPORT, post, {
        cancelToken: ourRequest.token,
      });

      if (!res?.code) {
        setLoading(false);
      }
      setLoading(false);
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
    setDataLIMIT(0);
  };
  let downloadFilter = {
    campaign_type: selectedAccountVal.length > 0 ? selectedAccountVal : null,
    platform: selectedPlatformVal.length > 0 ? selectedPlatformVal : null,
    type: selectedTypeVal.length > 0 ? selectedTypeVal : null,
    date: option,
    start_date: convertDate(dateRange[0].startDate),
    end_date: convertDate(dateRange[0].endDate),
    columsData: showHeader,
    sort: [sortBy.key, sortBy.order],
  };
  
  const downloadApi=() => {
    campaignReportDownloadApi()
  }
  const campaignReportDownloadApi = async () => {
    try {
      setDownloadLoading(true);
      let headersDownload =
        downloadFilter?.date === "Cumulative"
          ? [{ label: "Account", key: "account" }]
          : [{ label: "Date", key: "daterange" },{ label: "Account", key: "account" }];
      const filteredHeaders = showHeader
        .filter((item) => item.checked)
        .map((item) => ({ label: item.title, key: item.value }));
      headersDownload.push(...filteredHeaders);
      if (downloadFilter?.date === "Cumulative") {
        headersDownload = headersDownload.filter(
          (item) => item.key !== "campaign_name"
        );
      }
      setDownloadHeader(headersDownload);
      const res = await _POST(ZEPTO_CAMPAIGN_REPORT_DOWNLOAD, downloadFilter,{responseType: "arraybuffer",
      headers: {"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"}});
    const blob = new Blob(["\ufeff", res.data], { type: 'text/csv;charset=utf-8' });
      const pom = document.createElement('a');
      pom.href = URL.createObjectURL(blob);
      pom.setAttribute('download', `Campaign report_${downloadFilter.platform}_${downloadFilter.start_date}-${downloadFilter.end_date}_${downloadFilter.date}_${Date.now()}.csv`);
      pom.click();

      setDownloadLoading(false);
      setCampaignReportData(res.data.data.data);
    } catch (e) {
      console.error(e);
    }
  };
  let reset = true;
  React.useEffect(() => {
    if (selectedPlatformVal.length > 0) {
      setCampaignData([]);
      setResetData(true);
      setDataLIMIT(0);
      campaignReportApi(reset);
    }else{
      setCampaignData([]);
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
  return (
    <>
      <div>
        <TableSubHeader
          onChangeDate={onChangeDate}
          state={tempDate}
          dashboard="report"
          applyDate={applyDate}
          cancelDate={cancelDate}
          setState={setDateRange}
          calState={calState}
          setCalState={setCalState}
          setSelectedAccountVal={setSelectedAccountVal}
          selectedAccountVal={selectedAccountVal}
          setSelectedPlatformVal={setSelectedPlatformVal}
          selectedPlatformVal={selectedPlatformVal}
          setSelectedTypeVal={setSelectedTypeVal}
          selectedTypeVal={selectedTypeVal}
          platform="zepto"
        />
      </div>
      <section className="py-7 ">
        <div className="row campaignreport">
          <TableTitle
            title="Campaign Report Details"
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
            // setShowFilter={setShowFilter}
            setShowFilter={(e, from) => {
              //for storing Previous Value
              if (e) setPreviousValue(showHeader);

              if (from === "button" && !e) setShowHeader(previousValue);
              setShowFilter(e);
            }}
            showFilter={showFilter}
            source=""
            platform="zepto"
            downloadApi={downloadApi}
          />
        </div>
        <div className="bg-white px-3">
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
            source={"blinkit"}
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
export default CampaignReport;
