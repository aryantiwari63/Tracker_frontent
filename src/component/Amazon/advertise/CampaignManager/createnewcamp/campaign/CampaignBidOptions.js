import React, { useState } from "react";
import Tooltip from "../Tooltip";

const CampaignBiddingOptions = ({
  setCampaignData,
  campaignData,
}) => {
  const [targetingGroups, setTargetingGroups] = useState("LEGACY_FOR_SALES");
  React.useEffect(()=>{
    setCampaignData({
      ...campaignData,
      dynamicBid:targetingGroups
    })
  },[targetingGroups])

  return (
    <>
      <div className="row">
        <label>
          <input
            type="radio"
            value="LEGACY_FOR_SALES"
            name="targetingGroups"
            checked={targetingGroups === "LEGACY_FOR_SALES"}
            onClick={(e) => setTargetingGroups(e.target.value)}
          />
          Dynamic bids-up and down
          <Tooltip className="pt-2" />
          <p>
            {`We'll raise your bids(by maximum of 100%)in real time when your adds
            may be more likely to
            <br />
            convert to a sale, and lower your bids when less likely to convert
            to a sale.`}
          </p>
        </label>
      </div>
      <div className="">
        <label>
          <input
            type="radio"
            value="AUTO_FOR_SALES"
            name="targetingGroups"
            checked={targetingGroups === "AUTO_FOR_SALES"}
            onClick={(e) => setTargetingGroups(e.target.value)}
          />
     <label>Dynamic bids- down only<Tooltip/></label>     
          <p>
            {`We'll lower your bids in real time when your ads may be less likely
            to convert to a sale.`}
          </p>
        </label>
      </div>
      <div>
        <label>
          <div className="row">
            <div>
              <input
                type="radio"
                value="MANUAL"
                name="targetingGroups"
                checked={targetingGroups === "MANUAL"}
                onClick={(e) => setTargetingGroups(e.target.value)}
              />
              Fixed bids
              <Tooltip />
              <p>
                {`We'll use your exact bid and any manual adjusments you set,and
                won't changeyour bids based <br />
                on likelihood of a sale.`}
              </p>
            </div>
          </div>
        </label>
      </div>
    </>
  );
};
export default CampaignBiddingOptions;
