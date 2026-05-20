import React from "react";
import Conditions from "./Conditions";
import ConditionBoxAddBtn from "./button/ConditionBoxAddBtn";

const AddCondition = ({ conditionsApplied, firstConditionsApplied }) => {
  return (
    
      <><div className="pl-1 pb-2">
      <Conditions conditionsApplied={firstConditionsApplied} />
    </div><div className="row pl-1 pb-2">
        <ConditionBoxAddBtn conditionsApplied={conditionsApplied} />
      </div></>
  );
};
export default AddCondition;
