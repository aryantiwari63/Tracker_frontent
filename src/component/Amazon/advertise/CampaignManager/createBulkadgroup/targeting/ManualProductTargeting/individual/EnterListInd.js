import React, { useState } from "react";
// import EventHandlerContext from "../../../../../../../../context/eventHAndlerContext";
import Tooltip from "../../../Tooltip";
import { BsChevronBarDown } from "react-icons/bs";

const EnterlistInd = () => {
  // const { selectedItems } = useContext(EventHandlerContext);
  const [bids, setBids] = useState("Suggested bid");
  const [bidInput] = useState("");
  const [showBidsDropdown, setShowBidsDropdown] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    broad: false,
    phrase: false,
    exact: false,
  });
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
  const checkboxOptions = [
    { name: "exact", label: "Exact" },
    { name: "expanded", label: "Expanded" },
  ];
  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedItems({
      ...checkedItems,
      [name]: checked,
    });
  };

  return (
    <>
      <div className="row  outline-none pt-4  px-5 ">
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
        <div className="row">
          <div className="col_5">
            <label>
              Filter by <Tooltip />
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
        <textarea
          rows="5"
          placeholder="Enter ASINs separated by commas, space, or new line."
          className="px-4 w-full  outline-none border"
        ></textarea>
        {/* <div className="row justify-end px-4 h-60 "> */}
        {/* <div className="text-red-300 text-sm ">!products weren't added.</div> */}
        {/* <button className="text-blue-400 pr-3">Download reports</button>*/}

        {/* </div> */}
      </div>
      <div className="text-right pr-5 pt-2">
        {" "}
        <button className="rounded-lg bg-gray-300  px-3 py-2 ">
          Target
        </button>{" "}
      </div>
    </>
  );
};

export default EnterlistInd;
