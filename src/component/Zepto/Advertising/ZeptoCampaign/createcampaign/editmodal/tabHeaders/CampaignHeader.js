import { useState } from "react";
import Tag from "../../../../../../common-components/tag/Tag";
import { APPLICATION_ROUTES, PERMISSIONS } from "../../../../../../../utils/constants";
import { useHistory } from "react-router-dom";
import { Headerbtn } from "../../../../../../common-components/headerButton/headerButton";
import CreateRulePopup from "../../../../../Rules/CreateRulePopup";
import WhenPermitted from "../../../../../../common-components/WhenPermitted";
const CampaignHeader = ({ changeTagsData, account }) => {
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

        <Headerbtn
          title="Rules"
          onClick={() => setShowRulesPopup(!showRulesPopup)}
        />
        </WhenPermitted>
        {/* </div> */}
        <div className="hidden">
          <Tag
            changeTagsData={changeTagsData}
            platform="zepto"
            data_level={"campaign"}
            account={account}
          />
        </div>
      </div>
      {showRulesPopup && <CreateRulePopup setOpenState={setShowRulesPopup} />}
    </>
  );
};

export default CampaignHeader;
