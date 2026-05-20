import React, { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import BreakdownComponent from './common-components/ComprehensiveBreakdown/SOD/breakdown';
import PlatformTabsComponent from './common-components/PlatformTabsComponent';
import PlatformChartComponent from './common-components/PlatformChartComponent';

import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { saveTabsPlateform, getTabsPlateform } from './services/saveTabsPlateform.services';

import { useEbuxContext } from './Context/EbuxProvider';
import { PALETTE } from "./ds2.0/widgetConstant";
import PlatformTabsComponent1 from './common-components/PlatformTabsComponent1';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TrendAnalysis from './ds2.0/trendAnalysis';
function SortableItem({ id, platformSubCat }) {


    const {
        attributes,
        listeners,
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
            case "PlatformChart":
                return <PlatformChartComponent listeners={listeners} attributes={attributes} />;
            case "ComprehensiveBreakdown":
                // return <ComprehensiveBreakdownComponent  listeners={listeners} attributes={attributes} platformSubCat={platformSubCat}/>;
                return <BreakdownComponent listeners={listeners} attributes={attributes} platformSubCat={platformSubCat} />;
            // return <ComprehensiveBreakdownComponent  listeners={listeners} attributes={attributes} platformSubCat={platformSubCat}/>;
            default:
                return <></>;
        }
    }



    return (
        <div
            ref={setNodeRef}
            style={style}
        >
            {getComponent(id, listeners, attributes)}
        </div>
    );
}
const ShareDisplay = ({ type = 1 }) => {
    const {
        kpi,
        selectedKpiDragPosition,
        setFiltersDarkStore
    } = useEbuxContext();

    const [platform, setPlatform] = useState([]);
    const [platformSubCat, setPlatformSubCat] = useState([]);
    const [isPlatform, setIsPlatform] = useState(false);

    const savePlatformPositions = async (data) => {
        await saveTabsPlateform(data);
    };


    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active?.id !== over?.id) {
            setPlatform((prevPlatforms) => {
                const oldIndex = prevPlatforms.findIndex((item) => item.value === active.id);
                const newIndex = prevPlatforms.findIndex((item) => item.value === over.id);
                const newdata = arrayMove(prevPlatforms, oldIndex, newIndex);
                const platformPosition = newdata.map((item, index) => ({
                    value: item.value,
                    position: index + 1
                }));
                let tabsPayload = {
                    "SODPosition": platformPosition,
                }
                saveTabsPlateform(tabsPayload);
                return newdata;
            });
        }
    };
    useEffect(() => {
        loadPlatformData();
    }, [isPlatform, JSON.stringify(selectedKpiDragPosition)]);



    useEffect(() => {
        console.log('Platform state updated:', platform);
        const newP = [...platform];
        if (type == 1 && platform?.findIndex((i) => i.value == "PlatformChart") == -1) {
            newP.push({ value: "PlatformChart", position: newP.length });
        }
        if (type == 1 && platform?.findIndex((i) => i.value == "Focuscharts") == -1) {
            newP.push({ value: "Focuscharts", position: newP.length });

        }
        if (type == 1 && platform?.findIndex((i) => i.value == "ComprehensiveBreakdown") == -1) {
            newP.push({ value: "ComprehensiveBreakdown", position: newP.length });

        }
        if (newP?.length > platform?.length) {
            setPlatform(newP);
        }
    }, [platform]);
    const loadPlatformData = async () => {
        try {
            const response = await getTabsPlateform(); // Fetch data from API
            console.log('=====pc', response.userRecord.sod_plateform)
            if (response?.userRecord?.tabs_plateform?.SODPosition?.length) {
                setPlatform(response.userRecord.tabs_plateform.SODPosition);
                setPlatformSubCat(response.userRecord)
            } else {
                // If no data from API, initialize with default data
                const defaultPlatform = [
                    { value: "PlatformChart", position: 0 },
                    { value: "ComprehensiveBreakdown", position: 2 },
                ];
                let tabsPayload = {
                    "SODPosition": defaultPlatform,
                }

                setPlatform(defaultPlatform);
                setIsPlatform(true)
                await savePlatformPositions(tabsPayload);
            }
        } catch (error) {
            console.error("Error loading platform data:", error);
            setPlatform([]);
        }
    };
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor)
    );
    const [selected, setSelected] = useState(type == 1 ? "executive_summary" : "executive_summary")

    const handleChange = (event, newValue) => {
        setSelected(newValue);
        setFiltersDarkStore(prevFilters => ({
            ...prevFilters,
            tab_type: newValue
        }));
    };
    useEffect(() => {
        handleChange(null, "executive_summary")
    }, []);
    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const tabItems = [
        { label: "Executive Summary", value: "executive_summary" },
        // { label: "Dark Store Analysis", value: "dark_store_analysis" },
        // { label: "Trend Analysis", value: "trend_analysis" },
        { label: "Comprehensive Breakdown", value: "comprehensive_breakdown" },
    ];
    console.log("selected Tab", selected)
    return (
        <>
            {type == 1 ? <PlatformTabsComponent type={"sod_plateform"} /> : <PlatformTabsComponent1 type={"sod_plateform"} />}
            {type == 2 && <div className='w-full bg-[#FFFFFF] px-4 my-4 relative flex justify-between items-center'>
                <div>
                    <Tabs
                        value={selected}
                        onChange={handleChange}
                        aria-label="drawer tabs"
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                            "& .MuiTab-root": {
                                color: "#00000099",
                                textTransform: "none",
                            },
                            "& .MuiTab-root.Mui-selected": {
                                color: "#1890FF",
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#1890FF",
                                bottom: 0, // Aligns the indicator to the container bottom
                                height: "2px", // Adjust thickness if needed
                            },
                        }}
                    >
                        {tabItems.map((tab) => (
                            <Tab
                                key={tab.value}
                                value={tab.value}
                                label={
                                    <div className={`flex items-center gap-1 font-inter font-normal text-base leading-6 tracking-normal align-middle ${tab?.disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                        {tab.label}
                                    </div>
                                }
                                {...a11yProps(tab.value)}
                            />
                        ))}
                    </Tabs>
                </div>
                {/* {selected == "executive_summary" && <button className='bg-[#1890FF] px-3 py-2 rounded-lg text-white text-sm flex gap-2'><img src="/assets/images/brandIconWhite.svg" />Widget</button>} */}
            </div>
            }

            {selected == "trend_analysis" ? <div><TrendAnalysis /></div> : <></>}
            {selected == "comprehensive_breakdown" ? <BreakdownComponent listeners={null} attributes={null} platformSubCat={platformSubCat} /> : <></>}

            {selected == "executive_summary" ? (



                <DndContext sensors={sensors} onDragEnd={handleDragEnd} >

                    <SortableContext items={(Array.isArray(platform) ? platform : []).map((item) => item.value)} >
                        <div className="grid grid-cols-2 gap-4 w-full">
                            {(Array.isArray(platform) ? platform : []).map((item) => {
                                const meta = PALETTE.find((p) => p?.id === item?.value); // match with widgetConstant.js
                                const notAllow = ((meta?.kpi?.indexOf(kpi) ?? -1) == -1);
                                // Decide width from rowSize
                                let spanClass = "col-span-2"; // default full width
                                if (meta?.rowSize === 2) spanClass = "col-span-1 max-w-[100%]"; // half width (50%)
                                if (meta?.rowSize === 4) spanClass = "col-span-1 max-w-[100%]"; // quarter width if you want
                                if (type == 1 && ["OsaByBrand", "OosDaysOverview", "OsaPerformanceOverview", "TableDayOnDay", "DayonDayTable", "PlatformDistribution"]?.indexOf(item.value) > -1) {
                                    return <></>;
                                } else if (type == 2 && ((["ComprehensiveBreakdown"]?.indexOf(item.value) > -1) || notAllow)) {
                                    return <></>;
                                }
                                return (
                                    <div
                                        key={item.value}
                                        className={spanClass}
                                    >
                                        <SortableItem
                                            key={item.value}
                                            id={item.value}
                                            platformSubCat={platformSubCat}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </SortableContext>

                </DndContext>
            ) : <></>}


        </>
    );
};


export default ShareDisplay;