import { APPLICATION_ROUTES } from "../../../../../../../utils/constants";
import { useHistory } from "react-router-dom";
import { Headerbtn } from "../../../../../../common-components/headerButton/headerButton";
import { useState } from "react";
import CreateRulePopup from "../../../../../Rules/CreateRulePopup";

const productHeader = () => {
  const history = useHistory();
  const [showRulesPopup, setShowRulesPopup] = useState(false);

  return (
    <>
      <div className="flex">
        {/* <div className=" "> */}
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
        {/* </div> */}
      </div>
      {showRulesPopup && <CreateRulePopup setOpenState={setShowRulesPopup} />}
    </>
  );
};

export default productHeader;
