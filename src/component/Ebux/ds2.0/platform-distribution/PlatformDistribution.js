import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { FaSort } from "react-icons/fa";
import Excel from "exceljs";
import _ from 'lodash';
import { useEbuxContext } from "../../Context/EbuxProvider";
import { FILTERACTION, searchFilterArr } from "../../common-components/MultiFilter/FilterConstant";
import LoaderSpinner from "../../../common-components/loader-spinner";
import { fetchPlatformDistributionData, fetchPlatformDistributionFooterData } from "./service/service";
import CustomizeCampiagnModal from "../../common-components/CustomizeCampiangn";
import ComprehenisiveFilterPlatform from "./filter/ComprehenisiveFilterPlatform";

const isShowDummyData = false;
const dummyData = (!isShowDummyData) ? [] : [
    { platform: "Amazon", brand: "Colgate", category: "Electronics", platformId: "PLAT002", productName: "Amazon FBA", status: "Active" },
    { platform: "Zepto", brand: "Palmolive", category: "Groceries", platformId: "PLAT003", productName: "Zepto Express", status: "Inactive" },
    { platform: "Blinkit", brand: "Colgate", category: "FMCG", platformId: "PLAT004", productName: "Blinkit Hyper", status: "Active" },
    { platform: "Flipkart", brand: "Palmolive", category: "Fashion", platformId: "PLAT005", productName: "Flipkart Plus", status: "Pending" },
    { platform: "BigBasket", brand: "Colgate", category: "Groceries", platformId: "PLAT007", productName: "BigBasket Daily", status: "Inactive" },
    { platform: "Nykaa", brand: "Brand G", category: "Beauty", platformId: "PLAT008", productName: "Nykaa Luxe", status: "Active" },
    { platform: "BigBasket", brand: "Brand F", category: "Groceries", platformId: "PLAT007", productName: "BigBasket Daily", status: "Inactive" },
    { platform: "BigBasket", brand: "Brand F", category: "Groceries", platformId: "PLAT007", productName: "BigBasket Daily", status: "Inactive" },
    { platform: "BigBasket", brand: "Brand F", category: "Groceries", platformId: "PLAT007", productName: "BigBasket Daily", status: "Inactive" },
];

function PlatformDistribution({ data = {}, setSelectedRows, selectedRows }) {
    const { kpi, clientCustomizeColumnsComprehensiveBreakdown } = useEbuxContext();
    const kpicol = (clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => (i?.allowInWidget && (i?.allowKPI?.indexOf(kpi) > -1) && (!i?.value?.includes("competition_")) && (["previous_osa", "last_month_sale"]?.indexOf(i?.key) == -1)))?.map(i => ({ ...i, label: i?.title, id: i?.value, checked: ((i?.kpi?.indexOf(kpi) > -1) || ((!i?.isDisabled) && (data?.visibleMatrix?.length) && (data?.visibleMatrix?.findIndex(v => v?.value == i?.value) > -1))), disabled: i?.isDisabled })));

    return (
        <div>
            <PerformanceTable kpicol={kpicol} data={data} setSelectedRows={setSelectedRows} selectedRows={selectedRows} selectedDates={selectedRows?.selectedDates || []} />
        </div>
    )
}

