import ReactEcharts from "echarts-for-react";
import React from "react";
import { operationalFilters } from "../../../utils/commonScreenConstant";
import GraphLoading from "./GraphLoading";

class BarGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seriesList: [],
      datasetWithFilters: [],
      source: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.trendGraphData !== this.props.trendGraphData) {
      this.loadGraph();
    }
  }
  componentDidMount() {
    this.loadGraph();
  }

  loadGraph = () => {
    let { activeConversion } = this.props;
    let colorCombination = {
      Amazon: "#EF880F",
      Zepto: "#3C006B",
      Flipkart: "#0081F7",
      Blinkit: "#11B07A",
    };
    const { trendGraphData, isGraphLoaded } = this.props;
    let seriesList = [];
    let name = ["Flipkart", "Amazon", "Zepto", "Blinkit"];
    if (isGraphLoaded) {
      let datasetWithFilters = [];
      trendGraphData.length > 1 &&
        name.map((i) => {
          var datasetId = "dataset_" + i;
          datasetWithFilters.push({
            id: datasetId,
            fromDatasetId: "dataset_raw",
            transform: {
              type: "filter",
              config: {
                and: [
                  // { dimension: "value", gt: 0 },
                  { dimension: "name", "=": i },
                ],
              },
            },
          });
          seriesList.push({
            type: "line",
            datasetId: datasetId,
            showSymbol: false,
            name: i,
            endLabel: {
              show: true,
              formatter: function (params) {
                return params.value[0] + ": " + params.value[1];
              },
            },
            // itemStyle: { normal: { areaStyle: { type: "default" } } },
            lineStyle: {
              color: colorCombination[i],
              opacity: activeConversion
                ? i === activeConversion
                  ? 1
                  : 0.2
                : 1,
            },
            labelLayout: {
              moveOverlap: "shiftY",
            },
            color: colorCombination[i],
            emphasis: {
              focus: "series",
            },
            encode: {
              x: "date",
              y: "value",
              label: ["name", "value"],
              itemName: "date",
              tooltip: ["value"],
            },
          });
        });
      // console.log("seriesList:::::::::", seriesList);
      // console.log("datasetWithFilters:::::::::", datasetWithFilters);
      this.setState({
        seriesList,
        datasetWithFilters,
      });
    }
  };

  selectableLine = (e) => {
    let { activeConversion } = this.props;
    const { seriesList } = this.state;
    const { setActiveConversion } = this.props;
    // const index = seriesList.findIndex((obj) => obj.name === e.seriesName);
    if (activeConversion !== e.seriesName) {
      seriesList.map((i) => {
        const opacity = i["lineStyle"];
        if (i.name !== e.seriesName) {
          i["lineStyle"] = {
            ...opacity,
            opacity: 0.2,
            blur: 2,
          };
        } else {
          i["lineStyle"] = {
            ...opacity,
            opacity: 1,
          };
        }
      });
      setActiveConversion(e.seriesName);
    } else {
      seriesList.map((i) => {
        const opacity = i["lineStyle"];
        i["lineStyle"] = {
          ...opacity,
          opacity: 1,
        };
      });
      setActiveConversion(undefined);
    }

    // console.log("series", seriesList);
    this.setState({
      seriesList,
    });
  };

  render() {
    const { seriesList, datasetWithFilters } = this.state;
    const { trendGraphData, isGraphLoaded, dataBasedOn } = this.props;
    // const onEvents = {
    //   click: (e) => setActiveConversion(),
    // };
    if (!isGraphLoaded) return <GraphLoading />;
    return (
      <ReactEcharts
        option={{
          // animationDuration: 2000,
          dataset: [
            {
              id: "dataset_raw",

              source: trendGraphData,
            },

            ...datasetWithFilters,
          ],
          // color:
          tooltip: {
            order: "valueDesc",
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            nameLocation: "middle",
          },
          yAxis: {
            name: operationalFilters[dataBasedOn],
          },
          grid: {
            right: 140,
          },
          // animation: "auto",
          // animationDurationUpdate: 500,
          // animationEasing: "cubicInOut",
          // animationEasingUpdate: "cubicInOut",
          // animationThreshold: 2000,
          // progressiveThreshold: 3000,
          // progressive: 400,
          // hoverLayerThreshold: 3000,
          series: seriesList || [],
          triggerLineEvent: true,
        }}
        style={{ width: "100%", height: 300 }}
        // lazyUpdate={true}
        onEvents={{
          click: (e) => this.selectableLine(e),
          // {
          //   console.log("etest:::::::", e);
          //   setActiveConversion(e.seriesName);
          // },
        }}
      ></ReactEcharts>
    );
  }
}

export default BarGraph;
