import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import moment from "moment";
import { FaSort } from "react-icons/fa";
import ComprehenisiveFilter from "./filter/ComprehenisiveFilter";
import { IoMdArrowDropdown, IoMdArrowDropup, IoMdCopy } from "react-icons/io";
import CustomizeCampiagnModal from "../../../../../common-components/CustomizeCampiangn";
import { useEbuxContext } from "../../../../../Context/EbuxProvider";
import { fetchPlatformPerformanceData, fetchPlatformPerformanceGraphicalAnalysisData } from "../../services/service";
import Excel from "exceljs";

import {
    FILTERACTION,
    searchFilterArr
} from "../../../../../common-components/MultiFilter/FilterConstant";
import _ from 'lodash';
import Loader from "../../../../../common-components/Loader";
import { copyToClipboard, getTextFromReactNode } from "../../../../../../../utils/helpers";
const isShowDummyData = false;
const dummyData = (!isShowDummyData) ? [] : [
    {
        date: "01-09-2025",
        rows: [
            { platform: "All", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 }, dummy: "just check" },
            { platform: "Amazon", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
            { platform: "Zepto", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
            { platform: "Blinkit", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
            { platform: "Flipkart", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
        ],
    },
    {
        date: "02-09-2025",
        rows: [
            { platform: "All", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
            { platform: "Amazon", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
            { platform: "Zepto", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
            { platform: "Blinkit", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
            { platform: "Flipkart", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
        ],
    },
    {
        date: "03-09-2025",
        rows: [
            { platform: "All", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
            { platform: "Amazon", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
            { platform: "Zepto", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
            { platform: "Blinkit", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
        ],
    },
];

function DailyPerformance({ data = {}, setSelectedRows, selectedRows }) {

    const { kpi, clientCustomizeColumnsComprehensiveBreakdown } = useEbuxContext();
    const kpicol = (clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => (i?.allowInWidget && (i?.allowKPI?.indexOf(kpi) > -1) && (!i?.value?.includes("competition_")) && (["previous_osa", "last_month_sale"]?.indexOf(i?.key) == -1)))?.map(i => ({ ...i, label: i?.title, id: i?.value, checked: ((i?.kpi?.indexOf(kpi) > -1) || ((!i?.isDisabled) && (data?.visibleMatrix?.length) && (data?.visibleMatrix?.findIndex(v => v?.value == i?.value) > -1))), disabled: i?.isDisabled })));

    return (
        <div>
            <PlatformChartComponentDummy kpicol={kpicol} data={data} selectedRows={selectedRows} />
            <PerformanceTable kpicol={kpicol} data={data} setSelectedRows={setSelectedRows} selectedRows={selectedRows} selectedDates={selectedRows?.selectedDates} />
        </div>
    )
}

const PlatformChartComponentDummy = ({ kpicol, data = {}, selectedRows }) => {
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
    const [isDownloading, setIsDownloading] = useState(false);

    const optionData = data?.visibleMatrix?.length ? (data?.visibleMatrix ?? [])?.reduce((map, item) => { map[item?.value] = item?.title; return map; }, {}) :
        kpicol?.length ? ((kpicol ?? [])?.reduce((map, item) => { map[item?.value] = item?.title; return map; }, {})) :
            {
                ...((kpi == "OSA") ? {
                    "osa": "Avg OSA"
                } : (kpi == "SOS") ? {
                    "sos": "SOS"
                } : {
                    "price_variation": "Promotions"
                })
            };
    const [selectedOptionMatrix, setSelectedOptionMatrix] = useState(Object.keys(optionData)?.[0]);
    const kpiInfo = useMemo(() => {
        return kpicol?.filter(i => i?.value == selectedOptionMatrix)?.[0]
    }, [kpicol, selectedOptionMatrix]);
    // Dummy data configuration
    const dummyDataConfig = {
        platforms: ["Amazon", "Zorro", "Brinkit", "Flipkart"],
        dateRange: {
            start: selectedFilters?.selectedDateRange?.startDate ?? "2025-05-01",
            end: selectedFilters?.selectedDateRange?.endDate ?? "2025-07-30"
        },
        valuesRange: {
            min: 20,
            max: 80
        }
    };

    // Platform colors with light area colors
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

        });

        return { dates, platformData, platforms: dummyDataConfig.platforms };
    };

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
    // const chartOption = useMemo(() => {
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
    //             left: "6%",
    //             right: "6%",
    //             bottom: "12%",
    //             top: "3%",
    //             containLabel: true
    //         },
    //         legend: {
    //             show: false,
    //             icon: 'circle',
    //             right: 10,
    //             data: Object.keys(seriesVisibility)?.filter(i => seriesVisibility[i])?.map(platform => (platform == "avg") ? "Avg of All" : platform),
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
    //             name: "Time Period",
    //             nameLocation: "middle",
    //             nameGap: 30,
    //             nameTextStyle: { fontSize: 16, color: "#000000D9" }
    //         },
    //         yAxis: [
    //             {
    //                 type: "value",
    //                 axisLabel: {
    //                     formatter: `${kpiInfo?.icon == "rupee" ? "₹ " : ""}{value}${kpiInfo?.persentageValue ? "%" : ""}`,
    //                 },
    //                 splitLine: {
    //                     show: true,
    //                     lineStyle: {
    //                         type: 'dashed',
    //                         color: '#E5E7EB'
    //                     }
    //                 },
    //                 alignTicks: false,

    //                 name: `${kpiInfo?.title}`,
    //                 nameLocation: "middle",
    //                 nameGap: 50,
    //                 nameTextStyle: { fontSize: 16, color: "#000000D9" }
    //             },
    //         ],
    //         tooltip: {
    //             trigger: "axis",
    //             renderMode: "html",
    //             enterable: true,
    //             confine: true,
    //             alwaysShowContent: false,
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
    //             },
    //             formatter: (params) => {
    //                 // params = array of series at the hovered point
    //                 if (!params?.length) return "";
    //                 const value = params[0].axisValue;

    //                 const parts = value.split('-');
    //                 const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //                 let label = "";

    //                 if (selectedOption === "week") {
    //                     const date = moment(value);
    //                     const weekOfYear = date.week();
    //                     label = `Week ${weekOfYear}, ${date.year()}`;
    //                 } else if (selectedOption === "month") {
    //                     label = `${monthNames[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
    //                 } else {
    //                     label = `${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)}`;
    //                 }

    //                 let tooltipHtml = `
    //                     <div style="max-height:150px; overflow-y:auto; padding-right:4px;">
    //                         <div style="margin-bottom:6px;">${label}</div>
    //                     `;
    //                 const showVal = (val) => {
    //                     return `${val != undefined && kpiInfo?.icon == "rupee" ? "₹ " : ""}${val ?? "-"}${val != undefined && kpiInfo?.persentageValue ? "%" : ""}`;
    //                 }
    //                 params.forEach(item => {
    //                     tooltipHtml += `
    //                         <div style="margin:2px 0;">
    //                         <span style="display:inline-block;margin-right:5px;
    //                                     border-radius:50%;width:8px;height:8px;
    //                                     background-color:${item.color}"></span>
    //                         ${item.seriesName}: <b>${showVal(item.data.value)}</b>
    //                         </div>`;
    //                 });

    //                 tooltipHtml += `</div>`;
    //                 return tooltipHtml;
    //             }
    //         },
    //         series: series
    //     };
    // }, [series, dates, seriesVisibility, selectedOption]);
    const chartOption = useMemo(() => {
        // Create date range text for title
        const startDate = (selectedFilters?.calendarType == "week") ? moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY") : moment(selectedFilters?.selectedDateRange?.startDate ?? "").format("DD/MM/YYYY");
        const endDate = (selectedFilters?.calendarType == "week") ? moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY") : moment(selectedFilters?.selectedDateRange?.endDate ?? "").format("DD/MM/YYYY");
        const dateRangeText = `${startDate} → ${endDate}`;

        return {
            title: {
                show: isDownloading, // Only show when downloading
                text: isDownloading ? `Graphical Analysis\n${dateRangeText}` : "", // Include date range only when downloading
                left: 'left',
                top: 1,
                textStyle: {
                    color: '#333',
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 22
                }
            },
            grid: {
                left: "6%",
                right: "6%",
                bottom: "12%",
                top: isDownloading ? "25%" : "3%", // Adjust top based on download mode
                containLabel: true
            },
            legend: {
                show: isDownloading, // Only show when downloading
                icon: 'circle',
                right: 10,
                top: 10,
                data: Object.keys(seriesVisibility)?.filter(i => seriesVisibility[i])?.map(platform => (platform == "avg") ? "Avg of All" : platform),
                textStyle: {
                    fontSize: 12,
                    color: '#333'
                }
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
                name: "Time Period",
                nameLocation: "middle",
                nameGap: 30,
                nameTextStyle: { fontSize: 16, color: "#000000D9" }
            },
            yAxis: [
                {
                    type: "value",
                    axisLabel: {
                        formatter: `${kpiInfo?.icon == "rupee" ? "₹ " : (kpiInfo?.icon ? (kpiInfo?.icon + " ") : "")}{value}${kpiInfo?.persentageValue ? "%" : ""}`,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: '#E5E7EB'
                        }
                    },
                    alignTicks: false,

                    name: `${kpiInfo?.title}`,
                    nameLocation: "middle",
                    nameGap: 50,
                    nameTextStyle: { fontSize: 16, color: "#000000D9" }
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
                    if (!params?.length) return "";
                    const value = params[0].axisValue;

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
                    const showVal = (val) => {
                        return `${val != undefined && kpiInfo?.icon == "rupee" ? "₹ " : (kpiInfo?.icon ? (kpiInfo?.icon + " ") : "")}${val ?? "-"}${val != undefined && kpiInfo?.persentageValue ? "%" : ""}`;
                    }
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
    }, [series, dates, seriesVisibility, selectedOption, isDownloading, kpiInfo, selectedFilters]);
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

    // Download chart as image
    // const downloadImage = () => {
    //     const echartsInstance = chartRef.current.getEchartsInstance();
    //     const imgData = echartsInstance.getDataURL({
    //         type: "png",
    //         pixelRatio: 2,
    //         backgroundColor: "#fff",
    //     });

    //     const link = document.createElement("a");
    //     link.href = imgData;
    //     link.download = "chart-image.png";
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    const downloadImage = () => {
        const echartsInstance = chartRef.current.getEchartsInstance();

        // Set downloading state to true - this will trigger the useMemo to update the chart
        setIsDownloading(true);

        // Wait for the chart to re-render with download configuration, then download
        setTimeout(() => {
            const imgData = echartsInstance.getDataURL({
                type: "png",
                pixelRatio: 2,
                backgroundColor: "#fff",
            });

            // Reset downloading state immediately after capturing the image
            setIsDownloading(false);

            const link = document.createElement("a");
            link.href = imgData;
            link.download = "graphical-analysis-chart.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 300);
    };

    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        if (!data?.value || !data?.performanceOf) return;
        if (!data?.value || !data?.performanceOf) return;
        setLoading(true);
        try {
            const performanceOf = data?.performanceOf ?? 'brand';
            let payload = {
                kpi,
                matrix: selectedOptionMatrix,
                key: performanceOf,
                value: data?.value ?? "",
                period: selectedOption,
                selectedFilters, filters,
                selectedTableRows: {
                    // selectedDates:selectedRows?.selectedDates?.map(i=>i?.date)??[],
                    selectedLocation: selectedRows?.selectedLocation?.map(i => i?.location) ?? [],
                    selectedPlatform: selectedRows?.selectedPlatform?.map(i => i?.platform) ?? [],
                    selectedProduct: selectedRows?.selectedProduct?.map(i => i?.skuId) ?? [],
                    selectedKeyword: selectedRows?.selectedKeyword?.map(i => i?.keyword) ?? []
                }
            };

            const response = await fetchPlatformPerformanceGraphicalAnalysisData(payload);
            if (response?.["platforms"]) {
                const data = {}
                response?.["platforms"]?.forEach((platform) => {
                    data[platform] = true;
                })
                setSeriesVisibility(data);

                setApiResponse(response);
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
            setLoading(false);

        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
            return;
        }
    }
    useEffect(() => {
        fetchData();
    }, [JSON.stringify(data), selectedOptionMatrix, selectedOption, JSON.stringify(selectedFilters), JSON.stringify({ ...selectedRows, selectedDates: [] })]);

    return (
        <div className='bg-white px-4 py-4 rounded-md mt-4'>
            <div className="flex items-center justify-between ">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                    Graphical Analysis
                    {loading && <Loader show={loading} fullScreen={false} />}
                </h4>                <div className=" flex items-center gap-2">
                    <div className="relative">
                        <select
                            id="graph"
                            className="appearance-none pr-8 bg-gray-50 cursor-pointer border border-gray-300 text-gray-900 text-xs rounded-lg 
             focus:ring-blue-500 focus:border-blue-500 block  px-2.5 py-1
             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
             dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={selectedOptionMatrix}
                            onChange={(e) => setSelectedOptionMatrix(e.target.value)}
                        >
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
                    <div className="graphIconBtnWrap">
                        <button
                            type="button"
                            className="graphIconBtn"
                            onClick={downloadImage}
                        >
                            <img
                                src="/assets/images/downloadIcon.svg"
                                width={22}
                                height={22}
                            />
                        </button>
                    </div>
                </div>
            </div>
            <p className="font-inter font-normal italic text-[10px] leading-[100%] align-middle text-[#000000A6] mt-[10px]">
                {(selectedFilters?.calendarType == "week") ?
                    <> {moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY")} </>
                    :
                    <>{moment(selectedFilters?.selectedDateRange?.startDate ?? "")?.format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedDateRange?.endDate ?? "")?.format("DD/MM/YYYY")}</>}
            </p>
            <div className="p-4 w-full">
                <div className="graphHeadWrap">
                    <div className="graphHeadLeft">
                        <div className="relative">
                            <select
                                name="graph"
                                id="graph"
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(e.target.value)}
                                className="appearance-none pr-8 selectBox text-sm w-[100px]"
                            >
                                <option value="day" className="text-sm">Daily</option>
                                <option value="week" className="text-sm">Weekly</option>
                                <option value="month" className="text-sm">Monthly</option>
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
                    {/* <div className="absolute -left-6 top-1/2 transform -rotate-90 -translate-y-1/2 text-xs font-medium text-gray-600"> */}
                    {/* Average  */}
                    {/* {optionData?.[selectedOptionMatrix]} */}
                    {/* </div> */}

                    {/* Chart */}
                    {loading ?
                        <div className="flex items-center justify-center h-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                        </div>
                        :

                        <ReactECharts
                            ref={chartRef}
                            option={chartOption}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{ height: isDownloading ? "260px" : "300px", width: "100%" }}
                        />
                    }

                    {/* X-axis label */}
                    {/* <div className="text-center text-xs font-medium text-gray-600 mt-2">
                        Time Period
                    </div> */}
                </div>
            </div>
        </div>
    )
}

const PerformanceTable = ({ kpicol, data = {}, setSelectedRows, selectedDates, selectedRows }) => {

    const { kpi, selectedFilters, filters } = useEbuxContext();
    const pf_images = filters?.platform?.reduce((map, i) => { map[i.label?.toLowerCase()] = i.platform_description ?? ""; return map; }, {});


    const [tabColumnList, setTabColumnList] = useState({});
    const [selectedTabName,] = useState("comprehensive");

    // const kpicol = (
    //     kpi == "OSA" ?
    //         [
    //             {
    //                 "persentageValue": true,
    //                 "title": "Avg OSA",
    //                 "type": "parameters",
    //                 "value": "osa",
    //                 "key": "osa",
    //                 "kpi": [
    //                     "OSA"
    //                 ],
    //                 "allowKPI": [
    //                     "OSA",
    //                     "CS",
    //                     "PRO",
    //                     "RR"
    //                 ],
    //                 "notAllowWithIsValueIn": [],
    //                 "allowWithIsValueIn": [],
    //                 "isDisabled": false
    //             },
    //             {
    //                 "persentageValue": true,
    //                 "title": "Wt OSA",
    //                 "type": "parameters",
    //                 "value": "wt_osa",
    //                 "key": "wt_osa",
    //                 "kpi": [
    //                     "OSA"
    //                 ],
    //                 "allowKPI": [
    //                     "OSA",
    //                     "CS",
    //                     "PRO",
    //                     "RR"
    //                 ],
    //                 "notAllowWithIsValueIn": [],
    //                 "allowWithIsValueIn": [],
    //                 "isDisabled": false
    //             },
    //             {
    //                 "persentageValue": true,
    //                 "title": "Avg Off OSA",
    //                 "type": "parameters",
    //                 "value": "avg_off_osa",
    //                 "key": "avg_off_osa",
    //                 "kpi": [
    //                     "OSA"
    //                 ],
    //                 "allowKPI": [
    //                     "OSA",
    //                     "CS",
    //                     "PRO",
    //                     "RR"
    //                 ],
    //                 "notAllowWithIsValueIn": [],
    //                 "allowWithIsValueIn": [],
    //                 "isDisabled": false
    //             }
    //         ]
    //         :
    //         kpi == "SOS" ?
    //             [{
    //                 "persentageValue": true,
    //                 "title": "SOS",
    //                 "type": "parameters",
    //                 "value": "sos",
    //                 "key": "sos",
    //                 "kpi": [
    //                     "SOS"
    //                 ],
    //                 "allowKPI": [
    //                     "SOS"
    //                 ],
    //                 "notAllowWithIsValueIn": [],
    //                 "allowWithIsValueIn": [],
    //                 "isDisabled": false
    //             },
    //             {
    //                 "persentageValue": false,
    //                 "title": "Ranking",
    //                 "type": "parameters",
    //                 "value": "or",
    //                 "key": "or",
    //                 "kpi": [
    //                     "SOS"
    //                 ],
    //                 "allowKPI": [
    //                     "SOS"
    //                 ],
    //                 "notAllowWithIsValueIn": [],
    //                 "allowWithIsValueIn": [],
    //                 "isDisabled": false
    //             }
    //             ]
    //             :
    //             [
    //                 {
    //                     "persentageValue": true,
    //                     "title": "Promotions",
    //                     "type": "parameters",
    //                     "value": "pro",
    //                     "key": "pro",
    //                     "kpi": [
    //                         "PRO"
    //                     ],
    //                     "allowKPI": [
    //                         "OSA",
    //                         "CS",
    //                         "PRO",
    //                         "RR"
    //                     ],
    //                     "notAllowWithIsValueIn": [],
    //                     "allowWithIsValueIn": [],
    //                     "isDisabled": false
    //                 },
    //                 {
    //                     "persentageValue": true,
    //                     "title": "MRP",
    //                     "type": "parameters",
    //                     "value": "mrp",
    //                     "key": "mrp",
    //                     "kpi": [
    //                         "PRO"
    //                     ],
    //                     "allowKPI": [
    //                         "OSA",
    //                         "CS",
    //                         "PRO",
    //                         "RR"
    //                     ],
    //                     "notAllowWithIsValueIn": [],
    //                     "allowWithIsValueIn": [],
    //                     "isDisabled": false
    //                 },
    //                 {
    //                     "persentageValue": true,
    //                     "title": "SP",
    //                     "type": "parameters",
    //                     "value": "sp",
    //                     "key": "sp",
    //                     "kpi": [
    //                         "PRO"
    //                     ],
    //                     "allowKPI": [
    //                         "OSA",
    //                         "CS",
    //                         "PRO",
    //                         "RR"
    //                     ],
    //                     "notAllowWithIsValueIn": [],
    //                     "allowWithIsValueIn": [],
    //                     "isDisabled": false
    //                 }])

    const [defaultfixedColumns, setDefaultFixedColumns] = useState([
        {
            "persentageValue": false,
            "title": "Date",
            "type": "breakdown",
            "value": "date",
            "key": "date",
            "breakdown": "",
            "allowKPI": [
                "OSA",
                "CS",
                "PRO",
                "RR",
                "SOS",
                "OR",
                "SOD"
            ],
            "notAllowWithIsValueIn": [],
            "allowWithIsValueIn": [],
            "isDisabled": true,
            "remove": false,
            "drag": false,
            "align": "left",
        },
        {
            "persentageValue": false,
            "title": "Platform",
            "type": "breakdown",
            "value": "platform",
            "key": "platform",
            "breakdown": "",
            "allowKPI": [
                "OSA",
                "CS",
                "PRO",
                "RR",
                "SOS",
                "OR",
                "SOD"
            ],
            "notAllowWithIsValueIn": [],
            "allowWithIsValueIn": [],
            "isDisabled": true,
            "remove": false,
            "drag": false,
            "align": "left",
        },
        ...(kpicol?.filter(i => i?.checked) ?? [])
    ]);
    const columns = [
        {
            key: "date",
            value: "date",
            label: "Date",
            align: "between",
            checkbox: true,
            sortable: true,
        },
        {
            type: "breakdown",
            key: "platform",
            value: "platform",
            label: "Platform",
            align: "left",
            sortable: true,
        },
        ...(kpicol?.filter(i => i?.checked)?.map(i => (
            {
                ...i,
                label: i.title,
                align: "center",
                sortable: true
            })) ?? [])
    ];
    //setFixedColumns

    const [apiResponse, setApiResponse] = useState({});
    const { rowData, footerData } = useMemo(() => {
        if (apiResponse?.rowData) {
            const { rowData, footerData } = apiResponse;
            return { rowData, footerData };

        } else {
            return { rowData: [], footerData: {} };
        }

    }, [JSON.stringify(apiResponse)]);



    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    // const [selectedDates, setSelectedDates] = useState([]);
    const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });

    const handleSelection = (selectionType, selection = null) => {
        switch (selectionType) {
            case 'all': {
                if (selectedDates.length === (rowData?.length ? rowData : dummyData ?? [])?.length) {
                    // Deselect all
                    setSelectedRows(prev => ({ ...prev, selectedDates: [] }));
                    // setSelectedRows(prev => ({ ...prev, selectedDates: [] }));
                } else {
                    // Select all dates
                    setSelectedRows(prev => ({ ...prev, selectedDates: [...(rowData?.length ? rowData : dummyData ?? [])] }));
                    // setSelectedRows(prev => ({ ...prev, selectedDates: [...(rowData?.length ? rowData : dummyData ?? [])] }));
                }
                break;
            }

            case 'date': {


                const dateToSelect = (rowData?.length ? rowData : dummyData ?? [])?.find(
                    item => item.date === selection.date
                );

                if (!dateToSelect) return;


                const isDateSelected = selectedDates?.some(
                    selectedDate => selectedDate?.date === dateToSelect?.date
                );


                if (isDateSelected) {

                    setSelectedRows(prev => ({ ...prev, selectedDates: prev.selectedDates.filter(selectedDate => selectedDate.date !== dateToSelect.date) }));

                    // setSelectedRows(prev => ({ ...prev, selectedDates: prev.selectedDates.filter(selectedDate => selectedDate.date !== dateToSelect.date) }));

                } else {
                    setSelectedRows(prev => ({ ...prev, selectedDates: [...prev.selectedDates, dateToSelect] }));
                    // setSelectedRows(prev => ({ ...prev, selectedDates: [...prev.selectedDates, dateToSelect] }));
                }
                break;
            }

            default:
                break;
        }
    };


    // Helper functions
    const isDateSelected = (dateIndex) => {
        const date = (rowData?.length ? rowData : dummyData ?? [])?.[dateIndex]?.date;
        return selectedDates?.some(selectedDate => selectedDate?.date === date);
    };

    const isAllSelected = () => {
        return selectedDates?.length === (rowData?.length ? rowData : dummyData ?? [])?.length && (rowData?.length ? rowData : dummyData ?? [])?.length > 0;
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
        }));
    };

    const getSortedRows = (rows) => {
        if (!sortConfig.key) return rows;

        return [...rows].sort((a, b) => {
            let aValue, bValue;

            if (sortConfig.key === 'platform') {
                aValue = a[sortConfig.key];
                bValue = b[sortConfig.key];
            } else {
                aValue = a[sortConfig.key]?.value || 0;
                bValue = b[sortConfig.key]?.value || 0;
            }

            if (typeof aValue === 'string') {
                const comparison = aValue.localeCompare(bValue);
                return sortConfig.direction === "asc" ? comparison : -comparison;
            }

            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        });
    };
    console.log("sortedConfig", sortConfig)

    const getSortedSections = (sections) => {
        if (!sortConfig.key) return sections;

        // Sort by date
        if (sortConfig.key === "date") {
            return [...sections].sort((a, b) => {
                const aTime = new Date(a.date).getTime();
                const bTime = new Date(b.date).getTime();
                if (isNaN(aTime) || isNaN(bTime)) return 0;

                return sortConfig.direction === "asc"
                    ? aTime - bTime
                    : bTime - aTime;
            });
        }

        // Otherwise return as is
        return sections;
    };

    const getHeaderIcon = (icon) => {
        switch (icon) {
            case "rupee":
                return "₹ ";
            default:
                return (icon) ? icon + " " : "";
        }
    }
    const showValue = (col, value) => {
        return <>{value != undefined && col?.icon ? getHeaderIcon(col?.icon) : ""}{value}{value != undefined && col?.subValue ? col?.subValue : ""}{value != undefined && col?.persentageValue ? "%" : ""}</>

    }

    // const renderCell = (col, metric) => (
    //     <div className="flex items-center justify-center gap-1">
    //         { 
    //             (metric?.value || (metric?.value != undefined && (col?.value == "osa" || col?.value == "price_variation"))) ?
    //                 <div className="flex justify-start">
    //                     <span className="font-medium">{showValue(col, metric?.value)}</span>
    //                     {metric?.value ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.value))) }}><IoMdCopy /></span> : null}
    //                 </div>
    //                 : <>-</>
    //         }

    //         {
    //             metric?.value && metric?.reference ?
    //                 <div className="flex justify-start">
    //                     <span className="text-gray-400 text-xs">{showValue(col, metric?.reference)}</span>
    //                     {metric?.value ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.reference))) }}><IoMdCopy /></span> : null}
    //                 </div>
    //                 : <></>
    //         }


    //         {metric?.value && metric?.reference && metric?.delta
    //             ?

    //             metric?.delta >= 0 ? (
    //                 <span className="text-[#329900] flex items-center gap-1 text-xs px-1 py-0.5 border border-[#B7EB8F] bg-[#E8FFEB] rounded-full">
    //                     <IoMdArrowDropup size={20} /> {showValue(col, metric?.delta)}
    //                     <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.delta))) }}><IoMdCopy /></span>
    //                 </span>
    //             ) : (
    //                 <span className="text-[#DD4242] flex items-center gap-1 text-xs px-1 py-0.5 border bg-[#FFF1F0] border-[#FFA39E] rounded-full">
    //                     <IoMdArrowDropdown size={20} /> {showValue(col, Math.abs(metric?.delta))}
    //                     <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, Math.abs(metric?.delta)))) }}><IoMdCopy /></span>
    //                 </span>
    //             )

    //             :
    //             (<></>)
    //         }
    //     </div>
    // );
     

    const renderCell = (col, metric) => {
    // This variable ensures 0 is treated as a valid value
    const hasValue = metric?.value !== undefined && metric?.value !== null && metric?.value !== "";

    return (
        <div className="flex items-center justify-center gap-1">
            {hasValue ? (
                <div className="flex justify-start">
                    <span className="font-medium">{showValue(col, metric?.value)}</span>
                    {/* FIX: Use hasValue here so '0' shows the copy icon */}
                    <span 
                        className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" 
                        onClick={(e) => copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.value)))}
                    >
                        <IoMdCopy />
                    </span>
                </div>
            ) : (
                <>-</>
            )}

            {/* Reference Logic */}
            {hasValue && metric?.reference !== undefined && metric?.reference !== null ? (
                <div className="flex justify-start">
                    <span className="text-gray-400 text-xs">{showValue(col, metric?.reference)}</span>
                    <span 
                        className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" 
                        onClick={(e) => copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.reference)))}
                    >
                        <IoMdCopy />
                    </span>
                </div>
            ) : null}

            {/* Delta Logic */}
            {hasValue && metric?.reference !== undefined && metric?.delta !== undefined ? (
                metric?.delta >= 0 ? (
                    <span className="text-[#329900] flex items-center gap-1 text-xs px-1 py-0.5 border border-[#B7EB8F] bg-[#E8FFEB] rounded-full">
                        <IoMdArrowDropup size={20} /> {showValue(col, metric?.delta)}
                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.delta)))}><IoMdCopy /></span>
                    </span>
                ) : (
                    <span className="text-[#DD4242] flex items-center gap-1 text-xs px-1 py-0.5 border bg-[#FFF1F0] border-[#FFA39E] rounded-full">
                        <IoMdArrowDropdown size={20} /> {showValue(col, Math.abs(metric?.delta))}
                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => copyToClipboard(e, getTextFromReactNode(showValue(col, Math.abs(metric?.delta))))}><IoMdCopy /></span>
                    </span>
                )
            ) : null}
        </div>
    );
};

    const handleCustomizeClick = () => {
        setCustomizeInfo(prev => ({ isOpen: !prev.isOpen, column: '' }));
    };

    const closeCustomizePopup = () => {
        setCustomizeInfo({ isOpen: false, column: null });
    };

    const getOrderedColumns = () => {
        const orderedColumnConfigs = tabColumnList[selectedTabName] || [];

        if (orderedColumnConfigs.length > 0) {
            const columnsMap = new Map(columns.map(col => [col.value, col]));

            return orderedColumnConfigs.map(config => {
                const existingCol = columnsMap.get(config.key);
                if (existingCol) {
                    return existingCol;
                }
                return {
                    ...config,
                    label: config.title,
                    align: config?.align ?? "center",
                    sortable: true,
                };
            });
        }

        return columns;
    };


    useEffect(() => {
        if (tabColumnList[selectedTabName]?.length > 0) {
            setDefaultFixedColumns(tabColumnList[selectedTabName]);
        }
    }, [tabColumnList, selectedTabName]);


    const orderedColumns = getOrderedColumns();

    // const footerData = {
    //     date: { label: "Total Date", value: "3" },
    //     platform: { label: "Total Platform", value: "15" },
    //     osa: { label: "Average OSA", value: "72%" },
    //     wt_osa: { label: "Average Wgt OSA", value: "56%" },
    //     avg_off_osa: { label: "Average Off take", value: "64%" },
    //     dummy: { label: "Dummy", value: "-" },
    // };
    const [breakdownFilters, setBreakdownFilters] = useState({});
    const selectRowsCount = useRef(0);
    const [loading, setLoading] = useState(false);
    const fetchData = async () => {
        if (!data?.value || !data?.performanceOf) return;
        setLoading(true);
        try {
            const performanceOf = data?.performanceOf ?? 'brand';
            let payload = {
                kpi,
                breakdown: ['date', 'platform'],
                matrix: defaultfixedColumns?.length ? defaultfixedColumns?.filter(column => column?.type == "parameters")?.map(column => column.value) : ['osa', 'wt_osa', 'avg-off-take'],
                key: performanceOf,
                value: data?.value ?? "",
                selectedFilters, filters,
                breakdownFilters,
                selectedTableRows: {
                    selectedDates: selectedRows?.selectedDates?.map(i => i?.date) ?? [],
                    selectedLocation: selectedRows?.selectedLocation?.map(i => i?.location) ?? [],
                    selectedPlatform: selectedRows?.selectedPlatform?.map(i => i?.platform) ?? [],
                    selectedProduct: selectedRows?.selectedProduct?.map(i => i?.skuId) ?? [],
                    selectedKeyword: selectedRows?.selectedKeyword?.map(i => i?.keyword) ?? []
                }
            };

            const response = await fetchPlatformPerformanceData(payload);
            setApiResponse(response);
            setLoading(false);
        } catch (error) {
            console.error("Error in fetchData:", error);
            setLoading(false);
            return;
        }

    }
    useEffect(() => {
        selectRowsCount.current = selectedRows?.selectedDates?.length;
        fetchData();
    }, [JSON.stringify(data), JSON.stringify(selectedFilters), JSON.stringify(defaultfixedColumns), JSON.stringify({ ...selectedRows, selectedDates: (selectRowsCount.current > 0 && selectedRows?.selectedDates?.length == 0) }), JSON.stringify(breakdownFilters)]);


    const selectAllRef = useRef(null);
    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate =
                selectedDates.length > 0 && selectedDates.length < ((rowData?.length ? rowData : dummyData ?? []))?.length;
        }
    }, [selectedDates, ((rowData?.length ? rowData : dummyData ?? []))?.length]);

    const normalizeData = (rowData, defaultfixedColumns) => {
        const flat = [];
        rowData.forEach((section) => {
            const { date, rows } = section;
            rows.forEach((row) => {
                const flatRow = { date, platform: row.platform };

                defaultfixedColumns.forEach((col) => {
                    const key = col.value;

                    // ✅ Skip duplicates
                    if (key === "date" || key === "platform") return;

                    const metric = row[key];

                    if (metric) {
                        flatRow[key] = metric.value ?? "-";
                        if (metric.reference !== undefined) {
                            flatRow[`${key}_reference`] = metric.reference;
                        }
                        if (metric.delta !== undefined) {
                            flatRow[`${key}_delta`] = metric.delta;
                        }
                    } else {
                        flatRow[key] = "-";
                    }
                });

                flat.push(flatRow);
            });
        });
        return flat;
    };
    const handleDownload = async () => {
        const normalized = normalizeData(rowData, defaultfixedColumns);

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Performance Data");

        if (normalized.length > 0) {
            // Start with Date + Platform
            const headers = ["Date", "Platform"];

            defaultfixedColumns.forEach((col) => {
                if (col.value === "date" || col.value === "platform") return; // ✅ skip duplicates

                headers.push(col.title);

                const hasReference = normalized.some((r) => r[`${col.value}_reference`] !== undefined);
                const hasDelta = normalized.some((r) => r[`${col.value}_delta`] !== undefined);

                if (hasReference) headers.push(`${col.title} Pervious`);
                if (hasDelta) headers.push(`${col.title} Delta`);
            });

            worksheet.addRow(headers);

            // Add rows
            normalized.forEach((row) => {
                const values = [row.date, row.platform];

                defaultfixedColumns.forEach((col) => {
                    if (col.value === "date" || col.value === "platform") return;

                    values.push(row[col.value]);
                    if (row[`${col.value}_reference`] !== undefined) values.push(row[`${col.value}_reference`]);
                    if (row[`${col.value}_delta`] !== undefined) values.push(row[`${col.value}_delta`]);
                });

                worksheet.addRow(values);
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `performance_table_${Date.now()}.xlsx`;
        link.click();
    };



    const [searchFilterArray, setSearchFilterArray] = useState(searchFilterArr);
    const [additionalFilter, setAdditionalFilter] = useState([]);
    useEffect(() => {
        const columns = getOrderedColumns();
        // console.log('tabColumnList',tabColumnList,selectedTabName)
        if (_.size(columns)) {
            let additionalFilterObj = [];
            for (const e of columns) {
                if (e?.type == "breakdown") {
                    //    console.log('e.value',e.value)
                    additionalFilterObj.push(e.value);
                }
            }
            setAdditionalFilter(additionalFilterObj)

            const tagFilter = searchFilterArray.find((ele) => ele.key === "metric");
            tagFilter.children = [];
            const updatedArray = searchFilterArray.map((ele) => {
                // console.log('ele.key',ele.key)
                if (ele.key === "metric") {
                    for (const e of columns) {
                        if (e.type == "parameters") {
                            ele.children.push({
                                label: e?.title,
                                key: e?.value,
                                persentageValue: e?.persentageValue ?? false,
                                action: FILTERACTION.METRIC,
                            });
                        }
                    }
                }
                return ele;
            });
            setSearchFilterArray(updatedArray);
        }
    }, [JSON.stringify(tabColumnList?.[selectedTabName])]);
    const applyBreakdownFilters = (sFilters, current) => {
        setBreakdownFilters((prevFilters) => {
            return (current === "clear_filter") ? {} : { ...prevFilters, ...sFilters };
        });
    };
    return (
        <div className='bg-white px-4 py-2 rounded-md mt-4'>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h4 className="font-semibold text-lg">Comprehensive Breakdown</h4>
                    {loading ?
                        <div className="flex items-center justify-center h-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                        </div>
                        : <></>
                    }
                </div>
                <div className="flex items-center gap-2">
                    <ComprehenisiveFilter text="Filter By"
                        savedSearch={{}}
                        arr={searchFilterArray}
                        additionalFilter={additionalFilter}
                        applySearchFilter={applyBreakdownFilters}
                        handleSaveFilters={false} />
                    <div className="graphIconBtnWrap flex gap-2">
                        <button type="button" className="graphIconBtn">
                            <img src="/assets/images/downloadIcon.svg" width={22} height={22} alt="Download" onClick={handleDownload} />
                        </button>
                        <button type="button" className="graphIconBtn" onClick={handleCustomizeClick}>
                            {/* <img src="/assets/images/widget/book.png" className="w-[20px] h-[20px] cursor-pointer" alt="Customize" /> */}
                            <img src="/assets/images/columnsIcon.svg" className="w-[20px] h-[20px] cursor-pointer" alt="Customize" />
                        </button>
                    </div>
                </div>
            </div>
            <p className="font-inter font-normal italic text-[10px] leading-[100%] align-middle text-[#000000A6] mt-[10px]">
                {(selectedFilters?.calendarType == "week") ?
                    <> {moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY")} </>
                    :
                    <>{moment(selectedFilters?.selectedDateRange?.startDate ?? "")?.format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedDateRange?.endDate ?? "")?.format("DD/MM/YYYY")}</>}
            </p>

            <div className="p-4 w-full h-[400px] flex flex-col">
                <div className="overflow-x-auto overflow-y-auto flex-1 relative">
                    <style>
                        {`
                            .sticky-table {
                                border-collapse: separate;
                                border-spacing: 0;
                            }
                            .sticky-header {
                                position: sticky;
                                top: 0;
                                z-index: 20;
                                background: #F6F9FB;
                                border : none;
                            }
                             .sticky-footer {
                                 position: sticky;
                                bottom : 0;
                                z-index: 40;
                                background: #FFFFFF;
                                border: none;
                                box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.08);
                                }
                            .sticky-column-0 {
                                position: sticky;
                                left: 0;
                                z-index: 15;
                                background: inherit;
                                border : none;
                            }
                            .sticky-column-1 {
                                position: sticky;
                                left: 300px;
                                z-index: 15;
                                background: inherit;
                                border : none;
                            }
                            .sticky-column-header-0 {
                                position: sticky;
                                left: 0;
                                z-index: 25 !important;
                                background: #F6F9FB;
                                border : none;
                            }
                            .sticky-column-header-1 {
                                position: sticky;
                                left: 300px;
                                z-index: 25 !important;
                                background: #F6F9FB;
                                border : none;
                            }
                         `}
                    </style>
                    <table className="w-full relative text-sm sticky-table" style={{ minHeight: '400px' }}>
                        <thead>
                            <tr>
                                {orderedColumns.map((col, colIndex) => (
                                    <th
                                        key={col.value}
                                        className={`
                                            p-4 text-sm border-none
                                            cursor-default
                                            first:rounded-l-2xl last:rounded-r-2xl
                                            sticky-header
                                            ${col.align === "left" ? "text-left" : "text-center"}
                                            ${colIndex === 0 ? "sticky-column-header-0" : ""}
                                            ${colIndex === 1 ? "sticky-column-header-1" : ""}
                                        `}
                                        style={{
                                            width: colIndex < 2 ? '300px' : 'auto',
                                            minWidth: colIndex < 2 ? '300px' : 'auto'
                                        }}
                                    >
                                        <div className={`cursor-default flex items-center  ${col.align === "left" ? "justify-start" :
                                            col.align === "right" ? "justify-end" :
                                                col.align === "between" ? "gap-8" : "justify-center"
                                            }`}>
                                            {col.checkbox && (
                                                <input

                                                    ref={selectAllRef}
                                                    type="checkbox"
                                                    checked={isAllSelected()}
                                                    onChange={() => handleSelection('all')}
                                                />
                                            )}
                                            <span
                                                onClick={col.sortable ? () => handleSort(col.value) : undefined}
                                                className={`${col.sortable ? "cursor-pointer" : ""}`}
                                            >
                                                <span>{col.label}</span>
                                                {col.sortable && <FaSort className="inline h-3 w-3" />}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {getSortedSections((rowData?.length ? rowData : dummyData ?? [])).map((section, dateIndex) => (
                                <React.Fragment key={dateIndex}>
                                    {getSortedRows(section?.rows ?? [])?.map((row, rowIndex) => {
                                        const isDateSelectedFlag = isDateSelected(dateIndex);
                                        const isStriped = dateIndex % 2 === 0 ? "white" : "#F9FAFA";
                                        return (
                                            <tr
                                                key={`${dateIndex}-${rowIndex}`}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            // onClick={() => handleSelection('date', section)}
                                            >

                                                {orderedColumns.map((col, colIndex) => {
                                                    // For date column, only render in first row with rowSpan
                                                    if (col.value === "date") {
                                                        return rowIndex === 0 ? (
                                                            <td
                                                                key={`${dateIndex}-${rowIndex}-${col.value}`}
                                                                className={`group px-4 py-2 text-center align-middle border-none 
                                                                     ${colIndex === 0 ? "sticky-column-0" : ""}
                                                                     ${colIndex === 1 ? "sticky-column-1" : ""}
                                                                    `}
                                                                rowSpan={section?.rows?.length}
                                                                style={{
                                                                    background: isDateSelectedFlag ? "#f2f8ff" : isStriped,
                                                                    borderTopLeftRadius: "12px",
                                                                    borderBottomLeftRadius: "12px",
                                                                    width: colIndex < 2 ? '300px' : 'auto',
                                                                    minWidth: colIndex < 2 ? '300px' : 'auto',
                                                                }}
                                                            >
                                                                <div className="flex items-center justify-start gap-8">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isDateSelectedFlag}
                                                                        onChange={(e) => {
                                                                            e.stopPropagation();
                                                                            handleSelection('date', section);
                                                                        }}
                                                                    />
                                                                    <span>{section?.date ? moment(new Date(section?.date))?.format("DD-MM-YYYY") : ""}
                                                                        {section?.date && <span className="inline-block cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(moment(new Date(section?.date))?.format("DD-MM-YYYY"))) }}><IoMdCopy /></span>}
                                                                    </span>
                                                                    {/* {
                                                                        section?.date &&
                                                                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(moment(new Date(section?.date))?.format("DD-MM-YYYY"))) }}><IoMdCopy/></span>
                                                                    } */}
                                                                </div>
                                                            </td>
                                                        ) : null;
                                                    }

                                                    // For non-date columns
                                                    return (
                                                        <td
                                                            key={`${dateIndex}-${rowIndex}-${col.value}`}
                                                            className={`group 
                                                            px-4 py-2 border-none
                                                            ${col.align === "left" ? "text-left" :
                                                                    col.align === "right" ? "text-right" : "text-center"}
                                                            ${colIndex === 0 ? "sticky-column-0" : ""}
                                                            ${colIndex === 1 ? "sticky-column-1" : ""}
                                                        `}
                                                            style={{
                                                                background: isDateSelectedFlag ? "#f2f8ff" : isStriped,
                                                                width: colIndex < 2 ? '150px' : 'auto',
                                                                minWidth: colIndex < 2 ? '150px' : 'auto',
                                                            }}
                                                        >
                                                            {col.value === "platform" ?
                                                                <div className="flex justify-start">
                                                                    <span className="flex items-center gap-2">
                                                                        {pf_images?.[row?.[col.value]?.toLowerCase()] ? <img
                                                                            src={pf_images?.[row?.[col.value]?.toLowerCase()]}
                                                                            alt={row?.[col.value]}
                                                                            className="oos-plat-img max-w-8 max-h-8 object-contain"
                                                                        /> : <></>}
                                                                        {(row?.[col.value] ?? row.platform)}
                                                                    </span>
                                                                    <span className="inline-block cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(row?.[col.value] ?? row.platform)) }}><IoMdCopy /></span>
                                                                </div>
                                                                :
                                                                col.value && renderCell(col, (row?.[col.value] ?? null))
                                                            }
                                                            {/* {col.value === "dummy" && (row?.[col.value] ?? row.dummy)}
                                                            {col.value === "osa" && renderCell(row?.[col.value] ?? row.osa)}
                                                            {col.value === "wt_osa" && renderCell(row?.[col.value] ?? row.wt_osa)}
                                                            {col.value === "avg_off_osa" && renderCell(row?.[col.value] ?? row.avg_offtake_osa)} */}

                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </tbody>
                        <tfoot className="sticky-footer">
                            <tr >
                                {orderedColumns.map((col, colIndex) => {
                                    const summary = footerData?.[col?.value];
                                    return (
                                        <td
                                            key={col.value}
                                            className={`group 
                                                px-4 py-2 border-none
                                                ${colIndex === 0 ? "sticky-column-0" : ""}
                                                ${colIndex === 1 ? "sticky-column-1" : ""}
                                                `}
                                            style={{
                                                width: colIndex < 2 ? "300px" : "auto",
                                                minWidth: colIndex < 2 ? "300px" : "auto",
                                                background: "#FFFFFF",
                                            }}
                                        >
                                            {/* <span>{col?.label ?? summary?.label}</span> */}
                                            <div
                                                key={col?.value}
                                                className={`font-normal text-md  flex flex-col 
                                                    ${col.align === "left" ? "items-start" :
                                                        col.align === "right" ? "items-right" :
                                                            col.align === "between" ? "px-10" : "items-center"}
                                                        `}
                                            >
                                                <span>{(col?.type == "parameters") ? "Avg" : "Total"} {col?.label ?? summary?.label}</span>
                                                <p className="font-semibold text-lg flex flex-start">
                                                    {summary?.value ? renderCell(col, summary) : "-"}
                                                </p>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* <div className="sticky bottom-0 !bg-[#FFFFFF] flex justify-between mt-2 p-2 text-xs text-gray-600 z-10">
                    {orderedColumns.map((col) => {
                        const summary = footerData?.[col?.value];
                        return (
                            <div
                                key={col?.value}
                                className="w-full flex flex-col items-center font-normal text-md"
                            >
                                <span>{summary?.label || col?.label}</span>
                                <p className="font-semibold text-lg">{summary?.value || "-"}</p>
                            </div>
                        );
                    })}
                </div> */}
            </div>
            {customizeInfo.isOpen && (
                <CustomizeCampiagnModal

                    isWidget={true}
                    kpi={kpi}
                    selectedTabName={selectedTabName}
                    closePopup={closeCustomizePopup}
                    tabColumnList={tabColumnList}
                    setTabColumnList={setTabColumnList}
                    isSaveViewVisible={false}
                    columnVisible="ds"
                    fixedColumns={defaultfixedColumns}
                    dummyColumnGroup={[
                        //     ...(kpicol ?? []),
                        //     {
                        //         percentageValue: false,
                        //         title: "Dummy",
                        //         type: "parameters",
                        //         value: "dummy",
                        //         key: "dummy",
                        //         kpi: [],
                        //         allowKPI: ["OSA", "CS", "PRO", "RR", ""],
                        //         notAllowWithIsValueIn: [],
                        //         allowWithIsValueIn: [],
                        //         isDisabled: false
                        //     },
                        //     {
                        //         percentageValue: false,
                        //         title: "Dummy1",
                        //         type: "parameters",
                        //         value: "dummy1",
                        //         key: "dummy1",
                        //         kpi: [],
                        //         allowKPI: ["OSA", "CS", "PRO", "RR", ""],
                        //         notAllowWithIsValueIn: [],
                        //         allowWithIsValueIn: [],
                        //         isDisabled: false
                        //     },
                        //     {
                        //         percentageValue: false,
                        //         title: "Dummy 2",
                        //         type: "parameters",
                        //         value: "dummy2",
                        //         key: "dummy2",
                        //         kpi: [],
                        //         allowKPI: ["OSA", "CS", "PRO", "RR", ""],
                        //         notAllowWithIsValueIn: [],
                        //         allowWithIsValueIn: [],
                        //         isDisabled: false
                        //     },
                        //     {
                        //         percentageValue: false,
                        //         title: "Dummy 3",
                        //         type: "parameters",
                        //         value: "dummy3",
                        //         key: "dummy3",
                        //         kpi: [],
                        //         allowKPI: ["OSA", "CS", "PRO", "RR", ""],
                        //         notAllowWithIsValueIn: [],
                        //         allowWithIsValueIn: [],
                        //         isDisabled: false
                        //     },
                        //     {
                        //         percentageValue: false,
                        //         title: "Dummy 6",
                        //         type: "parameters",
                        //         value: "dummy6",
                        //         key: "dummy6",
                        //         kpi: [],
                        //         allowKPI: ["OSA", "CS", "PRO", "RR", ""],
                        //         notAllowWithIsValueIn: [],
                        //         allowWithIsValueIn: [],
                        //         isDisabled: false
                        //     },
                        //     {
                        //         percentageValue: false,
                        //         title: "Dummy 4",
                        //         type: "parameters",
                        //         value: "dummy4",
                        //         key: "dummy4",
                        //         kpi: [],
                        //         allowKPI: ["OSA", "CS", "PRO", "RR", ""],
                        //         notAllowWithIsValueIn: [],
                        //         allowWithIsValueIn: [],
                        //         isDisabled: false
                        //     },
                        //     {
                        //         percentageValue: false,
                        //         title: "Dummy 5",
                        //         type: "parameters",
                        //         value: "dummy5",
                        //         key: "dummy5",
                        //         kpi: [],
                        //         allowKPI: ["OSA", "CS", "PRO", "RR", ""],
                        //         notAllowWithIsValueIn: [],
                        //         allowWithIsValueIn: [],
                        //         isDisabled: false
                        //     },
                    ]
                    }
                />
            )}
        </div>
    );
};


// const getOrderedColumns = () => {
//     if (tabColumnList[selectedTabName]?.length > 0) {
//         const orderedColumnConfigs = tabColumnList[selectedTabName];

//         const columnsMap = new Map(columns.map(col => [col.value, col]));

//         // Process the ordered column configurations
//         const resultColumns = [];

//         orderedColumnConfigs.forEach(columnConfig => {
//             const keyValue = columnConfig.key;
//             let column = columnsMap.get(keyValue);

//             if (!column) {
//                 column = {
//                     key: keyValue,
//                     label: columnConfig.title,
//                     align: "center",
//                     sortable: true,
//                 };
//             }

//             resultColumns.push(column);
//             columnsMap.delete(keyValue);
//         });

//         columns.forEach(col => {
//             if (columnsMap.has(col.value)) {
//                 resultColumns.push(col);
//             }
//         });

//         return resultColumns;
//     }
//     return columns;
// };

// const PerformanceTable1 = () => {
//     const dummyData = [
//         {
//             date: "01-09-2025",
//             rows: [
//                 { platform: "All", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
//                 { platform: "Amazon", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
//                 { platform: "Zepto", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
//                 { platform: "Blinkit", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
//                 { platform: "Flipkart", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
//             ],
//         },
//         {
//             date: "02-09-2025",
//             rows: [
//                 { platform: "All", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
//                 { platform: "Amazon", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
//                 { platform: "Zepto", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
//                 { platform: "Blinkit", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
//                 { platform: "Flipkart", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
//             ],
//         },
//         {
//             date: "03-09-2025",
//             rows: [
//                 { platform: "All", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
//                 { platform: "Amazon", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
//                 { platform: "Zepto", osa: { value: 80, delta: -5 }, wt_osa: { value: 80, delta: -5 }, avg_offtake_osa: { value: 80, delta: -5 } },
//                 { platform: "Blinkit", osa: { value: 75, delta: 15 }, wt_osa: { value: 75, delta: 15 }, avg_offtake_osa: { value: 75, delta: 15 } },
//             ],
//         },
//     ];

//     const columns = [
//         {
//             key: "date",
//             label: "Date",
//             align: "between",
//             checkbox: true,
//             sortable: true,
//         },
//         {
//             key: "platform",
//             label: "Platform",
//             align: "left",
//             sortable: true,
//         },
//         {
//             key: "osa",
//             label: "Avg OSA",
//             align: "center",
//             sortable: true,
//         },
//         {
//             key: "wt_osa",
//             label: "Wt OSA",
//             align: "center",
//             sortable: true,
//         },
//         {
//             key: "avg_offtake_osa",
//             label: "Avg Off take",
//             align: "center",
//             sortable: true,
//         },
//     ];

//     const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//     const [selectedRows, setSelectedRows] = useState([]);
//     const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });
//     const [tabColumnList, setTabColumnList] = useState({});
//     const [selectedTabName,] = useState('');

//     const handleCustomizeClick = () => {
//         setCustomizeInfo((per) => ({ isOpen: !per.isOpen, column: selectedTabName }));
//     };
//     const closeCustomizePopup = () => {
//         setCustomizeInfo({ isOpen: false, column: null });
//     };

//     const isRowSelected = (dateIndex, rowIndex) => {
//         return selectedRows.some(row =>
//             row.dateIndex === dateIndex && row.rowIndex === rowIndex
//         );
//     };

//     const handleHeaderCheckboxClick = () => {
//         if (selectedRows.length === getAllRows().length) {
//             // If all rows are already selected, deselect all
//             setSelectedRows([]);
//         } else {
//             // Select all rows with full object data
//             const allRowsWithData = getAllRowsWithData();
//             setSelectedRows(allRowsWithData);
//         }
//     };

//     const getAllRows = () => {
//         const allRows = [];
//         dummyData.forEach((section, dateIndex) => {
//             section.rows.forEach((row, rowIndex) => {
//                 allRows.push({ dateIndex, rowIndex });
//             });
//         });
//         return allRows;
//     };

//     const getAllRowsWithData = () => {
//         const allRows = [];
//         dummyData.forEach((section, dateIndex) => {
//             section.rows.forEach((row, rowIndex) => {
//                 allRows.push({
//                     dateIndex,
//                     rowIndex,
//                     date: section.date,
//                     platform: row.platform,
//                     osa: row.osa,
//                     wt_osa: row.wt_osa,
//                     avg_offtake_osa: row.avg_offtake_osa
//                 });
//             });
//         });
//         return allRows;
//     };



//     const handleRowClick = (dateIndex, rowIndex) => {
//         const rowData = {
//             dateIndex,
//             rowIndex,
//             date: dummyData[dateIndex].date,
//             platform: dummyData[dateIndex].rows[rowIndex].platform,
//             osa: dummyData[dateIndex].rows[rowIndex].osa,
//             wt_osa: dummyData[dateIndex].rows[rowIndex].wt_osa,
//             avg_offtake_osa: dummyData[dateIndex].rows[rowIndex].avg_offtake_osa
//         };

//         if (isRowSelected(dateIndex, rowIndex)) {
//             // Deselect row if already selected
//             setSelectedRows(selectedRows.filter(row =>
//                 !(row.dateIndex === dateIndex && row.rowIndex === rowIndex)
//             ));
//         } else {
//             // Select row with full data
//             setSelectedRows([...selectedRows, rowData]);
//         }
//     };

//     const handleSort = (key) => {
//         let direction = "asc";
//         if (sortConfig.key === key && sortConfig.direction === "asc") {
//             direction = "desc";
//         }
//         setSortConfig({ key, direction });
//     };


//     const getSortedRows = (rows) => {
//         if (!sortConfig.key) return rows;

//         return [...rows].sort((a, b) => {
//             let aValue, bValue;

//             // Get values for comparison based on column type
//             if (sortConfig.key === 'platform') {
//                 aValue = a[sortConfig.key];
//                 bValue = b[sortConfig.key];
//             } else {
//                 aValue = a[sortConfig.key]?.value || 0;
//                 bValue = b[sortConfig.key]?.value || 0;
//             }

//             // Handle string comparison
//             if (typeof aValue === 'string') {
//                 const comparison = aValue.localeCompare(bValue);
//                 return sortConfig.direction === "asc" ? comparison : -comparison;
//             }

//             // Handle number comparison
//             if (aValue < bValue) {
//                 return sortConfig.direction === "asc" ? -1 : 1;
//             }
//             if (aValue > bValue) {
//                 return sortConfig.direction === "asc" ? 1 : -1;
//             }
//             return 0;
//         });
//     };


//     const renderCell = (metric) => (
//         <div className="flex items-center justify-center gap-1">
//             <span>{metric.value}%</span>
//             {metric.delta > 0 ? (
//                 <span className="text-[#329900] flex items-center text-xs  px-1 py-0.5 border border-[#B7EB8F] rounded-full">
//                     <IoMdArrowDropup size={20} />  {metric.delta}%
//                 </span>
//             ) : (
//                 <span className="text-[#DD4242] flex items-center text-xs  px-1 py-0.5 border border-[#FFA39E] rounded-full">
//                     <IoMdArrowDropdown size={20} /> {Math.abs(metric.delta)}%
//                 </span>
//             )}
//         </div>
//     );
//     const isDateSelected = (dateIndex) => {
//         const dateRows = dummyData[dateIndex].rows;
//         return dateRows.every((_, rowIndex) =>
//             isRowSelected(dateIndex, rowIndex)
//         );
//     };

//     const isDatePartiallySelected = (dateIndex) => {
//         const dateRows = dummyData[dateIndex].rows;
//         return dateRows.some((_, rowIndex) =>
//             isRowSelected(dateIndex, rowIndex)
//         ) && !isDateSelected(dateIndex);
//     };

//     const handleDateCheckboxClick = (dateIndex, e) => {
//         e.stopPropagation();

//         const dateSection = dummyData[dateIndex];
//         if (isDateSelected(dateIndex)) {
//             setSelectedRows(selectedRows.filter(row =>
//                 row.dateIndex !== dateIndex
//             ));
//         } else {
//             const newSelectedRows = dateSection.rows.map((row, rowIndex) => ({
//                 dateIndex,
//                 rowIndex,
//                 date: dateSection.date,
//                 platform: row.platform,
//                 osa: row.osa,
//                 wt_osa: row.wt_osa,
//                 avg_offtake_osa: row.avg_offtake_osa
//             }));

//             const filteredRows = selectedRows.filter(row => row.dateIndex !== dateIndex);
//             setSelectedRows([...filteredRows, ...newSelectedRows]);
//         }
//     };
//     console.log("selectedRows", selectedRows);
//     return (
//         <div className='bg-white px-4 py-2 rounded-md mt-4'>
//             <div className="flex  items-center justify-between">
//                 <h4 className="font-semibold">Comprehensive Breakdown </h4>
//                 <div className="flex items-center gap-2">
//                     <div>
//                         <ComprehenisiveFilter text="Filter By" />
//                     </div>
//                     <div className="graphIconBtnWrap flex gap-2">
//                         <button
//                             type="button"
//                             className="graphIconBtn"
//                         >
//                             <img
//                                 src="/assets/images/downloadIcon.svg"
//                                 width={22}
//                                 height={22}
//                             />
//                         </button>
//                         <button type="button" className="graphIconBtn" onClick={() => handleCustomizeClick()}>
//                             <img
//                                 src="/assets/images/widget/book.png"
//                                 className="w-[20px] h-[20px] cursor-pointer"
//                                 alt
//                             />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             <div className="p-4 w-full h-[400px] flex flex-col">
//                 <div className="overflow-y-auto flex-1">
//                     <table className="w-full relative text-sm border-separate border-spacing-0">
//                         <thead className="sticky top-0 !bg-[#F6F9FB] rounded-2xl text-gray-600 z-10 overflow-hidden">
//                             <tr>
//                                 {columns.map((col) => (
//                                     <th
//                                         key={col.value}
//                                         onClick={col.sortable ? () => handleSort(col.value) : undefined}
//                                         className={`
//                                         p-4 text-sm border-none
//                                         fist:rounded-l-2xl last:rounded-r-2xl
//                                         ${col.sortable ? "cursor-pointer" : ""}
//                                         ${col.align === "left" ? "text-left" : "text-center"}
//                                         `}
//                                     >
//                                         <div
//                                             className={`flex items-center gap-2 ${col.align === "left"
//                                                 ? "justify-start"
//                                                 : col.align === "right"
//                                                     ? "justify-end" : col.align === "between" ? "justify-between"
//                                                         : "justify-center"
//                                                 }`}
//                                         >
//                                             {col.checkbox && <input
//                                                 type="checkbox"
//                                                 checked={selectedRows.length === getAllRows().length && getAllRows().length > 0}
//                                                 onChange={handleHeaderCheckboxClick}
//                                             />}
//                                             <span>{col.label}</span>
//                                             {col.sortable && <FaSort className="inline h-3 w-3" />}
//                                         </div>
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {dummyData.map((section, dateIndex) => (
//                                 <>
//                                     {getSortedRows(section.rows).map((row, rowIndex) => {
//                                         const isSelected = isRowSelected(dateIndex, rowIndex);
//                                         return (
//                                             <tr
//                                                 key={`${dateIndex}-${rowIndex}`}
//                                                 style={{
//                                                     background: isSelected ? "#0081F70F" : "white",
//                                                     cursor: "pointer"
//                                                 }}
//                                                 onClick={() => handleRowClick(dateIndex, rowIndex)}
//                                             >
//                                                 {rowIndex === 0 && (
//                                                     <td
//                                                         className="p-2 text-center align-middle border-none"
//                                                         rowSpan={section.rows.length}
//                                                         style={{ background: isSelected ? "#0081F70F" : "white" }}
//                                                     >
//                                                         <div className="flex items-center justify-start gap-8">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 checked={isDateSelected(dateIndex)}
//                                                                 ref={(el) => {
//                                                                     if (el) {
//                                                                         el.indeterminate = isDatePartiallySelected(dateIndex);
//                                                                     }
//                                                                 }}
//                                                                 onChange={(e) => handleDateCheckboxClick(dateIndex, e)}
//                                                             />
//                                                             <span>{section.date}</span>
//                                                         </div>
//                                                     </td>
//                                                 )}
//                                                 <td
//                                                     className="p-2 border-none"
//                                                     style={{ background: isSelected ? "#0081F70F" : "white" }}
//                                                 >
//                                                     <div className="flex items-center gap-2">
//                                                         {/* <input
//                                                             type="checkbox"
//                                                             checked={isSelected}
//                                                             onChange={(e) => handleRowCheckboxClick(dateIndex, rowIndex, e)}
//                                                         /> */}
//                                                         {row.platform}
//                                                     </div>
//                                                 </td>
//                                                 <td
//                                                     className="p-2 text-center border-none"
//                                                     style={{ background: isSelected ? "#0081F70F" : "white" }}
//                                                 >
//                                                     {renderCell(row.osa)}
//                                                 </td>
//                                                 <td
//                                                     className="p-2 text-center border-none"
//                                                     style={{ background: isSelected ? "#0081F70F" : "white" }}
//                                                 >
//                                                     {renderCell(row.wt_osa)}
//                                                 </td>
//                                                 <td
//                                                     className="p-2 text-center border-none"
//                                                     style={{ background: isSelected ? "#0081F70F" : "white" }}
//                                                 >
//                                                     {renderCell(row.avg_offtake_osa)}
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* sticky footer */}
//                 <div className="sticky bottom-0 !bg-[#FFFFFF] flex justify-between mt-2 p-2 text-xs text-gray-600 z-10 ">
//                     <div className=" w-full flex flex-col items-center font-normal text-md">Total Date
//                         <p className="font-semibold text-lg">1</p>
//                     </div>
//                     <div className=" w-full flex flex-col items-center font-normal text-md">Total Platform
//                         <p className="font-semibold text-lg">5</p>
//                     </div>
//                     <div className=" w-full flex flex-col items-center font-normal text-md">Average OSA
//                         <p className="font-semibold text-lg">40%</p>
//                     </div>
//                     <div className=" w-full flex flex-col items-center font-normal text-md">Average Wgt OSA
//                         <p className="font-semibold text-lg">40%</p>
//                     </div>
//                     <div className=" w-full flex flex-col items-center font-normal text-md">Average Off take
//                         <p className="font-semibold text-lg">40%</p>
//                     </div>
//                 </div>
//             </div>
//             {customizeInfo.isOpen && (
//                 <CustomizeCampiagnModal closePopup={closeCustomizePopup} tabColumnList={tabColumnList} setTabColumnList={setTabColumnList} isSaveViewVisible={false} columnVisible="ds" />
//             )}
//         </div>
//     );
// };


export default DailyPerformance