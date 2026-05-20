import React, { useState } from "react";
import MockPerformanceOverview from './PerformanceOverview';

import {
    // arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Static cards and metrics ---
const staticCards = [
    { id: 'brand-1', label: 'Brand A', type: 'brand', checked: true },
    { id: 'category-1', label: 'Category X', type: 'category', checked: true },
    { id: 'category-2', label: 'Category Y', type: 'category', checked: true },
];

const staticMetrics = [
    { id: "avgOSA", label: "Avg OSA", checked: true },
    { id: "wgtOSA", label: "Wgt OSA", checked: true },
    { id: "avgOffTake", label: "Avg OffTake", checked: true },
];

const metricData = [
    {
        avgOSA: { value: 75, prev: 60, change: 15 },
        wgtOSA: { value: 80, prev: 85, change: -5 },
        avgOffTake: { value: 50, prev: 40, change: 10 },
    },
];

// --- Metric component ---
const Metric = ({ label, metric }) => {
    const isPositive = (metric?.change ?? 0) >= 0;
    return (
        <div className="grid grid-cols-[auto,1fr] items-center text-[9px]">
            <span className="whitespace-nowrap">{label}</span>
            <div className="flex items-center justify-end gap-1">
                <span className="font-semibold">{metric?.value}%</span>
                {metric?.prev ? (
                    <>
                        <span className="text-gray-400 text-[8px]">{metric?.prev}%</span>
                        <span className={`flex items-center gap-1 px-1 py-0.5 rounded-full text-[6px] border ${isPositive
                                ? "text-green-500 bg-green-100 border-green-200"
                                : "text-red-500 bg-red-100 border-red-200"
                            }`}>
                            {isPositive ? "▲" : "▼"} {Math.abs(metric.value - metric.prev)}%
                        </span>
                    </>
                ) : null}
            </div>
        </div>
    );
};

// --- Drag Handle ---
const DragHandle = () => (
    <div className="cursor-move p-0.5 text-gray-400 hover:text-gray-600">
        <svg width="14" height="16" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.166 3.97266C16.7682 3.97266 16.3867 4.13069 16.1054 4.412C15.8241 4.6933 15.666 5.07483 15.666 5.47266C15.666 5.87048 15.8241 6.25201 16.1054 6.53332C16.3867 6.81462 16.7682 6.97266 17.166 6.97266C17.5638 6.97266 17.9454 6.81462 18.2267 6.53332C18.508 6.25201 18.666 5.87048 18.666 5.47266C18.666 5.07483 18.508 4.6933 18.2267 4.412C17.9454 4.13069 17.5638 3.97266 17.166 3.97266ZM9.66602 3.97266C9.26819 3.97266 8.88666 4.13069 8.60536 4.412C8.32405 4.6933 8.16602 5.07483 8.16602 5.47266C8.16602 5.87048 8.32405 6.25201 8.60536 6.53332C8.88666 6.81462 9.26819 6.97266 9.66602 6.97266C10.0638 6.97266 10.4454 6.81462 10.7267 6.53332C11.008 6.25201 11.166 5.87048 11.166 5.47266C11.166 5.07483 11.008 4.6933 10.7267 4.412C10.4454 4.13069 10.0638 3.97266 9.66602 3.97266ZM2.16602 3.97266C1.76819 3.97266 1.38666 4.13069 1.10536 4.412C0.824051 4.6933 0.666016 5.07483 0.666016 5.47266C0.666016 5.87048 0.824051 6.25201 1.10536 6.53332C1.38666 6.81462 1.76819 6.97266 2.16602 6.97266C2.56384 6.97266 2.94537 6.81462 3.22667 6.53332C3.50798 6.25201 3.66602 5.87048 3.66602 5.47266C3.66602 5.07483 3.50798 4.6933 3.22668 4.412C2.94537 4.13069 2.56384 3.97266 2.16602 3.97266Z" fill="#53545E" />
        </svg>
    </div>
);

// --- Sortable Card ---
function SortableCard({ card, visibleMatrix = [], activeCard = {}, setActiveCard }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    visibleMatrix = visibleMatrix?.filter(m => m.checked);
    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => setActiveCard(card)}
            className={`flex-1 rounded-lg border p-1 flex flex-col gap-1 text-[10px] ${activeCard?.id === card?.id ? 'border-2 border-blue-500 bg-blue-50' : 'bg-white shadow border border-gray-100 cursor-pointer'} h-[90px] min-h-0`}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center justify-center gap-1">
                    <span {...attributes} {...listeners}>
                        <DragHandle />
                    </span>
                    <img
                        src={`/assets/images/${card.type === "brand" ? "brandIcon" : "categorytIcon"}.svg`}
                        alt={card.id}
                        className="w-[16px] h-[16px]" // smaller icon
                    />
                    <span className="font-semibold text-gray-800 text-[10px]">{card.label}</span>
                </div>
            </div>
            {visibleMatrix?.length > 0 && (
                <div className="flex flex-col gap-0.5">
                    {visibleMatrix.map((m) => (
                        <Metric label={m.label} metric={metricData[0]?.[m.id] ?? {}} key={m.id} />
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Main Component ---
function MockOsaPerformanceOverviewComponent({isDropped}) {
    const [cards] = useState(staticCards);
    const [metrics] = useState(staticMetrics);
    const [activeCard, setActiveCard] = useState(staticCards[0]);
    // const sensors = useSensors(useSensor(PointerSensor));

    // const handleDragEnd = (event) => {
    //     const { active, over } = event;
    //     if (active.id !== over?.id) {
    //         setCards((items) => {
    //             const oldIndex = items.findIndex((i) => i.id === active.id);
    //             const newIndex = items.findIndex((i) => i.id === over.id);
    //             return arrayMove(items, oldIndex, newIndex);
    //         });
    //     }
    // };

    return (
        <div className="bg-white">
            <div className={`flex justify-between items-center mb-1 border-b px-1 py-0.5 ${isDropped ? "opacity-[0.6]" : ""}`}>
                <h1 className="text-[12px] font-semibold">OSA Performance Overview</h1>
            </div>

            <div className="p-1">
                
                    <SortableContext items={cards} strategy={rectSortingStrategy} className="hidden">
                        <div className="grid grid-cols-3 gap-1 w-full px-2"> {/* 3 cards per row */}
                            {cards.map((card) => (
                                <SortableCard
                                    key={card.id}
                                    card={card}
                                    visibleMatrix={metrics}
                                    activeCard={activeCard}
                                    setActiveCard={setActiveCard}
                                />
                            ))}
                        </div>
                    </SortableContext>
               
            </div>

            <div className="p-2">
                <MockPerformanceOverview />
            </div>
        </div>
    );
}

export default MockOsaPerformanceOverviewComponent;
