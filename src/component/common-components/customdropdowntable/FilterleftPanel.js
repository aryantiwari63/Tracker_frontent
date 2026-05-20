import React from "react";
import {AiOutlineMinusSquare} from "react-icons/ai"

const FilterleftPanel=({
    filtername
})=>{
    return(
        <>
        <div className="row">
            <div className="py-2">
                <AiOutlineMinusSquare/></div>
            <div className="filterleftpanel__name ">{filtername}</div></div>
        </>
    )
}

export default FilterleftPanel