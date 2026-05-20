import React, { useState } from "react";
import DatePicker from "../../../DatePicker";
import {
  ALL_BUTTON_FLAGS,
  LIMIT,
  negativeKeywordsHeaders,
  GET_ACCOUNTS,
  RPA_ACTION_EDIT,
  PERMISSIONS,
} from "../../../../utils/constants";
import { _GET, _POST } from "../../../../services/axios.method";
import {
  convertDate,
  defaultDateRange,
  getLocalStorageAccounts,
  saveLocalStorageAccounts,
} from "../../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { getNegativeKeyword } from "../../../../redux/action-creator/campaignAction";
import KeywordPopup from "../../../common-components/Popups/keywordPopup";
import KeywordMultiSearch from "../../../common-components/MultiSearch/KeywordMultiSearch";
import { getWallletBalance } from "../../../../redux/action-creator/sideBarAction";
import NegativeKeywordTable from "./NegativeKeywordTable";
import _ from "lodash";
import Toast from "../../../common-components/toast";
import { setToastMessageHandler } from "../../../../redux/action-creator/commonAction";
import ActionType from "../../../../redux/types";
import WhenPermitted from "../../../common-components/WhenPermitted";

const NegativeKeyword = () => {
  // const [dateRange, setDateRange] = React.useState([
  //   {
  //     startDate: addDays(new Date(), -7),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);
  const dateFilters = defaultDateRange();
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
  // eslint-disable-next-line no-unused-vars
  const [showHeader, setShowHeader] = React.useState([
    ...negativeKeywordsHeaders,
  ]);
  const [editKeyword, setEditKeyword] = React.useState([]);
  // const [loading, setLoading] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);

  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: -1,
  });
  const { negativeKeywords } = useSelector((state) => state.CampaignReducer);
  const { loading } = useSelector((state) => state.CommonReducer);
  const [filters, setFilters] = useState([]);
  const [dataLIMIT, setDataLIMIT] = React.useState(50);
  const [callApi, setCallApi] = React.useState(false);
  const [resetData, setResetData] = React.useState(false);
  const [campaignData, setCampaignData] = React.useState([]);
  // holds the list of the accounts
  const [brandDataListing, setBrandDataListing] = useState([]);
  const [platformId, setPlatformId] = useState();
  const [account, setAccount] = useState();
  const [actionLoading, setActionLoading] = useState(false);

  // API to fetch list of accounts
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
      setBrandDataListing(accounts);
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
      setPlatformId(accountsFilter[0]?.platform_id);
      let accountName = accounts.find(
        (val) => val.platform_id === accountsFilter[0]?.platform_id
      );
      setAccount(accountName.label);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    accountNames();
  }, []);

  React.useEffect(() => {
    if (negativeKeywords.data && negativeKeywords.data.length > 0) {
      if (resetData) {
        setCampaignData([...negativeKeywords.data]);
      } else {
        setCampaignData([...campaignData, ...negativeKeywords.data]);
      }

      if (negativeKeywords.data.length == 50) {
        setCallApi(true);
      } else {
        setCallApi(false);
      }
    }
  }, [negativeKeywords.data]);

  const sortData = (item, order) => {
    setSortBy({
      key: item,
      order: order,
    });
    setPage(1);
    setOffset(0);
    setDataLIMIT(50);
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
  const applyDate = () => {
    onChangeDate({ selection: dateRange[0] });
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
    // campaignReportApi();

    dispatch(getNegativeKeyword(post));
  };
  function onChangeDate(item) {
    defaultDateRange(item.selection);
    setCampaignData([]);
    setOffset(0);
    setDataLIMIT(50);
    setResetData(true);
    setDateRange([item.selection]);
    if (!calState.fullCalender) {
      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
      post.start_date = convertDate(item.selection.startDate);
      post.end_date = convertDate(item.selection.endDate);
      dispatch(getNegativeKeyword(post));
    }
  }
  const dispatch = useDispatch();
  // const headers = [
  //   "Keyword Name",
  //   "Campaign Id",
  //   "Campaign Name",
  //   "Adgroup Id",
  //   "Adgroup Name",
  //   "Created On",
  // ];

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
    setCampaignData([]);
    setOffset(0);
    setDataLIMIT(50);
    setResetData(true);
    setFilters(searchFilters);

    post.filters = searchFilters;
    dispatch(getNegativeKeyword(post));
  }

  // React.useEffect(() => {
  //   dispatch(getNegativeKeyword(post));
  // }, [offset, sortBy]);
  React.useEffect(() => {
    setResetData(true);
    setDataLIMIT(50);
    dispatch(getNegativeKeyword(post));
  }, [sortBy, filters]);

  React.useEffect(() => {
    setResetData(false);

    if (callApi) {
      dispatch(getNegativeKeyword(post));
    }
  }, [dataLIMIT]);
  // React.useEffect(() => {
  //   dispatch(getNegativeKeyword(post));
  // }, []);

  const handleRemoveKeyword = async () => {
    setShowPopup(false);
    if (editKeyword.length === 0 || editKeyword?.length === undefined) {
      return;
    } else {
      let filterAborted = editKeyword.filter((item) => {
        return item.status !== "ABORTED";
      });
      let data = filterAborted.map((item) => {
        return {
          ad_group_id: item.ad_group_id,
          campaign_id: [item.campaign_id],
          keyword: item.keyword,
          keyword_name: item.keyword,
          ad_group_name: item.ad_group_name,
          campaign_name: [item.campaign_name],
          action: "remove_negative_keyword",
          action_type: "campaign",
          segment: item.segment,
          account_id: item.account_id,
          platform_id: item.platform_id,
          platform: item.platform,
          account: item.account,
          action_message: ` ${item.keyword} negative keyword removed`,
          action_status: 10,
          client_id: localStorage.getItem("client_id"),
          media_type: "Flipkart",
        };
      });
      try {
        setActionLoading(true);
        const res = await _POST(RPA_ACTION_EDIT, data);
        setActionLoading(false);
        if (res?.status === 200) {
          dispatch(
            setToastMessageHandler("Action performed successfully", true)
          );
          dispatch({
            type: ActionType.RECALLCAMPAIGNPAPI,
            payload: true,
          });
        } else {
          dispatch(setToastMessageHandler("Failed to perform action", false));
        }
      } catch (error) {
        console.error(error);
        dispatch(setToastMessageHandler("Something went wrong!", false));
        setActionLoading(false);
      }
    }
  };
  function setPlatformFilter(e) {
    setCampaignData([]);
    setOffset(0);
    setDataLIMIT(50);
    setResetData(true);
    setPlatformId(e.target.value);
    post.platform_id = e.target.value;
    // console.log(account,e.target.value);
    let accountName = brandDataListing?.find(
      ({ platform_id }) => platform_id === e.target.value
    );
    // console.log("accountName123", accountName);
    let filters = JSON.parse(localStorage.getItem("default_filter_flipkart"));
    filters["flipkart"]["single"] = accountName?.platform_id;
    localStorage.setItem("default_filter_flipkart", JSON.stringify(filters));
    saveLocalStorageAccounts([accountName?.value]);
    setAccount(accountName?.value);
  }
  React.useEffect(() => {
    dispatch(getNegativeKeyword(post));
  }, [platformId]);

  React.useEffect(() => {
    if (account) {
      dispatch(getWallletBalance(account));
    }
  }, [account]);

  return (
    <>
    <Toast></Toast>
      <div>
        <div className="serachterm__heading bg-white px-2 py-2">
          <h4 className="text-lg mb-2.5 mt-2.5 font-semibold">
            Negative Keyword
          </h4>
          <div className="  row pt-2">
            <div className="flipkart__selectfilter ">
              <select
                className="campaignselect h-10"
                onChange={setPlatformFilter}
              >
                {brandDataListing?.map((row, i) => {
                  return (
                    <option
                      key={i}
                      selected={row.platform_id === platformId}
                      value={row?.platform_id}
                    >
                      {row?.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col " style={{ height: "50px" }}>
              <KeywordMultiSearch
                applySearchFilter={applyFilters}
                page={"fk_keyword"}
                platform={"flipkart"}
              />
            </div>
            <div className=" flipkart__calander ">
              <DatePicker
                onChangeDate={onChangeDate}
                state={dateRange}
                applyDate={applyDate}
                setState={setDateRange}
                calState={calState}
                setCalState={setCalState}
                // position={"left"}
                boxClassName="!h-[39px] !px-3"
                className="!top-[44px] border"
                platform={"flipkart"}
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-2">
          <div className="row pt-4 pb-2  justify-between">
            <div className="col_2 pl-4">
              <WhenPermitted permission={PERMISSIONS.CAMPAIGN_ACTIONS} platform="flipkart">
              <button
                className={
                  editKeyword.length > 0
                    ? "campaignreport__activebtn row items-center"
                    : "campaignreport__removebtn row items-center "
                }
                onClick={() => {
                  if (editKeyword.length > 0) {
                    setShowPopup(true);
                  }
                }}
              >
                <div className="campaignreport__removebtm-img">
                  <img src="/assets/images/trash-white.svg" alt="" />
                </div>
                <div className="px-1">
                  {actionLoading ? "loading..." : "Remove Keyword"}
                </div>
              </button>
              </WhenPermitted>
            </div>
          </div>
          <div className="px-3 ">
            <NegativeKeywordTable
              bodyContent={campaignData}
              headers={showHeader}
              sortBy={sortBy}
              isCheckBoxRequired={true}
              loading={
                loading &&
                loading.buttonFlag == ALL_BUTTON_FLAGS.NEGATIVEKEYWORDS &&
                loading.state
              }
              sortData={sortData}
              paginate={paginate}
              totalData={negativeKeywords.totalData}
              page={page}
              offset={offset}
              setEditData={setEditKeyword}
              editData={editKeyword}
              setDataLIMIT={setDataLIMIT}
              dataLIMIT={dataLIMIT}
              source={"negativeKeyword"}
            />
          </div>
          {showPopup && (
            <KeywordPopup
              subTitle={
                "Are you sure you want to delete the selected keywords?"
              }
              setShowPopup={setShowPopup}
              apply={handleRemoveKeyword}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default NegativeKeyword;
