import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

const PerformanceGraph = () => {
  // eslint-disable-next-line no-unused-vars
  const [graphOption, setGraphOption] = useState({
    
    title: {
      text: "",
    },
    legend: {
      // Try 'horizontal'
      orient: 'horizontal',
      bottom:"bottom"
      
     
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
      bottom: "8%",
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
        name: "Sales",
        color:"#eaf0ff",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [
          { value: 20, color: "#8d48e3" },
          { value: 40, color: "#7cffb2" },
          { value: 50, color: "#fddd60" },
          { value: 60, color: "#58d9f9" },
          { value: 70, color: "#ff8a45" },
          { value: 0, color: "#dd79ff" },
          { value: 10, color: "blue" },
        ],
      },
      {
        color: "#fbdac0",
        name: "Spends",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [10, 0.5, 40, 15, 27, 50, 20],
      },
      {
        name: "ROAS",
        type: "line",
        stack: "Total",
        color: "#f0f9ff",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [50, 72, 90, 20, 28, 21, 350],
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

export default PerformanceGraph;
