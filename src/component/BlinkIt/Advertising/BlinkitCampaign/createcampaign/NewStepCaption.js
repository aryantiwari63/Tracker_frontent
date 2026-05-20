import React from "react";

const NewStepCaption = ({ caption, subcaption }) => {
  return (
    <>
      <div className="py-2">
        <div className="text-md font-semibold">{caption}</div>
        <div className="text-xs">{subcaption}</div>
      </div>
    </>
  );
};
export default NewStepCaption;
