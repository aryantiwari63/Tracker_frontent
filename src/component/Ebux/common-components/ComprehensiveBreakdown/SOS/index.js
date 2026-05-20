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
import { fetchComprehensiveBreakdownData } from '../../../services/comprehensiveBreakdownSOS.services';
import { MdOutlineDragIndicator } from 'react-icons/md';

import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isEqual } from 'lodash';

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
            case "Keyword":
                return <div className="tabBtnBox" {...listeners} {...attributes}><img src="/assets/images/productIcon.svg" width={18} height={18} className="tabIcon" /> Keyword <div className="tblTag" >{selectedTableRows?.["keyword"]?.length}/{reportTableData?.["keyword"]?.length}</div></div>;
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
const ComprehensiveBreakdownComponent = ({ listeners, attributes }) => {
    const tab_headers = ["Category", "Keyword", "Platform", "Brand"];
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
            category: [], keyword: [],platform: [],brand: []
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
        category: [],keyword: [],platform: [],brand: []
    });
    const [selectedTableRows, setSelectedTableRows] = useState({
        category: [],keyword: [],platform: [],brand: []
    });

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
        const _category = await fetchReportTableData('category', "category_flag_4", "category_flag_4");
        const _keyword = await fetchReportTableData('keyword', "keyword_id", "keyword");
        const _brand = await fetchReportTableData('brand', "brand_id", "brand_name");
        const _platform = await fetchReportTableData('platform', "pf_id", "platform_name");

        setReportTableData((data) => ({ ...data, 'category': _category, 'keyword': _keyword, 'brand': _brand, 'platform': _platform  }));
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
                category: [],keyword: [],platform: [],brand: []
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

    }
    const applyBreakdownFilters = (sFilters, current) => {
        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                category: [],keyword: [],platform: [],brand: []
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
        keyword: "keyword",
        SOS: 100
    }


    const [sosTabPosition, setSOSTabPosition] = useState([]);
    const [selectedTabName, setSelectedTabName] = useState('');

    const savePlatformPositions = (data) => {
        const _sosTabPosition = data?.map((item, index) => ({
            value: item.value,
            position: index + 1
        }));
        localStorage.setItem("SOSTabPosition", JSON.stringify(_sosTabPosition));

    };

    const loadAndRearrangePlatformPositions = (data) => {

        const storedPosition = JSON.parse(localStorage.getItem("SOSTabPosition"));
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
        }

    };



    useEffect(() => {
        let _sosTabPosition = tab_headers.map((item, index) => ({
            value: item,
            position: index + 1
        }));

        const storedPosition = JSON.parse(localStorage.getItem("SOSTabPosition"));
        if (!storedPosition) {
            savePlatformPositions(_sosTabPosition ?? []);
        } else {
            _sosTabPosition = loadAndRearrangePlatformPositions(_sosTabPosition ?? []);
        }
        setSOSTabPosition(_sosTabPosition);
        setSelectedTabName(_sosTabPosition?.[0]?.value)
    }, []);
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active?.id !== over?.id) {
            setSOSTabPosition((prevPosition) => {
                const oldIndex = prevPosition.findIndex((item) => item.value === active.id);
                const newIndex = prevPosition.findIndex((item) => item.value === over.id);
                const newdata = arrayMove(prevPosition, oldIndex, newIndex);
                const _sosTabPosition = newdata.map((item, index) => ({
                    value: item.value,
                    position: index + 1
                }));
                localStorage.setItem("SOSTabPosition", JSON.stringify(_sosTabPosition));

                const activeIndex = _sosTabPosition.findIndex((item) => item.value === selectedTabName);
                setActiveTabIndex(activeIndex);
                return newdata;
            });
        }
    };
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor)
    );


    const getTableTabComponent = (ComponentName = "") => {
        switch (ComponentName) {
            case "Category":
                return (
                    <TableTabComponent
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
            case "Keyword":
                return (
                    <TableTabComponent
                        dataHeader="Keyword"
                        reportTableData={reportTableData?.["keyword"]}
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
        setSelectedTabName(sosTabPosition?.[index]?.value);
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
                                                <SortableContext items={sosTabPosition.map((item) => item.value)} >
                                                    {sosTabPosition?.length && sosTabPosition?.map((item) => (
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
                                            <Tab ><div className="tabBtnBox"><img src="/assets/images/productIcon.svg" width={18} height={18} className="tabIcon" /> Keyword <div className="tblTag" >{selectedTableRows?.["keyword"]?.length}/{reportTableData?.["keyword"]?.length}</div></div></Tab> */}
                                        </div>
                                        <div className='tabListBtn'>
                                            <button type="button" className="clearBtn" onClick={() => { removeAllSelectedTableRows(); }}>Clear all</button>
                                            <button type="button" className="applyBtn" onClick={() => { getAllSelectedTableRowsData(); }}>Apply</button>
                                        </div>
                                    </div>
                                </TabList>
                                {sosTabPosition?.length && sosTabPosition?.map((item) => (
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
