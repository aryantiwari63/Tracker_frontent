import React from "react";
import CampaignGraphType from "./CampaignGraphType";
import PerformanceGraphType from "./PerformanceGraphType";
import EfficiencyGraphType from "./EfficiencyGrapahType";
import AwarnessGraphType from "./AwarnessGraphType";
import RealTimeGraphType from "./RealTimeGraphType";
import BrandGraphType from "./BrandGraphType";

const GraphSection = () => {
  return (
    <>
      <div className="row">
        <div className="col_6 mb-3">
         <CampaignGraphType/>
        </div>
        <div className="col_6">
          <PerformanceGraphType/>
        </div>
        <div className="col_6 mb-3">
          <EfficiencyGraphType/>
        </div>
        <div className="col_6">
          <AwarnessGraphType/>
        </div>
        <div className="col_6">
         <RealTimeGraphType/>
        </div>
        <div className="col_6">
         <BrandGraphType/>
        </div>
      </div>
    </>
  );
};

export default GraphSection;
