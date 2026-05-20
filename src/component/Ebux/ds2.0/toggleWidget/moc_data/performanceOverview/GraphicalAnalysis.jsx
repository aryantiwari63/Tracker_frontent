import React, { useMemo, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import moment from "moment";
function GraphicalAnalysis() {
    const chartRef = useRef(null);
    const [seriesVisibility, setSeriesVisibility] = useState({});
    const [selectedOption, setSelectedOption] = useState("month");

    // Dummy data configuration
    const dummyDataConfig = {
        platforms: ["Amazon", "Zorro", "Brinkit", "Flipkart"],
        dateRange: {
            start: "2025-05-01",
            end: "2025-07-30"
        },
        valuesRange: {
            min: 20,
            max: 80
        }
    };

    // Platform colors with light area colors
    const platformColors = {
        Amazon: { line: "#FF9901", area: "rgba(255, 153, 1, 0.1)" },
        Zorro: { line: "#FF3265", area: "rgba(255, 50, 101, 0.1)" },
        Brinkit: { line: "#11B07A", area: "rgba(17, 176, 122, 0.1)" },
        Flipkart: { line: "#0081F7", area: "rgba(0, 129, 247, 0.1)" }
    };

    // Generate dates based on selected option
    const generateDates = () => {
        const dates = [];
        const start = moment(dummyDataConfig.dateRange.start);
        const end = moment(dummyDataConfig.dateRange.end);

        if (selectedOption === "day") {
            for (let date = moment(start); date <= end; date.add(1, 'day')) {
                dates.push(date.format("YYYY-MM-DD"));
            }
        } else if (selectedOption === "week") {
            for (let date = moment(start); date <= end; date.add(1, 'week')) {
                dates.push(date.format("YYYY-MM-DD"));
            }
        } else if (selectedOption === "month") {
            for (let date = moment(start); date <= end; date.add(1, 'month')) {
                dates.push(date.format("YYYY-MM-DD"));
            }
        }

        return dates;
    };

    // Generate dummy data for platforms
    const generatePlatformData = () => {
        const dates = generateDates();
        const platformData = {};

        dummyDataConfig.platforms.forEach(platform => {
            platformData[platform] = {};
            dates.forEach(date => {
                // Generate random value within range
                const value = Math.floor(Math.random() *
                    (dummyDataConfig.valuesRange.max - dummyDataConfig.valuesRange.min + 1)) +
                    dummyDataConfig.valuesRange.min;
                platformData[platform][date] = value;
            });

            // Initialize series visibility
            if (seriesVisibility[platform] === undefined) {
                setSeriesVisibility(prev => ({ ...prev, [platform]: true }));
            }
        });

        return { dates, platformData };
    };

    // Generate series for the chart
    const generateSeries = () => {
        const { dates, platformData } = generatePlatformData();
        const series = [];

        dummyDataConfig.platforms.forEach(platform => {
            if (seriesVisibility[platform] !== false) {
                const data = dates.map(date => ({
                    name: date,
                    value: platformData[platform][date]
                }));

                // Use default colors if platform not found
                const colorConfig = platformColors[platform] || {
                    line: "#999999",
                    area: "rgba(153, 153, 153, 0.1)"
                };

                series.push({
                    name: platform,
                    type: "line",
                    areaStyle: {
                        color: colorConfig.area
                    },
                    itemStyle: {
                        color: colorConfig.line
                    },
                    lineStyle: {
                        color: colorConfig.line,
                        width: 2
                    },
                    smooth: true,
                    showSymbol: false,
                    emphasis: {
                        focus: "series",
                        showSymbol: true
                    },
                    data
                });
            }
        });

        return { series, dates };
    };

    // Chart options
    const chartOption = useMemo(() => {
        const { series, dates } = generateSeries();

        return {
            title: {
                show: false,
                text: "Graphical Analysis",
                top: 0,
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            legend: {
                show: true,
                icon: 'circle',
                top: 20,
                right: 0,
                itemWidth: 5,
                itemHeight: 5,
                textStyle: {
                    fontSize: 5,
                    color: '#333',
                    fontWeight: 400
                },
                data: dummyDataConfig.platforms,
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: dates,
                axisLabel: {
                    formatter: function (value) {
                        const parts = value.split('-');
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                        if (selectedOption === "week") {
                            const date = moment(value);
                            const weekOfYear = date.week();
                            return `week${weekOfYear}`;
                        } else if (selectedOption === "month") {
                            return `${monthNames[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
                        }
                        return `${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)}`;
                    },
                    align: 'center',
                    padding: [0, 0, 0, 0]
                },
            },
            yAxis: [
                {
                    type: "value",
                    axisLabel: {
                        formatter: "{value}%",
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: '#E5E7EB'
                        }
                    },
                    alignTicks: false
                },
            ],
            tooltip: {
                trigger: "axis",
                backgroundColor: "#030229",
                textStyle: {
                    color: "#fff",
                },
                borderColor: "#030229",
                borderWidth: 1,
                shadowBlur: 10,
                shadowOffsetX: 3,
                shadowOffsetY: 3,
                shadowColor: "rgba(0, 0, 0, 0.3)",
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            series
        };
    }, [seriesVisibility, selectedOption]);

    // Toggle series visibility
    // Toggle series visibility
    const handleToggleSeries = (seriesKey) => {
        setSeriesVisibility((prev) => {
            const isOnlyThisVisible = Object.keys(prev).every(
                (key) => key === seriesKey ? prev[key] : !prev[key]
            );

            if (isOnlyThisVisible) {
                // If only this one is visible, reset to show all
                return Object.fromEntries(Object.keys(prev).map((key) => [key, true]));
            } else {
                // Show only clicked one
                return Object.fromEntries(Object.keys(prev).map((key) => [key, key === seriesKey]));
            }
        });
    };


    return (
        <div>
            <div className="bg-white shadow-md rounded-xl px-2 pt-2 pb-0">
                {/* Top Row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Title + Dates */}
                    <div>
                        <h2 className="text-[11px] font-semibold text-gray-800 leading-tight">
                            Graphical Analysis
                        </h2>
                        <p className="text-[8px] text-gray-500 leading-tight mt-0.5">
                            23/07/25 → 23/07/25
                        </p>
                    </div>
                    {/* Dropdown */}
                    <div className="mt-1 md:mt-0">
                        <select className="border rounded px-0.5 py-0.5 text-[10px] text-gray-700 focus:ring focus:ring-blue-200 h-[19px] min-w-[20px]">
                            <option>Avg OSA</option>
                            <option>Wgt OSA</option>
                            <option>Avg Off take</option>
                        </select>
                    </div>
                </div>
                {/* Filters */}


                {/* Legend */}

                <div className="px-2 pt-2 pb-0 w-full">
                    <div className="graphHeadWrap">
                        <div className="graphHeadLeft flex items-center p-0 m-0" style={{ minWidth: 0, justifyContent: 'flex-start' }}>
                            <select
                                name="graph"
                                id="graph"
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(e.target.value)}
                                className="border rounded px-1 py-0.5 text-[10px] text-gray-700 focus:ring focus:ring-blue-200 h-[19px] min-w-[55px]"
                                style={{ maxWidth: '70px', marginLeft: '-18px' }}
                            >
                                <option value="day">Daily</option>
                                <option value="week">Weekly</option>
                                <option value="month">Monthly</option>
                            </select>
                        </div>
                        <div className="graphHeadRightWrap">
                            <div className="graphHeadRight">
                                <div className="graphLegend ">
                                    <div className="analysisStats">
                                        {dummyDataConfig.platforms.map(platform => (
                                            <button
                                                type="button"
                                                key={platform}
                                                onClick={() => handleToggleSeries(platform)}
                                                className={`flex items-center gap-0.5 legendBtn ${seriesVisibility[platform] !== false ? "" : "opacity-40"}`}
                                                style={{ fontSize: '7px', padding: '0 1.5px', height: '11px', minWidth: '0', background: 'none', border: 'none', lineHeight: '1' }}
                                            >
                                                <span
                                                    className="platformCircle"
                                                    style={{
                                                        backgroundColor: platformColors[platform]?.line || "#999999",
                                                        width: '5px',
                                                        height: '5px',
                                                        borderRadius: '50%',
                                                        display: 'inline-block',
                                                        marginRight: '1.5px'
                                                    }}
                                                ></span>
                                                {platform}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* <div className="graphIconBtnWrap">
                                <button
                                    type="button"
                                    onClick={downloadImage}
                                    className="graphIconBtn"
                                >
                                    <img
                                        src="/assets/images/downloadIcon.svg"
                                        width={22}
                                        height={22}
                                        alt="Download"
                                    />
                                </button>
                            </div> */}
                            </div>
                        </div>
                    </div>

                    <div className="relative pb-0 mb-0">
                        {/* Y-axis label */}
                        {/* <div className="absolute -left-6 top-1/2 transform -rotate-90 -translate-y-1/2 text-xs font-medium text-gray-600">
                        Average OSA
                    </div> */}

                        {/* Chart */}
                        <ReactECharts
                            ref={chartRef}
                            option={chartOption}
                            style={{ height: "130px", width: "100%" }}
                        />

                        {/* X-axis label */}
                        {/* <div className="text-center text-xs font-medium text-gray-600 mt-2">
                        Time Period
                    </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GraphicalAnalysis;