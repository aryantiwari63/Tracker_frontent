import React from "react";
import OuterContainer from "../../common-components/flipkart/OuterContainer";
import ReachCampaign from "../dashboardCampaigntable/ReachCampaign";

const CampaignsTable = ({ dateRange, filter }) => {
  return (
    <>
      <OuterContainer
        title={"Campaigns"}
        customeOuterContainer="outerContainer__blinkitimage"
        customOuterLink="customlink"
        logo="/assets/images/campaign-icon1.svg"
      >
        <div>
          <div className="flex pt-4 ">
            <ReachCampaign dateRange={dateRange} filter={filter} />
          </div>
        </div>
      </OuterContainer>
    </>
  );
};

export default CampaignsTable;
