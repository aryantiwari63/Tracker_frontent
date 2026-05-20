import React, { useEffect, useState } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { fetchComprehensiveBreakdownTable } from "../../../../services/ebuxMaster.service";
import CustomizeCampiagnModal from "../../../CustomizeCampiangn";
import MetricDailog from "./MetricDailog"; // adjust path if needed

export default function BeakdownTable() {
    const { selectedFilters, filters } = useEbuxContext();
    const kpi = "BUYBOX";
    const [tableData, setTableData] = useState([]);
    const [footer, setFooter] = useState(null);
    const [loading, setLoading] = useState(false);

    const [selectedTabName] = useState("comprehensive");
    const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });

    const initTabColumnList = localStorage.getItem(`${kpi}_daily_performance`)
        ? JSON.parse(localStorage.getItem(`${kpi}_daily_performance`))
        : {
            comprehensive: [
                {
                    persentageValue: false,
                    title: "Brands",
                    type: "breakdown",
                    value: "brand",
                    key: "brand",
                    breakdown: "Brand",
                    allowKPI: [kpi],
                    notAllowWithIsValueIn: [],
                    allowWithIsValueIn: [],
                    allowInDarkStore: true,
                    isDisabled: false,
                },
                {
                    persentageValue: false,
                    title: "Seller Type",
                    type: "parameters",
                    value: "seller_type",
                    key: "seller_type",
                    breakdown: "seller_type",
                    allowKPI: [kpi],
                    allowInDarkStore: true,
                    isDisabled: false,
                    remove: false,
                },
                {
                    persentageValue: false,
                    title: "Win Rate",
                    type: "parameters",
                    value: "win_rate",
                    key: "win_rate",
                    breakdown: "win_rate",
                    allowKPI: [kpi],
                    allowInDarkStore: true,
                    isDisabled: false,
                    remove: false,
                },
                {
                    persentageValue: false,
                    title: "Last Check On",
                    type: "parameters",
                    value: "last_check_on",
                    key: "last_check_on",
                    breakdown: "last_check_on",
                    allowKPI: [kpi],
                    allowInDarkStore: true,
                    isDisabled: false,
                    remove: false,
                },
            ],
        };

    const [tabColumnList, setTabColumnList] = useState(initTabColumnList);

    const columns = [
        { key: "seller_type", value: "seller_type", label: "Seller Type", align: "between", checkbox: true, sortable: true },
        { key: "win_rate", value: "win_rate", label: "Win Rate", align: "between", checkbox: true, sortable: true },
    ];

    // Modal state for Metric Dialog
    const [metricModalOpen, setMetricModalOpen] = useState(false);
    const [metricDialogObj, setMetricDialogObj] = useState(null);
    const [reopenData, setReopenData] = useState(null);

    // store most recent winRateFilter (optional)
    const [activeWinRateFilter, setActiveWinRateFilter] = useState(null);

    useEffect(() => {
        async function fetchData(winRateFilter = null) {
            try {
                setLoading(true);
                // Build breakdown array from selected columns
                const breakdown = tabColumnList?.[selectedTabName]?.filter((i) => i?.type == "breakdown")?.map((i) => i?.value) ?? [];

                // call backend; note backend expects top-level winRateFilter if present
                const payload = { filters, selectedFilters, breakdown, winRateFilter };
                const res = await fetchComprehensiveBreakdownTable(payload);

                setTableData(res?.rows || []);
                setFooter(res?.footer || null);
            } catch (err) {
                console.error("BuyBox API Error:", err);
            } finally {
                setLoading(false);
            }
        }

        // load initially with no winRateFilter (or use activeWinRateFilter if present)
        fetchData(activeWinRateFilter ?? null);
    }, [filters, selectedFilters, JSON.stringify(tabColumnList?.[selectedTabName]), activeWinRateFilter]);

    const groupedByLocation = tableData.reduce((acc, curr) => {
        if (!acc[curr.location]) acc[curr.location] = [];
        acc[curr.location].push(curr);
        return acc;
    }, {});

    useEffect(() => {
        localStorage.setItem(`${kpi}_daily_performance`, JSON.stringify(tabColumnList));
    }, [tabColumnList]);

    const handleCustomizeClick = () => {
        setCustomizeInfo((prev) => ({ isOpen: !prev.isOpen, column: "" }));
    };

    const closeCustomizePopup = () => {
        setCustomizeInfo({ isOpen: false, column: null });
    };

    const getOrderedColumns = () => {
        const orderedColumnConfigs = tabColumnList[selectedTabName] || [];
        if (orderedColumnConfigs.length > 0) {
            return orderedColumnConfigs.map((config) => ({
                ...config,
                label: config.title,
                align: config?.align ?? "center",
                sortable: true,
            }));
        }
        return columns;
    };
    const orderedColumns = getOrderedColumns();

    // Open Metric modal — you can call this when clicking header icon or a cell icon
    const openMetricModal = (dailogObj = {}) => {
        setMetricDialogObj(dailogObj);
        setReopenData(dailogObj?.reopenData ?? null);
        setMetricModalOpen(true);
    };

    const closeMetricModal = () => {
        setMetricModalOpen(false);
        setMetricDialogObj(null);
        setReopenData(null);
    };

    /**
     * handleValue: called when modal applies a new metric filter (e.g. user created winRateFilter)
     * filterObj will include filterObj.winRateFilter (as constructed by MetricDailog)
     */
    const handleValue = async (pKey, joinKey, filterObj) => {
        // store active filter and re-fetch table
        if (filterObj?.winRateFilter) {
            setActiveWinRateFilter(filterObj.winRateFilter);

            // optionally store filterObj somewhere (chips) — you already have your handleValue logic, so I keep it minimal
            // After setting activeWinRateFilter, useEffect will trigger fetch with the filter included
        }
        // close modal
        closeMetricModal();
    };

    // handleValueUpdate: similar to handleValue but for editing existing filter
    const handleValueUpdate = async (pKey, joinKey, filterObj) => {
        if (filterObj?.winRateFilter) {
            setActiveWinRateFilter(filterObj.winRateFilter);
        } else {
            // if user removed winRateFilter via update, clear active
            setActiveWinRateFilter(null);
        }
        closeMetricModal();
    };

    // Render helper functions (unchanged)
    const getHeaderIcon = (icon) => {
        switch (icon) {
            case "rupee":
                return "₹ ";
            default:
                return icon ? icon + " " : "";
        }
    };
    const showValue = (col, value) => {
        return (
            <>
                {value != undefined && col?.icon ? getHeaderIcon(col?.icon) : ""}
                {value}
                {value != undefined && col?.subValue ? col?.subValue : ""}
                {value != undefined && col?.persentageValue ? "%" : ""}
            </>
        );
    };
    const renderCell = (col, metric) => (
        <div className="flex items-center justify-left gap-1">{(metric || (metric != undefined && col?.value == "osa")) ? <span className="font-medium">{showValue(col, metric)}</span> : <>-</>}</div>
    );

    // Helpers for primary column detection (same as your code)
    const breakdownCols = orderedColumns.filter((i) => i?.type === "breakdown");
    const skuCol = breakdownCols.find(
        (c) =>
            (c.label && c.label.toLowerCase().includes("sku")) ||
            (c.value && c.value.toLowerCase().includes("sku")) ||
            c.label === "Products Name" ||
            c.label === "SKU"
    );
    const pincodeCol = breakdownCols.find(
        (c) =>
            (c.label && c.label.toLowerCase().includes("pincode")) ||
            (c.value && c.value.toLowerCase().includes("pincode")) ||
            c.label === "Pincode"
    );
    const brandsCol = breakdownCols.find(
        (c) =>
            (c.label && c.label.toLowerCase().includes("brand")) ||
            (c.value && c.value.toLowerCase().includes("brand")) ||
            c.label === "Brands"
    );
    const productKey = skuCol?.value ?? "product_name";
    const pincodeKey = pincodeCol?.value ?? "pincode";
    const brandsKey = brandsCol?.value ?? "brands";

    // seller types for rows
    let sellerTypes = [
        { key: "1P", pctField: "p1_percentage", pctFieldFilter: "matched_by_filterP1" },
        { key: "2P", pctField: "p2_percentage", pctFieldFilter: "matched_by_filterP2" },
        { key: "3P", pctField: "p3_percentage", pctFieldFilter: "matched_by_filterP3" },
    ];
    // if (activeWinRateFilter == null) {
    //     sellerTypes = [
    //         { key: "1P", pctField: "p1_percentage" },
    //         { key: "2P", pctField: "p2_percentage" },
    //         { key: "3P", pctField: "p3_percentage" },
    //     ];
    // } else {
    //     sellerTypes = [
    //         { key: "1P", pctField: "p1_percentage" },

    //     ];
    // }


    // remove active win rate filter (clear chip)
    const clearWinRateFilter = (e) => {
        e?.stopPropagation?.();
        setActiveWinRateFilter(null);
        // If you maintain chips stored elsewhere, also remove it there.
    };

    // open modal for editing the active filter (prefill)
    const editWinRateFilter = () => {
        // Build a dialog object similar to how openMetricModal expects:
        const reopen = activeWinRateFilter
            ? {
                value: Array.isArray(activeWinRateFilter.value)
                    ? `${activeWinRateFilter.value[0]},${activeWinRateFilter.value[1]}`
                    : String(activeWinRateFilter.value),
                condition:
                    activeWinRateFilter.comparator === "gt"
                        ? "is_greater_than"
                        : activeWinRateFilter.comparator === "lt"
                            ? "is_less_than"
                            : activeWinRateFilter.comparator === "between"
                                ? "is_between"
                                : activeWinRateFilter.comparator === "not_between"
                                    ? "isnt_between"
                                    : "is_greater_than",
                winRateFilter: activeWinRateFilter,
            }
            : null;

        openMetricModal({
            pkey: "win_rate",
            key: "win_rate",
            joinKey: "win_rate",
            data: "Win Rate",
            persentageValue: true,
            action: "WINRATE_FILTER",
            reopenData: reopen
        });
    };

    // helper: friendly comparator symbol for display
    const comparatorSymbolMap = {
        gt: ">",
        lt: "<",
        between: "—",      // we'll show range like "20 — 40"
        not_between: "not"
    };

    function formatWinRateValue(filter) {
        if (!filter) return "";
        if (Array.isArray(filter.value)) {
            const [min, max] = filter.value;
            return `${min}% ${comparatorSymbolMap.between} ${max}%`;
        }
        // single numeric
        return `${filter.value}%`;
    }

    function formatComparator(filter) {
        if (!filter) return "";
        if (filter.comparator === "gt") return ">";
        if (filter.comparator === "lt") return "<";
        if (filter.comparator === "between") return "between";
        if (filter.comparator === "not_between") return "not between";
        return filter.comparator;
    }

    function formatDate(dateString) {
        const d = new Date(dateString);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }
    return (
        <>
            <div className="px-4 w-full flex-[0_0_auto] mb-[50px]">
                <div className="card border rounded-xl">
                    <div className="flex items-center justify-between border-b py-2 px-3">
                        <div className="flex items-center gap-3">
                            <h3 className="text-[18px] font-medium text-[#000000]">Comprehensive Breakdown</h3>

                            {activeWinRateFilter && (
                                // <div
                                //     role="button"
                                //     onClick={editWinRateFilter}
                                //     title="Edit win rate filter"
                                //     className="ml-3 inline-flex items-center gap-2 bg-white border rounded-md px-2 py-1 shadow-sm cursor-pointer"
                                // >
                                //     <span className="text-xs text-gray-600 font-medium px-2">Metric</span>

                                //     {/* metric badge */}
                                //     <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{/* You can use activeWinRateFilter.metricName if available */}
                                //         {metricDialogObj?.data ?? "Win Rate"}
                                //     </span>

                                //     {/* comparator */}
                                //     <span className="text-sm font-semibold">{formatComparator(activeWinRateFilter)}</span>

                                //     {/* value */}
                                //     <span className="text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                //         {formatWinRateValue(activeWinRateFilter)}
                                //     </span>

                                //     {/* close / clear */}
                                //     <button
                                //         onClick={clearWinRateFilter}
                                //         aria-label="Clear win rate filter"
                                //         className="ml-1 text-gray-500 hover:text-gray-800"
                                //         style={{ background: "transparent", border: "none", padding: 4 }}
                                //     >
                                //         ×
                                //     </button>
                                // </div>

                                <div
                                    role="button"
                                    onClick={editWinRateFilter}
                                    title="Edit win rate filter"
                                    className="
            ml-3 flex items-center rounded-md px-2 
            !bg-white border border-[#D6D6D7] 
            font-semibold cursor-pointer
        "
                                >
                                    {/* Metric Label */}
                                    <div className="py-1 pr-1">
                                        <span className="px-1 capitalize text-[13px] font-semibold text-black">
                                            Metric
                                        </span>
                                    </div>

                                    {/* Metric Badge */}
                                    <div className="p-1 border-l">
                                        <span className="my-1 ml-1 px-2 rounded-sm bg-[#cce6fd] text-[#0081F7] text-[13px]">
                                            {metricDialogObj?.data ?? "Win Rate"}
                                        </span>
                                    </div>

                                    {/* Comparator */}
                                    <div className="p-1 border-l flex items-center">
                                        <span className="px-1 border rounded-sm text-[13px]">
                                            {formatComparator(activeWinRateFilter)}
                                        </span>
                                    </div>

                                    {/* Value */}
                                    <div className="p-1 border-l">
                                        <span className="my-1 rounded-sm px-2 bg-[#cce6fd] text-[#0081F7] text-[13px]">
                                            {formatWinRateValue(activeWinRateFilter)}
                                        </span>
                                    </div>

                                    {/* Close Icon */}
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevents triggering edit
                                            clearWinRateFilter();
                                        }}
                                        className="ml-1 cursor-pointer flex items-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15"
                                            height="15"
                                            viewBox="0 0 25 25"
                                            fill="none"
                                            stroke="#000"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-4 h-4 hover:text-[#DD4242] stroke-current"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <img src="/assets/images/master/columns.png" onClick={handleCustomizeClick} alt="columns img" />
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto h-[600px] overflow-y-auto scroll-smooth">
                        <table className="w-full table-fixed text-sm text-left border-collapse no-zebra">
                            <thead className="bg-[#FAFAFA] sticky top-0">
                                {orderedColumns
                                    .filter((i) => i?.type == "breakdown")
                                    .map((col, colIndex) => (
                                        <th
                                            key={col.value}
                                            className={`p-4 text-sm border-none ${col.sortable ? "cursor-pointer" : ""} ${col.align === "left" ? "text-left" : "text-center"} ${colIndex === 0 ? "sticky-column-header-0" : ""
                                                } sticky-header`}
                                            style={{ width: colIndex < 1 ? "auto" : "auto", minWidth: colIndex < 1 ? "auto" : "auto" }}
                                        >
                                            <div className={`flex items-center  ${col.align === "left" ? "justify-start" : col.align === "right" ? "justify-end" : col.align === "between" ? "gap-8" : "justify-start"}`}>
                                                <span>{col.label}</span>
                                            </div>
                                        </th>
                                    ))}

                                {orderedColumns
                                    .filter((i) => i?.type == "parameters")
                                    .map((col, colIndex) => (
                                        <th
                                            key={col.value}
                                            className={`p-4 text-sm border-none ${col.sortable ? "cursor-pointer" : ""} ${col.align === "left" ? "text-left" : "text-center"} sticky-header`}
                                            style={{ width: colIndex < 1 ? "auto" : "auto", minWidth: colIndex < 1 ? "auto" : "auto" }}
                                        >
                                            <div className={`flex items-center  ${col.align === "left" ? "justify-start" : col.align === "right" ? "justify-end" : col.align === "between" ? "gap-8" : "justify-start"}`}>
                                                <span>{col.label}</span>

                                                {/* Add small icon next to Win Rate header to open the modal */}
                                                {col.value === "win_rate" && (
                                                    <img
                                                        src="/assets/images/master/filter.png" // replace with your filter icon path
                                                        alt="filter"
                                                        style={{ width: 16, height: 16, marginLeft: 8, cursor: "pointer" }}
                                                        onClick={() =>
                                                            openMetricModal({
                                                                pkey: "win_rate",
                                                                key: "win_rate",
                                                                joinKey: "win_rate",
                                                                data: "Win Rate",
                                                                persentageValue: true, // treat as percentage
                                                                action: "WINRATE_FILTER",
                                                                // Optionally pass reopenData to prefill modal when editing:
                                                                reopenData: null,
                                                            })
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                            </thead>

                            <tbody className="text-gray-700 [&_td]:bg-transparent [&_td]:border-r [&_td]:border-gray-200 [&_td:last-child]:border-r-0 [&_tr]:border-b [&_tr]:border-gray-200">
                                {loading && (
                                    <tr>
                                        <td colSpan={orderedColumns.length + 1} className="text-center py-6">
                                            Loading...
                                        </td>
                                    </tr>
                                )}

                                {!loading &&
                                    Object.entries(groupedByLocation).map(([location, products], locationIndex) => {
                                        const isStripedBase = locationIndex % 2 === 0 ? "#fff" : "#F9FAFA";

                                        return products.flatMap((row, idx) => {
                                            const isStriped = isStripedBase;

                                            // build 3 rows for this product (1P/2P/3P)
                                            let lastProduct = null; // local per location render (if you prefer cross-location dedupe, move these outside)
                                            let lastPincode = null;
                                            let lastBrand = null;

                                            // const rowsForThisProduct = sellerTypes.map((seller, sIdx) => {
                                            //     const showPrimaryColsOnThisSellerRow = sIdx === 0;
                                            //     if (!row?.[seller.pctFieldFilter]) return null;
                                            //     return (
                                            //         <tr key={`${location}-${idx}-seller-${seller.key}`} style={{ background: isStriped }} >
                                            //             {breakdownCols.map((col, colIndex) => {
                                            //                 const colVal = row?.[col.value] ?? null;
                                            //                 const isSku = col.value === productKey;
                                            //                 const isPincode = col.value === pincodeKey;
                                            //                 const isBrand = col.value === brandsKey;

                                            //                 let shouldShow = true;
                                            //                 if (isSku) {
                                            //                     if (!showPrimaryColsOnThisSellerRow) shouldShow = false;
                                            //                     else shouldShow = row[productKey] !== lastProduct;
                                            //                 } else if (isPincode) {
                                            //                     if (!showPrimaryColsOnThisSellerRow) shouldShow = false;
                                            //                     else shouldShow = row[pincodeKey] !== lastPincode;
                                            //                 } else if (isBrand) {
                                            //                     if (!showPrimaryColsOnThisSellerRow) shouldShow = false;
                                            //                     else shouldShow = row[brandsKey] !== lastBrand;
                                            //                 } else {
                                            //                     shouldShow = true;
                                            //                 }

                                            //                 return (
                                            //                     <td key={`${location}-${idx}-${col.value}-${seller.key}`} className="px-4 py-2 text-left" style={{ width: colIndex === 0 ? "auto" : "200px", minWidth: colIndex === 0 ? "auto" : "200px", maxWidth: "600px", wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>
                                            //                         {shouldShow ? renderCell(col, colVal) : ""}
                                            //                     </td>
                                            //                 );
                                            //             })}

                                            //             {orderedColumns
                                            //                 .filter((i) => i?.type == "parameters")
                                            //                 .map((col, colIndex) => {
                                            //                     if (col?.key === "seller_type") {
                                            //                         return (
                                            //                             <td key={`${location}-${idx}-${col.value}-${seller.key}`} className="px-4 py-2 text-left" style={{ width: colIndex === 0 ? "auto" : "200px", minWidth: colIndex === 0 ? "auto" : "200px", maxWidth: "600px", wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>
                                            //                                 <div>{seller.key}</div>
                                            //                             </td>
                                            //                         );
                                            //                     }

                                            //                     if (col?.key === "win_rate") {
                                            //                         const pct = row?.[seller.pctField];
                                            //                         const pctText = typeof pct === "number" ? `${Math.round(pct)}%` : pct ?? "-";
                                            //                         return (
                                            //                             <td key={`${location}-${idx}-${col.value}-${seller.key}`} className="px-4 py-2 text-left" style={{ width: colIndex === 0 ? "auto" : "200px", minWidth: colIndex === 0 ? "auto" : "200px", maxWidth: "600px", wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>
                                            //                                 <div className="flex items-center justify-between">
                                            //                                     <div>{pctText}</div>
                                            //                                 </div>
                                            //                             </td>
                                            //                         );
                                            //                     }

                                            //                     if (col?.key === "last_check_on") {
                                            //                         return (
                                            //                             <td key={`${location}-${idx}-${col.value}-${seller.key}`} className="px-4 py-2 text-left" style={{ width: colIndex === 0 ? "auto" : "200px", minWidth: colIndex === 0 ? "auto" : "200px", maxWidth: "600px", wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>
                                            //                                 <div>{formatDate(row?.[col.value])}</div>
                                            //                             </td>
                                            //                         );
                                            //                     }
                                            //                     return (
                                            //                         <td key={`${location}-${idx}-${col.value}-${seller.key}`} className="px-4 py-2 text-left" style={{ width: colIndex === 0 ? "auto" : "200px", minWidth: colIndex === 0 ? "auto" : "200px", maxWidth: "600px", wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>
                                            //                             {renderCell(col, row?.[col.value] ?? null)}
                                            //                         </td>
                                            //                     );
                                            //                 })}
                                            //         </tr>
                                            //     );
                                            // });

                                            // Determine which sellers matched for this product row (use backend flags like matched_by_filterP1)
                                            const matchedSellers = sellerTypes.filter((s) => Boolean(row?.[s.pctFieldFilter]));

                                            // Fallback: if nothing matched but you want at least one row, show 1P as fallback
                                            const sellersToRender = matchedSellers.length ? matchedSellers : [...sellerTypes];

                                            // Map over the filtered sellers so sIdx === 0 is the first visible row
                                            const rowsForThisProduct = sellersToRender.map((seller, sIdx) => {
                                                const showPrimaryColsOnThisSellerRow = sIdx === 0;
//console.log('seller.keyseller.key',sellersToRender)
                                                return (
                                                    <tr key={`${location}-${idx}-seller-${seller.key}`} style={{ background: isStriped }}>
                                                        {breakdownCols.map((col, colIndex) => {
                                                            const colVal = row?.[col.value] ?? null;
                                                            const isSku = col.value === productKey;
                                                            const isPincode = col.value === pincodeKey;
                                                            const isBrand = col.value === brandsKey;

                                                            let shouldShow = true;
                                                            if (isSku) {
                                                                if (!showPrimaryColsOnThisSellerRow) shouldShow = false;
                                                                else shouldShow = row[productKey] !== lastProduct;
                                                            } else if (isPincode) {
                                                                if (!showPrimaryColsOnThisSellerRow) shouldShow = false;
                                                                else shouldShow = row[pincodeKey] !== lastPincode;
                                                            } else if (isBrand) {
                                                                if (!showPrimaryColsOnThisSellerRow) shouldShow = false;
                                                                else shouldShow = row[brandsKey] !== lastBrand;
                                                            } else {
                                                                shouldShow = true;
                                                            }

                                                            return (
                                                                <td
                                                                    key={`${location}-${idx}-${col.value}-${seller.key}`}
                                                                    className="px-4 py-2 text-left"
                                                                    style={{
                                                                        width: colIndex === 0 ? "auto" : "200px",
                                                                        minWidth: colIndex === 0 ? "auto" : "200px",
                                                                        maxWidth: "600px",
                                                                        wordBreak: "break-word",
                                                                        overflowWrap: "break-word",
                                                                        whiteSpace: "normal",
                                                                    }}
                                                                >
                                                                    {shouldShow ? renderCell(col, colVal) : ""}
                                                                </td>
                                                            );
                                                        })}

                                                        {orderedColumns
                                                            .filter((i) => i?.type == "parameters")
                                                            .map((col, colIndex) => {
                                                                if (col?.key === "seller_type") {
                                                                    return (
                                                                        <td
                                                                            key={`${location}-${idx}-${col.value}-${seller.key}`}
                                                                            className="px-4 py-2 text-left"
                                                                            style={{
                                                                                width: colIndex === 0 ? "auto" : "200px",
                                                                                minWidth: colIndex === 0 ? "auto" : "200px",
                                                                                maxWidth: "600px",
                                                                                wordBreak: "break-word",
                                                                                overflowWrap: "break-word",
                                                                                whiteSpace: "normal",
                                                                            }}
                                                                        >
                                                                            <div>{seller.key}</div>
                                                                        </td>
                                                                    );
                                                                }

                                                                if (col?.key === "win_rate") {
                                                                    const pct = row?.[seller.pctField];
                                                                    const pctText = typeof pct === "number" ? `${Math.round(pct)}%` : pct ?? "-";
                                                                    return (
                                                                        <td
                                                                            key={`${location}-${idx}-${col.value}-${seller.key}`}
                                                                            className="px-4 py-2 text-left"
                                                                            style={{
                                                                                width: colIndex === 0 ? "auto" : "200px",
                                                                                minWidth: colIndex === 0 ? "auto" : "200px",
                                                                                maxWidth: "600px",
                                                                                wordBreak: "break-word",
                                                                                overflowWrap: "break-word",
                                                                                whiteSpace: "normal",
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <div>
                                                                                    {pctText != "0%" ? pctText : "-"}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    );
                                                                }

                                                                if (col?.key === "last_check_on") {
                                                                    return (
                                                                        <td
                                                                            key={`${location}-${idx}-${col.value}-${seller.key}`}
                                                                            className="px-4 py-2 text-left"
                                                                            style={{
                                                                                width: colIndex === 0 ? "auto" : "200px",
                                                                                minWidth: colIndex === 0 ? "auto" : "200px",
                                                                                maxWidth: "600px",
                                                                                wordBreak: "break-word",
                                                                                overflowWrap: "break-word",
                                                                                whiteSpace: "normal",
                                                                            }}
                                                                        >
                                                                            <div>{formatDate(row?.[col.value])}</div>
                                                                        </td>
                                                                    );
                                                                }

                                                                return (
                                                                    <td
                                                                        key={`${location}-${idx}-${col.value}-${seller.key}`}
                                                                        className="px-4 py-2 text-left"
                                                                        style={{
                                                                            width: colIndex === 0 ? "auto" : "200px",
                                                                            minWidth: colIndex === 0 ? "auto" : "200px",
                                                                            maxWidth: "600px",
                                                                            wordBreak: "break-word",
                                                                            overflowWrap: "break-word",
                                                                            whiteSpace: "normal",
                                                                        }}
                                                                    >
                                                                        {renderCell(col, row?.[col.value] ?? null)}
                                                                    </td>
                                                                );
                                                            })}
                                                    </tr>
                                                );
                                            });


                                            // update last seen values (works per location block)
                                            lastProduct = row[productKey];
                                            lastPincode = row[pincodeKey];
                                            lastBrand = row[brandsKey];

                                            return rowsForThisProduct;
                                        });
                                    })}
                            </tbody>
                        </table>
                    </div>

                    {/* footer */}
                    <div className="w-full cmp-footer bg-gray-50 border border-[#e5e7eb] text-gray-700 grid pr-[5px]" style={{ gridTemplateColumns: `repeat(${orderedColumns.length}, minmax(0, 1fr))` }}>
                        {orderedColumns
                            .filter((i) => i?.type == "breakdown")
                            .map((col) => {
                                if (col.value === "product") {
                                    return (
                                        <td key={col.value} className="px-4 py-4">
                                            <p className="text-[#000000] text-[12px]">Total Products</p>
                                            <p className="font-medium">{footer?.total_products ?? 0}</p>
                                        </td>
                                    );
                                }
                                if (col.value === "pincode") {
                                    return (
                                        <td key={col.value} className="px-4 py-4">
                                            <p className="text-[#000000] text-[12px]">Total Locations</p>
                                            <p className="font-medium">{footer?.total_locations ?? 0}</p>
                                        </td>
                                    );
                                }
                                if (col.value === "brand") {
                                    return (
                                        <td key={col.value} className="px-4 py-4">
                                            <p className="text-[#000000] text-[12px]">Total Brands</p>
                                            <p className="font-medium">{footer?.total_brands ?? 0}</p>
                                        </td>
                                    );
                                }
                                if (col.value === "seller_type") {
                                    return (
                                        <td key={col.value} className="px-4 py-4">
                                            <p className="text-[#000000] text-[12px]">Total Seller Type</p>
                                            <p className="font-medium">{footer?.total_seller_types ?? 0}</p>
                                        </td>
                                    );
                                }
                                if (col.value === "win_rate") {
                                    return (
                                        <td key={col.value} className="px-4 py-4">
                                            <p className="text-[#000000] text-[12px]">Average Win Rate</p>
                                            <p className="font-medium">{footer?.avg_win_rate ? `${Math.round(footer.avg_win_rate)}%` : "0%"}</p>
                                        </td>
                                    );
                                }
                                return <td key={col.value}></td>;
                            })}

                        {orderedColumns
                            .filter((i) => i?.type == "parameters")
                            .map((col) => {
                                if (col.value === "seller_type") {
                                    return (
                                        <td key={col.value} className="px-4 py-4">
                                            <p className="text-[#000000] text-[12px]">Total Seller Type</p>
                                            <p className="font-medium">{footer?.total_seller_types ?? 0}</p>
                                        </td>
                                    );
                                }
                                if (col.value === "win_rate") {
                                    return (
                                        <td key={col.value} className="px-4 py-4">
                                            <p className="text-[#000000] text-[12px]">Average Win Rate</p>
                                            <p className="font-medium">{footer?.avg_win_rate ? `${Math.round(footer.avg_win_rate)}%` : "0%"}</p>
                                        </td>
                                    );
                                }
                                return <td key={col.value}></td>;
                            })}
                    </div>
                </div>
            </div>

            {/* Metric Modal */}
            {metricModalOpen && (
                <MetricDailog
                    dailogObj={metricDialogObj ?? { data: "Win Rate", persentageValue: true }}
                    reopenData={reopenData}
                    platform="ams"
                    handleValue={handleValue}
                    handleValueUpdate={handleValueUpdate}
                    handleClose={closeMetricModal}
                />
            )}

            {/* Customize modal */}
            {customizeInfo.isOpen && (
                <CustomizeCampiagnModal
                    isWidget={true}
                    kpi={"BUYBOX"}
                    selectedTabName={selectedTabName}
                    closePopup={closeCustomizePopup}
                    tabColumnList={tabColumnList}
                    setTabColumnList={setTabColumnList}
                    isSaveViewVisible={false}
                    initCustomizeColumns={{
                        breakdown: {
                            title: "Breakdowns",
                            columns: [
                                {
                                    persentageValue: false,
                                    title: "Brands",
                                    type: "breakdown",
                                    value: "brand",
                                    key: "brand",
                                    breakdown: "Brand",
                                    allowKPI: [kpi],
                                    notAllowWithIsValueIn: [],
                                    allowWithIsValueIn: [],
                                    allowInDarkStore: true,
                                    isDisabled: false,
                                },
                                {
                                    persentageValue: false,
                                    title: "Pincode",
                                    type: "breakdown",
                                    value: "pincode",
                                    key: "pincode",
                                    breakdown: "",
                                    allowKPI: [kpi],
                                    notAllowWithIsValueIn: ["rating_value", "review_count"],
                                    allowWithIsValueIn: [],
                                    allowInDarkStore: true,
                                    isDisabled: false,
                                },
                                {
                                    persentageValue: false,
                                    title: "SKU",
                                    type: "breakdown",
                                    value: "product",
                                    key: "product",
                                    breakdown: "SKU",
                                    allowKPI: [kpi],
                                    notAllowWithIsValueIn: [],
                                    allowWithIsValueIn: [],
                                    allowInDarkStore: true,
                                    isDisabled: false,
                                },
                            ],
                        },
                    }}
                />
            )}
        </>
    );
}
