import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
// import { getByBoxTrendGraphicalData } from "../../../services/ebuxMaster.service";
import moment from "moment";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { fetchBuyBoxTileData, fetchPlatformChartData } from "../../../../services/ebuxMaster.service";
import BuyBoxDonut from "./BuyBoxDonut";
import SellerList from "./SellerList";
import BeakdownTable from "./BeakdownTable";


export default function ByBoxTrends() {
  const {
    selectedFilters,
    filters,
    initKpiSet
  } = useEbuxContext();
  useEffect(() => {
    initKpiSet("BUYBOX");
  }, ["BUYBOX"]);

  const chartRef = useRef(null);
  const rawDatesRef = useRef([]);
  const [averagePercentageData, setAveragePercentageData] = useState({});
  const [focusKey, setFocusKey] = useState("P1");


  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(false);      // ✅ Loader
  const [error, setError] = useState("");             // ✅ Error state

  const tooltipRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
  // ✅ Legend UI State
  const [activeLegend, setActiveLegend] = useState({
    "1P": true,
    "2P": true,
    "3P": true,
  });

  const formatTooltipHTML = (params ,dataIndex) => {
  const rawDate = rawDatesRef.current?.[dataIndex];
  const formattedDate = rawDate
    ? moment(rawDate).format("D MMM YYYY")
    : "";

  let html = `<div style="font-weight:600;margin-bottom:6px;">${formattedDate}</div>`;

  params.forEach((p) => {
    html += `
      <div style="display:flex;align-items:center;margin-bottom:4px;">
        <span class="w-2 h-2 rounded-full mr-2 inline-block"
      style="background-color:${p.color}"></span>
        <span style="flex:1;">${p.seriesName}</span>
        <b>${Number(p.value).toFixed(2)}%</b>
      </div>
    `;
  });

  return html;
};



  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = selectedFilters?.selectedDateRange?.startDate;
        const endDate = selectedFilters?.selectedDateRange?.endDate;

        if (!startDate || !endDate) return;

        setLoading(true);
        setError("");

        const res = await fetchPlatformChartData(
          filters,
          selectedFilters,
          selectedFilters.selectedPlatform
        );

        const apiData = Array.isArray(res) ? res : [];

        if (!apiData.length) {
          setError("No chart data available");
          setOption(null);
          return;
        }
        // ✅ SORT BY DATE
        const sortedData = [...apiData].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        rawDatesRef.current = sortedData.map(item => item.date);
        // ✅ X-AXIS
        const xAxisData = sortedData.map((item) =>
          moment(item.date).format("D MMM")
        );

        // ✅ SERIES
        const series1P = sortedData.map((item) =>
          Number(item?.P1?.percentage ?? 0)
        );

        const series2P = sortedData.map((item) =>
          Number(item?.P2?.percentage ?? 0)
        );

        const series3P = sortedData.map((item) =>
          (Number(item?.P3?.percentage ?? 0))
        );

        const dynamicOption = {
          // tooltip: {
          //   trigger: "axis",
          //   backgroundColor: "#030229",
          //   textStyle: { color: "#fff" },
          //   formatter: (params) =>
          //     params.map((i) => `<b>${i.seriesName}</b> : ${i.value}%`).join("<br/>"),
          // },

          tooltip: {
            trigger: "axis",
            show: false,
            backgroundColor: "#030229",
            textStyle: { color: "#fff" },

            formatter: function (params) {
              // ✅ Date from X-axis
              const dateLabel = params[0]?.axisValue || "";

              // ✅ Build lines for 1P, 2P, 3P
              const lines = params.map(
                (i) => `<b>${i.seriesName}</b> : <b>${i.value}%<b>`
              ).join("<br/>");

              return `
      <div>
        <div style="font-weight:600; margin-bottom:6px;">${dateLabel}</div>
        ${lines}
      </div>
    `;
            }
          },


          legend: {
            show: false,
            selected: {
              "1P": activeLegend["1P"],
              "2P": activeLegend["2P"],
              "3P": activeLegend["3P"],
            },
          },

          grid: {
            left: "5%",
            right: "5%",
            top: "10%",
            bottom: "12%",
            containLabel: true,
          },

          xAxis: {
            type: "category",
            boundaryGap: false,
            data: xAxisData,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              color: "#8A94A6",
              fontSize: 12,
            },
          },

          yAxis: {
            type: "value",
            min: 0,
            max: 100,
            interval: 20,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              formatter: "{value}%",
              color: "#8A94A6",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "#D7DBE2",
              },
            },
          },

          series: [
            {
              name: "1P",
              type: "line",
              smooth: true,
              data: series1P,
              symbol: "circle",
              // symbol: "circle",      // correct value
              symbolSize: 8,         // dot size
              showSymbol: true,
              emphasis: {
              showSymbol: true,
              scale: true,
            },
              // itemStyle: {
              //   color: "#FF9900"     // ✅ dot color
              // },
              lineStyle: { width: 3, color: "#FF9900" },
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: "rgba(255,153,0,0.35)" },
                    { offset: 1, color: "rgba(255,153,0,0.05)" },
                  ],
                },
              },
            },
            {
              name: "2P",
              type: "line",
              smooth: true,
              data: series2P,
              symbol: "circle",
              symbolSize: 8,
              showSymbol: true,
              emphasis: {
                showSymbol: true,
                scale: true,
              },
              lineStyle: { width: 3, color: "#1890FF" },
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: "rgba(17,176,122,0.35)" },
                    { offset: 1, color: "rgba(17,176,122,0.05)" },
                  ],
                },
              },
            },
            {
              name: "3P",
              type: "line",
              smooth: true,
              data: series3P,
              symbol: "circle",
              symbolSize: 8,
              showSymbol: true,
              emphasis: {
                showSymbol: true,
                scale: true,
              },
              lineStyle: { width: 3, color: "#11B07A" },
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: "rgba(24,144,255,0.35)" },
                    { offset: 1, color: "rgba(24,144,255,0.05)" },
                  ],
                },
              },
            },
          ],
        };

        setOption(dynamicOption);
      } catch (err) {
        console.error("Chart API failed:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, [selectedFilters]);

  const handleChartClick = (params) => {
  if (params.componentType !== "series") return;

  const chart = chartRef.current.getEchartsInstance();
  const option = chart.getOption();

  const dataIndex = params.dataIndex;

  const allSeriesParams = option.series
    .filter((s) => s.type === "line")
    .map((s) => ({
      seriesName: s.name,
      value: s.data[dataIndex],
      color: s.lineStyle?.color,
      axisValue: option.xAxis[0].data[dataIndex],
    }));

  const tooltipHTML = formatTooltipHTML(allSeriesParams, dataIndex);

  const { offsetX, offsetY } = params.event;

  const tooltipWidth = 220;
  const chartWidth = chart.getWidth();

  const x =
    offsetX + tooltipWidth > chartWidth
      ? offsetX - tooltipWidth - 10
      : offsetX + 10;

  setTooltipData({
    html: tooltipHTML,
    position: { x, y: offsetY },
  });
};

  // ✅ LEGEND TOGGLE
  const toggleSeries = (seriesName) => {
    if (!chartRef.current) return;

    const chart = chartRef.current.getEchartsInstance();

    chart.dispatchAction({
      type: "legendToggleSelect",
      name: seriesName,
    });

    setActiveLegend((prev) => ({
      ...prev,
      [seriesName]: !prev[seriesName],
    }));
  };

  // ✅ AUTO RELOAD WHEN DATE CHANGES
  // useEffect(() => {
  //   fetchData();
  // }, [
  //   selectedFilters?.selectedDateRange?.startDate,
  //   selectedFilters?.selectedDateRange?.endDate,
  // ]);


  useEffect(() => {
    async function fetchData() {
      let currentData = await fetchBuyBoxTileData(filters, selectedFilters, selectedFilters.selectedPlatform);
      // let currentDataChart = await fetchPlatformChartData(filters, selectedFilters, selectedFilters.selectedPlatform);

      console.log('currentDatacurrentDatacurrentData', currentData)
      const avg = {};
      Object.keys(currentData)?.forEach(k => {
        if (!avg[k]) {
          avg[k] = {};
        }
        avg[k]['currentData'] = currentData[k];
      });
      console.log('avgavg', avg)
      setAveragePercentageData(avg);
    }
    fetchData();

  }, [selectedFilters]);

  const sellerShareConfig = [
    {
      key: "P1",
      title: "1P Seller Share",
      img: "/assets/images/master/seller.png",
      bgOuter: "#FFF1DB",
      bgInner: "#FF9700"
    },
    {
      key: "P2",
      title: "2P Seller Share",
      img: "/assets/images/master/sellershare-twoP.png",
      bgOuter: "#DFF0FF",
      bgInner: "#3369FF"
    },
    {
      key: "P3",
      title: "3P Seller Share",
      img: "/assets/images/master/sellershare-threeP.png",
      bgOuter: "#D0F0E5",
      bgInner: "#11B07A"
    }
  ];

  function formatPercentage(value) {
    const num = parseFloat(value);

    if (num >= 10) {
      return `${num.toFixed(1)}%`;
    } else {
      return `${value}%`;
    }
  }

useEffect(() => {
  const handleOutsideClick = (e) => {
    if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
      setTooltipData(null);
    }
  };

  if (tooltipData) {
    document.addEventListener("mousedown", handleOutsideClick);
  }

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, [tooltipData]);

  return (
    <div className="mx-auto px-2">
      {/* <!-- Top KPI row --> */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
        <div className="card card border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="flex items-center gap-4 h-full">
            <div className="h-full rounded-lg bg-[#E8F4FF] border border-slate-100">
              <img src="/assets/images/master/overall-win.png" alt="overall share" />
            </div>
            <div className="flex-1 flex flex-col justify-between h-full">
              <div className="text-[16px] font-medium text-[#000000D9]">Overall Win Rate</div>
              <div className="flex items-baseline gap-1">
                <div className="text-[16px] font-semibold text-[#329900]">{formatPercentage(averagePercentageData?.['P1']?.currentData?.percentage ?? 0)}</div>
                (<div className="flex">
                  <span className="text-[12px] text-[#329900]">{averagePercentageData?.['P1']?.currentData?.count} /</span>
                  <span className="text-[12px] text-[#DD4242] ml-1">{averagePercentageData?.['P2']?.currentData?.count + averagePercentageData?.['P3']?.currentData?.count}</span>
                </div>)
              </div>
            </div>
          </div>
        </div>

        {/* <div className="card card border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="flex gap-4">
            <div>
              <div className="h-full rounded-lg bg-[#E8F4FF] border border-slate-100">
                <img src="/assets/images/master/seller.png" alt="1P seller share" />
              </div>
            </div>
            <div className="flex-1">
              <div>
                <div className="text-[16px] font-medium text-[#000000D9]">1P Seller Share</div>
                <div className="text-lg font-semibold text-slate-800">89%</div>
              </div>
              <div className="mt-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-3 rounded-full bg-[#FFF1DB]">
                  <div className="h-full rounded-full w-[89%] bg-[#FF9700]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card card border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="flex gap-4">
            <div>
              <div className="h-full rounded-lg bg-[#E8F4FF] border border-slate-100">
                <img src="/assets/images/master/sellershare-twoP.png" alt="2p Seller share" />
              </div>
            </div>
            <div className="flex-1">
              <div>
                <div className="text-[16px] font-medium text-[#000000D9]">2P Seller Share</div>
                <div className="text-lg font-semibold text-slate-800">43%</div>
              </div>
              <div className="mt-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-3 rounded-full bg-[#DFF0FF]">
                  <div className="h-full rounded-full w-[43%] bg-[#3369FF]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card card border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="flex gap-4">
            <div>
              <div className="h-full rounded-lg bg-[#E8F4FF] border border-slate-100">
                <img src="/assets/images/master/sellershare-threeP.png" alt="3p seller share" />
              </div>
            </div>
            <div className="flex-1">
              <div>
                <div className="text-[16px] font-medium text-[#000000D9]">3P Seller Share</div>
                <div className="text-lg font-semibold text-slate-800">56%</div>
              </div>
              <div className="mt-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-3 rounded-full bg-[#D0F0E5]">
                  <div className="h-full rounded-full w-[56%] bg-[#11B07A]"></div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {sellerShareConfig.map((item) => {
          const rawPercentage = Number(
            averagePercentageData?.[item.key]?.currentData?.percentage ?? 0
          );

          // Show as float: 45.28
          const displayPercentage = rawPercentage.toFixed(2);

          return (
            <div key={item.key} className="card border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
              <div className="flex gap-4">

                {/* Icon */}
                <div>
                  <div className="h-full rounded-lg bg-[#E8F4FF] border border-slate-100">
                    <img src={item.img} alt={item.title} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div>
                    <div className="text-xs text-slate-500">{item.title}</div>

                    {/* ⬇️ Show 45.28 (NO %) */}
                    <div className="text-lg font-semibold text-slate-800">
                      {formatPercentage(displayPercentage)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-3 rounded-full" style={{ backgroundColor: item.bgOuter }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${rawPercentage}%`, // raw percentage for bar
                          backgroundColor: item.bgInner
                        }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* <!-- Main content: charts + table --> */}
      <div className="content bg-white px-4 py-4 rounded">

        <div className="flex -mx-[15px] gap-y-4 flex-wrap items-stretch">
          <div className="pl-4 w-[40%] flex-[0_0_auto] h-full">
            <div className="">
              <div className="w-full">

                <div className="pb-2 bg-white rounded-xl border shadow-sm">
                  {/* HEADER */}
                  <div className="flex items-center justify-between mb-3 border-b p-2">
                    <h3 className="text-[20px] font-medium text-[#000000]">
                      Graphical Analysis
                    </h3>

                    {/* ✅ LEGEND BUTTONS */}
                    <div className="flex gap-3 text-sm">
                      {["1P", "2P", "3P"].map((key) => (
                        <div
                          key={key}
                          onClick={() => toggleSeries(key)}
                          className={`flex cursor-pointer items-center gap-2 border px-3 py-[0.5px] rounded transition
                ${activeLegend[key]
                              ? "bg-[#ffffff] text-[#000000] border-[#D9D9D9]"
                              : "bg-gray-100 text-gray-400"
                            }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${key === "1P"
                              ? "bg-[#FF9900]"
                              : key === "2P"
                                ? "bg-[#1890FF]"
                                : "bg-[#11B07A]"
                              }`}
                          ></span>
                          <span className="text-[12px]">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ✅ LOADER */}
                  {loading && (
                    <div className="w-full h-[275px] flex items-center justify-center text-gray-500 p-4">
                      Loading chart...
                    </div>
                  )}

                  {/* ✅ ERROR UI */}
                  {!loading && error && (
                    <div className="w-full h-[275px] flex items-center justify-center text-red-500 p-4">
                      {error}
                    </div>
                  )}

                  {/* ✅ CHART */}
                  {!loading && !error && option && (
                    <div className="relative w-full h-[275px]">
                      <ReactECharts
                        ref={chartRef}
                        option={option}
                        style={{ width: "100%", height: "275px" }}
                        notMerge={true}
                        lazyUpdate={true}
                        onEvents={{
                          click: handleChartClick
                        }}
                        />
                        {tooltipData && (
                        <div ref={tooltipRef}>
                          <div
                            className="
                            absolute z-50
                            w-[220px]
                            rounded-md
                            bg-[#030229]
                            text-white
                            p-2.5
                            shadow-lg"
                            style={{
                              left: tooltipData.position.x,
                              top: tooltipData.position.y,
                            }}
                            dangerouslySetInnerHTML={{ __html: tooltipData.html }}
                          />
                        </div>
                      )}                  
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          <div className="px-4 w-[60%] flex-[0_0_auto] h-full">
            <div className="-mx-[15px] flex flex-wrap items-stretch">
              <div className="pl-4 w-[40%] flex-[0_0_auto] h-full">
                <div className="card border h-[344px] flex flex-col overflow-y-auto rounded-xl">
                  <div className="flex items-center justify-between mb-3 border-b py-2 px-3">
                    <h3 className="text-[20px] font-medium text-[#000000]">
                      Win Distribution
                    </h3>
                  </div>

                  <div className="p-4">
                    {/* ✅ DONUT */}
                    <div className="w-full h-full flex items-center justify-center mb-4">
                      <BuyBoxDonut
                        data={
                          averagePercentageData?.currentData
                            ? {
                              P1:
                                averagePercentageData?.P1?.currentData ?? {
                                  percentage: 0,
                                },
                              P2:
                                averagePercentageData?.P2?.currentData ?? {
                                  percentage: 0,
                                },
                              P3:
                                averagePercentageData?.P3?.currentData ?? {
                                  percentage: 0,
                                },
                            }
                            : averagePercentageData
                        }
                        focusKey={focusKey}
                        height={180}
                      />
                    </div>

                    {/* ✅ CUSTOM LEGEND */}
                    <div className="flex gap-3 items-center justify-end">
                      {/* 1P */}
                      <div
                        onClick={() => setFocusKey("P1")}
                        className={`cursor-pointer flex items-center text-xs border px-[8px] py-[3px] rounded 
                ${focusKey === "P1"
                            ? ""
                            : ""
                          }`}
                      >
                        <span className="bg-[#FF9901] w-2 h-2 rounded-full"></span>
                        <span className="pl-2">1P</span>
                      </div>

                      {/* 2P */}
                      <div
                        // onClick={() => setFocusKey("P2")}
                        className={`cursor-pointer flex items-center text-xs border px-[8px] py-[3px] rounded 
                ${focusKey === "P2"
                            ? ""
                            // ? "border-[#1890FF] bg-green-50"
                            : ""
                          }`}
                      >
                        <span className="bg-[#1890FF] w-2 h-2 rounded-full"></span>
                        <span className="pl-2">2P</span>
                      </div>

                      {/* 3P */}
                      <div
                        // onClick={() => setFocusKey("P3")}
                        className={`cursor-pointer flex items-center text-xs border px-[8px] py-[3px] rounded 
                ${focusKey === "P3"
                            ? ""
                            // ? "border-[#11B07A] bg-blue-50"
                            : ""
                          }`}
                      >
                        <span className="bg-[#11B07A] w-2 h-2 rounded-full"></span>
                        <span className="pl-2">3P</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SellerList />
            </div>
          </div>
          <BeakdownTable />
        </div>
      </div>
    </div>
  );
}

