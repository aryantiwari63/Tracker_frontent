import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import './style.css';
import moment from 'moment';
import { useEbuxContext } from '../../../Context/EbuxProvider';
import { fetchOSAByBrandAnalysisData } from './services/service';
import Loader from '../../../common-components/Loader';

const isShowDummyData = false;
const dummyData = (!isShowDummyData) ? {} : {
    brands: [
        'Nescafe', 'Nescafe Gold', 'Nescafe Premium', 'Nestea', 'Kitkat', 'Maggi',
        '1 Nescafe', '1 Nescafe Gold', '1 Nescafe Premium', '1 Nestea', '1 Kitkat', '1 Maggi'
    ],
    brandValues: [80, 55, 85, 55, 55, 55, 80, 55, 85, 55, 55, 55],
    competitionValues: [55, 75, 50, 30, 30, 30, 55, 75, 50, 30, 30, 30]
}

const OsaByBrand = () => {
    const {
        kpi,
        filters,
        selectedFilters, activeClientProject
    } = useEbuxContext();
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [showCompetition, setShowCompetition] = useState(activeClientProject?.competition || false);
    const [chartData, setChartData] = useState(dummyData);
    const [loading, setLoading] = useState(false);


    const fetchProductData = async () => {
        setLoading(true);
        let payload = {
            kpi,
            matrix: ['osa'],
            selectedFilters, filters,
            competitionBrand: filters?.competition_brand?.filter(i => (((i?.is_brand ?? true) == false))) ?? []
        };

        const response = await fetchOSAByBrandAnalysisData(payload);
        const data = {
            brands: response?.map(i => i?.brand ?? "") ?? [],
            brandValues: response?.map(i => i?.osa ?? "") ?? [],
            competitionValues: response?.map(i => i?.competitionOsa ?? "") ?? []
        }
        setChartData(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchProductData();
    }, [JSON.stringify(selectedFilters)]);

    const getChartOption = (includeLegend = false) => {
        const totalBars = chartData?.brands?.length || 1;
        const maxVisibleBars = 4;
        const endPercent = Math.min((maxVisibleBars / totalBars) * 100, 100);

        const series = [
            {
                name: 'Brand',
                type: 'bar',
                data: chartData?.brandValues ?? [],
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
                data: chartData?.competitionValues ?? [],
                barWidth: 16,
                itemStyle: {
                    color: '#D1F1A9',
                    borderRadius: [2, 2, 0, 0],
                    opacity: 1,
                },
                large: true,
                largeThreshold: 100
            });
        }

        // Prepare legend data
        const legendData = ['Brand'];
        if (showCompetition) {
            legendData.push('Competition');
        }
        // const startDate = moment(selectedFilters?.selectedDateRange?.startDate ?? "23/07/25")?.format("DD/MM/YYYY");
        // const endDate = moment(selectedFilters?.selectedDateRange?.endDate ?? "23/07/25")?.format("DD/MM/YYYY");
        const startDate = (selectedFilters?.calendarType == "week") ? moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY") : moment(selectedFilters?.selectedDateRange?.startDate ?? "").format("DD/MM/YYYY");
        const endDate = (selectedFilters?.calendarType == "week") ? moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY") : moment(selectedFilters?.selectedDateRange?.endDate ?? "").format("DD/MM/YYYY");

        const dateRangeText = `${startDate} → ${endDate}`;
        return {
            backgroundColor: '#fff',
            grid: {
                left: 48,
                right: '5%',
                top: includeLegend ? '30%' : '10%', // Adjust top margin when legend is shown
                bottom: 100,
                containLabel: true
            },
            title: includeLegend ? {
                show: true,
                text: `OSA by Brand\n${dateRangeText}`,
                left: 'left',
                textStyle: {
                    color: '#333',
                    fontSize: 12,
                    fontWeight: 'bold',
                    lineHeight: 24
                },
                textAlign: 'left',

            } : {
                show: false
            },
            legend: includeLegend ? {
                show: true,
                top: '5%',
                right: '2%',
                data: legendData,
                itemStyle: {
                    borderWidth: 0
                },
                textStyle: {
                    color: '#333',
                    fontSize: 12
                }
            } : {
                show: false
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: 0,
                    filterMode: 'none',
                    height: 20,
                    bottom: 30,
                    start: 0,
                    end: endPercent,
                    handleSize: 0,
                    showDetail: false,
                    showDataShadow: false,
                    borderColor: '#e5e7eb',
                    backgroundColor: '#f3f4f6',
                    fillerColor: '#c7d2fe',
                    handleIcon: 'M512 512m-256 0a256 256 0 1 0 512 0 256 256 0 1 0-512 0Z',
                    handleStyle: { color: '#3b82f6' },
                    zoomLock: true,
                    moveOnMouseWheel: false,
                    zoomOnMouseWheel: false,
                    preventDefaultMouseMove: true,
                    moveOnMouseMove: true,
                    brushSelect: false,
                    minSpan: endPercent,
                    maxSpan: endPercent
                }
            ],
            xAxis: {
                type: 'category',
                data: chartData?.brands ?? [],
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
                    fontSize: 13,
                    margin: 15,
                    lineHeight: 14,
                    interval: 0,
                    formatter: function (value) {
                        const maxLength = 15;
                        if (value && value.length > maxLength) {
                            return value.substring(0, maxLength) + '...';
                        }
                        return value;
                    }
                },
                splitLine: {
                    show: false
                },
                name: 'Brand',
                nameLocation: 'center',
                nameGap: 50,
                nameTextStyle: {
                    color: '#9ca3af',
                    fontSize: 14,
                    align: 'center'
                }
            },
            yAxis: {
                type: 'value',
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
                },
                name: 'Average OSA',
                nameLocation: 'middle',
                nameGap: 52,
                nameRotate: 90,
                nameTextStyle: {
                    color: '#9ca3af',
                    fontSize: 14,
                    align: 'center'
                }
            },
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
    };

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);

            // Dynamically set chart width for overflow
            if (chartRef.current) {
                if (chartData?.brands?.length > 6) {
                    chartRef.current.style.width = `${120 * chartData?.brands?.length}px`;
                } else {
                    chartRef.current.style.width = '100%';
                }
            }

            const option = getChartOption(false);
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
    }, [showCompetition, chartData]);

    const handleDownload = () => {
        if (!chartInstance.current) return;

        // Capture the current option (this includes current dataZoom / scroll state)
        const currentOption = chartInstance.current.getOption();
        // Deep clone to avoid mutating the live option
        const originalOption = JSON.parse(JSON.stringify(currentOption));
        const downloadOption = JSON.parse(JSON.stringify(currentOption));

        // Ensure the download shows the title + date range and has extra top spacing
        // const startDate = moment(selectedFilters?.selectedDateRange?.startDate ?? "23/07/25")?.format("DD/MM/YYYY");
        // const endDate = moment(selectedFilters?.selectedDateRange?.endDate ?? "23/07/25")?.format("DD/MM/YYYY");
        const startDate = (selectedFilters?.calendarType == "week") ? moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY") : moment(selectedFilters?.selectedDateRange?.startDate ?? "").format("DD/MM/YYYY");
        const endDate = (selectedFilters?.calendarType == "week") ? moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY") : moment(selectedFilters?.selectedDateRange?.endDate ?? "").format("DD/MM/YYYY");

        const dateRangeText = `${startDate} → ${endDate}`;

        downloadOption.title = {
            show: true,
            text: `OSA by Brand\n${dateRangeText}`,
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

        // Inject legend into the download option using current series names
        const seriesNames = (downloadOption.series || []).map(s => s && s.name).filter(Boolean);
        if (seriesNames.length) {
            downloadOption.legend = {
                show: true,
                top: 10,
                right: '2%',
                data: seriesNames,
                itemStyle: {
                    borderWidth: 0
                },
                textStyle: {
                    color: '#333',
                    fontSize: 12
                }
            };
        }

        // Enlarge top grid to avoid overlap - reduced spacing
        const downloadGridTopPx = 90;
        if (!downloadOption.grid) {
            downloadOption.grid = {
                left: 48,
                right: '5%',
                top: downloadGridTopPx,
                bottom: 100,
                containLabel: true
            };
        } else {
            downloadOption.grid[0].top = downloadGridTopPx;
        }

        // Apply the download option (replace) so layout updates cleanly
        chartInstance.current.setOption(downloadOption, { notMerge: true, replaceMerge: ['grid'] });

        // give ECharts a moment to repaint with the new layout
        setTimeout(() => {
            const url = chartInstance.current.getDataURL({
                type: 'png',
                pixelRatio: 2,
                backgroundColor: '#fff'
            });

            // Restore the original option (including current scroll position)
            chartInstance.current.setOption(originalOption, { notMerge: true });

            const link = document.createElement('a');
            link.download = 'osa-by-brand-chart.png';
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 300);
    };
    console.log(loading);


    return (
        <div className="osa-chart-container">
            <div className="chart-header">
                <div className="chart-title-section">
                    {/* <h5 className="chart-title">OSA by Brand { <Loader show={true} fullScreen={false} />}</h5> */}
                    <h5 className="chart-title flex items-center gap-2">
                        OSA by Brand {loading && <Loader show={loading} fullScreen={false} />}
                    </h5>
                    <p className="chart-date">
                        {(selectedFilters?.calendarType == "week") ?
                            <> {moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY")} </>
                            :
                            <>{moment(selectedFilters?.selectedDateRange?.startDate ?? "")?.format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedDateRange?.endDate ?? "")?.format("DD/MM/YYYY")}</>}
                    </p>
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
                                borderRadius: 8,
                                fontWeight: 450,
                                fontSize: 12,
                                padding: '6px 20px',
                                marginRight: 4,
                                boxShadow: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                cursor: 'default',
                                userSelect: 'none',
                                minWidth: 120,
                                justifyContent: 'center',
                                height: 40
                            }}
                        >
                            <span className="legend-dot brand-dot" style={{ background: '#A4C8FF', marginRight: 8, width: 15, height: 15, opacity: 1, transform: 'rotate(0deg)' }}></span>
                            <span style={{
                                color: '#444',
                                fontWeight: 400,
                                fontSize: 12,
                                lineHeight: '100%',
                                letterSpacing: 0,
                                verticalAlign: 'middle'
                            }}>Brand</span>
                        </div>
                        {(activeClientProject?.competition || false) ?

                            <button
                                className="legend-item"
                                style={{
                                    background: showCompetition ? '#3b82f6' : '#fff',
                                    color: showCompetition ? '#fff' : '#222',
                                    border: 'none',
                                    borderRadius: 8,
                                    fontWeight: 450,
                                    fontSize: 12,
                                    padding: '6px 20px',
                                    marginRight: 0,
                                    boxShadow: showCompetition ? '0 2px 8px rgba(59,130,246,0.10)' : 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    minWidth: 120,
                                    justifyContent: 'center',
                                    height: 40
                                }}
                                onClick={() => setShowCompetition(v => !v)}
                            >
                                <span className="legend-dot competition-dot" style={{ background: '#D1F1A9', marginRight: 8, width: 15, height: 15, opacity: 1, transform: 'rotate(0deg)' }}></span>
                                <span style={{
                                    color: showCompetition ? '#fff' : '#444',
                                    fontWeight: 400,
                                    fontSize: 12,
                                    lineHeight: '100%',
                                    letterSpacing: 0,
                                    verticalAlign: 'middle'
                                }}>Competition</span>
                            </button>
                            : <></>}
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

            <div className="chart-content" style={{ overflowX: 'auto' }}>
                <div ref={chartRef} className="chart-area"></div>
            </div>
        </div>
    );
};

export default OsaByBrand;