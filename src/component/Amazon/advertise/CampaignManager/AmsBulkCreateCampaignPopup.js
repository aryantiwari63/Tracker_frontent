/* eslint-disable */
import React, { useState } from 'react';
import Popup from '../../../common-components/Popups/Popup';
// import CampaignTypeCard from "./CampaignTypeCard";

import CardLayoutCreateCampaign from '../../../common-components/createcampaigncardlayout/CardLayoutCreateCampaign';
import AmsCreateNewCampaign from './createnewcamp';
import CardLayoutBulkCreateCampaign from '../../../common-components/createcampaigncardlayout/CardLayoutBulkCreateCampaign';
// import CreateNewCampaign from "./CreateNewCampaign";
// import Budgeting from "./Budgeting";
// import ReviewNewCampaign from "./ReviewNewCampaign";

const AmsBulkCreateCampaignPopup = ({ setOpenState, OpenState }) => {
	const [showPopup, setShowPopup] = useState(false);

	return (
    <>
      <Popup
        title="Choose your Bulk camapign type"
        setShowPopup={setOpenState}
        footerless
        setTempView={() => {}}
      >
        <div className="row">
          <div className="col_4 border-r">
            <CardLayoutBulkCreateCampaign
              image={"/assets/images/megaphone.png"}
              heading={"Sponsored Products"}
              picture={"/assets/images/amazon.png"}
              title={"Promote product listings"}
              content={
                "Sponsored Products can help promote products to shoppers actively searching with related keywords or viewing similar products on Amazon."
              }
              navigateLink="/amazon/advertise/campaignmanager/createbulkcamp"
            />
          </div>
          {/* <AmsCreateNewCampaign/> */}
          <div className="col_4 border-r">
            <CardLayoutBulkCreateCampaign
              image={"/assets/images/megaphone.png"}
              heading={"Sponsored brands"}
              picture={"/assets/images/amas.png"}
              title={"Showcase your brand"}
              content={
                "Sponsored Products can help promote products shoppers actively searching with related keywords or viewing similar products on Amazon."
              }
            />
          </div>
          <div className="col_4 ">
            <CardLayoutBulkCreateCampaign
              image={"/assets/images/megaphone.png"}
              heading={"Sponsored Display"}
              picture={"/assets/images/amss.png"}
              title={"Promote product listings"}
              content={
                "Sponsored Products can help promote products to shoppers actively searching with related keywords or viewing similar products on Amazon."
              }
            />
          </div>
        </div>
      </Popup>
    </>
  );
};
export default AmsBulkCreateCampaignPopup;
