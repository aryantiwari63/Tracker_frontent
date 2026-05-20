import React from "react";
// import PerformanceOption from "./PerformanceOption";
import NewStepCaption from "../NewStepCaption";

const Performance = ({
  campaignData,
  handleChange,
  setCampaignData,
  error,
}) => {
  const [budgetError, setBudgetError] = React.useState("");

  const handleBudget = (event) => {
    const { name, value } = event.target;
    if (Number(value) < 1000) {
      setBudgetError("Budget should not be less than ₹1000");
    } else {
      setCampaignData((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
      setBudgetError("");
    }
  };
  return (
    <>
      <div className="py-4">
        <NewStepCaption caption="" subcaption="" />
        <div className="col_4">
          <h4 className=" createnewcamp-name">
            Campaign Name
            <span className="inline   createnewcamp-error">*</span>
          </h4>
          <input
            type="text"
            className="form-control"
            id="campaign_budget"
            name="campaign_name"
            placeholder="Enter campaign name"
            onChange={handleChange}
            value={campaignData.campaign_name}
          />
          {error.campaign_name && (
            <p className="errorText">{error.campaign_name}</p>
          )}
        </div>
        <div className="col_4 pt-4">
          <h4 className=" createnewcamp-name">
            Campaign Budget
            <span className="inline   createnewcamp-error">*</span>
          </h4>
          <input
            type="Number"
            className="form-control"
            id="campaign_budget"
            name="campaign_budget"
            placeholder="Enter campaign budget"
            // onChange={handleChange}
            onChange={(e) => handleBudget(e)}
            value={campaignData.campaign_budget}
          />
          {budgetError ? <p className="errorText">{budgetError}</p> : null}
          {error.campaign_budget && (
            <p className="errorText">{error.campaign_budget}</p>
          )}
        </div>
        {/* <NewCampSteps stepno={2} stepname="Campaign Details" active={active}>
        
         </NewCampSteps> */}
        {/* <CampaignDetails/> */}
      </div>
    </>
  );
};
export default Performance;
