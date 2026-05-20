// import { useState } from "react";
import Tag from "../../../../common-components/tag/Tag";
// import AmsCreateCampaignPopup from "../../../../Amazon/advertise/CampaignManager/AmsCreateCampaignPopup";
// import CreateRulePopup from "../../../../Amazon/rules/CreateRulePopup";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import { APPLICATION_ROUTES, PERMISSIONS } from "../../../../../utils/constants";
import { useHistory } from "react-router-dom";
import CreateRulePopup from "../../../Rules/CreateRulePopup";
import { useState } from "react";
import WhenPermitted from "../../../../common-components/WhenPermitted";
const InstamartMainHeader = ({ changeTagsData, selectedAccount }) => {
  //   const [showPopup, setShowPopup] = useState(false);
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const history = useHistory();

  return (
    <>
      <div className="flex">
        {/* <div className=" "> */}
        <WhenPermitted platform="instamart" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
        <Headerbtn
          imgsrc="/assets/images/plus1.svg"
          title="Create"
          active={true}
          onClick={() =>
            history.push(APPLICATION_ROUTES.INSTAMARTCREATENEWCAMPAIGN)
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
            platform="instamart"
            data_level={"campaign"}
            account={selectedAccount}
          />
        </div>
      </div>
      {showRulesPopup && <CreateRulePopup setOpenState={setShowRulesPopup} />}

      {/* {showPopup && <AmsCreateCampaignPopup setOpenState={setShowPopup} />}
   {showRulesPopup && <CreateRulePopup setOpenState={setShowRulesPopup} />} */}
    </>
  );
};

export default InstamartMainHeader;
