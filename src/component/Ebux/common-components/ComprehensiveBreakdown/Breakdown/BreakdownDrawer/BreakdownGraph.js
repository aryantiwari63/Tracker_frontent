import { useEffect, useMemo, useRef, useState } from "react";
import ReactECharts from 'echarts-for-react';
import { useEbuxContext } from "../../../../Context/EbuxProvider";

import Loader from "../../../Loader";
const BreakdownGraph = ({graphOutputKey=null, drawerInfo, reportTableData = [], perviousReportTableData = [], loading, breakdownPerformance = {} }) => {
  const {
    platformColor,
    percentageIcon,
    defaultOption
  } = useEbuxContext();



  const chartRef = useRef(null);
  const [seriesVisibility, setSeriesVisibility] = useState({});
  const [activeSeries, setActiveSeries] = useState("");

  const [optionGraph, setOptionGraph] = useState(defaultOption);
  const getMemoizedOption = (data) => {
    if (data?.length) {
      // eslint-disable-next-line no-console
      // console.log({ data });


      let groupedData = {};
      const _uniqueDURATION = [];
      if (data?.length) {
        data?.forEach(data => {
          _uniqueDURATION.push(data?.date);
          Object.keys(data)?.forEach(key => {
            if (key != 'date' && key != 'avg') {
              if (!groupedData[key]) {
                groupedData[key] = {}
              }
              groupedData[key][data?.date] = data?.[key]?.[graphOutputKey??breakdownPerformance?.GraphOutputKey] ?? 0;
              // groupedData[key][data?.date] = data?.[key]?.[breakdownPerformance?.GraphOutputKey];
            }
          })
        });
      }

      const uniqueXAXIS = Object.keys(groupedData);
      console.log({_uniqueDURATION});
      console.log({groupedData});

      const _seriesVisibility = uniqueXAXIS?.reduce((acc, item) => {
        acc[item] = true;
        return acc;
      }, {});
      setSeriesVisibility(_seriesVisibility);
      return { uniqueDURATION: [...new Set(_uniqueDURATION)], groupedData, uniqueXAXIS };
    } else {
      return { uniqueDURATION: [], groupedData: {}, uniqueXAXIS: [] };
    }
  }

  const memoizedOption = useMemo(() => {
    if (reportTableData?.length) {
      const row = reportTableData.slice(0, -1);
      return getMemoizedOption(row);
    }
    return [];
  }, [reportTableData,graphOutputKey]);

  const perviousMemoizedOption = useMemo(() => {
    if (perviousReportTableData?.length) {
      const row = perviousReportTableData.slice(0, -1);
      return getMemoizedOption(row);
    }
    return [];
  }, [perviousReportTableData]);

  const addSeries = (data, isPervious = false) => {
    const series = [];
    const { uniqueDURATION, groupedData, uniqueXAXIS } = data;
    if (uniqueDURATION?.length > 0) {

      uniqueXAXIS?.forEach((item) => {
        //console.log({item});
        
        if (seriesVisibility?.[item]|| item == "Average") {
          let data = Object.values(groupedData?.[item]).map(
            (i) => parseFloat(i ?? 0) || 0
          );
          series.push({
            name: isPervious ? `Previous ${item}` : item,
            type: "line",
            areaStyle: isPervious ? null : (platformColor?.[item]?.["area"] ?? platformColor["Amazon"]["area"]),
            itemStyle: {
              color:
                platformColor?.[item]?.["line"] ?? platformColor["Amazon"]["line"], // Set your desired line color here (e.g., blue)
            },
            lineStyle: {
              type: isPervious ? 'dotted' : 'solid',
              color:
                platformColor?.[item]?.["line"] ?? platformColor["Amazon"]["line"], // Set the line color (you can use the same or different color from itemStyle)
            },
            smooth: true,
            showSymbol: false,
            emphasis: {
              focus: "series",
              showSymbol: true
            },
            data,
          });
        }
        return null;
      });
    }
    return series;
  }
  const memoizedOptionGraph = useMemo(() => {


    const { uniqueDURATION, uniqueXAXIS } = memoizedOption;
    const { uniqueDURATION: previousUniqueDURATION } = perviousMemoizedOption;
    const series = addSeries(memoizedOption, false);
    const pseries = addSeries(perviousMemoizedOption, true);


    if (series.length > 0) {
      let _lables="";
      if(drawerInfo?.multiple && drawerInfo?.value?.length>3){
        _lables="Multiple Values Selected";
      }else if(drawerInfo?.multiple){
        drawerInfo?.value?.forEach((item,i) =>{
          if(item?.lable){
            _lables+=((i>0)?", ":"");
            _lables+=item?.lable;
          }
        })
      }else{
        _lables=drawerInfo?.lable??"";
      }
        
      return {
        ...defaultOption,
        title: {
          show: false,
          text: `Comprehensive Breakdown Graphical Analysis of Selected ${drawerInfo?.column} - ${_lables}`,
          // subtext:`${_lables}`,
          top: 0,
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        // grid: {
        //   left: "3%",
        //   right: "4%",
        //   bottom: "3%",
        //   containLabel: true,
        // },
        legend: {
          show: false,
          icon: 'circle',
          top: 15,
          right: 10,
          data: uniqueXAXIS,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: uniqueDURATION,
          axisLabel: {
            // interval: 0,
            // rotate: 30,
            formatter: function (value) {
              const parts = value.split('-');
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return `${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)}`; // e.g., 'Oct 01'
            },
            align: 'center',
            padding: [0, 0, 0, 0]
          },
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: `{value}${percentageIcon}`,
            },
            splitLine: {
              show: false,
            },
            alignTicks: false,
          },
        ],
        tooltip: {
          trigger: "axis",
          backgroundColor: "#030229",
          textStyle: {
            color: "#fff",
          },

          formatter: function (params) {
            let curent = "";
            let curentData = "";
            let previous = "";
            let previousData = "";
            let parts = [];
            let value = '';
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            params.forEach((item) => {
              if (item.seriesName.includes("Previous")) {
                value = previousUniqueDURATION?.[item.dataIndex] ?? item.axisValue;
                parts = value.split('-');

                previous = `Previous (${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)})<br/>`;
                previousData += `${item.marker} ${item.seriesName.replace("Previous ", "")}: ${item.data} ${percentageIcon}<br/>`
              } else {
                value = item.axisValue;
                parts = value.split('-');


                curent = `Current (${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)})<br/>`;
                curentData += `${item.marker} ${item.seriesName}: ${item.data} ${percentageIcon}<br/>`;
              }
            });
            return curent + curentData + previous + previousData;
          },
          extraCssText: "width: 200px; white-space: normal;",
          borderColor: "#030229",
          borderWidth: 1,
          shadowBlur: 10,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowColor: "rgba(0, 0, 0, 0.3)",
        },
        series: [...series, ...pseries]
      };
    }
    return defaultOption;
  }, [memoizedOption, perviousMemoizedOption, seriesVisibility]);
  useEffect(() => {
    setOptionGraph(memoizedOptionGraph);
  }, [memoizedOptionGraph]);

  const handleToggleSeries = (seriesKey) => {
    if (activeSeries == seriesKey) {
      setActiveSeries("");
      setSeriesVisibility((prevState) =>
        Object.fromEntries(
          Object.entries(prevState).map(([key]) => [key, true])
        )
      );
    } else {
      setActiveSeries(seriesKey);
      setSeriesVisibility((prevState) =>
        Object.fromEntries(
          Object.entries(prevState).map(([key]) =>
            key == seriesKey ? [key, true] : [key, false]
          )
        )
      );
    }
  };
  const downloadImage = () => {
    const echartsInstance = chartRef.current.getEchartsInstance();
    echartsInstance.setOption({
      legend: {
        show: true,
      },
      title: {
        show: true,
      }
    });
    const imgData = echartsInstance.getDataURL({
      type: "png", // You can also set this to 'jpeg'
      pixelRatio: 2,
      backgroundColor: "#fff",
    });

    // Create a temporary link element to trigger the download
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
      title: {
        show: false,
      }
    });
  };
