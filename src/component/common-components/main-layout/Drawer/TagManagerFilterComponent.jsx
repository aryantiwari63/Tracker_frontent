import React, { useState, useEffect, useMemo } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { escapeRegExp } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { isEqual } from "lodash";
import { getCombineFilterWidget } from "../../../Ebux/services/ebux.service";

function TagManagerFilterComponent({ expanded, handleToggle, handleSelectAll, handleCheck, searchTerm }) {
    const {
        kpi,
        tagList, selectedFilters,
        activeClientProject,
        selectedFiltersWidget,
        updateSelectedFilters,
        selectedMsl,
        // updateSelectedMSLV2,

        setSelectedFiltersWidget,
        setFilters,
        // setSelectedMsl
    } = useEbuxContext();

    const [productSearch, setProductSearch] = useState("");
    const [localSelectedProducts, setLocalSelectedProducts] = useState(
        selectedFiltersWidget?.selectedTags ? [...selectedFiltersWidget.selectedTags] : []
    );

    useEffect(() => {
        setLocalSelectedProducts(
            selectedFiltersWidget?.selectedTags ? [...selectedFiltersWidget.selectedTags] : []
        );
    }, [selectedFiltersWidget?.selectedTags]);


    const handleUpdate = (option, isChecked) => {
        let newProducts;
        // console.log('option.value', option.value)
        if (isChecked) {
            newProducts = (localSelectedProducts || []).filter(
                // (p) => p.value !== option.value
                (p) => p.id !== option.id
            );
        } else {
            newProducts = [...((localSelectedProducts || []) || []), option];
        }

        if (kpi === "SOS" || kpi === "OR" || kpi === "SOM") { return; }

        // updateSelectedFilters("selectedTags", newProducts);
        setLocalSelectedProducts(newProducts);
    };

    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];
        if (allSelected) {
            newItems = (localSelectedProducts || []).filter(
                (b) => !options.some((opt) => opt.id === b.id)
            );
        } else {
            const uniqueItems = [
                ...(localSelectedProducts || []),
                ...options.filter(
                    (opt) =>
                        !(localSelectedProducts || []).some(
                            (sel) => sel.id === opt.id
                        )
                ),
            ];
            newItems = uniqueItems;
        }
        if (kpi === "SOS" || kpi === "OR" || kpi === "SOM") {
            return;
        }
        // updateSelectedFilters("selectedTags", newItems);
        setLocalSelectedProducts(newItems);
    };

    const handleClearAll = () => {
        setLocalSelectedProducts([]);
        if (typeof handleSelectAll === "function") {
            handleSelectAll("tags", []);
        }
    };

    const handleApplyClick = async () => {
        const current = localSelectedProducts || [];
        console.log('dsdsddssdssd', selectedFiltersWidget?.selectedTags, current)
        if (isEqual(JSON.stringify(selectedFiltersWidget?.selectedTags), JSON.stringify(current))) {
            return;
        }


        if ([2, 101, 102, 103].indexOf(activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) {
            const tagSkuList = current?.flatMap(tag => tag?.tag_details?.map(d => d?.sku_or_keyword) ?? []) ?? [];
            let combineFilterWidget;
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []), selectedMsl, tagSkuList, dateRangeData);
            } else {
                combineFilterWidget = await getCombineFilterWidget("OSA", (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedBrand?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedCategory?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedMotherPack?.map(i => i.value) ?? []), (selectedFiltersWidget.selectedProductId?.map(i => i.value) ?? []), selectedMsl, tagSkuList);
            }
            setFilters(prevFilters => ({
                ...prevFilters,
                platform: combineFilterWidget?.platforms ?? [],
                brand: combineFilterWidget?.brands ?? [],
                category: combineFilterWidget?.categories ?? [],
                mother_pack: combineFilterWidget?.mother_packs ?? [],
                products: combineFilterWidget?.products ?? [],
            }));

            setSelectedFiltersWidget(prevFilters => ({
                ...prevFilters,
                selectedTags: current ?? [],
            }));
            updateSelectedFilters("selectedTags", current);
        }


        if (typeof handleCheck === "function") {
            const allProducts = Array.isArray(tagList) ? tagList : [];
            allProducts.forEach((p) => {
                const isChecked = current.some((c) => c.id === p.id);
                handleCheck("tags", p.id, !isChecked);
            });
        }
    };


    const sortedProducts = useMemo(() => {
        let rawList = Array.isArray(tagList) ? tagList : [];
        rawList = rawList.filter(item => item?.tag_type === "Product");

        const searchInput = (productSearch || searchTerm || "").trim();
        if (!searchInput) return rawList;

        const safe = escapeRegExp(searchInput);
        const regex = new RegExp(safe, "i");
        const filteredList = rawList.filter((item) => {
            const labelMatch = regex.test(item.tag_name || "");
            // const pidMatch = regex.test(String(item.web_pid || ""));
            // const cpCodeMatch = regex.test(String(item?.["cp code"] || ""));
            // return labelMatch || pidMatch || cpCodeMatch;
            return labelMatch
        });

        const selectedValues = (localSelectedProducts || []).map((p) => p.id);
        const sortedList = [...filteredList].sort((a, b) => {
            const aSelected = selectedValues.includes(a.id);
            const bSelected = selectedValues.includes(b.id);
            if (aSelected === bSelected) return 0;
            return aSelected ? -1 : 1;
        });

        return sortedList;
    }, [tagList, productSearch, searchTerm, localSelectedProducts]);



    const allVisibleSelected =
        sortedProducts.length > 0 &&
        sortedProducts.every((opt) =>
            (localSelectedProducts || []).some((sel) => sel.id === opt.id)
        );

    const someVisibleSelected =
        sortedProducts.some((opt) =>
            (localSelectedProducts || []).some((sel) => sel.id === opt.id)
        );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All";
    const showNoResults = sortedProducts.length === 0 && (productSearch?.trim() || searchTerm?.trim());
    return (
        <>

            <div className="flex flex-col px-8 p-4 space-y-8">
                <div className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center justify-between w-[90%]">
                            <h3 className="flex font-semibold text-gray-900 text-base">Product Tags
                                {
                                    selectedFiltersWidget?.selectedTags?.length > 0 ?
                                        <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-[#F0F0F0]">{selectedFiltersWidget?.selectedTags.length}</span>
                                        : <></>
                                }
                            </h3>

                        </div>
                        {sortedProducts?.length > 3 && (
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => handleToggle("tags")}
                            >
                                {expanded["tags"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products tags..."
                            className="w-[70%] px-[9px] py-[2px] pr-[24px] mb-[6px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                        />
                        {productSearch && (
                            <RxCross2
                                size={18}
                                className="absolute right-[6.4rem] top-[45%] -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                                onClick={() => setProductSearch("")}
                            />
                        )}
                    </div>
                    {(sortedProducts?.length > 0) && (
                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["tags"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >

                                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                        checked={allVisibleSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                        }}
                                        onChange={() => {
                                            handleSelectAllUpdate(sortedProducts, allVisibleSelected)
                                        }}
                                    />
                                    {selectAllLabel}
                                </label>


                                {sortedProducts?.map((option, i) => {
                                    const isChecked = (localSelectedProducts || []).some((sel) => sel.id === option.id);
                                    return (
                                        <div key={i} className="ml-0">
                                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                                <span>
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            handleUpdate(option, isChecked);
                                                            handleCheck("tags", option.id, isChecked);
                                                        }}
                                                    />
                                                </span>

                                                {option.tag_name}


                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {showNoResults && (
                        <div className="px-8 p-4 text-sm text-gray-500">
                            No tags found...
                        </div>
                    )}
                    <div className="flex justify-between relative top-[8px]">
                        <button
                            type="button"
                            className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                            onClick={() => handleToggle("tags")}
                        >
                            {expanded["tags"] ? "View Less" : "View More"}
                            <span className="ml-1">
                                {expanded["tags"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                            </span>
                        </button>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                className="px-2 py-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                onClick={handleClearAll}
                            >
                                Clear All
                            </button>

                            <button
                                type="button"
                                className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={handleApplyClick}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default TagManagerFilterComponent;