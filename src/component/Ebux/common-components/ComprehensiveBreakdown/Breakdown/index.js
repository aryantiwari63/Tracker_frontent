import React, { useEffect, useRef, useState } from 'react';
import _ from "lodash";

import {
    FILTERACTION,
    searchFilterArr
} from "../../MultiFilter/FilterConstant";

import ComprehensiveBreakdownMultiFilter from "../../MultiFilter/ComprehensiveBreakdownMultiFilter";

import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

import Loader from "../../Loader";
// import TableFilterComponent from '../tableFilterComponent';
import BreakdownDrawer from './BreakdownDrawer';
import { useEbuxContext } from '../../../Context/EbuxProvider';
import { fetchComprehensiveBreakdownData, fetchComprehensiveBreakdownTabUniqueDataCount } from '../../../services/comprehensiveBreakdown.services';
import { MdOutlineDragIndicator } from 'react-icons/md';


import { isEqual } from 'lodash';
import CustomizeCampiagnModal from '../../CustomizeCampiangn';
import BreakdownTable from './breakdownTable';
import BreakdownTabComponent from './breakdownTabComponent';
import TabTableHeader from './tabTableHeader';
import SelectedItemPopupComponent from './SelectedItemPopupComponent';
// import { allColumns } from '../../CustomizeCampiangn/allColumnsData';
import BannerDrawer from './BannerDrawer';
import ReviewTable from "../../Platform_Review/ReviewTable";
import SentimentMultifilter from '../../Platform_Review/SentimentMultifilter';
import { trackDashboardClick } from '../../../../../analytics/EventController';

