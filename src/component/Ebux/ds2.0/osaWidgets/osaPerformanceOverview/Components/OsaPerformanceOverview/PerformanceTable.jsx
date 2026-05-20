import React, { useState, useMemo } from "react";
// import { useEbuxContext } from "../../../../../Context/EbuxProvider";
import { IoMdArrowDropdown, IoMdArrowDropup, IoMdCopy } from "react-icons/io";
import Excel from "exceljs";
import Loader from "../../../../../common-components/Loader";
import { copyToClipboard, getTextFromReactNode } from "../../../../../../../utils/helpers";


/**
 * PerformanceTable
 *
 * Props:
 * - darkStoreLocationData: object (expects `.data` array with Region/State/City items)
 * - updateLocationSteps: function(type, location) — called when user clicks Location cell
 * - loadingReport: boolean (optional) - used to avoid drill during loading
 */
const PerformanceTable = ({ loadingReport, metrics, darkStoreLocationData = { data: [] }, updateLocationSteps = () => { } }) => {

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Normalize the incoming darkStoreLocationData.data into the flat rows the table expects
  const normalizedRows = useMemo(() => {
    return darkStoreLocationData?.data ?? [];
    // const payload = Array.isArray(darkStoreLocationData?.data) ? darkStoreLocationData.data : [];

    // return payload.map((item) => {
    //   // pick pf_data 'All' row if available, otherwise first pf_data entry
    //   const pfRow =
    //     Array.isArray(item?.pf_data) && item.pf_data.length > 0
    //       ? item.pf_data.find((p) => String(p.pf_name).toLowerCase() === "all") ?? item.pf_data[0]
    //       : null;

    //   // map fields (safe fallbacks)
    //   const location = item?.location ?? item?.location_key ?? "Unknown";
    //   const avgOsa = Number(pfRow?.osa ?? item?.osa ?? 0);
    //   const wtOsa = Number(pfRow?.pf_overall_ms ?? pfRow?.ms ?? item?.wtOsa ?? 0);
    //   // avgOfftake isn't present in your pf_data schema — using ms as representative (adjust if you want another field)
    //   const avgOfftake = Number(pfRow?.ms ?? item?.avgOfftake ?? 0);
    //   // prev value may not exist in your payload; default to 0
    //   const prev = Number(item?.prev ?? 0);



    //   return {
    //     // keep type so parent can use it to drill
    //     type: item?.type ?? null,
    //     location,
    //     avgOsa,
    //     wtOsa,
    //     avgOfftake,
    //     prev,
    //     pro:avgOsa,
    //     mrp:wtOsa,
    //     sp:avgOfftake
    //   };
    // });
  }, [darkStoreLocationData]);

  // Sorting logic (works on normalizedRows)
  // const sortedData = useMemo(() => {
  //   const arr = [...normalizedRows];
  //   if (!sortConfig.key) return arr;
  //   arr.sort((a, b) => {
  //     const A = a[sortConfig.key] ?? 0;
  //     const B = b[sortConfig.key] ?? 0;
  //     if (A < B) return sortConfig.direction === "asc" ? -1 : 1;
  //     if (A > B) return sortConfig.direction === "asc" ? 1 : -1;
  //     return 0;
  //   });
  //   return arr;
  // }, [normalizedRows, sortConfig]);

  // Sorting logic (works on normalizedRows)
  // const sortedData = useMemo(() => {
  //     const arr = [...normalizedRows];
  //     if (!sortConfig.key) return arr;
  //     arr.sort((a, b) => {
  //       const A = a[sortConfig.key] ?? 0;
  //       const B = b[sortConfig.key] ?? 0;
  //       if (A < B) return sortConfig.direction === "asc" ? -1 : 1;
  //       if (A > B) return sortConfig.direction === "asc" ? 1 : -1;
  //       return 0;
  //     });
  //     return arr;
  //   }, [normalizedRows, sortConfig]);

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
    const type = row?.region ? "Region" : row?.state ? "State" : row?.city ? "City" : row?.pincode ? "Pincode" : "";
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

      ...(metrics?.filter(i => i?.checked)?.map(i => (
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
    return `${value != undefined && col?.icon ? getHeaderIcon(col?.icon) : ""}${value}${value != undefined && col?.subValue ? col?.subValue : ""}${value != undefined && col?.persentageValue ? "%" : ""}`;

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
          (
            <div className="flex justify-start">
              <span className="text-gray-400 text-xs">{showValue(col, metric?.reference)}</span>
              <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.reference))) }}><IoMdCopy /></span>
            </div>

          )
          :
          (<></>)
      }

      {metric?.value && metric?.reference && metric?.delta ?
        metric?.delta >= 0 ? (
          <div className="flex justify-start">
            <span className="text-[#329900] flex items-center gap-1 text-xs px-1 py-0.5 border border-[#B7EB8F] bg-[#E8FFEB] rounded-full">
              <IoMdArrowDropup size={14} /> {showValue(col, metric?.delta)}
            </span>
            <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, metric?.delta))) }}><IoMdCopy /></span>
          </div>
        ) : (
          <div className="flex justify-start">
            <span className="text-[#DD4242] flex items-center gap-1 text-xs px-1 py-0.5 border bg-[#FFF1F0] border-[#FFA39E] rounded-full">
              <IoMdArrowDropdown size={14} /> {showValue(col, Math.abs(metric?.delta))}
            </span>
            <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(showValue(col, Math.abs(metric?.delta)))) }}><IoMdCopy /></span>
          </div>
        ) :
        <></>
      }
    </div>
  );

  // const handleDownload = async () => {
  //   console.log('metricsmetrics', metrics)
  //   const workbook = new Excel.Workbook();
  //   const worksheet = workbook.addWorksheet("Performance Data");

  //   // Add header row
  //   const headers = ["Location", ...metrics.filter(i => i?.checked).map(i => i.title)];
  //   console.log('headersheaders',sortedData)
  //   worksheet.addRow(headers);

  //   // Add table rows
  //   sortedData.forEach((row) => {
  //     worksheet.addRow([
  //       row.location ?? row.region ?? row.state ?? row.city ?? row.pincode,
  //       ...metrics.filter(i => i?.checked).map(i => row?.[i.value]?.value ?? "-")
  //     ]);
  //   });

  //   // Generate Excel file
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `performance_table_${Date.now()}.xlsx`;
  //   link.click();
  // };


  const handleDownload = async () => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Performance Data");

    // 1. Build headers dynamically
    const headers = ["Location"];
    metrics.filter(i => i?.checked).forEach(i => {
      headers.push(i.title); // Always show value

      // Peek into first row to see if reference/delta exist
      const sampleMetric = darkStoreLocationData?.data?.[0]?.[i.value];
      if (sampleMetric?.reference !== undefined) {
        headers.push(`${i.title} (Ref)`);
      }
      if (sampleMetric?.delta !== undefined) {
        headers.push(`${i.title} (Δ)`);
      }
    });

    worksheet.addRow(headers);

    // 2. Add table rows
    sortedData.forEach((row) => {
      const rowValues = [
        row.location ?? row.region ?? row.state ?? row.city ?? row.pincode,
      ];

      metrics.filter(i => i?.checked).forEach(i => {
        const metric = row?.[i.value] ?? {};

        // Always add value
        rowValues.push(metric?.value ? showValue(i, metric?.value) : "-");

        // Conditionally add reference/delta
        if (metric?.reference !== undefined) {
          rowValues.push(metric?.reference ? showValue(i, metric?.reference) : "-");
        }
        if (metric?.delta !== undefined) {
          rowValues.push(metric?.delta ? showValue(i, metric?.delta) : "-");
        }
      });

      worksheet.addRow(rowValues);
    });

    // 3. Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `performance_table_${Date.now()}.xlsx`;
    link.click();
  };



  return (
    <div className="mt-5 bg-white p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5">
        <div className="flex justify-between items-center w-full">
          {/* <h2 className="font-inter font-medium text-[18px] leading-[100%] tracking-[0] text-[#191919] flex items-center gap-2"> */}
          <h2 className="chart-title flex items-center gap-2">
            Tabular View {loadingReport && <Loader show={loadingReport} fullScreen={false} />}</h2>
          <div className="flex gap-2 items-center">
            <img src="/assets/images/downloadIcon.svg" className="w-[20px] h-[20px] cursor-pointer" alt="download" onClick={handleDownload} />
            {/* <img src="/assets/images/widget/book.png" className="w-[20px] h-[20px] cursor-pointer" alt="book" /> */}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-3 overflow-x-auto">
        {/* <div className="h-[300px] overflow-y-auto"> */}
        <div
          className="h-[300px] overflow-y-auto
               [&::-webkit-scrollbar]:hidden
               [-ms-overflow-style:'none']
               [scrollbar-width:'none']"
        >
          {/* <pre>
            {JSON.stringify(columns)}
          </pre> */}
          {/* <div className="h-[300px] overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"> */}

          <table className="min-w-full rounded-lg border-0 sticky-table">
            <thead >
              <tr className="bg-gray-50 text-gray-600 text-sm border-0">
                {columns?.map((col, colIndex) => (
                  <th
                    key={col.key}
                    className={`cursor-default font-inter font-medium text-[14px] leading-[100%] tracking-[0]  text-[#000000] border-0
                      ${col.key === "location" ? "text-left" : "text-center"} 
                      ${colIndex === 0 ? "sticky-column-header-0" : ""}
                      sticky-header`}
                  // onClick={() => handleSort(col.key)}

                  >
                    {/* <div className="flex gap-2 items-center justify-center md:justify-start"></div> */}
                    <div className={`opacity-100 gap-[4px] p-4 bg-[#F6F9FB] border-0 
                    ${col.key === "location" ? "" : "justify-center"}
                    `}
                    >
                      <span
                        className="cursor-pointer"
                        onClick={() => handleSort(col.value)}
                      >
                        {col.label}
                        <span className="align-[bottom] inline-block">
                          <img
                            src="/assets/images/widget/sort.png"
                            className={`w-[10px] transform ${sortConfig.key === col.key && sortConfig.direction === "desc" ? "rotate-180" : ""}`}
                            alt="sort"
                          />
                        </span>
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-sm border-0">
              {sortedData.length > 0 ? (
                sortedData.map((row, idx) => {
                  const locationLabel =
                    row?.location ??
                    row?.region ??
                    row?.state ??
                    row?.city ??
                    row?.pincode ??
                    "-";
                  return (
                    <tr key={row.location + idx} className={`${idx % 2 === 1 ? "bg-gray-50" : ""} border-0`}>
                      {/* Location clickable cell - drills into map */}

                      {columns?.map((col, i) => (
                        <>
                          <td
                            className={`group px-6 py-4 border-0 text-left cursor-pointer ${i === 0 ? "sticky-column-0" : ""}`}
                            onClick={() => { if (row?.pincode == undefined) { handleLocationClick(row) } }}
                          >
                            {i < 1 ?
                              <div className="flex justify-start">
                                <p className={`font-inter font-normal text-[14px] leading-[100%] tracking-[0] ${(row?.pincode == undefined) ? "underline decoration-solid decoration-0 cursor-pointer text-[#1890FF]" : "text-gray-600"} `}>
                                  {locationLabel}
                                </p>
                                {locationLabel ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, locationLabel) }}><IoMdCopy /></span> : null}
                              </div>
                              : <> {renderCell(col, row?.[col.value] ?? "-")}</>}
                          </td>
                        </>
                      ))}
                      {/* previous one */}
                      {/* <td
                        className={`px-6 py-4 border-0 text-left cursor-pointer `}
                        onClick={() => {if(row?.pincode==undefined){handleLocationClick(row)}}}
                      >
                        <p className={`font-inter font-normal text-[14px] leading-[100%] tracking-[0] ${(row?.pincode==undefined)?"underline decoration-solid decoration-0 cursor-pointer text-[#1890FF]":"text-gray-600"} `}>
                          {row?.location ?? row?.region ?? row?.state ?? row?.city ?? row?.pincode}
                        </p>
                      </td>

                      {columns?.slice(1)?.map((col, i) => (
                        <td key={i} className={`px-4 py-4 text-center border-0 `} >
                            {renderCell(col, row?.[col.value] ?? "-")}
                         
                        </td>
                      ))} */}
                    </tr>

                  );
                })
              ) : (
                <tr className="border-0">
                  <td colSpan={4} className="text-center py-4 text-gray-500 border-0">
                    No data to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTable;
