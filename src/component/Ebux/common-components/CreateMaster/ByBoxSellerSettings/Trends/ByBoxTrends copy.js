import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
// import { getByBoxTrendGraphicalData } from "../../../services/ebuxMaster.service";
import moment from "moment";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { fetchBuyBoxTileData, fetchPlatformChartData } from "../../../../services/ebuxMaster.service";

export default function ByBoxTrends() {
  const {
    selectedFilters,
    filters,
  } = useEbuxContext();

  const chartRef = useRef(null);

  const [averagePercentageData, setAveragePercentageData] = useState({});

  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(false);      // ✅ Loader
  const [error, setError] = useState("");             // ✅ Error state

  // ✅ Legend UI State
  const [activeLegend, setActiveLegend] = useState({
    "1P": true,
    "2P": true,
    "3P": true,
  });

  // ✅ API FETCH
  // const fetchData = async () => {
  //   try {
  //     const startDate = selectedFilters?.selectedDateRange?.startDate;
  //     const endDate = selectedFilters?.selectedDateRange?.endDate;

  //     if (!startDate || !endDate) return;

  //     setLoading(true);
  //     setError("");

  //     // const res = await getByBoxTrendGraphicalData({ startDate, endDate });
  //     const res = await fetchPlatformChartData(filters, selectedFilters, selectedFilters.selectedPlatform);
  //     const apiData = res || {};
  //     if (!Object.keys(apiData).length) {
  //       setError("No chart data available");
  //       setOption(null);
  //       return;
  //     }

  //     const dates = Object.keys(res);
  //     console.log('datesdates',apiData)

  //     const xAxisData = dates.map((date) =>
  //       moment(date).format("D MMM")
  //     );

  //     const series1P = dates.map((d) => apiData[d]?.["1P"] ?? 0);
  //     const series2P = dates.map((d) => apiData[d]?.["2P"] ?? 0);
  //     const series3P = dates.map((d) => apiData[d]?.["3P"] ?? 0);

  //     const dynamicOption = {
  //       tooltip: {
  //         trigger: "axis",
  //         backgroundColor: "#030229",
  //         textStyle: { color: "#fff" },
  //         formatter: (params) =>
  //           params
  //             .map((i) => `<b>${i.seriesName}</b> : ${i.value}%`)
  //             .join("<br/>"),
  //       },

  //       legend: {
  //         show: false,
  //         selected: {
  //           "1P": activeLegend["1P"],
  //           "2P": activeLegend["2P"],
  //           "3P": activeLegend["3P"],
  //         },
  //       },

  //       grid: {
  //         left: "5%",
  //         right: "5%",
  //         top: "10%",
  //         bottom: "12%",
  //         containLabel: true,
  //       },

  //       xAxis: {
  //         type: "category",
  //         boundaryGap: false,
  //         data: xAxisData,
  //         axisLine: { show: false },
  //         axisTick: { show: false },
  //         axisLabel: {
  //           color: "#8A94A6",
  //           fontSize: 12,
  //         },
  //       },

  //       yAxis: {
  //         type: "value",
  //         min: 0,
  //         max: 100,
  //         interval: 20,
  //         axisLine: { show: false },
  //         axisTick: { show: false },
  //         axisLabel: {
  //           formatter: "{value}%",
  //           color: "#8A94A6",
  //         },
  //         splitLine: {
  //           lineStyle: {
  //             type: "dashed",
  //             color: "#D7DBE2",
  //           },
  //         },
  //       },

  //       series: [
  //         {
  //           name: "1P",
  //           type: "line",
  //           smooth: true,
  //           data: series1P,
  //           symbol: "none",
  //           lineStyle: { width: 3, color: "#FF9900" },
  //           areaStyle: {
  //             color: {
  //               type: "linear",
  //               x: 0,
  //               y: 0,
  //               x2: 0,
  //               y2: 1,
  //               colorStops: [
  //                 { offset: 0, color: "rgba(255,153,0,0.35)" },
  //                 { offset: 1, color: "rgba(255,153,0,0.05)" },
  //               ],
  //             },
  //           },
  //         },
  //         {
  //           name: "2P",
  //           type: "line",
  //           smooth: true,
  //           data: series2P,
  //           symbol: "none",
  //           lineStyle: { width: 3, color: "#11B07A" },
  //           areaStyle: {
  //             color: {
  //               type: "linear",
  //               x: 0,
  //               y: 0,
  //               x2: 0,
  //               y2: 1,
  //               colorStops: [
  //                 { offset: 0, color: "rgba(17,176,122,0.35)" },
  //                 { offset: 1, color: "rgba(17,176,122,0.05)" },
  //               ],
  //             },
  //           },
  //         },
  //         {
  //           name: "3P",
  //           type: "line",
  //           smooth: true,
  //           data: series3P,
  //           symbol: "none",
  //           lineStyle: { width: 3, color: "#1890FF" },
  //           areaStyle: {
  //             color: {
  //               type: "linear",
  //               x: 0,
  //               y: 0,
  //               x2: 0,
  //               y2: 1,
  //               colorStops: [
  //                 { offset: 0, color: "rgba(24,144,255,0.35)" },
  //                 { offset: 1, color: "rgba(24,144,255,0.05)" },
  //               ],
  //             },
  //           },
  //         },
  //       ],
  //     };

  //     setOption(dynamicOption);
  //   } catch (err) {
  //     console.error("Chart API failed:", err);
  //     setError("Failed to load chart data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // inside your component: replace existing fetchData with this
  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");

  //     const res = await fetchPlatformChartData(filters, selectedFilters, selectedFilters.selectedPlatform);
  //     const dataArray = res ?? [];

  //     if (!dataArray.length) {
  //       setError("No chart data available");
  //       setOption(null);
  //       return;
  //     }

  //     // ✅ Sort by date
  //     const sortedData = [...dataArray].sort(
  //       (a, b) => new Date(a.date) - new Date(b.date)
  //     );

  //     const xAxisData = sortedData.map((item) =>
  //       moment(item.date).format("D MMM")
  //     );

  //     const series1P = sortedData.map((item) => Number(item?.P1?.percentage ?? 0));
  //     const series2P = sortedData.map((item) => Number(item?.P2?.percentage ?? 0));
  //     const series3P = sortedData.map((item) => Number(item?.P3?.percentage ?? 0));

  //     const dynamicOption = {
  //       tooltip: {
  //         trigger: "axis",
  //         formatter: (params) =>
  //           params.map((i) => `${i.seriesName}: ${i.value}%`).join("<br/>"),
  //       },

  //       xAxis: {
  //         type: "category",
  //         data: xAxisData,
  //       },

  //       yAxis: {
  //         type: "value",
  //         min: -5,    // ✅ SHOW ZERO LINE
  //         max: 100,
  //       },

  //       series: [
  //         {
  //           name: "1P",
  //           type: "line",
  //           data: series1P,
  //           symbol: "circle",     // ✅ SHOW DOT
  //           symbolSize: 6,
  //         },
  //         {
  //           name: "2P",
  //           type: "line",
  //           data: series2P,
  //           symbol: "circle",
  //           symbolSize: 6,
  //         },
  //         {
  //           name: "3P",
  //           type: "line",
  //           data: series3P,
  //           symbol: "circle",
  //           symbolSize: 6,
  //         },
  //       ],
  //     };

  //     setOption(dynamicOption);
  //   } catch (err) {
  //     console.error("Chart API failed:", err);
  //     setError("Failed to load chart data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


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
        Number(item?.P3?.percentage ?? 0)
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
          backgroundColor: "#030229",
          textStyle: { color: "#fff" },

          formatter: function (params) {
            // ✅ Date from X-axis
            const dateLabel = params[0]?.axisValue || "";

            // ✅ Build lines for 1P, 2P, 3P
            const lines = params.map(
              (i) => `<b>${i.seriesName}</b> : ${i.value}%`
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
            symbol: "none",
            // symbol: "circle",      // correct value
            // symbolSize: 8,         // dot size
            // showSymbol: true,
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
            symbol: "none",
            lineStyle: { width: 3, color: "#11B07A" },
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
            symbol: "none",
            lineStyle: { width: 3, color: "#1890FF" },
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
  useEffect(() => {
    fetchData();
  }, [
    selectedFilters?.selectedDateRange?.startDate,
    selectedFilters?.selectedDateRange?.endDate,
  ]);


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
              <div className="flex items-baseline gap-3">
                <div className="text-[16px] font-semibold text-[#329900]">96%</div>
                (<div className="flex">
                  <span className="text-[12px] text-[#329900]">+{averagePercentageData?.['P1']?.currentData?.count} /</span>
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
                      {displayPercentage}%
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
                              : "bg-gray-100 text-gray-400 line-through"
                            }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${key === "1P"
                              ? "bg-[#FF9900]"
                              : key === "2P"
                                ? "bg-[#11B07A]"
                                : "bg-[#1890FF]"
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
                    <div className="w-full h-[275px]">
                      <ReactECharts
                        ref={chartRef}
                        option={option}
                        style={{ width: "100%", height: "275px" }}
                        notMerge={true}
                        lazyUpdate={true}
                      />
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
                    <h3 className="text-[20px] font-medium text-[#000000]">Win Distribution</h3>
                  </div>
                  <div className="p-4">
                    <div className="w-full h-full flex items-center justify-center mb-4">
                      <svg viewBox="0 0 42 42" className="w-36 h-36">
                        <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#f3f4f6"
                          strokeWidth="8" />
                        <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#f59e0b"
                          strokeWidth="8" strokeDasharray="60 40" strokeDashoffset="25"
                          strokeLinecap="butt" />
                        <circle cx="21" cy="21" r="11.9155" fill="#fff" />
                        <text x="21" y="23.5" fontSize="6" textAnchor="middle" fill="#0f172a"
                          fontWeight="600">1P: 60%</text>
                      </svg>
                    </div>

                    <div className="flex gap-3 items-center justify-end">
                      <div className="flex items-center text-xs border px-[8px] py-[3px] rounded">
                        <span className=" bg-[#FF9901] w-2 h-2 rounded-full pr-2"></span> <span className="pl-2">1P</span>
                      </div>
                      <div className="flex items-center text-xs border px-[8px] py-[3px] rounded">
                        <span className="bg-[#11B07A] w-2 h-2 rounded-full pr-2"></span> <span className="pl-2">2P</span>
                      </div>
                      <div className="flex items-center text-xs border px-[8px] py-[3px] rounded">
                        <span className="bg-[#1890FF] w-2 h-2 rounded-full"></span> <span className="pl-2">3P</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 w-[60%] flex-[0_0_auto]">
                <div className="card border h-[344px] flex flex-col border rounded-xl">
                  <div className="flex items-center justify-between mb-3 border-b py-2 px-3">
                    <h3 className="text-[20px] font-medium text-[#000000]">Top Competitors</h3>
                    <select className="border rounded text-[12px] text-[#000000] bg-white px-2">
                      <option value="">Sort by: Low to High</option>
                    </select>
                  </div>

                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex gap-4 justify-between items-center">
                        <p className="mb-0 text-[14px] font-medium">Xyz Seller</p>
                        <p className="mb-0 text-[14px] font-medium">60%</p>
                      </div>
                      <div className="mt-3 h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-3 rounded-full bg-[#0081F733]">
                          <div className="h-full rounded-full w-[60%] bg-[#0081F7]"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex gap-4 justify-between items-center">
                        <p className="mb-0 text-[14px] font-medium">Amazon Retail</p>
                        <p className="mb-0 text-[14px] font-medium">45%</p>
                      </div>
                      <div className="mt-3 h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-3 rounded-full bg-[#0081F733]">
                          <div className="h-full rounded-full w-[45%] bg-[#0081F7]"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex gap-4 justify-between items-center">
                        <p className="mb-0 text-[14px] font-medium">Retail Deals Inc.</p>
                        <p className="mb-0 text-[14px] font-medium">76%</p>
                      </div>
                      <div className="mt-3 h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-3 rounded-full bg-[#0081F733]">
                          <div className="h-full rounded-full w-[76%] bg-[#0081F7]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 w-full flex-[0_0_auto]">
            <div className="card border rounded-xl">
              <div className="flex items-center justify-between border-b py-2 px-3">
                <h3 className="text-[18px] font-medium text-[#000000]">Comprehensive Breakdown</h3>
                <img src="/assets/images/master/columns.png" alt="columngs img" />
              </div>

              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-fixed text-sm text-left border-collapse no-zebra">
                <thead className="bg-[#FAFAFA] sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[14px] text-[#000000]">Location</span>
                        <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                      </div>
                    </th>

                    <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                      <div className="flex items-center justify-between">
                        <span>Products Name</span>
                        <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                      </div>
                    </th>

                    <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                      <div className="flex items-center justify-between">
                        <span>Seller Type</span>
                        <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                      </div>
                    </th>

                    <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                      <div className="flex items-center justify-between">
                        <span>Win Rate</span>
                        <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                      </div>
                    </th>

                    <th className="px-4 py-3 text-sm font-medium border-b border-gray-200 w-[20%]">
                      Last Check On
                    </th>
                  </tr>
                </thead>
                <tbody
                className="
                  text-gray-700
                  [&_td]:bg-transparent
                  [&_td]:border-r [&_td]:border-gray-200
                  [&_td:last-child]:border-r-0
                  [&_tr]:border-b [&_tr]:border-gray-200
                "
                >
                <tr>
                  <td
                    rowSpan={3}
                    className="px-4 py-4 font-normal align-middle border-r border-gray-200"
                  >
                    Sao Paulo
                  </td>

                  <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">All</td>

                  <td className="px-4 py-4 space-y-1 font-normal text-[14px] text-[#000000]">
                    <div>1P</div>
                    <div>2P</div>
                    <div>3P</div>
                  </td>

                  <td className="px-4 py-4 space-y-1 font-medium">
                    <div>45%</div>
                    <div>45%</div>
                    <div>45%</div>
                  </td>

                  <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">04-11-2025</td>
                </tr>

                <tr>
                  <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">
                    Air Wick Freshmatic Automatic Spray – Lavender &amp; Lotus
                  </td>

                  <td className="px-4 py-4 space-y-1 font-normal text-[14px] text-[#000000]">
                    <div>1P</div>
                    <div>2P</div>
                    <div>3P</div>
                  </td>

                  <td className="px-4 py-4 space-y-1 font-medium">
                    <div className="font-medium text-[14px] text-[#000000]">45%</div>
                    <div>25%</div>
                    <div>30%</div>
                  </td>

                  <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">04-11-2025</td>
                </tr>

                <tr>
                  <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">
                    Aerosol Room Spray – Apple Cinnamon Medley
                  </td>

                  <td className="px-4 py-4 space-y-1 font-normal text-[14px] text-[#000000]">
                    <div>1P</div>
                    <div>2P</div>
                    <div>3P</div>
                  </td>

                  <td className="px-4 py-4 space-y-1 font-medium">
                    <div>25%</div>
                    <div>15%</div>
                    <div>30%</div>
                  </td>

                  <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">04-11-2025</td>
                </tr>

                <tr>
                  <td className="px-4 py-4 font-normal">Rio de Janeiro</td>

                  <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">All</td>

                  <td className="px-4 py-4 space-y-1 font-normal text-[14px] text-[#000000]">
                    <div>1P</div>
                    <div>2P</div>
                    <div>3P</div>
                  </td>

                  <td className="px-4 py-4 space-y-1 font-medium">
                    <div>45%</div>
                    <div>45%</div>
                    <div>45%</div>
                  </td>

                  <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">04-11-2025</td>
                </tr>
                </tbody>

                <tfoot>
                  <tr className="bg-gray-50 border-t">
                    <td className="px-4 py-4">
                      <p className="text-[#000000] text-normal text-[12px]">Total Location</p>
                      <p className="font-medium">2</p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-[#000000] text-normal text-[12px]">Total Products</p>
                      <p className="font-medium">100</p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-[#000000] text-normal text-[12px]">Total Seller Type</p>
                      <p className="font-medium">3</p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-[#000000] text-normal text-[12px]">Average Win Rate</p>
                      <p className="font-medium">35%</p>
                    </td>

                    <td></td>
                  </tr>
                </tfoot>
                </table>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

