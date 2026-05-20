import { useEffect, useMemo, useRef, useState } from "react";
import { FaSort } from "react-icons/fa";
import { IoMdArrowDropup, IoMdArrowDropdown, IoMdCopy } from "react-icons/io";
import { useEbuxContext } from "../../Context/EbuxProvider";
import { fetchDrillDownData } from "../osaWidgets/osaPerformanceOverview/services/drillDown.service";

import DrawerComponent from "../osaWidgets/osaPerformanceOverview/Components/DrawerComponent";
import Drawer from 'react-modern-drawer';
import { isEqual } from "lodash";
import Excel from "exceljs";
import CustomTooltip from "../osaWidgets/osaPerformanceOverview/Components/DrawerComponent/customTooltip/CustomTooltip";
import Loader from "../../common-components/Loader";
import { copyToClipboard, getTextFromReactNode } from "../../../../utils/helpers";
const KeywordTypeTable = ({
    matrix = [],
    currentView,
    activeIndex,
    selectedOption,
    // title,
    // data=[],
    footer,
    columns = []
}) => {
    const [innerView, setInnerView] = useState(null);
    const {
        kpi,
        selectedFilters, filters, activeClientProject
    } = useEbuxContext();
    const [apiResponse, setApiResponse] = useState([]);
    const [loading, setLoading] = useState(false);
    const { rowData, footerData } = useMemo(() => {
        if (apiResponse?.rowData) {
            const { rowData, footerData } = apiResponse;
            return { rowData, footerData };

        } else {
            return { rowData: [], footerData: {} };
        }

    }, [JSON.stringify(apiResponse)]);

    const fetchData = async (innerViewCall = null) => {

        if (!currentView || !activeIndex) return;
        setLoading(true);
        let payload = {
            kpi,
            sos_type: selectedOption,
            drillDown: innerViewCall ? 'keyword' : 'keyword_type',
            breakdown: ['keyword_type'],
            matrix: matrix,
            key: currentView ?? "",
            value: activeIndex ?? "",
            selectedFilters: { ...selectedFilters, ...(innerViewCall ? { selectedKeywordType: [{ value: innerViewCall, label: innerViewCall }] } : {}) },
            filters
        };

        const response = await fetchDrillDownData(payload);
        setApiResponse(response);
        setLoading(false);
    }

    const previousCombinedState = useRef({});
    useEffect(() => {
        const combinedState = JSON.stringify({ ...{ selectedOption }, ...{ currentView }, ...{ activeIndex }, ...{ columns }, ...{ selectedFilters: { ...selectedFilters, selected_sos_type: "" } } });

        if (!isEqual(previousCombinedState.current, combinedState)) {
            previousCombinedState.current = combinedState;
            fetchData(null);
            setInnerView(null);
        }
    }, [selectedOption, currentView, activeIndex, JSON.stringify(columns), JSON.stringify({ ...selectedFilters, selected_sos_type: "" })]);

    useEffect(() => {
        if (innerView) {
            if (innerView == "reset->to->keyword->type") {
                fetchData(null);
                setInnerView(null);
            } else {
                fetchData(innerView);
            }
        }
        // setInnerView(null);
    }, [innerView]);

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
        if (!sortConfig.key) return rows;
        return [...rows].sort((a, b) => {
            if(sortConfig.key=='keyword_type' || sortConfig.key=='keyword'){
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig?.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig?.direction === "asc" ? 1 : -1;
                }
            }else{
                if (a[sortConfig.key]?.value < b[sortConfig.key]?.value) {
                    return sortConfig?.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key]?.value > b[sortConfig.key]?.value) {
                    return sortConfig?.direction === "asc" ? 1 : -1;
                }
            }
            
            return 0;
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
        <div className="flex gap-2 items-center ">
            {
                metric?.value ?
                <div className="flex justify-start">
                    <span className="font-medium">{showValue(col, metric?.value)}</span>
                    <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.value))) }}><IoMdCopy/></span>
                    </div>
                    : <>-</>
            }
            {
                metric?.value && metric?.reference ?
                    (
                    <div className="flex justify-start">
                        <span className="text-gray-400 text-xs">{showValue(col, metric?.reference)}</span>
                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.reference))) }}><IoMdCopy/></span>
                    </div>
                    )
                    :
                    (<></>)
            }

            {metric?.value && metric?.reference && metric?.delta ?
                metric?.delta >= 0 ? (
                    <span className="text-[#329900] flex items-center gap-1 text-xs px-1 py-0.5 border border-[#B7EB8F] bg-[#E8FFEB] rounded-full">
                        <IoMdArrowDropup size={14} /> {showValue(col, metric?.delta)}
                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.delta))) }}><IoMdCopy/></span>
                    </span>
                ) : (
                    <span className="text-[#DD4242] flex items-center gap-1 text-xs px-1 py-0.5 border bg-[#FFF1F0] border-[#FFA39E] rounded-full">
                        <IoMdArrowDropdown size={14} /> {showValue(col, Math.abs(metric?.delta))}
                        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.delta))) }}><IoMdCopy/></span>
                    </span>
                ) :
                <></>
            }
        </div>
    );

    const [drawerInfo, setDrawerInfo] = useState({
        isOpen: false,//false//true
        title: activeClientProject?.useWeightedSOS ? "Wt. SOS Performance" : "SOS Performance",
        data: {}
        // ?? {
        //     performanceOf: "brand",//brand/category
        //     value: "Apple",
        // }

    })
    const closeDrawer = () => {
        setDrawerInfo(pre => ({
            ...pre,
            isOpen: false,
            data: {}
        }))
    }

    const handleDownload = async () => {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Keyword Type Data");

        if (rowData?.length > 0) {
            // 1️⃣ Build headers dynamically
            const headers = [];

            columns.forEach((col) => {
                if (col.type === "parameters") {
                    headers.push(col.label); // value col

                    // Check if reference / delta exist in ANY row for this col
                    const hasReference = rowData.some(
                        (r) => r[col.value]?.reference !== undefined
                    );
                    const hasDelta = rowData.some(
                        (r) => r[col.value]?.delta !== undefined
                    );

                    if (hasReference) headers.push(`${col.label} Pervious`);
                    if (hasDelta) headers.push(`${col.label} Delta`);
                } else {
                    headers.push(col.label); // keyword_type or plain text col
                }
            });

            worksheet.addRow(headers);

            // 2️⃣ Build rows dynamically
            rowData.forEach((row) => {
                const values = [];

                columns.forEach((col) => {
                    if (col.type === "parameters") {
                        values.push(row[col.value]?.value ?? "-");

                        if (row[col.value]?.reference !== undefined)
                            values.push(row[col.value].reference);

                        if (row[col.value]?.delta !== undefined)
                            values.push(row[col.value].delta);
                    } 
                    else {
                        values.push(row[col.value] ?? row['keyword'] ?? "-");
                    }
                });

                worksheet.addRow(values);
            });
        }

        // 3️⃣ Download Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `keyword_type_table_${Date.now()}.xlsx`;
        link.click();
    };


    return (

        <>
            <div className="bg-white border rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="flex text-lg font-semibold relative">

                        <button
                            onClick={() => {
                                if (innerView) {
                                    setInnerView("reset->to->keyword->type");
                                }
                            }}
                            className="ml-[6px]"
                        >

                            <p className="flex items-center gap-2">{innerView ? "<-" : ""} Tabular View {loading && <Loader show={loading} fullScreen={false} />}</p>

                        </button>

                        <p className=" h-[35px] pt-[7px] pr-[10px] pb-[7px] pl-[10px] gap-[5px] ml-4 rounded-[8px] border border-[1px] border-gray-300 bg-[#E7F4FF] border border-[#6EBAFF]">
                            <p className="font-inter font-normal text-[14px] leading-[100%] tracking-[0] relative">{currentView}: {activeIndex}
                                <button
                                    onClick={() => {
                                        setDrawerInfo(prev => ({
                                            ...prev,
                                            isOpen: true,
                                            data: {
                                                item: {},
                                                icon: currentView === "brand" ? "brandIcon" : "categorytIcon",
                                                performanceOf: currentView,
                                                value: activeIndex
                                            }
                                        }))
                                    }}
                                    className="ml-[6px]"
                                >
                                    <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 8.80469C7.13333 8.13802 7.46667 7.67135 8 7.13802C8.66667 6.53802 9 5.67135 9 4.80469C9 3.74382 8.57857 2.72641 7.82843 1.97626C7.07828 1.22611 6.06087 0.804688 5 0.804688C3.93913 0.804688 2.92172 1.22611 2.17157 1.97626C1.42143 2.72641 1 3.74382 1 4.80469C1 5.47135 1.13333 6.27135 2 7.13802C2.46667 7.60469 2.86667 8.13802 3 8.80469M3 11.4714H7M3.66667 14.138H6.33333" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                </button>
                            </p>

                        </p>

                    </h2>
                    <button className="border rounded-md px-2 py-1"><img
                        src="/assets/images/downloadIcon.svg"
                        width={22}
                        height={22}
                        onClick={handleDownload}
                    /></button>
                </div>

                <div className="w-full h-[455px] flex flex-col">
                    {/* Table */}
                    <div className="overflow-x-auto overflow-y-auto flex-1">
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
                        <table className="min-w-full rounded-lg border-0 sticky-table" style={{ minHeight: '500px' }}>
                            <thead >
                                <tr className="bg-gray-50 text-gray-600 text-sm border-0 ">
                                    {columns.map((col, colIndex) => {
                                        let label = col.label;
                                        if (col?.value == "keyword_type" && innerView) {
                                            label = `Keyword (${innerView} Type)`;
                                        }
                                        return (
                                            <th
                                                key={col.key}
                                                onClick={col.sortable ? () => handleSort(innerView?'keyword':col.value) : undefined}
                                                className={`font-inter font-medium text-[14px] leading-[100%] tracking-[0] text-center text-[#000000] 
                                                    ${col.align} border-0
                                                    ${colIndex === 0 ? "sticky-column-header-0" : ""}
                                                    sticky-header
                                                `}
                                            >
                                                <div className={`flex w-[251.625px]  opacity-100 gap-[4px] p-4 bg-[#F6F9FB] border-0`}>

                                                    <span>{(col?.value == "keyword" || col.value == "keyword_type" || selectedOption == "Overall") ? label : selectedOption + " " + col.label}</span>
                                                    {col.sortable && <FaSort className="inline h-3 w-3" />}
                                                </div>
                                            </th>
                                        )
                                    }
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {getSortedRows(rowData)?.map((row, i) => {
                                    // const selected = isRowSelected(row);
                                    const selected = false;
                                    const isStriped = i % 2 === 0 ? "white" : "#F9FAFA";
                                    return (
                                        <tr
                                            key={i}
                                            className={`cursor-pointer border-none `}
                                        // onClick={() => handleSelection('row', row)} 
                                        >
                                            {columns.map((col, colIndex) => (
                                                <td
                                                    key={col.value}
                                                    className={`group px-6 py-2 border-none text-left ${colIndex === 0 ? "sticky-column-0" : ""}`}
                                                    style={{
                                                        background: selected ? "#f2f8ff" : isStriped,
                                                        width: (col.key == "product" ? colIndex < 1 : colIndex < 1) ? "200px" : "150px",
                                                        minWidth: (col.key == "product" ? colIndex < 1 : colIndex < 1) ? "200px" : "150px",
                                                        maxWidth: (col.key == "product" ? colIndex < 1 : colIndex < 1) ? "200px" : "200px",
                                                        borderTopLeftRadius: colIndex == 0 ? "12px" : "0px",
                                                        borderBottomLeftRadius: colIndex == 0 ? "12px" : "0px",
                                                    }}
                                                >
                                                    {(
                                                        /* Render for non-checkbox columns */
                                                        <>
                                                            {
                                                                (col?.value == "keyword_type" && !innerView) ?
                                                                    <div className="text-blue-700 hover:text-blue-500" onClick={() => {
                                                                        if (col?.value == "keyword_type" && !innerView) {
                                                                            setInnerView(row?.[col.value]);
                                                                        }
                                                                    }}>

                                                                        <CustomTooltip title={row?.[col.value] ?? row?.name} placement="top">

                                                                            <div className="flex justify-start">
                                                                                {row?.[col.value]}
                                                                                {(row?.[col.value]) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(row?.[col.value] ?? "-")) }}><IoMdCopy/></span>:""}
                                                                            
                                                                            </div>
                                                                        </CustomTooltip>
                                                                    </div>
                                                                    : ((col?.value == "keyword_type" || col?.value == "keyword") && innerView) ?

                                                                        <div className="flex justify-start">
                                                                        {row?.['keyword']}
                                                                        {(row?.['keyword']) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(row?.['keyword'] ?? "-")) }}><IoMdCopy/></span>:""}
                                                                        </div> :
                                                                        (col?.value) && renderCell(col, row?.[col.value] ?? "-")
                                                                        
                                                            }
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
                                        let label = col.label;
                                        let val = col.value;
                                        if (col?.value == "keyword_type" && innerView) {
                                            label = `Keyword (${innerView} Type)`;
                                            val = "keyword";
                                        }
                                        const summary = (footerData ?? footer)?.[val] ?? {};
                                        return (
                                            <td
                                                key={col.value}
                                                className={`group
                                                p-2 px-6 border-none text-xs text-gray-600 text-center
                                                 
                                               ${colIndex === 0 ? "sticky-column-0" : ""}
                                                `}
                                                style={{
                                                    width: colIndex < 1 ? "200px" : "150px",
                                                    minWidth: colIndex < 1 ? "200px" : "150px",
                                                    maxWidth: colIndex < 1 ? "200px" : "200px",
                                                    background: "#FFFFFF",
                                                }}
                                            >
                                                <div className={`w-full flex flex-col ${col?.type == 'parameters' ? 'items-left' : 'items-baseline'} font-normal text-md`}>
                                                    <span className="text-left">{label || summary?.label}</span>
                                                    <p className="font-semibold text-lg">{summary?.value ? (renderCell({ ...col, value: val }, summary)) : "-"}</p>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tfoot>
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
                    <p className="font-semibold text-lg">{footer.total}</p>
                </div>
                <div className="w-full flex flex-col items-center font-normal text-md">Avg OSA <p className="font-semibold text-lg">{footer.avgOSA}%</p></div>
                <div className="w-full flex flex-col items-center font-normal text-md">Wgt OSA <p className="font-semibold text-lg">{footer.wtOSA}%</p></div>
            </div> */}
                </div>

            </div>
            {drawerInfo.isOpen && (
                <Drawer
                    open={drawerInfo?.isOpen}
                    onClose={closeDrawer}
                    direction='right'
                    style={{ width: '90%' }}
                    className='performanceDrawerWrap'
                >
                    <DrawerComponent onClose={closeDrawer} drawerInfo={drawerInfo} />
                </Drawer>
            )}</>
    )
}

export default KeywordTypeTable
