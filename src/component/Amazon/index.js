import React from "react";
import SelectBox from "../common-components/selectBox";
import _ from "lodash";
import SelectTagBox from "../CommonScreen/TagManager/SelectBox";
import DatePicker from "../DatePicker";
import CompareDatePicker from "../DatePicker/compareDatePicker";
import { addDays, format } from "date-fns";
import {
  dashboardAmazonGraph,
  dashboardAmazonOverview,
} from "../../services/dashboard";
import { _GET, _POST, _DELETE, _PATCH } from "../../services/axios.method";
import { GET_ALL_TAGS, ALL_COMP_DATE, COMP_DATE } from "../../utils/constants";
import {
  defaultDateRange,
  defaultCompareDateBlinkit,
  getLocalStorageAccounts,
  saveLocalStorageAccounts,
} from "../../utils/helpers";
import Cards from "./Cards";
import { setLoading } from "../../redux/action-creator/commonAction";
import AmazonCampaignTable from "./table/AmazonCampaignTable";
import { AMAZON_ACCOUNTS } from "../../utils/amazonConstants";

class AmazonDashBoard extends React.Component {
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
      // filters: {
      //   start_date: format(addDays(new Date(), -7), "yyyy-MM-dd"),
      //   end_date: format(new Date(), "yyyy-MM-dd"),
      //   brand: [],
      //   platform: ["MP", "SM"],
      //   types: ["PLA", "PCA"],
      //   drr: false,
      // },
      filters: {
        start_date: format(new Date(dateFilters["startDate"]), "yyyy-MM-dd"),
        end_date: format(new Date(dateFilters["endDate"]), "yyyy-MM-dd"),
        brand: [],
        tags: [],
        // platform: ["MP", "SM"],
        types: ["SP", "SB", "SD"],
        compareId: compareFilters["compare_id"],
        drr: false,
        manual_compare_date: {},
      },
      options: {
        brand: [],
        // platform: [
        //   { label: "Flipkart", value: "MP" },
        //   { label: "SuperMart", value: "SM" },
        // ],
        // types: [
        //   { label: "PLA", value: "PLA" },
        //   { label: "PCA", value: "PCA" },
        // ],
        types: [
          { label: "Sponsored Product", value: "SP" },
          { label: "Sponsored Brand", value: "SB" },
          { label: "Sponsored Display", value: "SD" },
        ],
        tags: [],
        allTags: [],
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
      const acc = this.state.options.brand.map((ele) => ele.label);
      const response = await _GET(
        `${GET_ALL_TAGS}?platform=amazon&data_level=campaign&accounts=${acc}`
      );
      const data = response.data.data.result;
      let brands = this.state.options.brand.filter((ele) =>
        this.state.filters.brand.includes(ele.value)
      );
      let brandsLabels = _.map(brands, "label");
      let filteredTags = data.filter((ele) => {
        let availableFilters = ele.accounts.filter((item) =>
          brandsLabels.includes(item)
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
      const result = await _GET(AMAZON_ACCOUNTS);
      const data = result.data.data;
      const accounts = data.map((item) => ({
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
    } catch (error) {
      console.error(error);
    }
  }

  async initLoad(graph = true) {
    try {
      // console.log(
      //   "this.state.dateRange:::",
      //   this.state.defaultCheckAccount,
      //   this.state.options
      // );
      // if (this.state.defaultCheckAccount.length > 0) {
      let filters = this.state.filters;
      // let defaultCheckAccount = defaultFilterCheck([], "/amazon");
      // const filterAccount = defaultCheckAccount["amazon"]["multi"].map(
      //   (index) => options.find((object) => object.value === index)
      // );
      // filters["brand"] = filterAccount?.map((item) => item.value);
      // filters["brand"] = options?.map((item) => item.value);
      filters.drr = this.state.checked;
      filters.types = this.state.filters.types;
      // console.log(filters.types, "<<<<<filter type");
      let dashData = await dashboardAmazonOverview(filters);
      if (graph) {
        const res = await dashboardAmazonGraph({
          ...this.state.filters,
          filters: this.state.graphFilters,
        });

        this.setState({
          summary: dashData?.data?.data,
          graphData: res?.data?.data,
        });
      } else {
        this.setState({
          summary: dashData?.data?.data,
        });
      }

      // }
      // else{

      // }
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

  applyFilters(name, value) {
    let filters = this.state.filters;
    filters[name] = value;
    if (name === "brand") {
      const brands = this.state.options.brand.filter((ele) =>
        filters[name].includes(ele.value)
      );
      const brandLabels = brands.map((ele) => ele.label);
      const filteredTags = this.state.options.allTags.filter((tag) => {
        return tag.accounts.some((account) => brandLabels.includes(account));
      });
      let labels = _.map(value, (val) => {
        let brandObj = _.find(this.state.options.brand, { value: val });
        return brandObj ? brandObj.label : undefined;
      });
      // let filterSelectedAccounts = this.state.options.brand.filter(ele => brandLabels.includes(ele.label));
      saveLocalStorageAccounts(labels);
      const filteredValues = filteredTags.map((ele) => ele._id);
      const selectedTags = this.state.filters.tags.filter((ele) =>
        filteredValues.includes(ele)
      );
      filters["tags"] = selectedTags;
      this.setState((prevState) => ({
        options: {
          ...prevState.options,
          tags: filteredTags,
        },
      }));
    }
    this.setState({ filters: filters }, () => {
      if (name != "start_date") {
        if (name == "drr") {
          let graph = false;
          this.initLoad(graph);
        } else {
          this.initLoad();
        }
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
      const res = await dashboardAmazonGraph({
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
      await this.setState({ checked: !this.state.checked });
    } catch (e) {
      console.error(e);
    }
  }

  async handleApplyButton() {
    try {
      this.setState({
        // compareId: "2",
        // compDateRange: this.state.compDateRange[0],
      });
      // defaultCompareDate("2");
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
    // console.log("summary>>>>>>>>>>>>>>>>>>", summary);
    return (
      <>
        <div className="bg-white shadow-sm flex items-center gap-2 sticky z-40 top-14 mb-5 border px-2 py-4">
          <div className="w-[20%] max-w-[20%] z-10 ">
            <SelectBox
              // label="Select Brand"
              options={options.brand}
              defaultSelected={defaultCheckAccount}
              applyFilters={this.applyFilters}
              filterName={"brand"}
              platform={"ams"}
              label={"Select Brand"}
            />
          </div>

          <div className="w-[20%] max-w-[20%] z-10 ">
            <SelectBox
              // label="Select Type"
              options={options.types}
              applyFilters={this.applyFilters}
              filterName={"types"}
              defaultSelected={options.types}
              platform={"ams"}
              label={"Select Platform"}
            />
          </div>
          <div className="w-[20%] max-w-[20%] z-10 ">
            <SelectTagBox
              // label="Select Tags"
              options={tagsOptions}
              applyFilters={this.applyFilters}
              filterName={"tags"}
              defaultSelected={options.tags}
              unSelectDefault={true}
              platform={"ams"}
              label={"Select Tag"}
              accounts={this.state.filters.brand}
            />
          </div>
          <div className="relative w-[20%] max-w-[20%] ">
            <DatePicker
              platform={"ams"}
              dashboard={"dashboard"}
              onChangeDate={this.onChangeDate}
              state={this.state.tempDate}
              setState={(data) => {
                // console.log("data::::::::", data);
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
              className="border"
            />
          </div>
          <div className="relative w-[20%] max-w-[20%] ">
            <CompareDatePicker
              className="h-3"
              platform={"ams"}
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

        {/* cards section start */}
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
            <AmazonCampaignTable
              dateRange={dateRange}
              filter={this.state.filters}
            />
          )}
        </section>
        {/* Campaigns section end */}
      </>
    );
  }
}

export default AmazonDashBoard;

// import React from "react";
// import SelectBox from "../common-components/selectBox";
// import DatePicker from "../DatePicker";
// import { addDays, format } from "date-fns";
// import { dashboardGraph, dashboardOverview } from "../../services/dashboard";
// import { _GET } from "../../services/axios.method";
// import { TAGS } from "../../utils/constants";
// import Cards from "./Cards";
// import CampaignsTable from "../flipkart/tables/CampaignsTable";
// import GraphSegment from "./graph";
// // import {IoIosArrowDropdown} from "react-icons/io"
// import RepositionIcon from "./dragiconpopup";
// import PopupCard from "./dragiconpopup/PopUpCard";
// import CampaignTypePerformanceTable from "./table/GraphTable";

// class AmazonDashBoard extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dateRange: [
//         {
//           startDate: addDays(new Date(), -30),
//           endDate: new Date(),
//           key: "selection",
//         },
//       ],
//       calState: {
//         showCalender: false,
//         fullCalender: false,
//         dateApplied: false,
//       },
//       filters: {
//         start_date: format(addDays(new Date(), -30), "yyyy-MM-dd"),
//         end_date: format(new Date(), "yyyy-MM-dd"),
//         brand: ["Moov", "Dettol", "Durex", "Veet"],
//         platform: ["MP", "SM"],
//         types: ["PLA", "PCA"],
//       },
//       options: {
//         brand: [
//           { label: "Moov", value: "Moov" },
//           { label: "Dettol", value: "Dettol" },
//           { label: "Durex", value: "Durex" },
//           { label: "Veet", value: "Veet" },
//         ],
//         platform: [
//           { label: "Campaign Tag", value: "MP" },
//           { label: "Portfolio", value: "SM" },
//         ],
//         types: [
//           { label: "Bathroom_Cleaner", value: "PLA" },
//           { label: "Campiagn with no OOB issue", value: "PCA" },
//           { label: "Disinfectant_Spray", value: "PCA" },
//           { label: "Drain_CLeaner", value: "PCA" },
//           { label: "Floor_Cleaner", value: "PCA" },
//           { label: "Glass_Cleaner", value: "PCA" },
//         ],
//         tags: [],
//       },
//       summary: {
//         overview: { data: [], view: [] },
//         direct: { data: [], view: [] },
//         indirect: { data: [], view: [] },
//       },
//       graphFilters: ["spend", "orders"],
//       graphData: [],
//     };
//     this.onChangeDate = this.onChangeDate.bind(this);
//     this.applyFilters = this.applyFilters.bind(this);
//     this.initLoad = this.initLoad.bind(this);
//     this.setGraphFilters = this.setGraphFilters.bind(this);
//     this.applyDate = this.applyDate.bind(this);
//   }

//   async componentDidMount() {
//     await this.initLoad();
//     await this.fetchTags();
//   }

//   async fetchTags() {
//     try {
//       const response = await _GET(TAGS);
//       const data = response.data.data.result;
//       const tags = data.map((item) => {
//         const { _id, tag_name } = item;
//         return {
//           label: tag_name,
//           value: _id,
//         };
//       });
//       this.setState((prevState) => ({
//         options: {
//           ...prevState.options,
//           tags: tags,
//         },
//       }));
//     } catch (error) {
//       console.error("Error fetching tags:", error);
//     }
//   }

//   async initLoad() {
//     try {
//       let filters = this.state.filters;
//       let dashData = await dashboardOverview(filters);
//       const res = await dashboardGraph({
//         ...this.state.filters,
//         filters: this.state.graphFilters,
//       });

//       this.setState({
//         summary: dashData?.data?.data,
//         graphData: res?.data?.data,
//       });
//     } catch (error) {
//       console.error("Error initializing data:", error);
//     }
//   }

//   applyDate = () => {
//     this.onChangeDate({ selection: this.state.dateRange[0] });
//     this.setState({
//       calState: {
//         showCalender: false,
//         fullCalender: false,
//         dateApplied: true,
//       },
//     });
//   };

//   onChangeDate(item) {
//     let dateRange = this.state.dateRange[0];
//     this.setState({ dateRange: [{ ...dateRange, ...item.selection }] }, () => {
//       this.applyFilters(
//         "start_date",
//         format(this.state.dateRange[0].startDate, "yyyy-MM-dd")
//       );
//       this.applyFilters(
//         "end_date",
//         format(this.state.dateRange[0].endDate, "yyyy-MM-dd")
//       );
//     });
//     if (!this.state.calState.fullCalender) {
//       this.setState({
//         calState: {
//           ...this.state.calState,
//           showCalender: false,
//           dateApplied: true,
//         },
//       });
//     }
//   }

//   applyFilters(name, value) {
//     let filters = this.state.filters;
//     filters[name] = value;
//     this.setState({ filters: filters }, () => {
//       this.initLoad();
//     });
//   }

//   setGraphFilters(val) {
//     this.setState({ graphFilters: val }, async () => {
//       const res = await dashboardGraph({
//         ...this.state.filters,
//         filters: this.state.graphFilters,
//       });
//       this.setState({ graphData: res?.data?.data });
//     });
//   }

//   render() {
//     let { dateRange, calState, summary, graphFilters, graphData, options } =
//       this.state;

//     return (
//       <>
//         <div className="flipkart__card flex">
//           <div className="col">
//             <div className="row justify-end">
//               <div className="flipkart__selectfilter col ">
//                 <SelectBox
//                   label={"Select Account"}
//                   options={options.brand}
//                   defaultSelected={options.brand}
//                   applyFilters={this.applyFilters}
//                   filterName={"brand"}
//                   platform={"ams"}
//                 />
//               </div>

//               <div className="flipkart__selectfilter col ">
//                 <SelectBox
//                   label="Select Platform"
//                   options={options.platform}
//                   applyFilters={this.applyFilters}
//                   filterName={"platform"}
//                   defaultSelected={options.platform}
//                   platform={"ams"}
//                 />
//               </div>
//               <div className="flipkart__selectfilter col ">
//                 <SelectBox
//                   label="Select Type"
//                   options={options.types}
//                   applyFilters={this.applyFilters}
//                   filterName={"types"}
//                   defaultSelected={options.types}
//                   platform={"ams"}
//                 />
//               </div>
//               {/* <div className="flipkart__selectfilter">
//                 <SelectBox
//                   label="Select Tags"
//                   options={options.tags}
//                   applyFilters={this.applyFilters}
//                   filterName={"tags"}
//                   defaultSelected={options.tags}
//                 />
//               </div> */}
//             </div>
//           </div>
//           <div className="flipkart__calander p-4">
//             <DatePicker
//             platform={"ams"}
//               className="h-3"
//               onChangeDate={this.onChangeDate}

//               state={dateRange}
//               setState={(data) => {
//                 this.setState({ dateRange: data });
//               }}
//               calState={calState}
//               setCalState={(data) => {
//                 this.setState({ calState: data });
//               }}
//               applyDate={this.applyDate}

//             />
//           </div>
//           {/* <div>
//             <IoIosArrowDropdown/>
//           </div> */}
//           <div>
//             <RepositionIcon/>
//             </div>
//         </div>

//         {/* cards section start */}
//         <div className="">
//          <Cards/>
//         </div>
//         {/* cards section end */}

//         {/* Campaigns section start */}
//         <section className="py-7">
//        <GraphSegment/>

//         </section>

//         {/* Campaigns section end */}
//       </>
//     );
//   }
// }

// export default AmazonDashBoard;
