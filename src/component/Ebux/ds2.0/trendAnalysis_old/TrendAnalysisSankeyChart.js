import React, { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useRef } from "react";
import "./SankeyExact.css";

const TrendAnalysisSankeyChart = ({ selectedData }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const chartRef = useRef();
    const metricDropdownOptions = [
        { label: 'Avg OSA', value: 'osa' },
        { label: 'OOS Days', value: 'oos-days' },
        { label: 'Promotions', value: 'promotions' },
        { label: 'Selling Price', value: 'selling-price' },
        { label: 'MRP', value: 'mrp' },
        { label: 'Total Score', value: 'total-score' },
        { label: 'Rating', value: 'rating' },
        { label: 'Review Count', value: 'review-count' },
    ];
    const [selectedMetric, setSelectedMetric] = useState(metricDropdownOptions[0].value);
    // Get the label for the selected metric
    const selectedMetricLabel = metricDropdownOptions.find(opt => opt.value === selectedMetric)?.label || 'Avg OSA';

    // Define the color palette for categories
    const categoryColors = [
        '#A4C8FF', // Light blue
        '#FFD2A6', // Light orange
        '#BEEBA6', // Light green
        '#E36968', // Coral red
        '#B594D2', // Light purple
    ];

    const downloadImage = () => {
        const echartsInstance = chartRef.current.getEchartsInstance();
        echartsInstance.setOption({
            legend: {
                show: true,
            },
        });
        const imgData = echartsInstance.getDataURL({
            type: "png",
            pixelRatio: 2,
            backgroundColor: "#fff",
        });
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "chart-image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        echartsInstance.setOption({
            legend: {
                show: false,
            },
        });
    };

    // Build periods/x-axis from selectedData, with sensible fallbacks
    const timeView = selectedData?.timeView || 'monthly';
    const isDailyView = timeView === 'daily';
    const isWeeklyView = timeView === 'weekly';
    const isMonthyView = timeView === 'monthly';

    const dates = useMemo(() => {
        const periods = selectedData?.periods?.length ? selectedData.periods : (
            timeView === 'weekly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                timeView === 'daily' ? ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'Today'] :
                    ['Jan', 'Feb', 'Mar', 'Apr']
        );
        
        // If there's only one period, duplicate it to create a source and target for Sankey
        if (periods.length === 1) {
            return [periods[0], `${periods[0]} (Copy)`];
        }
        return periods;
    }, [selectedData?.periods, timeView]);

    // Create a mapping of product keys to colors from our palette
    const getCategoryColorMap = useMemo(() => {
        const colorMap = {};
        const uniqueKeys = [...new Set((selectedData?.rows || []).map(row => row.id))];

        uniqueKeys.forEach((key, index) => {
            colorMap[key] = categoryColors[index % categoryColors.length];
        });

        return colorMap;
    }, [selectedData?.rows, categoryColors]);

    // Generate a per-period ordered product list from selected rows
    const productOrderByDate = useMemo(() => {
        const map = {};
        dates.forEach((period, idx) => {
            const rows = (selectedData?.rows || []).map(r => ({
                key: r.id,
                label: r.name,
                // Assign color from our palette mapping
                color: getCategoryColorMap[r.id] || categoryColors[0],
                icon: '•',
                value: (r.values && r.values[Math.min(idx, r.values.length - 1)]) || 0, // Use first value for copied periods
            }));
            rows.sort((a, b) => (b.value || 0) - (a.value || 0));
            map[period] = rows;
        });
        return map;
    }, [dates, selectedData?.rows, getCategoryColorMap]);

    // below code is just to move the x axis names and name mentions towards right or left
    let colXs;

    if (isMonthyView) {
        const margin = 6;
        const usable = 101 - margin * 2;
        const step = dates.length > 1 ? usable / (dates.length - 1) : 0;
        colXs = dates.map((_, i) => `${margin + step * i}%`);
    } else if (isWeeklyView) {
        const margin = 12;
        const usable = 105 - margin * 2;
        const step = dates.length > 1 ? usable / (dates.length - 1) : 0;
        colXs = dates.map((_, i) => `${margin + step * i}%`);
    } else if (isDailyView) {
        const margin = 6;
        const usable = 98 - margin * 2;
        const step = dates.length > 1 ? usable / (dates.length - 1) : 0;
        colXs = dates.map((_, i) => `${margin + step * i}%`);
    }

    const nodeName = (productKey, productLabel, dateLabel) =>
        `${productLabel}||${productKey}||${dateLabel}`;

    const findProductInDate = (dateLabel, key) => {
        const arr = productOrderByDate[dateLabel];
        if (!arr) return null;
        return arr.find(p => p.key === key) || null;
    };

    const findProductByKey = (key) => {
        for (const date of dates) {
            const found = findProductInDate(date, key);
            if (found) return found;
        }
        return null;
    };

    const handleNodeClick = (params) => {
        if (params.dataType === 'node') {
            const clickedProductKey = params.data.iconKey;
            setSelectedCategory(prev => (prev === clickedProductKey ? null : clickedProductKey));
        }
    };

    // Check if we have only one original period (before duplication)
    const hasSinglePeriod = selectedData?.periods?.length === 1 || (!selectedData?.periods && timeView === 'monthly' && dates.length === 2);

    // --- IMPORTANT CHANGE: assign x for each node so it lines up with the column center (colXs) ---
    const nodes = useMemo(() => {
        const arr = [];
        dates.forEach((date, dateIdx) => {
            const order = productOrderByDate[date] || [];
            order.forEach((product) => {
                const isFaded = selectedCategory && selectedCategory !== product.key;
                arr.push({
                    name: nodeName(product.key, product.label, date),
                    x: colXs[dateIdx],
                    itemStyle: {
                        color: product.color,
                        borderWidth: 1,
                        borderColor: "#fff",
                        borderRadius: 6,
                        opacity: isFaded ? 0.12 : 1
                    },
                    iconKey: product.key,
                    productLabel: product.label,
                    dateLabel: date,
                    nodeColor: product.color,
                    icon: product.icon,
                    emphasis: {}
                });
            });
        });
        return arr;
    }, [dates, productOrderByDate, selectedCategory, colXs]);

    const valueMap = {
        classic: [12, 10, 8],
        gold: [14, 13, 12],
        peach: [9, 7, 7],
        sunrise: [8, 6, 6],
        black: [6, 5, 5]
    };

    const avgOsaMap = Object.fromEntries(
        Object.entries(valueMap).map(([key, arr]) => {
            const avg = Array.isArray(arr) && arr.length
                ? arr.reduce((s, v) => s + (Number(v) || 0), 0) / arr.length
                : null;
            // keep one decimal place (tweak as needed)
            return [key, avg !== null ? Number(avg.toFixed(1)) : null];
        })
    );

    const links = useMemo(() => {
        const arr = [];
        
        // If we have only one original period, create a self-loop or simple connection
        if (hasSinglePeriod && dates.length >= 2) {
            const fromDate = dates[0];
            const toDate = dates[1];
            const fromProducts = productOrderByDate[fromDate] || [];
            
            fromProducts.forEach(prod => {
                const key = prod.key;
                const sourceProduct = findProductInDate(fromDate, key);
                const targetProduct = findProductInDate(toDate, key);
                if (!sourceProduct || !targetProduct) return;
                
                const colorProduct = findProductByKey(key) || prod;
                const isRelatedToSelection = selectedCategory && (key === selectedCategory);
                const isFaded = selectedCategory && !isRelatedToSelection;
                
                // Use the product's value or a default value for single period
                const valueForTransition = prod.value || 10;
                const fadedOpacity = selectedCategory ? (isFaded ? 0.08 : 1) : 0.18;
                
                arr.push({
                    source: nodeName(sourceProduct.key, sourceProduct.label, fromDate),
                    target: nodeName(targetProduct.key, targetProduct.label, toDate),
                    value: valueForTransition,
                    lineStyle: {
                        color: colorProduct.color,
                        opacity: fadedOpacity,
                        curveness: 0.5,
                        width: Math.max(1, Math.round(valueForTransition / 2)),
                    }
                });
            });
        } else {
            // Original logic for multiple periods
            for (let i = 0; i < dates.length - 1; i++) {
                const fromDate = dates[i];
                const toDate = dates[i + 1];
                const fromProducts = productOrderByDate[fromDate] || [];
                fromProducts.forEach(prod => {
                    const key = prod.key;
                    const sourceProduct = findProductInDate(fromDate, key);
                    const targetProduct = findProductInDate(toDate, key);
                    if (!sourceProduct || !targetProduct) return;
                    const colorProduct = findProductByKey(key) || prod;
                    const isRelatedToSelection = selectedCategory && (key === selectedCategory);
                    const isFaded = selectedCategory && !isRelatedToSelection;
                    const valueForTransition = (valueMap[key] && valueMap[key][i]) || 6;
                    const fadedOpacity = selectedCategory ? (isFaded ? 0.08 : 1) : 0.18;
                    arr.push({
                        source: nodeName(sourceProduct.key, sourceProduct.label, fromDate),
                        target: nodeName(targetProduct.key, targetProduct.label, toDate),
                        value: valueForTransition,
                        lineStyle: {
                            color: colorProduct.color,
                            opacity: fadedOpacity,
                            curveness: 0.5,
                            width: Math.max(1, Math.round(valueForTransition / 2)),
                        }
                    });
                });
            }
        }
        return arr;
    }, [dates, productOrderByDate, selectedCategory, hasSinglePeriod, valueMap]);

    const option = useMemo(() => {
        // Calculate left offset based on view type
        const leftOffset = isWeeklyView ? '8%' : '2.5%';
        const axisLabelLeftOffset = isWeeklyView ? 30 : 20;
        const timePeriodBottomOffset = isDailyView ? "2%" : "0%";
        const timePeriodLeftPosition = isDailyView ? "55%" : "center";

        return {
            backgroundColor: "#ffffff",
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
                extraCssText: 'width:260px;min-width:260px;box-sizing:border-box;font-family:Inter;font-weight:500;font-size:14px;line-height:1.2;border-radius:12px;padding:12px;display:flex;flex-direction:column;justify-content:flex-start;',
                formatter: (params) => {
                    if (!params) return '';

                    // EDGE (link) hover
                    if (params.dataType === "edge") {
                        const srcParts = (params.data.source || "").split("||");
                        const tgtParts = (params.data.target || "").split("||");
                        const srcName = srcParts[0] || '';
                        const tgtName = tgtParts[0] || '';
                        const srcKey = srcParts[1] || null;
                        const tgtKey = tgtParts[1] || null;
                        const srcAvg = (srcKey && avgOsaMap && avgOsaMap[srcKey] != null) ? avgOsaMap[srcKey] : '—';
                        const tgtAvg = (tgtKey && avgOsaMap && avgOsaMap[tgtKey] != null) ? avgOsaMap[tgtKey] : '—';
                        const flow = params.data.value ?? '—';

                        // For single period, show appropriate message
                        if (hasSinglePeriod) {
                            return `
    <div style="display:flex;flex-direction:column;gap:8px;">
    <!-- Title -->
    <div style="color:#FFFFFF;font-size:16px;font-weight:600;">${srcName} (Single Period)</div>

    <!-- Flow block -->
    <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="color:#B6B6C6;font-size:12px;">Value</div>
    <div style="color:#FFFFFF;font-size:15px;font-weight:600;">${flow}</div>
    </div>

    <!-- Dynamic metric line -->
    <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">
    <div style="color:#B6B6C6;font-size:12px;">${selectedMetricLabel}</div>
    <div style="color:#FFFFFF;font-size:14px;font-weight:600;">${srcAvg}</div>
    </div>
    </div>
    `;
                        }

                        return `
    <div style="display:flex;flex-direction:column;gap:8px;">
    <!-- Title -->
    <div style="color:#FFFFFF;font-size:16px;font-weight:600;">${srcName} → ${tgtName}</div>

    <!-- Flow block -->
    <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="color:#B6B6C6;font-size:12px;">Flow</div>
    <div style="color:#FFFFFF;font-size:15px;font-weight:600;">${flow}</div>
    </div>

    <!-- Dynamic metric lines stacked below title -->
    <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">
    <div style="color:#B6B6C6;font-size:12px;">${selectedMetricLabel} (${srcName})</div>
    <div style="color:#FFFFFF;font-size:14px;font-weight:600;">${srcAvg}</div>

    <div style="color:#B6B6C6;font-size:12px;margin-top:6px;">${selectedMetricLabel} (${tgtName})</div>
    <div style="color:#FFFFFF;font-size:14px;font-weight:600;">${tgtAvg}</div>
    </div>
    </div>
    `;
                    }

                    // NODE hover - Show full product name
                    const node = params.data || {};
                    const keyFromName = (node.name && node.name.split && node.name.split("||")[1]) || null;
                    const key = node.iconKey || keyFromName;
                    const name = node.productLabel || (node.name && node.name.split && node.name.split("||")[0]) || params.name || "";
                    const avg = (key && avgOsaMap && avgOsaMap[key] != null) ? avgOsaMap[key] : '—';

                    return `
            <div style="display:flex;flex-direction:column;gap:8px;">
            <!-- Title (product name only once) -->
            <div style="color:#FFFFFF;font-size:16px;font-weight:600;">${name}</div>

            <!-- Key : Value inline on 2nd line -->
            <div style="color:#B6B6C6;font-size:13px;">
            ${selectedMetricLabel} : <span style="color:#FFFFFF;font-size:15px;font-weight:600;">${avg}</span>
            </div>
            </div>
            `;
                }
            },

            grid: {
                left: '0%',
                right: '0%',
                top: '0%',
                bottom: '10%',
                containLabel: false
            },
            series: [
                {
                    type: "sankey",
                    layout: "none",
                    left: leftOffset, // Dynamic left offset based on view type
                    right: '2.5%',
                    top: '10%',
                    bottom: '12%',
                    nodeWidth: 200,
                    nodeGap: 20,
                    draggable: false,
                    nodeAlign: "justify",
                    layoutIterations: 0,
                    emphasis: {
                        focus: "none",
                        disabled: true,
                    },
                    label: {
                        show: true,
                        position: "inside",
                        align: "center",
                        verticalAlign: "middle",
                        fontSize: 13,
                        fontWeight: "normal",
                        color: "#333",
                        formatter: function (params) {
                            const productLabel = params.data.productLabel || params.data.name.split("||")[0];
                            const maxLength = 15; // Maximum characters before truncation

                            // Truncate long names with ellipsis
                            if (productLabel.length > maxLength) {
                                return `${params.data.icon ? params.data.icon + ' ' : ''}${productLabel.substring(0, maxLength)}...`;
                            }

                            return `${params.data.icon ? params.data.icon + ' ' : ''}${productLabel}`;
                        },
                        rich: {
                            icon: { fontSize: 16, padding: [0, 4, 0, 8] },
                            info: { fontSize: 12, color: "#666", padding: [0, 8, 0, 4] },
                        },
                    },
                    lineStyle: {
                        color: "source",
                        curveness: 0.5,
                        opacity: 0.6,
                    },
                    data: nodes,
                    links: links,
                },
            ],
            graphic: [
                // ticks and labels centered at computed percentages across full width
                ...dates.map((date, idx) => ([
                    {
                        type: "rect",
                        left: colXs[idx],
                        bottom: "2.8%",
                        shape: { width: 2, height: 14 },
                        z: 20,
                        style: { fill: "#ccc" },
                    },
                    {
                        type: "text",
                        left: colXs[idx],
                        bottom: "0.6%",
                        z: 20,
                        style: {
                            text: hasSinglePeriod && idx === 1 ? '' : date, // Hide label for copied period
                            fill: "#999",
                            font: "13px Arial",
                            textAlign: "center"
                        },
                    }
                ])).flat(),
                {
                    type: "text",
                    left: axisLabelLeftOffset, // Dynamic left offset for axis label
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
                    left: timePeriodLeftPosition, // Dynamic position for time period label
                    bottom: timePeriodBottomOffset, // Dynamic bottom offset
                    style: {
                        text: "Time Period",
                        fill: "#666",
                        font: "16px Arial",
                        textAlign: "center",
                    },
                    z: 20,
                },
            ],
        };
    }, [nodes, links, selectedCategory, selectedMetricLabel, isDailyView, isWeeklyView, dates, colXs, avgOsaMap, hasSinglePeriod]);

    return (
        <div className="border border-gray-100 p-2">
            <div className="flex flex-row items-center justify-between gap-1">
                <div className="ml-4 mt-4" >
                    <h2 className="text-lg font-semibold mb-2">Graphical Analysis</h2>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>23/07/25</span>
                        <img
                            src="/assets/images/arrow-right.svg"
                            alt="arrow"
                            className="inline-block w-4 h-4"
                        />
                        <span>23/07/25</span>
                    </div>
                </div>
                <div className="flex flex-row items-center mr-4">
                    <div className="flex flex-row items-center" style={{ gap: 12 }}>
                        {/* Selected category placeholder */}
                        {selectedCategory && (() => {
                            const prod = Object.values(productOrderByDate)[0].find(p => p.key === selectedCategory);
                            const imgSrc = prod && prod.key === "classic" ? "/assets/images/admin.png" : "/assets/images/admin.png";
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
                                    <img
                                        src={imgSrc}
                                        alt={prod ? prod.label : "Product"}
                                        style={{ width: 20, height: 20, marginRight: 8, borderRadius: 4, objectFit: "contain" }}
                                    />
                                    <span style={{ fontWeight: 400, fontSize: 12, color: "#222" }}>
                                        {prod ? prod.label : selectedCategory}
                                    </span>
                                </div>
                            );
                        })()}
                        <select
                            className="border text-sm"
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
            <div className="sankey-wrapper">
                <div className="sankey-inner">
                    <ReactECharts
                        ref={chartRef}
                        option={option}
                        style={{ height: "400px", width: `${Math.max(1000, dates.length * 280)}px` }} // Reduced width
                        notMerge={true}
                        lazyUpdate={false}
                        opts={{ renderer: 'canvas' }}
                        onEvents={{ click: handleNodeClick }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TrendAnalysisSankeyChart;