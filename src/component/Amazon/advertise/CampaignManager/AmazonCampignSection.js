/* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { FILTERACTION } from "../../../common-components/MultiFilter/FilterConstant";

import { addDays } from "date-fns";
// import MultiSearch from "../../../common-components/MultiSearch/MultiSearch";
import { Headerbtn } from "../../../common-components/headerButton/headerButton";
import AmazonCampaignTable from "./AmazonCampaignTable";
// import CustomizeDropDown from "../../../common-components/flipkart/CustomizeDropDown";
import { useDispatch, useSelector } from "react-redux";
import SaveSearchPopUp from "../../../common-components/MultiSearch/saveSearchPopUp";
import ToggleButton from "../../../common-components/toggle-button/CampToggle";
import {
  saveSearch,
  getSavedSearchList,
} from "../../../../redux/action-creator/campaignSearchAction";
import {
  fsnSearchHeaders,
  amazoncampaignheader,
  amazonadgroupheader,
  amazoncreativeheader,
  amazonkeywordheader,
  amazonplacementheader,
  graphMetrics,
  graphMapping,
  PERMISSIONS,
  SAVE_COLUMN,
  // AMAZON_s_COUNT,
  // headersData,
} from "../../../../utils/constants";
import { ALL_COMP_DATE, COMP_DATE } from "../../../../utils/constants";
import { _POST, _DELETE, _PATCH } from "../../../../services/axios.method";
import {
  amazonPortfolioheader,
  amazonAsinheader,
} from "../../../../utils/amazonConstants";
import Toast from "../../../common-components/toast";
import ActionType from "../../../../redux/types";
import {
  convertDate,
  defaultDateRange,
  hasFilter,
  saveLocalStorageAccounts,
} from "../../../../utils/helpers";
import DashboardGraph from "../../../flipkart/DashboadGraph";
import Tabbtn from "../../../flipkart/Advertising/Tabbtn";
// import MultiFilterAms from "./multisearch/MultiFilterAms";
// import AmazonProfileTable from "./AmazonProfileTable";
import DatePicker from "../../../DatePicker";
import CompareDatePicker from "../../../DatePicker/compareDatePicker";
import CustomSelect from "../../../common-components/CustomSelect";
import MultiSearch from "../../../common-components/MultiSearch/MultiSearch";
import { useCloseWhenClickOutside } from "../../../common-components/useCloseWhenClickOutside";
import AmazonCampaigntableHeader from "./AmazonCampaignTableHeader";
import CustomizeDropDown from "../../../common-components/flipkart/CustomizeDropDown";

import { dashboardAmazonGraph } from "../../../../services/dashboard";
import { trackCampaignManagerTabs } from "../../../../analytics/EventController";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { defaultCompareDateBlinkit } from "../../../../utils/helpers";
import Popup from "../../../common-components/Popups/Popup";
import CustomizeColPopup from "../../../common-components/CustomizeColumns/CustomizeColPopup";
import {
  setExpandTable,
  setToastMessageHandler,
} from "../../../../redux/action-creator/commonAction";
import CustomizeColBtn from "../../../common-components/headerButton/CustomizeColBtn";
import CustomSelectNew from "../../../common-components/CustomSelectNew";
import WhenPermitted from "../../../common-components/WhenPermitted";
import MultiFilter from "../../../common-components/MultiFilter/MultiFilter";
import { amazonFilterArr } from "../../../common-components/MultiFilter/FilterConstant";
import DialogBox from "../../../common-components/dialogBox.js";
// import "../../multiSelectAms.css"

const AmazonCampignSection = ({
  platform,
  account,
  selectedAccount,
  setSelectedAccount,
}) => {
  const dateFilters = defaultDateRange();
  const compareFilters = defaultCompareDateBlinkit();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const userPermissions = useSelector(
    (state) => state?.permissionsReducer || []
  );
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CAMPAIGN_ACTIONS,
    platform: "amazon",
  });
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
  const [calState, setCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });

  const [tempDate, setTempDate] = React.useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]);
  const [amazonArray, setAmazonArray] = useState(amazonFilterArr);
  const [check, setcheck] = useState(false);
  const [val, setVal] = React.useState("absolute");
  const [viewName, setViewName] = useState();
  const [updateColId, setColUpdateId] = useState();
  const tags = useSelector(
    (state) =>
      _.map(state?.TagReducer?.tagData, ({ tag_name, _id }) => ({
        tag_name,
        tag_id: _id,
      })) || []
  );
  // const [showCustom, setShowCustom] = useState(false);

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

  const [colFetch, setColFetch] = useState(false);
  const [compCalState, setCompCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });
  const [compareId, setCompareId] = useState("1");
  const [openNamePopup, setOpenNamePopup] = useState(false);
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

  const [compDates, setCompDates] = useState([]);
  useEffect(() => {
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
    loadCompData();
    // dashboardApi();
  }, []);

  useEffect(() => {
    if (_.size(tags)) {
      const tagFilter = amazonArray.find((ele) => ele.key === "tags");
      tagFilter.children = [];
      const updatedArray = amazonArray.map((ele) => {
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
      setAmazonArray(updatedArray);
    }
  }, [JSON.stringify(tags)]);
  // function hasFilter(obj) {
  //   for (const key in obj) {
  //     if (Object.prototype.hasOwnProperty.call(obj, key)) {
  //       const value = obj[key];

  //       if (Array.isArray(value) && value.length > 0) {
  //         return true;
  //       } else if (typeof value === "object" && hasFilter(value)) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

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

  const cancelDate = () => {
    let dateRangePrev = dateRange[0];

    setTempDate([{ ...dateRangePrev }]);
    //setTempDate([dateRange[0]]);
  };

  const [activeCards, setActiveCards] = useState([]);
  const [graphFilters, setGraphFilters] = useState(["spend", "sales"]);
  const [graphFilterOne, setGraphFilterOne] = useState("spend");
  const [graphFilterTwo, setGraphFilterTwo] = useState("sales");
  // const [isDisabledSaveSearch, setIsDisabledSaveSearch] = useState(true);
  const [showError, setShowError] = React.useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [saveSearchModal, setSaveSearchModal] = useState(false);
  const [dateGrouping, setDateGrouping] = useState("daily");
  const [dateName, setDateName] = useState("Daily");
  const [isVisible, setIsVisible] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [ShowTab, setShowTab] = useState("portfolio");

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  // const [platformId, setPlatformId] = useState(
  //   account.length > 0 ? account.value : []
  // );
  const [filters, setFilters] = useState({ campaign: [], keyword: [] });
  const [clearSearch, setClearSearch] = useState(false);
  const [btopen, setisbtopen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [savedSearch, setSavedSearch] = useState({
    key: "saved_search",
    label: "Saved Search",
    selectable: false,
  });
  const [graphData, setGraphData] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showHeader, setShowHeader] = React.useState([
    ...amazonPortfolioheader,
  ]);
  const [filterHeader, setFilterHeader] = useState([]);
  const [download, setDownload] = useState(0);
  const [sort, setSorting] = useState({ spend: -1 });
  // console.log(ShowTab,"showtab CampaignSection")
  const { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  // eslint-disable-next-line no-unused-vars
  const [callApi, setCallApi] = useState(false);
  const [fromdashboardallcampaigns, setFromdashboardallcampaigns] =
    useState(true);

  const [buttonName, setButtonName] = useState("Save");

  React.useEffect(() => {
    let tab = searchParams.get("tab");

    // eslint-disable-next-line no-console
    // console.log("debugerrr searchParams", searchParams, tab);

    if (tab && fromdashboardallcampaigns) {
      setShowTab(tab);
      if (tab == "campaign") {
        setShowHeader(amazoncampaignheader);
      }
      setFromdashboardallcampaigns(false);
    }
  }, [searchParams]);

  //   if (hasFilter) {
  //     setShowError(false);
  //   }
  // }, [filters]);
  // const filterdata = [
  //   {
  //     label: "Spends",
  //     value: "spend",
  //   },
  //   {
  //     label: "Views",
  //     value: "impressions",
  //   },
  //   {
  //     label: "Clicks",
  //     value: "clicks",
  //   },
  //   {
  //     label: "Unit sold",
  //     value: "units_sold",
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
  //     value: "sales",
  //   },
  //   {
  //     label: "ACOS",
  //     value: "acos",
  //   },
  //   {
  //     label: "ROAS",
  //     value: "roas",
  //   },
  // ];
  const daydata = [
    {
      label: "Daily",
      value: "days",
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
  }, [graphFilterOne, graphFilterTwo, ShowTab]);
  // useEffect(()=>{
  //   if(filters.keyword.length){
  //     getTabData(ShowTab,true);
  //   }
  // },[filters]);
  React.useEffect(() => {
    trackCampaignManagerTabs(ShowTab);
  }, []);

  const getTabData = (name, init = false) => {
    trackCampaignManagerTabs(name); // To Track the campaign manager tabs
    if (name === ShowTab && init === false) {
      return false;
    }
    let headers = amazonPortfolioheader;
    if (name === "campaign") {
      headers = amazoncampaignheader;
    } else if (name === "portfolio") {
      headers = amazonPortfolioheader;
    } else if (name === "asin") {
      headers = amazonAsinheader;
    } else if (name === "adgroup") {
      headers = amazonadgroupheader;
    } else if (name === "keyword") {
      headers = amazonkeywordheader;
    } else if (name === "fsn") {
      headers = fsnSearchHeaders;
    } else if (name === "placement") {
      headers = amazonplacementheader;
    } else if (name === "creative") {
      headers = amazoncreativeheader;
    }
    setSorting({ spend: -1 });
    setShowTab(name);
    setShowHeader(headers);
    setShowDropDown(false);
  };
  // const funnelCount = async (campaign_ids) => {
  //   let campaignGrouping = checkGrouping();
  //   let adgroupGrouping = checkAdgroupGrouping();

  //   let payload = {
  //     campaign_ids,
  //     startDate: convertDate(dateRange[0]?.startDate),
  //     endDate: convertDate(dateRange[0]?.endDate),
  //     headers: showHeader,
  //     campaignGrouping,
  //     adgroupGrouping,
  //     account: selectedAccount,
  //     tabName: ShowTab,
  //   };
  //   let countData = await _POST(AMAZON_FUNNEL_COUNT, payload);
  //   // console.log("countDAta>>>>>>>>>>>>>", countData);
  //   dispatch({
  //     type: ActionType.AMAZON_CAMPAIGN_COUNT,
  //     payload: { ...countData.data.data },
  //   });
  //   dispatch({
  //     type: ActionType.TOTAL_PORTFOLIO,
  //     payload: countData.data.data?.portfolio,
  //   });
  //   dispatch({
  //     type: ActionType.TOTAL_CAMPAIGN,
  //     payload: countData.data.data?.camp,
  //   });
  //   dispatch({
  //     type: ActionType.TOTAL_AMS_ADGROUP_COUNT,
  //     payload: countData.data.data?.adgroup,
  //   });
  //   dispatch({
  //     type: ActionType.TOTAL_KEYWORD_COUNT,
  //     payload: countData.data.data?.keyword,
  //   });
  //   dispatch({
  //     type: ActionType.TOTAL_ASINS,
  //     payload: countData.data.data?.product,
  //   });
  //   dispatch({
  //     type: ActionType.TOTAL_PLACEMENTS,
  //     payload: countData.data.data?.placement,
  //   });
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
  const checkAdgroupGrouping = () => {
    let setGroupByAdgroup = false;
    showHeader.map((item) => {
      if (item.value === "ad_group_name") {
        // console.log("checkStatus", item.value, item.checked);
        setGroupByAdgroup = item.checked;
      }
    });
    return setGroupByAdgroup;
  };

  useEffect(() => {
    dispatch({
      type: ActionType.CAMPAIGN_TYPE,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (hasFilter(filters)) {
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [filters]);

  function applySearchFilter(sFilters, current) {
    dispatch({
      type: ActionType.AMAZON_CAMPAIGN_COUNT,
      payload: {},
    });

    // dispatch({
    //   type: ActionType.CHECKBOX,
    //   payload: { portfolio: [] },
    // });
    // setIsDisabledSaveSearch(false);
    let apiFilter = {};
    let tab = "";
    apiFilter = { ...sFilters };
    if (
      current === "campaign_m" ||
      current === "campaign_name" ||
      current === "tags" ||
      current === "campaign_id" ||
      current === "campaign_status" ||
      current === "amazon_campaign_type"
      // current === "campaign"
    ) {
      if (current === "amazon_campaign_type") {
        let amazon_campaign_type = sFilters?.amazon_campaign_type.map(
          (data) => data?.key
        );
        dispatch({
          type: ActionType.CAMPAIGN_TYPE,
          payload: amazon_campaign_type,
        });
      }
      // if (current === "campaign_m")
      apiFilter["campaign_m"] = sFilters["campaign_m"];
      let fValues = getFilterValue(
        [
          "campaign_name",
          "campaign_id",
          "status",
          "tag_name",
          "campaign_status",
          "amazon_campaign_type",
        ],
        sFilters
      );
      apiFilter = { ...apiFilter, ...fValues };
      tab = "campaign";
      // setCheckboxData([]);
    } else if (
      current === "portfolio" ||
      // current === "status" ||
      current === "portfolio_m"
    ) {
      // if (current === "portfolio_m")
      apiFilter["portfolio_m"] = sFilters["portfolio_m"];
      let fValues = getFilterValue(
        ["portfolio", "status", "portfolio_m"],
        sFilters
      );
      apiFilter = { ...apiFilter, ...fValues };
      tab = "portfolio";
    } else if (current === "keyword_m" || current === "keyword") {
      apiFilter["keyword_m"] = sFilters["keyword_m"];
      let fValues = getFilterValue(["keyword"], sFilters);
      // console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "keyword";
    } else if (
      current === "asin_m" ||
      // current === "ad_group_id" ||
      current === "asin"
    ) {
      apiFilter["asin_m"] = sFilters["asin_m"];
      let fValues = getFilterValue(["asin"], sFilters);
      // console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "asin";
    } else if (
      current === "ad_group_m" ||
      // current === "ad_group_id" ||
      current === "adgroupname"
    ) {
      apiFilter["ad_group_m"] = sFilters["ad_group_m"];
      let fValues = getFilterValue(["adgroupname"], sFilters);
      // console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "adgroup";
    }
    // else if (
    //   current === "fsn_m" ||
    //   current === "fsn_id" ||
    //   current === "fsn_name"
    // ) {
    //   apiFilter["fsn_m"] = sFilters["fsn_m"];
    //   let fValues = getFilterValue(["fsn_id", "fsn_name"], sFilters);
    //   // console.log(fValues, "fValues");
    //   apiFilter = { ...apiFilter, ...fValues };
    //   // tab = "fsn";
    //   // console.log("fsn_m" || current === "fsn_id" || current === "fsn_name");
    // }
    else if (current === "creative_m" || current === "creative") {
      apiFilter["creative_m"] = sFilters["creative_m"];
      let fValues = getFilterValue(["creative"], sFilters);
      // console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "creative";
      // console.log("creative_m");
    } else if (current === "placement_m" || current === "placement") {
      apiFilter["placement_m"] = sFilters["placement_m"];
      let fValues = getFilterValue(["placement"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "placement";
    }
    let checkbox = { ...selectedCheckBox };
    if (tab.trim().length > 0) {
      let priority = {
        portfolio: 4,
        campaign: 3,
        adgroup: 2,
        keyword: 1,
        asin: 1,
        placement: 2,
      };
      let priorityKeys = Object.keys(priority);

      for (let i = 0; i < priorityKeys.length; i++) {
        if (
          priority[priorityKeys[i]] < priority[tab] ||
          (priority[tab] === priority[priorityKeys[i]] &&
            priorityKeys[i] === tab)
        ) {
          checkbox[priorityKeys[i]] = [];
        }
      }
      // if (tab === "portfolio") {
      //   funnelCount([]);
      // }
      setFilters([]);
      dispatch({
        type: ActionType.CHECKBOX,
        payload: checkbox,
      });
      filters[tab] = apiFilter;
      getTabData(tab, true, filters);
      if (clearSearch === false) {
        setFilters({ ...filters });
      } else {
        setFilters([]);
      }
    }
    // eslint-disable-next-line no-console
    // console.log("debugerrr showHeader", showHeader);
    // setShowHeader(showHeader);
    // console.log(JSON.stringify(sFilters), "filters-----", apiFilter, current);
  }
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

  //const [csvHeaders,setCsvHeaders] = useState([]);

  // const cancelFilter = () => {
  //   setShowHeader([...showHeader]);
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
  //   setCallApi(true);
  //   setShowFilter(false);
  // }, [showHeader]);

  const saveSearchInit = async (name) => {
    let payload = {
      filters: filters,
      name: name,
      user_id: 1,
      media_type: "amazon",
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
    } else {
      dispatch(setToastMessageHandler(`${res}`, false));
    }
  };

  const handleSaveMultiSearch = async (filters, name, callback = false) => {
    let payload = {
      filters: filters,
      name: name,
      user_id: 1,
      media_type: "amazon",
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

  useEffect(() => {
    getSavedSearch().then((data) => {
      let search = savedSearch;
      // console.log(data, "data123");
      search.children = data;
      // console.log(search, "search123");
      setSavedSearch({ ...search });
    });
  }, []);

  const getSavedSearch = async () => {
    let payload = {
      user_id: 1,
      media_type: "amazon",
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
    dispatch({
      type: ActionType.AMAZON_CAMPAIGN_COUNT,
      //  payload: { keyword: 0, product: 0 },
      payload: { campaign: 0, adgroup: 0, keyword: 0, asin: 0, placement: 0 },
    });
    // dashboardApi();
  };
  // const handleSelectedData = (data) => {
  //   alert("test");
  //   setCheckboxData(data);
  // };

  // function hideSearchPopUpModal() {
  //   setSaveSearchModal(false);
  // }

  // function applyDateRangeFilter(item) {
  //   setDateGrouping(item.value);
  //   setisbtopen(false);
  // }

  function setPlatformFilter(e) {
    setSelectedAccount(e);
    saveLocalStorageAccounts(
      _.map(
        _.filter(account, (ele) => ele.value === e),
        "label"
      )
    );
  }

  async function dashboardApi() {
    try {
      let post = {
        filters: graphFilters,
        dateGrouping: dateGrouping,
        start_date: convertDate(dateRange[0]?.startDate),
        end_date: convertDate(dateRange[0]?.endDate),
        brand: selectedAccount,
        tab_name: ShowTab,
        drr: false,
        compareId: compareId,
        manual_compare_date: {},
      };
      if (selectedCheckBox[ShowTab]?.length && graphMapping[ShowTab]) {
        post[graphMapping[ShowTab]] = selectedCheckBox[ShowTab].map(
          (item) => item[graphMapping[ShowTab]]
        );
      }

      if (selectedCheckBox["campaign"]?.length) {
        post.campaign_id = selectedCheckBox["campaign"].map(
          (item) => item[graphMapping["campaign"]]
        );
      }

      const res = await dashboardAmazonGraph(post);

      if (res.data && res.data.data) {
        setGraphData(res.data.data);
      }
    } catch (error) {
      // Handle the error as needed, e.g., show an error message to the user
    }
  }

  async function updateFilterData(filter) {
    const data = filter
      .filter((item) => graphMetrics.includes(item.value))
      .map((item) => ({
        label: item.title,
        value: item.value,
      }));
    setFilterData(data);
  }
  useEffect(() => {
    if (selectedAccount !== "" && !calState.fullCalender) dashboardApi();
  }, [
    dateGrouping,
    selectedAccount,
    selectedCheckBox,
    ShowTab,
    ...graphFilters,
    dateRange,
  ]);

  async function checkFilter() {
    const val1 = filterData.some((item) => item.value == graphFilterOne);
    const val2 = filterData.some((item) => item.value == graphFilterTwo);
    if (!val1 || !val2) {
      setGraphFilterOne(ShowTab == "keyword" ? "revenue" : "sales");
      setGraphFilterTwo("spend");
    }
  }

  useEffect(() => {
    checkFilter();
  }, [filterData]);

  useEffect(() => {
    updateFilterData(showHeader);
  }, [showHeader]);
  const buttonRef = useRef(null);
  useCloseWhenClickOutside(btopen, setisbtopen, buttonRef);

  const childRef = useRef();
  const changeTagsData = (compaignId, TagsId) => {
    // console.log(compaignId, TagsId, "<<<< change data tags AMAZON");
    childRef.current?.getAlert(compaignId, TagsId);
  };

  // if(ShowTab == "campaign" && selectedCheckBox?.campaign?.length === 0 ||
  // selectedCheckBox?.campaign?.length === undefined) {
  //   setShowCustom(true)
  // }
  // if(ShowTab == "portfolio" && selectedCheckBox?.portfolio?.length === 0 ||
  // selectedCheckBox?.portfolio?.length === undefined) {
  //   setShowCustom(true)
  // }
  // if(ShowTab != "portfolio" && ShowTab != "campaign" ) {
  //   setShowCustom(true)
  // }

  const onValChange = () => {
    if (check) {
      setVal("Absolute");
    } else {
      setVal("DRR");
    }
    setcheck(!check);
    //initLoad();
  };

  const getSelectedAccount = () => {
    const _account = account.find((ele) => ele.value === selectedAccount);
    return _account?.label;
  };

  useEffect(() => {
    dispatch(setExpandTable(false));
  }, []);

  function saveColumn() {
    const customButton = [
      {
        //  handleClick: () => setShowPopup(!showPopup),
        label: "Save...",
        style: "bg-white text-black border",
      },
    ];

    return customButton;
  }

  const handleApply = () => {
    setShowHeader(filterHeader);
    setShowFilter(false);
    setButtonName("Save");
  };

  const handleButtonName = (data) => {
    if (data !== "Save") {
      setButtonName("Update");
      setColUpdateId(data);
    } else {
      setButtonName(data);
    }
  };
  const user_id = localStorage.getItem("user_id");
  const username = localStorage.getItem("name");
  const client_id = localStorage.getItem("client_id");

  const [duplicateViewError, setDuplicateError] = useState(false);

  const saveColData = async () => {
    let data;
    let result;
    if (buttonName == "Save") {
      if (viewName !== undefined && viewName !== "") {
        data = {
          name: viewName,
          platform: "amazon",
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

  return (
    <>
      <div className="">
        <Toast></Toast>

        <section className=" flex-nowrap p-4 bg-white">
          <div className=" flex-col">
            <div className="flex justify-between items-center">
              <div className="flex w-full gap-2">
                {/* accounts */}
                <div className="flipkart__selectfilter">
                  <CustomSelect
                    label={"Select"}
                    options={account}
                    value={selectedAccount}
                    onChange={setPlatformFilter}
                    name="campaignManagerAms"
                  />
                </div>
                {/* data picker */}
                <div className=" flipkart__calander">
                  <DatePicker
                    onChangeDate={onChangeDate}
                    state={tempDate}
                    setState={(data) => setDateRange(data)}
                    calState={calState}
                    setCalState={(data) => setCalState(data)}
                    position={"right"}
                    applyDate={() => applyDate(true)}
                    platform={"ams"}
                    className="border"
                    dashboard={"campmanage"}
                    cancelDate={cancelDate}
                  />
                </div>
                {(ShowTab == "campaign" ||
                  ShowTab == "adgroup" ||
                  ShowTab == "portfolio" ||
                  ShowTab == "keyword" ||
                  ShowTab == "asin" ||
                  ShowTab == "placement") && (
                  <div className="flipkart__calander" style={{ width: "23%" }}>
                    <CompareDatePicker
                      className="h-3"
                      platform={"ams"}
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
                )}
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
                    {/* select option 1 */}
                    <div className="col_2 mr-4">
                      {/* <select
                        className="campaignselect focus:ring-1 focus:border-amsPrimary outline-amsPrimary focus:ring-amsPrimary"
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
                        platform={"ams"}
                        className="py-[5px] "
                      />
                    </div>
                    {/* select option 2 */}
                    <div className="col_2  mr-4">
                      {/* <select
                        className="campaignselect focus:ring-1 focus:border-amsPrimary outline-amsPrimary focus:ring-amsPrimary"
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
                        platform={"ams"}
                        className="py-[5px] "
                      />
                    </div>
                    {/* adjust */}
                    <div className="py-0.5 ">
                      <div
                        ref={buttonRef}
                        className="dropdown filter-dropdown open relative"
                      >
                        <button
                          onClick={(e) => {
                            handleDaysChange(e.target.value);
                          }}
                          className=" btn btn-primary dropdown-toggle  dropdown__g-param amsRing"
                          type="button"
                          id=""
                          data-toggle="dropdown"
                          aria-expanded="true"
                        >
                          <div className="row">
                            <img
                              className="h-5"
                              src="/assets/images/adjust-icon.svg"
                              alt=""
                            />
                            <div className="px-2">{dateName}</div>
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
                                        className={[
                                          "periodselector-li",
                                          platform === "ams" &&
                                            "periodselector-li--ams",
                                        ].join(" ")}
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
                    <div className=" ">
                      <DashboardGraph
                        activeCards={activeCards}
                        setActiveCards={setActiveCards}
                        graphFilters={graphFilters}
                        showDetails={true}
                        filterdata={filterData}
                        graphData={graphData}
                        noComparison={true}
                        component={"amazon"}
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
                arr={amazonArray}
                applySearchFilter={applySearchFilter}
                handleSaveFilters={handleSaveMultiSearch}
                platform="ams"
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
                name={ShowTab}
                mediaName="amazon"
              />
             <WhenPermitted platform="amazon" permission={PERMISSIONS.CAMPAIGN_ACTIONS}> 
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
                className="px-4 rounded-md  py-2 border bg-white campiagnbtn--ams"
                style={{
                  marginLeft: "10px",
                  cursor: showError ? "not-allowed" : "pointer",
                }}
                disabled={showError}
              >
                <img src="assets/images/save-icon.svg" alt="" /> Save
              </button>
              </WhenPermitted>
              {saveSearchModal === true && (
                <SaveSearchPopUp
                  showPopUp={saveSearchModal}
                  setSearchName={(name) => {
                    saveSearchInit(name);
                  }}
                  setSaveSearchModal={(e) => {
                    setSaveSearchModal(e);

                    // setIsDisabledSaveSearch(!e);
                  }}
                  platform={"ams"}
                />
              )}
              <button
                type="submit"
                className="campiagnbtn--ams px-4 rounded-md  py-2 border bg-white"
                onClick={() => {
                  setClearSearch(true);
                  // setIsDisabledSaveSearch(true);
                }}
              >
                <img src="assets/images/clear-icon.svg" alt="" />
                Clear
              </button>
            </div> */}
          </div>

          <div className="row ">
            <div className="col campaign__tablewrap bg-white ">
              <div className="campaign__navtab relative campaign__navtab--amazon max-w-[1350px]">
                <Tabbtn
                  title="Portfolio"
                  imgsrc={
                    ShowTab === "portfolio"
                      ? // ? "/assets/images/amscreativeactive.svg"
                        // : "/assets/images/creative.svg"
                        "/assets/images/amsPortfolioActive.svg"
                      : "/assets/images/amsPortfolio.svg"
                  }
                  onClick={() => getTabData("portfolio")}
                  active={ShowTab === "portfolio"}
                  platform="amazon"
                  value="portfolio"
                />
                <Tabbtn
                  title="Campaign"
                  imgsrc={
                    ShowTab === "campaign"
                      ? "/assets/images/amsmegaphone.svg"
                      : "/assets/images/me.svg"
                  }
                  onClick={() => getTabData("campaign")}
                  active={ShowTab === "campaign"}
                  platform="amazon"
                  value="campaign"
                />
                <Tabbtn
                  title="Ad Group"
                  imgsrc={
                    ShowTab === "adgroup"
                      ? "/assets/images/amsfsnactive.svg"
                      : "/assets/images/fsn-icon.svg"
                  }
                  onClick={() => getTabData("adgroup")}
                  active={ShowTab === "adgroup"}
                  platform="amazon"
                  value="adgroup"
                />
                <Tabbtn
                  title="ASIN"
                  imgsrc={
                    ShowTab === "asin"
                      ? "/assets/images/amsterminalactive.svg"
                      : "/assets/images/terminal-square.svg"
                  }
                  onClick={() => getTabData("asin")}
                  active={ShowTab === "asin"}
                  platform="amazon"
                  value="asin"
                />
                <Tabbtn
                  title="Keyword"
                  imgsrc={
                    ShowTab === "keyword"
                      ? "/assets/images/amskeyboardactive.svg"
                      : "/assets/images/keyboard.svg"
                  }
                  onClick={() => getTabData("keyword")}
                  active={ShowTab === "keyword"}
                  platform="amazon"
                  value="keyword"
                />
                {/* <Tabbtn
                  title="Creative"
                  imgsrc={
                    ShowTab === "creative"
                      ? // ? "/assets/images/amskeyboardactive.svg"
                        // : "/assets/images/keyboard.svg"
                        "/assets/images/amscreativeactive.svg"
                      : "/assets/images/creative.svg"
                  }
                  onClick={() => getTabData("creative")}
                  active={ShowTab === "creative"}
                  platform="amazon"
                /> */}
                <Tabbtn
                  title="Placement"
                  imgsrc={
                    ShowTab === "placement"
                      ? "/assets/images/amsmegaphone.svg"
                      : "/assets/images/me.svg"
                  }
                  onClick={() => getTabData("placement")}
                  active={ShowTab === "placement"}
                  platform="amazon"
                  value="placement"
                />
                {/* <Tabbtn
                  title="Portfolio"
                  imgsrc={
                    ShowTab === "portfolio"
                      ? "/assets/images/amscreativeactive.svg"
                      : "/assets/images/creative.svg"
                  }
                  onClick={() => getTabData("portfolio")}
                  active={ShowTab === "portfolio"}
                /> */}

                {/* {(selectedCheckBox?.campaign?.length > 0 ||
                  selectedCheckBox?.portfolio?.length > 0) && (
                  <div className="text-[16px] absolute right-1 pt-3">
                    <span className="text-blue-500 font-bold">*</span>
                    {selectedCheckBox?.portfolio?.length > 0 &&
                      `Selected portfolios:
                    (${selectedCheckBox?.portfolio?.length})`}
                    {selectedCheckBox?.campaign?.length > 0 &&
                      selectedCheckBox?.portfolio?.length > 0 && <> && </>}
                    {selectedCheckBox?.campaign?.length > 0 &&
                      `Selected campaigns: (${selectedCheckBox?.campaign?.length})`}
                  </div>
                )} */}
              </div>
            </div>
            <div className="row  justify-between pb-4  bg-white px-4">
              <div className="amazon__campheader">
                <AmazonCampaigntableHeader
                  onEditButtonClick={ShowTab}
                  tableData={selectedCheckBox[ShowTab] || []}
                  tabName={ShowTab}
                  changeTagsData={changeTagsData}
                  headers={showHeader}
                  showDropDown={showDropDown}
                  setShowDropDown={setShowDropDown}
                  selectedAccount={getSelectedAccount()}
                />
              </div>
              <div className="col">
                <div
                  className="row justify-end items-center"
                  // style={{
                  //   marginTop: hasPermission ? "0" : "-60px",
                  // }}
                >
                  {/* <Headerbtn 
                  platform={"ams"}
                  icon={<FiFilter/>}/> */}

                  {((ShowTab == "campaign" &&
                    (selectedCheckBox?.campaign?.length === 0 ||
                      selectedCheckBox?.campaign?.length === undefined)) ||
                    ShowTab == "placement" ||
                    (ShowTab == "portfolio" &&
                      (selectedCheckBox?.portfolio?.length === 0 ||
                        selectedCheckBox?.portfolio?.length === undefined)) ||
                    (ShowTab == "adgroup" &&
                      (selectedCheckBox?.adgroup?.length === 0 ||
                        selectedCheckBox?.adgroup?.length === undefined)) ||
                    (ShowTab == "keyword" &&
                      (selectedCheckBox?.keyword?.length === 0 ||
                        selectedCheckBox?.keyword?.length === undefined)) ||
                    (ShowTab == "asin" &&
                      (selectedCheckBox?.asin?.length === 0 ||
                        selectedCheckBox?.asin?.length === undefined))) && (
                    <>
                      <div className="relative mt-4 mx-2">
                        {/* <CustomColOptionAms
                      title="Customize column"
                      setShowHeader={setShowHeader}
                      showHeader={showHeader}
                      applyFilter={applyFilter}
                      cancelFilter={cancelFilter}
                      setShowFilter={setShowFilter}
                      showFilter={showFilter}
                      platform={"ams"}
                      activeTab={ShowTab}
                    /> */}

                        {/* <CustomizeDropDown
                          title=""
                          setShowHeader={setShowHeader}
                          showHeader={showHeader}
                          applyFilter={applyFilter}
                          cancelFilter={cancelFilter}
                          setShowFilter={setShowFilter}
                          showFilter={showFilter}
                          platform={"ams"}
                        /> */}
                        {/* <button
                          className={
                            "campaignreport__btn flex !rounded-md campaignreport__btn--ams"
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
                          className="hover:bg-[#EF880F]"
                          onClick={() => setShowFilter(!showFilter, "button")}
                        />

                        {showFilter && (
                          <Popup
                            platform="ams"
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
                                style: "bg-[#EF880F]",
                              },
                            ]}
                          >
                            <CustomizeColPopup
                              showHeader={showHeader}
                              setFilterHeader={setFilterHeader}
                              searchCss={"outline-orange-300"}
                              platform={"amazon"}
                              tabName={ShowTab}
                              buttonName={handleButtonName}
                              refetch={colFetch}
                            />
                          </Popup>
                        )}
                      </div>
                      <div className="amazon__campheader">
                        <Headerbtn
                          disabled={download === 1}
                          imgsrc="/assets/images/hard-disk.png"
                          hoverImgSrc="/assets/images/hard-disk-white.svg"
                          title=""
                          style={{ width: "14px" }}
                          onClick={() => {
                            setDownload(1);
                          }}
                        />
                      </div>
                      {(ShowTab == "campaign" ||
                        ShowTab == "adgroup" ||
                        ShowTab == "portfolio" ||
                        ShowTab == "keyword" ||
                        ShowTab == "asin" ||
                        ShowTab == "placement") && (
                        <div className="amazon__campheader mt-5 mx-2 ">
                          <ToggleButton
                            label1={"Absolute"}
                            label2={"DRR"}
                            val={val}
                            setVal={onValChange}
                            check={check}
                            platform={"ams"}
                          ></ToggleButton>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="w-full p-4 bg-white">
              {ShowTab === "portfolio" && <AmazonPortfoliTable />}
              {ShowTab === "campaign" && <AmsCampTable />}
              {ShowTab === "adgroup" && <AmazonAdgroupTable />}
            
              {ShowTab === "asin" && <AmazonAsinTable />}
              {ShowTab === "keyword" && <AmazonKeywordTable />}
              {ShowTab === "creative" && <AmazonCreativeTable />}
              {ShowTab === "placement" && <AmazonPlacementTable />}
            </div> */}
            <div className="w-full p-4 bg-white">
              {selectedAccount && (
                <AmazonCampaignTable
                  filters={filters}
                  dateRange={dateRange}
                  name={ShowTab}
                  tab={ShowTab}
                  headers={showHeader}
                  // handleSelectedData={handleSelectedData}
                  // checkboxData={selectedCheckBox[ShowTab] || []}
                  // checkboxData={selectedCheckBox}
                  download={download}
                  setDownload={setDownload}
                  platformId={selectedAccount}
                  // callApi={callApi}
                  // setCallApi={setCallApi}
                  ref={childRef}
                  setCallApi={setCallApi}
                  // ref={childRef}
                  sortType={sort}
                  setSorting={(e) => setSorting(e)}
                  calState={calState}
                  from="campaignManager"
                  manual_compare_date={manual_compare_date}
                  compareId={compareId}
                  compDateRange={compDateRange}
                  drr={check}
                  drrPopup={drrPopup}
                  setDrrPopup={setDrrPopup}
                  setCompCalState={setCompCalState}
                  editMode={editMode}
                  account={getSelectedAccount()}
                  // funnelCount={funnelCount}
                  checkGrouping={checkGrouping}
                  checkAdgroupGrouping={checkAdgroupGrouping}
                />
              )}

              {drrPopup &&
                (ShowTab == "campaign" ||
                  ShowTab == "adgroup" ||
                  ShowTab == "portfolio" ||
                  ShowTab == "keyword" ||
                  ShowTab == "asin" ||
                  ShowTab == "placement") &&
                !editMode && (
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
                          <div className="font-inter px-[15px] py-1 bg-amber-500 rounded-sm shadow border border-amber-500 justify-center items-center gap-2 flex">
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
          platform="ams"
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
export default AmazonCampignSection;
