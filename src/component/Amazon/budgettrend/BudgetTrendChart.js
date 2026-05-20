import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

const BudgetTrendChart = () => {
  // eslint-disable-next-line no-unused-vars
  const [graphOption, setGraphOption] = useState({
    title: {
      text: 
      "25,00,000",
      left: "center",
      top: "center",
    },
    series: [
      {
        type: "pie",
        data: [
          {
            value: 335,
            name: "A",
          },
          {
            value: 234,
            name: "B",
          },
          {
            value: 1548,
            name: "C",
          },
          {
            value: 987,
            name: "D",
          },
        ],
        radius: ["50%", "70%"],
        
        avoidLabelOverlap: false,
        label: {
           show: false,
           position: "center",
        },
        labelLine: {
          show: false,
        },
        tooltip: {
          trigger: ''
        },
      },
    ],
  });
  return (
    <>
      <div className="">
        <ReactECharts option={graphOption} notMerge={true} lazyUpdate={true} />
      </div>
    </>
  );
};

export default BudgetTrendChart;
