import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

export default function BuyBoxDonut({
    data = {},
    focusKey = "P1",
    height = 220,
}) {

    const p1 = Number(data?.P1?.currentData?.percentage ?? 0);
    const p2 = Number(data?.P2?.currentData?.percentage ?? 0);
    const p3 = Number(data?.P3?.currentData?.percentage ?? 0);
    console.log('datadatadata', data)
    const seriesData = useMemo(
        () => [
            { name: "1P", value: p1, itemStyle: { color: "#FF9900" } },
            { name: "2P", value: p2, itemStyle: { color: "#1890FF" } },
            { name: "3P", value: p3, itemStyle: { color: "#11B07A" } },
        ],
        [p1, p2, p3]
    );

    const focusPercentage = useMemo(() => {
        const map = { P1: p1, P2: p2, P3: p3 };
        return formatPercentage(map[focusKey] ?? 0);
    }, [p1, p2, p3, focusKey]);

    const option = {
        // tooltip: {
        //     trigger: "item",
        //     formatter: "{b}: {c}%",
        //     // formatter: "{b}: {c}% ({d}%)",
        // },
        tooltip: {
            trigger: "item",
            // function formatter so we can use params.percent (pie) and safe formatting
            formatter: (params) => {
                // params.percent is number like 34.93 for pie charts; params.value is raw value
                const rawPercent = params.percent != null ? params.percent : params.value;
                const formatted = formatPercentage(rawPercent);
                // Use rich text tokens {name|...} and {value|...}
                return `<b>${params.name}: ${formatted}</b>`;
            },
            // define rich styles under textStyle.rich
            textStyle: {
                rich: {
                    name: {
                        fontWeight: "700",
                        fontSize: 13,
                        // color: '#000'   <-- don't set color unless you want to
                    },
                    value: {
                        fontWeight: "700",
                        fontSize: 13,
                    },
                },
            },
        },


        // ✅ LEGEND REMOVED
        legend: { show: false },

        series: [
            {
                name: "Seller share",
                type: "pie",
                radius: ["55%", "90%"],
                center: ["50%", "50%"],
                avoidLabelOverlap: false,

                label: {
                    show: true,
                    position: "center",
                    formatter: `{b|${'1P'}} \n{a|${focusPercentage}}`,
                    rich: {
                        b: {
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#0f172a",
                            lineHeight: 28,
                            align: "center",
                        },
                        a: {
                            fontSize: 20,
                            fontWeight: 800,
                            color: "#0f172a",
                            align: "center",
                        },
                    },
                },

                emphasis: {
                    scale: true,
                    scaleSize: 6,
                },

                labelLine: { show: false },
                data: seriesData,
            },
        ],
    };

    function formatPercentage(value) {
        const num = parseFloat(value);

        if (num >= 10) {
            return `${num.toFixed(1)}%`;
        } else {
            return `${value}%`;
        }
    }
    return (
        <div className="w-full flex flex-col items-center">
            <div style={{ width: "360px", height: `${height}px` }}>
                <ReactECharts
                    option={option}
                    style={{ width: "100%", height: `${height}px` }}
                    notMerge
                    lazyUpdate
                />
            </div>
        </div>
    );
}
