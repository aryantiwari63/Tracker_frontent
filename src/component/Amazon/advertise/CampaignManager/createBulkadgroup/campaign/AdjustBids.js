import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import Tooltip from "../Tooltip";
import AdjustBidTable from "./AdjustBidTable";

const AdjustBids = ({
  setCampaignData,
  campaignData,
  handleChange,
  formIndex,
}) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      <div className=" pt-6">
        <div
          className="row cursor-pointer"
          onClick={() => {
            setShowMore(!showMore);
          }}
        >
          <div>{showMore ? <AiOutlineUp /> : <AiOutlineDown />}</div>
          <div className="text-blue-400">Adjust bids by placement</div>
          <Tooltip
            title={
              "Apply different bids by placement by entering a percentage increase to your base bid for 3 placements: top of search (first page), rest of search, and product pages."
            }
          />
        </div>
        {showMore && (
          <>
            <div className="">
              <label>
                In addition to your bidding startegy,you can increase bids by up
                to 900%
                {/* <span className="text-blue-400">Learn more</span> */}
              </label>
            </div>
            <AdjustBidTable
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              formIndex={formIndex}
            />
          </>
        )}
      </div>
    </>
  );
};

export default AdjustBids;
