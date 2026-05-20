import React from "react";
import GraphHeader from "./GraphHeader";
import RealTimeGraph from "./RealTimeGraph";

const RealTimeGraphType=()=>{
    const metrics=[
        {id:1,val:"mertics"},
        {id:2,val:"Impressions"},
        {id:3,val:"CPC"},
        {id:4,val:"Clicks"},
        {id:6,val:"CTR"},
        {id:7,val:"CVR"},
        {id:8,val:"CPA"}
        
      ]
    return(
        <>
        <GraphHeader title="Real Time" dropdownsortable  options={metrics?.map((item, index) => (
          <option key={index} value={item.id}>{item.val}</option>
        ))}>
           <RealTimeGraph/>
          </GraphHeader>
        </>
    )
}
export default RealTimeGraphType