import "./style.css";
import React, {
  useEffect,
  // useMemo, 
  useState
} from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FILTERACTION } from "./FilterConstant";
import FilterDailog from "./FilterDailog";
import SearchDailog from "./SearchDailog";
import MetricDailog from "./MetricDailog";
import SearchChip from "./SearchChip";
import MetricChip from "./MetricChip";
import SaveSearchDailog from "./SaveSearchDailog";
import DeleteDailog from "./common/Popups/DeleteDailog";
import { LuSlidersHorizontal } from "react-icons/lu";
import { useEbuxContext } from "../../Context/EbuxProvider";
// import { useEbuxContext } from "../../Context/EbuxProvider";

const MultiFilter = ({
  // arr = [],
  // additionalFilter = [],
  showSearchBar = true,
  filterData = [],
  defaultValue = false,
  savedSearch = {},
  handleSaveFilters = false,
  applySearchFilter = false,
  platform = "ams",
  hasCancel = true,
  isChipVIsible = true,
  isSearchable = true,
  buttonName = "",
  setOpenMFilter,
  openMFilter = null,
}) => {
  const { activeClientProject } = useEbuxContext();
  // const {
  //   filters, kpi } = useEbuxContext();
  // const activeClientProject = useMemo(() => {
  //     return JSON.parse(localStorage.getItem("active_client_project") || "{}");
  // }, []);
  // const [filterData, setFilterData] = useState([]);
  const [chips, setChips] = useState([]);
  const [listArr, setListArr] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchFilter, setSearchFilter] = useState({}); // To store values of search filter
  const [selectedListObj, setSelectedListObj] = useState({}); // To store values of search filter
  const [showFilter, setShowFilter] = useState(false); // To show filter list below search bar
  const [showSaveSearchDailog, setShowSaveSearchDailog] = useState(false);

  const [searchDailogObj, setSearchDailogObj] = useState({
    // To show search dailog
    show: false,
    obj: {},
    value: {},
  });
  const [metricDailogObj, setMetricDailogObj] = useState({
    // To show metric dailog
    show: false,
    obj: {},
    value: {},
  });
  const [deleteDailogObj, setDeleteDailogObj] = useState({
    // To show delete dailog
    show: false,
    obj: {},
  });

  const handleCloseFilter = () => {
    setShowFilter(false);
  };

  const hasNonEmptyValue = Object.values(searchFilter).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object" && value !== null) return Object.keys(value).length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return false; // other types not considered
  });

  console.log("search filter", hasNonEmptyValue)

  const clearAllValues = () => {
    setSelectedListObj({});// Clear selected list
    setSearchFilter({});// Clear search filter
    setSearchText(""); // Clear input search text
    createSearchAndSelectedFilter(filterData); // It will create search and selected filter at blank state
    setChips([]); // Clear all chips

    applySearchFilter && applySearchFilter({}, "clear_filter");
  };

  const handleSearch = (searchFilter, keyName, joinKeyName = "") => {
    let currentKey =
      keyName === "name_id" ? joinKeyName.split("-")[1] : keyName;
    applySearchFilter && applySearchFilter(searchFilter, currentKey);
  };

  const handleValueChange = (keyName, joinKeyName, filter, type) => {
    //name_id --> keyName To find state
    let newSearchFilter;
    if (type === FILTERACTION.SEARCH) {
      newSearchFilter = {
        ...searchFilter,
        [keyName]: [...searchFilter[keyName], ...filter], // filter is array in case of search
      };
    }
    if (
      type === FILTERACTION.METRIC ||
      type === FILTERACTION.APPLY ||
      type === FILTERACTION.TAG
    ) {
      newSearchFilter = {
        ...searchFilter,
        [keyName]: [...searchFilter[keyName], filter], // filter is array in case of metric
      };
    }
    setSearchFilter(newSearchFilter);

    //name_id-portfolio --> joinKeyName To add new unique key for selected list obj
    const newSelectedListObj = {
      ...selectedListObj,
      [keyName]: { ...selectedListObj[keyName], [joinKeyName]: true },
    };
    setSelectedListObj(newSelectedListObj);

    setChips((prev) => [...prev, filter]);

    handleSearch(newSearchFilter, keyName, joinKeyName);
  };

  const handleValueUpdate = (keyName, joinKeyName, filter) => {
    let newSearchFilter; //name_id --> keyName To find state

    const prevSearchArr = [...searchFilter[keyName]]; // Removing values from search filter state -> name_id

    let filterArr = prevSearchArr?.filter((obj) => {
      return obj?.joinKey !== joinKeyName;
    });
    if (Array.isArray(filter)) {
      filterArr = [...filterArr, ...filter]; //Add new updated values in array
    } else {
      filterArr = [...filterArr, filter]; //Add new updated values in array
    }
    newSearchFilter = { ...searchFilter, [keyName]: filterArr };
    setSearchFilter(newSearchFilter);

    //Remove old chips
    let filterChipsArr = chips?.filter((chip) => {
      return Array.isArray(chip)
        ? chip[0].joinKey !== joinKeyName
        : chip.joinKey !== joinKeyName;
    });
    filterChipsArr = [...filterChipsArr, filter]; // Update chips with new one
    setChips(filterChipsArr);

    handleSearch(newSearchFilter, keyName, joinKeyName);
  };

  const handleApplySavedSearch = (data) => {
    if (chips.length > 0) clearAllValues(); // If search already present then clear everything

    let searchFilterJson = JSON.parse(data);

    let savedSearchStates = {}; // To create saved search selected list filter to check if filter removed of savedSearch
    let newSelectedListObj = {}; // To create selected list obj out of saved search filter json
    const chipArr = [];
    const uniqueNameIds = {};

    Object.keys(searchFilterJson)?.map((key) => {
      let valueObj = {};

      // Used for chips
      if (key === "name_id") {
        searchFilterJson[key]?.forEach((obj) => {
          if (uniqueNameIds[obj?.joinKey]) {
            uniqueNameIds[obj?.joinKey].push(obj);
          } else {
            uniqueNameIds[obj?.joinKey] = [obj];
          }
        });
      }

      searchFilterJson[key]?.forEach((obj) => {
        valueObj[obj?.joinKey] = true;
        if (key !== "name_id") {
          chipArr.push(obj); // Used for chips
        }
      });

      newSelectedListObj[key] = valueObj;
      if (Object.keys(valueObj).length > 0) {
        savedSearchStates[key] = valueObj;
      }
    });

    setSelectedListObj(newSelectedListObj);
    setSearchFilter(searchFilterJson);
    chipArr.push(...Object.values(uniqueNameIds));
    setChips(chipArr);

    // To get current priority key for handleSearch
    const priorityObj = { ...newSelectedListObj };
    delete priorityObj["name_id"];
    let maxLength = -1;
    let priorityKey = "portfolio_m";
    Object.keys(priorityObj)?.forEach((key) => {
      const objLength = Object.keys(priorityObj[key]).length;
      if (objLength > maxLength) {
        priorityKey = key;
        maxLength = objLength;
      }
    });

    handleSearch(searchFilterJson, priorityKey);
  };

  // For campaign sp, sb like filters
  const handleDirectListApply = (obj) => {
    const _key = (obj?.type == "categorynode") ? (obj?.key.split("@")) : (obj?.key.split("-")); //categorynode value contain (-) character so we are splitting by (@)
    const pKey = obj?.mapPKey ?? _key?.[0]; //"amazon_campaign_type"
    const key = _key?.[1]; // The key is seperated here "SP"
    const joinKey = obj?.key; // That's why we created join key which depicts key feaure of list like 'amazon_campaign_type-SP'
    const filterObj = {
      pkey: pKey,
      key: _key?.[2] ?? obj?.label ?? key,
      value: _key?.[1] ?? key,
      joinKey: joinKey,
      condition: "contains",
      label: (obj?.type == "categorynode") ? (obj?.data?.split("@")[0]) : (obj?.data?.split("-")[0]), // For chips title
      action: obj?.action, // For open search dailog again when clicking on chips
    };

    // label: item?.label,
    // key: `platform-${item?.value}-${item?.label}`,
    // data: `Platform - ${item?.value}-${item?.label}`,

    handleValueChange(pKey, joinKey, filterObj, obj?.action);
  };

  // For campaign sp, sb like filters
  const handleDirectTagApply = (obj) => {
    const pKey = obj?.key.split("-")[0]; //"amazon_campaign_type"
    const key = obj?.key.split("-")[1]; // The key is seperated here "SP"
    const joinKey = obj?.key; // That's why we created join key which depicts key feaure of list like 'amazon_campaign_type-SP'
    const filterObj = {
      pkey: pKey,
      key: key,
      joinKey: joinKey,
      label: obj?.label, // For chips title
      action: obj?.action, // For open search dailog again when clicking on chips
    };

    handleValueChange(pKey, joinKey, filterObj, obj?.action);
  };

  // --------------------------------------------------------------------

  const handleRemoveSearch = ({ keyName, joinKeyName }) => {
    // keyName-->"name_id" for searching state in search filter
    // joinKeyName--> "name_id-portfolio" find object for replacing or removing
    // Removing values from selected saved search filter obj to remove saved search chip

    handleRemoveFromSearchFilter(keyName, joinKeyName);
    handleRemoveFromSelectedList(keyName, joinKeyName);
    handleRemoveFromChips(joinKeyName);
  };

  const handleRemoveFromChips = (joinKeyName) => {
    // Removing by iterate over chips arr and find object by joinKey like name_id-portfolio
    let filteredList = chips?.filter((chip) => {
      return Array.isArray(chip)
        ? chip[0].joinKey !== joinKeyName
        : chip.joinKey !== joinKeyName;
    });

    setChips(filteredList);
  };

  const handleRemoveFromSearchFilter = (keyName, joinKeyName) => {
    // Removing values from search filter state
    const prevSearchArr = [...searchFilter[keyName]]; // Get previous value like {"name_id": [{},{},{}] } ==> return [{},{},{}]
    const filterArr = prevSearchArr?.filter((obj) => {
      return obj?.joinKey !== joinKeyName; // we have joinKey on search filter values
    });

    const newSearchFilter = { ...searchFilter, [keyName]: filterArr };

    setSearchFilter(newSearchFilter);
    handleSearch(newSearchFilter, keyName, joinKeyName);
  };

  const handleRemoveFromSelectedList = (keyName, joinKeyName) => {
    //Removing values from selected list obj state
    const selectedKeyObj = { ...selectedListObj[keyName] }; // { name_id: { "name_id-portfolio": true }} => return { "name_id-portfolio": true }
    delete selectedKeyObj[joinKeyName]; // {} Remove values from object
    setSelectedListObj((prevObj) => ({
      ...prevObj,
      [keyName]: selectedKeyObj,
    }));
  };

  // -----------------------------------------------------------------

  const handleFilterAction = (obj, value = false) => {
    if (searchText) {
      setSearchText(""); //If search text available then empty
    }
    if (obj?.action === FILTERACTION.METRIC) {
      setMetricDailogObj({ show: true, obj, value });
    }
    if (obj?.action === FILTERACTION.SEARCH) {
      setSearchDailogObj({ show: true, obj, value });
    }
    if (obj?.action === FILTERACTION.APPLY) {
      handleDirectListApply(obj);
      return; // We don't want to close filter box in case of apply action
    }
    if (obj?.action === FILTERACTION.TAG) {
      handleDirectTagApply(obj);
      return; // We don't want to close filter box in case of apply action
    }
    handleCloseFilter();
  };

  // ------------------------------------- Do not modify join or map functions--------------------------------

  const handleJoinList = (arr) => {
    // To join parent's label and key to children by handleMapParent function
    const newArr = arr?.map((obj) => {
      return obj.join ? handleMapParent(obj) : obj;
    });
    setListArr(newArr);
  };

  //For mapping parent label and key with children
  const handleMapParent = (mapObj) => {
    const newChildrenArr = mapObj?.children?.map((obj) => {
      let newObj = {
        ...obj,
        key: `${mapObj?.key}-${obj?.key}`,
        data: `${mapObj?.label} - ${obj?.label}`,
      };
      return newObj;
    });
    const newObj = { ...mapObj, children: newChildrenArr };
    return newObj;
  };

  // ---------------------------------------------------------------------------------------------------------

  const createSearchAndSelectedFilter = (arr) => {
    // To create search filter, selected list obj state at mounting
    let searchFilterObject = {};
    let selectedListObject = {};
    arr.forEach((obj) => {
      searchFilterObject[obj?.key] = [];
      selectedListObject[obj?.key] = {};
    });

    setSelectedListObj((previousData) => ({ ...selectedListObject, ...previousData }));
    setSearchFilter((previousData) => ({ ...searchFilterObject, ...previousData }));
  };

  // useEffect(() => {
  //   if (arr.length > 0) {
  //     const platform = {
  //       key: "platform",
  //       label: "Platform",
  //       // mapKey: "platform",
  //       selectable: false,
  //       children: filters?.platform?.map((item) => ({
  //         label: item?.label,
  //         key: `platform-${item?.value}-${item?.label}`,
  //         data: `Platform-${item?.value}-${item?.label}`,

  //         action: FILTERACTION.APPLY,
  //         // className: this.state?.disabled ? "disableli" : "",
  //       }))
  //     };
  //     let brand = {
  //       key: "brand",
  //       label: "Brand",
  //       selectable: false,
  //       children: []
  //     }; 
  //     if((activeClientProject?.brandTreeSelect)){
  //       brand["children"] = filters?.brand?.map((brand,index) => ({
  //           key: `brand-brnad_${index}`,
  //           label: brand?.label ?? brand?.label,
  //           selectable: false,
  //           // action: FILTERACTION.APPLY,
  //           children: brand.sub_brands.map((sub_brand,_k) => ({
  //             label: sub_brand.sub_brand,
  //             key: `brand-${sub_brand.value}-${sub_brand.sub_brand}-${_k}}`,
  //             data: `Brand-${sub_brand.value}-${sub_brand.sub_brand}`,    
  //             action: FILTERACTION.APPLY,
  //           }))
  //         }))
  //     }else{
  //       brand["children"] = filters?.brand?.map((item) => ({
  //           label: item?.label,
  //           key: `brand-${item?.value}-${item?.label}`,
  //           data: `Brand-${item?.value}-${item?.label}`,

  //           action: FILTERACTION.APPLY,
  //           // className: this.state?.disabled ? "disableli" : "",
  //         }))
  //     }

  //     const competitionBrand = {
  //       key: "competition_brand",
  //       label: "Competition Brand",
  //       selectable: false,
  //       children: filters?.competition_brand?.map((item) => ({
  //         label: item?.label,
  //         key: `competition_brand-${item?.value}-${item?.label}`,
  //         data: `Competition Brand-${item?.value}-${item?.label}`,

  //         action: FILTERACTION.APPLY,
  //         // className: this.state?.disabled ? "disableli" : "",
  //       }))
  //     };

  //     if ((["SOD"].includes(kpi))) {
  //       const category = {
  //         key: "category",
  //         label: "Category",
  //         selectable: false,
  //         children: filters?.category?.map((item) => ({
  //           label: item?.label,
  //           key: `category-${item?.value}-${item?.label}`,
  //           data: `Category-${item?.value}-${item?.label}`,
  //           action: FILTERACTION.APPLY,
  //           // className: this.state?.disabled ? "disableli" : "",
  //         }))
  //       };
  //       const finalFilterData=[ ...arr, platform, brand,category]
  //       if(additionalFilter.indexOf("competition_brand")>-1){
  //         finalFilterData.push(competitionBrand)
  //       }
  //       setFilterData(finalFilterData);
  //     }else if ((["SOS", "OR"].includes(kpi))) {

  //       const nameIdFilter = {
  //         key: "name_id",
  //         label: "Name/ID",
  //         selectable: false,
  //         children: [
  //           {
  //             key: "name_id-keyword",
  //             label: "Keyword Name",
  //             data: "Keyword Name - ",
  //             mapKey: "keyword",
  //             action: FILTERACTION.SEARCH,
  //             // className: this.state?.disabled ? "disableli" : "",
  //           },
  //         ],
  //       }
  //       const keywordCategory = {
  //         key: "category",
  //         label: "Category",
  //         selectable: false,
  //         children: []
  //       };

  //       if((activeClientProject?.brandTreeSelect)){

  //         keywordCategory.children= filters?.keywordCategory?.map(category => ({
  //           key: `category-${category?.label}`,
  //           label: category?.label ?? category?.label,
  //           selectable: false,
  //           action: FILTERACTION.APPLY,
  //           children: category.sub_categories.map(sub_category => ({
  //             label: sub_category.sub_category,
  //             key: `category-${sub_category.value}-${`${sub_category.sub_category}-${sub_category.category}-${sub_category.value}`}`,
  //             data: `Category-${sub_category.value}-${sub_category.sub_category}`,    
  //             action: FILTERACTION.APPLY,
  //           }))
  //         }))
  //       }else{
  //         keywordCategory.children= filters?.keywordCategory?.map((item) => ({
  //           label: item?.label,
  //           key: `category-${item?.value}-${item?.label}`,
  //           data: `Category-${item?.value}-${item?.label}`,

  //           action: FILTERACTION.APPLY,
  //           // className: this.state?.disabled ? "disableli" : "",
  //         }))
  //       }
  //       const keywordType = {
  //         key: "keyword Type",
  //         label: "Keyword Type",
  //         selectable: false,
  //         children: filters?.keywordType?.map((item) => ({
  //           label: item?.label,
  //           key: `keyword Type-${item?.value}-${item?.label}`,
  //           data: `keyword Type-${item?.value}-${item?.label}`,

  //           action: FILTERACTION.APPLY,
  //           // className: this.state?.disabled ? "disableli" : "",
  //         }))
  //       };

  //       const finalFilterData = [nameIdFilter, ...arr, platform, brand, keywordCategory, keywordType]
  //       if(additionalFilter.indexOf("competition_brand")>-1){
  //         finalFilterData.push(competitionBrand)
  //       }
  //       setFilterData(finalFilterData);
  //     } else {

  //       const osa_remarks = {
  //         key: "osa_remarks",
  //         label: "OSA Status",
  //         // mapKey: "platform",
  //         selectable: false,
  //         children: filters?.osa_remarks?.map((item) => ({
  //           label: item?.label,
  //           key: `osa_remarks-${item?.value}-${item?.label}`,
  //           data: `OSA Status-${item?.value}-${item?.label}`,

  //           action: FILTERACTION.APPLY,
  //           // className: this.state?.disabled ? "disableli" : "",
  //         }))
  //       };
  //       const msl = {
  //         key: "msl",
  //         label: "MSL Flag",
  //         // mapKey: "platform",
  //         selectable: false,
  //         children: [{label:"Yes",value:1},{label:"No",value:0}]?.map((item) => ({
  //           label: item?.label,
  //           key: `msl-${item?.value}-${item?.label}`,
  //           data: `MSL Flag-${item?.value}-${item?.label}`,  
  //           action: FILTERACTION.APPLY,
  //           // className: this.state?.disabled ? "disableli" : "",
  //         }))
  //       };
  //       const location = {
  //         key: "location",
  //         label: "Location",
  //         selectable: false,
  //         children: filters?.locationPincode?.map((item) => ({
  //           label: (item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All (Nykaa)" : `${item.city} (${item.label})`),
  //           key: `location-${item?.value}-${(item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All-Nykaa" : `${item.city} (${item.label})`)}`,
  //           data: `Location-${item?.value}-${(item.value == '10' ? "All (Amazon)" : item.value == '24' ? "All-Nykaa" : `${item.city} (${item.label})`)}`,

  //           action: FILTERACTION.APPLY,
  //           // className: this.state?.disabled ? "disableli" : "",
  //         }))
  //       };
  //       const nameIdFilter = {
  //         key: "name_id",
  //         label: "Name/ID",
  //         selectable: false,
  //         children: [
  //           {
  //             key: "name_id-pincode",
  //             label: "Pincode",
  //             data: "Pincode - ",
  //             mapKey: "pincode",
  //             action: FILTERACTION.SEARCH,
  //             // className: this.state?.disabled ? "disableli" : "",
  //           },
  //           {
  //             key: "name_id-sku_name",
  //             label: "Product Name",
  //             data: "Product Name - ",
  //             mapKey: "sku_name",
  //             action: FILTERACTION.SEARCH,
  //           },
  //           {
  //             key: "name_id-web_pid",
  //             label: "SKU",
  //             data: "SKU - ",
  //             mapKey: "web_pid",
  //             action: FILTERACTION.SEARCH,
  //             // className: this.state?.disabled ? "disableli" : "",
  //           }            
  //         ],
  //       }
  //       if((activeClientProject?.brandTreeSelect)){
  //         nameIdFilter.children.push(...[
  //           {
  //             key: "name_id-reseller_id",
  //             label: "Brand Pack SKU",
  //             data: "Brand Pack SKU - ",
  //             mapKey: "reseller_id",
  //             action: FILTERACTION.SEARCH,
  //           },
  //           {
  //             key: "name_id-ebux_code",
  //             label: "Platform ID",
  //             data: "Platform ID - ",
  //             mapKey: "ebux_code",
  //             action: FILTERACTION.SEARCH,
  //           },
  //           {
  //             key: "name_id-ean_code",
  //             label: "EAN Code",
  //             data: "EAN Code - ",
  //             mapKey: "ean_code",
  //             action: FILTERACTION.SEARCH,
  //           }
  //         ]);
  //       }
  //       if(additionalFilter.indexOf("competition_sku_name")>-1){
  //         nameIdFilter.children.push({
  //             key: "name_id-competition_sku_name",
  //             label: "Competition Product Name",
  //             data: "Competition Product Name - ",
  //             mapKey: "competition_sku_name",
  //             action: FILTERACTION.SEARCH,
  //         })
  //       }
  //       if(additionalFilter.indexOf("competition_web_pid")>-1){
  //         nameIdFilter.children.push({
  //           key: "name_id-competition_web_pid",
  //             label: "Competition SKU",
  //             data: "Competition SKU - ",
  //             mapKey: "competition_web_pid",
  //             action: FILTERACTION.SEARCH,
  //       })
  //       }
  //       let category={
  //         key: "category",
  //         label: "Category",
  //         selectable: false,
  //         children:[]
  //       }
  //        if((activeClientProject?.brandTreeSelect)){
  //         category["children"]=filters?.category?.map(category => ({
  //             key: `category-${category?.label}`,
  //             label: category?.label ?? category?.label,
  //             selectable: false,
  //             action: FILTERACTION.APPLY,
  //             children: category.sub_categories.map(sub_category => ({
  //               label: sub_category.sub_category,
  //               key: `category-${sub_category.value}-${`${sub_category.sub_category}-${sub_category.category}-${sub_category.value}`}`,
  //               data: `Category-${sub_category.value}-${sub_category.sub_category}`,    
  //               action: FILTERACTION.APPLY,
  //             }))
  //           }))

  //       }else{ 
  //         category["children"]=filters?.category?.map((item) => ({
  //           label: item?.label,
  //           key: `category-${item?.value}-${item?.label}`,
  //           data: `Category-${item?.value}-${item?.label}`,

  //           action: FILTERACTION.APPLY,
  //           // className: this.state?.disabled ? "disableli" : "",
  //         }))
  //     }

  //       const finalFilterData = [nameIdFilter, ...arr, platform, brand, category, location,msl,osa_remarks]
  //       if(additionalFilter.indexOf("competition_brand")>-1){
  //         finalFilterData.push(competitionBrand)
  //       }
  //       if((activeClientProject?.dark_store)){
  //         const darkstore = {
  //           key: "darkstore",
  //           label: "Dark Store ID",
  //           selectable: false,
  //           children: filters?.darkstore_id?.map((item) => ({
  //             label: `${item.city} (${item.label})`,
  //             key: `darkstore-${item?.value}-${`${item.city} (${item.label})`}`,
  //             data: `Dark Store ID-${item?.value}-${`${item.city} (${item.label})`}`,

  //             action: FILTERACTION.APPLY,
  //             // className: this.state?.disabled ? "disableli" : "",
  //           }))
  //         };
  //         finalFilterData.push(darkstore)
  //       }
  //       setFilterData(finalFilterData);
  //     }
  //   }
  // }, [JSON.stringify(arr)]);
  useEffect(() => {
    if (filterData.length > 0) {
      handleJoinList(filterData); // Run for all objects which have join key true in json
      createSearchAndSelectedFilter(filterData, savedSearch); // It will create search and selected filter state
    }
  }, [filterData]);

  // ------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Assuming you can identify the popover element by class or other means
      if (showFilter && !event.target.closest("#filter-container")) {
        setShowFilter(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showFilter]);

  useEffect(() => {
    if (defaultValue?.length > 2) {
      // eslint-disable-next-line no-console
      handleApplySavedSearch(defaultValue);
    }
  }, [defaultValue]);


  useEffect(() => {
    if (openMFilter != null) {
      chips?.forEach((chip) => {

        if (chip?.key == openMFilter && chip?.action === FILTERACTION.METRIC) {

          // console.log({chip});
          handleFilterAction(chip, { condition: chip?.condition, value: chip?.value });
          // handleFilterAction(chip,chip);
          openMFilter = null;
        }
      })
      if (openMFilter != null) {
        const dataObj = filterData?.filter((i) => (i?.key == "metric"))?.[0]?.children?.find((obj) => obj.key == openMFilter);
        if (dataObj?.key == openMFilter) {
          const newSet = { "show": true, "obj": { "label": dataObj?.label, "key": `metric-${dataObj.key}`, "persentageValue": false, "action": "metric", "data": `Metric - ${dataObj.label}` }, "value": false }
          // console.log({openMFilter},{dataObj},{filterData},{});
          setMetricDailogObj(newSet);
        }
      }


      setOpenMFilter(null);
    }
  }, [openMFilter]);

  return (
    <div className="flex bg-white py-2.5 pl-2 w-full" id="multi-filter">
      {
        (activeClientProject?.isUseWidget && chips?.length > 1) ? <button className="px-2 font-semibold" onClick={clearAllValues}> Clear All </button> : <></>
      }
      <div className=" flex-1 flex items-center gap-2 flex-wrap">
        {isSearchable && showSearchBar && <div className="pl-2">
          <HiOutlineMagnifyingGlass />
        </div>}
        {isChipVIsible && chips?.map((chip, index) => {
          return Array.isArray(chip) ? (
            <SearchChip
              arr={chip}
              key={index}
              handleAction={handleFilterAction}
              handleRemoveSearch={handleRemoveSearch}
            />
          ) : (
            <MetricChip
              key={index}
              obj={chip}
              handleAction={handleFilterAction}
              handleRemoveSearch={handleRemoveSearch}
              clearAllValues={clearAllValues}
            />
          );
        })}

        {deleteDailogObj?.show && (
          <DeleteDailog
            heading={`Delete ${deleteDailogObj?.obj?.label} ?`}
            text="This will permanently delete your saved search from our servers."
            handleClose={() =>
              setDeleteDailogObj({
                show: false,
                obj: {},
              })
            }
          />
        )}

        {showSaveSearchDailog && (
          <SaveSearchDailog
            searchFilter={searchFilter}
            clearAllValues={clearAllValues}
            handleSave={handleSaveFilters}
            handleClose={() => setShowSaveSearchDailog(false)}
            platform={platform}
          />
        )}

        {metricDailogObj?.show && (
          <MetricDailog
            platform={platform}
            dailogObj={metricDailogObj?.obj}
            reopenData={metricDailogObj?.value}
            setChips={setChips}
            setSearchFilter={setSearchFilter}
            handleValue={handleValueChange}
            handleValueUpdate={handleValueUpdate}
            setSelectedListObj={setSelectedListObj}
            handleClose={() => setMetricDailogObj({ show: false, obj: {} })}
          />
        )}
        {searchDailogObj?.show && (
          <SearchDailog
            platform={platform}
            dailogObj={searchDailogObj?.obj}
            reopenData={searchDailogObj?.value}
            setChips={setChips}
            setSearchFilter={setSearchFilter}
            handleValue={handleValueChange}
            handleValueUpdate={handleValueUpdate}
            setSelectedListObj={setSelectedListObj}
            handleClose={() => setSearchDailogObj({ show: false, obj: {} })}
          />
        )}

        <div className="relative" id="filter-container">
          {isSearchable ? (showSearchBar ? <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setShowFilter(true)}
            placeholder="Search and filter"
            className="flex w-[310px] rounded-full border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          /> : <></>): <div
            id="graph"
            className={`${hasNonEmptyValue ? "bg-[#1890FF] border-[#1890FF] text-white" : "bg-gray-50 text-gray-900 border-gray-300"} flex gap-2 cursor-pointer border   text-xs rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 block  px-2.5 py-1
                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                       dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            onClick={() => setShowFilter(!showFilter)}
          >
            {buttonName}<LuSlidersHorizontal className="inline h-4 w-4" />
          </div>}
          {showFilter && (
            <FilterDailog
              openInRight={!isSearchable}
              chips={chips}
              listArr={listArr}
              searchText={searchText}
              savedSearch={savedSearch}
              handleDeleteSavedSearch={setDeleteDailogObj}
              handleAction={handleFilterAction}
              handleSavedAction={handleApplySavedSearch}
              handleRemoveSearch={handleRemoveSearch}
              selectedListObj={selectedListObj}
              clearCheck={!isChipVIsible ? true : false}
              clearAllValues={clearAllValues}
            />
          )}
        </div>
      </div>
      {handleSaveFilters && (
        <button
          className="px-2 font-semibold text-blue-400"
          onClick={() => {
            chips.length > 0 && setShowSaveSearchDailog(true);
          }}
        >
          Save
        </button>
      )}
      {(!activeClientProject?.isUseWidget) && hasCancel && isSearchable && (
        <button className="px-2 font-semibold" onClick={clearAllValues}>
          Cancel
        </button>
      )}
    </div>
  );
};

export default MultiFilter;
