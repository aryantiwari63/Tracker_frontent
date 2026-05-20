import React from "react";

import { arrowIcon, calenderIcon } from '../utils/icons';
import DateRangeQuarterWeekPicker from "./DateRangeQuarterWeekPicker";
import { useState } from "react";
import moment from "moment";
import { useEbuxContext } from "../../../../Ebux/Context/EbuxProvider";
import { useMemo } from "react";
import { getCombineFilterWidget, getDistinctFiltersDarkStore, getEbuxDarkstoreLocation, getEbuxLocationsNew, getEbuxLocationsNewDarkStore, getStoreDataIdDarkStore, } from "../../../../Ebux/services/ebux.service";
const DateRangeCard = ({
  isCurrent = true,
  start = "23/07/25",
  end = "23/07/25",
  onClick = () => { }
}) => {
  return (
    <div onClick={() => onClick()} className="cursor-pointer border border-gray-300 rounded-lg shadow-sm bg-white px-6 pt-3 pb-1 leading-none inline-block relative">
      <div className="flex items-center gap-1  absolute -top-[12px] left-1 bg-white p-1 rounded-full ">
        {calenderIcon}
        <span className="text-sm font-semibold text-gray-800">{isCurrent ? "Current" : "Compare"} Date Range</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        {start}
        <span className="mx-1 text-gray-500">
          {arrowIcon}
        </span>
        {end}
      </div>
    </div>
  );
}

