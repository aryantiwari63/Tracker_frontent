import React, { useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
// import { sortOptionsWithSelectedOnTop } from "./DrawerHelper";
// import { filter } from "lodash";
// import TreeCheckbox from "./nestedComponent/TreeCheckbox"

function KeywordFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        // kpi,
        filters,
        activeClientProject,
        selectedFiltersWidget,
        updateSelectedKeyword,
        updateSelectedKeywordV2
    } = useEbuxContext();
    // console.log('filtersfiltersfilters11', filters)

    const handleUpdate = (option, isChecked) => {
        let newProducts;
        // console.log('option.value',option.value)
        if (isChecked) {
            newProducts = selectedFiltersWidget.selectedKeyword.filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...(selectedFiltersWidget.selectedKeyword || []), option];
        }

        if (activeClientProject?.brandTreeSelect) {
            updateSelectedKeywordV2(newProducts);
        } else {
            updateSelectedKeyword(newProducts);
        }

    };


    const handleSelectAllUpdate = (options, allSelected) => {
        const newItems = allSelected ? [] : options;
        if (activeClientProject?.brandTreeSelect) {
            updateSelectedKeywordV2(newItems);
        } else {
            updateSelectedKeyword(newItems);
        }
    };

    const sortedProducts = useMemo(() => {
         console.log('keyword called')
        const list = Array.isArray(filters?.keyword) ? filters.keyword : [];
        // 1️⃣ Apply search filter first
        const filteredList = searchTerm
            ? list.filter((b) =>
                b.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : list;
        return [...filteredList].sort((a, b) => {
            const aChecked = selectedFiltersWidget?.selectedKeyword?.some((sel) => sel.value === a.value);
            const bChecked = selectedFiltersWidget?.selectedKeyword?.some((sel) => sel.value === b.value);
            if (aChecked === bChecked) return 0;
            return aChecked ? -1 : 1;
        });
        // }, [filters?.products, selectedFiltersWidget?.selectedProductId, searchTerm]);
       
    }, [searchTerm]);

    return (
        <>
            {sortedProducts?.length > 0 && (
                <div className="flex flex-col px-8 p-4 space-y-8">
                    {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                    <div className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-base">Keyword</h3>
                            {sortedProducts?.length > 3 && (
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => handleToggle("keyword")}
                                >
                                    {expanded["keyword"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["keyword"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                                {!searchTerm && (   // 🔹 HIGHLIGHTED
                                    <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded"
                                            // checked={isOptionChecked("products", filters?.products, selectedFiltersWidget?.selectedCategory)}
                                            // onChange={() => {
                                            //     const allSelected = filters?.products.every((opt) =>
                                            //         isOptionChecked("products", opt, selectedFiltersWidget)
                                            //     );
                                            //     handleSelectAllUpdate(filters?.products, allSelected);
                                            //     handleSelectAll("products", filters?.products);
                                            // }}

                                            checked={sortedProducts.every((opt) =>
                                                isOptionChecked("keyword", opt, selectedFiltersWidget)
                                            )}
                                            onChange={() => {
                                                const allSelected = sortedProducts.every((opt) =>
                                                    isOptionChecked("keyword", opt, selectedFiltersWidget)
                                                );
                                                handleSelectAllUpdate(sortedProducts, allSelected);
                                                handleSelectAll("keyword", sortedProducts);
                                            }}
                                        />
                                        Select All
                                    </label>
                                )} {/* 🔹 HIGHLIGHTED */}
                                {sortedProducts?.map((option, i) => {

                                    const isChecked = isOptionChecked("keyword", option, selectedFiltersWidget);
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
                                                            handleCheck("keyword", option.value, isChecked); // keep drawer state in sync
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

                        {sortedProducts?.length > 3 && (
                            <button
                                type="button"
                                className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                                onClick={() => handleToggle("keyword")}
                            >
                                {expanded["keyword"] ? "View Less" : "View More"}
                                <span className="ml-1">
                                    {expanded["keyword"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default KeywordFilterComponent;