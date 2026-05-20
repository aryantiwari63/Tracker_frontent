import React, { useEffect, useRef, useState } from 'react'

import { fetchRankAnalysisData } from "./services/service";
import { createPortal } from "react-dom";
import { useEbuxContext } from '../../Context/EbuxProvider';
import Loader from '../../common-components/Loader';

const isShowDummyData = false;

const initCardsData = (!isShowDummyData) ? [] : [
    { id: 1, title: "P1", bgColor: "#4DA6FF", type: "paid" },
    { id: 2, title: "P2", bgColor: "#A4D3FF", type: "organic" },
    { id: 3, title: "P3", bgColor: "#A4D3FF", type: "organic" },
    { id: 4, title: "P4", bgColor: "#A4D3FF", type: "organic" },
    { id: 5, title: "P5", bgColor: "#A4D3FF", type: "organic" },
    { id: 6, title: "P6", bgColor: "#4DA6FF", type: "organic" },
    { id: 7, title: "P7", bgColor: "#A4D3FF", type: "organic" },
    { id: 8, title: "P8", bgColor: "#A4D3FF", type: "organic" },
    { id: 9, title: "P9", bgColor: "#A4D3FF", type: "paid" },
    { id: 10, title: "P10", bgColor: "#A4D3FF", type: "paid" },
    { id: 11, title: "P11", bgColor: "#A4D3FF", type: "organic" },
    { id: 12, title: "P12", bgColor: "#4DA6FF", type: "organic" },
    { id: 13, title: "P13", bgColor: "#A4D3FF", type: "organic" },
    { id: 14, title: "P14", bgColor: "#A4D3FF", type: "organic" },
    { id: 15, title: "P15", bgColor: "#A4D3FF", type: "organic" },
    { id: 16, title: "P16", bgColor: "#A4D3FF", type: "organic" },
    { id: 17, title: "P17", bgColor: "#4DA6FF", type: "paid" },
    { id: 18, title: "P18", bgColor: "#A4D3FF", type: "organic" },
    { id: 19, title: "P19", bgColor: "#A4D3FF", type: "paid" },
    { id: 20, title: "P20", bgColor: "#A4D3FF", type: "organic" },
];
const Tooltip = ({ infoTooltip, onClose }) => {
    const refOne = useRef(null);
    const { rect, data, position } = infoTooltip;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refOne.current && !refOne.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!data || !rect) return null;

    // Calculate tooltip position
    const gap = 2;
    let style = {};
    //   let arrowStyle = {};
    let arrowClasses = "";

    switch (position) {
        case "top":
            style = {
                top: rect.top - gap,
                left: rect.left + rect.width / 2,
                transform: "translate(-50%, -100%)",
            };
            arrowClasses =
                "absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black";
            break;

        case "bottom":
            style = {
                top: rect.bottom + gap,
                left: rect.left + rect.width / 2,
                transform: "translate(-15%, 0)",
            };
            arrowClasses =
                "absolute top-[-8px] left-[10%] -translate-x-[10%] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-black";
            break;

        case "left":
            style = {
                top: rect.top + rect.height / 2,
                left: rect.left - gap,
                transform: "translate(-100%, -50%)",
            };
            arrowClasses =
                "absolute top-1/2 right-[-8px] -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-black";
            break;

        case "right":
        default:
            style = {
                top: rect.top + rect.height / 2,
                left: rect.right + gap,
                transform: "translate(0, -50%)",
            };
            arrowClasses =
                "absolute top-1/2 left-[-8px] -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black";
            break;
    }

    return createPortal(
        <div
            ref={refOne}
            className="fixed bg-black text-gray-100 border border-black rounded-lg shadow-lg px-2 py-2 z-[99999]"
            style={style}
        >
            <div className={arrowClasses}></div>
            <p>Position: <strong>{data?.title}</strong></p>

            <p>Number of Occurance: <strong>{data?.total}</strong></p>
            {/* <p>SOS: <strong>{data?.sos??0}%</strong></p> */}
        </div>,
        document.body
    );
};



const layoutClasses = {
    "1": "grid-cols-2", // Single column (stacked)
    "2": "grid-cols-2", // 2 in a row
    "3": "grid-cols-3", // 3 in a row
    "4": "grid-cols-4", // 4 in a row
};

const heightClasses = {
    "1": "140px", // Single column (stacked)
    "2": "140px", // 2 in a row
    "3": "115px", // 3 in a row
    "4": "90px", // 4 in a row
};

// const shadeColor = (color, percent) => {
//     let R = parseInt(color.substring(1, 3), 16);
//     let G = parseInt(color.substring(3, 5), 16);
//     let B = parseInt(color.substring(5, 7), 16);

