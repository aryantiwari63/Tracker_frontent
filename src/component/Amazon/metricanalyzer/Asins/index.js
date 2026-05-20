/* eslint-disable no-unsafe-optional-chaining */
import React from "react";

import AsinEvalutionHeader from "./AsinEvalationHeader";
import AsinTopPerformingTable from "./AsinTopPerformingTable";
import AsinLowPerformingTable from "./AsinLowPerformingTable";
import { _POST } from "../../../../services/axios.method";
import { cancelRequest } from "../../../../utils/helpers";

// const Asins = ({
//   shouldUpdate,
//   setShouldUpdate,
//   selectedMetric,
//   platform,
//   campType,
// }) => {
//   console.log("shouldUpdate:::::::::>", shouldUpdate);
// const [asinLevelFilter, setAsinLevelFilter] = useState({
//   k: "spend",
//   o: ">",
//   v: 1,
// });
//   const [topDataLimit, setTopDataLimit] = useState(0);
//   const [lowDataLimit, setLowDataLimit] = useState(0);
//   const [callFrom, setCallFrom] = useState(undefined);
//   const [loading, setLoading] = useState(false);
//   const [topLevelData, setTopLevelData] = useState([]);
//   const [lowLevelData, setLowLevelData] = useState([]);
//   const [lowCallApi, setLowCallApi] = useState(false);
//   const [topCallApi, setTopCallApi] = useState(false);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [lowBreakdown, setLowBreakdown] = useState([
//     { id: 1, title: "Campaign", value: "campaign_id", checked: false },
//     { id: 2, title: "Adgroup", value: "ad_group_name", checked: false },
//   ]);
//   const [topBreakdown, setTopBreakdown] = useState([
//     { id: 1, title: "Campaign", value: "campaign_id", checked: false },
//     { id: 2, title: "Adgroup", value: "ad_group_name", checked: false },
//   ]);
// let filters = {
//   asinLevelFilter,
//   topDataLimit,
//   lowDataLimit,
//   selectedMetric,
//   platform,
//   campType,
//   callFrom,
//   lowBreakdown,
//   topBreakdown,
// };
// const asinLevelReportApi = async (date = false) => {
//   if (!shouldUpdate && !date && loading) {
//     return true;
//   }
//   try {
//     setLoading(true);
//     const ourRequest = await cancelRequest();
//     const res = await _POST("amazon/metric-analyzer/asinlevel", filters, {
//       cancelToken: ourRequest.token,
//     });
//     console.log("resIs", res.data.data);
//     if (res?.data?.status) {
//       setLoading(false);

//       if (shouldUpdate || date) {
//         alert("new");
//         if (!callFrom) {
//           setTopLevelData([...res?.data?.data?.topLevelData]);
//           setLowLevelData([...res?.data?.data?.lowLevelData]);
//           if (res?.data?.data?.topLevelData.length === 50)
//             setTopCallApi(true);
//           else setTopCallApi(false);
//           if (res?.data?.data?.lowLevelData.length === 50)
//             setLowCallApi(true);
//           else setLowCallApi(false);
//         } else if (callFrom === "top") {
//           setTopLevelData([...res?.data?.data?.topLevelData]);
//           if (res?.data?.data?.topLevelData.length === 50)
//             setTopCallApi(true);
//           else setTopCallApi(false);
//         } else if (callFrom === "low") {
//           setLowLevelData([...res?.data?.data?.lowLevelData]);
//           if (res?.data?.data?.lowLevelData.length === 50)
//             setLowCallApi(true);
//           else setLowCallApi(false);
//         }
//       } else {
//         // alert("tet");
//         if (!callFrom) {
//           setTopLevelData([
//             ...topLevelData,
//             ...res?.data?.data?.topLevelData,
//           ]);
//           setLowLevelData([
//             ...lowLevelData,
//             ...res?.data?.data?.lowLevelData,
//           ]);
//           if (res?.data?.data?.topLevelData.length === 50)
//             setTopCallApi(true);
//           else setTopCallApi(false);
//           if (res?.data?.data?.lowLevelData.length === 50)
//             setLowCallApi(true);
//           else setLowCallApi(false);
//         } else if (callFrom === "top") {
//           setTopLevelData([
//             ...topLevelData,
//             ...res?.data?.data?.topLevelData,
//           ]);
//           if (res?.data?.data?.topLevelData.length === 50)
//             setTopCallApi(true);
//           else setTopCallApi(false);
//         } else if (callFrom === "low") {
//           setLowLevelData([
//             ...lowLevelData,
//             ...res?.data?.data?.lowLevelData,
//           ]);

