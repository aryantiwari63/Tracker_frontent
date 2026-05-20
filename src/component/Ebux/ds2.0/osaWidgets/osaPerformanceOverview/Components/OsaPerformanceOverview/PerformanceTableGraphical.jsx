import React, { useState, useMemo, useEffect } from "react";
import { useEbuxContext } from "../../../../../Context/EbuxProvider";
import moment from "moment";
import { fetchDrillDownData } from "../../services/drillDown.service";
import { IoMdArrowDropdown, IoMdArrowDropup, IoMdCopy } from "react-icons/io";
import CustomTooltip from "../DrawerComponent/customTooltip/CustomTooltip";
import Loader from "../../../../../common-components/Loader";
import { copyToClipboard, getTextFromReactNode } from "../../../../../../../utils/helpers";

const isShowDummyData = false;
// Dummy data with separate prev values for each metric
const initialData = (!isShowDummyData) ? [] : [
  {
    product: "Coca Cola 1L",
    avgOsa: 85,
    prevAvgOsa: 70,
    wtOsa: 80,
    prevWtOsa: 75,
    avgOffTake: 5,
    prevAvgOffTake: 3,
  },
  {
    product: "Pepsi 500ml",
    avgOsa: 70,
    prevAvgOsa: 75,
    wtOsa: 65,
    prevWtOsa: 68,
    avgOffTake: 5,
    prevAvgOffTake: 6,
  },
  {
    product: "Nestle KitKat",
    avgOsa: 92,
    prevAvgOsa: 90,
    wtOsa: 95,
    prevWtOsa: 92,
    avgOffTake: -3,
    prevAvgOffTake: -1,
  },
  {
    product: "Amul Butter 500g",
    avgOsa: 60,
    prevAvgOsa: 65,
    wtOsa: 55,
    prevWtOsa: 60,
    avgOffTake: 5,
    prevAvgOffTake: 4,
  },
  {
    product: "Maggi Noodles",
    avgOsa: 78,
    prevAvgOsa: 77,
    wtOsa: 80,
    prevWtOsa: 82,
    avgOffTake: -2,
    prevAvgOffTake: -1,
  },
  {
    product: "Maggi Noodles",
    avgOsa: 78,
    prevAvgOsa: 77,
    wtOsa: 80,
    prevWtOsa: 82,
    avgOffTake: -2,
    prevAvgOffTake: -1,
  }, {
    product: "Maggi Noodles",
    avgOsa: 78,
    prevAvgOsa: 77,
    wtOsa: 80,
    prevWtOsa: 82,
    avgOffTake: -2,
    prevAvgOffTake: -1,
  }, {
    product: "Maggi Noodles",
    avgOsa: 78,
    prevAvgOsa: 77,
    wtOsa: 80,
    prevWtOsa: 82,
    avgOffTake: -2,
    prevAvgOffTake: -1,
  }, {
    product: "Maggi Noodles",
    avgOsa: 78,
    prevAvgOsa: 77,
    wtOsa: 80,
    prevWtOsa: 82,
    avgOffTake: -2,
    prevAvgOffTake: -1,
  }, {
    product: "Maggi Noodles",
    avgOsa: 78,
    prevAvgOsa: 77,
    wtOsa: 80,
    prevWtOsa: 82,
    avgOffTake: -2,
    prevAvgOffTake: -1,
  }, {
    product: "Maggi Noodles",
    avgOsa: 78,
    prevAvgOsa: 77,
    wtOsa: 80,
    prevWtOsa: 82,
    avgOffTake: -2,
    prevAvgOffTake: -1,
  }, {
    product: "Maggi Noodles",
    avgOsa: 78,
    prevAvgOsa: 77,
    wtOsa: 80,
    prevWtOsa: 82,
    avgOffTake: -2,
    prevAvgOffTake: -1,
  }, {
    product: "Maggi Noodles",
    avgOsa: 78,
    prevAvgOsa: 77,
    wtOsa: 80,
    prevWtOsa: 82,
    avgOffTake: -2,
    prevAvgOffTake: -1,
  },
  {
    product: "Red Bull Energy",
    avgOsa: 88,
    prevAvgOsa: 85,
    wtOsa: 85,
    prevWtOsa: 83,
    avgOffTake: 3,
    prevAvgOffTake: 2,
  },
];

