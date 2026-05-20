import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DialogBox from "../../../../common-components/dialogBox.js";
import { _POST } from "../../../../../services/axios.method";
import { setToastMessageHandler } from "../../../../../redux/action-creator/commonAction";
import { PERMISSIONS, RPA_ACTION_EDIT } from "../../../../../utils/constants";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import ActionType from "../../../../../redux/types";
import WhenPermitted from "../../../../common-components/WhenPermitted.js";

const AsinActionHeader = ({ campaignSelection, tabName }) => {
  const [selectedAction, setSelectedAction] = useState();
  const [confirmationText, setConfirmationText] = useState("");
  const [initiateAction, setInitiateAction] = useState(false);
  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  let { totalAsins } = useSelector((state) => state?.CampaignReducer);
  const [loading, setLoading] = useState(false);
  const [showBulkPopup, setShowBulkPopup] = useState(false);
  const { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  let accountName = localStorage.getItem("savedAccounts");
  let val = JSON.parse(accountName);
  let asinCount = selectedCheckBox?.asin?.length;
  const selectionText = `${asinCount} ASIN(s) selected: `;
  const [block, setBlock] = useState(false);
  const dispatch = useDispatch();

  const handleApplyButton = () => {
    let message;

    const data = selectedCheckBox?.asin?.map((data) => {
      if (selectedAction === "pause" || selectedAction === "enable") {
        message = `${selectedAction} asin`;
      }
      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action_type: "asin",
        action: selectedAction,
        action_message: message,
        media_type: "Amazon",
        action_status: 10,
        segment: data?.ad_type,
        // profile_id: amazonProfile,
        // ad_id: data?.ad_id,
        fsn_id: data?.ad_id || "123",
        account_id: amazonProfile,
        account: val[0],
        ad_group_id: data?.ad_group_id,
        ad_group_name: data.ad_group_name,
      };
    });
    // console.log(data, "<< data");

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
        let errorMsg = res.data.status.message.error;
        dispatch(setToastMessageHandler(errorMsg, false));
      }
      campaignSelection(false);
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };
  const cancelButton = () => {
    setInitiateAction(false);

    setBlock(false);
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
  const actionText = (text) => {
    let actionPhrase;
    setInitiateAction(!initiateAction);
    setBlock(true);
    switch (text) {
      case "enable":
        actionPhrase = `(${asinCount} of ${totalAsins} asin(s) will be enabled)`;
        setSelectedAction("enable");
        break;
      case "pause":
        actionPhrase = `(${asinCount} of ${totalAsins} asin(s) will be paused)`;
        setSelectedAction("pause");

        break;
    }
    let confirmationText = `Are you sure ${actionPhrase}?`;
    setConfirmationText(confirmationText);
  };

  return (
    <>
     <WhenPermitted platform="amazon" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
      {!initiateAction && (
        <div className="flex items-center ">
          <p className="pt-5  ">{selectionText}</p>

          <Headerbtn
            title="Enable"
            onClick={() => {
              if (asinCount > 50) {
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
              if (asinCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              setSelectedAction("pause");
              actionText("pause");
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
      </WhenPermitted>
    </>
  );
};

export default AsinActionHeader;
