import React, { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
// import Graphical from './common-components/Graphical';
// import RepotDataTableComponent from './common-components/RepotDataTableComponent';
import PlatformTabsComponent from './common-components/PlatformTabsComponent';
import PlatformChartComponent from './common-components/PlatformChartComponent';
import FocusChartsComponent from './common-components/FocuschartsComponent';
// import ComprehensiveBreakdownComponent from './common-components/ComprehensiveBreakdown/SOS';
import BreakdownComponent from './common-components/ComprehensiveBreakdown/SOM/breakdown';


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
        console.log('***', platformSubCat)
        switch (ComponentName) {
            case "PlatformChart":
                return <><PlatformChartComponent is_brand={true} listeners={listeners} attributes={attributes} />
                    <PlatformChartComponent is_brand={false} listeners={listeners} attributes={attributes} /></>;
            case "Focuscharts":
                return <FocusChartsComponent chartTitle='Keyword Analysis' chartType='Keyword' chartLable={'SOM'} listeners={listeners} attributes={attributes} platformSubCat={platformSubCat} />;
            case "ComprehensiveBreakdown":
                return <BreakdownComponent listeners={listeners} attributes={attributes} platformSubCat={platformSubCat} />;
            // return <ComprehensiveBreakdownComponent listeners={listeners} attributes={attributes}/>;
            // return <ComprehensiveBreakdownComponent listeners={listeners} attributes={attributes} platformSubCat={platformSubCat}/>;
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
const SOM = ({ type = 1 }) => {
    const {
        kpi,
        selectedKpiDragPosition,
        activeClientProject,
        setFiltersDarkStore,
        // filtersDarkStore
    } = useEbuxContext();
    const [platform, setPlatform] = useState([]);
    const [isPlatform, setIsPlatform] = useState(false);
    const [platformSubCat, setPlatformSubCat] = useState([]);

    const savePlatformPositions = async (data) => {
        // const platformPosition = data?.map((item, index) => ({
        //     value: item.value,
        //     position: index + 1
        // }));
        // // localStorage.setItem("SOSPosition", JSON.stringify(platformPosition));
        // const tabsPayload = {
        //     SOSPosition: platformPosition,
        // };
        // Save to API
        await saveTabsPlateform(data);
    };

    // const loadAndRearrangePlatformPositions = (data) => {

    //     const storedPlatformPosition = JSON.parse(localStorage.getItem("SOSPosition"));
    //     if (storedPlatformPosition?.length) {

    //         const rearrangedArray = storedPlatformPosition
    //             ?.map(posItem => data.find(item => item.value === posItem.value))
    //             ?.filter(item => item !== undefined);

    //         const newItems = data.filter(item =>
    //             !storedPlatformPosition?.some(posItem => posItem.value === item.value)
    //         );

    //         const finalArray = [...rearrangedArray, ...newItems];

    //         savePlatformPositions(finalArray);
    //         return finalArray;
    //     } else {
    //         return [];
    //     }

    // };




    // useEffect(() => {
    //     let res_platform = [
    //         {
    //             value: "PlatformChart",
    //             position: 0
    //         },
    //         {
    //             value: "Focuscharts",
    //             position: 1
    //         },
    //         {
    //             value: "ComprehensiveBreakdown",
    //             position: 2
    //         }];

    //     const storedPlatformPosition = JSON.parse(localStorage.getItem("SOSPosition"));
    //     if (!storedPlatformPosition) {
    //         savePlatformPositions(res_platform ?? []);
    //     } else {
    //         res_platform = loadAndRearrangePlatformPositions(res_platform ?? []);
    //     }
    //     setPlatform(res_platform);
    // }, []);
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
                // localStorage.setItem("SOSPosition", JSON.stringify(platformPosition));
                let tabsPayload = {
                    "SOMPosition": platformPosition,
                }
                saveTabsPlateform(tabsPayload);
                return newdata;
            });
        }
    };
    useEffect(() => {
        console.log('hiiiiiii')
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
    console.log("7777", platform);

    const loadPlatformData = async () => {
        try {
            const response = await getTabsPlateform(); // Fetch data from API
            console.log("5555", response);

            console.log('=====', response.userRecord.tabs_plateform.SOSPosition)
            if (response?.userRecord?.tabs_plateform?.SOMPosition?.length) {
                setPlatform(response.userRecord.tabs_plateform.SOMPosition);
                setPlatformSubCat(response.userRecord)
            } else {
                // If no data from API, initialize with default data
                const defaultPlatform = [
                    { value: "PlatformChart", position: 0 },
                    { value: "Focuscharts", position: 1 },
                    { value: "ComprehensiveBreakdown", position: 2 },
                ];
                let tabsPayload = {
                    "SOMPosition": defaultPlatform,
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
        { label: ([2].indexOf(activeClientProject?.client_project_id) > -1) ? "6P Analytics" : "Executive Summary", value: "executive_summary" },
        // { label: "Dark Store Analysis", value: "dark_store_analysis" },
        // { label: "Trend Analysis", value: "trend_analysis" },
        { label: "Comprehensive Breakdown", value: "comprehensive_breakdown" },
    ];
    console.log("selected Tab", selected)
    return (
        <>
            {type == 1 ? <PlatformTabsComponent type={"som_plateform"} /> : <PlatformTabsComponent1 type={"som_plateform"} />}
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
                                    ><SortableItem
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


export default SOM;