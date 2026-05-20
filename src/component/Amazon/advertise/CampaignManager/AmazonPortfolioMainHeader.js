import { useState } from "react";
import { Headerbtn } from "../../../common-components/headerButton/headerButton";
import Tag from "../../../common-components/tag/Tag";
import AmsCreatePortfolioPopup from "./AmsCreatePortfolioPopup";
import WhenPermitted from "../../../common-components/WhenPermitted";
import { PERMISSIONS } from "../../../../utils/constants";

const AmazonMainHeader = ({ changeTagsData, selectedAccount }) => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <div className="flex">
        <WhenPermitted
          platform="amazon"
          permission={PERMISSIONS.CAMPAIGN_ACTIONS}
        >
          {/* <div className=" "> */}
          <Headerbtn
            imgsrc="/assets/images/plus1.svg"
            title=" Create"
            onClick={() => setShowPopup(!showPopup)}
            // disabled={true}
            active={true}
          />
        </WhenPermitted>
      </div>
      {showPopup && <AmsCreatePortfolioPopup setOpenState={setShowPopup} />}
      <div className="hidden">
        <Tag
          changeTagsData={changeTagsData}
          platform="amazon"
          data_level={"campaign"}
          account={selectedAccount}
        />
      </div>
    </>
  );
};

export default AmazonMainHeader;
