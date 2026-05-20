/* eslint-disable no-unsafe-optional-chaining */
import React from "react";
import PlacementEvalationHeader from "./PlacementEvalationHeader";
import PlacementTopPerformingTable from "./PlacementTopPerformingTable";
import PlacementLowPerformingTable from "./PlacementLowPerformingTable";
import { _POST } from "../../../../services/axios.method";
import { cancelRequest } from "../../../../utils/helpers";

class Placement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initLoad: true,
      platform: [],
      placementLevelFilter: "cpc",
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
        // { id: 2, title: "Adgroup", value: "ad_group_name", checked: false },
      ],
      topBreakdown: [
        { id: 1, title: "Campaign", value: "campaign_id", checked: false },
        // { id: 2, title: "Adgroup", value: "ad_group_name", checked: false },
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
        () => this.placementLevelReportApi("CU")
      );
    }
  }

  componentDidMount() {
    this.placementLevelReportApi("CM");
  }

  placementLevelReportApi = async () => {
    // alert(test);
    let { shouldUpdate, setShouldUpdate, selectedMetric, campType, dateRange } =
      this.props;

    let {
      placementLevelFilter,
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
        "amazon/metric-analyzer/placementlevel",
        {
          placementLevelFilter,
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
      placementLevelFilter,
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
      callFrom,
    } = this.state;
    let { selectedMetric } = this.props;
    return (
      <>
        <div className="pt-4">
          <PlacementEvalationHeader
            placementLevelFilter={placementLevelFilter}
            metricFinder={metricFinder}
            setPlacementLevelFilter={(e) =>
              this.setState(
                {
                  placementLevelFilter: e,
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
                  // ],
                  // topBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  // ],
                },
                () => this.placementLevelReportApi("AEH")
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
                  // ],
                  // topBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  // ],
                },
                () => this.placementLevelReportApi("AEH")
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
                  // ],
                  // topBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  // ],
                },
                () => this.placementLevelReportApi("AEH")
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
                  // ],
                  // topBreakdown: [
                  //   {
                  //     id: 1,
                  //     title: "Campaign",
                  //     value: "campaign_id",
                  //     checked: false,
                  //   },
                  // ],
                },
                () => this.placementLevelReportApi("AEH")
              )
            }
            compareValue={compareValue}
            valueFirst={valueFirst}
            valueSecond={valueSecond}
          />
        </div>
        <div className="row">
          <div className="col_6">
            <PlacementTopPerformingTable
              setDataLimit={(e) => {
                this.setState(
                  {
                    callFrom: "top",
                    topDataLimit: e,
                  },
                  () => this.placementLevelReportApi("topL")
                );
              }}
              callFrom={callFrom}
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
                  () => this.placementLevelReportApi("topB")
                );
              }}
            />
          </div>
          <div className="col_6 ">
            <PlacementLowPerformingTable
              setDataLimit={(e) => {
                this.setState(
                  {
                    callFrom: "low",
                    lowDataLimit: e,
                  },
                  () => this.placementLevelReportApi("lowL")
                );
              }}
              loading={loading}
              lowLevelData={lowLevelData}
              selectedMetric={selectedMetric}
              lowCallApi={lowCallApi}
              lowDataLimit={lowDataLimit}
              breakdown={lowBreakdown}
              callFrom={callFrom}
              setBreakdown={(e) => {
                this.setState(
                  {
                    callFrom: "low",
                    lowBreakdown: e,
                    lowDataLimit: 0,
                    reset: true,
                    lowLevelData: [],
                  },
                  () => this.placementLevelReportApi("lowB")
                );
              }}
            />
          </div>
        </div>
      </>
    );
  }
}
export default Placement;
