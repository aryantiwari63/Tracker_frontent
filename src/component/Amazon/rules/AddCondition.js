import React from "react";
import Conditions from "./Conditions";
import ConditionBoxAddBtn from "./button/ConditionBoxAddBtn";

const AddCondition = ({ conditionsApplied, firstConditionsApplied, entity }) => {
  return (
    // <>
    //   <div className=" createrulepopup-condition  ">
    //     <div className=" ">
    //       <button
    //         className="   createrulepopup-addbtn"
    //         onClick={() => setShowPopup(!showPopup)}
    //       >
    //         + Add Condition
    //       </button>
    //     </div>
    //   </div>
    //   {showPopup && <ConditionBox setOpenState={setShowPopup} />}
    // </>
    // <div>
    //   <label>Conditions</label>
    //   <div className="flex w-full ">
    //     <div className="flex  w-2/3 justify-between h-10">
    //       <select
    //         className="border rounded w-56 border-gray-300 focus:border-blue-500 focus:outline-none"
    //         name=""
    //       >
    //         <option value="views">Views</option>
    //         <option value="clicks">Clicks</option>
    //         <option value="spend">Spend</option>
    //         <option value="ctr">CTR</option>
    //         <option value="cpc">CPC</option>
    //         <option value="total_units_sold">Total Units Sold</option>
    //         <option value="total_revenue">Total Revenue</option>
    //         <option value="total_cvr">Total CVR</option>
    //         <option value="total_roi">Total ROI</option>
    //         <option value="total_aov">Total AOV</option>
    //       </select>
    //       <select className="border rounded w-56 h-10 border-gray-300 focus:border-blue-500 focus:outline-none">
    //         <option value="is_greater_than">is greater than</option>
    //         <option value="is_smaller_than">is smaller than</option>
    //         <option value="is_between">is between</option>
    //         <option value="is_not_between">is not between</option>
    //       </select>
    //       <input
    //         className="border rounded w-20  h-10 pl-4 border-gray-300 focus:border-blue-500 focus:outline-none"
    //         type="number"
    //       />
    //     </div>
    //     <button className="border px-4 text-xl  bg-gray-300 rounded">+</button>
    //   </div>
    // </div><Conditions />
    <>
      <div className=" pl-1.5">
        <Conditions conditionsApplied={firstConditionsApplied} entity={entity} />
      </div>
      <div className="row pl-1.5">
        <ConditionBoxAddBtn conditionsApplied={conditionsApplied} />
      </div>
    </>
  );
};
export default AddCondition;
