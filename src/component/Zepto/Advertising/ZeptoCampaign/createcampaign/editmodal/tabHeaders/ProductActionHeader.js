import { useState } from "react";
import { RPA_ACTION_EDIT } from "../../../../../../../utils/constants";
import { Headerbtn } from "../../../../../../common-components/headerButton/headerButton";
import { useSelector, useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../../../../../../redux/action-creator/commonAction";
import { _POST } from "../../../../../../../services/axios.method";
import "./../styles.css";
import ActionType from "../../../../../../../redux/types";
const ProductActionHeader = ({ campaignSelection, setShowBulkPopup }) => {
  const [initiateAction, setInitiateAction] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [selectedAction, setSelectedAction] = useState();

  const [block, setBlock] = useState(false);

  let { totalAsins } = useSelector((state) => state?.CampaignReducer);
  const { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [loading, setLoading] = useState(false);

  let productCount = selectedCheckBox?.product?.length;
  const selectionText = `${productCount} product(s) selected: `;
  let { zeptoAccountId } = useSelector((state) => state?.CampaignReducer);

  const dispatch = useDispatch();

  const cancelButton = () => {
    setInitiateAction(false);
    setBlock(false);
  };

  const handleApplyButton = () => {
    let message;

    const data = selectedCheckBox?.product?.map((data) => {
      if (selectedAction === "pause" || selectedAction === "enable") {
        message = `${selectedAction} product`;
      }

      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        action_type: "product",
        action: selectedAction,
        action_message: message,
        media_type: "Zepto",
        action_status: 10,
        segment: data?.campaign_type,
        // account: data?.account,
        is_search_only: data.is_search_only,
        account_id: zeptoAccountId,
        account: data.account,
        product_id: data.sku_id,
        products: data.product_name,
        
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
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
      campaignSelection(false);
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };
  const actionText = (text) => {
    let actionPhrase;
    setInitiateAction(!initiateAction);
    setBlock(true);
    switch (text) {
      case "enable":
        actionPhrase = `(${productCount} of ${totalAsins} product(s) will be enabled)`;
        setSelectedAction("enable");
        break;
      case "pause":
        actionPhrase = `(${productCount} of ${totalAsins} product(s) will be paused)`;
        setSelectedAction("pause");

        break;
    }
    let confirmationText = `Are you sure ${actionPhrase}?`;
    setConfirmationText(confirmationText);
  };

  const Block = () => (
    <>
      <div className=" flex flex-row items-center pt-2 ">
        <img className="pr-1 " src="/assets/images/tickmark.svg" alt="tick" />
        <p className=""> {confirmationText} </p>

        <button className="apply_btn_zepto" onClick={() => handleApplyButton()}>
          {loading ? "In Progress" : "OK"}
        </button>

        <button className="cancel_btn_zepto" onClick={() => cancelButton()}>
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

          <Headerbtn
            title="Enable"
            onClick={() => {
                  if (productCount > 50) {
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
                  if (productCount > 50) {
                    setShowBulkPopup(true);
                    return;
                  }
                  setSelectedAction("pause") 
                  actionText("pause");              
            }}
          />

          <img
            className="ml-4  cursor-pointer  px-3 py-2 mt-4 rounded shadow-sm hover:bg-[#3C006B] "
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
    </>
  );
};

export default ProductActionHeader;
