import React, { useEffect, useMemo, useState } from 'react';
import { MdOutlineCategory } from "react-icons/md";
import {
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { fetchDrillDownData } from '../../services/drillDown.service';
import { useEbuxContext } from '../../../../../Context/EbuxProvider';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import Loader from '../../../../../common-components/Loader';
const getHeaderIcon = (icon) => {
        switch (icon) {
            case "rupee":
                return "₹ ";
            default:
                return (icon)?icon+" ":"";
        }
    }
    
const showValue = (col, value) => {
    return <>{value != undefined && col?.icon ? getHeaderIcon(col?.icon) : ""}{value}{value != undefined && col?.subValue ? col?.subValue : ""}{value != undefined && col?.persentageValue ? "%" : ""}</>
}

const renderCell = (col, metric, loading) => (
    <>
        {loading ? (
            <Loader show={true} fullScreen={false} size="small" isCard = {true}/>
        ) : (
            <>
                {
                    metric?.value||( metric?.value != undefined &&(col?.value=="osa" || col?.value == "price_variation") ) ?
                        <span className="font-medium">{showValue(col, metric?.value)}</span>
                        : <>-</>
                }
                {
                    metric?.value && metric?.reference ?
                        (<span className="text-gray-400 text-xs">{showValue(col, metric?.reference)}</span>)
                        :
                        (<></>)
                }

                {metric?.value && metric?.reference && metric?.delta ?
                    metric?.delta >= 0 ? (
                        <span className="text-[#329900] flex items-center gap-1 text-xs px-1 py-0.5 border border-[#B7EB8F] bg-[#E8FFEB] rounded-full">
                            <IoMdArrowDropup size={14} /> {showValue(col, metric?.delta)}
                        </span>
                    ) : (
                        <span className="text-[#DD4242] flex items-center gap-1 text-xs px-1 py-0.5 border bg-[#FFF1F0] border-[#FFA39E] rounded-full">
                            <IoMdArrowDropdown size={14} /> {showValue(col, Math.abs(metric?.delta))}
                        </span>
                    ) :
                    <></>
                }
            </>
        )}
    </>
);

// --- Drag Handle ---
const DragHandle = () => (
    <div className="cursor-move p-1 text-gray-400 hover:text-gray-600">
        <svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.166 3.97266C16.7682 3.97266 16.3867 4.13069 16.1054 4.412C15.8241 4.6933 15.666 5.07483 15.666 5.47266C15.666 5.87048 15.8241 6.25201 16.1054 6.53332C16.3867 6.81462 16.7682 6.97266 17.166 6.97266C17.5638 6.97266 17.9454 6.81462 18.2267 6.53332C18.508 6.25201 18.666 5.87048 18.666 5.47266C18.666 5.07483 18.508 4.6933 18.2267 4.412C17.9454 4.13069 17.5638 3.97266 17.166 3.97266ZM9.66602 3.97266C9.26819 3.97266 8.88666 4.13069 8.60536 4.412C8.32405 4.6933 8.16602 5.07483 8.16602 5.47266C8.16602 5.87048 8.32405 6.25201 8.60536 6.53332C8.88666 6.81462 9.26819 6.97266 9.66602 6.97266C10.0638 6.97266 10.4454 6.81462 10.7267 6.53332C11.008 6.25201 11.166 5.87048 11.166 5.47266C11.166 5.07483 11.008 4.6933 10.7267 4.412C10.4454 4.13069 10.0638 3.97266 9.66602 3.97266ZM2.16602 3.97266C1.76819 3.97266 1.38666 4.13069 1.10536 4.412C0.824051 4.6933 0.666016 5.07483 0.666016 5.47266C0.666016 5.87048 0.824051 6.25201 1.10536 6.53332C1.38666 6.81462 1.76819 6.97266 2.16602 6.97266C2.56384 6.97266 2.94537 6.81462 3.22667 6.53332C3.50798 6.25201 3.66602 5.87048 3.66602 5.47266C3.66602 5.07483 3.50798 4.6933 3.22668 4.412C2.94537 4.13069 2.56384 3.97266 2.16602 3.97266Z" fill="#53545E" />
            <path d="M17.166 10.9727C16.7682 10.9727 16.3867 11.1307 16.1054 11.412C15.8241 11.6933 15.666 12.0748 15.666 12.4727C15.666 12.8705 15.8241 13.252 16.1054 13.5333C16.3867 13.8146 16.7682 13.9727 17.166 13.9727C17.5638 13.9727 17.9454 13.8146 18.2267 13.5333C18.508 13.252 18.666 12.8705 18.666 12.4727C18.666 12.0748 18.508 11.6933 18.2267 11.412C17.9454 11.1307 17.5638 10.9727 17.166 10.9727ZM9.66602 10.9727C9.26819 10.9727 8.88666 11.1307 8.60536 11.412C8.32405 11.6933 8.16602 12.0748 8.16602 12.4727C8.16602 12.8705 8.32405 13.252 8.60536 13.5333C8.88666 13.8146 9.26819 13.9727 9.66602 13.9727C10.0638 13.9727 10.4454 13.8146 10.7267 13.5333C11.008 13.252 11.166 12.8705 11.166 12.4727C11.166 12.0748 11.008 11.6933 10.7267 11.412C10.4454 11.1307 10.0638 10.9727 9.66602 10.9727ZM2.16602 10.9727C1.76819 10.9727 1.38666 11.1307 1.10536 11.412C0.824051 11.6933 0.666016 12.0748 0.666016 12.4727C0.666016 12.8705 0.824051 13.252 1.10536 13.5333C1.38666 13.8146 1.76819 13.9727 2.16602 13.9727C2.56384 13.9727 2.94537 13.8146 3.22667 13.5333C3.50798 13.252 3.66602 12.8705 3.66602 12.4727C3.66602 12.0748 3.50798 11.6933 3.22668 11.412C2.94537 11.1307 2.56384 10.9727 2.16602 10.9727Z" fill="#53545E" />
            <path d="M17.166 17.9727C16.7682 17.9727 16.3867 18.1307 16.1054 18.412C15.8241 18.6933 15.666 19.0748 15.666 19.4727C15.666 19.8705 15.8241 20.252 16.1054 20.5333C16.3867 20.8146 16.7682 20.9727 17.166 20.9727C17.5638 20.9727 17.9454 20.8146 18.2267 20.5333C18.508 20.252 18.666 19.8705 18.666 19.4727C18.666 19.0748 18.508 18.6933 18.2267 18.412C17.9454 18.1307 17.5638 17.9727 17.166 17.9727ZM9.66602 17.9727C9.26819 17.9727 8.88666 18.1307 8.60536 18.412C8.32405 18.6933 8.16602 19.0748 8.16602 19.4727C8.16602 19.8705 8.32405 20.252 8.60536 20.5333C8.88666 20.8146 9.26819 20.9727 9.66602 20.9727C10.0638 20.9727 10.4454 20.8146 10.7267 20.5333C11.008 20.252 11.166 19.8705 11.166 19.4727C11.166 19.0748 11.008 18.6933 10.7267 18.412C10.4454 18.1307 10.0638 17.9727 9.66602 17.9727ZM2.16602 17.9727C1.76819 17.9727 1.38666 18.1307 1.10536 18.412C0.824051 18.6933 0.666016 19.0748 0.666016 19.4727C0.666016 19.8705 0.824051 20.252 1.10536 20.5333C1.38666 20.8146 1.76819 20.9727 2.16602 20.9727C2.56384 20.9727 2.94537 20.8146 3.22667 20.5333C3.50798 20.252 3.66602 19.8705 3.66602 19.4727C3.66602 19.0748 3.50798 18.6933 3.22668 18.412C2.94537 18.1307 2.56384 17.9727 2.16602 17.9727Z" fill="#53545E" />
        </svg>
    </div>
);

// --- Sortable Card ---
function SortableCard({ card, setDrawerInfo, visibleMatrix = [], activeCard = {}, handleSelectCard }) {

    const {
        kpi, selectedFilters,filters
    } = useEbuxContext();
    const [apiResponse, setApiResponse] = useState([]);
    const [loading, setLoading] = useState(false);
    const {  footerData } = useMemo(() => {
        if (apiResponse?.rowData) {
            const { rowData, footerData } = apiResponse;
            return { rowData, footerData };
        } else {
            return { rowData: [], footerData: {} };
        }
    }, [JSON.stringify(apiResponse)]);

    const fetchData = async () => {
        setLoading(true);
        if (!card?.label || !card?.type) return;
        const performanceOf = card?.type ?? 'brand';
        let payload = {
            kpi,
            drillDown: card?.type,
            breakdown: ["product", 'sku'],
            matrix: visibleMatrix?.filter(column => column?.type == "parameters")?.map(column => column.value) ?? ['osa', 'wt_osa', 'avg_offtake_osa'],
            key: performanceOf,
            value: card?.label ?? "",
            selectedFilters,filters
        };
        const response = await fetchDrillDownData(payload);
        setApiResponse(response);
        setLoading(false);
    }
    
    useEffect(() => {
        fetchData();
    }, [JSON.stringify(card), JSON.stringify(selectedFilters), JSON.stringify(visibleMatrix)]);
    
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const icon = card?.type === "mother_pack" ? "mother_pack" : card?.type === "brand" ? "brandIcon" : "categorytIcon";
    visibleMatrix = visibleMatrix?.filter(m => m.checked);
    
    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => handleSelectCard(card)}
            className={`flex-1  rounded-xl border p-4 flex flex-col gap-3 ${activeCard?.id === card?.id ? 'border-2 border-blue-500 bg-blue-50' : 'bg-white shadow-md border-2 border-gray-100 cursor-pointer'}`}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center  justify-center gap-2">
                    <span {...attributes} {...listeners}>
                        <DragHandle />
                    </span>
                    {icon=="mother_pack" ?
                    <MdOutlineCategory alt={`${card?.id}`} className="w-[24px] h-[24px]"/>
                    :
                    <img
                        src={`/assets/images/${icon}.svg`}
                        alt={`${card?.id}`} className="w-[24px] h-[24px]"
                    />}
                    <span className="font-semibold text-gray-800">{card?.label}</span>
                </div>
                <button onClick={(e) => {
                    e.stopPropagation();
                    setDrawerInfo(prev => ({
                        ...prev,
                        isOpen: true,
                        data: {
                            visibleMatrix:visibleMatrix?.filter(m => m.checked),
                            item: { ...card },
                            icon: icon,
                            performanceOf: card.type || 'brand',
                            value: card?.label || 'Unknown'
                        }
                    }))
                }}>
                    <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 8.80469C7.13333 8.13802 7.46667 7.67135 8 7.13802C8.66667 6.53802 9 5.67135 9 4.80469C9 3.74382 8.57857 2.72641 7.82843 1.97626C7.07828 1.22611 6.06087 0.804688 5 0.804688C3.93913 0.804688 2.92172 1.22611 2.17157 1.97626C1.42143 2.72641 1 3.74382 1 4.80469C1 5.47135 1.13333 6.27135 2 7.13802C2.46667 7.60469 2.86667 8.13802 3 8.80469M3 11.4714H7M3.66667 14.138H6.33333" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            
            {visibleMatrix?.length && (
                <>
                    {visibleMatrix?.map((m,idx) => {
                        return (
                            <div key={idx} className="flex items-center justify-between gap-2">
                                <div className="whitespace-nowrap">{m?.label}</div>
                                <div className="flex items-center justify-end gap-2">
                                    {renderCell(m, footerData[m?.value], loading)}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}

export default SortableCard;