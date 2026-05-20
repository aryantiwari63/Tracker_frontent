import React from "react";
import Cards from "./Cards";
import { connect } from "react-redux";
import { addDays, format } from "date-fns";
import DatePicker from "../DatePicker";
import {
  dashboardBlinkitOverview,
  dashboardlinkitGraph,
} from "../../services/dashboard";
import BlinkitCampaignTable from "../BlinkIt/table/BlinkitCampaignTable";
import PerformanceBreakDown from "./PerformanceBreakdown";
import {
  ALL_COMP_DATE,
  BLINKIT_ACCOUNTS,
  COMP_DATE,
} from "../../utils/constants";
import { _PATCH, _DELETE, _POST, _GET } from "../../services/axios.method";
import {
  defaultDateRange,
  defaultFilterCheck,
  defaultCompareDateBlinkit,
  getLocalStorageAccounts,
  saveLocalStorageAccounts,
} from "../../utils/helpers";
import { GET_ALL_TAGS } from "../../utils/constants";
import CompareDatePicker from "../DatePicker/compareDatePicker";
import { getPerformanceBreakDown } from "../../redux/action-creator/blinkit/dashboardAction";
import SelectBox from "../common-components/selectBox";
import _ from "lodash";

class BlinkDashBoard extends React.Component {
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
        brand: undefined,
        start_date: format(new Date(dateFilters["startDate"]), "yyyy-MM-dd"),
        end_date: format(new Date(dateFilters["endDate"]), "yyyy-MM-dd"),
        // brand: ["Moov", "Brand 2", "Veet", "Durex", "Dettol"],
        // platform: ["MP", "SM"],
        // types: ["PLA", "PCA"],
        // types: [
        //   { label: "Reach", value: "Reach" },
        //   { label: "Performance", value: "Performance" },

