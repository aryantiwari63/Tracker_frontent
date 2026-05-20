import React, { useState } from "react";
import LeftProudctTargetingPanel from "./LeftProductTargetingPanel";
import RightProudctTargetingPanel from "./RightProductTargetingPanel";
import ManualProductTargetingContext from "./manualProductTargetingContext";

const ManualProductTargeting=()=>{
    const [addedProducts,setAddedProducts] = useState([])
    return(
        <ManualProductTargetingContext.Provider value={{addedProducts,setAddedProducts}}>
        <div className="row bg-white">
            <div className="col_6 border-l" >
            <LeftProudctTargetingPanel/>
            </div>
            <div className="col_6 border bg-bgclr">
            <RightProudctTargetingPanel/>
            </div>
        </div>
        </ManualProductTargetingContext.Provider>
    )
}

export default ManualProductTargeting