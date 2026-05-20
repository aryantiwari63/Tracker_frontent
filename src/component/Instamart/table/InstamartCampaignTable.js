import React from "react";
import OuterContainer from "../../common-components/flipkart/OuterContainer";

// import DummyData from "./dummyData.json";
import {
  LIMIT,
  INSTAMART_DASHBOARD_TABLE,
  InstamartCampaignHeaderTable,
} from "../../../utils/constants";
import { convertDate } from "../../../utils/helpers";
import { _POST } from "../../../services/axios.method";
// import ZeptoTableCommonComponent from ".";
// import ZeptoTableCommonComponent from "../../Zepto/table/ZeptoTableCommonComponent";
import InstamartTableComp from "./InstamartTableComp";
// import CustomizeDropDown from "../../common-components/flipkart/CustomizeDropDown";
import { instamartWalletBal } from "../../../redux/action-creator/instamart/instamartSideBarAction";
import { useDispatch } from "react-redux";
import "./instamartCampaignTable.css";
import Popup from "../../common-components/Popups/Popup";
import CustomizeColPopup from "../../common-components/CustomizeColumns/CustomizeColPopup";
import CustomizeColBtn from "../../common-components/headerButton/CustomizeColBtn";

const InstamartCamapignTable = ({ filter, dateRange, summaryData }) => {
  const [offset, setOffset] = React.useState(0);
  const [sortBy, setSortBy] = React.useState({
    key: "spend",
    order: -1,
  });
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  // eslint-disable-next-line no-unused-vars
  const [totalData, setTotalData] = React.useState();
  const [campaignData, setCampaignData] = React.useState([]);

  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [callApi, setCallApi] = React.useState(false);
  const [resetData, setResetData] = React.useState(false);
  const [status, setStatus] = React.useState([
    "CAMPAIGN_STATUS_LIVE",
    "CAMPAIGN_STATUS_STOPPED",
    "CAMPAIGN_STATUS_DRAFT",
    "UNDER REVIEW",
  ]);
  const [showHeader, setShowHeader] = React.useState([
    ...InstamartCampaignHeaderTable,
  ]);
  const [showFilter, setShowFilter] = React.useState(false);
  const [filterHeader, setFilterHeader] = React.useState([]);

  const dispatch = useDispatch();

  // const cancelFilter = () => {
  //   setShowHeader([...InstamartCampaignHeaderTable]);
  //   setShowFilter(false);
  // };
  // const applyFilter = React.useCallback(() => {
  //   setCampaignData([]);
  //   setShowHeader(
  //     showHeader.map((checkbox) =>
  //       checkbox.checked === true
  //         ? { ...checkbox, showCol: true }
  //         : { ...checkbox, showCol: false }
  //     )
  //   );
  //   setShowFilter(false);
  //   post = { ...post, columsData: showHeader };
  //   let reset = true;
  //   tableApi(reset);
  // }, [showHeader]);

  const paginate = (direction) => {
    if (direction == "prev") {
      setPage(page - 1);
      setOffset(offset - LIMIT);
    } else {
      setPage(page + 1);
      setOffset(offset + LIMIT);
    }
  };
  const sortData = (item, order) => {
    setCampaignData([]);
    setSortBy({
      key: item,
      order: order,
    });
    setPage(1);
    setOffset(0);
    setDataLIMIT(0);
  };

  let post = {
    account: filter.brand.length > 0 ? filter.brand : null,
    // platform: filter.platform.length > 0 ? filter.platform : null,
    type: filter.types.length > 0 ? filter.types : null,
    tags: filter.tags.length > 0 ? filter.tags : null,
    // tags: filter.tags?.length > 0 ? filter.tags : null,
    start_date: convertDate(dateRange[0].startDate),
    end_date: convertDate(dateRange[0].endDate),
    sort: { [sortBy.key]: sortBy.order },
    offset: offset,
    dataLIMIT: dataLIMIT,
    campaign_status: status,
  };
  // const dispatch = useDispatch();
  // React.useEffect(() => {
  //   dispatch(getWallletBalance(filter.brand));
  // }, [filter.brand]);
  const tableApi = async (reset = false) => {
    try {
      if (post.account != null) {
        setLoading(true);

        const res = await _POST(INSTAMART_DASHBOARD_TABLE, post);

        setLoading(false);
        if (resetData || reset) {
          setCampaignData([...res.data.data.data]);
        } else {
          setCampaignData([...campaignData, ...res.data.data.data]);
        }

        if (res.data.data.data.length == 50) {
          setCallApi(true);
        } else {
          setCallApi(false);
        }
        setResetData(false);
        // setTableData(res.data.data.data);
        // setTotalData(res.data.data.totalData);
      } else {
        setCampaignData([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    dispatch(instamartWalletBal(filter.brand));
  }, [filter.brand]);

  React.useEffect(() => {
    const reset = true;
    setResetData(true);
    setDataLIMIT(0);
    tableApi(reset);
  }, [
    filter.brand,
    filter.platform,
    filter.types,
    dateRange[0].startDate,
    dateRange[0].endDate,
    offset,
    sortBy,
    filter.tags,
    status,
  ]);

  React.useEffect(() => {
    setResetData(false);
    if (callApi) {
      tableApi();
    }
  }, [dataLIMIT]);

  const handleSetStatus = (status) => {
    setStatus((prev) => {
      if (prev.includes(status)) {
        return prev.filter((el) => el !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  return (
    <>
      <OuterContainer
        logo="/assets/images/campaign-icon1.svg"
        title={"Campaigns"}
        customeOuterContainer={"outerContainer__image--instamart"}
        customOuterLink={"zeptocustomlink"}
      >
        <div className="bg-white ">
          <div className=" flex  justify-between">
            <h6 className=" OuterContainer__tbcontent">
              Summary of how your campaigns are performing
            </h6>

            <div className="flex items-center justify-self-end">
              <div className="relative ml-6 mx-2">
                {/* <button
                  className={
                    "campaignreport__btn flex !rounded-md  items-center campaignreport__btn--insta"
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
                  className="hover:bg-[#851853]"
                  onClick={() => setShowFilter(!showFilter)}
                />
                {showFilter && (
                  <Popup
                    platform="instamart"
                    setShowPopup={setShowFilter}
                    setTempView={() => {}}
                    smallsize
                    title={`Customize Dashboard`}
                    applyAction={() => {
                      setShowHeader(filterHeader);
                      setShowFilter(false);
                      let reset = true;
                      tableApi(reset);
                    }}
                  >
                    <CustomizeColPopup
                      showHeader={showHeader}
                      setFilterHeader={setFilterHeader}
                      buttonStyleCss="bg-[#851853] hover:bg-[#990556]"
                      dropDownCss="hover:bg-[#851853]"
                      searchCss="outline-pink-800"
                      platform="instamart"
                    />
                  </Popup>
                )}
              </div>
              <img
                className="mr-2 mx-2"
                src="/assets/images/active-circle.svg"
                alt=""
              />
              <label
                className={`mr-3 cursor-pointer ${
                  status.includes("CAMPAIGN_STATUS_LIVE")
                    ? "selected-status"
                    : "unselected-status"
                }`}
                onClick={() => {
                  setDataLIMIT(0);
                  handleSetStatus("CAMPAIGN_STATUS_LIVE");
                }}
              >
                ACTIVE
              </label>
              <img
                className="mr-2 mx-2"
                src="/assets/images/aborted.svg"
                alt=""
              />
              <label
                className={`cursor-pointer  ${
                  status.includes("CAMPAIGN_STATUS_STOPPED")
                    ? "selected-status"
                    : "unselected-status"
                }`}
                onClick={() => {
                  setDataLIMIT(0);
                  handleSetStatus("CAMPAIGN_STATUS_STOPPED");
                }}
              >
                STOPPED
              </label>
              <img
                className="mr-2 mx-2"
                src="/assets/images/pause-circle.svg"
                alt=""
              />
              <label
                className={`cursor-pointer mr-3 ${
                  status.includes("CAMPAIGN_STATUS_DRAFT")
                    ? "selected-status"
                    : "unselected-status"
                }`}
                onClick={() => {
                  setDataLIMIT(0);
                  handleSetStatus("CAMPAIGN_STATUS_DRAFT");
                }}
              >
                DRAFT
              </label>

              <img
                className="mr-2 mx-2"
                src="/assets/images/underreview.svg"
                alt=""
              />
              <label
                className={`cursor-pointer ${
                  status.includes("UNDER REVIEW")
                    ? "selected-status"
                    : "unselected-status"
                }`}
                onClick={() => {
                  setDataLIMIT(0);
                  handleSetStatus("UNDER REVIEW");
                }}
              >
                UNDER REVIEW
              </label>
            </div>
          </div>

          <div>
            <InstamartTableComp
              headers={showHeader}
              summaryData={summaryData}
              content={campaignData}
              loading={loading}
              sortBy={sortBy}
              sortData={sortData}
              paginate={paginate}
              totalData={totalData}
              page={page}
              offset={offset}
              setDataLIMIT={setDataLIMIT}
              dataLIMIT={dataLIMIT}
              callApi={callApi}
              platform={"instamart"}
            />
          </div>
        </div>
      </OuterContainer>
    </>
  );
};

export default InstamartCamapignTable;
