import React from 'react';
import './OOSBreakdownTable.css';
import { FaSort } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import CalendarPopup from './calenderPopUp';

export const data = [
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Amazon', logo: '/assets/images/amazon.png' },
        oosDays: 7,
        dateRange: '1 August - 5 August',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 5,
        dateRange: '21 July - 27 July',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Zepto', logo: '/assets/images/zepto.png' },
        oosDays: 6,
        dateRange: '16 July - 18 July',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Flipkart', logo: '/assets/images/flipkart.png' },
        oosDays: 3,
        dateRange: '11 July - 14 July',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Lazada', logo: '/assets/images/lazada.png' },
        oosDays: 7,
        dateRange: '7 July - 12 July',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Zepto', logo: '/assets/images/zepto.png' },
        oosDays: 4,
        dateRange: '1 July - 2 July',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Amazon', logo: '/assets/images/amazon.png' },
        oosDays: 2,
        dateRange: '25 June - 30 June',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    },
    {
        img: '/assets/images/amazon.png',
        category: 'Nescafe Gold Blend Rich and Smooth Instant Coffee',
        pincode: '122001 / Gurugram',
        platform: { name: 'Blinkit', logo: '/assets/images/blinkit.png' },
        oosDays: 4,
        dateRange: '21 June - 23 June',
    }
];

// Helper to get gradient color based on oosDays value
function getOOSBgColor(oosDays, min, max) {
    const percent = (oosDays - min) / (max - min);
    const hex = (c1, c2) => Math.round(c1 + (c2 - c1) * percent);
    // #FFE7D0 = (255,231,208), #FFAD5B = (255,173,91)
    const r = hex(255, 255);
    const g = hex(231, 173);
    const b = hex(208, 91);
    return `rgb(${r},${g},${b})`;
}

export default function OOSBreakdownTable() {
    const [displayData, setDisplayData] = React.useState(data);
    const [sortedCols, setSortedCols] = React.useState({});
    const [selectedOOSDaySortType, setSelectedOOSDaySortType] = React.useState('Consecutive');
    const [calendarPopup, setCalendarPopup] = React.useState({ open: false, anchor: null, dateRange: '', title: '' });

    const handleSort = (key) => {
        const sortedData = [...data].sort((a, b) => {
            if (key === 'pincode') {
                const pinA = parseInt(a[key].split('/')[0].trim(), 10);
                const pinB = parseInt(b[key].split('/')[0].trim(), 10);
                return sortedCols[key] ? pinB - pinA : pinA - pinB;
            } else if (key === 'dateRange') {
                const dateA = new Date(a[key].split('-')[0].trim() + ' 2024');
                const dateB = new Date(b[key].split('-')[0].trim() + ' 2024');
                return sortedCols[key] ? dateB - dateA : dateA - dateB;
            } else if (key === 'platform') {
                return sortedCols[key] ? b[key].name.localeCompare(a[key].name) : a[key].name.localeCompare(b[key].name);
            }
        });
        setSortedCols(prev => ({ ...prev, [key]: !prev[key] }));
        setDisplayData(sortedData);
    };

    return (
        <div className="oos-table-container relative">
            <div className="oos-table-outer w-[90%] px-5 bg-white max-h-[90vh] overflow-x-hidden overflow-y-scroll hide-scrollbar">
                <div className='oos-table-header sticky top-0 z-10 flex items-center bg-gray-100 mx-4 my-2 rounded-lg'>
                    <div className='cell flex items-center px-2 ml-4 font-semibold'>
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
                    <div className='cell flex items-center font-semibold'>
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
                    <div className='cell flex items-center gap-8 font-semibold' onClick={() => handleSort('dateRange')}>
                        <span className='ml-2'>Date Range (OOS Days)</span>
                        <FaSort style={{ width: 11, height: 32, transform: 'rotate(0deg)', opacity: 1 }} />
                    </div>
                </div>
                <>
                    {displayData.map((row, i) => (
                        <div key={i} className='oos-table-row flex items-center'>
                            <div className="cell oos-cat-cell flex px-2">
                                <img src={row.img} alt="cat" className="oos-cat-img max-w-8" />
                                <span className="oos-cat-text ml-2">{row.category}</span>
                            </div>
                            <div className="cell oos-plat-cell flex px-2">
                                <img src={row.platform.logo} alt={row.platform.name} className="oos-plat-img max-w-8" />
                                <span className="oos-plat-text ml-2">{row.platform.name}</span>
                            </div>
                            <div className="cell oos-pin-cell px-2">
                                {row.pincode}
                            </div>
                            <div className="cell oos-oosdays-cell px-2 flex items-center justify-end" style={{ background: getOOSBgColor(row.oosDays, Math.min(...displayData.map(d => d.oosDays)), Math.max(...displayData.map(d => d.oosDays))) }}>
                                <span>{row.oosDays}</span>
                                <span
                                    style={{ marginLeft: '152px', cursor: 'pointer' }}
                                    onClick={e => {
                                        const rect = e.target.getBoundingClientRect();
                                        setCalendarPopup({
                                            open: true,
                                            anchor: { top: rect.top + window.scrollY, left: rect.left + window.scrollX },
                                            dateRange: row.dateRange,
                                            title: `${selectedOOSDaySortType} OOS Days`,
                                        });
                                    }}
                                >
                                    <LuCalendarDays />
                                </span>
                            </div>
                            <div className="cell oos-date-cell px-2 text-center justify-center content-center" style={selectedOOSDaySortType === 'Consecutive' ? { background: getOOSBgColor(row.oosDays, Math.min(...displayData.map(d => d.oosDays)), Math.max(...displayData.map(d => d.oosDays))) } : {}}>
                                {selectedOOSDaySortType === 'Cumulative' ? '---' : row.dateRange}
                            </div>
                        </div>
                    ))}
                </>
            </div>
            <div style={{
                position: 'absolute',
                right: '80px',
                bottom: '0px',
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
                            Light <br /> OOS Days
                        </span>
                    </div>
                </div>

            </div>
            <CalendarPopup
                open={calendarPopup.open}
                anchor={calendarPopup.anchor}
                dateRange={calendarPopup.dateRange}
                title={calendarPopup.title}
                onClose={() => setCalendarPopup({ ...calendarPopup, open: false })}
            />
        </div>
    );
}
