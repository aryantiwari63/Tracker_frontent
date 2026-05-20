import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
// Removed lucide-react icons, using inline SVGs instead
import './style.css';

const MockOosDaysOverviewComponent = ({ setDrawerInfo, disabled,isDropped }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedView, setSelectedView] = useState('Category');
  // removed unused showDropdown, setShowDropdown

  // Bubble data: [categoryIndex, yValue, bubbleValue]
  const categories = [
    'Category 1', 'Category 2', 'Category3'
  ];
  const bubbleData = [
    [0, 24, 48], [0, 12, 50],
    [1, 12, 30], [1, 6, 20],
    [2, 12, 30], [2, 6, 20],
  ];

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      const option = {
        backgroundColor: '#fff',
        grid: {
          left: 60,
          right: 35,
          top: '18%',
          bottom: 75, // More space for x-axis labels
        },
        xAxis: {
          type: 'category',
          data: categories,
          boundaryGap: false, // Show all category names at ticks
          splitNumber: categories.length,
          axisLine: { show: true, lineStyle: { color: '#bdbdbd', width: 1 } },
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
            rotate: 0, // No rotation, horizontal
            overflow: 'break', // Allow breaking if needed
            formatter: function (value) {
              return value;
            }
          },
          splitLine: {
            show: true,
            alignWithLabel: true,
            lineStyle: { color: '#e5e7eb', width: 1, type: 'dashed' }
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          axisLine: { show: false },
          axisTick: {
            show: true,
            length: 14,
            lineStyle: { color: '#6d5cae', width: 1.5 }
          },
          axisLabel: {
            fontSize: 12,
            color: '#9ca3af',
            fontWeight: 400,
            margin: 20
          },
          splitLine: {
            show: true,
            lineStyle: { color: '#e5e7eb', width: 1, type: 'dashed' }
          }
        },
        series: [{
          type: 'scatter',
          data: bubbleData,
          symbolSize: function (data) {
            return Math.sqrt(data[2]) * 4.5;
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
            formatter: function (params) { return params.data[2]; }
          },
          emphasis: {
            scale: true,
            itemStyle: {
              color: 'rgba(52, 140, 255, 0.35)',
              borderColor: '#348cff',
              borderWidth: 2.5
            }
          }
        }],
        tooltip: disabled
          ? { show: false }
          : {
            trigger: 'item',
            backgroundColor: 'rgba(255,255,255,0.98)',
            borderColor: '#bdbdbd',
            borderWidth: 1,
            textStyle: {
              fontSize: 16,
              color: '#222',
            },
            formatter: function (params) {
              const category = categories[params.data[0]];
              const days = params.data[1];
              const value = params.data[2];
              return `<b>${category}</b><br/>OOS Days: <b>${days}</b><br/>Value: <b>${value}</b>`;
            }
          }
      };

      chartInstance.current.setOption(option);
      chartInstance.current.off('click');
      chartInstance.current.on('click', function (params) {
        if (disabled) return;
        if (params.seriesType === 'scatter' && params.data) {
          if (typeof setDrawerInfo === 'function') {
            setDrawerInfo(prev => ({
              ...prev,
              isOpen: true,
              data: {
                performanceOf: 'brand',
                value: params.name || 'Unknown'
              }
            }));
          }
        }
      });
      // Handle resize
      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }
      };
    }
  }, [setDrawerInfo, disabled]);

  const handleDownload = () => {
    if (chartInstance.current) {
      const url = chartInstance.current.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });

      const link = document.createElement('a');
      link.download = 'oos-days-overview-chart.png';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const viewOptions = ['Category', 'Location', 'Platform'];

  return (
    <div className={`osa-chart-container ${isDropped ? "opacity-[0.6]" : ""}`}>
      <div className="chart-header">
        <div className="chart-title-section">
          <h5 className="mock-overview-chart-title">OOS Days Overview</h5>
          <h5 className="mock-overview-chart-date">23/07/25 → 23/07/25</h5>
        </div>
        <div className="mock-overview-chart-controls" style={{ gap: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 8px',
              marginRight: 0
            }}
          >
            <span className="text-[12px] mr-2">Select View :</span>
            <select
              style={{
                fontSize: 12,
                borderRadius: 5,
                border: '1px solid #bdbdbd',
                padding: '4px 12px',
                outline: 'none',
                background: '#fff',
                fontWeight: 400,
                marginRight: 0
              }}
              value={selectedView}
              onChange={disabled ? undefined : (e => setSelectedView(e.target.value))}
              disabled={disabled}
            >
              {viewOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 4,
              cursor: 'pointer'
            }}
            onClick={disabled ? undefined : handleDownload}
            title="Download"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ opacity: 1, transform: 'rotate(0deg)' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </span>
        </div>
      </div>
      <div className="mock-overview-chart-content" style={{ minHeight: '150px', height: '150px' }}>
        <div className="mock-overview-y-axis-label" style={{ fontSize: 11 }}>OOS Days</div>
        <div ref={chartRef} className="mock-overview-chart-area" style={{ minHeight: '180px', height: '180px' }}></div>
      </div>
      <div className="mock-overview-x-axis-label">{selectedView}</div>
    </div >
  );
};

export default MockOosDaysOverviewComponent;