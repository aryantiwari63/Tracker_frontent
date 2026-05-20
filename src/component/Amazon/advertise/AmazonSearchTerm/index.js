/* eslint-disable */
import React, { useState, useEffect } from "react";
import _ from "lodash";
import AmazonSearchTable from "./AmazonSearchTable";
import Popup from "../../../common-components/Popups/Popup";
import SearchTermNegativePopup from "./SearchTermNegativePopup";
import FlipkartTable from "../../../common-components/amazontable";
import DatePicker from "../../../DatePicker";
import {
  ALL_BUTTON_FLAGS,
  brandDataListing,
  LIMIT,
  negativeKeywordsHeaders,
  amazonSearchTermsHeaders,
  SEARCHTERM,
  //GET_ACCOUNTS,
  GET_AMAZON_PROFILE,
} from "../../../../utils/constants";
// import {
//   editSearchTermAction,
//   getNegativeKeyword,
//  // getSearchTerm
// } from "../../../../redux/action-creator/campaignAction";

import {
  editSearchTermAction,
  getAmazonSearchTerm,
  editNegativeSearchTermAction,
} from "../../../../redux/action-creator/amazon/campaignAction";
import {
  convertDate,
  defaultDateRange,
  defaultFilterCheck,
  getLocalStorageAccounts,
  saveLocalStorageAccounts
} from "../../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { useCloseWhenClickOutside } from "../../../common-components/useCloseWhenClickOutside";
import KeywordMultiSearch from "../../../common-components/MultiSearch/KeywordMultiSearch";
import { getWallletBalance } from "../../../../redux/action-creator/sideBarAction";
import { _GET } from "../../../../services/axios.method";
import Toast from "../../../common-components/toast";
import SearchTermPopup from "./SearchTermPopup";
import ActionType from "../../../../redux/types";
import Button from "../../../common-components/button/Button";
import CustomSelectNew from "../../../common-components/CustomSelectNew";
const AmazonSearchTerm = () => {
  const dateFilters = defaultDateRange();

  const [showHeader, setShowHeader] = React.useState([
    ...amazonSearchTermsHeaders,
  ]);
  // const [loading, setLoading] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState({
    key: "spend",
    order: -1,
  });
  const [searchTermTypeData, setSearchTermTypeData] = React.useState();
  const [campaignTermTypeData, setCampaignTermTypeData] = React.useState();
  const [searchTermAction, setSearchTermAction] = React.useState();
  const [filters, setFilters] = useState([]);
  const [performing, setPerforming] = useState(false);
  // React.useEffect(() => {
  //   console.log("searchTermDatasearchTermData", searchTermData);
  // }, [searchTermData]);
  const dispatch = useDispatch();
  //const v = useSelector((state) => state.CampaignReducer);

  //console.log("hithisONEISSEARCHTERM",v);
  const { amazonSearchTerm } = useSelector((state) => state.CampaignReducer);
  // const amazonSearchTerm = [ { "data": {
  //   "data": [
  //       {
  //           "_id": "😎cool",
  //           "clicks": 0,
  //           "views": 2,
  //           "ctr": "0%",
  //           "cpc": "₹0",
  //           "spend": "₹0",
  //           "direct_units_sold": 0,
  //           "indirect_units_sold": 0,
  //           "total_units_sold": 0,
  //           "direct_revenue": "₹0",
  //           "indirect_revenue": "₹0",
  //           "total_revenue": "₹0",
  //           "campaign_id": "PSZA401TRQAM",
  //           "campaign_name": "PLA_MP_Soap_75x8gm_HV-Pack_Category_Auto_Apr23",
  //           "ad_group_id": "1NEGZZ7VR8L1",
  //           "ad_group_name": "Bath and Shower",
  //           "direct_product_page_views": 0,
  //           "indirect_product_page_views": 0,
  //           "direct_add_to_carts": 0,
  //           "indirect_add_to_carts": 0,
  //           "direct_converted_units": 0,
  //           "indirect_converted_units": 0,
  //           "direct_conversion_rate": 0,
  //           "report_type": "search_report",
  //           "account": "Dettol",
  //           "platform": "SM",
  //           "created_on": "2023-09-18",
  //           "segment": "PLA",
  //           "account_id": "RSAUFLMCSZ",
  //           "platform_id": "RC8MOJ2428",
  //           "cvr_direct": 0,
  //           "cvr_indirect": 0,
  //           "cvr_total": 0,
  //           "roi_direct": 0,
  //           "roi_indirect": 0,
  //           "roi_total": 0,
  //           "aov_direct": "₹0",
  //           "aov_indirect": "₹0",
  //           "aov_total": "₹0",
  //           "direct_cpa": 0,
  //           "indirect_cpa": 0
  //       }
  //     ]
  //   }}]

  const { loading } = useSelector((state) => state.CommonReducer);
  const [brandDataListing, setBrandDataListing] = useState([]);
  console.log("brand", brandDataListing[1]?.platform_id);

  const [platformId, setPlatformId] = useState(
    brandDataListing[1]?.platform_id.length > 1
      ? brandDataListing[1]?.platform_id
      : "3214432698219643"
  );
  const [account, setAccount] = useState();
  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [callApi, setCallApi] = React.useState(false);
  const [resetData, setResetData] = React.useState(false);
  const [campaignData, setCampaignData] = React.useState([]);
  React.useEffect(() => {
    if (amazonSearchTerm.data && amazonSearchTerm.data.length > 0) {
      if (resetData) {
        setCampaignData([...amazonSearchTerm.data]);
      } else {
        setCampaignData([...campaignData, ...amazonSearchTerm.data]);
      }

      if (amazonSearchTerm.data.length == 50) {
        setCallApi(true);
      } else {
        setCallApi(false);
      }
    }
  }, [amazonSearchTerm.data]);
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
  const [calState, setCalState] = React.useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });

  function onChangeDate(item) {
    defaultDateRange(item.selection);
    setDateRange([item.selection]);
    if (!calState.fullCalender) {
      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
      setCampaignData([]);
      // dispatch(getAmazonSearchTerm(post));
    }
  }
  const applyDate = () => {
    onChangeDate({ selection: dateRange[0] });
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
    dispatch(getAmazonSearchTerm(post));
  };
  const sortData = (item, order) => {
    setSortBy({
      key: item,
      order: order,
    });
    setCampaignData([]);
    setPage(1);
    setOffset(0);
    setDataLIMIT(0);
  };
  const paginate = (direction) => {
    if (direction == "prev") {
      setPage(page - 1);
      setOffset(offset - LIMIT);
    } else {
      setPage(page + 1);
      setOffset(offset + LIMIT);
    }
  };

  let post = {
    start_date: convertDate(dateRange[0].startDate),
    end_date: convertDate(dateRange[0].endDate),
    sort: { [sortBy.key]: sortBy.order },
    offset: offset,
    filters: filters,
    platform_id: platformId,
    dataLIMIT: dataLIMIT,
    performing: performing,
  };
  function applyFilters(searchFilters) {
    setFilters(searchFilters);
    post.filters = searchFilters;
    setCampaignData([]);
    dispatch(getAmazonSearchTerm(post));
  }

  // }, [offset, sortBy]);
  React.useEffect(() => {
    setCampaignData([]);
    setResetData(true);
    setDataLIMIT(0);
    //dispatch(getAmazonSearchTerm(post));
    dispatch(getAmazonSearchTerm(post));
  }, [sortBy, dateRange[0].startDate, dateRange[0].endDate, performing]);
  React.useEffect(() => {
    setResetData(false);

    if (callApi) {
      dispatch(getAmazonSearchTerm(post));
    }
  }, [dataLIMIT]);
  // React.useEffect(() => {
  //   dispatch(getAmazonSearchTerm(post));
  // }, []);

  const [open, setOpen] = useState(false);
  const [openpopup, setOpenPopup] = useState(false);
  const [negativePopup, setNegativePopup] = useState(false);
  const [editSearch, setEditSearch] = React.useState([]);
  const [selectedAdGroup, setSelectedAdGroup] = useState();

  const accountNames = async () => {
    try {
      const result = await _GET(GET_AMAZON_PROFILE);
      const data = result.data.data.profile_data;
      //console.log("dataIS",data);
      const accounts = data.map((item) => ({
        label: item.account_name,
        account_id: item.account_id,
        value: item.account_name,
        platform_id: item.profile_id,
        // profile_id: item._id?.profile_id,
      }));
      let accountsFilter = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
         let firstAccount = savedAccounts[0];
         let filterAccount = accounts.find(acc => acc.value === firstAccount);
         if (filterAccount) {
            accountsFilter = [filterAccount]
            saveLocalStorageAccounts([accountsFilter[0]?.value])
         } else {
           saveLocalStorageAccounts([accountsFilter[0]?.value])
         }
      } else {
        saveLocalStorageAccounts([accountsFilter[0]?.value])
      }
      setBrandDataListing(accounts);
      setAccount(accountsFilter[0].label);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    accountNames();
  }, []);
  useEffect(() => {
    if (openpopup == false) {
      setEditSearch([]);
      dispatch({
        type: ActionType.CAMPAIGNLISTAMAZON,
        payload: [],
      });
      dispatch({
        type: ActionType.ADGROUPLISTAMAZON,
        payload: [],
      });
      setSelectedAdGroup();
      setCampaignTermTypeData();
      setSearchTermTypeData();
    }
  }, [openpopup]);
  const editSearchTerm = () => {
    dispatch(
      editSearchTermAction(
        editSearch,
        searchTermTypeData,
        campaignTermTypeData,
        selectedAdGroup,
        "Amazon"
      )
    );
    setOpenPopup(false);
    setEditSearch([]);
    dispatch({
      type: ActionType.CAMPAIGNLISTAMAZON,
      payload: [],
    });
    dispatch({
      type: ActionType.ADGROUPLISTAMAZON,
      payload: [],
    });
    setSelectedAdGroup();
    setCampaignTermTypeData();
    setSearchTermTypeData();
  };
  const editSearchTermNegative = () => {
    dispatch(
      editNegativeSearchTermAction(
        editSearch,
        searchTermTypeData,
        searchTermAction
      )
    );
    setNegativePopup(false);
    console.log("searchtermtypedatataaa", searchTermTypeData, searchTermAction);
  };
  const editButtonRef = useRef(null);
  useCloseWhenClickOutside(open, setOpen, editButtonRef);
  
  function setPlatformFilter(eventValue) {
    setPlatformId(eventValue);
    post.platform_id = eventValue;
    setCampaignData([]);
    dispatch(getAmazonSearchTerm(post));
    let accountName = brandDataListing.find(
      ({ platform_id }) => platform_id === eventValue
    );
    let filters = JSON.parse(localStorage.getItem("default_filter_flipkart"));
    filters["flipkart"]["single"] = accountName?.platform_id;
    localStorage.setItem("default_filter_flipkart", JSON.stringify(filters));
    setEditSearch([]);
    // console.log("accountName123", accountName.value);
    setAccount(accountName.value);
    saveLocalStorageAccounts([accountName.label]);
  }

  // React.useEffect(() => {
  //   if (account) {
  //     dispatch(getWallletBalance(account));
  //   }
  // }, [account]);

  return (
    <>
      <div>
        <Toast />
        <div className="serachterm__heading bg-white px-2 pt-2">
          <h4 className="text-lg mb-2.5 mt-2.5 px-2 font-semibold">Search Terms</h4>
          <div className=" row pt-2">
            <div className="flipkart__selectfilter ">
              {/* <select
                className="campaignselect h-10"
                onChange={setPlatformFilter}
              >
                {brandDataListing.map((row, i) => {
                  return (
                    <option
                      selected={row.label === account}
                      value={row.platform_id}
                    >
                      {row.label}
                    </option>
                  );
                })}
              </select> */}
              {
                console.log(brandDataListing,account)
              }
              <CustomSelectNew
                label={"Select"}
                options={brandDataListing}
                value={platformId}
                optionValue="platform_id"
                onChange={setPlatformFilter}
                platform={"ams"}
                className="pt-[9px] pb-[10px]"
              />
            </div>
            <div className="col h-[50px]">
              <KeywordMultiSearch
                applySearchFilter={applyFilters}
                page={"search_term"}
                platform={"amazon"}
              />
            </div>
            <div className=" flipkart__calander  ">
              <DatePicker
                onChangeDate={onChangeDate}
                state={dateRange}
                applyDate={applyDate}
                setState={setDateRange}
                calState={calState}
                setCalState={setCalState}
                position={""}
                platform={"ams"}
                boxClassName="!h-[39px] !px-3"
                className="!top-[44px] border"
              />
            </div>
          </div>
        </div>
        <div className="bg-white py-2 px-4">
          <div className="">
            {editSearch.length > 0 && (
              <div className="flex mb-4 gap-3">
                {/* <Button
                  title="Add Search Term Keyword"
                  styles={{
                    width: "250px",
                    backgroundColor: "orange",
                  }}
                  click={() => {
                    setOpenPopup(true);
                  }}
                /> */}
                <button className="bg-amsPrimary hover:bg-amsPrimary/90 px-6 py-2 text-white rounded-md" onClick={()=>setOpenPopup(true)}>Add Search Term Keyword</button>
                <button className="bg-amsPrimary hover:bg-amsPrimary/90 px-6 py-2 text-white rounded-md" onClick={()=>setNegativePopup(true)}>Add Negative Keyword/Product</button>
                {/* <Button
                  title="Add Negative Keyword/Product"
                  styles={{
                    width: "250px",
                    // flexGrow: 1,
                    marginRight: "20px",
                    backgroundColor: "orange",
                  }}
                  click={() => {
                    setNegativePopup(true);
                  }}
                /> */}
              </div>
            )}
            {/* <div className="relative p-1" ref={editButtonRef}>
              <button
                className="editbtn"
                onClick={() => setOpen(!open)}
                disabled={editSearch.length > 0 ? false : true}
              >
                Edit
              </button>
              {open && (
                <ul className="editbtnoption__outer--ams  rounded-sm p-2">
                  <li
                    className="cursor-pointer p-1"
                    onClick={() => {
                      setOpen(!open);
                      if (editSearch.length > 0) {
                        setOpenPopup(!openpopup);
                      }
                    }}
                  >
                    Add Search Term Keyword
                  </li>
                  <li
                    className="cursor-pointer p-1"
                    onClick={() => {
                      setOpen(!open);
                      if (editSearch.length > 0) {
                        setNegativePopup(!negativePopup);
                      }
                    }}
                  >
                    Add Negative Keyword/Product
                  </li>
                </ul>
              )}
            </div> */}
            {/* <div className="flex w-5/6 justify-end">
              <div className=" p-1 ">
                <button
                  onClick={() => {
                    setPerforming(!performing);
                  }}
                  className={`border ml-3 flex py-1 px-2 rounded w-auto  border-1  ${
                    performing ? "bg-orange-400 text-white" : ""
                  }`}
                >
                  <span>
                    <i className="fa fa-solid fa-list mr-1"></i>{" "}
                  </span>
                  <span>Non-Performing</span>
                </button>
              </div>
            </div> */}
          </div>
          <div>
            <div className="">
              {openpopup && (
                <Popup
                  setTempView={() => {}}
                  title="Add keyword"
                  setShowPopup={setOpenPopup}
                  applyAction={editSearchTerm}
                >
                  <SearchTermPopup
                    selectedAdGroup={selectedAdGroup}
                    setSelectedAdGroup={setSelectedAdGroup}
                    setSearchTermTypeData={setSearchTermTypeData}
                    searchTermTypeData={searchTermTypeData}
                    setCampaignTermTypeData={setCampaignTermTypeData}
                    campaignTermTypeData={campaignTermTypeData}
                    editSearch={editSearch}
                  />
                </Popup>
              )}
              {negativePopup && (
                // <Popup
                //   setTempView={() => {}}
                //   title="Add negative keyword/product"
                //   setShowPopup={setOpenPopup}
                //   applyAction={editSearchTerm}
                // >
                <SearchTermNegativePopup
                  selectedAdGroup={selectedAdGroup}
                  editSearch={editSearch}
                  setSelectedAdGroup={setSelectedAdGroup}
                  setSearchTermTypeData={setSearchTermTypeData}
                  searchTermTypeData={searchTermTypeData}
                  setCampaignTermTypeData={setCampaignTermTypeData}
                  campaignTermTypeData={campaignTermTypeData}
                  setSearchTermAction={setSearchTermAction}
                  searchTermAction={searchTermAction}
                  setOpenState={setNegativePopup}
                  editSearchTermNegative={editSearchTermNegative}
                />
                // </Popup>
              )}
              <AmazonSearchTable
                bodyContent={campaignData}
                headers={showHeader}
                sortBy={sortBy}
                isCheckBoxRequired={true}
                loading={
                  loading &&
                  loading.buttonFlag === ALL_BUTTON_FLAGS.AMAZONSEARCHTERMS &&
                  loading.state
                }
                sortData={sortData}
                paginate={paginate}
                totalData={amazonSearchTerm.totalData}
                page={page}
                offset={offset}
                setEditData={setEditSearch}
                editData={editSearch}
                setDataLIMIT={setDataLIMIT}
                dataLIMIT={dataLIMIT}
                source={"amazonSearchData"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AmazonSearchTerm;
