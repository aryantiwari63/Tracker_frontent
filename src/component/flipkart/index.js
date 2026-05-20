import React from "react";
import SelectBox from "../common-components/selectBox";
import SelectTagBox from "../CommonScreen/TagManager/SelectBox";
import DatePicker from "../DatePicker";
import CompareDatePicker from "../DatePicker/compareDatePicker";
import { addDays, format } from "date-fns";
import { dashboardGraph, dashboardOverview } from "../../services/dashboard";
import { _GET, _POST, _PATCH, _DELETE } from "../../services/axios.method";
import {
  GET_ALL_TAGS,
  GET_ACCOUNTS,
  COMP_DATE,
  ALL_COMP_DATE,
} from "../../utils/constants";
import {
  defaultDateRange,
  defaultCompareDateBlinkit,
  getLocalStorageAccounts,
  saveLocalStorageAccounts,
} from "../../utils/helpers";
import Cards from "./Cards";
import CampaignsTable from "./tables/CampaignsTable";
import { setLoading } from "../../redux/action-creator/commonAction";
import _ from "lodash";

class FlipkartDashBoard extends React.Component {
  constructor(props) {
    super(props);
    const dateFilters = defaultDateRange();
    const compareFilters = defaultCompareDateBlinkit();
    this.state = {
      defaultCheckAccount: [],
      dateRange: [
        {
          startDate: new Date(dateFilters["startDate"]),
          endDate: new Date(dateFilters["endDate"]),
          key: dateFilters["key"],
        },
      ],
      compDateRange: [
        {
          startDate: addDays(new Date(), -30),
          endDate: new Date(),
          key: "selection",
        },
      ],
      calState: {
        showCalender: false,
        fullCalender: false,
        dateApplied: false,
      },
      compCalState: {
        showCalender: false,
        fullCalender: false,
        dateApplied: false,
      },
      filters: {
        start_date: format(new Date(dateFilters["startDate"]), "yyyy-MM-dd"),
        end_date: format(new Date(dateFilters["endDate"]), "yyyy-MM-dd"),
        brand: [],
        platform: ["MP", "SM"],
        types: ["PLA", "PCA"],
        drr: false,
        tags: [],
        compareId: compareFilters["compare_id"],
        manual_compare_date: {},
      },
      options: {
        brand: [],
        platform: [
          { label: "Flipkart", value: "MP" },
          { label: "Supermart", value: "SM" },
        ],
        types: [
          { label: "PLA", value: "PLA" },
          { label: "PCA", value: "PCA" },
        ],
        tags: [],
        allTags: [],
      },
      summary: {
        overview: { data: [], view: [] },
        direct: { data: [], view: [] },
        indirect: { data: [], view: [] },
      },
      graphFilters: ["spend", "orders"],
      graphData: [],
      compDates: [],
      compareId: compareFilters["compare_id"],
      checked: false,
      tempDate: [
        {
          startDate: new Date(dateFilters["startDate"]),
          endDate: new Date(dateFilters["endDate"]),
          key: dateFilters["key"],
        },
      ],
    };
    this.onChangeDate = this.onChangeDate.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.initLoad = this.initLoad.bind(this);
    this.setGraphFilters = this.setGraphFilters.bind(this);
    this.applyDate = this.applyDate.bind(this);
    this.onCompChangeDate = this.onCompChangeDate.bind(this);
    this.loadCompData = this.loadCompData.bind(this);
    this.saveComp = this.saveComp.bind(this);
    this.editCompDate = this.editCompDate.bind(this);
    this.deleteComp = this.deleteComp.bind(this);
    this.SetCompareData = this.SetCompareData.bind(this);
    this.changeDrr = this.changeDrr.bind(this);
    this.handleApplyButton = this.handleApplyButton.bind(this);
  }

  async componentDidMount() {
    await this.fetchAccounts();
    await this.initLoad();
    await this.fetchTags();
  }

