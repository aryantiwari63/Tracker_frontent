import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import './OOSBreakdownTable.css';
import { FaSort } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import CalendarPopup from './calenderPopUp';
import { useEffect } from 'react';
import { fetchOOSDaysBreakdownData } from '../../services/service';
import { useState } from 'react';
import { useEbuxContext } from '../../../../../Context/EbuxProvider';
import moment from "moment";
import Loader from '../../../../../common-components/Loader';

import * as XLSX from 'xlsx';

const isShowDummyData = false;
export const data = (!isShowDummyData) ? [] : [
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Amazon', logo: '/assets/images/amazon.png' },
        oosDays: 7,
        dateRange: '1 August - 5 August',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 5,
        dateRange: '21 July - 27 July',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Zepto', logo: '/assets/images/zepto.png' },
        oosDays: 6,
        dateRange: '16 July - 18 July',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Flipkart', logo: '/assets/images/flipkart.png' },
        oosDays: 3,
        dateRange: '11 July - 14 July',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Lazada', logo: '/assets/images/lazada.png' },
        oosDays: 7,
        dateRange: '7 July - 12 July',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Zepto', logo: '/assets/images/zepto.png' },
        oosDays: 4,
        dateRange: '1 July - 2 July',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Amazon', logo: '/assets/images/amazon.png' },
        oosDays: 2,
        dateRange: '25 June - 30 June',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        product: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    }
];

// Helper to get gradient color based on oosDays value
function getOOSBgColor(oosDays, min, max) {
    if (max === min) {
        return `rgb(255, 173, 91)`; // #FFAD5B
    }
    const percent = (oosDays - min) / (max - min);
    const hex = (c1, c2) => Math.round(c1 + (c2 - c1) * percent);
    // #FFE7D0 = (255,231,208), #FFAD5B = (255,173,91)
    const r = hex(255, 255);
    const g = hex(231, 173);
    const b = hex(208, 91);
    return `rgb(${r},${g},${b})`;
}
const initPopup = { dates: [], open: false, anchor: null, dateRange: '', title: '' };

