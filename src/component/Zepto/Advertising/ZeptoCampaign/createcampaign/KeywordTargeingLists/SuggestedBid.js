import React, { useState } from "react";
// import Tooltip from "./../../Tooltip";
import { BsChevronBarDown } from "react-icons/bs";
import KeywordTargetingTable from "./KeywordTargetingTabe";

const SuggestedBid = () => {
  const [bids, setBids] = useState("Suggested bid");
  // eslint-disable-next-line no-unused-vars
  const [bidInput, setBidInput] = useState("");
  const [showBidsDropdown, setShowBidsDropdown] = useState(false);
  const [sortoption, setSortOption] = useState("Order");
  const [showsortDropdown, setShowSortDropdown] = useState(false);
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
    { name: "broad", label: "Broad" },
    { name: "phrase", label: "Phrase" },
    { name: "exact", label: "Exact" },
  ];
  const sortOptionlist = [
    {
      label: "Orders",
      value: "orders",
    },
    {
      label: "Clicks",
      value: "clicks",
    },
  ];
  return (
    <>
      <div className="row px-2 py-3">
        <div className="col_3 ">
          <label className="font-semibold">Bid</label>
        </div>
        <div className="col_4 ">
          <div>
            <div className="rounded-3xl bg-gray-200 text-xs  px-2  py-1 relative w-32 ">
              <div
                className="row justify-between items-center"
                onClick={() => setShowBidsDropdown(!showBidsDropdown)}
              >
                <div className="">{bids}</div>
                <BsChevronBarDown />
              </div>
              {showBidsDropdown && (
                <div className="absolute  w-full bg-white max-h-72 overflow-y-auto py-4 border z-10 ">
                  <div>
                    {bidsOptions?.map((item, i) => {
                      return (
                        item.label
                          .toLowerCase()
                          .startsWith(bidInput.toLowerCase()) && (
                          <div
                            key={i}
                            className={[
                              "portfolio__options ",
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
        {/* <div className="col_2">
          <input type="number"
          className="border w-16 rounded"/>
        </div> */}
      </div>
      <div className="row">
        <div className="col_3 pl-2">
          <label className="font-semibold">Filter by</label>
        </div>
        <div className="col">
          {checkboxOptions.map((option) => (
            <label key={option.name} className="pr-2 ">
              <input
                className=""
                type="checkbox"
                name={option.name}
                checked={checkedItems[option.name]}
                onChange={handleCheckBoxChange}
              />
              <label className=" pl-1">{option.label}</label>
            </label>
          ))}
        </div>
      </div>
      <div className="row">
        <div className="col_3 pl-2">
          <label className="font-semibold">Sort by</label>
        </div>
        <div className="col_4 pb-2">
          <div>
            <div className="rounded-3xl bg-gray-200 text-xs px-2 py-1 relative w-32">
              <div
                className="row justify-between items-center"
                onClick={() => setShowSortDropdown(!showsortDropdown)}
              >
                <div>{sortoption}</div>
                <BsChevronBarDown />
              </div>
              {showsortDropdown && (
                <div className="absolute  w-full bg-white max-h-72 overflow-y-auto py-4 border z-10">
                  <div>
                    {sortOptionlist?.map((item, i) => {
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
                              setSortOption(item.label);
                              setShowSortDropdown(false);
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
      </div>
      <div className="row border-t h-[34rem] overflow-x-auto">
        <KeywordTargetingTable checkedItems={checkedItems} />
      </div>
    </>
  );
};

export default SuggestedBid;
