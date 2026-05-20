import React, { useMemo, useRef } from "react";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { isOptionChecked } from "./DrawerHelper";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
// import { sortOptionsWithSelectedOnTop } from "./DrawerHelper";
// import { filter } from "lodash";
// import TreeCheckbox from "./nestedComponent/TreeCheckbox"

function ProductFilterComponent({ expanded, handleToggle, handleSelectAll,
    handleCheck, searchTerm
}) {
    // console.log('sectionsection222', section)
    const {
        kpi,
        filters,
        activeClientProject,
        selectedFiltersWidget,
        updateSelectedProductV2,
        updateSelectedProduct,
        selectedMsl,
        updateSelectedMSLV2,
        isWidgetFilterActive,
        setIsWidgetFilterActive
    } = useEbuxContext();
    // console.log('filtersfiltersfilters11', filters)
const lastSortedRef = useRef([]);
    const handleUpdate = (option, isChecked) => {
        let newProducts;
        console.log('option.value',option.value)
        if (isChecked) {
            newProducts = selectedFiltersWidget.selectedProductId.filter(
                (p) => p.value !== option.value
            );
        } else {
            newProducts = [...(selectedFiltersWidget.selectedProductId || []), option];
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

        if(newProducts?.length==0){
            setIsWidgetFilterActive(false);
        }else{
            setIsWidgetFilterActive("products");
        }

    };


    const handleSelectAllUpdate = (options, allSelected) => {
        let newItems = [];

        if (allSelected) {
            // Unselect visible items only
            newItems = selectedFiltersWidget.selectedProductId.filter(
                (b) => !options.some((opt) => opt.value === b.value)
            );
        } else {
            // Add all visible items, avoiding duplicates
            const uniqueItems = [
                ...selectedFiltersWidget.selectedProductId,
                ...options.filter(
                    (opt) =>
                        !selectedFiltersWidget.selectedProductId.some(
                            (sel) => sel.value === opt.value
                        )
                ),
            ];
            newItems = uniqueItems;
        }
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

         if(newItems?.length==0){
            setIsWidgetFilterActive(false);
        }else{
            setIsWidgetFilterActive("products");
        }
    };

    const sortedProducts = useMemo(() => {
         if (isWidgetFilterActive == "products" && lastSortedRef.current?.length) {
            return lastSortedRef.current;
        }

        const list = isWidgetFilterActive ?
                                        Array.isArray(selectedFiltersWidget?.selectedProductId) ? selectedFiltersWidget.selectedProductId : []
                                        : Array.isArray(filters?.products) ? filters.products : [];
        // 1️⃣ Apply search filter first
        const filteredList = searchTerm
            ? list.filter((b) =>{
                // b.label.toLowerCase().includes(searchTerm.toLowerCase())
                const search = searchTerm.toLowerCase();
                const labelMatch = b.label?.toLowerCase()?.includes(search);
                const webPidMatch = b.web_pid?.toString()?.toLowerCase()?.includes(search);
                return labelMatch || webPidMatch;
            } )
            : list;
        const sorted =  [...filteredList].sort((a, b) => {
            const aChecked = selectedFiltersWidget?.selectedProductId?.some((sel) => sel.value === a.value);
            const bChecked = selectedFiltersWidget?.selectedProductId?.some((sel) => sel.value === b.value);
            if (aChecked === bChecked) return 0;
            return aChecked ? -1 : 1;
        });

        lastSortedRef.current = sorted;
        return sorted;
        // }, [filters?.products, selectedFiltersWidget?.selectedProductId, searchTerm]);
    }, [searchTerm,filters?.products,selectedFiltersWidget?.selectedProductId]);
    // const [selected, setSelected] = useState("all");

    // const handleChange = (event) => {
    //     const value = event.target.value;
    //     setSelected(value);
    // };


    const handleChange = (event) => {
        const value = event.target.value;
        console.log('valuemsl',value)
        updateSelectedMSLV2(value);  // 🔹 update globally
    };

    const allVisibleSelected =
    sortedProducts.length > 0 &&
    sortedProducts.every((opt) =>
        isOptionChecked("products", opt, selectedFiltersWidget)
    );

const someVisibleSelected =
    sortedProducts.some((opt) =>
        isOptionChecked("products", opt, selectedFiltersWidget)
    );

    const selectAllLabel = allVisibleSelected ? "Clear All" : "Select All"; 
    return (
        <>
            {(sortedProducts?.length > 0 || !searchTerm||!searchTerm?.length) && (
                <div className="flex flex-col px-8 p-4 space-y-8">
                    {/* <div className=" overflow-y-auto px-8 p-4 space-y-8"> */}
                    <div className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center justify-between w-[90%]">
                                <h3 className="font-semibold text-gray-900 text-base">Product</h3>
                                {
                                    activeClientProject?.useMsl && (
                                        <div className="flex items-center space-x-4">
                                            <RadioGroup
                                                row
                                                value={selectedMsl}   // 🔹 bind global state
                                                onChange={handleChange}
                                                className="flex items-center text-xs"
                                            >
                                                <FormControlLabel
                                                    value="all"
                                                    control={
                                                        <Radio
                                                            color="primary"
                                                            sx={{
                                                                transform: "scale(0.6)", // smaller radio
                                                                padding: "0px",
                                                            }}
                                                        />
                                                    }
                                                    disabled={[101,102].includes(activeClientProject?.client_project_id)}
                                                    label="All"
                                                    slotProps={{
                                                        typography: {
                                                            className: `!text-[12px] ${selectedMsl === "all" ? "font-bold text-blue-600" : ""}`,
                                                        },
                                                    }}
                                                />
                                                <FormControlLabel
                                                    value="msl"
                                                    control={
                                                        <Radio
                                                            color="primary"
                                                            sx={{
                                                                transform: "scale(0.6)",
                                                                padding: "0px",
                                                            }}
                                                        />
                                                    }
                                                    disabled={[101,102].includes(activeClientProject?.client_project_id)}
                                                    label="MSL"
                                                    slotProps={{
                                                        typography: {
                                                            className: `!text-[12px] ${selectedMsl === "msl" ? "font-bold text-blue-600 " : ""}`,
                                                        },
                                                    }}
                                                />
                                            </RadioGroup>
                                        </div>
                                    )
                                }

                            </div>
                            {sortedProducts?.length > 3 && (
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => handleToggle("products")}
                                >
                                    {expanded["products"] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className={`space-y-2 transition-all duration-300 ${expanded["products"] ? "max-h-60 overflow-y-auto pr-2" : "max-h-[102px] overflow-hidden"}`} >
                               
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

                                            checked={allVisibleSelected}
                                            ref={(input) => {
                                                if (input) input.indeterminate = !allVisibleSelected && someVisibleSelected;
                                            }}
                                            onChange={() => {
                                                handleSelectAllUpdate(sortedProducts, allVisibleSelected)
                                                handleSelectAll("products", sortedProducts);
                                            }}
                                        />
                                        {selectAllLabel}
                                    </label>


                                {sortedProducts?.map((option, i) => {

                                    const isChecked = isOptionChecked("products", option, selectedFiltersWidget);
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
                                                            handleCheck("products", option.value, isChecked); // keep drawer state in sync
                                                        }}
                                                    />
                                                </span>

                                                {option.label} | {option?.web_pid}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {sortedProducts?.length > 1 && (
                            <button
                                type="button"
                                className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                                onClick={() => handleToggle("products")}
                            >
                                {expanded["products"] ? "View Less" : "View More"}
                                <span className="ml-1">
                                    {expanded["products"] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductFilterComponent;