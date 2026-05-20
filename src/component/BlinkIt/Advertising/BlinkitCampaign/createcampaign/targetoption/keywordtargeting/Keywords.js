import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Keywords = ({ selectedKeywords, setSelectedKeywords }) => {
  const [value, setValue] = useState("");
  const handleAdd = (e) => {
    if (e.key === "Enter") {
      setSelectedKeywords([
        ...selectedKeywords,
        {
          keyword: value,
          searchvol: 0,
          id: uuidv4(),
          exact_min_for_boost: "251",
          min_bid: "200",
          max_bid: "10000",
          smart_min_bid: "200",
          smart_max_bid: "10000",
        },
      ]);
      setValue("");
    }
  };
  return (
    <>
      <div className=" keyword__leftcontainer bg-[#F7FFF9]">
        <div className=" p-5  ">
          <h3 className="font-semibold text-sm">Enter Keyword manually</h3>
          <div className="text-xs">
            Type specific keywords or add a list separated by commas
          </div>

          <div className="row pt-4">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type a keyword and press enter"
              className="w-full outline-none border rounded-lg p-3 text-xs"
              // onBlur={handleAdd}
              onKeyDown={handleAdd}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Keywords;
