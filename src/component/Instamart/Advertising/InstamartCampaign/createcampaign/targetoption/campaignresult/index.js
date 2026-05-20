import React from "react";

const Campaignresult = ({ campaignData }) => {
  return (
    <div className="row">
      <div> Campaign Name : </div>&nbsp;
      <div>
        <b>{campaignData?.campaign_name}</b>
      </div>
    </div>
  );
};
export default Campaignresult;