const PerformanceTableGraphical = ({ metrics, activeCard }) => {

  const {
    kpi, kpiMap, selectedFilters, filters
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

  const fetchData = async () => {
    setLoading(true);
    if (!activeCard?.label || !activeCard?.type) return;

    const performanceOf = activeCard?.type ?? 'brand';
    let payload = {
      kpi,
      drillDown: "product",
      breakdown: ["product", 'sku'],
      matrix: metrics?.filter(column => column?.type == "parameters")?.map(column => column.value) ?? ['osa', 'wt_osa', 'avg_offtake_osa'],

      key: performanceOf,
      value: activeCard?.label ?? "",
      selectedFilters,
      filters
    };

    const response = await fetchDrillDownData(payload);
    setApiResponse(response);
    setLoading(false);
  }
  useEffect(() => {
    fetchData();
  }, [JSON.stringify(activeCard), JSON.stringify(selectedFilters), JSON.stringify(metrics)]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [filter, setFilter] = useState("All");

  // Sorting logic
  // const sortedData = useMemo(() => {
  //   let sortable = [...(rowData?.length ? rowData : initialData)];
  //   if (sortConfig.key) {
  //     sortable.sort((a, b) => {
  //       if (a[sortConfig.key] < b[sortConfig.key])
  //         return sortConfig.direction === "asc" ? -1 : 1;
  //       if (a[sortConfig.key] > b[sortConfig.key])
  //         return sortConfig.direction === "asc" ? 1 : -1;
  //       return 0;
  //     });
  //   }
  //   return filter === "All"
  //     ? sortable
  //     : sortable.filter((item) => item.product === filter);
  // }, [sortConfig, filter]);

  const handleSort = (key) => {
    setLastSortBy("header"); // <-- make header sorting active
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const [lastSortBy, setLastSortBy] = useState("filter"); // "filter" or "header"
  const handleFilterChange = (value) => {
    setLastSortBy("filter");
    setFilter(value);
  };

  // Column config with key + prevKey for ▲▼ calc
  const columns = [
    { key: "product", value: "product", label: "Product", align: "left" },

    ...(metrics?.filter(i => i?.checked)?.map(i => (
      {
        ...i,
        label: i.title,
        align: "center",
        sortable: true
      })) ?? [])

  ];

  const getSortedRows = (rows) => {
    let sorted = [...rows];

    if (lastSortBy === "filter") {
      const metricKey = metrics?.[0]?.value || "osa";
      if (filter === "Growing") {
        sorted.sort((a, b) => {
          const deltaA = a?.[metricKey]?.delta !== undefined ? parseFloat(a?.[metricKey]?.delta) : null;
          const deltaB = b?.[metricKey]?.delta !== undefined ? parseFloat(b?.[metricKey]?.delta) : null;
          const valueA = parseFloat(a?.[metricKey]?.value ?? 0);
          const valueB = parseFloat(b?.[metricKey]?.value ?? 0);
          return (deltaB ?? valueB) - (deltaA ?? valueA);
        });
      } else if (filter === "Declining") {
        sorted.sort((a, b) => {
          const deltaA = a?.[metricKey]?.delta !== undefined ? parseFloat(a?.[metricKey]?.delta) : null;
          const deltaB = b?.[metricKey]?.delta !== undefined ? parseFloat(b?.[metricKey]?.delta) : null;
          const valueA = parseFloat(a?.[metricKey]?.value ?? 0);
          const valueB = parseFloat(b?.[metricKey]?.value ?? 0);
          return (deltaA ?? valueA) - (deltaB ?? valueB);
        });
      } else {
        sorted.sort((a, b) => (a.product || "").localeCompare(b.product || ""));
      }
    }

    if (lastSortBy === "header" && sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue, bValue;

        if (["product", "name", "skuId"].includes(sortConfig.key)) {
          aValue = a[sortConfig.key] || "";
          bValue = b[sortConfig.key] || "";
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === "asc" ? comparison : -comparison;
        } else {

          aValue = parseFloat(a[sortConfig.key]?.value ?? 0);
          bValue = parseFloat(b[sortConfig.key]?.value ?? 0);
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }
      });
    }

    return sorted;
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
  // const renderCell = (col, metric, type) => (
       

  //   <div className=" flex gap-2 mt-1  justify-center  ">
      
  //     {
  //       (metric?.value || (metric?.value != undefined && (col?.value == "osa" || col?.value == "price_variation"))) ?
  //         <div className="flex justify-start">
  //           <span className={`text-[16px] ${type == 'footer' ? "font-black" : "font-medium"}`}>{showValue(col, metric?.value)}</span>
  //           {
  //             metric?.value ?
  //               <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.value))) }}><IoMdCopy /></span>
  //               : null
  //           }
  //         </div>
  //         : <>-</>
  //     }
  //     {
  //       metric?.value && metric?.reference ?
  //         <div className="flex justify-start">
  //           (<span className="text-[14px] text-[#00000099]">{showValue(col, metric?.reference)}</span>)
  //           <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.reference))) }}><IoMdCopy /></span>
  //         </div>
  //         :
  //         (<></>)
  //     }

  //     {metric?.value && metric?.reference && metric?.delta ?
  //       metric?.delta >= 0 ? (
  //         <div className="flex justify-start">
  //           <span className="text-[#329900] border-[#B7EB8F] bg-[#E8FFEB] flex items-center text-xs  px-1 py-0.5 rounded-full">
  //             <IoMdArrowDropup size={14} /> {showValue(col, metric?.delta)}
  //           </span>
  //           <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.delta))) }}><IoMdCopy /></span>
  //         </div>
  //       ) : (
  //         <div className="flex justify-start">
  //           <span className="text-[#DD4242] bg-[#FFF1F0] border-[#FFA39E] flex items-center text-xs  px-1 py-0.5 rounded-full">
  //             <IoMdArrowDropdown size={14} /> {showValue(col, Math.abs(metric?.delta))}
  //           </span>
  //           <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, Math.abs(metric?.delta)))) }}><IoMdCopy /></span>
  //         </div>
  //       ) :
  //       <></>
  //     }
  //   </div>
       
  // );
 const renderCell = (col, metric, type) => {
  // 1. Define a clean variable to check if data actually exists (including 0)
  const hasValue = metric?.value !== undefined && metric?.value !== null && metric?.value !== "";

  return (
    <div className="flex gap-2 mt-1 justify-center">
      {hasValue ? (
        <div className="flex justify-start">
          <span className={`text-[16px] ${type === 'footer' ? "font-black" : "font-medium"}`}>
            {showValue(col, metric?.value)}
          </span>
          {/* 2. CHANGE: Use hasValue here. 
             This ensures '0' shows the copy icon for ALL columns, including Promotions.
          */}
          <span
            className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center"
            onClick={(e) => {
              copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.value)));
            }}
          >
            <IoMdCopy />
          </span>
        </div>
      ) : (
        <>-</>
      )}

      {/* Reference Value Section */}
      {hasValue && metric?.reference !== undefined && metric?.reference !== null && (
        <div className="flex justify-start">
          (<span className="text-[14px] text-[#00000099]">{showValue(col, metric?.reference)}</span>)
          <span
            className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center"
            onClick={(e) => {
              copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.reference)));
            }}
          >
            <IoMdCopy />
          </span>
        </div>
      )}

      {/* Delta Section */}
      {hasValue && metric?.delta !== undefined && metric?.delta !== null && (
        <div className="flex justify-start">
          {metric.delta >= 0 ? (
            <span className="text-[#329900] border-[#B7EB8F] bg-[#E8FFEB] flex items-center text-xs px-1 py-0.5 rounded-full">
              <IoMdArrowDropup size={14} /> {showValue(col, metric.delta)}
            </span>
          ) : (
            <span className="text-[#DD4242] bg-[#FFF1F0] border-[#FFA39E] flex items-center text-xs px-1 py-0.5 rounded-full">
              <IoMdArrowDropdown size={14} /> {showValue(col, Math.abs(metric.delta))}
            </span>
          )}
          <span
            className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center"
            onClick={(e) => {
              copyToClipboard(e, getTextFromReactNode(showValue(col, metric.delta)));
            }}
          >
            <IoMdCopy />
          </span>
        </div>
      )}
    </div>
  );
};

  return (
    <div className="mt-5 bg-white shadow-md rounded-xl p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex justify-between items-center w-full">
          <div>
            {/* <h2 className="font-inter font-medium text-[18px] leading-[100%] tracking-[0] text-[#191919]">
              {kpi == "OSA" ? kpi : kpiMap?.[kpi]?.lable} Movers and Shakers
            </h2> */}
            {/* below code is for laoder */}
            {/* <h2 className="font-inter font-medium text-[18px] leading-[100%] tracking-[0] text-[#191919] flex items-center gap-2"> */}
            <h2 className="flex items-center gap-2 text-[20px] font-semibold text-[#000000E0]">
              {/* chart-title  */}
              {kpi == "OSA" ? kpi : kpiMap?.[kpi]?.lable} Movers and Shakers
              {loading && <Loader show={loading} fullScreen={false} />}
            </h2>
            <p className="font-inter font-normal italic text-[10px] leading-[100%] align-middle text-[#000000A6] mt-[10px]">
              {(selectedFilters?.calendarType == "week") ?
                <> {moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY")} </>
                :
                <>{moment(selectedFilters?.selectedDateRange?.startDate ?? "")?.format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedDateRange?.endDate ?? "")?.format("DD/MM/YYYY")}</>}
            </p>
          </div>
          {/* Dropdown */}
          <div className="relative mt-3 md:mt-0">
            <select
              className="appearance-none border rounded-md px-4 pr-8 py-2 text-sm text-gray-700 focus:ring focus:ring-blue-200 bg-white"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="All">All Products</option>
              <option value="Growing">Growing Products</option>
              <option value="Declining">Declining Products</option>

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

      {/* Table */}
      <div className="mt-3 overflow-x-auto">
        {/* <div className="h-[500px] overflow-y-auto"> */}
        <div
          className="h-[500px] overflow-y-auto
               [&::-webkit-scrollbar]:hidden
               [-ms-overflow-style:'none']
               [scrollbar-width:'none']"
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

                    `}
          </style>
          <table className="w-full rounded-lg border-0 sticky-table" style={{ minHeight: '500px' }}>
            <thead >
              <tr >
                {columns.map((col, colIndex) => (
                  <th
                    key={col.key}
                    className={`cursor-default font-inter font-medium text-[14px] leading-[100%] tracking-[0] text-center text-[#000000]  ${col.align === "left" ? "text-left" : "text-center"} border-0
                     ${colIndex === 0 ? "sticky-column-header-0" : ""}
                     ${col.align === "left" ? "text-left" : "text-center"}
                    sticky-header
                     `}
                    style={{
                      width: colIndex < 1 ? '200px' : '150px',
                      minWidth: colIndex < 1 ? '200px' : '150px',
                      maxWidth: colIndex < 1 ? '200px' : '230px',
                    }}

                  >
                    <div className={`flex opacity-100 gap-[4px] p-4 bg-[#F6F9FB] border-0 ${col.align === "left" ? "justify-start" :
                      col.align === "right" ? "justify-end" :
                        col.align === "between" ? "gap-8" : "justify-center"
                      }`}>
                      <span
                        className="cursor-pointer"
                        onClick={() => handleSort(col.value)}
                      >
                        {col.label}
                        <span className="align-[bottom] inline-block">
                          <img
                            src="/assets/images/widget/sort.png"
                            className={`w-[10px] transform ${sortConfig.key === col.key &&
                              sortConfig.direction === "desc"
                              ? "rotate-180"
                              : ""
                              }`}
                            alt="sort"
                          />
                        </span>
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getSortedRows((rowData?.length ? rowData : initialData ?? []))?.map((row, i) => {
                const selected = false;
                const isStriped = i % 2 === 0 ? "white" : "#F9FAFA";
                return (
                  <tr
                    key={i}
                    className={`cursor-pointer border-none `}
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={col.value}
                        className={`group px-2 py-2  border-none 
                          ${col.align === "left" ? "text-left" :
                            col.align === "right" ? "text-right" : "text-center"}
                          ${colIndex === 0 ? "sticky-column-0" : ""} 
                          `}
                        style={{
                          background: selected ? "#f2f8ff" : isStriped,
                          width: (col.key == "product" ? colIndex < 1 : colIndex < 1) ? "200px" : "150px",
                          minWidth: (col.key == "product" ? colIndex < 1 : colIndex < 1) ? "200px" : "150px",
                          maxWidth: (col.key == "product" ? colIndex < 1 : colIndex < 1) ? "200px" : "256px",
                          borderTopLeftRadius: colIndex == 0 ? "12px" : "0px",
                          borderBottomLeftRadius: colIndex == 0 ? "12px" : "0px",
                        }}
                      >
                        {/* Handle checkbox column with flex wrapper */}
                        {(
                          <>
                            {(col.value === "platform" || col.value === "location" || col.value === "product") ? (

                              <div className="flex items-center gap-2">
                                {(col.value === "product" && row?.["pdp_image_url"]) ? <div className="w-[10%] h-6 "><img src={row?.["pdp_image_url"] ?? ""} alt={row?.[col.value]} className="oos-plat-img w-full h-full object-contain" /></div> : <></>}
                                <div className="w-[80%] flex justify-start">
                                  <CustomTooltip title={row?.[col.value] ?? row?.name ?? "-"} placement="right"><span>{row?.[col.value] ?? row?.name ?? "-"}</span>
                                  </CustomTooltip>
                                  {
                                    (row?.[col.value] ?? row?.name) ?
                                      <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode((row?.[col.value] ?? row?.name))) }}><IoMdCopy /></span>
                                      : null
                                  }
                                </div>
                              </div>
                            ) : (col.value === "sku_id" || col.value === "skuId") ? (
                              <div className="flex justify-start">
                                <CustomTooltip title={row?.[col.value] ?? row?.skuId ?? "-"} placement="top">
                                  <span>{row?.[col.value] ?? row?.skuId ?? "-"}</span>
                                </CustomTooltip>
                                {
                                  (row?.[col.value] ?? row?.skuId) ?
                                    <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode((row?.[col.value] ?? row?.skuId))) }}><IoMdCopy /></span>
                                    : null
                                }
                              </div>
                            ) : (col?.value) ? (
                              <CustomTooltip title={showValue(col, row?.[col.value]?.value ?? "-")} placement="top">
                                {renderCell(col, row?.[col.value] ?? "-", 'header')}
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
                  const summary = (footerData)?.[col.value] ?? {};
                  return (
                    <td
                      key={col.value}
                      className={`group p-2 px-6 border-none text-xs text-gray-600 text-center   
                        ${colIndex === 0 ? "sticky-column-0" : ""}`}
                      style={{
                        width: colIndex < 1 ? "200px" : "150px",
                        minWidth: colIndex < 1 ? "200px" : "150px",
                        maxWidth: colIndex < 1 ? "200px" : "230px",
                        background: "#FFFFFF",
                      }}
                    >
                      <div className={`w-full flex flex-col ${col?.type == 'parameters' ? 'items-center' : 'items-baseline'} font-normal text-md`}>
                        <span className="font-inter font-medium text-[14px] leading-[100%] tracking-[0] text-center text-[#000000] text-left border-0">{col?.type == "parameters" ? "Avg" : "Total"} {col?.label || summary?.label}</span>
                        <p className="font-semibold text-lg">{summary?.value ? (renderCell(col, summary, 'footer')) : "-"}</p>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTableGraphical;
