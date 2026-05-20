
import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import './style.css';

const MockDataOsaByBrand = ({isDropped}) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    // Brand is always selected, competition can be toggled
    const [showCompetition, setShowCompetition] = useState(true);

    const chartData = {
        brands: [
            'Brand 1', 'Brand 2', 'Brand 3'
        ],
        brandValues: [10, 5, 9],
        competitionValues: [5, 11, 8]
    };

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);

            const series = [
                {
                    name: 'Brand',
                    type: 'bar',
                    data: chartData.brandValues,
                    barWidth: 16,
                    itemStyle: {
                        color: '#A4C8FF',
                        borderRadius: [2, 2, 0, 0],
                        opacity: 1,
                    },
                    barGap: '10%'
                }
            ];
            if (showCompetition) {
                series.push({
                    name: 'Competition',
                    type: 'bar',
                    data: chartData.competitionValues,
                    barWidth: 16,
                    itemStyle: {
                        color: '#D1F1A9',
                        borderRadius: [2, 2, 0, 0],
                        opacity: 1,
                    }
                });
            }

            // DataZoom for horizontal scroll
            const option = {
                backgroundColor: '#fff',
                grid: {
                    left: 2,
                    right: '5%',
                    top: '10%',
                    bottom: 5,
                    containLabel: true
                },
                // dataZoom: [
                //     {
                //         type: 'slider',
                //         show: true,
                //         xAxisIndex: 0,
                //         filterMode: 'none',
                //         height: 16,
                //         bottom: 0,
                //         start: 0,
                //         end: 50 ?? chartData?.brands?.length ?? 50,
                //         handleSize: '80%',
                //         showDetail: false,
                //         showDataShadow: false,
                //         borderColor: '#e5e7eb',
                //         backgroundColor: '#f3f4f6',
                //         fillerColor: '#c7d2fe',
                //         handleIcon: 'M512 512m-256 0a256 256 0 1 0 512 0 256 256 0 1 0-512 0Z',
                //         handleStyle: {
                //             color: '#3b82f6',
                //         },
                //     }
                // ],
                xAxis: {
                    type: 'category',
                    data: chartData.brands,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#e5e7eb',
                            width: 1
                        }
                    },
                    axisTick: {
                        show: true,
                        alignWithLabel: true,
                        length: 8,
                        lineStyle: {
                            color: '#121316ff',
                            width: 1
                        }
                    },
                    axisLabel: {
                        color: '#9ca3af',
                        fontSize: 12,
                        margin: 15,
                        lineHeight: 14,
                        interval: 0 // Show all labels
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    min: 0,
                    max: 30,
                    // interval: 20,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#e5e7eb',
                            width: 1
                        }
                    },
                    axisTick: {
                        show: true,
                        lineStyle: {
                            color: '#e5e7eb',
                        }
                    },
                    axisLabel: {
                        color: '#9ca3af',
                        fontSize: 12,
                        formatter: '{value}%'
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#f3f4f6',
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                // dataZoom: [
                //     {
                //         type: 'slider',
                //         show: true,
                //         xAxisIndex: 0,
                //         height: 20,
                //         bottom: 0,
                //         start: 0,
                //         end: (7 / chartData?.brands?.length??1) * 100
                //     }
                //     ,
                //     {
                //       type: 'inside', 
                //       xAxisIndex: 0,
                //       start: 0,
                //       end: (7 / chartData?.brands?.length??1) * 100
                //     }
                // ],
                series,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    textStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
                    formatter: function (params) {
                        let result = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>`;
                        params.forEach(param => {
                            result += `<div style="display: flex; align-items: center; margin: 2px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                ${param.seriesName}: ${param.value}%
              </div>`;
                        });
                        return result;
                    }
                }
            };

            // Dynamically set chart width for overflow
            if (chartRef.current) {
                if (chartData.brands.length > 6) {
                    chartRef.current.style.width = `${120 * chartData.brands.length}px`;
                } else {
                    chartRef.current.style.width = '100%';
                }
            }
            chartRef.current.style.height = '100px';


            chartInstance.current.setOption(option);

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
    }, [showCompetition]);

    const handleDownload = () => {
        if (chartInstance.current) {
            const url = chartInstance.current.getDataURL({
                type: 'png',
                pixelRatio: 2,
                backgroundColor: '#fff'
            });

            const link = document.createElement('a');
            link.download = 'osa-by-brand-chart.png';
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className={`relative flex ${isDropped ? "opacity-[0.6]" : ""}`} style={{ justifyContent: "center" }}>
            <div className='absolute inset-0 z-10'></div>
            <div className="osa-chart-container h-[300px] w-full">
                <div className="chart-header">
                    <div className="chart-title-section">
                        <h5 className="mock-chart-title">OSA by Brand</h5>
                        <p className="mock-chart-date">23/07/25 → 23/07/25</p>
                    </div>

                    <div className="chart-controls" style={{ gap: 0 }}>
                        <div style={{
                            background: '#fff',
                            borderRadius: 8,
                            boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px 8px',
                            marginRight: 16
                        }}>
                            <div
                                className="legend-item"
                                style={{
                                    background: '#fff',
                                    color: '#222',
                                    border: 'none',
                                    borderRadius: 5,
                                    fontWeight: 450,
                                    fontSize: 10,
                                    padding: '2px 8px',
                                    marginRight: 4,
                                    boxShadow: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    cursor: 'default',
                                    userSelect: 'none',
                                    minWidth: 70,
                                    justifyContent: 'center',
                                    height: 26,
                                }}
                            >
                                <span
                                    className="legend-dot brand-dot"
                                    style={{ background: '#A4C8FF', marginRight: 4, width: 5, height: 5 }}
                                />
                                <span
                                    style={{
                                        color: '#444',
                                        fontWeight: 400,
                                        fontSize: 10,
                                        lineHeight: '100%',
                                    }}
                                >
                                    Brand
                                </span>
                            </div>

                            <button
                                className="legend-item"
                                style={{
                                    background: showCompetition ? '#3b82f6' : '#fff',
                                    color: showCompetition ? '#fff' : '#222',
                                    border: 'none',
                                    borderRadius: 5,
                                    fontWeight: 450,
                                    fontSize: 10,
                                    padding: '2px 8px',
                                    marginRight: 0,
                                    boxShadow: showCompetition
                                        ? '0 1px 4px rgba(59,130,246,0.15)'
                                        : 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    minWidth: 70,
                                    justifyContent: 'center',
                                    height: 26,
                                }}
                                onClick={() => setShowCompetition((v) => !v)}
                            >
                                <span
                                    className="legend-dot competition-dot"
                                    style={{
                                        background: '#D1F1A9',
                                        marginRight: 4,
                                        width: 8,
                                        height: 8,
                                    }}
                                />
                                <span
                                    style={{
                                        color: showCompetition ? '#fff' : '#444',
                                        fontWeight: 400,
                                        fontSize: 10,
                                    }}
                                >
                                    Competition
                                </span>
                            </button>

                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', marginLeft: 8, cursor: 'pointer' }} onClick={handleDownload} title="Download">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ opacity: 1, transform: 'rotate(0deg)' }}>
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="mock-chart-content" style={{ overflowX: 'auto' }}>
                    <div className="mock-y-axis-label">Average OSA</div>
                    <div ref={chartRef} className="mock-chart-area"></div>
                </div>

                <div className="mock-x-axis-label">Brand</div>
            </div>
        </div>
    );
};

export default MockDataOsaByBrand;