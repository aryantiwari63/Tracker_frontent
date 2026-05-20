import React from 'react';
import DateRangeCalender from './calender';
// Helper to parse date range like '1 August - 5 August'
// function parseDateRange(dateRange) {
//     if (!dateRange) return [null, null];
//     const [start, end] = dateRange.split('-').map(s => s.trim());
//     return [start, end];
// }

/**
 * CalendarPopup
 * @param { open, anchor, dateRange, title, onClose }
 * anchor: { top, left } (optional, for positioning)
 */
export default function CalendarPopup({ open, dateRange, anchor, title, onClose }) {
    if (!open) return null;
    const popupRef = React.useRef(null);
    React.useEffect(() => {
        if (!open) return;
        function handleClick(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open, onClose]);
    // For demo, just show a styled div with the date range and a static calendar
    // const [start, end] = parseDateRange(dateRange);
    // For demo, assume August 2025
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    // const startDay = start ? parseInt(start.split(' ')[0], 10) : null;
    // const endDay = end ? parseInt(end.split(' ')[0], 10) : null;
    // Calendar grid: 1st is Friday (6th day, 0-indexed)
    const firstDayOfWeek = 5; // August 1, 2025 is a Friday
    let calendar = [];
    let week = Array(firstDayOfWeek).fill(null);
    days.forEach((d) => {
        week.push(d);
        if (week.length === 7) {
            calendar.push(week);
            week = [];
        }
    });
    if (week.length) {
        while (week.length < 7) week.push(null);
        calendar.push(week);
    }
    // Popup position: below the anchor (calendar icon), but keep within viewport
    let top = 100, left = 100;
    const popupWidth = 484, popupHeight = 350;
    if (anchor) {
        // Default: below and horizontally centered to icon
        top = anchor.top + 36;
        left = anchor.left - popupWidth / 2 + 16;
        // If popup goes off right edge, shift left
        if (left + popupWidth > window.innerWidth - 8) {
            left = window.innerWidth - popupWidth - 8;
        }
        // If popup goes off left edge, shift right
        if (left < 8) left = 8;
        // If popup goes off bottom edge, show above the icon
        if (top + popupHeight > window.innerHeight - 8) {
            top = anchor.top - popupHeight - 8;
        }
        // If still off top, clamp to top
        if (top < 8) top = 8;
    }

    const popupStyle = {
        position: 'fixed',
        top,
        left,
        zIndex: 9999,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        border: '1px solid #e5e7eb',
        width: popupWidth,
        height: popupHeight,
        padding: 0,
        overflow: 'hidden',
        opacity: 1,
        gap: 1,
    };
    return (
        <div style={popupStyle} ref={popupRef}>
            <div
                className="flex items-center justify-between border-b border-gray-200 rounded-tl-[12px] rounded-tr-[12px]"
                style={{
                    width: 460,
                    height: 56,
                    gap: 12,
                    opacity: 1,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    paddingTop: 16,
                    paddingRight: 24,
                    paddingBottom: 16,
                    paddingLeft: 24,
                    angle: 0
                }}
            >
                <span className="flex items-center" style={{ fontSize: 16, fontWeight: 600, lineHeight: '24px', color: '#111827' }}>
                    <button className="mr-3" onClick={onClose}>X</button>
                    {title}
                </span>
                <span className="">{dateRange}</span>
            </div>
            <div className='m-2 p-4 border rounded-lg shadow-sm'><DateRangeCalender /> </div>
        </div>
    );
}
