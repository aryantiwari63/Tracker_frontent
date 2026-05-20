import Popup from "../../Popups/Popup";
import { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../utils/constants";
import { _POST } from "../../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../redux/action-creator/commonAction";
import { useSelector, useDispatch } from "react-redux";
import ActionType from "../../../../redux/types";
import DialogBox from "../../dialogBox.js";

export const MinBid = ({ setOpenState }) => {
  const [bidValue, setBidValue] = useState(500);
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [error, setError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const dispatch = useDispatch();
  const ACTION_NAME = "set_budget";
  const ACTION_TYPE = "adgroup";

  const handleApplyButton = () => {
    const data = selectedCheckBox?.adgroup?.map((data) => {
      return {
        ad_group_id: data.ad_group_id,
        campaign_id: [data.campaign_id],
        campaign_name: [data.campaign_name],
        action: ACTION_NAME,
        action_type: ACTION_TYPE,
        segment: data.segment,
        account_id: data.account_id,
        platform: data.platform,
        set_value: bidValue,
        action_message: `Set budget to ${bidValue}`,
        action_status: 1,
        client_id: localStorage.getItem("client_id"),
        platform_id: data.platform_id,
        account: data.account,
        ad_group_name: data.ad_group_name,
      };
    });

    handleAction(data);
  };

  const handleDialogApply = () => {
    setShowDialog(false);
    handleApplyButton();
  };

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

  const handleError = () => {
    // Check if bidValue is less than 500
    if (parseFloat(bidValue) < 500) {
      setError("Enter a value of 500 or greater");
      return;
    }

    // Array to store campaigns with budget exceeding bidValue
    const exceededCampaigns = [];

    // Iterate over each selected adgroup
    for (let i = 0; i < selectedCheckBox?.adgroup?.length; i++) {
      const data = selectedCheckBox.adgroup[i];
      // Remove currency symbol and commas from campaign_budget
      let numberString = data?.campaign_budget.replace(/₹|,/g, "");

      // Check if bidValue is greater than campaign_budget
      if (parseFloat(bidValue) > parseFloat(numberString)) {
        exceededCampaigns.push(data.campaign_name);
      }
    }

    // If any campaigns exceed bidValue, set error message
    if (exceededCampaigns.length > 0) {
      setError(
        `Unselect the following campaigns as adgroup budget exceeds campaign budget: ${exceededCampaigns.join(
          ", "
        )}.`
      );
      return;
    }

    // If no errors found, clear error state
    setError(false);
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  };

  const handleNonNegativeInput = (e) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue > 0) {
      setBidValue(inputValue);
    } else {
      setBidValue(500);
    }
  };

  return (
    <>
      <Popup
        title="Set Budget"
        popup_id_container="popup-container"
        popup_content="popup_content"
        setShowPopup={setOpenState}
        applyAction={() => {
          setShowDialog(true);
          handleError();
        }}
      >
        <div className="w-full p-4">
          <div className="mr-2 mt-1 pb-1">
            <label className="">Set Budget</label>
          </div>{" "}
          <div>
            <input
              className="w-full h-8 rounded px-2 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
              type="number"
              min="500"
              placeholder={
                selectedCheckBox?.adgroup.length === 1 &&
                parseFloat(
                  selectedCheckBox?.adgroup[0]?.ad_group_budget.replace(
                    /₹|,/g,
                    ""
                  )
                )
              }
              onChange={(e) => handleNonNegativeInput(e)}
            ></input>
          </div>
        </div>
        {error && (
          <div className="text-red-500 ml-2">
            <p className="flex justify-center">{error}</p>
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
        >
          Are you sure you want to change the budget of the adGroup?
        </DialogBox>
      )}
    </>
  );
};
