/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import CreateCampaignPopup from "./CreateCampignPopup";
import _ from "lodash";
import Tag from "../../../common-components/tag/Tag";
import { Headerbtn } from "../../../common-components/headerButton/headerButton";
import { CampaignEdit } from "../../../common-components/editButtonOptions/campaignEdit";
import { AdGroupEdit } from "../../../common-components/editButtonOptions/adGroupEdit";
import { FsnEdit } from "../../../common-components/editButtonOptions/fsnEdit";
import { CreativeEdit } from "../../../common-components/editButtonOptions/creativeEdit";
import { PlacementEdit } from "../../../common-components/editButtonOptions/placementEdit";
import { KeywordEdit } from "../../../common-components/editButtonOptions/keywordEdit";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../redux/action-creator/commonAction";
import DialogBox from "../../../common-components/dialogBox.js";
import { duplicateCampaign } from "../../../../redux/action-creator/campaignAction";
import { useDispatch } from "react-redux";
import CreateRulePopup from "../../Rules/CreateRulePopup";
import { AddKeywords } from "../../../common-components/editButtonOptions/editPopups/addKeywords";
import { useSelector } from "react-redux";
import ActionType from "../../../../redux/types";
import { trackCreateCampaignClick } from "../../../../analytics/EventController.js";
import { _POST } from "../../../../services/axios.method.js";
import {
  FLIPKART_CAMAPIGN_PIN,
  PERMISSIONS,
  RPA_ACTION_EDIT,
} from "../../../../utils/constants.js";
import LoaderSpinner from "../../../common-components/loader-spinner/index.js";
import { FaSpinner } from "react-icons/fa";
import { ProgressSpinner } from "primereact/progressspinner";
import moment from "moment";
import WhenPermitted from "../../../common-components/WhenPermitted.js";

