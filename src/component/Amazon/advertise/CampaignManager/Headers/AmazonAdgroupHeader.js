/* eslint-disable no-unused-vars */
import { useState } from "react";
// import Tag from "../../../../common-components/tag/Tag";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import "./styles.css";
import {
  AMAZON_ADGROUP_PIN,
  RPA_ACTION_EDIT,
} from "../../../../../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import ActionType from "../../../../../redux/types";
import { setToastMessageHandler } from "../../../../../redux/action-creator/commonAction";
import DialogBox from "../../../../common-components/dialogBox.js";
import { _POST } from "../../../../../services/axios.method";
import { KeywordPopup } from "../AmazonRpaAction/AdGroupRpaPopup/keywordPopup";
import { NegativeKeywordPopup } from "../AmazonRpaAction/AdGroupRpaPopup/negativeKeywordPopup";
const AmazonAdgroupHeader = ({
  adgroupCount,
  campaignSelection,
  selectedCheckBox,
  changeTagsData,
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
  const [budgetVariation, setBudgetVariation] = useState("increase");
  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  const [showKeywordPopup, setShowKeywordPopup] = useState(false);
  const [budgetType, setBudgetType] = useState("total");
  const [showBulkPopup, setShowBulkPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNegativeKeywordPopup, setShowNegativeKeywordPopup] =
    useState(false);
  const selectionText = `${adgroupCount} Adgroup(s) selected: `;
  let currency = localStorage.getItem("currency");
  let { totalAmsAdgroupCount } = useSelector((state) => state?.CampaignReducer);
  let accountName = localStorage.getItem("savedAccounts");
  let val = JSON.parse(accountName);
  const dispatch = useDispatch();

  const handleApplyButton = () => {
    let message;
    let set_value;
    let end_date;

    const data = selectedCheckBox?.adgroup?.map((data) => {
      if (selectedAction === "pause" || selectedAction === "enable") {
        message = `${selectedAction} adgroup`;
      } else if (selectedAction === "default_bid") {
        const budgetWithoutCurrency = data?.default_bid
          ?.split(currency)[1]
          ?.replace(/,/g, "");
        const numericBudget = parseFloat(budgetWithoutCurrency);

        if (budgetType === "total") {
          message = `Set default bid to ${currency}${budget}`;
          set_value = parseFloat(budget);
        } else if (budgetType === "amount") {
          if (budgetVariation === "increase") {
            message = `Increase default bid by ${currency}${budget}`;

            set_value = numericBudget + parseFloat(budget);
          } else {
            message = `Decrease default bid by ${currency}${budget}`;
            set_value = numericBudget - parseFloat(budget);
          }
        } else if (budgetType === "percentage") {
          if (budgetVariation === "increase") {
            message = `Increase default bid by ${budget}%`;
            set_value =
              numericBudget + (numericBudget * parseFloat(budget)) / 100;
          } else {
            message = `Decrease default bid by ${budget}%`;
            set_value =
              numericBudget - (numericBudget * parseFloat(budget)) / 100;
          }
        }
      } else if (selectedAction === "extend_date") {
        message = `Campaign end date updated to ${selectedDate}`;
        end_date = selectedDate;
      }

      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action_type: "adgroup",
        action: selectedAction,
        action_message: message,
        media_type: "Amazon",
        action_status: 10,
        segment: data?.campaign_type,
        // profile_id: amazonProfile,
        ad_group_id: data?.ad_group_id,
        ad_group_name: data?.ad_group_name,
        account_id: amazonProfile,
        account: val[0],
        ...(selectedAction === "default_bid" && { set_value: set_value }),
        ...(selectedAction === "extend_date" && { end_date: end_date }),
      };
    });
    // console.log(data, "<< data");
    handleAction(data);
  };

  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(0);
    }
  };

  const actionText = (text) => {
    let actionPhrase;
    setInitiateAction(!initiateAction);
    setBlock(true);
    switch (text) {
      case "enable":
        actionPhrase = `(${adgroupCount} of ${totalAmsAdgroupCount} adgroup(s) will be enabled)`;
        setSelectedAction("enable");
        break;
      case "pause":
        actionPhrase = `(${adgroupCount} of ${totalAmsAdgroupCount} adgroup(s) will be paused)`;
        setSelectedAction("pause");

        break;
    }
    let confirmationText = `Are you sure ${actionPhrase}?`;
    setConfirmationText(confirmationText);
  };

  const handlePinClick = async () => {
    let data = [];

    selectedCheckBox?.adgroup?.map((item) => {
      data.push({
        campaign_id: item?.campaign_id,
        adgroup_id: item?.ad_group_id,
        pin_status: true,
      });
    });
    // const data = {
    //   campaign_id: campaignIds,
    //   pin_status: true,
    //   adgroup_id: adgroupIds,
    // };

    await _POST(AMAZON_ADGROUP_PIN, data);
    campaignSelection(false);
    dispatch({
      type: ActionType.RECALLCAMPAIGNPAPI,
      payload: true,
    });
    // console.log(res.data, "<<<< data");
    // initProcess();
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
      campaignSelection(false);
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };
  const cancelButton = () => {
    setInitiateAction(false);
    setDuplicateBlock(false);
    setBudgetBlock(false);
    setExtendDateBlock(false);
    setBlock(false);
  };

  const handleBudget = () => {
    setSelectedAction("default_bid");
    setBudgetBlock(true);
    setInitiateAction(!initiateAction);
  };

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

  const DuplicateInput = ({ adgroup }) => {
    const duplicateAmount = duplicateNo();
    return (
      <>
        <div className=" flex flex-row items-center pt-2  ">
          <img className="pr-1 " src="/assets/images/tickmark.svg" alt="tick" />
          <p className="mr-1">{adgroup} Selected:</p>
          <select className="ams-select">
            {duplicateAmount.map((option, index) => (
              <option key={index}>{option.label}</option>
            ))}
          </select>
          <p> To </p>
          <select className="ams-select">
            <option> Porfolio name</option>
          </select>

          <button className="apply_btn_ams">
            {" "}
            {loading ? "In Progress" : "Apply"}
          </button>

          <button className="cancel_btn_ams" onClick={() => cancelButton()}>
            Cancel
          </button>
        </div>
      </>
    );
  };
  const BudgetInput = ({ adgroupCount }) => (
    <>
      <div className=" flex flex-row items-center pt-2 ">
        <p className="mr-1">{adgroupCount} Selected:</p>
        <p className="mr-1">Change default bid by</p>
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
        <button className="apply_btn_ams" onClick={() => handleApplyButton()}>
          {loading ? "In Progress" : "Apply"}
        </button>

        <button className="cancel_btn_ams" onClick={() => cancelButton()}>
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
          {/* <Tag
            changeTagsData={changeTagsData}
            platform="amazon"
            data_level={"adgroup"}
          /> */}
          <Headerbtn
            imgsrc="/assets/images/pin.svg"
            hoverImgSrc="/assets/images/pin-white.svg"
            onClick={() => handlePinClick()}
          />
          <Headerbtn
            title="Enable"
            onClick={() => {
              if (adgroupCount > 50) {
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
              if (adgroupCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              setSelectedAction("pause"), actionText("pause");
            }}
          />
          <Headerbtn
            title="Default Bid"
            onClick={() => {
              if (adgroupCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              handleBudget();
            }}
          />
          <Headerbtn title="Duplicate" onClick={() => {}} />
          <Headerbtn title="Move" onClick={() => {}} />
          <Headerbtn
            title="Add Negative Keyword"
            onClick={() => {
              if (adgroupCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              setShowNegativeKeywordPopup(!showNegativeKeywordPopup);
            }}
          />
          <Headerbtn
            title="Add Keyword"
            onClick={() => {
              if (adgroupCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              setShowKeywordPopup(!showKeywordPopup);
            }}
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
      {block && (
        <>
          <Block />
        </>
      )}
      {budgetBlock && (
        <>
          <BudgetInput campaignCount={adgroupCount} />
        </>
      )}

      {duplicateBlock && (
        <>
          <DuplicateInput campaignCount={adgroupCount} />
        </>
      )}
      {showNegativeKeywordPopup && (
        <NegativeKeywordPopup setOpenState={setShowNegativeKeywordPopup} />
      )}
      {showKeywordPopup && <KeywordPopup setOpenState={setShowKeywordPopup} />}
    </>
  );
};

export default AmazonAdgroupHeader;
