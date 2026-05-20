/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useCallback } from "react";
import _ from "lodash";
import { FILTERACTION } from "../../../common-components/MultiFilter/FilterConstant";
import DashboardGraph from "../../DashboadGraph";
import Tabbtn from "../Tabbtn";
import CampaigntableHeader from "./CampigntableHeader";
import { addDays } from "date-fns";
import FlipkartCampTable from "./FlipkartCampTable";
import ToggleButton from "../../../common-components/toggle-button/CampToggle";
import {
  _GET,
  _POST,
  _DELETE,
  _PATCH,
} from "../../../../services/axios.method";
import DatePicker from "../../../DatePicker";
import CompareDatePicker from "../../../DatePicker/compareDatePicker";
import { defaultCompareDateBlinkit } from "../../../../utils/helpers";
import MultiSearch from "../../../common-components/MultiSearch/MultiSearch";
import { Headerbtn } from "../../../common-components/headerButton/headerButton";
import {
  GET_ACCOUNTS,
  CAMPAIGN_GRAPH_API_URL,
  GET_DATA_SYNC_STATUS_URL,
  graphMetricsFK,
  graphMappingFK,
  COMP_DATE,
  ALL_COMP_DATE,
  PERMISSIONS,
  SAVE_COLUMN,
} from "../../../../utils/constants";
// import CustomizeDropDown from "../../../common-components/flipkart/CustomizeDropDown";
import { useDispatch, useSelector } from "react-redux";
import SaveSearchPopUp from "../../../common-components/MultiSearch/saveSearchPopUp";
import {
  saveSearch,
  getSavedSearchList,
} from "../../../../redux/action-creator/campaignSearchAction";
import {
  campaignSearchHeaders,
  keywordSearchHeaders,
  adGroupSearchHeaders,
  fsnSearchHeaders,
  placementSearchHeaders,
  creativeSearchHeaders,
} from "../../../../utils/constants";
import Toast from "../../../common-components/toast";
import ActionType from "../../../../redux/types";
import {
  convertDate,
  defaultDateRange,
  hasFilter,
  saveLocalStorageAccounts,
  getLocalStorageAccounts,
} from "../../../../utils/helpers";
// import { _POST } from "../../../../services/axios.method";
import { getWallletBalance } from "../../../../redux/action-creator/sideBarAction";
import {
  setExpandTable,
  setToastMessageHandler,
} from "../../../../redux/action-creator/commonAction";
import { trackCampaignManagerTabs } from "../../../../analytics/EventController";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Popup from "../../../common-components/Popups/Popup";
import CustomizeColPopup from "../../../common-components/CustomizeColumns/CustomizeColPopup";
import CustomizeColBtn from "../../../common-components/headerButton/CustomizeColBtn";
import CustomSelectNew from "../../../common-components/CustomSelectNew";
import WhenPermitted from "../../../common-components/WhenPermitted";
import MultiFilter from "../../../common-components/MultiFilter/MultiFilter";
import { flipkartFilterArr } from "../../../common-components/MultiFilter/FilterConstant";
import DialogBox from "../../../common-components/dialogBox.js";
// import "../../multiSelectFlipkart.css"