export default function HeaderWeekPicker({ compareModeOn = true, isFilterDateWise = false }) {
  const {
    kpi,
    selectedFilters, setSelectedFilters, activeClientProject
    // , selectedFiltersWidget
    , setSelectedFiltersWidget,
    setFilters, setFiltersDarkStore,
    selectedMsl, setEbuxLoading,
    getPincodesfromLocation,
    getDarkstorefromDarkstoreLocation,
    setTempFilterData,
    setErrorToSetFilterData,

    setMainApiResponse
  } = useEbuxContext();

  const [displayDateRangePicker, setDisplayDateRangePicker] = useState({ open: false, type: null });
  const dateRange = useMemo(() => {
    return selectedFilters?.selectedWeeks?.current;
  }, [JSON.stringify(selectedFilters?.selectedWeeks?.current)]);

  const compareDateRange = useMemo(() => {
    return selectedFilters?.selectedWeeks?.compare;
  }, [JSON.stringify(selectedFilters?.selectedWeeks?.compare)]);

  const onClickDateRangeCard = () => {
    setDisplayDateRangePicker({ open: true, type: "current" });
  };
  const onClickPreviousDateRangeCard = () => {
    setDisplayDateRangePicker({ open: true, type: "compare" });
  };
  const onClose = () => {
    setDisplayDateRangePicker({ open: false, type: null });
  }
  const setDateRange = async (weeks) => {
    if (isFilterDateWise && ["SOS", "OR", "SOM"]?.indexOf(kpi) == -1) {
      onClose();
      setEbuxLoading(true);
      try {
        const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: { ...selectedFilters?.selectedWeeks, [(displayDateRangePicker?.type ?? "current")]: [...weeks], ...(compareModeOn == false ? { isCompareToPrevious: false } : {}) } };
        let apiResponse = {}, errorData = {};

        let combineFilterWidget = await getCombineFilterWidget(
          "OSA",
          [],
          [],
          [],
          [],
          [],
          selectedMsl,
          [],
          dateRangeData
        );
        apiResponse.res_platform_pdp = combineFilterWidget?.platforms ?? [];
        apiResponse.res_brand_pdp = combineFilterWidget?.brands ?? [];
        apiResponse.res_category = combineFilterWidget?.categories ?? [];
        apiResponse.res_mother_pack = combineFilterWidget?.mother_packs ?? [];
        apiResponse.res_products = combineFilterWidget?.products ?? [];

        // apiResponse.res_location_new_pdp = await getEbuxLocationsNew("OSA", (apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
        apiResponse.res_location_new_pdp = await getEbuxLocationsNew("OSA", (selectedFilters?.selectedPlatform?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
        apiResponse.location_pdp = getPincodesfromLocation(apiResponse.res_location_new_pdp);
        apiResponse.res_darkstore_pdp = await getEbuxDarkstoreLocation("OSA", (selectedFilters?.selectedPlatform?.map(i => i.value) ?? []), dateRangeData);
        apiResponse.darkstore_pdp = getDarkstorefromDarkstoreLocation(apiResponse.res_darkstore_pdp);



        if (activeClientProject?.isUseWidgetDarkstore) {
          apiResponse.darkstore = {};
          let payload = {
            msl: 'all',
            brand_category_name: [],
            brand_name: [],
            mother_pack: [],
            web_pid: [],
            dateRangeData: { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedFilters?.selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks }
          }
          const res = await getDistinctFiltersDarkStore(payload);
          apiResponse.darkstore.brand = res?.brand ?? [];
          apiResponse.darkstore.category = res?.category ?? [];
          apiResponse.darkstore.mother_pack = res?.mother_pack ?? [];
          apiResponse.darkstore.web_pid = res?.web_pid ?? [];
          apiResponse.darkstore.pf_id = res?.pf_id ?? [];

          apiResponse.darkstore.res_location_new = await getEbuxLocationsNewDarkStore("OSA", ((res?.pf_id ?? [])?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
          apiResponse.darkstore.location = getPincodesfromLocation(apiResponse.darkstore.res_location_new);
          apiResponse.darkstore.darkStoreId = await getStoreDataIdDarkStore("OSA", ((res?.pf_id ?? [])?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);

        }

        if (selectedFilters?.selectedPlatform?.length) {
          if (!apiResponse.res_platform_pdp?.length) {
            errorData.Platform = selectedFilters?.selectedPlatform?.slice(0, 5)?.map(i => i?.label)?.join(", ")
          } else {
            const after = selectedFilters?.selectedPlatform?.filter(i => (!apiResponse.res_platform_pdp?.some(j => j.label == i.label)))
            if (after?.length) {
              errorData.Platform = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            }
          }
        }
        if (selectedFilters?.selectedBrand?.length) {
          if (!apiResponse.res_brand_pdp?.length) {
            errorData.Brand = selectedFilters?.selectedBrand?.slice(0, 5)?.map(i => i?.label)?.join(", ")
          } else {
            const after = selectedFilters?.selectedBrand?.filter(i => (!apiResponse.res_brand_pdp?.some(j => j.label == i.label)))
            if (after?.length) {
              errorData.Brand = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            }
          }
        }
        if (selectedFilters?.selectedCategory?.length) {
          if (!apiResponse.res_category?.length) {
            errorData.Category = selectedFilters?.selectedCategory?.slice(0, 5)?.map(i => i?.label)?.join(", ")
          } else {
            const after = selectedFilters?.selectedCategory?.filter(i => (!apiResponse.res_category?.some(j => j.label == i.label)))
            if (after?.length) {
              errorData.Category = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            }
          }
        }
        if (selectedFilters?.selectedMotherPack?.length) {
          if (!apiResponse.res_mother_pack?.length) {
            errorData["Mother Pack"] = selectedFilters?.selectedMotherPack?.slice(0, 5)?.map(i => i?.label)?.join(", ")
          } else {
            const after = selectedFilters?.selectedMotherPack?.filter(i => (!apiResponse.res_mother_pack?.some(j => j.label == i.label)))
            if (after?.length) {
              errorData["Mother Pack"] = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            }
          }
        }
        if (selectedFilters?.selectedProductId?.length) {
          if (!apiResponse.res_products?.length) {
            errorData.Product = selectedFilters?.selectedProductId?.slice(0, 5)?.map(i => i?.label)?.join(", ")
          } else {
            const after = selectedFilters?.selectedProductId?.filter(i => (!apiResponse.res_products?.some(j => j.label == i.label)))
            if (after?.length) {
              errorData.Product = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            }
          }
        }
        if (selectedFilters?.selectedLocation?.length) {
          if (!apiResponse.location_pdp?.length) {
            errorData.Location = selectedFilters?.selectedLocation?.slice(0, 5)?.map(i => i?.label)?.join(", ")
          } else {
            const after = selectedFilters?.selectedLocation?.filter(i => (!apiResponse.location_pdp?.some(j => j.label == i.label)))
            if (after?.length) {
              errorData.Location = after?.slice(0, 5)?.map(i => i?.label)?.join(", ")
            }
          }
        }

        if (Object.keys(errorData).length) {
          setErrorToSetFilterData(true);
          setTempFilterData({
            apiResponse,
            setSelectedFiltersData: {
              selectedPlatformPdp: apiResponse?.res_platform_pdp ?? [],
              selectedWeeks: { ...selectedFilters?.selectedWeeks, [(displayDateRangePicker?.type ?? "current")]: [...weeks], ...(compareModeOn == false ? { isCompareToPrevious: false } : {}) }
            },
            errorData
          });
          setEbuxLoading(false);


        } else {
          setTempFilterData({});
          setErrorToSetFilterData(false);
          setMainApiResponse(prevSelectedFilters => ({
            ...prevSelectedFilters,
            res_platform_pdp: apiResponse?.res_platform_pdp ?? []
          }));
          setFilters((prevFilters) => {
            const updatedFilters = {
              ...prevFilters,
              platform: apiResponse?.res_platform_pdp,
              brand: apiResponse?.res_brand_pdp,
              category: apiResponse.res_category ?? [],
              location: apiResponse?.res_location_new_pdp ?? [],
              locationPincode: apiResponse?.location_pdp ?? [],
              darkstore: apiResponse?.res_darkstore_pdp ?? [],
              darkstore_id: apiResponse?.darkstore_pdp,
              products: apiResponse.res_products ?? [],
              mother_pack: apiResponse.res_mother_pack ?? [],

              filterChangeFromHeader: true,
            };

            setSelectedFiltersWidget(prevSelectedFilters => ({
              ...prevSelectedFilters,
              selectedPlatformPdp: apiResponse?.res_platform_pdp ?? []
            }));

            return updatedFilters;
          });
          if (activeClientProject?.isUseWidgetDarkstore) {
            setFiltersDarkStore(prevFilters => ({
              ...prevFilters,
              platform: apiResponse.darkstore.pf_id ?? [],
              platform_reset: apiResponse.darkstore.pf_id ?? [],
              brand: apiResponse.darkstore.brand ?? [],
              brand_reset: apiResponse.darkstore.brand ?? [],
              category: apiResponse.darkstore.category ?? [],
              category_reset: apiResponse.darkstore.category ?? [],
              products: apiResponse.darkstore.web_pid ?? [],
              products_reset: apiResponse.darkstore.web_pid ?? [],
              mother_pack: apiResponse.darkstore.mother_pack ?? [],
              mother_pack_reset: apiResponse.darkstore.mother_pack ?? [],
              location: apiResponse.darkstore.res_location_new ?? [],
              location_reset: apiResponse.darkstore.res_location_new ?? [],
              locationPincode: apiResponse.darkstore.location ?? [],
              locationPincode_reset: apiResponse.darkstore.location ?? [],
              darkstore: apiResponse.darkstore.darkStoreId ?? [],
              darkstore_reset: apiResponse.darkstore.darkStoreId ?? []
            }));
          }

          setSelectedFilters(prevSelectedFilters => ({
            ...prevSelectedFilters,
            selectedPlatformPdp: apiResponse?.res_platform_pdp ?? [],
            selectedWeeks: { ...selectedFilters?.selectedWeeks, [(displayDateRangePicker?.type ?? "current")]: [...weeks], ...(compareModeOn == false ? { isCompareToPrevious: false } : {}) }
          }));
          setEbuxLoading(false);

        }


        console.log('combineFilterWidgetcombineFilterWidgetcombineFilterWidget', combineFilterWidget)
        // setFilters(prevFilters => ({
        //   ...prevFilters,
        //   platform: combineFilterWidget?.platforms ?? [],
        //   brand: combineFilterWidget?.brands ?? [],
        //   category: combineFilterWidget?.categories ?? [],
        //   mother_pack: combineFilterWidget?.mother_packs ?? [],
        //   products: combineFilterWidget?.products ?? [],
        // }));

        // setSelectedFilters(prevFilters => ({
        //   ...prevFilters,
        //   selectedWeeks: { ...prevFilters?.selectedWeeks, [(displayDateRangePicker?.type ?? "current")]: [...weeks], ...(compareModeOn == false ? { isCompareToPrevious: false } : {}) },
        //   selectedProductId: (combineFilterWidget?.products ?? []),
        //   selectedPlatform: (combineFilterWidget?.platforms ?? []),
        // }));
      } catch (error) {
        console.error("Error fetching combined filters:", error);
      } finally {
        setEbuxLoading(false);
        onClose();
      }
      return;
    } else {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        selectedWeeks: { ...prevFilters?.selectedWeeks, [(displayDateRangePicker?.type ?? "current")]: [...weeks], ...(compareModeOn == false ? { isCompareToPrevious: false } : {}) }
      }));
      onClose();
    }


  }

  const setIsCompareToPrevious = (mode) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      selectedWeeks: { ...prevFilters?.selectedWeeks, isCompareToPrevious: mode }
    }));
    onClose();
  }
  return (

    <div className=" flex gap-2 items-center justify-end   bg-transparent ">
      <DateRangeCard start={moment(dateRange?.[0]?.start)?.format("DD/MM/YY")} end={moment(dateRange?.[(dateRange?.length - 1)]?.end)?.format("DD/MM/YY")} onClick={() => onClickDateRangeCard()} />
      {compareModeOn && selectedFilters?.selectedWeeks?.isCompareToPrevious ? (
        <DateRangeCard isCurrent={false} start={moment(compareDateRange?.[0]?.start)?.format("DD/MM/YY")} end={moment(compareDateRange?.[(compareDateRange?.length - 1)]?.end)?.format("DD/MM/YY")} onClick={() => onClickPreviousDateRangeCard()} />

      ) : <></>}
      {displayDateRangePicker?.open ? (
        <div className="absolute top-[50px] right-0 z-10 p-0 w-full min-w-[700px] max-w-[700px]">
          <DateRangeQuarterWeekPicker

            isCurrent={(displayDateRangePicker?.type ?? "current") == "current"}
            initialYear={(displayDateRangePicker?.type ?? "current") == "current" ? (dateRange?.[0]?.end ? new Date(dateRange?.[0]?.end).getFullYear() : new Date().getFullYear()) : (compareDateRange?.[0]?.end ? new Date(compareDateRange?.[0]?.end).getFullYear() : new Date().getFullYear())}
            defaultSelectedWeeks={(displayDateRangePicker?.type ?? "current") == "current" ? dateRange : compareDateRange}
            onApply={(weeks) => { setDateRange(weeks); console.log({ weeks }) }}
            onCancel={() => onClose()}
          />
        </div>
      ) : <></>}


      <div className="flex items-center gap-1 p-1 rounded-full ">
        <span className="text-sm font-semibold text-gray-800">Compare:</span>
        <button
          disabled={!compareModeOn}
          onClick={() => { setIsCompareToPrevious(!selectedFilters?.selectedWeeks?.isCompareToPrevious) }}
          aria-pressed={selectedFilters?.selectedWeeks?.isCompareToPrevious}
          className={`
                relative inline-flex h-[22px] w-[42px] items-center rounded-full transition
                shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]
                ${!compareModeOn ? "cursor-not-allowed bg-gray-200 opacity-50" : (selectedFilters?.selectedWeeks?.isCompareToPrevious ? "bg-blue-600 cursor-pointer" : "bg-neutral-300 cursor-pointer")}
              `}
        >
          <span
            className={`
                  pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white transform transition
                  ${compareModeOn && selectedFilters?.selectedWeeks?.isCompareToPrevious ? "translate-x-[22px]" : "translate-x-[4px]"}
                  shadow-[0_1px_1px_rgba(0,0,0,0.2)]
                `}
          />
        </button>
      </div>
    </div>
  );
}
