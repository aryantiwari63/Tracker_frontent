import React, { useEffect, useMemo, useRef, useState } from 'react'
import ComprehenisiveFilter from './filter/ComprehenisiveFilter';
import CompetitionTable from './table/CompetitionTable';
import ReactECharts from "echarts-for-react";
import { useEbuxContext } from '../../../../../Context/EbuxProvider';
import { fetchBrandAnalysisData, fetchCompetitionBrandAnalysisData } from '../../services/competitionAnalysis.service';
import CustomizeCampiagnModal from '../../../../../common-components/CustomizeCampiangn';
import moment from 'moment';
import Excel from "exceljs";

import {
    FILTERACTION,
    searchFilterArr
} from "../../../../../common-components/MultiFilter/FilterConstant";
import _ from 'lodash';
const isShowDummyData = false;
const brandData = (!isShowDummyData) ? [] : [
    {
        name: "Amazon",
        osa: { value: 75, reference: 60, delta: 15 },
        wt_osa: { value: 75, reference: 60, delta: 15 }
    },
    {
        name: "Zepto",
        osa: { value: 80, reference: 85, delta: -5 },
        wt_osa: { value: 80, reference: 85, delta: -5 }
    },
    {
        name: "Blinkit",
        osa: { value: 75, reference: 85, delta: -10 },
        wt_osa: { value: 75, reference: 85, delta: -10 }
    },
    {
        name: "Instamart",
        osa: { value: 80, reference: 85, delta: -5 },
        wt_osa: { value: 80, reference: 85, delta: -5 },
        avgOffTake: { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Pharmeasy",
        osa: { value: 75, reference: 60, delta: 15 },
        wt_osa: { value: 75, reference: 60, delta: 15 },
        avgOffTake: { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Tata 1mg",
        osa: { value: 75, reference: 60, delta: 15 },
        wt_osa: { value: 75, reference: 60, delta: 15 },
        avgOffTake: { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Big Basket",
        osa: { value: 80, reference: 85, delta: -5 },
        wt_osa: { value: 80, reference: 85, delta: -5 },
        avgOffTake: { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Nykaa",
        osa: { value: 80, reference: 85, delta: -5 },
        wt_osa: { value: 80, reference: 85, delta: -5 },
        avgOffTake: { value: 80, reference: 85, delta: -5 },
    },
    {
        name: "Myntra",
        osa: { value: 75, reference: 60, delta: 15 },
        wt_osa: { value: 75, reference: 60, delta: 15 },
        avgOffTake: { value: 75, reference: 60, delta: 15 },
    },
    {
        name: "Flipkart Super",
        osa: { value: 80, reference: 85, delta: -5 },
        wt_osa: { value: 80, reference: 85, delta: -5 },
        avgOffTake: { value: 80, reference: 85, delta: -5 },
    },
];
const brandFooter = (!isShowDummyData) ? {} : { total: 12, osa: 70, wt_osa: 45, avgOffTake: 78 };
const productData = (!isShowDummyData) ? [] : [
    {
        name: "BRU Instant Coffee",
        osa: { value: 75, reference: 70, delta: 5 },
        wt_osa: { value: 75, reference: 60, delta: 15 }
    },
    {
        name: "BRU Gold Premium",
        osa: { value: 75, reference: 72, delta: 3 },
        wt_osa: { value: 75, reference: 60, delta: 15 }
    },
    {
        name: "BRU Gold Flavored",
        osa: { value: 80, reference: 75, delta: 5 },
        wt_osa: { value: 75, reference: 60, delta: 15 }
    },
    {
        name: "BRU Instant Chai",
        osa: { value: 80, reference: 78, delta: 2 },
        wt_osa: { value: 75, reference: 60, delta: 15 }
    },
    {
        name: "BRU Instant Chicory",
        osa: { value: 75, reference: 70, delta: 5 },
        wt_osa: { value: 75, reference: 60, delta: 15 }
    },
    {
        name: "BRU Green Label",
        osa: { value: 80, reference: 76, delta: 4 },
        wt_osa: { value: 75, reference: 60, delta: 15 }
    },
    {
        name: "BRU Hot Premium",
        osa: { value: 75, reference: 73, delta: 2 },
        wt_osa: { value: 75, reference: 60, delta: 15 }
    }
];
const chartData = (!isShowDummyData) ? [] : [
    { brand: "Nescafe", value: 68, reference: 10, delta: -3 },
    { brand: "Bru", value: 30, reference: 28, delta: 2 },
    { brand: "Tata Coffee Grand", value: 65, reference: 60, delta: 5 },
    { brand: "Rage Coffee", value: 40, reference: 42, delta: -2 },
    { brand: "Sleepy Owl", value: 25, reference: 30, delta: -5 },
    { brand: "Blue Tokai", value: 55, reference: 50, delta: 5 },
    { brand: "Starbucks", value: 20, reference: 25, delta: -5 },
    { brand: "Davidoff Café", value: 50, reference: 55, delta: -5 },
    { brand: "Colombian Brew", value: 60, reference: 58, delta: 2 },
    { brand: "Bru", value: 30, reference: 28, delta: 2 },
    { brand: "Tata Coffee Grand", value: 65, reference: 60, delta: 5 },
    { brand: "Rage Coffee", value: 40, reference: 42, delta: -2 },
    { brand: "Sleepy Owl", value: 25, reference: 30, delta: -5 },
    { brand: "Blue Tokai", value: 55, reference: 50, delta: 5 },
    { brand: "Starbucks", value: 20, reference: 25, delta: -5 },
    { brand: "Davidoff Café", value: 50, reference: 55, delta: -5 },
    { brand: "Colombian Brew", value: 60, reference: 58, delta: 2 }
];

function CompetitionAnalysis({ data = {}, selectedRows }) {

    const [selectedBrand, setSelectedBrand] = useState({});
    const [productApiResponse, setProductApiResponse] = useState([]);
    const { rowDataProduct, footerDataProduct } = useMemo(() => {
        if (productApiResponse?.rowData) {
            const { rowData, footerData } = productApiResponse;
            return { rowDataProduct: rowData, footerDataProduct: footerData };

        } else {
            return { rowDataProduct: [], footerDataProduct: {} };
        }

    }, [JSON.stringify(productApiResponse)]);
    const [apiResponse, setApiResponse] = useState([]);
    const { rowData, footerData } = useMemo(() => {
        if (apiResponse?.rowData) {
            const { rowData, footerData } = apiResponse;
            return { rowData, footerData };

        } else {
            return { rowData: [], footerData: {} };
        }

    }, [JSON.stringify(apiResponse)]);
    const performanceOf = data?.performanceOf ?? 'brand';
    const performanceFor = data?.value ?? "";
    const { kpi, filters, selectedFilters, clientCustomizeColumnsComprehensiveBreakdown, activeClientProject } = useEbuxContext();
    const brand = new Set(), competition_brand = new Set();
    if (["SOS", "OR"]?.indexOf(kpi) > -1) {
        filters?.competition_brand?.filter(i => (((i?.is_brand ?? true) == false)))?.forEach(({ label }) => { competition_brand.add(label); }) ?? [];
    } else {
        if (performanceOf == "brand") {
            brand.add(data?.item?.label);
            if (activeClientProject?.treeFilterDS2) {
                filters?.competition_brand?.filter(i => (((i?.is_brand ?? true) == false) && (i?.mapped_sub_brand_comp == (data?.item?.value ?? ""))))?.forEach(({ label }) => { competition_brand.add(label); }) ?? [];
            } else {
                filters?.competition_brand?.filter(i => (((i?.is_brand ?? true) == false) && (i?.mapped_brand_comp == (data?.item?.value ?? ""))))?.forEach(({ label }) => { competition_brand.add(label); }) ?? [];
            }
        } else if (performanceOf == "mother_pack") {
            filters?.products?.filter(i => (((i?.is_brand ?? false) == true) && i?.mother_pack == (data?.item?.value ?? "")))?.forEach(({ sub_brand_name, mother_pack }) => {
                brand.add(sub_brand_name); console.log({ mother_pack }, { sub_brand_name });
            }) ?? [];
            let mother_pack_brands = Array.from(brand);
            filters?.competition_brand?.filter(i => (((i?.is_brand ?? true) == false) && (mother_pack_brands?.indexOf(i?.mapped_sub_brand_name) > -1)))?.forEach(({ label }) => { competition_brand.add(label); }) ?? [];
        }

    }



    const [customizeInfo, setCustomizeInfo] = useState({ isOpen: false, column: null });
    const [tabColumnList, setTabColumnList] = useState({});
    const [selectedTabName,] = useState("comprehensive");
    // const kpicol = (clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => (i?.allowInWidget &&(i?.allowKPI?.indexOf(kpi) > -1) && (!i?.value?.includes("competition_")) && (["previous_osa", "last_month_sale"]?.indexOf(i?.key) == -1)))?.map(i => ({ ...i, label: i?.title, id: i?.value, checked: i?.kpi?.indexOf(kpi) > -1, disabled: i?.isDisabled })));
    const kpicol = (clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => (i?.allowInWidget && (i?.allowKPI?.indexOf(kpi) > -1) && (!i?.value?.includes("competition_")) && (["previous_osa", "last_month_sale"]?.indexOf(i?.key) == -1)))?.map(i => ({ ...i, label: i?.title, id: i?.value, checked: ((i?.kpi?.indexOf(kpi) > -1) || ((!i?.isDisabled) && (data?.visibleMatrix?.length) && (data?.visibleMatrix?.findIndex(v => v?.value == i?.value) > -1))), disabled: i?.isDisabled })));


    const brandColumns = [
        {
            key: "name",
            value: "name",
            label: "Entity",
            align: "left",
            sortable: true,
        }
        // ,
        // ...(kpicol?.filter(i=>i?.checked)?.map(i => (
        //     {
        //         ...i,
        //         label: i.title,
        //         align: "center",
        //         sortable: true
        //     })) ?? [])
    ];
    const keywordColumns = [
        {
            key: "keyword",
            value: "keyword",
            label: `Keywords`,
            align: "left",
            sortable: true,
        }]
    const productColumns = [
        {
            key: "product",
            value: "product",
            label: `Products`,
            align: "left",
            sortable: true,
        }
        // ,
        // ...(kpicol?.filter(i=>i?.checked)?.map(i => (
        //     {
        //         ...i,
        //         label: i.title,
        //         align: "center",
        //         sortable: true
        //     })) ?? [])
    ]
    const [defaultfixedColumns, setDefaultFixedColumns] = useState([
        ...(kpicol?.filter(i => i?.checked) ?? [])
    ]);
    const handleCustomizeClick = () => {
        setCustomizeInfo(prev => ({ isOpen: !prev.isOpen, column: '' }));
    };

    const closeCustomizePopup = () => {
        setCustomizeInfo({ isOpen: false, column: null });
    };
    const getOrderedColumns = () => {
        const orderedColumnConfigs = tabColumnList[selectedTabName] ?? defaultfixedColumns ?? [];

        if (orderedColumnConfigs.length > 0) {
            // const columnsMap = new Map(tableColumn.map(col => [col.key, col]));

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


        return [];
    };


    useEffect(() => {
        if (tabColumnList[selectedTabName]?.length > 0) {
            setDefaultFixedColumns(tabColumnList[selectedTabName]);
        }
    }, [tabColumnList, selectedTabName]);

    const orderedColumns = getOrderedColumns();

    const [breakdownFilters, setBreakdownFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [skuLoading, setSKULoading] = useState(false);
    const fetchData = async () => {
        if (!performanceOf) return;
        if (!performanceFor) return;
        setLoading(true);
        try {

            let payload = {
                kpi,
                matrix: orderedColumns?.length ? orderedColumns?.filter(column => column?.type == "parameters")?.map(column => column.value) : ['osa'],
                key: performanceOf,
                value: data?.value ?? "",
                selectedFilters, filters,
                brand: Array.from(brand) ?? [],
                competitionBrand: Array.from(competition_brand) ?? [],
                breakdownFilters,
                selectedTableRows: {
                    selectedDates: selectedRows?.selectedDates?.map(i => i?.date) ?? [],
                    selectedLocation: selectedRows?.selectedLocation?.map(i => i?.location) ?? [],
                    selectedPlatform: selectedRows?.selectedPlatform?.map(i => i?.platform) ?? [],
                    selectedProduct: selectedRows?.selectedProduct?.map(i => i?.skuId) ?? [],
                    selectedKeyword: selectedRows?.selectedKeyword?.map(i => i?.keyword) ?? []
                }
            };

            const response = await fetchCompetitionBrandAnalysisData(payload);
            setApiResponse(response);
            setLoading(false);
        } catch (error) {
            console.error("Error in fetchData:", error);
            setLoading(false);
            return;
        }

    }
    const fetchProductData = async (is_brand = true, brand = null) => {
        if (!performanceOf) return;
        if (!performanceFor) return;
        setSKULoading(true);
        try {
            let payload = {
                kpi,
                matrix: orderedColumns?.length ? orderedColumns?.filter(column => column?.type == "parameters")?.map(column => column.value) : ['osa'],
                key: is_brand ? performanceOf : "brand",
                value: is_brand ? (data?.value ?? "") : brand,
                performanceOf,
                performanceFor: data?.value,
                is_brand,
                selectedFilters, filters,
                competitionBrand: (["SOS", "OR"]?.indexOf(kpi) > -1) ? Array.from(competition_brand) : [],
                breakdownFilters,
                selectedTableRows: {
                    selectedDates: selectedRows?.selectedDates?.map(i => i?.date) ?? [],
                    selectedLocation: selectedRows?.selectedLocation?.map(i => i?.location) ?? [],
                    selectedPlatform: selectedRows?.selectedPlatform?.map(i => i?.platform) ?? [],
                    selectedProduct: selectedRows?.selectedProduct?.map(i => i?.skuId) ?? [],
                    selectedKeyword: selectedRows?.selectedKeyword?.map(i => i?.keyword) ?? []
                }
            };

            const response = await fetchBrandAnalysisData(payload);
            setProductApiResponse(response);

            setSKULoading(false);

        } catch (error) {
            console.error("Error in fetchProductData:", error);
            setSKULoading(false);
            return;
        }
    }
    useEffect(() => {
        fetchData();
        fetchProductData();
    }, [JSON.stringify(data), JSON.stringify(orderedColumns), JSON.stringify(selectedFilters), JSON.stringify(breakdownFilters), JSON.stringify(selectedRows)]);
    useEffect(() => {
        if (selectedBrand?.brand) {
            fetchProductData(selectedBrand?.is_brand, selectedBrand?.brand);
        }
    }, [JSON.stringify(selectedBrand), JSON.stringify(breakdownFilters)]);
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

    const applyBreakdownFilters = (sFilters, current) => {
        setBreakdownFilters((prevFilters) => {
            return (current === "clear_filter") ? {} : { ...prevFilters, ...sFilters };
        });
    };

    const normalizeProductData = (rowData, defaultfixedColumns) => {
        const flat = [];
        //console.log('breakdownKeybreakdownKeybreakdownKey',rowData)
        const breakdownKey = (["SOS", "OR"]?.indexOf(kpi) > -1) ? "keyword" : "product";
        const breakdownTitle = (["SOS", "OR"]?.indexOf(kpi) > -1) ? "keyword" : "product";

        rowData.forEach((row) => {
            const flatRow = {
                [breakdownKey]: row?.[breakdownKey] ?? "-", // product name only
            };

            defaultfixedColumns.forEach((col) => {
                const key = col.value; // e.g. "osa", "price_variation", "price_sp"
                const metric = row[key];

                if (metric) {
                    flatRow[key] = metric.value ?? "-";
                    if (metric.reference !== undefined)
                        flatRow[`${key}_reference`] = metric.reference;
                    if (metric.delta !== undefined)
                        flatRow[`${key}_delta`] = metric.delta;
                } else {
                    flatRow[key] = "-";
                }
            });

            flat.push(flatRow);
        });

        return { flat, breakdownKey, breakdownTitle };
    };

    const handleDownload = async () => {
        const { flat: normalized, breakdownKey, breakdownTitle } =
            normalizeProductData(rowDataProduct, defaultfixedColumns);

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Product Data");

        if (normalized.length > 0) {
            // headers
            const headers = [breakdownTitle];

            defaultfixedColumns.forEach((col) => {
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

            // rows
            normalized.forEach((row) => {
                const values = [row[breakdownKey]];

                defaultfixedColumns.forEach((col) => {
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
        link.download = `product_${breakdownTitle}_table_${Date.now()}.xlsx`;
        link.click();
    };
    return (
        <div>

            <BrandCompetitionAvgChart data={data} loading={loading} rowData={rowData ?? []} orderedColumns={orderedColumns ?? []} />
            <div className='bg-white p-2 rounded-md mt-4 '>
                <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-4">
                        {/* <h4 className="font-semibold"> */}
                        <h4 className="font-semibold text-lg">
                            Competition Distribution </h4>
                        {loading || skuLoading ?
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
                <div className='mt-4 flex w-full bg-white rounded-lg shadow-sm overflow-hidden'>
                    <div className='w-1/2'>
                        <CompetitionTable
                            useFor="brand_competition_analysis"
                            performanceOf={performanceOf}
                            performanceFor={performanceFor}
                            title="Brand"
                            data={brandData}
                            footer={brandFooter}
                            rowData={rowData}
                            footerData={footerData}
                            columns={[...brandColumns, ...orderedColumns]}
                            setSelectedBrand={setSelectedBrand}
                            selectedBrand={selectedBrand}
                            type="parent"
                            hideFooter={(["SOS", "OR"]?.indexOf(kpi) > -1)}

                        />
                    </div>
                    <div className='w-1/2 p-3 bg-[#E8F4FF] rounded-2xl'>
                        <CompetitionTable
                            title={(["SOS", "OR"]?.indexOf(kpi) > -1) ? "Keyword" : "Product"}
                            subTitle={(selectedBrand?.is_brand == false) ? (selectedBrand?.brand) : (performanceOf == "brand" ? performanceFor : `All ${performanceFor}`)}
                            data={productData}
                            footer={brandFooter}
                            rowData={rowDataProduct}
                            footerData={footerDataProduct}
                            columns={[...((["SOS", "OR"]?.indexOf(kpi) > -1) ? keywordColumns : productColumns), ...orderedColumns]}
                            type="child"
                        />
                    </div>
                </div>
            </div>
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
                    dummyColumnGroup={[]}
                />
            )}
        </div>
    )
}


const BrandCompetitionAvgChart = ({ rowData = [], orderedColumns = [], loading = false }) => {


    const [type, setType] = useState(null);
    const { selectedFilters } = useEbuxContext();
    const optionType = useMemo(() => { const col_data = Object.fromEntries(orderedColumns.map(col => [col.value, col])); setType(Object.keys(col_data)?.[0] ?? "osa"); return col_data; }, [orderedColumns]);

    const chartRef = useRef(null);

    const [isDownloading, setIsDownloading] = useState(false);

    const downloadImage = () => {

        setIsDownloading(true);
        setTimeout(() => {
            if (chartRef.current) {
                if (!chartRef.current) return;

                const echartsInstance = chartRef.current.getEchartsInstance();
                echartsInstance.setOption({
                    title: { show: true }
                });
                const option = echartsInstance.getOption();
                const dz = option.dataZoom?.[0];
                const startValue = dz?.startValue;
                const endValue = dz?.endValue;
                // echartsInstance.dispatchAction({
                //         type: "dataZoom",
                //         start: currentZoom.start,
                //         end: currentZoom.end,
                //     });
                // echartsInstance.resize();
                const imgData = echartsInstance.getDataURL({
                    type: "png",
                    pixelRatio: 2,
                    backgroundColor: "#fff",

                    excludeComponents: ["dataZoom"],
                });

                const link = document.createElement("a");
                link.href = imgData;
                link.download = "chart-image.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                if (startValue !== undefined && endValue !== undefined) {
                    echartsInstance.dispatchAction({
                        type: "dataZoom",
                        // dataZoomIndex: 0,
                        startValue,
                        endValue,
                    });
                }

                setIsDownloading(false);
                echartsInstance.setOption({
                    title: { show: false }
                });
            }
        }, 500);
        //  

    };
    const option = useMemo(() => {
        // const startDate = moment(selectedFilters?.selectedDateRange?.startDate ?? "23/07/25").format("DD/MM/YYYY");
        // const endDate = moment(selectedFilters?.selectedDateRange?.endDate ?? "23/07/25").format("DD/MM/YYYY");
        const startDate = (selectedFilters?.calendarType == "week") ? moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY") : moment(selectedFilters?.selectedDateRange?.startDate ?? "").format("DD/MM/YYYY");
        const endDate = (selectedFilters?.calendarType == "week") ? moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY") : moment(selectedFilters?.selectedDateRange?.endDate ?? "").format("DD/MM/YYYY");

        const dateRangeText = `${startDate} → ${endDate}`;
        return {
            title: {
                text: isDownloading ? `Competition Distribution\n${dateRangeText}` : "",
                show: false,
                left: 'left',
                top: 1,
                textStyle: {
                    color: '#333',
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 22
                }
            },
            grid: {
                left: "6%",
                right: "6%",
                bottom: "12%",
                top: isDownloading ? "18%" : "8%",
                containLabel: true
            },
            xAxis: {
                type: "category",
                data: (rowData?.length ? rowData : chartData)?.map((d) => (d?.name ?? d?.brand)),
                axisLabel: {
                    color: "#666",
                    fontSize: 12,
                    margin: 10,
                    interval: 0,
                },
                axisLine: { show: false },
                axisTick: { show: false },
                name: "Brands",
                nameLocation: "middle",
                nameGap: 50,
                nameTextStyle: { fontSize: 16, color: "#000000D9" }
            },
            yAxis: {
                type: "value",
                max: optionType?.[type]?.persentageValue ? 100 : function (value) {
                    return value.max;
                    // return value.max + 2;
                },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: {
                    lineStyle: { color: "#eee" }
                },
                axisLabel: {
                    formatter: `${optionType?.[type]?.icon == "rupee" ? "₹ " : (optionType?.[type]?.icon ? (optionType?.[type]?.icon + " ") : "")}{value}${optionType?.[type]?.persentageValue ? "%" : ""}`,
                    color: "#666"
                },
                name: `${optionType?.[type]?.label}`,
                nameLocation: "middle",
                nameGap: 50,
                nameTextStyle: { fontSize: 16, color: "#000000D9" }
            },
            dataZoom: [
                {
                    type: "slider",
                    show: true,
                    xAxisIndex: 0,
                    start: 0,   // % range to start
                    end: (7 / (rowData?.length ? rowData : chartData)?.length) * 100,    // initially show ~60% of brands
                    height: 20,
                    bottom: 30,
                    showDetail: false
                }
                // ,
                // {
                //     type: "inside", // zoom with mousewheel / touch
                //     xAxisIndex: 0
                // }
            ],
            tooltip: {
                trigger: "item",
                backgroundColor: "#0B0D21",
                borderColor: "#2A2D4A",
                borderWidth: 1,
                borderRadius: 8,
                padding: [12, 15],
                textStyle: { color: "#fff" },
                formatter: (params) => {
                    const d = (rowData?.length ? rowData : chartData)?.[params?.dataIndex];

                    const getHeaderIcon = (icon) => {
                        switch (icon) {
                            case "rupee":
                                return "₹ ";
                            default:
                                return (icon) ? icon + " " : "";
                        }
                    }
                    const showValue = (col, value) => {
                        return `${value != undefined && col?.icon ? getHeaderIcon(col?.icon) : ""}${value}${value != undefined && col?.subValue ? col?.subValue : ""}${value != undefined && col?.persentageValue ? "%" : ""}`

                    }
                    const arrow =
                        d?.[type]?.delta >= 0
                            ? `<span style="color:#4CAF50;">↑ ${showValue(optionType?.[type], d?.[type]?.delta)}</span>`
                            : `<span style="color:#FF5A5A;">↓ ${showValue(optionType?.[type], Math.abs(d?.[type]?.delta))}</span>`;


                    return `                
          <div style="font-size:14px;margin-bottom:6px;font-weight:600;">
            ${d?.name}
          </div>
          <div style="font-size:12px;display:flex;align-items:center;gap:8px;">
            <span>${optionType?.[type]?.label}</span> 
            ${d?.[type]?.value ? (`<span style="font-size:18px;font-weight:bold;">${showValue(optionType?.[type], d?.[type]?.value)}</span>`) : ""}            
            ${d?.[type]?.reference ? (`<span style="color:#999;font-size:12px;">${showValue(optionType?.[type], d?.[type]?.reference)}</span>`) : ""}            
            ${(d?.[type]?.reference && d?.[type]?.delta) ? (`<span style="font-size:12px;background:#fff3f3;padding:2px 6px;border-radius:6px;">
              ${arrow}
            </span>`) : ""}            
            
            
          </div>
        `;
                }
            },
            series: [
                {
                    type: "bar",
                    stack: "total",
                    data: (rowData?.length ? rowData : chartData)?.map((d) => d?.[type]?.value),
                    barWidth: 45,
                    showBackground: true,
                    backgroundStyle: {
                        color: "#eee",
                        borderRadius: [30, 30, 30, 30],
                    },
                    itemStyle: {
                        borderColor: "transparent",
                        borderRadius: [30, 30, 30, 30],
                        color: (params) => {
                            if ((rowData?.length ? rowData : chartData)?.[params?.dataIndex]?.is_brand) {
                                return {
                                    type: "linear",
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: "#05aaf6ff" },
                                        { offset: 1, color: "#0573d9ff" }
                                    ]
                                };
                            }
                            return {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    { offset: 0, color: "#B3E5FC" },
                                    { offset: 1, color: "#449fd0ff" }
                                ]
                            };
                        }
                    }
                }
            ]
        }
    }, [JSON.stringify(rowData), JSON.stringify(optionType), JSON.stringify(isDownloading), type]);

    return (
        <div className='bg-white px-4 py-2 rounded-md mt-4'>
            <div className="flex items-center justify-between ">
                {/* <h4 className="font-semibold"> */}
                <h4 className="font-semibold text-lg">
                    Competition Analysis </h4>
                <div className="flex items-center gap-2">
                    <div className='relative'>
                        <select
                            id="graph"
                            className="appearance-none pr-8 bg-gray-50 cursor-pointer border border-gray-300 text-gray-900 text-xs rounded-lg 
             focus:ring-blue-500 focus:border-blue-500 block  px-2.5 py-1
             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
             dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            {
                                Object.keys(optionType)?.map((k, idx) => (
                                    <option key={idx} value={k} selected={type == k}>{optionType[k]?.label}</option>
                                ))}
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
                    <div className="graphIconBtnWrap">
                        <button
                            type="button"
                            className="graphIconBtn"
                            onClick={downloadImage}
                        >
                            <img
                                src="/assets/images/downloadIcon.svg"
                                width={22}
                                height={22}
                            />
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
            <div className="w-full h-[400px]">
                {loading ?
                    <div className="flex items-center justify-center h-full w-full">
                        <div className="flex items-center gap-3 text-gray-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                    </div>

                    :

                    <ReactECharts
                        ref={chartRef} option={option} style={{ height: isDownloading ? "120%" : "100%", width: "100%" }} />
                }
            </div>
        </div >
    );
};


export default CompetitionAnalysis
