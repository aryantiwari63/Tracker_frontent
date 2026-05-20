import Popup from "../../../../../common-components/Popups/Popup";

import { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../../../utils/constants";
import { _POST } from "../../../../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../../redux/action-creator/commonAction";
import { useSelector, useDispatch } from "react-redux";
import DialogBox from "../../../../../common-components/dialogBox.js/index.js";

import ActionType from "../../../../../../redux/types";

export const ZeptoSetBudget = ({ setOpenState }) => {
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
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleApplyButton = () => {
    const data = selectedCheckBox?.campaign?.map((data) => {
      let set_value;
      let action_message;

      switch (budgetOption) {
        case "setBudgetBy":
          set_value = parseFloat(data?.campaign_budget) + parseFloat(budget);
          action_message = `Increase budget by ${currency}${budget}`;
          break;
        case "setBudgetTo":
          set_value = parseFloat(budget);
          action_message = `Set budget to ${currency}${budget}`;
          break;
        default:
          set_value =
            parseFloat(data?.campaign_budget) +
            (parseFloat(data?.campaign_budget) * parseFloat(budget)) / 100;
          action_message = `Increase budget by ${budget}%`;
          break;
      }

      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action: ACTION,
        action_type: ACTION_TYPE,
        set_value: set_value,
        action_message: action_message,
        media_type: "Zepto",
        action_status: 1,
        account: data?.account,
        segment: data?.campaign_type,
        client_id: localStorage.getItem("client_id"),
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
  const handleError = () => {
    if (budget <= 0) {
      setError(true);
    } else {
      setError(false);
    }
  };
  return (
    <>
      <Popup
        // platform="zepto"
        title="Set Budget"
        popup_id_container="popup-container"
        popup_content="popup_content"
        setShowPopup={setOpenState}
        // applyAction={handleApplyButton}
        setTempView=""
        applyAction={() => {
          setShowDialog(true);
          handleError();
        }}
      >
        <div className="w-full p-4">
          <div className="pb-1">
            <label className="">Budget</label>
          </div>{" "}
          <div className="flex">
            <select
              className="w-1/2 h-8 rounded mb-2 px-4 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
              value={budgetOption}
              onChange={(e) => setBudgetOption(e.target.value)}
            >
              <option value="">Increase by Percent</option>
              <option value="setBudgetBy"> Increase by Amount</option>
              <option value="setBudgetTo">Set Budget</option>
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
        {error && (
          <div className="text-red-500 ">
            <p className="flex justify-center">Enter a value greater than 0</p>
          </div>
        )}
        <hr className="mt-6" />
      </Popup>
      {showDialog && error === false && (
        <DialogBox
          buttonName="Accept"
          title="Confirmation"
          onAccept={handleDialogApply}
          onCancel={handleDialogCancel}
          platform={"zepto"}
        >
          Are you sure you want to increase the budget of the campaigns?
        </DialogBox>
      )}
    </>
  );
};
