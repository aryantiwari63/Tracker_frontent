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

export const TargetingProductPopup = ({ setOpenState }) => {
  const [budget, setBudget] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [budgetOption, setBudgetOption] = useState("");
  const [value, setValue] = useState([]);
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [showDialog, setShowDialog] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [incrDecr, setIncrDecr] = useState(1);
  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  const ACTION_TYPE = "campaign";
  const ACTION = "set_budget";
  const dispatch = useDispatch();
  let currency = localStorage.getItem("currency");


  // eslint-disable-next-line no-unused-vars
  const [date, setDate] = useState("none");

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
      }
      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action: ACTION,
        action_type: ACTION_TYPE,

        set_value: numericBudget,
        action_message: actionMessage,
        media_type: "Amazon",
        action_status: 1,
        budget_amount: budget,
        profile_id: amazonProfile,
        segment: data?.campaign_type,
        end_date: date,
      };
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
        title="Edits: Targeting Product"
        popup_id_container="popup-container"
        popup_content="popup_content"
        setShowPopup={setOpenState}
        // applyAction={handleApplyButton}
        setTempView={() => {}}
        applyAction={() => {
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
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Add Keyword
                </label>
              </div>
              <div
                className="flex items-center w-full"
                style={{
                  overflowY: "auto",
                  maxWidth: "250px",
                  minWidth: "250px",
                }}
              >
                <Chips
                  value={value}
                  onChange={(e) => {
                    setValue(e.value);
                  }}
                />
              </div>
            </div>
            <div>
              <label className="w-1/4 h-8 m-auto grid place-items-center">
                Bid{" "}
              </label>
            </div>
            <div className="flex items-center w-full">
              <input
                className=" w-1/3 h-8 rounded px-2 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
                type="number"
                placeholder="Enter Amount"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="pb-1"></div> <div className="flex"></div>
          {/* </div> */}
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
          {incrDecr === 1
            ? "Are you sure you want to increase the budget of the campaigns?"
            : "Are you sure you want to decrease the budget of the campaigns?"}
        </DialogBox>
      )}
    </>
  );
};
