import React, { useState } from "react";
import AddCondition from "../AddCondition";

const AddBtn = () => {
  const [conditionArr, setConditionArr] = useState([]);
  const handleOnclick = () => {
    let arr = [...conditionArr, conditionArr.length + 1];
    setConditionArr(arr);
  };
  const handleReset = () => {
    setConditionArr([]);
  };

  return (
    <>
      <div className="row">
        {conditionArr.map(() => {
          return (
            <>
              <button className="orButton cursor-auto">OR</button>
              <div className="col_12 pl-2 pr-2 pt-4 ">
                {" "}
                <AddCondition />
              </div>
            </>
          );
        })}
        <button className="createrule-addbtn" onClick={handleOnclick}>
          {/* <div><img src="/assets/images/plus1.svg" alt=""/></div> */}
          Add
        </button>
        <button className="createrule-resetbtn" onClick={handleReset}>Reset</button>
      </div>
    </>
  );
};
export default AddBtn;
