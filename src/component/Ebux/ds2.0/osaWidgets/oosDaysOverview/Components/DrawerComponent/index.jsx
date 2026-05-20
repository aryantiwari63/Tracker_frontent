import React, { useRef } from 'react'
import OOSBreakdownTable
// , { data as oosTableData }
 from './OOSBreakdownTable';
// import * as XLSX from 'xlsx';

function DrawerComponent({ drawerInfo, onClose }) {

    const tableRef = useRef(null);
    drawerInfo.title = 'OOS Days Breakdown';
    
    const handleDownload = () => {
         tableRef?.current?.downloadTableData(); 
        // // Prepare data for XLSX export
        // const exportData = oosTableData.map(row => ({
        //     'Product': row.product || row.category || '',
        //     'Platform': row.platform?.name || '',
        //     'Pincode': row.pincode || '',
        //     'OOS Days': row.oosDays || 0,
        //     'Date Range': row.dateRange || ''
        // }));

        // // Create worksheet
        // const worksheet = XLSX.utils.json_to_sheet(exportData);
        
        // // Create workbook
        // const workbook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(workbook, worksheet, 'OOS Breakdown');
        
        // // Generate file name with timestamp
        // const fileName = `OOS_Breakdown_${new Date().toISOString().slice(0, 10)}_${new Date().getTime()}.xlsx`;
        
        // // Export to XLSX
        // XLSX.writeFile(workbook, fileName);
    };

    return (
        <>
            <div className="performanceDrawerBox">
                
                <div className="performanceDrawerHead" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className='flex gap-2' style={{ display: 'flex', alignItems: 'center' }}>
                        <button type="button" className="closeButton" onClick={onClose}>
                            <img src="/assets/images/drawerClose.svg" alt="close" />
                        </button>
                        <h6 className="capitalize" style={{ marginLeft: 8 }}>{drawerInfo?.title}</h6>
                        <div className='flex py-1 px-3 rounded-md border border-blue-300 gap-2'>
                            
                        <span>Brand:</span><strong>{drawerInfo?.data?.brand}</strong> |
                        <span>{drawerInfo?.data?.selectedView}:</span> <strong>{drawerInfo?.data?.selectedViewItem}</strong> |
                        <span>Total OOS Products:</span><strong>{drawerInfo?.data?.web_pid?.length}</strong>
                        </div>
                        
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', marginLeft: 8, cursor: 'pointer' }} className=' mr-[65px]' onClick={handleDownload} title="Download">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ opacity: 1, transform: 'rotate(0deg)' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7,10 12,15 17,10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    </span>
                </div>
                <div className="performanceDrawerContent" style={{ background: 'white', padding: 0 }}>
                    <OOSBreakdownTable drawerInfo={drawerInfo} ref={tableRef} />
                </div>
            </div>
        </>
    )
}

export default DrawerComponent