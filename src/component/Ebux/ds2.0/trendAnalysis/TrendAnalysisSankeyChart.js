import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useRef } from "react";
import "./SankeyExact.css";
import moment from 'moment';
import { useEbuxContext } from "../../Context/EbuxProvider";
import CustomTooltip from "../osaWidgets/osaPerformanceOverview/Components/DrawerComponent/customTooltip/CustomTooltip";
import { createPortal } from "react-dom";
import Loader from "../../common-components/Loader";
const categoryColors = [
    '#F7D7DD',
    '#C9DFF5',
    '#F3E7C9',
    '#CFC6E3',
    '#DFF4D8',
    '#A4C8FF', // Light blue
    '#FFD2A6', // Light orange
    '#BEEBA6', // Light green
    '#E36968', // Coral red
    '#B594D2', // Light purple
    '#73a9faff',
    '#fcb268ff',
    '#9bf36dff',
    '#e95050ff',
    '#9959d1ff',
];
const Tooltip = ({ position }) => {
    if (!position) return null;

    return createPortal(
        <div
            className="fixed bg-gray-800 text-white text-xs p-2 rounded-md  z-[1000000001000]"
            style={{ top: position.top - 10, left: position.left }}
        >
            {position?.open == 'left' && (
                <div
                    className="absolute top-3 left-[-4px] transform -translate-y-1/2 w-0 h-0 
            border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"
                ></div>
            )}
            {position?.open == 'bottom' && (
                <div
                    className="absolute top-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 
       border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-gray-800"
                ></div>
            )}
            <h3>To ensure accurate reporting, please select a sufficient date range:</h3>
            <ul>
                <li>
                    <strong>Daily View :</strong> Select at least <b>2 days or more</b>
                </li>
                <li>
                    <strong>Weekly View :</strong> Select at least <b>8 days or more</b>
                </li>
                <li>
                    <strong>Monthly View :</strong> Select at least <b>32 days or more</b>
                </li>
            </ul>
            {position?.open == 'top' && (
                <div
                    className="absolute bottom-[-4px] left-[38px] transform -translate-x-1/2 w-0 h-0 
        border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"
                ></div>

            )}
        </div>,
        document.body
    );
};
const TrendAnalysisSankeyChart = ({ loading, activeTab, getTabIconUrl, getTabIcon, kpiInfo, selectedMetric, setSelectedMetric, metricDropdownOptions, selectedData }) => {
    // const downloadingRef = useRef(false);
    const exportGraphicRef = useRef(null);

    const {
        selectedFilters
    } = useEbuxContext();
    const chartRef = useRef();
    const renderedOnceRef = useRef(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    // const [isDownloading, setIsDownloading] = useState(false);
    useEffect(() => {
        // alert(JSON.stringify({selectedData}))
        renderedOnceRef.current = false;
        setSelectedCategory(null);
    }, [JSON.stringify({ selectedData })])
    const [tooltipPosition, setTooltipPosition] = useState({});
    const timeView = selectedData?.timeView || '' || 'monthly';

    // Get the label for the selected metric
    const selectedMetricLabel = kpiInfo?.label ?? kpiInfo?.title ?? metricDropdownOptions?.find(opt => opt.value === selectedMetric)?.label ?? 'Avg OSA';

    // Define the color palette for categories

    const startDate = moment(
        selectedFilters?.selectedWeeks?.current?.[0]?.start ?? ""
    ).format("DD/MM/YYYY");

    const endDate = moment(
        selectedFilters?.selectedWeeks?.current?.[
            selectedFilters?.selectedWeeks?.current?.length - 1
        ]?.end ?? ""
    ).format("DD/MM/YYYY");


    // const downloadImage = () => {
    //     const chart = chartRef.current?.getEchartsInstance();
    //     if (!chart) return;

    //     const exportGraphic = {
    //         $action: "replace",
    //         type: "text",
    //         left: 60,
    //         top: 15,
    //         z: 100,
    //         style: {
    //             text: `Graphical Analysis\n${startDate} → ${endDate}`,
    //             fontSize: 16,
    //             fontWeight: 600,
    //             lineHeight: 22,
    //             fill: "#333",
    //         },
    //     };

    //     exportGraphicRef.current = exportGraphic;

    //     const onFinish = () => {
    //         chart.off("finished", onFinish);

    //         const img = chart.getDataURL({
    //             type: "png",
    //             pixelRatio: 2,
    //             backgroundColor: "#fff",
    //         });

    //         const link = document.createElement("a");
    //         link.href = img;
    //         link.download = "graphical-analysis-chart.png";
    //         link.click();

    //         // cleanup
    //         exportGraphicRef.current = null;
    //         chart.setOption(
    //             {
    //                 graphic: [
    //                     {
    //                         $action: "replace",
    //                         type: "group",
    //                         children: [],
    //                     },
    //                 ],
    //                 series: [{ top: 10 }],
    //             },
    //             false
    //         );
    //     };

    //     // attach listener FIRST
    //     chart.on("finished", onFinish);

    //     // apply export overlay
    //     chart.setOption(
    //         {
    //             graphic: [exportGraphic],
    //             series: [{ top: 70 }],
    //         },
    //         false
    //     );
    //     chart.resize();
    // };

    const downloadImage = () => {
        const echartsInstance = chartRef.current.getEchartsInstance();

        const onFinish = () => {
            echartsInstance.off('finished', onFinish);

            const imgData = echartsInstance.getDataURL({
                type: "png",
                pixelRatio: 2,
                backgroundColor: "#fff",
            });

            const link = document.createElement("a");
            link.href = imgData;
            link.download = "graphical-analysis-chart.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Restore original view
            echartsInstance.setOption({
                legend: { show: false },
                title: { show: false },
                series: [{ top: 10 }] // Original padding
            });
        };

        echartsInstance.on('finished', onFinish);

        // Apply export-only layout adjustments
        echartsInstance.setOption({
            legend: {
                show: false, // Keeping legend hidden as requested previously or adjust if needed
            },
            title: {
                show: true,
                text: `Graphical Analysis\n${startDate} → ${endDate}`,
                left: 20, // Margin left for text
                top: 20,  // Margin top for text
                textStyle: {
                    color: "#333",
                    fontSize: 16,
                    fontWeight: "bold",
                    lineHeight: 22,
                },
            },
            series: [{
                top: 80 // Push chart down to prevent overlap with title
            }]
        });
        echartsInstance.setOption({
            legend: {
                show: false, // Keeping legend hidden as requested previously or adjust if needed
            },
            title: {
                show: false,

            },
            series: [{
                top: 10
            }]
        });
    };
    const hasSinglePeriod = useMemo(() => { return selectedData?.periods?.length === 1; }, [selectedData?.periods]);
    const dates = useMemo(() => {
        const periods = selectedData?.periods?.length ? selectedData.periods : [];

        // If there's only one period, duplicate it to create a source and target for Sankey
        if (periods.length === 1) {
            return [periods[0], `${periods[0]} (Copy)`];
        }
        return periods;
    }, [selectedData?.periods, timeView]);

    // Create a mapping of product keys to colors from our palette
    const getCategoryColorMap = useMemo(() => {
        const colorMap = {};
        const uniqueKeys = [...new Set((selectedData?.rows || [])?.map(row => row.id))];

        uniqueKeys.forEach((key, index) => {
            colorMap[key] = categoryColors[index % categoryColors.length];
        });
        return colorMap;
    }, [selectedData?.rows]);

    // Generate a per-period ordered product list from selected rows
    const productOrderByDate = useMemo(() => {
        const map = {};
        dates.forEach((period, idx) => {
            const rows = ((selectedData?.rows || [])).map(r => ({
                key: r.id,
                label: r.name,
                // Assign color from our palette mapping
                color: getCategoryColorMap[r.id] || categoryColors[0],
                // icon: '•',
                value: (r.values ? r.values[hasSinglePeriod ? 0 : idx] : null),
            }))?.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
            map[period] = rows;
        });
        return map;
    }, [dates, selectedData?.rows, getCategoryColorMap]);

    // below code is just to move the x axis names and name mentions towards right or left



    const nodeName = (productKey, productLabel, dateLabel) => `${productLabel}||${productKey}||${dateLabel}`;

    const findProductInDate = (dateLabel, key) => {
        const arr = productOrderByDate[dateLabel];
        if (!arr) return null;
        return arr?.find(p => p.key === key) || null;
    };

    const handleNodeClick = useCallback((params) => {
        if (params.dataType === 'node') {
            const clickedProductKey = params.data.iconKey;
            setSelectedCategory(prev => (prev === clickedProductKey ? null : clickedProductKey));
        }
    }, []);
    const maxProducts = useMemo(() => Math.max(...dates.map(date => {
        const order = productOrderByDate[date] || [];
        return order.length;
    })), [dates, productOrderByDate]);
    const maxHeight = useMemo(() => {
        let h = 0;
        for (let rank = 0; rank < maxProducts; rank++) {
            const rank_height = 40 + (((maxProducts - 1) - (rank)) * 2);
            h += Math.max(40, rank_height);
        }
        return h;
    }, [maxProducts])

    // --- IMPORTANT CHANGE: assign x for each node so it lines up with the column center (colXs) ---
    const nodes = useMemo(() => {
        const arr = [];
        dates.forEach((date
            // , dateIdx
        ) => {
            const order = productOrderByDate[date] || [];
            const order_length = (order?.length - 1);

            order?.forEach((product, rank) => {
                const rank_height = 40 + ((order_length - rank) * (2));

                const isFaded = selectedCategory && selectedCategory !== product.key;
                arr.push({
                    name: nodeName(product.key, product.label, date),
                    depth: date,
                    // x: colXs[dateIdx],
                    itemStyle: {
                        color: product.color,
                        opacity: isFaded ? 0.12 : 1
                    },
                    value: Math.max(40, rank_height),
                    data_value: product.value,
                    iconKey: product.key,
                    productLabel: product.label,
                    dateLabel: date,
                    nodeColor: product.color,
                    icon: product.icon
                });
            });
        });
        return arr;
    }, [dates, productOrderByDate, selectedCategory]);



    const findProductByKey = (key) => {
        for (const date of dates) {
            const found = findProductInDate(date, key);
            if (found) return found;
        }
        return null;
    };

    const links = useMemo(() => {
        const arr = [];


        // if only one date, no transitions
        if (dates.length <= 1) return arr;

        // If we have only one original period, create a self-loop or simple connection
        if (hasSinglePeriod && dates.length >= 2) {
            const fromDate = dates[0];
            const toDate = dates[1];
            const fromProducts = productOrderByDate[fromDate] || [];

            fromProducts.forEach(prod => {
                const key = prod.key;
                const sourceProduct = findProductInDate(fromDate, key);
                const targetProduct = findProductInDate(toDate, key);
                // const targetProduct = findProductInDate(toDate, key);
                if (!sourceProduct || !targetProduct) return;

                const colorProduct = findProductByKey(key) || prod;
                const isRelatedToSelection = selectedCategory && (key === selectedCategory);
                const isFaded = selectedCategory && !isRelatedToSelection;

                // Use the product's value or a default value for single period
                // const valueForTransition = prod.value || 0;
                const fadedOpacity = selectedCategory ? (isFaded ? 0.08 : 1) : 0.18;

                arr.push({
                    source: nodeName(sourceProduct.key, sourceProduct.label, fromDate),
                    target: nodeName(targetProduct.key, targetProduct.label, toDate),
                    value: 40,//Math.max(40, valueForTransition),

                    fromVal: prod.value ?? null,
                    toVal: prod.value ?? null,
                    lineStyle: {
                        color: colorProduct.color,
                        opacity: fadedOpacity,
                        // curveness: 0.5,
                        // width: Math.max(1, Math.round(valueForTransition / 2)),
                    }
                });
            });
        } else {
            // Original logic for multiple periods

            for (let i = 0; i < dates.length - 1; i++) {
                const fromDate = dates[i];
                const toDate = dates[i + 1];

                (selectedData?.rows || []).forEach(row => {
                    const fromVal = (row.values?.[i] != undefined && row.values?.[i] != null) ? Number(row.values?.[i]) : null;
                    const toVal = (row.values?.[i + 1] != undefined && row.values?.[i + 1] != null) ? Number(row.values?.[i + 1]) : null;
                    if (isNaN(fromVal) || isNaN(toVal)) return;

                    // const valueForTransition = Math.round((fromVal + toVal) / 2);
                    // const valueForTransition = Math.round((fromVal + toVal));

                    arr.push({
                        source: nodeName(row.id, row.name, fromDate),
                        target: nodeName(row.id, row.name, toDate),
                        value: 40,// Math.max(40, valueForTransition),
                        fromVal,
                        toVal,
                        lineStyle: {
                            color: getCategoryColorMap?.[row.id] || "#999",
                            opacity: selectedCategory && selectedCategory !== row.id ? 0.08 : 0.6,
                            // curveness: 0.5,
                            // width: Math.max(1, Math.round(valueForTransition / 20)),
                        }
                    });
                });
            }
        }
        return arr;
    }, [selectedData?.rows, selectedCategory]);
    const [init_graphics, set_init_graphics] = useState([]);
    const onRendered = () => {

        const chart = chartRef.current?.getEchartsInstance?.();
        if (!chart) return;
        if (exportGraphicRef.current) {
            chart.setOption(
                {
                    graphic: [{ ...exportGraphicRef.current, $action: "replace" }],
                    series: [{ top: 70 }],
                },
                false
            );
        }
        if (renderedOnceRef.current) return;
        const model = chart?.getModel();
        if (!model) return;
        const series = model?.getSeriesByIndex(0);
        if (!series) return;
        const data = series?.getData();
        const depthMap = {};
        const N = data?.count();
        for (let i = 0; i < N; i++) {
            const layout = data?.getItemLayout(i);
            if (!layout) continue;
            const cx = layout.x + (layout?.dx) / 2;
            if (!depthMap[layout?.depth]) depthMap[layout?.depth] = [];
            depthMap[layout?.depth].push(cx);
        }
        const colCenters = Object.keys(depthMap)?.map((d) => {
            const arr = depthMap[d];
            return arr?.reduce((s, v) => s + v, 0) / arr?.length;
        }).sort((a, b) => a - b);


        const graphics = colCenters?.map((cx, i) => ({
            type: "group",
            left: (cx - 40) + 47,
            top: chart?.getHeight() - 40,
            z: 2,
            text: hasSinglePeriod && i === 1 ? '' : dates[i],
            children: [
                {
                    type: "rect",
                    bottom: 35, // relative to group
                    shape: { width: hasSinglePeriod && i === 1 ? 0 : 2, height: hasSinglePeriod && i === 1 ? 0 : 5 },
                    style: { fill: "#000" },
                    //"#ccc" 
                },
                {
                    type: "text",
                    bottom: 20, // relative to group
                    style: {
                        text: hasSinglePeriod && i === 1 ? '' : dates[i],
                        font: "13px Arial",
                        textAlign: "center",
                        width: "200px",
                        left: 10,
                        marginLeft: "20px",
                        fontWeight: 600,
                        fill: "#000"
                    },
                }
            ]
        }));
        renderedOnceRef.current = true;
        set_init_graphics(graphics);
        // chart.setOption({ graphic: graphics });
    };
    const option = useMemo(() => {

        return {
            backgroundColor: "#ffffff",
            title: {
                show: false,
                text: ``,
                left: "left",
                top: 10,
                textStyle: {
                    color: "#333",
                    fontSize: 16,
                    fontWeight: "bold",
                    lineHeight: 22,
                },
            },
            tooltip: {
                trigger: "item",
                backgroundColor: '#030229',
                borderRadius: 12,
                borderWidth: 0,
                padding: 16,
                textStyle: {
                    color: '#FFFFFF',
                    fontFamily: 'Inter, Arial',
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: 1.2
                },
                extraCssText: 'width:300px;min-width:300px;box-sizing:border-box;font-family:Inter;font-weight:500;font-size:14px;line-height:1.2;border-radius:12px;padding:12px;display:flex;flex-direction:column;justify-content:flex-start;',
                formatter: (params) => {
                    if (!params) return '';
                    const showVal = (val) => {
                        if (val == undefined || val == null) {
                            return "-";
                        }
                        return `${val != undefined && kpiInfo?.icon == "rupee" ? "₹ " : (kpiInfo?.icon ? (kpiInfo?.icon + " ") : "")}${val ?? "-"}${val != undefined && kpiInfo?.persentageValue ? "%" : ""}`;
                    }
                    // EDGE (link) hover
                    if (params.dataType === "edge") {
                        const srcParts = (params.data.source || "").split("||");
                        const tgtParts = (params.data.target || "").split("||");
                        const srcName = srcParts[0] || '';
                        // const tgtName = srcParts[0] || '';
                        const formDate = srcParts[2] || '';
                        const toDate = tgtParts[2] || '';
                        const srcAvg = params?.data?.fromVal ?? null;
                        const tgtAvg = params?.data?.toVal ?? null;
                        // const flow = params.data.value ?? '—';
                        if (hasSinglePeriod) {
                            return `
    <div style="display:flex;flex-direction:column;gap:8px;">
    <!-- Title -->
    <div style=" display:flex; align-items:flex-start; gap:6px; max-width:280px; color:#FFFFFF; font-size:16px; font-weight:600; "> <img src="${getTabIconUrl(activeTab)}" style="width:20px;height:20px;flex-shrink:0;" /> <div style="white-space:normal;word-break:break-word;line-height:1.4;"> ${srcName} </div> </div>
    <div style="color:#B6B6C6;font-size:13px;font-weight:600;">Date: <span style="color:#FFFFFF;font-size:15px;font-weight:600;">${(formDate ?? "")?.replace(" (Copy)", "")}</span></div>


    <div style="color:#B6B6C6;font-size:13px;font-weight:600;">${selectedMetricLabel}: <span style="color:#FFFFFF;font-size:15px;font-weight:600;">${showVal(srcAvg)}</span></div>
    
    </div>
    `;
                        }

                        return `
    <div style="display:flex;flex-direction:column;gap:8px;">
    <!-- Title -->
    <div style=" display:flex; align-items:flex-start; gap:6px; max-width:280px; color:#FFFFFF; font-size:16px; font-weight:600; "> <img src="${getTabIconUrl(activeTab)}" style="width:20px;height:20px;flex-shrink:0;" /> <div style="white-space:normal;word-break:break-word;line-height:1.4;"> ${srcName} </div> </div>
    <div style="color:#B6B6C6;font-size:13px;font-weight:600;">Date: <span style="color:#FFFFFF;font-size:15px;font-weight:600;">${formDate} → ${toDate}</span></div>


    <div style="color:#B6B6C6;font-size:13px;font-weight:600;">${selectedMetricLabel}: <span style="color:#FFFFFF;font-size:15px;font-weight:600;">${showVal(srcAvg)} → ${showVal(tgtAvg)}</span></div>
    
    </div>
    `;
                    }

                    // NODE hover - Show full product name
                    const node = params.data || {};
                    const name = node.productLabel || (node.name && node.name.split && node.name.split("||")[0]) || params.name || "";
                    const avg = node?.data_value;

                    return `
            <div style="display:flex;flex-direction:column;gap:8px;">
            <!-- Title (product name only once) -->
            <div style=" display:flex; align-items:flex-start; gap:6px; max-width:280px; color:#FFFFFF; font-size:16px; font-weight:600; "> <img src="${getTabIconUrl(activeTab)}" style="width:20px;height:20px;flex-shrink:0;" /> <div style="white-space:normal;word-break:break-word;line-height:1.4;"> ${name} </div> </div>
            <div style="color:#B6B6C6;font-size:13px;font-weight:600;">Date: <span style="color:#FFFFFF;font-size:15px;font-weight:600;">${(node.dateLabel ?? "")?.replace(" (Copy)", "")}</span></div>

            <!-- Key : Value inline on 2nd line -->
            <div style="color:#B6B6C6;font-size:13px;">
            ${selectedMetricLabel} : <span style="color:#FFFFFF;font-size:15px;font-weight:600;">${showVal(avg)}</span>
            </div>
            </div>
            `;
                }
            },

            grid: {
                left: '0%',
                right: '0%',
                top: '0%',
                bottom: '0%',
                containLabel: true
            },

            series: [
                {
                    type: "sankey",
                    data: nodes,
                    links: links,
                    top: 10,
                    bottom: 40,
                    right: 5,
                    emphasis: {
                        focus: "none",
                        disabled: true,
                    },
                    nodeWidth: 200,
                    nodeGap: 0,
                    draggable: false,
                    // layoutIterations: 0,
                    left: 50,
                    layout: 'horizontal',
                    nodeAlign: "left",
                    layoutIterations: 0,
                    orient: "horizontal",
                    // bottom: 25,
                    label: {
                        show: true,
                        position: "inside",
                        overflow: "break",
                        align: "center",
                        verticalAlign: "middle",
                        fontSize: 13,
                        fontWeight: "normal",
                        color: "#333",
                        formatter: function (params) {
                            const productLabel = params.data.productLabel || params.data.name.split("||")[0];
                            const maxLength = 10;
                            const truncated = productLabel.length > maxLength ? productLabel.substring(0, (maxLength - 3)) + "..." : productLabel;
                            const paddedName = truncated.padEnd(12, " ");
                            const val = (params.data.data_value);
                            const value = val == null ? `-` : `${val != undefined && kpiInfo?.icon == "rupee" ? "₹ " : (kpiInfo?.icon ? (kpiInfo?.icon + " ") : "")}` + (val ?? "") + (val !== undefined && kpiInfo?.persentageValue ? "%" : "");
                            return `{icon|${params.data.icon || ""}} {name|${paddedName}} {value|${value}}`;
                        },
                        rich: {
                            icon: {
                                fontSize: 16,
                                width: 18,
                                height: 16,
                                align: "left",
                                verticalAlign: "middle",
                                padding: [0, 0, 0, 0],
                                backgroundColor: {
                                    image: getTabIconUrl(activeTab), // fallback image
                                },
                            },
                            name: {
                                width: 70,
                                fontSize: 13,
                                color: "#333",
                                align: "left",
                                verticalAlign: "middle",
                            },
                            value: {
                                width: 40,
                                fontSize: 12,
                                color: "#666",
                                align: "left",
                                verticalAlign: "middle",
                                padding: [4, 4, 4, 4],
                                backgroundColor: "#FFFFFF",
                                border: "2px solid #aaa",
                                borderRadius: "20%",
                            },

                        },
                    },
                },
            ],
            ...(init_graphics?.length ? {
                graphic: [
                    ...init_graphics,
                    {
                        type: "text",
                        left: 0, // Dynamic left offset for axis label
                        top: "50%",
                        style: {
                            text: selectedMetricLabel,
                            fill: "#333",
                            textAlign: "center",
                            textVerticalAlign: "middle",
                            font: "13px Arial",
                        },
                        rotation: Math.PI / 2,
                        z: 20,
                    },
                    {
                        type: "text",
                        left: '49%', // Dynamic position for time period label
                        bottom: 0, // Dynamic bottom offset
                        style: {
                            text: "Time Period",
                            fill: "#666",
                            textAlign: "center",
                            font: "13px Arial",
                            fontWeight: 600,
                            // fill: "#000"
                        },
                        invisible: false,
                        z: 0,
                    },]
            } : {})

        };
    }, [
        init_graphics,
        nodes,
        //   links,
        selectedCategory,
        //   selectedMetricLabel,
        //   selectedFilters?.selectedWeeks
    ]);

    const toggleTooltip = useCallback((event, open = "left") => {

        const rect = event.currentTarget.getBoundingClientRect();
        if (open == "top") {
            setTooltipPosition({
                show: true,
                open,
                top: rect.top + window.scrollY - 35,
                left: rect.left - 35,
            });
        } else {
            setTooltipPosition({
                show: true,
                open,
                top: rect.top + rect.height / 2,
                left: rect.right + window.scrollX + 8,
            });
        }

    });



    return (


        <>

            <div className="border border-gray-100 p-2" style={{ position: 'relative' }}>
                <div className="flex flex-row items-center justify-between gap-1">
                    <div className="ml-4 mt-4" >
                        <h2 className="text-lg font-semibold mb-2 inline-flex items-center">
                            Graphical Analysis
                            <img
                                src="/assets/images/imp.svg"
                                className="cursor-pointer w-[10px] h-[12px] hover:rounded-full hover:border hover:border-blue-500 "
                                onMouseEnter={(event) => toggleTooltip(event)}
                                onMouseLeave={() => setTooltipPosition({})}
                            />

                            {loading && <Loader show={loading} fullScreen={false} h={6} w={6} />}
                        </h2>

                        <div className="text-xs text-gray-500 flex items-center gap-2">
                            <i className="chart-date">{moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "")?.format("DD/MM/YYYY")} → {moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "")?.format("DD/MM/YYYY")}</i>
                        </div>
                    </div>
                    <div className="flex flex-row items-center mr-4">
                        <div className="flex flex-row items-center" style={{ gap: 12 }}>
                            {/* Selected category placeholder */}
                            {selectedCategory && (() => {
                                const prod = Object.values(productOrderByDate)[0]?.find(p => p.key === selectedCategory);
                                // const imgSrc = prod && prod.key === "classic" ? "/assets/images/admin.png" : "/assets/images/admin.png";
                                const valText = (prod ? prod.label : selectedCategory);
                                return (
                                    <div
                                        className="flex flex-row items-center"
                                        style={{
                                            width: 280,
                                            height: 35,
                                            gap: 12,
                                            borderRadius: 6,
                                            border: "1px solid #E0E0E0",
                                            padding: "8px 12px",
                                            background: "#EBF6FF"
                                        }}
                                    >
                                        <CustomTooltip title={valText} placement="top">
                                            {getTabIcon(activeTab)} <span className="max-w-[100px]">{valText}</span>
                                        </CustomTooltip>
                                    </div>
                                );
                            })()}

                            <div className="relative">
                                <select
                                    className="appearance-none pr-8 border text-sm"
                                    value={selectedMetric}
                                    onChange={e => setSelectedMetric(e.target.value)}
                                    style={{
                                        width: 130,
                                        height: 35,
                                        borderRadius: 8,
                                        padding: "6px 10px",
                                        borderWidth: 1,
                                        background: '#fff',
                                        color: '#222',
                                    }}
                                >
                                    {metricDropdownOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
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

                            <button
                                type="button"
                                onClick={downloadImage}
                                className="graphIconBtn"
                                style={{ background: "none", border: "none", cursor: "pointer", marginLeft: 8 }}
                            >
                                <img
                                    src="/assets/images/downloadIcon.svg"
                                    width={20}
                                    height={20}
                                    alt="Download"
                                />
                            </button>
                        </div>
                    </div>

                </div>
                <div className="sankey-wrapper !h-[auto]"
                    style={{
                        // maxWidth:'100px',
                        maxWidth: "88vw",
                        // minHeight: `${Math.max(400, maxHeight + 10)}px`,
                        // height: `${Math.max(400, maxHeight + 10)}px`,
                        maxHeight: '600px',
                        overflowX: "auto",   // enable scroll if needed
                        overflowY: "auto"   // enable scroll if needed
                    }}>
                    <div className={'sankey-inner !h-[auto]'}
                        style={{
                            width: `${Math.max(1000, dates.length * 280)}px`,
                            // maxWidth:'100px',
                            minWidth: "88vw",
                            // minHeight: `${Math.max(400, maxHeight + 10)}px`,
                            // height: `${Math.max(400, maxHeight + 10)}px`,
                            // maxHeight:'600px',
                            overflowX: "auto",   // enable scroll if needed
                            // overflowY: "auto"   // enable scroll if needed
                        }}
                    >
                        <ReactECharts
                            ref={chartRef}
                            option={option}
                            style={{
                                minHeight: "400px",
                                height: `${Math.max(400, maxHeight + 10)}px`,
                                width: `${Math.max(1000, dates.length * 280)}px`,       // take full available width
                                minWidth: "88vw"    // ensure readability (scroll if smaller screen)
                            }}
                            notMerge={true}
                            lazyUpdate={false}
                            opts={{ renderer: 'canvas' }}
                            onEvents={{ click: handleNodeClick, finished: onRendered }}
                        />
                    </div>
                </div>
                {/* <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: 30,
                        fontSize: 14,
                        color: '#666',
                        pointerEvents: 'none',
                    }}
                >
                    Time Period
                </div> */}



            </div>
            {tooltipPosition?.show ? <Tooltip position={tooltipPosition} /> : <></>}



        </>
    );
};

export default TrendAnalysisSankeyChart;