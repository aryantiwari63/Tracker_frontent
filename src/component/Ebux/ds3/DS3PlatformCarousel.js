import React, { useEffect, useRef, useState } from "react";
import { useEbuxContext } from "../Context/EbuxProvider";
import { fetchPlatformTabData } from "../services/platformTab.services";
import { fetchPlatformTabDataDarkStore } from "../services/ebux.service";

//import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { isEqual } from "lodash";
import Loader from "../common-components/Loader";

import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { saveOSAPlateform } from "../services/saveTabsPlateform.services";

const decimalValueManager = (val) => {
    if (val === undefined || val === null || val === "" || isNaN(val)) return "0";
    const num = parseFloat(val);
    if (num >= 100) return Math.round(num).toLocaleString();
    if (num >= 10) return num.toFixed(1);
    return num.toFixed(2);
}

const SortableItem = ({ id, plt, isDarkStore }) => {
    const {
        loadingReport,
        percentageIcon,
        averagePercentageData,
        selectedFilters,
        kpi,
        activeClientProject,
        handlePlatformTabClickNewDarkStore,
        handlePlatformTabClickNew
    } = useEbuxContext();

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS?.Transform?.toString(transform),
        transition,
        zIndex: transform ? 999 : "auto",
        position: transform ? "relative" : "static",
    };

    const data = averagePercentageData?.[plt.label] || {};
    const isSelected = selectedFilters?.selectedPlatform?.some(p => p.value === plt.value);

    const showWeighted = [...(activeClientProject?.weightedOSA ? ['OSA'] : []), 'SOS'].includes(kpi);
    const showSecondary = showWeighted || ['PRO', 'RR'].includes(kpi);

    const secondaryValue = kpi === 'PRO' ? data.avg_sales_price : (kpi === 'RR' ? data.total_reviews : (data.wt_val ?? data.wt_osa ?? data.wt_sos));
    const prevSecondaryValue = kpi === 'PRO' ? data.prev_avg_sales_price : (kpi === 'RR' ? data.prev_total_reviews : (data.prev_wt_val ?? data.prev_wt_osa ?? data.prev_wt_sos));
    const secondaryLabel = kpi === 'PRO' ? 'ASP' : (kpi === 'RR' ? 'Total Reviews' : `Wt. ${kpi}`);
    // platform name hover
    const textRef = useRef(null);
    const [isOverflow, setIsOverflow] = useState(false);


    useEffect(() => {
        if (textRef.current) {
            // Simple, direct check
            setIsOverflow(textRef.current.scrollWidth > textRef.current.clientWidth);
        }
    }, [plt.label, showSecondary]);
    // platform name hover

    const getStatusIcon = (current, previous) => {
        const diff = (current ?? 0) - (previous ?? 0);
        if (!current || !selectedFilters?.[selectedFilters?.calendarType === "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious) return null;

        const isPercentage = !(kpi === 'OR' || kpi === 'RR');
        const displayValue = decimalValueManager(Math.abs(diff)?.toFixed(1)) + (isPercentage ? '%' : '');

        if (diff < 0) return <span className="text-[#DD4242] bg-[#FFF1F0] px-1 py-0.5 rounded-full flex items-center gap-0.5 text-[8px] font-bold">
            {/* <IoMdArrowDropdown className="text-xs w-[1.2em] h-[1.2em]" />*/}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M9.55547 0.478857L5.06563 5.68511C4.93711 5.83413 4.68965 5.83413 4.55977 5.68511L0.0699225 0.478857C-0.0968743 0.284717 0.0535163 0.000341847 0.322852 0.000341847H9.30254C9.57188 0.000341847 9.72227 0.284717 9.55547 0.478857Z" fill="#DD4242" />
            </svg> {displayValue}</span>;

        return <span className="text-[#329900] bg-[#E8FFEB] px-1 py-0.5 rounded-full flex items-center gap-0.5 text-[8px] font-bold">
            {/* <IoMdArrowDropup className="text-xs w-[1.2em] h-[1.2em]" />  */}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M9.55547 5.31802L5.06563 0.111768C4.93711 -0.0372559 4.68965 -0.0372559 4.55977 0.111768L0.0699225 5.31802C-0.0968743 5.51216 0.0535163 5.79653 0.322852 5.79653H9.30254C9.57188 5.79653 9.72227 5.51216 9.55547 5.31802Z" fill="#52C41A" />
            </svg>
            {displayValue}</span>;
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <div
                onClick={() => { if (isDarkStore) { handlePlatformTabClickNewDarkStore(plt) } else { handlePlatformTabClickNew(plt) } }}
                className={`flex-shrink-0 flex flex-col shadow-[0px_2px_4px_0px_#00000005,0px_1px_6px_-1px_#00000005,0px_1px_2px_0px_#00000008] ${showSecondary ? 'min-w-[220px]' : 'min-w-[150px]'} max-w-[280px] p-[13px] rounded-xl transition-all cursor-pointer snap-start  
                ${isSelected ? ' bg-[linear-gradient(134.29deg,#E6F4FF_13.77%,#FFFFFF_110.08%)]' : ' bg-white '}`
                }
            >
                <div className="flex flex-col items-center gap-2.5">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg p-1 shadow-sm border border-gray-50">
                        <img src={plt.platform_description || "/assets/logo/amazon1logo.svg"} className="max-w-full max-h-full object-contain" alt={plt.label} />
                    </div>
                    {/* <p className="font-inter font-medium text-[12px] text-[#3C3C3C] leading-[100%] tracking-[0px]">{plt.label}</p> */}
                    <div className="relative">
                        <p
                            ref={textRef}
                            className={`peer font-inter font-medium text-[12px] text-[#3C3C3C]
        ${!showSecondary ? "max-w-[110px] truncate cursor-default" : ""}`}
                        >
                            {plt.label}
                        </p>

                        {isOverflow && !showSecondary && (
                            <div
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
            opacity-0 peer-hover:opacity-100
            pointer-events-none
            bg-black text-white text-[11px] px-2 py-1 rounded
            whitespace-nowrap z-10 transition-opacity duration-150"
                            >
                                {plt.label}
                            </div>
                        )}
                    </div>
                </div>

                <div className={`w-full mt-2 flex gap-4 items-center ${showSecondary ? 'justify-between' : 'justify-center'}`}>

                    {/* Main Metric */}
                    <div className={`flex flex-col ${!showSecondary ? 'items-center' : ''}`}>
                        <p className="font-inter text-[8px] text-[#666666]">{kpi === 'PRO' ? 'Avg Promo' : (kpi === 'RR' ? 'Avg Rating' : kpi)}</p>
                        <div className="flex items-center gap-1">
                            <span className="text-[16px] font-bold text-[#0081F7]">
                                {loadingReport
                                    ? <Loader show={true} fullScreen={false} isCard={true} />
                                    : (data.currentData === null || data.currentData === undefined
                                        ? "--"
                                        : decimalValueManager(data.currentData) + ((kpi === 'OR' || kpi === 'RR') ? '' : percentageIcon))}
                            </span>
                            {getStatusIcon(data.currentData, data.previousData)}
                        </div>
                    </div>

                    {showSecondary && (
                        <>
                            <div className="w-[1px] h-7 bg-[#E2E8F0] opacity-70 self-center mx-1.5"></div>
                            {/* Secondary Metric */}
                            <div className="flex flex-col items-start min-w-[50px]">
                                <p className="font-inter text-[8px] text-[#666666]">
                                    {secondaryLabel}
                                </p>
                                <div className="flex items-center gap-1">
                                    <span className="text-[16px] font-bold text-[#0081F7]">
                                        {loadingReport
                                            ? <Loader show={true} fullScreen={false} isCard={true} />
                                            : (secondaryValue === null || secondaryValue === undefined
                                                ? "--"
                                                : (kpi === 'PRO' ? '₹' : '') + decimalValueManager(secondaryValue) + (['PRO', 'RR'].includes(kpi) ? '' : percentageIcon))}
                                    </span>
                                    {getStatusIcon(secondaryValue, prevSecondaryValue)}
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

const DS3PlatformCarousel = ({ externalRef, isDarkStore = false, forceDS3 = false, type }) => {
    const {
        setAveragePercentageData,
        setLoadingReport,
        filters,
        kpi,
        selectedFilters,
        filtersLoading,
        setLoading,
        filtersDarkStore
    } = useEbuxContext();

    const previousSelectedFilters = useRef({});
    const previousKpi = useRef(kpi);
    const [platforms, setPlatforms] = useState([]);
    const [platformType, setPlatformType] = useState(type);
    const localRef = useRef(null);
    const contentRef = externalRef || localRef;

    const activeFilters = (isDarkStore || forceDS3) ? (isDarkStore ? filtersDarkStore : filters) : filters;

    useEffect(() => {
        setPlatforms([
            ...(activeFilters?.platform?.filter(i => {
                if (kpi === "RR") return (i?.review_status == 1) || (i?.review_status === undefined);
                if (kpi === "SOM") return i?.app_status_som == 1;
                return true;
            }) ?? [])
        ]);
        setPlatformType(type);
    }, [activeFilters, kpi, type]);

    useEffect(() => {
        async function fetchData() {
            setLoadingReport(true);
            const fetcher = (isDarkStore || forceDS3) ? fetchPlatformTabDataDarkStore : fetchPlatformTabData;
            const currentData = await fetcher(kpi, activeFilters, selectedFilters, selectedFilters.selectedPlatform, false);
            console.log('currentDatacurrentDatacurrentData', currentData)
            let previousData = {};
            if (selectedFilters?.[selectedFilters?.calendarType === "week" ? "selectedWeeks" : "selectedDateRange"]?.isCompareToPrevious) {
                previousData = await fetcher(kpi, activeFilters, selectedFilters, selectedFilters.selectedPlatform, true);
            }
            const avg = {};
            // Object.keys(currentData)?.forEach((k) => {
            //     if (!avg[k]) avg[k] = {};
            //     // Store the whole object instead of just .output to preserve wt_val etc.
            //     avg[k] = { ...currentData[k], currentData: currentData[k]?.output, wtData: currentData[k]?.wt_osa };
            // });
            Object.keys(currentData)?.forEach((k) => {
                if (!avg[k]) {
                    avg[k] = {};
                }
                avg[k]["currentData"] = currentData[k]?.output;
                avg[k]["wt_osa"] = currentData[k]?.wt_osa;
                avg[k]["wt_sos"] = currentData[k]?.wt_sos;
                avg[k]["wt_val"] = currentData[k]?.wt_val;
                avg[k]["avg_sales_price"] = currentData[k]?.avg_sales_price;
                avg[k]["total_reviews"] = currentData[k]?.total_reviews;
            });
            Object.keys(previousData)?.forEach((k) => {
                if (!avg[k]) {
                    avg[k] = {};
                }
                avg[k]["previousData"] = previousData[k]?.output;
                avg[k]["prev_wt_osa"] = previousData[k]?.wt_osa;
                avg[k]["prev_wt_sos"] = previousData[k]?.wt_sos;
                avg[k]["prev_wt_val"] = previousData[k]?.wt_val;
                avg[k]["prev_avg_sales_price"] = previousData[k]?.avg_sales_price;
                avg[k]["prev_total_reviews"] = previousData[k]?.total_reviews;
            });

            if (avg["avg"]) {
                avg[kpi] = { ...avg["avg"] };

                const wtKeys = ["wt_osa", "wt_sos", "wt_val", "avg_sales_price", "total_reviews"];
                wtKeys.forEach(wtKey => {
                    if (currentData[wtKey] !== undefined || previousData[wtKey] !== undefined) {
                        avg[wtKey] = {
                            currentData: currentData[wtKey],
                            previousData: previousData[wtKey]
                        };
                        if (currentData[wtKey] !== undefined) {
                            avg[kpi][wtKey] = currentData[wtKey];
                        }
                    } else if (avg["avg"]?.[wtKey] !== undefined || avg["avg"]?.[`prev_${wtKey}`] !== undefined) {
                        avg[wtKey] = {
                            currentData: avg["avg"][wtKey],
                            previousData: avg["avg"][`prev_${wtKey}`]
                        };
                    }
                });
            }
            console.log('currentDatacurrentData22', avg)
            setAveragePercentageData(avg);
            setLoadingReport(false);
            if (setLoading) {
                setLoading(false);
            }
        }

        const filtersChanged = !isEqual(previousSelectedFilters.current, selectedFilters);
        const kpiChanged = previousKpi.current !== kpi;

        if (!filtersLoading && platforms.length && (filtersChanged || kpiChanged)) {
            previousSelectedFilters.current = selectedFilters;
            previousKpi.current = kpi;

            if (setLoading) {
                setLoading(true);
            }
            fetchData();
        }
    }, [selectedFilters, platforms, kpi]);





    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor)
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active?.id !== over?.id) {
            setPlatforms((prevPlatforms) => {
                const oldIndex = prevPlatforms.findIndex((item) => item.value === active.id);
                const newIndex = prevPlatforms.findIndex((item) => item.value === over.id);
                const newdata = arrayMove(prevPlatforms, oldIndex, newIndex);
                const platformPosition = newdata.map((item, index) => ({
                    value: item.value,
                    position: index + 1,
                }));

                let tabsPayload = {
                    "type": platformType,
                    "key": 'PlatformPosition',
                    "PlatformPosition": platformPosition,
                }
                saveOSAPlateform(tabsPayload);
                return newdata;
            });
        }
    };

    return (
        <div className="px-4 pb-4 bg-white rounded-b-[16px]">
            <div className={`relative group bg-white py-4 px-2 border-[1.5px] border-[#0081F7] overflow-hidden ${(kpi == 'OSA') ? 'rounded-b-2xl rounded-r-2xl' : (kpi == "RR") ? 'rounded-b-2xl rounded-t-2xl' : 'rounded-2xl'}`}>


                <div ref={contentRef} className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth p-1">
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                        <SortableContext items={platforms.map((item) => item.value)}>
                            {platforms.map((plt) => (
                                <SortableItem
                                    key={plt.value}
                                    id={plt.value}
                                    plt={plt}
                                    isDarkStore={isDarkStore}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>


            </div>
        </div>
    );
};

export default DS3PlatformCarousel;