import React, { useState } from "react";

import { BsChevronBarDown } from "react-icons/bs";
import Tooltip from "../../../Tooltip";
import IndiviualSuggestedTable from "./IndiviualSuggestedTable";


const SearchListInd = () => {
  const [bids, setBids] = useState("Suggested bid");
  // eslint-disable-next-line no-unused-vars
  const [bidInput,setBidInput] =useState("")
  const [showBidsDropdown, setShowBidsDropdown] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [searchTerm,setSearchTerm] =useState("")

  const bidsOptions = [
    {
      label: "Suggested bid",
      value: "suggestedbid",
    },
    {
      label: "Custom bid",
      value: "custombid",
    },
    {
      label: "Default bid",
      value: "defaultbid",
    },
  ];
  const [checkedItems, setCheckedItems] = useState({
    broad: false,
    phrase: false,
    exact: false,
  });

  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedItems({
      ...checkedItems,
      [name]: checked,
    });
  };

  const checkboxOptions = [
    { name: "exact", label: "Exact" },
    { name: "expanded", label: "Expanded" },
  ];
  return (
    <>
      <div className="row px-2 py-3">
        <div className="col_5">
          <label>
            Bid <Tooltip />
          </label>
        </div>
        <div className="col_6">
          <div>
            <div className="rounded-3xl bg-gray-300  px-2 py-1 relative">
              <div
                className="row justify-between items-center"
                onClick={() => setShowBidsDropdown(!showBidsDropdown)}
              >
                <div>{bids}</div>
                <BsChevronBarDown />
              </div>
              {showBidsDropdown && (
                <div className="absolute  w-full bg-white max-h-72 overflow-y-auto py-4 border z-10">
                  
                  <div>
                    {bidsOptions?.map((item, i) => {
                      return (
                        item.label
                          .toLowerCase()
                          .startsWith(bidInput.toLowerCase()) && (
                          <div
                            key={i}
                            className={[
                              "portfolio__options",
                              bids === item.label &&
                                "portfolio__options--active",
                            ].join(" ")}
                            onClick={() => {
                              setBids(item.label);
                              setShowBidsDropdown(false);
                            }}
                          >
                            {item.label}
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
              )}
             
            </div>
       
          </div>
        </div>
        <div>
        <button className="border">
            <input
            type="number"/>
         
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col_5">
        <label>
          Filter by <Tooltip/>
        </label>
        
        </div>
        <div className="col">
         {checkboxOptions.map((option) => (
        <label key={option.name}>
          <input
            type="checkbox"
            name={option.name}
            checked={checkedItems[option.name]}
            onChange={handleCheckBoxChange}
          />
       <label className="pr-2">{option.label}</label>   
        </label>
      ))}
        </div>
      </div>
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
      <div className="row border-t">
        <IndiviualSuggestedTable/>
      </div>
    </>
  );
};

export default SearchListInd;
