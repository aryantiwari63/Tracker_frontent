import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import DialogBox from "../../../../common-components/dialogBox.js";
import { RPA_ACTION_EDIT } from "../../../../../utils/constants.js";
import { _POST } from "../../../../../services/axios.method.js";
import { setToastMessageHandler } from "../../../../../redux/action-creator/commonAction.js";
import ActionType from "../../../../../redux/types.js";
const PlacementActionHeader = ({ campaignSelection, tabName }) => {
  const [initiateAction, setInitiateAction] = useState(false);
  const { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  const [showBulkPopup, setShowBulkPopup] = useState(false);
  const [topOfSearchBlock, setTopOfSearchBlock] = useState(false);
  const [topOfSearchVal, setTopOfsearchVal] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState();
  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  const [error, setError] = useState(false);
  let accountName = localStorage.getItem("savedAccounts");
  let val = JSON.parse(accountName);
  let placementCount = selectedCheckBox?.placement?.length;
  const selectionText = `${placementCount} Placement(s) selected: `;
  const dispatch = useDispatch();

  const handleApplyButton = () => {
    const data = selectedCheckBox?.placement?.map((data) => {
      let placementName;

      switch (data.placement) {
        case "PLACEMENT_TOP":
        case "Top of Search on-Amazon":
          placementName = "PLACEMENT_TOP";
          break;
        case "Detail Page on-Amazon":
          placementName = "PLACEMENT_PRODUCT_PAGE";

          break;
        case "Other on-Amazon":
          placementName = "PLACEMENT_REST_OF_SEARCH";
          break;
      }

      return {
        campaign_id: [data?.campaign_id],
        campaign_name: [data.campaign_name],
        // profile_id: amazonProfile,
        account_id: amazonProfile,
        account: val[0],
        action: "placement_bid",
        placement_bid: parseFloat(topOfSearchVal),
        placement_name: [placementName],
        action_type: "placement",
        media_type: "Amazon",
        segment: data.campaign_type,
        action_message: `Update ${placementName} for campaign ${data.campaign_name} to ${topOfSearchVal}% `,
      };
    });

    const aggregatedData = data.reduce((acc, item) => {
      const key = item.campaign_id[0];
      if (!acc[key]) {
        acc[key] = { ...item };
      } else {
        acc[key].placement_name = Array.from(
          new Set([...acc[key].placement_name, ...item.placement_name])
        );
      }
      acc[key].action_message = `Update ${acc[key].placement_name.join(
        ", "
      )} for campaign ${acc[key].campaign_name} to ${topOfSearchVal}% `;
      return acc;
    }, {});

    const result = Object.values(aggregatedData);

    if (
      selectedAction === "placement_bid" &&
      parseFloat(topOfSearchVal) > 900
    ) {
      setError("Choose a percentage between 0 to 900");
    } else {
      handleAction(result);
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

  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(0);
    }
  };
  const cancelButton = () => {
    setInitiateAction(false);
    setTopOfSearchBlock(false);
  };
  const handleTopOfSearch = () => {
    setSelectedAction("placement_bid");
    setTopOfSearchBlock(true);
    setInitiateAction(!initiateAction);
  };
  const TopOfSearchBlock = ({ placementCount }) => (
    <>
      <div className=" flex flex-row items-center pt-2 ">
        <p className="mr-1">{placementCount} Selected:</p>
        <p className="mr-1">Change Placement Bid to:</p>

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
  return (
    <>
      {!initiateAction && (
        <div className="flex items-center ">
          <p className="pt-5  ">{selectionText}</p>
          <Headerbtn
            title="Placement Bid"
            onClick={() => {
              if (placementCount > 50) {
                setShowBulkPopup(true);
                return;
              }
              handleTopOfSearch();
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
      {topOfSearchBlock && (
        <>
          <TopOfSearchBlock placementCount={placementCount} />
        </>
      )}
    </>
  );
};

export default PlacementActionHeader;
