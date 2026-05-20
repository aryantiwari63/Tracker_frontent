import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import './style.css';
import { fetchOOSDaysOverviewData } from '../../services/service';
import { useEbuxContext } from '../../../../../Context/EbuxProvider';
import moment from 'moment';
import Loader from '../../../../../common-components/Loader';
const isShowDummyData = false;
const categories = (!isShowDummyData) ? [] : [
  'Coffee', 'Tea', 'Noodles', 'Chocolate', 'Dairy Products', 'Breakfast Cereals', 'Ice Creams',
  '1-Coffee', '1-Tea', '1-Noodles', '1-Chocolate', '1-Dairy Products', '1-Breakfast Cereals', '1-Ice Creams',
  '2-Coffee', '2-Tea', '2-Noodles', '2-Chocolate', '2-Dairy Products', '2-Breakfast Cereals', '2-Ice Creams'];
const bubbleData = (!isShowDummyData) ? [] : [
  [0, 24, 48], [0, 16, 30], [0, 12, 50], [0, 6, 12],
  [1, 12, 30], [1, 6, 20],
  [2, 12, 30], [2, 6, 20],
  [3, 24, 48], [3, 16, 54], [3, 6, 24],
  [4, 16, 36], [4, 12, 20], [4, 6, 25],
  [5, 16, 54], [5, 12, 75], [5, 18, 24], [5, 6, 18],
  [6, 16, 75], [6, 12, 48],

  [7, 24, 48], [7, 16, 30], [7, 12, 50], [7, 6, 12],
  [8, 12, 30], [8, 6, 20],
  [9, 12, 30], [9, 6, 20],
  [10, 24, 48], [10, 16, 54], [10, 6, 24],
  [11, 16, 36], [11, 12, 20], [11, 6, 25],
  [12, 16, 54], [12, 12, 75], [12, 18, 24], [12, 6, 18],
  [13, 16, 75], [13, 12, 48],

  [14, 24, 48], [14, 16, 30], [14, 12, 50], [14, 6, 12],
  [15, 12, 30], [15, 6, 20],
  [16, 12, 30], [16, 6, 20],
  [17, 24, 48], [17, 16, 54], [17, 6, 24],
  [18, 16, 36], [18, 12, 20], [18, 6, 25],
  [19, 16, 54], [19, 12, 75], [19, 18, 24], [19, 6, 18],
  [20, 16, 75], [20, 88, 48]
];
const OosDaysOverviewComponent = ({ setDrawerInfo }) => {
  const {
    filters,
    selectedFilters
  } = useEbuxContext();
  const [apiResponse, setApiResponse] = useState({});
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const viewOptions = ['Category', 'Location', 'Platform'];
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedView, setSelectedView] = useState('Category');
  const [loading, setLoading] = useState(false);

  // Function to truncate long text with ellipsis
  const truncateLabel = (text, maxLength = 10) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);

      const categoriesForAxis = (apiResponse?.categories ?? categories ?? []);
      const defaultVisibleCount = 7;
      // const endPercent = (defaultVisibleCount / categoriesForAxis.length) * 100;
      const endPercent = defaultVisibleCount;
      // const bubbleValues = (apiResponse?.bubbleData ?? bubbleData ?? []).map(d => d?.[2] ?? 0);
      // const minVal = Math.min(...bubbleValues);
      // const maxVal = Math.max(...bubbleValues);
      // const minSize = 5;
      // const maxSize = 99;
      const option = {
        backgroundColor: '#fff',
        grid: {
          left: 80,
          right: 20,
          top: '10%',
          bottom: 100,
          containLabel: true
        },

        // ---- xAxis ----
        xAxis: {
          type: 'category',
          data: categoriesForAxis,
          boundaryGap: true, //['10%', '10%'],
          splitNumber: categoriesForAxis.length,
          axisLine: { show: false },
          axisTick: {
            show: true,
            alignWithLabel: true,
            length: 14,
            lineStyle: { color: '#6d5cae', width: 1.5 }
          },
          axisLabel: {
            fontSize: 12,
            color: '#bdbdbd',
            margin: 21,
            interval: 0,
            fontWeight: 400,
            formatter: function (value) {
              // Truncate long labels first
              const truncatedValue = truncateLabel(value, 10);

              // For values that don't need truncation, handle line breaks
              if (typeof truncatedValue === 'string' && truncatedValue.includes(' ')) {
                return truncatedValue.split(' ').join('\n');
              }
              return truncatedValue;
            }
          },
          splitLine: {
            show: true,
            alignWithLabel: true,
            lineStyle: { color: '#e5e7eb', width: 1, type: 'dashed' }
          },

          // x-axis name (uses selectedView)
          name: selectedView,
          nameLocation: 'center',
          nameGap: 65,
          nameTextStyle: {
            color: '#9ca3af',
            fontSize: 14,
            fontWeight: 400,
            align: 'center'
          }
        },

        // ---- yAxis ----
        yAxis: {
          type: 'value',
          min: 0,
          max: function (value) { return value.max + 2; },
          axisLine: { show: false },
          axisTick: {
            show: true,
            length: 14,
            lineStyle: { color: '#6d5cae', width: 1.5 }
          },
          axisLabel: { fontSize: 12, color: '#9ca3af', fontWeight: 400, margin: 20 },
          splitLine: {
            show: true,
            lineStyle: { color: '#e5e7eb', width: 1, type: 'dashed' }
          },

          // y-axis name
          name: 'OOS Days',
          nameLocation: 'middle',
          nameGap: 48,
          nameRotate: 90,
          nameTextStyle: {
            color: '#9ca3af',
            fontSize: 14,
            fontWeight: 400,
            align: 'center'
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: 0,
            height: 20,
            bottom: 30,
            start: 0,
            end: endPercent,
            handleSize: '40%',
            // zoomLock: true,
            showDetail: false,
            showDataShadow: false,
            borderColor: '#e5e7eb',
            backgroundColor: '#f3f4f6',
            fillerColor: '#c7d2fe',
            handleIcon: 'M512 512m-256 0a256 256 0 1 0 512 0 256 256 0 1 0-512 0Z',
            handleStyle: { color: '#3b82f6' },

          },
          {
            type: 'inside',
            xAxisIndex: 0,
            start: 0,
            end: endPercent,
            // zoomLock: true,

          }
        ],
        // ---- dataZoom ----
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     show: true,
        //     xAxisIndex: 0,
        //     height: 20,
        //     bottom: 30,
        //     start: 0,
        //     end: endPercent,
        //     handleSize: 0,
        //     zoomLock: true,  // This prevents zooming
        //     moveOnMouseMove: false,  // Prevents accidental moves
        //     moveOnMouseWheel: false,  // Disables mouse wheel zoom
        //     preventDefaultMouseMove: true,  // Prevents default mouse move behavior
        //     zoomOnMouseWheel: false,  // Explicitly disable zoom on wheel
        //     startValue: 0,  // Fixed start value
        //     endValue: defaultVisibleCount - 1,  // Fixed end value based on visible count
        //     minValueSpan: defaultVisibleCount,  // Minimum span equals visible count
        //     maxValueSpan: defaultVisibleCount,  // Maximum span equals visible count
        //     showDetail: false,
        //     showDataShadow: false,
        //     borderColor: '#e5e7eb',
        //     backgroundColor: '#f3f4f6',
        //     fillerColor: '#c7d2fe',
        //     handleIcon: 'M512 512m-256 0a256 256 0 1 0 512 0 256 256 0 1 0-512 0Z',
        //     handleStyle: { color: '#3b82f6' }
        //   },
        //   {
        //     type: 'inside',
        //     xAxisIndex: 0,
        //     start: 0,
        //     end: endPercent,
        //     zoomLock: true,  // This prevents zooming
        //     disabled: false,  // Keep enabled for dragging
        //     zoomOnMouseWheel: false,  // Disable zoom on wheel
        //     moveOnMouseMove: false,  // Disable move on mouse move
        //     moveOnMouseWheel: true,  // Enable horizontal scroll with mouse wheel
        //     preventDefaultMouseMove: true,
        //     minValueSpan: defaultVisibleCount,  // Minimum span equals visible count
        //     maxValueSpan: defaultVisibleCount  // Maximum span equals visible count
        //   }
        // ],

        // ---- series ----
        series: [
          {
            type: 'scatter',
            data: apiResponse?.bubbleData ?? bubbleData ?? [],
            symbolSize: function (data) {
              // return Math.max(Math.sqrt(data?.[2] ?? 0) * 3.5, 10);
              const value = data?.[2] ?? 0;
              // if (maxVal === minVal) return (minSize + maxSize) / 2;
              // return minSize + ((value - minVal) / (maxVal - minVal)) * (maxSize - minSize);

              return value + 10;

            },
            symbolOffset: function (data) {
              const brandIndex = data?.[4] ?? 0;
              return [brandIndex * 40, 0];
              // return [brandIndex * 40 - 10, 0];
            },
            z: function (data) {
              return data[2];
            },
            itemStyle: {
              color: 'rgba(52, 140, 255, 0.25)',
              borderColor: '#348cff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'inside',
              fontSize: 12,
              fontWeight: 500,
              color: '#348cff',
              opacity: 1,
              formatter: function (params) {
                return params.data[2];
              }
            },
            emphasis: {
              focus: 'self',
              scale: true,
              itemStyle: {
                color: 'rgba(52, 140, 255, 0.35)',
                borderColor: '#1d4ed8',
                borderWidth: 3
              },
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 600,
                color: '#1d4ed8'
              }
            }
          }
        ],

        // ---- tooltip ----
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.98)',
          borderColor: '#bdbdbd',
          borderWidth: 1,
          textStyle: { fontSize: 16, color: '#222', width: 250, overflow: 'break' },
          extraCssText: 'max-width: 250px; white-space: normal;',
          formatter: function (params) {
            const category = categoriesForAxis?.[params.data[0]];
            const days = params.data[1];
            const Products = params.data[2];
            const brand = params.data[3];
            return `Brand: <b>${brand}</b><br/>Category: <b>${category}</b><br/>OOS Days: <b>${days}</b><br/>Total OOS Products: <b>${Products}</b>`;
          }
        }
      };

      chartInstance.current.setOption(option);

      // Custom tooltip for x-axis labels
      const handleMouseMove = (event) => {
        if (!chartInstance.current) return;

        const point = [event.offsetX, event.offsetY];
        const xIndex = chartInstance.current.convertFromPixel({ xAxisIndex: 0 }, point)[0];

        if (xIndex >= 0 && xIndex < categoriesForAxis.length) {
          const originalValue = categoriesForAxis[xIndex];
          // const truncatedValue = truncateLabel(originalValue, 10);

          // Show tooltip only if the value was truncated
          if (originalValue && originalValue.length > 10) {
            setTooltipContent(originalValue);
            setTooltipPosition({ x: event.clientX, y: event.clientY });
            setTooltipVisible(true);
          } else {
            setTooltipVisible(false);
          }
        } else {
          setTooltipVisible(false);
        }
      };

      const handleMouseLeave = () => {
        setTooltipVisible(false);
      };

      // Add event listeners to the chart container
      const chartDom = chartInstance.current.getDom();
      chartDom.addEventListener('mousemove', handleMouseMove);
      chartDom.addEventListener('mouseleave', handleMouseLeave);

      // Bubble click event to open drawer
      chartInstance.current.on('click', function (params) {
        if (params.seriesType === 'scatter' && params.data) {
          if (typeof setDrawerInfo === 'function') {
            setDrawerInfo(prev => ({
              ...prev,
              isOpen: true,
              data: {
                selectedView,
                selectedViewItem: categoriesForAxis?.[params?.data?.[0]] ?? "",
                brand: params?.data?.[3] ?? "",
                web_pid: params?.data?.[5] ?? []
              }
            }));
          }
        }
      });

      // Handle resize
      const handleResize = () => {
        if (chartInstance.current) chartInstance.current.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        const chartDom = chartInstance.current?.getDom();
        if (chartDom) {
          chartDom.removeEventListener('mousemove', handleMouseMove);
          chartDom.removeEventListener('mouseleave', handleMouseLeave);
        }
        if (chartInstance.current) chartInstance.current.dispose();
      };
    }
  }, [setDrawerInfo, JSON.stringify(apiResponse), selectedView]);

  // const handleDownload = () => {
  //   if (chartInstance.current) {
  //     const url = chartInstance.current.getDataURL({
  //       type: 'png',
  //       pixelRatio: 2,
  //       backgroundColor: '#fff'
  //     });

  //     const link = document.createElement('a');
  //     link.download = 'oos-days-overview-chart.png';
  //     link.href = url;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };
  const handleDownload = () => {
    if (!chartInstance.current) return;

    // Get the current data zoom state before any modifications
    // const currentDataZoom = chartInstance.current.getOption().dataZoom;

    // Store the original complete option
    const originalOption = chartInstance.current.getOption();

    // Create download option by cloning
    const downloadOption = JSON.parse(JSON.stringify(originalOption));

    // Add title with date range
    const startDate = (selectedFilters?.calendarType == "week") ? moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY") : moment(selectedFilters?.selectedDateRange?.startDate ?? "").format("DD/MM/YYYY");
    const endDate = (selectedFilters?.calendarType == "week") ? moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY") : moment(selectedFilters?.selectedDateRange?.endDate ?? "").format("DD/MM/YYYY");

    // const startDate = moment(selectedFilters?.selectedDateRange?.startDate ?? "23/07/25")?.format("DD/MM/YYYY");
    // const endDate = moment(selectedFilters?.selectedDateRange?.endDate ?? "23/07/25")?.format("DD/MM/YYYY");
    const dateRangeText = `${startDate} → ${endDate}`;

    downloadOption.title = {
      show: true,
      text: `OOS Days Overview\n${dateRangeText}`,
      left: 'left',
      top: 10,
      textStyle: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 22
      },
      textAlign: 'left'
    };

    // Adjust grid top to accommodate title
    const downloadGridTopPx = 90;
    if (Array.isArray(downloadOption.grid) && downloadOption.grid.length > 0) {
      downloadOption.grid[0] = {
        ...downloadOption.grid[0],
        top: downloadGridTopPx
      };
    } else {
      downloadOption.grid = {
        ...downloadOption.grid,
        top: downloadGridTopPx
      };
    }

    // Apply the download option (merge, not replace)
    chartInstance.current.setOption(downloadOption, { notMerge: false });

    // Give ECharts time to repaint
    setTimeout(() => {
      const url = chartInstance.current.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });

      // Restore by removing title and restoring original grid
      chartInstance.current.setOption({
        title: { show: false },
        grid: Array.isArray(originalOption.grid) && originalOption.grid.length > 0
          ? originalOption.grid[0]
          : originalOption.grid
      }, { notMerge: false });

      // Force chart to recalculate and resize
      setTimeout(() => {
        chartInstance.current.resize();
      }, 50);

      const link = document.createElement('a');
      link.download = 'oos-days-overview-chart.png';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 300);
  };
  const fetchData = async () => {
    setLoading(true);
    let payload = {
      matrix: ["oos_days"],
      selectedView,
      selectedFilters, filters,
      brands: filters?.brand
    };

    const response = await fetchOOSDaysOverviewData(payload);
    setApiResponse(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedView, JSON.stringify(selectedFilters)]);

  // Custom tooltip styles
  const tooltipStyle = {
    position: 'fixed',
    left: tooltipPosition.x + 10,
    top: tooltipPosition.y - 40,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '400',
    zIndex: 1000,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    display: tooltipVisible ? 'block' : 'none',
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  return (
    <div className="osa-chart-container">
      {/* Custom tooltip for x-axis labels */}
      <div style={tooltipStyle}>
        {tooltipContent}
      </div>

      <div className="chart-header">
        <div className="chart-title-section">
          <h5 className="chart-title flex items-center gap-2">
            OOS Days Overview {loading && <Loader show={loading} fullScreen={false} />}
          </h5>
          <p className="chart-date">
            {(selectedFilters?.calendarType == "week") ?
              <> {moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY")} </>
              :
              <>{moment(selectedFilters?.selectedDateRange?.startDate ?? "")?.format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedDateRange?.endDate ?? "")?.format("DD/MM/YYYY")}</>}

            {/* {moment(selectedFilters?.selectedDateRange?.startDate ?? "23/07/25")?.format("DD/MM/YYYY")} → {moment(selectedFilters?.selectedDateRange?.endDate ?? "23/07/25")?.format("DD/MM/YYYY")} */}
          </p>
        </div>
        <div className="chart-controls" style={{ gap: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px',
            marginRight: 16
          }}>
            <div className='relative'>
              <span style={{ fontSize: 16, color: '#444', fontWeight: 400, marginRight: 4 }}>Select View:</span>
              <select
                className='appearance-none pr-8 w-[120px]'
                style={{
                  fontSize: 16,
                  borderRadius: 8,
                  border: '1px solid #bdbdbd',
                  padding: '4px 18px',
                  outline: 'none',
                  background: '#fff',
                  fontWeight: 400,
                  // minWidth: 110,
                  // marginRight: 8
                }}
                value={selectedView}
                onChange={e => setSelectedView(e.target.value)}
              >
                {viewOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
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
          </div>

          <span style={{ display: 'flex', alignItems: 'center', marginLeft: 8, cursor: 'pointer' }} onClick={handleDownload} title="Download">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ opacity: 1, transform: 'rotate(0deg)' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </span>
        </div>
      </div>
      <div className="chart-content">
        <div ref={chartRef} className="chart-area"></div>
      </div>
    </div>
  );
};

export default OosDaysOverviewComponent;