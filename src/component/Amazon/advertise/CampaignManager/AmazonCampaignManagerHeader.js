// import React from "react";
// import SelectBox from "../../../common-components/selectBox";
// import { addDays, format } from "date-fns";
// import { dashboardGraph,dashboardOverview } from "../../../../services/dashboard";
// import { _GET,_POST,_PATCH,_DELETE } from "../../../../services/axios.method";
// import { defaultDateRange,defaultCompareDate,defaultFilterCheck } from "../../../../utils/helpers";
//  import { TAGS,GET_ACCOUNTS,COMP_DATE } from "../../../../utils/constants";
// import { setLoading } from "../../../../redux/action-creator/commonAction";
// import DatePicker from "../../../DatePicker/compareDatePicker";


// class AmazonCampaignManagerHeader extends React.Component {
//   constructor(props) {
//     super(props);
//     const dateFilters = defaultDateRange();
//     const compareFilters = defaultCompareDate();
//     this.state = {
//       defaultCheckAccount: [],
//       dateRange: [
//         {
//           startDate: new Date(dateFilters["startDate"]),
//           endDate: new Date(dateFilters["endDate"]),
//           key: dateFilters["key"],
//         },
//       ],
//       compDateRange: [
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
//       compCalState: {
//         showCalender: false,
//         fullCalender: false,
//         dateApplied: false,
//       },
//       // filters: {
//       //   start_date: format(addDays(new Date(), -7), "yyyy-MM-dd"),
//       //   end_date: format(new Date(), "yyyy-MM-dd"),
//       //   brand: [],
//       //   platform: ["MP", "SM"],
//       //   types: ["PLA", "PCA"],
//       //   drr: false,
//       // },
//       filters: {
//         start_date: format(new Date(dateFilters["startDate"]), "yyyy-MM-dd"),
//         end_date: format(new Date(dateFilters["endDate"]), "yyyy-MM-dd"),
//         brand: [],
//         platform: ["MP", "SM"],
//         types: ["PLA", "PCA"],
//         drr: false,
//         manual_compare_date: {},
//       },
//       options: {
//         brand: [],
//         platform: [
//           { label: "Flipkart", value: "MP" },
//           { label: "SuperMart", value: "SM" },
//         ],
//         types: [
//           { label: "PLA", value: "PLA" },
//           { label: "PCA", value: "PCA" },
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
//       compDates: [],
//       compareId: compareFilters["compare_id"],
//       checked: false,
//       tempDate: [
//         {
//           startDate: new Date(dateFilters["startDate"]),
//           endDate: new Date(dateFilters["endDate"]),
//           key: dateFilters["key"],
//         },
//       ],
//     };
//     this.onChangeDate = this.onChangeDate.bind(this);
//     this.applyFilters = this.applyFilters.bind(this);
//     this.initLoad = this.initLoad.bind(this);
//     this.setGraphFilters = this.setGraphFilters.bind(this);
//     this.applyDate = this.applyDate.bind(this);
//     this.onCompChangeDate = this.onCompChangeDate.bind(this);
//     this.loadCompData = this.loadCompData.bind(this);
//     this.saveComp = this.saveComp.bind(this);
//     this.editCompDate = this.editCompDate.bind(this);
//     this.deleteComp = this.deleteComp.bind(this);
//     this.SetCompareData = this.SetCompareData.bind(this);
//     this.changeDrr = this.changeDrr.bind(this);
//     this.handleApplyButton = this.handleApplyButton.bind(this);
//   }

//   async componentDidMount() {
//     await this.fetchAccounts();
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

//   async fetchAccounts() {
//     try {
//       setLoading(true);
//       const result = await _GET(GET_ACCOUNTS);
//       const data = result.data.data.result;
//       const accounts = data.map((item) => ({
//         label: item._id.account,
//         value: item._id.account,
//       }));
//       const filterAccount = data.map((item) => {
//         return item._id.account;
//       });

