import React, { useState } from "react";
import CampaignBudgetTargetblock from "./CampaignBudgetTargetblock";

const CampaignBudget = ({
  setCampaignData,
  campaignData,
  handleChange,
  error,
}) => {
  const [typeBudget, setTypeBudget] = useState("");
  return (
    <>
      <div className="border-b pb-3">
        <div className="row pt-4">
          <div className="col_5">
            <CampaignBudgetTargetblock
              title=" Overall campain budget"
              subtitle=" set an amount you want to spend on the entire campaign's lifetime"
              placeholder="Enter Budget Value"
              value="overall"
              name="budget"
              typeBudget={typeBudget}
              setTypeBudget={setTypeBudget}
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              error={error}
            />
          </div>
        </div>

        <div className="text-green-700 text-sm col_6">OR</div>
        <div className="row pt-4">
          <div className="col_5">
            <CampaignBudgetTargetblock
              title="Daily budget"
              subtitle="set an amount you want to spend on the campaign everyday"
              placeholder="Enter Budget Value"
              value="daily"
              name="budget"
              typeBudget={typeBudget}
              setTypeBudget={setTypeBudget}
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              error={error}
            />
          </div>
        </div>
        <div className="row pt-4">
          <input
            type="text"
            className="form-control"
            id="campaign_name"
            name="campaign_name"
            placeholder="Enter campaign name"
            onChange={handleChange}
            value={campaignData.campaign_name}
          />
          {error.campaign_name && (
            <p className="errorText">{error.campaign_name}</p>
          )}
        </div>
      </div>
      {/* <div className="row pt-4 border-t ">
        <Button
          title="Done"
          blinkit
          type="button"
          placeholder="Enter Budget Value"
        />
      </div> */}
      {/* <div className="col text-end px-2">
        {active > 4 ? (
          <Btn
            title="Edit"
            onClick={() => {
              setActive(4);
            }}
          />
        ) : (
          <div className="pt-4">
            <Button
              title="Done"
              // type="button"
              // placeholder="Enter Budget Value"
              blinkit
              click={() => {
                setActive(active + 1);
              }}
            />
          </div>
        )}
      </div> */}
    </>
  );
};
export default CampaignBudget;
