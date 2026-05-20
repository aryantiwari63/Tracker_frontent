import React from "react";
import GraphHeader from "./GraphHeader";
import BrandGraph from "./BrandGraph";

const BrandGraphType=()=>{
    const dropdown=[
        {id:1,val:"SB"},
        {id:2,val:"SD"}
    ]
    return(
        <>
        <GraphHeader title="New to Brand" daywiseSortable dropdownsortable options={dropdown?.map((item, index) => (
          <option key={index} value={item.id}>{item.val}</option>
        ))}>
         <BrandGraph/>
          </GraphHeader>
        </>
    )
}
export default BrandGraphType