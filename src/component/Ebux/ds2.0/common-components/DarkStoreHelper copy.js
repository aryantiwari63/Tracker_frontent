// src/helpers/tabChangeHandler.js

export const handleTabChange = ({
    newValue,
    filters,
    filtersDarkStore,
    initFitersLoadDarkStore,
    setSelected,
    setFiltersDarkStore,
    setSelectedFilters,
    setSelectedFiltersWidget,
    setHeaderFilterChips,
}) => {
    console.log('new chnage1', filters?.platform)
    console.log('new chnage2', filtersDarkStore?.platform)

    const resetValues = {
        // selectedPlatformPdp: [],
        // selectedPlatformKw: [],
        selectedBrand: [],
        selectedBrandPdp: [],
        selectedBrandKw: [],
        selectedBrandSOM: [],
        selectedCategory: [],
        selectedSubCategory: [],
        selectedProductId: [],
        selectedMotherPack: [],
        selectedLocation: [],
        selectedLocationPdp: [],
        selectedLocationKw: [],
        selectedDarkstore: [],
        selectedKeyword: [],
        selectedKeywordCategory: [],
        selectedKeywordType: [],
        selectedOSARemarks: [],
        selectCategory_som: [],
        selectCategory_node: [],
        selectedProduct_ppg: [],
    };
    if (newValue === "dark_store_analysis") {
        if (!filtersDarkStore?.platform || filtersDarkStore.platform.length === 0) {
            initFitersLoadDarkStore();
        } 
        // else {
        //     setSelectedFilters(prevFilters => ({
        //         ...prevFilters,
        //         selectedPlatform: filtersDarkStore?.platform,
        //     }));
        // }

        setSelectedFilters((prev) => ({
            ...prev,
            selectedPlatform: filtersDarkStore?.platform ?? [],
            ...resetValues,
        }));

        setSelectedFiltersWidget((prev) => ({
            ...prev,
            selectedPlatform: filtersDarkStore?.platform ?? [],
            ...resetValues,
        }));

    } else {
        setSelectedFilters((prev) => ({
            ...prev,
            selectedPlatform: filters?.platform ?? [],
            ...resetValues,
        }));

        setSelectedFiltersWidget((prev) => ({
            ...prev,
            selectedPlatform: filters?.platform ?? [],
            ...resetValues,
        }));
    }

    setSelected(newValue);
    setFiltersDarkStore(prevFilters => ({
        ...prevFilters,
        tab_type: newValue,
    }));
    setHeaderFilterChips({});
};
