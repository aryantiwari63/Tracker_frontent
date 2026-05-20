import React, { useState } from "react";
import BrandItemList from "./BrandItemList";


const ExcludeProducts=()=>{
    const [searchTerm,setSearchTerm] =useState("")
    const BrandList = [
        {
          label: "Veet",
          added: false, 
        },
        {
          label: "Dettol",
          added: false,
        },
        {
          label: "Durex",
          added: false,
        },
        {
          label: "Move",
          added: false,
        },
        {
          label: "Vanish",
          added: false,
        },
      ];
    return(
        <>
        <div className="row border-b">
            <div className="w-full px-2 py-2">
            <form className="relative ">
                <div className=" ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="keyword__searchimg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by product name or ASIN"
                    className="keywordtab__search rounded "
                    onChange={(e) =>setSearchTerm(e.target.value)
                    }
                  />
                </div>
              </form>
            
              {searchTerm?.length > 0 && <div className="col">
                <div className="keyword__seacrhitems ">
                  {BrandList.map((value) => {
                    return (
                      value.label.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
                      <BrandItemList label={value.label} data={value} />
                    );
                  })}
                </div>
              </div>}

            </div>
        </div>
       
        </>
    )
}

export default ExcludeProducts;