import React from "react";
import {blinkitPerformancebreakTable} from "../../../utils/constants.js"
import {FiColumns} from "react-icons/fi"
import KeywordCategoryTable from "../table/KeywordCategoryTable.js";
import tabledata from "./../data/tabledata.json"

const KeywordWiseSpendTable=()=>{
    return(
        <>
        <div className="col_6  categorywisetable__header ">
            <div className=" categorywisetable " >
                <div className="row justify-between pb-1 ">
                <div className="text-black font-normal">
                <h6>Top Reach Campaigns</h6> </div>
                <div>
               {/* <select className="border">
                <option>Breakdown</option>
               </select> */}
               <FiColumns className="inline"/>
               </div>
               </div>
               <KeywordCategoryTable
           headers={blinkitPerformancebreakTable}
           content={tabledata.tableData}
        //    content={}
        //    loading={}
        //    sortData={}
        //    paginate={}
        //    totalData={totalData}
        //    page={page}
        //    offset={offset}
          />
             
                
                </div>

        </div>
        </>
    )
}

export default KeywordWiseSpendTable