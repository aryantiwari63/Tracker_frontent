import React from "react";

const CardAdvertise = ({
  title,
  caption,
  // value,
  // setValue,
  campaignData,
  setCampaignData,
  error,
}) => {
  return (
    <>
      <div
        className="pr-4 pb-8 cursor-pointer"
        onClick={() =>
          setCampaignData({
            ...campaignData,
            campaign_type: title,
          })
        }
      >
        {error.campaign_type && (
          <p className="errorText">{error.campaign_type}</p>
        )}
        <div
          className={[
            "row border rounded bg-gray-100 ",
            campaignData?.campaign_type === title && "bg-green-100",
          ].join(" ")}
        >
          <div className="col_3 p-4 ">
            <div className="bg-blue-600 rounded-full h-10 w-10 "></div>
          </div>
          <div className="col_8 pt-2">
            <div className="text-base font-semibold">{title}</div>
            <div className="text-xs ">{caption}</div>
          </div>
          <div className="col pt-7">
            <input
              className="mr-1"
              type="radio"
              // value={title}
              checked={
                title != "Reach" && campaignData?.campaign_type === title
              }
              id="campaign_type"
              name="campaign_type"
              disabled={title == "Reach"}
              // onChange={handleChange}
              value={
                campaignData.campaign_type ? campaignData.campaign_type : title
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default CardAdvertise;
