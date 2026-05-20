import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

const EfficiencyGraph = () => {
  // eslint-disable-next-line no-unused-vars
  const [graphOption, setGraphOption] = useState({
    legend: {
      // Try 'horizontal'
      orient: 'horizontal',
      bottom:"bottom"
      
     
    },
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
      bottom: "6%",
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
       pointRadius:false,
        name: "SPC",
        color:"#eaf0ff",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [0,5,10,15,20,25,40]
         
        ,
      },
      {
        color: "#cee9fb",
        
        name: "CVR",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [10, 20, 30, 10, 10, 10, 10],
      },
      {
        name: "CPC",
        type: "line",
        stack: "Total",
        color: "#fbdac0",
        areaStyle: {},
        emphasis: {
          focus: "series",
        },
        data: [20, 32, 10, 20, 69, 45, 200],
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

export default EfficiencyGraph;
