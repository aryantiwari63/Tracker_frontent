import React, { useEffect, useState } from "react";
import DropDownLeftPanel from "./DropDownLeftPanel";
import RightPanelOptionSelected from "./RightPanelOptionSelected";
import MetricPanelOptionSelected from "./MetricPanelOptionSelected";
import customoption from "../../../data/Amazon/campaignManager/customcolumnAms";
import customoptionBlinkIT from "../../../data/BlinkIt/campaignManager/customcolumnAms";

const CustomDropDownTable = ({ 
   activeTab,
   platform
  }) => {
  const [metric, setMetric] = useState("dimension");
  const [selectedMetric, setSelectedMetric] = useState([]);
  const [data, setData] = useState([]);
  useEffect(()=>{
    if(platform === "ams"){
      setData(customoption)
    }else if(platform === "blinkIt"){
      setData(customoptionBlinkIT)
    }
  },[])


  return (
    <>
      <div className="row customdroptable  border-b-2 border-t-2">
        <div className="col_3 border-r-2 h-full">
          <MetricPanelOptionSelected
            heading={"Mertic"}
            metric={metric}
            setMetric={setMetric}
            data={data}
            activeTab={activeTab}
           
        
          />
        </div>
        <div className="col_5 border-r-2 h-full pl-2">
          <DropDownLeftPanel
            metric={metric}
            title={"Available Metric"}
            name={"Create custom metric"}
         
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            activeTab={activeTab}
            data={data}
          />
        </div>
        <div className="col bg-slate-200 h-full">
          <RightPanelOptionSelected
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
          
          />
        </div>
      </div>
    </>
  );
};

export default CustomDropDownTable;
