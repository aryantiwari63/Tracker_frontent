import { useState } from "react";
import { FaSort } from "react-icons/fa";
import { IoMdArrowDropup, IoMdArrowDropdown, IoMdCopy } from "react-icons/io";
import CustomTooltip from "../customTooltip/CustomTooltip";
import { copyToClipboard, getTextFromReactNode } from "../../../../../../../../utils/helpers";

const CompetitionTable = ({
    // title,
    useFor,
    data,
    subTitle,
    footer,
    columns = [],
    rowData = [],
    footerData = [],
    setSelectedBrand,
    selectedBrand,
    type,
    hideFooter = false
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // Sorting
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getSortedRows = (rows) => {
        if (!sortConfig?.key) return rows;

        const brandRows = rows.filter((row) => row?.is_brand);
        const nonBrandRows = rows.filter((row) => !row?.is_brand);

        const sortedNonBrands = [...nonBrandRows].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // If value is an object with .value (numeric metrics)
            if (aValue && typeof aValue === "object" && "value" in aValue) aValue = aValue.value;
            if (bValue && typeof bValue === "object" && "value" in bValue) bValue = bValue.value;

            // Handle undefined/null
            if (aValue == null) aValue = "";
            if (bValue == null) bValue = "";

            const isString = typeof aValue === "string" || typeof bValue === "string";

            if (isString) {
                return sortConfig.direction === "asc"
                    ? String(aValue).localeCompare(String(bValue))
                    : String(bValue).localeCompare(String(aValue));
            }

            // Numeric comparison
            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        });

        // put is_brand rows first, then sorted non-brand rows
        return [...brandRows, ...sortedNonBrands];
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
        <div className="flex gap-2 items-center justify-center">
            {
                (metric?.value || (metric?.value != undefined && (col?.value == "osa" || col?.value == "price_variation"))) ?
                    <div className="flex justify-start">
                        <span className="font-medium">{showValue(col, metric?.value)}</span>
                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.value))) }}><IoMdCopy /></span>
                    </div>
                    : <>-</>
            }
            {
                metric?.value && metric?.reference ?
                    <div className="flex justify-start">
                        <span className="text-gray-400 text-xs">{showValue(col, metric?.reference)}</span>
                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.reference))) }}><IoMdCopy /></span>
                    </div>
                    :
                    (<></>)
            }

            {metric?.value && metric?.reference && metric?.delta ?
                metric?.delta >= 0 ? (
                    <span className="text-[#329900] flex items-center gap-1 text-xs px-1 py-0.5 border border-[#B7EB8F] bg-[#E8FFEB] rounded-full">
                        <IoMdArrowDropup size={14} /> {showValue(col, metric?.delta)}
                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.delta))) }}><IoMdCopy /></span>
                    </span>
                ) : (
                    <span className="text-[#DD4242] flex items-center gap-1 text-xs px-1 py-0.5 border bg-[#FFF1F0] border-[#FFA39E] rounded-full">
                        <IoMdArrowDropdown size={14} /> {showValue(col, Math.abs(metric?.delta))}
                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, Math.abs(metric?.delta)))) }}><IoMdCopy /></span>
                    </span>
                ) :
                <></>
            }
        </div>
    );
    return (
        <div className="w-full h-[400px] flex flex-col">
            {/* Table */}
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
                    .sticky-header-0 {
                        position: sticky;
                        top: 52px;
                        z-index: 19;
                        border-bottom : 2px solid #1890FF !important;
                    }
                    .sticky-footer {
                        position: sticky;
                        bottom : -1px !important;
                        z-index: 40;
                        background: #FFFFFF;
                        border: none;
                        box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.08);
                      }
                    .sticky-column-0 {
                        position: sticky;
                        left: 0;
                        z-index: 15 !important;
                        background: inherit;
                        border : none;
                    }
                    .sticky-column-1 {
                        position: sticky;
                        left: 200px;
                        z-index: 15;
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
                    .sticky-intersect {
                            position: sticky;
                            top: 52px;   
                            left: 0;
                            z-index: 30; 
                            background: #F6F9FB;
                     }
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none; 
                    }
                    `}
            </style>
            <div className="overflow-x-auto overflow-y-auto flex-1 relative no-scrollbar">
                <table className="w-full relative text-sm sticky-table " style={{ minHeight: '400px' }}>
                    <thead >
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
                                        sticky-header
                                    `}
                                    style={{
                                        width: colIndex < 1 ? '200px' : '150px',
                                        minWidth: colIndex < 1 ? '200px' : '150px',
                                        maxWidth: colIndex < 1 ? '200px' : '230px',

                                    }}
                                >
                                    <div className="gap-2">
                                        <span
                                            onClick={col.sortable ? () => handleSort(col.value) : undefined}
                                            className={`${col.sortable ? "cursor-pointer" : ""} items-center  ${col.align === "left" ? "justify-start" :
                                                col.align === "right" ? "justify-end" :
                                                    col.align === "between" ? "justify-between" : "justify-center"
                                                }`}>
                                            <CustomTooltip widthNo="No" title={`${col?.value === "product" || col?.value === "keyword" ? `${subTitle} - ` : ""}${col.label}`}
                                                placement="top"><span>{col?.value == "product" || col?.value == "keyword" ? `${subTitle} - ` : ""}{col.label}</span></CustomTooltip>
                                            <span className="align-[super]">
                                                {col.sortable && <FaSort className="inline h-3 w-3" />}
                                            </span>
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>

                        {getSortedRows((rowData?.length ? rowData : data ?? []))?.map((row, i) => {
                           
                            const selected = ((row?.is_brand != undefined && row?.name != undefined) ? ((selectedBrand?.is_brand == undefined ? true : selectedBrand?.is_brand) == row?.is_brand && ((selectedBrand?.brand ?? row?.name) == row?.name)) : false);//isRowSelected(row);
                            const isStriped = i % 2 === 0 ? "white" : "#F9FAFA";
                            return (
                                <tr
                                    key={i}
                                    className={`cursor-pointer border-none `}
                                    onClick={() => setSelectedBrand?.({ is_brand: row?.is_brand, brand: row?.name })}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={col.value}
                                            className={`group 
                                              py-2 border-none 
                                                 ${columns.length > 3 ? "px-2" : "px-4"}
                                                ${col.align === "left" ? "text-left" :
                                                    col.align === "right" ? "text-right" : "text-center"}
                                                 ${((colIndex === 0 && i != 0 && useFor == "brand_competition_analysis") || (colIndex === 0 && useFor != "brand_competition_analysis")) ? "sticky-column-0" : ""}
                                                 ${type == "parent" && i == 0 ? "sticky-header-0" : ""}
                                                 ${colIndex === 0 && type == "parent" && i == 0 ? "sticky-intersect" : ""}
                                            `}
                                            style={{
                                                background: selected ? "#E8F4FF" : isStriped,
                                                width: colIndex < 1 ? '200px' : '150px',
                                                minWidth: colIndex < 1 ? '200px' : '150px',
                                                maxWidth: colIndex < 1 ? '200px' : '230px',
                                            }}
                                        >
                                            {/* Handle checkbox column with flex wrapper */}
                                            {(
                                                /* Render for non-checkbox columns */
                                                <>

                                                    {(col.value === "name" || col.value === "platform" || col.value === "location" || col.value === "product" || col.value === "keyword") ? (

                                                        <div className="flex items-center gap-2 w-full">
                                                            {(col.value === "product" && row?.["pdp_image_url"]) ? <div className="w-[10%] h-6"><img src={row?.["pdp_image_url"] ?? ""} alt={row?.[col.value]} className="oos-plat-img w-full h-full object-contain" /></div> : <></>}
                                                            <div className="w-[80%] flex justify-start">
                                                                <CustomTooltip title={row?.[col.value] ?? row?.name ?? "-"} placement="top">
                                                                    <span>{row?.[col.value] ?? row?.name ?? "-"}</span>
                                                                </CustomTooltip>
                                                                {(row?.[col.value] ?? row?.name) && <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(row?.[col.value] ?? row?.name)) }}><IoMdCopy /></span>}
                                                            </div>
                                                        </div>
                                                    ) : (col.value === "sku_id" || col.value === "skuId") ? (
                                                        <div className="flex justify-start">
                                                            <CustomTooltip title={row?.[col.value] ?? row?.skuId ?? "-"} placement="top">
                                                                <span>{row?.[col.value] ?? row?.skuId ?? "-"}</span>
                                                            </CustomTooltip>
                                                            {(row?.[col.value] ?? row?.skuId) && <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(row?.[col.value] ?? row?.skuId)) }}><IoMdCopy /></span>}
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
                    {hideFooter ? <></> :
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
                                                `}
                                            style={{
                                                width: colIndex < 1 ? "200px" : "150px",
                                                minWidth: colIndex < 1 ? "200px" : "150px",
                                                maxWidth: colIndex < 1 ? "200px" : "230px",
                                                background: "#FFFFFF",
                                            }}
                                        >
                                            <div className={`font-normal text-md  flex flex-col 
                                                    ${col.align === "left" ? "px-3" :
                                                    col.align === "right" ? "items-right" : "items-center"}
                                                        `}>
                                                <span>{col?.type == "parameters" ? "Avg" : "Total"} {col?.label || summary?.label}</span>
                                                <p className="font-semibold text-[15px] flex flex-start">{summary?.value ? (renderCell(col, summary)) : "-"}</p>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        </tfoot>}
                </table>
            </div>

            {/* Footer */}
            {/* <div className="flex justify-between mt-4 text-xs text-gray-600">
                <div className="w-full flex flex-col items-center font-normal text-md">
                    Total{" "}
                    {title.includes("Platform")
                        ? "Platform"
                        : title.includes("Location")
                            ? "Location"
                            : "Product"}
                    <p className="font-semibold text-lg">{footer?.total}</p>
                </div>
                <div className="w-full flex flex-col items-center font-normal text-md">Avg OSA <p className="font-semibold text-lg">{footer?.avgOSA}%</p></div>
                <div className="w-full flex flex-col items-center font-normal text-md">Wgt OSA <p className="font-semibold text-lg">{footer?.wtOSA}%</p></div>
            </div>  */}
        </div>
    )
}

export default CompetitionTable