//           if (res?.data?.data?.lowLevelData.length === 50)
//             setLowCallApi(true);
//           else setLowCallApi(false);
//         }
//         // setCallFrom(undefined);
//       }
//       setIsLoaded(true);
//       setShouldUpdate(false);
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };

//   useEffect(() => {
//     asinLevelReportApi();
//   }, []);

//   useEffect(() => {
//     if (isLoaded) {
//       asinLevelReportApi();
//     }
//   }, [lowDataLimit, topDataLimit]);
//   useEffect(() => {
//     if (shouldUpdate) {
//       setCallFrom(undefined);
//       setTopDataLimit(0);
//       setLowDataLimit(0);
//     }
//   }, [shouldUpdate]);
//   useEffect(() => {
//     if (isLoaded) {
//       if (callFrom === "top") {
//         setTopLevelData([]);
//         setTopDataLimit(0);
//       }
//       if (callFrom === "low") {
//         setLowLevelData([]);
//         setLowDataLimit(0);
//       }
//       asinLevelReportApi();
//     }
//   }, [lowBreakdown, topBreakdown]);
//   return (
//     <>
//       <div className="pt-4">
//         <AsinEvalutionHeader setAsinLevelFilter={setAsinLevelFilter} />
//       </div>
//       <div className="row">
//         <div className="col_6">
//           <AsinTopPerformingTable
//             setDataLimit={(e) => {
//               setCallFrom("top");
//               setTopDataLimit(e);
//             }}
//             loading={loading}
//             topLevelData={topLevelData}
//             selectedMetric={selectedMetric}
//             topCallApi={topCallApi}
//             topDataLimit={topDataLimit}
//             breakdown={topBreakdown}
//             setBreakdown={(e) => {
//               setCallFrom("top");
//               setTopBreakdown(e);
//             }}
//           />
//         </div>
//         <div className="col_6 ">
//           <AsinLowPerformingTable
//             setDataLimit={(e) => {
//               setCallFrom("low");
//               setLowDataLimit(e);
//             }}
//             loading={loading}
//             lowLevelData={lowLevelData}
//             selectedMetric={selectedMetric}
//             lowCallApi={lowCallApi}
//             lowDataLimit={lowDataLimit}
//             breakdown={lowBreakdown}
//             setBreakdown={(e) => {
//               setCallFrom("low");
//               setLowBreakdown(e);
//             }}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

