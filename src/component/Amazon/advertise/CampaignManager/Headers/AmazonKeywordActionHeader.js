import { useState } from "react";
import ActionType from "../../../../../redux/types";
import { setToastMessageHandler } from "../../../../../redux/action-creator/commonAction";
import { useDispatch, useSelector } from "react-redux";
import { _POST } from "../../../../../services/axios.method";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import { RPA_ACTION_EDIT } from "../../../../../utils/constants";
import DialogBox from "../../../../common-components/dialogBox.js";

const AmazonKeywordActionHeader = (
  { keywordCount, campaignSelection, tabName }
  // selectedCheckBox
) => {
  const [initiateAction, setInitiateAction] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [selectedAction, setSelectedAction] = useState();
  const [budgetBlock, setBudgetBlock] = useState(false);
  const [block, setBlock] = useState(false);
  const [budget, setBudget] = useState("");
  const [budgetType, setBudgetType] = useState("total");
  const [budgetVariation, setBudgetVariation] = useState("increase");
  const [loading, setLoading] = useState(false);
  const [showBulkPopup, setShowBulkPopup] = useState(false);
  // const [error, setError] = useState(false);

  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  let { totalKeywords, selectedCheckBox } = useSelector(
    (state) => state?.CampaignReducer
  );
  let accountName = localStorage.getItem("savedAccounts");
  let val = JSON.parse(accountName);

  const selectionText = `${keywordCount} keyword(s) selected: `;
  let currency = localStorage.getItem("currency");
  const dispatch = useDispatch();

  const actionText = (text) => {
    let actionPhrase;
    setInitiateAction(!initiateAction);
    setBlock(true);
    switch (text) {
      case "enable":
        actionPhrase = `(${keywordCount} of ${totalKeywords} keyword(s) will be enabled)`;
        setSelectedAction("enable");
        break;
      case "pause":
        actionPhrase = `(${keywordCount} of ${totalKeywords} keyword(s) will be paused)`;
        setSelectedAction("pause");

        break;
    }
    let confirmationText = `Are you sure ${actionPhrase}?`;
    setConfirmationText(confirmationText);
  };

  const cancelButton = () => {
    setInitiateAction(false);
    setBudgetBlock(false);
    setBlock(false);
    setBudget("");
  };

  const handleBudget = () => {
    setSelectedAction("bid");
    setBudgetBlock(true);
    setInitiateAction(!initiateAction);
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

    const data = selectedCheckBox?.keyword
      ?.map((item) => {
        if (selectedAction === "pause" || selectedAction === "enable") {
          message = `${selectedAction} keyword`;
        } else if (selectedAction === "bid") {
          const budgetWithoutCurrency = item?.bid
            ?.split(currency)[1]
            ?.replace(/,/g, "");
          const numericBudget = parseFloat(budgetWithoutCurrency);

          if (budgetType === "total") {
            message = `Set bid to ${currency}${budget} from ${currency}${item.keyword_bid}`;
            set_value = parseFloat(budget);
          } else if (budgetType === "amount") {
            if (budgetVariation === "increase") {
              message = `Increase the bid by ${currency}${budget} from ${currency}${item.keyword_bid}`;
              set_value = numericBudget + parseFloat(budget);
            } else {
              message = `Decrease the bid by ${currency}${budget} from ${currency}${item.keyword_bid}`;
              set_value = numericBudget - parseFloat(budget);
            }
          } else if (budgetType === "percentage") {
            if (budgetVariation === "increase") {
              message = `Increase the bid by ${budget}% from ${currency}${item.keyword_bid}`;
              set_value =
                numericBudget + (numericBudget * parseFloat(budget)) / 100;
            } else {
              message = `Decrease the bid by ${budget}% from ${currency}${item.keyword_bid}`;
              set_value =
                numericBudget - (numericBudget * parseFloat(budget)) / 100;
            }
          }
        }

        return {
          campaign_id: [item?.campaign_id],
          campaign_name: [item.campaign_name],
          action_type: "keyword",
          action: selectedAction,
          action_message: message,
          media_type: "Amazon",
          action_status: 10,
          segment: item?.campaign_goal,
          // profile_id: amazonProfile,
          keyword_id: item.keyword_id,
          account_id: amazonProfile,
          ad_group_name: item.ad_group_name,
          ad_group_id: item?.ad_group_id,
          keywords: item?.keyword_text,
          account: val[0],
          state: item.status === "ENABLED" ? "enable" : "pause",
          match_type: item.match_type,
          ...(selectedAction === "bid" && { min_bid: set_value || 0 }),
        };
      })
      .filter((item) => item !== null);

    handleAction(data);
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
        setToastMessageHandler(res?.data?.status?.message?.error, false);
      }
      campaignSelection(false);
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };
  const BudgetInput = ({ keywordCount }) => (
    <>
      <div className=" flex flex-row items-center pt-2 ">
        <p className="mr-1">{keywordCount} Selected:</p>
        <p className="mr-1">Change bid by</p>

        <select
          value={budgetType}
          onChange={(e) => setBudgetType(e.target.value)}
          className="ams-select mr-1 "
        >
          <option className="p-2" value="total">
            Total
          </option>
          <option value={"amount"}>Amount</option>
          <option value={"percentage"}>Percentage</option>
        </select>

        <select
          className="ams-select ml-1"
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
              ? "cursor-not-allowed apply_btn_ams_disable"
              : "apply_btn_ams"
          }
          // className="apply_btn_ams"
          onClick={() => handleApplyButton()}
          disabled={(!budget || budget === undefined) && true}
        >
          {loading ? "In Progress" : "Apply"}
        </button>

        <button className="cancel_btn_ams" onClick={() => cancelButton()}>
          Cancel
        </button>
        {/* {error !== false && <p className="text-red-500">{error} </p>} */}
      </div>
    </>
  );

  const Block = () => (
    <>
      <div className=" flex flex-row items-center pt-2 ">
        <img className="pr-1 " src="/assets/images/tickmark.svg" alt="tick" />
        <p className=""> {confirmationText} </p>

        <button className="apply_btn_ams" onClick={() => handleApplyButton()}>
          {loading ? "In Progress" : "Apply"}
        </button>

        <button className="cancel_btn_ams" onClick={() => cancelButton()}>
          Cancel
        </button>
      </div>
    </>
  );

  //   const handlePinClick = async () => {
  //     let campIds = [];
  //     selectedCheckBox?.keyword?.map((data) => {
  //       campIds.push(data?.campaign_id);
  //     });
  //     const data = {
  //       campaign_id: campIds,
  //       pin_status: true,
  //     };

  //     // /await _POST(AMAZON_CAMAPIGN_PIN, data);
  //     campaignSelection(false);
  //     dispatch({
  //       type: ActionType.RECALLCAMPAIGNPAPI,
  //       payload: true,
  //     });
  //     // console.log(res.data, "<<<< data");
  //     // initProcess();
  //   };
  return (
    <>
      {!initiateAction && (
        <div className="flex items-center ">
          <p className="pt-5  ">{selectionText}</p>
          {/* <Headerbtn
            imgsrc="/assets/images/tag.svg"
            title="Tag"
            onClick={() => {}}
          />
          <Headerbtn imgsrc="/assets/images/pin.svg" onClick={() => {}} /> */}
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
              setSelectedAction("pause"), actionText("pause");
            }}
          />
          <Headerbtn
            title="Bid"
            onClick={() => {
              if (keywordCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              handleBudget();
            }}
          />

          {/* <Headerbtn title="Add Negative Keyword" onClick={() => {}} />

          <Headerbtn title="Add Keyword" onClick={() => {}} /> */}

          <img
            className="ml-4  cursor-pointer  px-3 py-2 mt-4 rounded shadow-sm hover:bg-[#EF880F] "
            onClick={() => campaignSelection(false)}
            src="/assets/images/x.svg"
          />
        </div>
      )}
      {showBulkPopup && (
        <DialogBox
          title="ALERT"
          buttonName="OK"
          platform="ams"
          onAccept={() => {
            setShowBulkPopup(false);
          }}
        >
          {`Can't Perform Bulk Action on more than 50 ${tabName}`}
        </DialogBox>
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

export default AmazonKeywordActionHeader;
