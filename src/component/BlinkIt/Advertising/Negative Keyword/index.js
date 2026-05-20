import React, { useState } from "react";
import FlipkartTable from "../../../common-components/flipkarttable";
import DatePicker from "../../../DatePicker";
import {
  ALL_BUTTON_FLAGS,
  LIMIT,
  negativeKeywordsHeadersBlinkit,
  PERMISSIONS,
} from "../../../../utils/constants";
import { convertDate, defaultDateRange } from "../../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  getNegativeKeyword,
  // removeNegativeKeyWord,
} from "../../../../redux/action-creator/blinkit/campaignAction";
import KeywordMultiSearch from "../../../common-components/MultiSearch/KeywordMultiSearch";
import "./style.css";
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
    ...negativeKeywordsHeadersBlinkit,
  ]);
  const [editKeyword, setEditKeyword] = React.useState([]);
  // const [loading, setLoading] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showPopup, setShowPopup] = React.useState(false);

  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: "DESC",
  });
  const { negativeKeywords } = useSelector((state) => state.CampaignReducer);
  const { loading } = useSelector((state) => state.CommonReducer);
  const [filters, setFilters] = useState([]);
  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [callApi, setCallApi] = React.useState(false);
  const [resetData, setResetData] = React.useState(false);
  const [campaignData, setCampaignData] = React.useState([]);

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

    dispatch(getNegativeKeyword(post));
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
      dispatch(getNegativeKeyword(post));
    }
  }
  const dispatch = useDispatch();

  let post = {
    start_date: convertDate(dateRange[0].startDate),
    end_date: convertDate(dateRange[0].endDate),
    sort: [sortBy.key, sortBy.order],
    offset: offset,
    filters: filters,
    dataLIMIT: dataLIMIT,
  };

  function applyFilters(searchFilters) {
    setCampaignData([]);
    setOffset(0);
    setDataLIMIT(0);
    setResetData(true);
    setFilters(searchFilters);

    post.filters = searchFilters;
    dispatch(getNegativeKeyword(post));
  }

  React.useEffect(() => {
    setResetData(true);
    setDataLIMIT(0);
    dispatch(getNegativeKeyword(post));
  }, [sortBy, filters]);

  React.useEffect(() => {
    setResetData(false);

    if (callApi) {
      dispatch(getNegativeKeyword(post));
    }
  }, [dataLIMIT]);

  // const editKeywords = () => {
  //   dispatch(removeNegativeKeyWord(editKeyword));
  //   setShowPopup(false);
  // };

  return (
    <>
      <div>
        <div className="serachterm__heading bg-white px-2 py-2">
          <h4 className="text-lg mb-2.5 mt-2.5 px-2 font-semibold">Negative Keyword</h4>
          <div className="  row pt-2 px-2">
            <div className="col " style={{ height: "50px" }}>
              <KeywordMultiSearch
                applySearchFilter={applyFilters}
                page={"blinkit"}
                platform={"blinkit"}
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-2">
          <div className="row pt-4 pb-2  justify-between">
            <WhenPermitted permission={PERMISSIONS.CAMPAIGN_ACTIONS} platform="blinkit">
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
            <div className=" flipkart__calander ">
              <DatePicker
                onChangeDate={onChangeDate}
                state={dateRange}
                applyDate={applyDate}
                setState={setDateRange}
                calState={calState}
                setCalState={setCalState}
                // position={"right"}
                platform={"blinkit"}
                className="border"
              />
            </div>
          </div>
          <div className="px-3 ">
            <FlipkartTable
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
              source={"blinkit"}
              // checkbox={true}
              headerClassName="!py-0 !font-semibold !text-[15px]"
            />
          </div>
          {/* {showPopup && (
            <KeywordPopup
              subTitle={"Are you sure want to delete this keyword?"}
              setShowPopup={setShowPopup}
              apply={editKeywords}
            />
          )} */}
        </div>
      </div>
    </>
  );
};
export default NegativeKeyword;
