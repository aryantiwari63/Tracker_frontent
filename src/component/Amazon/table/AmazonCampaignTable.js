import React from "react";
import OuterContainer from "../../common-components/flipkart/OuterContainer";
// import DummyData from "./dummyData.json";

// import CustomizeDropDown from "../../common-components/flipkart/CustomizeDropDown";
import {
  LIMIT,
  AmazonCampaignHeaderTable,
  GET_AMAZON_TABLE_REPORT_API_URL,
} from "../../../utils/constants";
import { convertDate } from "../../../utils/helpers";
import { _POST } from "../../../services/axios.method";
import AmazonPerformanceBreakDownTable from "./AmazonPerformanceBreakDownTable";
import './amazonCampaignTable.css'
import Popup from "../../common-components/Popups/Popup";
import CustomizeColPopup from "../../common-components/CustomizeColumns/CustomizeColPopup";
import CustomizeColBtn from "../../common-components/headerButton/CustomizeColBtn";

const AmazonCampaignTable = ({ filter, dateRange, summaryData }) => {
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
  const [status, setStatus] = React.useState(["ENABLED", "ARCHIVED", "PAUSED"]);
  const [showHeader, setShowHeader] = React.useState([
    ...AmazonCampaignHeaderTable,
  ]);
  const [filterHeader, setFilterHeader] = React.useState([]);
  const [showFilter, setShowFilter] = React.useState(false);
  // const cancelFilter = () => {
  //   setShowHeader([...AmazonCampaignHeaderTable]);
  //   setShowFilter(false);
  // };
  // const applyFilter = React.useCallback(() => {
  //   // console.log("inside 2");
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
  //   //console.log("postIS",post)
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
    setDataLIMIT(0)
  };

  let post = {
    account: filter.brand.length > 0 ? filter.brand : null,
    // platform: filter.platform.length > 0 ? filter.platform : null,
    type: filter.types.length > 0 ? filter.types : null,
    tags: filter.tags?.length > 0 ? filter.tags : null,
    start_date: convertDate(dateRange[0].startDate),
    end_date: convertDate(dateRange[0].endDate),
    sort: { [sortBy.key]: sortBy.order },
    offset: offset,
    dataLIMIT: dataLIMIT,
    campaign_status: status
  };
  // const dispatch = useDispatch();
  // React.useEffect(() => {
  //   dispatch(getWallletBalance(filter.brand));
  // }, [filter.brand]);
  const tableApi = async (reset = false) => {
    try {
      setLoading(true);

      const res = await _POST(GET_AMAZON_TABLE_REPORT_API_URL, post);

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
    } catch (e) {
      console.error(e);
    }
  };
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
    status
  ]);

  React.useEffect(() => {
    setResetData(false);
    if (callApi) {
      tableApi();
    }
  }, [dataLIMIT]);


  // eslint-disable-next-line no-unused-vars
  const handleSetStatus = (status) => {
    setStatus(prev => {
      if(prev.includes(status)){
        return prev.filter(el => el !== status)
      }else{
        return [...prev, status];
      }
    })
  }


  return (
    <>
      <OuterContainer
        logo="/assets/images/campaign-icon1.svg"
        title={"Campaigns"}
        customeOuterContainer={"outerContainer__image--ams"}
        customOuterLink={"amscustomlink"}
      >
        <div className="bg-white ">
          <div className=" flex  justify-between">
            <h6 className=" OuterContainer__tbcontent">
              Summary of how your campaigns are performing
            </h6>
            
              
            
            <div className="flex items-center justify-self-end">
            <div className="relative ml-6 mx-2">
              {/* <CustomizeDropDown
                        title="Customise Column "
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
                      <CustomizeColBtn className="hover:bg-[#EF880F]" onClick={()=>setShowFilter(!showFilter)}/>
                      {showFilter && (
                          <Popup
                            platform="ams"
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
                            />
                          </Popup>
                        )}
                    </div>
              <img
                className="mr-2 mx-2"
                src="/assets/images/active-circle.svg"
                alt=""
              />
              <label className={`mr-3 cursor-pointer ${status.includes('ENABLED') ? 'selected-status': 'unselected-status'}`}
              
              onClick={() => {
                  setDataLIMIT(0);
                  handleSetStatus('ENABLED')
                }}>ENABLED</label>
              <img
                className="mr-2 mx-2"
                src="/assets/images/aborted.svg"
                alt=""
              />
              <label className={`mr-3 cursor-pointer ${status.includes('ARCHIVED') ? 'selected-status': 'unselected-status'}`} onClick={() => {
                  setDataLIMIT(0);
                  handleSetStatus('ARCHIVED')
                }}>ARCHIVED</label>
              <img
                className="mr-2 mx-2"
                src="/assets/images/pause-circle.svg"
                alt=""
              />
              <label className={`mr-3 cursor-pointer ${status.includes('PAUSED') ? 'selected-status': 'unselected-status'}`} onClick={() => {
                  setDataLIMIT(0);
                  handleSetStatus('PAUSED')
                }}>PAUSED</label>
            </div>
          </div>

          <div>
            <AmazonPerformanceBreakDownTable
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
              platform={"ams"}
            ></AmazonPerformanceBreakDownTable>
          </div>
        </div>
      </OuterContainer>
    </>
  );
};

export default AmazonCampaignTable;
