// import { useEbuxContext } from "../../../Context/EbuxProvider";
// import { IoMdCopy } from "react-icons/fa";
import { IoMdCopy } from "react-icons/io";
import { useEffect, useMemo, useRef, useState } from "react";
import SortingButton from "../DynamicSortButton";
import "./StickyTable.css";
// import { isEqual } from "lodash";
import Excel from "exceljs";
import { TbPin, TbPinFilled, TbPinnedOff } from "react-icons/tb";
import { FaInfoCircle } from "react-icons/fa";
import moment from "moment";

// import { LuIndianRupee } from "react-icons/lu";

import LoaderSpinner from "../../../../common-components/loader-spinner";
import { useEbuxContext } from "../../../Context/EbuxProvider";
import RelatedTags from "./relatedTags";
import { copyToClipboard } from "../../../../../utils/helpers";
import { IoIosRedo } from "react-icons/io";
import InfoTooltip from "../../../ds2.0/common-components/InfoTooltip";
import { CiFilter } from "react-icons/ci";

const COMPETITION_PARAMETERS = [
    "competition_sos", "competition_som", "competition_osa", "competition_price_variation",
    "competition_price_rp", "competition_price_sp"
    , "competition_ad_rank", "competition_sod", "competition_number_of_banners",
    "competition_review_count", "competition_rating_value",
];

const COMPETITION_BREAKDOWNS = [
    "competition_brand", "competition_web_pid", "competition_sku_name", "competition_banner", "competition_ppg"
];

const filterHeader = (header, type, excludeValues = [], includeValues = []) => {
    return header?.filter(data =>
        data?.type === type &&
        (!excludeValues.length || !excludeValues.includes(data?.value)) &&
        (!includeValues.length || includeValues.includes(data?.value))
    );
};