const OOSBreakdownTable = forwardRef(({ drawerInfo }, ref) => {
    const {
        filters,
        selectedFilters
    } = useEbuxContext();
    const ROW_HEIGHT = 60; // MUST match .oos-table-row height
    const BUFFER = 5;

    const scrollRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(0);

    const [loading, setLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState({});
    // const [displayData, setDisplayData] = React.useState([]);
    const [sortedCols, setSortedCols] = React.useState({ current_key: "product" });
    const [selectedOOSDaySortType, setSelectedOOSDaySortType] = React.useState('Consecutive');
    const [calendarPopup, setCalendarPopup] = React.useState(initPopup);
    const displayData = useMemo(() => {
        const d = [...(apiResponse?.length ? apiResponse : [] ?? data ?? [])]?.filter(i => {
            if (typeof i?.isContinuousOOS === "boolean") {
                return selectedOOSDaySortType === "Consecutive" ? (i?.isContinuousOOS === true) : (i?.isContinuousOOS === false);
            }
            return true;
        })
        // setDisplayData(d);
        // setDisplayData([]??d);
        // return d?.sort((a, b) => {
        //     if (sortedKey === 'pincode') {
        //         const pinA = parseInt(a?.[sortedKey]?.split('/')?.[0]?.trim(), 10);
        //         const pinB = parseInt(b?.[sortedKey]?.split('/')?.[0]?.trim(), 10);
        //         return sortedCols?.[sortedKey] ? pinB - pinA : pinA - pinB;
        //     } else if (sortedKey === 'dateRange') {
        //         const dateA = new Date(a?.[sortedKey]?.split('-')?.[0]?.trim() + ' 2024');
        //         const dateB = new Date(b?.[sortedKey]?.split('-')?.[0]?.trim() + ' 2024');
        //         return sortedCols?.[sortedKey] ? dateB - dateA : dateA - dateB;
        //     } else if (sortedKey === 'platform') {
        //         return sortedCols?.[sortedKey] ? b?.[sortedKey]?.name?.localeCompare(a?.[sortedKey]?.name) : a?.[sortedKey]?.name?.localeCompare(b?.[sortedKey]?.name);
        //     } else if (sortedKey === 'oosDays') {
        //         const daysA = parseInt(a?.[sortedKey], 10) || 0;
        //         const daysB = parseInt(b?.[sortedKey], 10) || 0;
        //         return sortedCols?.[sortedKey] ? daysB - daysA : daysA - daysB;
        //     } else if (sortedKey === 'product') {
        //         return sortedCols?.[sortedKey] ? b?.[sortedKey]?.localeCompare(a?.[sortedKey]) : a?.[sortedKey]?.localeCompare(b?.[sortedKey]);
        //     } 
        // });
        return d?.sort((a, b) => {
            if (sortedCols.current_key === 'pincode') {
                const pinA = parseInt(a?.pincode?.split('/')?.[0]?.trim(), 10);
                const pinB = parseInt(b?.pincode?.split('/')?.[0]?.trim(), 10);
                return sortedCols?.[sortedCols.current_key] ? pinB - pinA : pinA - pinB;
            } else if (sortedCols.current_key === 'dateRange') {
                const startA = a?.dateRange?.split('-')?.[0]?.trim();
                const startB = b?.dateRange?.split('-')?.[0]?.trim();
                const dateA = moment(startA, ["D MMMM YYYY", "D MMM YYYY", "D MMM"]).toDate();
                const dateB = moment(startB, ["D MMMM YYYY", "D MMM YYYY", "D MMM"]).toDate();
                return sortedCols?.[sortedCols.current_key] ? dateB - dateA : dateA - dateB;
            } else if (sortedCols.current_key === 'platform') {
                return sortedCols?.[sortedCols.current_key]
                    ? b?.platform?.name?.localeCompare(a?.platform?.name)
                    : a?.platform?.name?.localeCompare(b?.platform?.name);
            } else if (sortedCols.current_key === 'oosDays') {
                const daysA = parseInt(a?.oosDays, 10) || 0;
                const daysB = parseInt(b?.oosDays, 10) || 0;
                return sortedCols?.[sortedCols.current_key] ? daysB - daysA : daysA - daysB;
            } else if (sortedCols.current_key === 'product') {
                return sortedCols?.[sortedCols.current_key]
                    ? b?.product?.localeCompare(a?.product)
                    : a?.product?.localeCompare(b?.product);
            }
            return 0;
        });
    }, [JSON.stringify(apiResponse), JSON.stringify(selectedOOSDaySortType), JSON.stringify(sortedCols)]);
    const handleSort = (key) => {
        setSortedCols(prev => ({ ...prev, [key]: !prev?.[key], current_key: key }));
    };
    const loadData = async () => {

        try {
            setLoading(true);
            const payload = {
                selectedFilters, filters,
                selectedView: drawerInfo?.data?.selectedView ?? "platform",
                selectedViewItem: drawerInfo?.data?.selectedViewItem ?? "platform",
                brand: drawerInfo?.data?.brand ?? "",
                web_pids: drawerInfo?.data?.web_pid ?? []
            }
            const response = await fetchOOSDaysBreakdownData(payload);


            setApiResponse(response);

        } catch (error) {

            setLoading(false);
        } finally {
            setLoading(false);

        }
    }
    useEffect(() => {
        loadData();
    }, [drawerInfo])
    const showDateRange = (dates) => {
        return `${moment(dates[0])?.format("DD/MM/YYYY")}-${moment(dates[dates?.length - 1])?.format("DD/MM/YYYY")}`

    }
    const get_pf_image = (platform) => {
        return filters?.platform.find(i => i.label?.toLowerCase() == platform?.toLowerCase())?.platform_description ?? "";
    };
    useImperativeHandle(ref, () => ({
        downloadTableData: () => {

            if (loading) return;
            const exportData = displayData.map(row => ({
                'Product': row.product || row.category || '',
                'Platform': row.platform?.name || '',
                'Pincode': row.pincode || '',
                'OOS Days': row.oosDays || 0,
                'Date Range': selectedOOSDaySortType === 'Cumulative' ? '---' : (row?.dates?.length ? showDateRange(row?.dates) : "") || ''
            }));
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'OOS Breakdown');
            const fileName = `OOS_Breakdown_${new Date().toISOString().slice(0, 10)}_${new Date().getTime()}.xlsx`;

            XLSX.writeFile(workbook, fileName);
        }

    }));
    if (loading) {
        return <Loader show={loading} fullScreen={false} />;
    }
    // w-[90%] 
    const totalRows = displayData.length;

    const viewportHeight = scrollRef.current?.clientHeight || 600;

    const startIndex = Math.max(
        0,
        Math.floor(scrollTop / ROW_HEIGHT) - BUFFER
    );

    const endIndex = Math.min(
        totalRows,
        Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + BUFFER
    );

    const visibleRows = displayData.slice(startIndex, endIndex);

    const topSpacerHeight = startIndex * ROW_HEIGHT;
    const bottomSpacerHeight = (totalRows - endIndex) * ROW_HEIGHT;
    return (
        <div className="oos-table-container relative flex flex-row gap-0">

            {/* <div className="oos-table-outer 
            flex-1

            pl-5 pr-2 bg-white max-h-[93vh] overflow-x-hidden overflow-y-scroll hide-scrollbar"> */}
            <div
            ref={scrollRef}
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
            className="oos-table-outer 
                flex-1
                pl-5 pr-2 bg-white max-h-[93vh] overflow-x-hidden overflow-y-scroll hide-scrollbar"
            >
                <div className='oos-table-header sticky top-0 z-100 shadow-none bg-white'>
                    <div className='flex items-center h-full bg-gray-100 rounded-3xl'>
                        <div className='cell flex items-center px-2 ml-4 gap-3 font-semibold' onClick={() => handleSort('product')}>
                            <FaSort style={{ width: 11, height: 32, transform: 'rotate(0deg)', opacity: 1 }} />
                            <span>Product</span>
                        </div>
                        <div className='cell flex items-center gap-3' onClick={() => handleSort('platform')}>
                            <FaSort style={{ width: 11, height: 32, transform: 'rotate(0deg)', opacity: 1 }} />
                            <span className='ml-2 font-semibold'>Platform</span>
                        </div>
                        <div className='cell flex items-center gap-3 font-semibold' onClick={() => handleSort('pincode')}>
                            <FaSort style={{ width: 11, height: 32, transform: 'rotate(0deg)', opacity: 1 }} />
                            <span className='ml-2'>Pincode</span>
                        </div>
                        <div className='cell flex items-center gap-3 font-semibold' >
                            <FaSort style={{ width: 11, height: 32, transform: 'rotate(0deg)', opacity: 1 }} onClick={() => handleSort('oosDays')} />
                            <span>OOS Days</span>
                            <select
                                className="oos-dropdown-select ml-2 font-semibold"
                                value={selectedOOSDaySortType}
                                onChange={(e) => { setSelectedOOSDaySortType(e.target.value) }}
                            >
                                <option>Consecutive</option>
                                <option>Cumulative</option>
                            </select>
                        </div>
                        <div className='cell flex items-center gap-8 font-semibold' 
                        // onClick={() => handleSort('dateRange')}
                        >
                            <span className='ml-2'>Date Range (OOS Days)</span>
                            {/* <FaSort style={{ width: 11, height: 32, transform: 'rotate(0deg)', opacity: 1 }} /> */}
                        </div>
                    </div>
                </div>
                <>
                    {/* {displayData?.map((row, i) => ( */}
                    <div style={{ height: topSpacerHeight }} />

                    {visibleRows.map((row, i) => (
                        <div
                            key={startIndex + i}
                            className='oos-table-row flex items-center'
                            style={{ height: ROW_HEIGHT }}
                        >
                            {/* <div key={i} className='oos-table-row flex items-center'> */}
                                <div className="cell oos-cat-cell flex items-center px-2">
                                    <img src={row?.img ?? "/assets/images/productInActiveImage.svg"} alt="cat" className="oos-cat-img max-w-8 max-h-8" />
                                    <span className="oos-cat-text ml-2 my-2" title={row?.product}>{row?.product}</span>
                                </div>
                                <div className="cell oos-plat-cell flex items-center px-2">
                                    <img src={row?.platform?.logo ?? get_pf_image(row?.platform?.name) ?? "/assets/images/productInActiveImage.svg"} alt={row?.platform?.name} className="oos-plat-img max-w-8 max-h-8" />
                                    <span className="oos-plat-text ml-2">{row?.platform?.name}</span>
                                </div>
                                <div className="cell oos-pin-cell content-center px-2">
                                    {row?.pincode}
                                </div>
                                <div className="cell oos-oosdays-cell px-2 flex items-center justify-center" style={{ background: getOOSBgColor(row?.oosDays ?? 0, Math.min(...(displayData?.map(d => d?.oosDays) ?? [0])), Math.max(...(displayData?.map(d => d?.oosDays) ?? [0]))) }}>
                                    <span>{row?.oosDays}</span>
                                    <span
                                        style={{ marginLeft: '40px', cursor: 'pointer' }}
                                        onClick={e => {
                                            const rect = e.target.getBoundingClientRect();
                                            setCalendarPopup({
                                                open: true,
                                                dates: row?.dates ?? [],
                                                anchor: { top: rect.top + window.scrollY, left: rect.left + window.scrollX },
                                                dateRange: row?.dateRange ?? (row?.dates?.length ? showDateRange(row?.dates) : ""),
                                                title: `${selectedOOSDaySortType} OOS Days`,
                                            });
                                        }}
                                    >
                                        <LuCalendarDays />
                                    </span>
                                </div>
                                <div className="cell oos-date-cell px-2 text-center justify-center content-center" style={selectedOOSDaySortType === 'Consecutive' ? { background: getOOSBgColor(row?.oosDays, Math.min(...(displayData?.map(d => d?.oosDays) ?? [0])), Math.max(...(displayData?.map(d => d?.oosDays) ?? [0]))) } : {}}>
                                    {selectedOOSDaySortType === 'Cumulative' ? '---' : (row?.dates?.length ? showDateRange(row?.dates) : "")}
                                </div>
                            </div>
                        
                    ))}
                    <div style={{ height: bottomSpacerHeight }} />
                </>
            </div>
            <div className='min-w-[60px] max-w-[60px] w-[60px] min-h-[93vh] max-h-[93vh]  relative flex justify-center items-end'>
                <div style={{
                    position: 'absolute',
                    // right: '80px',
                    bottom: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '350px',
                    justifyContent: 'space-between',
                }}>
                    {/* <span style={{ fontSize: 14, color: '#222', marginBottom: 4 }}>High<br />OOS Days</span>
                    <div style={{
                        width: '12px',
                        height: '250px',
                        borderRadius: '6px',
                        background: 'linear-gradient(to bottom, #FFAD5B 0%, #FFE7D0 100%)',
                        margin: '0',
                    }}></div>
                    <span style={{ fontSize: 14, color: '#222', marginTop: 4 }}>Light<br />OOS Days</span> */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {/* Vertical bar */}
                        <div
                            style={{
                                width: "12px",
                                height: "300px",
                                borderRadius: "6px",
                                background: "linear-gradient(to bottom, #FFAD5B 0%, #FFE7D0 100%)",
                                marginRight: "12px", // spacing between bar and labels
                            }}
                        ></div>

                        {/* Labels stacked vertically */}
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "300px" }}>
                            <span style={{ fontSize: 14, color: "#222" }}>
                                High <br /> OOS Days
                            </span>
                            <span style={{ fontSize: 14, color: "#222" }}>
                                Low <br /> OOS Days
                            </span>
                        </div>
                    </div>

                </div>

            </div>
            <CalendarPopup
                dates={calendarPopup.dates}
                open={calendarPopup.open}
                anchor={calendarPopup.anchor}
                dateRange={calendarPopup.dateRange}
                title={calendarPopup.title}
                onClose={() => setCalendarPopup(initPopup)}
            />
        </div>
    );
})


OOSBreakdownTable.displayName = "OOSBreakdownTable";
export default OOSBreakdownTable;