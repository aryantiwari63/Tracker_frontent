import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../../redux/action-creator/commonAction";
import { RPA_ACTION_EDIT } from "../../../../../../utils/constants";
import { _POST } from "../../../../../../services/axios.method";
import DialogBox from "../../../../../common-components/dialogBox.js";
import { useSelector } from "react-redux";
import ActionType from "../../../../../../redux/types";

export const KeywordEditModal = ({ op, editRef }) => {
  // eslint-disable-next-line no-unused-vars
  const [showPopup, setShowPopup] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [actionName, setActionName] = useState("");

  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);

  const dispatch = useDispatch();
  const ACTION_TYPE = "keyword";
  const ACTION = "remove_keyword";
  let keywordsList = [];

  let campaignName = [];
  // let keywordsList = [];

  campaignName = selectedCheckBox?.keyword?.map((item) => item.campaign_name);
  keywordsList = selectedCheckBox?.keyword?.map((item) => item.keyword);
  const account = selectedCheckBox?.keyword[0]?.account;

  const deleteKeywordPayload = () => {
    const data = selectedCheckBox?.keyword?.map((data) => ({
      campaign_name: [data?.campaign_name],
      campaign_id: [data?.campaign_id],
      action: ACTION,
      action_type: ACTION_TYPE,
      action_message: `remove keyword`,
      exclude_keyword: data?.keyword,
      media_type: "Zepto",
      action_status: 1,
      client_id: localStorage.getItem("client_id"),
      account: account,
      segment: data?.campaign_type,
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

  //   const handleDialogApply = () => {
  //     setShowDialog(false);
  //     createPayload(actionName);
  //   };

  const handleDeleteKeyword = () => {
    setShowDialog(!showDialog);
  };

  return (
    <>
      <>
        {op === true && (
          <div className="relative" ref={editRef}>
            <div className=" rounded mt-2 py-4 px-4 drop-shadow-md card bg-white w-max absolute  z-[100] ">
              <ul className="edit-button">
                <li
                  className="edit-button-li hover:bg-[#3c006b]"
                  onClick={() => handleDeleteKeyword()}
                >
                  Delete Keyword
                </li>
              </ul>
            </div>
            {showDialog && (
              <DialogBox
                buttonName="Accept"
                title="Confirmation"
                onAccept={deleteKeywordPayload}
                onCancel={() => setShowDialog(false)}
              >
                Are you sure you want to remove the keywords:{" "}
                {keywordsList?.map((data, key) => (
                  <div key={key} className="font-semibold">
                    {data}
                  </div>
                ))}{" "}
                from the campaigns:{" "}
                {campaignName?.map((data, key) => (
                  <div key={key} className="font-semibold text-[12px]">
                    {data}
                  </div>
                ))}
              </DialogBox>
            )}

            {/* {errorPopUp && (
              <DialogBox
                buttonName="OK"
                title="Error"
                onAccept={() => setErrorPopUp(false)}
              >
                Select atleast one campaign from Campaign tab
              </DialogBox>
            )} */}
          </div>
        )}
      </>
    </>
  );
};
