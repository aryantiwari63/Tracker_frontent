import React from "react";
import GraphHeader from "./GraphHeader";
import PerformanceGraph from "./PerformanceGraph";

const PerformanceGraphType=()=>{
    return(
        <>
        <GraphHeader title="Efficiency" daywiseSortable>
        <PerformanceGraph  />
          </GraphHeader>
          
        </>
    )
}
export default PerformanceGraphType