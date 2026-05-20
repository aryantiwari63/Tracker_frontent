import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DialogBox from "../dialogBox.js";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import { _POST } from "../../../services/axios.method";
import { RPA_ACTION_EDIT } from "../../../utils/constants";
import ActionType from "../../../redux/types.js";

export const KeywordEdit = ({ op, editRef }) => {
  const [showDialog, setShowDialog] = useState(false);
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [errorPopUp, setErrorPopUp] = useState(false);

  const dispatch = useDispatch();
  const ACTION_TYPE = "keyword";
  const ACTION = "remove_keyword";

  let campaignName = [];
  let keywordsList = [];

  campaignName = selectedCheckBox.campaign?.map((item) => item.campaign_name);
  keywordsList = selectedCheckBox.keyword?.map((item) => item.keyword);
  // keywordsList = selectedCheckBox.keyword?.map((item) => item.id.keyword);

  const deleteKeywordPayload = () => {
    let campaignIds = [];
    let campaignNames = [];
    campaignIds = selectedCheckBox.campaign?.map((item) => item.campaign_id);
    campaignNames = selectedCheckBox.campaign.map((item) => item.campaign_name);
const platform = selectedCheckBox?.campaign[0]?.platform;
    const platform_id = selectedCheckBox?.campaign[0]?.platform_id;
    const account_id = selectedCheckBox?.campaign[0]?.account_id;
    const account = selectedCheckBox?.campaign[0]?.account;

    const data = selectedCheckBox.keyword?.map((data) => ({
      campaign_id: campaignIds,
      campaign_name: campaignNames,
      ad_group_id: data.ad_group_id,
      action: ACTION,
      action_type: ACTION_TYPE,
      segment: data.segment,
      account_id: account_id,
      account: account,
      platform_id: platform_id,
      action_message: `remove keyword`,
      action_status: 1,

      [data.keyword_match_type === "EXACT"
        ? "exact_keyword"
        : "broard_keyword"]: data?.keyword,

      client_id: localStorage.getItem("client_id"),
      platform: platform,
    }));
    deleteKeywordAPI(data);
    setShowDialog(false);
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  };

  const deleteKeywordAPI = async (data) => {
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
      console.error(error);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleDeleteKeyword = () => {
    if (
      selectedCheckBox?.campaign?.length === 0 ||
      selectedCheckBox?.campaign?.length === undefined
    ) {
      setErrorPopUp(true);
    } else {
      setShowDialog(!showDialog);
    }
  };

  return (
    <>
      {op === true && (
        <div className="relative" ref={editRef}>
          <div className=" rounded mt-2 py-4 px-4 drop-shadow-md card bg-white w-max absolute  z-[100] right-[120px]">
            <ul className="edit-button">
              <li
                className="edit-button-li"
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
              {keywordsList?.map((data, i) => (
                <div key={i} className="font-semibold">
                  {data}
                </div>
              ))}{" "}
              from the campaigns:{" "}
              {campaignName?.map((data, i) => (
                <div key={i} className="font-semibold text-[12px]">
                  {data}
                </div>
              ))}
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