//       let options = this.state.options;
//       options.brand = accounts;
//       let filters = this.state.filters;
//       filters.brand = filterAccount;
//       const defaultAccount = defaultFilterCheck(
//         data.map((item) => ({
//           label: item._id.account,
//           value: item._id.account,
//           account_id: item._id.account_id,
//           platform_id: item._id.platform_id,
//         })),
//         "/flipkart"
//       );
//       // console.log("defaultAccount:::::::::", defaultAccount);
//       this.setState({
//         options,
//         filters,
//         defaultCheckAccount: defaultAccount["flipkart"]["multi"].map((val) => ({
//           label: val,
//           value: val,
//         })),
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async initLoad() {
//     try {
//       console.log("this.state.dateRange:::", this.state.dateRange);
//       let filters = this.state.filters;
//       let defaultCheckAccount = defaultFilterCheck([], "/flipkart");
//       filters["brand"] = defaultCheckAccount["flipkart"]["multi"];
//       filters.drr = this.state.checked;
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
//     this.setState({ dateRange: this.state.tempDate }, () => {
//       this.onChangeDate({ selection: this.state.tempDate[0] });
//       // this.initLoad()
//     });

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
//     this.setState({ tempDate: [{ ...dateRange, ...item.selection }] });

//     if (!this.state.calState.fullCalender) {
//       let dateRange = this.state.dateRange[0];
//       defaultDateRange(item.selection);
//       this.setState(
//         { dateRange: [{ ...dateRange, ...item.selection }] },
//         () => {
//           this.applyFilters(
//             "start_date",
//             format(this.state.dateRange[0].startDate, "yyyy-MM-dd")
//           );
//           this.applyFilters(
//             "end_date",
//             format(this.state.dateRange[0].endDate, "yyyy-MM-dd")
//           );
//         }
//       );

//       this.setState({
//         calState: {
//           ...this.state.calState,
//           showCalender: false,
//           dateApplied: true,
//         },
//       });
//     }
//   }

//   onCompChangeDate(item) {
//     console.log(item, "<<ITE<");
//     let compDateRange = this.state.compDateRange[0];
//     this.setState(
//       { compDateRange: [{ ...compDateRange, ...item.selection }] },
//       () => {
//         this.applyFilters(
//           "comp_start_date",
//           format(this.state.compDateRange[0].startDate, "yyyy-MM-dd")
//         );
//         this.applyFilters(
//           "comp_end_date",
//           format(this.state.compDateRange[0].endDate, "yyyy-MM-dd")
//         );
//       }
//     );

//     // console.log(this.state.compDateRange[0], "<<<start date");
//     if (!this.state.compCalState.fullCalender) {
//       this.setState({
//         compCalState: {
//           ...this.state.compCalState,
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
//       if (name != "start_date") {
//         this.initLoad();
//         if (Object.keys(this.state.filters.manual_compare_date).length > 0) {
//           this.setState({
//             filters: { ...this.state.filters, manual_compare_date: {} },
//           });
//         }
//       }
//     });
//   }

//   // applyFilters(name, value) {
//   //   let filters = this.state.filters;
//   //   filters[name] = value;

//   //   const isManualCompareDateInRange =
//   //     (name === "manual_compare_date" &&
//   //       value.startDate &&
//   //       value.endDate &&
//   //       value.key === "selection") ||
//   //     name === "drr";

//   //   console.log(
//   //     "applyFilters - Before setState:",
//   //     "Name:",
//   //     name,
//   //     "Value:",
//   //     value,
//   //     "Filters:",
//   //     filters,
//   //     "isManualCompareDateInRange:",
//   //     isManualCompareDateInRange
//   //   );

//   //   if (isManualCompareDateInRange) {
//   //     this.setState({ filters: filters }, () => {
//   //       this.initLoad();
//   //     });
//   //   } else {
//   //     this.setState({ filters: filters }, () => {
//   //       if (name !== "start_date") {
//   //         this.initLoad();
//   //       }
//   //     });
//   //   }

//   //   console.log(
//   //     "applyFilters - After setState:",
//   //     "Filters:",
//   //     this.state.filters
//   //   );
//   // }

//   setGraphFilters(val) {
//     this.setState({ graphFilters: val }, async () => {
//       const res = await dashboardGraph({
//         ...this.state.filters,
//         filters: this.state.graphFilters,
//       });
//       this.setState({ graphData: res?.data?.data });
//     });
//   }

//   async saveComp(state, name) {
//     try {
//       const post = {
//         name: name,
//         startDate: state[0].startDate,
//         endDate: state[0].endDate,
//       };
//       const res = await _POST(COMP_DATE, post);
//       await this.loadCompData();
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   async editCompDate(state, name, id) {
//     try {
//       const post = {
//         name: name,
//         startDate: state[0].startDate,
//         endDate: state[0].endDate,
//       };
//       const res = await _PATCH(COMP_DATE + `/${id}`, post);
//       await this.loadCompData();
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   async deleteComp(id) {
//     try {
//       const res = await _DELETE(COMP_DATE + `/${id}`);
//       await this.loadCompData();
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   async loadCompData() {
//     try {
//       const res = await _GET(COMP_DATE);
//       this.setState({ compDates: [...res.data.data.result] });
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   async SetCompareData(id) {
//     try {
//       this.setState({ compareId: id });
//       defaultCompareDate(id);
//       // this.setState({
//       //   filters: { ...this.state.filters, manual_compare_date: {} },
//       // });
//       this.applyFilters("compareId", id);
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   async changeDrr() {
//     try {
//       this.applyFilters("drr", !this.state.checked);
//       await this.setState({ checked: !this.state.checked });
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   async handleApplyButton() {
//     console.log(this.state.compDateRange[0], "<<<start date");
//     try {
//       this.setState({
//         compareId: "2",
//         // compDateRange: this.state.compDateRange[0],
//       });
//       // defaultCompareDate("2");
//       this.applyFilters("manual_compare_date", this.state.compDateRange[0]);
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   render() {
//     let {
//       dateRange,
//       calState,
//       summary,
//       graphFilters,
//       graphData,
//       options,
//       compDateRange,
//       compCalState,
//       compDates,
//       compareId,
//       checked,
//       defaultCheckAccount,
//     } = this.state;
//     return (
//       <>
//         <div className="flipkart__card flex h-[60px] ">
//           <div className="col">
//             <div className="row ">
//               <div className="flipkart__selectfilter col">
//                 <SelectBox
//                   label="Select Brand"
//                   options={options.brand}
//                   defaultSelected={defaultCheckAccount}
//                   applyFilters={this.applyFilters}
//                   filterName={"brand"}
//                   platform={"ams"}
//                 />
//               </div>

             
//               <div className="flipkart__selectfilter col">
//                 <SelectBox
//                   label="Select Type"
//                   options={options.types}
//                   applyFilters={this.applyFilters}
//                   filterName={"types"}
//                   defaultSelected={options.types}
//                   platform={"ams"}
//                 />
//               </div>
//               <div className="flipkart__selectfilter col">
//                 <SelectBox
//                   label="Select Tags"
//                   options={options.tags}
//                   applyFilters={this.applyFilters}
//                   filterName={"tags"}
//                   defaultSelected={options.tags}
//                   unSelectDefault={true}
//                   platform={"ams"}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="flipkart__calander p-4">
//             <DatePicker
//              className="h-3"
            
//              platform={"ams"}
//              onChangeDate={this.onCompChangeDate}
//              state={compDateRange}
//              setState={(data) => {
//                this.setState({ compDateRange: data });
//              }}
//              calState={compCalState}
//              setCalState={(data) => {
//                this.setState({ compCalState: data });
//              }}
//              applyDate={this.applyDate}
//              saveComp={this.saveComp}
//              compDates={compDates}
//              loadCompData={this.loadCompData}
//              compareId={compareId}
//              setCompId={(id) => {
//                this.SetCompareData(id);
//              }}
//              editCompDate={this.editCompDate}
//              deleteComp={this.deleteComp}
//              mainCalendarRange={this.state.dateRange}
//              handleApplyButton={this.handleApplyButton}/>
//           </div>
        
//           {/* <div className="flipkart__calander p-4">
//             <ComapreDatePicker
//               className="h-3"
            
//               platform={"ams"}
//               onChangeDate={this.onCompChangeDate}
//               state={compDateRange}
//               setState={(data) => {
//                 this.setState({ compDateRange: data });
//               }}
//               calState={compCalState}
//               setCalState={(data) => {
//                 this.setState({ compCalState: data });
//               }}
//               applyDate={this.applyDate}
//               saveComp={this.saveComp}
//               compDates={compDates}
//               loadCompData={this.loadCompData}
//               compareId={compareId}
//               setCompId={(id) => {
//                 this.SetCompareData(id);
//               }}
//               editCompDate={this.editCompDate}
//               deleteComp={this.deleteComp}
//               mainCalendarRange={this.state.dateRange}
//               handleApplyButton={this.handleApplyButton}
//             />
//           </div> */}
//         </div>

      
//       </>
//     );
//   }
// }

// export default AmazonCampaignManagerHeader;