// const chartRef = useRef(null);
  const resizeAnimationFrameRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current.getEchartsInstance();

    const handleResize = () => {
      // Cancel the previous animation frame if there’s one
      if (resizeAnimationFrameRef.current) {
        cancelAnimationFrame(resizeAnimationFrameRef.current);
      }

      // Use requestAnimationFrame to make resizing smoother
      resizeAnimationFrameRef.current = requestAnimationFrame(() => {
        chartInstance.resize();
      });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartRef.current.getEchartsInstance().getDom());

    return () => {
      resizeObserver.disconnect();
      if (resizeAnimationFrameRef.current) {
        cancelAnimationFrame(resizeAnimationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="border rounded p-3 w-full pb-6" style={{ height: 'calc(100% - 40px)' }}>
      <div className="flex justify-between items-center w-full">
        <label className="font-semibold text-sm">
          Graphical Analysis
          {loading && <Loader show={loading} fullScreen={false} />}
        </label>
        <div className="graphLegend">
          {Object.keys(seriesVisibility)?.map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => handleToggleSeries(i)}
              className={`catLegendBtn ${seriesVisibility[i] ? "" : "opacity-40"
                }`}
            >
              <span
                className="platformCircle"
                style={{
                  backgroundColor: `${platformColor[i]?.line ?? "#FF9901"
                    }`,
                }}
              ></span>{" "}
              {i}
            </button>
          ))}
          <button type="button"
            onClick={() => downloadImage()}>
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
        option={optionGraph}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

export default BreakdownGraph;
