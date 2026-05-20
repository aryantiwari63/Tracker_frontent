import React, { useState } from "react";
import { SetBudget } from "./editPopups/setBudget";
import { useDispatch } from "react-redux";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import {   UPDATE_LIVE_BULK_CAMPAIGN } from "../../../utils/constants";
import { _POST } from "../../../services/axios.method";
import DialogBox from "../dialogBox.js";
import ActionType from "../../../redux/types";
import { EndDate } from "./editPopups/endDate.js";

export const CampaignEdit = ({ op, editRef, editData, platformId, accountId }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [actionName, setActionName] = useState("");
  let selectedCheckBox  = editData;
  const [calendarPopup, setCalendarPopup] = useState(false);

  const dispatch = useDispatch();
  const ACTION_TYPE = "campaign";

  const createPayload = (action) => {
    const campInfo = selectedCheckBox.map((data) => ({
      ad_group_id: data.ad_group_id,
      campaign_id: data.campaign_id,
      campaign_name: data.campaign_name,
      segment: data.segment,
      action_message: `${action} campaign`,
      action_status: 1,
      client_id: localStorage.getItem("client_id"),
     
    }));

    let data = {}
    data.campInfo = campInfo;
    data.action = action;
    data.action_type = ACTION_TYPE;
    data.platformId = platformId;
    data.accountId = accountId;
    handleAction(data);
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  };

  const handleAction = async (data) => {
    try {
      setLoading(true);
      const res = await _POST(UPDATE_LIVE_BULK_CAMPAIGN, data);

      setLoading(false);
      if (res?.status === 200) {
        dispatch(setToastMessageHandler("Action performed successfully", true));
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
    } catch (error) {
      console.error(error);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleClick = (e, action) => {
    setShowPopup(false);
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
          <div className=" rounded mt-2 py-4 px-4 drop-shadow-md card bg-white w-max absolute  z-[100]">
            <ul className="edit-button ">
              <li
                onClick={(e) => handleClick(e, "enable")}
                className="edit-button-li"
              >
                Enable
              </li>
              <li
                onClick={(e) => handleClick(e, "pause")}
                className="edit-button-li"
              >
                Pause
              </li>
              <li
                onClick={(e) => handleClick(e, "terminate")}
                className="edit-button-li"
              >
                Abort
              </li>
              <li
                onClick={() => setShowPopup(!showPopup)}
                className="edit-button-li"
              >
                Set budget
              </li>
              <li
                onClick={() => setCalendarPopup(!calendarPopup)}
                className="edit-button-li"
              >
                Extent Date
              </li>
            </ul>
          </div>
          {showPopup && <SetBudget setOpenState={setShowPopup} />}
          {calendarPopup && <EndDate setOpenState={setCalendarPopup} />}
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
