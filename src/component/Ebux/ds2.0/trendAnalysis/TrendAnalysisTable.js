import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FaSort } from "react-icons/fa";
import { IoMdCopy } from 'react-icons/io';
import './TrendAnalysisTable.css';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { useEbuxContext } from "../../Context/EbuxProvider";
import { fetchTrendAnalysisTabData, fetchTrendAnalysisTableData } from './services/services';
import _, { isEqual } from "lodash";
// import CustomTooltip from '../osaWidgets/osaPerformanceOverview/Components/DrawerComponent/customTooltip/CustomTooltip';
import ComprehenisiveFilter from '../osaWidgets/osaPerformanceOverview/Components/DrawerComponent/filter/ComprehenisiveFilter';
import { FILTERACTION, searchFilterArr } from '../../common-components/MultiFilter/FilterConstant';
import Loader from '../../common-components/Loader';
import CustomizeCampiagnModal from '../../common-components/CustomizeCampiangn';
import { copyToClipboard, getTextFromReactNode } from '../../../../utils/helpers';
import InfoTooltip from '../common-components/InfoTooltip';
const initCustomizeColumns = {
    "breakdown": {
        "title": "Breakdowns",
        "columns": [
            {
                "persentageValue": false,
                "title": "Platform",
                "type": "breakdown",
                "value": "platform",
                "key": "platform",
                "breakdown": "Platform",
                "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR",
                    "SOS",
                    "OR",
                    "SOD",
                    "SOM"
                ],
                "allowInDarkStore": true,
                "isDisabled": false
            },
            {
                "persentageValue": false,
                "title": "Brands",
                "type": "breakdown",
                "value": "brand",
                "key": "brand",
                "breakdown": "Brand",
                "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR",
                    "SOS",
                    "OR",
                    "SOD",
                    "SOM"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInDarkStore": true,
                "isDisabled": false
            },

            ...((JSON.parse(localStorage.getItem("active_client_project") ?? {})?.client_project_id == 109) ?
                [{
                    persentageValue: false,
                    title: "Sub Brand",
                    type: "breakdown",
                    value: "sub_brand",
                    key: "sub_brand",
                    breakdown: "",
                    allowKPI: ['OSA', 'CS', 'PRO', 'RR', 'SOS', 'OR', 'SOD'],
                    notAllowWithIsValueIn: [],
                    allowWithIsValueIn: [],
                    allowInDarkStore: true
                }] : []),
            {
                "persentageValue": false,
                "title": "Category",
                "type": "breakdown",
                "value": "category",
                "key": "category",
                "breakdown": "Category",
                "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR",
                    "SOS",
                    "OR",
                    "SOD",
                    "SOM"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInDarkStore": true,
                "isDisabled": false
            },
            ...((JSON.parse(localStorage.getItem("active_client_project") ?? {})?.client_project_id == 109) ?
                [{
                    persentageValue: false,
                    title: "Sub Category",
                    type: "breakdown",
                    value: "sub_category",
                    key: "sub_category",
                    breakdown: "",
                    allowKPI: ['OSA', 'CS', 'PRO', 'RR', 'SOS', 'OR', 'SOD'],
                    notAllowWithIsValueIn: [],
                    allowWithIsValueIn: [],
                    allowInDarkStore: true
                }] : []),
            {
                "persentageValue": false,
                "title": "Locations",
                "type": "breakdown",
                "value": "location",
                "key": "location",
                "breakdown": "Location",
                "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR",
                    "SOS",
                    "OR"
                ],
                "notAllowWithIsValueIn": [
                    "rating_value",
                    "review_count"
                ],
                "allowWithIsValueIn": [],
                "isDisabled": false
            },
            {
                "persentageValue": false,
                "title": "Product",
                "type": "breakdown",
                "value": "product",
                "key": "product",
                "breakdown": "Product",
                "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInDarkStore": true,
                "isDisabled": false
            },
            {
                "persentageValue": false,
                "title": "SKU",
                "type": "breakdown",
                "value": "sku_id",
                "key": "sku_id",
                "breakdown": "Product",
                "allowKPI": [
                    "OSA",
                    "CS",
                    "PRO",
                    "RR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "allowInDarkStore": true,
                "isDisabled": false
            },
            {
                "persentageValue": false,
                "title": "Keyword",
                "type": "breakdown",
                "value": "keyword",
                "key": "keyword",
                "breakdown": "Keyword",
                "allowKPI": [
                    "SOS",
                    "OR"
                ],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "isDisabled": false
            },

        ]
    }
}
const useFilter = false;
const baseColors = [
    '#8B4513', '#DAA520', '#FF6B35', '#FF8C00', '#2F1B14',
    '#DC143C', '#32CD32', '#8B0000', '#B22222', '#32CD32',
    '#8B4513', '#32CD32', '#F5F5DC', '#D2691E', '#DC143C',

    '#A4C8FF', // Light blue
    '#FFD2A6', // Light orange
    '#BEEBA6', // Light green
    '#E36968', // Coral red
    '#B594D2', // Light purple
];