//     R = parseInt((R * (100 + percent)) / 100);
//     G = parseInt((G * (100 + percent)) / 100);
//     B = parseInt((B * (100 + percent)) / 100);

//     R = R < 255 ? R : 255;
//     G = G < 255 ? G : 255;
//     B = B < 255 ? B : 255;

//     const RR = R.toString(16).padStart(2, "0");
//     const GG = G.toString(16).padStart(2, "0");
//     const BB = B.toString(16).padStart(2, "0");

//     return `#${RR}${GG}${BB}`;
// };
const adjustShade = (color, percent) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.min(255, Math.max(0, parseInt((R * (100 + percent)) / 100)));
    G = Math.min(255, Math.max(0, parseInt((G * (100 + percent)) / 100)));
    B = Math.min(255, Math.max(0, parseInt((B * (100 + percent)) / 100)));

    return `#${R.toString(16).padStart(2, "0")}${G
        .toString(16)
        .padStart(2, "0")}${B.toString(16).padStart(2, "0")}`;
};
function RankView({ selectedOption, currentView, activeIndex }) {

    const {
        kpi,
        selectedFilters, filters
    } = useEbuxContext();

    const [layout, setLayout] = useState("3"); // default 3 in a row

    const [cardsData, setCardsData] = useState(initCardsData ?? []);
    const [loading, setLoading] = useState(false);
    const fetchRankData = async () => {
        setLoading(true);
        if (!currentView || !activeIndex) return;

        let payload = {
            sos_type: selectedOption,
            kpi,
            key: currentView ?? "",
            value: activeIndex ?? "",
            selectedFilters,
            filters
        };

        let response = await fetchRankAnalysisData(payload);
        const type_key = selectedOption == "Overall" ? "total" : selectedOption;
        const uniqueTotals = [
            ...new Set((response ?? []).map(d => d?.[type_key] ?? d?.["total"]))
        ].sort((a, b) => a - b);
        const totalColorMap = {};
        const maxIndex = uniqueTotals.length - 1;
        uniqueTotals.forEach((t, i) => {
            // scale from light (+60) → dark (-40)
            const percent = 20 - (i / maxIndex) * 100;
            totalColorMap[t] = adjustShade("#4DA6FF", percent);
        });
        response = response.map(d => {
            const key = d?.[type_key] ?? d?.["total"];
            return {
                ...d,
                bgColor: d?.disabled? "#dddddd" : totalColorMap[key] || adjustShade("#4DA6FF", 70), // fallback light

                type: (!d?.disabled && selectedOption == "Paid") || (selectedOption == "Overall" && d?.["Paid"] > 0) ? "paid" : "organic"
            };
        });
        setCardsData(response);
        setLoading(false);
    }
    useEffect(() => {
        fetchRankData();
    }, [selectedOption, currentView, activeIndex, JSON.stringify({ ...selectedFilters, selected_sos_type: "" })]);

    const [infoTooltip, setInfoTooltip] = useState({});

    const toggleTooltip = (event, option, position = "top") => {
        const rect = event.currentTarget.getBoundingClientRect();
        const data = { "title": option?.title, "total": option?.total, "sos": option?.sos?.value?.toFixed(2) ?? 0 }
        setInfoTooltip({ data, rect, position });
    };
    return (
        <>
            <div className="col-span-4 bg-white border rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-inter font-medium text-[16px] leading-[10.72px] tracking-[0] align-middle text-[#000000] flex items-center gap-2">Rank Distribution  {loading && <Loader show={loading} fullScreen={false} />}
                        {/* <span className="w-[110px] h-[31px] opacity-100 gap-[30px] pt-[7px] pr-[10px] pb-[7px] pl-[10px] rounded-[8px] border border-[1px] border-gray-300">Category: Tea</span> */}
                    </h2>
                    <div className="mt-3 md:mt-0 flex relative">
                        <p className="font-inter text-[14px] text-[#000000A6] leading-[10.72px] tracking-[0] align-middle p-[12px]">Select Layout :</p>
                        <select className="appearance-none pr-8 border rounded-md px-4 py-2 text-sm text-gray-700 focus:ring focus:ring-blue-200 bg-white"
                            value={layout}
                            onChange={(e) => setLayout(e.target.value)}
                        >
                            {/* <option value="1">Single Layout</option> */}
                            <option value="1">1 In a Row</option>
                            <option value="2">2 In a Row</option>
                            <option value="3">3 In a Row</option>
                            <option value="4">4 In a Row</option>
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
                <span className="w-[110px] h-[31px] opacity-100 gap-[30px] pt-[7px] pr-[10px] pb-[7px] pl-[10px] rounded-[8px] border border-[1px] border-gray-300 bg-[#E7F4FF] border border-[#6EBAFF]">{currentView}: {activeIndex}</span>
                {layout === "1" ? (
                    <div className={`grid ${layoutClasses[layout]} gap-4 mt-4    h-[875px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']`}>
                        {/* <div className="space-y-4"> */}

                        {cardsData.map((card, index) => (
                            <>
                                <div key={index}
                                    className={`flex flex-row gap-3`}
                                    onMouseEnter={(e) => toggleTooltip(e, card, "top")}
                                    onMouseLeave={() => setInfoTooltip({})}
                                >
                                    {/* cursor-pointer */}
                                    <div className={` relative w-full rounded-[8px] flex flex-col justify-between p-2`}
                                        style={{
                                            height: heightClasses[layout],
                                            backgroundColor: card?.bgColor,
                                        }}
                                    >
                                        {/* <span className="text-sm font-medium text-gray-900">{card?.title}</span> */}
                                        <span className={`absolute right-[5px] ${card?.type == 'paid' ? "" : "hidden"}`}>
                                            <img src="/assets/images/widget/currency.png" />
                                        </span>
                                        <div className="flex justify-center items-center flex-1">
                                            <img src="/assets/images/widget/package.png" />
                                        </div>
                                        
                                        <button className="absolute bottom-2 right-2 w-6 h-6 flex items-center justify-center rounded bg-gray-100 text-gray-500 text-xs shadow border-[0.6px] border-[#B2B2B2]">
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div key={card?.id} className='flex flex-row gap-1 items-left  justify-start h-[140px]'>
                                    <div className="max-h-[35px] min-w-[35px] bg-white border rounded-lg p-2 shadow items-center flex justify-center">
                                        {card?.title}
                                    </div>
                                    <div className="space-y-2 w-full h-[140px]">
                                        <div className="h-[6px] bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-[6px] bg-gray-300 rounded w-2/3"></div>
                                        <div className="h-[6px] bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </>
                        ))}
                        {/* </div>
                            <div className="flex flex-col space-y-6">
                                {cardsData.map((card) => (
                                    <div key={card?.id} className="space-y-2 w-full h-[140px]">
                                        <div className="h-[6px] bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-[6px] bg-gray-300 rounded w-2/3"></div>
                                        <div className="h-[6px] bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div> */}
                    </div>
                ) : (
                    <div className={`grid ${layoutClasses[layout]} gap-4 mt-4 min-h-[330px] max-h-[875px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']`}>
                        {cardsData.map((card, index) => (
                            <div key={index}
                                onMouseEnter={(e) => toggleTooltip(e, card, "top")}
                                onMouseLeave={() => setInfoTooltip({})}
                                className={`flex flex-col gap-3`}
                            >
                                <div className={` relative w-full rounded-[8px] flex flex-col justify-between p-2`}
                                    style={{
                                        height: heightClasses[layout],
                                        backgroundColor: card?.bgColor,
                                    }}
                                >
                                    {/* <span className="text-sm font-medium text-gray-900">{card?.title}</span> */}
                                    <span className={`absolute right-[5px] ${card?.type == 'paid' ? "" : "hidden"}`}>
                                        <img src="/assets/images/widget/currency.png" />
                                    </span>
                                    <div className="flex justify-center items-center flex-1">
                                        <img src="/assets/images/widget/package.png" />
                                    </div>

                                    
                                    <button className="absolute bottom-2 right-2 w-6 h-6 flex items-center justify-center rounded bg-gray-100 text-gray-500 text-xs shadow border-[0.6px] border-[#B2B2B2]">
                                        +
                                    </button>
                                </div>
                                {/* <img src="/assets/images/widget/scelton.png" className="h-[8px] w-[80px] mt-1" /> */}
                                {/* <div className="flex-1 flex flex-col justify-center space-y-1 mt-[-8px]">
                                    <div className="h-[3px] bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-[3px] bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-[3px] bg-gray-300 rounded w-2/3"></div>
                                </div> */}

                                <div key={card?.id} className='flex flex-row gap-1 items-left justify-start space-y-1 mt-[-8px]'>
                                    <div className="max-h-[35px] min-w-[35px] bg-white border rounded-lg p-2 shadow items-center flex justify-center">
                                        {card?.title}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center space-y-1 mt-[-8px]">
                                        <div className="h-[6px] bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-[6px] bg-gray-300 rounded w-2/3"></div>
                                        <div className="h-[6px] bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
            {/* Tooltip */}
            {infoTooltip?.data ? (
                <Tooltip
                    infoTooltip={infoTooltip}
                    onClose={() => setInfoTooltip({})}
                />
            ) : <></>}
        </>
    )
}

export default RankView