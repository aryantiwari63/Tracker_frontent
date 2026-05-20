import React from "react";
import Popup from "../../../common-components/Popups/Popup";
import CampaignTypeCard from "./CampaignTypeCard";
import {  trackSelectedCampaignType } from "../../../../analytics/EventController";

const CreateCampaignPopup = ({ setOpenState }) => {
  return (
    <>
      <Popup
        title="Select Campaign Type"
        subTitle={"Choose the ad product you want to create a campaign for:"}
        setShowPopup={setOpenState}
        footerless
      >
        <div className="row px-5">
          <div className="col_6 p-1.5" onClick={()=>{
                trackSelectedCampaignType("Product Listing Ads")     // Track campaign type while creating campaign.
              }}>
            <CampaignTypeCard
              image="/assets/images/pla.png"
              title="Product Listing Ads"
              content="PLA: Product Listing Ads (PLA) helps you showcase your products torelevant or high 
        intent customers and improve your visibility and sales."
              // onClick={() => setShowPopup(!showPopup)}
              navigateLink={"/flipkart/createcampaign"}

              // navigateLink={"/flipkart/budgeting"}
            />
          </div>

          <div className="col_6 p-1.5">
            <CampaignTypeCard
            disabled
              image="/assets/images/pca.png"
              title="Product Contextual Ads"
              content="Product Contextual Ads (PCA) are rich media ads that ensure yourproducts' 
        presence among search results for categories related to your products."
            />
          </div>
          <div className="col_6 p-1.5">
            <CampaignTypeCard
            disabled
              image="/assets/images/display-ads.gif"
              title="Display Ads"
              content="Display ads are rich media, image based ads that help you buildvisibility of your brands
         and products among your target audience on Flipkart mobileproperties."
            />
          </div>
        </div>

        {/* <ReviewNewCampaign/> */}
        {/* </> */}
        {/* {showPopup && <CreateNewCampaign setOpenState={setShowPopup}/>} */}
      </Popup>
    </>
  );
};
export default CreateCampaignPopup;
