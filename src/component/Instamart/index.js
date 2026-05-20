import React from "react";
import Cards from "./Card";
import { connect } from "react-redux";
import { addDays, format } from "date-fns";
import DatePicker from "../DatePicker";
import InstamartCampaignTable from "./table/InstamartCampaignTable";
import {
  GET_ALL_TAGS,
  ALL_COMP_DATE,
  COMP_DATE,
  INSTAMART_BRANDS,
  INSTAMART_DASHBOARD_OVERVIEW,
  INSTAMART_GRAPH,
} from "../../utils/constants";
import { _GET, _PATCH, _DELETE, _POST } from "../../services/axios.method";
import { setLoading } from "../../redux/action-creator/commonAction";
import {
  defaultCompareDateBlinkit,
  defaultDateRange,
  getLocalStorageAccounts,
  saveLocalStorageAccounts, //
} from "../../utils/helpers";
import CompareDatePicker from "../DatePicker/compareDatePicker";
import SelectBox from "../common-components/selectBox";
import SelectTagBox from "../CommonScreen/TagManager/SelectBox";
import _ from "lodash";
class InstamartDashboard extends React.Component {
  constructor(props) {
    super(props);
    const dateFilters = defaultDateRange();
    const compareFilters = defaultCompareDateBlinkit();
    this.state = {
      defaultCheckAccount: [],
      defaultCheckTypes: [],
      dateRange: [
        {
          startDate: new Date(dateFilters["startDate"]),
          endDate: new Date(dateFilters["endDate"]),
          key: dateFilters["key"],
        },
      ],
      calState: {
        showCalender: false,
        fullCalender: false,
        dateApplied: false,
      },
      filters: {
        start_date: format(new Date(dateFilters["startDate"]), "yyyy-MM-dd"),
        end_date: format(new Date(dateFilters["endDate"]), "yyyy-MM-dd"),
        brand: [],
        types: ["Awareness", "Performance"],
        tags: [],
        drr: false,
        manual_compare_date: {},
        compareId: compareFilters["compare_id"],
      },
      options: {
        brand: [],
        types: [
          { label: "Awareness", value: "Awareness" },
          { label: "Performance", value: "Performance" },
          // { label: "AWARENESS", value: "awareness" },
          // { label: "Performance", value: "performance" },
        ],
        tags: [],
        allTags: [],
      },
      brandDataListing: [],
      summary: {
        overview: { data: [], view: [] },
        reach: { data: [], view: [] },
        performance: { data: [], view: [] },
      },
      graphFilters: ["spend", "impressions"],
      graphData: [],
      tempDate: [
        {
          startDate: new Date(dateFilters["startDate"]),
          endDate: new Date(dateFilters["endDate"]),
          key: dateFilters["key"],
        },
      ],
      compareId: compareFilters["compare_id"],
      compDateRange: [
        {
          startDate: addDays(new Date(), -30),
          endDate: new Date(),
          key: "selection",
        },
      ],
      compDates: [],
      compCalState: {
        showCalender: false,
        fullCalender: false,
        dateApplied: false,
      },
      checked: false,
    };
    this.onChangeDate = this.onChangeDate.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.initLoad = this.initLoad.bind(this);
    this.setGraphFilters = this.setGraphFilters.bind(this);
    this.applyDate = this.applyDate.bind(this);
    this.editCompDate = this.editCompDate.bind(this);
    this.onCompChangeDate = this.onCompChangeDate.bind(this);
    this.deleteComp = this.deleteComp.bind(this);
    this.loadCompData = this.loadCompData.bind(this);
    this.saveComp = this.saveComp.bind(this);
    this.fetchAccounts = this.fetchAccounts.bind(this);
  }

  async componentDidMount() {
    await this.fetchAccounts();
    await this.fetchTags();
    await this.initLoad();

    // const defaultCheckTypes = defaultFilterCheck(
    //   this.state.options.types,
    //   "/blinkit"
    // );
    // this.setState({
    //   defaultCheckTypes: defaultCheckTypes["zepto"]["multi"].map((val) => ({
    //     label: val,
    //     value: val,
    //   })),
    // });
  }
  // async accountNames () {
  //   try {
  //     const result = await _GET(GET_ZEPTO_ACCOUNTS);
  //     const data = result.data.data;
  //     if (!Array.isArray(data)) {
  //       console.error("Common Account Data  is not an array or is undefined");
  //       // Handle the error appropriately
  //       return;
  //     }

