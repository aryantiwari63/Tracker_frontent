import { useState, useEffect, useRef, useMemo } from "react";
import { FaSort } from "react-icons/fa";
import { IoMdArrowDropup, IoMdArrowDropdown, IoMdCopy, IoIosRedo } from "react-icons/io";
import { fetchDrillDownData } from "../../../services/drillDown.service";
import { useEbuxContext } from "../../../../../../Context/EbuxProvider";
import CustomTooltip from "../customTooltip/CustomTooltip";
import { copyToClipboard, getTextFromReactNode } from "../../../../../../../../utils/helpers";
const PerformanceTable = ({
    setLoading = () => { },
    drillDownData = {},
    title,
    columns = [],
    data,
    footer,
    setSelectedKey,
    setSelected,
    selected,
    defaultfixedColumns,
    selectedTableRows,
    breakdownFilters,
    onDataLoaded,
    // setSelectedPlatform,
    // setSelectedLocation,
    // setSelectedProduct,
    // selectedPlatform = [],
    // selectedLocation = [],
    // selectedProduct = []
}) => {
    const {
        kpi,
        selectedFilters, filters
    } = useEbuxContext();
    const [apiResponse, setApiResponse] = useState([]);
    const { rowData, footerData } = useMemo(() => {
        if (apiResponse?.rowData) {
            const { rowData, footerData } = apiResponse;
            return { rowData, footerData };

        } else {
            return { rowData: [], footerData: {} };
        }

    }, [JSON.stringify(apiResponse)]);
    const selectRowsCount = useRef(0);
    const fetchData = async () => {
        if (!drillDownData?.data?.value || !drillDownData?.data?.performanceOf) return;
        setLoading(true);
        try {
            const performanceOf = drillDownData?.data?.performanceOf ?? 'brand';
            let payload = {
                kpi,
                drillDown: drillDownData?.key ?? 'platform',
                breakdown: drillDownData?.breakdown ?? ['platform'],
                matrix: defaultfixedColumns?.length ? defaultfixedColumns?.filter(column => column?.type == "parameters")?.map(column => column.value) : drillDownData?.matrix ?? ['osa', 'wt_osa', 'avg_offtake_osa'],
                key: performanceOf,
                value: drillDownData?.data?.value ?? "",
                selectedFilters, filters,
                breakdownFilters,
                selectedTableRows: {
                    selectedDates: selectedTableRows?.selectedDates?.map(i => i?.date) ?? [],
                    selectedLocation: selectedTableRows?.selectedLocation?.map(i => i?.location) ?? [],
                    selectedPlatform: selectedTableRows?.selectedPlatform?.map(i => i?.platform) ?? [],
                    selectedProduct: selectedTableRows?.selectedProduct?.map(i => i?.skuId) ?? [],
                    selectedKeyword: selectedTableRows?.selectedKeyword?.map(i => i?.keyword) ?? []
                }
            };

            const response = await fetchDrillDownData(payload);
            setApiResponse(response);
            onDataLoaded?.(response); // ✅ HIGHLIGHTED
            setLoading(false);
        } catch (error) {
            console.error("Error in fetchData:", error);
            setLoading(false);
            return;

        }

    }
    useEffect(() => {
        selectRowsCount.current = selectedTableRows?.[setSelectedKey]?.length;
        fetchData();
    }, [JSON.stringify(data), JSON.stringify(selectedFilters), JSON.stringify(defaultfixedColumns), JSON.stringify(breakdownFilters), JSON.stringify({ ...selectedTableRows, [setSelectedKey]: (selectRowsCount.current > 0 && selectedTableRows?.[setSelectedKey]?.length == 0) })]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "null" });
    const [selectedRows, setSelectedRows] = useState([]);
    const selectAllRef = useRef(null);

    useEffect(() => {
        // if (title.includes("Platform")) {
        //     setSelectedRows(selectedPlatform || []);
        // } else if (title.includes("Location")) {
        //     setSelectedRows(selectedLocation || []);
        // } else if (title.includes("Product")) {
        //     setSelectedRows(selectedProduct || []);
        // }
        setSelectedRows(selected || []);

    }, [
        // selectedPlatform, selectedLocation, selectedProduct
        selected, title]);


    // 🔹 Which setter to use based on title
    const updateSelection = (rows) => {
        setSelected?.(prev => ({ ...prev, [setSelectedKey]: rows }));
        // if (title.includes("Platform")) {
        //     setSelectedPlatform?.(rows);
        // } else if (title.includes("Location")) {
        //     setSelectedLocation?.(rows);
        // } else if (title.includes("Product")) {
        //     setSelectedProduct?.(rows);
        // }
    };

    // Unified selection handler
    const handleSelection = (selectionType, row = null) => {
        switch (selectionType) {
            case 'all': {
                console.log("check23", { selectedRows, rowData, data })
                const source = rowData?.length ? rowData : data ?? [];
                if (selectedRows.length === source.length) {
                    // Deselect all
                    setSelectedRows([]);
                    updateSelection([]);
                } else {
                    // Select all rows
                    setSelectedRows([...source]);
                    updateSelection(source);
                }
                break;
            }

            case 'row': {
                const isSelected = selectedRows.some(selectedRow =>
                    (selectedRow?.[drillDownData?.key] ?? selectedRow?.name) === (row?.[drillDownData?.key] ?? row?.name) && (row?.skuId ? selectedRow?.skuId === row?.skuId : true)
                );

                if (isSelected) {
                    // Deselect row
                    const newSelectedRows = selectedRows.filter(selectedRow =>
                        !((selectedRow?.[drillDownData?.key] ?? selectedRow?.name) === (row?.[drillDownData?.key] ?? row?.name) && (row?.skuId ? selectedRow?.skuId === row?.skuId : true))
                    );
                    setSelectedRows(newSelectedRows);
                    updateSelection(newSelectedRows);
                } else {
                    // Select row
                    const newSelectedRows = [...selectedRows, row];
                    setSelectedRows(newSelectedRows);
                    updateSelection(newSelectedRows);
                }
                break;
            }

            default:
                break;
        }
    };

    // Sorting
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            // direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
            direction: prev.direction === "asc" ? "desc" : "asc"
        }));
    };

    console.log("sort Config", sortConfig);

    const getSortedRows = (rows) => {
        if (!sortConfig.key) return rows;

        return [...rows].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // If the value is an object with .value (numeric columns)
            if (aValue && typeof aValue === "object" && "value" in aValue) aValue = aValue.value;
            if (bValue && typeof bValue === "object" && "value" in bValue) bValue = bValue.value;

            // Handle undefined/null
            if (aValue == null) aValue = "";
            if (bValue == null) bValue = "";

            // Determine type dynamically
            const isString = typeof aValue === "string" || typeof bValue === "string";

            if (isString) {
                // Convert to string to prevent errors
                return sortConfig.direction === "asc"
                    ? String(aValue).localeCompare(String(bValue))
                    : String(bValue).localeCompare(String(aValue));
            }

            // Numeric comparison
            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        });
    };



    // Row selection helper
    const isRowSelected = (row) =>
        selectedRows.some((selectedRow) =>
            (selectedRow?.[drillDownData?.key] ?? selectedRow?.name) === (row?.[drillDownData?.key] ?? row?.name) && (row?.skuId ? selectedRow?.skuId === row?.skuId : true)
        );

    // Keep "select all" checkbox indeterminate
    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate =
                selectedRows.length > 0 && selectedRows.length < (rowData ?? data ?? [])?.length;
        }
    }, [selectedRows, (rowData ?? data ?? [])?.length]);

    // Cell renderer
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
        <div className="flex gap-2 items-center justify-center">
            {
                (metric?.value || (metric?.value != undefined && (col?.value == "osa" || col?.value == "price_variation"))) ?
                    <div className="flex justify-start">
                        <span className="font-medium">{showValue(col, metric?.value)}</span>
                        {metric?.value ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.value))) }}><IoMdCopy /></span> : null}
                    </div>
                    : <>-</>
            }
            {
                metric?.value && metric?.reference ?
                    <div className="flex justify-start">
                        <span className="text-gray-400 text-xs">{showValue(col, metric?.reference)}</span>
                        {metric?.value ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.reference))) }}><IoMdCopy /></span> : null}
                    </div>
                    :
                    (<></>)
            }

            {metric?.value && metric?.reference && metric?.delta ?
                metric?.delta >= 0 ? (
                    <div className="flex justify-start">
                        <span className="text-[#329900] flex items-center gap-1 text-xs px-1 py-0.5 border border-[#B7EB8F] bg-[#E8FFEB] rounded-full">
                            <IoMdArrowDropup size={14} /> {showValue(col, metric?.delta)}
                        </span>
                        {metric?.value ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.delta))) }}><IoMdCopy /></span> : null}
                    </div>

                ) : (
                    <div className="flex justify-start">
                        <span className="text-[#DD4242] flex items-center gap-1 text-xs px-1 py-0.5 border bg-[#FFF1F0] border-[#FFA39E] rounded-full">
                            <IoMdArrowDropdown size={14} /> {showValue(col, Math.abs(metric?.delta))}
                        </span>
                        {metric?.value ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, Math.abs(metric?.delta)))) }}><IoMdCopy /></span> : null}
                    </div>
                ) :
                <></>
            }
        </div>
    );

    // Check if all rows are selected
    const isAllSelected = useMemo(() => {
        const source = rowData?.length ? rowData : data ?? [];
        return selectedRows.length === source.length && source.length > 0;
    }, [rowData, data, selectedRows]);


    return (
        <div className="w-full h-[400px] flex flex-col relative">
            {/* Table */}
            <div className="overflow-x-auto overflow-y-auto flex-1 relative">
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
                        border : none;
                    }
                    .sticky-footer {
                        position: sticky;
                        bottom : 0;
                        z-index: 40;
                        background: #FFFFFF;
                        border: none;
                        box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.08);
                      }
                    .sticky-column-0 {
                        position: sticky;
                        left: 0;
                        z-index: 15;
                        background: inherit;
                        border : none;
                        
                    }
                    .sticky-column-1 {
                        position: sticky;
                        left: 200px;
                        z-index: 14;
                        background: inherit;
                        border : none;
                    }
                    .sticky-column-header-0 {
                        position: sticky;
                        left: 0;
                        z-index: 25;
                        background: #F6F9FB;
                        border : none;
                    }
                    .sticky-column-header-1 {
                        position: sticky;
                        left: 200px;
                        z-index: 25;
                        background: #F6F9FB;
                        border : none;
                    }
                     .truncate {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 100%;
                    }

                    `}
                </style>

                <table className="w-full relative text-sm sticky-table" style={{ minHeight: '400px' }}>
                    <thead>
                        <tr>
                            {columns.map((col, colIndex) => (
                                <th
                                    key={col.value}
                                    className={`
                                        p-4 text-sm border-none
                                        first:rounded-l-2xl last:rounded-r-2xl
                                        cursor-default
                                        ${col.align === "left" ? "text-left" : "text-center"}
                                        ${colIndex === 0 ? "sticky-column-header-0" : ""}
                                        ${title.toLowerCase().includes("product") && colIndex === 1 ? "sticky-column-header-1" : ""}
                                        sticky-header
                                    `}
                                    style={{
                                        width: colIndex < 1 ? '200px' : '150px',
                                        minWidth: colIndex < 1 ? '200px' : '150px',
                                        maxWidth: colIndex < 1 ? '200px' : '230px',
                                    }}
                                >
                                    <div className={`flex items-center gap-4 ${col.align === "left" ? "justify-start" :
                                        col.align === "right" ? "justify-end" :
                                            col.align === "between" ? "justify-between" : "justify-center"
                                        }`}>
                                        {col.checkbox && (
                                            <input
                                                type="checkbox"
                                                ref={selectAllRef}
                                                checked={isAllSelected}
                                                onChange={() => handleSelection('all')}
                                            />
                                        )}
                                        <span
                                            className={`${col.sortable ? "cursor-pointer" : ""}`}
                                            onClick={col.sortable ? () => handleSort(col.value) : undefined}
                                        >
                                            <span>{col.label}</span>
                                            {col.sortable && <FaSort className="inline h-3 w-3" />}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {getSortedRows((rowData?.length ? rowData : data ?? []))?.map((row, i) => {
                            const selected = isRowSelected(row);
                            const isStriped = i % 2 === 0 ? "white" : "#F9FAFA";

                            return (
                                <tr
                                    key={i}
                                    className={`cursor-pointer border-none `}
                                    onClick={() => handleSelection('row', row)}
                                >
                                    {columns.map((col, colIndex) => (

                                        <td
                                            key={col.value}
                                            className={`group
                                                px-4 py-2 border-none
                                                ${col.align === "left" ? "text-left" :
                                                    col.align === "right" ? "text-right" : "text-center"}
                                                 ${colIndex === 0 ? "sticky-column-0" : ""}
                                                 ${title.toLowerCase().includes("product") && colIndex === 1 ? "sticky-column-1" : ""}
                                            `}
                                            style={{
                                                background: selected ? "#f2f8ff" : isStriped,
                                                width: (title.toLowerCase().includes("product") ? colIndex < 2 : colIndex < 1) ? "200px" : "150px",
                                                minWidth: (title.toLowerCase().includes("product") ? colIndex < 2 : colIndex < 1) ? "200px" : "150px",
                                                maxWidth: (title.toLowerCase().includes("product") ? colIndex < 2 : colIndex < 1) ? "200px" : "230px",
                                                borderTopLeftRadius: colIndex == 0 ? "12px" : "0px",
                                                borderBottomLeftRadius: colIndex == 0 ? "12px" : "0px",
                                            }}
                                        >
                                            {/* Handle checkbox column with flex wrapper */}
                                            {col.checkbox ? (
                                                <div className="flex gap-4 items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selected}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleSelection("row", row);
                                                        }}
                                                    />
                                                    {/* Render content for first column */}
                                                    {(col.value === "platform" || col.value === "location" || col.value === "product" || col.value === "keyword") &&
                                                        // <span>{row?.[col.value] ?? row?.name}</span>
                                                        <>
                                                            {(col.value === "platform" && row?.[col.value]?.toLowerCase() && row?.[col.value]?.toLowerCase() in (drillDownData?.pf_images ?? {})) ? (
                                                                <img
                                                                    src={drillDownData?.pf_images?.[row?.[col.value]?.toLowerCase()]}
                                                                    alt={row?.[col.value]}
                                                                    className="oos-plat-img max-w-8 max-h-8 object-contain"
                                                                />
                                                            ) : (<></>)}



                                                            <div className="flex items-center gap-2 w-full max-w-[200px]">
                                                                {(col.value === "product" && row?.["pdp_image_url"]) ? <div className="w-[10%] h-6"><img src={row?.["pdp_image_url"] ?? ""} alt={row?.[col.value]} className="oos-plat-img w-full h-full object-contain" /></div> : <></>}
                                                                <div className="w-[80%] flex justify-start">
                                                                    <CustomTooltip widthNo="No" title={row?.[col.value] ?? row?.name} placement="top">

                                                                        <span>
                                                                            {String(row?.[col.value] ?? row?.name ?? "").charAt(0).toUpperCase() +
                                                                                String(row?.[col.value] ?? row?.name ?? "").slice(1).toLowerCase()}
                                                                        </span>
                                                                    </CustomTooltip>
                                                                    {(row?.[col.value] ?? row?.name)
                                                                        && <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(row?.[col.value] ?? row?.name)) }}><IoMdCopy /></span>}
                                                                </div>

                                                            </div>

                                                        </>
                                                    }
                                                </div>
                                            ) : (
                                                <>
                                                    {(col.value === "platform" || col.value === "location" || col.value === "product" || col.value === "keyword") ? (
                                                        <CustomTooltip title={row?.[col.value] ?? row?.name ?? "-"} placement="top">
                                                            <span>{row?.[col.value] ?? row?.name ?? "-"}</span>
                                                            {(row?.[col.value] ?? row?.name) && <span className="inline-block cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(row?.[col.value] ?? row?.name)) }}><IoMdCopy /></span>}
                                                        </CustomTooltip>
                                                    ) : (col.value === "sku_id" || col.value === "skuId") ? (
                                                        <div
                                                            className="flex items-center justify-start gap-1"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >

                                                            <div
                                                                className="flex items-center justify-start gap-1"
                                                                title={row?.[col.value] ?? row?.skuId ?? "-"}
                                                            >
                                                                {(row?.[col.value] ?? row?.skuId ?? "-")?.length > 15
                                                                    ? `${(row?.[col.value] ?? row?.skuId ?? "-").slice(0, 15)}...`
                                                                    : (row?.[col.value] ?? row?.skuId ?? "-")}

                                                                {(row?.[col.value] ?? row?.skuId) && (
                                                                    <span
                                                                        className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            copyToClipboard(
                                                                                e,
                                                                                getTextFromReactNode(row?.[col.value] ?? row?.skuId)
                                                                            );
                                                                        }}
                                                                    >
                                                                        <IoMdCopy />
                                                                    </span>
                                                                )}
                                                                {row?.["pdp_page_url"] ? <a href={row?.["pdp_page_url"]} target="blank"><IoIosRedo /></a> : null}
                                                            </div>



                                                        </div>
                                                    ) : (col?.value) ? (
                                                        <CustomTooltip title={showValue(col, row?.[col.value]?.value ?? "-")} placement="top">
                                                            {renderCell(col, row?.[col.value] ?? "-")}
                                                        </CustomTooltip>
                                                    ) : null}
                                                </>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="sticky-footer">
                        <tr>
                            {columns?.map((col, colIndex) => {
                                const summary = (footerData ?? footer)?.[col.value] ?? {};
                                return (
                                    <td
                                        key={col.value}
                                        className={`group 
                                                p-2 border-none text-xs text-gray-600
                                                ${colIndex === 0 ? "sticky-column-0" : ""}
                                                ${title.toLowerCase().includes("product") && colIndex === 1 ? "sticky-column-1" : ""}
                                                `}
                                        style={{
                                            width: colIndex < 1 ? "200px" : "150px",
                                            minWidth: colIndex < 1 ? "200px" : "150px",
                                            maxWidth: colIndex < 1 ? "200px" : "230px",
                                            background: "#FFFFFF",
                                        }}
                                    >
                                        <div className={`font-normal !text-sm text-[#000000D9]  flex flex-col 
                                                    ${(col.align === "left" && colIndex == 0) ? "px-10" : col.align === "left" ? "items-letf" :
                                                col.align === "right" ? "items-right" : "items-center"}
                                                        `}>
                                            <span>{col?.type === "parameters" ? "Avg" : "Total"} {col?.label || summary?.label}</span>
                                            <p className="font-semibold text-md flex flex-start">{summary?.value ? (renderCell(col, summary)) : "-"}</p>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};


{/* Footer */ }
{/* <div className="sticky bottom-0 !bg-[#FFFFFF] flex justify-between mt-2 p-2 text-xs text-gray-600 z-10">
                <div className="w-full flex flex-col items-center font-normal text-md"> Total{" "}
                    {title.includes("Platform")
                        ? "Platform"
                        : title.includes("Location")
                            ? "Location"
                            : "Product"}
                    <p className="font-semibold text-lg">
                        {footer.total}
                    </p>
                </div>
                {title.includes("Product") && <div className="w-full flex flex-col items-center font-normal text-md">SKU Id
                    <p className="font-semibold text-lg">{footer.skuId}</p>
                </div>}
                <div className="w-full flex flex-col items-center font-normal text-md">Avg OSA <p className="font-semibold text-lg">{footer.osa}%</p></div>
                <div className="w-full flex flex-col items-center font-normal text-md">Wgt OSA <p className="font-semibold text-lg">{footer.wt_osa}%</p></div>
                <div className="w-full flex flex-col items-center font-normal text-md">Avg Off take <p className="font-semibold text-lg">{footer.avg_offtake_osa}%</p></div>
            </div> */}

export default PerformanceTable;