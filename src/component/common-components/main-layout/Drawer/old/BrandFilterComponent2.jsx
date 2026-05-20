import React, { useMemo } from "react";
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
    } = useEbuxContext();
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
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        const newItems = allSelected ? [] : options;
        if (activeClientProject?.brandTreeSelect) {
            if (kpi === "SOS" || kpi === "OR") {
                updateSelectedKeywordBrandV2(newItems);
            } else {
                updateSelectedBrandV2(newItems);
            }
        } else {
            updateSelectedBrand(newItems);
        }
    };

    // ✅ Sort brands with selected ones first
    const sortedBrands = useMemo(() => {
        const list = Array.isArray(filters?.brand) ? filters.brand : [];

        // 1️⃣ Apply search filter first
        const filteredList = searchTerm
            ? list.filter((b) =>
                b.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : list;

        // 2️⃣ Then sort with selected first
        return [...filteredList].sort((a, b) => {
            const aChecked = selectedFiltersWidget.selectedBrand?.some(
                (sel) => sel.value === a.value
            );
            const bChecked = selectedFiltersWidget.selectedBrand?.some(
                (sel) => sel.value === b.value
            );
            if (aChecked === bChecked) return 0; // same → keep order
            return aChecked ? -1 : 1; // selected first
        });
        // }, [filters?.brand, selectedFiltersWidget.selectedBrand, searchTerm]);
    }, [searchTerm]);


    return (
        <>
            {sortedBrands?.length > 0 && (
                <div className="flex flex-col px-8 p-4 space-y-8">
                    {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
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
                                {!searchTerm && (   // 🔹 HIGHLIGHTED
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
                                            checked={sortedBrands.every((opt) =>
                                                isOptionChecked("brand", opt, selectedFiltersWidget)
                                            )}
                                            onChange={() => {
                                                const allSelected = sortedBrands.every((opt) =>
                                                    isOptionChecked("brand", opt, selectedFiltersWidget)
                                                );
                                                handleSelectAllUpdate(sortedBrands, allSelected);
                                                handleSelectAll("brand", sortedBrands);
                                            }}
                                        />

                                        Select All
                                    </label>
                                )} {/* 🔹 HIGHLIGHTED */}
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