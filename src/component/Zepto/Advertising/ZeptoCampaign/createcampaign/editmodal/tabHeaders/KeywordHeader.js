import { APPLICATION_ROUTES, PERMISSIONS } from "../../../../../../../utils/constants";
import { useHistory } from "react-router-dom";
import { Headerbtn } from "../../../../../../common-components/headerButton/headerButton";
import CreateRulePopup from "../../../../../Rules/CreateRulePopup";
import { useState } from "react";
import WhenPermitted from "../../../../../../common-components/WhenPermitted";

const KeywordHeader = () => {
  const history = useHistory();
  const [showRulesPopup, setShowRulesPopup] = useState(false);

  return (
    <>
      <div className="flex">
        {/* <div className=" "> */}
        <WhenPermitted platform="zepto" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
        <Headerbtn
          imgsrc="/assets/images/plus1.svg"
          title="Create"
          active={true}
          plaform="zepto"
          onClick={() =>
            history.push(APPLICATION_ROUTES.ZEPTOCREATENEWCAMPAIGN)
          }
        />
        {/* </div> */}

        <Headerbtn
          title="Rules"
          onClick={() => setShowRulesPopup(!showRulesPopup)}
        />
      </WhenPermitted>  
      </div>
      {showRulesPopup && <CreateRulePopup setOpenState={setShowRulesPopup} />}
    </>
  );
};

export default KeywordHeader;
