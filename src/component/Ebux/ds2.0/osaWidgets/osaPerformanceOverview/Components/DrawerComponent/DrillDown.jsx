import React, { useEffect, useState } from 'react'
import ComprehenisiveFilter from './filter/ComprehenisiveFilter'
import PerformanceTable from './table/PerformanceTable';
import CustomizeCampiagnModal from '../../../../../common-components/CustomizeCampiangn';
import { useEbuxContext } from '../../../../../Context/EbuxProvider';
import moment from 'moment';
import Excel from "exceljs";

import {
    FILTERACTION,
    searchFilterArr
} from "../../../../../common-components/MultiFilter/FilterConstant";
import _ from 'lodash';
const isShowDummyData = false;
const platformData = (!isShowDummyData) ? [] : [
    {
        name: "Amazon",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Zepto",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Blinkit",
        "osa": { value: 75, reference: 85, delta: -10 },
        "wt_osa": { value: 75, reference: 85, delta: -10 },
        "avg_offtake_osa": { value: 75, reference: 85, delta: -10 },
    },
    {
        name: "Instamart",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Pharmeasy",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Tata 1mg",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Big Basket",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Nykaa",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Myntra",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Flipkart Super",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
];

const locationData = (!isShowDummyData) ? [] : [
    {
        name: "Delhi",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Haryana",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Uttar Pradesh",
        "osa": { value: 75, reference: 85, delta: -10 },
        "wt_osa": { value: 75, reference: 85, delta: -10 },
        "avg_offtake_osa": { value: 75, reference: 85, delta: -10 },
    },
    {
        name: "Punjab",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Himachal Pradesh",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Rajasthan",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Madhya Pradesh",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Maharashtra",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Goa",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Tamil Nadu",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
];

const productData = (!isShowDummyData) ? [] : [
    {
        name: "Nescafé Classic 100g Jar",
        skuId: "823984571",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Nescafé Gold Blend 50g",
        skuId: "823984571",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "NesTea Peach Iced Tea",
        skuId: "823984571",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Nescafé Sunrise Instant",
        skuId: "823984571",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Nescafé Black Roast Coffee",
        skuId: "823984571",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Maggi 2-Minute Noodles",
        skuId: "823984571",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Maggi Oats Noodles",
        skuId: "823984571",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "KitKat 4-Finger Milk Chocolate",
        skuId: "823984571",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "KitKat Chunky Bar",
        skuId: "823984571",
        "osa": { value: 75, reference: 60, delta: 15 },
        "wt_osa": { value: 75, reference: 60, delta: 15 },
        "avg_offtake_osa": { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Maggi Oats Noodles",
        skuId: "823984571",
        "osa": { value: 80, reference: 85, delta: -5 },
        "wt_osa": { value: 80, reference: 85, delta: -5 },
        "avg_offtake_osa": { value: 80, reference: 85, delta: -5 },
    },
];
const keywordData = [];

const keywordFooter = {};
const platformFooter = (!isShowDummyData) ? {} : { platform: 12, osa: 70, wt_osa: 45, avg_offtake_osa: 78 };
const locationFooter = (!isShowDummyData) ? {} : { location: 3, osa: 73, wt_osa: 72, avg_offtake_osa: 74 };
const productFooter = (!isShowDummyData) ? {} : {
    product: 12,
    sku_id: 12,
    osa: 40,
    wt_osa: 40,
    avg_offtake_osa: 40,
    dummy: "-"
};
const DrillDownBox = ({ drillDownData, tableOf, rowData, footerData, selectedRows, setSelectedKey, setSelected = () => { }, selected = [] }) => {

    const { kpi, clientCustomizeColumnsComprehensiveBreakdown, selectedFilters } = useEbuxContext();


    const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });
    const [tabColumnList, setTabColumnList] = useState({});
    const [selectedTabName,] = useState("comprehensive");

    // const kpicol = (
    //     kpi == "OSA" ?
    //         [
    //             {
    //                 "persentageValue": true,
    //                 "title": "Avg OSA",
    //                 "type": "parameters",
    //                 "value": "osa",
    //                 "key": "osa",
    //                 "kpi": [
    //                     "OSA"
    //                 ],
    //                 "allowKPI": [
    //                     "OSA",
    //                     "CS",
    //                     "PRO",
    //                     "RR"
    //                 ],
    //                 "notAllowWithIsValueIn": [],
    //                 "allowWithIsValueIn": [],
    //                 "isDisabled": false
    //             },
    //             {
    //                 "persentageValue": true,
    //                 "title": "Wt OSA",
    //                 "type": "parameters",
    //                 "value": "wt_osa",
    //                 "key": "wt_osa",
    //                 "kpi": [
    //                     "OSA"
    //                 ],
    //                 "allowKPI": [
    //                     "OSA",
    //                     "CS",
    //                     "PRO",
    //                     "RR"
    //                 ],
    //                 "notAllowWithIsValueIn": [],
    //                 "allowWithIsValueIn": [],
    //                 "isDisabled": false
    //             },
    //             {
    //                 "persentageValue": true,
    //                 "title": "Avg Off-Take OSA",
    //                 "type": "parameters",
    //                 "value": "avg_offtake_osa",
    //                 "key": "avg_offtake_osa",
    //                 "kpi": [
    //                     "OSA"
    //                 ],
    //                 "allowKPI": [
    //                     "OSA",
    //                     "CS",
    //                     "PRO",
    //                     "RR"
    //                 ],
    //                 "notAllowWithIsValueIn": [],
    //                 "allowWithIsValueIn": [],
    //                 "isDisabled": false
    //             }
    //         ]
    //         :
    //         kpi == "SOS" ?
    //             [{
    //                 "persentageValue": true,
    //                 "title": "SOS",
    //                 "type": "parameters",
    //                 "value": "sos",
    //                 "key": "sos",
    //                 "kpi": [
    //                     "SOS"
    //                 ],
    //                 "allowKPI": [
    //                     "SOS"
    //                 ],
    //                 "notAllowWithIsValueIn": [],
    //                 "allowWithIsValueIn": [],
    //                 "isDisabled": false
    //             },
    //             {
    //                 "persentageValue": false,
    //                 "title": "Ranking",
    //                 "type": "parameters",
    //                 "value": "or",
    //                 "key": "or",
    //                 "kpi": [
    //                     "SOS"
    //                 ],
    //                 "allowKPI": [
    //                     "SOS"
    //                 ],
    //                 "notAllowWithIsValueIn": [],
    //                 "allowWithIsValueIn": [],
    //                 "isDisabled": false
    //             }
    //             ]
    //             :
    //             [
    //                 {
    //                     "persentageValue": true,
    //                     "title": "Promotions",
    //                     "type": "parameters",
    //                     "value": "pro",
    //                     "key": "pro",
    //                     "kpi": [
    //                         "PRO"
    //                     ],
    //                     "allowKPI": [
    //                         "OSA",
    //                         "CS",
    //                         "PRO",
    //                         "RR"
    //                     ],
    //                     "notAllowWithIsValueIn": [],
    //                     "allowWithIsValueIn": [],
    //                     "isDisabled": false
    //                 },
    //                 {
    //                     "persentageValue": false,
    //                     "title": "MRP",
    //                     "type": "parameters",
    //                     "value": "mrp",
    //                     "key": "mrp",
    //                     "kpi": [
    //                         "PRO"
    //                     ],
    //                     "allowKPI": [
    //                         "OSA",
    //                         "CS",
    //                         "PRO",
    //                         "RR"
    //                     ],
    //                     "notAllowWithIsValueIn": [],
    //                     "allowWithIsValueIn": [],
    //                     "isDisabled": false
    //                 },
    //                 {
    //                     "persentageValue": false,
    //                     "title": "SP",
    //                     "type": "parameters",
    //                     "value": "sp",
    //                     "key": "sp",
    //                     "kpi": [
    //                         "PRO"
    //                     ],
    //                     "allowKPI": [
    //                         "OSA",
    //                         "CS",
    //                         "PRO",
    //                         "RR"
    //                     ],
    //                     "notAllowWithIsValueIn": [],
    //                     "allowWithIsValueIn": [],
    //                     "isDisabled": false
    //                 }])
    const kpicol = (clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => (i?.allowInWidget && (i?.allowKPI?.indexOf(kpi) > -1) && (!i?.value?.includes("competition_")) && (["previous_osa", "last_month_sale"]?.indexOf(i?.key) == -1)))?.map(i => ({ ...i, label: i?.title, id: i?.value, checked: ((i?.kpi?.indexOf(kpi) > -1) || ((!i?.isDisabled) && (drillDownData?.data?.visibleMatrix?.length) && (drillDownData?.data?.visibleMatrix?.findIndex(v => v?.value == i?.value) > -1))), disabled: i?.isDisabled })));

    const platformColumn = [
        {
            type: "breakdown",
            key: "platform",
            value: "platform",
            label: "Platform",
            align: "left",
            checkbox: true,
            sortable: true,
        }
    ];
    const locationColumn = [
        {
            type: "breakdown",
            key: "location",
            value: "location",
            label: "Location",
            align: "left",
            checkbox: true,
            sortable: true,
        }
    ];
    const productsColumn = [
        {
            type: "breakdown",
            key: "product",
            value: "product",
            label: "Products",
            align: "left",
            checkbox: true,
            sortable: true,
        },
        {
            type: "breakdown",
            key: "skuId",
            value: "skuId",
            label: "SKU Id",
            align: "left",
            sortable: true,
        },
    ];
    const keywordColumn = [
        {
            type: "breakdown",
            key: "keyword",
            value: "keyword",
            label: "Keywords",
            align: "left",
            checkbox: true,
            sortable: true,
        }
    ];
    const tableColumn = [
        ...(
            tableOf == "Location" ?
                locationColumn :
                tableOf == "Platform" ?
                    platformColumn :
                    tableOf == "Product" ?
                        productsColumn :
                        tableOf == "Keyword" ?
                            keywordColumn : []

        )
        ,
        ...(kpicol?.filter(i => i?.checked)?.map(i => (
            {
                ...i,
                label: i.title,
                align: "center",
                sortable: true
            })) ?? [])
    ]
    const tableBreakdown =
        (
            tableOf == "Platform" ? [
                {
                    "persentageValue": false,
                    "title": "Platform",
                    "type": "breakdown",
                    "value": "platform",
                    "key": "platform",
                    "breakdown": "",
                    "allowKPI": [
                        "OSA",
                        "CS",
                        "PRO",
                        "RR",
                        "SOS",
                        "OR",
                        "SOD"
                    ],
                    "notAllowWithIsValueIn": [],
                    "allowWithIsValueIn": [],
                    "isDisabled": true,
                    "remove": false,
                    "drag": false,
                    "align": "left"
                }
            ]
                : tableOf == "Location" ? [
                    {
                        "persentageValue": false,
                        "title": "Location",
                        "type": "breakdown",
                        "value": "location",
                        "key": "location",
                        "breakdown": "",
                        "allowKPI": [
                            "OSA",
                            "CS",
                            "PRO",
                            "RR",
                            "SOS",
                            "OR",
                            "SOD"
                        ],
                        "notAllowWithIsValueIn": [],
                        "allowWithIsValueIn": [],
                        "isDisabled": true,
                        "remove": false,
                        "drag": false,
                        "align": "left"
                    }
                ]
                    : tableOf == "Product" ? [

                        {
                            "persentageValue": false,
                            "title": "Product Name",
                            "type": "breakdown",
                            "value": "product",
                            "key": "product",
                            "breakdown": "",
                            "allowKPI": [
                                "OSA",
                                "CS",
                                "PRO",
                                "RR",
                                "SOD"
                            ],
                            "notAllowWithIsValueIn": [],
                            "allowWithIsValueIn": [],
                            "isDisabled": true,
                            "remove": false,
                            "drag": false,
                            "align": "left"
                        },

                        {
                            "persentageValue": false,
                            "title": "SKU Id",
                            "type": "breakdown",
                            "value": "skuId",
                            "key": "skuId",
                            "breakdown": "",
                            "allowKPI": [
                                "OSA",
                                "CS",
                                "PRO",
                                "RR",
                                "SOD"
                            ],
                            "notAllowWithIsValueIn": [],
                            "allowWithIsValueIn": [],
                            "isDisabled": true,
                            "remove": false,
                            "drag": false,
                            "align": "left"
                        }
                    ]
                        : tableOf == "Keyword" ? [

                            {
                                "persentageValue": false,
                                "title": "Keyword",
                                "type": "breakdown",
                                "value": "keyword",
                                "key": "keyword",
                                "breakdown": "",
                                "allowKPI": [
                                    "SOS",
                                    "OR"
                                ],
                                "notAllowWithIsValueIn": [],
                                "allowWithIsValueIn": [],
                                "isDisabled": true,
                                "remove": false,
                                "drag": false,
                                "align": "left"
                            },
                        ]
                            : []
        )
    const [defaultfixedColumns, setDefaultFixedColumns] = useState([
        ...(tableBreakdown ?? [])
        ,
        ...(kpicol?.filter(i => i?.checked) ?? [])
    ]);

    const handleCustomizeClick = () => {
        setCustomizeInfo(prev => ({ isOpen: !prev.isOpen, column: '' }));
    };

    const closeCustomizePopup = () => {
        setCustomizeInfo({ isOpen: false, column: null });
    };
    const getOrderedColumns = () => {
        const orderedColumnConfigs = tabColumnList[selectedTabName] || [];

        if (orderedColumnConfigs.length > 0) {
            const columnsMap = new Map(tableColumn.map(col => [col.key, col]));

            return orderedColumnConfigs.map(config => {
                const existingCol = columnsMap.get(config.key);
                if (existingCol) {
                    return existingCol;
                }
                return {
                    ...config,
                    label: config.title,
                    align: config?.align ?? "center",
                    sortable: true,
                };
            });
        }

        return tableColumn;
    };


    useEffect(() => {
        if (tabColumnList[selectedTabName]?.length > 0) {
            setDefaultFixedColumns(tabColumnList[selectedTabName]);
        }
    }, [tabColumnList, selectedTabName]);

    const orderedColumns = getOrderedColumns();

    const [searchFilterArray, setSearchFilterArray] = useState(searchFilterArr);
    const [additionalFilter, setAdditionalFilter] = useState([]);

    useEffect(() => {
        const columns = getOrderedColumns();
        // console.log('tabColumnList',tabColumnList,selectedTabName)
        if (_.size(columns)) {
            let additionalFilterObj = [];
            for (const e of columns) {
                if (e?.type == "breakdown") {
                    //    console.log('e.value',e.value)
                    additionalFilterObj.push(e.value);
                }
            }
            setAdditionalFilter(additionalFilterObj)

            const tagFilter = searchFilterArray.find((ele) => ele.key === "metric");
            tagFilter.children = [];
            const updatedArray = searchFilterArray.map((ele) => {
                // console.log('ele.key',ele.key)
                if (ele.key === "metric") {
                    for (const e of columns) {
                        if (e.type == "parameters") {
                            ele.children.push({
                                label: e?.title,
                                key: e?.value,
                                persentageValue: e?.persentageValue ?? false,
                                action: FILTERACTION.METRIC,
                            });
                        }
                    }
                }
                return ele;
            });
            setSearchFilterArray(updatedArray);
        }
    }, [JSON.stringify(tabColumnList?.[selectedTabName])]);

    const [breakdownFilters, setBreakdownFilters] = useState({});
    const applyBreakdownFilters = (sFilters, current) => {
        setBreakdownFilters((prevFilters) => {
            return (current === "clear_filter") ? {} : { ...prevFilters, ...sFilters };
        });
    };

    const [apiResponse, setApiResponse] = useState({ rowData: [], footerData: {} }); // ✅ HIGHLIGHTED
    const normalizeData = (rowData, defaultfixedColumns) => {
        // First column defines what breakdown we are exporting (Platform, Location, Product...)
        const breakdownKey = defaultfixedColumns[0]?.value ?? "platform";
        const breakdownTitle = defaultfixedColumns[0]?.title ?? "Breakdown";

        const flat = []; 
        rowData.forEach((row) => {
            const flatRow = { [breakdownKey]: row[breakdownKey] ?? row.name ?? "-" };
            
                
            
            defaultfixedColumns.forEach((col) => {
                const key = col.value;
                if((col.value === "sku_id" || col.value === "skuId")){
                    flatRow[key] = row[key] ?? "-";
                }

                // ✅ Skip duplicate for breakdown column
                if (key === breakdownKey||((col.value === "sku_id" || col.value === "skuId"))) return;


                const metric = row[key];

                if (metric) {
                    flatRow[key] = metric.value ?? "-";
                    if (metric.reference !== undefined) {
                        flatRow[`${key}_reference`] = metric.reference;
                    }
                    if (metric.delta !== undefined) {
                        flatRow[`${key}_delta`] = metric.delta;
                    }
                } else {
                    flatRow[key] = "-";
                }
            });

            flat.push(flatRow);
        });
        return { flat, breakdownKey, breakdownTitle };
    };

    const handleDownload = async () => {
        const { flat: normalized, breakdownKey, breakdownTitle } = normalizeData(
            apiResponse.rowData || [],
            defaultfixedColumns
        );

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Performance Data");

        if (normalized.length > 0) {
            // Start with breakdown column as first header
            const headers = [breakdownTitle];

            defaultfixedColumns.forEach((col) => {
                
                if (col.value === breakdownKey) return; // skip duplicates

                headers.push(col.title);

                const hasReference = normalized.some(
                    (r) => r[`${col.value}_reference`] !== undefined
                );
                const hasDelta = normalized.some(
                    (r) => r[`${col.value}_delta`] !== undefined
                );

                if (hasReference) headers.push(`${col.title} Pervious`);
                if (hasDelta) headers.push(`${col.title} Delta`);
            });

            worksheet.addRow(headers);

            // Add rows dynamically
            normalized.forEach((row) => {
                const values = [row[breakdownKey]];

                defaultfixedColumns.forEach((col) => {
                    if (col.value === breakdownKey) return;

                    values.push(row[col.value]);
                    if (row[`${col.value}_reference`] !== undefined)
                        values.push(row[`${col.value}_reference`]);
                    if (row[`${col.value}_delta`] !== undefined)
                        values.push(row[`${col.value}_delta`]);
                });

                worksheet.addRow(values);
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);

        // filename will include breakdown title (Platform/Location/Product...)
        link.download = `drill_down_${breakdownTitle}_table_${Date.now()}.xlsx`;
        link.click();
    };
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className="flex  items-center justify-between">
                <div className="flex items-center gap-4">
                    <h4 className="font-semibold text-lg">{tableOf} Distribution </h4>
                    {loading ?
                        <div className="flex items-center justify-center h-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                        </div>
                        : <></>
                    }
                </div>
                <div className="flex items-center gap-2">
                    <div>
                        <ComprehenisiveFilter text="Filter By"
                            savedSearch={{}}
                            arr={searchFilterArray}
                            additionalFilter={additionalFilter}
                            applySearchFilter={applyBreakdownFilters}
                            handleSaveFilters={false} />
                    </div>
                    <div className="graphIconBtnWrap flex gap-2">
                        <button
                            type="button"
                            className="graphIconBtn"
                        >
                            <img
                                src="/assets/images/downloadIcon.svg"
                                width={22}
                                height={22}
                                onClick={handleDownload}
                            />
                        </button>
                        <button type="button" className="graphIconBtn" onClick={handleCustomizeClick}>
                            <img src="/assets/images/columnsIcon.svg" className="w-[20px] h-[20px] cursor-pointer" alt="Customize" />
                        </button>
                    </div>
                </div>
            </div>
            <p className="font-inter font-normal italic text-[10px] leading-[100%] align-middle text-[#000000A6] mb-2">
                {(selectedFilters?.calendarType == "week") ?
                    <> {moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY")} </>
                    :
                    <>{moment(selectedFilters?.selectedDateRange?.startDate ?? "")?.format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedDateRange?.endDate ?? "")?.format("DD/MM/YYYY")}</>}
            </p>
            <PerformanceTable
                setLoading={setLoading}
                selectedTableRows={selectedRows}
                breakdownFilters={breakdownFilters}
                drillDownData={drillDownData}
                title={`${tableOf} Distribution`}
                data={rowData}
                footer={footerData}
                selected={selected}
                setSelectedKey={setSelectedKey}
                setSelected={setSelected}
                columns={orderedColumns}
                defaultfixedColumns={defaultfixedColumns}
                onDataLoaded={(apiData) => setApiResponse(apiData)} // ✅ HIGHLIGHTED
            />
            {customizeInfo.isOpen && (
                <CustomizeCampiagnModal
                    isWidget={true}
                    kpi={kpi}
                    selectedTabName={selectedTabName}
                    closePopup={closeCustomizePopup}
                    tabColumnList={tabColumnList}
                    setTabColumnList={setTabColumnList}
                    isSaveViewVisible={false}
                    columnVisible="ds"
                    fixedColumns={defaultfixedColumns}
                    dummyColumnGroup={
                        [
                            //     ...(kpicol ?? []),
                            //     {
                            //         percentageValue: false,
                            //         title: "Dummy",
                            //         type: "parameters",
                            //         value: "dummy",
                            //         key: "dummy",
                            //         kpi: [],
                            //         allowKPI: ["OSA", "CS", "PRO", "RR", ""],
                            //         notAllowWithIsValueIn: [],
                            //         allowWithIsValueIn: [],
                            //         isDisabled: false
                            //     },
                            //     {
                            //         percentageValue: false,
                            //         title: "Dummy1",
                            //         type: "parameters",
                            //         value: "dummy1",
                            //         key: "dummy1",
                            //         kpi: [],
                            //         allowKPI: ["OSA", "CS", "PRO", "RR", ""],
                            //         notAllowWithIsValueIn: [],
                            //         allowWithIsValueIn: [],
                            //         isDisabled: false
                            //     },
                            //     {
                            //         percentageValue: false,
                            //         title: "Dummy 2",
                            //         type: "parameters",
                            //         value: "dummy2",
                            //         key: "dummy2",
                            //         kpi: [],
                            //         allowKPI: ["OSA", "CS", "PRO", "RR", ""],
                            //         notAllowWithIsValueIn: [],
                            //         allowWithIsValueIn: [],
                            //         isDisabled: false
                            //     },
                            //     {
                            //         percentageValue: false,
                            //         title: "Dummy 3",
                            //         type: "parameters",
                            //         value: "dummy3",
                            //         key: "dummy3",
                            //         kpi: [],
                            //         allowKPI: ["OSA", "CS", "PRO", "RR", ""],
                            //         notAllowWithIsValueIn: [],
                            //         allowWithIsValueIn: [],
                            //         isDisabled: false
                            //     },
                        ]
                    }
                />
            )}
        </>


    )


}
function DrillDown({ data = {}, selectedRows, setSelectedRows }) {

    const { kpi, filters } = useEbuxContext();
    const pf_images = filters?.platform?.reduce((map, i) => { map[i.label?.toLowerCase()] = i.platform_description ?? ""; return map; }, {});

    // const [selectedPlatform, setSelectedPlatform] = useState(null);
    // const [selectedLocation, setSelectedLocation] = useState(null);
    // const [selectedProduct, setSelectedProduct] = useState(null);


    return (
        <div>
            <div className='flex gap-2 w-full'>
                <div className='bg-white p-2 w-1/2 rounded-md mt-4 '>
                    <DrillDownBox
                        drillDownData={{ data, breakdown: ["platform"], matrix: ['osa', 'wt_osa', 'avg_offtake_osa'], key: "platform", pf_images }}
                        tableOf={"Platform"}
                        rowData={platformData}
                        footerData={platformFooter}
                        setSelectedKey={"selectedPlatform"}
                        setSelected={setSelectedRows}
                        selectedRows={selectedRows}
                        selected={selectedRows?.selectedPlatform}
                    />
                    {/* <div className="flex  items-center justify-between">
                        <h4 className="font-semibold text-lg">Platform Distribution </h4>
                        <div className="flex items-center gap-2">
                            <div>
                                <ComprehenisiveFilter text="Filter By" />
                            </div>
                            <div className="graphIconBtnWrap flex gap-2">
                                <button
                                    type="button"
                                    className="graphIconBtn"
                                >
                                    <img
                                        src="/assets/images/downloadIcon.svg"
                                        width={22}
                                        height={22}
                                    />
                                </button>
                                <button type="button" className="graphIconBtn" onClick={handleCustomizeClick}>
                                    <img
                                        src="/assets/images/widget/book.png"
                                        className="w-[20px] h-[20px] cursor-pointer"
                                        alt
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <PerformanceTable
                        drillDownData={{ data, breakdown: ["platform"], matrix: ['osa', 'wt_osa', 'avg_offtake_osa'], key: "platform" }}
                        title="Platform Distribution"
                        data={platformData}
                        footer={platformFooter}
                        setSelectedPlatform={setSelectedPlatform}
                        selectedPlatform={selectedPlatform}
                        columns={orderedColumns}
                    /> */}

                </div>
                <div className='bg-white p-2 w-1/2 rounded-md mt-4 '>
                    <DrillDownBox
                        drillDownData={{ data, breakdown: ["location"], matrix: ['osa', 'wt_osa', 'avg_offtake_osa'], key: "location" }}
                        tableOf={"Location"}
                        rowData={locationData}
                        footerData={locationFooter}
                        setSelectedKey={"selectedLocation"}
                        setSelected={setSelectedRows}
                        selectedRows={selectedRows}
                        selected={selectedRows?.selectedLocation}
                    />
                    {/* <div className="flex  items-center justify-between">
                        <h4 className="font-semibold text-lg">Location Distribution </h4>
                        <div className="flex items-center gap-2">
                            <div>
                                <ComprehenisiveFilter text="Filter By" />
                            </div>
                            <div className="graphIconBtnWrap flex gap-2">
                                <button
                                    type="button"
                                    className="graphIconBtn"
                                >
                                    <img
                                        src="/assets/images/downloadIcon.svg"
                                        width={22}
                                        height={22}
                                    />
                                </button>
                                <img
                                    src="/assets/images/widget/book.png"
                                    className="w-[20px] h-[20px] cursor-pointer"
                                    alt
                                />
                            </div>
                        </div>
                    </div>
                    <PerformanceTable
                        drillDownData={{ data, breakdown: ["location"], matrix: ['osa', 'wt_osa', 'avg_offtake_osa'], key: "location" }}
                        title="Location Distribution"
                        data={locationData}
                        footer={locationFooter}
                        setSelectedLocation={setSelectedLocation}
                        columns={locationColumn}
                        selectedLocation={selectedLocation}
                    /> */}
                </div>
            </div>
            {["SOS", "OR"]?.indexOf(kpi) == -1
                ?
                (
                    <div className='bg-white p-2 w-full rounded-md mt-4'>
                        <DrillDownBox
                            drillDownData={{ data, breakdown: ["product", 'sku'], matrix: ['osa', 'wt_osa', 'avg_offtake_osa'], key: "product" }}
                            tableOf={"Product"}
                            rowData={productData}
                            footerData={productFooter}
                            setSelectedKey={"selectedProduct"}
                            setSelected={setSelectedRows}
                            selectedRows={selectedRows}
                            selected={selectedRows?.selectedProduct}
                        />
                        {/* <div className="flex  items-center justify-between">
                    <h4 className="font-semibold text-lg">Platform Distribution </h4>
                    <div className="flex items-center gap-2">
                        <div>
                            <ComprehenisiveFilter text="Filter By" />
                        </div>
                        <div className="graphIconBtnWrap flex gap-2">
                            <button
                                type="button"
                                className="graphIconBtn"
                            >
                                <img
                                    src="/assets/images/downloadIcon.svg"
                                    width={22}
                                    height={22}
                                />
                            </button>
                            <img
                                src="/assets/images/widget/book.png"
                                className="w-[20px] h-[20px] cursor-pointer"
                                alt
                            />
                        </div>
                    </div>
                </div>
                <PerformanceTable
                    drillDownData={{ data, breakdown: ["product", 'sku'], matrix: ['osa', 'wt_osa', 'avg_offtake_osa'], key: "product" }}
                    title="Products Distribution"
                    data={productData}
                    footer={productFooter}
                    setSelectedProduct={setSelectedProduct}
                    columns={productsColumn}
                    selectedProduct={selectedProduct}
                /> */}
                    </div>)
                :
                (<div className='bg-white p-2 w-full rounded-md mt-4'>
                    <DrillDownBox
                        drillDownData={{ data, breakdown: ["keyword"], matrix: ['sos', 'or'], key: "keyword" }}
                        tableOf={"Keyword"}
                        rowData={keywordData}
                        footerData={keywordFooter}
                        setSelectedKey={"selectedKeyword"}
                        setSelected={setSelectedRows}
                        selectedRows={selectedRows}
                        selected={selectedRows?.selectedKeyword}
                    />
                </div>)
            }
        </div>
    )
}

export default DrillDown