import { fetchSentimentTabUniqueDataCount } from "../../../services/ratingreview"
import TagMappingWithProductAndKeyword from './tagMappingWithProductAndKeyword';
import { getCustomizeColumnDefaultView } from '../../../services/customizeColumnsSaveView.service';
const keyMapping = {
    'category': { key: "brand_category_id", value: "brand_category_name" },
    'sku': { key: "sku_id", value: "web_pid" },
    'location': { key: "location_name", value: "location_name" },
    'brand': { key: "brand_id", value: "brand_name" },
    'platform': { key: "pf_id", value: "platform_name" },
    'banner': { key: "banner_id", value: "banner_name" }
}
const BreakdownComponent = ({ listeners, attributes, breakdownCustomizeColumnTitle, breakdownTabList, breakdownPerformance = {}, platformSubCat, breakdownTabColumnList = {} }) => {
    console.log('breakdownTabListbreakdownTabList', breakdownTabList)
    // const BreakdownComponent = ({ listeners, attributes, breakdownCustomizeColumnTitle, breakdownTabList, initbreakdownFilters, breakdownCustomFilters, breakdownPerformance = {}, platformSubCat }) => {
    const {
        kpi,
        selectedPlatform,
        selectedFilters, filters,
        clientCustomizeColumnsComprehensiveBreakdown,
        activeClientProject
    } = useEbuxContext();
    const [allColumns,] = useState({ ...clientCustomizeColumnsComprehensiveBreakdown });
    // console.log('oooooooooooo', platformSubCat)
    // const [Error, setError] = useState();
    const [, setError] = useState();
    const [selectedRows, setSelectedRows] = useState([])
    const [loading, setLoading] = useState(false);
    const [downloadkey, setDownloadkey] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [selectedCount, setselectedCount] = useState(0)
    const [selectedTotal, setselectedTotal] = useState({ "Reviews": 0, "Competition Reviews": 0 });


    const [tabColumnList, setTabColumnList] = useState({});
    const tabEmptyObject = breakdownTabList?.reduce((obj, item) => { obj[item.toLowerCase()] = []; return obj; }, {});
    const [breakdownTabData, setBreakdownTabData] = useState(tabEmptyObject);
    const [reportData, setReportData] = useState([]);

    const [selectedTableRows, setSelectedTableRows] = useState(tabEmptyObject);
    // const filtersKeys = breakdownCustomFilters;
    const [combinedState, setCombinedState] = useState({
        // breakdownFilters: initbreakdownFilters,
        breakdownFilters: {},
        _selectedTableRows: tabEmptyObject,
        ...((selectedFilters?.calendarType == "week") ? { selectedWeeks: selectedFilters?.selectedWeeks } : {selectedDateRange: selectedFilters?.selectedDateRange}),
        ...(activeClientProject?.isUseWidget ? { selectedFilters: selectedFilters } : {})
    });

    const [sentimentState, setsentimentState] = useState({
        // breakdownFilters: initbreakdownFilters,
        breakdownFilters: {},
        ...((selectedFilters?.calendarType == "week") ? { selectedWeeks: selectedFilters?.selectedWeeks } : {selectedDateRange: selectedFilters?.selectedDateRange}),
        ...(activeClientProject?.isUseWidget ? { selectedFilters: selectedFilters } : {})
    });
    const [drawerBannerInfo, setDrawerBannerInfo] = useState({ isOpen: false, banner_info: null, banner_brand_type: null });
    const openBannerDrawer = (banner_info = "", banner_brand_type) => {
        if (banner_info) {
            setDrawerBannerInfo({ isOpen: true, banner_info, banner_brand_type });
        }
    };

    const closeBannerDrawer = () => {
        setDrawerBannerInfo({ isOpen: false, banner_info: null, banner_brand_type: null });
    };
    const [drawerInfo, setDrawerInfo] = useState({ isOpen: false, column: null, value: null, lable: null, multiple: false });
    const openDrawer = (column, value, lable, image = '', name = '') => {
        console.log("opendrawer", column, value, lable);

        if (column && value && lable) {
            setDrawerInfo({ isOpen: true, column, value, lable, image, name, multiple: false });
        }
    };
    const openMultipleInDrawer = (column) => {
        console.log("checkingcol", column);
        // console.log("openMultipleInDrawer", selectedTableRows?.[column]?.length, selectedTableRows?.[column]);
        if (column && selectedTableRows?.[column]?.length) {
            // console.log("openMultipleInDrawer",selectedTableRows?.[column]);
            console.log("checkingcol", column);


            setDrawerInfo({ isOpen: true, column, value: selectedTableRows?.[column], multiple: true });
        }
    };
    const closeDrawer = () => {
        setDrawerInfo({ isOpen: false, column: null, value: null, lable: null, image: null, name: null, multiple: false });
    };


    const handleCustomizeClick = () => {
        setCustomizeInfo((per) => ({ isOpen: !per.isOpen, column: selectedTabName }));
    };
    const closeCustomizePopup = () => {
        setCustomizeInfo({ isOpen: false, column: null });
    };


    const [selectedTabName, setSelectedTabName] = useState('');
    const [tabPosition, setTabPosition] = useState([]);

    const fetchReportTableData = async (datakey, dataLable, columnsData) => {

        // console.log(JSON.stringify(columnsData));
        setLoading(true);
        try {
            const finaldata = await fetchComprehensiveBreakdownData(kpi, datakey, dataLable, combinedState?.breakdownFilters, filters, selectedFilters, selectedPlatform, combinedState?._selectedTableRows, false, columnsData);
            setReportData(finaldata);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    async function fetchData() {

        const finaldata = await fetchComprehensiveBreakdownTabUniqueDataCount(kpi, combinedState?.breakdownFilters, filters, selectedFilters, selectedPlatform, combinedState?._selectedTableRows, breakdownTabList);
        setBreakdownTabData((data) => ({ ...data, ...finaldata }));
    }

    const previousCombinedState = useRef({});
    const previoustabColumnListState = useRef({});

    const previousTabName = useRef("");

    useEffect(() => {
        const loadDefaultTabView = async () => {
            const allSavedViews = await getCustomizeColumnDefaultView(
                kpi,
                selectedTabName
            );

            // alert("yes in")
            if (allSavedViews?.length) {
                const defaultTabView = allSavedViews?.[0];
                setTabColumnList((previous) => ({ ...previous, [selectedTabName]: defaultTabView?.selectedOptions }))

            } else if (breakdownTabColumnList?.[selectedTabName] && !tabColumnList?.[selectedTabName]?.length) {
                const allow_columns = breakdownTabColumnList?.[selectedTabName]?.map(i => i?.value) ?? [];


                const selected = [];
                Object.keys(allColumns).map((columnGroup) => {
                    allColumns?.[columnGroup]?.columns.forEach((col) => {
                        if (col?.type == "breakdown" && (!col?.isDisabled) && (allow_columns?.indexOf(col?.value) > -1)) {
                            if (col?.breakdown == selectedTabName) {
                                selected.push({ ...col, remove: false, drag: false });
                            } else {
                                selected.push({ ...col });
                            }
                        }
                        if (col?.kpi?.includes(kpi) && col?.type != "breakdown" && (!col?.isDisabled) && (allow_columns?.indexOf(col?.value) > -1)) {
                            selected.push({ ...col });
                        }
                    })
                })
                if (selected?.length) {
                    selected.sort((a, b) => allow_columns.indexOf(a.value) - allow_columns.indexOf(b.value));
                    setTabColumnList((previous) => ({ ...previous, [selectedTabName]: selected }))
                }
            }
            else if (selectedTabName && !tabColumnList?.[selectedTabName]?.length) {
                const selected = [];
                Object.keys(allColumns).map((columnGroup) => {
                    allColumns?.[columnGroup]?.columns.forEach((col) => {
                        if (col?.breakdown == selectedTabName && col?.type == "breakdown" && (!col?.isDisabled)) {
                            selected.push({ ...col, remove: false, drag: false });
                        }

                        if (col?.kpi?.includes(kpi) && col?.type != "breakdown" && (!col?.isDisabled)) {
                            selected.push({ ...col });
                        }
                    })
                })
                if (selected?.length) {
                    setTabColumnList((previous) => ({ ...previous, [selectedTabName]: selected }))
                }


            }
            // return allSavedViews;
        }

        loadDefaultTabView();

        console.log('selectedTabNameselectedTabName', selectedTabName)
    }, [selectedTabName, allColumns]);
    useEffect(() => {

        if (selectedTabName && tabColumnList?.[selectedTabName]?.length) {

            // console.log("tabColumnList", JSON.stringify(tabColumnList));
            if (!isEqual(previousCombinedState.current, JSON.stringify(combinedState))) {
                previousCombinedState.current = JSON.stringify({ ...combinedState });
                previousTabName.current = "";
                fetchData();
            }
            if (selectedTabName && (previousTabName.current != selectedTabName || !isEqual(previoustabColumnListState.current, JSON.stringify(tabColumnList)))) {
                previoustabColumnListState.current = JSON.stringify({ ...tabColumnList });
                previousTabName.current = selectedTabName;
                if ((kpi != "RR") || (kpi == "RR" && selectedTabName != "Reviews" && selectedTabName != "Competition Reviews")) {

                    fetchReportTableData(keyMapping?.[selectedTabName?.toLowerCase()]?.key ?? "", keyMapping?.[selectedTabName?.toLowerCase()]?.value ?? "", (tabColumnList?.[selectedTabName] ?? []))
                }
            }
        }
    }, [selectedTabName, combinedState, tabColumnList]);

    const previousSentimentState = useRef({});
    async function fetchSentimentTabData() {

        const finaldata = await fetchSentimentTabUniqueDataCount(kpi, combinedState?.breakdownFilters, filters, selectedFilters, selectedPlatform, combinedState?._selectedTableRows, breakdownTabList, sentimentState);
        // console.log("finaldata is", finaldata);
        setselectedTotal((data) => ({ ...data, ...finaldata }));
    }
    useEffect(() => {

        if (selectedTabName && breakdownTabList.includes('Reviews')) {
            if (!isEqual(previousSentimentState.current, JSON.stringify({ ...sentimentState, ...selectedFilters }))) {
                previousSentimentState.current = JSON.stringify({ ...sentimentState, ...selectedFilters });
                fetchSentimentTabData();
            }
        }
    }, [selectedTabName, sentimentState, selectedFilters]);

    useEffect(() => {
        setCombinedState((prevFilters) => ({
            ...prevFilters,            
            ...((selectedFilters?.calendarType == "week") ? { selectedWeeks: selectedFilters?.selectedWeeks } : {selectedDateRange: selectedFilters?.selectedDateRange}),
            ...(activeClientProject?.isUseWidget ? { selectedFilters: selectedFilters } : {})
        }));
    }, [selectedFilters]);

    const [popupInfo, setPopupInfo] = useState({ isOpen: false, column: null });
    const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });
    const handleColumnClick = (column) => {
        // if (column) { setPopupInfo({ isOpen: true, column }); }
        if (column) { setPopupInfo({ isOpen: false, column }); }
    };
    const closePopup = () => {
        setPopupInfo({ isOpen: false, column: null });
    };
    const applyFilterValues = (column, values) => {
        // console.log({column},{values});

        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                [column]: values,
            };
            breakdownTabList.forEach((tab_header) => {
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
        if (selectedTabName === "Reviews" || selectedTabName === "Competition Reviews") {
            setSelectedRows([])
            setIsFilterApplied(false)
            return
        }
        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                ...tabEmptyObject
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

        if (selectedTabName === "Reviews") {
            setIsFilterApplied(true)
            return
        }
        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters
            };
            // breakdownTabList.forEach((tab_header) => {
            //     if (selectedTabName != tab_header) {
            //         updatedFilters[tab_header.toLowerCase()] = []
            //     }
            // });

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

    useEffect(() => {
        // Reset Reviews tab selection when switching to another tab
        if (selectedTabName !== "Reviews" || selectedTabName !== "Competition Reviews") {
            setSelectedRows([])
            setIsFilterApplied(false)
            setsentimentState({
                breakdownFilters: {},
                ...((selectedFilters?.calendarType == "week") ? { selectedWeeks: selectedFilters?.selectedWeeks } : {selectedDateRange: selectedFilters?.selectedDateRange}),
                ...(activeClientProject?.isUseWidget ? { selectedFilters: selectedFilters } : {})
            })
            return
        }

    }, [selectedTabName]);
    const applyBreakdownFilters = (sFilters, current) => {
        // console.log("applyBreakdownFilters", { sFilters }, { current });

        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                ...tabEmptyObject
            };

            // console.log("Updated selectedTableRows:", updatedFilters);

            setCombinedState((prevCombinedStateFilters) => {
                const newCombinedState = {
                    ...prevCombinedStateFilters,
                    _selectedTableRows: {
                        ...prevCombinedStateFilters?._selectedTableRows,
                        ...updatedFilters
                    },
                    breakdownFilters: (current === "clear_filter")
                        ? {}
                        : {
                            ...prevCombinedStateFilters.breakdownFilters,
                            // [current]: sFilters?.[current] ?? []
                            ...sFilters
                        }
                };

                // console.log("New combinedState:", newCombinedState);
                return newCombinedState;
            });

            return updatedFilters;
        });
    };
    const applySearchFilter = (sFilters, current) => {
        setsentimentState((prevsentimentStateFilters) => {
            const newCombinedState = {
                ...prevsentimentStateFilters,

                breakdownFilters: (current === "clear_filter")
                    ? {}
                    : {
                        ...prevsentimentStateFilters.breakdownFilters,
                        // [current]: sFilters?.[current] ?? []
                        ...sFilters
                    }
            };
            return newCombinedState

        })

    }





    const [searchFilterArray, setSearchFilterArray] = useState(searchFilterArr);
    const [additionalFilter, setAdditionalFilter] = useState([]);

    // function applySearchFilter(sFilters, current) {
    //     console.log({ sFilters }, { current });

    //     // dispatch({
    //     //   type: ActionType.AMAZON_CAMPAIGN_COUNT,
    //     //   payload: {},
    //     // });

    //     // // dispatch({
    //     // //   type: ActionType.CHECKBOX,
    //     // //   payload: { portfolio: [] },
    //     // // });
    //     // // setIsDisabledSaveSearch(false);
    //     // let apiFilter = {};
    //     // let tab = "";
    //     // apiFilter = { ...sFilters };
    //     // if (
    //     //   current === "campaign_m" ||
    //     //   current === "campaign_name" ||
    //     //   current === "tags" ||
    //     //   current === "campaign_id" ||
    //     //   current === "campaign_status" ||
    //     //   current === "amazon_campaign_type"
    //     //   // current === "campaign"
    //     // ) {
    //     //   if (current === "amazon_campaign_type") {
    //     //     let amazon_campaign_type = sFilters?.amazon_campaign_type.map(
    //     //       (data) => data?.key
    //     //     );
    //     //     dispatch({
    //     //       type: ActionType.CAMPAIGN_TYPE,
    //     //       payload: amazon_campaign_type,
    //     //     });
    //     //   }
    //     //   // if (current === "campaign_m")
    //     //   apiFilter["campaign_m"] = sFilters["campaign_m"];
    //     //   let fValues = getFilterValue(
    //     //     [
    //     //       "campaign_name",
    //     //       "campaign_id",
    //     //       "status",
    //     //       "tag_name",
    //     //       "campaign_status",
    //     //       "amazon_campaign_type",
    //     //     ],
    //     //     sFilters
    //     //   );
    //     //   apiFilter = { ...apiFilter, ...fValues };
    //     //   tab = "campaign";
    //     //   // setCheckboxData([]);
    //     // } else if (
    //     //   current === "portfolio" ||
    //     //   // current === "status" ||
    //     //   current === "portfolio_m"
    //     // ) {
    //     //   // if (current === "portfolio_m")
    //     //   apiFilter["portfolio_m"] = sFilters["portfolio_m"];
    //     //   let fValues = getFilterValue(
    //     //     ["portfolio", "status", "portfolio_m"],
    //     //     sFilters
    //     //   );
    //     //   apiFilter = { ...apiFilter, ...fValues };
    //     //   tab = "portfolio";
    //     // } else if (current === "keyword_m" || current === "keyword") {
    //     //   apiFilter["keyword_m"] = sFilters["keyword_m"];
    //     //   let fValues = getFilterValue(["keyword"], sFilters);
    //     //   // console.log(fValues, "fValues");
    //     //   apiFilter = { ...apiFilter, ...fValues };
    //     //   tab = "keyword";
    //     // } else if (
    //     //   current === "asin_m" ||
    //     //   // current === "ad_group_id" ||
    //     //   current === "asin"
    //     // ) {
    //     //   apiFilter["asin_m"] = sFilters["asin_m"];
    //     //   let fValues = getFilterValue(["asin"], sFilters);
    //     //   // console.log(fValues, "fValues");
    //     //   apiFilter = { ...apiFilter, ...fValues };
    //     //   tab = "asin";
    //     // } else if (
    //     //   current === "ad_group_m" ||
    //     //   // current === "ad_group_id" ||
    //     //   current === "adgroupname"
    //     // ) {
    //     //   apiFilter["ad_group_m"] = sFilters["ad_group_m"];
    //     //   let fValues = getFilterValue(["adgroupname"], sFilters);
    //     //   // console.log(fValues, "fValues");
    //     //   apiFilter = { ...apiFilter, ...fValues };
    //     //   tab = "adgroup";
    //     // }
    //     // // else if (
    //     // //   current === "fsn_m" ||
    //     // //   current === "fsn_id" ||
    //     // //   current === "fsn_name"
    //     // // ) {
    //     // //   apiFilter["fsn_m"] = sFilters["fsn_m"];
    //     // //   let fValues = getFilterValue(["fsn_id", "fsn_name"], sFilters);
    //     // //   // console.log(fValues, "fValues");
    //     // //   apiFilter = { ...apiFilter, ...fValues };
    //     // //   // tab = "fsn";
    //     // //   // console.log("fsn_m" || current === "fsn_id" || current === "fsn_name");
    //     // // }
    //     // else if (current === "creative_m" || current === "creative") {
    //     //   apiFilter["creative_m"] = sFilters["creative_m"];
    //     //   let fValues = getFilterValue(["creative"], sFilters);
    //     //   // console.log(fValues, "fValues");
    //     //   apiFilter = { ...apiFilter, ...fValues };
    //     //   tab = "creative";
    //     //   // console.log("creative_m");
    //     // } else if (current === "placement_m" || current === "placement") {
    //     //   apiFilter["placement_m"] = sFilters["placement_m"];
    //     //   let fValues = getFilterValue(["placement"], sFilters);
    //     //   apiFilter = { ...apiFilter, ...fValues };
    //     //   tab = "placement";
    //     // }
    //     // let checkbox = { ...selectedCheckBox };
    //     // if (tab.trim().length > 0) {
    //     //   let priority = {
    //     //     portfolio: 4,
    //     //     campaign: 3,
    //     //     adgroup: 2,
    //     //     keyword: 1,
    //     //     asin: 1,
    //     //     placement: 2,
    //     //   };
    //     //   let priorityKeys = Object.keys(priority);

    //     //   for (let i = 0; i < priorityKeys.length; i++) {
    //     //     if (
    //     //       priority[priorityKeys[i]] < priority[tab] ||
    //     //       (priority[tab] === priority[priorityKeys[i]] &&
    //     //         priorityKeys[i] === tab)
    //     //     ) {
    //     //       checkbox[priorityKeys[i]] = [];
    //     //     }
    //     //   }
    //     //   // if (tab === "portfolio") {
    //     //   //   funnelCount([]);
    //     //   // }
    //     //   setFilters([]);
    //     //   dispatch({
    //     //     type: ActionType.CHECKBOX,
    //     //     payload: checkbox,
    //     //   });
    //     //   filters[tab] = apiFilter;
    //     //   getTabData(tab, true, filters);
    //     //   if (clearSearch === false) {
    //     //     setFilters({ ...filters });
    //     //   } else {
    //     //     setFilters([]);
    //     //   }
    //     // }
    //     // // eslint-disable-next-line no-console
    //     // // console.log("debugerrr showHeader", showHeader);
    //     // // setShowHeader(showHeader);
    //     // // console.log(JSON.stringify(sFilters), "filters-----", apiFilter, current);
    // }

    useEffect(() => {
        // console.log('tabColumnList',tabColumnList,selectedTabName)
        if (_.size(tabColumnList?.[selectedTabName])) {
            let additionalFilterObj = [];
            for (const e of tabColumnList[selectedTabName]) {
                if (e?.type == "breakdown" && (e?.value == "competition_brand" || e?.value == "competition_sku_name" || e?.value == "competition_web_pid")) {
                    //    console.log('e.value',e.value)
                    additionalFilterObj.push(e.value);
                }
            }
            setAdditionalFilter(additionalFilterObj)

            const tagFilter = searchFilterArray.find((ele) => ele.key === "metric");
            tagFilter.children = [];
            const updatedArray = searchFilterArray.map((ele) => {
                // console.log('ele.key',ele.key)
                if (ele.key === "metric") {
                    for (const e of tabColumnList[selectedTabName]) {
                        if (e.type == "parameters"&& e.value!='nd_osa') {
                            ele.children.push({
                                label: e?.title,
                                key: e?.value,
                                persentageValue: e?.persentageValue ?? false,
                                action: FILTERACTION.METRIC,
                            });
                        }
                    }
                }
                return ele;
            });
            setSearchFilterArray(updatedArray);
        }
    }, [JSON.stringify(tabColumnList?.[selectedTabName])]);
    useEffect(() => {
        if (breakdownTabList.includes('Reviews')) {
            setActiveTabIndex(breakdownTabList.indexOf('Reviews'));
            setSelectedTabName("Reviews")
        }
    }, [breakdownTabList]);


