import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

const RealTimeGraph = () => {
  // eslint-disable-next-line no-unused-vars
  const [graphOption, setGraphOption] = useState({
    title: {
      text: "",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    // legend: {
    //   // data: ['']
    // },
    //   toolbox: {
    //     feature: {
    //       saveAsImage: {}
    //     }
    //   },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        dot: "false",
        name: "CPC",
        color:"#eaf0ff",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [
          { value: 0, color: "#8d48e3" },
          { value: 5, color: "#7cffb2" },
          { value: 10, color: "#fddd60" },
          { value: 15, color: "#58d9f9" },
          { value: 20, color: "#ff8a45" },
          { value: 25, color: "#dd79ff" },
          { value: 30, color: "blue" },
        ],
      },
      {
        color: "#fbdac0",
        name: "SPC",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [120, 20, 30, 10, 10, 153, 110],
      },
      {
        name: "CVR",
        type: "line",
        stack: "Total",
        color: "#f0f9ff",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [20, 12, 140, 20, 69, 45, 200],
      },
    ],
  });
  return (
    <>
      <div>
        <ReactECharts option={graphOption} notMerge={true} lazyUpdate={true} />
      </div>
    </>
  );
};

export default RealTimeGraph;