class Asins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initLoad: true,
      platform: [],
      asinLevelFilter: "cpc",
      loading: false,
      topDataLimit: 0,
      lowDataLimit: 0,
      callFrom: undefined,
      topLevelData: [],
      lowLevelData: [],
      lowCallApi: false,
      topCallApi: false,
      isLoaded: false,
      reset: false,
      valueFirst: 0,
      valueSecond: 0,
      compareValue: ">",
      lowBreakdown: [
        { id: 1, title: "Campaign", value: "campaign_id", checked: false },
        { id: 2, title: "Adgroup", value: "ad_group_name", checked: false },
      ],
      topBreakdown: [
        { id: 1, title: "Campaign", value: "campaign_id", checked: false },
        { id: 2, title: "Adgroup", value: "ad_group_name", checked: false },
      ],
      metricFinder: {
        min: "₹0",
        max: "₹0",
        avg: "₹0",
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedMetric !== this.props.selectedMetric ||
      prevProps.campType !== this.props.campType ||
      prevProps.platform !== this.props.platform ||
      prevProps.dateRange !== this.props.dateRange
    ) {
      this.setState(
        {
          callFrom: undefined,
          lowDataLimit: 0,
          topDataLimit: 0,
          topLevelData: [],
          lowLevelData: [],
          platform: this.props.platform,
          metricFinder: {
            min: "₹0",
            max: "₹0",
            avg: "₹0",
          },
        },
        () => this.asinLevelReportApi("CU")
      );
    }
  }

  componentDidMount() {
    this.asinLevelReportApi("CM");
  }

  asinLevelReportApi = async () => {
    // alert(test);
    let { shouldUpdate, setShouldUpdate, selectedMetric, campType, dateRange } =
      this.props;

    let {
      asinLevelFilter,
      topDataLimit,
      lowDataLimit,
      callFrom,
      lowBreakdown,
      topBreakdown,
      loading,
      topLevelData,
      lowLevelData,
      reset,
      valueFirst,
      valueSecond,
      compareValue,
      platform,
      initLoad,
    } = this.state;
    // console.log(
    //   "nextProps.selectedMetric:::::::::::>",
    //   initLoad,
    //   loading,
    //   platform.length
    // );
    if (initLoad && !loading && platform.length === 0) {
      return true;
    }
    try {
      this.setState({
        loading: true,
      });
      const ourRequest = await cancelRequest();
      const res = await _POST(
        "amazon/metric-analyzer/asinlevel",
        {
          asinLevelFilter,
          topDataLimit,
          lowDataLimit,
          selectedMetric,
          platform,
          campType,
          callFrom,
          lowBreakdown,
          topBreakdown,
          valueFirst,
          valueSecond,
          compareValue,
          dateRange,
        },
        {
          cancelToken: ourRequest.token,
        }
      );
      // console.log("resIs", res.data.data);
      if (res?.data?.status) {
        this.setState({
          loading: false,
        });

        if (!callFrom) {
          this.setState({
            topLevelData:
              shouldUpdate || reset
                ? [...res?.data?.data?.topLevelData]
                : [...topLevelData, ...res?.data?.data?.topLevelData],
            topDataLimit: shouldUpdate || reset ? 0 : topDataLimit,
            lowLevelData:
              shouldUpdate || reset
                ? [...res?.data?.data?.lowLevelData]
                : [...lowLevelData, ...res?.data?.data?.lowLevelData],
            lowDataLimit: shouldUpdate || reset ? 0 : lowDataLimit,
            metricFinder: res?.data?.data?.metricHeaderValue,
          });

          if (res?.data?.data?.topLevelData.length === 50)
            this.setState({ topCallApi: true });
          else this.setState({ topCallApi: false });
          if (res?.data?.data?.lowLevelData.length === 50)
            this.setState({ lowCallApi: true });
          else this.setState({ lowCallApi: true });
        } else if (callFrom === "top") {
          this.setState({
            topLevelData:
              shouldUpdate || reset
                ? [...res?.data?.data?.topLevelData]
                : [...topLevelData, ...res?.data?.data?.topLevelData],
            topDataLimit: shouldUpdate || reset ? 0 : topDataLimit,
          });
          if (res?.data?.data?.topLevelData.length === 50)
            this.setState({ topCallApi: true });
          else this.setState({ topCallApi: false });
        } else if (callFrom === "low") {
          this.setState({
            lowLevelData:
              shouldUpdate || reset
                ? [...res?.data?.data?.lowLevelData]
                : [...lowLevelData, ...res?.data?.data?.lowLevelData],
            lowDataLimit: shouldUpdate || reset ? 0 : lowDataLimit,
          });
          if (res?.data?.data?.lowLevelData.length === 50)
            this.setState({ lowCallApi: true });
          else this.setState({ lowCallApi: false });
        }
        this.setState({
          reset: false,
          callFrom: undefined,
        });
        setShouldUpdate(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    let {
      asinLevelFilter,
      topDataLimit,
      lowDataLimit,
      lowBreakdown,
      topBreakdown,
      loading,
      topLevelData,
      lowLevelData,
      lowCallApi,
      topCallApi,
      valueFirst,
      valueSecond,
      compareValue,
      metricFinder,
    } = this.state;
    let { selectedMetric } = this.props;
    return (
      <>
        <div className="pt-4">
          <AsinEvalutionHeader
            asinLevelFilter={asinLevelFilter}
            metricFinder={metricFinder}
            setAsinLevelFilter={(e) =>
              this.setState(
                {
                  asinLevelFilter: e,
                  reset: true,
                  topDataLimit: 0,
                  lowDataLimit: 0,
                  callFrom: undefined,
                  topLevelData: [],
                  lowLevelData: [],
                  metricFinder: {
                    min: "₹0",
                    max: "₹0",
                    avg: "₹0",
                  },
                  // lowBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  //   {
                  //     id: 2,
                  //     title: "Adgroup",
                  //     value: "ad_group_name",
                  //     checked: false,
                  //   },
                  // ],
                  // topBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  //   {
                  //     id: 2,
                  //     title: "Adgroup",
                  //     value: "ad_group_name",
                  //     checked: false,
                  //   },
                  // ],
                },
                () => this.asinLevelReportApi("AEH")
              )
            }
            setValueFirst={(e) =>
              this.setState(
                {
                  valueFirst: e,
                  reset: true,
                  topDataLimit: 0,
                  lowDataLimit: 0,
                  callFrom: undefined,
                  topLevelData: [],
                  lowLevelData: [],
                  metricFinder: {
                    min: "₹0",
                    max: "₹0",
                    avg: "₹0",
                  },
                  // lowBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  //   {
                  //     id: 2,
                  //     title: "Adgroup",
                  //     value: "ad_group_name",
                  //     checked: false,
                  //   },
                  // ],
                  // topBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  //   {
                  //     id: 2,
                  //     title: "Adgroup",
                  //     value: "ad_group_name",
                  //     checked: false,
                  //   },
                  // ],
                },
                () => this.asinLevelReportApi("AEH")
              )
            }
            setValueSecond={(e) =>
              this.setState(
                {
                  valueSecond: e,
                  reset: true,
                  topDataLimit: 0,
                  lowDataLimit: 0,
                  callFrom: undefined,
                  topLevelData: [],
                  lowLevelData: [],
                  metricFinder: {
                    min: "₹0",
                    max: "₹0",
                    avg: "₹0",
                  },
                  // lowBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  //   {
                  //     id: 2,
                  //     title: "Adgroup",
                  //     value: "ad_group_name",
                  //     checked: false,
                  //   },
                  // ],
                  // topBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  //   {
                  //     id: 2,
                  //     title: "Adgroup",
                  //     value: "ad_group_name",
                  //     checked: false,
                  //   },
                  // ],
                },
                () => this.asinLevelReportApi("AEH")
              )
            }
            setCompareValue={(e) =>
              this.setState(
                {
                  compareValue: e,
                  reset: true,
                  topDataLimit: 0,
                  lowDataLimit: 0,
                  callFrom: undefined,
                  topLevelData: [],
                  lowLevelData: [],
                  metricFinder: {
                    min: "₹0",
                    max: "₹0",
                    avg: "₹0",
                  },
                  // lowBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  //   {
                  //     id: 2,
                  //     title: "Adgroup",
                  //     value: "ad_group_name",
                  //     checked: false,
                  //   },
                  // ],
                  // topBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  //   {
                  //     id: 2,
                  //     title: "Adgroup",
                  //     value: "ad_group_name",
                  //     checked: false,
                  //   },
                  // ],
                },
                () => this.asinLevelReportApi("AEH")
              )
            }
            compareValue={compareValue}
            valueFirst={valueFirst}
            valueSecond={valueSecond}
          />
        </div>
        <div className="row">
          <div className="col_6">
            <AsinTopPerformingTable
              setDataLimit={(e) => {
                this.setState(
                  {
                    callFrom: "top",
                    topDataLimit: e,
                  },
                  () => this.asinLevelReportApi("topL")
                );
              }}
              loading={loading}
              topLevelData={topLevelData}
              selectedMetric={selectedMetric}
              topCallApi={topCallApi}
              topDataLimit={topDataLimit}
              breakdown={topBreakdown}
              setBreakdown={(e) => {
                this.setState(
                  {
                    callFrom: "top",
                    topBreakdown: e,
                    topDataLimit: 0,
                    reset: true,
                    topLevelData: [],
                  },
                  () => this.asinLevelReportApi("topB")
                );
              }}
            />
          </div>
          <div className="col_6 ">
            <AsinLowPerformingTable
              setDataLimit={(e) => {
                this.setState(
                  {
                    callFrom: "low",
                    lowDataLimit: e,
                  },
                  () => this.asinLevelReportApi("lowL")
                );
              }}
              loading={loading}
              lowLevelData={lowLevelData}
              selectedMetric={selectedMetric}
              lowCallApi={lowCallApi}
              lowDataLimit={lowDataLimit}
              breakdown={lowBreakdown}
              setBreakdown={(e) => {
                this.setState(
                  {
                    callFrom: "low",
                    lowBreakdown: e,
                    lowDataLimit: 0,
                    reset: true,
                    lowLevelData: [],
                  },
                  () => this.asinLevelReportApi("lowB")
                );
              }}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Asins;
