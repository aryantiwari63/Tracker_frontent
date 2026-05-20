import React, { useState, useEffect } from "react";
import {
    amazonMetricTableAdgroupHeader,
} from "../../../../utils/amazonConstants";
import LowPerformingAdGroupTable from "./LowPerformingAdGroupTable";
import SelectBoxMetric from "../SelectBoxMetric";




const AdgroupLowPerformingTable = ({ lowBreakdown, setLowBreakdown, compareValue, setCompareValue,value1,setValue1,value2,setValue2 ,selectedMetric,platform,campType,dateRange,selectedMetricOptions}) => {

  const [showHeader, setShowHeader] = React.useState([
    ...amazonMetricTableAdgroupHeader,
  ]);
  // const [callApi, setCallApi] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showFilter, setShowFilter] = useState(false);
 

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
              Lowest Performing Adgroups
            </div>
          </div>
        </div>
        <div className="col_6">
          <div className="row pt-3 d-flex justify-end">
          
         
            <SelectBoxMetric
              breakdown={lowBreakdown}
              setBreakdown={setLowBreakdown}
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
        <div className="w-[100%]" >
         
          <LowPerformingAdGroupTable
          compareValue={compareValue} setCompareValue={setCompareValue} value1={value1} setValue1={setValue1} value2={value2} setValue2={setValue2} 
          selectedMetric={selectedMetric} platform={platform} campType={campType} dateRange={dateRange} selectedMetricOptions={selectedMetricOptions}
            headers={showHeader}  lowBreakdown={lowBreakdown}
           
          />
        </div>
      </div>
    </>
  );
};
export default AdgroupLowPerformingTable;
