import React from "react";

const BudgetResult = ({ campaignData }) => {
  let currency = localStorage.getItem("currency");

  return (
    <>
      <div className="row text-sm pt-2">Daily Campaign Budget </div>
      <div className=" text-sm pt-1">
        {currency}
        {campaignData?.Budget}{" "}
      </div>
    </>
  );
};
export default BudgetResult;
