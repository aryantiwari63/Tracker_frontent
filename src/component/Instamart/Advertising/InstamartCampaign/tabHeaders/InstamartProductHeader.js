import React, { useState } from "react";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import { useDispatch, useSelector } from "react-redux";
import { setToastMessageHandler } from "../../../../../redux/action-creator/commonAction";
import {
  //   BLINKIT_BID,
  //   BLINKIT_KEYWORD_STATUS,
  RPA_ACTION_EDIT,
} from "../../../../../utils/constants";
import { _POST } from "../../../../../services/axios.method";
import ActionType from "../../../../../redux/types";

const InstamartProductHeader = ({
  campaignCount,
  campaignSelection,
  selectedCheckBox,
  setShowBulkPopup
  //   tabName,
}) => {
  const [initialAction, setInitialAction] = useState(false);
  const [block, setBlock] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [selectedAction, setSelectedAction] = useState();
  //   const [bid, setBid] = useState();
  //   const [bidBlock, setBidBlock] = useState(false);
  //   const [bidError, setBidError] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [smartBid,setSmartBid] = useState(false);
  const selectionText = `${campaignCount} Product(s) selected : `;
  //   const [confirmBid, setConfirmBid] = useState(false);
  let { totalAsins,instamartAccountId } = useSelector((state) => state?.CampaignReducer);
  const dispatch = useDispatch();
  const actionText = (text) => {
    let actionPhrase;
    setInitialAction(!initialAction);
    setBlock(true);
    switch (text) {
      case "enable":
        actionPhrase = `${campaignCount} of ${totalAsins} products(s) will be added to the campaign on Instamart platform`;
        // setSelectedAction("enable");
        break;
      case "stop":
        actionPhrase = `${campaignCount} of ${totalAsins} products(s) will be removed from the campaign on Instamart platform`;
        // setSelectedAction("pause");

        break;
    }
    let confirmationText = `Are you sure ${actionPhrase}?`;
    setConfirmationText(confirmationText);
  };

  const handleStatus = () => {
    let data;
    let rowData = selectedCheckBox?.product;
    data = rowData.map((row) => {
      return {
        campaign_id: [row?.campaign_id],
        campaign_name: [row.campaign_name],
        product_id: row["instamart_products.product_id"],
        products: row.product_name,
        action_type: selectedAction == "enable" ? "add_product" : "remove_product",
        action: `product`,
        action_message: `${selectedAction} product`,
        media_type: "Instamart",
        action_status: 10,
        // campaign_type: row.campaign_type,
        account: row.account,
        account_id: instamartAccountId,
        client_id: localStorage.getItem("client_id"),
      };
    });
    
    handleRpaAction(data)
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

  const handleApplyButton = async () => {
    if (selectedAction == "stop" || selectedAction == "enable") {
      console.error(selectedAction);
      handleStatus();
    }
  };

  const cancelButton = () => {
    setInitialAction(false);
    setBlock(false);
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

  return (
    <>
      {!initialAction && (
        <div className="flex items-center justify-around">
          <div className="flex items-center">
            <p className="pt-5">{selectionText} </p>
            <Headerbtn title={"Enable"} onClick={() => handleEnable()} />
            <Headerbtn title={"Pause"} onClick={() => handlePause()} />
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
      {/* {bidBlock && <ShowBid />} */}
      {/* {smartBid && <SmartBid />} */}
      {/* {confirmBid && (
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
                  handleAction(true);
                  setConfirmBid(false);
                }}
                className="justify-start items-center gap-2 flex cursor-pointer"
              >
                <div className="font-inter px-[15px] py-1 bg-amber-500 rounded-sm shadow border border-amber-500 justify-center items-center gap-2 flex">
                  <div className="font-inter text-center text-white text-sm  leading-snug">
                    Confirm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default InstamartProductHeader;
