import Popup from "../../../../../common-components/Popups/Popup.js";

import { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../../../utils/constants.js";
import { _POST } from "../../../../../../services/axios.method.js";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../../redux/action-creator/commonAction.js";
import { useSelector, useDispatch } from "react-redux";
import DialogBox from "../../../../../common-components/dialogBox.js/index.js";

import ActionType from "../../../../../../redux/types.js";

export const InstamartSetBudget = ({ setOpenState }) => {
  const [budget, setBudget] = useState(0);
  const [budgetOption, setBudgetOption] = useState("");
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [showDialog, setShowDialog] = useState(false);

  const ACTION_TYPE = "campaign_action";
  const ACTION = "set_budget";
  const dispatch = useDispatch();
  let currency = localStorage.getItem("currency");

  
  const handleAction = async (data) => {
    try {
      let res;
      if (data.length > 0) {
        setLoading(true);
        res = await _POST(RPA_ACTION_EDIT, data);

        setLoading(false);
        if (res?.status === 200) {
          dispatch(
            setToastMessageHandler("Action performed successfully", true)
          );
        } else {
          dispatch(setToastMessageHandler("Failed to perform action", false));
        }
      } else {
        dispatch(
          setToastMessageHandler(
            "Actions can only be performed on LIVE campaigns",
            false
          )
        );
      }
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleApplyButton = () => {

     const filteredData = selectedCheckBox?.campaign?.filter(
       (data) => data?.status === "LIVE"
     );
    const data = filteredData?.map((data) => {
      const budgetWithoutCurrency = data?.budget
        ?.split(currency)[1]
        ?.replace(/,/g, "");
      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action: ACTION,
        action_type: ACTION_TYPE,
        set_value:
          budgetOption === "setBudgetBy"
            ? parseFloat(budgetWithoutCurrency) + parseFloat(budget)
            : parseFloat(budgetWithoutCurrency) +
              (parseFloat(budgetWithoutCurrency) * parseFloat(budget)) / 100,
        action_message:
          budgetOption === "setBudgetBy"
            ? `Increase budget by ${currency}${budget}`
            : `Increase budget by ${budget}%`,
        media_type: "Instamart",
        action_status: 10,
        segment: data?.campaign_type,
        account: data.account,
        client_id: localStorage.getItem("client_id"),
        account_id: data.account_id || "",
      };
    });
    handleAction(data);
     dispatch({
       type: ActionType.CHECKBOX,
       payload: [],
     });
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
        platform="instamart"
        title="Set Budget"
        popup_id_container="popup-container"
        popup_content="popup_content"
        setShowPopup={setOpenState}
        setTempView={() => {}}
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
          platform={"instamart"}
        >
          Are you sure you want to increase the budget of the campaigns?
        </DialogBox>
      )}
    </>
  );
};
