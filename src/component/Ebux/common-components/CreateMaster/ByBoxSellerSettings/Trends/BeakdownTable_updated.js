import React, { useEffect, useState } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import { fetchComprehensiveBreakdownTable } from "../../../../services/ebuxMaster.service";
// import moment from "moment";
import CustomizeCampiagnModal from "../../../CustomizeCampiangn";
// import LoaderSpinner from "../../../../../common-components/loader-spinner";



export default function BeakdownTable() {
    const { selectedFilters, filters } = useEbuxContext();
    const kpi = "BUYBOX"
    const [tableData, setTableData] = useState([]);
    const [footer, setFooter] = useState(null);
    const [loading, setLoading] = useState(false);
    console.log('loading', loading)


    const [selectedTabName,] = useState("comprehensive");
    const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });
    //  const pf_images = filters?.platform?.reduce((map, i) => { map[i.label?.toLowerCase()] = i.platform_description ?? ""; return map; }, {});

    const initTabColumnList = localStorage.getItem(`${kpi}_daily_performance`) ? JSON.parse(localStorage.getItem(`${kpi}_daily_performance`)) : {
        "comprehensive": [
            {
                "persentageValue": false,
                "title": "Seller Type",
                "type": "parameters",
                "value": "seller_type",
                "key": "seller_type",
                "breakdown": "seller_type",
                "allowKPI": [
                    kpi
                ],
                "allowInDarkStore": true,
                "isDisabled": false,
                "remove": false
            },
            {
                "persentageValue": false,
                "title": "Win Rate",
                "type": "parameters",
                "value": "win_rate",
                "key": "win_rate",
                "breakdown": "win_rate",
                "allowKPI": [
                    kpi
                ],
                "allowInDarkStore": true,
                "isDisabled": false,
                "remove": false
            },

            {
                "persentageValue": false,
                "title": "Last Check On",
                "type": "parameters",
                "value": "last_check_on",
                "key": "last_check_on",
                "breakdown": "last_check_on",
                "allowKPI": [
                    kpi
                ],
                "allowInDarkStore": true,
                "isDisabled": false,
                "remove": false
            },
        ]
    };
    console.log('initTabColumnListinitTabColumnList', initTabColumnList)

    const [tabColumnList, setTabColumnList] = useState(initTabColumnList);
    const columns = [
        {
            key: "seller_type",
            value: "seller_type",
            label: "Seller Type",
            align: "between",
            checkbox: true,
            sortable: true,
        },
        {
            key: "win_rate",
            value: "win_rate",
            label: "Win Rate",
            align: "between",
            checkbox: true,
            sortable: true,
        }
    ];
    console.log('columns', columns)
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const payload = { filters, selectedFilters, breakdown : tabColumnList?.[selectedTabName]?.filter(i=>i?.type=="breakdown")?.map(i=>i?.value) }
                const res = await fetchComprehensiveBreakdownTable(payload);

                setTableData(res?.rows || []);
                setFooter(res?.footer || null);
            } catch (err) {
                console.error("BuyBox API Error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [filters, selectedFilters,JSON.stringify(tabColumnList?.[selectedTabName])]);

    const groupedByLocation = tableData.reduce((acc, curr) => {
        if (!acc[curr.location]) acc[curr.location] = [];
        acc[curr.location].push(curr);
        return acc;
    }, {});

    useEffect(() => {
        localStorage.setItem(`${kpi}_daily_performance`, JSON.stringify(tabColumnList));
    }, [tabColumnList]);

    const handleCustomizeClick = () => {
        setCustomizeInfo(prev => ({ isOpen: !prev.isOpen, column: '' }));
    };

    const closeCustomizePopup = () => {
        setCustomizeInfo({ isOpen: false, column: null });
    };

    const getOrderedColumns = () => {
        const orderedColumnConfigs = tabColumnList[selectedTabName] || [];
        console.log('orderedColumnConfigs', orderedColumnConfigs, selectedTabName, tabColumnList)
        if (orderedColumnConfigs.length > 0) {
            // const columnsMap = new Map(columns.map(col => [col.value, col]));

            return orderedColumnConfigs.map(config => {
                // const existingCol = columnsMap.get(config.key);
                // if (existingCol) {
                //     return existingCol;
                // }
                return {
                    ...config,
                    label: config.title,
                    align: config?.align ?? "center",
                    sortable: true,
                };
            });
        }

        return columns;
    };
    const orderedColumns = getOrderedColumns();
    console.log('orderedColumnsorderedColumns', orderedColumns)
    useEffect(() => {
        const columns = getOrderedColumns();
        console.log(columns);

        // if (_.size(columns)) {
        //     let additionalFilterObj = [];
        //     for (const e of columns) {
        //         if (e?.type == "breakdown") {
        //             additionalFilterObj.push(e.value);
        //         }
        //     }
        //     console.log('columnscolumnscolumns', additionalFilterObj)
        //     // setAdditionalFilter(additionalFilterObj)

        //     const tagFilter = searchFilterArray.find((ele) => ele.key === "metric");
        //     tagFilter.children = [];
        //     const updatedArray = searchFilterArray.map((ele) => {
        //         if (ele.key === "metric") {
        //             for (const e of columns) {
        //                 if (e.type == "parameters") {
        //                     ele.children.push({
        //                         label: e?.title,
        //                         key: e?.value,
        //                         persentageValue: e?.persentageValue ?? false,
        //                         action: FILTERACTION.METRIC,
        //                     });
        //                 }
        //             }
        //         }
        //         return ele;
        //     });
        //     // setSearchFilterArray(updatedArray);
        // }
    }, [JSON.stringify(tabColumnList?.[selectedTabName])]);

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
    return (
        <>
            <div className="px-4 w-full flex-[0_0_auto] mb-[200px]">
                <div className="card border rounded-xl">
                    <div className="flex items-center justify-between border-b py-2 px-3">
                        <h3 className="text-[18px] font-medium text-[#000000]">Comprehensive Breakdown</h3>
                        <img src="/assets/images/master/columns.png" onClick={handleCustomizeClick} alt="columngs img" />
                    </div>

                    {/* <div className="max-w-full overflow-x-auto h-[420px] overflow-y-auto scroll-smooth"> */}
                    <div className="max-w-full overflow-x-auto ">
                        <table className="w-full table-fixed text-sm text-left border-collapse no-zebra">
                            <thead className="bg-[#FAFAFA] sticky top-0">
                                {/* <tr>
                                    <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-[14px] text-[#000000]">Location</span>
                                            <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                                        </div>
                                    </th>

                                    <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                                        <div className="flex items-center justify-between">
                                            <span>Products Name</span>
                                            <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                                        </div>
                                    </th>

                                    <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                                        <div className="flex items-center justify-between">
                                            <span>Seller Type</span>
                                            <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                                        </div>
                                    </th>

                                    <th className="px-4 py-3 text-sm font-medium border-b border-r border-gray-200 w-[20%]">
                                        <div className="flex items-center justify-between">
                                            <span>Win Rate</span>
                                            <img src="/assets/images/master/filter.png" className="w-3 h-3" alt="" />
                                        </div>
                                    </th>

                                    <th className="px-4 py-3 text-sm font-medium border-b border-gray-200 w-[20%]">
                                        Last Check On
                                    </th>
                                </tr> */}
                                {orderedColumns
                                    .filter(i => i?.type == "breakdown")
                                    .map((col, colIndex) => (
                                        <th
                                            key={col.value}
                                            // onClick={col.sortable ? () => handleSort(col.value) : undefined}
                                            className={`
                                                      p-4 text-sm border-none
                                                      ${col.sortable ? "cursor-pointer" : ""}
                                                      ${col.align === "left" ? "text-left" : "text-center"}
                                                      ${colIndex === 0 ? "sticky-column-header-0" : ""}
                                                      sticky-header
                                                    `}
                                            style={{
                                                width: colIndex < 1 ? 'auto' : 'auto',
                                                minWidth: colIndex < 1 ? 'auto' : 'auto'
                                            }}
                                        >
                                            <div className={`flex items-center  ${col.align === "left" ? "justify-start" :
                                                col.align === "right" ? "justify-end" :
                                                    col.align === "between" ? "gap-8" : "justify-start"
                                                }`}>

                                                <span>{col.label}</span>
                                                {col.sortable
                                                    // && <FaSort className="inline h-3 w-3" />
                                                }
                                            </div>
                                        </th>
                                    ))}

                                {orderedColumns
                                    .filter(i => i?.type == "parameters")
                                    .map((col, colIndex) => (
                                        <th
                                            key={col.value}
                                            // onClick={col.sortable ? () => handleSort(col.value) : undefined}
                                            className={`
                                                      p-4 text-sm border-none
                                                      ${col.sortable ? "cursor-pointer" : ""}
                                                      ${col.align === "left" ? "text-left" : "text-center"}
                                                      sticky-header
                                                    `}
                                            style={{
                                                width: colIndex < 1 ? 'auto' : 'auto',
                                                minWidth: colIndex < 1 ? 'auto' : 'auto'
                                            }}
                                        >
                                            <div className={`flex items-center  ${col.align === "left" ? "justify-start" :
                                                col.align === "right" ? "justify-end" :
                                                    col.align === "between" ? "gap-8" : "justify-start"
                                                }`}>

                                                <span>{col.label}</span>
                                                {col.sortable
                                                    // && <FaSort className="inline h-3 w-3" />
                                                }
                                            </div>
                                        </th>
                                    ))}
                            </thead>
                            {/* <tbody
                                className="
    text-gray-700
    [&_td]:bg-transparent
    [&_td]:border-r [&_td]:border-gray-200
    [&_td:last-child]:border-r-0
    [&_tr]:border-b [&_tr]:border-gray-200
  "
                            >
                                {loading && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6">Loading...</td>
                                    </tr>
                                )}

                                {!loading &&
                                    Object.entries(groupedByLocation).map(([location, products]) =>
                                        products.map((row, idx) => (
                                            <tr key={`${location}-${idx}`}>


                                                {idx === 0 && (
                                                    <td
                                                        rowSpan={products.length}
                                                        className="px-4 py-4 font-normal align-middle border-r border-gray-200"
                                                    >
                                                        {location}
                                                    </td>
                                                )}


                                                <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">
                                                    {row.product_name}
                                                </td>


                                                <td className="px-4 py-4 space-y-1 font-normal text-[14px] text-[#000000]">
                                                    <div>1P</div>
                                                    <div>2P</div>
                                                    <div>3P</div>
                                                </td>


                                                <td className="px-4 py-4 space-y-1 font-medium">
                                                    <div>{Math.round(row.p1_percentage)}%</div>
                                                    <div>{Math.round(row.p2_percentage)}%</div>
                                                    <div>{Math.round(row.p3_percentage)}%</div>
                                                </td>


                                                <td className="px-4 py-4 font-normal text-[14px] text-[#000000]">
                                                    {row.last_check_on
                                                        ? moment(row.last_check_on).format("DD-MM-YYYY")
                                                        : "-"}
                                                </td>

                                            </tr>
                                        ))
                                    )}
                            </tbody> */}


                            <tbody
                                className="
    text-gray-700
    [&_td]:bg-transparent
    [&_td]:border-r [&_td]:border-gray-200
    [&_td:last-child]:border-r-0
    [&_tr]:border-b [&_tr]:border-gray-200
  "
                            >
                                {/* ✅ Loading State */}
                                {loading && (
                                    <tr>
                                        <td colSpan={orderedColumns.length + 1} className="text-center py-6">
                                            Loading...
                                        </td>
                                    </tr>
                                )}

                                {/* ✅ Data Rows */}
                                {!loading &&
                                    Object.entries(groupedByLocation).map(([location, products], locationIndex) =>
                                        products.map((row, idx) => {
                                            const isStriped = locationIndex % 2 === 0 ? "#fff" : "#F9FAFA";

                                            return (
                                                <tr key={`${location}-${idx}`} style={{ background: isStriped }}>


                                                    {orderedColumns
                                                        .filter(i => i?.type == "breakdown").map((col, colIndex) => (
                                                            <td
                                                                key={`${location}-${idx}-${col.value}`}
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
                                                                {/* ✅ Platform with Image */}
                                                                {

                                                                            /* ✅ Normal Metric */
                                                                            (
                                                                                renderCell(col, row?.[col.value] ?? null)
                                                                            )}
                                                            </td>
                                                        ))}

                                                    {orderedColumns
                                                        .filter(i => i?.type == "parameters")
                                                        .map((col, colIndex) => (
                                                            <td
                                                                key={`${location}-${idx}-${col.value}`}
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
                                                                {/* ✅ Platform with Image */}
                                                                {

                                                                    /* ✅ Breakdown Columns */
                                                                    // col?.type === "breakdown" ? (
                                                                    //     row?.[col.value] ?? "-"
                                                                    // ) :
                                                                    col?.key == "seller_type" ?
                                                                        <>  <div>1P</div>
                                                                            <div>2P</div>
                                                                            <div>3P</div></>
                                                                        :
                                                                        col?.key == "win_rate" ?
                                                                            <>  <div>{Math.round(row.p1_percentage)}%</div>
                                                                                <div>{Math.round(row.p2_percentage)}%</div>
                                                                                <div>{Math.round(row.p3_percentage)}%</div></>
                                                                            :

                                                                            /* ✅ Normal Metric */
                                                                            (
                                                                                renderCell(col, row?.[col.value] ?? null)
                                                                            )}
                                                            </td>
                                                        ))}
                                                </tr>
                                            );
                                        })
                                    )}
                            </tbody>


                            {/* {groupedByLocation.map((section, dateIndex) => {
                const isStriped = dateIndex % 2 === 0 ? "white" : "#F9FAFA";
                return (
                  <tr
                    key={`${dateIndex}`}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {orderedColumns.map((col, colIndex) => {
                      if (col.value === "date") {
                        return colIndex === 0 ? (
                          <td
                            key={`${dateIndex}-${colIndex}-${col.value}`}
                            className={`px-4 py-2 text-center align-middle border-none 
                                  ${colIndex === 0 ? "sticky-column-0" : ""}
                                `}
                            style={{
                              background: isStriped,
                              borderTopLeftRadius: "12px",
                              borderBottomLeftRadius: "12px",
                              width: 'auto',
                              minWidth: 'auto',

                              // ensure wrapping is allowed
                            }}

                          >
                            <div className="flex items-center justify-start gap-8">
                              <span>{section?.date ? moment(new Date(section?.date))?.format("DD-MM-YYYY") : ""}</span>
                            </div>
                          </td>
                        ) : null;
                      }

                      return (
                        <td
                          key={`${dateIndex}-${colIndex}-${col.value}`}
                          className={`
                                px-4 py-2 border-none text-left
                              `}
                          style={{
                            background: isStriped,
                            width: colIndex < 1 ? 'auto' : '200px',
                            minWidth: colIndex < 1 ? 'auto' : '200px',
                            maxWidth: '600px',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal', // Changed from 'nowrap'
                          }}
                        // style={{
                        //   background: isStriped,
                        //   width: col.value === "platform" ? "200px" : "auto",
                        //   minWidth: col.value === "platform" ? "200px" : "auto",
                        //   maxWidth: col.value === "platform" ? "200px" : "600px",

                        //   // Prevent text breaking for platform column
                        //   whiteSpace: col.value === "platform" ? "nowrap" : "normal",
                        //   overflowWrap: col.value === "platform" ? "normal" : "break-word",
                        //   wordBreak: col.value === "platform" ? "normal" : "break-word",
                        // }}
                        >
                          {
                        //   col.value === "platform" ?
                        //     <span className="flex items-center gap-2">
                        //       {pf_images?.[section?.[col.value]?.toLowerCase()] ? <img
                        //         src={pf_images?.[section?.[col.value]?.toLowerCase()]}
                        //         alt={section?.[col.value]}
                        //         className="oos-plat-img max-w-9 max-h-9 object-contain"
                        //       /> : <></>}
                        //       {(section?.[col.value] ?? '-')}
                        //     </span>
                        //     :
                        //     col.value === "product_image" ?
                        //       <span className="flex items-center gap-2">
                        //         {section?.[col.value] ? <img
                        //           src={section?.[col.value]}
                        //           alt={section?.[col.value]}
                        //           className="oos-plat-img max-w-9 max-h-9 object-contain"
                        //         /> : <></>}
                        //       </span>
                        //       :
                              col.value && col?.type == 'breakdown' ? (section?.[col.value] ?? '-') : col.value && renderCell(col, (section?.[col.value] ?? null))
                          }
                        </td>
                      );
                    })}
                  </tr>
                );
              })} */}
                            {/* Loading spinner */}
                            {/* {isLazyLoading && (
                <tr>
                  <td colSpan={orderedColumns.length}>
                    <div className="flex justify-center p-4">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              )} */}

                            {/* <tfoot>
                                <tr className="bg-gray-50 border-t">
                                    <td className="px-4 py-4">
                                        <p className="text-[#000000] text-normal text-[12px]">Total Location</p>
                                        <p className="font-medium">{footer?.total_locations ?? 0}</p>
                                    </td>

                                    <td className="px-4 py-4">
                                        <p className="text-[#000000] text-normal text-[12px]">Total Products</p>
                                        <p className="font-medium">{footer?.total_products ?? 0}</p>
                                    </td>

                                    <td className="px-4 py-4">
                                        <p className="text-[#000000] text-normal text-[12px]">Total Seller Type</p>
                                        <p className="font-medium">{footer?.total_seller_types ?? 0}</p>
                                    </td>

                                    <td className="px-4 py-4">
                                        <p className="text-[#000000] text-normal text-[12px]">Average Win Rate</p>
                                        <p className="font-medium">
                                            {footer?.avg_win_rate
                                                ? `${Math.round(footer.avg_win_rate)}%`
                                                : "0%"}
                                        </p>
                                    </td>

                                    <td></td>
                                </tr>
                            </tfoot> */}

                            <tfoot>
                                <tr className="bg-gray-50 border-t text-gray-700">

                                    {/* ✅ Total Locations (matches Location column) */}
                                    {/* <td className="px-4 py-4">
      <p className="text-[#000000] text-[12px]">Total Location</p>
      <p className="font-medium">{footer?.total_locations ?? 0}</p>
    </td> */}

                                    {/* ✅ Map Footer Values to Ordered Columns */}
                                    {orderedColumns.filter(i => i?.type == "breakdown").map((col) => {
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
                                                    <p className="font-medium">
                                                        {footer?.avg_win_rate
                                                            ? `${Math.round(footer.avg_win_rate)}%`
                                                            : "0%"}
                                                    </p>
                                                </td>
                                            );
                                        }

                                        // ✅ Empty cells for other dynamic columns
                                        return <td key={col.value}></td>;
                                    })}

                                    {orderedColumns.filter(i => i?.type == "parameters").map((col) => {
                                        
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
                                                    <p className="font-medium">
                                                        {footer?.avg_win_rate
                                                            ? `${Math.round(footer.avg_win_rate)}%`
                                                            : "0%"}
                                                    </p>
                                                </td>
                                            );
                                        }

                                        // ✅ Empty cells for other dynamic columns
                                        return <td key={col.value}></td>;
                                    })}
                                </tr>
                            </tfoot>


                        </table>

                    </div>
                </div>
            </div>
            {customizeInfo.isOpen && (
                <CustomizeCampiagnModal
                    isWidget={true}
                    kpi={"BUYBOX"}
                    selectedTabName={selectedTabName}
                    closePopup={closeCustomizePopup}
                    tabColumnList={tabColumnList}
                    // setTabColumnList={[]}
                    setTabColumnList={setTabColumnList}
                    isSaveViewVisible={false}
                    // columnVisible="ds"
                    // fixedColumns={defaultfixedColumns}
                    //  dummyColumnGroup={[]}

                    initCustomizeColumns={{
                        "breakdown": {
                            "title": "Breakdowns",
                            "columns": [

                                // {
                                //     "persentageValue": false,
                                //     "title": "Platform",
                                //     "type": "breakdown",
                                //     "value": "platform",
                                //     "key": "platform",
                                //     "breakdown": "Platform",
                                //     "allowKPI": [
                                //         kpi,
                                //     ],
                                //     "allowInDarkStore": true,
                                //     "isDisabled": false
                                // },

                                {
                                    "persentageValue": false,
                                    "title": "Brands",
                                    "type": "breakdown",
                                    "value": "brand",
                                    "key": "brand",
                                    "breakdown": "Brand",
                                    "allowKPI": [
                                        kpi
                                    ],
                                    "notAllowWithIsValueIn": [],
                                    "allowWithIsValueIn": [],
                                    "allowInDarkStore": true,
                                    "isDisabled": false,
                                    
                                },

                                {
                                    "persentageValue": false,
                                    "title": "Pincode",
                                    "type": "breakdown",
                                    "value": "pincode",
                                    "key": "pincode",
                                    "breakdown": "",
                                    "allowKPI": [
                                        kpi
                                    ],
                                    "notAllowWithIsValueIn": [
                                        "rating_value",
                                        "review_count"
                                    ],
                                    "allowWithIsValueIn": [],
                                    "allowInDarkStore": true,
                                    "isDisabled": false,
                                    
                                },
                                {
                                    "persentageValue": false,
                                    "title": "SKU",
                                    "type": "breakdown",
                                    "value": "product",
                                    "key": "product",
                                    "breakdown": "SKU",
                                    "allowKPI": [
                                        kpi
                                    ],
                                    "notAllowWithIsValueIn": [],
                                    "allowWithIsValueIn": [],
                                    "allowInDarkStore": true,
                                    "isDisabled": false,
                                    
                                }
                            ]
                        }
                    }}
                />
            )}
        </>
    );
}

