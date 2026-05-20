import React from "react";

const CardAdvertise = ({
  title,
  caption,
  // value,
  // setValue,
  campaignData,
  setCampaignData,
  image,
  disabled,
  // error,
  isNew = false,
}) => {
  return (
    <>
      <div
        className="pr-4 pb-8 cursor-pointer"
        onClick={() => {
          if (!disabled) {
            setCampaignData({
              ...campaignData,
              campaign_type: title,
            });
          }
        }}
      >
        <div
          className={[
            `relative flex flex-col border border-gray-300 rounded-md bg-[#f8f8f8] ${
              title != "Reach" &&
              campaignData?.campaign_type === title &&
              "border border-green-600 "
            }`,
            campaignData?.campaign_type === title && "bg-green-100",
          ].join(" ")}
        >
          {isNew && (
            <div className="absolute top-0 right-2 px-2 py-0.5 bg-[#DBE8FF] rounded-b-md text-[#51ABF9] text-xs leading-tight font-semibold">
              New Asset
            </div>
          )}
          <div className="flex p-2 justify-center">
            <div className="p-2">
              {/* <div className="bg-blue-600 rounded-full h-10 w-10 "></div>
               */}

              <input
                className="mr-1 accent-green-600"
                type="radio"
                // value={title}
                checked={campaignData?.campaign_type === title}
                id="campaign_type"
                name="campaign_type"
                disabled={disabled}
                // onChange={handleChange}
                value={
                  campaignData.campaign_type
                    ? campaignData.campaign_type
                    : title
                }
              />
            </div>
            <div className=" flex flex-col w-60">
              <div className="text-base font-semibold">{title}</div>
              <div className="text-xs ">{caption}</div>
            </div>
          </div>
          <div className="flex justify-center items-center py-6">
            <img src={image} className="h-60" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};
export default CardAdvertise;
