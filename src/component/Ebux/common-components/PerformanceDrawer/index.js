
import BreakDownTable from "./BreakdownTable";
import { useRef } from "react";
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const PerformanceDrawer = ({onClose}) => {
    const defaultOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            // data: ['Amazon', 'Blinkit']
            show: false
        },
        toolbox: {
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Amazon',
                type: 'line',
                stack: 'Total',
                areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(255, 153, 1, 0.3)' },
                            { offset: 1, color: 'rgba(255, 153, 1, 0)' }
                        ])
                    
                },
                emphasis: {
                    focus: 'series'
                },
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: 'Blinkit',
                type: 'line',
                stack: 'Total',
                areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(17, 176, 122, 0.3)' },
                            { offset: 1, color: 'rgba(17, 176, 122, 0)' }
                        ])
                },
                emphasis: {
                    focus: 'series'
                },
                data: [220, 182, 191, 234, 290, 330, 310]
            }
        ]
    };

    const chartRef = useRef(null);

    return (
        <>
            <div className="performanceDrawerBox">
                <div className="performanceDrawerHead">
                    <button type="button" className="closeButton" onClick={onClose}>
                        <img src="/assets/images/drawerClose.svg" />
                    </button>
                    <h6>SKU Performance</h6>
                </div>
                <div className="performanceDrawerContent">
                    <div className="performanceDrawerContentWrap mb-4">
                        <div className="performanceDrawerContentHead">
                            <div className="font-semibold text-sm flex gap-3 items-center">
                                2 Selected Products:
                                <div className="flex gap-3">
                                    <div className="performanceTag">
                                        <label>KS93528TUT</label>
                                        <span className="cursor-pointer">
                                            <img src="/assets/images/drawerClose.svg" width={12} height={12} />
                                        </span>
                                    </div>
                                    <div className="performanceTag">
                                        <label>KS93528TUT</label>
                                        <span className="cursor-pointer">
                                            <img src="/assets/images/drawerClose.svg" width={12} height={12} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button type="button">
                                <img
                                    src="/assets/images/downloadIcon.svg"
                                    alt="Download"
                                    width={18}
                                    height={18}
                                />
                            </button>
                        </div>

                        <div className="border rounded p-3 w-full">
                            <div className="flex justify-between items-center w-full">
                                <label className="font-semibold text-sm">
                                    Graphical Analysis
                                </label>
                                <div className="graphLegend">
                                    <button type="button" className="catLegendBtn"><span className="amazonCircle"></span> Amazon</button>
                                    <button type="button" className="catLegendBtn"><span className="zeptoCircle"></span> Zepto</button>
                                    <button type="button">
                                        <img
                                            src="/assets/images/downloadIcon.svg"
                                            alt="Download"
                                            width={18}
                                            height={18}
                                        />
                                    </button>
                                </div>
                            </div>
                            <ReactECharts
                                ref={chartRef}
                                //   option={graphOption}
                                notMerge={true}
                                lazyUpdate={true}
                                option={defaultOption}
                                style={{ height: '200px', width: '100%' }}
                            />
                        </div>
                    </div>
                    <div className="performanceDrawerContentWrap !px-0 !pb-0">
                        <BreakDownTable />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PerformanceDrawer;
