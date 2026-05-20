import React, {  useState } from "react";
import ProductListNegative from "./ProductListNegaive";
const NegativeSearchProduct =()=>{
    const [searchTerm,setSearchTerm] =useState("")
    const initialKeywordList = [
        {
          label: "Fabric Soften",
          added: false, 
        },
        {
          label: "Jewellery",
          added: false,
        },
        {
          label: "Chocolate Box",
          added: false,
        },
        {
          label: "Brass Copper",
          added: false,
        },
        {
          label: "Chocolate Pack",
          added: false,
        },
        {
          label: "Bottle",
          added: false,
        },
        {
          label: "Bathroom",
          added: false,
        },
      ];
    // eslint-disable-next-line no-unused-vars
    const [keywordList, setKeywordList] = useState(initialKeywordList);
    return(
        <>
        <div className="p-4 " >
              <form className="relative">
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
                    className="keywordtab__search rounded"
                    onChange={(e) =>setSearchTerm(e.target.value)
                    }
                  />
                </div>
              </form>
              {searchTerm?.length > 0 && <div className="col">
                <div className="keyword__seacrhitems ">
                  {keywordList.map((value) => {
                    return (
                      value.label.toLowerCase().startsWith(searchTerm.toLowerCase()) && 
                      <ProductListNegative label={value.label} data={value} />
                    );
                  })}
                </div>
              </div>}
              <div className=" border-t text-center py-6 text-xs ">
          Search for product you want to exclude.
        </div>
            </div>
        </>
    )
}

export default NegativeSearchProduct;