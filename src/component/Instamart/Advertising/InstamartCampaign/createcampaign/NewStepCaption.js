import React from "react";

const NewStepCaption = ({ caption, subcaption }) => {
  return (
    <>
      <div className="py-2">
        <div className="text-sm font-semibold pb-2">{caption}</div>
        <div className="text-xs pb-2">{subcaption}</div>
      </div>
    </>
  );
};
export default NewStepCaption;
