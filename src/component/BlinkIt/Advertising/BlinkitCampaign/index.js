/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "../../../DatePicker";
import MultiSearch from "../../../common-components/MultiSearch/MultiSearch";
import { FILTERACTION } from "../../../common-components/MultiFilter/FilterConstant";
import { Headerbtn } from "../../../common-components/headerButton/headerButton";
import { addDays } from "date-fns";
import {
  GET_ACCOUNTS,
  blinkitCategory,
  blinkitKeyword,
  blinkitLocation,
  blinkitProduct,
  graphMappingBK,
  graphMetricsBK,
  COMP_DATE,
  ALL_COMP_DATE,
  BLINKIT_ACCOUNTS,
  PERMISSIONS,
  SAVE_COLUMN,
  // BLINKIT_FUNNEL_COUNT,
} from "../../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import SaveSearchPopUp from "../../../common-components/MultiSearch/saveSearchPopUp";
import {
  saveSearch,
  getSavedSearchList,
} from "../../../../redux/action-creator/campaignSearchAction";
import { blinkitCampaign } from "../../../../utils/constants";
import Toast from "../../../common-components/toast";
import ActionType from "../../../../redux/types";
import DashboardGraph from "../../../flipkart/DashboadGraph";
import Tabbtn from "../../../flipkart/Advertising/Tabbtn";
import BlinkItCampTable from "./BlinkItCampTable";
import {
  _GET,
  _POST,
  _PATCH,
  _DELETE,
} from "../../../../services/axios.method";
import {
  convertDate,
  defaultDateRange,
  defaultFilterCheck,
  hasFilter,
} from "../../../../utils/helpers";
import CampaigntableHeaderBlinkit from "./createcampaign/CampaignHeaderBlinkit";
// import CustomizeDropDown from "../../../common-components/flipkart/CustomizeDropDown";
import CustomSelect from "../../../common-components/CustomSelect";
import { getWallletBalance } from "../../../../redux/action-creator/sideBarAction";
import {
  setExpandTable,
  setToastMessageHandler,
} from "../../../../redux/action-creator/commonAction";
// import {HiOutlineAdjustmentsHorizontal} from "react-icons/"
import { dashboardlinkitGraph } from "../../../../services/dashboard";
import { trackCampaignManagerTabs } from "../../../../analytics/EventController";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import CompareDatePicker from "../../../DatePicker/compareDatePicker";
import { defaultCompareDateBlinkit } from "../../../../utils/helpers";
import ToggleButton from "../../../common-components/toggle-button/CampToggle";
import Popup from "../../../common-components/Popups/Popup";
import CustomizeColPopup from "../../../common-components/CustomizeColumns/CustomizeColPopup";
import CustomizeColBtn from "../../../common-components/headerButton/CustomizeColBtn";
import CustomSelectNew from "../../../common-components/CustomSelectNew";
import {
  getLocalStorageAccounts,
  saveLocalStorageAccounts,
} from "../../../../utils/helpers";
import _ from "lodash";
import WhenPermitted from "../../../common-components/WhenPermitted";

