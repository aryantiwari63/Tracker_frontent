import React, { useState, useEffect } from "react";
import Popup from "../../../common-components/Popups/Popup";

import SearchTermPopup from "./SearchTermPopup";
import SearchTermNegativePopup from "./SearchTermNegativePopup"
import DatePicker from "../../../DatePicker";
import {
  GET_ACCOUNTS, campaignLiveData, LIVE_CAMPAIGN_LIST,
} from "../../../../utils/constants";
import {
  editSearchTermAction,
  addNegativeKeyWord
} from "../../../../redux/action-creator/campaignAction";
import {
  convertDate,
  defaultDateRange
} from "../../../../utils/helpers";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { useCloseWhenClickOutside } from "../../../common-components/useCloseWhenClickOutside";
import KeywordMultiSearch from "../../../common-components/MultiSearch/KeywordMultiSearch";
import { getWallletBalance } from "../../../../redux/action-creator/sideBarAction";
import { _GET, _POST } from "../../../../services/axios.method";
import SearchTermTable from "./SearchTermTable";
import { CampaignEdit } from "../../../common-components/editButtonOptions/campaignEditLive"

const CampaignLive = () => {
  const dateFilters = defaultDateRange();

  // eslint-disable-next-line no-unused-vars
  const [showHeader, setShowHeader] = React.useState([...campaignLiveData]);
  const [loading, setLoading] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: -1,
  });
  const [searchTermTypeData, setSearchTermTypeData] = React.useState();
  const [campaignTermTypeData, setCampaignTermTypeData] = React.useState();
  const [filters, setFilters] = useState([]);
  const dispatch = useDispatch();
  //const { loading } = useSelector((state) => state.CommonReducer);
  const [brandDataListing, setBrandDataListing] = useState([]);

  const [platformId, setPlatformId] = useState(
    brandDataListing[1]?.platform_id
  );
  const [account, setAccount] = useState();
  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [campaignData, setCampaignData] = React.useState([]);

  // const [dateRange, setDateRange] = React.useState([
  //   {
  //     startDate: addDays(new Date(), -7),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);
  const conatinerRef = useRef(null)
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
  async function getLiveCampaigns(payload = {}, refresh = false) {
    try {
      if (payload.platform_id) {
        setCampaignData([]);
        setLoading(true);
        payload.refresh = refresh;
        const res = await _POST(LIVE_CAMPAIGN_LIST, payload);
        setLoading(false);
        setCampaignData(res?.data?.data);
      }
    } catch (error) {
      //console.log(error);
    }
  }
  useEffect(() => {
    if (!calState.fullCalender) {

      getLiveCampaigns(post);
    }
  }, [dateRange[0]?.startDate, dateRange[0]?.endDate]);

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
  const applyDate = () => {
    setCampaignData([]);
    onChangeDate({ selection: dateRange[0] });
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
    getLiveCampaigns(post);
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


  let post = {
    start_date: convertDate(dateRange[0].startDate),
    end_date: convertDate(dateRange[0].endDate),
    sort: { [sortBy.key]: sortBy.order },
    offset: offset,
    filters: filters,
    platform_id: platformId,
    dataLIMIT: dataLIMIT,
  };
  function applyFilters(searchFilters) {
    setFilters(searchFilters);
    post.filters = searchFilters;
    setCampaignData([]);
    setLoading(true);
    getLiveCampaigns(post);

  }

  // }, [offset, sortBy]);
  // useEffect( () => {
  //   setCampaignData([]);
  //   setDataLIMIT(0);
  //   setLoading(true);
  //   //  getLiveCampaigns(post).then(res=>{
  //   //    setLoading(false);
  //   //   setCampaignData(res);
  //   // });
  //
  // }, [sortBy]);

  useEffect(() => {
    accountNames().then(async () => {
      await getLiveCampaigns(post);

    });
  }, []);
  // React.useEffect(() => {
  //   dispatch(getCampaignLiveList(post));
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
      accounts.push({
        label: "Mars Wrigley National",
        account_id: "RSAUFLMCSZ",
        value: "Mars Wrigley National",
        platform_id: "4YILERKLSZ92",
      });
      setBrandDataListing(accounts);
      //   let filters = defaultFilterCheck(accounts);
      // let accountName = accounts.find(
      //   (val) => val.platform_id === filters["flipkart"]["single"]
      // );
      setAccount(accounts[0]?.label);
      setPlatformId(accounts[0]?.platform_id)
      post.platform_id = accounts[0]?.platform_id;
    } catch (error) {
      console.error(error);
    }
  };
  const handleRefresh = async() => {
    await getLiveCampaigns(post, true)
  }
  const editSearchTerm = () => {
    dispatch(
      editSearchTermAction(
        editSearch,
        searchTermTypeData,
        campaignTermTypeData,
        selectedAdGroup
      )
    );
    setOpenPopup(false);
  };
  const editNeagtiveSearchTerm = () => {
    dispatch(
      addNegativeKeyWord(
        editSearch
      )
    );
    setOpenPopup(false);
  };
  const editButtonRef = useRef(null);
  useCloseWhenClickOutside(open, setOpen, editButtonRef);
  function setPlatformFilter(e) {
    setPlatformId(e.target.value);
    post.platform_id = e.target.value;
    setCampaignData([]);
    getLiveCampaigns(post);
    let accountName = brandDataListing.find(
      ({ platform_id }) => platform_id === e.target.value
    );
    let filters = JSON.parse(localStorage.getItem("default_filter_flipkart"));
    filters["flipkart"]["single"] = accountName?.platform_id;
    localStorage.setItem("default_filter_flipkart", JSON.stringify(filters));
    // console.log("accountName123", accountName.value);
    setAccount(accountName.value);
  }

  React.useEffect(() => {
    if (account) {
      dispatch(getWallletBalance(account));
    }
  }, [account]);

  // React.useEffect(() => {
  //   setCampaignData([]);
  //     dispatch(getCampaignLiveList(post));
  // }, [performing]);
  return (
    <>
      <div>
        <div className="serachterm__heading">
          <h4 className="text-lg mb-2.5 mt-2.5">Campaign Live (Beta)</h4>
          <div className=" row pt-2">
            <div className="flipkart__selectfilter ">
              <select
                className="campaignselect h-10"
                onChange={setPlatformFilter}
              >
                {brandDataListing.map((row, i) => {
                  return (
                    <option key={i}
                      selected={row.label === account}
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
                page={"search_term"}
                platform = {'flipkart'}
              />
            </div>
            <div className=" flipkart__calander p-1 ">

              <DatePicker
                onChangeDate={onChangeDate}
                state={dateRange}
                applyDate={applyDate}
                setState={setDateRange}
                calState={calState}
                setCalState={setCalState}
                position={""}
                className="border"
              />

            </div>
          </div>
        </div>
        <div className="bg-white p-2">
          <div className="row pb-4 justify-between">
            <div className="relative p-1" ref={editButtonRef}>
              <button
                className="editbtn"
                onClick={() => setOpen(!open)}
                disabled={editSearch.length > 0 ? false : true}
              >
                Edit
              </button>

              {/* {open && (
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
                    Pause
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => {
                      setOpen(!open);
                      if (editSearch.length > 0) {
                        setOpenPopup(!openpopup);
                      }
                    }}
                  >
                    Add search term keyword
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
              )} */}
              <CampaignEdit op={open} editRef={conatinerRef} editData={editSearch} platformId={platformId} accountId={brandDataListing[1]?.account_id} />
            </div>

            <button className="editbtn"
            onClick={handleRefresh}
            >
             
              <img
                className="w-3 inline-block align-baseline cursor-pointer"
                src="/assets/images/reload.png"
                alt="reload"
              />
              <span className="ml-2">Refresh</span>
            </button>
          </div>

          <div>
            <div className="">
              {openpopup && (
                <Popup
                  title="Add term keyword"
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
                loading={loading}
                sortData={sortData}
                totalData={[]}
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
export default CampaignLive;
