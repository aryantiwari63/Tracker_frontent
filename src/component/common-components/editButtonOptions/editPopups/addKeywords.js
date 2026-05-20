import Popup from "../../Popups/Popup";
import { RPA_ACTION_EDIT } from "../../../../utils/constants";
import { _POST } from "../../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../redux/action-creator/commonAction";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export const AddKeywords = ({ setOpenState }) => {
  const [matchType, setMatchType] = useState("exact");
  const [keywords, setKeywords] = useState("");

  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);

  const dispatch = useDispatch();
  const ACTION_TYPE = "keyword";
  const ACTION = "add_keyword";

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
      console.error(error);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleApplyButton = () => {
    let campaignIds = [];
    let campaignNames = [];
    campaignIds = selectedCheckBox.campaign.map((item) => item.campaign_id);
    campaignNames = selectedCheckBox.campaign.map((item) => item.campaign_name);
    const platform_id = selectedCheckBox.campaign[0].platform_id;
    const platform = selectedCheckBox.campaign[0].platform;
    const account_id = selectedCheckBox.campaign[0].account_id;
    const account = selectedCheckBox.campaign[0].account;
    const segment = selectedCheckBox.campaign[0].segment;
    const keywordField =
      matchType === "exact" ? "exact_keyword" : "broad_keyword";

    const data = [
      {
        campaign_id: campaignIds,
        campaign_name: campaignNames,
        account_id: account_id,
        segment: segment,
        [keywordField]: keywords,
        platform_id: platform_id,
        action_type: ACTION_TYPE,
        action: ACTION,
        action_message: `add keyword`,
        action_status: 1,
        client_id: localStorage.getItem("client_id"),
        account: account,
        platform: platform,
      },
    ];

    handleAction(data);
    setOpenState(false);
  };

  return (
    <>
      <Popup
        title="Add Keyword"
        popup_id_container="popup-container"
        popup_content="popup_content"
        setShowPopup={setOpenState}
        applyAction={handleApplyButton}
      >
        <div className="w-full p-4">
          <div className="pb-1">
            <label className="">Keyword Match Type</label>
          </div>{" "}
          <div className="">
            <select
              className="w-full h-8 rounded mb-2 px-4 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
              value={matchType}
              onChange={(e) => setMatchType(e.target.value)}
            >
              <option value="exact">EXACT</option>
              <option value="broad">BROAD</option>
            </select>
          </div>
          <div className="pb-1">
            <label className="">Keyword</label>
          </div>{" "}
          <div className="">
            <input
              className="w-full h-8 rounded px-2 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
              placeholder="Enter keyword"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            ></input>
          </div>
        </div>
        <hr className="mt-6" />
      </Popup>
    </>
  );
};