const BreakdownTable = ({
    filters,
    kpi, openDrawer, openBannerDrawer, breakdownTabData, skuTabData, data, header, sortConfig, setSortConfig, selectedTabKey, selectedTabName, selectedTableRows, setSelectedTableRows,
    downloadkey, setDownloadkey, setLoading,

    setOpenMFilter,
}) => {
    const parameters = useMemo(() =>
        filterHeader(header, "parameters", COMPETITION_PARAMETERS), [header]);
    const competition_parameters = useMemo(() =>
        filterHeader(header, "parameters", [], COMPETITION_PARAMETERS), [header]);
    const breakdowns = useMemo(() =>
        filterHeader(header, "breakdown", COMPETITION_BREAKDOWNS), [header]);
    const competition_breakdowns = useMemo(() =>
        filterHeader(header, "breakdown", [], COMPETITION_BREAKDOWNS), [header]);



    const {
        sortPlatforms,
        activeClientProject
    } = useEbuxContext();
    const loadRowSize = 50;
    //  const {
    //      sortPlatforms,

    //   } = useEbuxContext();
    const [isLazyLoading, setIsLazyLoading] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [footerData, setFooterData] = useState({});
    const [itemsToShow, setItemsToShow] = useState(loadRowSize);

    const showTag = (["SOS", "OR"].indexOf(kpi) > -1 && selectedTabName == "Keyword" || ["OSA", "CS", "PRO", "RR"].indexOf(kpi) > -1 && selectedTabName == "SKU") ? true : false;

    const [isShowTag, setIsShowTag] = useState(showTag)

    const [stickyColumns, setStickyColumns] = useState([0, 1]);
    useEffect(() => {
        const _isShowTag = (["SOS", "OR"].indexOf(kpi) > -1 && selectedTabName == "Keyword" || ["OSA", "CS", "PRO", "RR"].indexOf(kpi) > -1 && selectedTabName == "SKU") ? true : false;
        setIsShowTag(_isShowTag);
        setStickyColumns([0, 1])
        if (selectedTabName == "Platform") {
            setSortConfig({ key: null, direction: null });
        }
    }, [kpi, selectedTabName])
    const [columnWidths, setColumnWidths] = useState([]);
    const tableRef = useRef(null);
    const containerRef = useRef(null);
    const handleStickyColumnClick = (index) => {
        setStickyColumns(Array.from({ length: index + 1 }, (_, i) => i));
    };

    useEffect(() => {
        const widths = [];
        if (tableRef.current && data?.length) {
            const headerCells = tableRef.current.querySelectorAll("th");
            headerCells.forEach((cell) => {
                widths.push(cell.getBoundingClientRect().width);
            });

            if (widths.length != columnWidths.length)
                setColumnWidths(widths);
        }
        if (data?.length) {
            const row = data.slice(0, -1);
            setRowData(row);

            const footerd = data.slice(-1);
            setFooterData(footerd[0]);
        }
    }, [kpi, selectedTabName, data]);
    const sortedData = useMemo(() => {
        if (sortConfig?.key) {
            return [...rowData].sort((a, b) => {
                const valueA = a?.[sortConfig.key];
                const valueB = b?.[sortConfig.key];

                if (valueA == null && valueB == null) return 0;
                if (valueA == null) return sortConfig.direction === 'ASC' ? -1 : 1;
                if (valueB == null) return sortConfig.direction === 'ASC' ? 1 : -1;

                const numA = !isNaN(valueA) ? parseFloat(valueA) : valueA;
                const numB = !isNaN(valueB) ? parseFloat(valueB) : valueB;

                if (numA < numB) return sortConfig.direction === 'ASC' ? -1 : 1;
                if (numA > numB) return sortConfig.direction === 'ASC' ? 1 : -1;
                return 0;
            });
        }
        return rowData;
    }, [rowData, sortConfig]);



    const visibleData = useMemo(() => sortedData?.slice(0, itemsToShow), [sortedData, itemsToShow]);

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;

        if (scrollHeight - scrollTop - clientHeight < loadRowSize && !isLazyLoading && itemsToShow < data.length) {
            setIsLazyLoading(true);
            setTimeout(() => {
                setItemsToShow((prev) => prev + loadRowSize);
                setIsLazyLoading(false);
            }, 1500);
        }
    };
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);

        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [isLazyLoading, data]);

    const getHeaderIcon = (icon) => {
        switch (icon) {
            case "rupee":
                return "₹ ";
            default:
                return (icon) ? icon + " " : "";
        }
    }
    const getFormatValue = (_value, headerdata, download = false) => {
        const currentValue = `${_value != undefined && headerdata?.icon ? getHeaderIcon(headerdata?.icon) : ""}${_value != undefined ? (headerdata?.value == "last_in_stock") ? moment(new Date(_value))?.format("DD-MM-YYYY") : (headerdata?.value == "competition_price_rp" || headerdata?.value == "competition_price_sp" || headerdata?.value == "price_rp" || headerdata?.value == "price_sp") ? (([101, 102, 103].indexOf(activeClientProject?.client_project_id) > -1) ? _value : Math.round(_value)) : _value : "-"}${_value != undefined && headerdata?.subValue ? headerdata?.subValue : ""}${_value != undefined && headerdata?.persentageValue ? "%" : ""}`
        // return `${_value != undefined && headerdata?.icon ? getHeaderIcon(headerdata?.icon) : ""}${_value != undefined ? _value : "-"}${_value != undefined && headerdata?.subValue ? headerdata?.subValue : ""}${_value != undefined && headerdata?.persentageValue ? "%" : ""}`;
        //MRP and SP price should be rounded like 123.45 to 123 
        // return `${_value != undefined && headerdata?.icon ? getHeaderIcon(headerdata?.icon) : ""}${_value != undefined ? (headerdata?.value == "last_in_stock") ? moment(new Date(_value))?.format("DD-MM-YYYY") : (headerdata?.value == "competition_price_rp" || headerdata?.value == "competition_price_sp" || headerdata?.value == "price_rp" || headerdata?.value == "price_sp") ? Math.round(_value) : _value : "-"}${_value != undefined && headerdata?.subValue ? headerdata?.subValue : ""}${_value != undefined && headerdata?.persentageValue ? "%" : ""}`;

        return download ? currentValue : (
            <div className="flex justify-start">
                {currentValue} {_value != undefined && _value ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, currentValue) }}><IoMdCopy /></span> : ""}
            </div>
        )
    }


    const headerkey = [];
    [breakdowns, parameters, competition_breakdowns, competition_parameters].forEach(list => {
        list?.forEach(item => {
            if (item?.value) {
                headerkey.push({ ...item });
            }
        });
    });

    const [activeTooltip, setActiveTooltip] = useState(null);
    const [activeDarkStoreTooltip, setActiveDarkStoreTooltip] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                activeTooltip &&
                !document.getElementById("tooltip-container")?.contains(event.target)
            ) {
                setActiveTooltip(null);
            } else if (
                activeDarkStoreTooltip &&
                !document.getElementById("tooltip-container")?.contains(event.target)
            ) {
                setActiveDarkStoreTooltip(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeTooltip, activeDarkStoreTooltip]);
    const toggleTooltip = (id) => {
        setActiveTooltip((prev) => (prev === id ? null : id));
    };

    let perValue = {};
    const getShowValue = (header, item, samePerValue = false) => {
        if (header?.type == "breakdown") {
            if (item?.[header.value]) {
                if (perValue[header.value] != item?.[header.value] || samePerValue || (sortConfig?.key && sortConfig?.key != headerkey?.[0].value)) {
                    perValue[header.value] = item?.[header.value];
                    perValue[`${header.value}_item`] = item?.[`${header.value}_item`];
                    return item?.[header.value]
                } else {
                    if (perValue[`${header.value}_item`]?.value != item?.[`${header.value}_item`]?.value && perValue[`${header.value}_item`]?.label == item?.[`${header.value}_item`]?.label) {
                        perValue[header.value] = item?.[header.value];
                        perValue[`${header.value}_item`] = item?.[`${header.value}_item`];
                        return item?.[header.value];
                    } else {
                        return "";
                    }

                }
            } else {
                perValue[header.value] = item?.[header.value];
                if (header.value.indexOf("competition_") > -1) {
                    let retAll = false;
                    competition_parameters?.forEach(param => {
                        if (param?.value && item?.[param?.value]) {
                            retAll = true;
                        }
                    });
                    return retAll ? "All" : item?.[header.value];

                } else {
                    return "All";
                }
            }
        }
        return item?.[header.value];

    }


    const requestSort = key => {
        setLoading(true);
        let direction = 'ASC';
        if (sortConfig.key === key && sortConfig.direction === 'ASC') {
            direction = 'DSC';
        }
        setSortConfig({ key, direction });
        setTimeout(() => setLoading(false), 500);
    };



    const getFilteredData = (index) => {
        console.log("breakdowntabdata", breakdownTabData);

        const filteredData = breakdownTabData?.filter((item) => item?.value === index?.value && item?.lable === index?.lable);
        return filteredData?.[0];
    }
    const getSKUFilteredData = (index) => {
        const filteredData = skuTabData?.filter((item) => item?.value === index?.value && item?.lable === index?.lable);
        return filteredData?.[0];
    }

    const isSelectAllChecked = breakdownTabData?.length > 0 && sortedData.length > 0 && selectedTableRows?.[selectedTabKey]?.length > 0 && selectedTableRows?.[selectedTabKey]?.length === breakdownTabData?.length;
    const handleSelectAll = () => {
        if (isSelectAllChecked) {
            setSelectedTableRows((data) => ({ ...data, [selectedTabKey]: [] }));
        } else {
            setSelectedTableRows((data) => ({ ...data, [selectedTabKey]: breakdownTabData }));
        }
    };
    // const handleRowSelect = (index) => {
    //     setSelectedTableRows((prevData) => {
    //         const currentSelections = prevData?.[selectedTabKey] || [];
    //         const isSelected = currentSelections?.length && currentSelections.some((item) => item?.value === index?.value);
    //         if (isSelected) {
    //             return {
    //                 ...prevData,
    //                 [selectedTabKey]: currentSelections.filter((item) => item?.value !== index?.value),
    //             };
    //         } else {
    //             const filteredData = getFilteredData(index);
    //             return {
    //                 ...prevData,
    //                 [selectedTabKey]: [...currentSelections, filteredData],
    //             };
    //         }
    //     });
    // };
    const handleRowSelect = (index = { value: '', lable: '' }) => {
        // Ensure valid data shape
        const safeIndex = {
            value: index.value?.toString() || '',
            lable: index.lable?.toString() || '',
            ...index
        };

        setSelectedTableRows(prev => {
            const current = prev?.[selectedTabKey] ?? [];
            const exists = current.some(item =>
                item.value === safeIndex.value &&
                item.lable === safeIndex.lable
            );

            return {
                ...prev,
                [selectedTabKey]: exists
                    ? current.filter(item =>
                        !(item.value === safeIndex.value && item.lable === safeIndex.lable)
                    )
                    : [...current, safeIndex]
            };
        });
    };

    const handleDownload = () => {
        setDownloadkey('');
        perValue = {};
        const headers = headerkey?.map((header) => ({ header: header.title, key: header.value, width: 25 }))
        const workbook = new Excel.Workbook();
        const title = `${selectedTabName} ${kpi} Report`;
        const worksheet = workbook.addWorksheet(title);
        worksheet.columns = headers;
        rowData && rowData.forEach((row) => {
            let _data = {};
            let per_has_val = true;

            headerkey?.forEach((header, i) => {
                const show = i > 0 && per_has_val;
                const val = getShowValue(header, row, show);
                per_has_val = val ? true : false;

                // _data[header.value] = val ?? "-";
                // _data[header.value] += (val && header.persentageValue ? " %" : "")
                _data[header.value] = getFormatValue(val, header, true);
            });
            worksheet.addRow(_data);
        });
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${kpi}_${selectedTabName}_performance_${Date.now()}.xlsx`;
            link.click();
        });
    };

    useEffect(() => {
        if (downloadkey == selectedTabName) {
            handleDownload();
        }
    }, [downloadkey])


    const toggleDarkStoreTooltip = (id) => {
        setActiveDarkStoreTooltip(activeDarkStoreTooltip === id ? null : id);
    };
    let per_has_val = true;
    // let previousColType = "breakdown";
    const renderBodyCol = (index, i, header, row) => {
        const tdIndex = (i + (1));
        const show = i > 0 && per_has_val;
        let val = getShowValue(header, row, show);
        per_has_val = val ? true : header?.type != "breakdown" ? true : false;
        // previousColType = header?.type;
        if (header?.value == "sku_name" && header?.type == "breakdown" && val) {
            return (
                <>
                    <td key={index + i} className={`group ${header.value}_col ${stickyColumns?.includes(tdIndex) ? `sticky ${header.value == "sku_name" ? "sticky_sku_name" : ""}` : ""} ${activeTooltip === `${index}_${i}_${val}` ? 'activeSkuTd !z-[3]' : 'z-[1]'}`}

                        style={{
                            left: stickyColumns?.includes(tdIndex)
                                ? `${columnWidths
                                    .slice(0, stickyColumns?.indexOf(tdIndex))
                                    .reduce((acc, width) => acc + width, 0)}px`
                                : undefined,
                        }}
                    >
                        <div className={`relative z-[1]`}>
                            <div className="flex flex-row gap-2 justify-between skuProductName">
                                <div className="relative w-[250px]">
                                    {
                                        val
                                            ?
                                            <p className="flex justify-start">
                                                {

                                                    val.length > 35
                                                        ? `${val.slice(0, 35)}`
                                                        : <><span>{val}</span><span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, val) }}> <IoMdCopy /></span></>
                                                }
                                            </p>
                                            :
                                            "-"
                                    }

                                    {val && val.length > 35 ?
                                        <p className="flex justify-first">
                                            <span
                                                onClick={(e) => { e.stopPropagation(); toggleTooltip(`${index}_${i}_${val}`) }} // Pass a unique ID or index
                                                className="cursor-pointer catTxtBlue"
                                                title=""
                                            >
                                                ...
                                            </span>
                                            {val && (<span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, val) }}> <IoMdCopy /></span>)}
                                        </p>
                                        : ""}
                                </div>
                            </div>


                            {activeTooltip === `${index}_${i}_${val}` && (
                                <div className="tblTooltip" id="tooltip-container" onClick={(e) => e.stopPropagation()}>
                                    <div className='flex flex-row items-start'>
                                        <p className="flex justify-first"><span> {val ?? "-"}</span><span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, val) }}>{val && <IoMdCopy />}</span></p>
                                        <button className="tblTooltipClose" onClick={() => setActiveTooltip(null)}>
                                            <img src="/assets/images/clear-icon-white.svg" width={18} height={18} alt="" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </td>
                    {
                        isShowTag ?
                            <td key={index + i + "tag"} className="group min-w-[120px] max-w-[250px]"
                            // style={{
                            //     left: stickyColumns?.includes(1)
                            //         ? `${columnWidths
                            //             .slice(0, stickyColumns?.indexOf(1))
                            //             .reduce((acc, width) => acc + width, 0)}px`
                            //         : undefined,
                            // }}

                            >
                                {
                                    val && (
                                        <RelatedTags tagType={(selectedTabName == "Keyword" ? "Keyword" : "Product")} relatedTo={selectedTabName == "Keyword" ? row?.keyword : row?.web_pid} />
                                    )}
                            </td>
                            : <></>
                    }
                </>
            )
        }

        const web_pid_data = header?.value == "web_pid" ? getSKUFilteredData(row?.[`${header?.value}_item`]) : {};
        const dark_store_info = header?.value == "darkstore" ? get_dark_store_info(row?.[`${header?.value}`]) : {};

        const dark_store_info_value = dark_store_info?.address != '0' ? dark_store_info?.address : dark_store_info?.locality != '0' ? dark_store_info.locality : `${dark_store_info?.city}, ${dark_store_info?.state} - ${dark_store_info?.pincode}`;

        if (i == 0 && header?.type == "breakdown" && val) {
            // const drawer_data = getFilteredData(row?.[`${headerkey?.[0].value}_item`]);
            return (
                <>
                    <td key={index + i}
                        className={`group secondCol ${header?.value == "darkstore" && activeDarkStoreTooltip === dark_store_info?.value ? 'activeSkuTd !z-[3]' : 'z-[1]'}  ${stickyColumns?.includes(tdIndex) ? ` sticky ${header.value == "darkstore" ? "sticky_sku_name" : ""}` : ""}`}
                        style={{
                            left: stickyColumns?.includes(tdIndex)
                                ? `${columnWidths
                                    .slice(0, stickyColumns?.indexOf(tdIndex))
                                    .reduce((acc, width) => acc + width, 0)}px`
                                : undefined,
                        }}
                    >
                        {
                            (kpi == 'SOD' && header.value == 'banner') ?
                                <div className='flex flex-row gap-2 justify-between' data-value={`${header.value}`}>
                                    <div className="flex gap-2">
                                        {val && row?.["banner_item"]?.value ?
                                            <img src={row?.["banner_item"]?.value} className="rounded-[4px]" width={82.73} height={42} />
                                            : <></>}

                                        <div>
                                            {/* <p className="flex-grow text-[10px] leading-[18px] m-0">{row?.["banner_item"]?.value || "-"} </p> */}
                                            <p className="flex-grow flex justify-first text-[10px] leading-[18px] m-0"><span>{val || "-"}</span> {val && <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, val) }}> <IoMdCopy /></span>}</p>
                                        </div>
                                    </div>
                                    {val && row?.["banner_item"]?.value ?
                                        <button className='breakdownChartIcon' type="button" onClick={() => {

                                            openBannerDrawer(row?.["banner_item"], 'brand')
                                        }}><img src="/assets/images/full-screen.png" width={18} height={18} /></button>
                                        : <></>}
                                </div>
                                :
                                <div className={`relative z-[1] `}>
                                    <div className='flex flex-row gap-2 justify-between items-center'>
                                        <p className="flex-grow flex justify-first"><span>{val || "-"}</span> {val && <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, val) }}> <IoMdCopy /></span>}</p>
                                        {header?.value == "darkstore" && val && dark_store_info ?
                                            <>
                                                <button className="p-2 rounded-full hover:bg-gray-300" onClick={() => toggleDarkStoreTooltip(dark_store_info?.value)}>
                                                    <FaInfoCircle className="w-5 h-5 text-gray-600" />
                                                </button>
                                                {activeDarkStoreTooltip === dark_store_info?.value && (
                                                    <div className="tblTooltip " id="tooltip-container" onClick={(e) => e.stopPropagation()}>
                                                        <div className='flex flex-row items-start'>
                                                            <p className="flex justify-start">
                                                                <span>{dark_store_info_value}</span>
                                                                {dark_store_info?.value && <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, dark_store_info_value) }}> <IoMdCopy /></span>}
                                                            </p>
                                                            <button className="tblTooltipClose" onClick={() => setActiveDarkStoreTooltip(null)}>
                                                                <img src="/assets/images/clear-icon-white.svg" width={18} height={18} alt="" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                            : <></>}
                                        {(web_pid_data?.pdp_image_url && header?.value == "web_pid" && val) ? <img src={web_pid_data?.pdp_image_url} className="w-12 h-12 object-contain" /> : ""}
                                        <button className='breakdownChartIcon' type="button" onClick={() => {


                                            const drawer_data = getFilteredData(row?.[`${headerkey?.[0].value}_item`]);
                                            console.log("chekingkey", selectedTabKey, drawer_data?.value, drawer_data?.lable);
                                            openDrawer(selectedTabKey, drawer_data?.value ?? drawer_data?.lable, drawer_data?.lable ?? drawer_data?.value, drawer_data?.pdp_image_url, drawer_data?.sku_name)
                                        }}><img src="/assets/images/graphIcon.svg" width={18} height={18} /></button>
                                        {(web_pid_data?.pdp_page_url && header?.value == "web_pid" && val) ? <a href={web_pid_data?.pdp_page_url} target="blank"><IoIosRedo /></a> : ""}

                                    </div>

                                </div>
                        }
                    </td>

                    {
                        isShowTag && header?.value == 'keyword' ?
                            <td key={index + i + "tag"} className="group min-w-[120px] max-w-[250px]"
                            // style={{
                            //     left: stickyColumns?.includes(1)
                            //         ? `${columnWidths
                            //             .slice(0, stickyColumns?.indexOf(1))
                            //             .reduce((acc, width) => acc + width, 0)}px`
                            //         : undefined,
                            // }}

                            >
                                {
                                    val && (
                                        <RelatedTags tagType={(selectedTabName == "Keyword" ? "Keyword" : "Product")} relatedTo={selectedTabName == "Keyword" ? row?.keyword : row?.web_pid} />
                                    )}
                            </td>
                            : <></>
                    }
                </>);
        }
        if (!val && header?.type == "breakdown" && header?.value == "platform" && headerkey?.[0]?.value == "darkstore") {
            val = row?.[header.value];
        }
        return (
            <>
                <td key={index + i} className={`group ${header.value}_col ${header?.value == "darkstore" && activeDarkStoreTooltip === dark_store_info?.value ? 'activeSkuTd !z-[3]' : 'z-[1]'}  ${stickyColumns?.includes(tdIndex) ? ` sticky ${header.value == "darkstore" ? "sticky_sku_name" : ""}` : ""}`}
                    style={{
                        left: stickyColumns?.includes(tdIndex)
                            ? `${columnWidths
                                .slice(0, stickyColumns?.indexOf(tdIndex))
                                .reduce((acc, width) => acc + width, 0)}px`
                            : undefined,
                    }}>
                    <div className={`relative z-[1] `}>
                        <div className='flex flex-row gap-0.5 justify-between items-center'>{getFormatValue(val, header)}
                            {/* {((header.value=="number_of_banners") &&row?.["number_of_all_banners"])? ` / ${row?.["number_of_all_banners"]}`:<></>}
        {((header.value=="competition-number_of_banners") &&row?.["competition-number_of_all_banners"])? ` / ${row?.["competition-number_of_all_banners"]}`:<></>} */}

                            {header?.value == "darkstore" && val && dark_store_info ?
                                <>
                                    <button className="p-2 rounded-full hover:bg-gray-300" onClick={() => toggleDarkStoreTooltip(dark_store_info?.value)}>
                                        <FaInfoCircle className="w-5 h-5 text-gray-600" />
                                    </button>
                                    {activeDarkStoreTooltip === dark_store_info?.value && (
                                        <div className="tblTooltip " id="tooltip-container" onClick={(e) => e.stopPropagation()}>
                                            <div className='flex flex-row items-start'>
                                                <p className="flex justify-start">
                                                    <span>{dark_store_info_value}</span>
                                                    {dark_store_info?.value && <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, dark_store_info_value) }}> <IoMdCopy /></span>}
                                                </p>
                                                <button className="tblTooltipClose" onClick={() => setActiveDarkStoreTooltip(null)}>
                                                    <img src="/assets/images/clear-icon-white.svg" width={18} height={18} alt="" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                                : <></>}

                            {(web_pid_data?.pdp_image_url && header?.value == "web_pid" && val) ? <img src={web_pid_data?.pdp_image_url} width={22} height={22} /> : ""}
                            {(val && header?.value == "banner" && row?.["banner_item"]?.value) ?
                                <button className='breakdownChartIcon' type="button" onClick={() => { openBannerDrawer(row?.["banner_item"], 'brand') }}><img src="/assets/images/full-screen.png" width={18} height={18} /></button>

                                // <img src={row?.["banner_item"]?.value} width={22} height={22} />
                                : ""}
                            {(val && header?.value == "competition-banner" && row?.["competition-banner_item"]?.value) ?
                                <button className='breakdownChartIcon' type="button" onClick={() => { openBannerDrawer(row?.["competition-banner_item"], 'competition') }}><img src="/assets/images/full-screen.png" width={18} height={18} /></button>

                                // <img src={row?.["competition-banner_item"]?.value} width={22} height={22} />
                                : ""}
                        </div></div></td>
                {
                    isShowTag && header?.type == "breakdown" && ['sku_name', 'keyword']?.indexOf(header.value) > -1 ?
                        <td key={index + i + "tag"} className="group min-w-[120px] max-w-[250px]"

                        >
                            {
                                val && (
                                    <RelatedTags tagType={(selectedTabName == "Keyword" ? "Keyword" : "Product")} relatedTo={selectedTabName == "Keyword" ? row?.keyword : row?.web_pid} />
                                )}
                        </td>
                        : <></>
                }
            </>
        )
    }
    const renderfootRows = () => {

        return (
            <tr>
                <td className="firstCol sticky group"
                    style={{
                        left: stickyColumns?.includes(0)
                            ? `${columnWidths
                                .slice(0, stickyColumns?.indexOf(0))
                                .reduce((acc, width) => acc + width, 0)}px`
                            : undefined,
                    }}></td>

                {
                    headerkey?.map((header, colIndex) => (
                        <>
                            <td key={colIndex} className={`group ${header.value}_col ${stickyColumns?.includes(colIndex + (1)) ? "sticky" : ""}`}
                                style={{
                                    left: stickyColumns?.includes(colIndex + (1))
                                        ? `${columnWidths
                                            .slice(0, stickyColumns?.indexOf(colIndex + (1)))
                                            .reduce((acc, width) => acc + width, 0)}px`
                                        : undefined,
                                }}
                            >
                                <div>
                                    {header?.type == "breakdown" ? `Total ${header.title}` : header.title}
                                </div>
                                <p className="flex flex-start">
                                    <strong>{getFormatValue(footerData?.[header.value], header)}</strong>
                                </p>
                            </td>
                            {
                                isShowTag && (header?.type == "breakdown") && ['sku_name', 'keyword']?.indexOf(header.value) > -1 ?
                                    <td className="group min-w-[120px] max-w-[250px]"
                                    // style={{
                                    //     left: stickyColumns?.includes(1)
                                    //         ? `${columnWidths
                                    //             .slice(0, stickyColumns?.indexOf(1))
                                    //             .reduce((acc, width) => acc + width, 0)}px`
                                    //         : undefined,
                                    // }}
                                    ></td>
                                    : <></>
                            }
                        </>
                    ))
                }
            </tr>
        );
    };
    const get_dark_store_info = (store_id) => {
        return filters?.darkstore_id.find(i => i.value == store_id);
    };

    //    const [openMFilter, setOpenMFilter] = useState(null);
    const addFilterFor = (e, headerValue) => {
        e.stopPropagation();
        setOpenMFilter(headerValue);
    };
    return (
        <div className={`tblWrap ${rowData?.length > 4 ? "tbl-scroll" : "tbl-no-scroll"}`} ref={containerRef}>
            <table className="tblOuterSticky" ref={tableRef} border="1">
                <thead>
                    <tr>
                        <th className="firstCol sticky cursor-default"
                            style={{
                                left: stickyColumns?.includes(0)
                                    ? `${columnWidths
                                        .slice(0, stickyColumns?.indexOf(0))
                                        .reduce((acc, width) => acc + width, 0)}px`
                                    : undefined,
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isSelectAllChecked}
                                onChange={() => handleSelectAll()}
                            />

                        </th>

                        {headerkey?.map((header, index) => (
                            <>
                                <th key={index}
                                    className={`group cursor-default relative ${index == 0 ? "secondCol" : `${header.value}_col`} ${stickyColumns?.includes(index + (1)) ? `sticky ${header.value == "sku_name" ? "sticky_sku_name" : ""}` : ""}`}
                                    style={{
                                        left: stickyColumns?.includes(index + (1))
                                            ? `${columnWidths
                                                .slice(0, stickyColumns?.indexOf(index + (1)))
                                                .reduce((acc, width) => acc + width, 0)}px`
                                            : undefined,
                                    }}

                                >
                                    <div className='flex items-center justify-between w-full'>

                                        <div className="sortingCol w-full py-2" >
                                            {header.title}
                                            <SortingButton requestSort={() => requestSort(header.value)} sortType={sortConfig.key === `${header.value}` ? sortConfig.direction : ''} />
                                            {header?.type == "breakdown" && (!header.value.includes('competition')) ? <span className="group-hover:block hidden absolute right-2">
                                                {stickyColumns?.includes(index + (1)) ? index == 0 ? <TbPinFilled className="text-[20px] cursor-not-allowed" /> : <TbPinnedOff className="text-[20px]" onClick={() => handleStickyColumnClick(index + (0))} /> : <TbPin className="text-[20px]" onClick={() => handleStickyColumnClick((index + (1)))} />}

                                            </span> : ""}
                                        </div>
                                        {
                                            (activeClientProject?.isUseWidget && header?.isFilterrable != false) ?
                                                <span className="cursor-pointer absolute right-[0.5px]">
                                                    {header?.type == "parameters" &&
                                                        <CiFilter className="text-[20px]"
                                                            onClick={(e) => { addFilterFor(e, header?.value) }}
                                                        />
                                                    }
                                                </span> : <></>
                                        }
                                        {header.value == "nestle_nd_osa" ?
                                            <InfoTooltip text={((activeClientProject?.calendarType ?? "date") == "date") ? `This metric now calculates at day-level data, displaying dark store penetration for single-date selections and showing "-" when multiple dates are selected.` : "Regardless of the date range selected, ND (OSA) will showcase just the latest week's data at an SKU-level."} position="left" />
                                            : <></>}

                                        {header.value == "nestle_nd_osa_darkstore_coverage" ?
                                            <InfoTooltip text={((activeClientProject?.calendarType ?? "date") == "date") ? `This metric now calculates at day-level data, displaying dark store penetration for single-date selections and showing "-" when multiple dates are selected.` : "Regardless of the date range selected, ND (Dark Store Coverage) will showcase just the latest week's data at an SKU-level."} position="left" />
                                            : <></>}
                                    </div>
                                </th>
                                {
                                    isShowTag && (header?.type == "breakdown") && ['sku_name', 'keyword']?.indexOf(header.value) > -1 ?
                                        <th className="min-w-[120px] !w-[120px] max-w-[250px] cursor-default"
                                            style={{
                                                left: stickyColumns?.includes(1)
                                                    ? `${columnWidths
                                                        .slice(0, stickyColumns?.indexOf(1))
                                                        .reduce((acc, width) => acc + width, 0)}px`
                                                    : undefined,
                                            }}
                                        >
                                            Tags

                                        </th>
                                        : <></>
                                }
                            </>

                        ))
                        }
                    </tr>
                </thead>
                <tbody>

                    {visibleData && selectedTabName === "Platform" && sortConfig?.key == null ? visibleData?.sort((a, b) => {
                        const getOrderIndex = (platform) => {

                            const index = sortPlatforms?.indexOf(platform);
                            return index === -1 ? Infinity : index; // Unmapped platforms go last
                        };

                        return getOrderIndex(a.platform) - getOrderIndex(b.platform);
                    }).map((row, index) => (
                        <tr key={index} className="breakdownRow">
                            <td className="firstCol sticky group" key={`${index}-id`}
                                style={{
                                    left: stickyColumns?.includes(0)
                                        ? `${columnWidths
                                            .slice(0, stickyColumns?.indexOf(0))
                                            .reduce((acc, width) => acc + width, 0)}px`
                                        : undefined,
                                }}

                            >
                                {(headerkey?.[0]?.type == "breakdown" &&
                                    row?.[headerkey?.[0].value] &&
                                    (
                                        (perValue[headerkey?.[0]?.value] != row?.[headerkey?.[0].value]) ||
                                        (perValue[`${headerkey?.[0]?.value}_item`]?.label == row?.[`${headerkey?.[0]?.value}_item`]?.label && perValue[`${headerkey?.[0]?.value}_item`]?.value != row?.[`${headerkey?.[0]?.value}_item`]?.value)))
                                    ?
                                    <input type="checkbox" name="" id=""
                                        checked={isSelectAllChecked || selectedTableRows?.[selectedTabKey]?.some((item) => item?.value === row?.[`${headerkey?.[0].value}_item`]?.value && item?.lable === row?.[`${headerkey?.[0].value}_item`]?.lable)}
                                        onChange={() => handleRowSelect(row?.[`${headerkey?.[0].value}_item`])} />
                                    : <></>}
                            </td>


                            {headerkey?.map((header, i) => (renderBodyCol(index, i, header, row)))}

                        </tr>
                    )) : visibleData?.map((row, index) => (
                        <tr key={index} className="breakdownRow">
                            <td className="group firstCol sticky" key={`${index}-id`}
                                style={{
                                    left: stickyColumns?.includes(0)
                                        ? `${columnWidths
                                            .slice(0, stickyColumns?.indexOf(0))
                                            .reduce((acc, width) => acc + width, 0)}px`
                                        : undefined,
                                }}

                            >
                                {/* {(headerkey?.[0]?.type == "breakdown" &&
                                    row?.[headerkey?.[0].value] &&
                                    (
                                        (perValue[headerkey?.[0]?.value] != row?.[headerkey?.[0].value] )|| 
                                        (perValue[`${headerkey?.[0]?.value}_item`]?.label == row?.[`${headerkey?.[0]?.value}_item`]?.label && perValue[`${headerkey?.[0]?.value}_item`]?.value != row?.[`${headerkey?.[0]?.value}_item`]?.value)))
                                    ?
                                    <input type="checkbox" name="" id=""
                                        checked={isSelectAllChecked || selectedTableRows?.[selectedTabKey]?.some((item) => item?.value === row?.[`${headerkey?.[0].value}_item`]?.value && item?.lable === row?.[`${headerkey?.[0].value}_item`]?.lable)}
                                        onChange={() => handleRowSelect(row?.[`${headerkey?.[0].value}_item`])} />
                                    : <></>} */}


                                {headerkey?.[0]?.type === "breakdown" &&
                                    row?.[headerkey[0].value] &&
                                    (perValue[headerkey[0]?.value] !== row[headerkey[0].value] ||
                                        (perValue[`${headerkey?.[0]?.value}_item`]?.label == row?.[`${headerkey?.[0]?.value}_item`]?.label && perValue[`${headerkey?.[0]?.value}_item`]?.value != row?.[`${headerkey?.[0]?.value}_item`]?.value)) && (
                                        <input
                                            type="checkbox"
                                            checked={
                                                isSelectAllChecked ||
                                                (selectedTableRows?.[selectedTabKey] ?? []).some(item =>
                                                    item?.value === (row[`${headerkey[0].value}_item`]?.value ?? '') &&
                                                    item?.lable === (row[`${headerkey[0].value}_item`]?.lable ?? '')
                                                )
                                            }
                                            onChange={() => {
                                                const rowItem = row[`${headerkey[0].value}_item`] ?? {};
                                                handleRowSelect({
                                                    value: rowItem.value ?? '',
                                                    lable: rowItem.lable ?? '',
                                                    ...rowItem
                                                });
                                            }}
                                        />
                                    )}
                            </td>
                            {headerkey?.map((header, i) => (renderBodyCol(index, i, header, row)))}

                        </tr>
                    ))}

                    {isLazyLoading && (
                        <tr>
                            {/* <td
                                rowSpan={3} colSpan={headerkey.length + 1} className="!justify-center !text-center bg-gray-100 p-2 rounded-md shadow-md">
                                <span className="!pt-2 !pb-4 inline-block"><LoaderSpinner /></span>
                            </td> */}

                            <td
                                className="p-2 !bg-[#FFF] !max-w-[90vw]"
                                colSpan={headerkey.length + 1}
                                rowSpan={3}
                                style={{ alignItems: "center", verticalAlign: "middle" }}
                            >
                                <div className="flex !bg-[#FFF] !justify-center !text-center p-2 row sticky !shadow-none max-w-[90vw]">
                                    <LoaderSpinner />
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>

                <tfoot className="dataTableFoot">{renderfootRows()}</tfoot>
            </table>

        </div>
    );
};

export default BreakdownTable;