const PerformanceTable = ({ kpicol, data = {}, selectedDates = [], selectedRows }) => {
    const { kpi, selectedFilters, filters } = useEbuxContext();
    const pf_images = filters?.platform?.reduce((map, i) => { map[i.label?.toLowerCase()] = i.platform_description ?? ""; return map; }, {});

    // Initialize tabColumnList from localStorage
    const initTabColumnList = localStorage.getItem(`${kpi}_platform_distribution`) ? JSON.parse(localStorage.getItem(`${kpi}_platform_distribution`)) : {
        "comprehensive": [
            {
                "persentageValue": false,
                "title": "Platform",
                "type": "breakdown",
                "value": "platform",
                "key": "platform",
                "breakdown": "",
                "allowKPI": ["OSA", "CS", "PRO", "RR", "SOS", "OR", "SOD"],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "isDisabled": true,
                "remove": false,
                "drag": true,
                "align": "left",
            },
            {
                "persentageValue": false,
                "title": "Brand",
                "type": "breakdown",
                "value": "brand",
                "key": "brand",
                "breakdown": "",
                "allowKPI": ["OSA", "CS", "PRO", "RR", "SOS", "OR", "SOD"],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "isDisabled": true,
                "remove": false,
                "drag": true,
                "align": "left",
            },
            {
                "persentageValue": false,
                "title": "Category",
                "type": "breakdown",
                "value": "category",
                "key": "category",
                "breakdown": "",
                "allowKPI": ["OSA", "CS", "PRO", "RR", "SOS", "OR", "SOD"],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "isDisabled": true,
                "remove": false,
                "drag": true,
                "align": "left",
            },
            {
                "persentageValue": false,
                "title": "Platform ID",
                "type": "breakdown",
                "value": "platformId",
                "key": "platformId",
                "breakdown": "",
                "allowKPI": ["OSA", "CS", "PRO", "RR", "SOS", "OR", "SOD"],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "isDisabled": true,
                "remove": false,
                "drag": true,
                "align": "left",
            },
            {
                "persentageValue": false,
                "title": "Product Name",
                "type": "breakdown",
                "value": "productName",
                "key": "productName",
                "breakdown": "",
                "allowKPI": ["OSA", "CS", "PRO", "RR", "SOS", "OR", "SOD"],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "isDisabled": true,
                "remove": false,
                "drag": true,
                "align": "left",
            },
            {
                "persentageValue": false,
                "title": "Status",
                "type": "breakdown",
                "value": "status",
                "key": "status",
                "breakdown": "",
                "allowKPI": ["OSA", "CS", "PRO", "RR", "SOS", "OR", "SOD"],
                "notAllowWithIsValueIn": [],
                "allowWithIsValueIn": [],
                "isDisabled": true,
                "remove": false,
                "drag": true,
                "align": "left",
            }
        ]
    };

    const [tabColumnList, setTabColumnList] = useState(initTabColumnList);
    const [selectedTabName] = useState("comprehensive");
    const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });

    // Save to localStorage when tabColumnList changes
    useEffect(() => {
        localStorage.setItem(`${kpi}_platform_distribution`, JSON.stringify(tabColumnList));
    }, [tabColumnList, kpi]);

    // Define the base columns structure
    const baseColumns = [
        {
            key: "platform",
            value: "platform",
            label: "Platform",
            sortable: true,
            align: "left",
            type: "breakdown"
        },
        {
            key: "brand",
            value: "brand",
            label: "Brand",
            sortable: true,
            align: "left",
            type: "breakdown"
        },
        {
            key: "category",
            value: "category",
            label: "Category",
            sortable: true,
            align: "left",
            type: "breakdown"
        },
        {
            key: "platformId",
            value: "platformId",
            label: "Platform ID",
            sortable: true,
            align: "left",
            type: "breakdown"
        },
        {
            key: "productName",
            value: "productName",
            label: "Product Name",
            sortable: true,
            align: "left",
            type: "breakdown"
        },
        {
            key: "status",
            value: "status",
            label: "Status",
            sortable: true,
            align: "left",
            type: "breakdown"
        }
    ];

    // Get ordered columns based on saved configuration
    const getOrderedColumns = () => {
        const orderedColumnConfigs = tabColumnList[selectedTabName] || [];

        if (orderedColumnConfigs.length > 0) {
            const columnsMap = new Map(baseColumns.map(col => [col.value, col]));

            return orderedColumnConfigs.map(config => {
                const existingCol = columnsMap.get(config.key);
                if (existingCol) {
                    return existingCol;
                }
                return {
                    ...config,
                    label: config.title,
                    align: config?.align ?? "left",
                    sortable: true,
                };
            });
        }

        return baseColumns;
    };

    const orderedColumns = getOrderedColumns();

    const [apiResponse, setApiResponse] = useState({});
    const { rowData, footerData } = useMemo(() => {
        if (apiResponse?.rowData || apiResponse?.footerData) {
            const { rowData, footerData } = apiResponse;
            return {
                rowData: rowData || [],
                footerData: footerData || {}
            };
        } else {
            return {
                rowData: apiResponse,
                footerData: {}
            };
        }
    }, [JSON.stringify(apiResponse)]);

    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
        }));
    };

    const getSortedRows = (rows = []) => {
        if (!sortConfig.key || !rows) return rows;

        return [...rows].sort((a, b) => {
            let aValue, bValue;

            // Handle text columns
            if (['platform', 'brand', 'category', 'platformId', 'productName', 'status'].includes(sortConfig.key)) {
                aValue = a[sortConfig.key] || "";
                bValue = b[sortConfig.key] || "";
            } else {
                aValue = a[sortConfig.key]?.value || 0;
                bValue = b[sortConfig.key]?.value || 0;
            }

            if (typeof aValue === 'string') {
                const comparison = aValue.localeCompare(bValue);
                return sortConfig.direction === "asc" ? comparison : -comparison;
            }

            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        });
    };

    const getHeaderIcon = (icon) => {
        switch (icon) {
            case "rupee":
                return "₹ ";
            default:
                return (icon) ? icon + " " : "";
        }
    }

    const showValue = (col, value) => {
        return <>{value != undefined && col?.icon ? getHeaderIcon(col?.icon) : ""}{value}{value != undefined && col?.subValue ? col?.subValue : ""}{value != undefined && col?.persentageValue ? "%" : ""}</>
    }

    const renderCell = (col, metric) => (
        <div className="flex items-center justify-left gap-1">
            {
                (metric || (metric != undefined && col?.value == "osa")) ? <span className="font-medium">{showValue(col, metric)}</span> : <>-</>
            }
        </div>
    );

    // Customize modal handlers
    const handleCustomizeClick = () => {
        setCustomizeInfo(prev => ({ isOpen: !prev.isOpen, column: '' }));
    };

    const closeCustomizePopup = () => {
        setCustomizeInfo({ isOpen: false, column: null });
    };

    // Rest of your existing code remains the same...
    const [breakdownFilters, setBreakdownFilters] = useState({});
    const selectAllRef = useRef(null);
    const [searchFilterArray, setSearchFilterArray] = useState(searchFilterArr);
    const [additionalFilter, setAdditionalFilter] = useState([]);

    // ---- Sliding-window 
    const WINDOW_SIZE = 2500;
    const CHUNK_SIZE = 500;
    const DEFAULT_LIMIT = 10000;

    const TRIGGER_INDEX_DOWN = 2000;
    const TRIGGER_INDEX_UP = 1000;

    const [startIndex, setStartIndex] = useState(0);
    const [isLazyLoading, setIsLazyLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // refs for flags / sync
    const tableRef = useRef(null);
    const scrollRef = useRef(null);
    const lastScrollTopRef = useRef(0);

    const isLazyLoadingRef = useRef(false);
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const startIndexRef = useRef(startIndex);
    const fetchingDirectionRef = useRef({ up: false, down: false });

    // keep these effects to sync refs with state
    useEffect(() => { isLazyLoadingRef.current = isLazyLoading; }, [isLazyLoading]);
    useEffect(() => { loadingRef.current = loading; }, [loading]);
    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
    useEffect(() => { startIndexRef.current = startIndex; }, [startIndex]);

    useEffect(() => {
        setStartIndex(0)
    }, [])

    const fetchData = async (start = 0, customLimit = null) => {
        try {
            if (start === 0) setLoading(true);
            else setIsLazyLoading(true);

            const performanceOf = data?.performanceOf ?? 'brand';
            const matrixColumns = kpicol?.filter(i => i?.checked)?.map(column => column.value) || [];

            const payload = {
                kpi,
                start,
                limit: customLimit ?? DEFAULT_LIMIT,
                // Use orderedColumns for breakdown instead of hardcoded values
                breakdown: orderedColumns.map(col => col.value),
                matrix: matrixColumns,
                key: performanceOf,
                value: data?.value ?? "",
                selectedFilters,
                filters,
                breakdownFilters,
                sortConfig,
                selectedTableRows: {
                    selectedDates: (selectedRows?.selectedDates || [])?.map(i => i?.date) ?? [],
                    selectedLocation: (selectedRows?.selectedLocation || [])?.map(i => i?.location) ?? [],
                    selectedPlatform: (selectedRows?.selectedPlatform || [])?.map(i => i?.platform) ?? [],
                    selectedProduct: (selectedRows?.selectedProduct || [])?.map(i => i?.skuId) ?? [],
                    selectedKeyword: (selectedRows?.selectedKeyword || [])?.map(i => i?.keyword) ?? []
                }
            };

            const response = await fetchPlatformDistributionData(payload);
            const footerRows = await fetchPlatformDistributionFooterData(payload);

            const fetchedRows = response?.rowData ?? [];

            if (!fetchedRows.length) {
                setHasMore(false);
            }

            setApiResponse((prev) => {
                const prevRows = prev?.rowData ? prev.rowData : (Array.isArray(prev) ? prev : (prev?.rowData ?? []));
                const prevFooter = prev?.footerData || {};

                if (start === 0 || !prevRows?.length) {
                    return {
                        ...response,
                        rowData: fetchedRows,
                        footerData: footerRows || {}
                    };
                } else {
                    const merged = [...prevRows, ...fetchedRows];
                    if (merged.length > WINDOW_SIZE * 2) {
                        return {
                            ...prev,
                            rowData: merged.slice(merged.length - WINDOW_SIZE * 2),
                            footerData: footerRows || prevFooter
                        };
                    }
                    return {
                        ...prev,
                        rowData: merged,
                        footerData: footerRows || prevFooter
                    };
                }
            });

            return fetchedRows;
        } catch (error) {
            console.error("Error in fetchData:", error);
            return [];
        } finally {
            setLoading(false);
            setIsLazyLoading(false);
        }
    };

    useEffect(() => {
        const loadInitial = async () => {
            setStartIndex(0);
            startIndexRef.current = 0;
            setIsLazyLoading(true);
            try {
                await fetchData(0, WINDOW_SIZE);
                setHasMore(true);
            } catch (err) {
                console.error("initial load error", err);
            } finally {
                setIsLazyLoading(false);
            }
        };

        loadInitial();
    }, [JSON.stringify(selectedFilters), JSON.stringify(breakdownFilters), JSON.stringify(sortConfig), JSON.stringify(orderedColumns)]);

    useEffect(() => {
        if (selectAllRef.current) {
            const currentData = (rowData?.length ? rowData : dummyData) || [];
            selectAllRef.current.indeterminate =
                (selectedDates?.length || 0) > 0 && (selectedDates?.length || 0) < currentData.length;
        }
    }, [selectedDates, ((rowData?.length ? rowData : dummyData) || []).length]);

    const handleDownload = async () => {
        const currentData = (rowData?.length ? rowData : dummyData) || [];

        if (currentData.length === 0) {
            alert("No data available to download");
            return;
        }

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Performance Data");

        // Create headers from ordered columns
        const headers = orderedColumns.map(col => col.label);
        worksheet.addRow(headers);

        // Add data rows
        currentData.forEach((row) => {
            const values = orderedColumns.map(col => {
                if (['platform', 'brand', 'category', 'platformId', 'productName', 'status'].includes(col.value)) {
                    return row[col.value] || "-";
                }
                else if (col.type === "parameters" || col.type === "breakdown") {
                    const value = row[col.value];

                    if (value && typeof value === 'object' && 'value' in value) {
                        return value.value ?? "-";
                    } else {
                        return value ?? "-";
                    }
                }
                return "-";
            });

            worksheet.addRow(values);
        });

        try {
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `platform_distribution_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Error downloading file. Please try again.");
        }
    };

    const fetchAndShiftDown = async () => {
        const el = scrollRef.current;
        if (!el) return;
        if (isLazyLoadingRef.current || loadingRef.current || fetchingDirectionRef.current.down) return;
        if (!hasMoreRef.current) return;
        fetchingDirectionRef.current.down = true;
        setIsLazyLoading(true);
        try {
            const tbody = tableRef.current?.querySelector("tbody");
            let removedHeight = 0;
            if (tbody) {
                const trs = Array.from(tbody.querySelectorAll("tr")).slice(0, CHUNK_SIZE);
                removedHeight = trs.reduce((acc, tr) => acc + tr.getBoundingClientRect().height, 0);
            }
            const prevScrollTop = el.scrollTop;

            const fetchStart = startIndexRef.current + WINDOW_SIZE;
            const matrixColumns = kpicol?.filter(i => i?.checked)?.map(column => column.value) || [];

            const payload = {
                kpi,
                start: fetchStart,
                limit: CHUNK_SIZE,
                breakdown: orderedColumns.map(col => col.value),
                matrix: matrixColumns,
                key: data?.performanceOf ?? 'brand',
                value: data?.value ?? "",
                selectedFilters, filters,
                breakdownFilters,
                selectedTableRows: {
                    selectedDates: (selectedRows?.selectedDates || [])?.map(i => i?.date) ?? [],
                    selectedLocation: (selectedRows?.selectedLocation || [])?.map(i => i?.location) ?? [],
                    selectedPlatform: (selectedRows?.selectedPlatform || [])?.map(i => i?.platform) ?? [],
                    selectedProduct: (selectedRows?.selectedProduct || [])?.map(i => i?.skuId) ?? [],
                    selectedKeyword: (selectedRows?.selectedKeyword || [])?.map(i => i?.keyword) ?? []
                }
            };

            const response = await fetchPlatformDistributionData(payload);
            const footerRows = await fetchPlatformDistributionFooterData(payload);
            const newRows = response?.rowData ?? [];

            if (!newRows?.length) {
                setHasMore(false);
                return;
            }

            setApiResponse((prev) => {
                const prevRows = prev?.rowData ? prev.rowData : (Array.isArray(prev) ? prev : (prev?.rowData ?? []));
                const afterRemoval = prevRows.slice(CHUNK_SIZE);
                const appended = [...afterRemoval, ...newRows];
                return {
                    ...prev,
                    rowData: appended,
                    footerData: footerRows || prev?.footerData || {}
                };
            });

            const newStart = startIndexRef.current + CHUNK_SIZE;
            startIndexRef.current = newStart;
            setStartIndex(newStart);

            setTimeout(() => {
                try {
                    const adjusted = Math.max(0, prevScrollTop - removedHeight);
                    el.scrollTop = adjusted;
                } catch (e) {
                    console.warn("fetchAndShiftDown scroll adjust failed", e);
                }
            }, 0);
        } catch (err) {
            console.error("fetchAndShiftDown error", err);
        } finally {
            setIsLazyLoading(false);
            fetchingDirectionRef.current.down = false;
        }
    };

    const fetchAndShiftUp = async () => {
        const el = scrollRef.current;
        if (!el) return;

        if (isLazyLoadingRef.current || loadingRef.current || fetchingDirectionRef.current.up) return;
        if (startIndexRef.current <= 0) return;

        fetchingDirectionRef.current.up = true;
        setIsLazyLoading(true);

        try {
            const prevScrollTop = el.scrollTop;
            const prevScrollHeight = el.scrollHeight;

            const prevStart = Math.max(0, startIndexRef.current - CHUNK_SIZE);
            const matrixColumns = kpicol?.filter(i => i?.checked)?.map(column => column.value) || [];

            const payload = {
                kpi,
                start: prevStart,
                limit: CHUNK_SIZE,
                breakdown: orderedColumns.map(col => col.value),
                matrix: matrixColumns,
                key: data?.performanceOf ?? 'brand',
                value: data?.value ?? "",
                selectedFilters, filters,
                breakdownFilters,
                selectedTableRows: {
                    selectedDates: (selectedRows?.selectedDates || [])?.map(i => i?.date) ?? [],
                    selectedLocation: (selectedRows?.selectedLocation || [])?.map(i => i?.location) ?? [],
                    selectedPlatform: (selectedRows?.selectedPlatform || [])?.map(i => i?.platform) ?? [],
                    selectedProduct: (selectedRows?.selectedProduct || [])?.map(i => i?.skuId) ?? [],
                    selectedKeyword: (selectedRows?.selectedKeyword || [])?.map(i => i?.keyword) ?? []
                }
            };

            const response = await fetchPlatformDistributionData(payload);
            const footerRows = await fetchPlatformDistributionFooterData(payload);
            const newRows = response?.rowData ?? [];

            if (!newRows?.length) {
                return;
            }

            setApiResponse((prev) => {
                const prevRows = prev?.rowData ? prev.rowData : (Array.isArray(prev) ? prev : (prev?.rowData ?? []));
                let nextRows = [...newRows, ...prevRows];

                if (nextRows.length > CHUNK_SIZE) {
                    nextRows = nextRows.slice(0, nextRows.length - CHUNK_SIZE);
                }
                return {
                    ...prev,
                    rowData: nextRows,
                    footerData: footerRows || prev?.footerData || {}
                };
            });

            startIndexRef.current = prevStart;
            setStartIndex(prevStart);

            const adjustScrollAfterPrepend = (el, prevScrollTop, prevScrollHeight) => {
                const apply = () => {
                    try {
                        const newScrollHeight = el.scrollHeight;
                        const delta = newScrollHeight - prevScrollHeight;
                        el.scrollTop = prevScrollTop + delta;
                    } catch (err) {
                        console.warn("adjustScrollAfterPrepend failed", err);
                    }
                };
                if (typeof requestAnimationFrame !== "undefined") {
                    requestAnimationFrame(() => requestAnimationFrame(apply));
                } else {
                    setTimeout(apply, 50);
                }
            };
            adjustScrollAfterPrepend(el, prevScrollTop, prevScrollHeight);
        } catch (err) {
            console.error("fetchAndShiftUp error", err);
        } finally {
            setIsLazyLoading(false);
            fetchingDirectionRef.current.up = false;
        }
    };

    const getFirstVisibleRowIndex = () => {
        const el = scrollRef.current;
        const tbody = tableRef.current?.querySelector("tbody");
        if (!el || !tbody) return 0;
        const containerRect = el.getBoundingClientRect();
        const trs = Array.from(tbody.querySelectorAll("tr"));
        for (let i = 0; i < trs.length; i++) {
            const rect = trs[i].getBoundingClientRect();
            if (rect.bottom >= containerRect.top + 1) {
                return i;
            }
        }
        return 0;
    };

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || isLazyLoadingRef.current || loadingRef.current) return;

        const { scrollTop } = el;
        const delta = scrollTop - (lastScrollTopRef.current || 0);
        const direction = delta > 0 ? "down" : (delta < 0 ? "up" : "none");
        lastScrollTopRef.current = scrollTop;

        const firstVisibleRelativeIndex = getFirstVisibleRowIndex();
        const offsetInBuffer = firstVisibleRelativeIndex;

        //DOWN
        if (direction === "down") {
            if (offsetInBuffer < TRIGGER_INDEX_DOWN) return;

            if (!fetchingDirectionRef.current.down && hasMoreRef.current) {
                fetchAndShiftDown().catch(err => console.error(err)).finally(() => {
                    fetchingDirectionRef.current.down = false;
                });
            }
            return;
        }

        //UP
        if (direction === "up") {
            if (offsetInBuffer > TRIGGER_INDEX_UP) return;
            if (!fetchingDirectionRef.current.up && startIndexRef.current > 0) {
                fetchAndShiftUp().catch(err => console.error(err)).finally(() => {
                    fetchingDirectionRef.current.up = false;
                });
            }
            return;
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    // Update search filter array with ordered columns
    useEffect(() => {
        const columns = orderedColumns;
        if (_.size(columns)) {
            let additionalFilterObj = [];
            for (const e of columns) {
                if (e?.type == "breakdown") {
                    additionalFilterObj.push(e.value);
                }
            }
            setAdditionalFilter(additionalFilterObj)

            const tagFilter = searchFilterArray.find((ele) => ele.key === "metric");
            tagFilter.children = [];
            const updatedArray = searchFilterArray.map((ele) => {
                if (ele.key === "metric") {
                    for (const e of columns) {
                        if (e.type == "parameters") {
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
    }, [JSON.stringify(orderedColumns)]);

    const applyBreakdownFilters = (sFilters, current) => {
        setBreakdownFilters((prevFilters) => {
            return (current === "clear_filter") ? {} : { ...prevFilters, ...sFilters };
        });
    };

    const currentData = (rowData?.length ? rowData : dummyData) || [];

    // Function to get footer value for a column
    const getFooterValue = (column) => {
        if (!footerData || Object.keys(footerData).length === 0) {
            return null;
        }

        const columnKey = column.value;

        // Check if footerData has this column key
        if (footerData[columnKey] !== undefined) {
            return footerData[columnKey];
        }

        // For status column specifically, check for status object
        if (columnKey === 'status') {
            // Check if footerData has status as a nested object
            if (footerData.status && typeof footerData.status === 'object') {
                return footerData.status;
            }
            // Also check direct active/inactive properties
            if (footerData.active !== undefined || footerData.inactive !== undefined) {
                return {
                    active: footerData.active || 0,
                    inactive: footerData.inactive || 0
                };
            }
        }

        // Try to find the value by checking different formats
        if (footerData.total && footerData.total[columnKey] !== undefined) {
            return footerData.total[columnKey];
        }

        // Check if it's a breakdown column that might have a count
        if (column.type === 'breakdown' && columnKey !== 'status') {
            // Count unique values from current data as fallback
            const uniqueValues = new Set();
            currentData.forEach(row => {
                const value = row[columnKey];
                if (value !== undefined && value !== null && value !== '') {
                    uniqueValues.add(value);
                }
            });
            return uniqueValues.size;
        }

        return null;
    };

    return (
        <div className='bg-white p-4 
!rounded-2xl shadow-[0px_2px_4px_0px_#00000005,0px_1px_6px_-1px_#00000005,0px_1px_2px_0px_#00000008]'>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h4 className="text-[20px] font-semibold  text-[#000000E0]">Platform Distribution</h4>
                    {loading &&
                        <div className="flex items-center justify-center h-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                        </div>
                    }
                </div>
                <div className="flex items-center gap-2">
                    <ComprehenisiveFilterPlatform text="Filter By"
                        savedSearch={{}}
                        arr={searchFilterArray}
                        additionalFilter={additionalFilter}
                        applySearchFilter={applyBreakdownFilters}
                        handleSaveFilters={false} />
                    <div className="graphIconBtnWrap flex gap-2">
                        <button type="button" className="graphIconBtn">
                            <img src="/assets/images/downloadIcon.svg" width={22} height={22} alt="Download" onClick={handleDownload} />
                        </button>
                        {/* Add customize button back */}
                        <button type="button" className="graphIconBtn" onClick={handleCustomizeClick}>
                            <img src="/assets/images/columnsIcon.svg" className="w-[20px] h-[20px] cursor-pointer" alt="Customize" />
                        </button>
                    </div>
                </div>
            </div>
            <p className="font-inter font-normal italic text-[10px] leading-[100%] align-middle text-[#000000A6] mt-[10px]">
                {moment(selectedFilters?.selectedDateRange?.startDate ?? new Date())?.format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedDateRange?.endDate ?? new Date())?.format("DD/MM/YYYY")}
            </p>
            <div className="p-4 w-full h-[400px] flex flex-col">
                <div className="overflow-x-auto overflow-y-auto flex-1 relative"
                    ref={scrollRef}
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
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .sticky-footer {
                position: sticky;
                bottom: 0;
                z-index: 20;
                background: #F6F9FB;
                border: none;
                font-weight: 600;
                box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
              }
              .sticky-column-0 {
                position: sticky;
                left: 0;
                z-index: 15;
                background: inherit;
                border: none;
              }
              .sticky-column-header-0 {
                position: sticky;
                left: 0;
                z-index: 25;
                background: #F6F9FB;
                border: none;
                box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
              }
              .sticky-column-footer-0 {
                position: sticky;
                left: 0;
                z-index: 25;
                background: #F6F9FB;
                border: none;
                box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
              }
            `}
                    </style>
                    <table className="w-full relative text-sm sticky-table" ref={tableRef}>
                        <thead>
                            <tr>
                                {orderedColumns.map((col, colIndex) => (
                                    <th
                                        key={`header-${col.value}`}
                                        onClick={col.sortable ? () => handleSort(col.value) : undefined}
                                        className={`
                                p-4 text-sm border-none
                                ${col.sortable ? "cursor-pointer" : ""}
                                ${col.align === "left" ? "text-left" : "text-center"}
                                ${colIndex === 0 ? "sticky-column-header-0" : ""}
                                sticky-header
                            `}
                                        style={{
                                            width: 'auto',
                                            minWidth: 'auto'
                                        }}
                                    >
                                        <div className={`flex items-center ${col.align === "left" ? "justify-start" :
                                            col.align === "right" ? "justify-end" :
                                                "justify-start"
                                            }`}>
                                            <span>{col.label}</span>
                                            {col.sortable && <FaSort className="inline h-3 w-3 ml-1" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {getSortedRows(currentData).map((section, dateIndex) => {
                                const isStriped = dateIndex % 2 === 0 ? "white" : "#F9FAFA";
                                return (
                                    <tr
                                        key={`row-${dateIndex}`}
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        {orderedColumns.map((col, colIndex) => (
                                            <td
                                                key={`row-${dateIndex}-${colIndex}-${col.value}`}
                                                className={`
                                        px-4 py-2 border-none text-left
                                        ${colIndex === 0 ? "sticky-column-0" : ""}
                                    `}
                                                style={{
                                                    background: col?.value == 'status' ? (section?.[col.value] == 'Active' ? '#5bc236' : (section?.[col.value] == 'Inactive' ? '#b3b3b3' : '')) : isStriped,
                                                    color: col?.value === 'status' ? 'white' : 'black',
                                                    width: colIndex === 0 ? '250px' : '250px',
                                                    minWidth: colIndex === 0 ? '250px' : '250px',
                                                    maxWidth: '600px',
                                                    wordBreak: 'break-word',
                                                    overflowWrap: 'break-word',
                                                    whiteSpace: 'normal',
                                                    borderTopLeftRadius: colIndex === 0 ? "12px" : "0px",
                                                    borderBottomLeftRadius: colIndex === 0 ? "12px" : "0px",
                                                    textAlign: 'left',
                                                }}
                                            >
                                                {col.value === "platform" ?
                                                    <span className="flex items-center gap-2">
                                                        {pf_images?.[section?.[col.value]?.toLowerCase()] ? <img
                                                            src={pf_images?.[section?.[col.value]?.toLowerCase()]}
                                                            alt={section?.[col.value]}
                                                            className="oos-plat-img max-w-9 max-h-9 object-contain"
                                                        /> : <></>}
                                                        <span className="text-left">{(section?.[col.value] ?? '-')}</span>
                                                    </span>
                                                    :
                                                    col.value === "product_image" ?
                                                        <span className="flex items-center gap-2">
                                                            {section?.[col.value] ? <img
                                                                src={section?.[col.value]}
                                                                alt={section?.[col.value]}
                                                                className="oos-plat-img max-w-9 max-h-9 object-contain"
                                                            /> : <></>}
                                                        </span>
                                                        :
                                                        col.value && col?.type == 'breakdown' ?
                                                            <span className="text-left">{(section?.[col.value] ?? '-')}</span>
                                                            :
                                                            col.value ?
                                                                <span className="text-left">{renderCell(col, (section?.[col.value] ?? null))}</span>
                                                                :
                                                                <span className="text-left">-</span>
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                            {/* Loading spinner */}
                            {isLazyLoading && (
                                <tr>
                                    <td colSpan={orderedColumns.length} className="text-left">
                                        <div className="flex justify-center p-4">
                                            <LoaderSpinner />
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {/* Footer row showing data from API */}
                            {currentData.length > 0 && (
                                <tr className="sticky-footer">
                                    {orderedColumns.map((col, colIndex) => {
                                        const footerValue = getFooterValue(col);

                                        return (
                                            <td
                                                key={`footer-${col.value}`}
                                                className={`
                                        p-4 text-sm border-none text-left
                                        ${colIndex === 0 ? "sticky-column-footer-0" : ""}
                                        sticky-footer
                                    `}
                                                style={{
                                                    background: '#F6F9FB',
                                                    width: colIndex === 0 ? '250px' : '250px',
                                                    minWidth: colIndex === 0 ? '250px' : '250px',
                                                    maxWidth: '600px',
                                                    wordBreak: 'break-word',
                                                    overflowWrap: 'break-word',
                                                    whiteSpace: 'normal',
                                                    borderTopLeftRadius: colIndex === 0 ? "12px" : "0px",
                                                    borderBottomLeftRadius: colIndex === 0 ? "12px" : "0px",
                                                    textAlign: 'left',
                                                    paddingTop: '8px',
                                                    paddingBottom: '8px'
                                                }}
                                            >
                                                {col.value === 'status' ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-left font-medium">
                                                            Total Status
                                                        </span>
                                                        <span className="text-left font-bold mt-1">
                                                            {(() => {
                                                                // Check if footerValue is an object with active/inactive properties
                                                                if (footerValue && typeof footerValue === 'object') {
                                                                    const activeCount = footerValue.active || 0;
                                                                    const inactiveCount = footerValue.inactive || 0;

                                                                    // Build status string
                                                                    const statusParts = [];
                                                                    if (activeCount > 0) statusParts.push(`Active: ${activeCount}`);
                                                                    if (inactiveCount > 0) statusParts.push(`Inactive: ${inactiveCount}`);

                                                                    return statusParts.length > 0
                                                                        ? statusParts.join(' | ')
                                                                        : 'No status data';
                                                                } else if (footerValue !== null && footerValue !== undefined) {
                                                                    // If footerValue is not an object, just display it
                                                                    return footerValue;
                                                                } else {
                                                                    // Fallback: count status values from current data
                                                                    const statusCounts = {
                                                                        active: 0,
                                                                        inactive: 0,
                                                                        other: 0
                                                                    };

                                                                    currentData.forEach(row => {
                                                                        const status = row[col.value];
                                                                        if (status) {
                                                                            const normalizedStatus = status.toLowerCase();
                                                                            if (normalizedStatus.includes('active')) {
                                                                                statusCounts.active++;
                                                                            } else if (normalizedStatus.includes('inactive')) {
                                                                                statusCounts.inactive++;
                                                                            } else {
                                                                                // Group other statuses
                                                                                statusCounts.other++;
                                                                            }
                                                                        }
                                                                    });

                                                                    // Build status string from counts
                                                                    const statusParts = [];
                                                                    if (statusCounts.active > 0) statusParts.push(`Active: ${statusCounts.active}`);
                                                                    if (statusCounts.inactive > 0) statusParts.push(`Inactive: ${statusCounts.inactive}`);
                                                                    if (statusCounts.other > 0) statusParts.push(`Other: ${statusCounts.other}`);

                                                                    return statusParts.length > 0
                                                                        ? statusParts.join(' | ')
                                                                        : 'No status data';
                                                                }
                                                            })()}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <span className="text-left font-medium">
                                                            {(() => {
                                                                const columnName = (col.title || col.value).toLowerCase();

                                                                // Special cases
                                                                if (columnName === 'productname' || columnName === 'product_name') {
                                                                    return 'Total Products';
                                                                } else if (columnName === 'platformid' || columnName === 'platform_id') {
                                                                    return 'Total Platform IDs';
                                                                }

                                                                // Default formatting
                                                                const displayName = col.title || col.value;
                                                                return `Total ${displayName.charAt(0).toUpperCase() + displayName.slice(1)}`;
                                                            })()}
                                                        </span>
                                                        <span className="text-left font-bold mt-1">
                                                            {footerValue !== null ? footerValue : (() => {
                                                                // Fallback: count unique values
                                                                const uniqueValues = new Set();
                                                                currentData.forEach(row => {
                                                                    const value = row[col.value];
                                                                    if (value !== undefined && value !== null && value !== '') {
                                                                        uniqueValues.add(value);
                                                                    }
                                                                });
                                                                return uniqueValues.size;
                                                            })()}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Customize Columns Modal */}
            {customizeInfo.isOpen && (
                <CustomizeCampiagnModal
                    isWidget={true}
                    kpi={kpi}
                    isRemovable={true}
                    selectedTabName={selectedTabName}
                    closePopup={closeCustomizePopup}
                    tabColumnList={tabColumnList}
                    setTabColumnList={setTabColumnList}
                    isSaveViewVisible={false}
                    initCustomizeColumns={{
                        "breakdown": {
                            "title": "Breakdowns",
                            "columns": [
                                {
                                    "persentageValue": false,
                                    "title": "Platform",
                                    "type": "breakdown",
                                    "value": "platform",
                                    "key": "platform",
                                    "breakdown": "",
                                    "allowKPI": [
                                        "OSA",
                                        "CS",
                                        "PRO",
                                        "RR",
                                        "OR",
                                        "SOS",
                                    ],
                                    "notAllowWithIsValueIn": [],
                                    "allowWithIsValueIn": [],
                                    "isDisabled": false
                                },
                                {
                                    "persentageValue": false,
                                    "title": "Brand",
                                    "type": "breakdown",
                                    "value": "brand",
                                    "key": "brand",
                                    "breakdown": "Platform",
                                    "allowKPI": [
                                        "OSA",
                                        "CS",
                                        "PRO",
                                        "RR",
                                        "OR",
                                        "SOS",
                                    ],
                                    "allowInDarkStore": true,
                                    "isDisabled": false
                                },
                                {
                                    "persentageValue": false,
                                    "title": "Category",
                                    "type": "breakdown",
                                    "value": "category",
                                    "key": "category",
                                    "breakdown": "Platform",
                                    "allowKPI": [
                                        "OSA",
                                        "CS",
                                        "PRO",
                                        "RR",
                                        "OR",
                                        "SOS",
                                    ],
                                    "allowInDarkStore": true,
                                    "isDisabled": false
                                },
                                {
                                    "persentageValue": false,
                                    "title": "Platform ID",
                                    "type": "breakdown",
                                    "value": "platformId",
                                    "key": "platformId",
                                    "breakdown": "Platform",
                                    "allowKPI": [
                                        "OSA",
                                        "CS",
                                        "PRO",
                                        "RR",
                                        "OR",
                                        "SOS",
                                    ],
                                    "allowInDarkStore": true,
                                    "isDisabled": false
                                },
                                {
                                    "persentageValue": false,
                                    "title": "Product Name",
                                    "type": "breakdown",
                                    "value": "productName",
                                    "key": "productName",
                                    "breakdown": "Platform",
                                    "allowKPI": [
                                        "OSA",
                                        "CS",
                                        "PRO",
                                        "RR",
                                        "OR",
                                        "SOS",
                                    ],
                                    "allowInDarkStore": true,
                                    "isDisabled": false
                                },
                                {
                                    "persentageValue": false,
                                    "title": "Status",
                                    "type": "breakdown",
                                    "value": "status",
                                    "key": "status",
                                    "breakdown": "Platform",
                                    "allowKPI": [
                                        "OSA",
                                        "CS",
                                        "PRO",
                                        "RR",
                                        "OR",
                                        "SOS",
                                    ],
                                    "allowInDarkStore": true,
                                    "isDisabled": false
                                },
                            ]
                        }
                    }}
                />
            )}
        </div>
    );
};

export default PlatformDistribution;