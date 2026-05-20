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
  APPLICATION_ROUTES,
  RPA_ACTION_EDIT,
  INSTAMART_CAMPAIGN_PIN,
  PERMISSIONS,
} from "../../../utils/constants";
import LoaderSpinner from "../loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import ActionType from "../../../redux/types";
import { useHistory } from "react-router";
import StatusSelectDropdown from "../dropdown/StatusSelectDropdown";
// import PinMenu from "../PinMenu/PinMenu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "./style.css";
import ConfirmationPopup from "../Popups/ConfirmationPopup";
import PinMenu from "../PinMenu/PinMenu";
import SelectedTagPopup from "../Popups/SelectedTagPopup";
import NewTagPopup from "../Popups/NewTagPopup";
import WhenPermitted from "../WhenPermitted";
import { thStyle } from "../../../utils/helpers";

const InstamartSearchTerm = ({
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
  // download,
  // startDate,
  // endDate,
  // funnelCount,
}) => {
  let currency = localStorage.getItem("currency");
  const { expandTable } = useSelector((state) => state?.CommonReducer);
  // console.log(sort, sortData, "downArrow");
  // React.useEffect(() => {
  //   console.log("sortsort", sort, Object.keys(sort)[0], Object.values(sort)[0]);
  // }, [sort]);
  const [campaignId, setCampaignId] = useState("");
  // holds the data of selected check boxes from the redux
  let { selectedCheckBox, instamartAccountId } = useSelector(
    (state) => state?.CampaignReducer
  );
  let { recallCampaign } = useSelector((state) => state?.RecallCampaignReducer);
  //hold the tag data from the redux
  const { tagData } = useSelector((state) => state?.TagReducer);
  //holds the value of tags which are attached to a campaign
  const [addedTags, setAddedTags] = useState([]);
  // handles the tags to be attached to a campaign
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  // const [showPopupOne, setShowPopupOne] = useState(false);
  // const [showPopupTwo, setShowPopupTwo] = useState(undefined);
  const [recallTags, setRecallTags] = useState({});
  const [updateCampaignId, setUpdateCampaignId] = useState();
  const [apiLoading, setApiLoading] = useState(false);
  const [editBudget, setEditBudget] = useState();
  const [error, setError] = useState(false);
  const [dateOption, setDateOption] = useState("selectDate");
  const [selectedDate, setSelectedDate] = useState();
  const [changeStatus, setChangeStatus] = useState("");
  // const [confirm, setConfirm] = useState(false);
  // const [confirmBid, setConfirmBid] = useState(false);
  const [keywordBidError, setKeywordError] = useState(false);
  const [keywordBid, setKeywordBid] = useState();
  const currency_format = localStorage.getItem("currency_format");
  const [confirmBid, setConfirmBid] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState({
    isOpen: false,
  });
  const userPermissions = useSelector(
    (state) => state?.permissionsReducer || []
  );
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CAMPAIGN_ACTIONS,
    platform: "instamart",
  });
  const date = new Date();
  // console.log("body content", bodyContent);

  const [statusFlag, setStatusFlag] = useState({
    campaign_id: "",
    status: false,
    campaign_name: "",
    campaign_type: "",
    account: "",
    account_id: "",
  });

  const [editBudgetId, setEditBudgetId] = useState({
    campaign_id: 0,
    campaign_name: "",
    campaign_type: "",
    account: "",
    account_id: "",
    budget: "",
  });

  const [extendDate, setExtendDate] = useState({
    campaign_id: 0,
    campaign_name: "",
    campaign_type: "",
    account: "",
    account_id: "",
  });

  const [editKeywordId, setEditKeywordId] = useState({
    campaign_id: 0,
    keyword: "",
    matchtype: "",
    campaign_type: "",
    campaign_name: "",
    current_bid: "",
    max_bid: "",
    min_bid: "",
    account: "",
    account_id: "",
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

  const handlePinClick = async ({ pinStatus, campaignId }) => {
    const data = {
      campaign_id: [campaignId],
      pin_status: pinStatus,
    };
    const result = await _POST(INSTAMART_CAMPAIGN_PIN, data);
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

  const handleAction = async ({ data, statusFlag = null }) => {
    try {
      setApiLoading(true);

      const res = await _POST(RPA_ACTION_EDIT, data);
      setChangeStatus("");
      setApiLoading(false);
      if (res?.status === 200) {
        let tempInfo = bodyContent;
        if (res?.data?.status?.message === "deactivate Performed Successully") {
          const index = tempInfo.findIndex(
            (x) => x.campaign_id == statusFlag.campaign_id
          );

          tempInfo[index].status = "Stopped";
          setBodyData([...tempInfo]);
        } else if (
          res?.data?.status?.message === "set_budget Performed Successfully"
        ) {
          const index = tempInfo.findIndex(
            (x) => x.campaign_id == editBudgetId.campaign_id
          );
          tempInfo[
            index
          ].campaign_budget = `₹${res?.data?.data?.result[0]?.set_value}`;
          setBodyData([...tempInfo]);
        } else if (
          res?.data?.status?.message ===
          "extend_end_date Performed Successfully"
        ) {
          const index = tempInfo.findIndex(
            (x) => x.campaign_id == extendDate.campaign_id
          );
          if (res?.data?.data?.result[0]?.end_date === null) {
            tempInfo[index].end_date = "onwards";
          } else {
            tempInfo[index].end_date = res?.data?.data?.result[0]?.end_date;
          }
          setBodyData([...tempInfo]);
        } else if (
          res?.data?.status?.message ===
            "stop product performed successfully" ||
          res?.data?.status?.message === "enable product performed successfully"
        ) {
          const index = tempInfo.findIndex(
            (x) =>
              x.campaign_id == statusFlag.campaign_id &&
              x["instamart_products.product_id"] == statusFlag.product_id
          );
          tempInfo[index].status =
            res?.data?.data?.result[0].action_type == "add_product"
              ? "Active"
              : "Stopped";
          tempInfo[index].updated_at = res?.data?.data?.result[0].updatedat;

          setBodyData([...tempInfo]);
        } else if (
          res?.data?.status?.message ===
            "stop keyword performed successfully" ||
          res?.data?.status?.message === "enable keyword performed successfully"
        ) {
          const index = tempInfo.findIndex(
            (x) =>
              x.campaign_id == statusFlag.campaign_id &&
              x.keyword == statusFlag.keyword
          );
          tempInfo[index].status =
            res?.data?.data?.result[0].action_type == "add_keyword"
              ? "Active"
              : "Stopped";
          tempInfo[index].updated_at = res?.data?.data?.result[0].updatedat;
          setBodyData([...tempInfo]);
        }
        //  else if (
        //   res?.data?.status?.message === "Category bid updated successfully"
        // ) {
        //   const index = tempInfo.findIndex(
        //     (x) =>
        //       x.campaign_id == editCategoryId.campaign_id &&
        //       x.category_id === editCategoryId.category_id
        //   );

        //   tempInfo[
        //     index
        //   ].cpm_bid = `₹${res?.data?.data?.result[0]?.set_value}.00`;
        //   tempInfo[index].updated_at = date.toLocaleDateString();

        //   setBodyData([...tempInfo]);
        // }
        else if (
          res?.data?.status?.message === "set_bid performed successfully"
        ) {
          const index = tempInfo.findIndex(
            (x) =>
              x.campaign_id == editKeywordId.campaign_id &&
              x.keyword === editKeywordId.keyword
          );
          tempInfo[index].bid = `${res?.data?.data?.result[0]?.set_value}`;
          // tempInfo[index].bid = `₹${res?.data?.data?.result[0]?.set_value}.00`;
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

  const handleBudget = () => {
    if (editBudget === undefined || !editBudget) {
      setError("Enter budget value");
    } else if (
      parseFloat(editBudget) <
      parseFloat(editBudgetId.budget.replace(/[^0-9.-]+/g, ""))
    ) {
      setError("Budget cannot be decreased for live campaign");
    } else {
      // console.log("edit budget", editBudgetId);
      const data = [
        {
          campaign_id: [editBudgetId.campaign_id],
          campaign_name: [editBudgetId.campaign_name],
          action: "set_budget",
          action_type: "campaign_action",
          set_value: parseFloat(editBudget),
          action_message: `Set budget to ${currency}${editBudget}`,
          media_type: "Instamart",
          action_status: 10,
          campaign_type: editBudgetId.campaign_type,
          account: editBudgetId.account,
          client_id: localStorage.getItem("client_id"),
          account_id: editBudgetId.account_id,
        },
      ];
      // console.log("data prepared", data);
      handleAction({ data });
      setEditBudgetId({
        campaign_id: "",
        campaign_name: "",
        campaign_type: "",
        account: "",
        account_id: "",
        budget: "",
      });
    }
  };

  const keywordBidBlock = (
    campaign_id,
    campaign_type,
    keyword,
    matchtype,
    current_bid,
    max_bid,
    min_bid,
    campaign_name,
    account,
    account_id
  ) => {
    setEditKeywordId({
      campaign_id,
      keyword,
      matchtype,
      campaign_type,
      campaign_name,
      current_bid,
      max_bid,
      min_bid,
      account,
      account_id,
    });
  };

  const handleKeywordBid = () => {
    if (keywordBid === undefined || !keywordBid) {
      setKeywordError("Enter bid value");
    } else if (
      parseFloat(keywordBid) < parseFloat(editKeywordId.min_bid) ||
      parseFloat(keywordBid) > parseFloat(10000)
    ) {
      setKeywordError(
        `Enter bid between ${currency}${parseFloat(
          editKeywordId.min_bid
        ).toLocaleString(currency_format)} and ${currency}${parseFloat(
          10000
        ).toLocaleString(currency_format)}`
      );
    } else {
      setKeywordError(false);
      // console.log("datata", editKeywordId);
      const data = [
        {
          campaign_id: [editKeywordId.campaign_id],
          campaign_name: [editKeywordId.campaign_name],
          action_type: "set_bid",
          action: "keyword",
          action_message: `Set keyword bid from ${
            editKeywordId.current_bid
          } to ${currency}${parseFloat(keywordBid).toLocaleString(
            currency_format
          )}`,
          media_type: "Instamart",
          action_status: 10,
          set_value: parseFloat(keywordBid),
          campaign_type: editKeywordId.campaign_type,
          keyword_name: editKeywordId.keyword,
          match_type: editKeywordId.matchtype,
          account: editKeywordId.account,
          account_id: editKeywordId.account_id,
        },
      ];

      handleAction({ data });
      setEditKeywordId({
        campaign_id: 0,
        keyword: "",
        matchtype: "",
        campaign_type: "",
        campaign_name: "",
        current_bid: "",
        max_bid: "",
        min_bid: "",
        account: "",
        account_id: "",
      });
    }
  };

  useEffect(() => {
    if (!apiLoading) {
      setUpdateCampaignId();
    }
  }, [apiLoading]);

  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(0);
    }
  };

  let allTabSelectedCheckBox = selectedCheckBox;
  selectedCheckBox =
    selectedCheckBox &&
    Object.prototype.hasOwnProperty.call(selectedCheckBox, tabName)
      ? selectedCheckBox[tabName]
      : [];
  const dispatch = useDispatch();
  const history = useHistory();

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
    }
    // if (tabName === "campaign") {
    //   if (updatedIds[tabName].length > 0) {
    //     let campIds = [];
    //     updatedIds[tabName].map((item) => {
    //       campIds.push(item.campaign_id);
    //     });

    //     funnelCount(campIds);
    //   } else {
    //     funnelCount([]);
    //   }
    // }
  };
  const handleAllCheckBox = async (e, data) => {
    // checked state of the checkbox
    const isChecked = e.target.checked;
    let updatedIds = allTabSelectedCheckBox;
    // if the checkbox is selected, add the data to the previous selectedData array
    if (isChecked) {
      updatedIds[tabName] = [...data];
      if (tabName === "campaign") {
        let campIds = [];
        updatedIds[tabName].map((item) => {
          campIds.push(item.campaign_id);
        });
        updatedIds["keyword"] = [];
        updatedIds["product"] = [];
        // funnelCount(campIds);
      }
      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });
    } else {
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
  // const fetchAllTagsApi = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await _GET(
  //       `${BLINKIT_TAGS}?platform=instamart&data_level=campaign`
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

  const handleVerifyBid = async (status, statusFlag) => {
    // console.error("bid_hitt");
    if (status === "enable") {
      const check = statusFlag.bid < statusFlag.min_bid;
      if (check) {
        setConfirmBid(true);
      } else {
        handleKeywordStatusApi(status, statusFlag);
      }
    }
    if (status === "stop") {
      handleKeywordStatusApi(status, statusFlag);
    }
  };

  const handleKeywordStatusApi = async (status, statusFlag) => {
    let data;
    setChangeStatus(status);
    data = [
      {
        campaign_id: [statusFlag?.campaign_id],
        campaign_name: [statusFlag.campaign_name],
        action_type: status == "enable" ? "add_keyword" : "remove_keyword",
        action: `keyword`,
        action_message: `${status} keyword`,
        media_type: "Instamart",
        action_status: 10,
        keyword_name: statusFlag.keyword,
        match_type: statusFlag.match_type,
        account: statusFlag.account,
        account_id: statusFlag.account_id,
        client_id: localStorage.getItem("client_id"),
        ...(status === "enable" && {
          set_value:
            statusFlag.bid > statusFlag.min_bid
              ? statusFlag.bid
              : statusFlag.min_bid,
        }),
        ...(status === "stop" && { set_value: statusFlag.bid }),
      },
    ];
    console.error(data, "handleKeywordStatusApi");
    handleAction({ data, statusFlag });
    setConfirmPopup({ isOpen: false, status: "", statusFlag: "" });
  };

  const handleStatusApi = (status, statusFlag) => {
    let data;
    if (tabName == "product") {
      setChangeStatus(status);
      console.error(status, statusFlag, "in product tab");
      data = [
        {
          campaign_id: [statusFlag?.campaign_id],
          campaign_name: [statusFlag.campaign_name],
          product_id: statusFlag.product_id,
          products: statusFlag.product_name,
          action_type: status == "enable" ? "add_product" : "remove_product",
          action: `product`,
          action_message: `${status} product`,
          media_type: "Instamart",
          action_status: 10,
          // campaign_type: statusFlag.campaign_type,
          account: statusFlag.account,
          account_id: instamartAccountId,
          client_id: localStorage.getItem("client_id"),
        },
      ];
      console.error(data, "in product tab");
      handleAction({ data, statusFlag });
    }
    if (tabName == "campaign") {
      // console.log("status");
      data = [
        {
          campaign_id: [statusFlag?.campaign_id],
          campaign_name: [statusFlag.campaign_name],
          action_type: "campaign_action",
          action: "deactivate",
          action_message: `deactivate campaign`,
          media_type: "Instamart",
          action_status: 10,
          campaign_type: statusFlag.campaign_type,
          account: statusFlag.account,
          account_id: statusFlag.account_id,
          client_id: localStorage.getItem("client_id"),
        },
      ];

      handleAction({ data, statusFlag });
      setStatusFlag({
        campaign_id: "",
        campaign_status: status,
        campaign_name: "",
        account: "",
        account_id: "",
      });
    }

    setConfirmPopup({ isOpen: false, status: "", statusFlag: "" });
  };

  const handleConfirm = ({ status, statusFlag }) => {
    setConfirmPopup({
      ...confirmPopup,
      isOpen: true,
      status: status,
      statusFlag: statusFlag,
    });
    if (tabName == "product") {
      setUpdateCampaignId({
        campaign_id: statusFlag.campaign_id,
        product_id: statusFlag.product_id,
      });
    }
    if (tabName == "keyword") {
      setUpdateCampaignId({
        campaign_id: statusFlag.campaign_id,
        keyword: statusFlag.keyword,
      });
    }
  };

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
      let data;
      if (type == "newTag") {
        data = {
          // tag_id: selectedTagIds,
          tag_id: [...new Set(selectedTagIds)],
          platform: "instamart",
        };
      } else {
        data = {
          // tag_id: selectedTagIds,
          tag_id: [...new Set(addedTags)],
          platform: "instamart",
        };
      }
      // const data = {
      //   // tag_id: selectedTagIds,
      //   tag_id: [...new Set(selectedTagIds)],
      //   platform: "blinkit",
      // };
      setLoading(true);
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

  // const modifiedBodyContent = bodyContent.map((item) => {
  //   let status = item.status;

  //   if (status === "CAMPAIGN_STATUS_LIVE") {
  //     status = "LIVE";
  //   } else if (status === "CAMPAIGN_STATUS_STOPPED") {
  //     status = "STOPPED";
  //   } else if (status === "CAMPAIGN_STATUS_UPDATE_REASON_BUDGET_EXHAUSTED") {
  //     status = "EXHAUSTED";
  //   }

  //   return {
  //     ...item,
  //     status: status,
  //   };
  // });

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
      ) < 1;
    if (tabName !== "campaign" && bottom) {
      setDataLIMIT();
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

  function ValueFormatter({ row, val, name }) {
    let value = row[val];
    if (floatArr?.indexOf(val) > -1) {
      value = row[val] || 0;
    } else if (value === null) {
      value = "N/A";
    } else {
      if (val === "platform") {
        value = row[val] === "SM" ? "Supermart" : "Flipkart";
      } else if (val === "campaign_name" && name == "campaign") {
        value = <EditCampaign row={row} />;
      } else if (val === "instamart_keyword_bids.matchtype") {
        if (row[val] === "KEYWORD_MATCH_TYPE_EXACT") value = "EXACT";
        if (row[val] === "KEYWORD_MATCH_TYPE_BROAD") value = "BROAD";
      }
    }
    return value;
  }
  function SummaryValueFormatter({ row, val }) {
    let perArray = ["ctr", "cvr"];
    let rupeeArray = [
      "cpc",
      "cpm",
      "estimated_budget_consumed",
      "revenue",
      "aov",
      "budget",
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

        {row.status !== "STOPPED" ? (
          <WhenPermitted
            permission={PERMISSIONS.CAMPAIGN_ACTIONS}
            platform="instamart"
          >
            <button
              onClick={() => {
                history.push(
                  APPLICATION_ROUTES.INSTAMARTEDITCAMPAIGN,
                  row.campaign_id
                );
                dispatch({
                  type: ActionType.CAMPAIGN_DETAILS_INSTAMART,
                  payload: [],
                });
              }}
            >
              <div className="pr-1">
                <img
                  className="header-buttons mr-2"
                  src={"/assets/images/edit.svg"}
                  alt=""
                />
              </div>
            </button>
          </WhenPermitted>
        ) : null}
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

  const budgetBlock = (
    campaign_id,
    campaign_name,
    campaign_type,
    account,
    account_id,
    budget
  ) => {
    setEditBudgetId({
      campaign_id,
      campaign_name,
      campaign_type,
      account,
      account_id,
      budget,
    });
    setUpdateCampaignId(campaign_id);
  };

  const extendDateBlock = (
    campaign_id,
    campaign_name,
    campaign_type,
    account,
    account_id
  ) => {
    setExtendDate({
      campaign_id,
      campaign_name,
      campaign_type,
      account,
      account_id,
    });
    setUpdateCampaignId(campaign_id);
  };
  const handleExtendDate = () => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

    let data;
    data = [
      {
        campaign_id: [extendDate.campaign_id],
        campaign_name: [extendDate.campaign_name],
        action_type: "campaign_action",
        action: "extend_end_date",
        end_date: formattedDate,
        action_status: 10,
        action_message: `Campaign end date updated to ${formattedDate}`,
        account: extendDate.account,
        account_id: extendDate.account_id,
        media_type: "Instamart",
        client_id: localStorage.getItem("client_id"),
        campaign_type: extendDate.campaign_type,
        // end_date: dateOption === "selectDate" ? selectedDate : null, //Old code
        // react-datepicker
      },
    ];
    handleAction({ data });
    setExtendDate({
      campaign_id: "",
      campaign_name: "",
      campaign_type: "",
      account: "",
      account_id: "",
    });
    setEditBudget("");
  };

  function TableCol({ row, name, rowIndex, totalLength }) {
    // console.log(showPopupOne, "showPopupOne", pid);
    let rows = [];
    let perArray = ["ctr", "cvr"];
    let rupeeArray = ["cpc", "spend", "revenue", "aov", "budget"];
    headers.map((item) => {
      if (item.showCol) {
        if (
          Object.prototype.hasOwnProperty.call(row, item.value) &&
          ![
            "campaign_name",
            "status",
            "budget",
            "bid",
            "keyword",
            "product_name",
            "end_date",
            "bid",
          ].includes(item.value) &&
          !(item.value === "tag_id" && row[item.value]?.length === 0)
        ) {
          let init = (
            <td className="p-2 min-w-[150px] w-[150px]">
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
                  <div className="flex cursor-pointer items-center border rounded-e-3xl rounded-s-3xl w-fit px-2 py-1 border-[#D9D9D9] bg-[#FAFAFA]">
                    <div
                      style={{
                        backgroundColor: tagNames[0]?.color,
                        width: "14px",
                        height: "14px",
                        borderRadius: "100%",
                        marginRight: "5px",
                        borderColor: "pink",
                      }}
                    ></div>
                    <div
                      className="flex"
                      onClick={(e) => {
                        if (!hasPermission) {
                          return;
                        }
                        setAddedTags(row.tag_id);
                        setCampaignId(row.campaign_id);
                        // setShowPopupOne(undefined);
                        // setShowPopupTwo(row.id);
                        tagPosition(e);
                        setShowNewTagPopup(false);
                        setShowSelectedTagPopup(true);
                        setSelectedTagIds([]);
                      }}
                    >
                      {" "}
                      {tagNames[0]?.tag_name}
                      <WhenPermitted
                        permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                        platform="instamart"
                      >
                        <img
                          className=""
                          src="/assets/images/chevron-down.svg"
                        />
                      </WhenPermitted>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  {/* <div
                    onClick={() => {
                      setShowPopupTwo(pid);
                      setAddedTags(row.tag_id);
                      setCampaignId(row.campaign_id);
                      // alert(
                      //   `${
                      //     addedTags.length === 0 || selectedTagIds.length === 0
                      //   }`
                      // );
                    }}
                    className="text-blue-500 cursor-pointer"
                  >
                    See More {">"}
                  </div> */}
                  {/* {showPopupTwo === row.id ? (
                    <div
                      className={`${
                        rowIndex < totalLength - 10 ? "top-0" : "bottom-0"
                      }drop-shadow-md  p-4 rounded absolute top-0 bg-white w-max right-0
                      z-[20] border-gray-300`}
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
                                  className="mr-1 accent-pink-800"
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
                                    borderColor: "pink",
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
                                  className="mr-1 accent-pink-800"
                                  type="checkbox"
                                  checked={selectedTagIds.includes(tag._id)} // Check if the tag is selected
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
                                    borderColor: "pink",
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
                            className="bg-pink-800 p-1 rounded w-16 text-white"
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
              <td className="p-2 min-w-[150px] w-[150px]">
                <div className="relative">
                  <div
                    className="max-w-fit cursor-pointer flex items-center border rounded-e-3xl rounded-s-3xl min-w-fit px-3 py-1 border-[#D9D9D9] bg-[#FAFAFA]"
                    onClick={(e) => {
                      if (!hasPermission) {
                        return;
                      }
                      // setShowPopupOne(row.campaign_id);
                      // setShowPopupTwo(undefined);
                      tagPosition(e);
                      setShowNewTagPopup(true);
                      setShowSelectedTagPopup(false);
                      setCampaignId(row.campaign_id);
                      setSelectedTagIds([]);
                    }}
                  >
                    <p>Add Tag</p>
                    <WhenPermitted
                      platform="instamart"
                      permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                    >
                      <img className="" src="/assets/images/chevron-down.svg" />
                    </WhenPermitted>
                  </div>
                  {/* {showPopupOne === row.campaign_id ? (
                    <div
                      className={` ${
                        rowIndex < totalLength - 10 ? "top-0" : "bottom-0"
                      } drop-shadow-md card p-4 rounded absolute bg-white w-max right-0 z-[10] border-gray-300`}
                    >
                      {tagData && tagData.length > 0 ? (
                        tagData.map((tags, index) => (
                          <li
                            key={index}
                            className="flex cursor-pointer mb-2  items-center  text-sm mt-1 "
                          >
                            <input
                              className="mr-1 accent-pink-800"
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
                                borderColor: "pink",
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
                            className="bg-pink-800 p-1 rounded w-16 text-white"
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
          if (item.value === "status" && tabName === "campaign") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div
                  className={`relative realtive w-[156px] h-[55px] py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex`}
                >
                  {updateCampaignId !== undefined &&
                  updateCampaignId === row.campaign_id &&
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
                      {row.status === "CAMPAIGN_STATUS_STOPPED" ? (
                        <div className="h-[20px] w-[80px] border border-[#FFA39E] rounded-full text-[13px] bg-[#FFF1F0] text-[#F5222D] flex justify-center items-center gap-2 font-semibold cursor-default">
                          <div>
                            <img
                              src="/assets/images/red-circle.svg"
                              style={{ width: "4px" }}
                            />
                          </div>
                          Stopped
                        </div>
                      ) : (
                        <StatusSelectDropdown
                          handleSuccess={handleConfirm}
                          statusFlagObj={{
                            campaign_id: row.campaign_id,
                            status: !statusFlag.status,
                            campaign_name: row.campaign_name,
                            campaign_type: row.campaign_type,
                            account: row.account,
                            account_id: row.account_id,
                          }}
                          disabled={!hasPermission}
                          state={row.status}
                          optionList={[{ name: "Stop", status: "stop" }]}
                        />
                      )}
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
          if (item.value === "status" && tabName === "product") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div
                  className={`relative realtive cursor-pointer w-[156px] h-[55px] py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex`}
                >
                  {updateCampaignId !== undefined &&
                  updateCampaignId.campaign_id === row.campaign_id &&
                  updateCampaignId.product_id ===
                    row["instamart_products.product_id"] &&
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
                          <div
                            className="font-medium "
                            title={`Process: ${changeStatus}`}
                          >
                            In Progress
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <StatusSelectDropdown
                        handleSuccess={handleConfirm}
                        statusFlagObj={{
                          campaign_id: row.campaign_id,
                          status: !statusFlag.status,
                          campaign_name: row.campaign_name,
                          // campaign_type: row.campaign_type,
                          product_name: row.product_name,
                          product_id: row["instamart_products.product_id"],
                          account: row.account,
                          // account_id: row.account_id,
                        }}
                        disabled={!hasPermission}
                        state={row.status}
                        optionList={[
                          { name: "Pause", status: "stop" },
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
          if (item.value === "status" && tabName === "keyword") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div
                  className={`relative realtive cursor-pointer w-[156px] h-[55px] py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex`}
                >
                  {updateCampaignId !== undefined &&
                  updateCampaignId.campaign_id === row.campaign_id &&
                  updateCampaignId.keyword === row.keyword &&
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
                          <div
                            className="font-medium "
                            title={`Process: ${changeStatus}`}
                          >
                            In Progress
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <StatusSelectDropdown
                        handleSuccess={handleConfirm}
                        statusFlagObj={{
                          campaign_id: row.campaign_id,
                          status: !statusFlag.status,
                          campaign_name: row.campaign_name,
                          keyword: row.keyword,
                          bid: row.bid,
                          min_bid: row.min_bid,
                          match_type: row.matchtype,
                          account: row.account,
                          account_id: row.account_id,
                        }}
                        state={row.status}
                        optionList={[
                          { name: "Pause", status: "stop" },
                          { name: "Enable", status: "enable" },
                        ]}
                        disabled={!hasPermission}
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
          if (item.value === "campaign_name") {
            init = (
              <td
                className="group"
                // onMouseEnter={() => handlePin(true, row.campaign_id)}
                // onMouseLeave={() => handlePin(false, row.campaign_id)}
              >
                <div className="flex items-center gap-1">
                  <div
                    className={
                      tabName === "campaign" &&
                      "text-pink-900 hover:cursor-pointer"
                    }
                  >
                    {/* {row.campaign_name} */}
                    <ValueFormatter row={row} val={item.value} name={name} />
                  </div>

                  {/* Pin icon */}
                  {tabName === "campaign" && (
                    <>
                      {row.pin !== undefined && row.pin !== null && (
                        <>
                          {" "}
                          <img
                            className="w-4 cursor-pointer "
                            src="/assets/images/pin.svg"
                            onClick={() => {
                              if (!hasPermission) {
                                return;
                              }
                              handlePinClick({
                                pinStatus: false,
                                campaignId: row.campaign_id,
                              });
                            }}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Hovering options */}
                {
                  // <>
                  //   {" "}
                  //     {isHovered.pinStatus &&
                  //       isHovered.campaignId === row.campaign_id && (
                  tabName == "campaign" && (
                    <WhenPermitted
                      permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                      platform="instamart"
                    >
                      <div className="flex group-hover:visible invisible">
                        <PinMenu
                          handleDuplicate={false}
                          handlePin={() =>
                            handlePinClick({
                              pinStatus: true,
                              campaignId: row.campaign_id,
                            })
                          }
                          handleHistory={false}
                          hidePin={row.pin !== undefined && row.pin !== null}
                        />
                        {/* <div
                        className="flex cursor-pointer"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          pointerEvents: isHovered ? "cursor-pointer" : "none",
                        }}
                        onClick={() => handlePinClick(true)}
                      >
                        <img
                          className="w-4 mr-1"
                          src="/assets/images/duplicate1.svg"
                          // onClick={() => handlePinClick(false)}
                        />
                        <p className="text-xs mr-1">Duplicate</p>
                        {row.pin === null && (
                          <div
                            className="flex"
                            // onClick={() => handlePinClick(false)}
                          >
                            <img className="w-4" src="/assets/images/pin.svg" />
                            <p className="text-xs mr-1">Pin</p>
                          </div>
                        )}

                        <img
                          className="w-4 mr-1 "
                          src="/assets/images/pie-chart.svg"
                        />
                        <p className="text-xs ">History</p>
                      </div> */}
                      </div>
                    </WhenPermitted>
                  )
                  //       )}
                  // </>
                }
              </td>
            );
          }
          if (item.value === "product_name") {
            init = (
              <td
                className="group"
                // onMouseEnter={() => handlePin(true, row.campaign_id)}
                // onMouseLeave={() => handlePin(false, row.campaign_id)}
              >
                <div className="flex items-center gap-1">
                  <div
                    className={
                      tabName === "product" &&
                      "text-[#851853] hover:cursor-pointer"
                    }
                  >
                    {/* {row.campaign_name} */}
                    <ValueFormatter row={row} val={item.value} name={name} />
                  </div>

                  {/* Pin icon */}
                  {tabName === "campaign" && (
                    <>
                      {row.pin !== undefined && row.pin !== null && (
                        <>
                          {" "}
                          <img
                            className="w-4 cursor-pointer "
                            src="/assets/images/pin.svg"
                            onClick={
                              () => {}
                              // handlePinClick({
                              //   pinStatus: false,
                              //   campaignId: row.campaign_id,
                              // })
                            }
                          />
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Hovering options */}
                {/* {
                  // <>
                  //   {" "}
                  //     {isHovered.pinStatus &&
                  //       isHovered.campaignId === row.campaign_id && (
                  tabName == "campaign" && (
                    <div className="flex group-hover:visible invisible">
                      <PinMenu
                        handleDuplicate={false}
                        handlePin={() =>
                          handlePinClick({
                            pinStatus: true,
                            campaignId: row.campaign_id,
                          })
                        }
                        handleHistory={false}
                        hidePin={row.pin !== undefined && row.pin !== null}
                      />
                      <div
                        className="flex cursor-pointer"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          pointerEvents: isHovered ? "cursor-pointer" : "none",
                        }}
                        onClick={() => handlePinClick(true)}
                      >
                        <img
                          className="w-4 mr-1"
                          src="/assets/images/duplicate1.svg"
                          // onClick={() => handlePinClick(false)}
                        />
                        <p className="text-xs mr-1">Duplicate</p>
                        {row.pin === null && (
                          <div
                            className="flex"
                            // onClick={() => handlePinClick(false)}
                          >
                            <img className="w-4" src="/assets/images/pin.svg" />
                            <p className="text-xs mr-1">Pin</p>
                          </div>
                        )}

                        <img
                          className="w-4 mr-1 "
                          src="/assets/images/pie-chart.svg"
                        />
                        <p className="text-xs ">History</p>
                      </div>
                    </div>
                  )
                  //       )}
                  // </>
                } */}
              </td>
            );
          }
          // if (item.value === "keyword") {
          //   init = (
          //     <td
          //       className="group"
          //       // onMouseEnter={() => handlePin(true, row.campaign_id)}
          //       // onMouseLeave={() => handlePin(false, row.campaign_id)}
          //     >
          //       <div className="flex items-center gap-1">
          //         <div className={tabName === "keyword" && "text-[#851853]"}>
          //           {/* {row.campaign_name} */}
          //           <ValueFormatter row={row} val={item.value} name={name} />
          //         </div>

          //         {/* Pin icon */}
          //         {tabName === "campaign" && (
          //           <>
          //             {row.pin !== undefined && row.pin !== null && (
          //               <>
          //                 {" "}
          //                 <img
          //                   className="w-4 cursor-pointer "
          //                   src="/assets/images/pin.svg"
          //                   onClick={
          //                     () => {}
          //                     // handlePinClick({
          //                     //   pinStatus: false,
          //                     //   campaignId: row.campaign_id,
          //                     // })
          //                   }
          //                 />
          //               </>
          //             )}
          //           </>
          //         )}
          //       </div>

          //       {/* Hovering options */}
          //       {/* {
          //         // <>
          //         //   {" "}
          //         //     {isHovered.pinStatus &&
          //         //       isHovered.campaignId === row.campaign_id && (
          //         tabName == "campaign" && (
          //           <div className="flex group-hover:visible invisible">
          //             <PinMenu
          //               handleDuplicate={false}
          //               handlePin={() =>
          //                 handlePinClick({
          //                   pinStatus: true,
          //                   campaignId: row.campaign_id,
          //                 })
          //               }
          //               handleHistory={false}
          //               hidePin={row.pin !== undefined && row.pin !== null}
          //             />
          //             <div
          //               className="flex cursor-pointer"
          //               style={{
          //                 opacity: isHovered ? 1 : 0,
          //                 pointerEvents: isHovered ? "cursor-pointer" : "none",
          //               }}
          //               onClick={() => handlePinClick(true)}
          //             >
          //               <img
          //                 className="w-4 mr-1"
          //                 src="/assets/images/duplicate1.svg"
          //                 // onClick={() => handlePinClick(false)}
          //               />
          //               <p className="text-xs mr-1">Duplicate</p>
          //               {row.pin === null && (
          //                 <div
          //                   className="flex"
          //                   // onClick={() => handlePinClick(false)}
          //                 >
          //                   <img className="w-4" src="/assets/images/pin.svg" />
          //                   <p className="text-xs mr-1">Pin</p>
          //                 </div>
          //               )}

          //               <img
          //                 className="w-4 mr-1 "
          //                 src="/assets/images/pie-chart.svg"
          //               />
          //               <p className="text-xs ">History</p>
          //             </div>
          //           </div>
          //         )
          //         //       )}
          //         // </>
          //       } */}
          //     </td>
          //   );
          // }

          if (item.value === "budget") {
            init = (
              <td className="min-w-[150px] w-[150px]">
                <>
                  {row.status === "CAMPAIGN_STATUS_STOPPED" ? (
                    <div className=" border w-[70%] p-1 rounded">
                      {" "}
                      {row?.budget}
                    </div>
                  ) : (
                    <>
                      {editBudgetId.campaign_id !== row.campaign_id ? (
                        <div
                          className="cursor-pointer border w-[70%] p-1 rounded"
                          onDoubleClick={() => {
                            if (!hasPermission) {
                              return;
                            }
                            budgetBlock(
                              row.campaign_id,
                              row.campaign_name,
                              row.campaign_type,
                              row.account,
                              row.account_id,
                              row.budget
                            );
                          }}
                        >
                          {" "}
                          {row?.budget}
                        </div>
                      ) : (
                        <>
                          <div
                            className="flex"
                            onBlur={(e) => {
                              if (!e.currentTarget.contains(e.relatedTarget)) {
                                setEditBudgetId({
                                  campaign_id: "",
                                  campaign_name: "",
                                  campaign_type: "",
                                  account: "",
                                  account_id: "",
                                  budget: "",
                                });
                                setEditBudget("");
                              }
                            }}
                          >
                            {" "}
                            <input
                              type="number"
                              autoFocus="autoFocus"
                              className="border rounded w-[70%] h-8 mr-2 pl-2 outline-pink-700"
                              value={editBudget}
                              placeholder={row?.budget}
                              onChange={(e) =>
                                handleNonNegativeInput(e, setEditBudget)
                              }
                            />
                            <button onClick={() => handleBudget()}>
                              <img
                                src="/assets/images/tickmark.svg"
                                className="cursor-pointer mr-1"
                              />
                            </button>
                            <img
                              src="/assets/images/x.svg"
                              className="cursor-pointer w-[10%]"
                              onClick={() => {
                                setEditBudgetId({
                                  campaign_id: "",
                                  campaign_name: "",
                                  campaign_type: "",
                                  account: "",
                                  account_id: "",
                                  budget: "",
                                });
                                setEditBudget("");
                              }}
                            />
                          </div>

                          {error !== false && (
                            <p className="text-red-500">{error}</p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              </td>
            );
          }
          if (item.value === "end_date" && tabName === "campaign") {
            init = (
              <td className={`min-w-[170px] w-[150px]`}>
                <>
                  {row.status === "CAMPAIGN_STATUS_STOPPED" ? (
                    <div className="border w-[75%] p-1 rounded">
                      {" "}
                      {row?.end_date}
                    </div>
                  ) : (
                    <>
                      {extendDate.campaign_id !== row.campaign_id ? (
                        <div
                          className="cursor-pointer border w-[75%] p-1 rounded"
                          onDoubleClick={() => {
                            if (!hasPermission) {
                              return;
                            }
                            extendDateBlock(
                              row.campaign_id,
                              row.campaign_name,
                              row.campaign_type,
                              row.account,
                              row.account_id
                            );
                          }}
                        >
                          {" "}
                          {row?.end_date}
                        </div>
                      ) : (
                        <>
                          <div
                            className="flex gap-1"
                            onBlur={(e) => {
                              if (!e.currentTarget.contains(e.relatedTarget)) {
                                extendDateBlock({
                                  campaign_id: "",
                                  campaign_name: "",
                                  campaign_type: "",
                                });
                                setSelectedDate("");
                                setDateOption("selectDate");
                              }
                            }}
                          >
                            <div className="w-[75%]">
                              <DatePicker
                                autoFocus={true}
                                className="border border-slate-400 outline-pink-700  w-[100%] py-1"
                                selected={selectedDate}
                                minDate={new Date(row.end_date)}
                                placeholderText={`  ${row.end_date}`}
                                closeOnScroll={() => {
                                  return true;
                                }}
                                onChange={(date) => setSelectedDate(date)}
                              />
                            </div>
                            <div className="gap-1 flex">
                              <button onClick={() => handleExtendDate()}>
                                <img
                                  src="/assets/images/tickmark.svg"
                                  className="cursor-pointer mr-1"
                                />
                              </button>
                              <img
                                src="/assets/images/x.svg"
                                className="cursor-pointer w-[15px]"
                                onClick={() => {
                                  extendDateBlock({
                                    campaign_id: "",
                                    campaign_name: "",
                                    campaign_type: "",
                                  });
                                  setSelectedDate("");
                                  setDateOption("selectDate");
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              </td>
            );
          }
          if (item.value === "keyword") {
            init = (
              <td
                className=""
                // onMouseEnter={() => handlePin(true, row.campaign_id)}
                // onMouseLeave={() => handlePin(false, row.campaign_id)}
              >
                <div className="flex">
                  <div
                    className={
                      tabName === "keyword" &&
                      "text-[#851853] hover:cursor-pointer"
                    }
                  >
                    {row.keyword}
                  </div>

                  {/* Pin icon */}
                  {/* {tabName === "category" && (
                    <>
                      {row.pin !== undefined && row.pin !== null && (
                        <>
                          {" "}
                          <img
                            className="w-4 cursor-pointer "
                            src="/assets/images/pin.svg"
                            onClick={() => handlePinClick(false)}
                          />
                        </>
                      )}
                    </>
                  )} */}
                </div>
                {/* Hovering options */}
                {/* {tabName == "category" && (
                  <>
                    {" "}
                    <div className="flex">
                      {isHovered.pinStatus &&
                        isHovered.campaignId === row.campaign_id && (
                          <div
                            className="flex cursor-pointer"
                            style={{
                              opacity: isHovered ? 1 : 0,
                              pointerEvents: isHovered
                                ? "cursor-pointer"
                                : "none",
                            }}
                            onClick={() => handlePinClick(true)}
                          >
                            <img
                              className="w-4 mr-1"
                              src="/assets/images/duplicate1.svg"
                              // onClick={() => handlePinClick(false)}
                            />
                            <p className="text-xs mr-1">Duplicate</p>
                            {row.pin === null && (
                              <div
                                className="flex"
                                // onClick={() => handlePinClick(false)}
                              >
                                <img
                                  className="w-4"
                                  src="/assets/images/pin.svg"
                                />
                                <p className="text-xs mr-1">Pin</p>
                              </div>
                            )}

                            <img
                              className="w-4 mr-1 "
                              src="/assets/images/pie-chart.svg"
                            />
                            <p className="text-xs ">History</p>
                          </div>
                        )}
                    </div>
                  </>
                )} */}
              </td>
            );
          }
          if (item.value === "bid" && tabName === "keyword") {
            init = (
              <td className="min-w-[180px] w-[150px]">
                {editKeywordId.campaign_id !== row.campaign_id ||
                editKeywordId.keyword !== row.keyword ? (
                  <div
                    className="cursor-pointer border px-1 w-[70%] py-1 rounded"
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      keywordBidBlock(
                        row.campaign_id,
                        row.campaign_type,
                        row.keyword,
                        row.matchtype,
                        row.bid,
                        row.max_bid,
                        row.min_bid,
                        row.campaign_name,
                        row.account,
                        row.account_id
                      );
                    }}
                  >
                    {row?.bid ? row?.bid : "-"}
                  </div>
                ) : (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setEditKeywordId({
                            campaign_id: 0,
                            keyword: "",
                            matchtype: "",
                            campaign_type: "",
                            campaign_name: "",
                            current_bid: "",
                            max_bid: "",
                            min_bid: "",
                            account: "",
                            account_id: "",
                          });
                          setKeywordBid("");
                          setKeywordError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        type="number"
                        autoFocus="autoFocus"
                        className="border rounded w-[70%] h-8 mr-2 pl-2 outline-pink-700"
                        value={keywordBid}
                        placeholder={row?.bid}
                        onChange={(e) =>
                          handleNonNegativeInput(e, setKeywordBid)
                        }
                      />
                      <button onClick={() => handleKeywordBid()}>
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                        />
                      </button>
                      <img
                        src="/assets/images/x.svg"
                        className="cursor-pointer w-[7%]"
                        onClick={() => {
                          setEditKeywordId({
                            campaign_id: 0,
                            keyword: "",
                            matchtype: "",
                            campaign_type: "",
                            campaign_name: "",
                            current_bid: "",
                            max_bid: "",
                            min_bid: "",
                            account: "",
                            account_id: "",
                          });
                          setKeywordBid("");
                          setKeywordError(false);
                        }}
                      />
                    </div>
                    {keywordBidError !== false && (
                      <p className="text-red-500">{keywordBidError}</p>
                    )}
                  </>
                )}

                {row.suggested_min_bid && row.suggested_max_bid && (
                  <div className="flex text-xs">
                    <p className="mr-1">Suggested Bid: </p>
                    <p className="">
                      {currency}
                      {Math.abs(parseInt(row.suggested_min_bid)).toLocaleString(
                        currency_format
                      )}
                    </p>
                    <p className="mx-1">|</p>
                    <p>
                      {currency}
                      {Math.abs(parseInt(row.suggested_max_bid)).toLocaleString(
                        currency_format
                      )}
                    </p>
                  </div>
                )}
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
      "budget",
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
                <SummaryValueFormatter row={row} val={item.value} name={name} />
              </div>
              {row?.summaryCompData &&
                !row?.summaryCompData[0][item.value]?.includes("NaN") &&
                !row?.summaryCompData[0][item.value]?.includes("undefined") &&
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
          <table className="h-full" style={{ width: "100%" }}>
            <thead
              className={
                isCheckBoxRequired
                  ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35] bold"
                  : "campaignreport__tablehead table-fixed sticky top-0 left-0 z-[35]"
              }
            >
              <tr className="">
                {isCheckBoxRequired === true && (
                  <th className="pr-2">
                    <input
                      className="h-16  accent-pink-800"
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

                {headers.map((item, i) => {
                  //  console.log("headers ====>",headers,"keys",Object.keys(item))
                  if (item.showCol) {
                    return (
                      <>
                        {item.type === "single" ? (
                          <th style={thStyle(item.columnType, "instamart")}>
                            <div
                              className={
                                (i == 5 && tabName == "category") ||
                                (i == 4 && tabName == "keyword")
                                  ? "tableHead px-4  w-56 "
                                  : "tableHead px-4 "
                              }
                            >
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

            {/* <tbody>
              {bodyContent &&
                bodyContent.length > 0 &&
                bodyContent
                  .map((row, i) => (
                    <tr
                      className={
                        isCheckBoxRequired
                          ? "tableContentCheckBox "
                          : "tablecontent"
                      }
                      key={i} // Adding a key prop is recommended when using map
                    >
                      {isCheckBoxRequired && (
                        <td className="min-w-max ">
                          <input
                            className="h-16 accent-green-600/100"
                            type="checkbox"
                            checked={
                              tabName === "campaign"
                                ? selectedCheckBox
                                    .map((id) => id.campaign_id)
                                    .includes(row.campaign_id)
                                : selectedCheckBox
                                    .map((id) => id.id)
                                    .includes(row.id)
                            }
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
                  ))}
            </tbody> */}
            {/* {   console.log("bodycontent", bodyContent.length)} */}
            {/* {tabName ==="campaign" && ( */}
            <tbody>
              {bodyContent &&
                bodyContent.length > 0 &&
                bodyContent
                  .filter((row) => row.pin !== null)
                  .sort((a, b) => b.pin - a.pin)
                  .filter((row) => row["pin"] !== "-")
                  .sort((a, b) => b["pin"] - a["pin"])
                  .map((row, i) => (
                    <tr
                      className={
                        isCheckBoxRequired
                          ? "tableContentCheckBox"
                          : "tablecontent"
                      }
                      key={i} // Adding a key prop is recommended when using map
                    >
                      {isCheckBoxRequired && (
                        <td className="min-w-max">
                          <input
                            className="h-16 accent-pink-800"
                            type="checkbox"
                            checked={
                              tabName === "campaign"
                                ? selectedCheckBox
                                    .map((id) => id.campaign_id)
                                    .includes(row.campaign_id)
                                : selectedCheckBox
                                    .map((id) => id.id)
                                    .includes(row.id)
                            }
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
                  ))}

              {!loading && bodyContent && bodyContent?.length === 0 && (
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
            {/* )}  */}
            {/* {tabName === "campaign" && loading && download !== 1 && (
                <>
                  <td
                    className="p-2"
                    colSpan={16}
                    rowSpan={3}
                    style={{
                      alignItems: "center",
                      verticalAlign: "middle",
                    }}
                  >
                    <div className="loaderStyle p-2 row sticky ">
                      <LoaderSpinner />
                    </div>
                  </td>
                </>
              )} */}

            {/* {modifiedBodyContent && modifiedBodyContent.length > 0 ? (
                modifiedBodyContent?.map((row) => {
                  // console.log("headers ====> body", i);
                  return (
                    <>
                      <tr
                        className={
                          isCheckBoxRequired
                            ? "tableContentCheckBox "
                            : "tablecontent "
                        }
                      >
                        {isCheckBoxRequired === true && (
                          <td className="pl-2  min-w-max  ">
                            <input
                              className="h-16 accent-pink-800"
                              type="checkbox"
                              checked={
                                tabName === "campaign"
                                  ? selectedCheckBox
                                      .map((id) => id.id)
                                      .includes(row.id)
                                  : selectedCheckBox
                                      .map((id) => id.id)
                                      .includes(row.id)
                              }
                              onChange={(e) => handleCheckBox(e, row)}
                              // checked={selectedCheckBox
                              //   .map((id) => id._id)
                              //   .includes(row._id)}
                              // onChange={(e) => handleCheckBox(e, row)}
                            />
                          </td>
                        )}

                        <TableCol row={row} name={name} pid={row.id} />
                      </tr>
                    </>
                  );
                })
              ) : !loading ? (
                <tr>
                  <div className="p-2 row sticky "> No Data found</div>
                </tr>
              ) : null}
              {tabName !== "campaign" && loading && (
                <>
                  <td
                    className="p-2"
                    colSpan={16}
                    rowSpan={3}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle p-2 row sticky ">
                      <LoaderSpinner />
                    </div>
                  </td>
                </>
              )} */}
            {/* {loading && (
                <>
                  <td
                    className="p-2"
                    colSpan={16}
                    rowSpan={3}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >

                    
                    <div className="loaderStyle p-2 row sticky ">
                      <LoaderSpinner />
                    </div>
                  </td>
                </>
              )} */}

            {tabName === "campaign" && (
              <tbody>
                {/* Render remaining rows */}
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
                        key={i} // Adding a key prop is recommended when using map
                      >
                        {isCheckBoxRequired && (
                          <td className="min-w-max">
                            <input
                              className="h-16  accent-pink-600/100"
                              type="checkbox"
                              checked={
                                tabName === "campaign"
                                  ? selectedCheckBox
                                      .map((id) => id.campaign_id)
                                      .includes(row.campaign_id)
                                  : selectedCheckBox
                                      .map((id) => id.id)
                                      .includes(row.id)
                              }
                              onChange={(e) => handleCheckBox(e, row)}
                            />
                          </td>
                        )}

                        <TableCol row={row} name={name} />
                      </tr>
                    ))}

                {/* If no data found and not loading */}
                {/* {!loading && bodyContent && bodyContent.length === 0 && (
                  <tr>
                  <div className="p-2 !border-b-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {" "}
                    No Data Found
                  </div>
                </tr>
                )} */}

                {/* Render loader */}
                {/* {loading && (
                  <td
                    className="p-2"
                    colSpan={16}
                    rowSpan={3}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle p-2 row sticky">
                      <LoaderSpinner />
                    </div>
                  </td>
                )} */}
              </tbody>
            )}

            <tfoot
              className="sticky bottom-0 left-0 z-[35] flipkarttable__footer"
              style={{
                boxShadow: "rgb(206 200 200) 13px 5px 20px 1px",
                background: "white",
              }}
            >
              {summaryData && summaryData.length > 0
                ? summaryData.map((row, i) => {
                    return (
                      <>
                        <tr key={i} className="font-semibold">
                          <td
                            className="sticky flex flex-col left-0 min-w-max z-30 pt-2 !border-none"
                            style={{ border: "none !important" }}
                          >
                            <div className="!font-normal text-[13px]">
                              Total
                            </div>
                            <div className="font-semibold">{totalData}</div>
                            {row?.summaryCompData &&
                              row?.totalDelta &&
                              Object.keys(row?.totalDelta).length > 0 && (
                                <div className="w-[73px] h-[22px] justify-start items-center gap-0.5 inline-flex">
                                  <div className="text-black/opacity-40 text-[10px] font-normal font-['Inter'] leading-snug">
                                    {row?.summaryCompData[0]?.total_count}
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
      {confirmPopup.isOpen && (
        <ConfirmationPopup
          buttonCss="bg-[#851853] border-[#851853]"
          handleCancel={() => {
            setConfirmPopup({ isOpen: false, status: "", statusFlag: "" });
          }}
          handleSuccess={() => {
            if (tabName === "keyword") {
              handleVerifyBid(confirmPopup.status, confirmPopup.statusFlag);
            } else {
              handleStatusApi(confirmPopup.status, confirmPopup.statusFlag);
            }
          }}
          status={confirmPopup.status}
          entity={tabName}
        />
      )}
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
                  “Keyword” bid is below the minimum. Proceeding will update the
                  bid to the minimum bid.
                </div>
              </div>
            </div>
            <div className="font-inter justify-end items-start gap-4 inline-flex">
              <div
                onClick={() => {
                  setConfirmBid(false);
                  setConfirmPopup({
                    isOpen: false,
                    status: "",
                    statusFlag: "",
                  });
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
                  handleKeywordStatusApi(
                    confirmPopup.status,
                    confirmPopup.statusFlag
                  );
                  setConfirmBid(false);
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
      {showSelectedTagPopup && (
        <SelectedTagPopup
          open={showSelectedTagPopup}
          setOpen={setShowSelectedTagPopup}
          platform="instamart"
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
          platform="instamart"
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

export default InstamartSearchTerm;
