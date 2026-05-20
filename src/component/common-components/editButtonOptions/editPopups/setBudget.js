import Popup from "../../Popups/Popup";

import React, { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../utils/constants";
import { _POST } from "../../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../redux/action-creator/commonAction";
import { useSelector, useDispatch } from "react-redux";
import DialogBox from "../../dialogBox.js";
import ActionType from "../../../../redux/types";

export const SetBudget = ({ setOpenState }) => {
  const [budget, setBudget] = useState(0);
  const [budgetOption, setBudgetOption] = useState("");
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState(false);

  const ACTION_TYPE = "campaign";
  const ACTION = "set_budget";
  const dispatch = useDispatch();
  let currency = localStorage.getItem("currency");

  const handleAction = async (data) => {
    try {
      setLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setLoading(false);
      setOpenState(false);
      if (res?.status === 200) {
        dispatch(setToastMessageHandler("Action performed successfully", true));
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }

      dispatch({
        type: ActionType.CHECKBOX,
        payload: [],
      });
    } catch (error) {
      console.error(error);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleApplyButton = () => {
    const data = selectedCheckBox?.campaign?.map((data) => {
      const budgetWithoutCurrency = data?.campaign_budget
        ?.split(currency)[1]
        ?.replace(/,/g, "");
      const numericBudget = parseFloat(budgetWithoutCurrency);

      return {
        ad_group_id: data.ad_group_id,
        campaign_id: [data.campaign_id],
        campaign_name: [data.campaign_name],
        min_bid: data?.min_bid,
        action: ACTION,
        action_type: ACTION_TYPE,
        segment: data.segment,
        set_value:
          budgetOption === "setBudgetBy"
            ? numericBudget + parseFloat(budget)
            : numericBudget + (numericBudget * parseFloat(budget)) / 100,
        account_id: data.account_id,
        platform_id: data.platform_id,
        platform: data.platform,
        account: data.account,
        action_message:
          budgetOption === "setBudgetBy"
            ? `Increase budget by ${currency}${budget}`
            : `Increase budget by ${budget}%`,
        action_status: 10,
        client_id: localStorage.getItem("client_id"),
        media_type: 'Flipkart'
      };
    });
    setError(false);
    handleAction(data);
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  };

  const handleDialogApply = () => {
    setShowDialog(false);
    handleApplyButton();
  };

  const handleError = () => {
    if (budget <= 0) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <>
      <div className="">
        <Popup
          title="Set Budget"
          popup_id_container="popup-container"
          popup_content="popup_content"
          setShowPopup={setOpenState}
          // applyAction={handleApplyButton}
          applyAction={() => {
            setShowDialog(true);
            handleError();
          }}
        >
          <div className="w-full p-4">
            <div className="pb-1">
              <label className="">Increase Budget By</label>
            </div>{" "}
            <div className="flex">
              <select
                className="w-1/4 h-8 rounded mb-2 px-4 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
                value={budgetOption}
                onChange={(e) => setBudgetOption(e.target.value)}
              >
                <option value="">Percent</option>
                <option value="setBudgetBy">Amount</option>
              </select>
              {/* <div> */}
              <input
                className="w-full h-8 rounded px-2 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
                type="number"
                value={budget}
                onChange={(e) => {
                  setBudget(e.target.value);
                  setError(null);
                }}
                onKeyPress={(e) => {
                  if (e.key === "e" || e.key === "E") {
                    e.preventDefault();
                  }
                }}
              ></input>
              {}
            </div>
            {/* </div> */}
          </div>

          {error && (
            <div className="text-red-500 ">
              <p className="flex justify-center">
                Enter a value greater than 0
              </p>
            </div>
          )}

          <hr className="mt-6" />
        </Popup>
      </div>

      {showDialog && error === false && (
        <DialogBox
          buttonName="Accept"
          title="Confirmation"
          onAccept={handleDialogApply}
          onCancel={handleDialogCancel}
        >
          Are you sure you want to increase the budget of the campaigns?
        </DialogBox>
      )}
    </>
  );
};
