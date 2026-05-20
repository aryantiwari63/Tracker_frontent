import React, {useState} from "react";
import KeywordEvalationHeader from "./KeywordEvalationHeader";
import KeywordTopPerformingTable from "./KeywordTopPerformingTable";
import KeywordLowPerformingTable from "./KeywordLowPerformingTable";

const Keywords=({selectedMetric,platform,campType,dateRange})=>{
  const [selectedMetricOptions, setSelectedMetricOptions] = useState("cpc");
  const [compareValue, setCompareValue] = useState("greater_than")
  const [value1, setValue1] = useState(0)
  const [value2, setValue2] = useState(0)
  const [lowBreakdown, setLowBreakdown] = useState([
    { id: 1, title: "Campaign", value: "campaign_id", checked: false },
    { id: 2, title: "AdGroup", value: "ad_group_id", checked: false },
  ]);
  const [topBreakdown, setTopBreakdown] = useState([
    { id: 1, title: "Campaign", value: "campaign_id", checked: false },
    { id: 2, title: "AdGroup", value: "ad_group_id", checked: false },
  ]);
    return(
        <>
         <div className="pt-4">
       <KeywordEvalationHeader platform={platform} campType={campType} dateRange={dateRange} compareValue={compareValue} setCompareValue={setCompareValue} value1={value1} setValue1={setValue1} value2={value2} setValue2={setValue2}  selectedMetricOptions={selectedMetricOptions} setSelectedMetricOptions={setSelectedMetricOptions} />
      </div>
      <div className="row">
      <div className="col_6" >
        <KeywordTopPerformingTable
        compareValue={compareValue} setCompareValue={setCompareValue} value1={value1} setValue1={setValue1} value2={value2} setValue2={setValue2} 
        selectedMetric={selectedMetric} platform={platform} campType={campType} dateRange={dateRange} selectedMetricOptions={selectedMetricOptions}
        topBreakdown={topBreakdown} setTopBreakdown={setTopBreakdown}
        />
      </div>
      <div className="col_6 " >
        <KeywordLowPerformingTable
         compareValue={compareValue} setCompareValue={setCompareValue} value1={value1} setValue1={setValue1} value2={value2} setValue2={setValue2} 
         selectedMetric={selectedMetric} platform={platform} campType={campType} dateRange={dateRange} selectedMetricOptions={selectedMetricOptions}
         lowBreakdown={lowBreakdown} setLowBreakdown={setLowBreakdown}
        />
      </div>
      </div>
        </>
    )
}
export default Keywords;