const daydata = [
  {
    label: "Daily",
    value: "daily",
  },
  {
    label: "Weekly",
    value: "weekly",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
];
import MultiFilter from "../../../common-components/MultiFilter/MultiFilter";
import { blinkitFilterArr } from "../../../common-components/MultiFilter/FilterConstant";
import DialogBox from "../../../common-components/dialogBox.js";

const BlinkitCampaign = () => {
  const dateFilters = defaultDateRange();
  // const compareFilters = defaultCompareDateBlinkit();
  const dispatch = useDispatch();
  const [showDropDown, setShowDropDown] = useState(false);
  const [account, setAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(undefined);
  const userPermissions = useSelector(
    (state) => state?.permissionsReducer || []
  );
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CAMPAIGN_ACTIONS,
    platform: "blinkit",
  });
  const [blinkitArray, setBlinkitArray] = useState(blinkitFilterArr);
  const tags = useSelector(
    (state) =>
      _.map(state?.TagReducer?.tagData, ({ tag_name, _id }) => ({
        tag_name,
        tag_id: _id,
      })) || []
  );

  const [dateRange, setDateRange] = React.useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]);

  const [tempDate, setTempDate] = React.useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]);

  const [calState, setCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });

  const [compDateRange, setCompDateRange] = React.useState([
    {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [compCalState, setCompCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });
  const [compareId, setCompareId] = useState("1");
  const [compDates, setCompDates] = useState([]);
  const [manual_compare_date, setManual_compare_date] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [drrPopup, setDrrPopup] = useState(false);
  const [val, setVal] = React.useState("absolute");
  const [showError, setShowError] = React.useState(true);
  const [check, setcheck] = useState(false);

  const adjustIconRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [activeCards, setActiveCards] = useState([]);
  const [graphFilters, setGraphFilters] = useState([
    "total_sales",
    "estimated_budget_consumed",
  ]);
  const [graphFilterOne, setGraphFilterOne] = useState("total_sales");
  const [graphFilterTwo, setGraphFilterTwo] = useState(
    "estimated_budget_consumed"
  );
  const [showFilter, setShowFilter] = useState(false);
  const [saveSearchModal, setSaveSearchModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [dateGrouping, setDateGrouping] = useState("daily");
  const [dateName, setDateName] = useState("Daily");
  // eslint-disable-next-line no-unused-vars
  const [brandDataListing, setBrandDataListing] = useState([]);
  const [ShowTab, setShowTab] = useState("campaign");
  // const [platformId, setPlatformId] = useState("123");
  const [platformId, setPlatformId] = useState();
  const [filters, setFilters] = useState({
    campaign: [],
    keyword: [],
    category: [],
  });
  const [clearSearch, setClearSearch] = useState(false);
  const [btopen, setisbtopen] = useState(false);
  const [filterdata, setFilterData] = useState([]);
  const [callApi, setCallApi] = useState(false);
  const [savedSearch, setSavedSearch] = useState({
    key: "saved_search",
    label: "Saved Search",
    selectable: false,
  });

  const [showHeader, setShowHeader] = React.useState([...blinkitCampaign]);
  const [filterHeader, setFilterHeader] = React.useState([]);

  // const [previousValue, setPreviousValue] = React.useState([
  //   ...blinkitCampaign,
  // ]);
  // eslint-disable-next-line no-unused-vars
  const [checkboxData, setCheckboxData] = useState([]);
  const [download, setDownload] = useState(0);
  //const [csvHeaders,setCsvHeaders] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [viewName, setViewName] = useState();
  const [colFetch, setColFetch] = useState(false);
  const [openNamePopup, setOpenNamePopup] = useState(false);
  const [updateColId, setColUpdateId] = useState();
  const [buttonName, setButtonName] = useState("Save");
  const [duplicateViewError, setDuplicateError] = useState(false);
  const user_id = localStorage.getItem("user_id");
  const username = localStorage.getItem("name");
  const client_id = localStorage.getItem("client_id");

  const handleButtonName = (data) => {
    if (data !== "Save") {
      setButtonName("Update");
      setColUpdateId(data);
    } else {
      setButtonName(data);
    }
  };
  const saveColData = async () => {
    let data;
    let result;
    if (buttonName == "Save") {
      if (viewName !== undefined && viewName !== "") {
        data = {
          name: viewName,
          platform: "blinkit",
          user_id: user_id,
          username: username,
          tab_name: ShowTab,
          column_data: filterHeader,
          client_id: client_id,
        };
        result = await _POST(SAVE_COLUMN, data);
      } else {
        setDuplicateError("Enter view name");
      }
    } else {
      data = {
        column_data: filterHeader,
      };
      setDuplicateError(false);
      result = await _PATCH(`${SAVE_COLUMN}/${updateColId}`, data);
    }
    if (result) {
      if (result?.status === 200) {
        setColFetch(!colFetch);
        setDuplicateError(false);
        dispatch(setToastMessageHandler(result?.data?.status?.message, true));
        setOpenNamePopup(false);
      } else {
        setDuplicateError(result.data.status.message);
      }
    }
  };

  const handleColButton = () => {
    if (buttonName === "Save") {
      setOpenNamePopup(true);
    } else {
      saveColData();
    }
  };

  useEffect(() => {
    if (_.size(tags)) {
      const tagFilter = blinkitArray.find((ele) => ele.key === "tags");
      tagFilter.children = [];
      const updatedArray = blinkitArray.map((ele) => {
        if (ele.key === "tags") {
          for (const e of tags) {
            ele.children.push({
              label: e?.tag_name,
              key: e?.tag_id,
              action: FILTERACTION.TAG,
            });
          }
        }
        return ele;
      });
      setBlinkitArray(updatedArray);
    }
  }, [JSON.stringify(tags)]);

  useEffect(() => {
    if (hasFilter(filters)) {
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [filters]);

  function onChangeDate(item) {
    let dateRangePrev = dateRange[0];
    setTempDate([{ ...dateRangePrev, ...item.selection }]);
    if (!calState.fullCalender) {
      defaultDateRange(item.selection);
      setDateRange([item.selection]);
      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
    }
  }

  const getAccounts = async () => {
    try {
      const responseAccount = await _GET(BLINKIT_ACCOUNTS);
      // console.log("responseAccount>>>>>>>>>>>", responseAccount.data.data);
      if (responseAccount?.data?.data) {
        let accountsFilter = _.cloneDeep(responseAccount?.data?.data);
        let savedAccounts = getLocalStorageAccounts();
        if (_.size(savedAccounts)) {
          let firstAccount = savedAccounts[0];
          let filterAccount = responseAccount?.data?.data.find(
            (acc) => acc.label === firstAccount
          );
          if (filterAccount) {
            accountsFilter = [filterAccount];
            saveLocalStorageAccounts([accountsFilter[0]?.label]);
          } else {
            saveLocalStorageAccounts([accountsFilter[0]?.label]);
          }
        } else {
          saveLocalStorageAccounts([accountsFilter[0]?.label]);
        }

        setSelectedAccount(accountsFilter[0].value);
        setAccount(responseAccount.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(() => {
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  }, [dateRange, selectedAccount]);

  useEffect(() => {
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
    // dashboardApi();
  }, []);

  const onValChange = () => {
    if (check) {
      setVal("Absolute");
    } else {
      setVal("DRR");
    }
    setcheck(!check);
    //initLoad();
  };

  const handleSelectChange = (e) => {
    setGraphFilterOne(e);
  };
  const handleDaysChange = () => {
    setisbtopen(!btopen);
  };
  const handleSecondChange = (e) => {
    setGraphFilterTwo(e);
  };
  React.useEffect(() => {
    setGraphFilters([graphFilterOne, graphFilterTwo]);
  }, [graphFilterOne, graphFilterTwo]);

  useEffect(() => {
    getSavedSearch().then((data) => {
      let search = savedSearch;
      // console.log(data, "data123");
      search.children = data;
      // console.log(search, "search123");
      setSavedSearch({ ...search });
    });
    trackCampaignManagerTabs(ShowTab); // To Track the campaign manager tabs
  }, []);
  const getTabData = (name, init = false) => {
    trackCampaignManagerTabs(name); // To Track the campaign manager tabs
    if (name === ShowTab && init === false) {
      return false;
    }
    let headers = blinkitCampaign;
    if (name === "campaign") {
      headers = blinkitCampaign;
    } else if (name === "category") {
      headers = blinkitCategory;
    } else if (name === "keyword") {
      headers = blinkitKeyword;
    } else if (name === "location") {
      headers = blinkitLocation;
    } else if (name === "product") {
      headers = blinkitProduct;
    }
    setShowTab(name);
    setShowHeader(headers);
    setShowDropDown(false);
    // console.log(filters, "filters from the tabs", name);
  };

  useEffect(() => {
    //getTabData(ShowTab,true,filters);
  }, [dateRange, ShowTab]);
  useEffect(() => {}, [saveSearchModal]);

  useEffect(() => {
    dispatch({
      type: ActionType.CAMPAIGN_TYPE,
      payload: [],
    });
  }, []);

  // const funnelCount = async (campaign_ids) => {
  //   let campaignGrouping = checkGrouping();

  //   let payload = {
  //     campaign_ids,
  //     startDate: convertDate(dateRange[0].startDate),
  //     endDate: convertDate(dateRange[0].endDate),
  //     headers: showHeader,
  //     campaignGrouping,
  //   };
  //   let countData = await _POST(BLINKIT_FUNNEL_COUNT, payload);
  //   // console.log("countDAta>>>>>>>>>>>>>", countData);
  //   dispatch({
  //     type: ActionType.BLINKIT_FUNNEL_COUNT,
  //     payload: { ...countData.data.data },
  //   });
  //   let updateFor = {
  //     keyword: true,
  //     category: true,
  //   };
  //   let { keyword, category } = filters;
  //   console.log("keyword>>>>>>>", keyword, category);
  //   if (
  //     (keyword?.keyword || keyword?.keyword_m) &&
  //     (keyword?.keyword?.length > 0 || keyword?.keyword_m?.length > 0)
  //   ) {
  //     updateFor["keyword"] = false;
  //   }
  //   if (
  //     (category?.category_name || category?.category_m) &&
  //     (category?.category_name?.length > 0 || category?.product_m.length > 0)
  //   ) {
  //     updateFor["category"] = false;
  //   }
  //   if (Array.isArray(filters?.keyword) || updateFor["keyword"])
  //     dispatch({
  //       type: ActionType.TOTAL_KEYWORD_COUNT,
  //       payload: countData.data.data.keyword_count,
  //     });
  //   if (Array.isArray(filters?.category) || updateFor["category"])
  //     dispatch({
  //       type: ActionType.TOTAL_CATEGORY_COUNT,
  //       payload: countData.data.data.category_count,
  //     });
  // };

  const checkGrouping = () => {
    let setGroupByCampaign = false;
    showHeader.map((item) => {
      if (item.value === "campaign_id" || item.value === "campaign_name") {
        // console.log("checkStatus", item.value, item.checked);
        setGroupByCampaign = item.checked;
      }
    });
    return setGroupByCampaign;
  };

  function applySearchFilter(sFilters, current) {
    // setIsDisabledSaveSearch(false);

    let apiFilter = {};
    let tab = "";
    apiFilter = { ...sFilters };

    if (
      current === "campaign_m" ||
      current === "campaign_name" ||
      current === "tags" ||
      current === "segment" ||
      current === "platform" ||
      current === "campaign_status" ||
      current === "campaign_budget_type" ||
      current === "blinkit_campaign_type"
    ) {
      if (current === "blinkit_campaign_type") {
        let blinkit_campaign_type = sFilters?.blinkit_campaign_type.map(
          (data) => data?.key
        );
        dispatch({
          type: ActionType.CAMPAIGN_TYPE,
          payload: blinkit_campaign_type,
        });
      }
      apiFilter["campaign_m"] = sFilters["campaign_m"];
      apiFilter["segment"] = sFilters["segment"];
      apiFilter["platform"] = sFilters["platform"];
      apiFilter["campaign_status"] = sFilters["campaign_status"];
      apiFilter["campaign_budget_type"] = sFilters["campaign_budget_type"];
      let fValues = getFilterValue(
        ["campaign_name", "campaign_id", "tag_name", "campaign_status"],
        sFilters
      );
      let otherFilters = {};
      if (
        [
          "segment",
          "platform",
          "campaign_status",
          "campaign_budget_type",
        ].indexOf(current) > -1
      ) {
        otherFilters[current] = sFilters[current];
      }
      apiFilter = { ...apiFilter, ...fValues, ...otherFilters };
      tab = "campaign";
      setCheckboxData([]);
    } else if (current === "keyword_m" || current === "keyword") {
      apiFilter["keyword_m"] = sFilters["keyword_m"];
      let fValues = getFilterValue(["keyword"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "keyword";
    } else if (current === "category_m" || current === "category_name") {
      apiFilter["category_m"] = sFilters["category_m"];
      let fValues = getFilterValue(["category_name"], sFilters);
      // console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "category";
    } else if (
      current === "fsn_m" ||
      current === "fsn_id" ||
      current === "fsn_name"
    ) {
      apiFilter["fsn_m"] = sFilters["fsn_m"];
      let fValues = getFilterValue(["fsn_id", "fsn_name"], sFilters);
      // console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "fsn";
      // console.log("fsn_m" || current === "fsn_id" || current === "fsn_name");
    } else if (current === "creative_m") {
      apiFilter["creative_m"] = sFilters["creative_m"];
      let fValues = getFilterValue([], sFilters);
      // console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "creative";
      // console.log("creative_m");
    } else if (current === "placement_m") {
      apiFilter["placement_m"] = sFilters["placement_m"];
      let fValues = getFilterValue([], sFilters);
      // console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "placement";
    }

    let checkbox = { ...selectedCheckBox };
    if (tab.trim().length > 0) {
      let priority = {
        campaign: 1,
        keyword: 0,
        category: 0,
      };
      let priorityKeys = Object.keys(priority);
      // console.log(tab, "testestes>>>>>>>>>", priorityKeys);

      for (let i = 0; i < priorityKeys.length; i++) {
        // console.log("etsts>>>>>>>>", priorityKeys[i]);
        if (
          priority[priorityKeys[i]] < priority[tab] ||
          (priority[tab] === priority[priorityKeys[i]] &&
            priorityKeys[i] === tab)
        ) {
          checkbox[priorityKeys[i]] = [];
        }
      }
      // if (tab === "campaign") {
      //   funnelCount([]);
      // }
      // console.log("testestes>>>>>>>>>", checkbox);

      dispatch({
        type: ActionType.CHECKBOX,
        payload: checkbox,
      });
      filters[tab] = apiFilter;
      getTabData(tab, true, filters);
      // console.log(filters, "filters12");
      if (clearSearch === false) {
        setFilters({ ...filters });
      } else {
        setFilters([]);
      }
    }
    // setShowHeader(showHeader);
    // console.log(JSON.stringify(sFilters), "filters-----", apiFilter, current);
  }

  function getFilterValue(keys, filters) {
    let value = [];
    let keyName = "";
    filters.name_id.map((val) => {
      if (keys.indexOf(val.key) > -1) {
        value.push(val);
        keyName = val.key;
        //console.log(val, "inside");
      }
    });
    return { [keyName]: value };
  }

  // const [isDisabledSaveSearch, setIsDisabledSaveSearch] = useState(true);
  // const cancelFilter = () => {
  //   // setShowHeader([...showHeader]);
  //   setShowHeader(previousValue);
  //   setShowFilter(false);
  // };
  // const applyFilter = React.useCallback(() => {
  //   setShowHeader(
  //     showHeader.map((checkbox) =>
  //       checkbox.checked === true
  //         ? { ...checkbox, showCol: true }
  //         : { ...checkbox, showCol: false }
  //     )
  //   );
  //   setShowFilter(false);
  // }, [showHeader]);

  const saveSearchInit = async (name) => {
    let payload = {
      filters: filters,
      name: name,
      user_id: 1,
      media_type: "blinkit",
    };
    const res = await saveSearch(payload);

    if (res && res.result) {
      getSavedSearch().then((data) => {
        let search = savedSearch;
        //console.log(data, "data123");
        search.children = data;
        //console.log(search, "search123");
        setSavedSearch({ ...search });
      });
      dispatch(
        setToastMessageHandler(
          "Your search is saved in saved search section",
          true
        )
      );
    } else {
      dispatch(setToastMessageHandler(res, false));
    }
  };

  const handleSaveMultiSearch = async (filters, name, callback = false) => {
    let payload = {
      filters: filters,
      name: name,
      user_id: 1,
      media_type: "blinkit",
    };
    const res = await saveSearch(payload);

    if (res && res.result) {
      getSavedSearch().then((data) => {
        let search = savedSearch;
        // console.log(data, "data123");
        search.children = data;
        // console.log(search, "search123");
        setSavedSearch({ ...search });
      });
      dispatch(
        setToastMessageHandler(
          "Your search is saved in saved search section",
          true
        )
      );
      callback && callback();
    } else {
      dispatch(setToastMessageHandler(`${res}`, false));
    }
  };

  const getSavedSearch = async () => {
    let payload = {
      user_id: 1,
      media_type: "blinkit",
    };
    let data = await getSavedSearchList(payload);
    // console.log(data, "data111");
    return data;
  };
  const applyDate = (saveToLocalStorage) => {
    let appdaterange = tempDate[0];
    if (saveToLocalStorage) {
      defaultDateRange(tempDate[0]);
    }
    setDateRange([{ ...appdaterange }]);
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
    onChangeDate({ selection: tempDate[0] });
    // dispatch({
    //   type: ActionType.BLINKIT_FUNNEL_COUNT,
    //   payload: { keyword_count: 0, category_count: 0 },
    // });
    // dashboardApi();
  };

  const cancelDate = () => {
    let dateRangePrev = dateRange[0];

    setTempDate([{ ...dateRangePrev }]);
    //setTempDate([dateRange[0]]);
  };

  async function updateFilterData(filter) {
    const data = filter
      .filter((item) => graphMetricsBK.includes(item.value))
      .map((item) => ({
        label: item.title,
        value: item.value,
      }));
    setFilterData(data);
  }

  const handleSelectedData = (data) => {
    // console.log("testinf:::::", data);
    setCheckboxData(data);
    setShowDropDown(false);
  };

  // React.useEffect(() => {
  //   dispatch(getWallletBalance(account));
  // }, [account]);

  async function dashboardApi() {
    let post = {
      selectedAccount,
      filters: graphFilters,
      dateGrouping: dateGrouping,
      start_date: convertDate(dateRange[0]?.startDate),
      end_date: convertDate(dateRange[0]?.endDate),
      // platform_id: platformId,
      tab_name: ShowTab,
    };
    if (selectedCheckBox[ShowTab]?.length && graphMappingBK[ShowTab]) {
      if (Array.isArray(graphMappingBK[ShowTab])) {
        let tempArray = [];
        selectedCheckBox[ShowTab].forEach((a) => {
          let obj = {};
          graphMappingBK[ShowTab].forEach((b) => {
            obj[b] = a[b];
          });
          tempArray.push(obj);
        });
        post[ShowTab] = tempArray;
      } else {
        post[ShowTab] = selectedCheckBox[ShowTab].map(
          (item) => item[graphMappingBK[ShowTab]]
        );
      }
    }

    if (selectedCheckBox["campaign"]?.length) {
      post.campaign_id = selectedCheckBox["campaign"].map(
        (item) => item[graphMappingBK["campaign"]]
      );
    }
    let res = await dashboardlinkitGraph(post);
    if (res?.data?.data) {
      setGraphData(res.data.data);
    }
  }

  useEffect(() => {
    // alert("etststest");
    if (selectedAccount !== undefined) dashboardApi();
  }, [
    ...graphFilters,
    dateGrouping,
    platformId,
    // selectedAccount,
    // dateRange[0]?.startDate,
    // dateRange[0]?.endDate,
    selectedCheckBox,
    ShowTab,
  ]);

  async function checkFilter() {
    const val1 = filterdata.some((item) => item.value == graphFilterOne);
    const val2 = filterdata.some((item) => item.value == graphFilterTwo);
    if (!val1 || !val2) {
      setGraphFilterOne("total_sales");
      setGraphFilterTwo("estimated_budget_consumed");
    }
  }

  useEffect(() => {
    checkFilter();
  }, [filterdata]);

  useEffect(() => {
    updateFilterData(showHeader);
  }, [showHeader]);

  // useEffect(() => {
  //   if (!calState.fullCalender) dashboardApi();
  // }, [dateRange[0]?.startDate, dateRange[0]?.endDate]);

  // const accountNames = async () => {
  //   try {
  //     const result = await _GET(GET_ACCOUNTS);
  //     const data = result.data.data.result;

  //     const accounts = data
  //       // .filter((x) => x._id.account && x._id.platform_id)
  //       .map((item) => ({
  //         label: item._id.account,
  //         value: item._id.account,
  //         account_id: item._id.account_id,
  //         platform_id: item._id.platform_id,
  //       }));
  //     // console.log(accounts);
  //     setBrandDataListing(accounts);
  //     let filters = defaultFilterCheck(accounts);
  //     // console.log("filters::::::::::::", filters["flipkart"]["single"]);
  //     setPlatformId(filters["flipkart"]["single"]);
  //     // eslint-disable-next-line no-console
  //     console.warn(filters);
  //     // console.log(brandDataListing, "<<<<,,bgdg", accounts[1].platform_id);
  //     // setPlatformId(brandDataListing[0].platform_id);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleClickOutside = (event) => {
    if (
      adjustIconRef.current &&
      !adjustIconRef.current.contains(event.target)
    ) {
      setisbtopen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  async function onCompChangeDate(item) {
    let compDateRanges = compDateRange[0];
    let tempState = [{ ...compDateRanges, ...item.selection }];
    setCompDateRange([...tempState]);

    // if (compCalState.fullCalender) {
    //   setCompCalState({ ...compCalState,
    //     showCalender: false,
    //     dateApplied: true,})
    // }
  }
  const saveComp = async (state, name) => {
    try {
      const post = {
        name: name,
        startDate: state[0]?.startDate,
        endDate: state[0]?.endDate,
        platform: "flipkart",
      };
      await _POST(COMP_DATE, post);
      await loadCompData();
    } catch (e) {
      console.error(e);
    }
  };

  const loadCompData = async () => {
    try {
      const post = {
        platform: "flipkart",
      };
      const res = await _POST(ALL_COMP_DATE, post);
      setCompDates([...res.data.data.result]);
    } catch (e) {
      console.error(e);
    }
  };

  async function setCompareData(id) {
    try {
      setCompareId(id);
      defaultCompareDateBlinkit(id);
      // this.setState({
      //   filters: { ...this.state.filters, manual_compare_date: {} },
      // });
      setCompareId(id);
      setManual_compare_date({});
    } catch (e) {
      console.error(e);
    }
  }

  async function editCompDate(state, name, id) {
    try {
      const post = {
        name: name,
        startDate: state[0]?.startDate,
        endDate: state[0]?.endDate,
      };
      await _PATCH(COMP_DATE + `/${id}`, post);
      await this.loadCompData();
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteComp(id) {
    try {
      await _DELETE(COMP_DATE + `/${id}`);
      await loadCompData();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleApplyButton() {
    try {
      // setCompareId("2")
      // defaultCompareDate("2")
      // setCompareId("2")
      setManual_compare_date(compDateRange[0]);
    } catch (e) {
      console.error(e);
    }
  }

  const handleApply = () => {
    setShowHeader(filterHeader);
    setShowFilter(false);
    setButtonName("Save");
  };

  const childRef = useRef();
  // let showCustom = false;
  // if (
  //   (ShowTab == "campaign" && selectedCheckBox?.campaign?.length === 0) ||
  //   selectedCheckBox?.campaign?.length === undefined
  // ) {
  //   showCustom = true;
  // }
  // if (
  //   (ShowTab == "category" && selectedCheckBox?.category?.length === 0) ||
  //   selectedCheckBox?.category?.length === undefined
  // ) {
  //   showCustom = true;
  // }
  // if (ShowTab != "category" && ShowTab != "campaign") {
  //   showCustom = true;
  // }

  const changeTagsData = (compaignId, TagsId) => {
    childRef.current?.getAlert(compaignId, TagsId);
  };

  useEffect(() => {
    dispatch(setExpandTable(false));
  }, []);

  function setPlatformFilter(e) {
    setSelectedAccount(e);
    saveLocalStorageAccounts(
      _.map(
        _.filter(account, (ele) => ele.value === e),
        "label"
      )
    );
  }

  return (
    <>
      <div className="">
        <Toast></Toast>
        <section className=" flex-nowrap p-4 bg-white">
          <div className="flex-col">
            <div className="flex justify-between items-center">
              <div className="flex w-full gap-2">
                <div className="flipkart__selectfilter">
                  <CustomSelect
                    platform={"blinkit"}
                    label={"Select"}
                    options={account}
                    value={selectedAccount}
                    onChange={setPlatformFilter}
                    name="campaignManagerAms"
                  />
                </div>
                <div className="flipkart__calander  ">
                  <DatePicker
                    platform={"blinkit"}
                    onChangeDate={onChangeDate}
                    state={tempDate}
                    setState={setDateRange}
                    calState={calState}
                    setCalState={setCalState}
                    position={"right"}
                    top
                    applyDate={() => applyDate(true)}
                    dashboard={"campmanage"}
                    cancelDate={cancelDate}
                    className="!top-[38px] border"
                  />
                </div>
                <div className="flipkart__calander" style={{ width: "23%" }}>
                  <CompareDatePicker
                    className="h-3"
                    position={"left"}
                    platform={"blinkit"}
                    onChangeDate={onCompChangeDate}
                    state={compDateRange}
                    setState={(data) => {
                      setCompDateRange(data);
                    }}
                    calState={compCalState}
                    setCalState={(data) => {
                      setCompCalState(data);
                    }}
                    applyDate={applyDate}
                    saveComp={saveComp}
                    compDates={compDates}
                    loadCompData={loadCompData}
                    compareId={compareId}
                    setCompId={(id) => {
                      setCompareData(id);
                    }}
                    editCompDate={editCompDate}
                    deleteComp={deleteComp}
                    mainCalendarRange={dateRange}
                    handleApplyButton={handleApplyButton}
                    editCampMode={setEditMode}
                  />
                </div>
              </div>
              <div
                className="hover:cursor-pointer"
                onClick={() => {
                  setIsVisible(!isVisible);
                  dispatch(setExpandTable(isVisible));
                }}
              >
                {isVisible ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            {isVisible && (
              <div className="px-2">
                <div className="border rounded-md p-2 mt-3">
                  <div className="flex gap-2 items-center p-2">
                    <p className="text-2xl font-semibold px-2">
                      Graphical Analysis
                    </p>
                    <div className="col_3 mr-4">
                      {/* <select
                        className="campaignselect focus:ring-1 focus:border-[#13a976] outline-[#13a976] focus:ring-[#13a976]"
                        onChange={(e) => handleSelectChange(e.target.value)}
                      >
                        {filterdata?.map((item) => {
                          return (
                            <>
                              <option
                                disabled={item.value === graphFilterTwo}
                                selected={item.value === graphFilterOne}
                                value={item.value}
                              >
                                {item.label}
                              </option>
                            </>
                          );
                        })}
                      </select> */}
                      <CustomSelectNew
                        label={"Select"}
                        options={filterdata}
                        value={graphFilterOne}
                        disableValue={graphFilterTwo}
                        onChange={handleSelectChange}
                        platform={"blinkit"}
                        className="py-[5px] "
                      />
                    </div>
                    <div className="col_3  mr-4">
                      {/* <select
                        className="campaignselect focus:ring-1 focus:border-[#13a976] outline-[#13a976] focus:ring-[#13a976]"
                        onChange={(e) => handleSecondChange(e.target.value)}
                      >
                        {filterdata?.map((item) => {
                          return (
                            <>
                              <option
                                className=""
                                disabled={item.value === graphFilterOne}
                                selected={item.value === graphFilterTwo}
                                value={item.value}
                              >
                                {item.label}
                              </option>
                            </>
                          );
                        })}
                      </select> */}
                      <CustomSelectNew
                        label={"Select"}
                        options={filterdata}
                        value={graphFilterTwo}
                        disableValue={graphFilterOne}
                        onChange={handleSecondChange}
                        platform={"blinkit"}
                        className="py-[5px] "
                      />
                    </div>
                    <div className="mr-3 ">
                      <div className="dropdown filter-dropdown open relative ">
                        <button
                          ref={adjustIconRef}
                          onClick={(e) => {
                            handleDaysChange(e.target.value);
                          }}
                          className=" btn btn-primary dropdown-toggle  dropdown__g-param blinkitRing"
                          type="button"
                          id=""
                          data-toggle="dropdown"
                          aria-expanded="true"
                        >
                          <div className="row">
                            <img
                              className="h-5 pr-1"
                              src="/assets/images/adjust-icon.svg"
                              alt=""
                            />
                            <div className="px-1 ">{dateName}</div>
                          </div>
                        </button>
                        {/* <option select disabled>Adjust</option> */}
                        {btopen && (
                          <div className="periodselector p-2">
                            <ul className="h-full">
                              {daydata?.map((item) => {
                                return (
                                  <>
                                    <li
                                      className="cursor-pointer"
                                      value={item.value}
                                      style={{
                                        background:
                                          item.value === dateGrouping ? "" : "",
                                      }}
                                    >
                                      <button
                                        className="periodselectorblinkit-li"
                                        onClick={() => {
                                          setDateName(item.label);
                                          setDateGrouping(item.value);
                                          setisbtopen(false);
                                        }}
                                      >
                                        {item.label}
                                      </button>
                                    </li>
                                  </>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="flipkart__graphcard ">
                      <DashboardGraph
                        activeCards={activeCards}
                        setActiveCards={setActiveCards}
                        graphFilters={graphFilters}
                        showDetails={true}
                        filterdata={filterdata}
                        graphData={graphData}
                        compare={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <div className=" pt-5">
          <div className="col_12">
            <div className="mb-5">
              <MultiFilter
                savedSearch={savedSearch}
                arr={blinkitArray}
                applySearchFilter={applySearchFilter}
                handleSaveFilters={handleSaveMultiSearch}
                platform="blinkit"
              />
            </div>
            {/* <div
              className="campaign__search outline-none "
              style={{ display: "flex" }}
            >
              <MultiSearch
                saveSearch={savedSearch}
                applySearchFilter={applySearchFilter}
                clearSearch={clearSearch}
                setClearSearch={() => {
                  setClearSearch(false);
                }}
                mediaName="blinkit"
              />
              <WhenPermitted permission={PERMISSIONS.CAMPAIGN_ACTIONS} platform="blinkit">
              <button
                type="submit"
                onClick={() => {
                  if (!hasFilter(filters)) {
                    setShowError(true);
                  } else {
                    setShowError(false);
                    setSaveSearchModal(true);
                  }
                }}
                className="px-4 rounded-md  py-2 border bg-white campaignbtn--blinkit"
                style={{
                  marginLeft: "10px",
                  cursor: showError ? "not-allowed" : "pointer",
                }}
                disabled={showError}
              >
                <img src="assets/images/save-icon.svg" alt="" /> Save
              </button>
              </WhenPermitted>
              <button
                type="submit"
                className="px-4 rounded-md  py-2 border bg-white campaignbtn--blinkit"
                onClick={() => {
                  setClearSearch(true);
                }}
              >
                <img src="assets/images/clear-icon.svg" alt="" />
                Clear
              </button>
              {saveSearchModal === true && (
                <SaveSearchPopUp
                  platform="blinkit"
                  showPopUp={saveSearchModal}
                  setSearchName={(name) => {
                    saveSearchInit(name);
                  }}
                  setSaveSearchModal={(e) => {
                    setSaveSearchModal(e);
                  }}
                />
              )}
            </div> */}
          </div>
          <div className="row">
            <div className="col campaign__tablewrap bg-white">
              <div className="campaign__navtab campaign__navtab--blinkit relative max-w-[1420px]">
                <Tabbtn
                  title="Campaign"
                  imgsrc={
                    ShowTab === "campaign"
                      ? "/assets/images/megaphoneblinkitactive.svg"
                      : "/assets/images/megaphone.svg"
                  }
                  onClick={() => getTabData("campaign")}
                  active={ShowTab === "campaign"}
                  platform={"blinkit"}
                  value={"campaign"}
                />
                <Tabbtn
                  title="Category"
                  imgsrc={
                    ShowTab === "category"
                      ? "/assets/images/categoryActive.svg"
                      : "/assets/images/categoryIcon.svg"
                  }
                  onClick={() => getTabData("category")}
                  active={ShowTab === "category"}
                  platform={"blinkit"}
                  value={"category"}
                />
                <Tabbtn
                  title="Keyword"
                  imgsrc={
                    ShowTab === "keyword"
                      ? "/assets/images/keyboardblinkitactive.svg"
                      : "/assets/images/keyboard.svg"
                  }
                  onClick={() => getTabData("keyword")}
                  active={ShowTab === "keyword"}
                  platform={"blinkit"}
                  value={"keyword"}
                />

                {/* <Tabbtn
                  title="Creative"
                  imgsrc={
                    ShowTab === "creative"
                      ? "/assets/images/creativeblinkitactive.svg"
                      : "/assets/images/creative.svg"
                  }
                  onClick={() => getTabData("creative")}
                  active={ShowTab === "creative"}
                /> */}
                {/* {selectedCheckBox?.campaign?.length > 0 && (
                  <div className="text-[11px] absolute right-0 pt-3 pl-1">
                    <span className="text-blue-500 font-bold">*</span>
                    Selected campaigns: ({selectedCheckBox?.campaign?.length})
                  </div>
                )} */}
              </div>
            </div>
            <div className="row  justify-between pb-4  bg-white px-4">
              <div className="blinkit__campheader">
                <CampaigntableHeaderBlinkit
                  onEditButtonClick={ShowTab}
                  tableData={selectedCheckBox[ShowTab] || []}
                  exportable={ShowTab !== "campaign"}
                  changeTagsData={changeTagsData}
                  tabName={ShowTab}
                  showDropDown={showDropDown}
                  setShowDropDown={setShowDropDown}
                />
              </div>

              {((ShowTab == "campaign" &&
                (selectedCheckBox?.campaign?.length === 0 ||
                  selectedCheckBox?.campaign?.length === undefined)) ||
                (ShowTab == "category" &&
                  (selectedCheckBox?.category?.length === 0 ||
                    selectedCheckBox?.category?.length === undefined)) ||
                (ShowTab == "keyword" &&
                  (selectedCheckBox?.keyword?.length === 0 ||
                    selectedCheckBox?.keyword?.length === undefined))) && (
                <div className="col">
                  <div
                    className="row justify-end items-center"
                    // style={{
                    //   marginTop: hasPermission ? "0" : "-60px",
                    // }}
                  >
                    <div className="relative mt-4 mx-2">
                      {/* <CustomColumn /> */}
                      {/* <CustomizeDropDown
                        // title="Customize column"
                        setShowHeader={setShowHeader}
                        showHeader={showHeader}
                        applyFilter={applyFilter}
                        cancelFilter={cancelFilter}
                        // setShowFilter={setShowFilter}
                        setShowFilter={(e, from) => {
                          //for storing Previous Value
                          if (e) setPreviousValue(showHeader);

                          if (from === "button" && !e)
                            setShowHeader(previousValue);
                          setShowFilter(e);
                        }}
                        showFilter={showFilter}
                        platform={"blinkit"}
                      /> */}

                      {/* <button
                        className={
                          "campaignreport__btn flex !rounded-md campaignreport__btn--blinkit"
                        }
                        onClick={() => {
                          setShowFilter(!showFilter, "button");
                        }}
                      >
                        <img
                          className="w-4"
                          src="/assets/images/columns.svg"
                          alt=""
                        />
                      </button> */}
                      <CustomizeColBtn
                        className="hover:bg-[#11B07A]"
                        onClick={() => setShowFilter(!showFilter, "button")}
                      />
                      {showFilter && (
                        <Popup
                          platform="blinkit"
                          setShowPopup={setShowFilter}
                          setTempView={() => {}}
                          smallsize
                          title={`Customize ${ShowTab} Column`}
                          applyAction={() => {
                            setShowHeader(filterHeader);
                            setShowFilter(false);
                          }}
                          cutomButton={[
                            {
                              handleClick: () => {
                                {
                                  setShowFilter(false);
                                  setButtonName("Save");
                                }
                              },
                              label: "Cancel",
                              style: "bg-[#E3E3E3] text-[#5B5B5B]",
                            },
                            {
                              handleClick: () => {
                                handleColButton();
                              },
                              label: buttonName,
                              style: "bg-[#E3E3E3] text-[#5B5B5B]",
                            },
                            {
                              handleClick: handleApply,
                              label: "Apply",
                              style: "bg-[#11B07A]",
                            },
                          ]}
                        >
                          <CustomizeColPopup
                            showHeader={showHeader}
                            setFilterHeader={setFilterHeader}
                            buttonStyleCss="bg-[#11B07A] hover:bg-[#0aa36f]"
                            dropDownCss="hover:bg-[#11B07A]"
                            searchCss="outline-green-500"
                            platform={"blinkit"}
                            tabName={ShowTab}
                            buttonName={handleButtonName}
                            refetch={colFetch}
                          />
                        </Popup>
                      )}
                    </div>
                    <div className="">
                      <Headerbtn
                        disabled={download === 1}
                        imgsrc="/assets/images/hard-disk.png"
                        hoverImgSrc="/assets/images/hard-disk-white.svg"
                        // title={download === 1 ? "Downloading..." : "Export"}
                        platform="blinkit"
                        style={{ width: "14px" }}
                        onClick={() => {
                          if (download === 1) {
                            return true;
                          } else {
                            setDownload(1);
                          }
                        }}
                      />
                    </div>
                    <div className="amazon__campheader mt-5 mx-2 ">
                      <ToggleButton
                        label1={"Absolute"}
                        label2={"DRR"}
                        val={val}
                        setVal={onValChange}
                        check={check}
                        platform={"blinkit"}
                        campaignManager
                      ></ToggleButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full p-4 bg-white">
              <BlinkItCampTable
                selectedAccount={selectedAccount}
                filters={filters}
                dateRange={dateRange}
                name={ShowTab}
                tab={ShowTab}
                headers={showHeader}
                handleSelectedData={handleSelectedData}
                account={account}
                //checkboxData={selectedCheckBox[ShowTab] || []}
                checkboxData={selectedCheckBox}
                download={download}
                setDownload={setDownload}
                platformId={platformId}
                callApi={callApi}
                setCallApi={setCallApi}
                compDateRange={compDateRange}
                setCompCalState={setCompCalState}
                compareId={compareId}
                manual_compare_date={manual_compare_date}
                editMode={editMode}
                drr={check}
                drrPopup={drrPopup}
                setDrrPopup={setDrrPopup}
                ref={childRef}
                calState={calState}
                // funnelCount={funnelCount}
                checkGrouping={checkGrouping}
              />
              {drrPopup && !editMode && (
                <div className="popup">
                  <div className="font-inter px-8 pt-8 pb-6 bg-white rounded-sm shadow flex-col justify-start items-end gap-5 inline-flex">
                    <div className=" font-inter w-[352px] justify-start items-start gap-4 inline-flex">
                      <img
                        className=" imgicon"
                        src={"/assets/images/confirmAlert.svg"}
                        alt=""
                      />
                      <div className="font-inter grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                        <div className="font-inter self-stretch text-black/opacity-90 text-base font-medium  leading-normal">
                          Confirmation
                        </div>
                        <div className="font-inter self-stretch text-black/opacity-90 text-sm  leading-snug">
                          Proceeding will update the table data to show Delta
                          Relative to Previous Period (DRR) by default.
                        </div>
                      </div>
                    </div>
                    <div className="font-inter justify-end items-start gap-4 inline-flex">
                      <div
                        onClick={() => {
                          setDrrPopup(false);
                        }}
                        className="justify-start items-center gap-2 cursor-pointer flex"
                      >
                        <div className="font-inter px-[15px] py-1 bg-white rounded-sm shadow border border-zinc-300 justify-center items-center gap-2.5 flex">
                          <div className="font-inter text-center text-black/opacity-90 text-sm  leading-snug">
                            Cancel
                          </div>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          setVal("DRR");
                          setcheck(true);
                          setDrrPopup(false);
                        }}
                        className="justify-start items-center gap-2 flex cursor-pointer"
                      >
                        <div className="font-inter px-[15px] py-1 blinkit_btn rounded-sm shadow border justify-center items-center gap-2 flex">
                          <div className="font-inter text-center text-white text-sm  leading-snug">
                            Confirm
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {openNamePopup && (
        <DialogBox
          title={"Save View"}
          platform="blinkit"
          onAccept={saveColData}
          onCancel={() => {
            setOpenNamePopup(false);
            setDuplicateError(false);
          }}
          buttonName={"Save"}
        >
          {
            <div>
              <p> Name</p>
              <input
                type="text"
                className="border w-full h-10 mt-1 rounded p-2"
                onChange={(e) => setViewName(e.target.value)}
              />
              {duplicateViewError !== false && (
                <p className="text-red-500 justify-center text-sm">
                  {duplicateViewError}
                </p>
              )}
            </div>
          }
        </DialogBox>
      )}
    </>
  );
};
export default BlinkitCampaign;
