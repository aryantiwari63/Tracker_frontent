import React from "react";
import OuterContainer from "../../common-components/flipkart/OuterContainer";
import ReachCampaign from "../../BlinkIt/dashboardCampaigntable/ReachCampaign";


const AmazonCampTable = ({ dateRange, filter }) => {
  return (
    <>
      <OuterContainer
        title={"Campaigns"}
        customeOuterContainer="outerContainer__amsimage  "
        customOuterLink="amscustomlink"
        logo="/assets/images/campaign-icon1.svg"
        platform={"ams"}
      >
        <div>
          <div className="row pt-4 ">
            <ReachCampaign dateRange={dateRange} filter={filter} />
          </div>
        </div>
      </OuterContainer>
    </>
  );
};

export default AmazonCampTable;
