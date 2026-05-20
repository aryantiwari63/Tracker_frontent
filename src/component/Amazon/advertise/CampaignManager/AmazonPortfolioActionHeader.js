/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Tag from "../../../common-components/tag/Tag";
import { Headerbtn } from "../../../common-components/headerButton/headerButton";
import "./styles.css";
import ActionType from "../../../../redux/types";
import {
  RPA_ACTION_EDIT,
  AMAZON_PORTFOLIO_PIN,
} from "../../../../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../redux/action-creator/commonAction";
import { _POST } from "../../../../services/axios.method";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import DialogBox from "../../../common-components/dialogBox.js";

const AmazonActionHeader = ({
  campaignCount,
  campaignSelection,
  changeTagsData,
  selectedCheckBox,
  tabName,
}) => {
  const [initiateAction, setInitiateAction] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [selectedAction, setSelectedAction] = useState();
  const [budgetBlock, setBudgetBlock] = useState(false);
  const [extendDateBlock, setExtendDateBlock] = useState(false);
  const [duplicateBlock, setDuplicateBlock] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [block, setBlock] = useState(false);
  const [budget, setBudget] = useState("");
  const [budgetType, setBudgetType] = useState("total");
  const [budgetVariation, setBudgetVariation] = useState("increase");
  const [portfolioBudgetError, setPortfolioBudgetError] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [datePortfolio, setDatePortfolio] = useState(0);
  const [showBulkPopup, setShowBulkPopup] = useState(false);

  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  let { totalPortfolios } = useSelector((state) => state?.CampaignReducer);
  let accountName = localStorage.getItem("savedAccounts");
  let val = JSON.parse(accountName);
  const selectionText = `${campaignCount} Portfolio(s) selected: `;
  let currency = localStorage.getItem("currency");
  const dispatch = useDispatch();

  
  const actionText = (text) => {
    let actionPhrase;
    setInitiateAction(!initiateAction);
    setBlock(true);
    switch (text) {
      case "enable":
        actionPhrase = `(${campaignCount} of ${totalPortfolios} campaign(s) will be enabled)`;
        setSelectedAction("enable");
        break;
      case "pause":
        actionPhrase = `(${campaignCount} of x Portfolio(s) will be paused)`;
        setSelectedAction("pause");

        break;
    }
    let confirmationText = `Are you sure ${actionPhrase}?`;
    setConfirmationText(confirmationText);
  };

  const cancelButton = () => {
    setInitiateAction(false);
    setDuplicateBlock(false);
    setBudgetBlock(false);
    setExtendDateBlock(false);
    setBlock(false);
  };

  const handleBudget = () => {
    setSelectedAction("set_budget");
    setBudgetBlock(true);
    setInitiateAction(!initiateAction);
  };

  const handleExtendDate = () => {
    setSelectedAction("extend_date");
    setInitiateAction(!initiateAction);
    setExtendDateBlock(true);
  };

  const handleDuplicate = () => {
    setSelectedAction("duplicate");
    setInitiateAction(!initiateAction);
    setDuplicateBlock(true);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleApplyButton = () => {
    let message;
    let set_value;
    let end_date;

    const data = selectedCheckBox?.portfolio?.map((data) => {
      if (selectedAction === "pause" || selectedAction === "enable") {
        message = `${selectedAction} portfolio`;
      } else if (selectedAction === "set_budget") {
        const budgetWithoutCurrency = data?.budget_amount;
        const numericBudget = parseFloat(budgetWithoutCurrency);

        if (budgetType === "total") {
          message = `Set budget to ${currency}${budget}`;
          set_value = parseFloat(budget);
        } else if (budgetType === "amount") {
          if (budgetVariation === "increase") {
            message = `Increase budget by ${currency}${budget}`;

            set_value = numericBudget + parseFloat(budget);
          } else {
            message = `Decrease budget by ${currency}${budget}`;
            set_value = numericBudget - parseFloat(budget);
          }
        } else if (budgetType === "percentage") {
          if (budgetVariation === "increase") {
            message = `Increase budget by ${budget}%`;
            set_value =
              numericBudget + (numericBudget * parseFloat(budget)) / 100;
          } else {
            message = `Decrease budget by ${budget}%`;
            set_value =
              numericBudget - (numericBudget * parseFloat(budget)) / 100;
          }
        }
      } else if (selectedAction === "extend_date") {
        message = `Campaign end date extended to ${selectedDate}`;
        end_date = moment(selectedDate).format("YYYYMMDD");
      }

      return {
        action: selectedAction,
        action_message: message,
        media_type: "Amazon",
        action_status: 10,
        campaign_type: data?.campaign_type,
        profile_id: amazonProfile,
        portfolioId: data?.portfolio_id,
        account_id: amazonProfile,
        name: data?.name,
        account: val[0],

        budget: {
          amount: parseFloat(set_value),
          currencyCode: data?.budget_currency_code,
          policy: data?.budget_policy,
          startDate: data?.budget_start_date,
          endDate: end_date ? end_date : "",
        },
        action_type: "portfolio",
        inBudget: true,
        state: data.state,

        ...(selectedAction === "set_budget" && { set_value: set_value }),
        ...(selectedAction === "extend_date" && { end_date: end_date }),
      };
    });
    handleAction(data);
  };

  const handleDialogbox = () => {
    if (datePortfolio == selectedCheckBox?.portfolio.length) {
      handleApplyButton();
    } else {
      setShowStatusDialog(true);
    }
  };

  const handleAction = async (data) => {
    try {
      if (data[0].action == "set_budget") {
        if (data[0].budget.amount < 1000) {
          setPortfolioBudgetError(true);
          return;
        }
      }
      setLoading(true);
      // let res;
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
      campaignSelection(false);
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };
  // const budgetOptions = [
  //   { value: "total", label: "Total" },
  //   { value: "amount", label: "Amount" },

  //   { value: "percentage", label: "Percentage" },
  // ];
  const BudgetInput = ({ campaignCount }) => (
    <>
      <div className=" flex flex-row items-center pt-2 ">
        <p className="mr-1">{campaignCount} Selected:</p>
        <p className="mr-1">Change budget by</p>

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
            setPortfolioBudgetError(false);
            setBudget(e.target.value);
          }}
        />
        <button className="apply_btn_ams" onClick={() => handleDialogbox()}>
          Apply
        </button>

        <button className="cancel_btn_ams" onClick={() => cancelButton()}>
          Cancel
        </button>
      </div>

      {portfolioBudgetError == true && (
        <p className="text-red-500 text-[11px]">Budget must be atleast 1000.</p>
      )}
    </>
  );

  const checkDateRange = () => {
    let data = selectedCheckBox?.portfolio?.map((data) => {
      if (data.budget_policy == "dateRange") return data;
    });
    data = data?.filter((item) => item);
    setDatePortfolio(data?.length ? data?.length : 0);
  };
  useEffect(() => {
    checkDateRange();
  }, [selectedCheckBox]);

  const ExtendDateInput = ({ campaignCount }) => (
    <>
      <div className=" flex flex-row items-center pt-5  ">
        <img className="pr-1 " src="/assets/images/tickmark.svg" alt="tick" />
        <p className="mr-1">{campaignCount} Selected:</p>
        <p className="mr-1">Update Portfolio End Date</p>
        {/* <input
          className="border pl-1"
          type="date"
          value={selectedDate}
          min={getTodayDate()}
          onChange={(e) => setSelectedDate(e.target.value)}
        /> */}
        <DatePicker
          className="border border-slate-400 w-[98%] py-1 px-1 outline-orange-400"
          selected={selectedDate}
          minDate={new Date()}
          placeholderText="Select date"
          closeOnScroll={() => {
            return true;
          }}
          onChange={(date) => setSelectedDate(date)}
        />
        <button className="apply_btn_ams" onClick={() => handleDialogbox()}>
          Apply
        </button>

        <button className="cancel_btn_ams" onClick={() => cancelButton()}>
          Cancel
        </button>
      </div>
    </>
  );
  const Block = () => (
    <>
      <div className=" flex flex-row items-center pt-2 ">
        <img className="pr-1 " src="/assets/images/tickmark.svg" alt="tick" />
        <p className=""> {confirmationText} </p>

        <button className="apply_btn_ams" onClick={() => handleApplyButton()}>
          Apply
        </button>

        <button className="cancel_btn_ams" onClick={() => cancelButton()}>
          Cancel
        </button>
      </div>
    </>
  );

  const duplicateNo = () => {
    let num = 10;
    let duplicateAmount = [];
    for (let i = 1; i <= num; i++) {
      duplicateAmount.push({ label: `${i}x` });
    }
    return duplicateAmount;
  };

  const DuplicateInput = ({ campaignCount }) => {
    const duplicateAmount = duplicateNo();
    return (
      <>
        <div className=" flex flex-row items-center pt-2  ">
          <img className="pr-1 " src="/assets/images/tickmark.svg" alt="tick" />
          <p className="mr-1">{campaignCount} Selected:</p>
          <select className="ams-select">
            {duplicateAmount.map((option, index) => (
              <option key={index}>{option.label}</option>
            ))}
          </select>
          <p> To </p>
          <select className="ams-select">
            <option> Porfolio name</option>
          </select>

          <button className="apply_btn_ams">Apply</button>

          <button className="cancel_btn_ams" onClick={() => cancelButton()}>
            Cancel
          </button>
        </div>
      </>
    );
  };

  const handlePinClick = async () => {
    let campIds = [];
    selectedCheckBox?.portfolio?.map((data) => {
      campIds.push(data?.portfolio_id);
    });
    const data = {
      portfolio_id: campIds,
      pin_status: true,
    };

    await _POST(AMAZON_PORTFOLIO_PIN, data);
    campaignSelection(false);
    dispatch({
      type: ActionType.RECALLCAMPAIGNPAPI,
      payload: true,
    });
    // console.log(res.data, "<<<< data");
    // initProcess();
  };
  return (
    <>
      {!initiateAction && (
        <div className="flex items-center ">
          <p className="pt-5  ">{selectionText}</p>
          <Headerbtn
            imgsrc="/assets/images/pin.svg"
            hoverImgSrc="/assets/images/pin-white.svg"
            onClick={() => handlePinClick()}
          />

          <Headerbtn
            title="Set Budget"
            onClick={() => {
              if (campaignCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              handleBudget();
            }}
            disabled={datePortfolio == 0}
          />
          <Headerbtn
            title="Extent Date"
            onClick={() => {
              if (campaignCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              handleExtendDate();
            }}
            disabled={datePortfolio == 0}
          />
          <Headerbtn
            title="Duplicate"
            onClick={() => handleDuplicate()}
            disabled={true}
          />
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
      {showStatusDialog && (
        <DialogBox
          title="Confirmation"
          buttonName="Accept"
          onAccept={() => {
            handleApplyButton();
            setShowStatusDialog(false);
          }}
          onCancel={() => {
            setShowStatusDialog(false);
          }}
          platform={"ams"}
        >
          {datePortfolio &&
            `${datePortfolio} out of the ${selectedCheckBox.portfolio.length} portfolios will be updated with the specified policy date range. Are you sure you want to proceed?`}
        </DialogBox>
      )}
      {block && (
        <>
          <Block />
        </>
      )}
      {budgetBlock && (
        <>
          <BudgetInput campaignCount={campaignCount} />
        </>
      )}
      {extendDateBlock && (
        <>
          {" "}
          <ExtendDateInput campaignCount={campaignCount} />
        </>
      )}
      {duplicateBlock && (
        <>
          <DuplicateInput campaignCount={campaignCount} />
        </>
      )}
    </>
  );
};
export default AmazonActionHeader;
