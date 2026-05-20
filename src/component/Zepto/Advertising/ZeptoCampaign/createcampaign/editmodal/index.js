import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../../redux/action-creator/commonAction";
import { RPA_ACTION_EDIT } from "../../../../../../utils/constants";
import { _POST } from "../../../../../../services/axios.method";
import DialogBox from "../../../../../common-components/dialogBox.js";
import ActionType from "../../../../../../redux/types";
import { ZeptoSetBudget } from "./ZeptoSetBudget";

const EditModal = ({ op, editRef }) => {
  const [showPopup, setShowPopup] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showDropDown, setShowDropDown] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [actionName, setActionName] = useState("");
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);

  const dispatch = useDispatch();
  const ACTION_TYPE = "campaign";

  const createPayload = (action) => {
    const data = selectedCheckBox?.campaign?.map((data) => ({
      campaign_name: [data?.campaign_name],
      campaign_id: [data?.campaign_id],
      action,
      action_type: ACTION_TYPE,
      set_value: null,
      action_message: `${action} campaign`,
      media_type: "Zepto",
      action_status: 1,
      account: data?.account,
      segment: data?.campaign_type,
      client_id: localStorage.getItem("client_id"),
     
    }));
    handleAction(data);
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
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
    } catch (error) {
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
      {op == true && (
        <div className="relative " ref={editRef}>
          {showDropDown && (
            <div className=" rounded mt-2 py-4 px-4 drop-shadow-md card bg-white w-max absolute  z-[100] ">
              <ul className="edit-button ">
                <li
                  onClick={(e) => handleClick(e, "enable")}
                  className="edit-button-li hover:bg-[#3c006b]"
                >
                  Enable
                </li>
                <li
                  onClick={(e) => handleClick(e, "pause")}
                  className="edit-button-li hover:bg-[#3c006b]"
                >
                  Pause
                </li>
                <li
                  onClick={() => {
                    setShowPopup(!showPopup);
                    // setShowDropDown(false);
                  }}
                  className="edit-button-li hover:bg-[#3c006b]"
                >
                  Set Budget
                </li>
              </ul>
            </div>
          )}
          {showPopup && <ZeptoSetBudget setOpenState={setShowPopup} />}

          {showDialog && (
            <DialogBox
              buttonName="Accept"
              title="Confirmation"
              onAccept={handleDialogApply}
              onCancel={handleDialogCancel}
              platform="zepto"
            >
              Are you sure you want to {actionName} the status of selected
              records?
            </DialogBox>
          )}
        </div>
      )}
    </>
  );
  // return (
  //   <>
  //     <Popup
  //       title="Edits"
  //       setShowPopup ={setShowPopup}
  //       setOpenState={setShowPopup}
  //       platform="blinkit"
  //     >
  //       <EditModalForm />
  //     </Popup>
  //   </>
  // );
};

export default EditModal;