const FlipkartCampaign = () => {
  const dateFilters = defaultDateRange();
  const compareFilters = defaultCompareDateBlinkit();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  // const [dateRange, setDateRange] = React.useState([
  //   {
  //     startDate: addDays(new Date(), -7),
  //     endDate: new Date(),
  //     key: "selection",
  //   },

  // ]);
  const [dateRange, setDateRange] = React.useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]);
  const [drrPopup, setDrrPopup] = useState(false);
  const [compDateRange, setCompDateRange] = useState([
    {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [manual_compare_date, setManual_compare_date] = useState({});
  const [flipkartArray, setFlipkartArray] = useState(flipkartFilterArr);
  const tags = useSelector(
    (state) =>
      _.map(state?.TagReducer?.tagData, ({ tag_name, _id }) => ({
        tag_name,
        tag_id: _id,
      })) || []
  );
  const [check, setcheck] = useState(false);
  const [val, setVal] = React.useState("absolute");
  const [showError, setShowError] = useState(false);
  const userPermissions = useSelector(
    (state) => state?.permissionsReducer || []
  );
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CAMPAIGN_ACTIONS,
    platform: "instamart",
  });

  const [tempDate, setTempDate] = React.useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]);

  const [viewName, setViewName] = useState();
  const [colFetch, setColFetch] = useState(false);
  const [openNamePopup, setOpenNamePopup] = useState(false);
  const [updateColId, setColUpdateId] = useState();
  const [buttonName, setButtonName] = useState("Save");
  const [duplicateViewError, setDuplicateError] = useState(false);
  const user_id = localStorage.getItem("user_id");
  const username = localStorage.getItem("name");
  const client_id = localStorage.getItem("client_id");

  const [calState, setCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });
  useEffect(() => {
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
    dashboardApi();
  }, []);

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

  useEffect(() => {
    if (_.size(tags)) {
      const tagFilter = flipkartArray.find((ele) => ele.key === "tags");
      tagFilter.children = [];
      const updatedArray = flipkartArray.map((ele) => {
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
      setFlipkartArray(updatedArray);
    }
  }, [JSON.stringify(tags)]);

  const onValChange = () => {
    if (check) {
      setVal("Absolute");
    } else {
      setVal("DRR");
    }
    setcheck(!check);
  };

  async function onCompChangeDate(item) {
    let compDateRanges = compDateRange[0];
    let tempState = [{ ...compDateRanges, ...item.selection }];
    setCompDateRange([...tempState]);
  }

  const [compCalState, setCompCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });
  const [compDates, setCompDates] = useState([]);
  const [compareId, setCompareId] = useState("1");
  const adjustIconRef = useRef(null);
  const [account, setAccount] = useState();
  const [activeCards, setActiveCards] = useState([]);
  const [graphFilters, setGraphFilters] = useState(["spend", "orders"]);
  const [graphFilterOne, setGraphFilterOne] = useState("spend");
  const [graphFilterTwo, setGraphFilterTwo] = useState("orders");
  const [showFilter, setShowFilter] = useState(false);
  const [saveSearchModal, setSaveSearchModal] = useState(false);
  const [dateGrouping, setDateGrouping] = useState("daily");
  const [brandDataListing, setBrandDataListing] = useState([]);
  const [ShowTab, setShowTab] = useState("campaign");
  // const [platformId, setPlatformId] = useState("123");
  const [platformId, setPlatformId] = useState();
  const [filters, setFilters] = useState({ campaign: [], keyword: [] });
  const [clearSearch, setClearSearch] = useState(false);
  const [btopen, setisbtopen] = useState(false);
  const [callApi, setCallApi] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [dateName, setDateName] = useState("Daily");
  const [savedSearch, setSavedSearch] = useState({
    key: "saved_search",
    label: "Saved Search",
    selectable: false,
    //   {
    //     key: 'saved_search-Search_1',
    //     label: 'Search 1',
    //     data: '{"name_id":[{"pkey":"name_id","key":"campaign_name","condition":"contains","value":"Demo"},{"pkey":"name_id","key":"ad_group_name","condition":"contains","value":"V1"}],"campaign_m":[],"keyword_m":[],"ad_group_m":[],"fsn_m":[],"creative_m":[],"placement_m":[]}',
    //   },
    //   {
    //     key: 'saved_search-Search2',
    //     label: 'Search 2',
    //     data: 'test',
    //   }
    // ]
  });
  const { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  useEffect(() => {
    if (hasFilter(filters)) {
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [filters]);
  useEffect(() => {
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  }, [dateRange, account]);

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

  async function deleteComp(id) {
    try {
      await _DELETE(COMP_DATE + `/${id}`);
      await loadCompData();
    } catch (e) {
      console.error(e);
    }
  }

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

  // const filterdata = [
  //   {
  //     label: "Spends",
  //     value: "spend",
  //   },
  //   {
  //     label: "Views",
  //     value: "views",
  //   },
  //   {
  //     label: "Clicks",
  //     value: "clicks",
  //   },
  //   {
  //     label: "CVR",
  //     value: "cvr",
  //   },
  //   {
  //     label: "CTR",
  //     value: "ctr",
  //   },
  //   {
  //     label: "CPC",
  //     value: "cpc",
  //   },
  //   {
  //     label: "Sales",
  //     value: "total_revenue",
  //   },
  //   {
  //     label: "Orders",
  //     value: "orders",
  //   },
  //   {
  //     label: "ROAS",
  //     value: "total_roas",
  //   },
  //   {
  //     label: "AOV",
  //     value: "aov",
  //   },
  //   {
  //     label: "PPV",
  //     value: "total_ppv",
  //   },
  //   {
  //     label: "Direct Sales",
  //     value: "direct_revenue",
  //   },
  //   {
  //     label: "Direct Orders",
  //     value: "units_sold_direct",
  //   },
  //   {
  //     label: "Direct ROAS",
  //     value: "direct_roas",
  //   },
  //   {
  //     label: "Direct AOV",
  //     value: "direct_aov",
  //   },
  //   {
  //     label: "Direct PPV",
  //     value: "ppv_direct_click",
  //   },
  //   {
  //     label: "Indirect Sales",
  //     value: "indirect_revenue",
  //   },
  //   {
  //     label: "Indirect Orders",
  //     value: "units_sold_indirect",
  //   },
  //   {
  //     label: "Indirect ROAS",
  //     value: "indirect_roas",
  //   },
  //   {
  //     label: "Indirect AOV",
  //     value: "indirect_aov",
  //   },
  //   {
  //     label: "Indirect PPV",
  //     value: "ppv_indirect_click",
  //   },
  // ];
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
      //console.log(data, "data123");
      search.children = data;
      //console.log(search, "search123");
      setSavedSearch({ ...search });
    });
    trackCampaignManagerTabs(ShowTab); // To Track the campaign manager tabs
  }, []);
  const [showHeader, setShowHeader] = React.useState([
    ...campaignSearchHeaders,
  ]);
  const [filterHeader, setFilterHeader] = React.useState([]);

  // const [previousValue, setPreviousValue] = React.useState([
  //   ...campaignSearchHeaders,
  // ]);
  const getTabData = async (name, init = false) => {
    trackCampaignManagerTabs(name); // To Track the campaign manager tabs
    if (name === ShowTab && init === false) {
      return false;
    }
    let headers = campaignSearchHeaders;
    if (name === "campaign") {
      headers = campaignSearchHeaders;
    } else if (name === "adgroup") {
      headers = adGroupSearchHeaders;
    } else if (name === "keyword") {
      headers = keywordSearchHeaders;
    } else if (name === "fsn") {
      headers = fsnSearchHeaders;
    } else if (name === "placement") {
      headers = placementSearchHeaders;
    } else if (name === "creative") {
      headers = creativeSearchHeaders;
    }

    setShowTab(name);
    setShowHeader(headers);
    setShowDropDown(false);

    //console.log(filters, "filters from the tabs");
  };

  function applySearchFilter(sFilters, current) {
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
    let apiFilter = {};
    let tab = "";
    // console.log(sFilters, "<< s filters", current, "<< current ");
    apiFilter = { ...sFilters };

    if (
      current === "campaign_m" ||
      current === "campaign_name" ||
      current === "campaign_id" ||
      current === "tags" ||
      current === "segment" ||
      current === "flipkart_campaign_type" || //New multi filter pass filter_campaign_type instead of segment
      current === "platform" ||
      current === "campaign_status" ||
      current === "campaign_budget_type"
    ) {
      apiFilter["tags"] = sFilters["tags"];
      apiFilter["campaign_m"] = sFilters["campaign_m"];
      apiFilter["segment"] = sFilters["segment"];
      apiFilter["segment"] = sFilters["flipkart_campaign_type"];
      apiFilter["platform"] = sFilters["platform"];
      apiFilter["campaign_status"] = sFilters["campaign_status"];
      apiFilter["campaign_budget_type"] = sFilters["campaign_budget_type"];
      let fValues = getFilterValue(
        ["campaign_name", "campaign_id", "tag_name"],
        sFilters
      );
      let otherFilters = {};
      if (
        [
          "segment",
          "flipkart_campaign_type",
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
      //console.log(fValues, "apiFilter");
    } else if (current === "keyword_m" || current === "keyword") {
      apiFilter["keyword_m"] = sFilters["keyword_m"];
      let fValues = getFilterValue(["keyword"], sFilters);
      //console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "keyword";
    } else if (
      current === "ad_group_m" ||
      current === "ad_group_id" ||
      current === "ad_group_name"
    ) {
      apiFilter["ad_group_m"] = sFilters["ad_group_m"];
      let fValues = getFilterValue(["ad_group_name", "ad_group_id"], sFilters);
      //console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "adgroup";
    } else if (
      current === "fsn_m" ||
      current === "fsn_id" ||
      current === "fsn_name"
    ) {
      apiFilter["fsn_m"] = sFilters["fsn_m"];
      let fValues = getFilterValue(["fsn_id", "fsn_name"], sFilters);
      //console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "fsn";
      //console.log("fsn_m" || current === "fs'n_id" || current === "fsn_name");
    } else if (current === "creative_m") {
      apiFilter["creative_m"] = sFilters["creative_m"];
      let fValues = getFilterValue([], sFilters);
      //console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "creative";
      //console.log("creative_m");
    } else if (current === "placement_m") {
      apiFilter["placement_m"] = sFilters["placement_m"];
      let fValues = getFilterValue([], sFilters);
      //console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "placement";
    }

    let checkbox = { ...selectedCheckBox };
    if (tab.trim().length > 0) {
      let priority = {
        campaign: 2,
        adgroup: 1,
        fsn: 0,
        placement: 0,
        creative: 0,
        keyword: 0,
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
      //console.log(filters, "filters12");
      if (clearSearch === false) {
        setFilters({ ...filters });
      } else {
        setFilters([]);
      }
    }

    // setShowHeader(showHeader)
    // //console.log(JSON.stringify(sFilters), "filters-----", apiFilter, current);
  }
  // function getFilterValue(keys, filters) {
  //   console.log(keys, "<< keys", filters, "<<filters");
  //   let value = {};
  //   if (filters.name_id.length > 0) {
  //     filters.name_id.map((val) => {
  //       if (keys.indexOf(val.key) > -1) {
  //         value[val.key] = val;
  //       }
  //     });
  //   } else if (filters.segment.length > 0) {
  //     filters.segment.map((val) => {
  //       if (keys.indexOf(val.key) > -1) {
  //         value[val.key] = val;
  //       }
  //     });
  //   } else if (filters.platform.length > 0) {
  //     filters.platform.map((val) => {
  //       if (keys.indexOf(val.key) > -1) {
  //         value[val.key] = val;
  //       }
  //     });
  //   } else if (filters.campaign_status.length > 0) {
  //     filters.campaign_status.map((val) => {
  //       if (keys.indexOf(val.key) > -1) {
  //         value[val.key] = val;
  //       }
  //     });
  //   }

  //
  //   console.log(value, "valueee");
  //   return value;
  // }

  function getFilterValue(keys, filters) {
    let value = [];
    let keyName = "";
    filters.name_id.map((val) => {
      //console.log(val, "<<< val");
      if (keys.indexOf(val.key) > -1) {
        value.push(val);
        keyName = val.key;
        //console.log(val, "inside");
      }
    });
    //console.log(value, "<<<< values");
    return { [keyName]: value };
  }

  const [graphData, setGraphData] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [checkboxData, setCheckboxData] = useState([]);
  const [download, setDownload] = useState(0);
  //const [csvHeaders,setCsvHeaders] = useState([]);

  // const cancelFilter = () => {
  //   //setShowHeader([...showHeader]);
  //   setShowHeader(previousValue);
  //   setShowFilter(false);
  // };

  // const applyFilter = React.useCallback(() => {
  //   let updatedIds = {};
  //   updatedIds["placement"] = [];
  //   dispatch({
  //     type: ActionType.CHECKBOX,
  //     payload: { ...selectedCheckBox, ...updatedIds },
  //   });

  //   setShowHeader(
  //     showHeader.map((checkbox) =>
  //       checkbox.checked === true
  //         ? { ...checkbox, showCol: true }
  //         : { ...checkbox, showCol: false }
  //     )
  //   );
  //   showHeader.map((item) => {
  //     if (
  //       (item.value === "keyword" ||
  //         item.value === "campaign_name" ||
  //         item.value === "ad_group_name" ||
  //         item.value === "ad_group__id" ||
  //         item.value === "segment" ||
  //         item.value === "platform") &&
  //       item.checked
  //     ) {
  //       setCallApi(true);
  //     }
  //   });
  //   setShowFilter(false);
  // }, [showHeader]);

  const saveSearchInit = async (name) => {
    let payload = {
      filters: filters,
      name: name,
      user_id: 1,
      media_type: "flipkart",
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
      media_type: "flipkart",
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
      media_type: "flipkart",
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
    dashboardApi();
  };

  const cancelDate = () => {
    let dateRangePrev = dateRange[0];

    setTempDate([{ ...dateRangePrev }]);
  };

  const handleSelectedData = useCallback((data) => {
    setCheckboxData(data);
    setShowDropDown(false);
  }, []);

  useEffect(() => {
    // console.error(filters,"filterrrr")
  }, [filters]);

  function setPlatformFilter(e) {
    setPlatformId(e.target.value);
    // Check if "default_filter" exists in localStorage and initialize it if it doesn't
    let filters = JSON.parse(localStorage.getItem("default_filter")) || {};

    // Check if "flipkart" exists in filters and initialize it if it doesn't
    if (!Object.prototype.hasOwnProperty.call(filters, "flipkart")) {
      filters["flipkart"] = {};
    }
    // let filters = JSON.parse(localStorage.getItem("default_filter"));
    // console.log("account::::::::::::filters", filters);
    filters["flipkart"]["single"] = e.target.value;
    localStorage.setItem("default_filter", JSON.stringify(filters));
    // console.log("account::::::::::::", e.target.value);
    // console.log(account,e.target.value);
    let accountName = brandDataListing.find(
      ({ platform_id }) => platform_id === e.target.value
    );
    // console.log("accountName123", accountName.value);
    setAccount(accountName?.value);
    saveLocalStorageAccounts([accountName?.value]);
    dispatch(getWallletBalance(accountName?.value));
  }

  // React.useEffect(() => {
  //   if (brandDataListing.length > 0 && platformId) dataSyncStatus();
  // }, [platformId]);

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
          platform: "flipkart",
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
  const handleApply = () => {
    setShowHeader(filterHeader);
    setShowFilter(false);
    setButtonName("Save");
  };
  async function dashboardApi() {
    let post = {
      filters: graphFilters,
      dateGrouping: dateGrouping,
      start_date: convertDate(dateRange[0]?.startDate),
      end_date: convertDate(dateRange[0]?.endDate),
      platform_id: platformId,
      tab_name: ShowTab,
    };
    if (selectedCheckBox[ShowTab]?.length && graphMappingFK[ShowTab]) {
      if (Array.isArray(graphMappingFK[ShowTab])) {
        let tempArray = [];
        selectedCheckBox[ShowTab].forEach((a) => {
          let obj = {};
          graphMappingFK[ShowTab].forEach((b) => {
            obj[b] = a[b];
          });
          tempArray.push(obj);
        });
        post[ShowTab] = tempArray;
      } else {
        post[ShowTab] = selectedCheckBox[ShowTab].map(
          (item) => item[graphMappingFK[ShowTab]]
        );
      }
    }

    if (selectedCheckBox["campaign"]?.length) {
      post.campaign_id = selectedCheckBox["campaign"].map(
        (item) => item[graphMappingFK["campaign"]]
      );
    }
    if (platformId) {
      let res = await _POST(CAMPAIGN_GRAPH_API_URL, post);

      if (res?.data?.data) {
        setGraphData(res.data.data);
      }
    }
  }

  async function checkFilter() {
    const val1 = filterData.some((item) => item.value == graphFilterOne);
    const val2 = filterData.some((item) => item.value == graphFilterTwo);
    if (!val1 || !val2) {
      if (
        ShowTab === "fsn" ||
        ShowTab === "keyword" ||
        ShowTab === "placement"
      ) {
        setGraphFilterOne("total_revenue");
      } else {
        setGraphFilterOne("revenue");
      }
      setGraphFilterTwo("spend");
    }
  }

  useEffect(() => {
    checkFilter();
    // console.error(filterData.length)
  }, [filterData]);

  async function updateFilterData(filter) {
    const data = filter
      .filter((item) => graphMetricsFK.includes(item.value))
      .map((item) => ({
        label: item.title,
        value: item.value,
      }));
    setFilterData(data);
  }

  useEffect(() => {
    updateFilterData(showHeader);
    // console.error(filterData,"ffiilltteerr DDaattaa")
  }, [showHeader]);

  useEffect(() => {
    dashboardApi();
  }, [...graphFilters, dateGrouping, platformId, ShowTab, selectedCheckBox]);

  useEffect(() => {
    if (!calState.fullCalender) dashboardApi();
  }, [dateRange[0]?.startDate, dateRange[0]?.endDate]);

  const accountNames = async () => {
    try {
      const result = await _GET(GET_ACCOUNTS);
      const data = result.data.data.result;

      const accounts = data
        // .filter((x) => x._id.account && x._id.platform_id)
        .map((item) => ({
          label: item._id.account,
          value: item._id.account,
          account_id: item._id.account_id,
          platform_id: item._id.platform_id,
        }));
      let accountsFilter = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
        let firstAccount = savedAccounts[0];
        let filterAccount = accounts.find((acc) => acc.value === firstAccount);
        if (filterAccount) {
          accountsFilter = [filterAccount];
          saveLocalStorageAccounts([accountsFilter[0]?.value]);
        } else {
          saveLocalStorageAccounts([accountsFilter[0]?.value]);
        }
      } else {
        saveLocalStorageAccounts([accountsFilter[0]?.value]);
      }
      setAccount(accountsFilter[0]?.value);
      setBrandDataListing(accounts);
      setPlatformId(accountsFilter[0].platform_id);
      // setPlatformId(filters["flipkart"]["single"]);
      // let accountName = accounts?.find(
      //   ({ platform_id }) => platform_id === filters["flipkart"]["single"]
      // );
      // console.log("inside", accountName.value);
      dispatch(getWallletBalance(accountsFilter[0].value));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accountNames();
    dataSyncStatus();
  }, []);

  const dataSyncStatus = async () => {
    // console.log(platformId);
    let platformInfo = brandDataListing.find(
      ({ platform_id }) => platform_id === platformId
    );
    if (platformInfo) {
      const res = await _POST(GET_DATA_SYNC_STATUS_URL, {
        platformInfo,
        type: "campaign",
      });
      console.error(res);
    }
  };

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

  const childRef = useRef();

  const changeTagsData = (compaignId, TagsId) => {
    childRef.current?.getAlert(compaignId, TagsId);
  };

  useEffect(() => {
    dispatch(setExpandTable(false));
  }, []);

  return (
    <>
      <div className="">
        <Toast></Toast>
        <section className=" flex-nowrap p-4 bg-white">
          <div className=" flex-col w-full">
            <div className="flex justify-between items-center">
              <div className="flex w-full gap-2">
                <div className="flipkart__selectfilter pr-4 ">
                  <select
                    className="campaignselect outline-none"
                    onChange={setPlatformFilter}
                  >
                    {brandDataListing.map((row, key) => {
                      return (
                        <option
                          key={key}
                          selected={row.platform_id === platformId}
                          // selected={row.value === "Veet"}
                          value={row.platform_id}
                        >
                          {row.label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flipkart__calander ml-1">
                  <DatePicker
                    platform={"flipkart"}
                    onChangeDate={onChangeDate}
                    state={tempDate}
                    dashboard={"campmanage"}
                    setState={setDateRange}
                    calState={calState}
                    setCalState={setCalState}
                    position={"right"}
                    top
                    applyDate={() => applyDate(true)}
                    cancelDate={cancelDate}
                    className="border"
                  />
                </div>
                <div className="flipkart__calander" style={{ width: "23%" }}>
                  <CompareDatePicker
                    className="h-3"
                    position={"right"}
                    platform={"flipkart"}
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
                        className="campaignselect outline-none"
                        onChange={(e) => handleSelectChange(e.target.value)}
                      >
                        {filterData?.map((item) => {
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
                        options={filterData}
                        value={graphFilterOne}
                        disableValue={graphFilterTwo}
                        onChange={handleSelectChange}
                        platform={"flipkart"}
                        className="py-[5px] "
                      />
                    </div>
                    <div className="col_3  mr-4">
                      {/* <select
                        className="campaignselect outline-none"
                        onChange={(e) => handleSecondChange(e.target.value)}
                      >
                        {filterData?.map((item) => {
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
                        options={filterData}
                        value={graphFilterTwo}
                        disableValue={graphFilterOne}
                        onChange={handleSecondChange}
                        platform={"flipkart"}
                        className="py-[5px] "
                      />
                    </div>
                    <div className=" filter-dropdown open relative pr-1">
                      <button
                        ref={adjustIconRef}
                        onClick={(e) => {
                          handleDaysChange(e.target.value);
                        }}
                        className=" btn btn-primary dropdown-toggle  dropdown__g-param flipkartRing"
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
                                  >
                                    <button
                                      className="periodselector-li"
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
                  <div className=" pt-4">
                    <div className="flipkart__graphcard">
                      <DashboardGraph
                        activeCards={activeCards}
                        setActiveCards={setActiveCards}
                        graphFilters={graphFilters}
                        showDetails={true}
                        filterdata={filterData}
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
        <div className="pt-5">
          <div className="col_12">
            <div className="mb-5">
              <MultiFilter
                savedSearch={savedSearch}
                arr={flipkartArray}
                applySearchFilter={applySearchFilter}
                handleSaveFilters={handleSaveMultiSearch}
                platform="flipkart"
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
                setClearSearch={() => setClearSearch(false)}
                mediaName="flipkart"
              />
             <WhenPermitted platform="flipkart" permission={PERMISSIONS.CAMPAIGN_ACTIONS}> 
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
                className="px-4 rounded-md  py-2 border bg-white campaignbtn--auto"
                style={{
                  marginLeft: "10px",
                  cursor: showError ? "not-allowed" : "pointer",
                }}
                disabled={showError}
              >
                <div className="row justify-center items-center">
                  <div>Save</div>
                </div>
              </button>
              </WhenPermitted>
              {saveSearchModal === true && (
                <SaveSearchPopUp
                  showPopUp={saveSearchModal}
                  setSearchName={(name) => {
                    saveSearchInit(name);
                  }}
                  setSaveSearchModal={(e) => setSaveSearchModal(e)}
                  platform={"flipkart"}
                />
              )}
              <button
                type="submit"
                className="rounded-md campaignbtn--auto"
                onClick={() => {
                  setClearSearch(true);
                }}
              >
                <div className="row items-center justify-center">
                  <div className="px-0.5">
                    <img src="/assets/images/clear-icon.svg" alt="" />
                  </div>
                  <div>Clear</div>
                </div>
              </button>
            </div> */}
            {/* {showError && (
              <div className="errorText -mt-4">Please select the filter!</div>
            )} */}
          </div>
          <div className="row">
            <div className="col campaign__tablewrap bg-white">
              <div className="campaign__navtab relative max-w-[1420px]">
                <Tabbtn
                  title="Campaign"
                  imgsrc={
                    ShowTab === "campaign"
                      ? "/assets/images/megap.svg"
                      : "/assets/images/mp.svg"
                  }
                  onClick={() => getTabData("campaign")}
                  active={ShowTab === "campaign"}
                  platform={"flipkart"}
                />
                <Tabbtn
                  title="Ad Group"
                  imgsrc={
                    ShowTab === "adgroup"
                      ? "/assets/images/layout-dashboard.svg"
                      : "/assets/images/fsn-icon.svg"
                  }
                  onClick={() => getTabData("adgroup")}
                  active={ShowTab === "adgroup"}
                  platform={"flipkart"}
                />
                <Tabbtn
                  title="FSN"
                  imgsrc={
                    ShowTab === "fsn"
                      ? "/assets/images/terminalactiveicon.svg"
                      : "/assets/images/terminal-square.svg"
                  }
                  onClick={() => getTabData("fsn")}
                  active={ShowTab === "fsn"}
                  platform={"flipkart"}
                />
                <Tabbtn
                  title="Placement"
                  imgsrc={
                    ShowTab === "placement"
                      ? "/assets/images/Fact.svg"
                      : "/assets/images/fc.svg"
                  }
                  onClick={() => getTabData("placement")}
                  active={ShowTab === "placement"}
                  platform={"flipkart"}
                />
                <Tabbtn
                  title="Keyword"
                  imgsrc={
                    ShowTab === "keyword"
                      ? "/assets/images/kb.svg"
                      : "/assets/images/keyboard.svg"
                  }
                  onClick={() => getTabData("keyword")}
                  active={ShowTab === "keyword"}
                  platform={"flipkart"}
                />
                <Tabbtn
                  title="Creative"
                  imgsrc={
                    ShowTab === "creative"
                      ? "/assets/images/image-plus.svg"
                      : "/assets/images/creative.svg"
                  }
                  onClick={() => getTabData("creative")}
                  active={ShowTab === "creative"}
                  platform={"flipkart"}
                />
                {(!selectedCheckBox?.campaign ||
                  selectedCheckBox?.campaign?.length === 0) && (
                  <div className="text-[11px] absolute right-10 pt-3 pl-1">
                    {/* <button
                      className="px-4 rounded-md right-10 py-2 border bg-white campaignbtn"
                      onClick={dataSync}
                    >
                      Refresh
                    </button> */}
                  </div>
                )}
                {/* {selectedCheckBox?.campaign?.length > 0 && (
                  <div className="text-[11px] absolute right-0 pt-3 pl-1">
                    <span className="text-blue-500 font-bold">*</span>
                    Selected campaigns: ({selectedCheckBox?.campaign?.length})
                  </div>
                )} */}
              </div>
            </div>
            <div className="row  justify-between pb-4  bg-white px-4">
              <div className="">
                <CampaigntableHeader
                  showDropDown={showDropDown}
                  setShowDropDown={setShowDropDown}
                  onEditButtonClick={ShowTab}
                  tableData={selectedCheckBox[ShowTab] || []}
                  tabName={ShowTab}
                  changeTagsData={changeTagsData}
                  headers={showHeader}
                  account={account}
                />
              </div>
              <div className="col">
                <div
                  className="row justify-end items-center"
                  // style={{
                  //   marginTop: hasPermission ? "0" : "-60px",
                  // }}
                >
                  <div className="relative mt-4 mx-1">
                    {/* <CustomizeDropDown
                      title="Customize column"
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
                    /> */}
                    {/* <button
                      className={
                        "campaignreport__btn flex !rounded-md items-center"
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

                    {selectedCheckBox[ShowTab]?.length > 0 ? (
                      ""
                    ) : (
                      <CustomizeColBtn
                        className="hover:bg-blue-500"
                        onClick={() => setShowFilter(!showFilter, "button")}
                      />
                    )}

                    {showFilter && (
                      <Popup
                        platform="flipkart"
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
                            style: "bg-blue-500",
                          },
                        ]}
                      >
                        <CustomizeColPopup
                          showHeader={showHeader}
                          setFilterHeader={setFilterHeader}
                          buttonStyleCss="bg-[#0081F7] hover:bg-[#0980ed]"
                          dropDownCss="hover:bg-[#0081F7]"
                          searchCss="outline-blue-500"
                          platform={"flipkart"}
                          tabName={ShowTab}
                          buttonName={handleButtonName}
                          refetch={colFetch}
                        />
                      </Popup>
                    )}
                  </div>
                  {selectedCheckBox[ShowTab]?.length > 0 ? (
                    ""
                  ) : (
                    <>
                      {" "}
                      <div>
                        <Headerbtn
                          disabled={download === 1}
                          imgsrc="/assets/images/hard-disk.png"
                          hoverImgSrc="/assets/images/hard-disk-white.svg"
                          // title={download === 1 ? "Downloading..." : "Export"}
                          style={{ width: "14px" }}
                          download={download}
                          onClick={() => {
                            if (download == 1) {
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
                          campaignManager
                          platform={"flipkart"}
                        ></ToggleButton>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full p-4 bg-white">
              {platformId && (
                <FlipkartCampTable
                  filters={filters}
                  dateRange={dateRange}
                  name={ShowTab}
                  tab={ShowTab}
                  headers={showHeader}
                  handleSelectedData={handleSelectedData}
                  // checkboxData={selectedCheckBox[ShowTab] || []}
                  checkboxData={selectedCheckBox}
                  download={download}
                  setDownload={setDownload}
                  platformId={platformId}
                  callApi={callApi}
                  setCallApi={setCallApi}
                  ref={childRef}
                  calState={calState}
                  compDateRange={compDateRange}
                  setCompCalState={setCompCalState}
                  compareId={compareId}
                  manual_compare_date={manual_compare_date}
                  editMode={editMode}
                  drr={check}
                  drrPopup={drrPopup}
                  setDrrPopup={setDrrPopup}
                  account={account}
                />
              )}
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
                          <div className="font-inter px-[15px] py-1 flipkart_btn rounded-sm shadow border justify-center items-center gap-2 flex">
                            <div className="font-inter text-center text-white text-sm  leading-snug">
                              Confirm
                            </div>
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
          platform="flipkart"
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
export default FlipkartCampaign;
