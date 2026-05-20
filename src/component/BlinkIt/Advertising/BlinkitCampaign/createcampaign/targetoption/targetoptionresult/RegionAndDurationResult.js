import React from "react";

const RegionAndDurationResult = ({ campaignData }) => {
  return (
    <div className="pt-1">
      <div className=" text-sm pt-1">
        Start Date -{" "}
        {campaignData?.start_duration ? campaignData?.start_duration : ""}
      </div>
      <div className=" text-sm pt-1">
        End Date -{" "}
        {campaignData?.no_end_date == "0"
          ? campaignData?.end_duration
          : "No End Date"}
      </div>
      <div className=" text-sm pt-1">
        Region -{" "}
        {campaignData?.location == "panIndia"
          ? "panIndia"
          : campaignData?.location}
      </div>
      {campaignData?.location != "panIndia" ? (
        <div className=" text-sm pt-1 capitalize">
          Cities -{" "}
          {campaignData?.cities?.length > 0
            ? campaignData?.cities?.map((data) => `${data.name} `)
            : ""}
        </div>
      ) : null}
    </div>
  );
};
export default RegionAndDurationResult;
