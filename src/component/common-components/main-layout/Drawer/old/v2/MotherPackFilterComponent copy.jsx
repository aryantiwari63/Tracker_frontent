import React, { useMemo, useRef } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
// import { sortOptionsWithSelectedOnTop } from "./DrawerHelper";
// import { filter } from "lodash";
// import TreeCheckbox from "./nestedComponent/TreeCheckbox"

function MotherPackFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        kpi,
        filters,
        activeClientProject,
        selectedFiltersWidget,
        updateSelectedMotherPack,
        isWidgetFilterActive,
        setIsWidgetFilterActive
    } = useEbuxContext();
    // console.log('filtersfiltersfilters11', filters)
const lastSortedRef = useRef([]);
    const handleUpdate = (option, isChecked) => {
        let newProducts;
        // console.log('option.value',option.value)
        if (isChecked) {
            newProducts = selectedFiltersWidget.selectedMotherPack.filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...(selectedFiltersWidget.selectedMotherPack || []), option];
        }
        // console.log('platformplatformplatformplatformnewProducts', newProducts)

        if (activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO" || kpi == "RR")) {
            updateSelectedMotherPack(newProducts)
        }

        if(newProducts?.length==0){
            setIsWidgetFilterActive(false);
        }else{
            setIsWidgetFilterActive("mother_pack");
        }

    };


    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            // Unselect visible items only
            newItems = selectedFiltersWidget.selectedMotherPack.filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            // Add all visible items, avoiding duplicates
            const uniqueItems = [
                ...selectedFiltersWidget.selectedMotherPack,
                ...options.filter(
                    (opt) =>
                        !selectedFiltersWidget.selectedMotherPack.some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        if (activeClientProject?.client_project_id == 2 && (kpi == "OSA" || kpi == "PRO" || kpi == "RR")) {
            updateSelectedMotherPack(newItems);
        }

        if(newItems?.length==0){
            setIsWidgetFilterActive(false);
        }else{
            setIsWidgetFilterActive("mother_pack");
        }
    };

    const sortedMotherPack = useMemo(() => {
        if (isWidgetFilterActive == "mother_pack" && lastSortedRef.current?.length) {
            return lastSortedRef.current;
        }

        const list = isWidgetFilterActive ?
                    Array.isArray(selectedFiltersWidget?.selectedMotherPack) ? selectedFiltersWidget.selectedMotherPack : []
                    : Array.isArray(filters?.mother_pack) ? filters?.mother_pack : [];
        // 1️⃣ Apply search filter first
        const filteredList = searchTerm
            ? list.filter((b) =>
                b.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : list;
        const sorted =  [...filteredList].sort((a, b) => {
            const aChecked = selectedFiltersWidget?.selectedMotherPack?.some((sel) => sel.value === a.value);
            const bChecked = selectedFiltersWidget?.selectedMotherPack?.some((sel) => sel.value === b.value);
            if (aChecked === bChecked) return 0;
            return aChecked ? -1 : 1;
        });

        lastSortedRef.current = sorted;
        return sorted;
    }, [searchTerm,selectedFiltersWidget?.selectedMotherPack]);
    // }, [filters?.mother_pack, selectedFiltersWidget?.selectedMotherPack, searchTerm]);


    // ✅ Determine "Select All" checked state based on visible filtered items
    const allVisibleSelected =
        sortedMotherPack.length > 0 &&
        sortedMotherPack.every((opt) =>
            isOptionChecked("mother_pack", opt, selectedFiltersWidget)
        );

    const someVisibleSelected =
        sortedMotherPack.some((opt) =>
            isOptionChecked("mother_pack", opt, selectedFiltersWidget)
        );

        const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All"; 
    return (
        <>
            {sortedMotherPack?.length > 0 && (
                <div className="flex flex-col px-8 p-4 space-y-8">
                    {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                    <div className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-base">Mother Pack</h3>
                            {sortedMotherPack?.length > 3 && (
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => handleToggle("mother_pack")}
                                >
                                    {expanded["mother_pack"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["mother_pack"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                                
                                    <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded"
                                            // checked={isOptionChecked("mother_pack", filters?.mother_pack, selectedFiltersWidget?.selectedCategory)}
                                            // onChange={() => {
                                            //     const allSelected = filters?.mother_pack.every((opt) =>
                                            //         isOptionChecked("mother_pack", opt, selectedFiltersWidget)
                                            //     );
                                            //     handleSelectAllUpdate(filters?.mother_pack, allSelected);
                                            //     handleSelectAll("mother_pack", filters?.mother_pack);
                                            // }}

                                            checked={allVisibleSelected}
                                            ref={(input) => {
                                                if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                            }}
                                            onChange={() => {
                                                handleSelectAllUpdate(sortedMotherPack, allVisibleSelected)
                                                handleSelectAll("mother_pack", sortedMotherPack);
                                            }}
                                        />
                                        {selectAllLabel}
                                    </label>
                                

                                {sortedMotherPack?.map((option, i) => {

                                    const isChecked = isOptionChecked("mother_pack", option, selectedFiltersWidget);
                                    return (
                                        <div key={i} className="ml-0">
                                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                                <span>
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            handleUpdate(option, isChecked); // 🔹 dynamic updater
                                                            handleCheck("mother_pack", option.value, isChecked); // keep drawer state in sync
                                                        }}
                                                    />
                                                </span>

                                                {option.label}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {sortedMotherPack?.length > 3 && (
                            <button
                                type="button"
                                className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                                onClick={() => handleToggle("mother_pack")}
                            >
                                {expanded["mother_pack"] ? "View Less" : "View More"}
                                <span className="ml-1">
                                    {expanded["mother_pack"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default MotherPackFilterComponent;