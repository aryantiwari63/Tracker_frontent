import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import moment from "moment";
import { fetchPlatformPerformanceGraphicalAnalysisData } from "../../services/service";
import { useEbuxContext } from "../../../../../Context/EbuxProvider";
import Loader from "../../../../../common-components/Loader";

const isShowDummyData = false;
function GraphicalAnalysis({ activeCard, metrics }) {

    const optionData = useMemo(() => {
        return (metrics ?? [])?.filter(i => i?.checked)?.reduce((map, item) => {
            map[item.value] = item?.title;
            return map;
        }, {})
    }, [metrics]);
    const [selectedOptionMatrix, setSelectedOptionMatrix] = useState(Object.keys(optionData)?.[0]);
    const kpiInfo = useMemo(() => {
        return metrics?.filter(i => i?.value == selectedOptionMatrix)?.[0]
    }, [metrics, selectedOptionMatrix]);
    const {
        kpi,
        uniqueColorsMap,
        platformColor,
        selectedFilters, filters
    } = useEbuxContext();
    const [apiResponse, setApiResponse] = useState({});
    const chartRef = useRef(null);
    const [seriesVisibility, setSeriesVisibility] = useState({});
    const [activeSeries, setActiveSeries] = useState("");
    const [selectedOption, setSelectedOption] = useState("day");
    const [loading, setLoading] = useState(false);

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

    // // Platform colors with light area colors
    // const platformColors = {
    //     Amazon: { line: "#FF9901", area: "rgba(255, 153, 1, 0.1)" },
    //     Zorro: { line: "#FF3265", area: "rgba(255, 50, 101, 0.1)" },
    //     Brinkit: { line: "#11B07A", area: "rgba(17, 176, 122, 0.1)" },
    //     Flipkart: { line: "#0081F7", area: "rgba(0, 129, 247, 0.1)" }
    // };

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
    // const generateSeries = () => {
    //     const { dates, platformData } = generatePlatformData();
    //     const series = [];

    //     dummyDataConfig.platforms.forEach(platform => {
    //         if (seriesVisibility[platform] !== false) {
    //             const data = dates.map(date => ({
    //                 name: date,
    //                 value: platformData[platform][date]
    //             }));

    //             // Use default colors if platform not found
    //             const colorConfig = platformColors[platform] || {
    //                 line: "#999999",
    //                 area: "rgba(153, 153, 153, 0.1)"
    //             };

    //             series.push({
    //                 name: platform,
    //                 type: "line",
    //                 areaStyle: {
    //                     color: colorConfig.area
    //                 },
    //                 itemStyle: {
    //                     color: colorConfig.line
    //                 },
    //                 lineStyle: {
    //                     color: colorConfig.line,
    //                     width: 2
    //                 },
    //                 smooth: true,
    //                 showSymbol: false,
    //                 emphasis: {
    //                     focus: "series",
    //                     showSymbol: true
    //                 },
    //                 data
    //             });
    //         }
    //     });

    //     return { series, dates };
    // };

    // // Chart options
    // const chartOption = useMemo(() => {
    //     const { series, dates } = generateSeries();

    //     return {
    //         title: {
    //             show: false,
    //             text: "Graphical Analysis",
    //             top: 0,
    //             textStyle: {
    //                 fontSize: 14,
    //                 fontWeight: 'bold',
    //             },
    //         },
    //         grid: {
    //             left: "3%",
    //             right: "4%",
    //             bottom: "3%",
    //             containLabel: true,
    //         },
    //         legend: {
    //             show: false,
    //             icon: 'circle',
    //             right: 10,
    //             data: dummyDataConfig.platforms,
    //         },
    //         xAxis: {
    //             type: "category",
    //             boundaryGap: false,
    //             data: dates,
    //             axisLabel: {
    //                 formatter: function (value) {
    //                     const parts = value.split('-');
    //                     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    //                     if (selectedOption === "week") {
    //                         const date = moment(value);
    //                         const weekOfYear = date.week();
    //                         return `week${weekOfYear}`;
    //                     } else if (selectedOption === "month") {
    //                         return `${monthNames[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
    //                     }
    //                     return `${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)}`;
    //                 },
    //                 align: 'center',
    //                 padding: [0, 0, 0, 0]
    //             },
    //         },
    //         yAxis: [
    //             {
    //                 type: "value",
    //                 axisLabel: {
    //                     formatter: "{value}%",
    //                 },
    //                 splitLine: {
    //                     show: true,
    //                     lineStyle: {
    //                         type: 'dashed',
    //                         color: '#E5E7EB'
    //                     }
    //                 },
    //                 alignTicks: false
    //             },
    //         ],
    //         tooltip: {
    //             trigger: "axis",
    //             backgroundColor: "#030229",
    //             textStyle: {
    //                 color: "#fff",
    //             },
    //             borderColor: "#030229",
    //             borderWidth: 1,
    //             shadowBlur: 10,
    //             shadowOffsetX: 3,
    //             shadowOffsetY: 3,
    //             shadowColor: "rgba(0, 0, 0, 0.3)",
    //             axisPointer: {
    //                 type: 'line',
    //                 lineStyle: {
    //                     color: 'rgba(0, 0, 0, 0.1)'
    //                 }
    //             }
    //         },
    //         series
    //     };
    // }, [seriesVisibility, selectedOption]);

    // // Toggle series visibility
    // // Toggle series visibility
    // const handleToggleSeries = (seriesKey) => {
    //     setSeriesVisibility((prev) => {
    //         const isOnlyThisVisible = Object.keys(prev).every(
    //             (key) => key === seriesKey ? prev[key] : !prev[key]
    //         );

    //         if (isOnlyThisVisible) {
    //             // If only this one is visible, reset to show all
    //             return Object.fromEntries(Object.keys(prev).map((key) => [key, true]));
    //         } else {
    //             // Show only clicked one
    //             return Object.fromEntries(Object.keys(prev).map((key) => [key, key === seriesKey]));
    //         }
    //     });
    // };


    // Generate series for the chart
    const { series, dates } = useMemo(() => {
        const { dates, platforms, platformData } = apiResponse;
        //  const { dates, platforms, platformData } = (apiResponse?.platforms&&apiResponse?.dates)?apiResponse:generatePlatformData();
        const series = [];

        platforms?.forEach((platform, idx) => {
            if (!seriesVisibility?.[platform]) return;

            const data = dates.map(date => ({
                name: date,
                value: platformData[platform][date]
            }));


            series.push({
                name: (platform == "avg") ? "Avg of All" : platform,
                type: "line",
                areaStyle: {
                    color: `${(platformColor?.[platform]?.line ?? uniqueColorsMap?.[idx]?.[0]?.line)}33`
                },
                itemStyle: {
                    color: (platformColor?.[platform]?.line ?? uniqueColorsMap?.[idx]?.[0]?.line)
                },
                lineStyle: {
                    type: (platform == "avg") ? 'dotted' : 'solid',
                    color: (platformColor?.[platform]?.line ?? uniqueColorsMap?.[idx]?.[0]?.line),
                    width: 2
                },
                smooth: true,
                showSymbol: true,
                emphasis: {
                    focus: "series",
                    showSymbol: true
                },
                data
            });
        });

        return { series, dates };
    }, [JSON.stringify(seriesVisibility), JSON.stringify(apiResponse)]);

    // Chart options
    const chartOption = useMemo(() => {
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
                show: false,
                icon: 'circle',
                right: 10,
                data: Object.keys(seriesVisibility)?.filter(i => seriesVisibility[i])?.map(platform => (platform == "avg") ? "Avg of All" : platform),
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
                        formatter: `${kpiInfo?.icon == "rupee" ? "₹ " : (kpiInfo?.icon ? (kpiInfo?.icon + " ") : "")}{value}${kpiInfo?.persentageValue ? "%" : ""}`
                        ,
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
                renderMode: "html",
                enterable: true,
                confine: true,
                alwaysShowContent: false,
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
                },
                formatter: (params) => {

                    // params = array of series at the hovered point
                    if (!params?.length) return "";
                    const value = params[0].axisValue;
                    const showVal = (val) => {
                        return `${val != undefined && kpiInfo?.icon == "rupee" ? "₹ " : (kpiInfo?.icon ? (kpiInfo?.icon + " ") : "")}${val ?? "-"}${val != undefined && kpiInfo?.persentageValue ? "%" : ""}`;
                    }
                    const parts = value.split('-');
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    let label = "";

                    if (selectedOption === "week") {
                        const date = moment(value);
                        const weekOfYear = date.week();
                        label = `Week ${weekOfYear}, ${date.year()}`;
                    } else if (selectedOption === "month") {
                        label = `${monthNames[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
                    } else {
                        label = `${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)}`;
                    }

                    let tooltipHtml = `
                            <div style="max-height:150px; overflow-y:auto; padding-right:4px;">
                                <div style="margin-bottom:6px;">${label}</div>
                            `;

                    params.forEach(item => {
                        tooltipHtml += `
                                <div style="margin:2px 0;">
                                <span style="display:inline-block;margin-right:5px;
                                            border-radius:50%;width:8px;height:8px;
                                            background-color:${item.color}"></span>
                                ${item.seriesName}: <b>${showVal(item.data.value)}</b>
                                </div>`;
                    });

                    tooltipHtml += `</div>`;
                    return tooltipHtml;
                }
            },
            series: series
        };
    }, [series, dates, seriesVisibility, selectedOption]);

    // Toggle series visibility
    const handleToggleSeries = (seriesKey) => {
        setSeriesVisibility(prevState => {
            const next = { ...prevState };
            if (activeSeries === seriesKey) {
                setActiveSeries("");
                Object.keys(next).forEach(key => {
                    next[key] = true;
                });
            } else {
                setActiveSeries(seriesKey);
                Object.keys(next).forEach(key => {
                    next[key] = key === seriesKey;
                });
            }
            return next;
        });
    };


    const fetchData = async () => {
        setLoading(true);
        if (!activeCard?.value || !activeCard?.type) return;

        const performanceOf = activeCard?.type ?? 'brand';
        let payload = {
            kpi,
            matrix: selectedOptionMatrix,
            key: performanceOf,
            value: activeCard?.label ?? "",
            period: selectedOption,
            selectedFilters, filters
        };

        const response = await fetchPlatformPerformanceGraphicalAnalysisData(payload);
        if (response?.["platforms"]) {
            const data = {}
            response?.["platforms"]?.forEach((platform) => {
                data[platform] = true;
            })
            setSeriesVisibility(data);

            setApiResponse(response);
            setLoading(false);
        } else {
            if (isShowDummyData) {
                const dummyResponse = generatePlatformData();
                const data = {}
                dummyResponse?.["platforms"]?.forEach((platform) => {
                    data[platform] = true;
                })
                setSeriesVisibility(data);
                setApiResponse(dummyResponse);

            }
        }
    }
    useEffect(() => {
        fetchData();
    }, [JSON.stringify(activeCard), selectedOptionMatrix, selectedOption, JSON.stringify(selectedFilters)]);
    return (
        <div>
            <div className="bg-white shadow-md rounded-xl p-5">
                {/* Top Row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Title + Dates */}
                    <div>
                        {/* <h2 className="font-inter font-medium text-[18px] leading-[100%] tracking-[0] text-[#191919] flex items-center gap-2"> */}
                        <h2 className="flex items-center gap-2 text-[20px] font-semibold text-[#000000E0]">
                            {/* chart-title  */}
                            Graphical Analysis
                            {loading && <Loader show={loading} fullScreen={false} />}
                        </h2>
                        <p className="font-inter font-normal italic text-[10px] leading-[100%] align-middle text-[#000000A6] mt-[10px]">
                            {(selectedFilters?.calendarType == "week")?
                            <> {moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY")} </>
                            :
                            <>{moment(selectedFilters?.selectedDateRange?.startDate ?? "")?.format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedDateRange?.endDate ?? "")?.format("DD/MM/YYYY")}</>}
                        </p>
                    </div>
                    {/* Dropdown */}
                    <div className="mt-3 md:mt-0">
                        <div className="relative">
                            <select
                                value={selectedOptionMatrix}
                                onChange={(e) => setSelectedOptionMatrix(e.target.value)}
                                className="appearance-none border rounded-md px-4 pr-8 py-2 text-sm text-gray-700 focus:ring focus:ring-blue-200 bg-white">

                                {Object.keys(optionData)?.map((k, i) => <option value={k} key={i}>{optionData[k]}</option>)}

                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg
                                    className="w-4 h-4 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Filters */}


                {/* Legend */}

                <div className="py-4 w-full">
                    <div className="graphHeadWrap">
                        <div className="graphHeadLeft">
                            <div className="relative">
                                <select
                                    name="graph"
                                    id="graph"
                                    value={selectedOption}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                    className="appearance-none border rounded-md px-4 py-2 text-sm text-gray-700 focus:ring focus:ring-blue-200 bg-white w-[110px]"
                                >
                                    <option value="day">Daily</option>
                                    <option value="week">Weekly</option>
                                    <option value="month">Monthly</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="graphHeadRightWrap">
                            <div className="graphHeadRight">
                                <div className="graphLegend ">
                                    <div className="analysisStats">
                                        {Object?.keys(seriesVisibility).map((platform, idx) => (
                                            <button
                                                type="button"
                                                key={platform}
                                                onClick={() => handleToggleSeries(platform)}
                                                className={`legendBtn ${seriesVisibility[platform] !== false ? "" : "opacity-40"}`}
                                            >
                                                <span
                                                    className="platformCircle"
                                                    style={{
                                                        backgroundColor: `${(platformColor?.[platform]?.line ?? uniqueColorsMap?.[idx]?.[0]?.line) ?? "#999999"} `
                                                    }}
                                                ></span>{" "}
                                                {(platform == "avg") ? "Avg of All" : platform}
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

                    <div className="relative">
                        {/* Y-axis label */}
                        {/* <div className="absolute -left-6 top-1/2 transform -rotate-90 -translate-y-1/2 text-xs font-medium text-gray-600">
                        Average OSA
                    </div> */}

                        {/* Chart */}
                        <ReactECharts
                            ref={chartRef}
                            option={chartOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: "300px", width: "100%" }}
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