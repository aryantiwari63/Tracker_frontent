import React, { useState, useMemo } from "react";
// import { useEbuxContext } from "../../../../../Context/EbuxProvider";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Excel from "exceljs";
import { copyToClipboard, getTextFromReactNode } from "../../../../utils/helpers";
// import { IoMdCopy className="text-white" } from "react-icons/fa";
import { IoMdCopy } from "react-icons/io";
const showHeader = false;

/**
 * PerformanceTable
 *
 * Props:
 * - darkStoreLocationData: object (expects `.data` array with Region/State/City items)
 * - updateLocationSteps: function(type, location) — called when user clicks Location cell
 * - loadingReport: boolean (optional) - used to avoid drill during loading
 */
const DarkStoreTable = ({setActivefromTable,loadingReport, pf_images, metrics, darkStoreLocationData = { data: [] }, updateLocationSteps = () => { } }) => {

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Normalize the incoming darkStoreLocationData.data into the flat rows the table expects
  const normalizedRows = useMemo(() => {
    return darkStoreLocationData?.data ?? [];
  }, [darkStoreLocationData]);

  const sortedData = useMemo(() => {
    const arr = [...normalizedRows];
    if (!sortConfig.key) return arr;

    arr.sort((a, b) => {
      let A, B;
      console.log('sortConfig.key', sortConfig.key)
      // If sorting on location (string)
      if (sortConfig.key === "location") {

        A = a.location ?? a.region ?? a.state ?? a.city ?? a.pincode ?? "";
        B = b.location ?? b.region ?? b.state ?? b.city ?? b.pincode ?? "";
        const comparison = A.localeCompare(B);
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      // Otherwise sorting on metric (numeric)
      A = parseFloat(a[sortConfig.key]?.value ?? 0);
      B = parseFloat(b[sortConfig.key]?.value ?? 0);

      return sortConfig.direction === "asc" ? A - B : B - A;
    });

    return arr;
  }, [normalizedRows, sortConfig]);





  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleLocationClick = (row) => {
    // console.log('tetststtt', row)
    // if (loadingReport) return; // prevent drilling while loading
    if (!row) return;
    const type = row?.region ? "Region" : row?.state ? "State" : row?.city ? "City" : row?.pincode ? "Pincode" : row?.dark_store ? "DarkStore" : "";
    // call parent update - this will update locationSteps in the parent and re-render map & table
    if (type && row?.[type?.toLocaleLowerCase()]) {
      updateLocationSteps(type, row?.[type?.toLocaleLowerCase()]);
    } else if (row?.location) {
      updateLocationSteps("Region", null); // fallback
    }
  };
  const columns = useMemo(() => {
    return [
      { key: "location", value: "location", label: "Location", align: "text-left" },

      { key: "platform", value: "platform", label: "Platform", align: "text-left" },

      // ...(metrics?.filter(i => i?.checked)?.map(i => (
      ...(metrics?.map(i => (
        {
          ...i,
          label: i.title,
          align: "center",
          sortable: true
        })) ?? [])
    ]
  }, [metrics]);

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
        (metric?.value||( metric?.value != undefined &&(col?.value=="osa" || col?.value == "price_variation"))) ?
        <p className="flex flex-start">
        <span className="font-medium">{showValue(col, metric?.value)}</span>
        <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.value))) }}> <IoMdCopy /></span>
        </p> 
          : <>-</>
      }
      {
        metric?.value && metric?.reference ?
          (
          <p className="flex justify-start">
          <span className="text-gray-400 text-xs">{showValue(col, metric?.reference)}</span>
          <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.reference))) }}> <IoMdCopy/></span>
          </p>
          )
          :
          (<></>)
      }

      {metric?.value && metric?.reference && metric?.delta ?
        metric?.delta >= 0 ? (
          <p className="flex justify-start">
          <span className="text-[#329900] flex items-center gap-1 text-xs px-1 py-0.5 border border-[#B7EB8F] bg-[#E8FFEB] rounded-full">
            <IoMdArrowDropup size={14} /> {showValue(col, metric?.delta)}
          </span>
          <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, showValue(col, getTextFromReactNode(metric?.delta))) }}> <IoMdCopy/></span>
          </p>
        ) : (
          <p className="flex justify-start">
          <span className="text-[#DD4242] flex items-center gap-1 text-xs px-1 py-0.5 border bg-[#FFF1F0] border-[#FFA39E] rounded-full">
            <IoMdArrowDropdown size={14} /> {showValue(col, Math.abs(metric?.delta))}
          </span>
          <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(Math.abs(metric?.delta))) }}> <IoMdCopy /></span>
          </p>
        ) :
        <></>
      }
    </div>
  );

  const handleDownload = async () => {
    console.log('metricsmetrics', metrics)
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Performance Data");

    // Add header row
    const headers = ["Location", ...metrics.filter(i => i?.checked).map(i => i.title)];
    worksheet.addRow(headers);

    // Add table rows
    sortedData.forEach((row) => {
      worksheet.addRow([
        row.location ?? row.region ?? row.state ?? row.city ?? row.pincode,
        ...metrics.filter(i => i?.checked).map(i => row?.[i.value]?.value ?? "-")
      ]);
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `performance_table_${Date.now()}.xlsx`;
    link.click();
  };


  return (
    <div className="mt-5 bg-white p-4">
      {/* Header */}
      {showHeader ?
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5">
          <div className="flex justify-between items-center w-full">
            <h2 className="font-inter font-medium text-[18px] leading-[100%] tracking-[0] text-[#191919]">Tabular View</h2>
            <div className="flex gap-2 items-center">
              <img src="/assets/images/downloadIcon.svg" className="w-[20px] h-[20px] cursor-pointer" alt="download" onClick={handleDownload} />
              {/* <img src="/assets/images/widget/book.png" className="w-[20px] h-[20px] cursor-pointer" alt="book" /> */}
            </div>
          </div>
        </div> : <></>}

      {/* Table */}
      <div className="overflow-x-auto">
        {/* <div className="h-[300px] overflow-y-auto"> */}
        <div
          className="h-[500px] min-w-[100%]  max-w-[100%] overflow-x-auto overflow-y-auto flex-1 relative
               [&::-webkit-scrollbar]:hidden
               [-ms-overflow-style:'none']
               [scrollbar-width:'none']"
        >
          {/* <pre>
            {JSON.stringify(columns)}
          </pre> */}
          {/* <div className="h-[300px] overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"> */}

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
          {(loadingReport) ?
            <div className="flex justify-center items-center h-[500px] w-full">
              <div className="animate-spin rounded-full  h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
            :

            <table className="w-full relative text-sm sticky-table" style={{ minHeight: '400px' }}>
              <thead >
                <tr className="bg-gray-50 text-gray-600 text-sm border-0">
                  {columns?.map((col, colIndex) => (
                    <th
                      key={col.key+""+colIndex}
                      className={`${colIndex === 0 ? "!min-w-[200px] !max-w-[200px]" : "!min-w-[150px] !max-w-[150px]"} font-inter font-medium text-[14px] leading-[100%] tracking-[0]  text-[#000000] border-0
                      ${colIndex < 2 ? "text-left" : "text-center"} 
                      ${colIndex === 0 ? "sticky-column-header-0" : ""}
                      ${colIndex === 1 ? "sticky-column-header-1" : ""}
                      sticky-header`}
                    // onClick={() => handleSort(col.key)}

                    >
                      {/* <div className="flex gap-2 items-center justify-center md:justify-start"></div> */}
                      <div className={`flex items-center opacity-100 gap-[4px] p-4 bg-[#F6F9FB] border-0 
                    ${col.key === "location" ? "" : "justify-center"}
                    `}>
                        {col.label}
                        <img
                          src="/assets/images/widget/sort.png"
                          className={`w-[10px] transform ${sortConfig.key === col.key && sortConfig.direction === "desc" ? "rotate-180" : ""}`}
                          alt="sort"
                          onClick={() => handleSort(col.value)}
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-sm border-0">
                {sortedData.length > 0 ? (
                  sortedData.map((row, idx) => (

                    <>
                      {row?.platform_data?.map((row_pf, k) => {
                        return (
                          <tr key={row.location + idx + k} className={`${k % 2 === 1 ? "bg-gray-50" : ""}  border-0`}>
                            {k == 0 ?
                              <td key={"ss"+row.location + idx + k}
                                className={`group ${idx % 2 === 1 ? "!bg-gray-50" : ""} !items-center !min-w-[200px] !max-w-[200px] px-6 py-4 border-0 w-full text-left cursor-pointer sticky-column-0 align-center`}
                                onClick={() => {
                                  if (row?.dark_store === undefined) handleLocationClick(row);
                                }}
                                rowSpan={row?.platform_data?.length}
                                
                                onMouseEnter={() => { setActivefromTable(
                                    row?.location ??
                                    row?.region ??
                                    row?.state ??
                                    row?.city ??
                                    row?.pincode ??
                                    row?.dark_store
                                  );  }} onMouseLeave={() => { setActivefromTable(null);}} 
                              >
                                {(() => {
                                  const locationValue =
                                  row?.location ??
                                  row?.region ??
                                  row?.state ??
                                  row?.city ??
                                  row?.pincode ??
                                  row?.dark_store;

                                  return(
                                    <p
                                      className={`flex justify-start !min-w-[150px] !max-w-[150px] !break-all !whitespace-normal font-inter font-normal text-[14px] leading-[100%] tracking-[0] ${row?.dark_store === undefined
                                        ? "underline text-[#1890FF] cursor-pointer"
                                        : "text-gray-600"
                                        }`}
                                    >
                                      {locationValue}
                                        <span
                                        className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center"
                                        onClick={(e) => {
                                          copyToClipboard(e, locationValue);
                                        }}
                                      >
                                        <IoMdCopy className="text-black"/>
                                      </span>
                                    </p>
                                  )
                                })()}
                                
                              </td>


                              : <></>}
                            {columns.slice(1)?.map((col, i) => (
                              <td key={`location-${idx}-${k}-${i}-col`}
                                className={`group !min-w-[200px] !max-w-[200px] px-6 py-4 border-0 ${idx < 1 ? "text-left" : "text-center"} cursor-pointer    whitespace-nowrap  break-all   ${i === 0 ? "sticky-column-1" : ""}`}
                              >
                                {i < 1 ? <p className={` flex gap-1 items-center font-inter font-normal text-[14px] leading-[100%] tracking-[0] text-gray-600 `}>
                                  {pf_images?.[row_pf?.platform?.toLowerCase()] ? <img src={pf_images?.[row_pf?.platform?.toLowerCase()]} alt={row_pf?.platform} className="oos-plat-img max-w-8 max-h-8" /> : <></>}
                                  {row_pf?.platform}
                                  {row_pf?.platform && <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center">
                                                  <IoMdCopy
                                                    onClick={(e) => copyToClipboard(e, getTextFromReactNode(row_pf?.platform))}
                                                    />
                                                    </span>}
                                </p> : <> {renderCell(col, row_pf?.[col.value] ?? "-")}</>}
                              </td>
                            ))}

                          </tr>);
                      })}
                    </>


                  ))
                ) : (
                  <tr className="border-0">
                    <td colSpan={4} className="text-center py-4 text-gray-500 border-0">
                      No data to display
                    </td>
                  </tr>
                )}
              </tbody>
              
                    <tfoot className="sticky-footer">
                        <tr>

                                    <td
                                        className={`group 
                                                p-2 border-none text-xs text-gray-600
                                                sticky-column-0
                                                `}
                                        style={{
                                            width: "200px" ,
                                            minWidth: "200px" ,
                                            maxWidth: "200px",
                                            background: "#FFFFFF",
                                        }}
                                    >
                                        <div className={`font-normal !text-sm text-[#000000D9]  flex flex-col 
                                                    items-letf px-4 
                                                        `}>
                                            <span>{"Total Location"}</span>
                                            <p className="font-semibold text-md flex flex-start">
                                              <span>
                                              {(darkStoreLocationData?.footerData )?.[Object.keys(darkStoreLocationData?.footerData)?.[0]]?.value ? (darkStoreLocationData?.footerData )?.[Object.keys(darkStoreLocationData?.footerData)?.[0]]?.value : "-"}
                                              </span>
                                              {
                                                (darkStoreLocationData?.footerData )?.[Object.keys(darkStoreLocationData?.footerData)?.[0]]?.value &&
                                                 <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode((darkStoreLocationData?.footerData )?.[Object.keys(darkStoreLocationData?.footerData)?.[0]]?.value))}}> <IoMdCopy className="text-black" /></span> 
                                              }
                                              </p>
                                        </div>
                                    </td>
                            {columns.slice(1)?.map((col, colIndex) => {
                                const summary = (darkStoreLocationData?.footerData )?.[col.value] ?? {};
                                return (
                                    <td
                                        key={col.value}
                                        className={`group 
                                                p-2 border-none text-xs text-gray-600
                                                ${colIndex === 0 ? "sticky-column-1" : ""}
                                                `}
                                        style={{
                                            width: colIndex < 1 ? "200px" : "150px",
                                            minWidth: colIndex < 1 ? "200px" : "150px",
                                            maxWidth: colIndex < 1 ? "200px" : "230px",
                                            background: "#FFFFFF",
                                        }}
                                    >
                                        <div className={`font-normal !text-sm text-[#000000D9]  flex flex-col 
                                                    ${(col.align === "left" && colIndex == 0) ? "" : col.align === "left" ? "items-letf" :
                                                col.align === "right" ? "items-right" : "items-center"}
                                                        `}>
                                            <span>{col?.type === "parameters" ? "Avg" : "Total"} {col?.label || summary?.label}</span>
                                            <p className="font-semibold text-md flex flex-start">
                                              <span>
                                              {summary?.value ? (renderCell(col, summary)) : "-"}
                                              </span>
                                            </p>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tfoot>
            </table>
          }
        </div>
      </div>
    </div>
  );
};

export default DarkStoreTable;
