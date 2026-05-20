import React from 'react'
import OOSBreakdownTable, { data as oosTableData } from './OOSBreakdownTable';

function DrawerComponent({ drawerInfo, onClose }) {

    drawerInfo.title = 'OOS Days Breakdown';
    const handleDownload = () => {
        // Prepare header and rows
        const header = ['Product', 'Platform', 'Pincode', 'OOS Days', 'Date Range'];
        const rows = oosTableData.map(row => [
            row.category,
            row.platform.name,
            row.pincode,
            row.oosDays,
            row.dateRange
        ]);
        const allRows = [header, ...rows];

        // Convert to CSV string
        const csvContent = allRows.map(r => r.map(field => '"' + String(field).replace(/"/g, '""') + '"').join(',')).join('\r\n');

        // Create a Blob and download as .csv (Excel can open CSV)
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'OOSBreakdownTable.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <div className="performanceDrawerBox">
                <div className="performanceDrawerHead" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button type="button" className="closeButton" onClick={onClose}>
                            <img src="/assets/images/drawerClose.svg" alt="close" />
                        </button>
                        <h6 className="capitalize" style={{ marginLeft: 8 }}>{drawerInfo?.title}</h6>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', marginLeft: 8, cursor: 'pointer' }} onClick={handleDownload} title="Download">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ opacity: 1, transform: 'rotate(0deg)' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7,10 12,15 17,10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    </span>
                </div>
                <div className="performanceDrawerContent" style={{ background: 'white', padding: 0 }}>
                    <OOSBreakdownTable />
                </div>
            </div>
        </>
    )
}

export default DrawerComponent