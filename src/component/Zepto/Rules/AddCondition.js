import React from "react";
import Conditions from "./Conditions";
import ConditionBoxAddBtn from "./button/ConditionBoxAddBtn";

const AddCondition = ({ conditionsApplied, firstConditionsApplied, entity }) => {
  return (
    
      <><div className="pl-1 pb-2">
      <Conditions conditionsApplied={firstConditionsApplied} entity={entity} />
    </div><div className="row pl-1 pb-2">
        <ConditionBoxAddBtn conditionsApplied={conditionsApplied} entity={entity} />
      </div></>
  );
};
export default AddCondition;
