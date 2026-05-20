import React, {
  useState,
  // useRef, useEffect
} from "react";
import Tag from "../../../../common-components/tag/Tag.js";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton.js";
import "./styles.css";
// import { AdGroupEdit } from "../../../../common-components/editButtonOptions/adGroupEdit.js";
// import { FsnEdit } from "../../../../common-components/editButtonOptions/fsnEdit.js";
// import { CreativeEdit } from "../../../../common-components/editButtonOptions/creativeEdit.js";
// import { PlacementEdit } from "../../../../common-components/editButtonOptions/placementEdit.js";

import {
  // setLoading,
  setToastMessageHandler,
} from "../../../../../redux/action-creator/commonAction.js";
import { _POST } from "../../../../../services/axios.method.js";
// import DialogBox from "../../../../common-components/dialogBox.js/index.js";
import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
import {
  APPLICATION_ROUTES,
  INSTAMART_CAMPAIGN_PIN,
  RPA_ACTION_EDIT,
} from "../../../../../utils/constants.js";
// import EditModal from "../createcampaign/editmodal/index.js";
import ActionType from "../../../../../redux/types.js";
// import { KeywordEditModal } from "../createcampaign/editmodal/KeywordEditModal.js";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const InstamartCampaignHeader = ({
  // onEditButtonClick,
  // tableData,
  // tabName,
  // showDropDown,
  // setShowDropDown,
  // changeTagsData,
  campaignCount,
  campaignSelection,
  changeTagsData,
  selectedCheckBox,
  selectedAccount,
  setShowBulkPopup,
}) => {
  // const [editValue, setEditValue] = useState(null);
  // const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  // const [actionName, setActionName] = useState("");
  // const [keywordErrorPopup, setKeywordErrorPopup] = useState(false);
  // const [keywordPopup, setKeywordPopup] = useState(false);
  // const editDropRef = useRef(null);
  // const conatinerRef = useRef(null);
  // // const [showDropDown, setShowDropDown] = useState(false);
  // const isEditButtonDisabled = tableData.length === 0;

  const [initiateAction, setInitiateAction] = useState(false);
  const [hover, setHover] = useState(false);
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
  // const [dateOption, setDateOption] = useState("selectDate");
  const [loading, setLoading] = useState(false);
  let { totalCampaign } = useSelector((state) => state?.CampaignReducer);

  const selectionText = `${campaignCount} Campaign(s) selected: `;
  let currency = localStorage.getItem("currency");
  const dispatch = useDispatch();
  const actionText = (text) => {
    let actionPhrase;
    setInitiateAction(!initiateAction);
    setBlock(true);
    switch (text) {
      case "deactivate":
        actionPhrase = `(${campaignCount} of ${totalCampaign} campaign(s) will be Stopped)`;
        setSelectedAction("deactivate");
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

  // eslint-disable-next-line no-unused-vars
  const handleDuplicate = () => {
    setSelectedAction("duplicate");
    setInitiateAction(!initiateAction);
    setDuplicateBlock(true);
  };

  // const getTodayDate = () => {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = (today.getMonth() + 1).toString().padStart(2, "0");
  //   const day = today.getDate().toString().padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };

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
      if (selectedAction === "deactivate") {
        message = `${selectedAction} campaign`;
      } else if (selectedAction === "set_budget") {
        const budgetWithoutCurrency = data?.budget
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
        message = `Campaign end date updated to ${endDateMoment}`;
        end_date = endDateMoment;
      }

      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action_type: "campaign_action",
        action: selectedAction,
        action_message: message,
        media_type: "Instamart",
        action_status: 10,
        campaign_type: data?.campaign_type,
        account: data?.account,
        account_id: data?.account_id,
        client_id: localStorage.getItem("client_id"),
        ...(selectedAction === "set_budget" && { set_value: set_value }),
        ...(selectedAction === "extend_end_date" && { end_date: end_date }),
      };
    });

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
              ? "cursor-not-allowed apply_btn_instamart_disable"
              : "apply_btn_instamart"
          }
          onClick={() => handleApplyButton()}
          disabled={(!budget || budget === undefined) && true}
        >
          {loading ? "In Progress" : "Apply"}
        </button>

        <button className="cancel_btn_instamart" onClick={() => cancelButton()}>
          Cancel
        </button>
      </div>
    </>
  );

  const ExtendDateInput = ({ campaignCount }) => (
    <div className="flex mt-4">
      <div className=" flex flex-row items-center ">
        <img className="pr-1 " src="/assets/images/tickmark.svg" alt="tick" />
        <div className="mr-1">{campaignCount} Selected:</div>
        <div className="mr-1">Update Campaign End Date</div>
      </div>

      {/* {dateOption === "selectDate" && ( */}
      {/* <input
          className="border pl-1"
          type="date"
          value={selectedDate}
          min={getTodayDate()}
          onChange={(e) => setSelectedDate(e.target.value)}
        /> */}
      <DatePicker
        className="border border-slate-400 w-[100%] py-1 px-1 outline-pink-800"
        selected={selectedDate}
        minDate={new Date()}
        placeholderText="Select date"
        closeOnScroll={() => {
          return true;
        }}
        onChange={(date) => setSelectedDate(date)}
      />
      {/* )} */}

      <button
        className={
          !selectedDate || selectedDate === undefined
            ? "cursor-not-allowed apply_btn_instamart_disable"
            : "apply_btn_instamart"
        }
        onClick={() => handleApplyButton()}
        disabled={(!selectedDate || selectedDate === undefined) && true}
      >
        {loading ? "In Progress" : "Apply"}
      </button>

      <button className="cancel_btn_instamart" onClick={() => cancelButton()}>
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
          className="apply_btn_instamart"
          onClick={() => handleApplyButton()}
        >
          {loading ? "In Progress" : "Apply"}
        </button>

        <button className="cancel_btn_instamart" onClick={() => cancelButton()}>
          Cancel
        </button>
      </div>
    </>
  );

  const handlePinClick = async () => {
    let campIds = [];
    selectedCheckBox?.campaign?.map((data) => {
      campIds.push(data?.campaign_id);
    });
    const data = {
      campaign_id: campIds,
      pin_status: true,
    };

    await _POST(INSTAMART_CAMPAIGN_PIN, data);
    campaignSelection(false);
    dispatch({
      type: ActionType.RECALLCAMPAIGNPAPI,
      payload: true,
    });
    // console.log(res.data, "<<<< data");
    // initProcess();
  };

  // const handleClickOutside = (event) => {
  //   if (
  //     editDropRef?.current &&
  //     !editDropRef?.current?.contains(event.target) &&
  //     conatinerRef?.current &&
  //     !conatinerRef?.current?.contains(event.target)
  //   ) {
  //     setShowDropDown(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);
  // useEffect(() => {}, [onEditButtonClick]);
  // eslint-disable-next-line no-unused-vars
  const [ShowTab, setShowTab] = useState("");

  // const renderEditComponent = () => {
  //   if (tableData.length > 0) {
  //     switch (onEditButtonClick) {
  //       case "campaign":
  //         return <EditModal op={showDropDown} editRef={conatinerRef} />;
  //       case "adgroup":
  //         return <AdGroupEdit op={showDropDown} editRef={conatinerRef} />;
  //       case "fsn":
  //         return <FsnEdit op={showDropDown} editRef={conatinerRef} />;
  //       case "placement":
  //         return <PlacementEdit op={showDropDown} editRef={conatinerRef} />;
  //       case "creative":
  //         return <CreativeEdit op={showDropDown} editRef={conatinerRef} />;
  //       case "keyword":
  //         return <KeywordEditModal op={showDropDown} editRef={conatinerRef} />;
  //     }
  //   }
  //   return null; // Return null when tableData length is 0 or editValue is not set
  // };
  // const dispatch = useDispatch();
  const duplicateCampaignApi = async () => {
    try {
      const data = selectedCheckBox?.campaign?.map((data) => ({
        campaign_name: data.campaign_name,
        campaign_id: "123",
        action_status: 1,
        action_type: "clone",
      }));
      setLoading(true);

      const res = await _POST(RPA_ACTION_EDIT, data);
      dispatch({
        type: ActionType.CHECKBOX,
        payload: [],
      });
      setLoading(false);
      if (res?.status === 200) {
        dispatch(setToastMessageHandler("Action performed successfully", true));
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleDuplicateButton = () => {
    duplicateCampaignApi();
    // setActionName("Are you sure you want to duplicate this campaign?");

    // setShowDuplicateDialog(true);
  };

  // const handleDialogApply = () => {
  //   duplicateCampaignApi();
  //   setShowDuplicateDialog(false);
  // };
  // const handleDialogCancel = () => {
  //   setShowDuplicateDialog(false);
  // };
  const history = useHistory();

  return (
    <>
      {!initiateAction && (
        <div className="flex items-center ">
          <p className="pt-5  ">{selectionText}</p>
          <Tag
            changeTagsData={changeTagsData}
            platform="instamart"
            data_level={"campaign"}
            account={selectedAccount}
          />

          {/* <Headerbtn
            title="Restart"
            onClick={() => {
              {
                {
                  setSelectedAction("restart");
                  actionText("restart");
                }
              }
            }}
          /> */}
          <Headerbtn
            imgsrc="/assets/images/plus1.svg"
            title="Clone"
            active={true}
            onClick={() => {
              history.push(
                APPLICATION_ROUTES.INSTAMARTDUPLICATENEWCAMPAIGN,
                selectedCheckBox?.campaign[0]?.campaign_id
              );
              dispatch({
                type: ActionType.CAMPAIGN_DETAILS_INSTAMART,
                payload: [],
              });
            }}
            disabled={selectedCheckBox?.campaign?.length !== 1}
          />
          <Headerbtn
            imgsrc="/assets/images/pin.svg"
            hoverImgSrc="/assets/images/pin-white.svg"
            onClick={() => handlePinClick()}
          />
          <Headerbtn
            title="Stop"
            onClick={() => {
              if (campaignCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              setSelectedAction("deactivate");
              actionText("deactivate");
            }}
          />
          <Headerbtn
            title="Budget"
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
          {/* <Headerbtn title="Duplicate" onClick={() => {}}
          />
          <Headerbtn title="Add Negative Keyword" onClick={() => {}} />
          <Headerbtn title="Add Keyword" onClick={() => {}} />
          <Headerbtn title="Add Product" onClick={() => {}} /> */}

          <img
            className="ml-4  cursor-pointer  px-3 py-2 mt-4 rounded shadow-sm hover:bg-[#851853] "
            onClick={() => campaignSelection(false)}
            src={hover ? "/assets/images/xwhite.svg" : "/assets/images/x.svg"}
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
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
          <Headerbtn
            imgsrc="/assets/images/duplicate.svg"
            title="Duplicate"
            onClick={(e) => handleDuplicateButton(e)}
          />
        </>
      )}
    </>
  );
};

export default InstamartCampaignHeader;