        // ],
        drr: false,
        manual_compare_date: {},
        tags: [],
        compareId: compareFilters["compare_id"],
      },
      options: {
        brand: [],
        // brand: ["Moov", "Brand 2", "Veet", "Durex", "Dettol"],
        // platform: [
        //   { label: "Flipkart", value: "MP" },
        //   { label: "SuperMart", value: "SM" },
        // ],
        types: [
          { label: "Reach", value: "Reach" },
          { label: "Performance", value: "Performance" },
        ],

        tags: [],
      },
      summary: {
        overview: { data: [], view: [] },
        reach: { data: [], view: [] },
        performance: { data: [], view: [] },
      },
      graphFilters: ["estimated_budget_consumed", "impressions"],
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
  }

  async fetchTags() {
    try {
      const response = await _GET(
        `${GET_ALL_TAGS}?platform=blinkit&data_level=campaign`
      );
      const data = response.data.data.result;
      const tags = data.map((item) => {
        const { _id, tag_name } = item;
        return {
          label: tag_name,
          value: _id,
        };
      });
      this.setState((prevState) => ({
        options: {
          ...prevState.options,
          tags,
        },
      }));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }

  async componentDidMount() {
    await this.getAccounts();
    await this.fetchTags();
    await this.initLoad();
    const defaultCheckTypes = defaultFilterCheck(
      this.state.options.types,
      "/blinkit"
    );
    this.setState({
      defaultCheckTypes: defaultCheckTypes["blinkit"]["multi"].map((val) => ({
        label: val,
        value: val,
      })),
    });
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
    // let filters = this.state.filters;
    let { filters, options } = this.state;
    // console.log("filters>>>>>>>>>>>>>", filters, options);
    filters["brand"] =
      filters.brand.length === options.brand.length ? ["all"] : filters.brand;
    let dashData = await dashboardBlinkitOverview(filters);
    const res = await dashboardlinkitGraph({
      ...this.state.filters,
      filters: this.state.graphFilters,
    });
    this.props.dispatch(
      getPerformanceBreakDown({
        ...this.state.filters,
        filters: this.state.graphFilters,
      })
    );
    this.setState({
      summary: dashData?.data?.data,
      graphData: res?.data?.data,
    });
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

  // applyFilters(name, value) {
  //   let filters = this.state.filters;
  //   filters[name] = value;
  //   this.setState({ filters: filters }, () => {
  //     if (name != "start_date") this.initLoad();
  //   });
  // }
  applyFilters(name, value) {
    let filters = this.state?.filters;
    filters[name] = value;
    if (name === "brand") {
      // const brands = this.state.options.brand.filter((ele) =>
      //   filters[name].includes(ele.value)
      // );
      // const brandLabels = brands.map((ele) => ele.label);
      // const filteredTags = this.state.options.allTags.filter((tag) => {
      //   return tag.accounts.some((account) => brandLabels.includes(account));
      // });
      let labels = _.map(value, (val) => {
        let brandObj = _.find(this.state.options.brand, { value: val });
        return brandObj ? brandObj.label : undefined;
      });
      filters["brand"] =
        this.state.options.brand.length === labels.length ? ["all"] : value;
      saveLocalStorageAccounts(labels);
      // const filteredValues = filteredTags.map((ele) => ele._id);
      // const selectedTags = this.state.filters.tags.filter((ele) =>
      //   filteredValues.includes(ele)
      // );
      // filters["tags"] = selectedTags;
      this.setState((prevState) => ({
        options: {
          ...prevState.options,
          // tags: filteredTags,
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
      const res = await dashboardlinkitGraph({
        ...this.state.filters,
        filters: this.state.graphFilters,
      });
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

  getAccounts = async () => {
    try {
      const responseAccount = await _GET(BLINKIT_ACCOUNTS);
      // console.log("responseAccount>>>>>>>>>>>", responseAccount.data.data);
      const data = responseAccount.data.data;
      const accounts = data
        .filter((_, index) => index > 0) // Filter out the item with index 0
        .map((item) => ({
          label: item.label,
          value: item.value,
        }));

      let filterAccounts = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
        let selectedAccounts = savedAccounts
          .map((value) => accounts.find((account) => account.label === value))
          .filter(Boolean);
        if (_.size(_.compact(selectedAccounts))) {
          filterAccounts = selectedAccounts;
        } else {
          saveLocalStorageAccounts(_.map(accounts, "label"));
        }
      } else {
        saveLocalStorageAccounts(_.map(accounts, "label"));
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
          defaultCheckAccount: filterAccounts,
        }
        // () =>
        //   console.log(
        //     "this.state.defaultCheckAccount::::::",
        //     this.state.defaultCheckAccount
        //   )
      );
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
      compDateRange,
      compCalState,
      compDates,
      compareId,
      options,
      defaultCheckAccount,
    } = this.state;
    return (
      <>
        <div className="bg-white shadow-sm flex items-center gap-2 sticky z-40 top-14 mb-5 border px-2 py-4">
          {/* <div className="col">
              <div className="flipkart__selectfilter z-10 col">
                <SelectBox
                  options={options.brand}
                  defaultSelected={defaultCheckAccount}
                  applyFilters={this.applyFilters}
                  filterName={"brand"}
                  platform={"blinkit"}
                  label={"Select Brand"}
                />
              </div> */}
          {/* <div className="col_3 px-2">
            <SelectBox
              label={"Select Account"}
              // options={this.state.options.brand}
              options={options.brand}
              // defaultSelected={this.state.options.brand}
              defaultSelected={options.brand}
              applyFilters={this.applyFilters}
              filterName={"brand"}
              platform="blinkit"
            />
          </div> */}

          {/* <div className="col_3 px-2">
            <SelectBox
              label="Select Type"
              options={this.state.options.types}
              applyFilters={this.applyFilters}
              filterName={"types"} 
              defaultSelected={this.state.defaultCheckTypes}
              platform="blinkit"
            />
          </div> */}
          {/* <div className="col_3 px-2"> 
            <SelectBox
              label="Tags"
              options={this.state.options.types}
              applyFilters={this.applyFilters}
              filterName={"types"}
              defaultSelected={this.state.options.types}
              platform="blinkit"
            />
          </div> */}
          <div className="w-[25%] max-w-[25%]">
            <SelectBox
              options={options.brand}
              defaultSelected={defaultCheckAccount}
              applyFilters={this.applyFilters}
              filterName={"brand"}
              platform={"blinkit"}
              label={"Select Brand"}
            />
          </div>
          <div className="w-[25%] max-w-[25%]">
            <SelectBox
              // label="Select Tags"
              options={options.tags}
              applyFilters={this.applyFilters}
              filterName={"tags"}
              defaultSelected={options.tags}
              unSelectDefault={true}
              platform="blinkit"
              label={"Select Tag"}
              isBlinkitTag
            />
          </div>

          <div className="w-[25%] max-w-[25%] relative">
            <DatePicker
              onChangeDate={this.onChangeDate}
              platform="blinkit"
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
              cancelDate={() => {
                this.setState({ tempDate: this.state.dateRange });
              }}
              position={"left"}
              className="mt-5 border"
            />
          </div>
          <div className="w-[25%] max-w-[25%] relative ">
            <CompareDatePicker
              platform={"blinkit"}
              className="h-3 mt-5 !border"
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
        </div>
        {/* </div> */}
        {/* <div className=" flipkart__cardfiled">
            <ToggleButton
              label1={"Absolute"}
              label2={"DRR"}
              val={checked}
              setVal={this.changeDrr}
              platform="blinkit"
            ></ToggleButton>
          </div> */}
        {/* </div> */}

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
          <BlinkitCampaignTable
            dateRange={dateRange}
            filter={this.state.filters}
            // options={options}
          />
        </section>
        <section className="py-7">
          <PerformanceBreakDown
            dateRange={dateRange}
            filter={this.state.filters}
          />
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

export default connect(null, mapDispatchToProps)(BlinkDashBoard);
