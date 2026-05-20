import React, { useMemo, useRef } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

function BrandCommonFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', searchTerm)
    const {
        kpi,
        filters,
        activeClientProject,
        selectedFiltersWidget,
        updateSelectedBrand,
        updateSelectedBrandV2,
        updateSelectedKeywordBrandV2,
        isWidgetFilterActive,
        setIsWidgetFilterActive
    } = useEbuxContext();
    const lastSortedRef = useRef([]);
    const handleUpdate = (option, isChecked) => {
        let newBrands;
        if (isChecked) {
            newBrands = selectedFiltersWidget.selectedBrand.filter(
                (b) => b.value !== option.value
            );
        } else {
            newBrands = [...(selectedFiltersWidget.selectedBrand || []), option];
        }
        if (activeClientProject?.brandTreeSelect) {
            if (kpi === "SOS" || kpi === "OR") {
                updateSelectedKeywordBrandV2(newBrands);
            } else {
                updateSelectedBrandV2(newBrands);
            }
        } else {
            updateSelectedBrand(newBrands);
        }
        if(newBrands?.length==0){
            setIsWidgetFilterActive(false);
        }else{
            setIsWidgetFilterActive("brand");
        }
        
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            // Unselect visible items only
            newItems = selectedFiltersWidget.selectedBrand.filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            // Add all visible items, avoiding duplicates
            const uniqueItems = [
                ...selectedFiltersWidget.selectedBrand,
                ...options.filter(
                    (opt) =>
                        !selectedFiltersWidget.selectedBrand.some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }

        console.log('newItemsnewItems',newItems)
        if (activeClientProject?.brandTreeSelect) {
            if (kpi === "SOS" || kpi === "OR") {
                updateSelectedKeywordBrandV2(newItems);
            } else {
                updateSelectedBrandV2(newItems);
            }
        } else {
            updateSelectedBrand(newItems);
        }

        if(newItems?.length==0){
            setIsWidgetFilterActive(false);
        }else{
            setIsWidgetFilterActive("brand");
        }
    };

    // ✅ Filter + Sort brands
    const sortedBrands = useMemo(() => {
         if (isWidgetFilterActive == "brand" && lastSortedRef.current?.length) {
            return lastSortedRef.current;
        }
        const list = 
        isWidgetFilterActive?
                            Array.isArray(selectedFiltersWidget?.selectedBrand) ? selectedFiltersWidget.selectedBrand : []
                            :
                            Array.isArray(filters?.brand) ? filters.brand : [];

        const filteredList = searchTerm
            ? list.filter((b) =>
                b.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : list;

        const sorted =  [...filteredList].sort((a, b) => {
            const aChecked = selectedFiltersWidget.selectedBrand?.some(
                (sel) => sel.value === a.value
            );
            const bChecked = selectedFiltersWidget.selectedBrand?.some(
                (sel) => sel.value === b.value
            );
            if (aChecked === bChecked) return 0;
            return aChecked ? -1 : 1;
        });
        lastSortedRef.current = sorted;
        return sorted;
    }, [ searchTerm,selectedFiltersWidget?.selectedBrand,filters?.brand]);

    // ✅ Determine "Select All" checked state based on visible filtered items
    const allVisibleSelected =
        sortedBrands.length > 0 &&
        sortedBrands.every((opt) =>
            isOptionChecked("brand", opt, selectedFiltersWidget)
        );

    const someVisibleSelected =
        sortedBrands.some((opt) =>
            isOptionChecked("brand", opt, selectedFiltersWidget)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All"; 
    return (
        <>
            {sortedBrands?.length > 0 && (
                <div className="flex flex-col px-8 p-4 space-y-8">
                    <div className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-base">Brand</h3>
                            {sortedBrands?.length > 3 && (
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => handleToggle("brand")}
                                >
                                    {expanded["brand"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["brand"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                            {/* ✅ Select All applies only to filtered (visible) items */}
                                    <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded"
                                            // checked={isOptionChecked("Brand", filters?.brand, selectedFilters?.selectedBrand)}
                                            // onChange={() => {
                                            //     const allSelected = filters?.brand.every((opt) =>
                                            //         isOptionChecked('brand', opt, selectedFilters)
                                            //     );
                                            //     handleSelectAllUpdate(filters?.brand, allSelected);
                                            //     handleSelectAll('brand', filters?.brand);
                                            // }}
                                            checked={allVisibleSelected}
                                    ref={(input) => {
                                        if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                    }}
                                    onChange={() =>{
                                        handleSelectAllUpdate(sortedBrands, allVisibleSelected)
                                         handleSelectAll("brand", sortedBrands);
                                    }}
                                        />

                                        {selectAllLabel}
                                    </label>
                                
                                {sortedBrands?.map((option, i) => {

                                    const isChecked = isOptionChecked("brand", option, selectedFiltersWidget);
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
                                                            handleCheck("brand", option.value, isChecked); // keep drawer state in sync // true - false, false->
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

                        {sortedBrands?.length > 3 && (
                            <button
                                type="button"
                                className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                                onClick={() => handleToggle("brand")}
                            >
                                {expanded["brand"] ? "View Less" : "View More"}
                                <span className="ml-1">
                                    {expanded["brand"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default BrandCommonFilterComponent;