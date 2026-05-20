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
                const payload = { filters, selectedFilters, breakdown: tabColumnList?.[selectedTabName]?.filter(i => i?.type == "breakdown")?.map(i => i?.value) }
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
    }, [filters, selectedFilters, JSON.stringify(tabColumnList?.[selectedTabName])]);

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
            <div className="px-4 w-full flex-[0_0_auto] mb-[50px]">
                <div className="card border rounded-xl">
                    <div className="flex items-center justify-between border-b py-2 px-3">
                        <h3 className="text-[18px] font-medium text-[#000000]">Comprehensive Breakdown</h3>
                        <img src="/assets/images/master/columns.png" onClick={handleCustomizeClick} alt="columngs img" />
                    </div>

                    <div className="max-w-full overflow-x-auto h-[600px] overflow-y-auto scroll-smooth">
                        {/* <div className="max-w-full overflow-x-auto "> */}
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

                            <tbody
                                className="
    text-gray-700
    [&_td]:bg-transparent
    [&_td]:border-r [&_td]:border-gray-200
    [&_td:last-child]:border-r-0
    [&_tr]:border-b [&_tr]:border-gray-200
  "
                            >
                                {/* Loading */}
                                {loading && (
                                    <tr>
                                        <td colSpan={orderedColumns.length + 1} className="text-center py-6">
                                            Loading...
                                        </td>
                                    </tr>
                                )}

                                {/* Data */}
                                {!loading &&
                                    Object.entries(groupedByLocation).map(([location, products], locationIndex) => {
                                        const isStripedBase = locationIndex % 2 === 0 ? "#fff" : "#F9FAFA";

                                        // detect breakdown columns & specific columns (fallback if not found)
                                        const breakdownCols = orderedColumns.filter(i => i?.type === "breakdown");

                                        const skuCol = breakdownCols.find(c =>
                                            (c.label && c.label.toLowerCase().includes("sku")) ||
                                            (c.value && c.value.toLowerCase().includes("sku")) ||
                                            c.label === "Products Name" || c.label === "SKU"
                                        );
                                        const pincodeCol = breakdownCols.find(c =>
                                            (c.label && c.label.toLowerCase().includes("pincode")) ||
                                            (c.value && c.value.toLowerCase().includes("pincode")) ||
                                            c.label === "Pincode"
                                        );
                                        const brandsCol = breakdownCols.find(c =>
                                            (c.label && c.label.toLowerCase().includes("brand")) ||
                                            (c.value && c.value.toLowerCase().includes("brand")) ||
                                            c.label === "Brands"
                                        );

                                        const productKey = skuCol?.value ?? "product_name"; // change fallback if needed
                                        const pincodeKey = pincodeCol?.value ?? "pincode";
                                        const brandsKey = brandsCol?.value ?? "brands";

                                        // track last shown values so duplicates across the whole group become blank
                                        let lastProduct = null;
                                        let lastPincode = null;
                                        let lastBrand = null;

                                        // seller types config (adjust pctField names if your data uses different names)
                                        const sellerTypes = [
                                            { key: "1P", pctField: "p1_percentage" },
                                            { key: "2P", pctField: "p2_percentage" },
                                            { key: "3P", pctField: "p3_percentage" },
                                        ];

                                        return products.flatMap((row, idx) => {
                                            const isStriped = isStripedBase;

                                            // build 3 rows for this product
                                            const rowsForThisProduct = sellerTypes.map((seller, sIdx) => {
                                                const showPrimaryColsOnThisSellerRow = sIdx === 0; // only the first of the 3 rows may show SKU/Pincode/Brand

                                                return (
                                                    <tr key={`${location}-${idx}-seller-${seller.key}`} style={{ background: isStriped }}>
                                                        {/* Breakdown columns */}
                                                        {breakdownCols.map((col, colIndex) => {
                                                            const colVal = row?.[col.value] ?? null;

                                                            const isSku = col.value === productKey;
                                                            const isPincode = col.value === pincodeKey;
                                                            const isBrand = col.value === brandsKey;

                                                            // default: visible
                                                            let shouldShow = true;

                                                            // If this is one of the primary columns, only show on the first seller row and only if not shown earlier
                                                            if (isSku) {
                                                                if (!showPrimaryColsOnThisSellerRow) {
                                                                    shouldShow = false;
                                                                } else {
                                                                    // show only if value !== lastProduct
                                                                    shouldShow = row[productKey] !== lastProduct;
                                                                }
                                                            } else if (isPincode) {
                                                                if (!showPrimaryColsOnThisSellerRow) {
                                                                    shouldShow = false;
                                                                } else {
                                                                    shouldShow = row[pincodeKey] !== lastPincode;
                                                                }
                                                            } else if (isBrand) {
                                                                if (!showPrimaryColsOnThisSellerRow) {
                                                                    shouldShow = false;
                                                                } else {
                                                                    shouldShow = row[brandsKey] !== lastBrand;
                                                                }
                                                            } else {
                                                                // non-primary breakdown column -> always show
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

                                                        {/* Parameters columns (seller_type, win_rate, etc.) */}
                                                        {orderedColumns
                                                            .filter(i => i?.type == "parameters")
                                                            .map((col, colIndex) => {
                                                                // Seller Type column -> show 1P/2P/3P
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

                                                                // Win Rate column -> show corresponding percentage for this seller
                                                                if (col?.key === "win_rate") {
                                                                    const pct = row?.[seller.pctField];
                                                                    const pctText = typeof pct === "number" ? `${Math.round(pct)}%` : (pct ?? "-");
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
                                                                            <div>{pctText}</div>
                                                                        </td>
                                                                    );
                                                                }

                                                                // Default parameter cell
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
                                            }); // end sellerTypes.map

                                            // after generating rows for this product, update last seen values
                                            lastProduct = row[productKey];
                                            lastPincode = row[pincodeKey];
                                            lastBrand = row[brandsKey];

                                            // return the rows for this product (flatMap will flatten them)
                                            return rowsForThisProduct;
                                        }); // end products.flatMap
                                    })}
                            </tbody>







                        </table>



                    </div>
                    <div className="w-full cmp-footer bg-gray-50 border border-[#e5e7eb] text-gray-700 grid pr-[5px]"
                        style={{ gridTemplateColumns: `repeat(${orderedColumns.length}, minmax(0, 1fr))` }}
                    >
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

