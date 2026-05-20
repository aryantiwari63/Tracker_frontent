import { useState } from "react";
import { MinBid } from "./editPopups/minBid";
import { _POST } from "../../../services/axios.method";
import { RPA_ACTION_EDIT } from "../../../utils/constants";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import DialogBox from "../dialogBox.js";
import { useSelector, useDispatch } from "react-redux";
import ActionType from "../../../redux/types";
import { AdgroupEndDate } from "./editPopups/adgroupEndDate.js";

export const AdGroupEdit = ({ op, editRef }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [actionName, setActionName] = useState("");
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [calendarPopup, setCalendarPopup] = useState(false);

  const ACTION_TYPE = "adgroup";
  const dispatch = useDispatch();

  const createPayload = (actionName) => {
    const data = selectedCheckBox?.adgroup.map((data) => ({
      ad_group_id: data.ad_group_id,
      campaign_id: [data.campaign_id],
      campaign_name: [data.campaign_name],
      ad_group_name: data.ad_group_name,
      action: actionName,
      action_type: ACTION_TYPE,
      segment: data.segment,
      account_id: data.account_id,
      platform: data.platform,
      action_message: `${actionName} adgroup`,
      action_status: 10,
      client_id: localStorage.getItem("client_id"),
      platform_id: data.platform_id,
      account: data.account,
      media_type: 'Flipkart'
    }));
    handleAction(data);
  };

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
          <div className=" rounded mt-2 py-4 px-4 drop-shadow-md card bg-white w-max absolute  z-[100] right-[30px]">
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
              <li
                className="edit-button-li"
                onClick={(e) => handleClick(e, "terminate")}
              >
                Abort
              </li>
              <li
                className="edit-button-li"
                onClick={() => setShowPopup(!showPopup)}
              >
                Set Budget
              </li>
              <li
                onClick={() => setCalendarPopup(!calendarPopup)}
                className="edit-button-li"
              >
                Extent Date
              </li>
            </ul>
          </div>
          {showPopup && <MinBid setOpenState={setShowPopup} />}
          {calendarPopup && <AdgroupEndDate setOpenState={setCalendarPopup} />}
          {showDialog && (
            <DialogBox
              title="Confirmation"
              buttonName="Accept"
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
