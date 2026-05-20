import React, { useState, useEffect } from "react";
import Popup from "../../../common-components/Popups/Popup";

import SearchTermPopup from "./SearchTermPopup";
import SearchTermNegativePopup from "./SearchTermNegativePopup";
import DatePicker from "../../../DatePicker";
import {
  ALL_BUTTON_FLAGS,
  LIMIT,
  searchTermsHeaders,
  GET_ACCOUNTS,
} from "../../../../utils/constants";
import {
  editSearchTermAction,
  getSearchTerm,
  addNegativeKeyWord,
} from "../../../../redux/action-creator/campaignAction";
import {
  convertDate,
  defaultDateRange,
  saveLocalStorageAccounts,
  getLocalStorageAccounts
} from "../../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { useCloseWhenClickOutside } from "../../../common-components/useCloseWhenClickOutside";
import KeywordMultiSearch from "../../../common-components/MultiSearch/KeywordMultiSearch";
import { getWallletBalance } from "../../../../redux/action-creator/sideBarAction";
import { _GET } from "../../../../services/axios.method";
import SearchTermTable from "./SearchTermTable";
import Toast from "../../../common-components/toast";
import ActionType from "../../../../redux/types";
import Button from "../../../common-components/button/Button";
import _ from "lodash";

const FlipkartSearchTerm = () => {
  const dateFilters = defaultDateRange();

  // eslint-disable-next-line no-unused-vars
  const [showHeader, setShowHeader] = React.useState([...searchTermsHeaders]);
  // const [loading, setLoading] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: -1,
  });
  // const [performing, setPerforming] = useState(false);
  const [searchTermTypeData, setSearchTermTypeData] = React.useState();
  const [campaignTermTypeData, setCampaignTermTypeData] = React.useState();
  const [filters, setFilters] = useState({});
  // React.useEffect(() => {
  //   console.log("searchTermDatasearchTermData", searchTermData);
  // }, [searchTermData]);
  const dispatch = useDispatch();
  const { searchTerm } = useSelector((state) => state.CampaignReducer);
  const { loading } = useSelector((state) => state.CommonReducer);
  const [brandDataListing, setBrandDataListing] = useState([]);

  const [platformId, setPlatformId] = useState();
  const [account, setAccount] = useState();
  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [callApi, setCallApi] = React.useState(false);
  const [resetData, setResetData] = React.useState(false);
  const [campaignData, setCampaignData] = React.useState([]);
  React.useEffect(() => {
    if (searchTerm.data && searchTerm.data.length > 0) {
      if (resetData) {
        setCampaignData([...searchTerm.data]);
      } else {
        setCampaignData([...campaignData, ...searchTerm.data]);
      }

      if (searchTerm.data.length == 50) {
        setCallApi(true);
      } else {
        setCallApi(false);
      }
    }
  }, [searchTerm.data]);
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
      // dispatch(getSearchTerm(post));
    }
  }
  const applyDate = () => {
    onChangeDate({ selection: dateRange[0] });
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
    dispatch(getSearchTerm(post));
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
    // performing: performing,
  };
  function applyFilters(searchFilters) {
    setFilters(searchFilters);
    post.filters = searchFilters;
    setCampaignData([]);
    dispatch(getSearchTerm(post));
  }

  // }, [offset, sortBy]);
  React.useEffect(() => {
    setCampaignData([]);
    setResetData(true);
    setDataLIMIT(0);
    dispatch(getSearchTerm(post));
  }, [sortBy, dateRange[0].startDate, dateRange[0].endDate]);
  React.useEffect(() => {
    setResetData(false);

    if (callApi) {
      dispatch(getSearchTerm(post));
    }
  }, [dataLIMIT]);
  // React.useEffect(() => {
  //   dispatch(getSearchTerm(post));
  // }, []);

  const [open, setOpen] = useState(false);
  const [openpopup, setOpenPopup] = useState(false);
  const [openNegativepopup, setOpenNegativepopup] = useState(false);
  const [editSearch, setEditSearch] = React.useState([]);
  const [selectedAdGroup, setSelectedAdGroup] = useState();

  const accountNames = async () => {
    try {
      const result = await _GET(GET_ACCOUNTS);
      const data = result.data.data.result;
      const accounts = data.map((item) => ({
        label: item._id?.account,
        account_id: item._id?.account_id,
        value: item._id?.account,
        platform_id: item._id?.platform_id,
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
      setPlatformId(accountsFilter[0]?.platform_id);
      setBrandDataListing(accounts);
      let accountName = accounts.find(
        (val) => val.platform_id === accountsFilter[0]?.platform_id
      );
      setAccount(accountName.label);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accountNames();
  }, []);
  useEffect(() => {
    if (openpopup == false) {
      setEditSearch([]);
      dispatch({
        type: ActionType.CAMPAIGNLIST,
        payload: [],
      });
      dispatch({
        type: ActionType.ADGROUPLIST,
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
        "Flipkart"
      )
    );
    setOpenPopup(false);
    setEditSearch([]);
    dispatch({
      type: ActionType.CAMPAIGNLIST,
      payload: [],
    });
    dispatch({
      type: ActionType.ADGROUPLIST,
      payload: [],
    });
    setSelectedAdGroup();
    setCampaignTermTypeData();
    setSearchTermTypeData();
  };
  const editNeagtiveSearchTerm = () => {
    dispatch(addNegativeKeyWord(editSearch));
    // setOpenPopup(false);
    setOpenNegativepopup(false);
  };
  const editButtonRef = useRef(null);
  useCloseWhenClickOutside(open, setOpen, editButtonRef);
  function setPlatformFilter(e) {
    setPlatformId(e.target.value);
    post.platform_id = e.target.value;
    setCampaignData([]);

    let accountName = brandDataListing.find(
      ({ platform_id }) => platform_id === e.target.value
    );
    let filters = JSON.parse(localStorage.getItem("default_filter_flipkart"));
    filters["flipkart"]["single"] = accountName?.platform_id;
    localStorage.setItem("default_filter_flipkart", JSON.stringify(filters));
    // console.log("accountName123", accountName.value);
    saveLocalStorageAccounts([accountName.value]);
    setAccount(accountName.value);
  }

  React.useEffect(() => {
    dispatch(getSearchTerm(post));
  }, [platformId]);

  React.useEffect(() => {
    if (account) {
      dispatch(getWallletBalance(account));
    }
  }, [account]);

  // React.useEffect(() => {
  //   setCampaignData([]);
  //     dispatch(getSearchTerm(post));
  // }, [performing]);

  return (
    <>
      <div>
        <Toast></Toast>
        <div className="serachterm__heading bg-white px-2 pt-2">
          <h4 className="text-lg mb-2.5 mt-2.5 font-semibold">Search Terms</h4>
          <div className=" row pt-2">
            <div className="flipkart__selectfilter ">
              <select
                className="campaignselect h-10"
                onChange={setPlatformFilter}
              >
                {brandDataListing.map((row, i) => {
                  return (
                    <option
                      key={i}
                      selected={row.platform_id === platformId}
                      value={row.platform_id}
                    >
                      {row.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col h-[50px]">
              <KeywordMultiSearch
                applySearchFilter={applyFilters}
                page={"fk_search_term"}
                platform={"flipkart"}
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
                className="!top-[44px] border"
                boxClassName="!h-[39px] !px-3"
                platform={"flipkart"}
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-2">
          <div className="">
            <div className>
              {editSearch.length > 0 && (
                <div className="flex mb-2">
                  <Button
                    title="Add Search Term Keyword"
                    styles={{
                      width: "250px",
                      // flexGrow: 1,

                      backgroundColor: "#3b82f6",
                    }}
                    click={() => {
                      setOpenPopup(true);
                    }}
                  />
                  <Button
                    title="Add Negative Keyword/Product"
                    styles={{
                      width: "250px",
                      // flexGrow: 1,
                      marginRight: "20px",
                      backgroundColor: "#3b82f6",
                      marginLeft: "150px",
                    }}
                    click={() => {
                      setOpenNegativepopup(true);
                    }}
                  />
                </div>
              )}

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
            {/* <div className="relative p-1" ref={editButtonRef}>
              <button
                className="editbtn"
                onClick={() => setOpen(!open)}
                disabled={editSearch.length > 0 ? false : true}
              >
                Edit
              </button>
              {open && (
                <ul className="editbtnoption__outer ">
                  <li
                    className="cursor-pointer"
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
                    className="cursor-pointer"
                    onClick={() => {
                      setOpen(!open);
                      if (editSearch.length > 0) {
                        setOpenNegativepopup(!openNegativepopup);
                      }
                    }}
                  >
                    Add Negative keyword
                  </li>
                </ul>
              )}
            </div> */}
            <div className="flex w-5/6 justify-end">
              <div className=" p-1 ">
                {/* <button
                  onClick={() => {
                    setPerforming(!performing);
                  }}
                  className={`border ml-3 flex py-1 px-2 rounded w-auto  border-1  ${
                    performing ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  <span>
                    <i className="fa fa-solid fa-list mr-1"></i>{" "}
                  </span>
                  <span>Non-Performing</span>
                </button> */}
              </div>
            </div>
          </div>
          <div>
            <div className="px-2">
              {openpopup && (
                <Popup
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

              {openNegativepopup && (
                <Popup
                  title="Add Negative keyword"
                  setShowPopup={setOpenNegativepopup}
                  applyAction={editNeagtiveSearchTerm}
                >
                  <SearchTermNegativePopup
                    selectedAdGroup={selectedAdGroup}
                    setSelectedAdGroup={setSelectedAdGroup}
                    setSearchTermTypeData={setSearchTermTypeData}
                    searchTermTypeData={searchTermTypeData}
                    setCampaignTermTypeData={setCampaignTermTypeData}
                    campaignTermTypeData={campaignTermTypeData}
                  />
                </Popup>
              )}

              <SearchTermTable
                bodyContent={campaignData}
                headers={showHeader}
                sortBy={sortBy}
                isCheckBoxRequired={true}
                loading={
                  loading &&
                  loading.buttonFlag === ALL_BUTTON_FLAGS.SEARCHTERMS &&
                  loading.state
                }
                sortData={sortData}
                paginate={paginate}
                totalData={searchTerm.totalData}
                page={page}
                offset={offset}
                setEditData={setEditSearch}
                editData={editSearch}
                setDataLIMIT={setDataLIMIT}
                dataLIMIT={dataLIMIT}
                source={"search_term"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FlipkartSearchTerm;
