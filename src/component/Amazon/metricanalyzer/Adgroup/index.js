import React, {useState} from "react";
import AdgroupEvalutionHeader from "./AdgroupEvalutaionHeader";
import AdgroupLowPerformingTable from "./AdgroupLowPerformingTable";
import AdgroupTopPerformingTable from "./AdgroupTopPerformingTable";


const Adgroup=({selectedMetric,platform,campType,dateRange})=>{
  const [selectedMetricOptions, setSelectedMetricOptions] = useState("cpc");
  const [compareValue, setCompareValue] = useState("greater_than")
  const [value1, setValue1] = useState(0)
  const [value2, setValue2] = useState(0)
  const [lowBreakdown, setLowBreakdown] = useState([
    { id: 1, title: "Campaign", value: "campaign_id", checked: false },
  ]);
  const [topBreakdown, setTopBreakdown] = useState([
    { id: 1, title: "Campaign", value: "campaign_id", checked: false },
  ]);
    return (
      <>
        <div className="pt-4">
          <AdgroupEvalutionHeader
            platform={platform}
            campType={campType}
            dateRange={dateRange}
            compareValue={compareValue}
            setCompareValue={setCompareValue}
            value1={value1}
            setValue1={setValue1}
            value2={value2}
            setValue2={setValue2}
            selectedMetricOptions={selectedMetricOptions}
            setSelectedMetricOptions={setSelectedMetricOptions}
          />
        </div>
        <div className="row">
          <div className="col_6">
            <AdgroupTopPerformingTable
              compareValue={compareValue}
              setCompareValue={setCompareValue}
              value1={value1}
              setValue1={setValue1}
              value2={value2}
              setValue2={setValue2}
              selectedMetric={selectedMetric}
              platform={platform}
              campType={campType}
              dateRange={dateRange}
              selectedMetricOptions={selectedMetricOptions}
              topBreakdown={topBreakdown}
              setTopBreakdown={setTopBreakdown}
            />
          </div>
          <div className="col_6 ">
          
            <AdgroupLowPerformingTable
              compareValue={compareValue}
              setCompareValue={setCompareValue}
              value1={value1}
              setValue1={setValue1}
              value2={value2}
              setValue2={setValue2}
              selectedMetric={selectedMetric}
              platform={platform}
              campType={campType}
              dateRange={dateRange}
              selectedMetricOptions={selectedMetricOptions}
              lowBreakdown={lowBreakdown}
              setLowBreakdown={setLowBreakdown}
            />
          </div>
        </div>
      </>
    );
}
export default Adgroup;

