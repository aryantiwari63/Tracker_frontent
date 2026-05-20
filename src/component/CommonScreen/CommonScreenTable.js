/* eslint-disable no-unused-vars */
import React from "react";
import CommonScreenTableContent from "./CommonScreenTableContent";
import { CommonScreenTableHeader } from "../../utils/amazonConstants";

const CommonScreenTable = ({
  filterName,
  setFilterName,
  amazonSummary,
  flipkartSummary,
  blinkitSummary,
  zeptoSummary,
  instamartSummary,
  graphFilters,
  setGraphFilters,
  allowedPlatforms,
  noComparison,
  loadingSummary,
}) => {
  const [campaignData, setCampaignData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: -1,
  });
  const sortData = (item, order) => {
    setCampaignData([]);
    setSortBy({
      key: item,
      order: order,
    });
    setPage(1);
    setOffset(0);
  };
  const [offset, setOffset] = React.useState(0);

  return (
    <>
      {/* <div className="outerContainerTable px-2 relative">
        <div className="outerContainerTable__header ">
          <div className="row ">
            <div className="outerContainer__image">
              <img
                className="px-2 pt-1 "
                src="/assets/images/campaign-icon1.svg"
                alt=""
              />
            </div>
            <div className="outerContainer__title self-center">
              Platform overview
            </div>
            <div className="flipkart__cardTitle right-56 absolute">
              <ToggleButton
                label1={"Absolute"}
                label2={"DRR"}
                val={val}
                setVal={setVal}
              ></ToggleButton>
            </div>
            {/* <div className="relative mt-4 mx-2">
                    <CustomizeDropDown
                      title="Customize column"
                      setShowHeader={setShowHeader}
                      showHeader={showHeader}
                      applyFilter={applyFilter}
                      cancelFilter={cancelFilter}
                      setShowFilter={setShowFilter}
                      showFilter={showFilter}
                    />
                  </div> 
          </div>
        </div>
      </div> */}
      {allowedPlatforms && allowedPlatforms?.length > 0 && (
        <div className="">
          <CommonScreenTableContent
            headers={CommonScreenTableHeader}
            sortBy={sortBy}
            sortData={sortData}
            filterName={filterName}
            setFilterName={setFilterName}
            amazonSummary={amazonSummary}
            flipkartSummary={flipkartSummary}
            blinkitSummary={blinkitSummary}
            zeptoSummary={zeptoSummary}
            instamartSummary={instamartSummary}
            graphFilters={graphFilters}
            setGraphFilters={setGraphFilters}
            allowedPlatforms={allowedPlatforms}
            noComparison={noComparison}
            loadingSummary={loadingSummary}
          />
        </div>
      )}
    </>
  );
};

export default CommonScreenTable;
