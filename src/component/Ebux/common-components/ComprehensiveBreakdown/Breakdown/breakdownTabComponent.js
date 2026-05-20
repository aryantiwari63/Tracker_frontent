import SortableTab from "./sortableTab";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useEffect, useState } from "react";
import { saveOSAPlateform } from "../../../services/saveTabsPlateform.services";
import { useEbuxContext } from "../../../Context/EbuxProvider";
const BreakdownTabComponent = ({
    kpi,
    breakdownTabList,
    activeTabIndex,
    setActiveTabIndex,
    selectedTabName,
    setSelectedTabName,
    tabPosition,
    setTabPosition,
    breakdownTabData,
    selectedTableRows,
    removeAllSelectedTableRows,
    getAllSelectedTableRowsData,
    platformSubCat,
    selectedCount,
    selectedTotal,

    setDownloadkey,
  handleCustomizeClick,
  trackDashboardClick
}) => {
    const { activeClientProject } = useEbuxContext();
    // console.log('final page', platformSubCat)
    const [platform, setPlatform] = useState([])

    const getPlateformType = () => {
        const types = {
            SOS: "sos_plateform",
            PRO: "pro_plateform",
            RR: "rr_plateform",
            CS: "cs_plateform",
            OR: "org_plateform",
            SOM: "som_plateform",
            default: "osa_plateform"
        };
        return types[kpi] || types.default;
    };

    const plateformType = getPlateformType();

    const handleTabSelect = (index) => {
        setActiveTabIndex(index);
        setSelectedTabName(tabPosition?.[index]?.value);
    };
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor)
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active?.id !== over?.id) {
            setTabPosition((prevPosition) => {
                const oldIndex = prevPosition.findIndex((item) => item.value === active.id);
                const newIndex = prevPosition.findIndex((item) => item.value === over.id);
                const newdata = arrayMove(prevPosition, oldIndex, newIndex);
                const _tabPosition = saveTabPositions(newdata);
                const activeIndex = _tabPosition.findIndex((item) => item.value === selectedTabName);
                setActiveTabIndex(activeIndex);
                return newdata;
            });
        }
    };

    const getTabPositions = (data) => {
        const _tabPosition = data?.map((item, index) => ({ value: item?.value ?? item, position: index + 1 }));
        return _tabPosition;
    };
    const saveTabPositions = (data) => {
        if (data?.length) {
            
            let _tabPosition = getTabPositions(data);
            let tabsPayload = {
                "type": plateformType,
                "key": 'ComprehensivePosition',
                "ComprehensivePosition": _tabPosition,
            }
            saveOSAPlateform(tabsPayload);
            return _tabPosition;
        }
        return data;
    };

    const loadAndRearrangePlatformPositions = (data) => {
        // const storedPosition = JSON.parse(localStorage.getItem(`${kpi}TabPosition`));
        const storedPosition = platformSubCat[plateformType]?.ComprehensivePosition;
        
        // const storedPosition = platformSubCat.ComprehensivePosition;
        if (storedPosition?.length) {
            const rearrangedArray = storedPosition
                ?.map(posItem => data.find(item => item.value === posItem.value))
                ?.filter(item => item !== undefined);

            const newItems = data.filter(item =>
                !storedPosition?.some(posItem => posItem.value === item.value)
            );

            const finalArray = [...rearrangedArray, ...newItems];
            // console.log('hhh-final-arr',finalArray)
            saveTabPositions(finalArray);
            return finalArray;
        } else {
            return [];
        }
    };

    useEffect(() => {
        if (platform) {
            setPlatform(platformSubCat)
            if (!selectedTabName && breakdownTabList?.length) {
                let _tabPosition = getTabPositions(breakdownTabList);
                // const storedPosition = JSON.parse(localStorage.getItem(`${kpi}TabPosition`));
                
               
            const storedPosition = platformSubCat[plateformType]?.ComprehensivePosition;
                // console.log('storedPosition',storedPosition)
                if (!storedPosition || storedPosition.length === 0) {
                    // console.log('getttttdata---new')
                    saveTabPositions(_tabPosition ?? []);
                } else {
                    // console.log('getttttdata')
                    _tabPosition = loadAndRearrangePlatformPositions(_tabPosition ?? []);
                }
                if (_tabPosition.length) {
                    setTabPosition(_tabPosition);
                    setSelectedTabName(_tabPosition?.[0]?.value)
                }
            }
        }
    }, [platform]);

    return (

        <Tabs selectedIndex={activeTabIndex} onSelect={handleTabSelect}>
            <TabList>
                <div className='tabListWrap'>
                    <div className='tabList'>
                        <DndContext sensors={sensors} onDragEnd={handleDragEnd} >
                            <SortableContext items={tabPosition && tabPosition.map((item) => item.value)} >
                                {tabPosition && tabPosition?.length && tabPosition?.map((item) => (
                                    <Tab key={item.value} onClick={() => { getAllSelectedTableRowsData(); }}>
                                        <SortableTab
                                            key={item.value}
                                            id={item.value}
                                            selectedCount={selectedCount}
                                            selectedTotal={selectedTotal}
                                            selectedTableRows={selectedTableRows}
                                            breakdownTabData={breakdownTabData}
                                           
                                          
                                        />
                                    </Tab>
                                ))
                                }
                            </SortableContext>
                        </DndContext>

                    </div>
                    <div className='tabListBtn'>
                        {
                            activeClientProject?.isUseWidget?
                            <div className='tblFilterBtn flex items-center pe-2 '>
                                <button type="button" className="graphIconBtn" onClick={(e) => {
                                    // console.log('download !!!!!   !!!',selectedTabName)
                                    trackDashboardClick({ section: 'comprehensive breakdown', eventaction: e.type, eventlabel: selectedTabName })
    
                                    setDownloadkey(selectedTabName)
                                }}>
                                    <img src="/assets/images/downloadIcon.svg" width={22} height={22} />
                                </button>
                                <button type="button" className="graphIconBtn" onClick={() => handleCustomizeClick()}>
                                    <img src="/assets/images/columnsIcon.svg" width={22} height={22} />
                                </button>
                            </div>:<></>
                        }
                        
                        <button type="button" className="clearBtn" onClick={() => { removeAllSelectedTableRows(); }}>Clear all</button>
                        <button type="button" className="applyBtn" onClick={() => { getAllSelectedTableRowsData(); }}>Apply</button>
                    </div>
                </div>
            </TabList>
            {tabPosition?.length && tabPosition?.map((item) => (
                <TabPanel key={item.value}>
                    <></>
                </TabPanel>

            ))}



        </Tabs>
    );
}
export default BreakdownTabComponent;