  async fetchTags() {
    try {
      const acc = this.state.options.brand.map((ele) => ele.value);
      const response = await _GET(
        `${GET_ALL_TAGS}?platform=flipkart&data_level=campaign&accounts=${acc}`
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

  async fetchAccounts() {
    try {
      setLoading(true);
      const result = await _GET(GET_ACCOUNTS);
      const data = result.data.data.result;
      const accounts = data.map((item) => ({
        label: item._id.account,
        value: item._id.account,
      }));
      let filterAccounts = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
        let selectedAccounts = savedAccounts
          .map((value) => accounts.find((account) => account.value === value))
          .filter(Boolean);
        if (_.size(_.compact(selectedAccounts))) {
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

      this.setState({
        options,
        filters,
        defaultCheckAccount: filterAccounts,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async initLoad() {
    try {
      let filters = this.state.filters;
      filters.drr = this.state.checked;
      let dashData = await dashboardOverview(filters);
      const res = await dashboardGraph({
        ...this.state.filters,
        filters: this.state.graphFilters,
      });

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

  applyFilters(name, value) {
    let filters = this.state.filters;
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
      // let arrangingAccounts = this.state.options.brand.filter(ele => value.includes(ele.label))
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
      const res = await dashboardGraph({
        ...this.state.filters,
        filters: this.state.graphFilters,
      });
      this.setState({ graphData: res?.data?.data });
    });
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

  async deleteComp(id) {
    try {
      await _DELETE(COMP_DATE + `/${id}`);
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

  async SetCompareData(id) {
    try {
      this.setState({ compareId: id });
      defaultCompareDateBlinkit(id);
      // this.setState({
      //   filters: { ...this.state.filters, manual_compare_date: {} },
      // });
      this.applyFilters("compareId", id);
    } catch (e) {
      console.error(e);
    }
  }

  async changeDrr() {
    try {
      this.applyFilters("drr", !this.state.checked);
      this.setState({ checked: !this.state.checked });
    } catch (e) {
      console.error(e);
    }
  }

  async handleApplyButton() {
    try {
      this.applyFilters("manual_compare_date", this.state.compDateRange[0]);
    } catch (e) {
      console.error(e);
    }
  }

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
      checked,
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
          <div className="w-[15%] max-w-[15%] z-0">
            <SelectBox
              options={options.brand}
              defaultSelected={defaultCheckAccount}
              applyFilters={this.applyFilters}
              filterName={"brand"}
              label={"Select Brand"}
              platform={"flipkart"}
            />
          </div>
          <div className="w-[15%] max-w-[15%] z-0">
            <SelectBox
              // label="Select Platform"
              options={options.platform}
              applyFilters={this.applyFilters}
              filterName={"platform"}
              defaultSelected={options.platform}
              label={"Select Platform"}
              platform={"flipkart"}
            />
          </div>
          <div className="w-[15%] max-w-[15%] z-0">
            <SelectBox
              // label="Select Type"
              options={options.types}
              applyFilters={this.applyFilters}
              filterName={"types"}
              defaultSelected={options.types}
              label={"Select Type"}
              platform={"flipkart"}
            />
          </div>
          <div className="w-[15%] max-w-[15%] z-0">
            <SelectTagBox
              // label="Select Tags"
              options={tagsOptions}
              applyFilters={this.applyFilters}
              filterName={"tags"}
              defaultSelected={options.tags}
              unSelectDefault={true}
              label={"Select Tag"}
              accounts={this.state.filters.brand}
              platform={"flipkart"}
            />
          </div>
          <div className="relative w-[20%] max-w-[20%] ">
            <DatePicker
              className="border !top-[38px]"
              onChangeDate={this.onChangeDate}
              platform="flipkart"
              dashboard={"dashboard"}
              state={this.state.tempDate}
              setState={(data) => {
                this.setState({ dateRange: data });
              }}
              calState={calState}
              setCalState={(data) => {
                this.setState({ calState: data });
              }}
              applyDate={this.applyDate}
              cancelDate={() => {
                this.setState({ tempDate: this.state.dateRange });
              }}
            />
          </div>
          <div className="relative w-[20%] max-w-[20%]  ">
            <CompareDatePicker
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
        </div>

        <div className="flipkart__cardfiled">
          <Cards
            summary={summary}
            graphFilters={graphFilters}
            setGraphFilters={this.setGraphFilters}
            graphData={graphData}
            state={dateRange}
            val={checked}
            setVal={this.changeDrr}
          />
        </div>
        {/* cards section end */}

        {/* Campaigns section start */}
        <section className="py-7">
          {this.state.options.brand.length > 0 && (
            <CampaignsTable dateRange={dateRange} filter={this.state.filters} />
          )}
        </section>
        {/* Campaigns section end */}
      </>
    );
  }
}

export default FlipkartDashBoard;
