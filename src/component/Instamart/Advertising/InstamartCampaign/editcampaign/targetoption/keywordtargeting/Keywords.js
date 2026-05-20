import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Keywords = ({ selectedKeywords, setSelectedKeywords }) => {
  const [value, setValue] = useState("");
  const handleAdd = (e) => {
    if (e.key === "Enter") {
      setSelectedKeywords([
        ...selectedKeywords,
        {
          keywordtext: value,
          searchvol: 0,
          id: uuidv4(),
        },
      ]);
      setValue("");
    }
  };
  return (
    <>
      <div className=" keyword__leftcontainer ">
        <div className="row p-5  ">
          <h3 className="font-semibold text-xs">Enter Keyword</h3>

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
