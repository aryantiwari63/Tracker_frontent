import Popup from "../../../../../common-components/Popups/Popup";

import { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../../../utils/constants";
import { _POST } from "../../../../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../../redux/action-creator/commonAction";
import { useSelector, useDispatch } from "react-redux";
import DialogBox from "../../../../../common-components/dialogBox.js";

import ActionType from "../../../../../../redux/types";

export const BlinkitSetBudget = ({ setOpenState }) => {
  const [budget, setBudget] = useState(0);
  const [budgetOption, setBudgetOption] = useState("");
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [showDialog, setShowDialog] = useState(false);

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
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleApplyButton = () => {
    const data = selectedCheckBox?.campaign?.map((data) => {
      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action: ACTION,
        action_type: ACTION_TYPE,
        set_value:
          budgetOption === "setBudgetBy"
            ? parseFloat(data?.campaign_budget) + parseFloat(budget)
            : parseFloat(data?.campaign_budget) +
              (parseFloat(data?.campaign_budget) * parseFloat(budget)) / 100,
        action_message:
          budgetOption === "setBudgetBy"
            ? `Increase budget by ${currency}${budget}`
            : `Increase budget by ${budget}%`,
        media_type: "Blinkit",
        action_status: 1,
        segment: data?.campaign_type,
      };
    });

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
  return (
    <>
      <Popup
        title="Set Budget"
        popup_id_container="popup-container"
        popup_content="popup_content"
        setShowPopup={setOpenState}
        // applyAction={handleApplyButton}
        applyAction={() => {
          setShowDialog(true);
          // setOpenState(false);
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
              onChange={(e) => setBudget(e.target.value)}
            ></input>
          </div>
          {/* </div> */}
        </div>
        <hr className="mt-6" />
      </Popup>
      {showDialog && (
        <DialogBox
          buttonName="Accept"
          title="Confirmation"
          onAccept={handleDialogApply}
          onCancel={handleDialogCancel}
          platform={"blinkit"}
        >
          Are you sure you want to increase the budget of the campaigns?
        </DialogBox>
      )}
    </>
  );
};
