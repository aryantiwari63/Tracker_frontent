/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
    amazonMetricTableAdgroupHeader,
} from "../../../../utils/amazonConstants";
import TopPerformingAdgroupTable from "./TopPerformingAdgroupTable";
import SelectBoxMetric from "../SelectBoxMetric";

const AdgroupTopPerformingTable = ({topBreakdown, setTopBreakdown, compareValue, setCompareValue,value1,setValue1,value2,setValue2 ,selectedMetric,platform,campType,dateRange,selectedMetricOptions}) => {

  const [showHeader, setShowHeader] = React.useState([
    ...amazonMetricTableAdgroupHeader,
  ]);
  const [campaignData, setCampaignData] = React.useState([]);
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: -1,
  });
  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const sortData = (item, order) => {
    setCampaignData([]);
    setSortBy({
      key: item,
      order: order,
    });
    setPage(1);
    setOffset(0);
  };

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
    const indexToSwap = 2;
    const objectToSwap = {
      id: 3,
      title: title[selectedMetric],
      value: selectedMetric,
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
  return (
    <>
      <div className="outerContainerTableMetric px-2 row w-full justify-between">
        <div className="outerContainerTableMetric__header ">
          <div className="row ">
            <div className={["outerContainer__amsimage "].join("")}>
              <img
                className="px-2 pt-1 "
                src="/assets/images/campaign-icon1.svg"
                alt=""
              />
            </div>
            <div className="outerContainer__title self-center">
              Top Performing Ad Groups
            </div>
          </div>
        </div>
        <div className="col_6">
          <div className="row pt-3 d-flex justify-end">
          
            <SelectBoxMetric
              breakdown={topBreakdown}
              setBreakdown={setTopBreakdown}
            />
            
            
       
        
          {/* <div className="">
            <CustomizeDropDown
              title="Customize column"
              setShowHeader={setShowHeader}
              showHeader={showHeader}
              applyFilter={applyFilter}
              cancelFilter={cancelFilter}
              setShowFilter={setShowFilter}
              showFilter={showFilter}
              platform={"ams"}
            />
            </div> */}
          </div>
        </div>
        <div className="w-[100%]">
          <TopPerformingAdgroupTable
          compareValue={compareValue} setCompareValue={setCompareValue} value1={value1} setValue1={setValue1} value2={value2} setValue2={setValue2} 
          selectedMetric={selectedMetric} platform={platform} campType={campType} dateRange={dateRange} selectedMetricOptions={selectedMetricOptions}
            headers={showHeader}
            sortBy={sortBy}
            sortData={sortData}
            topBreakdown={topBreakdown}
           
          />
        </div>
      </div>
    </>
  );
};
export default AdgroupTopPerformingTable;
