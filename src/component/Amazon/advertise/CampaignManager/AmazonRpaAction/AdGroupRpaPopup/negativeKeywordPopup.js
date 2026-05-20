import { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../../../utils/constants";
import { Chips } from "primereact/chips";
import { _POST } from "../../../../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../../redux/action-creator/commonAction";
import { useSelector, useDispatch } from "react-redux";
import DialogBox from "../../../../../common-components/dialogBox.js";
import ActionType from "../../../../../../redux/types";
import Popup from "../../../../../common-components/Popups/Popup";

export const NegativeKeywordPopup = ({ setOpenState }) => {
  const [value, setValue] = useState([]);
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [showDialog, setShowDialog] = useState(false);
  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  const ACTION_TYPE = "adgroup";
  const dispatch = useDispatch();
  const [matchType, setMatchType] = useState("");
  let accountName = localStorage.getItem("savedAccounts");
  let val = JSON.parse(accountName);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleMatchTypeChange = (type) => {
    setMatchType(type);
  };

  const handleAction = async (data) => {
    try {
      setLoading(true);

      const res = await _POST(RPA_ACTION_EDIT, data);
      setLoading(false);
      setOpenState(false);
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
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleApplyButton = () => {
    const data = selectedCheckBox?.adgroup?.flatMap((data) => {
      return value.flatMap((keyword) => {
        let actionMessage = `Set Negative Keyword ${keyword} with Match Type ${matchType}`;
        return {
          campaign_id: [data?.campaign_id],
          ad_group_id: data?.ad_group_id,
          campaign_name: [data.campaign_name],
          ad_group_name: data.ad_group_name,
          action: "negative_keyword",
          action_type: ACTION_TYPE,
          state: data.ad_status || 'enable',
          keywords: keyword,
          match_type: matchType,

          // set_value:numericBudget,
          action_message: actionMessage,
          media_type: "Amazon",
          action_status: 10,
          profile_id: amazonProfile,
          segment: data?.campaign_type,
          account_id: amazonProfile,
          account: val[0],
        };
      });
    });

    handleAction(data);
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
    handleApplyButton();
  };
  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  // useEffect(() => {}, [onEditButtonClick]);
  return (
    <>
      <Popup
        title="Edits: Negative Keyword"
        popup_id_container="rpa-container"
        popup_content="rpa_content"
        setShowPopup={setOpenState}
        platform="amazon"
        // applyAction={handleApplyButton}
        applyAction={() => {
          if (value.length < 1 || matchType === "") {
            setErrorMessage(true);
            setShowDialog(false);
            return;
          }
          setShowDialog(true);
          // setOpenState(false);
        }}
      >
        <div className="w-full p-4">
          <div className=" flex  justify-between">
            <div className="campaign-name-wrap">
              <div className="flex items-center mr-4 mb-2">
                <label
                  htmlFor="inline-radio"
                  className="ml-2 text-sm font-medium text-black "
                >
                  Add Keyword
                </label>
              </div>
              <div
                //  className="items-center"
                style={{
                  overflowY: "auto",
                  maxWidth: "250px",
                  minWidth: "250px",
                  minHeight: "20px",
                  maxHeight: "50px",
                }}
              >
                <Chips
                  value={value}
                  onChange={(e) => {
                    setValue(e.value);
                  }}
                  separator=","
                />
              </div>
            </div>

            <div>
              <label key="exact">
                <label className="pr-2">Exact</label>
              </label>
              <div className="mt-2">
                <input
                  type="radio"
                  name="searchType" // Use the same name for both radio buttons
                  value="negative_exact" // Set a value for the "Exact" option
                  className="align-middle"
                  onChange={() => handleMatchTypeChange("NEGATIVE_EXACT")}
                  checked={matchType === "NEGATIVE_EXACT"}
                />
              </div>
            </div>

            <div>
              <label key="phrase">
                <label className="pr-2">Phrase</label>
              </label>
              <div className="mt-2">
                <input
                  type="radio"
                  name="searchType" // Use the same name for both radio buttons
                  value="negative_phrase" // Set a value for the "Phrase" option
                  className="align-middle"
                  onChange={() => handleMatchTypeChange("NEGATIVE_PHRASE")}
                  checked={matchType === "NEGATIVE_PHRASE"}
                />
              </div>
            </div>
          </div>
          <div className="pb-1"></div> <div className="flex"></div>
          {/* </div> */}
          {errorMessage == true && (
            <p className="text-red-500 text-[14px] mt-2">
              *Please select all field.
            </p>
          )}
        </div>
        <hr className="mt-6" />
      </Popup>
      {showDialog && (
        <DialogBox
          buttonName="Accept"
          title="Confirmation"
          onAccept={handleDialogApply}
          onCancel={handleDialogCancel}
          platform={"blinkit"}
        >
          Are you sure you want to add negative keyword?
        </DialogBox>
      )}
    </>
  );
};
