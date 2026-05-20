import React from "react";
import {  useSelector } from "react-redux";
import PerformanceCategoryCard from "../../BlinkIt/PerformanceBreakdown/PerformanceCategoryCard";

const AmsPerformanceCategoryCardBox = ({ dateRange }) => {
  const { overview, category, keyword } = useSelector(
    (state) => state?.BlinkitDashBoardReducer?.performanceBreakdown
  );

  // const dispatch = useDispatch();
  // let post = {
  //   start_date: convertDate(dateRange[0].startDate),
  //   end_date: convertDate(dateRange[0].endDate),
  //   ...filter,
  // };
  // React.useEffect(() => {
  //   dispatch(getPerformanceBreakDown(post));
  // }, [dateRange]);
  return (
    <>
      <div className=" performanceCategory__box">
        <div className="">
          <PerformanceCategoryCard
            imgsrc="/assets/images/campaign-icon1.svg"
            title="Overall"
            cardData={overview?.all}
            color={"bg-[#E9F3FC]"}
            dateRange={dateRange}
          />
        </div>
      </div>
      <div className=" performanceCategory__box">
        <div className="">
          <PerformanceCategoryCard
            imgsrc="/assets/images/campaign-icon1.svg"
            title="Category"
            cardData={category?.all}
            color={"bg-[#EAFCF4]"}
            dateRange={dateRange}
          />
        </div>
      </div>
      <div className=" performanceCategory__box">
        <div className="">
          <PerformanceCategoryCard
            imgsrc="/assets/images/campaign-icon1.svg"
            title="Keyword"
            cardData={keyword?.all}
            color={"bg-[#F0F0F0]"}
            dateRange={dateRange}
          />
        </div>
      </div>
    </>
  );
};

export default AmsPerformanceCategoryCardBox;
