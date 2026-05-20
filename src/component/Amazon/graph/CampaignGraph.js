import React, {  useState } from "react";
import ReactECharts from "echarts-for-react";

const  CampaignGraph=()=>{
    // eslint-disable-next-line no-unused-vars
    const [graphOption, setGraphOption] = useState({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            // legend: {},
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: ['Sponsored Products', 'Sponsored Brand', 'Sponsored Display']
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: 'manual',
                type: 'bar',
                stack:"Ad",
                color:'#84d0ff',
                emphasis: {
                  focus: 'series'
                },
                data: [27.13, 32, 35]
              },
              
              {
                name: 'Email',
                type: 'bar',
                color:"#5bc2fe",
                stack: 'Ad',
                
                emphasis: {
                  focus: 'series'
                },
                data: [0, 13, 20]
              },
              {
                name: 'Union Ads',
                type: 'bar',
                stack: 'Ad',
                color:"#39dae2",
                emphasis: {
                  focus: 'series'
                },
                data: [0, 18, 0]
              },
              {
                name: 'auto',
                type: 'bar',
                stack: 'Ad',
                color:"#299aff",
                emphasis: {
                  focus: 'series'
                },
                data: [12.98, 24, 0]
              },
              
            ]
          }
        )
    return(
        <>
         <div>
        <ReactECharts option={graphOption}  />
      </div>
        </>
    )
}
export default CampaignGraph
