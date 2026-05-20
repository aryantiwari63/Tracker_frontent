import React, { useState } from 'react'

import Drawer from 'react-modern-drawer';
import DrawerComponent from './Components/DrawerComponent';
import OsaPerformanceOverviewComponent from './Components/OsaPerformanceOverview';
import { useEbuxContext } from '../../../Context/EbuxProvider';
// import OSAPerformanceOverviewComponent1 from './Components/OsaPerformanceOverview/PerformanceOverview1';

function OsaPerformanceOverview() {

    const {
        kpi, kpiMap
    } = useEbuxContext();
    const [drawerInfo, setDrawerInfo] = useState({
        isOpen: false,//false//true
        title: `${kpi == "OSA" ? kpi : kpiMap?.[kpi]?.lable} Performance`,
        data: {} ?? {
            performanceOf: "brand",//brand/category
            value: "Apple",
        }

    })
    const closeDrawer = () => {
        setDrawerInfo(pre => ({
            ...pre,
            isOpen: false,
            data: {}
        }))
    }
    return (
        <>
            {/* <OSAPerformanceOverviewComponent1 setDrawerInfo={setDrawerInfo}/> */}
            <OsaPerformanceOverviewComponent setDrawerInfo={setDrawerInfo} drawerInfo={drawerInfo} />
            {drawerInfo.isOpen && (
                <Drawer
                    open={drawerInfo?.isOpen}
                    onClose={closeDrawer}
                    direction='right'
                    style={{ width: '90%' }}
                    className='performanceDrawerWrap'
                >
                    <DrawerComponent onClose={closeDrawer} drawerInfo={drawerInfo} />
                </Drawer>
            )}
        </>
    )
}

export default OsaPerformanceOverview;