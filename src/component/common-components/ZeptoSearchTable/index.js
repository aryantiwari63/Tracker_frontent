/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { _GET, _PATCH, _POST } from "../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import {
  BLINKIT_TAGS,
  BLINKIT_ATTACH_TAG,
  ZEPTO_CAMPAIGN_PIN,
  RPA_ACTION_EDIT,
  PERMISSIONS,
} from "../../../utils/constants";
import LoaderSpinner from "../loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import ActionType from "../../../redux/types";
import PinMenu from "../PinMenu/PinMenu";
import StatusSelectDropdown from "../dropdown/StatusSelectDropdown";
import "./style.css";
import DialogBox from "../dialogBox.js";
import SelectedTagPopup from "../Popups/SelectedTagPopup.js";
import NewTagPopup from "../Popups/NewTagPopup.js";
import WhenPermitted from "../WhenPermitted";
import { thStyle } from "../../../utils/helpers.js";

const ZeptoItSearchTable = ({
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
  startDate,
  endDate,
  // funnelCount,
}) => {
  let currency = localStorage.getItem("currency");
  const currency_format = localStorage.getItem("currency_format");
  const { expandTable } = useSelector((state) => state?.CommonReducer);
  const [campaignId, setCampaignId] = useState("");
  // holds the data of selected check boxes from the redux
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  let { recallCampaign } = useSelector((state) => state?.RecallCampaignReducer);
  const userPermissions = useSelector(
    (state) => state?.permissionsReducer || []
  );
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CAMPAIGN_ACTIONS,
    platform: "zepto",
  });
  //hold the tag data from the redux
  const { tagData } = useSelector((state) => state?.TagReducer);
  //holds the value of tags which are attached to a campaign
  const [addedTags, setAddedTags] = useState([]);
  // handles the tags to be attached to a campaign
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  // const [showPopupOne, setShowPopupOne] = useState(false);
  // const [showPopupTwo, setShowPopupTwo] = useState(undefined);
  const [recallTags, setRecallTags] = useState({});
  const [budget, setBudget] = useState();
  const [budgetError, setBudgetError] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [updateCampaignId, setUpdateCampaignId] = useState();
  const [updateProductId, setUpdateProductId] = useState();
  const [categoryName, setCategoryName] = useState();
  const [keywordBid, setKeywordBid] = useState();
  const [bidError, setBidError] = useState(false);
  let { zeptoAccountId } = useSelector((state) => state?.CampaignReducer);
  const [statusPopup, setStatusPopup] = useState(false);
  const [productData, setProductData] = useState();
  const [categoryData, setCategoryData] = useState();
  const [campaignData, setCampaignData] = useState({
    campaign_id: "",
    campaign_name: "",
    campaign_type: "",
    prev_budget: "",
    is_search_only: "",
    account: "",
  });

  const [keywordData, setKeywordData] = useState({
    campaign_id: "",
    campaign_name: "",
    campaign_type: "",
    prev_bid: "",
    is_search_only: "",
    keyword_id: "",
    keyword: "",
    account: "",
    match_type: "",
  });

  const [showSelectedTagPopup, setShowSelectedTagPopup] = useState(false);
  const [showNewTagPopup, setShowNewTagPopup] = useState(false);
  const [schedulerPosition, setSchedulerPosition] = useState({
    top: 0,
    left: 0,
  });

  const tagPosition = (e) => {
    // Calculate button position relative to the viewport
    const buttonRect = e.target.getBoundingClientRect();
    setSchedulerPosition({
      top: buttonRect.bottom,
      left: buttonRect.left,
    });
  };

  const [campaignName, setCampaignName] = useState();
  const [nameError, setNameError] = useState(false);
  const [updateKeywordId, setUpdateKeywordId] = useState();
  const [categoryStatusPopup, setCategoryStatusPopup] = useState(false);
  const [campaignNameData, setCampaignNameData] = useState({
    campaign_id: "",
    campaign_name: "",
    campaign_type: "",
    is_search_only: "",
    account: "",
  });
  let allTabSelectedCheckBox = selectedCheckBox;
  selectedCheckBox =
    selectedCheckBox &&
    Object.prototype.hasOwnProperty.call(selectedCheckBox, tabName)
      ? selectedCheckBox[tabName]
      : [];
  const dispatch = useDispatch();
  const date = new Date();

  const handleCheckBox = async (e, data) => {
    // checked state of the checkbox
    const isChecked = e.target.checked;
    let updatedIds = allTabSelectedCheckBox;
    // if the checkbox is selected, add the data to the previous selectedData array
    if (isChecked) {
      updatedIds[tabName] = [...selectedCheckBox, data];
      if (tabName === "campaign") {
        updatedIds["keyword"] = [];
        updatedIds["product"] = [];
        updatedIds["category"] = [];
      }
      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });
    } else {
      // if the checkbox is unselected, remove the data from the previous selectedData array
      if (tabName === "campaign") {
        updatedIds[tabName] = selectedCheckBox.filter(
          (item) => item.id !== data.id
        );
        updatedIds["keyword"] = [];
        updatedIds["product"] = [];
      } else {
        updatedIds[tabName] = selectedCheckBox.filter(
          (item) => item.id !== data.id
        );
      }

      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });
      // updatedIds[tabName] = selectedCheckBox.filter(
      //   (item) => item.id !== data.id
      // );

      // dispatch({
      //   type: ActionType.CHECKBOX,
      //   payload: { ...updatedIds },
      // });
    }

    if (tabName === "campaign") {
      if (updatedIds[tabName].length > 0) {
        let campIds = [];
        updatedIds[tabName].map((item) => {
          campIds.push(item.campaign_id);
        });

        // funnelCount(campIds);
      } else {
        // funnelCount([]);
      }
    }
    // handleSelectedData(updatedIds);

    // handleSelectedData(updatedIds);
  };
  const handleAllCheckBox = async (e, data) => {
    //console.log("dataaaaaaaa", data);
    // const data = dataArray.filter(
    //   (item) => item.campaign_type === "Performance"
    // );
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
      if (tabName === "campaign") {
        let campIds = [];
        updatedIds[tabName].map((item) => {
          campIds.push(item.campaign_id);
        });
        updatedIds["keyword"] = [];
        updatedIds["product"] = [];
        // funnelCount(campIds);
      }
    } else {
      // if the checkbox is unselected, remove the data from the previous selectedData array
      // funnelCount([]);
      // if the checkbox is unselected, remove the data from the previous selectedData array
      updatedIds[tabName] = [];
      if (tabName === "campaign") {
        updatedIds["keyword"] = [];
        updatedIds["product"] = [];
      }
      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });
    }
    handleSelectedData(updatedIds);
  };
  useEffect(() => {
    handleSelectedData(selectedCheckBox);
  }, []);

  // TAG APIs
  const fetchAllTagsApi = async () => {
    try {
      setLoading(true);
      const response = await _GET(
        `${BLINKIT_TAGS}?platform=zepto&data_level=campaign`
      );
      setLoading(false);
      dispatch({
        type: ActionType.TAG,
        payload: response?.data?.data?.result,
      });
    } catch (error) {
      console.error(error);
    }
  };
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

  useEffect(() => {
    if (tabName === "campaign") {
      dispatch({
        type: ActionType.TOTAL_CAMPAIGN,
        payload: totalData,
      });
    }

    if (tabName === "keyword") {
      dispatch({
        type: ActionType.TOTAL_KEYWORD_COUNT,
        payload: totalData,
      });
    }

    if (tabName === "category") {
      dispatch({
        type: ActionType.TOTAL_CATEGORY_COUNT,
        payload: totalData,
      });
    }
    if (tabName === "product") {
      dispatch({
        type: ActionType.TOTAL_ASINS,
        payload: totalData,
      });
    }
  }, [tabName, totalData]);
  // handles the check boxes when the tags are being updated
  const handleEditTagCheckboxChange = (e, tagId) => {
    if (e.target.checked) {
      setAddedTags((prevSelectedTagIds) => [
        ...prevSelectedTagIds,
        tagId, // Convert the tagId to string
      ]);
      setSelectedTagIds((prevSelectedTagIds) => [
        ...prevSelectedTagIds,
        ...addedTags,
        tagId, // Convert the tagId to string
      ]);
    } else {
      setAddedTags((prevSelectedTagIds) =>
        prevSelectedTagIds.filter((id) => id !== tagId)
      );
      setSelectedTagIds((prevSelectedTagIds) =>
        prevSelectedTagIds.filter((id) => id !== tagId)
      );
    }
  };

  const handleAddButtonClick = async (e, type) => {
    try {
      setLoading(true);
      let data;
      if (type == "newTag") {
        data = {
          // tag_id: selectedTagIds,
          tag_id: [...new Set(selectedTagIds)],
          platform: "zepto",
        };
      } else {
        data = {
          // tag_id: selectedTagIds,
          tag_id: [...new Set(addedTags)],
          platform: "zepto",
        };
      }

      const result = await _PATCH(`${BLINKIT_ATTACH_TAG}/${campaignId}`, data);

      if (result?.status == 200) {
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
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

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
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) <= 1;
    if (bottom && !loading) {
      setDataLIMIT();
    }
    console.error(bottom, "call");
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
  function ValueFormatter({ row, val, name }) {
    let value = row[val];
    if (floatArr?.indexOf(val) > -1) {
      value = row[val] || 0;
    } else {
      if (val === "platform") {
        value = row[val] === "SM" ? "Supermart" : "Flipkart";
      } else if (val === "campaign_name" && name == "campaign") {
        value = <EditCampaign row={row} />;
      }
    }
    return value ? value : "NA";
  }
  function SummaryValueFormatter({ row, val }) {
    let perArray = ["ctr", "cvr"];
    let rupeeArray = [
      "cpc",
      "cpm",
      "estimated_budget_consumed",
      "revenue",
      "aov",
      "campaign_budget",
      "total_sales",
    ];
    let value = row[val];

    if (
      value === `${currency}null` ||
      value === `${currency}undefined` ||
      value === null
    ) {
      return rupeeArray.includes(val) || perArray.includes(val)
        ? (value = rupeeArray.includes(val) ? `${currency}0` : "0%")
        : (value = 0);
    } else {
      return value;
    }
    // return value !== (`₹null` || `0%`) ? value : "";
  }

  function EditCampaign({ row }) {
    return (
      <>
        {row.campaign_name}

        {/* <button
          onClick={() => history.push(APPLICATION_ROUTES.EDITCAMPAIGN, id)}
        >
          <div className="pr-1">
            <img
              className="header-buttons mr-1"
              src={"/assets/images/edit.svg"}
              alt=""
            />
          </div>
        </button> */}
      </>
    );
  }
  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(0);
    }
  };
  const campaignNameBlock = (
    campaign_id,
    campaign_name,
    campaign_type,
    is_search_only,
    account
  ) => {
    setCampaignNameData({
      campaign_id,
      campaign_name,
      campaign_type,
      is_search_only,
      account,
    });
    setUpdateCampaignId(campaign_id);
  };

  const budgetBlock = (
    campaign_id,
    campaign_name,
    campaign_type,
    prev_budget,
    is_search_only,
    account
  ) => {
    setCampaignData({
      campaign_id,
      campaign_name,
      campaign_type,
      prev_budget,
      is_search_only,
      account,
    });
    setUpdateCampaignId(campaign_id);
  };

  const keywordBidBlock = (
    campaign_id,
    campaign_name,
    campaign_type,
    prev_bid,
    is_search_only,
    keyword_id,
    keyword,
    account,
    match_type
  ) => {
    setKeywordData({
      campaign_id,
      campaign_name,
      campaign_type,
      prev_bid,
      is_search_only,
      keyword_id,
      keyword,
      account,
      match_type,
    });
    setUpdateCampaignId(campaign_id);
    setUpdateKeywordId(keyword_id);
  };

  const handleCampaignPin = async ({ pinStatus, campaignId }) => {
    const data = {
      campaign_id: [campaignId],
      pin_status: pinStatus,
    };

    const result = await _POST(ZEPTO_CAMPAIGN_PIN, data);
    if (result.status === 200) {
      let tempData = bodyContent;
      const foundIndex = tempData.findIndex(
        (x) => x.campaign_id == data.campaign_id[0]
      );

      if (pinStatus) {
        tempData[foundIndex].pin = new Date();
      } else {
        tempData[foundIndex].pin = null;
      }
      setBodyData([...tempData]);
    }
  };

  const handleCampaignName = () => {
    if (campaignName === undefined || !campaignName) {
      setNameError("Enter campaign name");
    } else {
      setNameError(false);
      const data = [
        {
          campaign_id: [campaignNameData.campaign_id],
          campaign_name: [campaignNameData.campaign_name],
          action_type: "campaign",
          action: "campaign_name_change",
          action_message: `Set campaign name from ${campaignNameData.campaign_name} to ${campaignName}`,
          media_type: "Zepto",
          action_status: 10,
          updated_campaign_name: campaignName,
          segment: campaignNameData.campaign_type,
          is_search_only: campaignNameData.is_search_only,
          account_id: zeptoAccountId,
          account: campaignNameData.account,
        },
      ];
      handleAction({ data });
      setCampaignNameData({});
    }
  };
  const handleBudget = () => {
    if (budget === undefined || !budget) {
      setBudgetError("Enter budget value");
    } else if (
      campaignData.campaign_type === "Awareness" &&
      parseFloat(budget) < 1000
    ) {
      setBudgetError(
        `Daily budget must be at least ${currency}1000 for Awareness Campaigns`
      );
    } else if (
      campaignData.campaign_type === "Performance" &&
      parseFloat(budget) < 100
    ) {
      setBudgetError(
        `Daily budget must be at least ${currency}100 for Performance Campaigns`
      );
    } else {
      setBudgetError(false);
      const data = [
        {
          campaign_id: [campaignData.campaign_id],
          campaign_name: [campaignData.campaign_name],
          action_type: "campaign",
          action: "set_budget",
          action_message: `Set budget bid from ${
            campaignData.prev_budget
          } to ${currency}${parseFloat(budget).toLocaleString(
            currency_format
          )}`,
          media_type: "Zepto",
          action_status: 10,
          set_value: parseFloat(budget),
          segment: campaignData.campaign_type,
          is_search_only: campaignData.is_search_only,
          account_id: zeptoAccountId,
          account: campaignData.account,
        },
      ];
      handleAction({ data });
      setCampaignData({});
    }
  };

  const handleBid = () => {
    if (keywordBid === undefined || !keywordBid) {
      setBidError("Enter bid value");
    } else if (parseFloat(keywordBid) < 8) {
      setBidError(`Min bid is ${currency}8`);
    } else {
      setBidError(false);
      const data = [
        {
          campaign_id: [keywordData.campaign_id],
          campaign_name: [keywordData.campaign_name],
          action_type: "keyword",
          action: "set_bid",
          action_message: `Set bid for keyword ${keywordData.keyword} from ${
            keywordData.prev_bid
          } to ${currency}${parseFloat(keywordBid).toLocaleString(
            currency_format
          )}`,
          media_type: "Zepto",
          action_status: 10,
          set_value: parseFloat(keywordBid),
          segment: keywordData.campaign_type,
          is_search_only: keywordData.is_search_only,
          keyword_id: keywordData.keyword_id,
          account_id: zeptoAccountId,
          account: keywordData.account,
          keywords: keywordData.keyword,
        },
      ];

      handleKeywordAction({ data });
      setKeywordData({});
    }
  };

  useEffect(() => {
    if (!apiLoading) {
      setUpdateCampaignId();
      setCategoryName();
      setUpdateKeywordId();
      setUpdateProductId();
    }
  }, [apiLoading]);

  const handleKeywordAction = async ({ data, statusFlag = null }) => {
    try {
      setApiLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setApiLoading(false);
      if (res.status === 200) {
        let tempInfo = bodyContent;
        if (res?.data?.status?.message === "Status updated successfully") {
          const index = tempInfo.findIndex(
            (x) =>
              x.campaign_id == statusFlag.campaign_id &&
              x.keyword_id == statusFlag.keyword_id
          );

          tempInfo[index].status =
            res?.data?.data?.result[0]?.action === "enable"
              ? "ACTIVE"
              : "PAUSED";
          setBodyData([...tempInfo]);
        } else if (res?.data?.status?.message === "Bid updated successfully") {
          const index = tempInfo.findIndex(
            (x) =>
              x.campaign_id == keywordData.campaign_id &&
              x.keyword_id == keywordData.keyword_id
          );

          tempInfo[index].bid = `₹${res?.data?.data?.result[0]?.set_value}`;
          tempInfo[index].updated_at = date.toLocaleDateString();
          setBodyData([...tempInfo]);
        }
        dispatch(setToastMessageHandler(res?.data?.status?.message, true));
      } else {
        let error =
          res?.data?.status?.message?.error || "Something went wrong!";

        dispatch(setToastMessageHandler(error, false));
      }
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleAction = async ({ data, statusFlag = null }) => {
    try {
      setApiLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setApiLoading(false);

      if (res.status === 200) {
        let tempInfo = bodyContent;
        if (res?.data?.status?.message === "Status updated successfully") {
          const index = tempInfo.findIndex(
            (x) => x.campaign_id == statusFlag.campaign_id
          );

          tempInfo[index].status =
            res?.data?.data?.result[0]?.action === "enable"
              ? "ACTIVE"
              : "PAUSED";
          tempInfo[index].updated_at = date.toLocaleDateString();
          setBodyData([...tempInfo]);
        } else if (
          res?.data?.status?.message === "Budget updated successfully"
        ) {
          const index = tempInfo.findIndex(
            (x) => x.campaign_id == campaignData.campaign_id
          );
          tempInfo[
            index
          ].campaign_budget = `₹${res?.data?.data?.result[0]?.set_value}`;
          tempInfo[index].updated_at = date.toLocaleDateString();
          setBodyData([...tempInfo]);
        } else if (
          res?.data?.status?.message === "Campaign name updated successfully"
        ) {
          const index = tempInfo.findIndex(
            (x) => x.campaign_id == campaignNameData.campaign_id
          );
          tempInfo[index].campaign_name =
            res?.data?.data?.result[0]?.updated_campaign_name;
          tempInfo[index].updated_at = date.toLocaleDateString();
          setBodyData([...tempInfo]);
        }
        dispatch(setToastMessageHandler(res?.data?.status?.message, true));
      } else {
        let error =
          res?.data?.status?.message?.error || "Something went wrong!";

        dispatch(setToastMessageHandler(error, false));
      }
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleCategoryStatus = async () => {
    try {
      setApiLoading(true);
      setCategoryStatusPopup(false);
      const res = await _POST(RPA_ACTION_EDIT, categoryData);
      setApiLoading(false);
      if (res.status === 200) {
        let tempInfo = bodyContent;
        if (res?.data?.status?.message === "Status updated successfully") {
          const index = tempInfo.findIndex(
            (x) =>
              x.campaign_id == categoryData[0].campaign_id &&
              x.category == categoryData[0].category_name
          );
          tempInfo[index].status =
            res?.data?.data?.result[0]?.action === "enable"
              ? "ACTIVE"
              : "PAUSED";
          tempInfo[index].updated_at = date.toLocaleDateString();
          setBodyData([...tempInfo]);
        }
        dispatch(setToastMessageHandler(res?.data?.status?.message, true));
      } else {
        let error =
          res?.data?.status?.message?.error || "Something went wrong!";

        dispatch(setToastMessageHandler(error, false));
      }
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleProductStatus = async () => {
    try {
      setApiLoading(true);
      setStatusPopup(false);
      const res = await _POST(RPA_ACTION_EDIT, productData);
      setApiLoading(false);

      if (res.status === 200) {
        let tempInfo = bodyContent;
        if (res?.data?.status?.message === "Status updated successfully") {
          const index = tempInfo.findIndex(
            (x) =>
              x.campaign_id == productData[0].campaign_id &&
              x.sku_id == productData[0].product_id
          );
          tempInfo[index].status =
            res?.data?.data?.result[0]?.action === "enable"
              ? "ACTIVE"
              : "PAUSED";
          tempInfo[index].updated_at = date.toLocaleDateString();

          setBodyData([...tempInfo]);
        }
        dispatch(setToastMessageHandler(res?.data?.status?.message, true));
      } else {
        let error =
          res?.data?.status?.message?.error || "Something went wrong!";

        dispatch(setToastMessageHandler(error, false));
      }
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };
  const handleStatus = ({ status, statusFlag }) => {
    let data = [];
    if (tabName === "campaign") {
      setUpdateCampaignId(statusFlag?.campaign_id);
      data = [
        {
          campaign_id: [statusFlag?.campaign_id],
          campaign_name: [statusFlag.campaign_name],
          action_type: tabName,
          action: status,
          action_message: `${status} campaign`,
          media_type: "Zepto",
          action_status: 10,
          segment: statusFlag.campaign_type,
          is_search_only: statusFlag.is_search_only,
          account_id: zeptoAccountId,
          account: statusFlag.account,
        },
      ];
      handleAction({ data, statusFlag });
    }

    if (tabName == "keyword") {
      setUpdateCampaignId(statusFlag?.campaign_id);
      setUpdateKeywordId(statusFlag.keyword_id);
      data = [
        {
          campaign_id: [statusFlag?.campaign_id],
          campaign_name: [statusFlag.campaign_name],
          action_type: tabName,
          action: status,
          action_message: `${status} keyword`,
          media_type: "Zepto",
          action_status: 10,
          segment: statusFlag.campaign_type,
          is_search_only: statusFlag.is_search_only,
          account_id: zeptoAccountId,
          keyword_id: statusFlag.keyword_id,
          account: statusFlag.account,
          keywords: statusFlag.keyword,
          match_type: statusFlag.match_type,
        },
      ];
      handleKeywordAction({ data, statusFlag });
    }

    if (tabName == "product") {
      setUpdateCampaignId(statusFlag?.campaign_id);
      setUpdateProductId(statusFlag.product_id);
      data = [
        {
          campaign_id: [statusFlag?.campaign_id],
          campaign_name: [statusFlag.campaign_name],
          action_type: tabName,
          action: status,
          action_message: `${status} product`,
          media_type: "Zepto",
          action_status: 10,
          segment: statusFlag.campaign_type,
          is_search_only: statusFlag.is_search_only,
          account_id: zeptoAccountId,
          product_id: statusFlag?.product_id,
          account: statusFlag.account,
          products: statusFlag.product,
        },
      ];

      status === "pause" ? setStatusPopup("pause") : setStatusPopup("enable");
      setProductData(data);
    }

    if (tabName == "category") {
      setUpdateCampaignId(statusFlag?.campaign_id);
      setCategoryName(statusFlag?.category);
      data = [
        {
          campaign_id: [statusFlag?.campaign_id],
          campaign_name: [statusFlag.campaign_name],
          action_type: tabName,
          action: status,
          action_message: `${status} category`,
          media_type: "Zepto",
          action_status: 10,
          segment: statusFlag.campaign_type,
          is_search_only: statusFlag.is_search_only,
          account_id: zeptoAccountId,
          category_name: statusFlag?.category,
          account: statusFlag.account,
        },
      ];
      status === "pause"
        ? setCategoryStatusPopup("pause")
        : setCategoryStatusPopup("enable");
      setCategoryData(data);
    }
  };
  function TableCol({ row, name, pid, rowIndex, totalLength }) {
    // console.log(showPopupOne, "showPopupOne", pid);
    let rows = [];
    let perArray = ["ctr", "cvr"];
    let rupeeArray = ["cpc", "spend", "revenue", "aov", "campaign_budget"];
    headers.map((item) => {
      if (item.showCol) {
        if (
          Object.prototype.hasOwnProperty.call(row, item.value) &&
          ![
            "campaign_name",
            "status",
            "campaign_budget",
            "bid",
            "keyword",
            "product_name",
            "category",
            "sku_id",
            "availability",
          ].includes(item.value) &&
          !(item.value === "tag_id" && row[item.value]?.length === 0)
        ) {
          let init = (
            <td className="p-2">
              <div>
                {" "}
                <ValueFormatter row={row} val={item.value} name={name} />
              </div>
              {row?.compData &&
                row?.deltaObj &&
                row?.deltaObj[item?.value] &&
                row[item.value] !== "N/A" && (
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
                <div>
                  <div className="flex cursor-pointer items-center border rounded-e-3xl rounded-s-3xl w-fit px-2 py-1 border-[#D9D9D9] bg-[#FAFAFA] ">
                    <div
                      style={{
                        backgroundColor: tagNames[0]?.color,
                        width: "14px",
                        height: "14px",
                        borderRadius: "100%",
                        marginRight: "5px",
                        borderColor: "green",
                      }}
                    ></div>
                    <div
                      className="flex"
                      onClick={(e) => {
                        if (!hasPermission) {
                          return;
                        }
                        // setShowPopupTwo(row.id);
                        tagPosition(e);
                        setShowNewTagPopup(false);
                        setShowSelectedTagPopup(true);
                        setAddedTags(row.tag_id);
                        setCampaignId(row.campaign_id);
                      }}
                    >
                      {" "}
                      {tagNames[0]?.tag_name}
                      <WhenPermitted
                        platform="zepto"
                        permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                      >
                        <img
                          className=""
                          src="/assets/images/chevron-down.svg"
                        />
                      </WhenPermitted>
                    </div>
                  </div>
                  <div className="relative">
                    {/* {showPopupTwo === pid ? (
                      <div
                        className={`${
                          rowIndex < totalLength - 10 ? "top-0" : "bottom-0"
                        } drop-shadow-md  p-4 rounded absolute top-0 bg-white w-max right-0
                      z-[10] border-gray-300`}
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
                                    className="mr-1 accent-purple-900"
                                    type="checkbox"
                                    checked={addedTags.includes(tag._id)}
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
                        {tagData.length !== addedTags.length && (
                          <p className="font-semibold">Select more tags</p>
                        )}
                        {tagData.map((tag) => {
                          if (!addedTags.includes(tag._id)) {
                            return (
                              <div key={tag._id}>
                                <div className="flex items-center">
                                  <input
                                    className="mr-1 accent-purple-900"
                                    type="checkbox"
                                    checked={selectedTagIds.includes(tag._id)}
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
                </div>
              </td>
            );
          }

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
              <div> - </div>
            </td>
          );
          if (item.value == "tag_id") {
            init = (
              <td className="p-2 min-w-[120px]">
                <div className="relative">
                  <div
                    className=" cursor-pointer flex items-center border rounded-e-3xl rounded-s-3xl w-fit px-3 py-1 border-[#D9D9D9] bg-[#FAFAFA]"
                    onClick={(e) => {
                      if (!hasPermission) {
                        return;
                      }
                      // setShowPopupOne(row.campaign_id);
                      tagPosition(e);
                      setShowNewTagPopup(true);
                      setShowSelectedTagPopup(false);
                      setCampaignId(row.campaign_id);
                    }}
                  >
                    <p>Add Tag</p>
                    <WhenPermitted
                      platform="zepto"
                      permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                    >
                      <img className="" src="/assets/images/chevron-down.svg" />
                    </WhenPermitted>
                  </div>
                  {/* {showPopupOne === row.campaign_id ? (
                    <div
                      className={`${
                        rowIndex < totalLength - 10 ? "top-0" : "bottom-0"
                      }  drop-shadow-md card p-4 rounded absolute  bg-white w-max right-0  z-[10] border-gray-300`}
                    >
                      {tagData && tagData.length > 0 ? (
                        tagData.map((tags, index) => (
                          <li
                            key={index}
                            className="flex cursor-pointer mb-2  items-center  text-sm mt-1 "
                          >
                            <input
                              className="mr-1 accent-purple-900"
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
                          {" "}
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
                      {tagData.length > 0 && (
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
                            className=" p-1 rounded w-16 text-white bg-[#3c006b]"
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
          if (item.value === "keyword") {
            init = (
              <td>
                <div
                  className={
                    tabName === "keyword" &&
                    "text-[#9D7FB5]  cursor-pointer px-1  py-1"
                  }
                >
                  {row.keyword}
                </div>
              </td>
            );
          }
          if (item.value === "category") {
            init = (
              <td>
                <div
                  className={
                    tabName === "category" &&
                    "text-[#9D7FB5]  cursor-pointer px-1  py-1"
                  }
                >
                  {row.category}
                </div>
              </td>
            );
          }
          if (item.value === "product_name") {
            init = (
              <td>
                <div
                  className={
                    tabName === "product" &&
                    "text-[#9D7FB5]  flex justify-between cursor-pointer px-1  py-1 w-80"
                  }
                >
                  <p className="mr-3 text-[#9D7FB5]">{row.product_name}</p>
                  {row.image_url !== null ? (
                    <>
                      {" "}
                      <a target="blank" href={row.image_url}>
                        <img
                          className="w-16 h-12"
                          src={row.image_url}
                          alt="img"
                        />
                      </a>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </td>
            );
          }
          if (item.value === "sku_id") {
            init = (
              <td>
                <div
                  className={
                    tabName === "product" && "cursor-pointer  py-1 w-80"
                  }
                >
                  {row.sku_id}
                </div>
              </td>
            );
          }
          if (item.value === "availability") {
            init = (
              <td>
                <div
                  className={
                    tabName === "product" && "cursor-pointer capitalize "
                  }
                >
                  {row.availability ? row.availability : "NA"}
                </div>
              </td>
            );
          }
          if (item.value === "campaign_name") {
            init = (
              <td className="group ">
                {campaignNameData?.campaign_id !== row?.campaign_id ? (
                  <div className="flex items-center gap-1 !min-w-[440px]">
                    <div
                      className={
                        tabName === "campaign" &&
                        "text-[#9D7FB5]  cursor-pointer px-1  py-1"
                      }
                      onDoubleClick={() => {
                        if (!hasPermission) {
                          return;
                        }
                        campaignNameBlock(
                          row.campaign_id,
                          row.campaign_name,
                          row.campaign_type,

                          row.is_search_only,
                          row.account
                        );
                      }}
                    >
                      {row.campaign_name}
                    </div>

                    {row.pin !== null && tabName === "campaign" && (
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
                ) : (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setCampaignNameData();
                          setCampaignName("");
                          setNameError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        type="text"
                        autoFocus="autoFocus"
                        className="h-8 mr-2 pl-2 w-[100%] outline-purple-800"
                        value={campaignName}
                        placeholder={row?.campaign_name}
                        onChange={(e) => setCampaignName(e.target.value)}
                      />
                      <button onClick={() => handleCampaignName()}>
                        {" "}
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                        />
                      </button>
                      <img
                        src="/assets/images/x.svg"
                        className="cursor-pointer w-[4%]"
                        onClick={() => {
                          setCampaignNameData({
                            campaign_id: "",
                            campaign_name: "",
                            campaign_type: "",
                            is_search_only: "",
                          });
                          setCampaignName("");
                          setNameError(false);
                        }}
                      />
                    </div>
                    {nameError !== false && (
                      <p className="text-red-500">{nameError}</p>
                    )}
                  </>
                )}

                {tabName == "campaign" && (
                  <WhenPermitted
                    platform="zepto"
                    permission={PERMISSIONS.CAMPAIGN_ACTIONS}
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
                        hidePin={row.pin !== null}
                      />
                    </div>
                  </WhenPermitted>
                )}
              </td>
            );
          }
          if (item.value === "status" && tabName === "campaign") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div className=" relative w-[140px] h-[55px]  py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex">
                  {updateCampaignId !== undefined &&
                  updateCampaignId == row.campaign_id &&
                  apiLoading ? (
                    <>
                      <div
                        className={`h-[19px] px-2 py-px rounded-2xl border  justify-start items-center gap-[5px] inline-flex `}
                        style={{
                          backgroundColor: "#FFF7E6",
                          color: "#EF880F",
                          borderColor: "#FFD591",
                        }}
                      >
                        <div className="justify-start items-center gap-[3px] flex">
                          <div className="font-medium ">In Progress</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <StatusSelectDropdown
                        handleSuccess={handleStatus}
                        disabled={!hasPermission}
                        statusFlagObj={{
                          campaign_id: row.campaign_id,
                          // campaign_status: !statusFlag.campaign_status,
                          campaign_name: row.campaign_name,
                          campaign_type: row.campaign_type,
                          is_search_only: row.is_search_only,
                          account: row.account,
                        }}
                        state={row.status}
                        optionList={[
                          { name: "Pause", status: "pause" },
                          { name: "Enable", status: "enable" },
                        ]}
                      />
                    </>
                  )}

                  <div className="text-black text-opacity-75 text-[13px] font-normal">
                    Last Edited:{" "}
                    {row.updated_at !== null
                      ? new Date(row.updated_at).toLocaleDateString()
                      : "NA"}
                  </div>
                </div>
              </td>
            );
          }

          if (item.value === "campaign_budget") {
            init = (
              <td className="min-w-[180px] w-[150px]">
                {campaignData.campaign_id !== row.campaign_id ? (
                  <div
                    className="cursor-pointer border px-1 w-[70%] py-1 rounded"
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      budgetBlock(
                        row.campaign_id,
                        row.campaign_name,
                        row.campaign_type,
                        row.campaign_budget,
                        row.is_search_only,
                        row.account
                      );
                    }}
                  >
                    {" "}
                    {row?.campaign_budget}
                  </div>
                ) : (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setCampaignData({});
                          setBudget("");
                          setBudgetError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        type="number"
                        autoFocus="autoFocus"
                        className="border rounded w-[70%] h-8 mr-2 pl-2  outline-purple-800"
                        value={budget}
                        placeholder={row?.campaign_budget}
                        onChange={(e) => handleNonNegativeInput(e, setBudget)}
                      />
                      <button onClick={() => handleBudget()}>
                        {" "}
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                        />
                      </button>
                      <img
                        src="/assets/images/x.svg"
                        className="cursor-pointer w-[10%]"
                        onClick={() => {
                          setCampaignData({});
                          setBudget("");
                          setBudgetError(false);
                        }}
                      />
                    </div>
                    {budgetError !== false && (
                      <p className="text-red-500">{budgetError}</p>
                    )}
                  </>
                )}
              </td>
            );
          }

          if (item.value === "status" && tabName === "keyword") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div className=" relative w-[140px] h-[55px]  py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex">
                  {updateCampaignId !== undefined &&
                  updateKeywordId !== undefined &&
                  updateCampaignId == row.campaign_id &&
                  updateKeywordId === row.keyword_id &&
                  apiLoading ? (
                    <>
                      <div
                        className={`h-[19px] px-2 py-px rounded-2xl border  justify-start items-center gap-[5px] inline-flex `}
                        style={{
                          backgroundColor: "#FFF7E6",
                          color: "#EF880F",
                          borderColor: "#FFD591",
                        }}
                      >
                        <div className="justify-start items-center gap-[3px] flex">
                          <div className="font-medium ">In Progress</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <StatusSelectDropdown
                        handleSuccess={handleStatus}
                        disabled={!hasPermission}
                        statusFlagObj={{
                          campaign_id: row.campaign_id,
                          // campaign_status: !statusFlag.campaign_status,
                          campaign_name: row.campaign_name,
                          campaign_type: row.campaign_type,
                          is_search_only: row.is_search_only,
                          keyword_id: row.keyword_id,
                          match_type: row.match_type,
                          account: row.account,
                          keyword: row.keyword,
                        }}
                        state={row.status}
                        optionList={[
                          { name: "Pause", status: "pause" },
                          { name: "Enable", status: "enable" },
                        ]}
                      />
                    </>
                  )}

                  <div className="text-black text-opacity-75 text-[13px] font-normal">
                    Last Edited:{" "}
                    {row.updated_at !== null
                      ? new Date(row.updated_at).toLocaleDateString()
                      : "NA"}
                  </div>
                </div>
              </td>
            );
          }

          if (item.value === "bid") {
            init = (
              <td className="min-w-[180px] w-[150px]">
                {keywordData.keyword_id !== row.keyword_id ||
                keywordData.campaign_id !== row.campaign_id ? (
                  <div
                    className="cursor-pointer border px-1 w-[70%] py-1 rounded"
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      keywordBidBlock(
                        row.campaign_id,
                        row.campaign_name,
                        row.campaign_type,
                        row.bid,
                        row.is_search_only,
                        row.keyword_id,
                        row.keyword,
                        row.account,
                        row.match_type
                      );
                    }}
                  >
                    {" "}
                    {row?.bid}
                  </div>
                ) : (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setKeywordData({});
                          setKeywordBid("");
                          setBidError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        type="number"
                        autoFocus="autoFocus"
                        className="border rounded w-[70%] h-8 mr-2 pl-2  outline-purple-800"
                        value={keywordBid}
                        placeholder={row?.bid}
                        onChange={(e) =>
                          handleNonNegativeInput(e, setKeywordBid)
                        }
                      />
                      <button onClick={() => handleBid()}>
                        {" "}
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                        />
                      </button>
                      <img
                        src="/assets/images/x.svg"
                        className="cursor-pointer w-[10%]"
                        onClick={() => {
                          setKeywordData({});
                          setKeywordBid("");
                          setBidError(false);
                        }}
                      />
                    </div>
                    {bidError !== false && (
                      <p className="text-red-500">{bidError}</p>
                    )}
                  </>
                )}
              </td>
            );
          }
          if (item.value === "status" && tabName === "product") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div className=" relative w-[140px] h-[55px]  py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex">
                  {updateCampaignId !== undefined &&
                  updateCampaignId == row.campaign_id &&
                  updateProductId == row.sku_id &&
                  apiLoading ? (
                    <>
                      <div
                        className={`h-[19px] px-2 py-px rounded-2xl border  justify-start items-center gap-[5px] inline-flex `}
                        style={{
                          backgroundColor: "#FFF7E6",
                          color: "#EF880F",
                          borderColor: "#FFD591",
                        }}
                      >
                        <div className="justify-start items-center gap-[3px] flex">
                          <div className="font-medium ">In Progress</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <StatusSelectDropdown
                        handleSuccess={handleStatus}
                        disabled={!hasPermission}
                        statusFlagObj={{
                          campaign_id: row.campaign_id,
                          product_id: row.sku_id,
                          campaign_name: row.campaign_name,
                          campaign_type: row.campaign_type,
                          is_search_only: row.is_search_only,
                          account: row.account,
                          product: row.product_name,
                        }}
                        state={row.status}
                        optionList={[
                          { name: "Pause", status: "pause" },
                          { name: "Enable", status: "enable" },
                        ]}
                      />
                    </>
                  )}

                  <div className="text-black text-opacity-75 text-[13px] font-normal">
                    Last Edited: {new Date(row.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </td>
            );
          }

          if (item.value === "status" && tabName === "category") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div className=" relative w-[140px] h-[55px]  py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex">
                  {updateCampaignId !== undefined &&
                  updateCampaignId == row.campaign_id &&
                  categoryName == row.category &&
                  apiLoading ? (
                    <>
                      <div
                        className={`h-[19px] px-2 py-px rounded-2xl border  justify-start items-center gap-[5px] inline-flex `}
                        style={{
                          backgroundColor: "#FFF7E6",
                          color: "#EF880F",
                          borderColor: "#FFD591",
                        }}
                      >
                        <div className="justify-start items-center gap-[3px] flex">
                          <div className="font-medium ">In Progress</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <StatusSelectDropdown
                        handleSuccess={handleStatus}
                        disabled={!hasPermission}
                        statusFlagObj={{
                          campaign_id: row.campaign_id,
                          category: row.category,
                          campaign_name: row.campaign_name,
                          campaign_type: row.campaign_type,
                          is_search_only: row.is_search_only,
                          account: row.account,
                        }}
                        state={row.status}
                        optionList={[
                          { name: "Pause", status: "pause" },
                          { name: "Enable", status: "enable" },
                        ]}
                      />
                    </>
                  )}

                  <div className="text-black text-opacity-75 text-[13px] font-normal">
                    Last Edited:{" "}
                    {row.updatedAt == null
                      ? new Date(row.updated_at).toLocaleDateString()
                      : new Date(row.updatedAt).toLocaleDateString()}
                  </div>
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
    let rupeeArray = [
      "cpc",
      "estimated_budget_consumed",
      "revenue",
      "aov",
      "campaign_budget",
    ];
    headers.map((item) => {
      if (item.showCol) {
        if (Object.prototype.hasOwnProperty.call(row, item.value)) {
          let init = (
            <td className="p-2 ">
              <div>
                <span className="!font-normal text-[13px]"> {item.title}</span>{" "}
              </div>
              <div>
                <SummaryValueFormatter
                  row={row}
                  val={item?.value}
                  name={name}
                />
              </div>
              {row?.summaryCompData &&
                row?.summaryCompData[0][item?.value] !== 0 &&
                row?.summaryCompData[0][item?.value] !== "₹0" &&
                row?.summaryCompData[0][item?.value] !== "0%" &&
                row?.summaryCompData[0][item?.value] &&
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
              ? `campaignreportcheckbox__table max-h-[450px] overflow-y-auto  ${
                  bodyContent?.length === 0
                    ? "h-[200px]"
                    : expandTable
                    ? "!max-h-[550px]"
                    : ""
                }`
              : `campaignreport__table max-h-[450px] overflow-y-auto ${
                  bodyContent?.length === 0
                    ? "h-[200px]"
                    : expandTable
                    ? "!max-h-[550px]"
                    : ""
                }`
          }
          onScroll={handleScroll}
        >
          <table className="h-full" style={{ width: "100%" }}>
            <thead
              className={
                isCheckBoxRequired
                  ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35]"
                  : "campaignreport__tablehead table-fixed sticky top-0 left-0 z-[35]"
              }
            >
              <tr className="">
                {isCheckBoxRequired === true && (
                  <th className="pr-6 !pl-4">
                    <input
                      className="h-16  accent-purple-900"
                      // className={`h-16  accent-purple-900 ${
                      //   bodyContent.some(
                      //     (item) => item.campaign_type === "Performance"
                      //   )
                      //     ? ""
                      //     : "opacity-0"
                      // }`} //Hide the checkbox when only Awareness campaign_type
                      type="checkbox"
                      checked={
                        bodyContent?.length > 0 &&
                        selectedCheckBox?.length === bodyContent?.length
                      }
                      // checked={
                      //   bodyContent?.length > 0 &&
                      //   selectedCheckBox?.length ===
                      //     bodyContent.filter(
                      //       (item) => item.campaign_type === "Performance"
                      //     )?.length
                      // }
                      onChange={(e) => handleAllCheckBox(e, bodyContent)}
                      // disabled={
                      //   bodyContent?.length > 0 &&
                      //   !bodyContent.some(
                      //     (item) => item.campaign_type === "Performance"
                      //   )
                      // } //Disable the checkbox when only Awareness campaign_type
                    />
                  </th>
                )}

                {headers.map((item) => {
                  //  console.log("headers ====>",headers,"keys",Object.keys(item))
                  if (item.showCol) {
                    return (
                      <>
                        {item.type === "single" ? (
                          <th
                            className="!pl-4"
                            style={thStyle(item.columnType, "zepto")}
                          >
                            <div className="tableHead px-1">
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
                                      {/* <img src="/assets/images/arrow-up-new.svg" /> */}
                                      ▲
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className="cursor-pointer downArrow"
                                      onClick={() => sortData(item?.value, -1)}
                                      style={{
                                        color:
                                          Object.keys(sort)[0] === item.value &&
                                          Object.values(sort)[0] === -1
                                            ? "black"
                                            : "grey",
                                      }}
                                    >
                                      {/* <img src="/assets/images/arrow-down-new.svg" /> */}
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
              {bodyContent &&
                bodyContent.length > 0 &&
                bodyContent
                  .filter((row) => row.pin !== null && row.pin !== "-")
                  .sort((a, b) => b.pin - a.pin) // Sort rows based on "pin" in descending order
                  .map((row, i) => (
                    <tr
                      className={
                        isCheckBoxRequired
                          ? "tableContentCheckBox"
                          : "tablecontent"
                      }
                      key={i}
                    >
                      {isCheckBoxRequired && (
                        <td className="min-w-max">
                          <input
                            className="h-16 accent-purple-900"
                            type="checkbox"
                            checked={selectedCheckBox
                              .map((id) => id?.id)
                              .includes(row?.id)}
                            onChange={(e) => handleCheckBox(e, row)}
                          />
                        </td>
                      )}

                      <TableCol
                        row={row}
                        name={name}
                        pid={row.id}
                        totalLength={bodyContent?.length}
                        rowIndex={i}
                      />
                    </tr>
                  ))}

              {!loading && bodyContent && bodyContent.length === 0 && (
                <tr>
                  <div className="p-2 !border-b-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {" "}
                    No Data Found
                  </div>
                </tr>
              )}
              {loading && bodyContent?.length === 0 && (
                <tr>
                  <div className="p-2 !border-b-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {" "}
                    <LoaderSpinner />
                  </div>
                </tr>
              )}
              {loading && bodyContent?.length > 0 && (
                <tr>
                  <td colSpan="18" className="relative h-20 !pl-0">
                    <div className="sticky left-0 max-w-[90vw] inset-0 flex items-center justify-center">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

            {tabName === "campaign" &&
              bodyContent &&
              bodyContent?.length > 0 && (
                <tbody>
                  {bodyContent &&
                    bodyContent.length > 0 &&
                    bodyContent
                      .filter((row) => row.pin === null)
                      .map((row, i) => (
                        <tr
                          className={
                            isCheckBoxRequired
                              ? "tableContentCheckBox"
                              : "tablecontent"
                          }
                          key={i}
                        >
                          {isCheckBoxRequired && (
                            <td className="min-w-max">
                              <input
                                className="h-16 accent-purple-900"
                                type="checkbox"
                                checked={selectedCheckBox
                                  .map((id) => id.id)
                                  .includes(row.id)}
                                onChange={(e) => handleCheckBox(e, row)}
                              />
                            </td>
                          )}

                          <TableCol
                            row={row}
                            name={name}
                            pid={row.id}
                            totalLength={bodyContent?.length}
                            rowIndex={i}
                          />
                        </tr>
                      ))}
                  {loading && bodyContent?.length > 0 && (
                    <tr>
                      <td colSpan="18" className="relative h-20 !pl-0">
                        <div className="sticky left-0 max-w-[90vw] inset-0 flex items-center justify-center">
                          <LoaderSpinner />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              )}

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
                        <tr key={i} className="font-semibold">
                          <td className="sticky left-0 min-w-max z-30 flex flex-col pt-2 !border-none">
                            <div className="!font-normal text-[13px]">
                              Total
                            </div>
                            <div className="font-semibold">
                              {!isNaN(totalData) || totalData ? totalData : 0}
                            </div>
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

                          <TableTotalCol
                            row={!isNaN(row) || row ? row : 0}
                            name={name}
                          />
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
      <div>
        {statusPopup !== false && (
          <DialogBox
            buttonName="Accept"
            title="Confirmation"
            platform="zepto"
            onAccept={() => {
              handleProductStatus();
            }}
            onCancel={() => {
              setStatusPopup(false);
            }}
          >
            {statusPopup === "pause"
              ? "Product will be removed from the campaign on Zepto Platform, but will show Paused on e-Genie."
              : "Product will be added to the campaign on the Zepto Platform."}
          </DialogBox>
        )}
      </div>
      <div>
        {categoryStatusPopup !== false && (
          <DialogBox
            buttonName="Accept"
            title="Confirmation"
            platform="zepto"
            onAccept={() => {
              handleCategoryStatus();
            }}
            onCancel={() => {
              setCategoryStatusPopup(false);
            }}
          >
            {categoryStatusPopup === "pause"
              ? "Product in the selected category will be removed from the campaign on Zepto platform, but paused on e-Genie."
              : "Product in the selected category will be added to the campaign on Zepto platform."}
          </DialogBox>
        )}
      </div>
      {showSelectedTagPopup && (
        <SelectedTagPopup
          open={showSelectedTagPopup}
          setOpen={setShowSelectedTagPopup}
          platform="zepto"
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
          platform="zepto"
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

export default ZeptoItSearchTable;
