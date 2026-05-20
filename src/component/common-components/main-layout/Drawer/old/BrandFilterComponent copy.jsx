import React from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "./DrawerHelper";

function BrandCommonFilterComponent({ expanded, section, handleSelectAll, handleCheck }) {
    // console.log('sectionsection222', section)
    const {
        kpi,
        // filters,
        activeClientProject,
        selectedFilters,
        updateSelectedBrand,
        updateSelectedBrandV2,
        updateSelectedKeywordBrandV2,
        updateSelectedKeywordCategoryV2,
        updateSelectedKeywordCategory,
        updatecategory_som,
        updateSelectedCategoryV2,
        updateSelectedCategory,
        updateSelectedLocation,
        updateSelectedProductV2,
        updateSelectedProduct
    } = useEbuxContext();
    // console.log('filtersfiltersfilters11', filters)
    
    const handleUpdate = (sectionKey, option, isChecked) => {
        // console.log('sectionKeysectionKey',sectionKey)
        // ✅ BRAND
        if (sectionKey === "brand") {
            let newBrands;
            if (isChecked) {
                newBrands = selectedFilters.selectedBrand.filter(
                    (b) => b.value !== option.value
                );
            } else {
                newBrands = [...(selectedFilters.selectedBrand || []), option];
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
        }

        // ✅ CATEGORY
        if (sectionKey === "category") {
            // --- Handle different KPI + project logic ---
            if (kpi === "SOS" || kpi === "OR") {
                // keyword category case
                let newKeywordCategories;
                if (isChecked) {
                    newKeywordCategories = selectedFilters.selectedKeywordCategory.filter(
                        (c) => c.value !== option.value
                    );
                } else {
                    newKeywordCategories = [
                        ...(selectedFilters.selectedKeywordCategory || []),
                        option,
                    ];
                }

                if (activeClientProject?.brandTreeSelect) {
                    updateSelectedKeywordCategoryV2(newKeywordCategories);
                } else {
                    updateSelectedKeywordCategory(newKeywordCategories);
                }
            }

            else if (kpi === "SOM") {
                // special SOM category case
                let newSomCategories;
                if (isChecked) {
                    newSomCategories = selectedFilters.selectCategory_som.filter(
                        (c) => c.value !== option.value
                    );
                } else {
                    newSomCategories = [
                        ...(selectedFilters.selectCategory_som || []),
                        option,
                    ];
                }
                updatecategory_som(newSomCategories);
            }

            else if (activeClientProject?.brandTreeSelect) {
                // tree select category
                let newCategories;
                if (isChecked) {
                    newCategories = selectedFilters.selectedCategory.filter(
                        (c) => c.value !== option.value
                    );
                } else {
                    newCategories = [...(selectedFilters.selectedCategory || []), option];
                }
                updateSelectedCategoryV2(newCategories);
            }

            else {
                // default category
                let newCategories;
                if (isChecked) {
                    newCategories = selectedFilters.selectedCategory.filter(
                        (c) => c.value !== option.value
                    );
                } else {
                    newCategories = [...(selectedFilters.selectedCategory || []), option];
                }

                updateSelectedCategory(newCategories);
            }
        }

         if (sectionKey === "products") {
        let newProducts;
        // console.log('option.value',option.value)
        if (isChecked) {
            newProducts = selectedFilters.selectedProductId.filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...(selectedFilters.selectedProductId || []), option];
        }

        if (kpi === "SOS" || kpi === "OR" || kpi === "SOM") { return; }

        if (activeClientProject?.brandTreeSelect) {
            if (activeClientProject?.client_project_id == 4) {
                // Perfetti special case
                updateSelectedProductV2(newProducts); 
            } else {
                updateSelectedProductV2(newProducts);
            }
        } else {
            updateSelectedProduct(newProducts);
        }
    }

        // ✅ LOCATION (generic)
        if (sectionKey === "location") {
            let newLocations;
            if (isChecked) {
                newLocations = selectedFilters.selectedLocation.filter(
                    (l) => l.value !== option.value
                );
            } else {
                newLocations = [...(selectedFilters.selectedLocation || []), option];
            }

            updateSelectedLocation(newLocations); // <- your actual updater
        }
    };


    const handleSelectAllUpdate = (sectionKey, options, allSelected) => {
        const newItems = allSelected ? [] : options;

        // 🔹 Special handling for brand
        if (sectionKey === "brand") {
            if (activeClientProject?.brandTreeSelect) {
                if (kpi === "SOS" || kpi === "OR") {
                    updateSelectedKeywordBrandV2(newItems);
                } else {
                    updateSelectedBrandV2(newItems);
                }
            } else {
                updateSelectedBrand(newItems);
            }
        }
        if (sectionKey === "category") {
            // --- Handle different KPI + project logic ---
            if (kpi === "SOS" || kpi === "OR") {
                if (activeClientProject?.brandTreeSelect) {
                    updateSelectedKeywordCategoryV2(newItems);
                } else {
                    updateSelectedKeywordCategory(newItems);
                }
            }

            else if (kpi === "SOM") {
                // special SOM category case

                updatecategory_som(newItems);
            }

            else if (activeClientProject?.brandTreeSelect) {

                updateSelectedCategoryV2(newItems);
            }

            else {

                updateSelectedCategory(newItems);
            }
        }

         if (sectionKey === "products") {
        if (kpi === "SOS" || kpi === "OR" || kpi === "SOM") {
            return; // skip product for these KPIs
        }

        if (activeClientProject?.brandTreeSelect) {
            if (activeClientProject?.client_project_id == 4) {
                updateSelectedProductV2(newItems);
            } else {
                updateSelectedProductV2(newItems);
            }
        } else {
            updateSelectedProduct(newItems);
        }
    }
    };
    return (
        <div className="space-y-2">
            <div
                className={`space-y-2 transition-all duration-300 ${expanded[section.key] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"
                    }`}
            >
                <label className="flex items-center font-bold gap-2 text-sm text-gray-700 cursor-pointer">

                    <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded"
                        checked={section.options.every((opt) => isOptionChecked(section.key, opt, selectedFilters))}
                        onChange={() => {
                            const allSelected = section.options.every((opt) =>
                                isOptionChecked(section.key, opt, selectedFilters)
                            );

                            handleSelectAllUpdate(section.key, section.options, allSelected);


                            // keep local state sync
                            handleSelectAll(section.key, section.options);
                        }}
                    />
                    Select All
                </label>


                {section?.options?.map((option, i) => {
                    const isChecked = isOptionChecked(section.key, option, selectedFilters);
                    return (
                        <div key={i} className="ml-0">
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded"
                                    checked={isChecked}
                                    onChange={() => {
                                        handleUpdate(section.key, option, isChecked); // 🔹 dynamic updater
                                        handleCheck(section.key, option.value); // keep drawer state in sync
                                    }}
                                />

                                {option.label}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BrandCommonFilterComponent;