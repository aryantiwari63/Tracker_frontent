/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import CommonScreenTable from "./CommonScreenTable";
import ToggleButton from "../common-components/toggle-button";
import CompareDatePicker from "../DatePicker/compareDatePicker";
import GraphLoading from "./CommonCatalog/GraphLoading";
import Evalution from "./Evalutaion";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "../DatePicker";
import { useDispatch, useSelector } from "react-redux";
import {
  GET_COMMON_ACCOUNTS,
  COMMON_GRAPH_API_URL,
  ALL_COMP_DATE,
  COMP_DATE,
  GET_ALL_TAGS,
} from "../../utils/constants";
import {
  commonScreenAMS,
  commonScreenFlipkart,
  commonScreenBlinkit,
  commonScreenZepto,
  commonScreenInstamart,
} from "../../services/dashboard";
import { format, addDays } from "date-fns";
import AlertMetrices from "./AlertMetrices";
import { campaignSearchHeaders } from "../../utils/constants";
import Toast from "../common-components/toast";
import ActionType from "../../redux/types";
import {
  convertDate,
  defaultFilterCheck,
  defaultDateRange,
  defaultCompareDate,
  defaultCompareDateBlinkit,
  getLocalStorageAccounts,
  saveLocalStorageAccounts,
} from "../../utils/helpers";
import SelectBox from "../CommonScreen/TagManager/SelectBox";
import { _POST, _DELETE, _PATCH, _GET } from "../../services/axios.method";
import { getWallletBalance } from "../../redux/action-creator/sideBarAction";
import CommonScreenGraph from "./CommonScreenGraph";
import AlertBox from "./AlertBox";
import AlertTotal from "./AlertTotal";
import _, { set } from "lodash";
import SkeletonChart from "../common-components/loader/SkeletonChart";

