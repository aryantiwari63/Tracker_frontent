import { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../../../utils/constants";
import { _POST } from "../../../../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../../redux/action-creator/commonAction";
import { useSelector, useDispatch } from "react-redux";
import DialogBox from "../../../../../common-components/dialogBox.js";
import ActionType from "../../../../../../redux/types";
import Popup from "../../../../../common-components/Popups/Popup";
import "./styles.css";

export const KeywordEdit = ({ setOpenState, editRef }) => {
  const [budget, setBudget] = useState(0);
  const [bidOption, setBidOption] = useState("");
  const [statusOption, setStatusOption] = useState("");
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [showDialog, setShowDialog] = useState(false);
  const ACTION_TYPE = "edit_keyword";
  // const ACTION = "set_budget";
  const dispatch = useDispatch();
  let currency = localStorage.getItem("currency");
  const [errorMessage, setErrorMessage] = useState(false);
  const [incrDecr, setIncrDecr] = useState(1);

  const handleBudgetChange = (inputValue) => {
    // Use a regular expression to keep only numeric characters and decimals
    const numericValue = inputValue.replace(/[^0-9.]/g, "");

    // Update the budget state with the filtered numeric value
    setBudget(numericValue);
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
    const data = selectedCheckBox?.keyword?.map((data) => {
      // const budgetWithoutCurrency = data?.budget
      //   ?.split("{currency}")[1]
      //   ?.replace(/,/g, "");
      // const numericBudget = parseFloat(budgetWithoutCurrency);
      let bid = parseFloat(data?.keyword_bid);
      let actionMessage;
      //   setBidOption("setBidByTotal");
      if (bidOption === "setBidByRs") {
        if (incrDecr === 1) {
          actionMessage = `Increase bid by ${currency}${budget}`;
          bid += parseFloat(budget);
        } else if (incrDecr === -1) {
          actionMessage = `Decrease bid by ${currency}${budget}`;
          bid -= parseFloat(budget);
        }
      } else if (bidOption === "setBidByPerc") {
        if (incrDecr === 1) {
          actionMessage = `Increase bid by ${budget}%`;
          bid += (bid * parseFloat(budget)) / 100;
        } else {
          actionMessage = `Decrease bid by ${budget}%`;
          bid -= (bid * parseFloat(budget)) / 100;
        }
      } else if (bidOption === "setBidByTotal") {
        actionMessage = `Set total bid as ${budget}`;
        bid = parseFloat(budget);
      }
      if (
        (bidOption === "setBidByTotal" ||
          bidOption === "setBidByRs" ||
          bidOption === "setBidByPerc") &&
        (statusOption === "ENABLED" || statusOption === "PAUSED")
      ) {
        return {
          campaign_id: [data?.campaign_id],
          campaign_name: [data.campaign_name],
          ad_group_id: data?.ad_group_id,
          ad_group_name: data?.ad_group_name,
          action: statusOption,
          action_type: ACTION_TYPE,
          media_type: "Amazon",
          campaign_type: data?.campaign_goal,
          action_message: actionMessage + ` and ${statusOption} Keyword`,
          profile_id: data?.profile_id,
          match_type: data?.match_type,
          keyword: data?.keyword_text,
          keyword_id: data?.keyword_id,
          bid: bid,
        };
      } else if (statusOption === "ENABLED" || statusOption === "PAUSED") {
        return {
          campaign_id: [data?.campaign_id],
          campaign_name: [data.campaign_name],
          ad_group_id: data?.ad_group_id,
          ad_group_name: data?.ad_group_name,
          action: statusOption,
          action_type: ACTION_TYPE,
          media_type: "Amazon",
          campaign_type: data?.campaign_goal,
          action_message: `${statusOption} Keyword`,
          profile_id: data?.profile_id,
          match_type: data?.match_type,
          keyword: data?.keyword_text,
          keyword_id: data?.keyword_id,
        };
      } else if (
        bidOption === "setBidByTotal" ||
        bidOption === "setBidByRs" ||
        bidOption === "setBidByPerc"
      ) {
        return {
          campaign_id: [data?.campaign_id],
          campaign_name: [data.campaign_name],
          ad_group_id: data?.ad_group_id,
          ad_group_name: data?.ad_group_name,
          action_type: ACTION_TYPE,
          media_type: "Amazon",
          campaign_type: data?.campaign_goal,
          action_message: actionMessage,
          profile_id: data?.profile_id,
          match_type: data?.match_type,
          keyword: data?.keyword_text,
          keyword_id: data?.keyword_id,
          bid: bid,
        };
      }
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
  return (
    <>
      <Popup
        setTempView={() => {}}
        ref={editRef}
        title="Edits"
        popup_id_container="rpa-container"
        popup_content="rpa_content"
        setShowPopup={setOpenState}
        platform="amazon"
        // applyAction={handleApplyButton}
        applyAction={() => {
          if (bidOption == "" && statusOption == "") {
            setErrorMessage(true);
            setShowDialog(false);
            return;
          }
          setShowDialog(true);
          // setOpenState(false);
        }}
      >
        <div className="w-full p-4">
          <div className="pb-1">
            <label className="">Status</label>
          </div>{" "}
          <div className="pb-1">
            <select
              className="w-1/4 h-8 rounded mb-2 px-4 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
              value={statusOption}
              onChange={(e) => {
                setStatusOption(e.target.value);
                setErrorMessage(false);
              }}
            >
              <option value="">Select</option>
              <option value="ENABLED">Enable</option>
              <option value="PAUSED">Pause</option>
            </select>
          </div>
          <div className="flex">
            {/* <label className="w-1/4 h-8 m-auto grid place-items-center"> */}
            <label className="flex items-center mr-2">Targeting Bid</label>
            <select
              className="w-1/4 h-8 rounded mb-2 px-4 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
              value={bidOption}
              onChange={(e) => {
                setBidOption(e.target.value);
                setErrorMessage(false);
              }}
            >
              <option value="">Select</option>
              <option value="setBidByPerc">By %</option>
              <option value="setBidByRs">By {currency}</option>
              <option value="setBidByTotal" onClick={() => setIncrDecr(1)}>
                By Total
              </option>
            </select>
            {/* <div> */}
            <button
              className="h-8 rounded px-1 border border-gray-300 mr-3 focus:border-blue-500 focus:outline-none grid place-items-center"
              onClick={() => setIncrDecr(1)}
            >
              <img src="/assets/images/up.svg" alt="" />
            </button>
            <button
              className="h-8 rounded px-1 border border-gray-300 mr-3 focus:border-blue-500 focus:outline-none grid place-items-center"
              onClick={() => setIncrDecr(-1)}
            >
              <img src="/assets/images/down.svg" alt="" />
            </button>
            <input
              className="w-1/3 h-8 rounded px-2 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
              type="text"
              placeholder="Enter Amount"
              value={budget}
              onChange={(e) => handleBudgetChange(e.target.value)}
            ></input>
          </div>
          {/* </div> */}
          {errorMessage == true && (
            <p className="text-red-500 text-[14px] mt-2">
              *Please select atleast one field.
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
          Are you sure you want to edit keyword?
        </DialogBox>
      )}
    </>
  );
};
