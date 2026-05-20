import React, { useEffect, useRef, useState } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

import Loader from "../../Loader";
import TableFilterComponent from '../tableFilterComponent';
import BreakdownDrawer from './BreakdownDrawer';
import TableTabComponent from './tableTabComponent';
import { useEbuxContext } from '../../../Context/EbuxProvider';
import SelectedItemPopupComponent from '../SelectedItemPopupComponent';
import { fetchComprehensiveBreakdownData } from '../../../services/comprehensiveBreakdownPR.services';
import { MdOutlineDragIndicator } from 'react-icons/md';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isEqual } from 'lodash';

import { saveOSAPlateform } from '../../../services/saveTabsPlateform.services';
function SortableTab({ id, selectedTableRows, reportTableData }) {


    const {
        attributes: TabAttributes,
        listeners: TabListeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });

    const style = {
        transform: CSS?.Transform?.toString(transform),
        transition,
        zIndex: transform ? 999 : 'auto',
        position: transform ? 'relative' : 'static',
    };

    const getComponent = (ComponentName = "", listeners, attributes) => {
        switch (ComponentName) {
            case "Category":
                return <div className="tabBtnBox" {...listeners} {...attributes}><img src="/assets/images/categorytIcon.svg" width={18} height={18} className="tabIcon" /> Category <div className="tblTag" >{selectedTableRows?.["category"]?.length}/{reportTableData?.["category"]?.length}</div></div>;
            case "SKU":
                return <div className="tabBtnBox" {...listeners} {...attributes}><img src="/assets/images/productIcon.svg" width={18} height={18} className="tabIcon" /> SKU <div className="tblTag" >{selectedTableRows?.["sku"]?.length}/{reportTableData?.["sku"]?.length}</div></div>;
            case "Location":
                return <div className="tabBtnBox" {...listeners} {...attributes}><img src="/assets/images/locationIcon.svg" width={18} height={18} className="tabIcon" /> Location <div className="tblTag" >{selectedTableRows?.["location"]?.length}/{reportTableData?.["location"]?.length}</div></div>;
            case "Brand":
                return <div className="tabBtnBox" {...listeners} {...attributes}><img src="/assets/images/brandIcon.svg" width={18} height={18} className="tabIcon" /> Brand <div className="tblTag" >{selectedTableRows?.["brand"]?.length}/{reportTableData?.["brand"]?.length}</div></div>;
            case "Platform":
                return <div className="tabBtnBox" {...listeners} {...attributes}><img src="/assets/images/platformIcon.svg" width={18} height={18} className="tabIcon" /> Platform <div className="tblTag" >{selectedTableRows?.["platform"]?.length}/{reportTableData?.["platform"]?.length}</div></div>;
            default:
                return <></>;
        }
    }



    return (
        <div
            ref={setNodeRef}
            style={style}
        >
            {getComponent(id, TabListeners, TabAttributes)}
        </div>
    );
}
const ComprehensiveBreakdownComponent = ({ listeners, attributes, platformSubCat }) => {

    const tab_headers = ["Category", "SKU", "Location", "Platform", "Brand"];
    const {
        kpi,
        selectedPlatform,
        selectedFilters, filters
    } = useEbuxContext();
    const [combinedState, setCombinedState] = useState({
        breakdownFilters: {
            saved_search: [], custom: [], platform: [], brand: [], category: [], location: []
        },
        _selectedTableRows: {
            category: [], sku: [], location: [], platform: [], brand: []
        },
        selectedDateRange: selectedFilters?.selectedDateRange
    });


    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const [downloadkey, setDownloadkey] = useState('');
    const [loading, setLoading] = useState(false);
    const [, setError] = useState();
    // const [Error, setError] = useState();

    const [reportTableData, setReportTableData] = useState({
        category: [], sku: [], location: [], platform: [], brand: []
    });
    const [selectedTableRows, setSelectedTableRows] = useState({
        category: [], sku: [], location: [], platform: [], brand: []
    });

    const [platform, setPlatform] = useState([]);
    const fetchReportTableData = async (mkey, datakey, dataLable) => {

        setLoading(true);
        try {
            const finaldata = await fetchComprehensiveBreakdownData(kpi, datakey, dataLable, combinedState?.breakdownFilters, filters, selectedFilters, selectedPlatform, combinedState?._selectedTableRows);
            return finaldata;
        } catch (error) {
            setError(error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    async function fetchData() {
        const _category = await fetchReportTableData('category', "brand_category_id", "brand_category_name");
        const _sku = await fetchReportTableData('sku', "sku_id", "web_pid");
        const _location = await fetchReportTableData('location', "location_name", "location_name");
        const _brand = await fetchReportTableData('brand', "brand_id", "brand_name");
        const _platform = await fetchReportTableData('platform', "pf_id", "platform_name");

        setReportTableData((data) => ({ ...data, 'category': _category, 'sku': _sku, 'location': _location, 'brand': _brand, 'platform': _platform }));
    }
    
    const previousCombinedState = useRef({});
    useEffect(() => {
        if (!isEqual(previousCombinedState.current, JSON.stringify(combinedState))) {
            previousCombinedState.current = JSON.stringify(combinedState);
            fetchData();
        }
    }, [combinedState]);

    useEffect(() => {
        setCombinedState((prevFilters) => ({
            ...prevFilters,
            selectedDateRange: selectedFilters?.selectedDateRange
        }));
    }, [selectedFilters]);

    const [drawerInfo, setDrawerInfo] = useState({ isOpen: false, column: null, value: null, lable: null,multiple:false });
    const openDrawer = (column, value, lable, image = '', name = '') => {
        if (column && value && lable) {
            setDrawerInfo({ isOpen: true, column, value, lable, image, name,multiple:false });
        }
    };

    const openMultipleInDrawer = (column) => {
        console.log("openMultipleInDrawer",selectedTableRows?.[column]?.length,selectedTableRows?.[column]);
        
        if (column && selectedTableRows?.[column]?.length) {
            setDrawerInfo({ isOpen: true, column, value:selectedTableRows?.[column],multiple:true });
        }
    };
    const closeDrawer = () => {
        setDrawerInfo({ isOpen: false, column: null, value: null, lable: null, image: null, name: null,multiple:false });
    };

    const [popupInfo, setPopupInfo] = useState({ isOpen: false, column: null });
    const handleColumnClick = (column) => {
        if (column) {
            setPopupInfo({ isOpen: true, column });
        }
    };
    const closePopup = () => {
        setPopupInfo({ isOpen: false, column: null });
    };
    const applyFilterValues = (column, values) => {
        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                [column]: values,
            };
            tab_headers.forEach((tab_header) => {
                if (column != tab_header.toLowerCase()) {
                    updatedFilters[tab_header.toLowerCase()] = []
                }
            })
            setCombinedState((prevFilters) => ({
                ...prevFilters,
                _selectedTableRows: {
                    ...prevFilters?._selectedTableRows,
                    ...updatedFilters
                }
            }));
            return updatedFilters;
        });
    };
    const removeAllSelectedTableRows = () => {
        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                category: [], sku: [], location: [], platform: [], brand: []
            };
            setCombinedState((prevFilters) => ({
                ...prevFilters,
                _selectedTableRows: {
                    ...prevFilters?._selectedTableRows,
                    ...updatedFilters
                }
            }));
            return updatedFilters;
        });
    }
    const getAllSelectedTableRowsData = () => {
        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters
            };
            tab_headers.forEach((tab_header) => {
                if (selectedTabName != tab_header) {
                    updatedFilters[tab_header.toLowerCase()] = []
                }
            });

            setCombinedState((prevFilters) => ({
                ...prevFilters,
                _selectedTableRows: {
                    ...prevFilters?._selectedTableRows,
                    ...updatedFilters
                }
            }));
            return updatedFilters;
        });
    }
    const applyBreakdownFilters = (sFilters, current) => {
        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                category: [], sku: [], location: [], platform: [], brand: []
            };
            setCombinedState((prevCombinedStateFilters) => ({
                ...prevCombinedStateFilters,
                breakdownFilters: (current == "clear") ? ({
                    saved_search: [], custom: [], platform: [], brand: [], category: [], location: []
                }) : ({
                    ...prevCombinedStateFilters.breakdownFilters,
                    [current]: sFilters?.[current] ?? []
                }),
                _selectedTableRows: {
                    ...prevCombinedStateFilters?._selectedTableRows,
                    ...updatedFilters
                }
            }));
            return updatedFilters;
        });
    }
    const filtersKeys = {
        SKU: "SKU",
        Discount: 100
    }
    const [proTabPosition, setPROTabPosition] = useState([]);
    const [selectedTabName, setSelectedTabName] = useState('');

    const savePlatformPositions = (data) => {
        const _proTabPosition = data?.map((item, index) => ({
            value: item.value,
            position: index + 1
        }));
        // localStorage.setItem("PROTabPosition", JSON.stringify(_proTabPosition));
        let tabsPayload = {
            "type": 'pro_plateform',
            "key": 'ComprehensivePosition',
            "ComprehensivePosition": _proTabPosition,
          }
          saveOSAPlateform(tabsPayload);
    };

    const loadAndRearrangePlatformPositions = (data) => {

        // const storedPosition = JSON.parse(localStorage.getItem("PROTabPosition"));
        const storedPosition = platform.ComprehensivePosition;
        if (storedPosition?.length) {

            const rearrangedArray = storedPosition
                ?.map(posItem => data.find(item => item.value === posItem.value))
                ?.filter(item => item !== undefined);

            const newItems = data.filter(item =>
                !storedPosition?.some(posItem => posItem.value === item.value)
            );

            const finalArray = [...rearrangedArray, ...newItems];

            savePlatformPositions(finalArray);
            return finalArray;
        } else {
            return [];
            // return data;
        }

    };



    useEffect(() => {
        if (platform) {
        let _proTabPosition = tab_headers.map((item, index) => ({
            value: item,
            position: index + 1
        }));

        // const storedPosition = JSON.parse(localStorage.getItem("PROTabPosition"));
        const storedPosition = platform;
        console.log('%%%',storedPosition)
        if (!storedPosition || storedPosition.length === 0) {
            savePlatformPositions(_proTabPosition ?? []);
        } else {
            
            _proTabPosition = loadAndRearrangePlatformPositions(_proTabPosition ?? []);
        }
        
        setPROTabPosition(_proTabPosition);
        setSelectedTabName(_proTabPosition?.[0]?.value)
    }
    }, [platform]);
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active?.id !== over?.id) {
            setPROTabPosition((prevPosition) => {
                const oldIndex = prevPosition.findIndex((item) => item.value === active.id);
                const newIndex = prevPosition.findIndex((item) => item.value === over.id);
                const newdata = arrayMove(prevPosition, oldIndex, newIndex);
                const _proTabPosition = newdata.map((item, index) => ({
                    value: item.value,
                    position: index + 1
                }));
                // localStorage.setItem("PROTabPosition", JSON.stringify(_proTabPosition));
                let tabsPayload = {
                    "type": 'pro_plateform',
                    "key": 'ComprehensivePosition',
                    "ComprehensivePosition": _proTabPosition,
                  }
                  saveOSAPlateform(tabsPayload);
                const activeIndex = _proTabPosition.findIndex((item) => item.value === selectedTabName);
                setActiveTabIndex(activeIndex);
                return newdata;
            });
        }
    };

    useEffect(() => {
        const loadPlatformData = async () => {
          try {
            // const response = await getTabsPlateform();
            // if (response?.userRecord?.osa_plateform?.ComprehensivePosition) {
            //   setPlatform(response.userRecord.osa_plateform);
            // }
            if (platformSubCat?.pro_plateform?.ComprehensivePosition) {
                setPlatform(platformSubCat.pro_plateform);
              }
          } catch (error) {
            console.error("Error loading platform data:", error);
          }
        };
    
        loadPlatformData();
      }, []);
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor)
    );


    const getTableTabComponent = (ComponentName = "") => {
        switch (ComponentName) {
            case "Category":
                return (<TableTabComponent
                    dataHeader="Category"
                    reportTableData={reportTableData?.["category"]}
                    selectedTabName={selectedTabName}
                    setLoading={setLoading}
                    openDrawer={openDrawer}
                    openMultipleInDrawer={openMultipleInDrawer}
                    selectedTableRows={selectedTableRows}
                    setSelectedTableRows={setSelectedTableRows}
                    setCombinedState={setCombinedState}
                    handleColumnClick={handleColumnClick}
                    sortConfig={sortConfig} setSortConfig={setSortConfig}
                    downloadkey={downloadkey}
                    setDownloadkey={setDownloadkey}
                />);
            case "SKU":
                return (<TableTabComponent
                    dataHeader="SKU"
                    reportTableData={reportTableData?.["sku"]}
                    selectedTabName={selectedTabName}
                    setLoading={setLoading}
                    openDrawer={openDrawer}
                    openMultipleInDrawer={openMultipleInDrawer}
                    selectedTableRows={selectedTableRows}
                    setSelectedTableRows={setSelectedTableRows}
                    setCombinedState={setCombinedState}
                    handleColumnClick={handleColumnClick}
                    sortConfig={sortConfig} setSortConfig={setSortConfig}
                    downloadkey={downloadkey}
                    setDownloadkey={setDownloadkey}

                />);
            case "Location":
                return (<TableTabComponent
                    dataHeader="Location"
                    reportTableData={reportTableData?.["location"]}
                    selectedTabName={selectedTabName}
                    setLoading={setLoading}
                    openDrawer={openDrawer}
                    openMultipleInDrawer={openMultipleInDrawer}
                    selectedTableRows={selectedTableRows}
                    setSelectedTableRows={setSelectedTableRows}
                    setCombinedState={setCombinedState}
                    handleColumnClick={handleColumnClick}
                    sortConfig={sortConfig} setSortConfig={setSortConfig}
                    downloadkey={downloadkey}
                    setDownloadkey={setDownloadkey}

                />);

            case "Brand":
                return (<TableTabComponent
                    dataHeader="Brand"
                    reportTableData={reportTableData?.["brand"]}
                    selectedTabName={selectedTabName}
                    setLoading={setLoading}
                    openDrawer={openDrawer}
                    openMultipleInDrawer={openMultipleInDrawer}
                    selectedTableRows={selectedTableRows}
                    setSelectedTableRows={setSelectedTableRows}
                    setCombinedState={setCombinedState}
                    handleColumnClick={handleColumnClick}
                    sortConfig={sortConfig} setSortConfig={setSortConfig}
                    downloadkey={downloadkey}
                    setDownloadkey={setDownloadkey}
                />);

            case "Platform":
                return (<TableTabComponent
                    dataHeader="Platform"
                    reportTableData={reportTableData?.["platform"]}
                    selectedTabName={selectedTabName}
                    setLoading={setLoading}
                    openDrawer={openDrawer}
                    openMultipleInDrawer={openMultipleInDrawer}
                    selectedTableRows={selectedTableRows}
                    setSelectedTableRows={setSelectedTableRows}
                    setCombinedState={setCombinedState}
                    handleColumnClick={handleColumnClick}
                    sortConfig={sortConfig} setSortConfig={setSortConfig}
                    downloadkey={downloadkey}
                    setDownloadkey={setDownloadkey}
                />);
            default:
                return <></>;
        }
    }


    const handleTabSelect = (index) => {
        setActiveTabIndex(index);
        setSelectedTabName(proTabPosition?.[index]?.value);
    };
    return (
        <>

            <div className="tableContentWrap tableContentWrapHead">
                <div className="sectionIconHead">
                    <div className='flex gap-2 items-center'>

                        <MdOutlineDragIndicator
                            {...listeners}
                            {...attributes}
                        />
                        <div className="sectionIcon">
                            <img src="/assets/images/comprehensiveIcon.svg" width={16} height={14} />
                        </div>
                        <h4>Comprehensive Breakdown</h4>
                        {loading && <Loader show={loading} fullScreen={false} />}
                    </div>
                </div>
                <div className='tblFilterBox'>
                    <TableFilterComponent filtersKeys={filtersKeys} onChange={(sFilters, current) => applyBreakdownFilters(sFilters, current)} />
                    <div className='tblFilterBtn'>
                        <button type="button" className="graphIconBtn" onClick={() => setDownloadkey(selectedTabName)}>
                            <img src="/assets/images/downloadIcon.svg" width={22} height={22} />
                        </button>
                        <button type="button" className="graphIconBtn opacity-30" disabled>
                            <img src="/assets/images/columnsIcon.svg" width={22} height={22} />
                        </button>
                    </div>
                </div>

                {!loading &&
                    <div className="tableContentWrap">
                        <div className="tableContentTabs">
                            <Tabs selectedIndex={activeTabIndex} onSelect={handleTabSelect}>
                                <TabList>
                                    <div className='tabListWrap'>
                                        <div className='tabList'>
                                            <DndContext sensors={sensors} onDragEnd={handleDragEnd} >
                                                <SortableContext items={proTabPosition.map((item) => item.value)} >
                                                    {proTabPosition?.length && proTabPosition?.map((item) => (
                                                        <Tab key={item.value}>
                                                            <SortableTab
                                                                key={item.value}
                                                                id={item.value}
                                                                selectedTableRows={selectedTableRows}
                                                                reportTableData={reportTableData}
                                                            />
                                                        </Tab>
                                                    ))
                                                    }
                                                </SortableContext>
                                            </DndContext>
                                            {/* <Tab ><div className="tabBtnBox"><img src="/assets/images/categorytIcon.svg" width={18} height={18} className="tabIcon" /> Category <div className="tblTag" >{selectedTableRows?.["category"]?.length}/{reportTableData?.["category"]?.length}</div></div></Tab>
                                            <Tab ><div className="tabBtnBox"><img src="/assets/images/productIcon.svg" width={18} height={18} className="tabIcon" /> SKU <div className="tblTag" >{selectedTableRows?.["sku"]?.length}/{reportTableData?.["sku"]?.length}</div></div></Tab>
                                            <Tab ><div className="tabBtnBox"><img src="/assets/images/locationIcon.svg" width={18} height={18} className="tabIcon" /> Location <div className="tblTag" >{selectedTableRows?.["location"]?.length}/{reportTableData?.["location"]?.length}</div></div></Tab> */}
                                        </div>
                                        <div className='tabListBtn'>
                                            <button type="button" className="clearBtn" onClick={() => { removeAllSelectedTableRows(); }}>Clear all</button>
                                            <button type="button" className="applyBtn" onClick={() => { getAllSelectedTableRowsData(); }}>Apply</button>
                                        </div>
                                    </div>
                                </TabList>
                                {proTabPosition?.length && proTabPosition?.map((item) => (
                                    <TabPanel key={item.value}>{getTableTabComponent(item.value)}</TabPanel>
                                ))}

                            </Tabs>


                        </div>
                    </div>
                }
            </div>

            {popupInfo.isOpen && (
                <SelectedItemPopupComponent
                    popupTitle={popupInfo.column}
                    values={reportTableData?.[popupInfo.column]}
                    selectedTableRows={selectedTableRows}
                    applyFilterValues={selectedValues => applyFilterValues(popupInfo.column, selectedValues)}
                    closePopup={closePopup}
                />
            )}
            {drawerInfo.isOpen && (
                <Drawer
                    open={drawerInfo?.isOpen}
                    onClose={closeDrawer}
                    direction='right'
                    style={{ width: '1020px' }}
                    className='performanceDrawerWrap'
                >
                    <BreakdownDrawer onClose={closeDrawer} drawerInfo={drawerInfo}
                        selectedTableRows={selectedTableRows} breakdownFilters={combinedState?.breakdownFilters}
                        comprehensiveBreakdownTableData={reportTableData} />
                </Drawer>

            )}
        </>
    );
};

export default ComprehensiveBreakdownComponent;
