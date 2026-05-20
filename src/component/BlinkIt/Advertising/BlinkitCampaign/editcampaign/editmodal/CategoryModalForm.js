import React from "react";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import CustomSelect from "../../../../../common-components/CustomSelect";

const CategoryModalForm = () => {
  const percentage = [
    {
      label: "BY %",
      value: "%",
    },
  ];
  const statusfilter = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Pause",
      value: "pause",
    },
  ];

  return (
    <>
      <div className="mx-5">
        <div className="col pr-1 pt-4">
          <CustomSelect
            options={statusfilter}
            label={"Status"}
            onChange
            platform="blinkit"
          />
        </div>
        <div className="pt-5">
          <label>
            <input type="radio" name="keywordselected" />3 Category selected
          </label>
        </div>

        <div className="py-2">
          <label>
            <input type="radio" name="bidselected" />
            Bid Strategy
          </label>
        </div>
        <div className="row ml-3">
          <div className="col_3 pr-1">
            <select className="w-full py-2 border">
              {percentage.map((item, i) => {
                return <option key={i} value={item.value}>{item.label}</option>;
              })}
            </select>
          </div>
          <div className="col_1 border py-2 px-4 ">
            <BiSolidUpArrow className="text-green-600" />
          </div>
          <div className="col_1 border py-2 px-5">
            <BiSolidDownArrow className="text-red-600" />
          </div>
          <div className="col ">
            <input
              type="text"
              placeholder="Enter amount"
              className="border px-2 py-2 mx-1"
            ></input>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryModalForm;
