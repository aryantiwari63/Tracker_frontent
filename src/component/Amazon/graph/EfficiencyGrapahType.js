import React from "react";
import GraphHeader from "./GraphHeader";
import EfficiencyGraph from "./EfficiencyGraph";

const EfficiencyGraphType=()=>{
    return(
        <>
         <GraphHeader title="Performance" daywiseSortable>
            
            <EfficiencyGraph/>
          </GraphHeader>
          
        </>
    )
}
export default EfficiencyGraphType