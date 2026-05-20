import { useState } from "react";
import Tag from "../../../../common-components/tag/Tag";
import AmsCreateCampaignPopup from "../../../../Amazon/advertise/CampaignManager/AmsCreateCampaignPopup";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import { APPLICATION_ROUTES, PERMISSIONS } from "../../../../../utils/constants";
import { useHistory } from "react-router-dom";
import CreateRulePopup from "../../../Rules/CreateRulePopup";
import WhenPermitted from "../../../../common-components/WhenPermitted";
const BlinkitMainHeader = ({ changeTagsData }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const history = useHistory();

  return (
    <>
      <div className="flex">
        <WhenPermitted platform="blinkit" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
        {/* <div className=" "> */}
        <Headerbtn
          imgsrc="/assets/images/plus1.svg"
          title="Create"
          active={true}
          onClick={() =>
            history.push(APPLICATION_ROUTES.BLINKITCREATENEWCAMPAIGN)
          }
        />
        <Headerbtn
          title="Rules"
          onClick={() => setShowRulesPopup(!showRulesPopup)}
        />
        {/* </div> */}
       </WhenPermitted>
        <div className="hidden">
          <Tag
            changeTagsData={changeTagsData}
            platform="blinkit"
            data_level={"campaign"}
          />
        </div>
      </div>
      {showPopup && <AmsCreateCampaignPopup setOpenState={setShowPopup} />}
      {showRulesPopup && <CreateRulePopup setOpenState={setShowRulesPopup} />}
    </>
  );
};

export default BlinkitMainHeader;
