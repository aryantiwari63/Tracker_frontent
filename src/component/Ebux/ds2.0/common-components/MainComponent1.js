import React, { useEffect, useRef, useState } from 'react'
// import Header from '../../../common-components/main-layout/Header'
import { FaTag, FaFolder, FaMapMarkerAlt } from "react-icons/fa";
import { useEbuxContext } from '../../Context/EbuxProvider';
import Loader from '../../common-components/Loader';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Link } from "react-router-dom";
import { EbuxTableProvider } from '../../Context/EbuxTableProvider';
import { trackDashboardClick } from '../../../../analytics/EventController';
import OSA from '../../OSA';
import SOS from '../../SOS';
import OrganicRanking from '../../OrganicRanking';
import ContentScore from '../../ContentScore';
import Promotions from '../../Promotions';
import RatingReviewsnew from '../../RatingReviewsnew';
import SOM from '../../SOM';
import { fetchKPIOverallData } from '../../services/platformTab.services';
import { fetchKPIOverallDataDarkStore } from "../../services/ebux.service";
import { isEqual } from "lodash";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { LuBadgePercent, LuMonitorUp, LuSearchCheck } from 'react-icons/lu';
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoStarOutline } from 'react-icons/io5';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { FiShoppingCart } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import RatingReviews from '../../RatingReviews';
import ShareDisplay from '../../ShareDisplay';
import { TbPhoto } from "react-icons/tb";
import DS3Dashboard from '../../ds3/DS3Dashboard';

const decimalValueManager = (val) => {
    const value = val.split(".")
    if (value[0].length > 2) {
        return value?.[0] // no point visible 100, 121
    } else if (value[0].length > 1 && value[0].length <= 2) {
        return value?.[0] + (value?.[1]?.length > 0 ? ("." + value?.[1]?.substring(0, 1)) : ""); // 10 - 99 -> 12.1
    } else {
        return value?.[0] + (value?.[1]?.length > 0 ? ("." + (value?.[1] + "00")?.substring(0, 2)) : ""); //. 0.99
    }
}

