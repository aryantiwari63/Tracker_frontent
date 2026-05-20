/* eslint-disable no-unused-vars */
import { useState } from "react";
import Tag from "../../../../common-components/tag/Tag";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import "./styles.css";
import ActionType from "../../../../../redux/types";
import {
  RPA_ACTION_EDIT,
  BLINKIT_CAMPAIGN_PIN,
} from "../../../../../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../../../../redux/action-creator/commonAction";
import { _POST } from "../../../../../services/axios.method";
import Location from "../popup/Location";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const BlinkitCampaignHeader = ({
  campaignCount,
  campaignSelection,
  changeTagsData,
  selectedCheckBox,
  setShowBulkPopup
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
  const [dateOption, setDateOption] = useState("selectDate");
  const [loading, setLoading] = useState(false);
  const [locationPopup, setLocationPopup] = useState(false);
  const [error, setError] = useState(false);

  let { totalCampaign } = useSelector((state) => state?.CampaignReducer);

  const selectionText = `${campaignCount} Campaign(s) selected: `;
  let currency = localStorage.getItem("currency");
  const dispatch = useDispatch();
  const actionText = (text) => {
    let actionPhrase;
    setInitiateAction(!initiateAction);
    setBlock(true);
    switch (text) {
      case "restart":
        actionPhrase = `(${campaignCount} of ${totalCampaign} campaign(s) will be Active, with previous daily budget and no end date)`;
        setSelectedAction("restart");
        break;
      case "stop":
        actionPhrase = `(${campaignCount} of ${totalCampaign} campaign(s) will be Stopped)`;
        setSelectedAction("stop");

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
    setBudget("");
    setSelectedDate();
  };

  const handleBudget = () => {
    setSelectedAction("set_budget");
    setBudgetBlock(true);
    setInitiateAction(!initiateAction);
  };

  const handleExtendDate = () => {
    setSelectedAction("extend_end_date");
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
      if (selectedAction === "stop" || selectedAction === "restart") {
        message = `${selectedAction} campaign`;
      } else if (selectedAction === "set_budget") {
        const budgetWithoutCurrency = data?.campaign_budget
          ?.split(currency)[1]
          ?.replace(/,/g, "");
        const numericBudget = parseFloat(budgetWithoutCurrency);

        if (budgetType === "total") {
          message = `Set daily budget to ${currency}${budget}`;
          set_value = parseFloat(budget);
        } else if (budgetType === "amount") {
          if (budgetVariation === "increase") {
            message = `Increase daily budget by ${currency}${budget}`;

            set_value = numericBudget + parseFloat(budget);
          } else {
            message = `Decrease daily budget by ${currency}${budget}`;
            set_value = numericBudget - parseFloat(budget);
          }
        } else if (budgetType === "percentage") {
          if (budgetVariation === "increase") {
            message = `Increase daily budget by ${budget}%`;
            set_value =
              numericBudget + (numericBudget * parseFloat(budget)) / 100;
          } else {
            message = `Decrease daily budget by ${budget}%`;
            set_value =
              numericBudget - (numericBudget * parseFloat(budget)) / 100;
          }
        }
      } else if (selectedAction === "extend_end_date") {
        let endDateMoment = moment(selectedDate).format("YYYY-MM-DD") || null;
        message = `Campaign end date updated to ${endDateMoment|| 'onwards'} `;
        end_date = endDateMoment;
      }

      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action_type: "campaign",
        action: selectedAction,
        action_message: message,
        media_type: "Blinkit",
        action_status: 10,
        segment: data?.campaign_type,

        ...(selectedAction === "set_budget" && { set_value: set_value }),
        ...(selectedAction === "extend_end_date" && {
          end_date: dateOption === "selectDate" ? end_date : null,
          infinite_campaign: dateOption !== "selectDate",
        }),
      };
    });

    if (
      selectedAction === "set_budget" &&
      budgetType === "total" &&
      budget < 200
    ) {
      setError("Budget must be greater than ₹200");
    } else {
      handleAction(data);
      setError(false);
    }
  };

  const handleLocation = async (data) => {
    try {
      console.error(data);
      setLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setLoading(false);
      //  console.error(res,"my_res")
      if (res?.status === 200) {
        dispatch(setToastMessageHandler(res?.data?.status?.message, true));
        // dispatch({
        //   type: ActionType.RECALLCAMPAIGNPAPI,
        //   payload: true,
        // });
      } else {
        dispatch(
          setToastMessageHandler(res?.data?.status?.message?.error, false)
        );
      }
      // campaignSelection(false);
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
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
          setToastMessageHandler(res?.data?.status?.message?.error, false)
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
              ? "cursor-not-allowed apply_btn_blinkit_disable"
              : "apply_btn_blinkit"
          }
          onClick={() => handleApplyButton()}
          disabled={(!budget || budget === undefined) && true}
        >
          {loading ? "In Progress" : "Apply"}
        </button>

        <button className="cancel_btn_blinkit" onClick={() => cancelButton()}>
          Cancel
        </button>
        {error !== false && <p className="text-red-500 ml-2">{error}</p>}
      </div>
    </>
  );

  const ExtendDateInput = ({ campaignCount }) => (
    <div className="flex mt-4">
      <div className=" flex flex-row items-center pt-2  ">
        <img className="pr-1 " src="/assets/images/tickmark.svg" alt="tick" />
        <p className="mr-1">{campaignCount} Selected:</p>
        <p className="mr-1">Update Campaign End Date</p>
        <div className="flex">
          <div>
            <input
              className="mr-1 ml-2"
              type="radio"
              id="selectDate"
              name="dateOption"
              value="selectDate"
              checked={dateOption === "selectDate"}
              onChange={() => setDateOption("selectDate")}
            />
            <label htmlFor="selectDate" className="text-[14px] mr-1">
              Select End Date
            </label>
          </div>
          <div>
            <input
              className="mr-1 ml-2"
              type="radio"
              id="noDate"
              name="dateOption"
              value="noDate"
              checked={dateOption === "noDate"}
              onChange={() => setDateOption("noDate")}
            />
            <label htmlFor="noDate" className="text-[14px] mr-2 ">
              No End Date
            </label>
          </div>
        </div>
      </div>

      {dateOption === "selectDate" && (
        // <input
        //   className="border pl-1"
        //   type="date"
        //   value={selectedDate}
        //   min={getTodayDate()}
        //   onChange={(e) => setSelectedDate(e.target.value)}
        // />
        <DatePicker
          className="border border-slate-400 w-[98%] py-1 px-1 outline-green-600"
          selected={selectedDate}
          minDate={new Date()}
          placeholderText="Select date"
          closeOnScroll={() => {
            return true;
          }}
          onChange={(date) => setSelectedDate(date)}
        />
      )}

      <button className="apply_btn_blinkit" onClick={() => handleApplyButton()}>
        {loading ? "In Progress" : "Apply"}
      </button>

      <button className="cancel_btn_blinkit" onClick={() => cancelButton()}>
        Cancel
      </button>
    </div>
  );
  const Block = () => (
    <>
      <div className=" flex flex-row items-center pt-2 ">
        <img className="pr-1 " src="/assets/images/tickmark.svg" alt="tick" />
        <p className=""> {confirmationText} </p>

        <button
          className="apply_btn_blinkit"
          onClick={() => handleApplyButton()}
        >
          {loading ? "In Progress" : "Apply"}
        </button>

        <button className="cancel_btn_blinkit" onClick={() => cancelButton()}>
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

          <button className="apply_btn_blinkit">Apply</button>

          <button className="cancel_btn_blinkit" onClick={() => cancelButton()}>
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

    await _POST(BLINKIT_CAMPAIGN_PIN, data);
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
            platform="blinkit"
            data_level={"campaign"}
          />
          <Headerbtn
            imgsrc="/assets/images/pin.svg"
            hoverImgSrc="/assets/images/pin-white.svg"
            onClick={() => handlePinClick()}
          />
          <Headerbtn
            title="Restart"
            onClick={() => {
                  if (campaignCount > 50) {
                    setShowBulkPopup(true);
                    return;
                  }
                  setSelectedAction("restart");
                  actionText("restart");
            }}
          />
          <Headerbtn
            title="Stop"
            onClick={() => {
                  if (campaignCount > 50) {
                    setShowBulkPopup(true);
                    return;
                  }
                  setSelectedAction("stop") 
                  actionText("stop");
            }}
          />
          <Headerbtn
            title="Daily Budget"
            onClick={() => {
              if (campaignCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              handleBudget();
            }}
          />
          <Headerbtn
            title="End Date"
            onClick={() => {
              if (campaignCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              handleExtendDate();
            }}
          />
          <Headerbtn title="Duplicate" onClick={() => handleDuplicate()} />
          {/* <Headerbtn title="Move" onClick={() => {}} />
          <Headerbtn title="Add Negative Keyword" onClick={() => {}} /> */}
          <Headerbtn
            title="Add Location"
            onClick={() => {
              if (campaignCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              setLocationPopup(true);
            }}
          />

          <img
            className="ml-4  cursor-pointer  px-3 py-2 mt-4 rounded shadow-sm hover:bg-[#23BC7C] "
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
      {locationPopup && (
        <Location
          setShowPopup={setLocationPopup}
          selectedCheckBox={selectedCheckBox}
          callApi={handleLocation}
          campaignSelection={campaignSelection}
        />
      )}
    </>
  );
};
export default BlinkitCampaignHeader;
