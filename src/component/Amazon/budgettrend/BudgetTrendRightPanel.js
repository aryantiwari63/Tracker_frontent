import React from "react";
import BudgetTrendChart from "./BudgetTrendChart";
import BudgetTrentContent from "./BudgetTrendContent";

const BudgetTrendRightPanel = () => {
  return (
    <>
      <div className="">  
        <div className="row budgettrend__chart ">
          <div className="col ">
            <h4>Budget Trend</h4>
          </div>
          <div className=" budgettrend__chart-list ">
            <select className="budgettrend__chart-select">
              <option>All</option>
              <option>Money Available</option>
              <option>Campaign Buget (Money Blocked)</option>
              <option>Available Wallet Balance</option>
              <option>Potential Wallet</option>
            </select>
          </div>
        </div>
        <div className="col_12 border-l border-r border-b rounded-lg">
          <BudgetTrendChart />
        
       <BudgetTrentContent/>
        </div>
      </div>
    </>
  );
};

export default BudgetTrendRightPanel;
