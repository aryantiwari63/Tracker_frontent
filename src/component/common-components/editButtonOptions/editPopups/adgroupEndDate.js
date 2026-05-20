import React, { useState, useEffect } from "react";
import Popup from "../../Popups/Popup";
import { useSelector } from "react-redux";
import ActionType from "../../../../redux/types";
import { _POST } from "../../../../services/axios.method";
import { RPA_ACTION_EDIT, FLIPKART_ADGROUP_LEVEL_ABORT_LIST } from "../../../../utils/constants";
import { useDispatch } from "react-redux";

import DialogBox from "../../dialogBox.js";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../redux/action-creator/commonAction";

export const AdgroupEndDate = ({ setOpenState }) => {
  const [selectedDate, setSelectedDate] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [adGroup, setAdgroup] = useState([]);
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  let [error, setError] = useState(false);

  const ACTION_TYPE = "adgroup";
  const ACTION = "set_end_date";
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
    const data = selectedCheckBox?.adgroup?.map((data) => {
      return {
        campaign_id: [data.campaign_id],
        campaign_name: [data.campaign_name],
        ad_group_id: data.ad_group_id,
        ad_group_name: data.ad_group_name,
        action: ACTION,
        action_type: ACTION_TYPE,
        segment: data.segment,
        platform: data.platform,
        end_date: selectedDate.split("T").join(" "),
        action_status: 1,
        action_message: `Change the end date of the adgroup to ${selectedDate.split("T").join(" ")}`,
        account_id: data.account_id,
        account: data.account,
        client_id: localStorage.getItem("client_id"),
        platform_id: data.platform_id,
      };
    });
    handleAction(data);
  };

  const handleAction = async (data) => {
    try {
      setLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setLoading(false);
      if (res.status === 200) {
        dispatch(setToastMessageHandler("End date updated successfully", true));
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }

      dispatch({
        type: ActionType.CHECKBOX,
        payload: [],
      });
    } catch (error) {
      console.error(error);
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

  const getAdGroupList = async () => {
    const ad_group_ids = selectedCheckBox?.adgroup?.map((item) => item.ad_group_id)
    const res = await _POST(FLIPKART_ADGROUP_LEVEL_ABORT_LIST, { ad_group_ids })
    setAdgroup(res.data.data.data)
  }



  useEffect(() => {
    getAdGroupList()
  }, [])


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
        title="Edit End Date"
        popup_id_container="popup-container"
        popup_content="popup_content"
        setShowPopup={setOpenState}
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
            style: `${adGroup.length > 0 ? "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed" : "text-white"} border`,
            disabled: adGroup.length > 0
          },
        ]}
      >
        <div className="">
          <span className="w-full p-4">Update AdGroup end date</span>
          <input
            className="w-[50%] border pl-2 py-1"
            type="datetime-local"
            value={selectedDate}
            min={getTodayDate()}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {error && <p className="px-4 text-red-500">*Please provide end date</p>}

          {adGroup.length > 0 && <div className="p-4"> <p className="text-red-500">*Following ad groups have aborted status please unselect to continue</p>
            <ol className="mt-2 list-disc ml-5">
              {adGroup.map((item, key) => <li key={key}>
                {item.ad_group_name}
              </li>)}
            </ol>

          </div>}
        </div>
      </Popup>
      {showDialog === true && (
        <DialogBox
          buttonName="Accept"
          title="Confirmation"
          onAccept={handleDialogApply}
          onCancel={handleDialogCancel}
        >
          Are you sure you want to change the end date of the AdGroup?
        </DialogBox>
      )}
    </>
  );
};