const CampaigntableHeader = ({
  onEditButtonClick,
  tableData,
  tabName,
  showDropDown,
  setShowDropDown,
  changeTagsData,
  headers,
  account,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  // const [editValue, setEditValue] = useState(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  const [actionName, setActionName] = useState("");
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const [keywordPopup, setKeywordPopup] = useState(false);
  const [keywordErrorPopup, setKeywordErrorPopup] = useState(false);
  const [headerState, setHeaderState] = useState("all_actions");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [disableDrop, setDisableDrop] = useState(true);
  const editDropRef = useRef(null);
  const conatinerRef = useRef(null);
  const [abortedCampaigns, setAbortedCampaigns] = useState(null);
  const [plaAdgroups, setPlaAdgroups] = useState(null);

  let currency = localStorage.getItem("currency");

  const checkForStatus = (statuses, values) => {
    let temp = statuses.every((status) => {
      if (values[status] !== "ABORTED") {
        return true;
      }

      return false;
    });

    return temp;
  };

  const checkAbortedCampaigns = () => {
    if (selectedCheckBox[tabName]) {
      const camps = selectedCheckBox[tabName]?.filter((item) => {
        let tempOj = {
          campaign: ["campaign_status"],
          adgroup: ["campaign_status", "ad_group_status"],
          placement: ["campaign_status", "ad_group_status"],
          keyword: ["campaign_status", "ad_group_status"],
        };

        if (tempOj[tabName] && !checkForStatus(tempOj[tabName], item)) {
          return true;
        }

        return false;
      });

      // eslint-disable-next-line no-console
      console.log("aborted", camps);

      setAbortedCampaigns(camps.length);
    }
  };

  const checkPlAdgroups = () => {
    if (tabName === "adgroup") {
      let ad = selectedCheckBox?.adgroup?.filter((item) => {
        return item.segment === "PLA";
      });

      setPlaAdgroups(ad?.length);
    }
  };

  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  // const [showDropDown, setShowDropDown] = useState(false);
  const isEditButtonDisabled =
    onEditButtonClick === "placement"
      ? tableData.length === 0 || tableData[0].min_bid == undefined
      : tableData.length === 0;

  const handleClickOutside = (event) => {
    if (
      editDropRef?.current &&
      !editDropRef?.current?.contains(event.target) &&
      conatinerRef?.current &&
      !conatinerRef?.current?.contains(event.target)
    ) {
      setShowDropDown(false);
    }
  };

  useEffect(() => {
    setDisableDrop(isEditButtonDisabled);
  }, [isEditButtonDisabled]);

  useEffect(() => {
    checkAbortedCampaigns();
    checkPlAdgroups();
  }, [selectedCheckBox]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {}, [onEditButtonClick]);
  // eslint-disable-next-line no-unused-vars
  const [ShowTab, setShowTab] = useState("");
  const renderEditComponent = () => {
    if (tableData.length > 0) {
      switch (onEditButtonClick) {
        case "campaign":
          return <CampaignEdit op={showDropDown} editRef={conatinerRef} />;
        case "adgroup":
          return <AdGroupEdit op={showDropDown} editRef={conatinerRef} />;
        case "fsn":
          return <FsnEdit op={showDropDown} editRef={conatinerRef} />;
        case "placement":
          return <PlacementEdit op={showDropDown} editRef={conatinerRef} />;
        case "creative":
          return <CreativeEdit op={showDropDown} editRef={conatinerRef} />;

        case "keyword":
          return <KeywordEdit op={showDropDown} editRef={conatinerRef} />;
      }
    }
    return null; // Return null when tableData length is 0 or editValue is not set
  };
  const dispatch = useDispatch();
  const duplicateCampaignApi = async (data) => {
    try {
      setLoading(true);
      // await _POST(DUPLICATE_CAMPAIGN, data);
      dispatch(duplicateCampaign(data));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDuplicateButton = () => {
    // if (tableData.length > 0) {
    //   const data = {
    //     ids: tableData.map((data) => data.campaign_id),
    //   };
    //   duplicateCampaignApi(data);
    //   // window.alert("Duplicate successfull");
    //   setActionName("Duplicate successfull");
    //   setShowDuplicateDialog(true);
    // } else {
    //   setActionName("Select atleast one record");
    //   setShowDuplicateDialog(true);
    // }

    if (selectedCheckBox?.campaign?.length > 0) {
      setShowDuplicateDialog(true);
    } else {
      setKeywordErrorPopup(true);
    }
  };

  const handleDialogApply = () => {
    if (tableData.length > 0) {
      const data = {
        ids: tableData.map((data) => data.campaign_id),
      };
      duplicateCampaignApi(data);
      // window.alert("Duplicate successfull");
      setActionName("Are you sure you want to duplicate this campaign?");
      // setShowDuplicateDialog(true);
    } else {
      setActionName("Select atleast one record");
      // setShowDuplicateDialog(true);
    }

    setShowDuplicateDialog(false);
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  };
  const handleDialogCancel = () => {
    setShowDuplicateDialog(false);
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  };

  const handleAddKeyword = async (keyword, matchType) => {
    let filterAborted = selectedCheckBox[tabName]?.filter((item) => {
      return (
        item.ad_group_status !== "ABORTED" && item.campaign_status !== "ABORTED"
      );
    });

    let data = filterAborted.map((item) => {
      return {
        ad_group_id: item.ad_group_id,
        ad_group_name: item.ad_group_name,
        campaign_id: [item.campaign_id],
        keyword: keyword,
        keyword_name: keyword,
        match_type: matchType === "exact" ? "E" : "B",
        campaign_name: [item.campaign_name],
        action: "add_keyword",
        action_type: "campaign",
        segment: item.segment,
        account_id: item.account_id,
        platform_id: item.platform_id,
        platform: item.platform,
        account: item.account,
        action_message: ` ${keyword} keyword added`,
        action_status: 10,
        client_id: localStorage.getItem("client_id"),
        media_type: "Flipkart",
      };
    });
    if (
      selectedCheckBox?.adgroup?.length === 0 ||
      selectedCheckBox?.adgroup?.length === undefined
    ) {
      setKeywordErrorPopup(true);
    } else {
      try {
        setActionLoading(true);
        const res = await _POST(RPA_ACTION_EDIT, data);
        setActionLoading(false);
        if (res?.status === 200) {
          dispatch(
            setToastMessageHandler("Action performed successfully", true)
          );

          dispatch({
            type: ActionType.RECALLCAMPAIGNPAPI,
            payload: true,
          });
        } else {
          dispatch(setToastMessageHandler("Failed to perform action", false));
        }

        setHeaderState("all_actions");
        removeSelected();
      } catch (error) {
        console.error(error);
        dispatch(setToastMessageHandler("Something went wrong!", false));
        setActionLoading(false);
        removeSelected();
      }
    }
  };

  const handleChangeBudget = async (budget) => {
    if (
      selectedCheckBox[tabName]?.length === 0 ||
      selectedCheckBox[tabName]?.length === undefined
    ) {
      setKeywordErrorPopup(true);
    } else if (budget < 1000) {
      setActionError("Budget Should be greater than 1000");
    } else {
      let filterAborted = selectedCheckBox[tabName]?.filter((item) => {
        if (tabName === "campaign") {
          return item.campaign_status !== "ABORTED";
        } else {
          return (
            item.ad_group_status !== "ABORTED" &&
            item.campaign_status !== "ABORTED"
          );
        }
      });
      let data = filterAborted.map((item) => {
        return {
          ad_group_id: item.ad_group_id,
          campaign_id: [item.campaign_id],
          campaign_name: [item.campaign_name],
          action: "set_budget",
          set_value: budget,
          action_type: tabName,
          segment: item.segment,
          account_id: item.account_id,
          platform_id: item.platform_id,
          platform: item.platform,
          account: item.account,
          action_message: `budget changed to ${currency}${budget}`,
          action_status: 10,
          client_id: localStorage.getItem("client_id"),
          media_type: "Flipkart",
        };
      });
      try {
        setActionLoading(true);
        const res = await _POST(RPA_ACTION_EDIT, data);
        setActionLoading(false);
        if (res?.status === 200) {
          dispatch(
            setToastMessageHandler("Action performed successfully", true)
          );

          dispatch({
            type: ActionType.RECALLCAMPAIGNPAPI,
            payload: true,
          });
        } else {
          dispatch(setToastMessageHandler("Failed to perform action", false));
        }

        setHeaderState("all_actions");
        removeSelected();
      } catch (error) {
        console.error(error);
        dispatch(setToastMessageHandler("Something went wrong!", false));
        setActionLoading(false);
        removeSelected();
      }
    }
  };

  const handleRemoveKeyword = async () => {
    if (
      selectedCheckBox?.keyword?.length === 0 ||
      selectedCheckBox?.keyword?.length === undefined
    ) {
      setKeywordErrorPopup(true);
    } else {
      let filterAborted = selectedCheckBox[tabName]?.filter((item) => {
        return (
          item.ad_group_status !== "ABORTED" &&
          item.campaign_status !== "ABORTED"
        );
      });
      let data = filterAborted.map((item) => {
        return {
          ad_group_id: item.ad_group_id,
          campaign_id: [item.campaign_id],
          keyword: item.keyword,
          match_type: item.keyword_match_type === "EXACT" ? "E" : "B",
          campaign_name: [item.campaign_name],
          action: "remove_keyword",
          action_type: "campaign",
          segment: item.segment,
          account_id: item.account_id,
          platform_id: item.platform_id,
          platform: item.platform,
          account: item.account,
          action_message: ` ${item.keyword} keyword removed`,
          action_status: 10,
          client_id: localStorage.getItem("client_id"),
          media_type: "Flipkart",
          ...(tabName === "adgroup" && {ad_group_name : item.ad_group_name} ),

        };
      });
      try {
        setActionLoading(true);
        const res = await _POST(RPA_ACTION_EDIT, data);
        setActionLoading(false);
        if (res?.status === 200) {
          dispatch(
            setToastMessageHandler("Action performed successfully", true)
          );
          dispatch({
            type: ActionType.RECALLCAMPAIGNPAPI,
            payload: true,
          });
        } else {
          dispatch(setToastMessageHandler("Failed to perform action", false));
        }
        removeSelected();
      } catch (error) {
        console.error(error);
        dispatch(setToastMessageHandler("Something went wrong!", false));
        setActionLoading(false);
        removeSelected();
      }
    }
  };

  const handleChangeEndDate = async (endDate) => {
    if (
      selectedCheckBox[tabName]?.length === 0 ||
      selectedCheckBox[tabName]?.length === undefined
    ) {
      setKeywordErrorPopup(true);
    } else {
      let filterAborted = selectedCheckBox[tabName]?.filter((item) => {
        if (tabName === "campaign") {
          return item.campaign_status !== "ABORTED";
        } else {
          return (
            item.ad_group_status !== "ABORTED" &&
            item.campaign_status !== "ABORTED"
          );
        }
      });
      let data = filterAborted.map((item) => {
        return {
          ad_group_id: item.ad_group_id,
          campaign_id: [item.campaign_id],
          campaign_name: [item.campaign_name],
          min_bid: item.min_bid,
          action: "set_end_date",
          end_date:
            endDate === "Till budget ends" ? "till_budget_end" : endDate,
          action_type: tabName,
          segment: item.segment,
          account_id: item.account_id,
          platform_id: item.platform_id,
          platform: item.platform,
          account: item.account,
          action_message: `End Date changed to ${endDate}`,
          action_status: 10,
          client_id: localStorage.getItem("client_id"),
          media_type: "Flipkart",
        };
      });
      try {
        setActionLoading(true);
        const res = await _POST(RPA_ACTION_EDIT, data);
        setActionLoading(false);
        if (res?.status === 200) {
          dispatch(
            setToastMessageHandler("Action performed successfully", true)
          );

          dispatch({
            type: ActionType.RECALLCAMPAIGNPAPI,
            payload: true,
          });
        } else {
          dispatch(setToastMessageHandler("Failed to perform action", false));
        }

        setHeaderState("all_actions");
        removeSelected();
      } catch (error) {
        console.error(error);
        dispatch(setToastMessageHandler("Something went wrong!", false));
        setActionLoading(false);
        removeSelected();
      }
    }
  };

  const removeSelected = () => {
    const payload = {
      keyword: tabName === "keyword" ? [] : selectedCheckBox?.keyword,
      campaign: tabName === "campaign" ? [] : selectedCheckBox?.campaign,
      adgroup: tabName === "adgroup" ? [] : selectedCheckBox?.adgroup,
      fsn: tabName === "fsn" ? [] : selectedCheckBox?.fsn,
      placement: tabName === "placement" ? [] : selectedCheckBox?.placement,
      creative: tabName === "creative" ? [] : selectedCheckBox?.creative,
    };

    dispatch({
      type: ActionType.CHECKBOX,
      payload,
    });
  };

  useEffect(() => {
    setActionError(false);
  }, [headerState]);

  return (
    <>
      <div className="row">
        {selectedCheckBox[tabName]?.length > 0 ? (
          <>
            {headerState === "all_actions" && (
             <WhenPermitted platform="flipkart" permission={PERMISSIONS.CAMPAIGN_ACTIONS}> 
              <FlipkartEditActionHeader
                selectedCheckBox={selectedCheckBox}
                tabName={tabName}
                removeSelected={removeSelected}
                headerState={headerState}
                setHeaderState={setHeaderState}
                handleRemoveKeyword={handleRemoveKeyword}
                changeTagsData={changeTagsData}
                account={account}
                actionError={actionError}
                setActionError={setActionError}
                abortedCampaigns={abortedCampaigns}
                setAbortedCampaigns={setAbortedCampaigns}
                checkAbortedCampaigns={checkAbortedCampaigns}
                plaAdgroups={plaAdgroups}
                headers={headers}
              />
             </WhenPermitted> 
            )}

            {headerState === "add_keyword" && (
              <FlipkartAddKeywordHeader
                selectedCheckBox={selectedCheckBox}
                handleAddKeyword={handleAddKeyword}
                tabName={tabName}
                setHeaderState={setHeaderState}
                loading={actionLoading}
                setLoading={setActionLoading}
                abortedCampaigns={abortedCampaigns}
              />
            )}
            {headerState === "change_budget" && (
              <FlipkartChangeBudgetHeader
                selectedCheckBox={selectedCheckBox}
                handleChangeBudget={handleChangeBudget}
                tabName={tabName}
                setHeaderState={setHeaderState}
                loading={actionLoading}
                setLoading={setActionLoading}
                actionError={actionError}
                setActionError={setActionError}
                abortedCampaigns={abortedCampaigns}
                // plaAdgroups={plaAdgroups}
              />
            )}

            {headerState === "change_end_date" && (
              <FlipkartChangeEndDate
                selectedCheckBox={selectedCheckBox}
                handleChangeEndDate={handleChangeEndDate}
                tabName={tabName}
                setHeaderState={setHeaderState}
                loading={actionLoading}
                setLoading={setActionLoading}
                abortedCampaigns={abortedCampaigns}
              />
            )}
          </>
        ) : (
          <>
          <WhenPermitted platform="flipkart" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
            <Headerbtn
              imgsrc="/assets/images/plus1.svg"
              title="Create"
              onClick={() => {
                setShowPopup(!showPopup);
                trackCreateCampaignClick(); // Track create campaign
                localStorage.setItem("refreshCount", 0);
              }}
              active={true}
            />
            <Headerbtn
              imgsrc="/assets/images/duplicate.svg"
              title="Rules"
              onClick={() => setShowRulesPopup(!showRulesPopup)}
            />
            </WhenPermitted>
            <div className="hidden">
              <Tag
                changeTagsData={changeTagsData}
                platform={"flipkart"}
                account={account}
                data_level={"campaign"}
                key={1}
              />
            </div>
          </>
        )}
      </div>
      {renderEditComponent()}
      {showRulesPopup && <CreateRulePopup setOpenState={setShowRulesPopup} />}
      {showPopup && <CreateCampaignPopup setOpenState={setShowPopup} />}
      {showDuplicateDialog && (
        <DialogBox
          title="Confirmation"
          buttonName="Accept"
          onAccept={handleDialogApply}
          onCancel={handleDialogCancel}
        >
          {actionName}
        </DialogBox>
      )}

      {keywordPopup && <AddKeywords setOpenState={setKeywordPopup} />}
      {keywordErrorPopup && (
        <DialogBox
          buttonName="OK"
          title="Error"
          onAccept={() => setKeywordErrorPopup(false)}
        >
          Select atleast one campaign from Campaign tab
        </DialogBox>
      )}
    </>
  );
};

const FlipkartEditActionHeader = ({
  selectedCheckBox,
  tabName,
  removeSelected,
  headerState,
  setHeaderState,
  handleRemoveKeyword,
  changeTagsData,
  account,
  actionError,
  setActionError,
  abortedCampaigns,
  setAbortedCampaigns,
  checkAbortedCampaigns,
  plaAdgroups,
  headers,
}) => {
  const dispatch = useDispatch();

  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showRemoveKeywordDialog, setShowRemoveKeywordDialog] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isSelecetedPinned, setIsSelectedPinned] = useState("false");
  const [currentAction, setCurrentAction] = useState(null);
  const [showBulkPOpup, setShowBulkPopup] = useState(false);

  const checkAllAborted = () => {
    return abortedCampaigns === selectedCheckBox[tabName]?.length;
  };

  const checkGrouping = () => {
    const checkedHeader = headers.map((item) => {
      if (item.checked) {
        return item.value;
      }
    });

    if (tabName === "keyword") {
      if (
        (checkedHeader.includes("campaign_name") ||
          checkedHeader.includes("campaign_id")) &&
        (checkedHeader.includes("ad_group_name") ||
          checkedHeader.includes("ad_group_id"))
      ) {
        return true;
      }
    }

    return false;
  };

  const handleStatusAction = async (status) => {
    try {
      let action_type;
      let filterAborted;
      if (tabName === "campaign") {
        action_type = "campaign";

        filterAborted = selectedCheckBox[tabName]?.filter((item) => {
          return item.campaign_status !== "ABORTED";
        });
      } else if (tabName === "adgroup" || tabName === "keyword") {
        action_type = "adgroup";

        filterAborted = selectedCheckBox[tabName]?.filter((item) => {
          return (
            item.campaign_status !== "ABORTED" &&
            item.ad_group_status !== "ABORTED"
          );
        });
      }

      let data = filterAborted.map((item) => {
        return {
          ad_group_id: item.ad_group_id,
          campaign_id: [item.campaign_id],

          campaign_name: [item.campaign_name],
          action: status,
          action_type: action_type,
          segment: item.segment,
          account_id: item.account_id,
          platform_id: item.platform_id,
          platform: item.platform,
          account: item.account,
          action_message: `${status} ${tabName}`,
          action_status: 10,
          client_id: localStorage.getItem("client_id"),
          media_type: "Flipkart",
          ...(tabName === "adgroup" && {ad_group_name : item.ad_group_name} ),

        };
      });

      if (tabName === "keyword") {
        data = filterAborted.map((item) => {
          return {
            ad_group_id: item.ad_group_id,
            campaign_id: [item.campaign_id],
            keyword: item.keyword,
            keywords: item.keyword,
            match_type: item.keyword_match_type === "EXACT" ? "E" : "B",
            campaign_name: [item.campaign_name],
            action: status === "enable" ? "add_keyword" : "remove_keyword",
            action_type: "campaign",
            segment: item.segment,
            account_id: item.account_id,
            platform_id: item.platform_id,
            platform: item.platform,
            account: item.account,
            action_message: ` ${item.keyword} keyword ${status}d`,
            action_status: 10,
            client_id: localStorage.getItem("client_id"),
            media_type: "Flipkart",
            ad_group_name: item.ad_group_name,
            ...(item.keyword_match_type === "EXACT" && {exact_keyword : item.keyword} ),
            ...(item.keyword_match_type === "PHRASE" && {phrase_keyword : item.keyword} )
          };
        });
      }

      setActionLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setActionLoading(false);
      if (res?.status === 200) {
        dispatch(setToastMessageHandler(res?.data?.status?.message, true));
        dispatch({
          type: ActionType.RECALLCAMPAIGNPAPI,
          payload: true,
        });
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }

      removeSelected();
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
      setActionLoading(false);
      removeSelected();
    }
  };

  useEffect(() => {
    let notPinned = selectedCheckBox?.campaign?.filter((item) => {
      return item["flipkart_supermart_campaign.pin"] == 0;
    });

    if (notPinned?.length > 0) {
      setIsSelectedPinned(false);
    } else {
      setIsSelectedPinned(true);
    }
  }, [selectedCheckBox]);

  const handlePin = async () => {
    const campIds = selectedCheckBox?.campaign?.map((item) => item.campaign_id);

    const data = {
      campaign_id: campIds,
      pin_status: !isSelecetedPinned,
    };

    const result = await _POST(FLIPKART_CAMAPIGN_PIN, data);
    if (result?.status === 200) {
      dispatch(
        setToastMessageHandler(
          isSelecetedPinned ? "Unpinned Successfully" : "Pinned Successfully",
          true
        )
      );

      setIsSelectedPinned(!isSelecetedPinned);

      dispatch({
        type: ActionType.RECALLCAMPAIGNPAPI,
        payload: true,
      });
    } else {
      dispatch(setToastMessageHandler("Failed to perform action", false));
    }
  };

  return (
    <div>
      <div className="flex items-center ">
        <p className="pt-5">
          {selectedCheckBox[tabName]?.length} {tabName} selected:
        </p>

        {tabName === "campaign" && (
          <Headerbtn
            btnStyle={{
              backgroundColor: isSelecetedPinned ? "#0081F7" : "",
            }}
            imgsrc="/assets/images/pin.svg"
            hoverImgSrc="/assets/images/pin-white.svg"
            onClick={() => handlePin()}
            disabled={actionLoading}
          />
        )}
        {["campaign", "adgroup", "keyword"].includes(tabName) && (
          <Headerbtn
            title={
              currentAction === "enable" && actionLoading ? (
                <CustomSpinner />
              ) : (
                "Enable"
              )
            }
            onClick={() => {
              if (_.size(selectedCheckBox[tabName]) > 50) {
                setShowBulkPopup(true);
                return;
              }
              setCurrentAction("enable");
              setCurrentStatus("enable");
              setShowStatusDialog(true);
            }}
            disabled={
              actionLoading ||
              checkAllAborted() ||
              (tabName === "keyword" && !checkGrouping())
            }
          />
        )}
        {["campaign", "adgroup", "keyword"].includes(tabName) && (
          <Headerbtn
            title={
              currentAction === "pause" && actionLoading ? (
                <CustomSpinner />
              ) : (
                "Pause"
              )
            }
            onClick={() => {
              if (_.size(selectedCheckBox[tabName]) > 50) {
                setShowBulkPopup(true);
                return;
              }
              setCurrentAction("pause");
              setCurrentStatus("pause");
              setShowStatusDialog(true);
            }}
            disabled={
              actionLoading ||
              checkAllAborted() ||
              (tabName === "keyword" && !checkGrouping())
            }
          />
        )}
        {["campaign", "adgroup"].includes(tabName) && (
          <Headerbtn
            title={
              currentAction === "terminate" && actionLoading ? (
                <CustomSpinner />
              ) : (
                "Abort"
              )
            }
            onClick={() => {
              if (_.size(selectedCheckBox[tabName]) > 50) {
                setShowBulkPopup(true);
                return;
              }
              setCurrentAction("terminate");
              setCurrentStatus("terminate");
              setShowStatusDialog(true);
            }}
            disabled={actionLoading || checkAllAborted()}
          />
        )}
        {tabName === "adgroup" && (
          <Headerbtn
            title="Add Keyword"
            onClick={() => {
              if (_.size(selectedCheckBox[tabName]) > 50) {
                setShowBulkPopup(true);
                return;
              }
              setHeaderState("add_keyword");
            }}
            disabled={actionLoading || checkAllAborted()}
          />
        )}
        {/* {tabName === "keyword" && (
          <Headerbtn
            title="Remove Keyword"
            onClick={() => {
              setShowRemoveKeywordDialog(true);
            }}
            disabled={actionLoading || checkAllAborted()}
          />
        )} */}
        {(tabName === "campaign" || tabName === "adgroup") && (
          <Headerbtn
            title="Set Budget"
            onClick={() => {
              if (_.size(selectedCheckBox[tabName]) > 50) {
                setShowBulkPopup(true);
                return;
              }
              setHeaderState("change_budget");
            }}
            disabled={
              actionLoading ||
              checkAllAborted() ||
              (plaAdgroups === selectedCheckBox?.adgroup?.length &&
                tabName === "adgroup")
            }
          />
        )}
        {(tabName === "campaign" || tabName === "adgroup") && (
          <Headerbtn
            title="Set End Date"
            onClick={() => {
              if (_.size(selectedCheckBox[tabName]) > 50) {
                setShowBulkPopup(true);
                return;
              }
              setHeaderState("change_end_date");
            }}
            disabled={
              actionLoading ||
              checkAllAborted() ||
              (plaAdgroups === selectedCheckBox?.adgroup?.length &&
                tabName === "adgroup")
            }
          />
        )}

        {tabName === "campaign" && (
          <Tag
            changeTagsData={changeTagsData}
            platform={"flipkart"}
            account={account}
            data_level={"campaign"}
            key={1}
          />
        )}

        <img
          className="ml-4 cursor-pointer px-3 py-2 mt-4 rounded shadow-sm hover:bg-[#0081F7] "
          onClick={() => removeSelected()}
          src="/assets/images/x.svg"
        />
        {showStatusDialog && (
          <DialogBox
            title="Confirmation"
            buttonName="Accept"
            onAccept={() => {
              handleStatusAction(currentStatus);
              setShowStatusDialog(false);
            }}
            onCancel={() => {
              setShowStatusDialog(false);
            }}
          >
            {abortedCampaigns
              ? `${abortedCampaigns} out of ${
                  selectedCheckBox[tabName]?.length
                } ${tabName}${abortedCampaigns === 1 ? "" : "s"} are aborted.\n
              So only ${selectedCheckBox[tabName]?.length - abortedCampaigns}
            ${tabName}
            ${selectedCheckBox[tabName]?.length - abortedCampaigns ? "" : "s"}
            will get ${currentStatus}d. are you sure you want to proceed?`
              : `${selectedCheckBox[tabName]?.length} ${tabName}${
                  selectedCheckBox[tabName]?.length === 1 ? "" : "s"
                } will get ${currentStatus}d. are you sure you want to proceed?`}
          </DialogBox>
        )}
        {showBulkPOpup && (
           <DialogBox
           title="ALERT"
           buttonName="OK"
           onAccept={() => {
             setShowBulkPopup(false);
           }}
         >
          {`Can't Perform Bulk Action on more than 50 ${tabName}`}
          </DialogBox>
        )}
        {showRemoveKeywordDialog && (
          <DialogBox
            title="Confirmation"
            buttonName="Accept"
            onAccept={() => {
              handleRemoveKeyword();
              setShowRemoveKeywordDialog(false);
            }}
            onCancel={() => {
              setShowRemoveKeywordDialog(false);
            }}
          >
            {abortedCampaigns
              ? `${abortedCampaigns} out of ${
                  selectedCheckBox[tabName]?.length
                } ${tabName}${
                  abortedCampaigns === 1 ? "" : "s"
                } adgroups are aborted.\n
              So only ${selectedCheckBox[tabName]?.length - abortedCampaigns}
            ${tabName}
            ${selectedCheckBox[tabName]?.length - abortedCampaigns ? "" : "s"}
            will be removed. are you sure you want to proceed?`
              : `${selectedCheckBox[tabName]?.length} ${tabName}${
                  selectedCheckBox[tabName]?.length === 1 ? "" : "s"
                } will be removed. are you sure you want to proceed?`}
          </DialogBox>
        )}
      </div>
      {actionError && <p className="text-red-500 text-[11px]">{actionError}</p>}
    </div>
  );
};

const FlipkartAddKeywordHeader = ({
  selectedCheckBox,
  tabName,
  handleAddKeyword,
  setHeaderState,
  loading,
  abortedCampaigns,
}) => {
  const [keyword, setKeyword] = useState("");
  const [matchType, setMatchType] = useState("exact");
  const [showDialog, setShowDialog] = useState(false);

  const cancelButton = () => {
    setKeyword("");
    setHeaderState("all_actions");
  };

  return (
    <div className="row">
      <div className="flex items-center pt-5">
        <p className="">
          {selectedCheckBox[tabName]?.length} {tabName} selected:
        </p>
        <input
          className="border mx-1  h-8 rounded pl-2"
          autoFocus="autoFocus"
          type="text"
          placeholder="Enter Keyword Name"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          disabled={loading}
        />
        <select
          className="h-8 rounded px-4 border text-sm  border-gray-300 mr-3 focus:border-blue-500 focus:outline-none"
          value={matchType}
          onChange={(e) => setMatchType(e.target.value)}
          disabled={loading}
        >
          <option value="exact">EXACT</option>
          <option value="broad">PHRASE</option>
        </select>
        <button
          className={
            !keyword || keyword === undefined
              ? "cursor-not-allowed apply_btn_flipkart_disable"
              : "apply_btn_flipkart"
          }
          onClick={() => setShowDialog(true)}
          disabled={(!keyword || keyword === undefined) && true}
        >
          {loading ? (
            <CustomSpinner
              style={{
                borderColor: "#ffffff",
                height: "16px",
                width: "16px",
              }}
            />
          ) : (
            "Add Keyword"
          )}
        </button>
        <button className="cancel_btn_flipkart" onClick={() => cancelButton()}>
          Cancel
        </button>{" "}
      </div>
      {showDialog && (
        <DialogBox
          title="Confirmation"
          buttonName="Accept"
          onAccept={() => {
            handleAddKeyword(keyword, matchType);
            setShowDialog(false);
          }}
          onCancel={() => {
            setShowDialog(false);
          }}
        >
          {abortedCampaigns
            ? `${abortedCampaigns} out of ${
                selectedCheckBox[tabName]?.length
              } ${tabName}${abortedCampaigns === 1 ? "" : "s"} are aborted.\n
              So ${keyword} will be added to only ${
                selectedCheckBox[tabName]?.length - abortedCampaigns
              }
            ${tabName}
            ${selectedCheckBox[tabName]?.length - abortedCampaigns ? "" : "s"}
          . are you sure you want to proceed?`
            : `${keyword} will be added to ${
                selectedCheckBox[tabName]?.length
              } ${tabName}${
                selectedCheckBox[tabName]?.length === 1 ? "" : "s"
              }. are you sure you want to proceed?`}
        </DialogBox>
      )}
    </div>
  );
};

const FlipkartChangeBudgetHeader = ({
  selectedCheckBox,
  tabName,
  handleChangeBudget,
  setHeaderState,
  loading,
  actionError,
  setActionError,
  abortedCampaigns,
  plaAdgroups,
}) => {
  const [budget, setBudget] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const cancelButton = () => {
    setBudget(null);
    setHeaderState("all_actions");
    setActionError(null);
  };

  const getMaxBudgetOfSelectedcampaigns = () => {
    let max = 0;
    let column =
      tabName === "campaign" ? "campaign_edit_budget" : "ad_group_edit_budget";

    selectedCheckBox[tabName]?.forEach((item) => {
      if (tabName === "campaign" && item.campaign_status !== "ABORTED") {
        if (item[column] > max) {
          max = item[column];
        }
      } else if (item.ad_group_status && item.campaign_status !== "ABORTED") {
        if (item[column] > max) {
          max = item[column];
        }
      }
    });

    return max;
  };

  return (
    <div className="row">
      <div className="flex items-center pt-5">
        <p className="">
          {selectedCheckBox[tabName]?.length} {tabName} selected:
        </p>
        <div>
          <div className="flex items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowDialog(true);
              }}
              className="flex items-center"
            >
              <input
                className="border mx-1  h-8 rounded pl-2"
                autoFocus="autoFocus"
                type="number"
                placeholder="Enter Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={loading}
              />
              <button
                className={
                  !budget || budget === undefined
                    ? "cursor-not-allowed apply_btn_flipkart_disable"
                    : "apply_btn_flipkart"
                }
                disabled={(!budget || budget === undefined) && true}
              >
                {loading ? (
                  <CustomSpinner
                    style={{
                      borderColor: "#ffffff",
                      height: "16px",
                      width: "16px",
                    }}
                  />
                ) : (
                  "Update"
                )}
              </button>
              <button
                className="cancel_btn_flipkart"
                onClick={() => cancelButton()}
              >
                Cancel
              </button>{" "}
            </form>
          </div>

          {actionError && (
            <p className="text-red-500 text-[11px]">{actionError}</p>
          )}
        </div>
      </div>
      {showDialog && (
        <DialogBox
          title="Confirmation"
          buttonName="Accept"
          onAccept={() => {
            handleChangeBudget(budget);
            setShowDialog(false);
          }}
          onCancel={() => {
            setShowDialog(false);
          }}
        >
          {abortedCampaigns
            ? `${abortedCampaigns} out of ${
                selectedCheckBox[tabName]?.length
              } ${tabName}${abortedCampaigns === 1 ? "" : "s"} are aborted.\n
              So only ${selectedCheckBox[tabName]?.length - abortedCampaigns}
            ${tabName}
            ${selectedCheckBox[tabName]?.length - abortedCampaigns ? "" : "s"}
            budget will be changed to ₹${budget}. are you sure you want to proceed?`
            : `${selectedCheckBox[tabName]?.length} ${tabName}${
                selectedCheckBox[tabName]?.length === 1 ? "" : "s"
              } budget will be changed to ₹${budget}. are you sure you want to proceed?`}
        </DialogBox>
      )}
    </div>
  );
};

