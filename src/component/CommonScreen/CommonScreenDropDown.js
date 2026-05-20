/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "../DatePicker";
import { useDispatch, useSelector } from "react-redux";
import {
  GET_COMMON_ACCOUNTS,
} from "../../utils/constants";
import {
  saveSearch,
  getSavedSearchList,
} from "../../redux/action-creator/campaignSearchAction";
import {
  campaignSearchHeaders,
  keywordSearchHeaders,
  adGroupSearchHeaders,
  fsnSearchHeaders,
  placementSearchHeaders,
  creativeSearchHeaders,
} from "../../utils/constants";
import Toast from "../common-components/toast";
import ActionType from "../../redux/types";
import {
  convertDate,
  defaultFilterCheck,
  defaultDateRange,
} from "../../utils/helpers";
import { _POST } from "../../services/axios.method";
import { setToastMessageHandler } from "../../redux/action-creator/commonAction";
import { getWallletBalance } from "../../redux/action-creator/sideBarAction";
import CommonScreenGraph from "./CommonScreenGraph";

const CommonScreenDropDowns = ({ graphOption, setGraphOption }) => {
  const dateFilters = defaultDateRange();
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [showDropDown, setShowDropDown] = useState(false);
  const [dateRange, setDateRange] = React.useState([
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
  useEffect(() => {
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  }, []);

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
  }

  const adjustIconRef = useRef(null);
  const [account, setAccount] = useState("Veet");
  const [activeCards, setActiveCards] = useState([]);
  const [graphFilters, setGraphFilters] = useState(["spend", "orders"]);
  const [graphFilterOne, setGraphFilterOne] = useState("spend");
  const [graphFilterTwo, setGraphFilterTwo] = useState("orders");
  // eslint-disable-next-line no-unused-vars
  const [showFilter, setShowFilter] = useState(false);
  const [saveSearchModal, setSaveSearchModal] = useState(false);
  const [dateGrouping, setDateGrouping] = useState("daily");
  const [brandDataListing, setBrandDataListing] = useState([]);
  const [ShowTab, setShowTab] = useState("campaign");
  // const [platformId, setPlatformId] = useState("123");
  const [platformId, setPlatformId] = useState();
  // eslint-disable-next-line no-unused-vars
  const [clearSearch, setClearSearch] = useState(false);
  const [btopen, setisbtopen] = useState(false);
  // eslint-disable-next-line no-unused-vars
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
  }, [dateRange, account]);

  const filterdata = [
    {
      label: "Spends",
      value: "spend",
    },
    {
      label: "Views",
      value: "views",
    },
    {
      label: "Clicks",
      value: "clicks",
    },
    {
      label: "CVR",
      value: "cvr",
    },
    {
      label: "CTR",
      value: "ctr",
    },
    {
      label: "CPC",
      value: "cpc",
    },
    {
      label: "Revenue",
      value: "total_revenue",
    },
    {
      label: "Unit Sold",
      value: "orders",
    },
    {
      label: "ROI",
      value: "total_roas",
    },
    {
      label: "AOV",
      value: "aov",
    },
    {
      label: "PPV",
      value: "total_ppv",
    },
    {
      label: "Direct Revenue",
      value: "direct_revenue",
    },
    {
      label: "Direct Unit Sold",
      value: "units_sold_direct",
    },
    {
      label: "Direct ROI",
      value: "direct_roas",
    },
    {
      label: "Direct AOV",
      value: "direct_aov",
    },
    {
      label: "Direct PPV",
      value: "ppv_direct_click",
    },
    {
      label: "Indirect Revenue",
      value: "indirect_revenue",
    },
    {
      label: "Indirect Units Sold",
      value: "units_sold_indirect",
    },
    {
      label: "Indirect ROI",
      value: "indirect_roas",
    },
    {
      label: "Indirect AOV",
      value: "indirect_aov",
    },
    {
      label: "Indirect PPV",
      value: "ppv_indirect_click",
    },
  ];

  const campaigntype = [
    {
      label: "Reach",
      value: "reach",
    },
    {
      label: "Performance",
      value: "performance",
    },
  ];

  React.useEffect(() => {
    setGraphFilters([graphFilterOne, graphFilterTwo]);
  }, [graphFilterOne, graphFilterTwo]);
  // useEffect(()=>{
  //   if(filters.keyword.length){
  //     getTabData(ShowTab,true);
  //   }
  // },[filters]);
  useEffect(() => {
    getSavedSearch().then((data) => {
      let search = savedSearch;
      //console.log(data, "data123");
      search.children = data;
      //console.log(search, "search123");
      setSavedSearch({ ...search });
    });
  }, []);
 

  useEffect(() => {
    //getTabData(ShowTab,true,filters);
  }, [dateRange, ShowTab]);
  useEffect(() => {}, [saveSearchModal]);


  // eslint-disable-next-line no-unused-vars
  const [graphData, setGraphData] = useState([]);


  // eslint-disable-next-line no-unused-vars
  const [checkboxData, setCheckboxData] = useState([]);


  const getSavedSearch = async () => {
    let payload = {
      user_id: 1,
      media_type: "flipkart",
    };
    let data = await getSavedSearchList(payload);
    // console.log(data, "data111");
    return data;
  };
  const applyDate = () => {
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
    onChangeDate({ selection: dateRange[0] });
  };
  const handleSelectedData = (data) => {
    setCheckboxData(data);
    setShowDropDown(false);
  };

  function hideSearchPopUpModal() {
    setSaveSearchModal(false);
  }

  function applyDateRangeFilter(item) {
    setDateGrouping(item.value);
    setisbtopen(false);
  }

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
    dispatch(getWallletBalance(accountName?.value));
  }

  React.useEffect(() => {
    // dispatch(getWallletBalance(account));
  }, [account]);

  let post = {
    filters: graphFilters,
    dateGrouping: dateGrouping,
    start_date: convertDate(dateRange[0]?.startDate),
    end_date: convertDate(dateRange[0]?.endDate),
    platform_id: platformId,
  };
  // async function dashboardApi() {
  //   // let res = await _POST(CAMPAIGN_GRAPH_API_URL, post);
  //   // if (res?.data?.data) {
  //   //   setGraphData(res.data.data);
  //   // }
  // }
  // useEffect(() => {
  //   dashboardApi();
  // }, [...graphFilters, dateGrouping, platformId]);


  const accountNames = async () => {
    try {
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
      // console.log(accounts);
      setBrandDataListing(accounts);
      let filters = defaultFilterCheck(accounts, "/flipkart");
      // console.log("filters::::::::::::", filters);
      setPlatformId(filters["flipkart"]["single"]);
      let accountName = accounts?.find(
        ({ platform_id }) => platform_id === filters["flipkart"]["single"]
      );
      // console.log("inside", accountName.value);
      // dispatch(getWallletBalance(accountName.value));
      // console.log(brandDataListing, "<<<<,,bgdg", accounts[1].platform_id);
      // setPlatformId(brandDataListing[0].platform_id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accountNames();
  }, []);

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
  return (
    <>
      <div className="border">
        <Toast></Toast>
        <section className=" flex-nowrap p-4 bg-white">
          <div className=" flex">
            <div className="flipkart__selectfilter ">
              <select className="campaignselect " onChange={setPlatformFilter}>
                {brandDataListing.map((row, i) => {
                  return (
                    <option
                    key={i}
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

            <div className="col_2 mr-4">
              <select
                className="campaignselect"
                // onChange={(e) => handleSelectChange(e.target.value)}
              >
                {/* <option selected disabled>
                  Select
                </option> */}
                {campaigntype?.map((item, i) => {
                  return (
                    <>
                      <option
                        // disabled={item.value === graphFilterTwo}
                        // selected={item.value === graphFilterOne}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    </>
                  );
                })}
              </select>
            </div>

            <div className="col_2 mr-4">
              <select
                className="campaignselect"
                // onChange={(e) => handleSelectChange(e.target.value)}
              >
                {/* <option selected disabled>
                  Select
                </option> */}
                {/* {campaigntype?.map((item, i) => { */}
                return (
                <>
                  <option
                    // disabled={item.value === graphFilterTwo}
                    // selected={item.value === graphFilterOne}
                    value="category"
                  >
                    Category
                  </option>
                </>
                );
                {/* })} */}
              </select>
            </div>

            <div className="col_2 mr-4">
              <select
                className="campaignselect"
                // onChange={(e) => handleSelectChange(e.target.value)}
              >
                {/* <option selected disabled>
                  Select
                </option> */}
                {/* {campaigntype?.map((item, i) => { */}
                return (
                <>
                  <option
                    // disabled={item.value === graphFilterTwo}
                    // selected={item.value === graphFilterOne}
                    value="product"
                  >
                    Product
                  </option>
                </>
                );
                {/* })} */}
              </select>
            </div>

            <div className="col_2 mr-4">
              <select
                className="campaignselect"
                // onChange={(e) => handleSelectChange(e.target.value)}
              >
                {/* <option selected disabled>
                  Select
                </option> */}
                {/* {campaigntype?.map((item, i) => { */}
                return (
                <>
                  <option
                    // disabled={item.value === graphFilterTwo}
                    // selected={item.value === graphFilterOne}
                    value="category"
                  >
                    E-Label
                  </option>
                </>
                );
                {/* })} */}
              </select>
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

            <div className="flipkart__calander ml-3 ">
              <DatePicker
                onChangeDate={onChangeDate}
                state={dateRange}
                setState={setDateRange}
                calState={calState}
                setCalState={setCalState}
                top
                applyDate={applyDate}
                className="border"
              />
            </div>
          </div>
        </section>
      </div>
      <div className="pt-4">
        <div className="flipkart__graphcard ">
          <div className="px-5 pt-5  font-semibold text-2xl">
            Graphical Analysis
          </div>
          <CommonScreenGraph
            activeCards={activeCards}
            setActiveCards={setActiveCards}
            graphFilters={graphFilters}
            showDetails={true}
            filterdata={filterdata}
            graphData={graphData}
            graphOption={graphOption}
            setGraphOption={setGraphOption}
          />
        </div>
      </div>
    </>
  );
};
export default CommonScreenDropDowns;
