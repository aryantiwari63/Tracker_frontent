import React from "react";
import {
  reachCampaignHeaders,
  performingCampaignHeaders,
} from "../../../utils/constants";
import CampaignReachTable from "../table/CampaignReachTable";
import CampaignPerformTable from "../table/CampaignPerformTable";
import { _POST } from "../../../services/axios.method";
import {
  GET_REACH_CAMPAIGN,
  GET_PERFORMANCE_CAMPAIGN,
} from "../../../utils/constants";
import { convertDate } from "../../../utils/helpers";



const ReachCampaign = ({ dateRange, filter }) => {
  const [sortByReach, setSortByReach] = React.useState({
    key: "spend",
    order: "DESC",
  });
  const [sortByPerformance, setSortByPerformance] = React.useState({
    key: "spend",
    order: "DESC",
  });
  // const [callReachApi, setReachCallApi] = React.useState(false);
  // const [callPerformanceApi, setPerformanceCallApi] = React.useState(false);
  // const [resetData, setResetData] = React.useState(false);
  const [performanceCampaign, setPerformanceCampaign] = React.useState([]);
  const [reachCampaign, setReachCampaign] = React.useState([]);
  const [reachLoading, setReachLoading] = React.useState(false);
  const [reachPerformance, setReachPerformance] = React.useState(false);
  // const [dataLimitReach, setDataLimitReach] = React.useState(0);
  // const [dataLimitPerformance, setDataLimitPerformance] = React.useState(0);

  const sortDataReach = (item, order) => {
    setSortByReach({
      key: item,
      order: order,
    });
  };

  const sortDataPerformance = (item, order) => {
    setSortByPerformance({
      key: item,
      order: order,
    });
  };

  React.useEffect(() => {
    // setResetData(false);
    // if (callReachApi) {
    fetchPerformanceCampaign();
    // }
  }, [dateRange[0]?.startDate, dateRange[0]?.endDate,sortByPerformance]);
  React.useEffect(() => {
    // setResetData(false);
    // if (callReachApi) {
    fetchReachCampaign();
    // }
  }, [dateRange[0]?.startDate, dateRange[0]?.endDate,sortByReach]);


  // React.useEffect(() => {
  //   setResetData(false);
  //   if (callPerformanceApi) {
  //     fetchPerformanceCampaign();
  //     fetchPerformanceCampaign
  //   }
  // }, [dataLimitPerformance]);

  const fetchReachCampaign = async () => {
    setReachLoading(true);
    let post = {
      sort: [sortByReach.key, sortByReach.order],

      start_date: convertDate(dateRange[0]?.startDate),
      end_date: convertDate(dateRange[0]?.endDate),
      ...filter,
    };
    const reach = await _POST(GET_REACH_CAMPAIGN, post);
    setReachCampaign([...reach.data.data.reach]);
    // if (resetData) {
    //   setReachCampaign([...reach.data.data.reach]);
    // } else {
    //   setReachCampaign([...reachCampaign, ...reach.data.data.reach]);
    // }
    // if (reach.data.data.reach.length === 50) {
    //   setReachCallApi(true);
    // } else {
    //   setReachCallApi(false);
    // }
    setReachLoading(false);
  };

  const fetchPerformanceCampaign = async () => {
    setReachPerformance(true);
    let post = {
      sort: [sortByPerformance.key, sortByPerformance.order],
      start_date: convertDate(dateRange[0].startDate),
      end_date: convertDate(dateRange[0].endDate),
      ...filter,
    };
    const performance = await _POST(GET_PERFORMANCE_CAMPAIGN, post);
    setPerformanceCampaign([...performance.data.data.performance]);
    // if (resetData) {
    //   setPerformanceCampaign([...performance.data.data.performance]);
    // } else {
    //   setPerformanceCampaign([
    //     ...performanceCampaign,
    //     ...performance.data.data.performance,
    //   ]);
    // }
    // if (performance.data.data.performance.length === 50) {
    //   setPerformanceCallApi(true);
    // } else {
    //   setPerformanceCallApi(false);
    // }
    setReachPerformance(false);
  };

  return (
    <>
      <div className="col_6  categorywisetable__header ">
        <div className=" categorywisetable">
          <div className="row justify-between pb-1">
            <div>
              <h6>Top Reach campaigns</h6>
            </div>
            {/* <div>
              <FiColumns className="inline" />
            </div> */}
          </div>
          <CampaignReachTable
            headers={reachCampaignHeaders}
            content={reachCampaign}
            sortData={sortDataReach}
            loading={reachLoading}
          />
        </div>
      </div>
      <div className="col_6  categorywisetable__header ">
        <div className=" categorywisetable">
          <div className="row justify-between pb-1">
            <div>
              <h6>Top Performing campaigns</h6>
            </div>
            {/* <div>
              <FiColumns className="inline" />
            </div> */}
          </div>
          <CampaignPerformTable
            headers={performingCampaignHeaders}
            content={performanceCampaign}
            sortData={sortDataPerformance}
            loading={reachPerformance}
          />
        </div>
      </div>
    </>
  );
};
export default ReachCampaign;
