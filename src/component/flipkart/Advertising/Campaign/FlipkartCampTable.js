import React from "react";
import {
  keywordSearchHeaders,
  adGroupSearchHeaders,
  fsnSearchHeaders,
  placementSearchHeaders,
  creativeSearchHeaders,
} from "../../../../utils/constants";
import moment from "moment";
import FlipkartSearchTable from "../../../common-components/flipkartSearchTable";
import {
  getAdGroupsList,
  getCampaignList,
  getCreativeList,
  getFsnList,
  getKeywordList,
  getPlacementList,
} from "../../../../redux/action-creator/campaignSearchAction";
import { convertDate } from "../../../../utils/helpers";
import { CSVDownload } from "react-csv";

// const rerenderColumns = [
//   "campaign_name",
//   "campaign_id",
//   "ad_group_id",
//   "ad_group_name",
//   "keyword",
//   "keyword_match_type",
// ];

class FlipkartCampTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: [],
      body: [],
      totalData: 0,
      offset: 0,
      page: 1,
      sort: { spend: -1 },
      campaignsIds: [],
      csvReady: 0,
      csvHeaders: [],
      csvData: [],
      dataLIMIT: 0,
      pageEnd: false,
      groupByCamp: false,
      ad_group_ids: [],
    };
    // console.log("constructor>>>>>>>>>>>>");

    this.initProcess = this.initProcess.bind(this);
    // this.paginate = this.paginate.bind(this);
    this.sortData = this.sortData.bind(this);
    this.updateCampIds = this.updateCampIds.bind(this);
    this.setDataLIMIT = this.setDataLIMIT.bind(this);
    this.getCsvData = this.getCsvData.bind(this);
    this.setBodyData = this.setBodyData.bind(this);
    this.checkDrrVal = this.checkDrrVal.bind(this);
  }

  componentDidMount() {
    // console.log("payload:::::::", this.props.filters);
    this.initProcess();
    this.checkDrrVal();
  }

  checkDrrVal = (data) => {
    let manual = this.props.manual_compare_date;
    if (
      ((this.props.name == "campaign" && this.props.tab == "campaign") ||
        (this.props.name == "creative" && this.props.tab == "creative") ||
        (this.props.name == "placement" && this.props.tab == "placement") ||
        (this.props.name == "keyword" && this.props.tab == "keyword") ||
        (this.props.name == "fsn" && this.props.tab == "fsn") ||
        (this.props.name == "adgroup" && this.props.tab == "adgroup")) &&
      this.props.drr == false &&
      (!['1','2','3','4'].includes(this.props.compareId) || Object.keys(manual).length > 0) &&
      data?.compareId != this.props.compareId &&
      this.props.compareId != "1" &&
      this.props.editMode != true
    ) {
      const lastStartDt = this.props.compDateRange[0].startDate;
      const lastEndDt = this.props.compDateRange[0].endDate;
      const start_date = this.props.dateRange[0].startDate;
      const end_date = this.props.dateRange[0].endDate;
      let a = moment(lastStartDt);
      let b = moment(lastEndDt);
      const compareDays = Math.abs(a.diff(b, "days")) + 1;
      let c = moment(start_date);
      let d = moment(end_date);
      const days = Math.abs(c.diff(d, "days")) + 1;
      if (compareDays != days) {
        this.props.setDrrPopup(true);
        this.props.setCompCalState({
          showCalender: false,
          fullCalender: false,
          dateApplied: false,
        });
      }
    }
  };
  // paginate = (direction) => {
  //   if (direction === "prev") {
  //     this.setState(
  //       { page: this.state.page - 1, offset: this.state.offset - LIMIT },
  //       () => {
  //         this.initProcess();
  //       }
  //     );
  //   } else {
  //     this.setState(
  //       { page: this.state.page + 1, offset: this.state.offset + LIMIT },
  //       () => {
  //         this.initProcess();
  //       }
  //     );
  //   }
  // };

  setDataLIMIT = () => {
    this.setState({ dataLIMIT: this.state.dataLIMIT + 50 }, () => {
      if (this.state.pageEnd === false) {
        this.initProcess();
      }
    });
  };

  sortData = (item, order) => {
    let sort = {};
    sort[item] = order;
    // console.log(sort, "sort");

    this.setState({
      body: [],
      dataLIMIT: 0,
    });

    this.setState({ sort }, () => {
      this.initProcess();
    });
    //convert in class based
    // setPage(1);
    // setOffset(0);
  };
  async setBodyData(bodyData) {
    this.setState({
      body: bodyData,
    });
  }

  async initProcess() {
    // console.log(this.props.headers, "showwwwww");
    // console.log("inside of init");
    if (this.state.loading === true) {
      return false;
    }
    let headers = this.props.headers;
    //console.log(this.csvHeader(headers), "handleSelectedData");
    this.setState({ headers: this.props.headers, loading: true });
    // console.log("name >>>", this.props.name);
    let name = this.props.name || "campaign";

    let filteredSort = {};

    for (let key in this.state.sort) {
      if (
        this.props.headers.find((item) => item.value === key && item.checked)
      ) {
        filteredSort[key] = this.state.sort[key];
      }
    }

    // eslint-disable-next-line no-console
    console.log(
      Object.keys(filteredSort).length > 0 ? filteredSort : { spend: -1 },
      "sort>>>>>>>>"
    );

    let payload = {
      columsData: this.props.headers,
      sort: Object.keys(filteredSort).length > 0 ? filteredSort : { spend: -1 },
      offset: this.state.offset,
      start_date: convertDate(this.props.dateRange[0].startDate),
      end_date: convertDate(this.props.dateRange[0].endDate),
      download: this.props.download || 0,
      platform_id: this.props.platformId,
      groupByCampaign: this.state.groupByCamp,
      dataLIMIT: this.state.dataLIMIT,
      ...this.props.filters[name],
    };

    if (name !== "campaign" && this.state.campaignsIds.length > 0) {
      payload.campaign_ids = this.state.campaignsIds;
    }

    if (
      name !== "campaign" &&
      name !== "adgroup" &&
      this.state.ad_group_ids.length > 0
    ) {
      payload.ad_group_ids = this.state.ad_group_ids;
    }

    let expandState = [];
    if (name === "campaign") {
      payload.manual_compare_date = this.props.manual_compare_date;
      payload.compareId = this.props.compareId;
      payload.compDateRange = this.props.compDateRange;
      payload.drr = this.props.drr;
      expandState = await getCampaignList({
        ...payload,
        account: this.props.account,
      });
      this.props.handleSelectedData([]);
    } else if (name === "adgroup") {
      payload.manual_compare_date = this.props.manual_compare_date;
      payload.compareId = this.props.compareId;
      payload.compDateRange = this.props.compDateRange;
      payload.drr = this.props.drr;
      // payload.columsData = adGroupSearchHeaders;
      expandState = await getAdGroupsList(payload);
    } else if (name === "keyword") {
      payload.manual_compare_date = this.props.manual_compare_date;
      payload.compareId = this.props.compareId;
      payload.compDateRange = this.props.compDateRange;
      payload.drr = this.props.drr;
      // payload.columsData = keywordSearchHeaders;
      expandState = await getKeywordList(payload);
    } else if (name === "fsn") {
      payload.manual_compare_date = this.props.manual_compare_date;
      payload.compareId = this.props.compareId;
      payload.compDateRange = this.props.compDateRange;
      payload.drr = this.props.drr;
      // payload.columsData = fsnSearchHeaders;
      expandState = await getFsnList(payload);
      expandState?.data?.forEach((item, i) => (item.id = i));
    } else if (name === "creative") {
      payload.manual_compare_date = this.props.manual_compare_date;
      payload.compareId = this.props.compareId;
      payload.compDateRange = this.props.compDateRange;
      payload.drr = this.props.drr;
      // payload.columsData = creativeSearchHeaders;
      expandState = await getCreativeList(payload);
    } else if (name === "placement") {
      payload.manual_compare_date = this.props.manual_compare_date;
      payload.compareId = this.props.compareId;
      payload.compDateRange = this.props.compDateRange;
      payload.drr = this.props.drr;
      // payload.columsData = placementSearchHeaders;
      expandState = await getPlacementList(payload);
    }

    if (this.props.download == 1 && expandState) {
      // console.log(headers, name, "download123");
      this.setState(
        {
          csvData: expandState?.data,
          csvHeaders: this.csvHeader(headers),
          loading: false,
          csvReady: true,
        },
        () => {
          this.props.setDownload(0);
        }
      );
    } else {
      // const expandState = this.props.CampaignSearchReducer[tableData]?.data;
      let totalData = expandState?.totalData || 0;
      let summaryData = expandState?.summaryData || null;
      // console.log("expandState", expandState);
      let expandStateData = [];
      expandStateData = expandState?.data ? expandState?.data : [];
      this.setState(
        {
          body: [...this.state.body, ...expandStateData],
          totalData,
          loading: false,
          summaryData,
          csvReady: false,
        },
        () => {
          // this.props.setDownload(0);

          if (expandState?.data?.length < 50) {
            this.setState({ pageEnd: true });
          }
        }
      );
    }
  }

  async getCsvData() {
    if (this.state.loading === true) {
      return false;
    }
    let headers = this.props.headers;
    //console.log(this.csvHeader(headers), "handleSelectedData");
    this.setState({ headers, loading: true });
    // console.log("name >>>", this.props.name);
    let name = this.props.name || "campaign";
    let payload = {
      columsData: headers,
      sort: this.state.sort,
      offset: this.state.offset,
      start_date: convertDate(this.props.dateRange[0].startDate),
      end_date: convertDate(this.props.dateRange[0].endDate),
      download: this.props.download || 0,
      platform_id: this.props.platformId,
      groupByCampaign: this.state.groupByCamp,
      dataLIMIT: this.state.dataLIMIT,
      ...this.props.filters[name],
    };

    // console.log(
    //   this.props.filters[name],
    //   "filter name..",
    //   payload,
    //   "payload <<"
    // );
    if (name !== "campaign" && this.state.campaignsIds.length > 0) {
      payload.campaign_ids = this.state.campaignsIds;
    }
    let expandState = [];
    if (name === "campaign") {
      expandState = await getCampaignList(payload);
      this.props.handleSelectedData([]);
    } else if (name === "adgroup") {
      payload.columsData = adGroupSearchHeaders;
      expandState = await getAdGroupsList(payload);
    } else if (name === "keyword") {
      payload.columsData = keywordSearchHeaders;
      expandState = await getKeywordList(payload);
    } else if (name === "fsn") {
      payload.columsData = fsnSearchHeaders;
      expandState = await getFsnList(payload);
    } else if (name === "creative") {
      payload.columsData = creativeSearchHeaders;
      expandState = await getCreativeList(payload);
    } else if (name === "placement") {
      payload.columsData = placementSearchHeaders;
      expandState = await getPlacementList(payload);
    }

    if (this.props.download == 1 && expandState) {
      // console.log(headers, name, "download123");
      this.setState(
        {
          csvData: expandState?.data,
          csvHeaders: this.csvHeader(headers),
          loading: false,
          csvReady: true,
        },
        () => {
          this.props.setDownload(0);
        }
      );
    }
  }
  async componentDidUpdate(prevProps) {
    // console.log(prevProps.filters, this.props.filters, "filters");

    if (this.props.download == 1) {
      await this.getCsvData();
    }
    if (
      prevProps.download !== this.props.download &&
      this.props.download == 0
    ) {
      this.setState({
        loading: false,
        csvReady: false,
      });
    }
    if (
      this.props.tab !== prevProps.tab ||
      prevProps.filters !== this.props.filters
    ) {
      this.setState({
        loading: false,
      });
    }
    if (
      prevProps.name !== this.props.name ||
      prevProps.filters !== this.props.filters ||
      // prevProps.dateRange !== this.props.dateRange ||
      prevProps.platformId !== this.props.platformId ||
      prevProps.headers !== this.props.headers
    ) {
      if (prevProps.name !== this.props.name) {
        this.checkDrrVal();
      }

      this.setState(
        { pageEnd: false, body: [], summaryData: [], dataLIMIT: 0 },
        async () => {
          await this.initProcess();
          // this.setDataLIMIT()
        }
      );
    }
    if (
      prevProps.dateRange !== this.props.dateRange &&
      !this.props.calState.fullCalender
    ) {
      this.checkDrrVal();
      this.setState(
        { pageEnd: false, body: [], summaryData: [], dataLIMIT: 0 },
        async () => {
          await this.initProcess();
          // this.setDataLIMIT()
        }
      );
    }
    if (
      prevProps.manual_compare_date !== this.props.manual_compare_date ||
      prevProps.compareId !== this.props.compareId
    ) {
      this.checkDrrVal(prevProps);
      this.setState(
        { pageEnd: false, body: [], summaryData: [], dataLIMIT: 0 },
        async () => {
          await this.initProcess();
          // this.setDataLIMIT()
        }
      );
    }
    if (prevProps.drr != this.props.drr) {
      this.setState(
        { pageEnd: false, body: [], summaryData: [], dataLIMIT: 0 },
        async () => {
          await this.initProcess();
          // this.setDataLIMIT()
        }
      );
    }
    if (this.props.groupByCampaign !== prevProps.groupByCampaign) {
      await this.setState({ groupByCamp: this.props.groupByCampaign });
      // console.log(
      //   this.props.groupByCampaign,
      //   "this.props.groupByCampaign",
      //   this.state.groupByCamp
      // );
    }
    if (
      prevProps.headers !== this.props.headers &&
      this.props.tab == prevProps.tab
    ) {
      let setGroupByCampaign = false;
      this.props.headers.map((item) => {
        if (item.value === "campaign_id" || item.value === "campaign_name") {
          // console.log("checkStatus", item.value, item.checked);
          setGroupByCampaign = item.checked;
        }
      });
      this.setState(
        { headers: this.props.headers, groupByCamp: setGroupByCampaign },
        async () => {
          if (this.props.name !== "campaign" && this.props.callApi) {
            // console.log("debug groupBy", this.props.groupByCampaign);
            {
              this.setState(
                {
                  pageEnd: false,
                  body: [],
                  summaryData: [],
                  dataLIMIT: 0,
                  page: 1,
                },
                async () => {
                  await this.initProcess();
                }
              );
            }
          }

          this.props.setCallApi(false);
        }
      );
    }
    if (prevProps.checkboxData !== this.props.checkboxData) {
      // console.log(this.props.checkboxData, "this.props.checkboxData");
      // console.log(this.props.checkboxData);
      let cIds = [];
      let adgroupIds = [];

      this.props.checkboxData["campaign"]?.map((campaign) => {
        cIds.push(campaign.campaign_id);
      });
      this.props.checkboxData["adgroup"]?.map((adgroup) => {
        adgroupIds.push(adgroup.ad_group_id);
      });
      this.setState({ campaignsIds: cIds, ad_group_ids: adgroupIds });
    }
  }
  updateCampIds(data) {
    let cIds = [];
    data?.map((campaign) => {
      cIds.push(campaign.campaign_id);
    });
    // console.log(data, "selectedCamp");
    this.setState({ campaignsIds: cIds });
  }
  csvHeader(headers) {
    let headersKey = [];
    // headers.map((row) => {
    //   headersKey.push({ label: row.title, key: row.value });
    // });
    headers.map((row) => {
      if (row.checked === true) {
        headersKey.push({ label: row.title, key: row.value });
      }
    });
    // console.log(headersKey);
    return headersKey;
  }
  getAlert(campaignId, tag_id) {
    let tempData = this.state.body;

    if (campaignId) {
      campaignId.map((item) => {
        const foundIndex = tempData.findIndex((x) => x.campaign_id == item);
        tag_id.map((item1) => {
          if (
            tempData[foundIndex].tag_id &&
            tempData[foundIndex].tag_id.includes(item1)
          ) {
            return true;
          } else {
            if (tempData[foundIndex].tag_id)
              tempData[foundIndex].tag_id = [
                ...tempData[foundIndex].tag_id,
                item1,
              ];
            else tempData[foundIndex].tag_id = [item1];
          }
        });
      });
    } else {
      tempData.map((item) => {
        item.tag_id = item?.tag_id?.filter((x) => {
          return x != tag_id;
        });
      });
    }
    this.setState({ body: [...tempData] });
  }
  render() {
    const {
      body,
      headers,
      totalData,
      summaryData,
      page,
      offset,
      loading,
      csvReady,
      csvHeaders,
      csvData,
      sort,
    } = this.state;

    return (
      <>
        {csvReady && this.props.download ? (
          <CSVDownload
            data={csvData}
            headers={csvHeaders}
            filename={`sample_${Date.now()}.csv`}
          />
        ) : (
          ""
        )}
        <FlipkartSearchTable
          bodyContent={body}
          account={this.props.account}
          headers={headers}
          summaryData={summaryData}
          source={this.props.tab}
          isCheckBoxRequired={true}
          loading={loading}
          sortData={this.sortData}
          // paginate={this.paginate}
          totalData={totalData}
          page={page}
          name={this.props.name}
          offset={offset}
          handleSelectedData={this.props.handleSelectedData}
          init={this.initProcess}
          setBodyData={this.setBodyData}
          tabName={this.props.name}
          setDataLIMIT={this.setDataLIMIT}
          sort={sort}
          initProcess={this.initProcess}
          download={this.props.download}
          startDate={convertDate(this.props.dateRange[0].startDate)}
          endDate={convertDate(this.props.dateRange[0].endDate)}
          // setBodyData={this.setBodyData}

          // setDataLIMIT={setDataLIMIT}
          // selectedCamp={this.state.campaignsIds}
          // updateCampIds={this.updateCampIds}
        />
      </>
    );
  }
}
// const mapStateToProps = (state) => {
//     return {
//         CampaignSearchReducer: state.CampaignSearchReducer,
//         getKeywordList:()=>dispatch(getKeywordList)
//     }
// }

//export default connect(mapStateToProps)(FlipkartCampTable);
export default FlipkartCampTable;