const FlipkartChangeEndDate = ({
  selectedCheckBox,
  tabName,
  handleChangeEndDate,
  setHeaderState,
  loading,
  abortedCampaigns,
}) => {
  const [endDate, setEndDate] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const cancelButton = () => {
    setEndDate(null);
    setHeaderState("all_actions");
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const hours = today.getHours();
    const min = today.getMinutes();

    return `${year}-${month}-${day}T${hours}:${min}`;
  };

  const formatedDate = (date) => {
    if (date === "Till budget ends") {
      return date;
    }

    return moment(date).format("DD/MM/YYYY, h:mm:ss a");
  };

  return (
    <div className="row">
      <div className="flex items-center pt-5">
        <p className="mr-4">
          {selectedCheckBox[tabName]?.length} {tabName} selected:
        </p>
        <div className="flex items-center gap-2">
          <input
            autoFocus="autofocus"
            className="w-52 border pl-2 py-1"
            disabled={endDate === "Till budget ends" ? true : false}
            type="datetime-local"
            min={getTodayDate()}
            value={endDate}
            onChange={(e) => {
              // eslint-disable-next-line no-console
              console.log(e.target.value);
              setEndDate(e.target.value);
            }}
          />
          {tabName === "campaign" && (
            <div className="flex items-center text-lg">
              <input
                type="checkbox"
                id="tbe"
                name="tbe"
                checked={endDate === "Till budget ends" ? true : false}
                onChange={() => {
                  setEndDate(
                    endDate === "Till budget ends"
                      ? getTodayDate()
                      : "Till budget ends"
                  );
                }}
              />
              <label htmlFor="tbe">Till budget ends</label>
            </div>
          )}
        </div>
        <button
          className={
            !endDate || endDate === undefined
              ? "cursor-not-allowed apply_btn_flipkart_disable"
              : "apply_btn_flipkart"
          }
          onClick={() => setShowDialog(true)}
          disabled={(!endDate || endDate === undefined) && true}
        >
          {loading ? (
            <CustomSpinner
              style={{
                borderColor: "#ffffff",
                height: "16px",
                width: "16px",
              }}
            />
          ) : (
            "Update"
          )}
        </button>
        <button className="cancel_btn_flipkart" onClick={() => cancelButton()}>
          Cancel
        </button>{" "}
      </div>
      {showDialog && (
        <DialogBox
          title="Confirmation"
          buttonName="Accept"
          onAccept={() => {
            handleChangeEndDate(endDate);
            setShowDialog(false);
          }}
          onCancel={() => {
            setShowDialog(false);
          }}
        >
          {abortedCampaigns
            ? `${abortedCampaigns} out of ${
                selectedCheckBox[tabName]?.length
              } ${tabName}${abortedCampaigns === 1 ? "" : "s"} are aborted.\n
              So only ${selectedCheckBox[tabName]?.length - abortedCampaigns}
            ${tabName}
            ${selectedCheckBox[tabName]?.length - abortedCampaigns ? "" : "s"}
            end date will be changed to ${formatedDate(
              endDate
            )}. are you sure you want to proceed?`
            : `${selectedCheckBox[tabName]?.length} ${tabName}${
                selectedCheckBox[tabName]?.length === 1 ? "" : "s"
              } end date will be changed to ${formatedDate(
                endDate
              )}. are you sure you want to proceed?`}
        </DialogBox>
      )}
    </div>
  );
};

const CustomSpinner = (props) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="action-loader" {...props}></span>
        <p>Loading...</p>
      </div>
    </>
  );
};

export default CampaigntableHeader;
