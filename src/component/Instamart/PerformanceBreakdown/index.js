import React from "react";
import OuterContainer from "../../common-components/flipkart/OuterContainer";
import PerformanceCategoryCardBox from "./PerformanceCategoryCardBox";

const PerformanceBreakDown = ({ dateRange, filter }) => {
  return (
    <>
      <OuterContainer
        title={"Performance Breakdown"}
        footerless
        customeOuterContainer="outerContainer__instaimage"
        logo="/assets/images/campaign-icon1.svg"
      >
        <div>
          <PerformanceCategoryCardBox dateRange={dateRange} filter={filter} />
          {/* <div className="row pr-2 pb-2">
            <CategoryWiseSpendTable />
            <KeywordWiseSpendTable />
          </div> */}
        </div>
      </OuterContainer>
    </>
  );
};

export default PerformanceBreakDown;
