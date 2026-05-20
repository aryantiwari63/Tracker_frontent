import React from "react";
import OuterContainer from "../../common-components/flipkart/OuterContainer";
import RuleAnalysisTableContent from "./RuleAnaysisTableContent";

const RuleAnalysisTable = () => {
  return (
    <>
      <OuterContainer
        title={"Rule Analysis"}
        footerless
        customeOuterContainer="outerContainer__blinkitimage"
        logo="/assets/images/rule-analysis.svg"
        customBtn="BETA"
      >
        <div className=" ruleanalysistable__impactrules ">
          <h6>Overall impact of rules</h6>
          <span className="row">
            Jan 6- Feb 2, 2023 compared to Dec 9, 2022 - Jan 5, 2023
            <img
              src="http://13.234.176.50/amsfrontend/upload/avatar/help-circle.svg"
              alt=""
            />
          </span>
        </div>
        <div className="pb-2">
          <RuleAnalysisTableContent />
        </div>
      </OuterContainer>
    </>
  );
};

export default RuleAnalysisTable;