const [openMFilter, setOpenMFilter] = useState(null);
    return (
        <>

            <div className="tableContentWrap tableContentWrapHead !rounded-2xl shadow-[0px_2px_4px_0px_#00000005,0px_1px_6px_-1px_#00000005,0px_1px_2px_0px_#00000008] !mb-0 !pb-[16px]">
                <div className="sectionIconHead">
                    <div className='flex gap-2 items-center'>

                        <MdOutlineDragIndicator
                            {...listeners}
                            {...attributes}
                        />
                        <div className="sectionIcon">
                            <img src="/assets/images/comprehensiveIcon.svg" width={16} height={14} />
                        </div>
                        <h4 >Comprehensive Breakdown</h4>
                        {loading && <Loader show={loading} fullScreen={false} />}
                    </div>
                </div>
                <div className='tblFilterBox'>
                    {/* <TableFilterComponent filtersKeys={filtersKeys} onChange={applyBreakdownFilters} /> */}

                    <div className="col_12 flex items-center">

                        {(selectedTabName === "Competition Reviews" || selectedTabName === "Reviews") ? <SentimentMultifilter savedSearch={{}}
                            arr={searchFilterArray}
                            additionalFilter={additionalFilter}
                            applySearchFilter={applySearchFilter}
                            handleSaveFilters={false} is_brand={selectedTabName === "Reviews"} />
                            : <ComprehensiveBreakdownMultiFilter
                                savedSearch={{}}
                                arr={searchFilterArray}
                                additionalFilter={additionalFilter}
                                applySearchFilter={applyBreakdownFilters}
                                handleSaveFilters={false}
                                // handleSaveFilters={handleSaveMultiSearch}
                                platform="ams"
                                openMFilter={openMFilter}
                                setOpenMFilter={setOpenMFilter}
                            // onChange={applyBreakdownFilters}
                            />
                        }

                        {
                             activeClientProject?.isUseWidget?<></>:
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
                        </div>

                        }
                        
                    </div>

                </div>

                {/* {!loading && */}
                <div className="tableContentWrap !pt-0">
                    <div className="tableContentTabs">
                        <BreakdownTabComponent
                            kpi={kpi}
                            breakdownTabList={breakdownTabList}
                            activeTabIndex={activeTabIndex}
                            setActiveTabIndex={setActiveTabIndex}
                            selectedTabName={selectedTabName}
                            selectedTabKey={selectedTabName?.toLowerCase()}
                            setSelectedTabName={setSelectedTabName}
                            tabPosition={tabPosition}
                            setTabPosition={setTabPosition}
                            breakdownTabData={breakdownTabData}

                            selectedTableRows={selectedTableRows}
                            removeAllSelectedTableRows={removeAllSelectedTableRows}
                            getAllSelectedTableRowsData={getAllSelectedTableRowsData}
                            platformSubCat={platformSubCat}
                            selectedCount={selectedCount}
                            selectedTotal={selectedTotal}

                            setDownloadkey={setDownloadkey}
                            handleCustomizeClick={handleCustomizeClick}
                            trackDashboardClick={trackDashboardClick}

                        />

                        {selectedTabName && reportData?.length && tabPosition?.length ?
                            (<TabTableHeader
                                setLoading={setLoading}
                                data={reportData}
                                setCombinedState={setCombinedState}
                                header={tabColumnList?.[selectedTabName]}
                                openDrawer={openDrawer}
                                openMultipleInDrawer={openMultipleInDrawer}
                                handleColumnClick={handleColumnClick}
                                selectedTabName={selectedTabName}
                                selectedTabKey={selectedTabName?.toLowerCase()}
                                breakdownTabData={breakdownTabData?.[selectedTabName?.toLowerCase()]}
                                selectedTableRows={selectedTableRows}
                                setSelectedTableRows={setSelectedTableRows}
                                tabPosition={tabPosition}
                            />)
                            : <></>
                        }
                        {selectedTabName && reportData?.length && tabPosition?.length ?
                            (<TagMappingWithProductAndKeyword
                                selectedTabName={selectedTabName}
                                selectedTabKey={selectedTabName?.toLowerCase()}
                                selectedTableRows={selectedTableRows}
                            />)
                            : <></>
                        }

                        {selectedTabName && (selectedTabName === "Reviews" || selectedTabName === "Competition Reviews") ? <ReviewTable setselectedCount={setselectedCount} setselectedTotal={setselectedTotal} breakDownfilter={sentimentState} selectedRows={selectedRows} setSelectedRows={setSelectedRows}
                            isFilterApplied={isFilterApplied} setIsFilterApplied={setIsFilterApplied}
                            selectedTabName={selectedTabName} downloadkey={downloadkey}
                        /> : selectedTabName && reportData?.length && tabPosition?.length ?
                            (<BreakdownTable
                                filters={filters}
                                kpi={kpi}

                                setLoading={setLoading}
                                data={reportData}
                                header={tabColumnList?.[selectedTabName]}
                                sortConfig={sortConfig}
                                setSortConfig={setSortConfig}
                                downloadkey={downloadkey}
                                setDownloadkey={setDownloadkey}
                                openDrawer={openDrawer}
                                openBannerDrawer={openBannerDrawer}
                                openMultipleInDrawer={openMultipleInDrawer}
                                handleColumnClick={handleColumnClick}
                                selectedTabName={selectedTabName}
                                selectedTabKey={selectedTabName?.toLowerCase()}
                                breakdownTabData={breakdownTabData?.[selectedTabName?.toLowerCase()]}
                                skuTabData={breakdownTabData?.["sku"]}
                                selectedTableRows={selectedTableRows}


                                setSelectedTableRows={setSelectedTableRows}
                                
                                openMFilter={openMFilter} setOpenMFilter={setOpenMFilter}
                            />)
                            : <>No Data</>
                        }
                    </div>
                </div>
                {/* }  */}
            </div>

            {popupInfo.isOpen && (
                <SelectedItemPopupComponent
                    popupTitle={popupInfo.column}
                    values={breakdownTabData?.[popupInfo.column]}
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
                    <BreakdownDrawer onClose={closeDrawer} drawerInfo={drawerInfo} breakdownPerformance={breakdownPerformance}
                        selectedTableRows={selectedTableRows} breakdownFilters={combinedState?.breakdownFilters ?? {}}
                        comprehensiveBreakdownTableData={breakdownTabData} />
                </Drawer>

            )}
            {drawerBannerInfo.isOpen && (
                <Drawer
                    open={drawerBannerInfo?.isOpen}
                    onClose={closeBannerDrawer}
                    direction='right'
                    style={{ width: '1020px' }}
                    className='performanceDrawerWrap'
                >
                    <BannerDrawer onClose={closeBannerDrawer} drawerInfo={drawerBannerInfo} />
                </Drawer>
            )}
            {customizeInfo.isOpen && (
                <CustomizeCampiagnModal popupTitle={breakdownCustomizeColumnTitle} selectedTabName={selectedTabName} kpi={kpi} closePopup={closeCustomizePopup} tabColumnList={tabColumnList} setTabColumnList={setTabColumnList} />
            )}
        </>
    );
};

export default BreakdownComponent;
