import Popup from "../../Popups/Popup";
import { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../utils/constants";
import { _POST } from "../../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../redux/action-creator/commonAction";
import { useSelector, useDispatch } from "react-redux";
import ActionType from "../../../../redux/types";
import { useEffect } from "react";

export const SetPlacement = ({ setOpenState }) => {
  const [placementBid, setPlacementBid] = useState(0);
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);

  const ACTION_TYPE = "placement";
  const ACTION = "set_placement";

  const dispatch = useDispatch();

  const handleAction = async (data) => {
    try {
      setLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setLoading(false);
      setOpenState(false);
      if (res?.status === 200) {
        dispatch(setToastMessageHandler("Action performed successfully", true));
      } else {
        if (selectedCheckBox.placement[0]?.min_bid) {
          dispatch(setToastMessageHandler("Min. bid is not available", false));
        } else {
          dispatch(setToastMessageHandler("Failed to perform action", false));
        }
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

  const handleApplyButton = () => {
    const data = selectedCheckBox?.placement?.map((data) => ({
      ad_group_id: data.ad_group_id,
      campaign_id: [data.campaign_id],
      campaign_name: [data.campaign_name],
      action: ACTION,
      action_type: ACTION_TYPE,
      segment: data.segment,
      placement_bid: placementBid,
      ad_group_name: data.ad_group_name,
      action_message: `Set placement bid to ${placementBid}`,
      account_id: data.account_id,
      platform_id: data.platform_id,
      min_bid: data.min_bid,
      placement_type: data.placement_type,
      action_status: 1,
      client_id: localStorage.getItem("client_id"),
      platform: data.platform,
      account: data.account,
    }));

    handleAction(data);
  };

  useEffect(() => {
    setPlacementBid(selectedCheckBox.placement[0].placement_bid);
  }, []);

  return (
    <>
      <Popup
        title="Set Placement"
        popup_id_container="popup-container"
        popup_content="popup_content"
        setShowPopup={setOpenState}
        applyAction={handleApplyButton}
        setTempView=""
      >
        <div className="w-full p-4">
          <div className="flex">
            <div className="mr-2 mt-1 pb-1">
              <label className="">Campaign : </label>
            </div>{" "}
            <div>
              <div className="mr-2 mt-1 pb-1">
                {selectedCheckBox.placement[0].campaign_name}
              </div>{" "}
            </div>
          </div>
          <div className="flex">
            <div className="mr-2 mt-1 pb-1">
              <label className="">Placement Name : </label>
            </div>{" "}
            <div>
              <div className="mr-2 mt-1 pb-1">
                {selectedCheckBox.placement[0]?.placement_type}
              </div>{" "}
            </div>
          </div>
          <div className="flex">
            <div className="mr-2 mt-1 pb-1">
              <label className="">AdGroup : </label>
            </div>{" "}
            <div>
              <div className="mr-2 mt-1 pb-1">
                {selectedCheckBox.placement[0].ad_group_name}
              </div>{" "}
            </div>
          </div>
          <div className="flex">
            <div className="mr-2 mt-1 pb-1">
              <label className="">Min Bid : </label>
            </div>{" "}
            <div>
              <div className="mr-2 mt-1 pb-1">
                {selectedCheckBox.placement[0]?.min_bid}
              </div>{" "}
            </div>
          </div>
          <div className="flex">
            <div className="mr-2 mt-1 pb-1">
              <label className="">Suggested bid : </label>
            </div>{" "}
            <div>
              <div className="mr-2 mt-1 pb-1">
                {selectedCheckBox.placement[0]?.suggested_bid}
              </div>{" "}
            </div>
          </div>
          <div className="mr-2 mt-2 pb-1">
            <label className="">Placement bid</label>
          </div>{" "}
          <div>
            <input
              className="w-full h-8 rounded px-2 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
              placeholder="Enter placement bid"
              type="number"
              value={placementBid}
              onChange={(e) => setPlacementBid(e.target.value)}
            ></input>
          </div>
        </div>
        <hr className="mt-6" />
      </Popup>
    </>
  );
};
