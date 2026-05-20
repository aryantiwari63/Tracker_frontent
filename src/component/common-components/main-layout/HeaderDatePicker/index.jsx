import React from 'react'
// import {useState} from 'react'
import DateRangePicker from './dateRangePicker';
import {
  DateRangeProvider,
  useDateRangeContext
} from './context/dateRangeProvider';
import moment from 'moment';
import { useEbuxContext } from '../../../Ebux/Context/EbuxProvider';
import { arrowIcon, calenderIcon } from './utils/icons';
import { samePeriodAsCurrent } from './utils/helper';
import { getCombineFilterWidget, getDistinctFiltersDarkStore, getEbuxDarkstoreLocation, getEbuxLocationsNew, getEbuxLocationsNewDarkStore, getStoreDataIdDarkStore } from '../../../Ebux/services/ebux.service';
// import { get_consecutive_out_of_stock_products } from '../../../Ebux/services/consecutive_out_of_stock_products.service';

const DateRangeCard = ({
  isCurrent = true,
  start = "23/07/25",
  end = "23/07/25",
  onClick = () => { }
}) => {
  return (
    <div onClick={() => onClick(isCurrent)} className="cursor-pointer border border-gray-300 rounded-lg shadow-sm bg-white px-6 pt-3 pb-1 leading-none inline-block relative">
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
const DatePiker = () => {

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
    setErrorToSetFilterData
  } = useEbuxContext();

  // const activeClientProject={client_project_id:1,maxDate:moment().subtract(1, 'day').format("YYYY-MM-DD")};

  // const endDate=moment(activeClientProject?.maxDate).format("YYYY-MM-DD");
  // const startDate=moment(endDate).subtract(6, 'day').format("YYYY-MM-DD");
  // const previousEndDate=moment(startDate).subtract(1, 'day').format("YYYY-MM-DD");
  // const previousStartDate=moment(previousEndDate).subtract(6, 'day').format("YYYY-MM-DD");
  // const [ selectedFilters, setSelectedFilters]=useState({selectedDateRange: {
  //     isCompareToPrevious: false,
  //     endDate,
  //     startDate,
  //     previousEndDate,
  //     previousStartDate,
  //     currentFilters:"Last 7 days",
  //     previousFilters: "Previous Period"
  //   }});
  if (activeClientProject?.WeekPicker) {
    return (
      <></>
    )
  }
  const {
    setActivePreviousFilters,
    displayDateRangePicker, setDisplayDateRangePicker,
    setIsOpenCurrentDateRangePicker } = useDateRangeContext();

  const onClickDateRangeCard = (isCurrent) => {
    setDisplayDateRangePicker(true);
    setIsOpenCurrentDateRangePicker(isCurrent);
  };

  const updateDateRanges = async (ranges) => {
    const selectedDateRange = {
      isCompareToPrevious: ranges?.comparisonMode ?? false,
      endDate: moment(ranges?.currentPeriod?.endDate).format("YYYY-MM-DD"),
      startDate: moment(ranges?.currentPeriod?.startDate).format("YYYY-MM-DD"),
      previousEndDate: moment(ranges?.previousPeriod?.endDate ?? ranges?.currentPeriod?.endDate).format("YYYY-MM-DD"),
      previousStartDate: moment(ranges?.previousPeriod?.startDate ?? ranges?.currentPeriod?.startDate).format("YYYY-MM-DD"),
      currentFilters: ranges?.activeCurrentFilters ?? "Custom",
      previousFilters: ranges?.activePreviousFilters ?? "Custom"
    };
    if (activeClientProject?.isFilterDateWise && ["SOS", "OR", "SOM"]?.indexOf(kpi) == -1) {
      setEbuxLoading(true);
      try {
        const dateRangeData = { calendarType: selectedFilters?.calendarType, selectedDateRange: selectedDateRange, selectedWeeks: selectedFilters?.selectedWeeks };
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

        apiResponse.res_location_new_pdp = await getEbuxLocationsNew("OSA", (apiResponse.res_platform_pdp?.map(i => i.value) ?? []), (selectedFilters?.active_location_status), dateRangeData);
        apiResponse.location_pdp = getPincodesfromLocation(apiResponse.res_location_new_pdp);
        apiResponse.res_darkstore_pdp = await getEbuxDarkstoreLocation("OSA", (apiResponse.res_platform_pdp?.map(i => i.value) ?? []), dateRangeData);
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
              selectedDateRange,
              selectedPlatformPdp: apiResponse?.res_platform_pdp ?? []
            },
            errorData
          });
          setEbuxLoading(false);

        } else {
          setTempFilterData({});
          setErrorToSetFilterData(false);
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
              mother_pack: apiResponse.res_mother_pack ?? []
            }; apiResponse?.res_platform_pdp

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
            }))
          }

          setSelectedFilters(prevSelectedFilters => ({
            ...prevSelectedFilters,
            selectedDateRange,
            selectedPlatformPdp: apiResponse?.res_platform_pdp ?? []
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
        // onClose();
      }
      return;
    } else {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        selectedDateRange,
        // seven_or_more_days_out_of_stock_list
      }));
    }
    // const seven_or_more_days_out_of_stock_list=await get_consecutive_out_of_stock_products({startDate:selectedDateRange?.startDate,endDate:selectedDateRange?.endDate});

  }


  const updateComparisonMode = (previousPeriod, previousFilters) => {
    if (selectedFilters?.selectedDateRange?.isCompareToPrevious) {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        selectedDateRange: { ...prevFilters?.selectedDateRange, isCompareToPrevious: false }
      }));
    } else {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        selectedDateRange: {
          ...prevFilters?.selectedDateRange,
          isCompareToPrevious: true,
          previousStartDate: moment(previousPeriod?.startDate).format("YYYY-MM-DD"),
          previousEndDate: moment(previousPeriod?.endDate).format("YYYY-MM-DD"),
          previousFilters
        }
      }));
    }

  }
  return (
    <div className=" flex gap-2 items-center justify-end   bg-transparent ">
      <DateRangeCard isCurrent={true} start={moment(selectedFilters?.selectedDateRange?.startDate).format("DD/MM/YY")} end={moment(selectedFilters?.selectedDateRange?.endDate).format("DD/MM/YY")} onClick={(isCurrent) => onClickDateRangeCard(isCurrent)} />
      {selectedFilters?.selectedDateRange?.isCompareToPrevious && (
        <DateRangeCard isCurrent={false} start={moment(selectedFilters?.selectedDateRange?.previousStartDate).format("DD/MM/YY")} end={moment(selectedFilters?.selectedDateRange?.previousEndDate).format("DD/MM/YY")} onClick={(isCurrent) => onClickDateRangeCard(isCurrent)} />
      )}
      {displayDateRangePicker && (
        <div className="absolute top-[50px] right-0 z-10 p-0 w-full min-w-[600px]">
          <DateRangePicker allowedMaxDate={activeClientProject?.maxDate ?? moment().subtract(1, "day").toDate()} onChange={updateDateRanges} defaultComparisonMode={selectedFilters?.selectedDateRange?.isCompareToPrevious} defaultCurrentStart={selectedFilters?.selectedDateRange?.startDate} defaultCurrentEnd={selectedFilters?.selectedDateRange?.endDate} defaultPreviousStart={selectedFilters?.selectedDateRange?.previousStartDate} defaultPreviousEnd={selectedFilters?.selectedDateRange?.previousEndDate} defaultCurrentFilters={selectedFilters?.selectedDateRange?.currentFilters ?? "Last 7 days"} defaultPreviousFilters={selectedFilters?.selectedDateRange?.previousFilters ?? "Previous Period"} />
        </div>
      )}
      <div className="flex items-center gap-1 p-1 rounded-full ">
        <span className="text-sm font-semibold text-gray-800">Compare:</span>
        <button
          onClick={() => { samePeriodAsCurrent({ startDate: selectedFilters?.selectedDateRange?.startDate, endDate: selectedFilters?.selectedDateRange?.endDate }, (previousPeriod) => { updateComparisonMode(previousPeriod, "Previous Period") }, "Previous Period", setActivePreviousFilters); }}
          aria-pressed={selectedFilters?.selectedDateRange?.isCompareToPrevious}
          className={`
          relative inline-flex h-[22px] w-[42px] items-center rounded-full transition
          ${selectedFilters?.selectedDateRange?.isCompareToPrevious ? "bg-blue-600" : "bg-neutral-300"}
          shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]
        `}
        >
          <span
            className={`
            pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white transform transition
            ${selectedFilters?.selectedDateRange?.isCompareToPrevious ? "translate-x-[22px]" : "translate-x-[4px]"}
            shadow-[0_1px_1px_rgba(0,0,0,0.2)]
          `}
          />
        </button>
      </div>
    </div>
  );
}
export default function HeaderDatePicker() {


  return (
    <DateRangeProvider>
      <DatePiker />
    </DateRangeProvider>
  )
}
