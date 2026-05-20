import React from "react";
import BudgetTrendTableHeader from "../budgettrend/table/BudgetTrendTableHeader";

const BudgetTrend = () => {
  return (
    <>
      {/* <div className="flipkart__card px-4 py-4 mt-5">
        <div className="row ">
          <div className="col_8 ">
            <div className="row budgettrend__heading ">
              <h4>Budget Trend</h4>{" "}
            </div>
            <div className="row budgettend__subheading">
              {" "}
              <p>Amet minim mollit non deserunt ullamco.</p>
            </div>
            <BudgetTrendLeftPanel />
          </div>
          <div className="col_4 pl-10">
            <BudgetTrendRightPanel />
          </div>
        </div>
      </div>
      <div>
        <Searchbar />
      </div> */}
      <div>
        <BudgetTrendTableHeader />
      </div>
    </>
  );
};

export default BudgetTrend;
