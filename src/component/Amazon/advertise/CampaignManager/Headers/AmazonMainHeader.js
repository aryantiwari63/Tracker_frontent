import { useState } from "react";
import Tag from "../../../../common-components/tag/Tag";
import AmsCreateCampaignPopup from "../AmsCreateCampaignPopup";
import CreateRulePopup from "../../../rules/CreateRulePopup";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import WhenPermitted from "../../../../common-components/WhenPermitted";
import { PERMISSIONS } from "../../../../../utils/constants";
const AmazonMainHeader = ({ changeTagsData, selectedAccount }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  return (
    <>
      <div className="flex">
        <WhenPermitted platform="amazon" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
        {/* <div className=" "> */}
        <Headerbtn
          imgsrc="/assets/images/plus1.svg"
          title="Create"
          active={true}
          onClick={() => setShowPopup(!showPopup)}
          // disabled={true}
        />
        {/* </div> */}

        <Headerbtn
          title="Rules"
          onClick={() => setShowRulesPopup(!showRulesPopup)}
        />
        </WhenPermitted>
        <div className="hidden">
          <Tag
            changeTagsData={changeTagsData}
            platform="amazon"
            data_level={"campaign"}
            account={selectedAccount}
          />
        </div>
      </div>
      {showPopup && <AmsCreateCampaignPopup setOpenState={setShowPopup} />}
      {showRulesPopup && <CreateRulePopup setOpenState={setShowRulesPopup} />}
    </>
  );
};

export default AmazonMainHeader;
