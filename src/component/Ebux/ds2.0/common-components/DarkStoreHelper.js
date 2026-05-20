// src/helpers/tabChangeHandler.js

// import { getEbuxPlatforms } from "../../services/ebux.service";
import { getEbuxLocationsNew } from "../../services/ebux.service";

export const handleTabChange = async ({
    newValue,
    filters,
    filtersDarkStore,
    initFitersLoadDarkStore,
    setSelected,
    selectedFilters,
    setFiltersDarkStore,
    setSelectedFilters,
    selectedFiltersWidget,
    setSelectedFiltersWidget,
    isDarkstoreFilter,
    getDistinctFiltersDarkStoreFn,
    getCombineFilterWidget,
    setFilters,
    // setHeaderFilterChips,
    activeClientProject,
    getPincodesfromLocation
}) => {
    let isTabTypeChange;
    let oldValue;
    setSelected((old) => { oldValue = old; return newValue; });
    if (newValue === "dark_store_analysis") {
        isTabTypeChange = false
        if (!filtersDarkStore?.platform || filtersDarkStore.platform.length === 0) {
            await initFitersLoadDarkStore();
        }
        await getDistinctFiltersDarkStoreFn('platform', selectedFiltersWidget?.selectedPlatform)

        if (filtersDarkStore?.platform == undefined) return;
        let res = filtersDarkStore?.platform?.filter((opt) => {
            const match = selectedFilters?.selectedPlatform?.some((b) => b.value === opt.value);
            return match;
        });
        console.log('call ds pdp isDarkstoreFilter', isDarkstoreFilter)
        if (isDarkstoreFilter == 'pdp') {
            console.log('call ds pdp')
            setSelectedFiltersWidget((prev) => ({
                ...prev,
                selectedPlatform: selectedFilters?.selectedPlatform ?? [],
            }));
        } else if (isDarkstoreFilter == 'darkstore') {
            console.log('ssssssss')
        } else {
            console.log('call ds')
            setSelectedFilters((prev) => ({
                ...prev,
                selectedPlatform: res ?? [],
            }));

            setSelectedFiltersWidget((prev) => ({
                ...prev,
                selectedPlatform: [],
            }));
        }


    } else if (oldValue === "dark_store_analysis") {
        if ([2, 11, 105]?.indexOf(activeClientProject?.client_project_id) > -1 || activeClientProject?.useCombineFilter) {
            isTabTypeChange = true
            let combineFilterWidget;
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };

                combineFilterWidget = await getCombineFilterWidget('OSA', (selectedFiltersWidget?.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget?.selectedBrand?.map(i => i.value) ?? []), (selectedFiltersWidget?.selectedCategory?.map(i => i.value) ?? []), (selectedFiltersWidget?.selectedMotherPack?.map(i => i.value) ?? []), (selectedFiltersWidget?.selectedProductId?.map(i => i.value) ?? []), (selectedFilters?.selectedMsl ?? "all"), [], dateRangeData)
            } else {
                combineFilterWidget = await getCombineFilterWidget('OSA', (selectedFiltersWidget?.selectedPlatform?.map(i => i.value) ?? []), (selectedFiltersWidget?.selectedBrand?.map(i => i.value) ?? []), (selectedFiltersWidget?.selectedCategory?.map(i => i.value) ?? []), (selectedFiltersWidget?.selectedMotherPack?.map(i => i.value) ?? []), (selectedFiltersWidget?.selectedProductId?.map(i => i.value) ?? []))
            }

            let locationPlatform;
            if (activeClientProject?.isFilterDateWise) {
                const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
                locationPlatform = await getEbuxLocationsNew('OSA', (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
            } else {
                locationPlatform = await getEbuxLocationsNew('OSA', (selectedFiltersWidget.selectedPlatform?.map(i => i.value) ?? []), (selectedFilters?.active_location_status));
            }
            let pincodePlatform = getPincodesfromLocation(locationPlatform);
            setFilters(prevFilters => ({
                ...prevFilters,
                platform: combineFilterWidget?.platforms ?? [],
                brand: combineFilterWidget?.brands ?? [],
                category: combineFilterWidget?.categories ?? [],
                mother_pack: combineFilterWidget?.mother_packs ?? [],
                products: combineFilterWidget?.products ?? [],

                location: locationPlatform ?? [],
                locationPincode: pincodePlatform ?? [],
            }));
            console.log('call ds pdp sssssssss', isDarkstoreFilter)
            if (isDarkstoreFilter == 'darkstore') {
                setSelectedFiltersWidget((prev) => ({
                    ...prev,
                    selectedPlatform: selectedFilters?.selectedPlatform ?? [],
                }));
            } else if (isDarkstoreFilter == 'pdp') {
                console.log('ssssssss')
            } else {
                setSelectedFilters((prev) => ({
                    ...prev,
                    selectedPlatform: filters?.platform ?? [],
                }));

                setSelectedFiltersWidget((prev) => ({
                    ...prev,
                    selectedPlatform: [],
                }));
            }
        }
        // if ([11]?.indexOf(activeClientProject?.client_project_id) > -1) {
        //     let combineFilterWidget = await getEbuxPlatforms("OSA", []);
        //     setFilters(prevFilters => ({
        //         ...prevFilters,
        //         platform: combineFilterWidget ?? [],
        //     }));
        //     // setSelectedFilters((prev) => ({
        //     //     ...prev,
        //     //     selectedPlatform: combineFilterWidget ?? [],
        //     // }));

        //     if (isDarkstoreFilter == 'darkstore') {
        //         setSelectedFiltersWidget((prev) => ({
        //             ...prev,
        //             selectedPlatform: selectedFilters?.selectedPlatform ?? [],
        //         }));
        //     } else {
        //         setSelectedFilters((prev) => ({
        //             ...prev,
        //             selectedPlatform: combineFilterWidget ?? [],
        //         }));

        //         setSelectedFiltersWidget((prev) => ({
        //             ...prev,
        //             selectedPlatform: combineFilterWidget ?? [],
        //         }));
        //     }
        //     // setSelectedFiltersWidget((prev) => ({
        //     //     ...prev,
        //     //     selectedPlatform: [],
        //     // }));
        // }

    }


    setFiltersDarkStore(prevFilters => ({
        ...prevFilters,
        tab_type: newValue,
        isTabTypeChange
    }));

};