function MainComponent1({ mainKpi, forceDS3 = false }) {
    const icons = {
        brand: <FaTag className="w-4 h-4 text-blue-500" />,
        category: <FaFolder className="w-4 h-4 text-blue-500" />,
        location: <FaMapMarkerAlt className="w-4 h-4 text-blue-500" />,
        "product Id": <FaFolder className="w-4 h-4 text-blue-500" />,
        "OSA Status": <FaTag className="w-4 h-4 text-blue-500" />,
        platform: <FaTag className="w-4 h-4 text-blue-500" />,
        "Dark Store": <FaMapMarkerAlt className="w-4 h-4 text-blue-500" />,
    };


    const { kpi, kpiMap, percentageIcon,
        filters, selectedFilters,
        updateSelectedSOSType,
        setSelectedHeaderOpen,
        filtersDarkStore, // 🔹 NEW

        // selectedPlatform,
        filtersLoading,
        activeClientProject,
        // setFiltersLoading,
        headerFilterChips,
        initKpiSet, error } = useEbuxContext();

    const isDarkStore = filtersDarkStore?.tab_type === "dark_store_analysis";
    const enabledKPIs = activeClientProject.kpi || {};

    const previousSelectedFilters = useRef({});
    const [loading, setLoading] = useState(false);


    // const filteredKpiMap = Object.keys(kpiMap)
    // .filter((key) => enabledKPIs[key]) // Keep only KPIs that are set to true
    // .reduce((obj, key) => {
    //   obj[key] = kpiMap[key];
    //   return obj;
    // }, {});
    const filteredKpiMap = Object.keys(kpiMap).reduce((obj, key) => {
        obj[key] = { ...kpiMap[key], status: !!enabledKPIs[key] };
        return obj;
    }, {});
    // console.log('checkkkk----', filtersDarkStore)
    const [averagePercentageData, setAveragePercentageData] = useState({});
    useEffect(() => {
        initKpiSet(mainKpi);
    }, [mainKpi]);

    const handleSelectTab = () => {
        // event.preventDefault();
        // setActiveTabIndex(index); 
    };
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    const getStatus = (data) => {
        // alert(JSON.stringify(data))
        const diff = (data?.currentData ?? 0) - (data?.previousData ?? 0);
        if (
            data?.currentData &&
            selectedFilters?.[selectedFilters?.calendarType == "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious &&
            !isNaN(diff)
        ) {
            if (diff < 0) {
                return (
                    <span className="text-[#DD4242] flex items-center text-xs  border-[0.2px] border-[#FFA39E] bg-[#FFF1F0] rounded-full">
                        <IoMdArrowDropdown className="text-sm " />

                        {decimalValueManager(Math.abs(diff)?.toFixed(2)) + "" + percentageIcon}
                    </span>
                );
            } else {
                return (
                    <span className="text-[#329900] flex items-center text-xs  border-[0.2px] border-[#B7EB8F] bg-[#E8FFEB] rounded-full">
                        <IoMdArrowDropup className="text-sm " />
                        {decimalValueManager(diff.toFixed(2)) + "" + percentageIcon}
                    </span>
                );
            }
        } else {
            return <></>;
        }
    }




    useEffect(() => {
        async function fetchData() {
            //console.log('DEBUG MainComponent1 fetchData:', { isDarkStore, forceDS3, tab_type: filtersDarkStore?.tab_type })
            setLoading(true);
            const currentData = (isDarkStore) ?
                await fetchKPIOverallDataDarkStore(kpi, isDarkStore ? filtersDarkStore : filters, selectedFilters, selectedFilters.selectedPlatform, false) :
                await fetchKPIOverallData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, false);

            let previousData = {};
            if (selectedFilters?.[selectedFilters?.calendarType == "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious) {
                previousData = (isDarkStore || forceDS3) ?
                    await fetchKPIOverallDataDarkStore(kpi, isDarkStore ? filtersDarkStore : filters, selectedFilters, selectedFilters.selectedPlatform, true) :
                    await fetchKPIOverallData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, true);
            }
            const avg = {};
            Object.keys(currentData)?.forEach(k => {
                if (!avg[k]) {
                    avg[k] = {};
                }
                avg[k]['currentData'] = currentData[k];
            });

            Object.keys(previousData)?.forEach(k => {
                if (!avg[k]) {
                    avg[k] = {};
                }
                avg[k]['previousData'] = previousData[k];
            })
            // eslint-disable-next-line no-console
            //   console.log({avg});
            setAveragePercentageData(prev => ({ ...prev, ...avg }));
            setLoading(false);
        }
        // if (!filtersLoading && !isDarkStore && filters?.platform?.length && (!isEqual(previousSelectedFilters.current, selectedFilters))) {
        //     previousSelectedFilters.current = selectedFilters;
        //     fetchData();
        // }

        const isExecutiveSummary = filtersDarkStore?.isTabTypeChange;
        const currentPlatformLength = isDarkStore ? filtersDarkStore?.platform?.length : filters?.platform?.length;
        // const hasAnyPlatforms = (filtersDarkStore?.platform?.length > 0 || filters?.platform?.length > 0);

        const shouldRunForFilters =
            !filtersLoading &&
            (currentPlatformLength > 0) &&
            !isEqual(previousSelectedFilters.current, selectedFilters);

        if ((isExecutiveSummary || shouldRunForFilters) && (currentPlatformLength > 0)) {
            // update the previousSelectedFilters snapshot so we don't repeatedly refetch
            previousSelectedFilters.current = selectedFilters;
            fetchData();
        }
    }, [filtersLoading, selectedFilters, filters, filtersDarkStore?.isTabTypeChange, isDarkStore]);

    // console.log("selected", selected)
    const [showMenu, setShowMenu] = useState(false);
    const cardIcons = {
        "OSA": <FiShoppingCart size={24} />,
        "SOS": <LuSearchCheck size={24} />,
        "OR": <FaArrowTrendUp size={24} />,
        "CS": <LuMonitorUp size={24} />,
        "PRO": <LuBadgePercent size={24} />,
        "RR": <IoStarOutline size={24} />,
        "SOM": <HiOutlineShoppingBag size={24} />,
        "SOD": <TbPhoto size={24} />,
    }
    const KPI_COMPONENTS = {
        OSA: <OSA type={2} />,
        SOS: <SOS type={2} />,
        OR: <OrganicRanking type={2} />,
        CS: <ContentScore type={2} />,
        PRO: <Promotions type={2} />,
        RR:
            ([2, 101, 103, 102].includes(activeClientProject?.client_project_id) || activeClientProject?.useNewRRView)
                ? <RatingReviewsnew type={2} />
                : <RatingReviews type={2} />,
        SOM: <SOM type={2} />,
        SOD: <ShareDisplay type={2} />,
    };

    return (
        <div>
            {/* <Header open={open} setOpen={setOpen} /> */}
            {/* chips of selcted  */}
            {Object.values(headerFilterChips).some(values => values && values.length > 0) && (

                <div className='w-full my-2 p-2 flex flex-wrap gap-2 bg-[#FFFFFF] rounded-lg shadow-sm'>
                    {Object.entries(headerFilterChips).filter(([, values]) => values.length > 0).map(([section, values]) => {
                        const displayValues = values
                            .slice(0, 2)
                            .map((v) => v.label)
                            .join(", ");

                        const remaining = values.length - 2;
                        const chipObj = {
                            "segmentData": "Segment",
                            "dynamicPData": "Dynamic-P",
                            "staticPData": "Static P",
                            "subBrandData": "Sub Brand",
                            "productTypeData": "Product Type",
                        }
                        const formattedSection = (chipObj?.[section] ?? section)
                            .split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');
                        return (
                            <div
                                key={section}
                                className="flex items-center gap-2 px-3 py-2  border-[1px] border-[#D9D9D9] rounded-lg text-sm cursor-pointer"
                                onClick={() => setSelectedHeaderOpen({ edit: true })}
                            >
                                {icons[section] || <FaTag className="w-4 h-4 text-blue-500" />}
                                <div className='flex gap-2'>
                                    {/* <span className="font-medium">{section.charAt(0).toUpperCase() + section.slice(1)}</span> */}
                                    <span className={`font-medium ${section == 'osa_remarks' ? 'min-w-[100px]' : ''}`}>{formattedSection}</span>
                                    <span className="text-gray-600 truncate max-w-[160px]">
                                        {displayValues}
                                    </span>
                                </div>
                                {remaining > 0 && (
                                    <span
                                        // onClick={() => setSelectedHeaderOpen({ edit: true })}
                                        className="inline-flex items-center justify-center text-gray-500 text-xs rounded-full px-2 py-[2px] whitespace-nowrap bg-[#F0F0F0]  transition"
                                    >
                                        +{remaining} more
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            {(kpi == mainKpi && !filtersLoading) ?
                (activeClientProject?.uiType === 'ds3' || forceDS3) ?
                    <DS3Dashboard mainKpi={mainKpi} averagePercentageData={averagePercentageData} isDarkStore={isDarkStore} forceDS3={forceDS3} />
                    :
                    <EbuxTableProvider>
                        <div className="ebuxStatsSection ">
                            <Tabs selectedIndex={filteredKpiMap[kpi]['index']} onSelect={handleSelectTab}>
                                <div className="tabsWrap">
                                    <TabList>
                                        {Object.keys(filteredKpiMap).map((item, i) => {
                                            if (filteredKpiMap[item]['status']) {
                                                return (
                                                    <Link to={filteredKpiMap[item]['link']} key={i}>
                                                        <Tab >
                                                            {/* //to reomove this for bg visible */}
                                                            <div className={`statsBox !w-[12rem] !h-[5rem] flex items-center gap-3 !rounded-[11.5px] border border-gray-200 bg-white shadow-sm !pl-2 !pr-1  py-2 ${kpi == item ? "activeStatsBox" : "cursor-pointer !bg-[#FFFFFF] !border-[1px] !border-[#EFF0F6] !shadow-[0px_1px_3px_0px_#14142B14] !text-[#000000D9]"
                                                                }`}
                                                                onClick={(e) => {
                                                                    // console.log('hihihihi',e.type,filteredKpiMap[item])
                                                                    trackDashboardClick({
                                                                        section: 'Dashboard sections', eventaction: e.type, eventlabel: filteredKpiMap[item]["lable"] === "Keyword" ? "Keyword" :
                                                                            filteredKpiMap[item]["lable"] === "Promotions"
                                                                                ? "promotion"
                                                                                :
                                                                                filteredKpiMap[item]["lable"].toLowerCase()
                                                                    })

                                                                }}>
                                                                <div className={`w-[3.56rem] h-[3.56rem] rounded-[7.66px] px-1 flex justify-center items-center bg-[#FAFAFA]  ${kpi == item ? "!bg-[#E8F4FF] !text-[#1890FF]" : "!text-[#000000D9]"}`}>{cardIcons[item] || "No icon"}</div>
                                                                <div className="flex-1  flex flex-col h-[4rem]">
                                                                    <div className='flex-1 flex items-center justify-between h-[1rem] mt-2'>
                                                                        {item == "SOS"
                                                                            // && activeClientProject?.client_project_id == 4
                                                                            ?
                                                                            <div className="inline-flex align-items-center justify-content-between w-full justify-between ">
                                                                                <h6 className="flex-1 !text-[14px] !font-medium  leading-tight">
                                                                                    {/* {filteredKpiMap[item]['lable']} */}
                                                                                    {activeClientProject?.useWeightedSOS ? 'Wt. SOS' : 'SOS'}
                                                                                    <p className='text-xs'>{selectedFilters?.selected_sos_type?.charAt(0).toUpperCase() + selectedFilters?.selected_sos_type?.slice(1)}</p>
                                                                                </h6>

                                                                                <div className="relative">
                                                                                    <button
                                                                                        onClick={() => setShowMenu((prev) => !prev)}
                                                                                        className="p-1 rounded hover:bg-gray-100"
                                                                                    >
                                                                                        <BsThreeDotsVertical />
                                                                                    </button>
                                                                                    {/* Dropdown Menu */}
                                                                                    {showMenu && (
                                                                                        <div className="absolute left-0 right-0 mt-0 w-28 bg-white border rounded shadow-md z-10">
                                                                                            {["overall", "paid", "organic"].map((opt) => (
                                                                                                <div
                                                                                                    key={opt}
                                                                                                    onClick={() => {
                                                                                                        updateSelectedSOSType(opt);
                                                                                                        setShowMenu(false); // hide after selecting
                                                                                                    }}
                                                                                                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                                                                                >
                                                                                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            // : (item=="OR" && activeClientProject?.client_project_id==4)
                                                                            : (item == "OR")
                                                                                ? <h6 className="!text-[14px] !font-medium  leading-tight ">Ranking</h6>
                                                                                : <h6 className="!text-[14px] !font-medium  leading-[1] w-[80%]">
                                                                                    {filteredKpiMap[item]['lable']}
                                                                                </h6>
                                                                        }
                                                                    </div>


                                                                    <div className="flex items-center  gap-[1px]">
                                                                        <span className="w-1/2 text-[14px] m-0 p-0">

                                                                            {loading ? (
                                                                                <Loader show={loading} fullScreen={false} />
                                                                                // ) : averagePercentageData?.[item]?.currentData !== undefined ? (
                                                                                //     `${decimalValueManager(Number(averagePercentageData[item].currentData).toLocaleString(undefined, {
                                                                                //         minimumFractionDigits: 0,
                                                                                //         maximumFractionDigits: 2
                                                                                //     }))}${filteredKpiMap[item].percentageIcon}`
                                                                                // ) : (
                                                                                //     "0"
                                                                                // )}


                                                                            ) : (isDarkStore && ["OSA", "PRO"].includes(item) && filtersDarkStore?.[kpi] != undefined) ? (
                                                                                // ✅ Show OSA value from filtersDarkStore
                                                                                `${decimalValueManager(Number(filtersDarkStore?.[item]?.currentData).toLocaleString(undefined, {
                                                                                    minimumFractionDigits: 0,
                                                                                    maximumFractionDigits: 2
                                                                                }))}${filteredKpiMap[item].percentageIcon}`
                                                                            ) : averagePercentageData?.[item]?.currentData !== undefined ? (
                                                                                // ✅ Otherwise show normal value
                                                                                `${decimalValueManager(Number(averagePercentageData[item].currentData).toLocaleString(undefined, {
                                                                                    minimumFractionDigits: 0,
                                                                                    maximumFractionDigits: 2
                                                                                }))}${filteredKpiMap[item].percentageIcon}`
                                                                            ) : (
                                                                                "0"
                                                                            )}
                                                                        </span>
                                                                        <span className='w-1/2  mt-1 p-0 text-[10px] text-[#00000099]'>
                                                                            {/* {!loading && kpi == item && averagePercentageData?.[item]?.previousData && decimalValueManager(averagePercentageData?.[item]?.previousData?.toFixed(2)) + "" + percentageIcon} */}
                                                                            {!loading && averagePercentageData?.[item]?.previousData && decimalValueManager(averagePercentageData?.[item]?.previousData?.toFixed(2)) + "" + percentageIcon}
                                                                        </span>
                                                                        <span className="w-1/2 flex justify-end">
                                                                            {/* {!loading && kpi == item && getStatus(averagePercentageData?.[item])} */}
                                                                            {!loading && averagePercentageData?.[item]?.previousData != undefined && getStatus(averagePercentageData?.[item])}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Tab>
                                                    </Link>
                                                );
                                            }
                                            return (
                                                <Tab key={i} disabled={(kpi != item)} style={{ display: 'none' }}></Tab>
                                            );
                                        }
                                        )}
                                    </TabList>
                                </div>
                                {Object.keys(filteredKpiMap).map((item, i) => {
                                    const isActive = filteredKpiMap[item]?.status && kpi === item;

                                    return (
                                        <TabPanel key={i} style={!isActive ? { display: "none" } : {}}>
                                            {isActive && KPI_COMPONENTS[item]}
                                        </TabPanel>
                                    );
                                })}

                                {/* {filteredKpiMap["OSA"]['status'] &&
                            <TabPanel>
                                <OSA type={2} />
                            </TabPanel>}

                            {filteredKpiMap["SOS"]['status'] &&
                            <TabPanel>
                                <SOS type={2} />
                            </TabPanel>}
                                    
                            {filteredKpiMap["OR"]['status'] &&
                            <TabPanel>
                                <OrganicRanking type={2} />
                            </TabPanel>}
                            {filteredKpiMap["CS"]['status'] &&
                            <TabPanel>
                                <ContentScore type={2} />
                            </TabPanel>}

                            {filteredKpiMap["PRO"]['status'] &&
                            <TabPanel>
                                <Promotions type={2} />
                            </TabPanel>}
                            {filteredKpiMap["RR"]['status'] &&
                            <TabPanel>
                                 { ([2,101,103,102].indexOf(activeClientProject?.client_project_id)>-1||activeClientProject?.useNewRRView) ? <RatingReviewsnew type={2} /> : <RatingReviews type={2} /> }
                            </TabPanel>} */}

                                {/* <TabPanel>
                                <SOM type={2} />
                            </TabPanel> */}
                                {/* {filteredKpiMap["SOM"]['status'] &&
                                                        <TabPanel>
                                                            <SOM type={2}/>
                                                        </TabPanel>}
                                                        {filteredKpiMap["SOD"]['status'] &&
                                                            <TabPanel>
                                                                <ShareDisplay type={2}/>
                                                            </TabPanel>
                                                        } */}
                            </Tabs>
                        </div>
                    </EbuxTableProvider>

                :
                <Loader show={filtersLoading} fullScreen={false} />
            }

        </div>
    )
}

export default MainComponent1
