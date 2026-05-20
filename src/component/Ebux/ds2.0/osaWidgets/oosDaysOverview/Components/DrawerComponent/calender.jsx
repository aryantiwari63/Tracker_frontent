import React, { useEffect, useRef, useMemo, useState } from "react";
import moment from "moment";
import { leftArrowIcon, rightArrowIcon } from "./utils/icons";

export default function DateRangeCalender({
    monthsToShow = 1,
    onChange,
    minDate,
    maxDate = new Date(),
    // Example: [new Date(2025,8,15), new Date(2025,8,20), ...]
    selectedDate = [new Date("2025-8-15"), new Date("2025-8-20"), new Date("2025-8-19"), new Date("2025-8-12")]
}) {
    const sortedSelected = useMemo(() => {
        if (!selectedDate || !Array.isArray(selectedDate)) return [];
        return selectedDate
            .filter(Boolean)
            .map((d) => moment(d))
            .sort((a, b) => a.valueOf() - b.valueOf());
    }, [selectedDate]);
    const [currentMonth, setCurrentMonth] = useState(moment(sortedSelected[sortedSelected.length - 1] || new Date()));
    const refOne = useRef(null);

    // Create a Set of YYYY-MM-DD strings for fast membership checks
    const selectedSet = useMemo(() => {
        if (!sortedSelected || !Array.isArray(sortedSelected)) return new Set();
        return new Set(
            sortedSelected
                .filter(Boolean)
                .map((d) => moment(d).format("YYYY-MM-DD"))
        );
    }, [sortedSelected]);

    useEffect(() => {
        // If you previously used "click outside to mirror start->end" behavior you can keep it.
        // Here we don't maintain internal range state because highlights come directly from props.
        const handleClickOutside = (event) => {
            if (refOne.current && !refOne.current.contains(event.target)) {
                // nothing special to do here for highlighting since it's prop-driven
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isDisabled = (day) => {
        if (minDate && day.isBefore(moment(minDate), "day")) return true;
        if (maxDate && day.isAfter(moment(maxDate), "day")) return true;
        return false;
    };

    const handleDayClick = (day) => {
        if (isDisabled(day)) return;
        const newRange = { start: day.clone(), end: day.clone() };
        if (onChange) onChange(newRange);
        // we do NOT mutate internal highlight state — parent should update selectedDate prop
    };

    const renderMonth = (monthMoment, showNavigation = false, key) => {
        const start = monthMoment.clone().startOf("month");
        const end = monthMoment.clone().endOf("month");
        const days = [];

        let day = start.clone().startOf("week");
        const lastDay = end.clone().endOf("week");

        while (day.isSameOrBefore(lastDay, "day")) {
            days.push(day.clone());
            day.add(1, "day");
        }

        return (
            <div className="w-full" key={key}>
                <div className="flex justify-between items-center">
                    <h2 className="text-gray-800 font-semibold">{monthMoment.format("MMMM YYYY")}</h2>

                    {showNavigation ? (
                        <div className="flex justify-end">
                            <button
                                onClick={() => setCurrentMonth((prev) => prev.clone().subtract(1, "month"))}
                                className="p-1 text-gray-700 hover:bg-gray-200 rounded"
                            >
                                {leftArrowIcon("currentColor")}
                            </button>
                            <button
                                onClick={() => setCurrentMonth((prev) => prev.clone().add(1, "month"))}
                                className="p-1 text-gray-700 hover:bg-gray-200 rounded"
                            >
                                {rightArrowIcon}
                            </button>
                        </div>
                    ) : (
                        <div className="flex">
                            <button disabled className="p-1">
                                {leftArrowIcon("none")}
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-7 gap-1 text-[13px] text-gray-500 mb-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="text-center">
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                    {days.map((dayMoment, idx) => {
                        const dayKey = dayMoment.format("YYYY-MM-DD");                
                        const isSelected = selectedSet.has(dayKey);

                        const isOutsideMonth = !dayMoment.isSame(monthMoment, "month");
                        const disabled = isDisabled(dayMoment);

                        // Decide styles
                        let bgClass = "";
                        let notAllowedClass = false;

                        if (isSelected) {
                            if (isOutsideMonth && monthsToShow > 1) {
                                notAllowedClass = true;
                                bgClass = `bg-white text-gray-400`;
                            } else {
                                bgClass = "bg-blue-500 text-white";
                            }
                        } else if (isOutsideMonth) {
                            if (monthsToShow > 1) notAllowedClass = true;
                            bgClass = `bg-white text-gray-400`;
                        } else {
                            bgClass = "bg-white text-gray-800";
                        }

                        return (
                            <div
                                key={idx}
                                onClick={() => handleDayClick(dayMoment)}
                                className={`${bgClass} text-[12px] py-1 rounded cursor-pointer ${notAllowedClass ? "cursor-not-allowed" : "hover:bg-blue-200"
                                    } ${disabled ? "opacity-40 cursor-not-allowed hover:bg-inherit" : ""}`}
                            >
                                {(isOutsideMonth && monthsToShow > 1) ? "" : dayMoment.format("D")}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Build array of months (previous .. current)
    const months = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
        months.push(currentMonth.clone().subtract(i, "month"));
    }

    return (
        <div className="flex flex-col bg-white justify-center items-center inline-block">
            <div ref={refOne} className="flex justify-between gap-8 p-1 w-full">
                {months.map((m, idx) =>
                    renderMonth(m, idx === months.length - 1 /* show navigation on last (current) month */, idx)
                )}
            </div>
        </div>
    );
}
