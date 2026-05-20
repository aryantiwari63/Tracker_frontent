import React, { useRef, useMemo, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { fetchSOSAnalysisData } from "./services/service";
import { useEbuxContext } from "../../Context/EbuxProvider";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import Loader from "../../common-components/Loader";

const isShowDummyData = false;
const chartData = (!isShowDummyData) ? [] : [
    { brand: "Nescafe", value: 68, reference: 10, delta: -3 },
    { brand: "Bru", value: 30, reference: 28, delta: 2 },
    { brand: "Tata Coffee Grand", value: 65, reference: 60, delta: 5 },
    { brand: "Rage Coffee", value: 40, reference: 42, delta: -2 },
    { brand: "Sleepy Owl", value: 25, reference: 30, delta: -5 },
    { brand: "Blue Tokai", value: 55, reference: 50, delta: 5 },
    { brand: "Starbucks", value: 20, reference: 25, delta: -5 },
    { brand: "Davidoff Café", value: 50, reference: 55, delta: -5 },
    { brand: "Colombian Brew", value: 60, reference: 58, delta: 2 }
];
const SosGraphicalAnalysis = forwardRef(({ selectedOption, currentView = null, type, optionType, activeIndex, setActiveIndex }, ref) => {

    const {
        selectedFilters,
        filters

    } = useEbuxContext();
    // const kpicol = (clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => ((i?.allowKPI?.indexOf(kpi) > -1) && (!i?.value?.includes("competition_"))&&(["previous_osa","last_month_sale"]?.indexOf(i?.key)==-1)))?.map(i => ({ ...i, label: i?.title, id: i?.value, checked: i?.kpi?.indexOf(kpi) > -1, disabled: i?.isDisabled })));
    //  const optionType =  useMemo(()=>{const col_data= Object.fromEntries(kpicol.map(col => [col.value, col])); setType(Object.keys(col_data)?.[0]??"sos"); return col_data; },[kpicol]);

    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const dataSource = rowData?.length ? rowData : chartData;
    useEffect(() => {
        if (!chartRef.current || !activeIndex || !dataSource?.length) return;

        const echartsInstance = chartRef.current.getEchartsInstance();
        const index = dataSource.findIndex(d => (d?.name ?? d?.brand) === activeIndex);

        if (index >= 0) {
            const total = dataSource.length;
            const windowSize = Math.max(5, Math.ceil(total * 0.4)); // Show at least 5 bars, up to 40% of all
            let start = Math.max(0, index - Math.floor(windowSize / 2));
            let end = Math.min(total, start + windowSize);

            echartsInstance.dispatchAction({
                type: "dataZoom",
                // xAxisIndex is 0 because you have single xAxis
                dataZoomIndex: 0,
                startValue: start,
                endValue: end - 1
            });
        }
    }, [activeIndex, dataSource]);
    const fetchData = async () => {
        if (!currentView) return;
        setLoading(true);
        const performanceOf = currentView ?? 'brand';
        // eslint-disable-next-line no-unused-vars
        let payload = {
            matrix: [type],
            sos_type: selectedOption,
            breakdown: performanceOf,
            // value: data?.value ?? "",
            selectedFilters,
            filters
        };

        const response = await fetchSOSAnalysisData(payload);
        if (response?.rowData) {
            const index = (response?.rowData ?? []).findIndex(d => (d?.name ?? d?.brand) === activeIndex);
            if (index == -1) {
                setActiveIndex(response?.rowData?.[0]?.name ?? null);
            }
            setRowData(response?.rowData ?? []);
            setLoading(false);
        } else {
            setActiveIndex(null);

            setRowData([]);

        }
    }
    useEffect(() => {
        fetchData();
    }, [currentView, selectedOption, type, JSON.stringify({ ...selectedFilters, selected_sos_type: "" })]);

    const chartRef = useRef(null);
    useImperativeHandle(ref, () => ({
        downloadImage: () => {

            if (!chartRef.current) return;
            const echartsInstance = chartRef.current.getEchartsInstance();
            // const option = echartsInstance.getOption();
            // const dz = option.dataZoom?.[0];
            // const startValue = dz?.startValue;
            // const endValue = dz?.endValue;
            // echartsInstance.dispatchAction({
            //         type: "dataZoom",
            //         start: currentZoom.start,
            //         end: currentZoom.end,
            //     });
            // echartsInstance.resize();

            // echartsInstance.setOption({
            //     title: { show: false },
            //     grid: { top: "8%" },
            // });
            const imgData = echartsInstance.getDataURL({
                type: "png",
                pixelRatio: 2,
                backgroundColor: "#fff",

                excludeComponents: ["dataZoom"],
            });

            const link = document.createElement("a");
            link.href = imgData;
            link.download = "chart-image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            const index = dataSource.findIndex(d => (d?.name ?? d?.brand) === activeIndex);

            if (index >= 0) {
                const total = dataSource.length;
                const windowSize = Math.max(5, Math.ceil(total * 0.4)); // Show at least 5 bars, up to 40% of all
                let start = Math.max(0, index - Math.floor(windowSize / 2));
                let end = Math.min(total, start + windowSize);

                echartsInstance.dispatchAction({
                    type: "dataZoom",
                    // xAxisIndex is 0 because you have single xAxis
                    dataZoomIndex: 0,
                    startValue: start,
                    endValue: end - 1
                });
            }
            // echartsInstance.setOption({
            //     title: { show: false },
            //     grid: { top: "6%" },
            // });
        }

    }));

    const option = useMemo(() => {
        return {
            // title: {
            //     text: `${selectedOption ?? ""} ${optionType?.[type]?.label ?? ""} Analysis`,
            //     left: "center",
            //     top: 0,
            //     textStyle: {
            //         fontSize: 16,
            //         fontWeight: 600,
            //         color: "#000000D9",
            //     },
            // },
            grid: {
                left: "6%",
                right: "6%",
                bottom: "12%",
                top: "8%",
                containLabel: true
            },
            xAxis: {
                type: "category",
                data: (dataSource)?.map((d) => (d?.name ?? d?.brand)),
                axisLabel: {
                    color: "#666",
                    fontSize: 12,
                    margin: 10,
                    interval: 0,
                },
                axisLine: { show: false },
                axisTick: { show: false },
                name: currentView,
                nameLocation: "middle",
                nameGap: 50,
                nameTextStyle: { fontSize: 16, color: "#000000D9" }
            },
            yAxis: {
                type: "value",
                max: optionType?.[type]?.persentageValue ? 100 : function (value) {
                    // return value.max + 2;
                    return value.max;
                },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: {
                    lineStyle: { color: "#eee" }
                },
                axisLabel: {
                    formatter: `{value} ${optionType?.[type]?.persentageValue ? "%" : ""}`,
                    color: "#666"
                },
                name: `${selectedOption} ${optionType?.[type]?.label}`,
                nameLocation: "middle",
                nameGap: 50,
                nameTextStyle: { fontSize: 16, color: "#000000D9" }
            },
            dataZoom: [
                {
                    type: "slider",
                    show: true,
                    xAxisIndex: 0,
                    start: 0,   // % range to start
                    end: (7 / (dataSource)?.length) * 100,    // initially show ~60% of brands
                    height: 20,
                    bottom: 30,
                    showDetail: false,  // 👈 disables tooltip on handle hover
                },
                {
                    type: "inside", // zoom with mousewheel / touch
                    xAxisIndex: 0,
                    zoomOnMouseWheel: false,
                    moveOnMouseWheel: true
                }
            ],
            tooltip: {
                trigger: "item",
                backgroundColor: "#0B0D21",
                borderColor: "#2A2D4A",
                borderWidth: 1,
                borderRadius: 8,
                padding: [12, 15],
                textStyle: { color: "#fff" },
                formatter: (params) => {
                    const d = (dataSource)?.[params?.dataIndex];

                    const getHeaderIcon = (icon) => {
                        switch (icon) {
                            case "rupee":
                                return "₹ ";
                            default:
                                return (icon) ? icon + " " : "";
                        }
                    }
                    const showValue = (col, value) => {
                        return `${value != undefined && col?.icon ? getHeaderIcon(col?.icon) : ""}${value}${value != undefined && col?.subValue ? col?.subValue : ""}${value != undefined && col?.persentageValue ? "%" : ""}`

                    }
                    const arrow =
                        d?.[type]?.delta >= 0
                            ? `<span style="color:#4CAF50;">↑ ${showValue(optionType?.[type], d?.[type]?.delta ?? d?.delta)}</span>`
                            : `<span style="color:#FF5A5A;">↓ ${showValue(optionType?.[type], Math.abs(d?.[type]?.delta ?? d.delta))}</span>`;


                    return `                
              <div style="font-size:14px;margin-bottom:6px;font-weight:600;">
                ${d?.name ?? d.brand}
              </div>
              <div style="font-size:12px;display:flex;align-items:center;gap:8px;">
                <span>${selectedOption} ${optionType?.[type]?.label}</span> 
                ${d?.[type]?.value ?? d?.value ? (`<span style="font-size:18px;font-weight:bold;">${showValue(optionType?.[type], d?.[type]?.value ?? d?.value)}</span>`) : ""}            
                ${d?.[type]?.reference ?? d?.reference ? (`<span style="color:#999;font-size:12px;">${showValue(optionType?.[type], d?.[type]?.reference ?? d?.reference)}</span>`) : ""}            
                ${((d?.[type]?.reference ?? d?.reference) && (d?.[type]?.delta ?? d?.delta)) ? (`<span style="font-size:12px;background:#fff3f3;padding:2px 6px;border-radius:6px;">
                  ${arrow}
                </span>`) : ""}            
                
                
              </div>
            `;
                }
            },
            series: [
                {
                    type: "bar",
                    stack: "total",
                    data: (dataSource)?.map((d) => {

                        const key = d?.name ?? d?.brand;
                        const isActive = activeIndex === key;
                        return {
                            name: key,
                            value: d?.[type]?.value ?? d?.value,
                            itemStyle: {
                                borderRadius: [30, 30, 0, 0],
                                color: {
                                    type: "linear",
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: "#05aaf6ff" },
                                        { offset: 1, color: "#0573d9ff" }
                                    ]
                                },
                                shadowColor: isActive ? "rgba(0,0,0,0.5)" : "transparent",
                                shadowBlur: isActive ? 15 : 0,
                                shadowOffsetX: isActive ? 5 : 0,
                                shadowOffsetY: isActive ? 5 : 0,

                                borderColor: isActive ? "#001F5B" : "transparent",
                                borderWidth: isActive ? 3 : 0,


                            },
                            showBackground: true,
                            backgroundStyle: {
                                color: "#eee",
                                borderRadius: [30, 30, 0, 0],
                                shadowColor: isActive ? "rgba(0,0,0,0.25)" : "transparent",
                                shadowBlur: isActive ? 18 : 0,
                                shadowOffsetX: isActive ? 3 : 0,
                                shadowOffsetY: isActive ? 3 : 0,
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowColor: "rgba(0,0,0,0.4)",
                                    shadowBlur: 18,
                                    shadowOffsetX: 5,
                                    shadowOffsetY: 5,
                                }
                            }
                        }
                    }),
                    barWidth: 45,
                    showBackground: true,
                    backgroundStyle: {
                        color: "#eee",
                        borderRadius: [30, 30, 0, 0],
                        // shadowColor: idx==0?"rgba(0,0,0,0.25)":"transparent",
                        // shadowBlur: idx==0?18:0,
                        // shadowOffsetX: idx==0?3:0,
                        // shadowOffsetY: idx==0?3:0,
                    }

                },

            ]
        }
    }, [JSON.stringify(activeIndex), selectedOption, currentView, JSON.stringify(dataSource), JSON.stringify(optionType), type]);

    const onEvents = {
        click: (params) => {
            const d = (dataSource)?.[params?.dataIndex];


            setActiveIndex((d?.name ?? d.brand));
        }
    };
    return (
        <div className='bg-white '>
            {/* <div className="flex items-center justify-between ">
                <h4 className="font-semibold">Competition Analysis </h4>
                <div className="flex items-center gap-2">
                    <select
                        id="graph"
                        className="bg-gray-50 cursor-pointer border border-gray-300 text-gray-900 text-xs rounded-lg 
             focus:ring-blue-500 focus:border-blue-500 block  px-2.5 py-1
             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
             dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {
                            Object.keys(optionType)?.map((k,idx) => (
                                <option key={idx} value={k} selected={type==k}>{optionType[k]}</option>
                            ))}
                    </select>
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
            </div> */}
            <div className="w-full h-[400px] min-w-full min-h-[400px] !items-center !justify-center relative">
                {loading ? <Loader show={loading} fullScreen={false} /> :
                    <ReactECharts
                        ref={chartRef} option={option} style={{ height: "100%", width: "100%" }} onEvents={onEvents} />
                }
            </div>
        </div >
    );
});

SosGraphicalAnalysis.displayName = "SosGraphicalAnalysis";
export default SosGraphicalAnalysis;