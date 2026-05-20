/* eslint-disable no-console */
import React, { forwardRef } from "react";
import {
  zeptoKeywordSearchHeaders,
  zeptoProductSearchHeaders,
  zeptoCategorySearchHeaders,
} from "../../../../utils/constants";
import moment from "moment";
import { convertDate } from "../../../../utils/helpers";
import { CSVDownload } from "react-csv";
import {
  getZeptoCampaignList,
  getZeptoCategoryList,
  getZeptoKeywordList,
  getZeptoProductList,
} from "../../../../redux/action-creator/zepto/zeptoCampaignAction";
import ZeptoItSearchTable from "../../../common-components/ZeptoSearchTable";
import { connect } from "react-redux";
import ActionType from "../../../../redux/types";
class ZeptoCampTable extends React.Component {
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
    };
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
    // this.props.funnelCount([]);

    this.checkDrrVal();
  }

  checkDrrVal = (data) => {
    let manual = this.props.manual_compare_date;
    if (
      ((this.props.name == "campaign" && this.props.tab == "campaign") ||
        (this.props.name == "keyword" && this.props.tab == "keyword") ||
        (this.props.name == "category" && this.props.tab == "category") ||
        (this.props.name == "product" && this.props.tab == "product")) &&
      this.props.drr == false &&
      (!['1','2', '3', '4'].includes(this.props.compareId) || Object.keys(manual).length > 0) &&
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
      console.log(compareDays, days, a, b, c, d);
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
    // console.log("inside of init");
    if (this.state.loading === true) {
      return false;
    }
    let headers = this.props.headers;
    // console.log(">?>>>>>>>>>this.state.sort", this.state.sort);
    this.setState({ headers: this.props.headers, loading: true });
    // console.log("name >>>", this.props.name);
    let setGroupByCampaign = false;
    this.props.headers.map((item) => {
      if (item.value === "campaign_id" || item.value === "campaign_name") {
        // console.log("checkStatus", item.value, item.checked);
        setGroupByCampaign = item.checked;
      }
    });
    let name = this.props.name || "campaign";
    let payload = {
      columsData: this.props.headers,
      sort: this.state.sort,
      offset: this.state.offset,
      start_date: convertDate(this.props.dateRange[0].startDate),
      end_date: convertDate(this.props.dateRange[0].endDate),
      download: this.props.download || 0,
      platform_id: this.props.platformId,
      groupByCampaign: setGroupByCampaign,
      dataLIMIT: this.state.dataLIMIT,
      account: this.props.selectedAccount,
      campaign_type: this.props.campaign_type,

      ...this.props.filters[name],
    };

    if (name !== "campaign" && this.state.campaignsIds.length > 0) {
      payload.campaign_ids = this.state.campaignsIds;
    }
    let expandState = [];
    if (name === "campaign") {
      payload.manual_compare_date = this.props.manual_compare_date;
      payload.compareId = this.props.compareId;
      payload.compDateRange = this.props.compDateRange;
      payload.drr = this.props.drr;
      expandState = await getZeptoCampaignList(payload);
      this.props.handleSelectedData([]);
    } else if (name === "category") {
      payload.manual_compare_date = this.props.manual_compare_date;
      payload.compareId = this.props.compareId;
      payload.compDateRange = this.props.compDateRange;
      payload.drr = this.props.drr;
      // payload.columsData = adGroupSearchHeaders;
      expandState = await getZeptoCategoryList(payload);
    } else if (name === "keyword") {
      payload.manual_compare_date = this.props.manual_compare_date;
      payload.compareId = this.props.compareId;
      payload.compDateRange = this.props.compDateRange;
      payload.drr = this.props.drr;
      // payload.columsData = keywordSearchHeaders;
      expandState = await getZeptoKeywordList(payload);
    } else if (name === "product") {
      payload.manual_compare_date = this.props.manual_compare_date;
      payload.compareId = this.props.compareId;
      payload.compDateRange = this.props.compDateRange;
      payload.drr = this.props.drr;
      //  payload.columsData = placementSearchHeaders;
      expandState = await getZeptoProductList(payload);
    }
    if (this.props.download == 1 && expandState) {
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
      let summaryData =
        expandState?.summaryData?.length > 0
          ? expandState?.summaryData
          : [
              {
                _id: null,
                impressions: null,
                direct_sales: "₹null",
                indirect_sales: "₹null",
                total_sales: "₹null",
                estimated_budget_consumed: "₹null",
                direct_atc: null,
                indirect_atc: null,
                new_users_acquired: null,
                total_atc: null,
                total_quantities_sold: null,
                direct_quantities_sold: null,
                indirect_quantities_sold: null,
                unique_clicks: null,
                reach: null,
                cpm: "₹null",
                roas: null,
                atc_percent: "0%",
                ctr: "0%",
                total_count: "0",
              },
            ];
      // console.log("expandState", expandState);
      const tabs = {
        campaign: ActionType.TOTAL_CAMPAIGN,
        keyword: ActionType.TOTAL_KEYWORD_COUNT,
        product: ActionType.TOTAL_ASINS,
        category: ActionType.TOTAL_CATEGORY_COUNT,
      };
      if (Object.keys(tabs).includes(name)) {
        this.props.dispatch({
          type: tabs[name],
          payload: totalData,
        });
      }

      if (expandState) {
        this.setState(
          {
            // eslint-disable-next-line no-unsafe-optional-chaining
            body: [...this.state.body, ...expandState?.data],
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
    let setGroupByCampaign = false;
    this.props.headers.map((item) => {
      if (item.value === "campaign_id" || item.value === "campaign_name") {
        // console.log("checkStatus", item.value, item.checked);
        setGroupByCampaign = item.checked;
      }
    });
    let payload = {
      columsData: headers,
      sort: this.state.sort,
      offset: this.state.offset,
      start_date: convertDate(this.props.dateRange[0].startDate),
      end_date: convertDate(this.props.dateRange[0].endDate),
      download: this.props.download || 0,
      platform_id: this.props.platformId,
      groupByCampaign: setGroupByCampaign,
      dataLIMIT: this.state.dataLIMIT,
      account: this.props.selectedAccount,
      campaign_type: this.props.campaign_type,
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
      expandState = await getZeptoCampaignList(payload);
      this.props.handleSelectedData([]);
    } else if (name === "keyword") {
      payload.columsData = zeptoKeywordSearchHeaders;
      expandState = await getZeptoKeywordList(payload);
    } else if (name === "category") {
      payload.columsData = zeptoCategorySearchHeaders;
      expandState = await getZeptoCategoryList(payload);
    } else if (name === "product") {
      payload.columsData = zeptoProductSearchHeaders;
      expandState = await getZeptoProductList(payload);
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
        sort: { spend: -1 }
      });
    }
    if (
      prevProps.name !== this.props.name ||
      prevProps.filters !== this.props.filters ||
      // prevProps.dateRange !== this.props.dateRange ||
      prevProps.platformId !== this.props.platformId ||
      prevProps.selectedAccount !== this.props.selectedAccount
    ) {
      if (prevProps.name !== this.props.name) {
        this.checkDrrVal();
      }
      this.setState(
        { pageEnd: false, body: [], summaryData: [], dataLIMIT: 0 },
        async () => {
          await this.initProcess();
          // this.setDataLIMIT()
           this.setState({
             loading: false,
           });
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
    }
    if (
      prevProps.headers !== this.props.headers &&
      this.props.tab == prevProps.tab
    ) {
      // let setGroupByCampaign = false;
      // this.props.headers.map((item) => {
      //   if (item.value === "campaign_id" || item.value === "campaign_name") {
      //     // console.log("checkStatus", item.value, item.checked);
      //     setGroupByCampaign = item.checked;
      //   }
      // });
      this.setState({ headers: this.props.headers }, async () => {
        // console.log(
        //   this.props.callApi,
        //   "this.props.name?>>>>>>>>>>",
        //   this.props.name
        // );
        if (this.props.name !== "campaign") {
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
      });
    }
    if (prevProps.checkboxData !== this.props.checkboxData) {
      // console.log(this.props.checkboxData, "this.props.checkboxData");
      // console.log(this.props.checkboxData);
      let cIds = [];
      this.props.checkboxData["campaign"]?.map((campaign) => {
        cIds.push(campaign.campaign_id);
      });
      this.setState({ campaignsIds: cIds });
    }
    if (
      prevProps.account !== this.props.account ||
      prevProps.manual_compare_date !== this.props.manual_compare_date ||
      prevProps.compareId !== this.props.compareId ||
      prevProps.account !== this.props.account ||
      (prevProps.dateRange !== this.props.dateRange &&
        !this.props.calState.fullCalender)
    ) {
      // await this.props.funnelCount([]);
      this.props.dispatch({
        type: ActionType.CHECKBOX,
        payload: [],
      });
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
        <ZeptoItSearchTable
          bodyContent={body}
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
          startDate={convertDate(this.props.dateRange[0].startDate)}
          endDate={convertDate(this.props.dateRange[0].endDate)}
          // funnelCount={this.props.funnelCount}
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
// export default ZeptoCampTable;

const mapStateToProps = (state) => {
  return {
    // checkboxData: state.CampaignReducer.selectedCheckBox,
    campaign_type: state.CampaignTypeReducer,
    zeptoFunnelCount: state.CampaignReducer.zeptoFunnelCount,
  };
};

const ConnectedMyComponent = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(ZeptoCampTable);

// eslint-disable-next-line react/display-name
export default forwardRef((props, ref) => {
  return <ConnectedMyComponent {...props} ref={ref} />;
});
