/* eslint-disable no-unused-vars */
import React, { useState, useEffect, memo, useRef } from "react";
import { _GET, _PATCH, _POST } from "../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import _ from "lodash";
import {
  BLINKIT_TAGS,
  BLINKIT_ATTACH_TAG,
  APPLICATION_ROUTES,
  RPA_ACTION_EDIT,
  FLIPKART_CAMAPIGN_PIN,
  FLIPKART_FUNNEL_COUNT,
  PERMISSIONS,
} from "../../../utils/constants";
import LoaderSpinner from "../loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import ActionType from "../../../redux/types";
import { useHistory } from "react-router";
import { convertDateFormartToMMDDYYYY, thStyle } from "../../../utils/helpers";
import "./style.css";
import StatusSelectDropdown from "../dropdown/StatusSelectDropdown";
import PinMenu from "../PinMenu/PinMenu";
import moment from "moment";
import SelectedTagPopup from "../Popups/SelectedTagPopup";
import NewTagPopup from "../Popups/NewTagPopup";
import WhenPermitted from "../WhenPermitted";

const FlipkartSearchTable = ({
  headers,
  bodyContent,
  footer,
  summaryData,
  loading,
  sortData,
  totalData,
  isCheckBoxRequired,
  handleSelectedData,
  name,
  tabName,
  setDataLIMIT,
  setBodyData,
  sort,
  initProcess,
  download,
  startDate,
  endDate,
  account,
}) => {
  let currency = localStorage.getItem("currency");
  const { expandTable } = useSelector((state) => state?.CommonReducer);
  // React.useEffect(() => {
  //   console.log("sortsort", sort, Object.keys(sort)[0], Object.values(sort)[0]);
  // }, [sort]);
  const [campaignId, setCampaignId] = useState("");
  // holds the data of selected check boxes from the redux
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  let { recallCampaign } = useSelector((state) => state?.RecallCampaignReducer);
  //hold the tag data from the redux
  const { tagData } = useSelector((state) => state?.TagReducer);
  //holds the value of tags which are attached to a campaign
  const [addedTags, setAddedTags] = useState([]);
  // handles the tags to be attached to a campaign
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  // const [showPopupOne, setShowPopupOne] = useState();
  // const [showPopupTwo, setShowPopupTwo] = useState();
  const [recallTags, setRecallTags] = useState({});

  const [showSelectedTagPopup, setShowSelectedTagPopup] = useState(false);
  const [showNewTagPopup, setShowNewTagPopup] = useState(false);
  const [schedulerPosition, setSchedulerPosition] = useState({
    top: 0,
    left: 0,
  });
  const userPermissions = useSelector(
    (state) => state?.permissionsReducer || []
  );
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CAMPAIGN_ACTIONS,
    platform: "flipkart",
  });

  const checkGrouping = () => {
    const checkedHeader = headers.map((item) => {
      if (item.checked) {
        return item.value;
      }
    });

    if (tabName === "placement") {
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

  const tagPosition = (e) => {
    // Calculate button position relative to the viewport
    const buttonRect = e.target.getBoundingClientRect();
    setSchedulerPosition({
      top: buttonRect.bottom,
      left: buttonRect.left,
    });
  };

  let allTabSelectedCheckBox = selectedCheckBox;
  selectedCheckBox =
    selectedCheckBox &&
    Object.prototype.hasOwnProperty.call(selectedCheckBox, tabName)
      ? selectedCheckBox[tabName]
      : [];
  const dispatch = useDispatch();
  const handleCheckBox = async (e, data) => {
    // checked state of the checkbox
    const isChecked = e.target.checked;
    let updatedIds = allTabSelectedCheckBox;

    const tabOrders = ["fsn", "placement", "keyword", "creative"];

    // if the checkbox is selected, add the data to the previous selectedData array
    if (isChecked) {
      updatedIds[tabName] = [...selectedCheckBox, data];

      if (tabName === "campaign" && updatedIds.campaign.length === 1) {
        updatedIds.adgroup = [];

        tabOrders.forEach((tab) => (updatedIds[tab] = []));
      } else if (tabName === "adgroup" && updatedIds.adgroup.length === 1) {
        tabOrders.forEach((tab) => (updatedIds[tab] = []));
      }

      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });
    } else {
      // if the checkbox is unselected, remove the data from the previous selectedData array
      updatedIds[tabName] = selectedCheckBox?.filter(
        (item) => item.id !== data.id
      );

      if (tabName === "campaign") {
        updatedIds.adgroup = [];

        tabOrders.forEach((tab) => (updatedIds[tab] = []));
      } else if (tabName === "adgroup") {
        tabOrders.forEach((tab) => (updatedIds[tab] = []));
      }

      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });
    }

    if (updatedIds[tabName].length >= 0) {
      // eslint-disable-next-line no-console
      console.log("uIds", updatedIds);

      let campIds = [];
      let adgroupIds = [];

      if (updatedIds?.campaign && updatedIds.campaign.length > 0) {
        campIds = updatedIds.campaign.map((item) => item.campaign_id);
      }

      if (updatedIds?.adgroup && updatedIds.adgroup.length > 0) {
        adgroupIds = updatedIds.adgroup.map((item) => item.ad_group_id);
      }

      let payload = {
        data: {
          campaigns: campIds,
          adgroups: adgroupIds,
        },
        startDate,
        endDate,
        account,
      };

      // let countData = await _POST(FLIPKART_FUNNEL_COUNT, payload);
      // dispatch({
      //   type: ActionType.FLIPKART_FUNNEL_COUNT,
      //   payload: { ...countData.data.data },
      // });
    } else {
      // dispatch({
      //   type: ActionType.FLIPKART_FUNNEL_COUNT,
      //   payload: {},
      // });
    }
    handleSelectedData(updatedIds);
  };

  // useEffect(() => {
  //   (async () => {
  //     let countData = await _POST(FLIPKART_FUNNEL_COUNT, {
  //       data: {},
  //       startDate,
  //       endDate,
  //       account,
  //     });
  //     dispatch({
  //       type: ActionType.FLIPKART_FUNNEL_COUNT,
  //       payload: { ...countData.data.data },
  //     });
  //   })();
  // }, [account]);

  const handleAllCheckBox = async (e, data) => {
    // checked state of the checkbox
    const isChecked = e.target.checked;
    let updatedIds = allTabSelectedCheckBox;
    // if the checkbox is selected, add the data to the previous selectedData array
    if (isChecked) {
      updatedIds[tabName] = [...data];
      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });

      let campIds = [];
      let adgroupIds = [];

      if (updatedIds?.campaign && updatedIds.campaign.length > 0) {
        campIds = updatedIds.campaign.map((item) => item.campaign_id);
      }

      if (updatedIds?.adgroup && updatedIds.adgroup.length > 0) {
        adgroupIds = updatedIds.adgroup.map((item) => item.ad_group_id);
      }

      let payload = {
        data: {
          campaigns: campIds,
          adgroups: adgroupIds,
        },
        startDate,
        endDate,
        account,
      };

      // let countData = await _POST(FLIPKART_FUNNEL_COUNT, payload);
      // dispatch({
      //   type: ActionType.FLIPKART_FUNNEL_COUNT,
      //   payload: { ...countData.data.data },
      // });
    } else {
      // if the checkbox is unselected, remove the data from the previous selectedData array
      updatedIds[tabName] = [];
      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });
      dispatch({
        type: ActionType.AMAZON_CAMPAIGN_COUNT,
        payload: {},
      });
    }
    handleSelectedData(updatedIds);
  };

  const isCampaignAborted = (row) => {
    if (
      tabName === "campaign" &&
      row.campaign_status?.toUpperCase() === "ABORTED"
    ) {
      return true;
    }

    if (
      (["adgroup", "placement", "keyword"].includes(tabName) &&
        row.campaign_status?.toUpperCase() === "ABORTED") ||
      row.ad_group_status?.toUpperCase() === "ABORTED"
    ) {
      return true;
    }

    return false;
  };
  useEffect(() => {
    handleSelectedData(selectedCheckBox);
  }, []);

  // TAG APIs
  // const fetchAllTagsApi = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await _GET(
  //       `${BLINKIT_TAGS}?platform=flipkart&data_level=campaign`
  //     );
  //     setLoading(false);
  //     dispatch({
  //       type: ActionType.TAG,
  //       payload: response?.data?.data?.result,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   fetchAllTagsApi();
  // }, []);

  const handleTagCheckboxChange = (checked, tagId) => {
    if (checked) {
      setSelectedTagIds((prevSelectedTagIds) => [...prevSelectedTagIds, tagId]);
    } else {
      setSelectedTagIds((prevSelectedTagIds) =>
        prevSelectedTagIds.filter((id) => id !== tagId)
      );
    }
  };

  // handles the check boxes when the tags are being updated
  const handleEditTagCheckboxChange = (e, tagId) => {
    if (e.target.checked) {
      setAddedTags((prevSelectedTagIds) => [
        ...prevSelectedTagIds,
        tagId.toString(), // Convert the tagId to string
      ]);
      setSelectedTagIds((prevSelectedTagIds) => [
        ...prevSelectedTagIds,
        ...addedTags,
        tagId.toString(), // Convert the tagId to string
      ]);
    } else {
      setAddedTags((prevSelectedTagIds) =>
        prevSelectedTagIds.filter((id) => id !== tagId.toString())
      );

      setSelectedTagIds((prevSelectedTagIds) =>
        prevSelectedTagIds.filter((id) => id !== tagId.toString())
      );
    }
  };

  const handleAddButtonClick = async (e, type) => {
    try {
      let data;
      if (type == "newTag") {
        data = {
          tag_id: [...new Set(selectedTagIds)],
        };
      } else {
        data = {
          tag_id: [...new Set(addedTags)],
        };
      }
      setLoading(true);

      const result = await _PATCH(`${BLINKIT_ATTACH_TAG}/${campaignId}`, data);
      if (result?.status === 200) {
        dispatch(
          setToastMessageHandler("Tag action performed successfully", true)
        );
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
      setRecallTags(result?.data?.data?.result);
      // console.log(bodyContent, "body");
      if (result.data.status.code == 200 && result?.data?.data?.result) {
        let tempData = bodyContent;
        const foundIndex = tempData.findIndex(
          (x) => x.campaign_id == campaignId
        );
        tempData[foundIndex].tag_id = result?.data?.data?.result.tag_id;
        if (result?.data?.data?.result.tag_id.length < 1) {
          delete tempData[foundIndex].tag_id;
        }
        setBodyData([...tempData]);
      }

      setLoading(false);
      //
      // init();
      setSelectedTagIds([]);
    } catch (error) {
      console.error(error);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  useEffect(() => {
    if (tabName === "campaign") {
      dispatch({
        type: ActionType.TOTAL_CAMPAIGN,
        payload: totalData,
      });
    }

    if (tabName === "adgroup") {
      dispatch({
        type: ActionType.TOTAL_AMS_ADGROUP_COUNT,
        payload: totalData,
      });
    }
    if (tabName === "keyword") {
      dispatch({
        type: ActionType.TOTAL_KEYWORD_COUNT,
        payload: totalData,
      });
    }
    if (tabName === "fsn") {
      dispatch({
        type: ActionType.TOTAL_ASINS,
        payload: totalData,
      });
    }
    if (tabName === "placement") {
      dispatch({
        type: ActionType.TOTAL_PLACEMENTS,
        payload: totalData,
      });
    }
    if (tabName === "creative") {
      dispatch({
        type: ActionType.TOTAL_CREATIVES,
        payload: totalData,
      });
    }
  }, [tabName, totalData]);

  useEffect(() => {
    // console.log(recallTags, "recall Camapign");
  }, [recallTags]);

  React.useEffect(() => {
    if (recallCampaign == true) {
      setBodyData([]);

      initProcess();
    }
    dispatch({
      type: ActionType.RECALLCAMPAIGNPAPI,
      payload: false,
    });
  }, [recallCampaign]);

  const handleScroll = (e) => {
    if (bodyContent?.length < totalData) {
      const bottom =
        Math.abs(
          e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
        ) <= 1;

      if (bottom && !loading) {
        setDataLIMIT();
      }
    }
  };

  let floatArr = [
    "cvr",
    "direct_cvr",
    "indirect_cvr",
    "roi",
    "direct_roi",
    "indirect_roi",
    "ctr",
    "direct_ctr",
    "indirect_ctr",
    "aov",
    "direct_aov",
    "indirect_aov",
    "cpc",
    "direct_cpc",
    "indirect_cpc",
    "cpm",
    "direct_cpm",
    "indirect_cpm",
    "cpa",
    "direct_cpa",
    "indirect_cpa",
  ];

  const dateArr = [
    "start_date",
    "end_date",
    "ad_group_start_date",
    "ad_group_end_date",
  ];

  function ValueFormatter({ row, val, name }) {
    let value = row[val];
    if (floatArr?.indexOf(val) > -1) {
      value = row[val] || 0;
    } else if (value === null) {
      value = "N/A";
    } else if (dateArr.includes(val)) {
      value = convertDateFormartToMMDDYYYY(row[val]);
    } else {
      if (val === "platform") {
        value = row[val] === "SM" ? "Supermart" : "Flipkart";
      } else if (val === "campaign_name" && name == "campaign") {
        value = <EditCampaign row={row} />;
      }
    }
    return value;
  }
  function SummaryValueFormatter({ row, val }) {
    let value = row[val];
    if (value === `${currency}` || value === `0%`) {
      return (value = "");
    } else {
      return value;
    }
  }
  const history = useHistory();
  function EditCampaign({ row }) {
    let campaign_id = row.campaign_id;
    return (
      <>
        {row.campaign_name}

        <button
          onClick={() =>
            history.push(APPLICATION_ROUTES.EDITCAMPAIGN, campaign_id)
          }
        >
          <div className="pr-1">
            <img
              className="header-buttons mr-1"
              src={"/assets/images/edit.svg"}
              alt=""
            />
          </div>
        </button>
      </>
    );
  }
  React.useEffect(() => {
    // console.log("AddButtonState 1", addedTags, addedTags.length === 0);
  }, [addedTags]);
  React.useEffect(() => {
    // console.log(
    //   "AddButtonState 2",
    //   selectedTagIds,
    //   selectedTagIds.length,
    //   selectedTagIds.length === 0
    // );
  }, [selectedTagIds]);
  React.useEffect(() => {
    // console.log(
    //   "AddButtonState 3",
    //   addedTags.length,
    //   addedTags.length === 0,
    //   selectedTagIds.length,
    //   selectedTagIds.length === 0,
    //   addedTags.length + selectedTagIds.length <= 0
    // );
  }, [addedTags, selectedTagIds]);

  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(0);
    }
  };

  function TableCol({ row, name, rowIndex, totalLength }) {
    let rows = [];
    let perArray = ["ctr", "cvr"];
    let rupeeArray = ["cpc", "spend", "revenue", "aov", "campaign_budget"];
    const [editEndDateId, setEditEndDateId] = useState({});
    const [editEndDate, setEditEndDate] = useState(null);
    const [endDateError, setEndDateError] = useState(false);
    const [editBudgetId, setEditBudgetId] = useState({});
    const [editBudget, setEditBudget] = useState(null);
    const [budgetError, setBudgetError] = useState(false);
    const [currentRow, setCurrentRow] = useState({});

    const [editNameId, setEditNameId] = useState({});
    const [editName, setEditName] = useState(null);
    const [campaignNameError, setCampaignNameError] = useState(false);
    const [editPlacementBidId, setEditPlacementBidId] = useState({});
    const [editPlacementBid, setEditPlacementBid] = useState(null);
    const [placementBidError, setPlacementBidError] = useState(false);
    const [actionsLoading, setActionsLoading] = useState(false);

    const tabMainCol = {
      campaign: "campaign_name",
      adgroup: "ad_group_name",
      fsn: "product_name",
      keyword: "keyword",
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

    const showOptionByStatus = (currStatus) => {
      if (tabName === "keyword") {
        if (currStatus?.toLowerCase() === "live") {
          return [{ name: "Pause", status: "pause" }];
        } else {
          return [{ name: "Enable", status: "enable" }];
        }
      }

      switch (currStatus) {
        case "ABORTED":
          return [];
        case "PAUSED":
          return [
            { name: "Enable", status: "enable" },
            { name: "Abort", status: "terminate" },
          ];
        default:
          return [
            { name: "Pause", status: "pause" },
            { name: "Abort", status: "terminate" },
          ];
      }
    };

    // const checkInProgress = (row) => {
    //   if(currentRow.tabName === tabName){
    //     if(row.c)
    //   }
    // }

    const handleCampaignEndDate = async () => {
      try {
        // eslint-disable-next-line no-console
        console.log(editEndDate, ">>>>>>>>>>>>>>>.");
        if (editEndDate === undefined || !editEndDate) {
          setEndDateError("Enter End Date");
        } else {
          // eslint-disable-next-line no-console
          console.log("end Date changed");

          const data = [
            {
              ad_group_id: editEndDateId.ad_group_id,
              campaign_id: [editEndDateId.campaign_id],
              campaign_name: [editEndDateId.campaign_name],
              min_bid: editEndDateId?.min_bid,
              action: "set_end_date",
              action_type: tabName,
              segment: editEndDateId.segment,
              end_date:
                editEndDate === "Till budget ends"
                  ? "till_budget_end"
                  : editEndDate,
              account_id: editEndDateId.account_id,
              platform_id: editEndDateId.platform_id,
              platform: editEndDateId.platform,
              account: editEndDateId.account,
              action_message: `End Date Changed to ${editEndDate}`,
              action_status: 10,
              client_id: localStorage.getItem("client_id"),
              media_type: "Flipkart",
            },
          ];
          setActionsLoading(true);
          const res = await _POST(RPA_ACTION_EDIT, data);
          setActionsLoading(false);
          if (res?.status === 200) {
            setBodyData(
              bodyContent.map((row) => {
                if (
                  tabName === "campaign" &&
                  row.campaign_id === editEndDateId.campaign_id
                ) {
                  row.end_date =
                    editEndDate == "Till budget ends"
                      ? "Till budget ends"
                      : editEndDate.split("T")[0];

                  row.last_edited = moment().format("DD/MM/YYYY");
                } else if (
                  tabName === "adgroup" &&
                  row.ad_group_id === editEndDateId.ad_group_id
                ) {
                  row.ad_group_end_date =
                    editEndDate == "Till budget ends"
                      ? "Till budget ends"
                      : editEndDate.split("T")[0];
                  row.last_edited = moment().format("DD/MM/YYYY");
                }

                return row;
              })
            );
            dispatch(setToastMessageHandler(res?.data?.status?.message, true));
          } else {
            dispatch(setToastMessageHandler("Failed to perform action", false));
          }
        }
      } catch (error) {
        dispatch(setToastMessageHandler("Something went wrong!", false));
        setActionsLoading(false);
      } finally {
        setEndDateError(false);
        setEditEndDateId({});
        setEditEndDate("");
      }
    };

    const handleCampaignBudget = async (currentBudget, maxBudget) => {
      try {
        if (editBudget === undefined || !editBudget) {
          setBudgetError("Enter budget value");
          return;
        } else if (editBudget <= currentBudget) {
          setBudgetError(`Budget must be greater than ₹${currentBudget}`);
          return;
        } else if (editBudget < maxBudget) {
          setBudgetError(`Budget must be lesser than ₹${maxBudget}`);
          return;
        } else {
          // eslint-disable-next-line no-console
          console.log("budget changed");

          const data = [
            {
              ad_group_id: editBudgetId.ad_group_id,
              campaign_id:
                tabName === "campaign"
                  ? [editBudgetId.campaign_id]
                  : [editBudgetId.campaign_id],
              campaign_name: [editBudgetId.campaign_name],
              min_bid: editBudgetId?.min_bid,
              action: "set_budget",
              action_type: tabName,
              segment: editBudgetId.segment,
              set_value: editBudget,
              account_id: editBudgetId.account_id,
              platform_id: editBudgetId.platform_id,
              platform: editBudgetId.platform,
              account: editBudgetId.account,
              action_message: `Budget Changed to  ${currency}${editBudget}`,
              action_status: 10,
              client_id: localStorage.getItem("client_id"),
              media_type: "Flipkart",
            },
          ];

          setActionsLoading(true);
          const res = await _POST(RPA_ACTION_EDIT, data);
          setActionsLoading(false);
          if (res?.status === 200) {
            setBodyData(
              bodyContent.map((row) => {
                if (
                  tabName === "campaign" &&
                  row.campaign_id === editBudgetId.campaign_id
                ) {
                  row.campaign_budget =
                    "₹" + Number(editBudget).toLocaleString();
                  row.campaign_edit_budget = editBudget;
                  row.last_edited = moment().format("DD/MM/YYYY");
                } else if (
                  tabName === "campaign" &&
                  row.ad_group_id === editBudgetId.ad_group_id
                ) {
                  row.ad_group_budget =
                    "₹" + Number(editBudget).toLocaleString();
                  row.ad_group_edit_budget =
                    "₹" + Number(editBudget).toLocaleString();
                  row.last_edited = moment().format("DD/MM/YYYY");
                }

                return row;
              })
            );
            dispatch(setToastMessageHandler(res?.data?.status?.message, true));
          } else {
            dispatch(setToastMessageHandler("Failed to perform action", false));
          }

          setEditBudgetId({});
          setEditBudget(null);
          setBudgetError(false);
        }
      } catch (error) {
        dispatch(setToastMessageHandler("Something went wrong!", false));
        setActionsLoading(false);
        setEditBudgetId({});
        setEditBudget(null);
        setBudgetError(false);
      }
    };

    const handleCampaignPin = async ({ pinStatus, campaignId }) => {
      const data = {
        campaign_id: [campaignId],
        pin_status: pinStatus,
      };

      const result = await _POST(FLIPKART_CAMAPIGN_PIN, data);
      if (result.status === 200) {
        let tempData = bodyContent;
        const foundIndex = tempData.findIndex(
          (x) => x.campaign_id == data.campaign_id[0]
        );

        if (pinStatus) {
          tempData[foundIndex]["flipkart_supermart_campaign.pin"] = new Date();
        } else {
          tempData[foundIndex]["flipkart_supermart_campaign.pin"] = "";
        }

        tempData.sort((a, b) => {
          if (
            a["flipkart_supermart_campaign.pin"] ===
            b["flipkart_supermart_campaign.pin"]
          ) {
            return b.edit_spend - a.edit_spend;
          }

          return (
            b["flipkart_supermart_campaign.pin"] -
            a["flipkart_supermart_campaign.pin"]
          );
        });

        setBodyData([...tempData]);
      }
    };

    const handleStatus = async ({ status, statusFlag }) => {
      try {
        let itemType;
        switch (tabName) {
          case "campaign":
            // itemStatusFlag = statusFlag;
            itemType = "campaign";
            break;
          case "adgroup":
            // itemStatusFlag = adgroupStatusFlag;
            itemType = "adgroup";
            break;
          case "fsn":
            // itemStatusFlag = keywordStatusFlag;
            itemType = "fsnBanner";
            break;

          // default:
          //   itemStatusFlag = statusFlag;
          //   break;
        }
        let data = [
          {
            ad_group_id: statusFlag.ad_group_id,
            campaign_id: [statusFlag.campaign_id],

            campaign_name: [statusFlag.campaign_name],
            action: status,
            action_type: itemType,
            segment: statusFlag.segment,
            account_id: statusFlag.account_id,
            platform_id: statusFlag.platform_id,
            platform: statusFlag.platform,
            account: statusFlag.account,
            action_message: `${status} ${tabName}`,
            action_status: 10,
            client_id: localStorage.getItem("client_id"),
            media_type: "Flipkart",
            ...(tabName === "adgroup" && {
              ad_group_name: statusFlag.ad_group_name,
            }),
          },
        ];

        if (tabName === "keyword") {
          data = [
            {
              ad_group_id: statusFlag.ad_group_id,
              campaign_id: [statusFlag.campaign_id],
              keyword: statusFlag.keyword,
              keywords: statusFlag.keyword,
              ad_group_name: statusFlag.ad_group_name,
              match_type: statusFlag.keyword_match_type === "EXACT" ? "E" : "B",
              campaign_name: [statusFlag.campaign_name],
              action: status === "enable" ? "add_keyword" : "remove_keyword",
              action_type: "campaign",
              segment: statusFlag.segment,
              account_id: statusFlag.account_id,
              platform_id: statusFlag.platform_id,
              platform: statusFlag.platform,
              account: statusFlag.account,
              action_message: ` ${statusFlag.keyword} keyword ${status}d`,
              action_status: 10,
              client_id: localStorage.getItem("client_id"),
              media_type: "Flipkart",
              ...(statusFlag.keyword_match_type === "EXACT" && {
                exact_keyword: statusFlag.keyword,
              }),
              ...(statusFlag.keyword_match_type === "PHRASE" && {
                phrase_keyword: statusFlag.keyword,
              }),
            },
          ];
        }

        setActionsLoading(true);
        const res = await _POST(RPA_ACTION_EDIT, data);
        setActionsLoading(false);
        if (res?.status === 200) {
          dispatch({
            type: ActionType.RECALLCAMPAIGNPAPI,
            payload: true,
          });
          dispatch(setToastMessageHandler(res?.data?.status?.message, true));
        } else {
          dispatch(setToastMessageHandler("Failed to perform action", false));
        }
      } catch (error) {
        dispatch(setToastMessageHandler("Something went wrong!", false));
        setActionsLoading(false);
      }
    };

    const handleCampaignName = async (row) => {
      try {
        if (editName === "") {
          setCampaignNameError(
            "Campaign name cannot be empty and should be unique"
          );
        } else {
          setCampaignNameError(false);
          const data = [
            {
              ad_group_id: editNameId.ad_group_id,
              campaign_id: [editNameId.campaign_id],
              campaign_name: [editNameId.campaign_name],
              action: "set_name",
              action_type: "campaign",
              name: editName === undefined ? row.campaign_name : editName,
              segment: editNameId.segment,
              account_id: editNameId.account_id,
              platform_id: editNameId.platform_id,
              platform: editNameId.platform,
              account: editNameId.account,
              action_message: `campaign name changed to ${editName}`,
              action_status: 10,
              client_id: localStorage.getItem("client_id"),
              media_type: "Flipkart",
            },
          ];
          setActionsLoading(true);
          const res = await _POST(RPA_ACTION_EDIT, data);
          setActionsLoading(false);
          if (res?.status === 200) {
            setBodyData(
              bodyContent.map((row) => {
                if (row.campaign_id === editNameId.campaign_id) {
                  row.campaign_name =
                    editName === undefined ? row.campaign_name : editName;
                  row.last_edited = moment().format("DD/MM/YYYY");
                }

                return row;
              })
            );
            dispatch(setToastMessageHandler(res?.data?.status?.message, true));
          } else {
            dispatch(setToastMessageHandler("Failed to perform action", false));
          }
        }
      } catch (error) {
        dispatch(setToastMessageHandler("Something went wrong!", false));
        setActionsLoading(false);
      }
      // finally {
      //   setEditNameId({});
      //   setEditName(null);
      //   setCampaignNameError(false);
      // }
    };

    const handlePlacementBid = async () => {
      try {
        if (editPlacementBid === undefined || !editPlacementBid) {
          setPlacementBidError("Enter Placement Bid value");
        } else if (
          parseFloat(editPlacementBid) < parseFloat(editPlacementBidId.min_bid)
        ) {
          setPlacementBidError(
            `Bid should be greater than or equal to minimum bid - ₹${editPlacementBidId.min_bid}`
          );
          return;
        } else {
          // eslint-disable-next-line no-console
          console.log("min Bid changed");

          const data = [
            {
              ad_group_id: editPlacementBidId.ad_group_id,
              campaign_id: [editPlacementBidId.campaign_id],
              campaign_name: [editPlacementBidId.campaign_name],
              placement_bid: parseFloat(editPlacementBid),
              match_type: editPlacementBidId.placement_type,
              action: "placement",
              action_type: "campaign",
              ad_group_name: editPlacementBidId.ad_group_name,
              placement_type: editPlacementBidId.placement_type,
              segment: editPlacementBidId.segment,
              account_id: editPlacementBidId.account_id,
              platform_id: editPlacementBidId.platform_id,
              platform: editPlacementBidId.platform,
              account: editPlacementBidId.account,
              action_message: `Placement Bid Changed to ${editPlacementBid}`,
              action_status: 10,
              client_id: localStorage.getItem("client_id"),
              media_type: "Flipkart",
            },
          ];

          setActionsLoading(true);
          const res = await _POST(RPA_ACTION_EDIT, data);
          setActionsLoading(false);
          if (res?.status === 200) {
            setBodyData(
              bodyContent.map((row) => {
                if (row.id === editPlacementBidId.id) {
                  row.placement_bid = editPlacementBid;
                  row.last_edited = moment().format("DD/MM/YYYY");
                }

                return row;
              })
            );
            dispatch(setToastMessageHandler(res?.data?.status?.message, true));
          } else {
            dispatch(setToastMessageHandler("Failed to perform action", false));
          }

          setPlacementBidError(false);
          setEditPlacementBidId({});
          setEditPlacementBid("");
        }
      } catch (error) {
        dispatch(setToastMessageHandler("Something went wrong!", false));
        setActionsLoading(false);
        setPlacementBidError(false);
        setEditPlacementBidId({});
        setEditPlacementBid("");
      }
    };

    headers.map((item) => {
      if (item.showCol) {
        if (
          Object.prototype.hasOwnProperty.call(row, item.value) &&
          (item.value != "tag_id" || row[item.value]?.length > 0)
        ) {
          let init = (
            <td
              className={`py-2 ${
                item.value === "campaign_name" ? "" : "text-start"
              }`}
            >
              <div
                className={`text-left ${
                  item.value === "campaign_name" ? "text-start" : "text-left"
                }`}
              >
                <div>
                  <ValueFormatter row={row} val={item.value} name={name} />
                </div>
                {row?.compData &&
                  row?.deltaObj &&
                  row?.deltaObj[item?.value] && (
                    <div className="w-[73px] h-[22px] justify-start items-center gap-0.5 inline-flex">
                      <div className="text-black/opacity-40 text-[10px] font-normal font-['Inter'] leading-snug">
                        {row?.compData[item?.value]}
                      </div>
                      {row?.deltaObj[item?.value] < 0 && (
                        <div className="w-[41px] h-[15.11px] px-[6.13px] py-[0.77px] bg-orange-50 rounded-xl border border-red-300 justify-start items-center gap-[2.30px] flex">
                          <div className="w-[32.20px] text-orange-600 text-[9.20px] font-normal font-['Roboto'] leading-none">
                            {Math.abs(row?.deltaObj[item?.value])}%
                          </div>
                        </div>
                      )}

                      {row?.deltaObj[item?.value] >= 0 && (
                        <div className="w-[46px] h-[15.11px] px-[6.13px] py-[0.77px] bg-lime-50 rounded-xl border border-lime-200 justify-start items-center gap-[2.30px] flex">
                          <div className="text-lime-600 text-[9.20px] font-normal font-['Roboto'] leading-none">
                            {row?.deltaObj[item?.value]}%
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </td>
          );

          if (
            item.value === "tag_id" &&
            row[item.value] &&
            row[item.value].length > 0
          ) {
            const tagNames = row[item.value].map((id) => {
              const tag = tagData?.find((tag) => tag._id === id);
              return tag;
            });
            init = (
              <td>
                <div className="relative">
                  <div>
                    <div className=" whitespace-nowrap flex items-center border rounded-e-3xl rounded-s-3xl w-fit px-2 py-1 border-[#D9D9D9] bg-[#FAFAFA] ">
                      <div
                        style={{
                          backgroundColor: tagNames[0]?.color
                            ? tagNames[0]?.color
                            : tagNames[1]?.color,
                          width: "14px",
                          height: "14px",
                          borderRadius: "100%",
                          marginRight: "5px",
                          borderColor: "green",
                        }}
                      ></div>

                      <div
                        className="flex cursor-pointer "
                        onClick={(e) => {
                          if (!hasPermission) {
                            return;
                          }
                          setAddedTags(row.tag_id);
                          // setShowPopupOne(undefined);
                          // setShowPopupTwo(row.id);
                          tagPosition(e);
                          setShowNewTagPopup(false);
                          setShowSelectedTagPopup(true);
                          setSelectedTagIds([]);

                          // Conditionally set the state based on tabName
                          if (tabName === "campaign") {
                            setCampaignId(row.campaign_id);
                          }
                        }}
                      >
                        {tagNames[0]?.tag_name
                          ? tagNames[0]?.tag_name
                          : tagNames[1]?.tag_name}
                        <WhenPermitted
                          permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                          platform="flipkart"
                        >
                          <img
                            className="px-1"
                            src="/assets/images/chevron-down.svg"
                          />
                        </WhenPermitted>
                      </div>
                    </div>
                  </div>
                  {/* {showPopupTwo === row.id ? (
                    <div
                      className={`drop-shadow-md  p-4 rounded absolute ${
                        rowIndex < totalLength - 10 ? "top-0" : "bottom-0"
                      } bg-white w-max left-0 z-[10] border-gray-300`}
                    >
                      {addedTags.length > 0 && (
                        <p className="font-semibold">Selected Tags</p>
                      )}
                      {addedTags.map((item) => {
                        const tag = tagData?.find(
                          (tagItem) => tagItem._id === item
                        );
                        if (tag) {
                          return (
                            <div key={tag._id}>
                              <div className="flex items-center">
                                <input
                                  className="mr-1"
                                  type="checkbox"
                                  checked={addedTags.includes(
                                    tag._id.toString()
                                  )}
                                  onChange={(e) =>
                                    handleEditTagCheckboxChange(e, tag._id)
                                  }
                                />
                                <div
                                  style={{
                                    backgroundColor: tag?.color,
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "100%",
                                    marginRight: "5px",
                                    borderColor: "green",
                                  }}
                                ></div>
                                <div className=" text-[14px]">
                                  {" "}
                                  {tag?.tag_name}
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })}
                      {addedTags.length !== tagData.length && (
                        <p className="font-semibold">Select more tags</p>
                      )}
                      {tagData.map((tag) => {
                        if (!addedTags.includes(tag._id)) {
                          return (
                            <div key={tag._id}>
                              <div className="flex items-center">
                                <input
                                  className="mr-1"
                                  type="checkbox"
                                  checked={selectedTagIds.includes(
                                    tag._id.toString()
                                  )} // Check if the tag is selected
                                  onChange={(e) =>
                                    handleEditTagCheckboxChange(e, tag._id)
                                  }
                                />
                                <div
                                  style={{
                                    backgroundColor: tag?.color,
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "100%",
                                    marginRight: "5px",
                                    borderColor: "green",
                                  }}
                                ></div>
                                <div className=" text-[14px]">
                                  {" "}
                                  {tag?.tag_name}
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })}
                      {tagData.length > 0 ? (
                        <div className="mt-4">
                          <button
                            className="border p-1 rounded w-16 mr-2"
                            onClick={() => {
                              setShowPopupTwo(undefined);
                              setShowSelectedTagPopup(false)
                              setSelectedTagIds([]);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-blue-500 p-1 rounded w-16 text-white"
                            // disabled={
                            //   addedTags.length + selectedTagIds.length <= 0
                            // }
                            onClick={(e) => {
                              setShowPopupTwo(undefined);
                              setShowSelectedTagPopup(false)
                              handleAddButtonClick(e, "moreTag");
                            }}
                          >
                            Add
                          </button>
                        </div>
                      ) : (
                        <>
                          {" "}
                          <div>No tag</div>
                          <button
                            className="border p-1 rounded w-16 mr-2"
                            onClick={() => {
                              setShowPopupTwo(undefined);
                              setShowSelectedTagPopup(false)
                              setSelectedTagIds([]);
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  ) : null} */}
                </div>
              </td>
            );
          }

          if (item.type === "multiple") {
            init = (
              <td className="p-2 ">
                <div className="row text-center">
                  <div className="col">
                    {rupeeArray.indexOf(item.value) > -1 ? currency : ""}
                    {floatArr.indexOf(item.value) > -1
                      ? (row["direct_" + item.value] || 0).toFixed(2) || 0
                      : row["direct_" + item.value]}
                    {perArray.indexOf(item.value) > -1 ? "%" : ""}
                  </div>
                  <div className="col">
                    {rupeeArray.indexOf(item.value) > -1 ? currency : ""}
                    {floatArr?.indexOf(item?.value) > -1
                      ? (row["indirect_" + item.value] || 0).toFixed(2) || 0
                      : row["indirect_" + item.value]}
                    {perArray.indexOf(item.value) > -1 ? "%" : ""}
                  </div>
                  <div className="col">
                    {rupeeArray.indexOf(item.value) > -1 ? currency : ""}
                    {floatArr?.indexOf(item?.value) > -1
                      ? (row[item.value] || 0).toFixed(2) || 0
                      : row[item.value]}
                    {perArray.indexOf(item.value) > -1 ? "%" : ""}
                  </div>
                </div>
              </td>
            );
          }

          if (item.value === tabMainCol[tabName]) {
            init = (
              <td>
                <div className="text-[#0081F7] ">
                  {row[tabMainCol[tabName]]}
                </div>
              </td>
            );
          }

          if (item.value == "campaign_budget") {
            init = (
              <td className="min-w-[150px] w-[200px]">
                {editBudgetId.campaign_id == row.campaign_id ? (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setEditBudgetId({});
                          setEditBudget("");
                          setBudgetError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        autoFocus="autoFocus"
                        type="number"
                        className="border rounded w-[70%] h-8 mr-2 pl-2 outline-blue-400"
                        defaultValue={row.campaign_edit_budget}
                        value={editBudget}
                        onChange={(e) =>
                          handleNonNegativeInput(e, setEditBudget)
                        }
                      />
                      <button
                        onClick={() => {
                          setCurrentRow({ ...row, tabName: tabName });
                          handleCampaignBudget(row.campaign_edit_budget);
                        }}
                      >
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                        />
                      </button>
                      <img
                        src="/assets/images/x.svg"
                        className="cursor-pointer w-[10%]"
                        onClick={() => {
                          setEditBudgetId({});
                          setEditBudget("");
                          setBudgetError(false);
                        }}
                      />
                    </div>
                    {budgetError && (
                      <p className="text-red-500 text-[11px]">{budgetError}</p>
                    )}
                  </>
                ) : (
                  <div
                    className="cursor-pointer border w-[70%] p-1 rounded"
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      if (!isCampaignAborted(row)) {
                        setEditBudgetId(row);
                        setEditBudget(row.campaign_edit_budget);
                      }
                    }}
                  >
                    <div className="col_8">
                      {row.campaign_budget ? row.campaign_budget : "-"}
                    </div>
                  </div>
                )}
              </td>
            );
          }
          if (item.value == "ad_group_budget") {
            init = (
              <td className="min-w-[150px] w-[200px]">
                {editBudgetId.ad_group_id == row.ad_group_id &&
                editBudgetId.segment === "PCA" ? (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setEditBudgetId({});
                          setEditBudget("");
                          setBudgetError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        autoFocus="autoFocus"
                        type="number"
                        className="border rounded w-[70%] h-8 mr-2 pl-2 outline-blue-400"
                        defaultValue={row.ad_group_edit_budget}
                        value={editBudget}
                        onChange={(e) =>
                          handleNonNegativeInput(e, setEditBudget)
                        }
                      />
                      <button
                        onClick={() => {
                          setCurrentRow({ ...row, tabName: tabName });
                          handleCampaignBudget(
                            row.ad_group_edit_budget,
                            row.campaign_edit_budget
                          );
                        }}
                      >
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                        />
                      </button>
                      <img
                        src="/assets/images/x.svg"
                        className="cursor-pointer w-[10%]"
                        onClick={() => {
                          setEditBudgetId({});
                          setEditBudget("");
                          setBudgetError(false);
                        }}
                      />
                    </div>
                    {budgetError && (
                      <p className="text-red-500 text-[11px]">{budgetError}</p>
                    )}
                  </>
                ) : (
                  <div
                    className="cursor-pointer border w-[70%] p-1 rounded"
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      if (!isCampaignAborted(row)) {
                        setEditBudgetId(row);
                        setEditBudget(row.ad_group_edit_budget);
                      }
                    }}
                  >
                    <div className="col_8">
                      {row.ad_group_budget ? row.ad_group_budget : "-"}
                    </div>
                  </div>
                )}
              </td>
            );
          }
          if (
            [
              "campaign_status",
              "ad_group_status",
              "keyword_status",
              "fsn_status",
            ].includes(item.value) &&
            ["campaign", "adgroup", "keyword", "placement", "fsn"].includes(
              tabName
            )
          ) {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div className="relative">
                  <div className=" relative w-[140px] h-[55px]  py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex">
                    <StatusSelectDropdown
                      handleSuccess={(e) => {
                        // eslint-disable-next-line no-console
                        // console.log(row);
                        setCurrentRow({ ...row, tabName: tabName });
                        handleStatus(e);
                      }}
                      statusFlagObj={row}
                      state={
                        ((currentRow?.tabName === "campaign" &&
                          row.campaign_id == currentRow?.campaign_id) ||
                          (currentRow?.tabName === "adgroup" &&
                            row.ad_group_id === currentRow?.ad_group_id) ||
                          (currentRow?.tabName === "keyword" &&
                            row.id === currentRow?.id) ||
                          (currentRow?.tabName === "placement" &&
                            row.id === currentRow?.id)) &&
                        actionsLoading
                          ? "In Progress"
                          : tabName === "fsn" && !row[item.value]
                          ? "N/A"
                          : row[item.value]
                      }
                      disabled={
                        actionsLoading ||
                        isCampaignAborted(row) ||
                        tabName === "placement" ||
                        tabName === "fsn" ||
                        !hasPermission
                      }
                      optionList={showOptionByStatus(
                        tabName === "campaign"
                          ? row.campaign_status
                          : tabName === "adgroup"
                          ? row.ad_group_status
                          : row.keyword_status
                      )}
                    />
                    {tabName !== "fsn" && (
                      <div className="text-black text-opacity-75 text-[13px] font-normal">
                        Last Edited:{" "}
                        {row["last_edited"] ? row["last_edited"] : "NA"}
                      </div>
                    )}
                  </div>
                </div>
              </td>
            );
          }
          // if (["keyword_status"].includes(item.value)) {
          //   init = (
          //     <td className="min-w-[150px] w-[150px] ">
          //       <div className="relative">
          //         <div className=" relative w-[140px] h-[55px]  py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex">
          //           <StatusSelectDropdown
          //             handleSuccess={(e) => {
          //               // eslint-disable-next-line no-console
          //               // console.log(row);
          //               setCurrentRow({ ...row, tabName: tabName });
          //               handleStatus(e);
          //             }}
          //             statusFlagObj={row}
          //             state={
          //               ((currentRow?.tabName === "campaign" &&
          //                 row.campaign_id == currentRow?.campaign_id) ||
          //                 (currentRow?.tabName === "adgroup" &&
          //                   row.ad_group_id === currentRow?.ad_group_id)) &&
          //               loading
          //                 ? "In Progress"
          //                 : row[item.value]
          //             }
          //             disabled={loading}
          //             optionList={showOptionByStatus(
          //               tabName === "campaign"
          //                 ? row.campaign_status
          //                 : row.ad_group_status
          //             )}
          //           />

          //           <div className="text-black text-opacity-75 text-[13px] font-normal">
          //             Last Edited:{" "}
          //             {row["created_on"] !== null
          //               ? new Date(row["created_on"]).toLocaleDateString()
          //               : "NA"}
          //           </div>
          //         </div>
          //       </div>
          //     </td>
          //   );
          // }

          if (item.value == "campaign_name" && tabName == "campaign") {
            init = (
              <td className="group whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <div
                    className={
                      tabName === "campaign" && "text-[#0081F7]  cursor-pointer"
                    }
                  >
                    {editNameId?.campaign_id == row.campaign_id ? (
                      <>
                        <div
                          className="flex w-full"
                          onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget)) {
                              setCampaignNameError(false);
                              setEditNameId({});
                              setEditName("");
                            }
                          }}
                        >
                          <input
                            autoFocus="autoFocus"
                            type="text"
                            className="border grow w-full rounded h-8 mr-2 pl-2 outline-[#0081F7]"
                            defaultValue={row.campaign_name}
                            value={editName}
                            placeholder={row.campaign_name}
                            onChange={(e) => {
                              setEditName(e.target.value);
                              setCampaignNameError(false);
                            }}
                          />
                          <button
                            onClick={() => {
                              setCurrentRow({ ...row, tabName: tabName });

                              handleCampaignName(row);
                            }}
                          >
                            <img
                              src="/assets/images/tickmark.svg"
                              className="cursor-pointer mr-1"
                            />
                          </button>
                          <img
                            src="/assets/images/x.svg"
                            className="cursor-pointer"
                            style={{ width: "6%" }}
                            onClick={() => {
                              setCampaignNameError(false);
                              setEditNameId({});
                              setEditName("");
                            }}
                          />
                        </div>
                        {campaignNameError && (
                          <p className="text-red-500 text-[11px]">
                            {campaignNameError}
                          </p>
                        )}
                      </>
                    ) : (
                      <div
                        className="select-none row  "
                        onDoubleClick={() => {
                          if (!hasPermission) {
                            return;
                          }
                          if (!isCampaignAborted(row)) {
                            setEditNameId(row);
                            setEditName(row.name);
                          }
                        }}
                      >
                        <div className="max-w-[400px] whitespace-nowrap overflow-hidden text-ellipsis">
                          {row.campaign_name ? row.campaign_name : "-"}
                        </div>
                      </div>
                    )}
                  </div>

                  {row["flipkart_supermart_campaign.pin"] &&
                    tabName === "campaign" && (
                      <img
                        className="w-4 cursor-pointer "
                        src="/assets/images/pin.svg"
                        onClick={() => {
                          if (!hasPermission) {
                            return;
                          }
                          handleCampaignPin({
                            pinStatus: false,
                            campaignId: row.campaign_id,
                          });
                        }}
                      />
                    )}
                </div>
                {
                  tabName == "campaign" && (
                    <WhenPermitted
                      permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                      platform="flipkart"
                    >
                      <div className="flex group-hover:visible invisible">
                        <PinMenu
                          handleDuplicate={false}
                          handlePin={() =>
                            handleCampaignPin({
                              pinStatus: true,
                              campaignId: row.campaign_id,
                            })
                          }
                          handleHistory={false}
                          hidePin={row?.["flipkart_supermart_campaign.pin"]}
                        />
                      </div>
                    </WhenPermitted>
                  )
                  //       )}
                  // </>
                }
              </td>
            );
          }
          if (item.value == "end_date" && tabName === "campaign") {
            init = (
              <td className="min-w-[150px] w-[200px]">
                {editEndDateId.campaign_id == row.campaign_id ? (
                  <>
                    <div
                    // onBlur={(e) => {
                    //   if (!e.currentTarget.contains(e.relatedTarget)) {
                    //     setEditEndDateId({});
                    //     setEditEndDate("");
                    //     setEndDateError(false);
                    //   }
                    // }}
                    >
                      <div className="flex items-center mb-1">
                        <div className="flex flex-col">
                          <div>
                            <input
                              autoFocus="autofocus"
                              className="w-24 border pl-2 py-1 mr-2"
                              disabled={
                                editEndDate === "Till budget ends" ||
                                actionsLoading
                                  ? true
                                  : false
                              }
                              type="datetime-local"
                              min={getTodayDate()}
                              value={editEndDate}
                              onChange={(e) => {
                                if (!hasPermission) {
                                  return;
                                }
                                setEditEndDate(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <button
                          className=""
                          disabled={actionsLoading}
                          onClick={() => {
                            if (!hasPermission) {
                              return;
                            }
                            setCurrentRow({ ...row, tabName: tabName });

                            handleCampaignEndDate();
                          }}
                        >
                          <img
                            src="/assets/images/tickmark.svg"
                            className="cursor-pointer mr-1"
                          />
                        </button>
                        <img
                          src="/assets/images/x.svg"
                          className="cursor-pointer w-[10%]"
                          onClick={() => {
                            setEditEndDateId({});
                            setEditEndDate("");
                            setEndDateError(false);
                          }}
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="tbe"
                          name="tbe"
                          checked={
                            editEndDate === "Till budget ends" ? true : false
                          }
                          onChange={() => {
                            if (!hasPermission) {
                              return;
                            }
                            setEditEndDate(
                              editEndDate === "Till budget ends"
                                ? getTodayDate()
                                : "Till budget ends"
                            );
                          }}
                        />
                        <label htmlFor="tbe">Till budget ends</label>
                      </div>
                    </div>

                    {endDateError && (
                      <p className="text-red-500 text-[11px]">{endDateError}</p>
                    )}
                  </>
                ) : (
                  <div
                    className="cursor-pointer border w-[70%] p-1 rounded"
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      if (!isCampaignAborted(row)) {
                        setEditEndDateId(row);
                        setEditEndDate(
                          row.end_date === "Till budget ends"
                            ? row.end_date
                            : row.end_date + "T12:00"
                        );
                      }
                    }}
                  >
                    <div className="col_8">
                      {row.end_date ? row.end_date : "-"}
                    </div>
                  </div>
                )}
              </td>
            );
          }
          if (item.value == "ad_group_end_date" && tabName === "adgroup") {
            init = (
              <td className="min-w-[150px] w-[200px]">
                {editEndDateId.ad_group_id == row.ad_group_id &&
                row.segment === "PCA" ? (
                  <>
                    <div
                    // onBlur={(e) => {
                    //   if (!e.currentTarget.contains(e.relatedTarget)) {
                    //     setEditEndDateId({});
                    //     setEditEndDate("");
                    //     setEndDateError(false);
                    //   }
                    // }}
                    >
                      {" "}
                      <div className="flex items-center mb-1">
                        <div className="flex flex-col">
                          <div>
                            <input
                              autoFocus="autofocus"
                              className="w-24 border pl-2 py-1 mr-2"
                              disabled={
                                editEndDate === "Till budget ends" ||
                                actionsLoading
                                  ? true
                                  : false
                              }
                              min={getTodayDate()}
                              type="datetime-local"
                              value={editEndDate}
                              onChange={(e) => {
                                // eslint-disable-next-line no-console
                                console.log(e.target.value);
                                setEditEndDate(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <button
                          className=""
                          onClick={() => {
                            setCurrentRow({ ...row, tabName: tabName });

                            handleCampaignEndDate();
                          }}
                        >
                          <img
                            src="/assets/images/tickmark.svg"
                            className="cursor-pointer mr-1"
                          />
                        </button>
                        <img
                          src="/assets/images/x.svg"
                          className="cursor-pointer w-[10%]"
                          onClick={() => {
                            setEditEndDateId({});
                            setEditEndDate("");
                            setEndDateError(false);
                          }}
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="tbe"
                          name="tbe"
                          checked={
                            editEndDate === "Till budget ends" ? true : false
                          }
                          onChange={() => {
                            setEditEndDate(
                              editEndDate === "Till budget ends"
                                ? getTodayDate()
                                : "Till budget ends"
                            );
                          }}
                        />
                        <label htmlFor="tbe">Till budget ends</label>
                      </div>
                    </div>

                    {endDateError && (
                      <p className="text-red-500 text-[11px]">{endDateError}</p>
                    )}
                  </>
                ) : (
                  <div
                    className="cursor-pointer border w-[70%] p-1 rounded"
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      if (!isCampaignAborted(row)) {
                        setEditEndDateId(row);
                        setEditEndDate(row.ad_group_end_date + "T12:00");
                      }
                    }}
                  >
                    <div className="col_8">
                      {row.ad_group_end_date ? row.ad_group_end_date : "-"}
                    </div>
                  </div>
                )}
              </td>
            );
          }

          if (item.value == "placement_bid" && tabName === "placement") {
            init = (
              <td className="min-w-[150px] w-[400px]">
                {editPlacementBidId?.ad_group_id == row.ad_group_id &&
                editPlacementBidId?.placement_type == row.placement_type ? (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setEditPlacementBidId({});
                          setEditPlacementBid("");
                          setPlacementBidError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        autoFocus="autoFocus"
                        type="number"
                        className="border rounded w-[70%] h-8 mr-2 pl-2 outline-blue-400"
                        defaultValue={row.placement_bid}
                        value={editPlacementBid}
                        min={row.min_bid ? row.min_bid : 0}
                        step={0.01}
                        onChange={(e) =>
                          handleNonNegativeInput(e, setEditPlacementBid)
                        }
                      />
                      <button
                        onClick={() => {
                          setCurrentRow({ ...row, tabName: tabName });

                          handlePlacementBid();
                        }}
                      >
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                        />
                      </button>
                      <img
                        src="/assets/images/x.svg"
                        className="cursor-pointer w-[10%]"
                        onClick={() => {
                          setEditPlacementBidId({});
                          setEditPlacementBid("");
                          setPlacementBidError(false);
                        }}
                      />
                    </div>
                    <p className="whitespace-nowrap text-xs">
                      Suggested Bid {row.suggested_bid}
                    </p>
                    {placementBidError && (
                      <p className="text-red-500 text-[11px]">
                        {placementBidError}
                      </p>
                    )}
                  </>
                ) : (
                  <div
                    className="cursor-pointer border w-[70%] p-1 rounded"
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      if (!isCampaignAborted(row) && checkGrouping()) {
                        setEditPlacementBidId(row);
                        setEditPlacementBid(row.placement_bid);
                      }
                    }}
                  >
                    <div className="col_8">
                      {row.placement_bid ? row.placement_bid : "-"}
                    </div>
                  </div>
                )}
              </td>
            );
          }

          rows.push(init);
        } else {
          let init = (
            <td className="p-2">
              <div> - </div>
            </td>
          );
          if (item.value == "tag_id") {
            init = (
              <td className="p-2">
                <div className="relative">
                  <div
                    onClick={(e) => {
                      if (!hasPermission) {
                        return;
                      }
                      // setShowPopupOne(row.campaign_id);
                      // setShowPopupTwo(undefined);
                      tagPosition(e);
                      setShowNewTagPopup(true);
                      setShowSelectedTagPopup(false);
                      setSelectedTagIds([]);
                      if (tabName === "campaign")
                        setCampaignId(row.campaign_id);
                    }}
                    className=" whitespace-nowrap cursor-pointer flex items-center border rounded-e-3xl rounded-s-3xl w-fit px-3 py-1 border-[#D9D9D9] bg-[#FAFAFA]"
                  >
                    {" "}
                    <p>Add Tag</p>
                    <WhenPermitted
                      platform="flipkart"
                      permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                    >
                      <img className="" src="/assets/images/chevron-down.svg" />
                    </WhenPermitted>
                  </div>
                  {/* {showPopupOne === row.campaign_id ? (
                    <div
                      className={`drop-shadow-md  p-4 rounded absolute ${
                        rowIndex < totalLength - 10 ? "top-0" : "bottom-0"
                      } bg-white w-max left-0 z-[10] border-gray-300`}
                    >
                      {tagData && tagData.length > 0 ? (
                        tagData.map((tags, index) => (
                          <li
                            key={index}
                            className="flex cursor-pointer mb-2  items-center  text-sm mt-1 "
                          >
                            <input
                              className="mr-1"
                              type="checkbox"
                              checked={selectedTagIds.includes(tags._id)}
                              onChange={(e) =>
                                handleTagCheckboxChange(
                                  e.target.checked,
                                  tags._id
                                )
                              }
                            />

                            <ul
                              key={index}
                              style={{
                                backgroundColor: tags?.color,
                                width: "20px",
                                height: "14px",
                                borderRadius: "100%",
                                marginRight: "5px",
                                borderColor: "green",
                              }}
                            ></ul>
                            <div className="flex w-full justify-between items-center ">
                              <ul>{tags?.tag_name}</ul>
                            </div>
                          </li>
                        ))
                      ) : (
                        <>
                          <p>No tags</p>
                          <button
                            className="border p-1 rounded w-16 mr-2"
                            onClick={() => {
                              setShowPopupOne(undefined);
                              setShowNewTagPopup(false)
                              setSelectedTagIds([]);
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {tagData && tagData?.length > 0 && (
                        <div className="mt-4">
                          <button
                            className="border p-1 rounded w-16 mr-2"
                            onClick={() => {
                              setShowPopupOne(undefined);
                              setShowNewTagPopup(false)
                              setSelectedTagIds([]);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-blue-500 p-1 rounded w-16 text-white"
                            disabled={selectedTagIds.length <= 0}
                            onClick={(e) => {
                              setShowPopupOne(undefined);
                              setShowNewTagPopup(false)
                              handleAddButtonClick(e, "newTag");
                            }}
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null} */}
                </div>
              </td>
            );
          }
          if (item.type === "multiple") {
            init = (
              <td className="p-2">
                <div className="row text-center">
                  <div className="col">0</div>
                  <div className="col">0</div>
                  <div className="col">0</div>
                </div>
              </td>
            );
          }
          rows.push(init);
        }
      }
    });

    return rows;
  }
  function TableTotalCol({ row, name }) {
    let rows = [];
    let perArray = ["ctr", "cvr"];
    let rupeeArray = ["cpc", "spend", "revenue", "aov", "campaign_budget"];
    headers.map((item) => {
      if (item.showCol) {
        if (Object.prototype.hasOwnProperty.call(row, item.value)) {
          let init = (
            <td className="p-2 ">
              <div>
                <div>
                  <span className="!font-normal text-[13px]">
                    {" "}
                    {item.title}
                  </span>{" "}
                </div>
                <div>
                  <SummaryValueFormatter
                    row={row}
                    val={item.value}
                    name={name}
                  />
                </div>
                {row?.summaryCompData &&
                  _.size(row.summaryCompData) > 0 &&
                  row?.summaryCompData[0][item?.value] != "-" &&
                  row?.summaryCompData[0][item?.value] != "0.00%" &&
                  row?.summaryCompData[0][item?.value] != "₹0" &&
                  row?.summaryCompData[0][item?.value] != "0" &&
                  row?.summaryCompData[0][item?.value] != "0%" &&
                  row?.summaryCompData[0][item?.value] != "₹0.00" &&
                  row?.summaryCompData[0][item?.value] != "" &&
                  row?.totalDelta &&
                  row?.totalDelta[item?.value] && (
                    <div className="w-[73px] h-[22px] justify-start items-center gap-0.5 inline-flex">
                      <div className="text-black/opacity-40 text-[10px] font-normal font-['Inter'] leading-snug">
                        {row?.summaryCompData[0][item?.value]}
                      </div>
                      {row?.totalDelta[item?.value] < 0 && (
                        <div className="w-[41px] h-[15.11px] px-[6.13px] py-[0.77px] bg-orange-50 rounded-xl border border-red-300 justify-start items-center gap-[2.30px] flex">
                          <div className="w-[32.20px] text-orange-600 text-[9.20px] font-normal font-['Roboto'] leading-none">
                            {Math.abs(row?.totalDelta[item?.value])}%
                          </div>
                        </div>
                      )}

                      {row?.totalDelta[item?.value] >= 0 && (
                        <div className="w-[46px] h-[15.11px] px-[6.13px] py-[0.77px] bg-lime-50 rounded-xl border border-lime-200 justify-start items-center gap-[2.30px] flex">
                          <div className="text-lime-600 text-[9.20px] font-normal font-['Roboto'] leading-none">
                            {row?.totalDelta[item?.value]}%
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </td>
          );

          if (item.type === "multiple") {
            init = (
              <td className="p-2">
                <div className="row text-center">
                  <div className="col">
                    {rupeeArray.indexOf(item.value) > -1 ? currency : ""}
                    {floatArr.indexOf(item.value) > -1
                      ? (row["direct_" + item.value] || 0).toFixed(2) || 0
                      : row["direct_" + item.value]}
                    {perArray.indexOf(item.value) > -1 ? "%" : ""}
                  </div>
                  <div className="col">
                    {rupeeArray.indexOf(item.value) > -1 ? currency : ""}
                    {floatArr?.indexOf(item?.value) > -1
                      ? (row["indirect_" + item.value] || 0).toFixed(2) || 0
                      : row["indirect_" + item.value]}
                    {perArray.indexOf(item.value) > -1 ? "%" : ""}
                  </div>
                  <div className="col">
                    {rupeeArray.indexOf(item.value) > -1 ? currency : ""}
                    {floatArr?.indexOf(item?.value) > -1
                      ? (row[item.value] || 0).toFixed(2) || 0
                      : row[item.value]}
                    {perArray.indexOf(item.value) > -1 ? "%" : ""}
                  </div>
                </div>
              </td>
            );
          }
          rows.push(init);
        } else {
          let init = (
            <td className="p-2">
              <div> </div>
            </td>
          );
          rows.push(init);
        }
      }
    });
    return rows;
  }
  return (
    <>
      <div className="bg-white relative">
        <div
          className={
            isCheckBoxRequired
              ? `campaignreportcheckbox__table max-h-[640px] overflow-y-auto  ${
                  bodyContent?.length === 0
                    ? "h-[200px]"
                    : expandTable
                    ? "!max-h-[550px]"
                    : ""
                }`
              : `campaignreport__table max-h-[640px] overflow-y-auto  ${
                  bodyContent?.length === 0
                    ? "h-[200px]"
                    : expandTable
                    ? "!max-h-[550px]"
                    : ""
                }`
          }
          onScroll={handleScroll}
        >
          <table className="h-full w-full">
            <thead
              className={
                isCheckBoxRequired
                  ? `campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35]`
                  : "campaignreport__tablehead table-fixed sticky top-0 left-0 z-[35]"
              }
            >
              <tr className="">
                {isCheckBoxRequired === true && (
                  <th className=" pl-5 pr-6">
                    <input
                      className=" h-16 "
                      type="checkbox"
                      checked={
                        bodyContent?.length > 0 &&
                        selectedCheckBox?.length === bodyContent?.length
                      }
                      onChange={(e) => handleAllCheckBox(e, bodyContent)}
                      disabled={bodyContent?.length > 0 ? false : true}
                    />
                  </th>
                )}

                {headers.map((item, index) => {
                  if (item.showCol) {
                    return (
                      <>
                        {item.type === "single" ? (
                          <th
                            key={index}
                            style={thStyle(item.columnType, "flipkart")}
                          >
                            <div className="tableHead px-4 ">
                              <p>{item.title}</p>
                              {bodyContent.length > 0 && item.show && (
                                <div className="sortArrow cursor-pointer">
                                  <div>
                                    <div
                                      onClick={() => sortData(item?.value, 1)}
                                      style={{
                                        color:
                                          Object.keys(sort)[0] === item.value &&
                                          Object.values(sort)[0] === 1
                                            ? "black"
                                            : "grey",
                                      }}
                                    >
                                      ▲
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className="downArrow"
                                      onClick={() => sortData(item?.value, -1)}
                                      style={{
                                        color:
                                          Object.keys(sort)[0] === item.value &&
                                          Object.values(sort)[0] === -1
                                            ? "black"
                                            : "grey",
                                      }}
                                    >
                                      ▼
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </th>
                        ) : (
                          <th rowSpan={3} className="multiCol">
                            <div className="graycol">{item.title}</div>
                            {item.subTitles.map((v, i) => {
                              return (
                                <td key={i} className="graydirect">
                                  {v}
                                </td>
                              );
                            })}
                          </th>
                        )}
                      </>
                    );
                  }
                })}
              </tr>
            </thead>
            <tbody>
              {bodyContent && bodyContent.length > 0 ? (
                bodyContent?.map((row, i) => {
                  return (
                    <tr
                      className={
                        isCheckBoxRequired
                          ? "tableContentCheckBox "
                          : "tablecontent"
                      }
                      key={row.campaign_id}
                    >
                      {isCheckBoxRequired === true && (
                        <td className="pl-2  min-w-max  ">
                          <input
                            className="h-16"
                            type="checkbox"
                            checked={selectedCheckBox
                              ?.map((id) => id.id)
                              .includes(row.id)}
                            onChange={(e) => handleCheckBox(e, row)}
                          />
                        </td>
                      )}

                      <TableCol
                        row={row}
                        name={name}
                        totalLength={bodyContent?.length}
                        rowIndex={i}
                      />
                    </tr>
                  );
                })
              ) : !loading ? (
                <tr>
                  <div className="p-2 !border-b-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {" "}
                    No Data Found
                  </div>
                </tr>
              ) : null}
              {bodyContent.length === 0 && loading && (
                <>
                  <tr>
                    <div className="p-2 !border-b-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      {" "}
                      <LoaderSpinner />
                    </div>
                  </tr>
                </>
              )}
              {loading && bodyContent?.length > 0 && (
                <tr>
                  <td colSpan="19" className="relative h-20 !pl-0">
                    <div className="sticky left-0 max-w-[90vw] inset-0 flex items-center justify-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot
              className="sticky bottom-0 left-0 z-[35] flipkarttable__footer"
              style={{
                boxShadow: "rgb(206 200 200) 13px 5px 20px 1px",
              }}
            >
              {summaryData && summaryData.length > 0
                ? summaryData.map((row, i) => {
                    return (
                      <>
                        <tr key={i} className="font-semibold bg-white">
                          <td className="sticky flex flex-col min-w-max z-30 pt-2 left-0 !border-none">
                            <div className="!font-normal text-[13px]">
                              Total
                            </div>
                            <div className="font-semibold">{totalData}</div>
                            {row?.summaryCompData &&
                              row?.totalDelta &&
                              Object.keys(row?.totalDelta).length > 0 && (
                                <div className="w-[73px] h-[22px] justify-start items-center gap-0.5 inline-flex">
                                  <div className="text-black/opacity-40 text-[10px] font-normal font-['Inter'] leading-snug">
                                    {row?.summaryCompData[0].total_count}
                                  </div>
                                </div>
                              )}
                          </td>
                          <TableTotalCol row={row} name={name} />
                        </tr>
                      </>
                    );
                  })
                : null}
            </tfoot>
            {footer && (
              <tfoot className="sticky bottom-0 z-[999]">
                <tr>
                  {footer?.map((item) => {
                    return (
                      <>
                        <td>{item.campaignname}</td>
                        <td>{item.state}</td>
                        <td>{item.status}</td>
                        <td>{item.active_totaladgroup}</td>
                        <td>{item.profilename}</td>
                        <td>{item.campaign}</td>
                        <td>{item.targeting}</td>
                        <td>{item.daily}</td>
                        <td>{item.bid}</td>
                        <td>{item.impressions}</td>
                        <td>{item.clicks}</td>
                        <td>{item.ctr}</td>
                        <td>{item.spend}</td>
                        <td>{item.cpc}</td>
                      </>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
      {showSelectedTagPopup && (
        <SelectedTagPopup
          open={showSelectedTagPopup}
          setOpen={setShowSelectedTagPopup}
          platform="flipkart"
          tagData={tagData}
          addedTags={addedTags}
          selectedTagIds={selectedTagIds}
          schedulerPosition={schedulerPosition}
          setSelectedTagIds={setSelectedTagIds}
          handleAddButtonClick={handleAddButtonClick}
          handleEditTagCheckboxChange={handleEditTagCheckboxChange}
        />
      )}
      {showNewTagPopup && (
        <NewTagPopup
          open={showNewTagPopup}
          setOpen={setShowNewTagPopup}
          platform="flipkart"
          tagData={tagData}
          schedulerPosition={schedulerPosition}
          selectedTagIds={selectedTagIds}
          handleTagCheckboxChange={handleTagCheckboxChange}
          setSelectedTagIds={setSelectedTagIds}
          handleAddButtonClick={handleAddButtonClick}
        />
      )}
    </>
  );
};

export default memo(FlipkartSearchTable);
