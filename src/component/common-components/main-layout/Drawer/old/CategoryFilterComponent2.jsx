import React, { useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
// import { sortOptionsWithSelectedOnTop } from "./DrawerHelper";
// import { filter } from "lodash";
// import TreeCheckbox from "./nestedComponent/TreeCheckbox"

function CategoryFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        kpi,
        filters,
        activeClientProject,
        // selectedFilters,
        selectedFiltersWidget,
        updateSelectedKeywordCategoryV2,
        updateSelectedKeywordCategory,
        updatecategory_som,
        updateSelectedCategoryV2,
        updateSelectedCategory,
    } = useEbuxContext();

    const handleUpdate = (option, isChecked) => {
        if (kpi === "SOS" || kpi === "OR") {
            // keyword category case
            let newKeywordCategories;
            if (isChecked) {
                newKeywordCategories = selectedFiltersWidget.selectedKeywordCategory.filter(
                    (c) => c.value !== option.value
                );
            } else {
                newKeywordCategories = [
                    ...(selectedFiltersWidget.selectedKeywordCategory || []),
                    option,
                ];
            }

            if (activeClientProject?.brandTreeSelect) {
                updateSelectedKeywordCategoryV2(newKeywordCategories);
            } else {
                // console.log('newKeywordCategoriesnewKeywordCategories', newKeywordCategories)
                updateSelectedKeywordCategory(newKeywordCategories);
            }
        }

        else if (kpi === "SOM") {
            // special SOM category case
            let newSomCategories;
            if (isChecked) {
                newSomCategories = selectedFiltersWidget.selectCategory_som.filter(
                    (c) => c.value !== option.value
                );
            } else {
                newSomCategories = [
                    ...(selectedFiltersWidget.selectCategory_som || []),
                    option,
                ];
            }
            updatecategory_som(newSomCategories);
        }
        else if (activeClientProject?.brandTreeSelect) {
            // tree select category
            let newCategories;
            if (isChecked) {
                newCategories = selectedFiltersWidget.selectedCategory.filter(
                    (c) => c.value !== option.value
                );
            } else {
                newCategories = [...(selectedFiltersWidget.selectedCategory || []), option];
            }
            updateSelectedCategoryV2(newCategories);
        }
        else {
            // default category
            let newCategories;
            if (isChecked) {
                newCategories = selectedFiltersWidget.selectedCategory.filter(
                    (c) => c.value !== option.value
                );
            } else {
                newCategories = [...(selectedFiltersWidget.selectedCategory || []), option];
            }
            updateSelectedCategory(newCategories);
        }

    };


    const handleSelectAllUpdate = (options, allSelected) => {
        const newItems = allSelected ? [] : options;
        if (kpi === "SOS" || kpi === "OR") {
            if (activeClientProject?.brandTreeSelect) {
                updateSelectedKeywordCategoryV2(newItems);
            } else {
                updateSelectedKeywordCategory(newItems);
            }
        }
        else if (kpi === "SOM") {
            updatecategory_som(newItems);
        }
        else if (activeClientProject?.brandTreeSelect) {
            updateSelectedCategoryV2(newItems);
        }
        else {
            updateSelectedCategory(newItems);
        }
    };

    // ✅ Sort categories: selected first
    const sortedCategories = useMemo(() => {
        const list = (kpi == "SOS" || kpi == "OR") ?
            Array.isArray(filters?.keywordCategory) ? filters.keywordCategory : []
            :
            Array.isArray(filters?.category) ? filters.category : [];
        // 1️⃣ Apply search filter first
        const filteredList = searchTerm
            ? list.filter((b) =>
                b.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : list;
        // if (!filters?.category) return [];
        return [...filteredList].sort((a, b) => {
            const aChecked = selectedFiltersWidget.selectedCategory?.some((sel) => sel.value === a.value);
            const bChecked = selectedFiltersWidget.selectedCategory?.some((sel) => sel.value === b.value);
            if (aChecked === bChecked) return 0;
            return aChecked ? -1 : 1;
        });
        // }, [filters?.category, selectedFiltersWidget.selectedCategory, searchTerm]);
    }, [searchTerm]);
    return (
        <>
            {sortedCategories?.length > 0 && (
                <div className="flex flex-col px-8 p-4 space-y-8">
                    {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                    <div className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-base">Category</h3>
                            {sortedCategories?.length > 3 && (
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => handleToggle("category")}
                                >
                                    {expanded["category"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["category"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                                {!searchTerm && (   // 🔹 HIGHLIGHTED
                                    <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded"
                                            // checked={isOptionChecked("category", filters?.category, selectedFilters?.selectedCategory)}
                                            // onChange={() => {
                                            //     const allSelected = filters?.category.every((opt) =>
                                            //         isOptionChecked("category", opt, selectedFilters)
                                            //     );
                                            //     handleSelectAllUpdate(filters?.category, allSelected);
                                            //     handleSelectAll("category", filters?.category);
                                            // }}

                                            checked={sortedCategories.every((opt) =>
                                                isOptionChecked("category", opt, selectedFiltersWidget, kpi)
                                            )}
                                            onChange={() => {
                                                const allSelected = sortedCategories.every((opt) =>
                                                    isOptionChecked("category", opt, selectedFiltersWidget, kpi)
                                                );
                                                handleSelectAllUpdate(sortedCategories, allSelected);
                                                handleSelectAll((kpi === "SOS" || kpi === "OR"?"keywordCategory":"category"), sortedCategories);
                                            }}
                                        />
                                        Select All
                                    </label>
                                )} {/* 🔹 HIGHLIGHTED */}
                                {sortedCategories?.map((option, i) => {

                                    const isChecked = isOptionChecked("category", option, selectedFiltersWidget, kpi);
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
                                                            handleCheck((kpi === "SOS" || kpi === "OR"?"keywordCategory":"category"), option.value, isChecked); // keep drawer state in sync
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

                        {sortedCategories?.length > 3 && (
                            <button
                                type="button"
                                className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                                onClick={() => handleToggle("category")}
                            >
                                {expanded["category"] ? "View Less" : "View More"}
                                <span className="ml-1">
                                    {expanded["category"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default CategoryFilterComponent;