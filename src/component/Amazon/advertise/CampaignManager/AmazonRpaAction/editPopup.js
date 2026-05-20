import { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../../utils/constants";
import { _POST } from "../../../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../redux/action-creator/commonAction";
import { useSelector, useDispatch } from "react-redux";
import DialogBox from "../../../../common-components/dialogBox.js/index.js";
import ActionType from "../../../../../redux/types";
import Popup from "../../../../common-components/Popups/Popup";

export const EditPopup = ({ setOpenState }) => {
  const [budget, setBudget] = useState("");
  const [budgetOption, setBudgetOption] = useState("");
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [showDialog, setShowDialog] = useState(false);
  const [incrDecr, setIncrDecr] = useState(1);
  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  const ACTION_TYPE = "campaign";
  const dispatch = useDispatch();

  const [statusOption, setStatusOption] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  let currency = localStorage.getItem("currency");
  const [date, setDate] = useState("none");
  const onDateChange = (event) => {
    setErrorMessage(false);
    setDate(event.target.value);
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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
  const handleBudgetChange = (inputValue) => {
    // Use a regular expression to keep only numeric characters and decimals
    const numericValue = inputValue.replace(/[^0-9.]/g, "");

    // Update the budget state with the filtered numeric value
    setBudget(numericValue);
  };

  const handleApplyButton = () => {
    const data = selectedCheckBox?.campaign?.map((data) => {
      const budgetWithoutCurrency = data?.budget
        ?.split(currency)[1]
        ?.replace(/,/g, "");
      let numericBudget = parseFloat(budgetWithoutCurrency);
      let actionMessage;
      if (budgetOption === "setBudgetBy") {
        if (incrDecr === 1) {
          actionMessage = `Increase budget by ${currency}${budget}`;
          numericBudget += parseFloat(budget);
        } else if (incrDecr === -1) {
          actionMessage = `Decrease budget by ${currency}${budget}`;
          numericBudget -= parseFloat(budget);
        }
      } else if (budgetOption === "setPerc") {
        if (incrDecr === 1) {
          actionMessage = `Increase budget by ${budget}%`;
          numericBudget += (numericBudget * parseFloat(budget)) / 100;
        } else {
          actionMessage = `Decrease budget by ${budget}%`;
          numericBudget -= (numericBudget * parseFloat(budget)) / 100;
        }
      } else if (budgetOption === "setBudgetTotal") {
        actionMessage = `Set Total Budget equal to ${budget}`;
        numericBudget = parseFloat(budget);
      } else {
        actionMessage = `${statusOption} Campaign`;
      }
      if (
        (statusOption === "enable" || statusOption === "pause") &&
        (budgetOption === "setPerc" ||
          budgetOption === "setBudgetBy" ||
          budgetOption === "setBudgetTotal") &&
        !(date === "none")
      ) {
        return {
          campaign_id: [data?.campaign_id],
          campaign_name: [data.campaign_name],
          action: statusOption,
          action_type: ACTION_TYPE,

          set_value: numericBudget,
          action_message:
            actionMessage +
            ` and ${statusOption} campaign and end date is ${date}`,
          media_type: "Amazon",
          action_status: 1,
          budget_amount: budget,
          profile_id: amazonProfile,
          campaign_type: data?.campaign_type,
          end_date: date,
        };
      } else if (
        (statusOption === "enable" || statusOption === "pause") &&
        (budgetOption === "setPerc" ||
          budgetOption === "setBudgetBy" ||
          budgetOption === "setBudgetTotal")
      ) {
        return {
          campaign_id: [data?.campaign_id],
          campaign_name: [data.campaign_name],
          action: statusOption,
          action_type: ACTION_TYPE,

          set_value: numericBudget,
          action_message: actionMessage + ` and ${statusOption} campaign`,
          media_type: "Amazon",
          action_status: 1,
          budget_amount: budget,
          profile_id: amazonProfile,
          campaign_type: data?.campaign_type,
        };
      } else if (
        (statusOption === "enable" || statusOption === "pause") &&
        !(date === "none")
      ) {
        return {
          campaign_id: [data?.campaign_id],
          campaign_name: [data.campaign_name],
          action: statusOption,
          action_type: ACTION_TYPE,

          action_message: `${statusOption} campaign and end date is ${date}`,
          media_type: "Amazon",
          action_status: 1,
          profile_id: amazonProfile,
          campaign_type: data?.campaign_type,
          end_date: date,
        };
      } else if (
        (budgetOption === "setPerc" ||
          budgetOption === "setBudgetBy" ||
          budgetOption === "setBudgetTotal") &&
        !(date === "none")
      ) {
        return {
          campaign_id: [data?.campaign_id],
          campaign_name: [data.campaign_name],
          action_type: ACTION_TYPE,

          set_value: numericBudget,
          action_message: actionMessage + ` and end date is ${date}`,
          media_type: "Amazon",
          action_status: 1,
          budget_amount: budget,
          profile_id: amazonProfile,
          campaign_type: data?.campaign_type,
          end_date: date,
        };
      } else if (statusOption === "enable" || statusOption === "pause") {
        return {
          campaign_id: [data?.campaign_id],
          campaign_name: [data.campaign_name],
          action: statusOption,
          action_type: ACTION_TYPE,

          action_message: `${statusOption} campaign`,
          media_type: "Amazon",
          action_status: 1,
          profile_id: amazonProfile,
          campaign_type: data?.campaign_type,
        };
      } else if (
        budgetOption === "setPerc" ||
        budgetOption === "setBudgetBy" ||
        budgetOption === "setBudgetTotal"
      ) {
        return {
          campaign_id: [data?.campaign_id],
          campaign_name: [data.campaign_name],
          action_type: ACTION_TYPE,

          set_value: numericBudget,
          action_message: actionMessage,
          media_type: "Amazon",
          action_status: 1,
          budget_amount: budget,
          profile_id: amazonProfile,
          campaign_type: data?.campaign_type,
        };
      } else if (!(date === "none")) {
        return {
          campaign_id: [data?.campaign_id],
          campaign_name: [data.campaign_name],
          action_type: ACTION_TYPE,

          action_message: `End date is ${date}`,
          media_type: "Amazon",
          action_status: 1,
          profile_id: amazonProfile,
          campaign_type: data?.campaign_type,
          end_date: date,
        };
      }
    });

    handleAction(data);
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
    // dispatch({
    //   type: ActionType.CHECKBOX,
    //   payload: [],
    // });
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
        title="Edits: Campaign"
        popup_id_container="popup-container"
        popup_content="popup_content"
        setShowPopup={setOpenState}
        platform="amazon"
        setTempView={() => {}}
        // applyAction={handleApplyButton}
        applyAction={() => {
          if (
            (budgetOption == "" || budget == "") &&
            statusOption == "" &&
            date == "none"
          ) {
            setErrorMessage(true);
            setShowDialog(false);
            return;
          }
          setShowDialog(true);
          // setOpenState(false);
        }}
      >
        <div className="w-full p-4">
          <div className="flex w-full">
            <div className="w-1/2">
              <div className="pb-1">
                <label className="">Status</label>
              </div>{" "}
              <div className="pb-1 w-full pr-4">
                <select
                  className="w-full h-8 rounded mb-2 px-4 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
                  value={statusOption}
                  onChange={(e) => {
                    setStatusOption(e.target.value);
                    setErrorMessage(false);
                  }}
                >
                  <option value="">Select</option>
                  <option value="enable">Enable</option>
                  <option value="pause">Pause</option>
                </select>
              </div>
            </div>

            {/* <div>
              
            </div> */}
            <div className="w-1/2 pl-4 pr-3">
              <label className="" htmlFor="">
                Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  // style={dateStyle}
                  className="w-full border h-8 pl-2 rounded border-gray-300  focus:border-blue-500 focus:outline-none"
                  value={date}
                  onChange={onDateChange}
                  min={getCurrentDate()}
                />
              </div>
            </div>
          </div>
          <div className="pb-1"></div>{" "}
          <div className="flex">
            <label className="mr-2">Campaign Budget </label>
            <select
              className="w-[195px] h-8 rounded mb-2 px-4 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
              value={budgetOption}
              onChange={(e) => {
                setBudgetOption(e.target.value);
                setErrorMessage(false);
              }}
            >
              <option value="">Select</option>
              <option value="setPerc">By %</option>
              <option value="setBudgetBy">By {currency}</option>
              <option value="setBudgetTotal">Total</option>
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
          Are you sure you want edit the campaigns?
        </DialogBox>
      )}
    </>
  );
};
