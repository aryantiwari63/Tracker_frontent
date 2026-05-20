import Popup from "../../../../../common-components/Popups/Popup";
import { RPA_ACTION_EDIT } from "../../../../../../utils/constants";
import { _POST } from "../../../../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../../redux/action-creator/commonAction";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const AddKeywords = ({ setOpenState }) => {
  const [matchType, setMatchType] = useState("exact");
  const [keywords, setKeywords] = useState("");
  const [bid, setBid] = useState();
  const [error, setError] = useState(false);
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
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleApplyButton = () => {
    let campaignIds = [];
    let campaignNames = [];
    let match_type;

    switch (matchType) {
      case "exact":
        match_type = "exact_keyword";
        break;
      case "broad":
        match_type = "broad_keyword";
        break;
      default:
        match_type = "phrase_keyword";
        break;
    }
    campaignIds = selectedCheckBox.campaign.map((item) => item.campaign_id);
    campaignNames = selectedCheckBox.campaign.map((item) => item.campaign_name);
    const platform_id = selectedCheckBox.campaign[0].platform_id;
    const account = selectedCheckBox.campaign[0].account;
    const segment = selectedCheckBox.campaign[0].campaign_type;
    const is_search_only = selectedCheckBox.campaign[0].is_search_only;
    // const keywordField = match_type;

    const data = [
      {
        campaign_id: campaignIds,
        campaign_name: campaignNames,
        account: account,
        segment: segment,
        [match_type]: keywords,
        platform_id: platform_id,
        action_type: ACTION_TYPE,
        action: ACTION,
        action_message: `add keyword`,
        media_type: "Zepto",
        client_id: localStorage.getItem("client_id"),
        action_status: 1,
        is_search_only: is_search_only,
        min_bid: bid,
      },
    ];

    if (bid < 8) {
      setError("Enter bid greater than 7");
      setOpenState(true);
    } else {
      handleAction(data);

      setOpenState(false);
      setError(false);
    }
  };

  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(8);
    }
  };
  return (
    <>
      <Popup
        title="Add Keyword"
        popup_id_container="popup-container"
        popup_content="popup_content"
        setShowPopup={setOpenState}
        applyAction={handleApplyButton}
        platform="zepto"
        setTempView={() => {}}
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
              <option value="phrase">PHRASE</option>
            </select>
          </div>
          <div className="pb-1">
            <label className="">Keyword</label>
          </div>{" "}
          <div className="">
            <input
              className="w-full h-8 rounded  mb-2 px-2 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
              placeholder="Enter keyword"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            ></input>
          </div>
          <div className="pb-1">
            <label>Enter bid</label>
          </div>
          <div>
            <input
              type="number"
              onChange={(e) => handleNonNegativeInput(e, setBid)}
              value={bid}
              className="w-full h-8 rounded px-2 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
              style={{
                width: "100%",
                padding: "5px",
                marginRight: "10px",
              }}
            />
          </div>
        </div>
        {error ? <p className="errorText ml-4">{error}</p> : null}
        <hr className="mt-6" />
      </Popup>
    </>
  );
};
export default AddKeywords;
