import { useState } from "react";
import CreateRulePopup from "../../../rules/CreateRulePopup";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import WhenPermitted from "../../../../common-components/WhenPermitted";
import { PERMISSIONS } from "../../../../../utils/constants";

const AsinMainHeader = () => {
  const [showRulesPopup, setShowRulesPopup] = useState(false);

  return (
    <>
      {" "}
      <>
      <WhenPermitted platform="amazon" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
        {" "}
        <Headerbtn
          title="Rules"
          active={true}
          onClick={() => setShowRulesPopup(!showRulesPopup)}
        />
        </WhenPermitted>
        {showRulesPopup && <CreateRulePopup setOpenState={setShowRulesPopup} />}
      </>
    </>
  );
};

export default AsinMainHeader;
