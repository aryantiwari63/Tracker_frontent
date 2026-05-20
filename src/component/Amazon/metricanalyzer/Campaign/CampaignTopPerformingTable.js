import React, { useState, useEffect } from "react";
import {
  amazonCampaignheader
} from "../../../../utils/amazonConstants";
import TopPerformingCampaignTable from "./TopPerformingCampaignTable";
import { AMAZON_METRIC_ANALYZER_CAMPAIGN } from "../../../../utils/constants";
import { convertDate } from "../../../../utils/helpers";
import { _POST } from "../../../../services/axios.method";

const CampaignTopPerformingTable = ({selectedMetric, selectedMetricOptions, platform, campType, tags,dateRange, compareValue, value1, value2}) => {
  const [showHeader, setShowHeader] = React.useState([
    ...amazonCampaignheader,
  ]);
  const [campaignData, setCampaignData] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: -1,
  });
  const [callApi, setCallApi] = useState(false);
  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [resetData, setResetData] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const title = {
      ctr: "CTR",
      cpc: "CPC",
      orders: "Orders",
      sales: "Sales",
      acos: "ACOS",
      roas: "ROAS",
      impressions: "Impressions",
      spend: "Spend",

    };
    const indexToSwap = 1;
    const objectToSwap = {
      id: 1,
      title: title[selectedMetric],
      value: selectedMetric=="orders"?"units_sold": selectedMetric,
      showCol: true,
    };

    if (indexToSwap >= 0 && indexToSwap < showHeader.length) {
      const newData = [...showHeader];

      const temp = newData[indexToSwap];
      newData[indexToSwap] = objectToSwap;

      // Move the original object to the position of the new object
      newData[
        showHeader.findIndex((item) => item.value === objectToSwap.value)
      ] = temp;
      setShowHeader(newData);
    }
  }, [selectedMetric]);
  let filterAccount = platform.map((item) => item.value);
  let filterCampType = campType.map((item)=> item.value);
  let filterTags = tags.map((item) => item.value)
  // const topCampaignData = (data) => {
  //   setCampaignData(data);
  //   console.log(campaignData, "<<<<<1 performance");
  // }
  let post={
    start_date: convertDate(dateRange[0]?.startDate),
    end_date: convertDate(dateRange[0]?.endDate),
    account: filterAccount,
    type:filterCampType.length>0? filterCampType:null,
    tags:filterTags.length>0 ? filterTags:null,
    sort:{[selectedMetric=="orders"?"units_sold":selectedMetric]:-1},
    offset:0,
    dataLIMIT:dataLIMIT,
    value_1:value1,
    value_2:value2,
    compare: selectedMetricOptions,
    compare_by: compareValue
  }
  const campaignTop = async (reset = false) => {
    try {
      if(platform.length>0){
      setLoading(true);
      const result = await _POST(AMAZON_METRIC_ANALYZER_CAMPAIGN, post);
      setLoading(false);
      if (resetData || reset) {
      setCampaignData(result?.data?.data?.data);
      }else{
        // eslint-disable-next-line no-unsafe-optional-chaining
        setCampaignData([...campaignData, ...result?.data?.data?.data]);

      }
      if (result?.data?.data?.data.length == 50) {
        setCallApi(true);
      } else {
        setCallApi(false);
      }
      setResetData(false);
    }
    else {
      setCampaignData([]);
    }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    setCampaignData([])
    const reset = true;
    setResetData(true);
    setDataLIMIT(0);
    campaignTop(reset);
  }, [selectedMetricOptions, platform, compareValue, value1, value2, selectedMetric, campType, tags, dateRange]);

  React.useEffect(() => {
    setResetData(false);
    if (callApi) {
      campaignTop();
    }
  }, [dataLIMIT]);
  return (
    <>
      <div className="outerContainerTableMetric px-2 row w-full justify-between">
        <div className="outerContainerTableMetric__header col_6">
          <div className="row ">
            <div className={["outerContainer__amsimage "].join("")}>
              <img
                className="px-2 pt-1 "
                src="/assets/images/campaign-icon1.svg"
                alt=""
              />
            </div>
            <div className="outerContainer__title self-center">
              Top Performing Campaigns
            </div>
          </div>
        </div>
        <div className="">
          <div className="pt-3">
            {/* <CustomizeDropDown
            title={"Customize Column"}
              setShowHeader={setShowHeader}
              showHeader={showHeader}
              applyFilter={applyFilter}
              cancelFilter={cancelFilter}
              setShowFilter={setShowFilter}
              showFilter={showFilter}
              platform={"ams"}
            /> */}
          </div>
        </div>
        <div className="w-[100%]">
          <TopPerformingCampaignTable
            headers={showHeader}
            sortBy={sortBy}
            campaignData={campaignData}
            setDataLIMIT={setDataLIMIT}
            dataLIMIT={dataLIMIT}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};
export default CampaignTopPerformingTable;
