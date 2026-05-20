import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
// import { BASE_URL } from '../../../utils/url';
import Loader from '../Loader';
import { useEbuxContext } from '../../Context/EbuxProvider';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdOutlineDragIndicator } from 'react-icons/md';
import { trackDashboardClick } from '../../../../analytics/EventController';

const ChartBox = React.memo(({ id, item, isShowPrevious, chartLable }) => {


  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS?.Transform?.toString(transform),
    transition,
    zIndex: transform ? 999 : 'auto',
    position: transform ? 'relative' : 'static',
  };
  const { getAveragePercentage, platformColor, brandSearchValue, percentageIcon, defaultOption } = useEbuxContext();
  const [optionGraph, setOptionGraph] = useState(defaultOption);
  const [loading,] = useState(false);

  const chartRef = useRef(null);

  const [activeSeries, setActiveSeries] = useState("");

  const { uniqueCurrentDURATION, uniquePreviousDURATION, currentData, previousData, currentAveragePercentage, previousAveragePercentage } = useMemo(() => {

    const uniqueCurrentDURATION = item?.currentData?.length ? Array.from((item?.currentData?.map(item => item.DURATION))) : [];
    const uniquePreviousDURATION = item?.previousData?.length ? Array.from((item?.previousData?.map(item => item.DURATION))) : [];
    const currentData = item?.currentData?.map(item => parseFloat(item.OUTPUT || 0));
    const previousData = item?.previousData?.map(item => parseFloat(item.OUTPUT || 0));
    const currentAveragePercentage = getAveragePercentage(currentData ?? [0]);
    const previousAveragePercentage = getAveragePercentage(previousData ?? [0]);
    return { uniqueCurrentDURATION, uniquePreviousDURATION, currentData, previousData, currentAveragePercentage, previousAveragePercentage };

  }, [item]);
  const memoizedOptionGraph = useMemo(() => {
    if (currentData?.length > 0 || previousData?.length > 0) {

      const currentAverageData = currentData?.map(() => parseFloat(currentAveragePercentage || 0));
      const previousAverageData = previousData?.map(() => parseFloat(previousAveragePercentage || 0));

      const series = [];
      if (activeSeries == "" || activeSeries == "Current") {
        series.push({
          name: "Current",
          type: 'line',
          areaStyle: platformColor["Current"]['area'] ?? platformColor['Amazon']['area'],
          itemStyle: {
            color: platformColor["Current"]['line'] ?? platformColor['Amazon']['line']
          },
          lineStyle: {
            type: 'solid',
            color: platformColor["Current"]['line'] ?? platformColor['Amazon']['line']
          },
          smooth: true,
          showSymbol: true,
          emphasis: {
            focus: 'series',
            showSymbol: true,
            // symbol: 'circle',
          },
          data: currentData
        });
        series.push({
          name: `Current ${chartLable} ${currentAveragePercentage} %`,
          type: 'line',
          itemStyle: {
            color: platformColor["Current"]['line'] ?? platformColor['Amazon']['line']
          },
          smooth: true,
          symbol: 'none',
          lineStyle: {
            type: 'dotted',
            color: platformColor["Current"]['line'] ?? platformColor['Amazon']['line']
          },
          emphasis: {
            focus: 'series',
          },
          data: currentAverageData
        });
      }
      if (isShowPrevious && (activeSeries == "" || activeSeries == "Previous")) {
        series.push({
          name: "Previous",
          type: 'line',
          itemStyle: {
            color: platformColor["Previous"]['line'] ?? platformColor['Amazon']['line']
          },
          smooth: true,
          showSymbol: false,
          lineStyle: {
            type: 'solid',
            color: platformColor["Previous"]['line'] ?? platformColor['Amazon']['line']
          },
          emphasis: {
            focus: 'series',
            showSymbol: true,
          },
          data: previousData
        });
        series.push({
          name: `Previous ${chartLable} ${previousAveragePercentage} %`,
          type: 'line',
          itemStyle: {
            color: platformColor["Previous"]['line'] ?? platformColor['Amazon']['line']
          },
          smooth: true,
          symbol: 'none',
          lineStyle: {
            type: 'dotted',
            color: platformColor["Previous"]['line'] ?? platformColor['Amazon']['line']
          },
          emphasis: {
            focus: 'series',
          },
          data: previousAverageData
        });
      }


      return {
        ...defaultOption,
        title: {
          show: false,
          text: item?.lable ?? '',
          top: 0,
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        grid: {
          left: "3%",
          right: "10%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          show: false,
          top: 15,
          icon: 'circle',
          right: 10,
          data: [`Current ${chartLable} ${currentAveragePercentage} %`, `Previous ${chartLable} ${previousAveragePercentage} %`]//[uniqueXAXIS]
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: uniqueCurrentDURATION,
          axisLabel: {
            // interval: intervalValue,
            formatter: function (value) {
              const parts = value.split('-');
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return `${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)}`; // e.g., 'Oct 01'
            },
            align: 'center',
            padding: [0, 0, 0, 0]
          },
        }],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: `{value}${percentageIcon}`,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#030229',
          textStyle: {
            color: '#fff',
          },
          formatter: function (params) {
            let tooltipContent = ``;
            let parts = [];
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            params.forEach((item) => {
              // eslint-disable-next-line no-console
              //console.log({item},{uniquePreviousDURATION});
              if (["Current", "Previous"].includes(item.seriesName)) {
                const axisValue = item.seriesName == "Previous" ? (uniquePreviousDURATION?.[item.dataIndex] ?? item.axisValue) : item.axisValue;
                parts = axisValue.split('-');
                tooltipContent += `${item.marker} ${item.seriesName} (${parts[2]}-${monthNames[parseInt(parts[1], 10) - 1]}-${parts[0]?.toString()?.slice(-2)}) <br/> ${item.data} ${percentageIcon}<br/>`;

              }
            });
            return tooltipContent;
          },
          extraCssText: 'width: 200px; white-space: normal;',
          borderColor: '#030229',
          borderWidth: 1,
          shadowBlur: 10,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        },
        series,
      };
    }
    return defaultOption;
  }, [activeSeries, uniqueCurrentDURATION, uniquePreviousDURATION, currentData, previousData, currentAveragePercentage, previousAveragePercentage, percentageIcon]);

  useEffect(() => {
    setOptionGraph(memoizedOptionGraph);
  }, [memoizedOptionGraph]);

  const downloadImage = () => {
    const echartsInstance = chartRef?.current?.getEchartsInstance();
    echartsInstance.setOption({
      legend: {
        show: true,
      },
      title: {
        show: true,
      },
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
      },
    });
  };

  const handleToggleSeries = (seriesKey) => {
    if (activeSeries == seriesKey) {
      setActiveSeries("");
    } else {
      setActiveSeries(seriesKey);
    }
  };

  // const chartRef = useRef(null);
  const resizeAnimationFrameRef = useRef(null);

  // useEffect(() => {
  //   const chartInstance = chartRef?.current?.getEchartsInstance();

  //   const handleResize = () => {
      
  //       // Cancel the previous animation frame if there’s one
  //       if (resizeAnimationFrameRef.current) {
  //         cancelAnimationFrame(resizeAnimationFrameRef.current);
  //       }

  //       // Use requestAnimationFrame to make resizing smoother
  //       resizeAnimationFrameRef.current = requestAnimationFrame(() => {
  //         if (chartInstance.current) {
  //           chartInstance.resize();
  //         }
  //       });
      
  //   };

  //   const resizeObserver = new ResizeObserver(handleResize);
    
  //   resizeObserver.observe(chartRef?.current?.getEchartsInstance()?.getDom());
   
  //   return () => {
  //     if (chartInstance.current) {
  //       chartInstance.current.dispose();
  //     }
  //     resizeObserver.disconnect();
  //     if (resizeAnimationFrameRef.current) {
  //       cancelAnimationFrame(resizeAnimationFrameRef.current);
  //     }
  //   };
  // }, []);


   useEffect(() => {
  const chartInstance = chartRef?.current?.getEchartsInstance();
  const domNode = chartInstance?.getDom?.();

  if (!domNode || !(domNode instanceof Element)) {
    return; // 🚀 Skip until we have a real element
  }

  const handleResize = () => {
    if (resizeAnimationFrameRef.current) {
      cancelAnimationFrame(resizeAnimationFrameRef.current);
    }

    resizeAnimationFrameRef.current = requestAnimationFrame(() => {
      chartInstance?.resize?.();
    });
  };

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(domNode); // ✅ Safe

  return () => {
    resizeObserver.disconnect();
    if (resizeAnimationFrameRef.current) {
      cancelAnimationFrame(resizeAnimationFrameRef.current);
    }
    chartInstance?.dispose?.();
  };
}, []);

  return (
    <>
      {(loading || (item?.currentData?.length > 0) && ((brandSearchValue == '' || ((item?.lable?.toLowerCase())?.includes(brandSearchValue?.toLowerCase()))))) &&
        <div className="categoryChartBox border-2 border-yellow-700"
          ref={setNodeRef}
          style={style}>
          <Loader show={loading} />
          <>
            <div className="categoryChartHead">
              <h4>
                <MdOutlineDragIndicator
                  {...listeners}
                  {...attributes}
                />
                {item?.lable ?? ''}</h4>
              <div className="graphLegend chartLegend">
                <button type="button" className={`catLegendBtn ${["Current", ""].includes(activeSeries) ? "" : "opacity-40"}`} onClick={() => handleToggleSeries("Current")}><span className="currentCircle"></span> Current {chartLable} {currentAveragePercentage}%</button>
                {isShowPrevious && (<button type="button" className={`catLegendBtn ${["Previous", ""].includes(activeSeries) ? "" : "opacity-40"}`} onClick={() => handleToggleSeries("Previous")}><span className="previousCircle"></span> Previous {chartLable} {previousAveragePercentage}%</button>)}
                <button type="button" onClick={(e)=>{
                  trackDashboardClick({section:'category focus',eventcategory:item?.lable?.toLowerCase(),eventaction:e.type})
                  downloadImage()
                }}><img src="/assets/images/downloadIcon.svg" width={18} height={18} /></button>
              </div>
            </div>
            <ReactECharts
              ref={chartRef}
              notMerge={true}
              lazyUpdate={true}
              option={optionGraph}
              style={{ height: '300px', width: '100%'  }}
            />
          </>
          {/* } */}
        </div>}
    </>
  );
});

ChartBox.displayName = 'ChartBox';
export default ChartBox;