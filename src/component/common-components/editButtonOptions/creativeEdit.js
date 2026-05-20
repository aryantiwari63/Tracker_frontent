import {
  setLoading,
  setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import { RPA_ACTION_EDIT } from "../../../utils/constants";
import { _POST } from "../../../services/axios.method";
import { useState } from "react";
import DialogBox from "../dialogBox.js";
import { useSelector, useDispatch } from "react-redux";
import ActionType from "../../../redux/types";

export const CreativeEdit = ({ op, editRef }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [actionName, setActionName] = useState("");
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);

  const dispatch = useDispatch();
  const ACTION_TYPE = "creative";

  const createPayload = (actionName) => {
    const data = selectedCheckBox?.creative.map((data) => ({
      ad_group_id: data.ad_group_id,
      campaign_id: [data.campaign_id],
      campaign_name: [data.campaign_name],
      action: actionName,
      action_type: ACTION_TYPE,
      segment: data.segment,
      account_id: data.account_id,
      platform_id: data.platform_id,
      creative_id: data.banner_id,
      action_message: `${actionName} creative`,
      action_status: 0,
      client_id: localStorage.getItem("client_id"),
      platform: data.platform,
      account: data.account,
    }));
    handleAction(data);
  };
  const handleAction = async (data) => {
    try {
      setLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      if (res?.status === 200) {
        dispatch(setToastMessageHandler("Action performed successfully", true));
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
      setLoading(false);
      dispatch({
        type: ActionType.CHECKBOX,
        payload: [],
      });
    } catch (error) {
      console.error(error);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };
  const handleClick = (e, action) => {
    setActionName(action);
    setShowDialog(true);
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
    createPayload(actionName);
  };

  return (
    <>
      {op === true && (
        <div className="relative" ref={editRef}>
          <div className=" rounded mt-2 py-4 px-4 drop-shadow-md card bg-white w-max absolute  z-[100] right-[60px]">
            <ul className="edit-button">
              <li
                className="edit-button-li"
                onClick={(e) => handleClick(e, "enable")}
              >
                Enable
              </li>
              <li
                className="edit-button-li"
                onClick={(e) => handleClick(e, "pause")}
              >
                Pause
              </li>
            </ul>
          </div>

          {showDialog && (
            <DialogBox
              buttonName="Accept"
              title="Confirmation"
              onAccept={handleDialogApply}
              onCancel={handleDialogCancel}
            >
              Are you sure you want to {actionName} the status of selected
              records?
            </DialogBox>
          )}
        </div>
      )}
    </>
  );
};
