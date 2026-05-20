import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
// import "./style.css";

function formatPrice(price) {
  // Ensure the input is an integer
  // if (!Number.isInteger(price)) {
  //     throw new Error("The price must be an integer.");
  // }

  // Convert the integer to a string and format it with commas
  return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const DashboardGraph = ({
  activeCards,
  setActiveCards,
  // graphFilters,
  graphData,
  // showDetails,
  // filterdata,
  noComparison,
  component,
  compare=true
}) => {
  const chartRef = useRef(null);
  const resizeAnimationFrameRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current.getEchartsInstance();

    const handleResize = () => {
      // Cancel the previous animation frame if there’s one
      if (resizeAnimationFrameRef.current) {
        cancelAnimationFrame(resizeAnimationFrameRef.current);
      }

      // Use requestAnimationFrame to make resizing smoother
      resizeAnimationFrameRef.current = requestAnimationFrame(() => {
        chartInstance.resize();
      });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartRef.current.getEchartsInstance().getDom());

    return () => {
      resizeObserver.disconnect();
      if (resizeAnimationFrameRef.current) {
        cancelAnimationFrame(resizeAnimationFrameRef.current);
      }
    };
  }, []);


  const gcolors = ["#3FA2FD", "#A887F8", "#62EA98", "#FFA500"];
  const [graphOption, setGraphOption] = useState({
    tooltip: {
      trigger: "axis",
      backgroundColor: "black",
      textStyle: {
        color: "white",
      },

      formatter: function (params) {
        var colorSpan = (color, index) =>
          '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
          gcolors[compare ? Math.floor(index / 2) : index] +
          '"></span>';
        let rez = "<p>" + params[0].axisValue + "</p>";
        //console.log(params); //quite useful for debug
        params.forEach((item) => {
          //console.log(item); //quite useful for debug
          var xx =
            '<div style="display:flex;justify-content:space-between; gap:10px"><p>' +
            colorSpan(item.color, item.seriesIndex) +
            " " +
            item.seriesName +
            '</p><p style="text-align:center;font-weight:bold">' +
            formatPrice(item.data) +
            "</p></div>";
          rez += xx;
        });

        return rez;
      },
    },
    grid: {
      top: "7%",
      left: component === "amazon" ? 0 : "1%",
      right: component === "amazon" ? 0 : "2%",
      bottom: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [],
    },
    yAxis: [
      {
        type: "value",
        splitLine: {
          show: false,
        },
        // show:false,
        axisLabel: {
          formatter: function (value) {
            if (value >= 1e6) {
              return (value / 1e6).toFixed(1) + "M";
            } else if (value >= 1e3) {
              return (value / 1e3).toFixed(1) + "K";
            } else {
              return value;
            }
          },
        },
        alignTicks: false,
      },
    ],
    series: [],
  });

  // const graphLabelName = (val) => {
  //   let output;
  //   filterdata.map((data) => {
  //     if (data.value == val) output = data.label;
  //   });
  //   return output;
  // };

  const dashboardApi = async () => {
    try {
      const apiData = graphData;
      // console.log(graphData,"apiData");
      let dates = apiData.dates;
      let names = Object.entries(apiData?.names);
      setActiveCards(names);
      let tempSeriesItem = [];
      let tempActiveCards = [];
      let legend = [];

      let yAxises = [];
      names.slice(0, 4).map((item, i) => {
        let yAxisIndex = i;
        let seriesItem;
        seriesItem = {
          name: item[1],
          type: "line",

          // position:"left",
          smooth: true,
          showSymbol: false,
          // offset:160,

          data: apiData[item[0]],
          yAxisIndex: yAxisIndex,
          lineStyle: { color: gcolors[i] },
          itemStyle: { color: gcolors[i] },
          areaStyle: {
            color: {
              type: "linear",
              x: 0, // Start x-coordinate
              y: 1, // Start y-coordinate (bottom)
              x2: 0, // End x-coordinate
              y2: 0, // End y-coordinate (top)
              colorStops: [
                {
                  offset: 1, // Start color
                  color: `${gcolors[i]}70`,
                },
                {
                  offset: 0, // End color
                  color: `${gcolors[i]}00`,
                },
              ],
              global: false,
            },
          },
        };
        tempSeriesItem = [...tempSeriesItem, seriesItem];
        tempActiveCards = [...tempActiveCards, item[0]];
        if (!yAxises[yAxisIndex]) {
          // For yAxisIndex 0
          yAxises[yAxisIndex] = {
            // type: "value",
            // name: 'Evaporation',
            // splitLine: {
            //   show: false,
            // },
            // // show: true, // Show y-axis for each side
            // position:i%2===0?"right":"left",
            // offset: i% 2 === 0 ? 10 :0,
            // axisLine: {
            //   show: true,
            // },
            // alignTicks: false,
            // yAxises.push({
            type: "value",
            name: item[1],
            position: i % 2 == 0 ? "left" : "right",
            offset: i > 1 ? 80 : 0,
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: gcolors[i],
              },
            },
            nameTextStyle: {
              ...(names.length === 3 && i === 0 && component === "amazon"
                ? { align: "end" }
                : {}),
              ...(names.length === 4 && i === 1 && component === "amazon"
                ? { align: "right" }
                : {}),
              ...(names.length === 4 && i === 0 && component === "amazon"
                ? { align: "left" }
                : {}),
            },
            splitLine: {
              show: false,
            },
            // axisLabel: {
            //   formatter: '{value} ml'
            // }
            // })
          };
          legend.push(item[1]);
        }

        if (noComparison == false) {
          // eslint-disable-next-line no-unused-vars
          const entry = apiData.compList[item[0]];
          const index = i;
          // eslint-disable-next-line no-unused-vars

          let comparisonSeriesItem = {
            name: `Previous ${names[index][1]}`,
            type: "line",
            smooth: true,
            showSymbol: false,
            data: entry,
            yAxisIndex: index,
            lineStyle: { color: gcolors[index], type: "dotted" }, // Dotted line for comparison
          };
          tempSeriesItem.push(comparisonSeriesItem);
        }
      });

      setActiveCards([...activeCards, tempActiveCards]);
      setGraphOption((prev) => {
        const yAxis = yAxises.map((yAxis) => ({
          ...yAxis,
          axisLabel: {
            formatter: function (value) {
              if (value >= 1e6) {
                return (value / 1e6).toFixed(1) + "M";
              } else if (value >= 1e3) {
                return (value / 1e3).toFixed(1) + "K";
              } else {
                return value;
              }
            },
          },
        }));

        return {
          ...prev,

          grid: {
            right:
              component === "amazon"
                ? legend.length === 2
                  ? 50
                  : legend.length === 3
                  ? 70
                  : legend.length === 4
                  ? 148
                  : "8%"
                : legend.length === 2
                ? "8%"
                : legend.length === 3
                ? "16%"
                : legend.length === 4
                ? "16%"
                : "8%",
            left:
              component === "amazon"
                ? legend.length === 2
                  ? 50
                  : legend.length === 3
                  ? 150
                  : legend.length === 4
                  ? 148
                  : 80
                : legend.length === 2
                ? "8%"
                : legend.length === 3
                ? "16%"
                : legend.length === 4
                ? "16%"
                : "8%",
          },
          series: tempSeriesItem,
          xAxis: {
            ...prev.xAxis,
            data: dates,
          },
          yAxis: yAxis,
        };
      });
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    // dashboardApi();
  }, [graphOption]);
  useEffect(() => {
    dashboardApi();
  }, [graphData]);
  return (
    <>
      <div className="w-[100%] overflow-hidden">
        <ReactECharts
          ref={chartRef}
          option={graphOption}
          notMerge={true}
          lazyUpdate={true}
          style={{
            height:
              component === "amazon"
                ? "399px"
                : component === "flipkart"
                ? "275.5px"
                : component === "zepto"
                ? "265px"
                : component === "blinkit"
                ? "332px"
                : "300px",
          }}
        />
      </div>
      {/* {showDetails ? (
        <div className="flex items-center justify-self-end  pl-2 font-semibold text-base">
          {graphFilters[0] ? (
            <>
              <div className="graphLabelOne "></div>
              <label className="mr-3  font-semibold text-sm">{graphLabelName(graphFilters[0])}</label>
            </>
          ) : null}
          {graphFilters[1] ? (
            <>
              <div className="graphLabelTwo"></div>
              <label className="mr-3  font-semibold text-sm">{graphLabelName(graphFilters[1])}</label>
            </>
          ) : null}
          {graphFilters[2] ? (
            <>
              <div className="graphLabelTwo"></div>
              <label className="mr-3  font-semibold text-sm">{graphLabelName(graphFilters[1])}</label>
            </>
          ) : null}
          {graphFilters[3] ? (
            <>
              <div className="graphLabelTwo"></div>
              <label className="mr-3  font-semibold text-sm">{graphLabelName(graphFilters[1])}</label>
            </>
          ) : null}
        </div>
      ) : null} */}
    </>
  );
};

export default DashboardGraph;
