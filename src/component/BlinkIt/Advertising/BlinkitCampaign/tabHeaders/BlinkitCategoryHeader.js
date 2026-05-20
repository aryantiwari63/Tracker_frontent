import React, { useState } from "react";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import { useDispatch, useSelector } from "react-redux";
import {
  setToastMessageHandler,
} from "../../../../../redux/action-creator/commonAction";
import {
  // BLINKIT_BID,
  BLINKIT_CATEGORY_STATUS,
  RPA_ACTION_EDIT,
} from "../../../../../utils/constants";
import { _POST } from "../../../../../services/axios.method";
import ActionType from "../../../../../redux/types";

const BlinkitCategoryHeader = ({
  campaignCount,
  campaignSelection,
  selectedCheckBox,
  tabName,
  setShowBulkPopup
}) => {
  const [initialAction, setInitialAction] = useState(false);
  const [block, setBlock] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [selectedAction, setSelectedAction] = useState();
  const [bidBlock, setBidBlock] = useState(false);
  const [bid, setBid] = useState("");
  const [bidError, setBidError] = useState(false);
  const selectionText = `${campaignCount} Category(s) selected : `;
  const [confirmBid, setConfirmBid] = useState(false);
  let { totalCategoryCount } = useSelector((state) => state?.CampaignReducer);
const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();
  const actionText = (text) => {
    let actionPhrase;
    setInitialAction(!initialAction);
    setBlock(true);
    switch (text) {
      case "enable":
        actionPhrase = `(${campaignCount} of ${totalCategoryCount} category(s) will be added from the category on BlinkIt platform`;
        // setSelectedAction("enable");
        break;
      case "pause":
        actionPhrase = `(${campaignCount} of ${totalCategoryCount} category(s) will be removed from the category on BlinkIt platform`;
        // setSelectedAction("pause");

        break;
    }
    let confirmationText = `Are you sure ${actionPhrase}?`;
    setConfirmationText(confirmationText);
  };

  const handleApplyButton = async () => {
    if (selectedAction == "set_bid") {
      if (bid < 200 || bid > 10000) {
        setBidError("Enter bid between ₹200 and ₹10,000");
      } else {
        handlePayload();
        setBidError(false);
      }
    } else {
      if (selectedAction == "enable") {
        // let data = {};
        // let rowData = selectedCheckBox[tabName].map((item) => {
        //   let obj = {
        //     entity: tabName,
        //     entity_type: item.campaign_type,
        //     campaign_id: item.campaign_id,
        //     entity_id: item.category_name,
        //     history_data: {
        //       previous_bid: parseFloat(
        //         item.cpm.replace("₹", "").replaceAll(",", "")
        //       ),
        //     },
        //     media_type: "Blinkit",
        //     status: true,
        //   };
  
        //   return obj;
        // });
        // data = { ...data, row: rowData };
        // data.status_type = `bulk${selectedAction}`;
        // const resp = await _POST(BLINKIT_BID, data);

        const check = selectedCheckBox[tabName].some(item => {
          return item.min_bid > item.cpm_bid;
      });
        if (!check) {
          handleAction();
        } else {
          setConfirmBid(true);
        }
      } else if(selectedAction == "pause") {
        handleAction();
      }
    }
  };


  const handlePayload = () => {
    let message;
    const data = selectedCheckBox.category?.map((data) => {
      if (selectedAction === "set_bid") {
        message = `Set category bid from ${data.cpm} to ₹${bid} `;
      }
      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action: selectedAction,
        action_message: message,
        media_type: "Blinkit",
        action_type: "category",
        action_status: 10,
        campaign_type: data?.campaign_type,
        set_value: bid,
        category_name: data?.category_name,
        category_id: data?.category_id,
        segment: data?.campaign_type
      };
    });
    handleRpaAction(data);
  };

  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;
    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(0);
    }
  };

  const handleRpaAction = async (data) => {
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

  const handleAction = async (bidApi = false) => {
    try {
      let data = {};
      let rowData = selectedCheckBox[tabName].map((item) => {
        let obj = {
          entity: tabName,
          segment: item.campaign_type,
          campaign_name: item.campaign_name,
          entity_type: item.campaign_type,
          campaign_id: item.campaign_id,
          entity_id: item.category_name,
          // history_data: {
          //   previous_bid: parseFloat(
          //     item.cpm_bid
          //   ),
          // },
          set_value : item.cpm_bid > item.min_bid  ? item.cpm_bid : item.min_bid,
          category_id: item.category_id,
          media_type: "Blinkit",
          // status: true,
        };
        return obj;
      });
      data = { ...data, row: rowData, bidApi: bidApi };
      data.status_type = `bulk${selectedAction}`;
      data.client_id = localStorage.getItem('client_id')
      data.user_id = localStorage.getItem('user_id')
      data.action = selectedAction == "pause" ? "pause_category" : "enable_category"
      data.action_type = "category"
      data.user_name =  localStorage.getItem('name')
      data.action_message = selectedAction == "pause" ? "Bulk pause category" : "Bulk enable category"
      data.action_status = 10
      
      setLoading(true);
      const res = await _POST(BLINKIT_CATEGORY_STATUS, data);
      setLoading(false);
      console.error(res, "asdadadasdasd");
      if (res?.status === 200) {
        dispatch(setToastMessageHandler("Status updated successfully", true));
        dispatch({
          type: ActionType.RECALLCAMPAIGNPAPI,
          payload: true,
        });
      } else {
        console.error(res, "asdadadasdasd");
        dispatch(setToastMessageHandler("Something went wrong", false));
      }
      campaignSelection(false);
      console.error(res);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelButton = () => {
    setInitialAction(false);
    setBlock(false);
    setBidBlock(false);
    setBid("");
  };

  const Block = () => (
    <>
      <div className=" flex flex-row items-center pt-4 ">
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

  const ShowBid = () => (
    <>
      <div className=" flex flex-row items-center gap-2 pt-4 ">
        <p className="">{selectionText} </p>
        <div className="flex items-center gap-1">
          <p> Enter Bid: </p>
          <input
            type="text"
            placeholder="₹"
            autoFocus="autoFocus"
            className="border h-8 w-36 px-2 rounded"
            value={bid}
            onChange={(e) => {
              handleNonNegativeInput(e, setBid);
            }}
          />
        </div>
        <button
          className={
            !bid || bid === undefined
              ? "cursor-not-allowed apply_btn_blinkit_disable"
              : "apply_btn_blinkit"
          }
          onClick={() => handleApplyButton()}
          disabled={(!bid || bid === undefined) && true}
        >
          {loading ? "In Progress" : "Apply"}
        </button>
        <button className="cancel_btn_blinkit" onClick={() => cancelButton()}>
          Cancel
        </button>

        {bidError !== false && <p className="text-red-500">{bidError}</p>}
      </div>
    </>
  );

  const handleEnable = () => {
    if (campaignCount > 50) {
      setShowBulkPopup(true);
      return;
    }
    setBlock(true);
    setInitialAction(!initialAction);
    setSelectedAction("enable");
    actionText("enable");
  };
  const handlePause = () => {
    if (campaignCount > 50) {
      setShowBulkPopup(true);
      return;
    }
    setBlock(true);
    setInitialAction(!initialAction);
    setSelectedAction("pause");
    actionText("pause");
  };
  const handleBid = () => {
    if (campaignCount > 50) {
      setShowBulkPopup(true);
      return;
    }
    setSelectedAction("set_bid");
    setBidBlock(true);
    setInitialAction(!initialAction);
  };
  return (
    <>
      {!initialAction && (
        <div className="flex items-center justify-around">
          <div className="flex items-center">
            <p className="pt-5">{selectionText} </p>
            <Headerbtn title={"Enable"} onClick={() => handleEnable()} />
            <Headerbtn title={"Pause"} onClick={() => handlePause()} />
            <Headerbtn title={"Bid"} onClick={() => handleBid()} />
          </div>
          <img
            className="ml-4  cursor-pointer  px-3 py-2 mt-4 rounded shadow-sm hover:bg-[#23BC7C] "
            onClick={() => campaignSelection(false)}
            src="/assets/images/x.svg"
          />
        </div>
      )}
      {block && <Block />}
      {bidBlock && <ShowBid />}
      {confirmBid && (
        <div className="popup">
          <div className="font-inter px-8 pt-8 pb-6 bg-white rounded-sm shadow flex-col justify-start items-end gap-5 inline-flex">
            <div className=" font-inter w-[352px] justify-start items-start gap-4 inline-flex">
              <img
                className=" imgicon"
                src={"/assets/images/confirmAlert.svg"}
                alt=""
              />
              <div className="font-inter grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <div className="font-inter self-stretch text-black/opacity-90 text-base font-medium  leading-normal">
                  Confirmation
                </div>
                <div className="font-inter self-stretch text-black/opacity-90 text-sm  leading-snug">
                  “Category” bid is below the minimum. Proceeding will update
                  the CPM bid to the minimum bid.
                </div>
              </div>
            </div>
            <div className="font-inter justify-end items-start gap-4 inline-flex">
              <div
                onClick={() => {
                  setConfirmBid(false);
                }}
                className="justify-start items-center gap-2 cursor-pointer flex"
              >
                <div className="font-inter px-[15px] py-1 bg-white rounded-sm shadow border border-zinc-300 justify-center items-center gap-2.5 flex">
                  <div className="font-inter text-center text-black/opacity-90 text-sm  leading-snug">
                    Cancel
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  handleAction(true);
                  setConfirmBid(false);
                }}
                className="justify-start items-center gap-2 flex cursor-pointer"
              >
                <div className="font-inter px-[15px] py-1 bg-[#11B07A] rounded-sm shadow border border-[#11B07A] justify-center items-center gap-2 flex">
                  <div className="font-inter text-center text-white text-sm  leading-snug">
                    Confirm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlinkitCategoryHeader;