  //     const accounts = data
  //       .map((item) => ({
  //         label: item.account_name,
  //         value: item.id,
  //       }));
  //     this.setState({
  //     brandDataListing: accounts
  //   });
  //     // setSelectedBrand(brandDataListing[0]);
  //     console.log("brand data listingggg",this.state.brandDataListing);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  async fetchAccounts() {
    try {
      setLoading(true);
      const result = await _GET(INSTAMART_BRANDS);
      const data = result.data.data;
      const accounts = data.map((item) => ({
        label: item.brand,
        value: item.brand,
      }));
      let filterAccounts = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(_.compact(savedAccounts))) {
        let selectedAccounts = savedAccounts
          .map((value) => accounts.find((account) => account.label === value))
          .filter(Boolean);
        if (_.size(selectedAccounts)) {
          filterAccounts = selectedAccounts;
        } else {
          saveLocalStorageAccounts(_.map(accounts, "value"));
        }
      } else {
        saveLocalStorageAccounts(_.map(accounts, "value"));
      }

      let options = this.state.options;
      options.brand = accounts;
      let filters = this.state.filters;
      filters.brand = _.map(filterAccounts, "value");
      // const defaultAccount = defaultFilterCheck(accounts, "/amazon");

      // console.log("defaultAccount:::::::::", defaultAccount["amazon"]["multi"]);
      // let selectedAccount = defaultAccount["amazon"]["multi"].map((index) =>
      //   accounts.find((object) => object.value === index)
      // );
      // console.log("selectedAccount::::::::::", filterAccount);
      this.setState(
        {
          options,
          filters,
          // defaultCheckAccount:
          //   defaultAccount["amazon"]["multi"].map((index) =>
          //     accounts.find((object) => object.value === index)
          //   ) || [],
          // defaultCheckAccount: accounts,
          defaultCheckAccount: filterAccounts,
        }
        // () =>
        //   console.log(
        //     "this.state.defaultCheckAccount::::::",
        //     this.state.defaultCheckAccount
        //   )
      );
    } catch (error) {
      console.error(error);
    }
  }

  async fetchTags() {
    try {
      const acc = this.state.options.brand.map((ele) => ele.value);
      const response = await _GET(
        `${GET_ALL_TAGS}?platform=instamart&data_level=campaign&accounts=${acc}`
      );
      const data = response.data.data.result;
      let filteredTags = data.filter((ele) => {
        const availableFilters = ele.accounts.filter((item) =>
          this.state.filters.brand.includes(item)
        );
        if (availableFilters.length > 0) {
          return true;
        }
        return false;
      });
      this.setState((prevState) => ({
        options: {
          ...prevState.options,
          tags: filteredTags,
          allTags: data,
        },
      }));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }

  onCompChangeDate(item) {
    let compDateRange = this.state.compDateRange[0];
    this.setState(
      { compDateRange: [{ ...compDateRange, ...item.selection }] },
      () => {
        this.applyFilters(
          "comp_start_date",
          format(this.state.compDateRange[0].startDate, "yyyy-MM-dd")
        );
        this.applyFilters(
          "comp_end_date",
          format(this.state.compDateRange[0].endDate, "yyyy-MM-dd")
        );
      }
    );

    // console.log(this.state.compDateRange[0], "<<<start date");
    if (!this.state.compCalState.fullCalender) {
      this.setState({
        compCalState: {
          ...this.state.compCalState,
          showCalender: false,
          dateApplied: true,
        },
      });
    }
  }

  async SetCompareData(id) {
    try {
      this.setState({ compareId: id });
      defaultCompareDateBlinkit(id);
      this.applyFilters("compareId", id);
    } catch (e) {
      console.error(e);
    }
  }

  async editCompDate(state, name, id) {
    try {
      const post = {
        name: name,
        startDate: state[0].startDate,
        endDate: state[0].endDate,
      };
      await _PATCH(COMP_DATE + `/${id}`, post);
      await this.loadCompData();
    } catch (e) {
      console.error(e);
    }
  }

  async loadCompData() {
    try {
      const post = {
        platform: "flipkart",
      };
      const res = await _POST(ALL_COMP_DATE, post);
      this.setState({ compDates: [...res.data.data.result] });
    } catch (e) {
      console.error(e);
    }
  }
  async saveComp(state, name) {
    try {
      const post = {
        name: name,
        startDate: state[0].startDate,
        endDate: state[0].endDate,
        platform: "flipkart",
      };
      await _POST(COMP_DATE, post);
      await this.loadCompData();
    } catch (e) {
      console.error(e);
    }
  }

  async initLoad() {
    try {
      let filters = this.state.filters;

      let dashData = await _POST(INSTAMART_DASHBOARD_OVERVIEW, filters);

      let data = {
        ...filters,
        filters: this.state.graphFilters,
      };
      const res = await _POST(INSTAMART_GRAPH, data);

      this.setState({
        summary: dashData?.data?.data,
        graphData: res?.data?.data,
      });
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }
  applyDate = () => {
    this.setState({ dateRange: this.state.tempDate }, () => {
      this.onChangeDate({ selection: this.state.tempDate[0] });
      // this.initLoad()
    });

    this.setState({
      calState: {
        showCalender: false,
        fullCalender: false,
        dateApplied: true,
      },
    });
  };

  onChangeDate(item) {
    let dateRange = this.state.dateRange[0];
    this.setState({ tempDate: [{ ...dateRange, ...item.selection }] });
    if (!this.state.calState.fullCalender) {
      let dateRange = this.state.dateRange[0];
      defaultDateRange(item.selection);
      this.setState(
        { dateRange: [{ ...dateRange, ...item.selection }] },
        () => {
          this.applyFilters(
            "start_date",
            format(this.state.dateRange[0].startDate, "yyyy-MM-dd")
          );
          this.applyFilters(
            "end_date",
            format(this.state.dateRange[0].endDate, "yyyy-MM-dd")
          );
        }
      );

      this.setState({
        calState: {
          ...this.state.calState,
          showCalender: false,
          dateApplied: true,
        },
      });
    }
  }

  async deleteComp(id) {
    try {
      await _DELETE(COMP_DATE + `/${id}`);
      await this.loadCompData();
    } catch (e) {
      console.error(e);
    }
  }

  applyFilters(name, value) {
    let filters = this.state?.filters;
    filters[name] = value;
    if (name === "brand") {
      const filteredTags = this.state.options.allTags.filter((tag) => {
        return tag.accounts.some((account) => filters[name].includes(account));
      });
      const filteredValues = filteredTags.map((ele) => ele._id);
      const selectedTags = this.state.filters.tags.filter((ele) =>
        filteredValues.includes(ele)
      );
      filters["tags"] = selectedTags;
      // const filteredAccounts = this.state.options.brand.filter(ele => value.includes(ele.label));
      saveLocalStorageAccounts(value);
      this.setState((prevState) => ({
        options: {
          ...prevState.options,
          tags: filteredTags,
        },
      }));
    }
    this.setState({ filters: filters }, () => {
      if (name != "start_date") {
        this.initLoad();
        if (Object.keys(this.state.filters.manual_compare_date).length > 0) {
          this.setState({
            filters: { ...this.state.filters, manual_compare_date: {} },
          });
        }
      }
    });
  }

  setGraphFilters(val) {
    this.setState({ graphFilters: val }, async () => {
      let data = {
        ...this.state.filters,
        filters: this.state.graphFilters,
      };
      const res = await _POST(INSTAMART_GRAPH, data);
      this.setState({ graphData: res?.data?.data });
    });
  }

  changeDrr = async () => {
    try {
      this.applyFilters("drr", !this.state.checked);
      this.setState({ checked: !this.state.checked }, () => this.initLoad());
    } catch (e) {
      console.error(e);
    }
  };

  handleApplyButton = () => {
    try {
      // this.setState({
      //   compareId: "2",
      //   // compDateRange: this.state.compDateRange[0],
      // });
      this.applyFilters("manual_compare_date", this.state.compDateRange[0]);
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    let {
      dateRange,
      calState,
      summary,
      graphFilters,
      graphData,
      options,
      compDateRange,
      compCalState,
      compDates,
      compareId,
      defaultCheckAccount,
    } = this.state;
    const tagsOptions = options?.tags.map((item) => {
      const { _id, tag_name } = item;
      return {
        label: tag_name,
        value: _id,
      };
    });
    return (
      <>
        <div className="bg-white shadow-sm flex items-center gap-2 sticky z-40 top-14 mb-5 border px-2 py-4">
          <div className="w-[25%] max-w-[25%]">
            <SelectBox
              // label={"Select Account"}
              options={options.brand}
              // defaultSelected={this.state.options.brand}
              defaultSelected={defaultCheckAccount}
              applyFilters={this.applyFilters}
              filterName={"brand"}
              platform="instamart"
              label={"Select Brand"}
            />
          </div>

          <div className="w-[25%] max-w-[25%]">
            <SelectTagBox
              // label="Select Tags"
              options={tagsOptions}
              applyFilters={this.applyFilters}
              filterName={"tags"}
              defaultSelected={options.tags}
              unSelectDefault={true}
              platform="instamart"
              label={"Select Tag"}
              accounts={this.state.filters.brand}
            />
          </div>

          <div className="relative w-[25%] max-w-[25%] ">
            <DatePicker
              onChangeDate={this.onChangeDate}
              platform="instamart"
              dashboard={"dashboard"}
              // state={dateRange}
              state={this.state.tempDate}
              setDate={(data) => {
                this.setState({ dateRange: data });
              }}
              calState={calState}
              setCalState={(data) => {
                // if (!data.showCalender) {
                //   alert("etst");
                // }
                // console.log(
                //   "showCalender:::::::",
                //   this.state.calState.fullCalender
                // );
                this.setState({ calState: data });
              }}
              applyDate={this.applyDate}
              position={""}
              cancelDate={() => {
                this.setState({ tempDate: this.state.dateRange });
              }}
              className="!top-[38px] border"
            />
          </div>

          <div className="relative w-[25%] max-w-[25%] ">
            <CompareDatePicker
              platform={"instamart"}
              className="h-3 !top-[38px]"
              onChangeDate={this.onCompChangeDate}
              state={compDateRange}
              setState={(data) => {
                this.setState({ compDateRange: data });
              }}
              calState={compCalState}
              setCalState={(data) => {
                this.setState({ compCalState: data });
              }}
              applyDate={this.applyDate}
              saveComp={this.saveComp}
              compDates={compDates}
              loadCompData={this.loadCompData}
              compareId={compareId}
              setCompId={(id) => {
                this.SetCompareData(id);
              }}
              editCompDate={this.editCompDate}
              deleteComp={this.deleteComp}
              mainCalendarRange={this.state.dateRange}
              handleApplyButton={this.handleApplyButton}
            />
          </div>
          {/* <div className=" flipkart__cardfiled">
            <ToggleButton
              label1={"Absolute"}
              label2={"DRR"}
              val={checked}
              setVal={this.changeDrr}
              platform="blinkit"
            ></ToggleButton>
          </div> */}
        </div>

        {/* cards section start */}

        <div className=" flipkart__cardfiled">
          <Cards
            summary={summary}
            graphFilters={graphFilters}
            setGraphFilters={this.setGraphFilters}
            graphData={graphData}
            state={dateRange}
            setVal={this.changeDrr}
          />
        </div>

        <section className="py-7">
          {/* <BlinkitCampaignTable /> */}
          {/* {this.state.options.brand.length > 0 && (
            <BlinkitCampaignTable
              dateRange={dateRange}
              filter={this.state.filters}
            />
            )} */}

          <InstamartCampaignTable
            dateRange={dateRange}
            filter={this.state.filters}
          />
        </section>
        {/* <section className="py-7">
          <PerformanceBreakDown
            dateRange={dateRange}
            filter={this.state.filters}
          />
        </section> */}
        <section className="py-6">
          <div className="outerContainer outerContainer__blinkitimage "></div>
        </section>
        {/* <section className="py-7">
      
          <RuleAnalysisTable />
        </section> */}
      </>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(null, mapDispatchToProps)(InstamartDashboard);
