import { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../../../../utils/constants";
import { Headerbtn } from "../../../../../../common-components/headerButton/headerButton";
import { useSelector, useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../../../../../../redux/action-creator/commonAction";
import { _POST } from "../../../../../../../services/axios.method";
import "./../styles.css";
import ActionType from "../../../../../../../redux/types";
const KeywordActionHeader = ({ campaignSelection, setShowBulkPopup }) => {
  const [initiateAction, setInitiateAction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [selectedAction, setSelectedAction] = useState();
  const [budgetBlock, setBudgetBlock] = useState(false);

  const [block, setBlock] = useState(false);
  const [budget, setBudget] = useState("");
  const [budgetType, setBudgetType] = useState("total");
  const [budgetVariation, setBudgetVariation] = useState("increase");
  const [error, setError] = useState(false);
  let { totalCampaign } = useSelector((state) => state?.CampaignReducer);
  const { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);

  let keywordCount = selectedCheckBox?.keyword?.length;
  const selectionText = `${keywordCount} Keyword(s) selected: `;
  let currency = localStorage.getItem("currency");
  let { zeptoAccountId } = useSelector((state) => state?.CampaignReducer);

  const dispatch = useDispatch();

  const cancelButton = () => {
    setInitiateAction(false);
    setBudgetBlock(false);
    setBlock(false);
    setError(false);
    setBudget(false);
    campaignSelection(true);
  };

  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(0);
    }
  };

  const handleApplyButton = () => {
    let message;
    let set_value;

    const data = selectedCheckBox?.keyword?.map((data) => {
      if (selectedAction === "pause" || selectedAction === "enable") {
        message = `${selectedAction} keyword`;
      } else if (selectedAction === "set_bid") {
        const budgetWithoutCurrency = data?.bid
          ?.split(currency)[1]
          ?.replace(/,/g, "");
        const numericBudget = parseFloat(budgetWithoutCurrency);

        if (budgetType === "total") {
          message = `Set bid for keyword ${data.keyword} from ${data?.bid} to ${currency}${budget}`;
          set_value = parseFloat(budget);
        } else if (budgetType === "amount") {
          if (budgetVariation === "increase") {
            message = `Increase bid of keyword ${data?.keyword} from ${data?.bid} by ${currency}${budget}`;

            set_value = numericBudget + parseFloat(budget);
          } else {
            message = `Decrease bid of keyword ${data?.keyword} from ${data?.bid} by ${currency}${budget} `;
            set_value = numericBudget - parseFloat(budget);
          }
        } else if (budgetType === "percentage") {
          if (budgetVariation === "increase") {
            message = `Increase bid of keyword ${data?.keyword} from ${data?.bid} by ${budget}% `;
            set_value =
              numericBudget + (numericBudget * parseFloat(budget)) / 100;
          } else {
            message = `Decrease bid of keyword ${data?.keyword} from ${data?.bid} by ${budget}% `;
            set_value =
              numericBudget - (numericBudget * parseFloat(budget)) / 100;
          }
        }
      }

      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action_type: "keyword",
        action: selectedAction,
        action_message: message,
        media_type: "Zepto",
        action_status: 10,
        segment: data?.campaign_type,
        account: data?.account,
        is_search_only: data.is_search_only,
        account_id: zeptoAccountId,
        keyword_id: data.keyword_id,
        ...(selectedAction === "set_bid" && { set_value: set_value }),
        keywords: data.keyword,
        match_type: data.match_type
      };
    });
    if (selectedAction === "set_bid" && budgetType === "total" && budget < 8) {
      setError(`Min bid is ${currency}8`);
    } else {
      handleAction(data);
      setError(false);
    }
  };

  const handleAction = async (data) => {
    try {
      setLoading(true);

      const res = await _POST(RPA_ACTION_EDIT, data);
      setLoading(false);
      if (res?.status === 200) {
        dispatch(setToastMessageHandler(res?.data?.status?.message, true));
        dispatch({
          type: ActionType.RECALLCAMPAIGNPAPI,
          payload: true,
        });
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
      campaignSelection(true);
      setBlock(false);
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };
  const actionText = (text) => {
    let actionPhrase;
    setInitiateAction(!initiateAction);
    setBlock(true);
    switch (text) {
      case "enable":
        actionPhrase = `(${keywordCount} of ${totalCampaign} keyword(s) will be enabled)`;
        setSelectedAction("enable");
        break;
      case "pause":
        actionPhrase = `(${keywordCount} of ${totalCampaign} keyword(s) will be paused)`;
        setSelectedAction("pause");

        break;
    }
    let confirmationText = `Are you sure ${actionPhrase}?`;
    setConfirmationText(confirmationText);
  };

  const handleBudget = () => {
    setSelectedAction("set_bid");
    setBudgetBlock(true);
    setInitiateAction(!initiateAction);
  };

  const BudgetInput = ({ keywordCount }) => (
    <>
      <div className=" flex flex-row items-center pt-2 ">
        <p className="mr-1">{keywordCount} Selected:</p>
        <p className="mr-1">Change budget by</p>

        <select
          value={budgetType}
          onChange={(e) => setBudgetType(e.target.value)}
          className="zepto-select mr-1 "
        >
          <option className="p-2" value="total">
            Total
          </option>
          <option value={"amount"}>Amount</option>
          <option value={"percentage"}>Percentage</option>
        </select>

        <select
          className="zepto-select ml-1"
          value={budgetVariation}
          onChange={(e) => setBudgetVariation(e.target.value)}
          disabled={budgetType === "total" && true}
        >
          <option value={"increase"}>Increase</option>
          <option value={"decrease"}>Decrease</option>
        </select>
        <input
          type="number"
          className="border mx-1  h-8 rounded pl-2"
          autoFocus="autoFocus"
          value={budget}
          onChange={(e) => {
            handleNonNegativeInput(e, setBudget);
          }}
        />
        <button
          className={
            !budget || budget === undefined
              ? "cursor-not-allowed apply_btn_zepto_disable"
              : "apply_btn_zepto"
          }
          onClick={() => handleApplyButton()}
          disabled={(!budget || budget === undefined) && true}
        >
          {loading ? "In Progress" : "Apply"}
        </button>

        <button className="cancel_btn_zepto" onClick={() => cancelButton()}>
          Cancel
        </button>
        {error !== false && <p className="text-red-500 ml-2">{error}</p>}
      </div>
    </>
  );

  const Block = () => (
    <>
      <div className=" flex flex-row items-center pt-2 ">
        <img className="pr-1 " src="/assets/images/tickmark.svg" alt="tick" />
        <p className=""> {confirmationText} </p>

        <button className="apply_btn_zepto" onClick={() => handleApplyButton()}>
          {loading ? "In Progress" : "Apply"}
        </button>

        <button className="cancel_btn_zepto" onClick={() => cancelButton()}>
          Cancel
        </button>
      </div>
    </>
  );

  return (
    <>
      {!initiateAction && (
        <div className="flex items-center ">
          <p className="pt-5  ">{selectionText}</p>

          <Headerbtn
            title="Enable"
            onClick={() => {
                  if (keywordCount > 50) {
                    setShowBulkPopup(true);
                    return;
                  }
                  setSelectedAction("enable");
                  actionText("enable");
            }}
          />
          <Headerbtn
            title="Pause"
            onClick={() => {
                 if (keywordCount > 50) {
                  setShowBulkPopup(true);
                  return;
                 }
                  setSelectedAction("pause") 
                  actionText("pause");
            }}
          />
          <Headerbtn
            title="Set Bid"
            onClick={() => {
              if (keywordCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              handleBudget();
            }}
          />

          <img
            className="ml-4  cursor-pointer  px-3 py-2 mt-4 rounded shadow-sm hover:bg-[#3C006B] "
            onClick={() => campaignSelection(false)}
            src="/assets/images/x.svg"
          />
        </div>
      )}
      {block && (
        <>
          <Block />
        </>
      )}
      {budgetBlock && (
        <>
          <BudgetInput keywordCount={keywordCount} />
        </>
      )}
    </>
  );
};

export default KeywordActionHeader;
