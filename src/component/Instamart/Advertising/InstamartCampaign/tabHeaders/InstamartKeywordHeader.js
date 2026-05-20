import React, { useState } from "react";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import { useDispatch, useSelector } from "react-redux";
import {
  setToastMessageHandler,
} from "../../../../../redux/action-creator/commonAction";
import {
//   BLINKIT_BID,
  // BLINKIT_KEYWORD_STATUS,
  RPA_ACTION_EDIT,
} from "../../../../../utils/constants";
import { _POST } from "../../../../../services/axios.method";
import ActionType from "../../../../../redux/types";

const InstamartKeywordHeader = ({
  campaignCount,
  campaignSelection,
  selectedCheckBox,
  setShowBulkPopup
  // tabName,
}) => {
  const [initialAction, setInitialAction] = useState(false);
  const [block, setBlock] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [selectedAction, setSelectedAction] = useState();
  const [bid, setBid] = useState();
  const [bidBlock, setBidBlock] = useState(false);
  const [bidError, setBidError] = useState(false);
const [loading, setLoading]=useState(false)
  // const [smartBid,setSmartBid] = useState(false);
  const selectionText = `${campaignCount} Keyword(s) selected : `;
  const [confirmBid, setConfirmBid] = useState(false);
  let { totalKeywords } = useSelector((state) => state?.CampaignReducer);
  const dispatch = useDispatch();
  const actionText = (text) => {
    let actionPhrase;
    setInitialAction(!initialAction);
    setBlock(true);
    switch (text) {
      case "enable":
        actionPhrase = `(${campaignCount} of ${totalKeywords} campaign(s) will be added to the campaign on Instamart platform`;
        // setSelectedAction("enable");
        break;
      case "stop":
        actionPhrase = `(${campaignCount} of ${totalKeywords} keyword(s) will be removed from the campaign on Instamart platform`;
        // setSelectedAction("stop");

        break;
    }
    let confirmationText = `Are you sure ${actionPhrase}?`;
    setConfirmationText(confirmationText);
  };

  const handlePayload = () => {
    let message;
    let action=selectedAction;
    const data = selectedCheckBox.keyword?.map((data) => {
      if (selectedAction === "set_bid") {
        message = `Set keyword bid from ${data.bid} to ₹${bid} `;
      }
      // if(selectedAction === "stop"){
      //   message =`Pause keyword`;
      //   action='remove_keyword';
      // }

    //   console.log("data ", data);

      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action: "keyword",
        action_message: message,
        media_type: "Instamart",
        action_type: action,
        action_status: 10,
        campaign_type: data?.campaign_type,
        set_value: bid,
        keyword_name: data?.keyword,
        match_type: data.matchtype,
        account: data.account,
        account_id: data.account_id,
      };
    });
    handleRpaAction(data);
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
          setToastMessageHandler("Something went wrong", false)
        );
      }
      campaignSelection(false);
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleVerifyBid = async () =>{
    // console.error("bid hitt")
    let rowData = selectedCheckBox?.keyword;
    const check = rowData.some((item) => item.bid < item.min_bid)
    if(check){
      setConfirmBid(true)
    }else{
      handleStatus() 
    }
  }

  const handleStatus = ()=>{
    let data;
    let rowData = selectedCheckBox?.keyword;
    data = rowData.map((row) => {
      return {
        campaign_id: [row?.campaign_id],
        campaign_name: [row.campaign_name],
        action_type: selectedAction == "enable" ? "add_keyword" : "remove_keyword",
        action: `keyword`,
        action_message: `${selectedAction} keyword`,
        media_type: "Instamart",
        action_status: 10,
        keyword_name: row.keyword,
        match_type: row.matchtype,
        account: row.account,
        account_id: row.account_id,
        client_id: localStorage.getItem("client_id"),
        ...(selectedAction === "enable" && {set_value : row.bid > row.min_bid ? row.bid : row.min_bid} ),
        ...(selectedAction === "stop" && {set_value: row.bid} )
      }
    });
    // console.error(data,'vsdvsdvvvvvr')
    handleRpaAction(data)
  }

  const handleApplyButton = async () => {
    if (selectedAction == "set_bid") {
      if (bid < 500 || bid > 10000) {
        setBidError("Enter bid between ₹500 and ₹10,000");
      } else {
        handlePayload();
        setBidError(false);
      }
    }
    if (selectedAction == "stop") {
      handleStatus();
    }
    if(selectedAction == "enable"){
      handleVerifyBid()
    }
  };

  // const handleAction = async (bidApi = false) => {
  //   try {
  //     let data = {};
  //     let rowData = selectedCheckBox[tabName].map((item) => {
  //       let obj = {
  //         entity: tabName,
  //         entity_type: item.match_type,
  //         campaign_id: item.campaign_id,
  //         entity_id: item.keyword,
  //         history_data: {
  //           previous_bid: parseFloat(
  //             item.bid
  //           ),
  //         },
  //         media_type: "Instamart",
  //         status: true,
  //       };
  //       return obj;
  //     });
  //     data = { ...data, row: rowData, bidApi: bidApi };
  //     data.status_type = `bulk${selectedAction}`;
  //     data.client_id = localStorage.getItem('client_id')
  //     data.user_id = localStorage.getItem('user_id')
  //     data.action = selectedAction == "stop" ? "stop keyword" : "enable keyword"
  //     data.action_type = "keyword_action"
  //     data.user_name =  localStorage.getItem('name')
  //     data.action_message = selectedAction == "stop" ? "stop keyword" : "enable keyword"
  //     data.action_status = 10
  //     setLoading(true);
  //     const res = await _POST(BLINKIT_KEYWORD_STATUS, data);
  //     setLoading(false);
  //     console.error(res, "asdadadasdasd");
  //     if (res?.status === 200) {
  //       dispatch(setToastMessageHandler(res.data.data.message, true));
  //       dispatch({
  //         type: ActionType.RECALLCAMPAIGNPAPI,
  //         payload: true,
  //       });
  //     } else {
  //       console.error(res, "asdadadasdasd");
  //       dispatch(setToastMessageHandler(res.data.data.message, false));
  //     }
  //     campaignSelection(false);
  //     console.error(res);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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

  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(0);
    }
  };

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
              ? "cursor-not-allowed apply_btn_instamart_disable"
              : "apply_btn_instamart"
          }
          onClick={() => handleApplyButton()}
          disabled={(!bid || bid === undefined) && true}
        >
          {loading ? "In Progress" : "Apply"}
        </button>
        <button className="cancel_btn_instamart" onClick={() => cancelButton()}>
          Cancel
        </button>

        {bidError !== false && <p className="text-red-500">{bidError}</p>}
      </div>
    </>
  );
  // const SmartBid = () => (
  //   <>
  //     <div className=" flex flex-row items-center gap-2 pt-4 ">
  //       <p className="">{selectionText} </p>
  //       <div className="flex items-center gap-1">
  //         <p>Smart Bid By</p>
  //         <select className="w-28 border h-8 px-1 rounded">
  //           <option>Total</option>
  //         </select>
  //         <select className="w-28 border h-8 px-1 rounded">
  //           <option>Increase</option>
  //         </select>
  //         <input
  //           type="text"
  //           placeholder="Enter Total"
  //           className="border h-8 w-36 px-2 rounded"
  //         />
  //       </div>
  //       <button className="apply_btn_blinkit">OK</button>
  //       <button className="cancel_btn_blinkit" onClick={() => cancelButton()}>
  //         Cancel
  //       </button>
  //     </div>
  //   </>
  // );

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
    setSelectedAction("stop");
    actionText("stop");
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

  // const handleSmartBid = () => {
  //   // setSmartBid(true);
  //   setInitialAction(!initialAction);
  // };

  return (
    <>
      {!initialAction && (
        <div className="flex items-center justify-around">
          <div className="flex items-center">
            <p className="pt-5">{selectionText} </p>
            <Headerbtn title={"Enable"} onClick={() => handleEnable()} />
            <Headerbtn title={"Pause"} onClick={() => handlePause()} />
            <Headerbtn title={"Bid"} onClick={() => handleBid()} />
            {/* <Headerbtn title={"Smart Bid"} onClick={() => handleSmartBid()} />
            <Headerbtn title={"Smart Match"} onClick={() => {}} /> */}
          </div>
          <img
    className="ml-4 cursor-pointer px-3 py-2 mt-4 rounded shadow-sm hover:bg-[#851853]"
    onClick={() => campaignSelection(false)}
    src="/assets/images/x.svg"
    onMouseOver={(e) => { e.currentTarget.src = '/assets/images/x-white.svg' }}
    onMouseOut={(e) => { e.currentTarget.src = '/assets/images/x.svg' }}
/>
        </div>
      )}
      {block && <Block />}
      {bidBlock && <ShowBid />}
      {/* {smartBid && <SmartBid />} */}
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
                  “Keyword” bid is below the minimum. Proceeding will update
                  the bid to the minimum bid.
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
                  handleStatus()
                  setConfirmBid(false)
                }}
                className="justify-start items-center gap-2 flex cursor-pointer"
              >
                <div className="font-inter px-[15px] py-1 bg-[#851853] rounded-sm shadow border border-[#851853] justify-center items-center gap-2 flex">
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

export default InstamartKeywordHeader;