const TrendAnalysisTable = ({ tabColumnList, setTabColumnList, loading, setLoading, activeTab, setActiveTab, allTabs, getTabIcon, selectedMetric, setSelectedData, kpiInfo = {}, pf_images, allow_nd_osa = false, allow_nestle_nd_osa_darkstore_coverage = false }) => {
    const { kpi, selectedFilters, filters, activeClientProject } = useEbuxContext();
    const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });

    const handleCustomizeClick = () => {
        setCustomizeInfo(prev => ({ isOpen: !prev.isOpen, column: '' }));
    };

    const closeCustomizePopup = () => {
        setCustomizeInfo({ isOpen: false, column: null });
    };

    const [selectedProducts, setSelectedProducts] = useState(
        new Set([])
    );
    const [sortColumn, setSortColumn] = useState(activeTab);
    const [sortDirection, setSortDirection] = useState('asc');
    useEffect(() => {
        setSortColumn(activeTab);
        // setSelectedProducts(new Set([]));
        setSortDirection('asc');
        if (activeTab && !tabColumnList?.[activeTab]?.length) {
            const selected = [];
            Object.keys(initCustomizeColumns).map((columnGroup) => {
                initCustomizeColumns?.[columnGroup]?.columns.forEach((col) => {
                    if (col?.breakdown?.toLowerCase() == activeTab && col?.type == "breakdown" && (!col?.isDisabled)) {
                        selected.push({ ...col, remove: false, drag: false });
                    }
                })
            })
            if (selected?.length) {
                setTabColumnList((previous) => ({ ...previous, [activeTab]: selected }))
            }


        }
    }, [activeTab, initCustomizeColumns]);
    // console.log('activeClientProjectactiveClientProject',activeClientProject?.isUseWidget)
    const MAX_SELECTION = 15;
    const MIN_SELECTION = 1;
    // const [timeView, setTimeView] = useState('daily');
    const [timeView, setTimeView] = useState('weekly');
    const [sortView, setSortView] = useState('new');


    const emptyTabObject = [...allTabs]?.reduce((map, tab_name) => {
        if (!map[tab_name?.toLocaleLowerCase()]) map[tab_name?.toLocaleLowerCase()] = {};
        return map;
    }, {});
    const emptyTabObjectOfArray = [...allTabs]?.reduce((map, tab_name) => {
        if (!map[tab_name?.toLocaleLowerCase()]) map[tab_name?.toLocaleLowerCase()] = [];
        return map;
    }, {});
    const [allTabValues, setAllTabValues] = useState(emptyTabObject);
    const [totalDataCount, setTotalDataCount] = useState(emptyTabObjectOfArray);
    const [apiResponse, setApiResponse] = useState(null);

    const [breakdownFilters, setBreakdownFilters] = useState({});

    // ✅ Normalize columns
    const { columnData, rowData, footerData } = useMemo(() => {
        if (apiResponse?.rowData) {
            const { columnData: rawColumns, rowData, footerData } = apiResponse;
            const normalizedColumns = (rawColumns || []).map(c =>
                typeof c === "string" ? { key: c, label: c } : c
            );
            return { columnData: normalizedColumns, rowData, footerData };
        } else {
            return { columnData: [], rowData: [], footerData: {} };
        }
    }, [JSON.stringify(apiResponse)]);


    const fetchTabData = async () => {
        setLoading(true);
        if (!timeView || !activeTab) return;
        let payload = { kpi, allTabs: allTabs, selectedFilters, filters, selectedWeeksForTrendAnalysis: selectedFilters?.selectedWeeks?.current };
        const response = await fetchTrendAnalysisTabData(payload);
        // setSelectedDataCount(emptyTabObject);
        setTotalDataCount(response);
        setLoading(false);
        // setApiResponse(response);
    };

    const setNewRef = useRef(true);
    const fetchTableData = async () => {
        setLoading(true);
        if (!timeView || !activeTab) return;
        let payload = { kpi, matrix: selectedMetric ?? "osa", breakdown: tabColumnList?.[activeTab]?.map(i => i?.value) ?? activeTab, timeView: timeView ?? 'daily', selectedFilters, breakdownFilters, filters, selectedWeeksForTrendAnalysis: selectedFilters?.selectedWeeks?.current, Sort_By: sortView == "new" ? "desc" : "asc" };
        const response = await fetchTrendAnalysisTableData(payload);
        setApiResponse(response ?? {});
        setAllTabValues(prev => ({ ...prev, [activeTab]: response ?? {} }));
        if (setNewRef.current) {
            setSelectedProducts(new Set(response?.rowData?.filter(i => i?.main == true)?.slice(0, MAX_SELECTION)?.map(i => i?.[activeTab]?.value) ?? []));
        }
        setNewRef.current = true;
        setLoading(false);
    };

    const previousCombinedState = useRef("");
    const previousTabState = useRef("");
    const previousTabState1 = useRef("");
    // const previousActiveTabState = useRef({});
    useEffect(() => {
        const combinedStateTab = JSON.stringify({ ...{ selectedMetric }, ...{ selectedFilters, selectedWeeksForTrendAnalysis: selectedFilters?.selectedWeeks?.current } });
        if (!isEqual(previousTabState.current, combinedStateTab)) {
            previousTabState.current = combinedStateTab;
            fetchTabData();
        }
        const combinedStateTable = JSON.stringify({ ...{ selectedMetric }, ...{ timeView }, ...{ selectedFilters, breakdownFilters, selectedWeeksForTrendAnalysis: selectedFilters?.selectedWeeks?.current, sortView, tabColumnList: { ...tabColumnList?.[activeTab] } } });
        // if (isEqual(previousCombinedState.current, combinedStateTable)&&allTabValues?.[activeTab]?.length) {
        if (isEqual(previousCombinedState.current, combinedStateTable)) {
            // setSelectedData([]);
            if (allTabValues?.[activeTab] && Object.keys(allTabValues?.[activeTab])?.length) {
                const response = allTabValues?.[activeTab] ?? {};
                setApiResponse(response);
                setSelectedProducts(new Set(response?.rowData?.filter(i => i?.main == true)?.slice(0, MAX_SELECTION)?.map(i => i?.[activeTab]?.value) ?? []));
            } else {
                setAllTabValues(prev => ({ ...prev, [activeTab]: {} }));
                // setSelectedData([]);
                fetchTableData();
            }
        } else if (!isEqual(previousCombinedState.current, combinedStateTable)) {
            const combinedStateTable1 = JSON.stringify({ activeTab, ...{ selectedMetric }, ...{ timeView }, ...{ selectedFilters, selectedWeeksForTrendAnalysis: selectedFilters?.selectedWeeks?.current } });
            if (!isEqual(previousTabState1.current, combinedStateTable1)) {
                previousTabState1.current = combinedStateTable1;
                //col not update 
                setNewRef.current = true;
            } else {
                previousTabState1.current = combinedStateTable1;
                //col update
                setNewRef.current = false;
            }

            previousCombinedState.current = combinedStateTable;
            setAllTabValues(emptyTabObject);
            // setSelectedData([]);
            fetchTableData();
        }

        // setSortColumn(activeTab);
    }, [timeView, selectedMetric, activeTab, JSON.stringify({ ...selectedFilters, breakdownFilters, selectedWeeksForTrendAnalysis: selectedFilters?.selectedWeeks?.current, sortView, tabColumnList: { ...tabColumnList?.[activeTab] } })]);

    const [filterBy, setFilterBy] = useState('');
    const headerCheckboxRef = useRef(null);
    const dynamicColumns = useMemo(() => columnData, [columnData]);


    const handleSort = (columnKey) => {
        if (sortColumn == columnKey) {
            setSortDirection((old) => old == 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    const handleProductSelect = (productId, checked) => {
        setSelectedProducts((prev) => {
            const next = new Set(prev);
            if (checked) {
                if (next.size >= MAX_SELECTION && !next.has(productId)) return next;
                next.add(productId);
                return next;
            } else {
                if (!next.has(productId)) return next;
                if (next.size <= MIN_SELECTION) return next;
                next.delete(productId);
                return next;
            }
        });
    };

    const sortedTableData = useMemo(() => {
        const data = [...rowData];


        if (!sortColumn) {
            if (Array.isArray(data)) {
                data.sort((a, b) => {
                    const aKey = a?.[activeTab]?.value ?? 0;
                    const bKey = b?.[activeTab]?.value ?? 0;
                    return aKey - bKey;
                });
            }
            return data;
        } else {
            const parseNumeric = (raw) => {
                if (raw == null) return NaN;
                if (typeof raw === 'number') return raw;
                // If value is stored as { value: '12%' } or similar, extract .value
                let val = raw?.value ?? raw;
                if (val == null) return NaN;
                // Convert to string and strip common non-numeric chars (commas, currency symbols, percent signs, spaces)
                const s = String(val).replace(/[,\s]/g, '');
                // Remove currency/percent/other non-numeric except dot and minus
                const cleaned = s.replace(/[^0-9.-]/g, '');
                const n = parseFloat(cleaned);
                return isNaN(n) ? NaN : n;
            };

            data.sort((a, b) => {
                // if (sortColumn === activeTab) {
                //     const aval = a?.[activeTab]?.value ?? '';
                //     const bval = b?.[activeTab]?.value ?? '';
                //     return sortDirection === 'asc'
                //         ? String(aval).trim().localeCompare(String(bval).trim())
                //         : String(bval).trim().localeCompare(String(aval).trim());
                // }
                if (sortColumn === activeTab) {
                    const aval = String(a?.[activeTab]?.value ?? '').trim();
                    const bval = String(b?.[activeTab]?.value ?? '').trim();
                    const startsWithUppercase = (str) => /^[A-Z]/.test(str);

                    let comparison = 0;

                    const aIsCap = startsWithUppercase(aval);
                    const bIsCap = startsWithUppercase(bval);

                    if (aIsCap && !bIsCap) {
                        comparison = -1;
                    } else if (!aIsCap && bIsCap) {
                        comparison = 1;
                    } else {
                        comparison = aval.localeCompare(bval, 'en-US', { sensitivity: 'variant' });
                    }

                    // Apply the sort direction
                    return sortDirection === 'asc' ? comparison : -comparison;
                }

                const aNum = parseNumeric(sortColumn?.indexOf("@nestle_nd_osa_darkstore_coverage") > -1 ? a?.[sortColumn?.replace("@nestle_nd_osa_darkstore_coverage", "")]?.nestle_nd_osa_darkstore_coverage : parseNumeric(sortColumn?.indexOf("@nd_osa") > -1 ? a?.[sortColumn?.replace("@nd_osa", "")]?.nd_osa : a?.[sortColumn]));
                const bNum = parseNumeric(sortColumn?.indexOf("@nestle_nd_osa_darkstore_coverage") > -1 ? b?.[sortColumn?.replace("@nestle_nd_osa_darkstore_coverage", "")]?.nestle_nd_osa_darkstore_coverage : parseNumeric(sortColumn?.indexOf("@nd_osa") > -1 ? b?.[sortColumn?.replace("@nd_osa", "")]?.nd_osa : b?.[sortColumn]));

                // Push non-numeric values to the end when sorting ascending
                const aNaN = isNaN(aNum);
                const bNaN = isNaN(bNum);
                if (aNaN && bNaN) return 0;
                if (aNaN) return 1;
                if (bNaN) return -1;

                return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
            });
        }

        return data;
    }, [JSON.stringify({ rowData, sortColumn, sortDirection })]);


    useEffect(() => {
        const node = headerCheckboxRef.current;
        if (!node) return;
        if (rowData.length === 0) {
            node.checked = false;
            node.indeterminate = false;
            return;
        }
        node.checked = selectedProducts?.size == rowData.length;
        node.indeterminate = selectedProducts?.size > 0 && selectedProducts?.size < rowData.length;
    }, [selectedProducts, JSON.stringify({ rowData })]);

    const selectionSnapshot = useMemo(() => {
        const periods = dynamicColumns?.slice(1)?.map(c => c.label);
        const rows = sortedTableData?.filter(i => i?.main == true)
            .filter(r => selectedProducts.has(r?.[activeTab]?.value))
            .map((r, idx) => ({
                id: r?.[activeTab]?.value,
                name: r?.[activeTab]?.value,
                color: baseColors[idx],
                values: dynamicColumns?.slice(1).map(c => r?.[c.key]?.value ? Math.round(r?.[c.key]?.value) : null)
            }));
        return { timeView, periods, rows };
    }, [selectedProducts, JSON.stringify({ timeView, dynamicColumns, sortedTableData, rowData })]);

    const selectionSnapshotRef = useRef({ sig: '' });
    useEffect(() => {
        if (!setSelectedData) return;
        const nextSig = JSON.stringify(selectionSnapshot);
        const refSig = selectionSnapshotRef.current;
        if (refSig.sig != nextSig) {
            refSig.sig = nextSig;
            selectionSnapshotRef.current = { sig: nextSig };
            setSelectedData(selectionSnapshot);
        }
    }, [JSON.stringify({ selectionSnapshot })]);

    const handleSelectAllVisible = () => {
        setSelectedProducts((prev) => {
            const current = new Set(prev);
            const visibleIds = sortedTableData.map((p) => p?.[activeTab]?.value);
            const selectedVisible = visibleIds.filter((id) => current.has(id));
            const selectedVisibleCount = selectedVisible.length;
            const maxSelectableHere = Math.min(visibleIds.length, MAX_SELECTION);
            const shouldUncheck = selectedVisibleCount >= maxSelectableHere && selectedVisibleCount > 0;

            if (shouldUncheck) {
                const keepId = selectedVisible[0] || (current.size > 0 ? Array.from(current)[0] : null);
                for (const id of selectedVisible) {
                    if (id !== keepId && current.size > MIN_SELECTION) current.delete(id);
                }
                if (current.size > MIN_SELECTION) {
                    for (const id of Array.from(current)) {
                        if (id === keepId) continue;
                        if (current.size <= MIN_SELECTION) break;
                        if (!visibleIds.includes(id)) current.delete(id);
                    }
                }
                if (current.size < MIN_SELECTION && keepId) current.add(keepId);
                return current;
            }

            const capacity = MAX_SELECTION - current.size;
            if (capacity <= 0) return current;
            let count = 0;
            for (let i = 0; i < visibleIds.length && count < capacity; i++) {
                const id = visibleIds[i];
                if (!current.has(id)) {
                    current.add(id);
                    count++;
                }
            }
            return current;
        });
    };

    const handleDownload = () => {
        // const header = [`${activeTab}`,
        // ...((tabColumnList?.[activeTab])?.slice(1)?.map((b) => b?.title ?? b?.value ?? '') ?? []), ...dynamicColumns?.slice(1)?.map(col => col.label) ?? []];
        // const rows = sortedTableData.map((p) => [
        //     p?.[activeTab]?.value,
        //     ...(tabColumnList?.[activeTab]?.slice(1)?.map((b) => p?.[b?.value]?.value ?? "All") ?? []),
        //     ...dynamicColumns?.slice(1)?.map(col => p?.[col.key]?.value ?? 0) ?? []
        // ]);
        const header = [
            `${activeTab}`,
            ...(tabColumnList?.[activeTab]
                ?.slice(1)
                ?.map(b => b?.title ?? b?.value ?? '') ?? []),

            ...(dynamicColumns
                ?.slice(1)
                ?.flatMap(col =>
                    (selectedMetric ?? "osa") === "osa"
                        ? [col.label, ...(allow_nd_osa ? [`${col.label} ND (OSA)`] : []), ...(allow_nestle_nd_osa_darkstore_coverage ? [`${col.label} ND (Darkstore Coverage)`] : [])]
                        : [col.label]
                ) ?? [])
        ];
        const rows = sortedTableData.map(p => [
            p?.[activeTab]?.value,

            ...(tabColumnList?.[activeTab]
                ?.slice(1)
                ?.map(b => p?.[b?.value]?.value ?? "All") ?? []),

            ...(dynamicColumns
                ?.slice(1)
                ?.flatMap(col => {
                    const val = p?.[col.label]?.value;
                    const value =
                        (val != undefined && kpiInfo?.icon == "rupee" ? "₹ " : (kpiInfo?.icon ? (kpiInfo?.icon + " ") : "")) +
                        `${val ?? 0}` +
                        (kpiInfo?.persentageValue ? "%" : "");

                    return (selectedMetric ?? "osa") === "osa"
                        ? [value, ...(allow_nd_osa ? [p?.[col.label]?.nd_osa ?? 0] : []), ...(allow_nestle_nd_osa_darkstore_coverage ? [p?.[col.label]?.nestle_nd_osa_darkstore_coverage ?? 0] : [])]
                        : [value];
                }) ?? [])
        ]);

        // Build worksheet data (array of arrays) with header first
        const sheetData = [header, ...rows];

        // Create workbook and worksheet
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Products Distribution');

        // Generate binary and trigger download
        const fileBase = `products_distribution_${activeTab}_${timeView}`;
        XLSX.writeFile(wb, `${fileBase}.xlsx`);
    };


    const showVal = (val) => {
        if (val == undefined) {
            return <>-</>;
        }
        return <>{val != undefined && kpiInfo?.icon == "rupee" ? "₹ " : (kpiInfo?.icon ? (kpiInfo?.icon + " ") : "")}{val ?? "-"}{val != undefined && kpiInfo?.persentageValue ? "%" : ""}</>;
    }
    const [searchFilterArray, setSearchFilterArray] = useState(searchFilterArr);
    const [additionalFilter, setAdditionalFilter] = useState([]);

    useEffect(() => {
        const columns = columnData?.slice(1) ?? [];
        // console.log('tabColumnList',tabColumnList,selectedTabName)
        if (_.size(columns)) {
            let additionalFilterObj = [];
            for (const e of columns) {
                if (e?.type == "breakdown") {
                    //    console.log('e.value',e.value)
                    additionalFilterObj.push(e.value);
                }
            }
            setAdditionalFilter(additionalFilterObj)

            const tagFilter = searchFilterArray?.find((ele) => ele.key === "metric");
            tagFilter.children = [];
            const updatedArray = searchFilterArray?.map((ele) => {
                // console.log('ele.key',ele.key)
                if (ele.key === "metric") {
                    for (const e of columns) {
                        if (kpiInfo.type == "parameters") {
                            ele.children.push({
                                label: kpiInfo?.title + " on " + (e?.title ?? e?.label),
                                key: kpiInfo?.value ?? e?.key,
                                persentageValue: kpiInfo?.persentageValue ?? false,
                                action: FILTERACTION.METRIC,
                            });
                        }
                    }
                }
                return ele;
            });
            setSearchFilterArray(updatedArray);
        }
    }, [JSON.stringify(columnData)]);
    const applyBreakdownFilters = (sFilters, current) => {
        setBreakdownFilters((prevFilters) => {
            return (current === "clear_filter") ? {} : { ...prevFilters, ...sFilters };
        });
    };

    const [disableWeekly, setDisableWeekly] = useState(false);
    const [disableMonthly, setDisableMonthly] = useState(false);





    useEffect(() => {
        if (!selectedFilters?.selectedDateRange?.startDate || !selectedFilters?.selectedDateRange?.endDate) return;

        const startDate = new Date(selectedFilters?.selectedDateRange.startDate);
        const endDate = new Date(selectedFilters?.selectedDateRange.endDate);

        const diffInDays = (endDate - startDate) / (1000 * 3600 * 24) + 1;


        if (diffInDays < 7) {
            setDisableWeekly(true);
            setDisableMonthly(true);
            // setTimeView("daily");

        } else if (diffInDays < 30) {
            // setDisableWeekly(false);
            // setDisableMonthly(true);
            if (timeView === "monthly") {
                // setTimeView("daily");
            }
        } else {
            setDisableWeekly(false);
            setDisableMonthly(false);
        }


    }, [selectedFilters?.selectedDateRange]);
    console.log(sortedTableData, "sortedTableData");


    // Virtualization setup
    const rowHeight = 42; // Increased for better spacing
    const tableHeight = 400; // Increased height
    const [scrollTop, setScrollTop] = useState(0);
    const totalRows = sortedTableData.length;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight));
    const endIndex = Math.min(totalRows - 1, Math.floor((scrollTop + tableHeight) / rowHeight));
    const visibleRows = sortedTableData.slice(startIndex, endIndex + 1);

    const handleScroll = useCallback((e) => {
        setScrollTop(e.target.scrollTop);
    }, []);
    return (
        <div className="products-distribution">
            <div className="products-distribution_header">
                {/* <div className="header-left">
                    <h1>Products Distribution</h1>
                    <i className="chart-date">
                        {moment(selectedFilters?.selectedDateRange?.startDate ?? "23/07/25").format("DD/MM/YYYY")} →
                        {moment(selectedFilters?.selectedDateRange?.endDate ?? "23/07/25").format("DD/MM/YYYY")}
                    </i>
                </div>  */}
                <div className="header-left flex items-center gap-4">
                    <div className="flex flex-col">
                        <h1>Products Distribution</h1>
                        <i className="chart-date">
                            {moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY")} →
                            {moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY")}
                        </i>
                    </div>
                    {loading && <Loader show={loading} fullScreen={false} />}
                </div>
                <div className="header-right">
                    <div className="filter-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="filter-dropdown">
                            {/* <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                style={{
                                    appearance: "none",
                                    background: "url('/assets/images/filterby.svg') no-repeat right 8px center",
                                    backgroundSize: "16px 16px",
                                    paddingRight: "30px",
                                }}
                            >
                                <option value="">Filter By</option>
                                <option value="coffee">Coffee</option>
                                <option value="noodles">Noodles</option>
                                <option value="chocolate">Chocolate</option>
                            </select> */}

                            {useFilter ? (<ComprehenisiveFilter text="Filter By" filterBy={filterBy} setFilterBy={setFilterBy}
                                savedSearch={{}}
                                arr={searchFilterArray}
                                additionalFilter={additionalFilter}
                                applySearchFilter={applyBreakdownFilters}
                                handleSaveFilters={false} />) : <></>}
                        </div>
                        <div className="relative">
                            <select
                                className='appearance-none pr-8 w-[175px]'
                                value={sortView}
                                onChange={(e) => setSortView(e.target.value)}
                                style={{ fontSize: '16px', fontWeight: 400, borderRadius: '8px', padding: '5px 11px', border: '1px solid #E0E0E0' }}
                            >
                                <option value="new" >Newest To Oldest</option>
                                <option value="old" >Oldest To Newest</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg
                                    className="w-4 h-4 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="graphIconBtn"
                            style={{ background: "none", border: "none", cursor: "pointer", marginLeft: 8 }}
                            onClick={handleDownload}
                            aria-label="Download table as CSV"
                        >
                            <img src="/assets/images/downloadIcon.svg" width={20} height={20} alt="Download" />
                        </button>
                        <button type="button" className="graphIconBtn" onClick={handleCustomizeClick}>
                            <img src="/assets/images/columnsIcon.svg" className="w-[20px] h-[20px] cursor-pointer" alt="Customize" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="filters-section border-none">
                <div className="filter-tabs">
                    {allTabs?.map((tab_name, i) => (
                        <div
                            key={tab_name + "_" + i}
                            className={`filter-tab${activeTab === tab_name?.toLocaleLowerCase() ? ' active' : ''}`}
                            onClick={() => setActiveTab(tab_name?.toLocaleLowerCase())}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
                                {getTabIcon(tab_name?.toLocaleLowerCase())}
                                <span>{tab_name}</span>
                                <span className="tblTag">
                                    {activeTab === tab_name?.toLocaleLowerCase() ? selectedProducts?.size ?? 0 : 0}/{totalDataCount?.[tab_name?.toLocaleLowerCase()]?.length}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="view-selector">
                    {/* // sort oldest to newest and newest to oldest */}

                    {false &
                        (([2].indexOf(activeClientProject?.client_project_id) > -1) && activeClientProject?.isUseWidget) ?
                        <div className="relative">
                            <select
                                className='appearance-none pr-8 w-[175px]'
                                value={sortView}
                                onChange={(e) => setSortView(e.target.value)}
                                style={{ fontSize: '16px', fontWeight: 400, borderRadius: '8px', padding: '5px 11px', border: '1px solid #E0E0E0' }}
                            >
                                <option value="new" >Newest To Oldest</option>
                                <option value="old" >Oldest To Newest</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg
                                    className="w-4 h-4 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        : <></>
                    }
                    {/* // sort oldest to newest and newest to oldest */}

                    <div className="relative">
                        <select
                            className='appearance-none pr-8 w-[150px]'
                            value={timeView}
                            onChange={(e) => setTimeView(e.target.value)}
                            style={{ fontSize: '16px', fontWeight: 400, borderRadius: '8px', padding: '5px 11px', border: '1px solid #E0E0E0' }}
                        >
                            <option value="monthly" disabled={disableMonthly}>Monthly View</option>
                            <option value="weekly" disabled={disableWeekly}>Weekly View</option>
                            {/* <option value="daily">Daily View</option> */}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-container"
                style={{ height: tableHeight }}
                onScroll={handleScroll}
            >

                <style>
                    {`
                        .sticky-table {
                            border-collapse: separate;
                            border-spacing: 0;
                        }
                        .sticky-header {
                            position: sticky;
                            top: 0;
                            z-index: 20;
                            background: #F6F9FB;
                            border: none;
                            margin: 0;
                            padding: 0;
                        }
                        .sticky-footer {
                            position: sticky;
                            bottom: 0;
                            z-index: 40;
                            background: #F6F9FB; /* match header */
                            border: none;
                            box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.08);
                            margin: 0;
                            padding: 0;
                        }
                        .sticky-first-column {
                            position: sticky !important;
                            left: 0;
                            z-index: 10;
                            background: #F6F9FB;
                            border-right: 2px solid #E5E7EB;
                        }
                        .sticky-first-column-body {
                            position: sticky;
                            left: 0;
                            z-index: 15;
                            background: #FFFFFF;
                            border-right: 2px solid #E5E7EB;
                        }
                        .sticky-first-column-footer {
                            position: sticky;
                            left: 0;
                            z-index: 15;
                            background: #FFFFFF;
                            border-right: 2px solid #E5E7EB;
                        }
                    `}
                </style>
                <table className="products-table sticky-table">
                    <thead className='table-head sticky-header rounded-lg'>
                        <tr>
                            <th className="products-header sticky-first-column !min-w-[350px] !max-w-[350px] cursor-default">
                                <div className="th-content">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input
                                            type="checkbox"
                                            ref={headerCheckboxRef}
                                            onChange={() => { handleSelectAllVisible() }}
                                            aria-label="Select all visible"
                                        />
                                        <div
                                            onClick={() => handleSort(activeTab)}
                                            className='cursor-pointer'
                                            style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                                            <span className="th-label" style={{ textTransform: 'capitalize', fontWeight: 600 }}>{activeTab}</span>
                                            <button
                                                type="button"
                                                className={`sort-btn ${sortColumn === activeTab ? 'active' : ''}`}
                                            >
                                                <FaSort size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </th>

                            {tabColumnList?.[activeTab]?.slice(1)?.map((b, idx) => (
                                <th key={"th-" + b?.value + idx} className="week-header !min-w-[350px] !max-w-[350px] cursor-default">
                                    <div className="th-content" style={{ justifyContent: 'flex-start' }}>
                                        <div
                                            onClick={() => handleSort(b.value)}
                                            className="week-label cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                                            <span className="th-label">{b?.title}</span>
                                            <button
                                                type="button"
                                                className={`sort-btn ${sortColumn === b.value ? 'active' : ''}`}
                                            >
                                                <FaSort size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </th>
                            ))}
                            {dynamicColumns?.slice(1)?.map((column, index) => (
                                <>
                                    <th key={column.key + index} className="week-header !min-w-[200px] !max-w-[200px] cursor-default">
                                        <div className="th-content" style={{ justifyContent: 'flex-start' }}>
                                            <div
                                                onClick={() => handleSort(column.key)}
                                                className="week-label cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                                                <span className="th-label">{column.label}</span>
                                                <button
                                                    type="button"
                                                    className={`sort-btn ${sortColumn === column.key ? 'active' : ''}`}
                                                >
                                                    <FaSort size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </th>
                                    {((selectedMetric ?? "osa") == "osa" && allow_nd_osa && tabColumnList?.[activeTab]?.filter(item => item.value == "sku_id").length > 0) ?
                                        <th key={column.key + "nd_osa" + index} className="week-header !min-w-[250px] !max-w-[250px] cursor-default">
                                            <div className='flex items-center justify-between w-full'>

                                                <div className="th-content" style={{ justifyContent: 'flex-start' }}>
                                                    <div
                                                        onClick={() => handleSort(`${column.key}@nd_osa`)}
                                                        className="week-label cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                                                        <span className="th-label">{column.label} ND (OSA)</span>
                                                        <button
                                                            type="button"
                                                            className={`sort-btn ${sortColumn === `${column.key}@nd_osa` ? 'active' : ''}`}
                                                        >
                                                            <FaSort size={12} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <InfoTooltip text="Regardless of the date range selected, ND (OSA) will showcase just the latest week's data at an SKU-level." position="left" />
                                            </div>
                                        </th> : <></>
                                    }
                                    {((selectedMetric ?? "osa") == "osa" && allow_nestle_nd_osa_darkstore_coverage && tabColumnList?.[activeTab]?.filter(item => item.value == "sku_id").length > 0) ?
                                        <th key={column.key + "nestle_nd_osa_darkstore_coverage" + index} className="week-header !min-w-[350px] !max-w-[350px] cursor-default">
                                            <div className='flex items-center justify-between w-full'>

                                                <div className="th-content" style={{ justifyContent: 'flex-start' }}>
                                                    <div
                                                        onClick={() => handleSort(`${column.key}@nestle_nd_osa_darkstore_coverage`)}
                                                        className="week-label cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                                                        <span className="th-label">{column.label} ND (Dark Store Coverage)</span>
                                                        <button
                                                            type="button"
                                                            className={`sort-btn ${sortColumn === `${column.key}@nestle_nd_osa_darkstore_coverage` ? 'active' : ''}`}
                                                        >
                                                            <FaSort size={12} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <InfoTooltip text="Regardless of the date range selected, ND (Dark Store Coverage) will showcase just the latest week's data at an SKU-level." position="left" />
                                            </div>
                                        </th> : <></>
                                    }
                                </>
                            ))}
                        </tr>
                    </thead>

                    <tbody className='table-body' style={{ height: totalRows * rowHeight, position: 'relative' }}>
                        {visibleRows.map((product, idx) => (
                            <tr key={product.id} className={selectedProducts.has(product?.[activeTab]?.value) ? 'selected' : ''}
                                style={{
                                    position: "absolute",

                                    top: (startIndex + idx) * rowHeight,
                                    height: rowHeight,
                                    display: "table",
                                    minWidth: "100%",
                                    tableLayout: "fixed",
                                }}
                            >
                                <td className="group product-cell sticky-first-column-body !min-w-[350px] !max-w-[350px] !align-middle py-0"
                                >
                                    <div className="product-info flex flex-row  block"
                                        style={{
                                            width: '250px',
                                            minWidth: '250px',
                                            maxWidth: '250px',
                                        }}>
                                        {product?.main == true ?
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.has(product?.[activeTab]?.value)}
                                                onChange={(e) => handleProductSelect(product?.[activeTab]?.value, e.target.checked)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="product-checkbox"
                                            />

                                            : <></>}
                                        {(product?.main == true || (sortColumn != activeTab)) ?
                                            <label className='block' title={(product?.[activeTab]?.value ?? "-")?.length > 20 ? product?.[activeTab]?.value ?? "-" : ""}>
                                                <div className="product-row">
                                                    {activeTab === "product" && totalDataCount?.[activeTab]?.find(i => i?.value === product?.[activeTab]?.value)?.pdp_image_url ? (
                                                        <img
                                                            src={totalDataCount[activeTab].find(i => i?.value === product?.[activeTab]?.value)?.pdp_image_url}
                                                            alt={product?.[activeTab]?.value}
                                                            className="product-image !object-contain"
                                                        />
                                                    ) : null}

                                                    {activeTab === "platform" && pf_images?.[product?.[activeTab]?.value?.toLocaleLowerCase()] ? (
                                                        <img
                                                            src={pf_images[product?.[activeTab]?.value?.toLocaleLowerCase()]}
                                                            alt={product?.[activeTab]?.value}
                                                            className="product-image !object-contain"
                                                        />
                                                    ) : null}
                                                    <p className="flex justify-start">
                                                        <span
                                                            className="product-name"
                                                        >
                                                            {(product?.[activeTab]?.value ?? "-")?.length > 20 ? `${(product?.[activeTab]?.value ?? "-")?.substring(0, 20)}...` : (product?.[activeTab]?.value ?? "-")}
                                                        </span>
                                                        {product?.[activeTab]?.value &&
                                                            <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, product?.[activeTab]?.value) }}> <IoMdCopy /></span>
                                                        }
                                                    </p>

                                                </div>

                                            </label>
                                            // <CustomTooltip title={product?.[activeTab]?.value ?? "-"} placement="right">
                                            //     <div className="product-row">
                                            //         {activeTab === "product" && totalDataCount?.[activeTab]?.find(i => i?.value === product?.[activeTab]?.value)?.pdp_image_url ? (
                                            //             <img
                                            //                 src={totalDataCount[activeTab].find(i => i?.value === product?.[activeTab]?.value)?.pdp_image_url}
                                            //                 alt={product?.[activeTab]?.value}
                                            //                 className="product-image"
                                            //             />
                                            //         ) : null}

                                            //         {activeTab === "platform" && pf_images?.[product?.[activeTab]?.value?.toLocaleLowerCase()] ? (
                                            //             <img
                                            //                 src={pf_images[product?.[activeTab]?.value?.toLocaleLowerCase()]}
                                            //                 alt={product?.[activeTab]?.value}
                                            //                 className="product-image"
                                            //             />
                                            //         ) : null}

                                            //         <span
                                            //             className="product-name"
                                            //         >
                                            //             {product?.[activeTab]?.value ?? "-"}
                                            //         </span>
                                            //     </div>

                                            // </CustomTooltip>
                                            : <></>}

                                    </div>
                                </td>

                                {tabColumnList?.[activeTab]?.map(i => i?.value)?.slice(1)?.map((b) => (
                                    <td key={"col-" + b + idx} className="group percentage-cell !min-w-[350px] !max-w-[350px] !align-middle">
                                        {product?.main == true || product?.[b]?.value == undefined ?
                                            <label className='flex justify-start'>
                                                <span>All</span>
                                                <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, (product?.[b]?.value ? product?.[b]?.value : "All")) }}> <IoMdCopy /></span>
                                            </label> :
                                            <label className='block' title={(product?.[b]?.value ?? "-")?.length > 20 ? product?.[b]?.value ?? "-" : ""}>
                                                <div className="product-row">
                                                    {b === "product" && totalDataCount?.[b]?.find(i => i?.value === product?.[b]?.value)?.pdp_image_url ? (
                                                        <img
                                                            src={totalDataCount[b].find(i => i?.value === product?.[b]?.value)?.pdp_image_url}
                                                            alt={product?.[b]?.value}
                                                            className="product-image !object-contain"
                                                        />
                                                    ) : null}

                                                    {/* Platform image for 'platform' tab */}
                                                    {b === "platform" && pf_images?.[product?.[b]?.value?.toLocaleLowerCase()] ? (
                                                        <img
                                                            src={pf_images[product?.[b]?.value?.toLocaleLowerCase()]}
                                                            alt={product?.[b]?.value}
                                                            className="product-image !object-contain"
                                                        />
                                                    ) : null}

                                                    <p className="flex justify-start">
                                                        <span
                                                            className="product-name"
                                                        >
                                                            {(product?.[b]?.value ?? "-")?.length > 20 ? `${(product?.[b]?.value ?? "-")?.substring(0, 20)}...` : (product?.[b]?.value ?? "-")}
                                                        </span>
                                                        {product?.[b]?.value &&
                                                            <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, product?.[b]?.value) }}> <IoMdCopy /></span>
                                                        }
                                                    </p>
                                                </div>

                                            </label>
                                            // <CustomTooltip title={product?.[b]?.value ?? "-"} placement="right">
                                            //     <div className="product-row">
                                            //         {b === "product" && totalDataCount?.[b]?.find(i => i?.value === product?.[b]?.value)?.pdp_image_url ? (
                                            //             <img
                                            //                 src={totalDataCount[b].find(i => i?.value === product?.[b]?.value)?.pdp_image_url}
                                            //                 alt={product?.[b]?.value}
                                            //                 className="product-image"
                                            //             />
                                            //         ) : null}

                                            //         {/* Platform image for 'platform' tab */}
                                            //         {b === "platform" && pf_images?.[product?.[b]?.value?.toLocaleLowerCase()] ? (
                                            //             <img
                                            //                 src={pf_images[product?.[b]?.value?.toLocaleLowerCase()]}
                                            //                 alt={product?.[b]?.value}
                                            //                 className="product-image"
                                            //             />
                                            //         ) : null}
                                            //         <span
                                            //             className="product-name"
                                            //         >
                                            //             {product?.[b]?.value ?? "-"}
                                            //         </span>
                                            //     </div>

                                            // </CustomTooltip>
                                        }
                                    </td>
                                ))}
                                {dynamicColumns?.slice(1)?.map((column) => (
                                    <>
                                        <td key={column.key + "body"} className="group percentage-cell !min-w-[200px] !max-w-[200px] !align-middle">
                                            <p className='flex justify-start'>
                                                <span className="percentage">{showVal(product?.[column.key]?.value)}</span>
                                                {
                                                    (showVal(product?.[column.key]?.value) && getTextFromReactNode(showVal(product?.[column.key]?.value)) !== "0%") &&
                                                    <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showVal(product?.[column.key]?.value))) }}> <IoMdCopy /></span>
                                                }
                                            </p>
                                        </td>
                                        {((selectedMetric ?? "osa") == "osa" && allow_nd_osa && tabColumnList?.[activeTab]?.filter(item => item.value == "sku_id").length > 0) ?

                                            <td key={column.key + "body" + "nd_osa"} className="group percentage-cell !min-w-[250px] !max-w-[250px] !align-middle">
                                                <div className="flex h-full">
                                                    <span className="percentage block self-center">{product?.[column.key]?.nd_osa ?? "-"}</span>
                                                    {
                                                        product?.[column.key]?.nd_osa &&
                                                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(product?.[column.key]?.nd_osa)) }}> <IoMdCopy /></span>
                                                    }
                                                </div>
                                            </td> : <></>
                                        }

                                        {((selectedMetric ?? "osa") == "osa" && allow_nestle_nd_osa_darkstore_coverage && tabColumnList?.[activeTab]?.filter(item => item.value == "sku_id").length > 0) ?

                                            <td key={column.key + "body" + "nestle_nd_osa_darkstore_coverage"} className="group percentage-cell !min-w-[350px] !max-w-[350px] !align-middle">
                                                <div className="flex h-full">
                                                    <span className="percentage block self-center">{product?.[column.key]?.nestle_nd_osa_darkstore_coverage ?? "-"}</span>
                                                    {
                                                        product?.[column.key]?.nestle_nd_osa_darkstore_coverage &&
                                                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(product?.[column.key]?.nestle_nd_osa_darkstore_coverage)) }}> <IoMdCopy /></span>
                                                    }
                                                </div>
                                            </td> : <></>
                                        }
                                    </>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                    <tfoot className='table-footer sticky-footer'>
                        <tr>
                            <td className="group product-cell sticky-first-column-footer !min-w-[350px] !max-w-[350px] py-1">
                                <div>
                                    <div style={{ color: '#374151', fontWeight: 500 }}>Total {activeTab}</div>
                                    <div style={{ fontWeight: 600 }}>
                                        <p className='flex justify-start'>
                                            <span>
                                                {footerData?.[activeTab]?.value}
                                            </span>
                                            <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, footerData?.[activeTab]?.value ?? "-") }}> <IoMdCopy /></span>
                                        </p>
                                    </div>
                                </div>
                            </td>
                            {tabColumnList?.[activeTab]?.slice(1)?.map((b, idx) => (
                                <td key={"footer-b-" + idx} className="group product-cell !min-w-[350px] !max-w-[350px] py-1">
                                    <div>
                                        <div style={{ color: '#374151', fontWeight: 500 }}>Total {b?.title}</div>
                                        <div style={{ fontWeight: 600 }}>
                                            <p className='flex justify-start'>
                                                <span>
                                                    {footerData?.[b?.value]?.value}
                                                </span>
                                                <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, footerData?.[b?.value]?.value ?? "-") }}> <IoMdCopy /></span>
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            ))}
                            {dynamicColumns?.slice(1)?.map((column) => (
                                // <td key={column.key} className="percentage-cell">
                                //     <div>
                                //         <div style={{ color: '#374151', fontWeight: 500 }}>{kpiInfo?.label ?? kpiInfo?.title} - {column.label}</div>
                                //         <div style={{ fontWeight: 600 }}>{showVal(footerData?.[column.key]?.value)}</div>
                                //     </div>
                                // </td>
                                <>
                                    <td key={column.key + "footer"} className="group percentage-cell !min-w-[200px] !max-w-[200px] py-1">
                                        {(() => {
                                            const renderedValue = showVal(footerData?.[column.key]?.value);
                                            const copyValue = getTextFromReactNode(renderedValue);

                                            return (
                                                <div className="flex flex-col gap-1">
                                                    <div>
                                                        Avg {(kpiInfo?.label ?? kpiInfo?.title)?.replace("Avg", "")} <br />
                                                    </div>

                                                    <div style={{ fontWeight: 600 }}>
                                                        <p className="flex justify-start items-center gap-1">
                                                            <span>{renderedValue}</span>

                                                            {copyValue && (
                                                                <span
                                                                    className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center"
                                                                    onClick={(e) => copyToClipboard(e, copyValue)}
                                                                >
                                                                    <IoMdCopy />
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    {((selectedMetric ?? "osa") == "osa" && allow_nd_osa && tabColumnList?.[activeTab]?.filter(item => item.value == "sku_id").length > 0) ?

                                        <td key={column.key + "footer" + "nd_osa"} className="group percentage-cell !min-w-[250px] !max-w-[250px] py-1">
                                            <div className='flex flex-col gap-1'>
                                                {/* <div style={{ color: '#374151', fontWeight: 500 }}>{kpiInfo?.label ?? kpiInfo?.title} - {column.label}</div> */}
                                                <div >
                                                    Avg ND (OSA) <br />
                                                    {/* ({column.label}) */}
                                                </div>
                                                <div style={{ fontWeight: 600 }} className='flex justify-start'>
                                                    <span>
                                                        {footerData?.[column.key]?.nd_osa ?? "-"}
                                                    </span>
                                                    {footerData?.[column.key]?.nd_osa && (
                                                        <span
                                                            className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center"
                                                            onClick={(e) => copyToClipboard(e, footerData?.[column.key]?.nd_osa ?? "-")}
                                                        >
                                                            <IoMdCopy />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td> : <></>
                                    }
                                    {((selectedMetric ?? "osa") == "osa" && allow_nestle_nd_osa_darkstore_coverage && tabColumnList?.[activeTab]?.filter(item => item.value == "sku_id").length > 0) ?

                                        <td key={column.key + "footer" + "nestle_nd_osa_darkstore_coverage"} className="group percentage-cell !min-w-[350px] !max-w-[350px] py-1">
                                            <div className='flex flex-col gap-1'>
                                                {/* <div style={{ color: '#374151', fontWeight: 500 }}>{kpiInfo?.label ?? kpiInfo?.title} - {column.label}</div> */}
                                                <div >
                                                    Avg ND (Dark Store Coverage) <br />
                                                    {/* ({column.label}) */}
                                                </div>
                                                <div style={{ fontWeight: 600 }} className='flex justify-start'>
                                                    <span>
                                                        {footerData?.[column.key]?.nestle_nd_osa_darkstore_coverage ?? "-"}
                                                    </span>
                                                    {footerData?.[column.key]?.nestle_nd_osa_darkstore_coverage && (
                                                        <span
                                                            className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center"
                                                            onClick={(e) => copyToClipboard(e, footerData?.[column.key]?.nestle_nd_osa_darkstore_coverage ?? "-")}
                                                        >
                                                            <IoMdCopy />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td> : <></>
                                    }
                                </>


                            ))}
                        </tr>
                    </tfoot>
                </table>
            </div>

            {customizeInfo.isOpen && (
                <CustomizeCampiagnModal
                    isWidget={true}
                    kpi={kpi}
                    selectedTabName={activeTab}
                    closePopup={closeCustomizePopup}
                    tabColumnList={tabColumnList}
                    setTabColumnList={setTabColumnList}
                    isSaveViewVisible={false}
                    initCustomizeColumns={initCustomizeColumns}
                />
            )}
        </div>
    );
};

export default TrendAnalysisTable;
