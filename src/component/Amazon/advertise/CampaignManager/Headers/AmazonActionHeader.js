/* eslint-disable no-unused-vars */
import { useState } from "react";
import Tag from "../../../../common-components/tag/Tag";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import "./styles.css";
import ActionType from "../../../../../redux/types";
import {
  RPA_ACTION_EDIT,
  AMAZON_CAMAPIGN_PIN,
} from "../../../../../utils/constants";
import DialogBox from "../../../../common-components/dialogBox.js";
import { useSelector, useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../../../../redux/action-creator/commonAction";
import { _POST } from "../../../../../services/axios.method";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const AmazonActionHeader = ({
  campaignCount,
  campaignSelection,
  changeTagsData,
  selectedCheckBox,
  selectedAccount,
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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBulkPopup, setShowBulkPopup] = useState(false);
  const [topOfSearchBlock, setTopOfSearchBlock] = useState(false);
  const [topOfSearchVal, setTopOfsearchVal] = useState();
  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  let { totalCampaign } = useSelector((state) => state?.CampaignReducer);
 let accountName = localStorage.getItem("savedAccounts");
 let val = JSON.parse(accountName);
  const selectionText = `${campaignCount} Campaign(s) selected: `;
  let currency = localStorage.getItem("currency");
 
  const dispatch = useDispatch();
  const actionText = (text) => {
    let actionPhrase;
    setInitiateAction(!initiateAction);
    setBlock(true);
    switch (text) {
      case "enable":
        actionPhrase = `(${campaignCount} of ${totalCampaign} campaign(s) will be enabled)`;
        setSelectedAction("enable");
        break;
      case "pause":
        actionPhrase = `(${campaignCount} of ${totalCampaign} campaign(s) will be paused)`;
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
    setTopOfSearchBlock(false);
    setBlock(false);
  };

  const handleBudget = () => {
    setSelectedAction("set_budget");
    setBudgetBlock(true);
    setInitiateAction(!initiateAction);
  };

  const handleTopOfSearch = () => {
    setSelectedAction("top_of_search");
    setTopOfSearchBlock(true);
    setInitiateAction(!initiateAction);
  };

  const handleExtendDate = () => {
    setSelectedAction("extend_date");
    setInitiateAction(!initiateAction);
    setExtendDateBlock(true);
  };

  const handleDuplicate = () => {
    if (campaignCount > 50) {
      setShowBulkPopup(true);
      return;
    }
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
    let end_date;

    const data = selectedCheckBox?.campaign?.map((data) => {
      if (selectedAction === "pause" || selectedAction === "enable") {
        message = `${selectedAction} campaign`;
      } else if (selectedAction === "set_budget") {
        const budgetWithoutCurrency = data?.budget
          ?.split(currency)[1]
          ?.replace(/,/g, "");
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
        let endDateMoment = moment(selectedDate).format("YYYY-MM-DD") || null;
        message = `Campaign end date updated to ${endDateMoment}`;
        end_date = endDateMoment;
      } else if (selectedAction === "top_of_search") {
        message = `Update top of search for ${tabName} ${data.campaign_name} from ${data.placement_top}% to ${topOfSearchVal}%`;
      }
      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action_type: "campaign",
        action: selectedAction,
        action_message: message,
        media_type: "Amazon",
        action_status: 10,
        segment: data?.campaign_type,
        // profile_id: amazonProfile,
        account_id: amazonProfile,
        account: val[0],
        ...(selectedAction === "set_budget" && { set_value: set_value }),
        ...(selectedAction === "extend_date" && { end_date: end_date }),
        ...(selectedAction === "top_of_search" && {
          placement_name: ["PLACEMENT_TOP"],
          placement_bid: parseFloat(topOfSearchVal),
        }),
      };
    });
    // console.log(data, "<< data");
    if (
      selectedAction === "set_budget" &&
      budgetType === "total" &&
      budget < 50
    ) {
      setError("Budget must be greater than ₹50");
    } else if (
      selectedAction === "top_of_search" &&
      parseFloat(topOfSearchVal) > 900
    ) {
      setError("Choose a percentage between 0 to 900");
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
        dispatch(
          setToastMessageHandler(res?.data?.status.message.error, false)
        );
      }
      campaignSelection(false);
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

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
            handleNonNegativeInput(e, setBudget);
          }}
        />
        <button
          className={
            !budget || budget === undefined
              ? "cursor-not-allowed apply_btn_ams_disable"
              : "apply_btn_ams"
          }
          onClick={() => handleApplyButton()}
          disabled={(!budget || budget === undefined) && true}
        >
          {loading ? "In Progress" : "Apply"}
        </button>

        <button className="cancel_btn_ams" onClick={() => cancelButton()}>
          Cancel
        </button>
        {error !== false && <p className="text-red-500 ml-2">{error}</p>}
      </div>
    </>
  );

  const TopOfSearchBlock = ({ campaignCount }) => (
    <>
      <div className=" flex flex-row items-center pt-2 ">
        <p className="mr-1">{campaignCount} Selected:</p>
        <p className="mr-1">Change Top of Search IS to</p>

        <input
          type="number"
          className="border mx-1  h-8 rounded pl-2"
          autoFocus="autoFocus"
          value={topOfSearchVal}
          onChange={(e) => {
            handleNonNegativeInput(e, setTopOfsearchVal);
          }}
        />
        <button
          className={
            !topOfSearchVal || topOfSearchVal === undefined
              ? "cursor-not-allowed apply_btn_ams_disable"
              : "apply_btn_ams"
          }
          onClick={() => handleApplyButton()}
          disabled={(!topOfSearchVal || topOfSearchVal === undefined) && true}
        >
          {loading ? "In Progress" : "Apply"}
        </button>

        <button className="cancel_btn_ams" onClick={() => cancelButton()}>
          Cancel
        </button>
        {error !== false && <p className="text-red-500 ml-2">{error}</p>}
      </div>
    </>
  );

  const ExtendDateInput = ({ campaignCount }) => (
    <>
      <div className=" flex flex-row items-center pt-5  ">
        <img className="pr-1 " src="/assets/images/tickmark.svg" alt="tick" />
        <p className="mr-1">{campaignCount} Selected:</p>
        <p className="mr-1">Update Campaign End Date</p>
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
        <button className="apply_btn_ams" onClick={() => handleApplyButton()}>
          {loading ? "In Progress" : "Apply"}
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
          {loading ? "In Progress" : "Apply"}
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
    selectedCheckBox?.campaign?.map((data) => {
      campIds.push(data?.campaign_id);
    });
    const data = {
      campaign_id: campIds,
      pin_status: true,
    };

    await _POST(AMAZON_CAMAPIGN_PIN, data);
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
          <Tag
            changeTagsData={changeTagsData}
            platform="amazon"
            data_level={"campaign"}
            account={selectedAccount}
          />
          <Headerbtn
            imgsrc="/assets/images/pin.svg"
            hoverImgSrc="/assets/images/pin-white.svg"
            onClick={() => handlePinClick()}
          />
          <Headerbtn
            title="Enable"
            onClick={() => {
              if (campaignCount > 50) {
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
              if (campaignCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              setSelectedAction("pause");
              actionText("pause");
            }}
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
          />
          <Headerbtn
            title="Extend Date"
            onClick={() => {
              if (campaignCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              handleExtendDate();
            }}
          />
          <Headerbtn
            title="Top Of Search IS"
            onClick={() => {
              if (campaignCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              handleTopOfSearch();
            }}
          />
          <Headerbtn title="Duplicate" onClick={() => handleDuplicate()} />
          {/* <Headerbtn title="Move" onClick={() => {}} /> */}
          {/* <Headerbtn title="Add Negative Keyword" onClick={() => {}} /> */}

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
          <BudgetInput campaignCount={campaignCount} />
        </>
      )}
      {topOfSearchBlock && (
        <>
          <TopOfSearchBlock campaignCount={campaignCount} />
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
