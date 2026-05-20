import React from "react";

const Scheduleoptionresult = ({ campaignData }) => {
  return (
    <>
      {/* <div className="pt-2 text-sm">Negative Keyword</div> */}
      <div className="row text-sm pt-2">Campaign Duration </div>
      <div className=" text-sm pt-1">
        Start Date - {campaignData?.start_duration}{" "}
      </div>
      <div className=" text-sm pt-1">
        End Date -{" "}
        {campaignData?.end_duration
          ? campaignData?.end_duration
          : "No End Date"}{" "}
      </div>
      <div className="pt-2 text-sm">
        Campaign Days -{" "}
        {campaignData?.days?.map((data) => data.label)?.join(",")}
      </div>
      <div className="pt-2 text-sm">
        Campaign Timeslots -{" "}
        {campaignData?.timeslots?.map((data) => data.label)?.join(",")}
      </div>

      <div className="pt-2 text-sm">
        Campaign Region -{" "}
        {campaignData?.location == "cities"
          ? campaignData?.cities?.map((data) => data.name)?.join(",")
          : "Pan India"}
      </div>
    </>
  );
};
export default Scheduleoptionresult;
