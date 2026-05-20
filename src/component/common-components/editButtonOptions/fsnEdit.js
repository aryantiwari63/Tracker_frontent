import { useState } from "react";
import { _POST } from "../../../services/axios.method";
import { RPA_ACTION_EDIT } from "../../../utils/constants";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import DialogBox from "../dialogBox.js";
import { useSelector, useDispatch } from "react-redux";
import ActionType from "../../../redux/types";

export const FsnEdit = ({ op, editRef }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [actionName, setActionName] = useState("");
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [errorPopUp, setErrorPopUp] = useState(false);

  const dispatch = useDispatch();
  const ACTION_TYPE = "fsn";

  const handleAction = async (data) => {
    try {
      setLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setLoading(false);
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

  const createPayload = (actionName) => {
    let campaignIds = [];
    let campaignNames = [];
    campaignIds = selectedCheckBox.campaign.map((item) => item.campaign_id);
    campaignNames = selectedCheckBox.campaign.map((item) => item.campaign_name);

    const platform_id = selectedCheckBox.campaign[0].platform_id;
    const account_id = selectedCheckBox.campaign[0].account_id;

    const data = selectedCheckBox?.fsn.map((data) => ({
      ad_group_id: data.ad_group_id,
      campaign_id: campaignIds,
      campaign_name: campaignNames,
      fsn_id: data.fsn_id,
      action_type: ACTION_TYPE,
      action: actionName,
      segment: data.segment,
      account_id: account_id,
      platform_id: platform_id,
      action_message: `${actionName} fsn`,
      action_status: 1,
      client_id: localStorage.getItem("client_id"),
      platform: data.platform,
      account: data.account,
    }));

    handleAction(data);
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

  const handleFsn = (e, action) => {
    if (
      selectedCheckBox?.campaign?.length === 0 ||
      selectedCheckBox?.campaign?.length === undefined
    ) {
      setErrorPopUp(true);
    } else {
      handleClick(e, action);
    }
  };
  return (
    <>
      {op === true && (
        <div className="relative" ref={editRef}>
          <div className=" rounded mt-2 py-4 px-4 drop-shadow-md card bg-white w-max absolute  z-[100] right-[60px]">
            <ul className="edit-button">
              <li
                className="edit-button-li"
                onClick={(e) => handleFsn(e, "enable")}
              >
                Enable
              </li>
              <li
                className="edit-button-li"
                onClick={(e) => handleFsn(e, "pause")}
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
          {errorPopUp && (
            <DialogBox
              buttonName="OK"
              title="Error"
              onAccept={() => setErrorPopUp(false)}
            >
              Select atleast one campaign from Campaign tab
            </DialogBox>
          )}
        </div>
      )}
    </>
  );
};
