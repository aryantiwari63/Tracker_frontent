import React from "react";
import SelectDropDrown from "../common-components/SelectDropDown";

const AmazonTableFilter=()=>{
    return (
        <>
        <div>
        <div className="row py-4 ">
        <div className="col_3 "> <SelectDropDrown /></div>
        <div className="col_3"> <SelectDropDrown /></div>
        <div className="col_2"> <SelectDropDrown /></div>
        <div className=""> <button className="border-2 bg-blue-500 text-white border-none border-r-4  w-full font-sm outline-none hover:bg-black">Apply</button></div>
        </div>
        
        </div>
        </>
    )
}

export default AmazonTableFilter;