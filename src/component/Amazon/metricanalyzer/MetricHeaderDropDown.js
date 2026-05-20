/* eslint-disable no-case-declarations */
import React from "react";
import _ from 'lodash';
import SelectBox from "../../common-components/selectBox";
import SelectTagBox from "../../CommonScreen/TagManager/SelectBox";
import DatePicker from "../../DatePicker";
import { addDays, format } from "date-fns";
import {
  dashboardAmazonGraph,
  dashboardAmazonOverview,
} from "../../../services/dashboard";
import { _GET } from "../../../services/axios.method";
import {  GET_ALL_TAGS } from "../../../utils/constants";

import {
  defaultDateRange,
  defaultCompareDate,
  defaultFilterCheck,
  getLocalStorageAccounts,
  saveLocalStorageAccounts
} from "../../../utils/helpers";

import { setLoading } from "../../../redux/action-creator/commonAction";

import { AMAZON_ACCOUNTS } from "../../../utils/amazonConstants";

class MetricHeaderDropDown extends React.Component {
  constructor(props) {
    super(props);
    const dateFilters = defaultDateRange();
    const compareFilters = defaultCompareDate();
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
        // platform: ["MP", "SM"],
        types: ["SP", "SB", "SD"],

        drr: false,
        manual_compare_date: {},
      },
      options: {
        brand: [],

        types: [
          { label: "Sponsored Product", value: "SP" },
          { label: "Sponsored Brand", value: "SB" },
          { label: "Sponsored Display", value: "SD" },
        ],
        tags: [],
        allTags: []
      },
      summary: {
        overview: { data: [], view: [] },
        direct: { data: [], view: [] },
        indirect: { data: [], view: [] },
      },
      graphFilters: ["impressions", "clicks"],
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
    this.applyDate = this.applyDate.bind(this);
  }

  async componentDidMount() {
    await this.fetchAccounts();
    await this.initLoad();
    await this.fetchTags();
  }

  async fetchTags() {
    try {
      const acc = _.map(this.state.options.brand, 'label');
      const response = await _GET(
        `${GET_ALL_TAGS}?platform=amazon&data_level=campaign&accounts=${acc}`
      );
      const data = response.data.data.result;
      let brands = _.filter(this.state.options.brand, (ele) => _.includes(this.state.filters.brand, ele.value));
      let brandsLabels = _.map(brands, 'label');
      let filteredTags = _.filter(data, (ele) => {
        return _.some(ele.accounts, (item) => _.includes(brandsLabels, item));
      });
      this.setState((prevState) => ({
        options: {
          ...prevState.options,
          tags: filteredTags,
          allTags: data
        },
      }));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }

  async fetchAccounts() {
    try {
      setLoading(true);
      const result = await _GET(AMAZON_ACCOUNTS);
      const data = result.data.data;
      const accounts = data.map((item) => ({
        label: item.label,
        value: item.value,
      }));
      // const filterAccount = data.map((item) => item.value);
      let filterAccounts = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
        let selectedAccounts = savedAccounts.map(value =>
          accounts.find(account => account.label === value)
        ).filter(Boolean);
          if (_.size(_.compact(selectedAccounts))) {
            filterAccounts = selectedAccounts;
          } else {
            saveLocalStorageAccounts(_.map(accounts, 'value'));
          }
      } else {
        saveLocalStorageAccounts(_.map(accounts, 'value'));
      }

      let options = this.state.options;
      options.brand = accounts;
      let filters = this.state.filters;
      filters.brand = _.map(filterAccounts, 'value');
      // const defaultAccount = defaultFilterCheck(accounts, "/amazon");
      // let selectedAccount =
      // let selectedAccount = defaultAccount["amazon"]["multi"].map((index) =>
      //   accounts.find((object) => object.value === index)
      // );
      this.setState({
        options,
        filters,
        defaultCheckAccount: filterAccounts
      });
      //   const platform = defaultAccount["amazon"]["multi"].map((index) =>
      //   accounts.find((object) => object.value === index)
      // ) || []
      // console.log(platform, "seleeeeee")
      this.props.setPlatform(filterAccounts);
    } catch (error) {
      console.error(error);
    }
  }

  async initLoad() {
    try {
      let filters = this.state.filters;
      let options = this.state.options?.brand;
      let defaultCheckAccount = defaultFilterCheck([], "/amazon");
      const filterAccount = defaultCheckAccount["amazon"]["multi"].map(
        (index) => options.find((object) => object.value === index)
      );
      filters["brand"] = filterAccount?.map((item) => item.value);
      filters.drr = this.state.checked;
      filters.types = this.state.filters.types;
      let dashData = await dashboardAmazonOverview(filters);
      const res = await dashboardAmazonGraph({
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
      this.props.setDateRange(this.state.tempDate);
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
          this.applyFilters("date_range", this.state.dateRange);
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

  applyFilters(name, value) {
    switch (name) {
      case "brand":
        const temp = this.state.options.brand.filter((item) => {
          if (value.includes(item.value)) {
            return item;
          }
        });
        const brandLabels = temp.map(ele => ele.label);
        const filteredTags = this.state.options.allTags.filter(tag => {
          return tag.accounts.some(account => brandLabels.includes(account));
        });
        const filteredValues = filteredTags.map(ele => ele._id);
        const selectedTags = this.props.tags.filter(ele=>filteredValues.includes(ele));
        this.props.setTags(selectedTags);
        this.setState((prevState) => ({
          options: {
            ...prevState.options,
            tags: filteredTags,
          },
        }));
        let labels = _.map(value, val => {
          let brandObj = _.find(this.state.options.brand, { 'value': val });
          return brandObj ? brandObj.label : undefined;
        });
        saveLocalStorageAccounts(labels);
        this.props.setPlatform(temp);
        break;
      case "types":
        const temptype = this.state.options.types.filter((item) => {
          if (value.includes(item.value)) {
            return item;
          }
        });
        this.props.setCampType(temptype);
        break;
      case "tags":
        const tagsOptions = this.state.options?.tags.map((item) => {
          const { _id, tag_name } = item;
          return {
            label: tag_name,
            value: _id,
          };
        });
        const tempTags = tagsOptions.filter((item) => {
          if (value.includes(item.value)) {
            return item;
          }
        });
        this.props.setTags(tempTags);
        break;

      case "date_range":
        let tempArr = [];
        let startDate = format(value[0].startDate, "yyyy-MM-dd");
        let endDate = format(value[0].endDate, "yyyy-MM-dd");
        tempArr.push({ startDate, endDate });
        this.props.setDateRange(tempArr);
        break;

      default:
      // code block
    }
  }

  render() {
    let { calState, options } = this.state;
     const tagsOptions = options?.tags.map((item) => {
      const { _id, tag_name } = item;
      return {
        label: tag_name,
        value: _id,
      };
    });
    return (
      <>
        <div className="row  items-center mb-5 ">
          <div className="col">
            <div className="row pl-3">
              <div className="flipkart__selectfilter col">
                <SelectBox
                  options={options.brand}
                  defaultSelected={this.props.platform}
                  applyFilters={this.applyFilters}
                  filterName={"brand"}
                  platform={"ams"}
                />
              </div>

              <div className="flipkart__selectfilter col">
                <SelectBox
                  options={options.types}
                  applyFilters={this.applyFilters}
                  filterName={"types"}
                  defaultSelected={this.props.campType}
                  platform={"ams"}
                />
              </div>
              <div className="flipkart__selectfilter col">
                <SelectTagBox
                  options={tagsOptions}
                  applyFilters={this.applyFilters}
                  filterName={"tags"}
                  defaultSelected={options.tags}
                  unSelectDefault={true}
                  platform={"ams"}
                  label={"Select Tag"}
                  accounts = {this.state.filters.brand}
                />
              </div>
            </div>
          </div>

          <div
            className="flipkart__calander p-4"
            style={{ width: "max-content" }}
          >
            <DatePicker
              platform={"ams"}
              onChangeDate={this.onChangeDate}
              state={this.state.tempDate}
              setState={(data) => {
                this.props.setDateRange(data);
                this.setState({ dateRange: data });
              }}
              calState={calState}
              setCalState={(data) => {
                this.setState({ calState: data });
              }}
              applyDate={this.applyDate}
              className="!top-[50px] border"
            />
          </div>
          {/* <div className="bg-[#EF880F] border px-4 text-sm py-1.5 text-white rounded">
            <button onClick={this.props.onApply}>Apply</button>
          </div> */}
        </div>

        {/* <div>
        <RadioButtonGroup/>
     </div> */}
      </>
    );
  }
}

export default MetricHeaderDropDown;
