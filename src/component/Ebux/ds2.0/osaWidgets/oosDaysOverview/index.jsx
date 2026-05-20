import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import OosDaysOverviewComponent from './Components/oosDaysOverviewComponent';
import DrawerComponent from './Components/DrawerComponent';

const OosDaysOverview = () => {
  const [drawerInfo, setDrawerInfo] = useState({
    isOpen: false,//false//true
    title: "OOS Performance",
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
      <OosDaysOverviewComponent setDrawerInfo={setDrawerInfo} />
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
  );
};

export default OosDaysOverview;