const CommonScreenDashBoard = () => {
  const compareFilters = defaultCompareDateBlinkit();
  const [accountOptions, setAccountOptions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [graphOption, setGraphOption] = useState({
    title: {
      text: "EGenieChart",
      show: false,
    },
    tooltip: {
      backgroundColor: "black",
      textStyle: {
        color: "white",
      },
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      left: "220",
      right: "320",
    },
    toolbox: {
      feature: {
        saveAsImage: {
          show: true,

          title: "",
          icon: "image://assets/images/hard-disk.png",
        },
      },
      tooltip: {
        // same as option.tooltip
        show: true,
        formatter: function (param) {
          return "<div>" + "Save as image" + "</div>"; // user-defined DOM structure
        },
        backgroundColor: "#222",
        textStyle: {
          fontSize: 12,
        },
        extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);", // user-defined CSS styles
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [],
    },
    yAxis: [
      {
        type: "value",
        splitLine: {
          show: false,
        },
        // show:false,
        alignTicks: false,
      },
    ],
    series: [],
  });
  const [filterName, setFilterName] = useState([]);
  const [amazonPerformance, setAmazonPerformance] = useState();
  const [amazonReach, setAmazonReach] = useState();
  const [noComparison, setNoComparison] = useState(false);
  const [graphLoading, setGraphLoading] = useState(false);

  const [zeptoReach, setZeptoReach] = useState();
  const [zeptoPerformance, setZeptoPerformance] = useState();
  const [blinkitPerformance, setBlinkitPerformance] = useState();
  const [blinkitReach, setBlinkitReach] = useState();
  const [flipkartPerformance, setFlipkartPerformance] = useState();
  const [flipkartReach, setFlipkartReach] = useState();
  const [instamartPerformance, setinstamartPerformance] = useState();
  const [check, setcheck] = useState(false);
  const [val, setVal] = useState("Absoulte");
  const [amazonTotalCal, setAmazonTotalCal] = useState([]);
  const [flipkartTotalCal, setFlipkartTotalCal] = useState([]);
  const [blinkitTotalCal, setBlinkitTotalCal] = useState([]);
  const [zeptoTotalCal, setZeptoTotalCal] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [instamartTotalCal, setInstamartTotalCal] = useState([]);

  const amazonTotal = (data) => {
    setAmazonTotalCal(data);
  };
  const flipkartTotal = (data) => {
    setFlipkartTotalCal(data);
  };
  const blinkitTotal = (data) => {
    setBlinkitTotalCal(data);
  };

  const zeptoTotal = (data) => {
    setZeptoTotalCal(data);
  };

  const instamartTotal = (data) => {
    setInstamartTotalCal(data);
  };

  const amazonReachData = (data) => {
    setAmazonReach(data);
  };

  const amazonPerformanceData = (data) => {
    setAmazonPerformance(data);
  };

  const blinkitPerformanceData = (data) => {
    setBlinkitPerformance(data);
  };

  const blinkitReachData = (data) => {
    setBlinkitReach(data);
  };

  const flipkartPerformanceData = (data) => {
    setFlipkartPerformance(data);
  };

  const flipkartReachData = (data) => {
    setFlipkartReach(data);
  };

  const zeptoPerformanceData = (data) => {
    setZeptoPerformance(data);
  };

  const zeptoReachData = (data) => {
    setZeptoReach(data);
  };

  const instamartPerformanceData = (data) => {
    setinstamartPerformance(data);
  };
  const dateFilters = defaultDateRange();

  const dispatch = useDispatch();
  const [selectedBrandOption, setSelectedBrandOption] = React.useState([]);
  const [dateRange, setDateRange] = React.useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]);

  const [compDateRange, setCompDateRange] = useState([
    {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [compareId, setCompareId] = useState(compareFilters["compare_id"]);
  const [compDates, setCompDates] = useState([]);

  const [calState, setCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });

  const [compCalState, setCompCalState] = useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });

  const [camp, setCamp] = React.useState([{ label: "Reach", value: "reach" }]);
  const [amazonSummary, setAmazonSummary] = React.useState({
    impressions: {
      name: "Impressions",
      value: "0",
      graphName: "Impressions",
      last_val: 0,
      last_data: "0",
    },
    clicks: {
      name: "Clicks",
      value: "0",
      graphName: "clicks",
      last_val: 0,
      last_data: "0",
    },
    ctr: {
      name: "CTR",
      value: "0",
      graphName: "ctr",
      last_val: 0,
      last_data: "0",
    },
    spend: {
      name: "Spend",
      value: "0",
      graphName: "spend",
      last_val: 0,
      last_data: "0",
    },
    cpc: {
      name: "CPC",
      value: "0",
      graphName: "cpc",
      last_val: 0,
      last_data: "0",
    },
    sales: {
      name: "Sales",
      value: "0",
      graphName: "sales",
      last_val: 0,
      last_data: "0",
    },
    roas: {
      name: "ROAS",
      value: "0",
      graphName: "roas",
      last_val: 0,
      last_data: "0",
    },
    units_sold: {
      name: "Orders",
      value: "0",
      graphName: "units_sold",
      last_val: 0,
      last_data: "0",
    },
    aov: {
      name: "aov",
      value: "0",
      graphName: "aov",
      last_val: 0,
      last_data: "0",
    },
  });
  const [flipkartSummary, setFlipkartSummary] = React.useState({
    views: {
      name: "Views",
      value: "0",
      graphName: "Views",
      last_val: 0,
      last_data: "0",
    },
    clicks: {
      name: "Clicks + ATB",
      value: "0",
      graphName: "Clicks",
      last_val: 0,
      last_data: "0",
    },
    ctr: {
      name: "CTR",
      value: "0",
      graphName: "ctr",
      last_val: 0,
      last_data: "0",
    },
    spend: {
      name: "Spends",
      value: "0",
      graphName: "spend",
      last_val: 0,
      last_data: "0",
    },
    cpc: {
      name: "CPC",
      value: "0",
      graphName: "cpc",
      last_val: 0,
      last_data: "0",
    },
    total_revenue: {
      name: "Revenue",
      value: "0",
      graphName: "sales",
      last_val: 0,
      last_data: "0",
    },
    total_roas: {
      name: "ROAS",
      value: "0",
      graphName: "roas",
      last_val: 0,
      last_data: "0",
    },
    orders: {
      name: "Orders",
      value: "0",
      graphName: "units_sold",
      last_val: 0,
      last_data: "0",
    },
    aov: {
      name: "aov",
      value: "0",
      graphName: "aov",
      last_val: 0,
      last_data: "0",
    },
  });
  const [loadingSummary, setLoadingSummary] = React.useState(false);
  const [blinkitSummary, setBlinkitSummary] = React.useState({
    impressions: {
      name: "Views",
      value: "0",
      graphName: "Views",
      last_val: 0,
      last_data: "0",
    },
    unique_clicks: {
      name: "unique_clicks",
      value: "0",
      graphName: "Clicks",
      last_val: 0,
      last_data: "0",
    },
    ctr: {
      name: "CTR",
      value: "0",
      graphName: "ctr",
      last_val: 0,
      last_data: "0",
    },
    estimated_budget_consumed: {
      name: "Spends",
      value: "0",
      graphName: "spend",
      last_val: 0,
      last_data: "0",
    },
    cpc: {
      name: "CPC",
      value: "0",
      graphName: "cpc",
      last_val: 0,
      last_data: "0",
    },
    total_sales: {
      name: "total_sales",
      value: "0",
      graphName: "sales",
      last_val: 0,
      last_data: "0",
    },
    total_roas: {
      name: "ROAS",
      value: "0",
      graphName: "roas",
      last_val: 0,
      last_data: "0",
    },
    total_quantities_sold: {
      name: "Orders",
      value: "0",
      graphName: "units_sold",
      last_val: 0,
      last_data: "0",
    },
    aov: {
      name: "aov",
      value: "0",
      graphName: "aov",
      last_val: 0,
      last_data: "0",
    },
  });

  const [zeptoSummary, setZeptoSummary] = React.useState({
    impressions: {
      name: "Impressions",
      value: "0",
      graphName: "Impressions",
      last_val: 0,
      last_data: "0",
    },
    clicks: {
      name: "Clicks",
      value: "0",
      graphName: "Clicks",
      last_val: 0,
      last_data: "0",
    },
    ctr: {
      name: "CTR",
      value: "0",
      graphName: "ctr",
      last_val: 0,
      last_data: "0",
    },
    spend: {
      name: "Spends",
      value: "0",
      graphName: "spend",
      last_val: 0,
      last_data: "0",
    },
    cpc: {
      name: "CPC",
      value: "0",
      graphName: "cpc",
      last_val: 0,
      last_data: "0",
    },
    revenues: {
      name: "sales",
      value: "0",
      graphName: "sales",
      last_val: 0,
      last_data: "0",
    },
    total_roas: {
      name: "ROAS",
      value: "0",
      graphName: "roas",
      last_val: 0,
      last_data: "0",
    },
    orders: {
      name: "Orders",
      value: "0",
      graphName: "orders",
      last_val: 0,
      last_data: "0",
    },
    aov: {
      name: "aov",
      value: "0",
      graphName: "aov",
      last_val: 0,
      last_data: "0",
    },
  });
  const [instamartSummary, setInstamartSummary] = React.useState({
    spend: {
      name: "Spends",
      value: "0",
      last_val: 0,
      last_data: "0",
      graphName: "Spends",
    },
    impressions: {
      name: "Impressions",
      value: "0",
      last_val: 0,
      last_data: "0",
      graphName: "Impressions",
    },
    gmv: {
      name: "Sales",
      value: "0",
      last_val: 0,
      last_data: "0",
      graphName: "Sales",
    },
    clicks: {
      name: "Clicks",
      value: "0",
      last_val: 0,
      last_data: "0",
      graphName: "clicks",
    },
    ctr: {
      name: "CTR",
      value: "0",
      last_val: 0,
      last_data: "0",
      graphName: "ctr",
    },
    cpc: {
      name: "CPC",
      value: "0",
      last_val: 0,
      last_data: "0",
      graphName: "cpc",
    },
    roi: {
      name: "ROAS",
      value: "0",
      last_val: 0,
      last_data: "0",
      graphName: "roas",
    },
    units_sold: {
      name: "Orders",
      value: "0",
      last_val: 0,
      last_data: "0",
      graphName: "units_sold",
    },
    aov: {
      name: "AOV",
      value: "0",
      last_val: 0,
      last_data: "0",
      graphName: "aov",
    },
  });
  // useEffect(() => {
  //   const fetchData = async () => {
  //     await initLoad();
  //   };

  //   fetchData();
  // }, []);

  const accountNames = async () => {
    try {
      // platforms:,
      const result = await _POST(GET_COMMON_ACCOUNTS, {
        platforms: JSON.parse(localStorage.getItem("platforms")),
      });
      const data = result.data.data;
      if (!Array.isArray(data)) {
        console.error("Common Account Data  is not an array or is undefined");
        // Handle the error appropriately
        return;
      }

      const accounts = data.map((item) => ({
        label: item.account_name,
        value: item.account_name,
        flipkart_id: item.flipkart_id,
        blinkit_id: item.blinkit_id,
        amazon_id: item.amazon_id,
      }));
      setBrandDataListing(accounts);

      const accountOptions =
        data && data.length > 0
          ? data.map((item) => ({
              label: item.account_name,
              value: item.account_name,
            }))
          : [];
      setAccountOptions(accountOptions);
      let accountsFilter = _.cloneDeep(accounts);
      // let savedAccounts = getLocalStorageAccounts();
      // if (_.size(savedAccounts)) {
      //   let firstAccount = savedAccounts[0];
      //   let filterAccount = accounts.find((acc) => acc.value === firstAccount);
      //   if (filterAccount) {
      //     accountsFilter = [filterAccount];
      //     saveLocalStorageAccounts([accountsFilter[0]?.value]);
      //   } else {
      //     saveLocalStorageAccounts([accountsFilter[0]?.value]);
      //   }
      // } else {
      //   saveLocalStorageAccounts([accountsFilter[0]?.value]);
      // }

      setAmazonFilters({
        ...amazonFilters,
        brand: [accountsFilter[0]?.amazon_id],
      });
      setFlipkartFilters({
        ...flipkartFilters,
        brand: [accountsFilter[0]?.value],
      });
      setZeptoFilters({
        ...zeptoFilters,
        brand: [accountsFilter[0]?.value],
      });
      setInstamartFilters({
        ...instamartFilters,
        brand: accountsFilter[0]?.value,
      });
      setSelectedBrand(accountsFilter[0]);
      setSelectedBrandOption([accountsFilter[0]]);

      // setSelectedBrand(brandDataListing[0]);
      let filters = defaultFilterCheck(accounts, "/flipkart");
      setPlatformId(filters["flipkart"]["single"]);
    } catch (error) {
      console.error(error);
    }
  };
  const [amazonFilters, setAmazonFilters] = React.useState({
    start_date: format(new Date(dateFilters["startDate"]), "yyyy-MM-dd"),
    end_date: format(new Date(dateFilters["endDate"]), "yyyy-MM-dd"),
    brand: [selectedBrand?.amazon_id],
    // platform: ["MP", "SM"],
    campaign_types: ["reach"],
    compareId: compareFilters["compare_id"],
    drr: false,
    manual_compare_date: {},
    tags: selectedTags,
  });
  const [flipkartFilters, setFlipkartFilters] = React.useState({
    start_date: format(new Date(dateFilters["startDate"]), "yyyy-MM-dd"),
    end_date: format(new Date(dateFilters["endDate"]), "yyyy-MM-dd"),
    brand: [selectedBrand?.label],
    platform: ["MP", "SM"],
    campaign_types: ["reach"],
    compareId: compareFilters["compare_id"],
    drr: false,
    manual_compare_date: {},
    tags: selectedTags,
  });
  const [blinkitFilters, setBlinkitFilters] = React.useState({
    start_date: format(new Date(dateFilters["startDate"]), "yyyy-MM-dd"),
    end_date: format(new Date(dateFilters["endDate"]), "yyyy-MM-dd"),
    drr: false,
    manual_compare_date: {},
    compareId: compareFilters["compare_id"],
    campaign_types: ["reach"],
    tags: selectedTags,
  });
  const [zeptoFilters, setZeptoFilters] = React.useState({
    start_date: format(new Date(dateFilters["startDate"]), "yyyy-MM-dd"),
    end_date: format(new Date(dateFilters["endDate"]), "yyyy-MM-dd"),
    brand: [selectedBrand?.label],
    platform: ["MP", "SM"],
    campaign_types: ["reach"],
    compareId: compareFilters["compare_id"],

    drr: false,
    manual_compare_date: {},
    tags: selectedTags,
  });

  const [instamartFilters, setInstamartFilters] = React.useState({
    start_date: format(new Date(dateFilters["startDate"]), "yyyy-MM-dd"),
    end_date: format(new Date(dateFilters["endDate"]), "yyyy-MM-dd"),
    brand: [selectedBrand?.label],
    compareId: compareFilters["compare_id"],
    campaign_types: ["reach"],
    drr: false,
    manual_compare_date: {},
    tags: selectedTags,
  });

  const allowedPlatforms = JSON.parse(
    localStorage.getItem("platforms")
  )?.platform;

  const initLoad = async () => {
    try {
      setLoadingSummary(true);
      // if()
      let [
        dashData,
        flipkartDashData,
        blinkitDashData,
        zeptoDashData,
        instamartDashData,
      ] = [[], [], [], [], []];

      if (allowedPlatforms && allowedPlatforms?.includes("amazon")) {
        dashData = await commonScreenAMS(amazonFilters);
        setNoComparison(dashData?.data?.data?.noComparison);
      }
      if (allowedPlatforms && allowedPlatforms?.includes("flipkart")) {
        flipkartDashData = await commonScreenFlipkart(flipkartFilters);
        setNoComparison(flipkartDashData?.data?.data?.noComparison);
      }
      if (allowedPlatforms && allowedPlatforms?.includes("blinkit")) {
        blinkitDashData = await commonScreenBlinkit(blinkitFilters);
        setNoComparison(blinkitDashData?.data?.data?.noComparison);
      }

      if (allowedPlatforms && allowedPlatforms?.includes("zepto")) {
        zeptoDashData = await commonScreenZepto(zeptoFilters);
        setNoComparison(zeptoDashData?.data?.data?.noComparison);
      }

      if (allowedPlatforms && allowedPlatforms?.includes("instamart")) {
        instamartDashData = await commonScreenInstamart(instamartFilters);
      }
      // const res = await dashboardAmazonGraph({
      //   // ...this.state.filters,
      //   // filters: this.state.graphFilters,
      // });

      setAmazonSummary(dashData?.data?.data?.overview?.all);
      setFlipkartSummary(flipkartDashData?.data?.data?.overview?.all);
      setBlinkitSummary(blinkitDashData?.data?.data?.overview?.all);
      setZeptoSummary(zeptoDashData?.data?.data?.overview?.all);
      setInstamartSummary(instamartDashData?.data?.data?.overview?.all);
      setLoadingSummary(false);
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  async function fetchAllTags() {
    const response = await _GET(GET_ALL_TAGS);
    setAllTags(response.data.data.result);
  }

  useEffect(() => {
    fetchAllTags();
    accountNames();
    loadCompData();
  }, []);

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
        startDate: state[0].startDate,
        endDate: state[0].endDate,
      };
      await _PATCH(COMP_DATE + `/${id}`, post);
      await this.loadCompData();
    } catch (e) {
      console.error(e);
    }
  }

  // useEffect(() => {
  //   dispatch({
  //     type: ActionType.CHECKBOX,
  //     payload: [],
  //   });
  //   dashboardApi();
  // }, []);

  // useEffect(()=>{
  //   initLoad();
  // },[]);

  function onChangeDate(item) {
    defaultDateRange(item.selection);
    setDateRange([item.selection]);
    if (!calState.fullCalender) {
      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
    }
    setAmazonFilters({
      ...amazonFilters,
      start_date: convertDate(item?.selection?.startDate),
      end_date: convertDate(item?.selection?.endDate),
    });
    setFlipkartFilters({
      ...flipkartFilters,
      start_date: convertDate(item?.selection?.startDate),
      end_date: convertDate(item?.selection?.endDate),
    });
    setBlinkitFilters({
      ...blinkitFilters,
      start_date: convertDate(item?.selection?.startDate),
      end_date: convertDate(item?.selection?.endDate),
    });
    setZeptoFilters({
      ...zeptoFilters,
      start_date: convertDate(item?.selection?.startDate),
      end_date: convertDate(item?.selection?.endDate),
    });
    setInstamartFilters({
      ...instamartFilters,
      start_date: convertDate(item?.selection?.startDate),
      end_date: convertDate(item?.selection?.endDate),
    });
    //console.log("dateamamazon", amazonFilters);
    //initLoad();
  }

  async function setCompareData(id) {
    try {
      setCompareId(id);
      defaultCompareDateBlinkit(id);
      // this.setState({
      //   filters: { ...this.state.filters, manual_compare_date: {} },
      // });
      setAmazonFilters({
        ...amazonFilters,
        compareId: id,
        manual_compare_date: {},
      });
      setFlipkartFilters({
        ...flipkartFilters,
        compareId: id,
        manual_compare_date: {},
      });
      setBlinkitFilters({
        ...blinkitFilters,
        compareId: id,
        manual_compare_date: {},
      });
      setZeptoFilters({
        ...zeptoFilters,
        compareId: id,
        manual_compare_date: {},
      });
      setInstamartFilters({
        ...instamartFilters,
        compareId: id,
        manual_compare_date: {},
      });
    } catch (e) {
      console.error(e);
    }
  }

  const adjustIconRef = useRef(null);
  const [account, setAccount] = useState("Veet");
  const [activeCards, setActiveCards] = useState([]);
  const [graphFilters, setGraphFilters] = useState([
    "amazon_spend",
    "flipkart_spend",
    "blinkit_spend",
    "zepto_spend",
    "instamart_spend",
  ]);
  // eslint-disable-next-line no-unused-vars
  const [showFilter, setShowFilter] = useState(false);
  const [saveSearchModal, setSaveSearchModal] = useState(false);
  const [brandDataListing, setBrandDataListing] = useState([]);
  // const [platformId, setPlatformId] = useState("123");
  const [platformId, setPlatformId] = useState();
  const [filters, setFilters] = useState({ campaign: [], keyword: [] });
  const [btopen, setisbtopen] = useState(false);
  const [callApi, setCallApi] = useState(false);
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
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  }, [dateRange]);

  const campaigntype = [
    {
      label: "Performance",
      value: "performance",
    },
    {
      label: "Reach",
      value: "reach",
    },
  ];
  // const handleSelectChange = (e) => {
  //   setGraphFilterOne(e);
  // };
  // const handleDaysChange = (e) => {
  //   setisbtopen(!btopen);
  // };
  // const handleSecondChange = (e) => {
  //   setGraphFilterTwo(e);
  // };
  // React.useEffect(() => {
  //   setGraphFilters([
  //     graphFilterOne,
  //     graphFilterTwo,
  //     graphFilterThree,
  //     graphFilterFour,
  //   ]);
  // }, [graphFilterOne, graphFilterTwo, graphFilterThree, graphFilterFour]);
  // console.log(graphFilters, "mainnnnn");
  // useEffect(()=>{
  //   if(filters.keyword.length){
  //     getTabData(ShowTab,true);
  //   }
  // },[filters]);
  // useEffect(() => {
  //   getSavedSearch().then((data) => {
  //     let search = savedSearch;
  //     search.children = data;
  //     setSavedSearch({ ...search });
  //   });
  // }, []);
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
  const [showHeader, setShowHeader] = React.useState([
    ...campaignSearchHeaders,
  ]);
  // const getTabData = async (name, init = false, appliedFilters = []) => {
  //   if (name === ShowTab && init === false) {
  //     return false;
  //   }
  //   let headers = campaignSearchHeaders;
  //   if (name === "campaign") {
  //     headers = campaignSearchHeaders;
  //   } else if (name === "adgroup") {
  //     headers = adGroupSearchHeaders;
  //   } else if (name === "keyword") {
  //     headers = keywordSearchHeaders;
  //   } else if (name === "fsn") {
  //     headers = fsnSearchHeaders;
  //   } else if (name === "placement") {
  //     headers = placementSearchHeaders;
  //   } else if (name === "creative") {
  //     headers = creativeSearchHeaders;
  //   }

  //   setShowTab(name);
  //   setShowHeader(headers);
  //   setShowDropDown(false);
  // };

  // useEffect(() => {
  //   //getTabData(ShowTab,true,filters);
  // }, [dateRange, ShowTab]);
  useEffect(() => {}, [saveSearchModal]);
  function openSaveSearchModal() {
    setSavedSearch(filters);
  }

  // function applySearchFilter(sFilters, current) {
  //   dispatch({
  //     type: ActionType.CHECKBOX,
  //     payload: [],
  //   });
  //   let apiFilter = {};
  //   let tab = "campaign";
  //   apiFilter = sFilters;

  //   if (
  //     current === "campaign_m" ||
  //     current === "campaign_name" ||
  //     current === "campaign_id" ||
  //     current === "tag_name" ||
  //     current === "segment" ||
  //     current === "platform" ||
  //     current === "campaign_status" ||
  //     current === "campaign_budget_type"
  //   ) {
  //     apiFilter["campaign_m"] = sFilters["campaign_m"];
  //     apiFilter["segment"] = sFilters["segment"];
  //     apiFilter["platform"] = sFilters["platform"];
  //     apiFilter["campaign_status"] = sFilters["campaign_status"];
  //     apiFilter["campaign_budget_type"] = sFilters["campaign_budget_type"];
  //     let fValues = getFilterValue(
  //       ["campaign_name", "campaign_id", "tag_name"],
  //       sFilters
  //     );
  //     let otherFilters = {};
  //     if (
  //       [
  //         "segment",
  //         "platform",
  //         "campaign_status",
  //         "campaign_budget_type",
  //       ].indexOf(current) > -1
  //     ) {
  //       otherFilters[current] = sFilters[current];
  //     }
  //     apiFilter = { ...apiFilter, ...fValues, ...otherFilters };
  //     tab = "campaign";
  //     setCheckboxData([]);
  //   } else if (current === "keyword_m" || current === "keyword") {
  //     apiFilter["keyword_m"] = sFilters["keyword_m"];
  //     let fValues = getFilterValue(["keyword"], sFilters);
  //     apiFilter = { ...apiFilter, ...fValues };
  //     tab = "keyword";
  //   } else if (
  //     current === "ad_group_m" ||
  //     current === "ad_group_id" ||
  //     current === "ad_group_name"
  //   ) {
  //     apiFilter["ad_group_m"] = sFilters["ad_group_m"];
  //     let fValues = getFilterValue(["ad_group_name", "ad_group_id"], sFilters);
  //     //console.log(fValues, "fValues");
  //     apiFilter = { ...apiFilter, ...fValues };
  //     tab = "adgroup";
  //   } else if (
  //     current === "fsn_m" ||
  //     current === "fsn_id" ||
  //     current === "fsn_name"
  //   ) {
  //     apiFilter["fsn_m"] = sFilters["fsn_m"];
  //     let fValues = getFilterValue(["fsn_id", "fsn_name"], sFilters);
  //     //console.log(fValues, "fValues");
  //     apiFilter = { ...apiFilter, ...fValues };
  //     tab = "fsn";
  //     //console.log("fsn_m" || current === "fs'n_id" || current === "fsn_name");
  //   } else if (current === "creative_m") {
  //     apiFilter["creative_m"] = sFilters["creative_m"];
  //     let fValues = getFilterValue([], sFilters);
  //     //console.log(fValues, "fValues");
  //     apiFilter = { ...apiFilter, ...fValues };
  //     tab = "creative";
  //     //console.log("creative_m");
  //   } else if (current === "placement_m") {
  //     apiFilter["placement_m"] = sFilters["placement_m"];
  //     let fValues = getFilterValue([], sFilters);
  //     //console.log(fValues, "fValues");
  //     apiFilter = { ...apiFilter, ...fValues };
  //     tab = "placement";
  //   }
  //   filters[tab] = apiFilter;
  //   getTabData(tab, true, filters);
  //   //console.log(filters, "filters12");
  //   if (clearSearch === false) {
  //     setFilters({ ...filters });
  //   } else {
  //     setFilters([]);
  //   }

  //   // //console.log(JSON.stringify(sFilters), "filters-----", apiFilter, current);
  // }
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

  // function getFilterValue(keys, filters) {
  //   let value = [];
  //   let keyName = "";
  //   filters.name_id.map((val) => {
  //     //console.log(val, "<<< val");
  //     if (keys.indexOf(val.key) > -1) {
  //       value.push(val);
  //       keyName = val.key;
  //       //console.log(val, "inside");
  //     }
  //   });
  //   //console.log(value, "<<<< values");
  //   return { [keyName]: value };
  // }

  const [graphData, setGraphData] = useState([]);

  const [loading, setLoading] = React.useState(false);

  const [checkboxData, setCheckboxData] = useState([]);

  const cancelFilter = () => {
    setShowHeader([...showHeader]);
    setShowFilter(false);
  };

  async function handleApplyButton() {
    try {
      // setCompareId("2")
      // defaultCompareDate("2");

      setAmazonFilters({
        ...amazonFilters,
        compareId: "2",
        manual_compare_date: compDateRange[0],
      });
      setFlipkartFilters({
        ...flipkartFilters,
        compareId: "2",
        manual_compare_date: compDateRange[0],
      });
      setBlinkitFilters({
        ...blinkitFilters,
        compareId: "2",
        manual_compare_date: compDateRange[0],
      });
      setZeptoFilters({
        ...zeptoFilters,
        compareId: "2",
        manual_compare_date: compDateRange[0],
      });
      setInstamartFilters({
        ...instamartFilters,
        compareId: "2",
        manual_compare_date: compDateRange[0],
      });
    } catch (e) {
      console.error(e);
    }
  }

  const customValueRenderer = (selected) => {
    let selectedLabels = [];
    if (selected.length) {
      selected.map(({ label }) => selectedLabels.push(label));
    }
    return selectedLabels.join(",");
  };

  const saveComp = async (state, name) => {
    try {
      const post = {
        name: name,
        startDate: state[0].startDate,
        endDate: state[0].endDate,
        platform: "flipkart",
      };
      await _POST(COMP_DATE, post);
      await loadCompData();
    } catch (e) {
      console.error(e);
    }
  };

  const applyFilter = React.useCallback(() => {
    let updatedIds = {};
    updatedIds["placement"] = [];
    dispatch({
      type: ActionType.CHECKBOX,
      payload: { ...selectedCheckBox, ...updatedIds },
    });

    setShowHeader(
      showHeader.map((checkbox) =>
        checkbox.checked === true
          ? { ...checkbox, showCol: true }
          : { ...checkbox, showCol: false }
      )
    );
    showHeader.map((item) => {
      if (
        (item.value === "keyword" ||
          item.value === "campaign_name" ||
          item.value === "ad_group_name" ||
          item.value === "ad_group__id" ||
          item.value === "segment" ||
          item.value === "platform") &&
        item.checked
      ) {
        setCallApi(true);
      }
    });
    setShowFilter(false);
  }, [showHeader]);

  async function deleteComp(id) {
    try {
      await _DELETE(COMP_DATE + `/${id}`);
      await loadCompData();
    } catch (e) {
      console.error(e);
    }
  }
  // const saveSearchInit = async (name) => {
  //   let payload = {
  //     filters: filters,
  //     name: name,
  //     user_id: 1,
  //     media_type: "flipkart",

  //     platforms: JSON.parse(localStorage.getItem("platforms")),
  //   };
  //   const res = await saveSearch(payload);
  //   if (res)
  //     getSavedSearch().then((data) => {
  //       let search = savedSearch;
  //       //console.log(data, "data123");
  //       search.children = data;
  //       //console.log(search, "search123");
  //       setSavedSearch({ ...search });
  //     });

  //   if (res && res.result) {
  //     dispatch(
  //       setToastMessageHandler(
  //         "Your search is saved in saved search section",
  //         true
  //       )
  //     );
  //   } else {
  //     dispatch(
  //       setToastMessageHandler(
  //         "There is some issue in saving your saved search",
  //         false
  //       )
  //     );
  //   }
  // };

  // const getSavedSearch = async () => {
  //   let payload = {
  //     user_id: 1,
  //     media_type: "flipkart",
  //   };
  //   let data = await getSavedSearchList(payload);
  //   // console.log(data, "data111");
  //   return data;
  // };

  async function applyDate() {
    onChangeDate({ selection: dateRange[0] });
    dashboardApi();

    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
  }
  // const handleSelectedData = (data) => {
  //   setCheckboxData(data);
  //   setShowDropDown(false);
  // };

  // function hideSearchPopUpModal() {
  //   setSaveSearchModal(false);
  // }

  // function applyDateRangeFilter(item) {
  //   setDateGrouping(item.value);
  //   setisbtopen(false);
  // }

  function applyFilters(name, value) {
    setSelectedTags(value);
    setFlipkartFilters((prev) => ({
      ...prev,
      tags: value,
    }));
    setAmazonFilters((prev) => ({
      ...prev,
      tags: value,
    }));
    setBlinkitFilters((prev) => ({
      ...prev,
      tags: value,
    }));
    setZeptoFilters((prev) => ({
      ...prev,
      tags: value,
    }));
    setInstamartFilters((prev) => ({
      ...prev,
      tags: value,
    }));
  }

  function setCampaignType(e) {
    if (e.length < 1) {
      return;
    }
    let selectedCampTypeValue = e.map((item) => item.value);
    setCamp(e);
    // setAmazonFilters({
    //   ...amazonFilters,
    //   campaign_types:[e.target.value]
    // })
    //console.log("Campaign type changeeeeeeeeeeeeeeee", e.target.value);
    setAmazonFilters({
      ...amazonFilters,
      campaign_types: selectedCampTypeValue,
    });

    setFlipkartFilters({
      ...flipkartFilters,
      campaign_types: selectedCampTypeValue,
    });

    setBlinkitFilters({
      ...blinkitFilters,
      campaign_types: selectedCampTypeValue,
    });

    setZeptoFilters({
      ...zeptoFilters,
      campaign_types: selectedCampTypeValue,
    });
    setInstamartFilters({
      ...instamartFilters,
      campaign_types: selectedCampTypeValue,
    });
    // flipkartFilters={
    //   ...flipkartFilters,
    //   campaign_types:[e.target.value]
    // }

    // setFlipkartFilters({
    //   ...flipkartFilters,
    //   campaign_types:[e.target.value]
    // })
    //initLoad();
  }

  function setPlatformFilter(selected) {
    if (selected.length < 1) {
      return;
    } else {
      {
        if (selected.length > 2) {
          selected = selected.slice(1);
        }
        setSelectedBrandOption(selected);
      }
      // let updatedAccount = brandDataListing.map(
      //   (brand) => {
      //    return selected.map((item) => {
      //     console.log(brand?.value == item?.value)
      //     if(brand?.value == item?.value);
      //    })
      //   }
      // );
      let updatedAccount = brandDataListing.filter((a) =>
        selected.some((b) => a.value === b.value)
      );
      let selectedAccountValue = selected.map((item) => item.value);
      let selectedAmazonAccountValue = updatedAccount.map(
        (item) => item?.amazon_id
      );
      // saveLocalStorageAccounts(selectedAccountValue);
      setSelectedBrand(updatedAccount);
      const filteredTags = allTags.filter(
        (tag) =>
          selectedAccountValue.some((r) => tag.accounts.includes(r)) ||
          tag.platforms.includes("blinkit")
      );
      const tags = flipkartFilters.tags.filter((selected) =>
        filteredTags.some((_tag) => _tag._id === selected)
      );
      setSelectedTags(tags);
      setAmazonFilters({
        ...amazonFilters,
        brand: selectedAmazonAccountValue,
        tags,
      });
      setFlipkartFilters({
        ...flipkartFilters,
        brand: selectedAccountValue,
        tags,
      });
      setZeptoFilters({
        ...zeptoFilters,
        brand: selectedAccountValue,
        tags,
      });
      setBlinkitFilters({
        ...blinkitFilters,
        tags,
      });
      setInstamartFilters({
        ...instamartFilters,
        brand: selectedAccountValue,
        tags,
      });

      // setAmazonFilters({
      //     ...amazonFilters,
      //     brand:[updatedAccount?.amazon_id]
      // })

      //   setFlipkartFilters({
      //     ...flipkartFilters,
      //     brand:selectedAccountValue
      // })

      // initLoad(); // Call initLoad to update summary based on the selected brand
      // setPlatformId(e.target.amazon_id);

      // Check if "default_filter" exists in localStorage and initialize it if it doesn't
      let filters = JSON.parse(localStorage.getItem("default_filter")) || {};

      // Check if "flipkart" exists in filters and initialize it if it doesn't
      if (!Object.prototype.hasOwnProperty.call(filters, "flipkart")) {
        filters["flipkart"] = {};
      }
      // let filters = JSON.parse(localStorage.getItem("default_filter"));
      // console.log("account::::::::::::filters", filters);
      // filters["flipkart"]["multi"] = selectedAccountValue;
      localStorage.setItem("default_filter", JSON.stringify(filters));
      // console.log("account::::::::::::", e.target.value);
      // console.log(account,e.target.value);
      // let accountName = brandDataListing.find(
      //   ({ platform_id }) => platform_id === e.target.value
      // );
      // // console.log("accountName123", accountName.value);
      // setAccount(accountName?.value);
      // dispatch(getWallletBalance(selectedAccountValue));
    }
  }

  const tagsOptions = useMemo(() => {
    if (!selectedBrandOption || !allTags) return [];

    const brandLabel = selectedBrandOption?.map((item) => item.label);
    const filteredTags = allTags.filter(
      (tag) =>
        brandLabel.some((r) => tag.accounts.includes(r)) ||
        tag.platforms.includes("blinkit")
    );
    const lableValue = filteredTags.map((ele) => ({
      label: ele.tag_name,
      value: ele._id,
    }));
    return lableValue;
  }, [selectedBrandOption, allTags]);

  // React.useEffect(() => {
  //   // dispatch(getWallletBalance(account));
  // }, [account]);
  const campType = camp.map((item) => item.value);
  let post = {
    filters: graphFilters,
    // dateGrouping: dateGrouping,
    start_date: convertDate(dateRange[0]?.startDate),
    end_date: convertDate(dateRange[0]?.endDate),
    comp_start_date: convertDate(compDateRange[0]?.startDate),
    comp_end_date: convertDate(compDateRange[0]?.endDate),
    brand: _.isArray(selectedBrand) ? selectedBrand : [selectedBrand],
    camp_type: _.isArray(campType) ? campType : [campType],
    compareId: compareFilters["compare_id"],
    platforms: JSON.parse(localStorage.getItem("platforms"))?.platform,
    tags: selectedTags,
  };
  async function dashboardApi() {
    if (selectedBrand.length < 1) {
      setGraphData([]);
    } else {
      setGraphLoading(true);
      let res = await _POST(COMMON_GRAPH_API_URL, {
        ...post,
        tags: selectedTags,
      });

      if (res?.data?.data) {
        setGraphLoading(false);
        setGraphData(res.data.data);
      }
    }
  }
  useEffect(() => {
    dashboardApi();
  }, [...graphFilters, camp, selectedBrand, selectedTags]);

  useEffect(() => {
    if (!calState.fullCalender) dashboardApi();
  }, [
    dateRange[0]?.startDate,
    dateRange[0]?.endDate,
    compDateRange[0].startDate,
    compDateRange[0].endDate,
  ]);

  useEffect(() => {
    initLoad();
  }, [
    amazonFilters,
    blinkitFilters,
    flipkartFilters,
    zeptoFilters,
    instamartFilters,
    selectedBrand,
  ]);

  const onValChange = () => {
    if (check) {
      setVal("Absolute");
    } else {
      setVal("DRR");
    }
    setcheck(!check);
    setAmazonFilters({
      ...amazonFilters,
      drr: !check,
    });

    setFlipkartFilters({
      ...flipkartFilters,
      drr: !check,
    });
    setBlinkitFilters({
      ...blinkitFilters,
      drr: !check,
    });
    setZeptoFilters({
      ...zeptoFilters,
      drr: !check,
    });
    setInstamartFilters({
      ...instamartFilters,
      drr: !check,
    });
    //initLoad();
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

  // const changeTagsData = (compaignId, TagsId) => {
  //   childRef.current?.getAlert(compaignId, TagsId);
  // };
  // const [filterName,setFilterName] = useState([]);
  return (
    <>
      <div className="sticky z-40 top-14">
        <Toast></Toast>
        <section className=" flex-nowrap p-4 bg-white border">
          <div className="flex">
            {/* <div className="flipkart__selectfilter">
              <select
                className="campaignselect flipkartRing"
                onChange={(e) => setPlatformFilter(e)}
              >
                {brandDataListing.map((row, i) => {
                  return (
                    <option
                      key={i}
                      selected={row.value === selectedBrand.value}
                      value={row.value}
                    >
                      {row.label}
                    </option>
                  );
                })}
              </select>
            </div> */}

            <div className="flipkart__selectfilter z-30">
              <MultiSelect
                className="h-12 rmsc--tagManager"
                options={accountOptions}
                value={selectedBrandOption}
                onChange={(selected) => setPlatformFilter(selected)}
                labelledBy="Select Tags"
                valueRenderer={customValueRenderer}
                ClearSelectedIcon={null}
                disableSearch={true}
                hasSelectAll={false}
                selectionLimit={2}
              />
            </div>

            <div className="flipkart__selectfilter z-30">
              <MultiSelect
                className="h-12 rmsc--tagManager"
                options={campaigntype}
                value={camp}
                onChange={(selected) => setCampaignType(selected)}
                labelledBy="Select Tags"
                valueRenderer={customValueRenderer}
                ClearSelectedIcon={null}
                disableSearch={true}
                hasSelectAll={false}
                selectionLimit={2}
              />
            </div>

            {/* <div className="col_2 mr-4">
              <select
                className="campaignselect"
                onChange={(e) => handleSelectChange(e.target.value)}
              >
                {/* <option selected disabled>
                  Select
                //</option> 
                {filterdata?.map((item, i) => {
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
              </select>
            </div> */}
            {/* <div className="col_2  mr-4">
              <select
                className="campaignselect "
                onChange={(e) => handleSecondChange(e.target.value)}
              >
                {/* <option selected disabled>
                  Select
                </option> 
                {filterdata?.map((item, i) => {
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
              </select>
            </div> */}

            <div className="flipkart__calander">
              <DatePicker
                onChangeDate={onChangeDate}
                state={dateRange}
                setState={setDateRange}
                calState={calState}
                setCalState={setCalState}
                top
                applyDate={applyDate}
                className="border !top-[38px]"
                platform={"flipkart"}
              />
            </div>
            <div className="w-[25%] relative mx-2">
              <CompareDatePicker
                className="h-3 !right-0 !top-10"
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
                platform={"flipkart"}
              />
            </div>
            <div className="flipkart__selectfilter z-0">
              <SelectBox
                // label="Select Tags"
                options={tagsOptions}
                applyFilters={applyFilters}
                filterName={"tags"}
                defaultSelected={tagsOptions}
                unSelectDefault={true}
                label={"Select Tag"}
                accounts={selectedBrandOption.map((item) => item.value)}
                platform="flipkart"
                tagManagerDropdown
              />
            </div>
          </div>
        </section>
      </div>
      <div className="pt-4">
        <div className="flipkart__graphcard px-5 ">
          <div className="px-5 pt-5  font-semibold text-2xl">
            Graphical Analysis
          </div>
          {/* {graphLoading && <GraphLoading />} */}
          {Object.keys(graphData)?.length > 0 ? (
            <CommonScreenGraph
              activeCards={activeCards}
              setActiveCards={setActiveCards}
              graphFilters={graphFilters}
              showDetails={true}
              // filterdata={filterdata}={}
              allowedPlatforms={allowedPlatforms}
              graphData={graphData}
              graphOption={graphOption}
              setGraphOption={setGraphOption}
            />
          ) : (
            <div className="py-[70px] mx-24">
              <SkeletonChart height="h-[10rem]" />
            </div>
          )}
        </div>
      </div>

      {allowedPlatforms && allowedPlatforms?.length > 0 && (
        <div className="outerContainerTable px-2 relative mt-5">
          <div className="outerContainerTable__header w-full items-center">
            <div className="flex items-center justify-between w-full">
              <div className=" flex">
                <div className="outerContainer__image">
                  <img
                    className="px-2 pt-1 "
                    src="/assets/images/campaign-icon1.svg"
                    alt=""
                  />
                </div>
                <div className="outerContainer__title self-center font-semibold">
                  Platform overview
                </div>
              </div>
              <div className="flipkart__cardTitle flex items-center">
                <ToggleButton
                  label1={"Absolute"}
                  label2={"DRR"}
                  val={val}
                  setVal={onValChange}
                ></ToggleButton>
              </div>
              {/* <div className="relative mt-4 mx-2">
                    <CustomizeDropDown
                      title="Customize column"
                      setShowHeader={setShowHeader}
                      showHeader={showHeader}
                      applyFilter={applyFilter}
                      cancelFilter={cancelFilter}
                      setShowFilter={setShowFilter}
                      showFilter={showFilter}
                    />
                  </div> */}
            </div>
          </div>
        </div>
      )}

      <div className="">
        {/* <CommonScreenTable
          filterName={filterName}
          setFilterName={setFilterName} */}

        <CommonScreenTable
          loadingSummary={loadingSummary}
          filterName={filterName}
          amazonSummary={amazonSummary}
          flipkartSummary={flipkartSummary}
          blinkitSummary={blinkitSummary}
          zeptoSummary={zeptoSummary}
          instamartSummary={instamartSummary}
          setFilterName={setFilterName}
          graphFilters={graphFilters}
          setGraphFilters={setGraphFilters}
          allowedPlatforms={allowedPlatforms}
          noComparison={noComparison}
        />
      </div>
      {/* <div className="pt-5">
        <Evalution
          amazonPerformanceData={amazonPerformanceData}
          amazonReachData={amazonReachData}
          blinkitReachData={blinkitReachData}
          blinkitPerformanceData={blinkitPerformanceData}
          flipkartReachData={flipkartReachData}
          flipkartPerformanceData={flipkartPerformanceData}
          flipkartTotal={flipkartTotal}
          amazonTotal={amazonTotal}
          blinkitTotal={blinkitTotal}
          zeptoPerformanceData={zeptoPerformanceData}
          zeptoTotal={zeptoTotal}
          zeptoReachData={zeptoReachData}
          instamartPerformanceData={instamartPerformanceData}
          instamartTotal={instamartTotal}
          allowedPlatforms={allowedPlatforms}
        />
      </div>
      <div className="flex">
        <AlertMetrices />
        <div className="bg-gray-70 w-2"></div>
        {allowedPlatforms && allowedPlatforms?.length > 0 && (
          <AlertTotal
            blinkitTotal={blinkitTotalCal}
            amazonTotal={amazonTotalCal}
            flipkartTotal={flipkartTotalCal}
            zeptoTotal={zeptoTotalCal}
            instamartTotal={instamartTotalCal}
            allowedPlatforms={allowedPlatforms}
          />
        )}

        <div className="bg-gray-70 w-2"></div>
        {allowedPlatforms && allowedPlatforms?.includes("amazon") && (
          <AlertBox
            platformIcon="/assets/images/icons8-amazon.svg"
            campaignType="Performance"
            posImp={amazonPerformance?.impressions_positive}
            posSpend={amazonPerformance?.spend_positive}
            posCtr={amazonPerformance?.ctr_positive}
            posCpc={amazonPerformance?.cpc_positive}
            posRoas={amazonPerformance?.roas_positive}
            posCpm={amazonPerformance?.cpm_positive}
            negImp={amazonPerformance?.impressions_negative}
            negSpend={amazonPerformance?.spend_negative}
            negCtr={amazonPerformance?.ctr_negative}
            negCpc={amazonPerformance?.cpc_negative}
            negRoas={amazonPerformance?.roas_negative}
            negCpm={amazonPerformance?.cpm_negative}
            posClicks={amazonPerformance?.clicks_positive}
            negClicks={amazonPerformance?.clicks_negative}
            posSales={amazonPerformance?.sales_positive}
            negSales={amazonPerformance?.sales_negative}
            negCampaigns={amazonPerformance?.negativeCampaignsLength}
            posCampaigns={amazonPerformance?.positiveCampaignsLength}
          />
        )}
        {allowedPlatforms && allowedPlatforms?.includes("blinkit") && (
          <AlertBox
            platformIcon="/assets/images/blinkitFavicon.ico"
            campaignType={
              ["amazon"].some(
                (platform) =>
                  allowedPlatforms && allowedPlatforms?.includes(platform)
              )
                ? ""
                : "Performance"
            }
            posImp={blinkitPerformance?.impressions_positive}
            posSpend={blinkitPerformance?.spend_positive}
            posCtr={blinkitPerformance?.ctr_positive}
            posCpc={blinkitPerformance?.cpc_positive}
            posCpm={blinkitPerformance?.cpm_positive}
            posRoas={blinkitPerformance?.roas_positive}
            negImp={blinkitPerformance?.impressions_negative}
            negSpend={blinkitPerformance?.spend_negative}
            negCtr={blinkitPerformance?.ctr_negative}
            negCpc={blinkitPerformance?.cpc_negative}
            negCpm={blinkitPerformance?.cpm_negative}
            negRoas={blinkitPerformance?.roas_negative}
            negCampaigns={blinkitPerformance?.negativeCampaignsLength}
            posCampaigns={blinkitPerformance?.positiveCampaignsLength}
            posSales={blinkitPerformance?.sales_positive}
            negSales={blinkitPerformance?.sales_negative}
            posClicks={blinkitPerformance?.clicks_positive}
            negClicks={blinkitPerformance?.clicks_negative}
          />
        )}
        {allowedPlatforms && allowedPlatforms?.includes("flipkart") && (
          <AlertBox
            platformIcon="/assets/images/flipkartFavicon.png"
            campaignType={
              ["amazon", "blinkit"].some(
                (platform) =>
                  allowedPlatforms && allowedPlatforms?.includes(platform)
              )
                ? ""
                : "Performance"
            }
            posImp={flipkartPerformance?.impressions_positive}
            posSpend={flipkartPerformance?.spend_positive}
            posCtr={flipkartPerformance?.ctr_positive}
            posCpc={flipkartPerformance?.cpc_positive}
            posCpm={flipkartPerformance?.cpm_positive}
            posRoas={flipkartPerformance?.roas_positive}
            negImp={flipkartPerformance?.impressions_negative}
            negSpend={flipkartPerformance?.spend_negative}
            negCtr={flipkartPerformance?.ctr_negative}
            negCpc={flipkartPerformance?.cpc_negative}
            negCpm={flipkartPerformance?.cpm_negative}
            negRoas={flipkartPerformance?.roas_negative}
            posClicks={flipkartPerformance?.clicks_positive}
            negClicks={flipkartPerformance?.clicks_negative}
            posSales={flipkartPerformance?.sales_positive}
            negSales={flipkartPerformance?.sales_negative}
            negCampaigns={flipkartPerformance?.negativeCampaignsLength}
            posCampaigns={flipkartPerformance?.positiveCampaignsLength}
          />
        )}

        {allowedPlatforms && allowedPlatforms?.includes("zepto") && (
          <AlertBox
            platformIcon="/assets/images/zepto-icon.png"
            campaignType={
              ["amazon", "blinkit", "flipkart"].some(
                (platform) =>
                  allowedPlatforms && allowedPlatforms?.includes(platform)
              )
                ? ""
                : "Performance"
            }
            posImp={zeptoPerformance?.impressions_positive}
            posSpend={zeptoPerformance?.spend_positive}
            posCtr={zeptoPerformance?.ctr_positive}
            posCpc={zeptoPerformance?.cpc_positive}
            posCpm={zeptoPerformance?.cpm_positive}
            posRoas={zeptoPerformance?.roas_positive}
            negImp={zeptoPerformance?.impressions_negative}
            negSpend={zeptoPerformance?.spend_negative}
            negCtr={zeptoPerformance?.ctr_negative}
            negCpc={zeptoPerformance?.cpc_negative}
            negCpm={zeptoPerformance?.cpm_negative}
            negRoas={zeptoPerformance?.roas_negative}
            negCampaigns={zeptoPerformance?.negativeCampaignsLength}
            posCampaigns={zeptoPerformance?.positiveCampaignsLength}
            posSales={zeptoPerformance?.sales_positive}
            negSales={zeptoPerformance?.sales_negative}
            posClicks={zeptoPerformance?.clicks_positive}
            negClicks={zeptoPerformance?.clicks_negative}
          />
        )}
        {allowedPlatforms && allowedPlatforms?.includes("zepto") && (
          <AlertBox
            platformIcon="/assets/images/swiggy.svg"
            campaignType={
              ["amazon", "blinkit", "flipkart"].some(
                (platform) =>
                  allowedPlatforms && allowedPlatforms?.includes(platform)
              )
                ? ""
                : "Performance"
            }
            posImp={instamartPerformance?.impressions_positive}
            posSpend={instamartPerformance?.spend_positive}
            posCtr={instamartPerformance?.ctr_positive}
            posCpc={instamartPerformance?.cpc_positive}
            posCpm={instamartPerformance?.cpm_positive}
            posRoas={instamartPerformance?.roas_positive}
            negImp={instamartPerformance?.impressions_negative}
            negSpend={instamartPerformance?.spend_negative}
            negCtr={instamartPerformance?.ctr_negative}
            negCpc={instamartPerformance?.cpc_negative}
            negCpm={instamartPerformance?.cpm_negative}
            negRoas={instamartPerformance?.roas_negative}
            negCampaigns={instamartPerformance?.negativeCampaignsLength}
            posCampaigns={instamartPerformance?.positiveCampaignsLength}
            posSales={instamartPerformance?.sales_positive}
            negSales={instamartPerformance?.sales_negative}
            posClicks={instamartPerformance?.clicks_positive}
            negClicks={instamartPerformance?.clicks_negative}
          />
        )}

        <div className="bg-gray-70 w-2"></div>

        {allowedPlatforms && allowedPlatforms?.includes("amazon") && (
          <AlertBox
            platformIcon="/assets/images/icons8-amazon.svg"
            campaignType="Reach"
            posImp={amazonReach?.impressions_positive}
            posSpend={amazonReach?.spend_positive}
            posCtr={amazonReach?.ctr_positive}
            posCpc={amazonReach?.cpc_positive}
            posRoas={amazonReach?.roas_positive}
            posCpm={amazonReach?.cpm_positive}
            negImp={amazonReach?.impressions_negative}
            negSpend={amazonReach?.spend_negative}
            negCtr={amazonReach?.ctr_negative}
            negCpc={amazonReach?.cpc_negative}
            negRoas={amazonReach?.roas_negative}
            negCpm={amazonReach?.cpm_negative}
            negCampaigns={amazonReach?.negativeCampaignsLength}
            posCampaigns={amazonReach?.positiveCampaignsLength}
            posSales={amazonReach?.sales_positive}
            negSales={amazonReach?.sales_negative}
            posClicks={amazonReach?.clicks_positive}
            negClicks={amazonReach?.clicks_negative}
          />
        )}
        {allowedPlatforms && allowedPlatforms?.includes("blinkit") && (
          <AlertBox
            platformIcon="/assets/images/blinkitFavicon.ico"
            campaignType={
              ["amazon"].some(
                (platform) =>
                  allowedPlatforms && allowedPlatforms?.includes(platform)
              )
                ? ""
                : "Reach"
            }
            posImp={blinkitReach?.impressions_positive}
            posSpend={blinkitReach?.spend_positive}
            posCtr={blinkitReach?.ctr_positive}
            posCpc={blinkitReach?.cpc_positive}
            posCpm={blinkitReach?.cpm_positive}
            posRoas={blinkitReach?.roas_positive}
            negImp={blinkitReach?.impressions_negative}
            negSpend={blinkitReach?.spend_negative}
            negCtr={blinkitReach?.ctr_negative}
            negCpc={blinkitReach?.cpc_negative}
            negCpm={blinkitReach?.cpm_negative}
            negRoas={blinkitReach?.roas_negative}
            negCampaigns={blinkitReach?.negativeCampaignsLength}
            posCampaigns={blinkitReach?.positiveCampaignsLength}
            posSales={blinkitReach?.sales_positive}
            negSales={blinkitReach?.sales_negative}
            posClicks={blinkitReach?.clicks_positive}
            negClicks={blinkitReach?.clicks_negative}
          />
        )}
        {allowedPlatforms && allowedPlatforms?.includes("flipkart") && (
          <AlertBox
            platformIcon="/assets/images/flipkartFavicon.png"
            campaignType={
              ["amazon", "blinkit"].some(
                (platform) =>
                  allowedPlatforms && allowedPlatforms?.includes(platform)
              )
                ? ""
                : "Reach"
            }
            posImp={flipkartReach?.impressions_positive}
            posSpend={flipkartReach?.spend_positive}
            posCtr={flipkartReach?.ctr_positive}
            posCpc={flipkartReach?.cpc_positive}
            posCpm={flipkartReach?.cpm_positive}
            posRoas={flipkartReach?.roas_positive}
            negImp={flipkartReach?.impressions_negative}
            negSpend={flipkartReach?.spend_negative}
            negCtr={flipkartReach?.ctr_negative}
            negCpc={flipkartReach?.cpc_negative}
            negCpm={flipkartReach?.cpm_negative}
            negRoas={flipkartReach?.roas_negative}
            negCampaigns={flipkartReach?.negativeCampaignsLength}
            posCampaigns={flipkartReach?.positiveCampaignsLength}
            posSales={flipkartReach?.sales_positive}
            negSales={flipkartReach?.sales_negative}
            posClicks={flipkartReach?.clicks_positive}
            negClicks={flipkartReach?.clicks_negative}
          />
        )}
        {allowedPlatforms && allowedPlatforms?.includes("zepto") && (
          <AlertBox
            platformIcon="/assets/images/zepto-icon.png"
            campaignType={
              ["amazon", "blinkit", "flipkart"].some(
                (platform) =>
                  allowedPlatforms && allowedPlatforms?.includes(platform)
              )
                ? ""
                : "Reach"
            }
            posImp={zeptoReach?.impressions_positive}
            posSpend={zeptoReach?.spend_positive}
            posCtr={zeptoReach?.ctr_positive}
            posCpc={zeptoReach?.cpc_positive}
            posCpm={zeptoReach?.cpm_positive}
            posRoas={zeptoReach?.roas_positive}
            negImp={zeptoReach?.impressions_negative}
            negSpend={zeptoReach?.spend_negative}
            negCtr={zeptoReach?.ctr_negative}
            negCpc={zeptoReach?.cpc_negative}
            negCpm={zeptoReach?.cpm_negative}
            negRoas={zeptoReach?.roas_negative}
            negCampaigns={zeptoReach?.negativeCampaignsLength}
            posCampaigns={zeptoReach?.positiveCampaignsLength}
            posSales={zeptoReach?.sales_positive}
            negSales={zeptoReach?.sales_negative}
            posClicks={zeptoReach?.clicks_positive}
            negClicks={zeptoReach?.clicks_negative}
          />
        )}
        
      </div> */}
    </>
  );
};

export default CommonScreenDashBoard;
