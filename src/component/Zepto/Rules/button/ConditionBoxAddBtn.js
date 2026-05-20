import React, { useState, useEffect } from "react";
import Conditions from "../Conditions";

const ConditionBoxAddBtn = ({ conditionsApplied, entity }) => {
  const [conditionArr, setConditionArr] = useState([]);

  const handleOnclick = () => {
    setConditionArr((prevArr) => [...prevArr, []]);
  };

  const handleReset = () => {
    setConditionArr([]);
  };

  const handleConditionsApplied = (totalConditions, index) => {
    setConditionArr((prevArr) =>
      prevArr.map((item, i) => (i === index ? totalConditions : item))
    );
  };

  const handleRemoveCondition = (index) => {
    setConditionArr((prevArr) => prevArr.filter((_, i) => i !== index));
  };

  useEffect(() => {
    conditionsApplied(conditionArr);
  }, [conditionArr]);

  return (
    <>
      <div className="row">
        {conditionArr.length > 0 &&
          conditionArr.map((conditions, index) => (
            <div className="w-full" key={index}>
              {index >= 0 && (
                <div className="">
                  <button className="mr-3  rounded px-3 py-2 mt-1 mb-1 bg-gray-400 cursor-auto">
                    OR
                  </button>
                  <button
                    className="bg-red-100 rounded px-4 py-2 mt-1 mb-1"
                    onClick={() => handleRemoveCondition(index)}
                  >
                    X
                  </button>
                </div>
              )}
              <div className="w-full">
                <Conditions
                  conditionsApplied={(totalConditions) =>
                    handleConditionsApplied(totalConditions, index)
                  }
                  entity={entity}
                />
              </div>
            </div>
          ))}
        <button
          className="bg-[#0081f7] text-white px-5 h-9 zepto_btn rounded mt-2 hover:bg-black hover:text-white"
          onClick={handleOnclick}
        >
          Add
        </button>
        <button
          className="ml-2 bg-gray-200 px-5 h-9 rounded  mt-2 hover:bg-black hover:text-white"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default ConditionBoxAddBtn;
