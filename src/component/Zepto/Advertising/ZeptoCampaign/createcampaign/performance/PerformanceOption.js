import React from "react";
import NewStepCaption from "../NewStepCaption";

const PerformanceOption = ({
  title,
  adasset,
  campaignData,
  setCampaignData,
  error,
}) => {
  return (
    <>
      {error.product_booster && (
        <p className="errorText">{error.product_booster}</p>
      )}
      <div
        className={[
          "row border rounded bg-gray-100 cursor-pointer",
          adasset === title && "bg-green-100",
        ].join(" ")}
        onClick={() =>
          // setAdasset(title)
          setCampaignData({
            ...campaignData,
            product_booster: title,
          })
        }
      >
        <div className="px-2 py-2.5">
          <input
            className="mr-1"
            type="radio"
            checked={campaignData?.product_booster === title}
            id="product_booster"
            name="product_booster"
            value={
              campaignData.product_booster
                ? campaignData.product_booster
                : title
            }
          />
        </div>
        <div className="col">
          <NewStepCaption
            caption={title}
            subcaption="Tag into high intent purchase behaviour"
          />
        </div>
      </div>
    </>
  );
};

export default PerformanceOption;
