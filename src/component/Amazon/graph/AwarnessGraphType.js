import React from "react";
import GraphHeader from "./GraphHeader";
import AwarnessGraph from "./AwarnessGraph";

const AwarnessGraphType=()=>{
    return(
        <>
        <GraphHeader title="Awareness" daywiseSortable>
          <AwarnessGraph/>                
          </GraphHeader>
          
        </>
    )
}
export default AwarnessGraphType