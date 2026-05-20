/* eslint-disable no-console */
import React, { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import "./style.css";

const CommonScreenGraph = ({
  activeCards,
  setActiveCards,
  graphData,
  graphOption,
  setGraphOption,
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

  const gcolors = ["#3FA2FD", "#A887F8", "#62EA98", "#FFC0CB", "#963C71"];

  const dashboardApi = async () => {
    try {
      const apiData = graphData;
      // console.log(graphData,"apiData");
      let dates = apiData.dates;
      let names = Object.entries(apiData?.names);
      setActiveCards(names);
      let tempSeriesItem = [];
      let tempActiveCards = [];

      let yAxises = [];
      names.map((item, i) => {
        console.log(i, names);
        let seriesItem;
        seriesItem = {
          name: item[1],
          type: "line",
          smooth: true,
          showSymbol: false,
          data: apiData[item[0]],

          yAxisIndex: i,
          lineStyle: { color: gcolors[i] },
          itemStyle: { color: gcolors[i] },
          areaStyle: {
            color: {
              colorStops: [
                {
                  color: gcolors[i] + "70",
                  offset: 1,
                },
                {
                  color: gcolors[i] + "00",
                  offset: 0,
                },
              ],

              global: false,
              type: "linear",
              x: 0,
              x2: 0,
              y: 1,
              y2: 0,
            },
          },
        };

        tempSeriesItem = [...tempSeriesItem, seriesItem];
        tempActiveCards = [...tempActiveCards, item[0]];
        yAxises.push({
          type: "value",
          name: item[1],
          position: i % 2 == 0 ? "right" : "left",
          offset: i < 2 ? 0 : i < 4 ? 120 : 240,
          alignTicks: true,

          axisLine: {
            show: true,
            lineStyle: {
              color: gcolors[i],
            },
          },
          axisLabel: {
            formatter: "{value}",
          },
        });
      });
      setActiveCards([...activeCards, tempActiveCards]);
      setGraphOption((prev) => {
        return {
          ...prev,
          legend: {
            orient: "horizontal",
          },
          series: tempSeriesItem,
          xAxis: {
            ...prev.xAxis,
            data: dates,
          },
          yAxis: [
            // ...prev.yAxis,
            ...yAxises,
          ],
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
      <div className="overflow-hidden">
        <ReactECharts
          ref={chartRef}
          option={graphOption}
          notMerge={true}
          lazyUpdate={true}
          style={{ width: '100%' }}
        />
      </div>
      {/* {showDetails ? (
        <div className="flex items-center justify-self-end  pl-2">
          {graphFilters[0] ? (
            <>
              <div className="graphLabelOne "></div>
              <label className="mr-3">{graphLabelName(graphFilters[0])}</label>
            </>
          ) : null}
          {graphFilters[1] ? (
            <>
              <div className="graphLabelTwo"></div>
              <label className="mr-3">{graphLabelName(graphFilters[1])}</label>
            </>
          ) : null}
        </div>
      ) : null} */}
    </>
  );
};

export default CommonScreenGraph;
