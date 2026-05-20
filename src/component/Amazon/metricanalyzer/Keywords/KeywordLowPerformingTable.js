/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  amazonMetricTableKeywordHeader,
} from "../../../../utils/amazonConstants";
import LowPerformingKeywordTable from "./LowPerformingKeywordTable";
import SelectBoxMetric from "../SelectBoxMetric";

  


const KeywordLowPerformingTable = ({lowBreakdown, setLowBreakdown, compareValue, setCompareValue,value1,setValue1,value2,setValue2 ,selectedMetric,platform,campType,dateRange,selectedMetricOptions}
  ) => {
  
  const [showHeader, setShowHeader] = React.useState([
    ...amazonMetricTableKeywordHeader,
  ]);
  const [campaignData, setCampaignData] = React.useState([]);
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: -1,
  });
  const [callApi, setCallApi] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const applyFilter = React.useCallback(() => {
    setShowHeader(
      showHeader?.map((checkbox) =>
        checkbox.checked === true
          ? { ...checkbox, showCol: true }
          : { ...checkbox, showCol: false }
      )
    );
    setCallApi(true);
    setShowFilter(false);
  }, [showHeader]);
  const cancelFilter = () => {
    setShowHeader([...showHeader]);
    setShowFilter(false);
  };
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
    const indexToSwap = 3;
    const objectToSwap = {
      id: 5,
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
  const header = [{}];
  return (
    <>
      <div className="outerContainerTableMetric px-2 row">
        <div className="outerContainerTableMetric__header col_6">
          <div className="row pt-1.5">
            <div className="">
              <img
                className="px-2 pt-1 "
                src="/assets/images/bar-chart.png"
                alt=""
              />
            </div>
            <div className="outerContainer__title self-center">
            Lowest Performing Keywords
            </div>
          </div>
        </div>
        <div className="col_6">
          <div className="row pt-3  d-flex justify-end">
       
            <SelectBoxMetric
              breakdown={lowBreakdown}
              setBreakdown={setLowBreakdown}
            />
          </div>
          
        </div>
        <div className="w-[100%]">
          <LowPerformingKeywordTable
             compareValue={compareValue} setCompareValue={setCompareValue} value1={value1} setValue1={setValue1} value2={value2} setValue2={setValue2} 
           selectedMetric={selectedMetric} platform={platform} campType={campType} dateRange={dateRange} selectedMetricOptions={selectedMetricOptions}
            headers={showHeader}
            sortBy={sortBy}
            sortData={sortData}
            lowBreakdown={lowBreakdown}
            
          />
        </div>
      </div>
    </>
  );
};
export default KeywordLowPerformingTable;
