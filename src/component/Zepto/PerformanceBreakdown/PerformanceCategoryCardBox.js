import React from "react";
import PerformanceCategoryCard from "./PerformanceCategoryCard";
import {  useSelector } from "react-redux";

const PerformanceCategoryCardBox = ({ dateRange }) => {
  // const { overview, category, keyword } = useSelector(
  //   (state) => state?.BlinkitDashBoardReducer?.performanceBreakdown
  // );
  const { category, keyword, noComparison } = useSelector(
    (state) => state?.ZeptoDashBoardReducer?.zeptoperformanceBreakdown
  );

  return (
    <>
      {/* <div className=" performanceCategory__box">
        <div className="">
          <PerformanceCategoryCard
            imgsrc="/assets/images/campaign-icon1.svg"
            title="Overall"
            cardData={overview?.all}
            color={"bg-[#EFEAF3]"}
            dateRange={dateRange}
          />
        </div>
      </div> */}
      <div className=" performanceCategory__box">
        <div className="">
          <PerformanceCategoryCard
            imgsrc="/assets/images/campaign-icon1.svg"
            title="Category"
            cardData={category?.all}
            color={"bg-[#FFE6ED]"}
            dateRange={dateRange}
            noComparison={noComparison}
          />
        </div>
      </div>
      <div className=" performanceCategory__box">
        <div className="">
          <PerformanceCategoryCard
            imgsrc="/assets/images/campaign-icon1.svg"
            title="Keyword"
            cardData={keyword?.all}
            color={"bg-[#FAF2E5]"}
            dateRange={dateRange}
            noComparison={noComparison}
          />
        </div>
      </div>
    </>
  );
};

export default PerformanceCategoryCardBox;
