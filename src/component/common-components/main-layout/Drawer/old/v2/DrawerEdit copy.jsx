import React, { useEffect, useMemo, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import BrandCommonFilterComponent from "./BrandFilterComponent";
import { useEbuxContext } from "../../../Ebux/Context/EbuxProvider";
import { sortOptionsWithSelectedOnTop } from "./DrawerHelper";
import TreeCheckbox from "./nestedComponent/TreeCheckbox"




function DrawerEdit({ onClose, defaultSelected }) {
    const { filters, selectedFilters, setHeaderFilterChips } = useEbuxContext();
    const [expanded, setExpanded] = useState({});
    const [checkedItems, setCheckedItems] = useState({});
    const [selectedLocation, setSelectedLocation] = useState([]);
    //eslint-disable-next-line
    const [checkedLocation, setCheckedLocation] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const mainLocationData = useMemo(() => {
        if (!filters?.location) return [];
        const regionMap = {};

        filters.location.forEach(cityItem => {
            cityItem.pincodes.forEach(pin => {
                const stateName = pin.state || pin.state_name || "Unknown State";
                const cityName = pin.city || cityItem.label || cityItem.lable;
                const cityValue = cityItem.value ?? cityName;

                const regionName = pin.region || "Unknown Region";
                // const regionValue = pin.region ?? regionName;

                const pincodeLabel = String(pin.label ?? pin.lable);
                const pincodeValue = pin.value ?? pincodeLabel;

                // ✅ Build Region → State → City → Pincode
                if (!regionMap[regionName]) {
                    regionMap[regionName] = {};
                }
                if (!regionMap[regionName][stateName]) {
                    regionMap[regionName][stateName] = {};
                }
                if (!regionMap[regionName][stateName][cityName]) {
                    regionMap[regionName][stateName][cityName] = {
                        value: cityValue,
                        pincodes: []
                    };
                }

                regionMap[regionName][stateName][cityName].pincodes.push({
                    label: pincodeLabel,
                    value: pincodeValue,
                    children: [] // ✅ no DarkStore info, keep empty
                });
            });
        });

        // ✅ Convert to tree format: Region → State → City → Pincode
        return Object.entries(regionMap).map(([regionName, states]) => ({
            label: regionName,
            value: regionName, // keep same
            children: Object.entries(states).map(([stateName, cities]) => ({
                label: stateName,
                value: stateName, // keep same
                children: Object.entries(cities).map(([cityName, cityObj]) => ({
                    label: cityName,
                    value: cityObj.value,
                    children: cityObj.pincodes
                }))
            }))
        }));
    }, [filters.location]);



    console.log("mainLocationData", { mainLocationData, "actual location": filters.location })




    const filterData = useMemo(() => {
        const rawData = Object.entries(filters)
            .map(([key, value]) => {
                if (!Array.isArray(value) || value.length === 0 || key === "unsubscribedPlatforms") {
                    return null;
                }
                return {
                    title: key.charAt(0).toUpperCase() + key.slice(1),
                    key: key,
                    // options: value.map((item) => ({
                    //     label: item.label || item.lable,
                    //     value: item.value,
                    // })),
                    options: value,
                    isObjectData: true,
                };
            })
            .filter(Boolean);

        if (!searchTerm) return rawData;

        return rawData
            .filter(({ key }) => key !== "locationPincode")
            .map(section => {
                // For location section, keep it as is during search
                if (section.key === "location") {
                    return section;
                }

                return {
                    ...section,
                    options: section.options.filter(option =>
                        option.label.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                };
            })
            .filter(section =>
                section.key === "location" || section.options.length > 0
            );
    }, [filters, searchTerm]);


    const filteredLocationData = useMemo(() => {
        if (!searchTerm) return mainLocationData;

        const filterTree = (nodes) => {
            return nodes
                .map(node => {
                    const filteredChildren = node.children ? filterTree(node.children) : [];
                    // console.log("filterData", filteredChildren)
                    // Check if current node matches OR any child matches
                    const nodeMatches = node.label.toLowerCase().includes(searchTerm.toLowerCase());
                    const childrenMatch = filteredChildren.length > 0;

                    // If node matches or has matching children, keep it
                    if (nodeMatches || childrenMatch) {
                        return {
                            ...node,
                            children: filteredChildren
                        };
                    }

                    return null;
                })
                .filter(Boolean);
        };

        return filterTree(mainLocationData);
    }, [mainLocationData, searchTerm]);

    // console.log({ filteredLocationData, filterData })


    const handleToggle = (section) => {
        setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCheck = (section, optionValue) => {
        setCheckedItems((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [optionValue]: !prev[section]?.[optionValue],
            },
        }));
    };
    // console.log('checkedItemsnew', checkedItems)
    const handleSelectAll = (section, options) => {
        // console.log('sectionsectionsection', section)
        setCheckedItems((prev) => {
            const allSelected = options.every((opt) => prev[section]?.[opt.value]);
            const newSelections = {};
            options.forEach((opt) => {
                newSelections[opt.value] = !allSelected;
            });
            return { ...prev, [section]: newSelections };
        });
    };

    const handleApply = () => {
        const selected = {};
        // console.log("filterDatafilterDatanew", filterData);
        filterData.forEach((section) => {
            const checked = checkedItems[section.key] || {};
            // console.log("checkeddata", section.key, checked);
            const chosen = section.options.filter((opt) => checked[opt.value]);
            // console.log("chosenchosen", chosen);
            if (chosen.length > 0) {
                selected[section.key] = chosen.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                }));
            }
        });
        if (selectedLocation.length > 0) {
            selected.location = selectedLocation;
        }

        // console.log("selectedsssssssss", selected);

        setHeaderFilterChips(selected);
        onClose();
    };


    const handleCancel = () => {
        setCheckedItems({});
        setHeaderFilterChips({});
        onClose();
    };

    useEffect(() => {
        // console.log('selectedFiltersselectedFiltersselectedFiltersselectedFilters', selectedFilters)
        // console.log('selectedFiltersselectedFiltersselectedFiltersselectedFiltersfilters', filters)
        if (defaultSelected) {
            const initialState = {};

            filterData.forEach((section) => {
                initialState[section.key] = {};

                section.options.forEach((opt) => {
                    const isSelected = defaultSelected[section.key]?.some(
                        (item) => item.value === opt.value
                    );

                    initialState[section.key][opt.value] = isSelected || false;
                });
            });

            setCheckedItems(initialState);

            if (defaultSelected.location) {
                const locationInitial = {};
                defaultSelected.location.forEach((loc) => {
                    locationInitial[loc.value] = true;
                });
                setSelectedLocation(defaultSelected.location);
                setCheckedLocation(locationInitial);
            }
        }
    }, [defaultSelected, filterData]);


    const trueCount = Object.values(defaultSelected).reduce((count, arr) => {
        return count + (Array.isArray(arr) ? arr.length : 0);
    }, 0);

    // console.log("defaultSelected", defaultSelected)
    console.log("filterDatacccc", filterData)
    // console.log("setCheckedItems", checkedItems)

    // 🔹 Custom order for sections
    const keyOrder = ["platform", "brand", "category", "mother_pack", "products", "osa_remarks"];

    const sortedFilterData = useMemo(() => {
        return filterData
            ?.filter(({ key }) => key !== "locationPincode")
            .sort((a, b) => {
                const aIndex = keyOrder.indexOf(a.key);
                const bIndex = keyOrder.indexOf(b.key);
                if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                if (aIndex !== -1) return -1;
                if (bIndex !== -1) return 1;
                return 0;
            });
    }, [filterData]);
    return (
        <div className="w-[400px] h-screen bg-white shadow-lg flex flex-col" role="presentation">
            <div className="flex-shrink-0">
                <div className="p-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex gap-2 items-center">
                        <RxCross2 size={20} className="cursor-pointer" onClick={onClose} />
                        <p className="font-semibold text-gray-900 text-lg">All Filters</p>
                    </div>
                    <div className="text-blue-500 font-medium">Applied <span>({trueCount})</span></div>
                </div>

            <div className="relative p-4 border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <RxCross2
                        size={18}
                        className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                        onClick={() => setSearchTerm("")}
                    />
                )}
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="h-[calc(100vh-64px)] flex flex-col">
                <div className="flex-1 overflow-y-auto px-8 p-4 space-y-8">
                    {/* {filterData?.filter(({ key }) => key !== "locationPincode").map((section, idx) => ( */}
                    {
                        // filterData
                        //     ?.filter(({ key }) => key !== "locationPincode")
                        //     .map((section, idx) => {
                        // 🔹 Sort category section so selected on top

                        sortedFilterData?.map((section, idx) => {
                            const sortedOptions =
                                section.key === "category"
                                    ? sortOptionsWithSelectedOnTop("category", section.options, selectedFilters)
                                    :
                                    section.key === "products"
                                        ? sortOptionsWithSelectedOnTop("products", section.options, selectedFilters)
                                        :
                                        section.key === "brand"
                                            ? sortOptionsWithSelectedOnTop("brand", section.options, selectedFilters)
                                            : section.options;

                                return (
                                    <div key={idx} className="border-b border-gray-100 pb-6 last:border-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 text-base">{section.title}</h3>
                                            {sortedOptions.length > 3 && (
                                                <button
                                                    type="button"
                                                    className="text-gray-500 hover:text-gray-700"
                                                    onClick={() => handleToggle(section.key)}
                                                >
                                                    {expanded[section.key] ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                                                </button>
                                            )}
                                        </div>

                                    {
                                        section.key == "location" ? filteredLocationData.length > 0 && <TreeCheckbox data={filteredLocationData} expanded={expanded[section.key]} onToggle={() => handleToggle(section.key)} onSelectionChange={(selected) => setSelectedLocation(selected)} defaultChecked={checkedLocation} />
                                            :
                                            <BrandCommonFilterComponent expanded={expanded}
                                                section={{ ...section, options: sortedOptions }}
                                                checkedItems={checkedItems} handleSelectAll={handleSelectAll} handleCheck={handleCheck} />
                                    }


                                        {section.key !== "location" && sortedOptions.length > 3 && (
                                            <button
                                                type="button"
                                                className="text-blue-500 text-sm font-medium mt-3 flex items-center"
                                                onClick={() => handleToggle(section.key)}
                                            >
                                                {expanded[section.key] ? "View Less" : "View More"}
                                                <span className="ml-1">
                                                    {expanded[section.key] ? <IoIosArrowUp size={16} /> : <IoIosArrowDown size={16} />}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </form>
            </div>
            <div className="flex-shrink-0 mt-auto p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleApply}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DrawerEdit;