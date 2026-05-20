import React from "react";
import BudgetProductListCont from "./BudgetProductListCont";
import { useLocation } from "react-router";
import { trackCampaignCreationSteps } from "../../../../analytics/EventController";
import KeywordTooltip from "./keywordtargeting/keywords/KeywordTooltip";

const Budgeting = ({ setCampaignData, campaignData, handleChange, error }) => {
  const [disableinput, setDisableInput] = React.useState(false);
  const tillBudgetEnds = (check) => {
    // console.log("campaignData check", check);
    if (check) {
      setDisableInput(true);
      setCampaignData({
        ...campaignData,
        is_till_end_duration: "1",
        budget_type: "TOTAL_BUDGET",
        end_duration: "",
      });
    } else {
      setDisableInput(false);

      setCampaignData({
        ...campaignData,
        is_till_end_duration: "0",
        budget_type: "",
      });
    }
  };

  const equallyDivideBudgets = (check) => {
    // console.log("campaignData check", check);
    if (check) {
      setCampaignData({
        ...campaignData,
        budget_type: "Daily",
      });
    } else {
      setCampaignData({
        ...campaignData,
        budget_type: "",
      });
    }
  };
  const costModel = (check) => {
    // console.log("campaignData check", check);
    if (check) {
      setCampaignData({
        ...campaignData,
        cost_model: "CPC",
      });
    } else {
      setCampaignData({
        ...campaignData,
        cost_model: "",
      });
    }
  };
  const location = useLocation();
  const campaignId = location?.state;
  React.useEffect(() => {
    if (!campaignId) {
      setCampaignData({
        ...campaignData,
        start_duration: new Date().toISOString().slice(0, -5), //2023-05-31T14:09:48
      });
    }
    trackCampaignCreationSteps("Budgeting"); // Tracking campaign creation steps
  }, []);
  return (
    <>
      <div>
        <div className="budgeting__costtitle">Cost Model</div>
        <div className="pb-4 pt-0.5 pl-1">
          <input
            type="checkbox"
            id="cost_model"
            name="cost_model"
            // value="CPC"
            checked={campaignData.cost_model == "CPC"}
            onChange={(e) => costModel(e.target.checked)}
            value={campaignData?.cost_model ? campaignData?.cost_model : "CPC"}
          />
          <label htmlFor="cpb" className="budgeting__costlab">
            CPC <span className="budgeting__costlab-cpb">(Cost Per Click)</span>
          </label>
        </div>

        <div className="budgeting__duration">
          Campaign Duration <span className="error-mark">*</span>
        </div>
        <div className=" row">
          <div className="col_6">
            <div className="row ">
              <div className="col_4 pr-2">
                {" "}
                <input
                  type="datetime-local"
                  className="form-control-bud"
                  id="start_duration"
                  step="1"
                  name="start_duration"
                  onChange={handleChange}
                  value={campaignData.start_duration}
                  min={new Date()
                    .toISOString()
                    .slice(0, new Date().toISOString().lastIndexOf(":"))}
                />
                {error.startDate && (
                  <p className="errorText">{error.startDate}</p>
                )}
              </div>
              <div className="">
                <p>to</p>
              </div>
              <div className="col_4 pl-2">
                <input
                  type="datetime-local"
                  step="1"
                  className="form-control-bud px-2 "
                  id="end_duration"
                  name="end_duration"
                  placeholder="End date time"
                  disabled={disableinput || campaignData.start_duration == ""}
                  min={campaignData.start_duration}
                  onChange={handleChange}
                  value={campaignData.end_duration}
                />
                <div className="bugget-checkbox pb-4 py-1">
                  <label
                    htmlFor="budget"
                    className="budgeting__lab row items-center"
                  >
                    <div className="px-1">
                      <input
                        type="checkbox"
                        id="is_till_end_duration"
                        name="is_till_end_duration"
                        // value="1"
                        checked={campaignData.is_till_end_duration == "1"}
                        value={campaignData.is_till_end_duration}
                        onChange={(e) => {
                          tillBudgetEnds(e.target.checked);
                        }}
                      />
                    </div>
                    Till budget ends.
                    <div>
                      <KeywordTooltip text="Campaign will remain active until the allocated budget is exhausted.">
                        <img
                          src="/assets/images/info-blue.svg"
                          alt=""
                          className="w-3"
                        />
                      </KeywordTooltip>
                    </div>
                  </label>
                  {error.endDate && (
                    <p className="errorText">{error.endDate}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className=" budgeting__bud col_3 pr-4">
            Campaign Budget <span className="error-mark">*</span>
            <div className="row items-center">
              <div
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "38px",
                  textAlign: "center",
                  lineHeight: "30px",
                  border: "1px solid #b1acac",
                }}
              >
                ₹
              </div>

              <div>
                <input
                  type="text"
                  className="form-control outline-none"
                  id="campaign_budget"
                  name="campaign_budget"
                  placeholder="Enter campaign total budget (min ₹1000)"
                  value={campaignData?.campaign_budget}
                  onChange={handleChange}
                ></input>
              </div>
              {error.campaignBudget && (
                <p className="errorText">{error.campaignBudget}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bugget-checkbox pt-2 pb-4 text-sm row items-center">
          <div className="pr-1">
            <input
              type="checkbox"
              id="budget_type"
              name="budget_type"
              // value="1"
              checked={campaignData.budget_type == "Daily"}
              value={campaignData.budget_type}
              disabled={disableinput}
              onChange={(e) => equallyDivideBudgets(e.target.checked)}
            />
          </div>
          <div className="pr-1">
            <label
              htmlFor="budget "
              className="budgeting__bud row items-center"
            >
              Equally divide budget for all days
              <div className="pl-1">
                <KeywordTooltip text="Set ad groups budget will be distributed equally throughout the set time period. This option is available only if end date time is specified">
                  <img
                    src="/assets/images/info-blue.svg"
                    alt=""
                    className="w-3"
                  />
                </KeywordTooltip>
              </div>
            </label>
          </div>
        </div>
        <div className="col-md-8 text-sm">
          <div className="pb-3">
            <label htmlFor="date" className="budgeting__bud">
              Selected products are grouped into ad group(s)
            </label>
          </div>
          <div className="col_4">
            <div className="callout-wrap budget-callout">
              <div className="callout-img w-4">
                <img src="/assets/images/info-blue.svg" alt="" />
              </div>
              <p className="callout pl-2">
                Now you can define your bid for each available placement slots
                in your adgroups.
              </p>
            </div>
          </div>
          <BudgetProductListCont
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </div>
        {/* <BottomNavBar/> */}
      </div>
    </>
  );
};

export default Budgeting;
