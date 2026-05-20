import React, { useState } from "react";
import SosGraphicalAnalysis from "./SosGraphicalAnalysis";
import KeywordTypeTable from "./KeywordTypeTable";
import { useEbuxContext } from "../../Context/EbuxProvider";
import RankView from "./rankView";
import { useEffect } from "react";
import { useRef } from "react";

function SosWidgets() {
    const {
        kpi,
        selectedFilters,
        clientCustomizeColumnsComprehensiveBreakdown,
        activeClientProject
    } = useEbuxContext();
    const allOption = ["Overall", "Paid", "Organic"];
    const [selectedOption, setSelectedOption] = useState(allOption[0]);
    const kpicol = (clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => (i?.allowInWidget && (i?.allowKPI?.indexOf(kpi) > -1) && (!i?.value?.includes("competition_")) && (["previous_osa", "last_month_sale"]?.indexOf(i?.key) == -1) && !i?.isDisabled))?.map(i => ({ ...i, label: i?.title, id: i?.value, checked: (i?.kpi)?.indexOf(kpi) > -1, disabled: i?.isDisabled })));
    const optionType = Object.fromEntries(kpicol?.map(col => [col.value, col]));
    const [currentView, setCurrentView] = useState("Category")
    const type = "sos";


    const [activeIndex, setActiveIndex] = useState(null);
    const [resetDownload, setresetDownload] = useState();


    const brandData = [
        {
            name: "Amazon",
            avgOSA: { value: 75, reference: 60, delta: 15 },
            wtOSA: { value: 75, reference: 60, delta: 15 }
        },
        {
            name: "Zepto",
            avgOSA: { value: 80, reference: 85, delta: -5 },
            wtOSA: { value: 80, reference: 85, delta: -5 }
        },
        {
            name: "Blinkit",
            avgOSA: { value: 75, reference: 85, delta: -10 },
            wtOSA: { value: 75, reference: 85, delta: -10 }
        },
        {
            name: "Instamart",
            avgOSA: { value: 80, reference: 85, delta: -5 },
            wtOSA: { value: 80, reference: 85, delta: -5 },
            avgOffTake: { value: 80, reference: 85, delta: -5 },
        },
        {
            name: "Pharmeasy",
            avgOSA: { value: 75, reference: 60, delta: 15 },
            wtOSA: { value: 75, reference: 60, delta: 15 },
            avgOffTake: { value: 75, reference: 60, delta: 15 },
        },
        {
            name: "Tata 1mg",
            avgOSA: { value: 75, reference: 60, delta: 15 },
            wtOSA: { value: 75, reference: 60, delta: 15 },
            avgOffTake: { value: 75, reference: 60, delta: 15 },
        },
        {
            name: "Big Basket",
            avgOSA: { value: 80, reference: 85, delta: -5 },
            wtOSA: { value: 80, reference: 85, delta: -5 },
            avgOffTake: { value: 80, reference: 85, delta: -5 },
        },
        {
            name: "Nykaa",
            avgOSA: { value: 80, reference: 85, delta: -5 },
            wtOSA: { value: 80, reference: 85, delta: -5 },
            avgOffTake: { value: 80, reference: 85, delta: -5 },
        },
        {
            name: "Myntra",
            avgOSA: { value: 75, reference: 60, delta: 15 },
            wtOSA: { value: 75, reference: 60, delta: 15 },
            avgOffTake: { value: 75, reference: 60, delta: 15 },
        },
        {
            name: "Flipkart Super",
            avgOSA: { value: 80, reference: 85, delta: -5 },
            wtOSA: { value: 80, reference: 85, delta: -5 },
            avgOffTake: { value: 80, reference: 85, delta: -5 },
        },
    ];
    const brandFooter = { total: 12, avgOSA: 70, wtOSA: 45, avgOffTake: 78 };
    const brandColumns = [
        {
            key: "keyword_type",
            value: "keyword_type",
            label: "Keyword Type",
            align: "left",
            sortable: true,
        }
        ,
        ...(kpicol?.filter(i => i?.checked)?.map(i => (
            {
                ...i,
                label: i.title,
                align: "center",
                sortable: true
            })) ?? [])
    ];
    useEffect(() => {
        const index = allOption?.findIndex(i => i?.toLocaleLowerCase() == (selectedFilters?.selected_sos_type ?? "organic")) ?? -1;
        if (index > -1 && selectedOption != allOption[index]) {
            setSelectedOption(allOption[index]);
        }
    }, [JSON.stringify(selectedFilters?.selected_sos_type)]);
    const chartRef = useRef(null);
    return (
        <>
            <div className="bg-white p-2 !rounded-2xl shadow-[0px_2px_4px_0px_#00000005,0px_1px_6px_-1px_#00000005,0px_1px_2px_0px_#00000008]">
                <div className="px-4 flex justify-between items-center mb-4">
                    {/* <h2 className="font-inter font-medium text-[18px] leading-[100%] tracking-[0] text-[#191919]"> */}
                    <h2 className="chart-title flex items-center gap-2">
                        SOS Analysis</h2>
                    <div className="flex space-x-4 text-sm">
                        <div className="mt-3 md:mt-0 flex relative">
                            <p className="font-inter text-[14px] text-[#000000A6] leading-[10.72px] tracking-[0] align-middle p-[12px]">Select View :</p>
                            <select className="appearance-none pr-8 border rounded-md px-4 py-2 text-sm text-gray-700 focus:ring focus:ring-blue-200 bg-white"
                                value={currentView}
                                onChange={(e) => setCurrentView(e.target.value)}
                            >
                                <option value="Category">Category</option>
                                <option value="Brand">Brand</option>
                                <option value="Platform">Platform</option>
                                <option value="Location">Location</option>
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
                        <div className="mt-3 md:mt-0 flex relative">
                            <p className="font-inter text-[14px] text-[#000000A6] leading-[10.72px] tracking-[0] align-middle p-[12px]">Select Metrics :</p>
                            <select className="appearance-none pr-8 border rounded-md px-4 py-2 text-sm text-gray-700 focus:ring focus:ring-blue-200 bg-white"
                                onChange={(e) => setSelectedOption(e.target.value)}
                                value={selectedOption}
                            >
                                <>{
                                    allOption?.map((k, idx) => (
                                        <option key={idx} value={k} selected={type == k}>{k} {activeClientProject?.useWeightedSOS ? 'Wt. SOS' : 'SOS'}</option>
                                    ))}</>
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
                        <button className="border rounded-md px-2 py-1" onClick={() => { chartRef.current?.downloadImage(); setresetDownload(new Date()) }}> <img
                            src="/assets/images/downloadIcon.svg"
                            width={22}
                            height={22}
                        /></button>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-8 space-y-6">
                        <div className="bg-white border rounded-xl p-4 shadow-sm">

                            <SosGraphicalAnalysis
                                ref={chartRef} resetDownload={resetDownload} currentView={currentView} selectedOption={selectedOption} type={type} optionType={optionType} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                        </div>




                        <KeywordTypeTable
                            selectedOption={selectedOption}
                            matrix={(kpicol?.filter(i => i?.checked)?.map(i => (i?.value)) ?? [])}
                            currentView={currentView}
                            activeIndex={activeIndex}
                            title="Brand"
                            data={brandData}
                            footer={brandFooter}
                            columns={brandColumns}
                        />
                    </div>
                    <RankView currentView={currentView} selectedOption={selectedOption} activeIndex={activeIndex} />



                </div>
            </div>
        </>
    );
}

export default SosWidgets;