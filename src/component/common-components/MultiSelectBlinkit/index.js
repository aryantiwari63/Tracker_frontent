// CustomMultiSelect.jsx
import React from "react";
import { MultiSelect } from "react-multi-select-component";
import "./CustomMultiSelectBlinkit.css";

const CustomMultiSelectBlinkit = ({ ...props }) => {
  return (
    <div className="">
      <MultiSelect {...props} />
    </div>
  );
};

export default CustomMultiSelectBlinkit;
