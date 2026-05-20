import React, { useState } from "react";
import Tooltip from "../../Tooltip";
import { BsChevronBarDown } from "react-icons/bs";
import ItemList from "../../Products/ItemList";

const Search = () => {
  const [bids, setBids] = useState("Suggested bid");
  // const [showsortDropdown, setShowSortDropdown] = useState(false);
  const [showBidsDropdown, setShowBidsDropdown] = useState(false);
  const [bidInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
  const [keywordList] = useState(initialKeywordList);

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

  return (
    <>
      <div>
        <div className="row p-3 border-b">
          <label>
            Bid
            <Tooltip />
          </label>
          <div className="">
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
                              <div className="text-sm ">{item.label}</div>
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
              placeholder="Search"
              className="keywordtab__search rounded"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
        {searchTerm?.length > 0 && (
          <div className="col">
            <div className="keyword__seacrhitems">
              {keywordList.map((value) => {
                return (
                  value.label
                    .toLowerCase()
                    .startsWith(searchTerm.toLowerCase()) && (
                    <ItemList label={value.label} data={value} />
                  )
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
