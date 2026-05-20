import React, { useEffect, useRef, useState } from 'react'

import { fetchDarkStoreData } from './services/service';
import { isEqual } from 'lodash';
import moment from "moment";
import Excel from "exceljs";

import { useEbuxContext } from '../../Context/EbuxProvider';
import DarkStoreTable from "./DarkStoreTable";
import IndiaMap from "../osaWidgets/osaPerformanceOverview/Components/MapComponent/IndiaMap/IndiaMap";
import DarkStoreComprehensiveBreakdownTable from './dark-store-comprehensive-breakdown-table';

const DarkStoreOverview = () => {

    const {
        kpi, selectedFilters, filters, filtersDarkStore,
        clientCustomizeColumnsComprehensiveBreakdown, activeClientProject
    } = useEbuxContext();
    const pf_images = filters?.platform?.reduce((map, i) => { map[i.label?.toLowerCase()] = i.platform_description ?? ""; return map; }, {});


    const Country = activeClientProject?.country ?? "India";
    const mapCenter = activeClientProject?.mapCenter ?? [22.5937, 78.9629];
    const maxBounds = activeClientProject?.maxBounds ?? [[6, 68], [38, 98]];
    //eslint-disable-next-line
    const [metrics, setMetrics] = useState(
        clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i =>
            (i?.allowInDarkStore && (i?.allowKPI?.indexOf(kpi) > -1)&&!i?.isDisabled))?.map(i => ({ ...i, label: i?.title, id: i?.value, checked: true, disabled: i?.isDisabled })));

    //eslint-disable-next-line
    const [locationStepValue, setLocationStepValue] = useState(Country);
    const [loadingReport, setLoadingReport] = useState(false);
    const [darkStoreLocationData, setDarkStoreLocationData] = useState([]);


    const [locationSteps, setLocationSteps] = useState({ "Country": Country, "Region": null, "State": null, "City": null, "Pincode": null, "DarkStore": null });
    const updateLocationSteps = (key, value) => {
        const allLocationSteps = Object.keys(locationSteps);
        if (key == "Country") { value = Country; }
        const index = allLocationSteps?.indexOf(key);
        const nextSteps = {};
        for (let i = index + 1; i < allLocationSteps.length; i++) {
            nextSteps[allLocationSteps[i]] = null;
        }
        setLocationSteps((prevState) => {
            return {
                ...prevState,
                [key]: value,
                ...nextSteps
            }
        });
        setLocationStepValue(value);
    }

    const previousSelectedFilters = useRef("");
    useEffect(() => {
        async function fetchData() {
            setLoadingReport(true);
            let drillDown = "region";
            let newSelectedFilters = { ...selectedFilters };
            if (locationSteps["Region"] == null) {
                drillDown = "region";
            } else if (locationSteps["State"] == null && locationSteps["Region"] != null) {
                drillDown = "state";
                newSelectedFilters.selectedRegionNames = [{ value: locationSteps["Region"]?.replace(" Zone", "") }];
            } else if ((locationSteps["City"] == null) && (locationSteps["Region"] != null || locationSteps["State"] != null)) {
                drillDown = "city";
                newSelectedFilters.selectedRegionNames = [{ value: locationSteps["Region"]?.replace(" Zone", "") }];
                newSelectedFilters.selectedStateNames = [{ value: locationSteps["State"] }];
            } else if ((locationSteps["Pincode"] == null) && (locationSteps["Region"] != null || locationSteps["State"] != null) && (locationSteps["City"] != null)) {
                drillDown = "pincode";
                newSelectedFilters.selectedRegionNames = [{ value: locationSteps["Region"]?.replace(" Zone", "") }];
                newSelectedFilters.selectedStateNames = [{ value: locationSteps["State"] }];
                newSelectedFilters.selectedCityNames = [{ value: locationSteps["City"] }];
            } else if ((locationSteps["DarkStore"] == null) && (locationSteps["Region"] != null || locationSteps["State"] != null) && (locationSteps["City"] != null) && (locationSteps["Pincode"] != null)) {
                drillDown = "dark_store";
                newSelectedFilters.selectedRegionNames = [{ value: locationSteps["Region"]?.replace(" Zone", "") }];
                newSelectedFilters.selectedStateNames = [{ value: locationSteps["State"] }];
                newSelectedFilters.selectedCityNames = [{ value: locationSteps["City"] }];
                newSelectedFilters.selectedPincodeNames = [{ value: locationSteps["Pincode"] }];
            }

            let payload = {
                kpi,
                drillDown,
                breakdown: [drillDown],
                matrix: metrics?.filter(column => column?.type == "parameters")?.map(column => column.value) ?? ['osa', 'wt_osa', 'avg_offtake_osa'],
                selectedFilters: newSelectedFilters,
                filters: filtersDarkStore
            };

            const response = await fetchDarkStoreData(payload);
            setDarkStoreLocationData({ data: response?.rowData ?? [], footerData: response?.footerData ?? {} });
            setLoadingReport(false);
        }
        if (!isEqual(previousSelectedFilters.current, JSON.stringify({ ...selectedFilters, locationSteps, metrics }))) {
            previousSelectedFilters.current = JSON.stringify({ ...selectedFilters, locationSteps, metrics });
            fetchData();
        }
        // fetchData();
    }, [locationSteps, metrics, selectedFilters]);
    const [activefromTable, setActivefromTable] = useState(null);

    const handleDownload = async () => {
        // console.log('locationStepslocationSteps', darkStoreLocationData?.data)
        const data = darkStoreLocationData?.data ?? [];
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Performance Data");

        const chosenMetrics = [
            { value: "nd_osa", title: "ND (OSA)", isPercent: false },
            { value: "osa", title: "OSA", isPercent: true },
            { value: "price_variation", title: "Promotions", isPercent: true },
            { value: "price_rp", title: "MRP", isPercent: false },
            { value: "price_sp", title: "SP", isPercent: false },
        ];

        const nameCandidates = ["region", "state", "city", "pincode", "dark_store", "location"];
        let detectedField = null;
        for (const obj of data) {
            for (const key of nameCandidates) {
                if (obj[key] !== undefined) {
                    detectedField = key;
                    break;
                }
            }
            if (detectedField) break;
        }
        const nameField = detectedField ?? "location";

        // Nice readable header label map
        const nameLabels = {
            region: "Region",
            state: "State",
            city: "City",
            pincode: "Pincode",
            dark_store: "Dark Store",
            location: "Location",
        };
        const firstHeaderTitle = nameLabels[nameField] ?? "Location";

        // const headers = ["Location", "Platform", ...chosenMetrics.map(m => m.title)];
        const headers = [firstHeaderTitle, "Platform", ...chosenMetrics.map(m => m.title)];
        worksheet.addRow(headers);

        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.alignment = { vertical: "middle", horizontal: "center" };
        headerRow.eachCell(cell => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });

        const colLetter = (col) => {
            let s = "";
            while (col > 0) {
                const mod = (col - 1) % 26;
                s = String.fromCharCode(65 + mod) + s;
                col = Math.floor((col - 1) / 26);
            }
            return s;
        };

        let currentRowNumber = 2;

        data.forEach(regionObj => {
            // const regionName = regionObj.region ?? regionObj.location ?? "Unknown";
            const regionName = regionObj[nameField] ?? regionObj.region ?? regionObj.location ?? "Unknown";


            const regionRow = worksheet.getRow(currentRowNumber);

            const lastColLetter = colLetter(headers.length);
            worksheet.mergeCells(`A${currentRowNumber}:${lastColLetter}${currentRowNumber}`);

            regionRow.getCell(1).font = { bold: true, size: 12 };
            regionRow.getCell(1).alignment = { vertical: "middle", horizontal: "left" };
            // regionRow.getCell(1).fill = {
            // type: "pattern",
            // pattern: "solid",
            // fgColor: { argb: "FFEDEDED" } 
            // };
            currentRowNumber++;

            const platforms = regionObj.platform_data ?? [];
            platforms.forEach((p, idx) => {
                const rowValues = [
                    idx === 0 ? regionName : "",
                    p.platform ?? "-"
                ];

                chosenMetrics.forEach(m => {
                    const metricObj = p[m.value] ?? regionObj[m.value] ?? {};
                    let val = metricObj?.value ?? "-";

                    if (m.isPercent && val !== "-" && val !== undefined && val !== null) {
                        val = `${val}%`;
                    }

                    const asNumber = Number(val);
                    if (!m.isPercent && !Number.isNaN(asNumber) && val !== "") {
                        val = asNumber;
                    }

                    rowValues.push(val);
                });

                worksheet.addRow(rowValues);

                const addedRow = worksheet.getRow(currentRowNumber);
                addedRow.eachCell(cell => {
                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" }
                    };
                });

                currentRowNumber++;
            });

            currentRowNumber++;
        });


        worksheet.columns.forEach((col, i) => {
            const maxLength = worksheet.getColumn(i + 1).values.reduce((acc, v) => {
                const val = v == null ? "" : String(v);
                return Math.max(acc, val.length);
            }, 10);
            col.width = Math.min(50, Math.max(12, maxLength + 2));
        });


        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `performance_by_region_${Date.now()}.xlsx`;
        link.click();
        URL.revokeObjectURL(link.href);
    };
    return (

        <div className="w-full">
            <div className="bg-white shadow-md rounded-xl p-4 h-full">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg text-gray-800">Geographical Analysis</h4>

                            {loadingReport ?
                                // <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center justify-center h-4">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    </div>
                                </div>
                                // </div> 
                                : <>
                                    {/* {flatData?.length} */}
                                </>}

                        </div>
                        <p className="font-inter italic text-xs text-gray-600 mt-1" >
                            {(selectedFilters?.calendarType == "week") ?
                                <> {moment(selectedFilters?.selectedWeeks?.current?.[0]?.start ?? "").format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedWeeks?.current?.[selectedFilters?.selectedWeeks?.current?.length - 1]?.end ?? "").format("DD/MM/YYYY")} </>
                                :
                                <>{moment(selectedFilters?.selectedDateRange?.startDate ?? "")?.format("DD/MM/YYYY")} {"->"} {moment(selectedFilters?.selectedDateRange?.endDate ?? "")?.format("DD/MM/YYYY")}</>}
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <img src="/assets/images/downloadIcon.svg" className="w-[20px] h-[20px] cursor-pointer" alt="download" onClick={handleDownload} />
                    </div>
                </div>
                <div className="flex h-full justify-between">
                    <div className='w-[40%] min-w-[40%] max-w-[40%]'>
                        {/* Top Row */}
                        <div className="flex flex-col">
                            {/* Title + Dates */}
                            <div className="inline-flex mt-[10px]">
                                {[
                                    { label: locationSteps?.Country, key: 'Country' },
                                    { label: locationSteps?.Region, key: 'Region' },
                                    { label: locationSteps?.State, key: 'State' },
                                    { label: locationSteps?.City, key: 'City' },
                                    { label: locationSteps?.Pincode, key: 'Pincode' },
                                    { label: locationSteps?.DarkStore, key: 'DarkStore' },
                                    { label: locationSteps?.Store, key: 'Store' }
                                ]
                                    .filter(step => step.label != null)
                                    .map((step, index, arr) => (
                                        <span key={step.key} className="">
                                            <button
                                                className={`font-roboto font-normal text-[14px] leading-[22px] tracking-[0] align-middle text-[#2563EB] hover:underline ${index == arr.length - 1 ? 'cursor-default !text-gray-800 font-medium hover:no-underline' : ''}`}
                                                onClick={() => updateLocationSteps(step.key, step.label)}
                                            >
                                                {step.label}
                                            </button>
                                            {index < arr.length - 1 && <span className="px-1 text-gray-500 text-[10px]">/</span>}
                                        </span>
                                    ))}
                            </div>
                        </div>
                        <div className="mt-0 h-[500px]">
                            <IndiaMap activefromTable={activefromTable} loadingReport={loadingReport} initZoom={4.3} is_dark_store={true} Country={Country} mapCenter={mapCenter} maxBounds={maxBounds} filters={{ ...filters, locationPincode: filters?.darkstore_id?.filter(i=>(i?.darkstore_flag==1)) }} metrics={metrics?.filter(i=>i.value!="nestle_nd_osa")} key={`country-map-${locationStepValue}`} darkStoreLocationData={darkStoreLocationData} updateLocationSteps={updateLocationSteps} locationSteps={locationSteps} />
                        </div>
                    </div>
                    <div className='w-[60%] min-w-[60%] max-w-[60%] flex-1'>

                        <DarkStoreTable setActivefromTable={setActivefromTable} key={Country} pf_images={pf_images} metrics={metrics?.filter(i=>["nestle_nd_osa","nestle_nd_osa_darkstore_coverage"].indexOf(i.value)==-1)}
                            darkStoreLocationData={darkStoreLocationData}
                            updateLocationSteps={updateLocationSteps}
                            loadingReport={loadingReport} // optional
                        />

                    </div>
                </div>
            </div>
            <DarkStoreComprehensiveBreakdownTable />
        </div>
    )
}

export default DarkStoreOverview;