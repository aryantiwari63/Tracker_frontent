import React, { useState } from "react";
import Popup from "../../../../../common-components/Popups/Popup";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../../redux/action-creator/commonAction";
import DialogBox from "../../../../../common-components/dialogBox.js";
import { useDispatch, useSelector } from "react-redux";
import ActionType from "../../../../../../redux/types";
import { _POST } from "../../../../../../services/axios.method";
import { RPA_ACTION_EDIT } from "../../../../../../utils/constants";

export const EditDateModal = ({ setOpenState }) => {
  const [selectedDate, setSelectedDate] = useState();
  const [showDialog, setShowDialog] = useState(false);

  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  let [error, setError] = useState(false);

  const ACTION_TYPE = "campaign_action";
  const ACTION = "extend_end_date";
  const dispatch = useDispatch();

  const handleDialogApply = () => {
    setShowDialog(false);
    handleApplyButton();
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  };

  const handleApplyButton = () => {
    const filteredData = selectedCheckBox?.campaign?.filter(
      (data) => data?.status === "LIVE"
    );
    const data = filteredData.map((data) => {
      return {
        campaign_id: [data.campaign_id],
        campaign_name: [data.campaign_name],
        action: ACTION,
        action_type: ACTION_TYPE,
        // segment: data.segment,
        // platform: data.platform,
        end_date: selectedDate.split("T").join(" "),
        action_status: 10,
        action_message: `Change the end date of the campaign to ${selectedDate
          .split("T")
          .join(" ")}`,
        account_id: data.account_id || "",
        media_type: "Instamart",
        account: data.account,
        client_id: localStorage.getItem("client_id"),
        // platform_id: data.platform_id,
      };
    });

    handleAction(data);
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  };
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
  const handleDialog = () => {
    // Check for the condition here
    if (selectedDate == undefined) {
      setError(true);
      // Throw an error or display a message here
      console.error("Please provide an end date");
      return;
    }
    setError(false);
    setShowDialog(true);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return (
    <>
      <Popup
        platform="instamart"
        title="Edit End Date "
        popup_id_container="popup-container"
        popup_content="popup_content"
        setShowPopup={setOpenState}
        setTempView={() => {}}
        applyAction={handleDialog}
        cutomButton={[
          {
            handleClick: () => setOpenState(false),
            label: "Cancel",
            style: "bg-white text-black border",
          },
          {
            handleClick: () => handleDialog(),
            label: "Apply",
          },
        ]}
      >
        <div className="">
          <span className="w-full p-4">Update campaign end date</span>
          <input
            className="w-[50%] border pl-2 py-1"
            type="date"
            value={selectedDate}
            min={getTodayDate()}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {error && (
            <p className="px-4 text-red-500">*Please provide end date</p>
          )}
        </div>
        {showDialog === true && (
          <DialogBox
            buttonName="Accept"
            title="Confirmation"
            onAccept={handleDialogApply}
            onCancel={handleDialogCancel}
            platform="instamart"
          >
            Are you sure you want to change the end date of the campaigns?
          </DialogBox>
        )}
      </Popup>
    </>
  );
};
