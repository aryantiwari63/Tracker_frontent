import React from "react";

import PerformanceCategoryCardBox from "./PerformanceCategoryCardBox";
import OuterContainer from "../../common-components/flipkart/OuterContainer";

const AmsPerformanceBreakDown = ({ dateRange, filter }) => {
  return (
    <>
      <OuterContainer
        title={"Performance Breakdown"}
        footerless
        customeOuterContainer="outerContainer__blinkitimage--ams"
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

export default AmsPerformanceBreakDown;
