/* eslint-disable */
import React, { useState, useEffect } from "react";
import campData from "../../../../data/flipkart/reports/campData.json";
import _ from "lodash";
import AmazonTable from "../../../common-components/amazontable";
import DatePicker from "../../../DatePicker";
import { addDays } from "date-fns";
import {
  ALL_BUTTON_FLAGS,
  LIMIT,
  negativeKeywordsHeadersAms,
  PERMISSIONS,
} from "../../../../utils/constants";
import { _POST, _GET } from "../../../../services/axios.method";
import { convertDate, defaultDateRange } from "../../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  getAmsNegativeKeyword,
  removeNegativeKeyWord,
} from "../../../../redux/action-creator/amazon/campaignAction";
import {
  saveLocalStorageAccounts,
  getLocalStorageAccounts,
} from "../../../../utils/helpers";
import KeywordPopup from "../../../common-components/Popups/keywordPopup";
import KeywordMultiSearch from "../../../common-components/MultiSearch/KeywordMultiSearch";
import Toast from "../../../common-components/toast";
import { AMAZON_ACCOUNTS } from "../../../../utils/amazonConstants";
import "./styles.css";
import CustomSelectNew from "../../../common-components/CustomSelectNew";
import WhenPermitted from "../../../common-components/WhenPermitted";
const AmazonNegativeKeyword = () => {
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
  const [showHeader, setShowHeader] = React.useState([
    ...negativeKeywordsHeadersAms,
  ]);
  const [editKeyword, setEditKeyword] = React.useState([]);
  // const [loading, setLoading] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);

  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState({
    key: "campaign_name",
    order: "DESC",
  });
  const { amazonnegativeKeywords } = useSelector(
    (state) => state.CampaignReducer
  );
  const { loading } = useSelector((state) => state.CommonReducer);
  const [filters, setFilters] = useState([]);
  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [callApi, setCallApi] = React.useState(false);
  const [resetData, setResetData] = React.useState(false);
  const [campaignData, setCampaignData] = React.useState([]);
  const [brandDataListing, setBrandDataListing] = useState([]);
  const [account, setAccount] = useState("");

  const accountNames = async () => {
    try {
      const result = await _GET(AMAZON_ACCOUNTS);
      const profile_data = result.data.data;
      const brandOptionDatas = profile_data.map((item) => ({
        label: item.label,
        value: item.value,
      }));
      let accountsFilter = _.cloneDeep(brandOptionDatas);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
        let firstAccount = savedAccounts[0];
        let filterAccount = brandOptionDatas.find(
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
      setAccount(accountsFilter[0].value);
      setBrandDataListing(brandOptionDatas);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    accountNames();
  }, []);

  React.useEffect(() => {
    if (
      amazonnegativeKeywords?.data &&
      amazonnegativeKeywords?.data.length > 0
    ) {
      if (resetData) {
        setCampaignData([...amazonnegativeKeywords.data]);
      } else {
        setCampaignData([...campaignData, ...amazonnegativeKeywords.data]);
      }

      if (amazonnegativeKeywords.data.length == 50) {
        setCallApi(true);
      } else {
        setCallApi(false);
      }
    }
  }, [amazonnegativeKeywords?.data]);

  const sortData = (item, order) => {
    setSortBy({
      key: item,
      order: order,
    });
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
  const applyDate = () => {
    onChangeDate({ selection: dateRange[0] });
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });

    dispatch(getAmsNegativeKeyword(post));
  };
  function onChangeDate(item) {
    defaultDateRange(item.selection);
    setCampaignData([]);
    setOffset(0);
    setDataLIMIT(0);
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
      dispatch(getAmsNegativeKeyword(post));
    }
  }
  const dispatch = useDispatch();

  let post = {
    account: account,
    start_date: convertDate(dateRange[0].startDate),
    end_date: convertDate(dateRange[0].endDate),
    sort: [sortBy.key, sortBy.order],
    offset: offset,
    filters: filters,
    dataLIMIT: dataLIMIT,
  };

  function applyFilters(searchFilters) {
    console.log(searchFilters, "<<<< FFIILLTTEERSS");
    setCampaignData([]);
    setOffset(0);
    setDataLIMIT(0);
    setResetData(true);
    setFilters(searchFilters);

    post.filters = searchFilters;
    dispatch(getAmsNegativeKeyword(post));
  }

  React.useEffect(() => {
    setResetData(true);
    setDataLIMIT(0);
    if (post?.account) dispatch(getAmsNegativeKeyword(post));
  }, [sortBy, filters, account]);

  React.useEffect(() => {
    setResetData(false);

    if (callApi) {
      dispatch(getAmsNegativeKeyword(post));
    }
  }, [dataLIMIT]);

  function setPlatformFilter(value) {
    setCampaignData([]);
    setOffset(0);
    setDataLIMIT(0);
    setResetData(true);
    let accountName = brandDataListing?.find(
      (obj) => obj?.value === value
    );
    post.account = accountName?.value;
    dispatch(getAmsNegativeKeyword(post));

    // let filters = JSON.parse(localStorage.getItem("default_filter_amazon"));
    // filters["amazon"]["single"] = accountName?.value;
    // localStorage.setItem("default_filter_amazon", JSON.stringify(filters));

    setAccount(accountName?.value);
    saveLocalStorageAccounts([accountName?.label]);
  }

  const editKeywords = () => {
    dispatch(removeNegativeKeyWord(editKeyword));
    setShowPopup(false);
  };

  return (
    <>
      <div>
        <Toast></Toast>
        <div className="serachterm__heading bg-white px-2 pt-2">
          <h4 className="text-lg mb-2.5 mt-2.5 px-2 font-semibold">
            Negative Keyword
          </h4>
          <div className="  row pt-2">
            <div className="flipkart__selectfilter ">
              {/* <select
                className="campaignselect h-10"
                onChange={setPlatformFilter}
              >
                {brandDataListing?.map((row, i) => {
                  return (
                    <option
                      selected={row.value === account}
                      value={row?.account}
                    >
                      {row?.label}
                    </option>
                  );
                })}
              </select> */}
              <CustomSelectNew
                label={"Select"}
                options={brandDataListing}
                value={account}
                onChange={setPlatformFilter}
                platform={"ams"}
                className="pt-[9px] pb-[10px]"
              />
            </div>
            <div className="col " style={{ height: "50px" }}>
              <KeywordMultiSearch
                applySearchFilter={applyFilters}
                page={"ams_neg_keyword"}
                platform={"amazon"}
              />
            </div>
            <div className=" col_4 px-2 relative  ">
              <DatePicker
                onChangeDate={onChangeDate}
                state={dateRange}
                applyDate={applyDate}
                setState={setDateRange}
                calState={calState}
                setCalState={setCalState}
                // position={"right"}
                platform={"ams"}
                boxClassName="!h-[39px] !px-3"
                className="!top-[44px] border"
              />
            </div>
          </div>
        </div>
        <div className="bg-white px-2 pb-2">
          <div className="row py-3  justify-between">
            <WhenPermitted permission={PERMISSIONS.CAMPAIGN_ACTIONS} platform="amazon">
            <div className="col_2 pl-4">
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
                disabled
              >
                <div className="campaignreport__removebtm-img">
                  <img src="/assets/images/trash-white.svg" alt="" />
                </div>
                <div className="px-1">Remove Keyword</div>
              </button>
            </div>
            </WhenPermitted>
          </div>
          {console.log(loading.state, "<<<< laoding neg state ")}

          <div className="px-3 ">
            <AmazonTable
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
              totalData={amazonnegativeKeywords?.totalData}
              page={page}
              offset={offset}
              setEditData={setEditKeyword}
              editData={editKeyword}
              setDataLIMIT={setDataLIMIT}
              dataLIMIT={dataLIMIT}
              source={"amazonnegativeKeyword"}
              // checkbox={true}
            />
          </div>
          {showPopup && (
            <KeywordPopup
              subTitle={"Are you sure want to delete this keyword?"}
              setShowPopup={setShowPopup}
              apply={editKeywords}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default AmazonNegativeKeyword;
