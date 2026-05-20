import React, { useState, useEffect } from "react";
import { _PATCH } from "../../../services/axios.method";
import _ from "lodash";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import {
  // BLINKIT_TAGS,
  BLINKIT_ATTACH_TAG,
  AMAZON_CAMAPIGN_PIN,
  AMAZON_PORTFOLIO_PIN,
  AMAZON_ADGROUP_BULK_TAG,
  AMAZON_ADGROUP_PIN,
  // AMAZON_FUNNEL_COUNT,
  AMAZON_KEYWORD_SUGGESTED_BIDS,
  AMAZON_TOP_OF_SEARCH,
  PERMISSIONS,
} from "../../../utils/constants";
import LoaderSpinner from "../loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import ActionType from "../../../redux/types";
import "./styles.css";
import { RPA_ACTION_EDIT } from "../../../utils/constants";
import { _POST } from "../../../services/axios.method";
import StatusSelectDropdown from "../dropdown/StatusSelectDropdown";
import PinMenu from "../PinMenu/PinMenu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import SelectedTagPopup from "../Popups/SelectedTagPopup";
import NewTagPopup from "../Popups/NewTagPopup";
import WhenPermitted from "../WhenPermitted";
import { thStyle } from "../../../utils/helpers";

const AmazonSearchTable = ({
  headers,
  bodyContent,
  footer,
  summaryData,
  loading,
  sortData,
  totalData,
  isCheckBoxRequired,
  name,
  tabName,
  setDataLIMIT,
  setBodyData,
  sort,
  initProcess,
  setBudgetBody,
  // startDate,
  // endDate,
  // platform_id,
  // funnelCount,
}) => {
  const [campaignId, setCampaignId] = useState("");
  const [adgroupId, setAdgroupId] = useState({
    adgroup_id: "",
    campaign_id: "",
  });
  const [loadingPortfolio, setLoadingPOrtfolio] = useState(false);
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
  // const [showPopupTwo, setShowPopupTwo] = useState(undefined);
  const [editPortfolioId, setEditPortfolioId] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [recallTags, setRecallTags] = useState({});
  const userPermissions = useSelector(
    (state) => state?.permissionsReducer || []
  );
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CAMPAIGN_ACTIONS,
    platform: "amazon",
  });
  // holds the campaign id for which budget is changed
  const [editBudgetId, setEditBudgetId] = useState({
    campaign_id: 0,
    campaign_name: "",
    campaign_type: "",
  });
  const [editAdgroupId, setEditAdroupId] = useState({
    campaign_id: 0,
    campaign_name: "",
    campaign_type: "",
    ad_group_id: "",
    ad_group_name: "",
  });

  const [extendDate, setExtendDate] = useState({
    campaign_id: 0,
    campaign_name: "",
    campaign_type: "",
  });
  // holds budget amount
  const [editBudget, setEditBudget] = useState();
  const [placementBidVal, setPlacementBidVal] = useState();
  const [placementError, setPlacementError] = useState(false);

  // holds default bid amount
  const [defaultBid, setDefaultBid] = useState();
  const [keywordBid, setKeywordBid] = useState();
  const [editExtendId, setEditExtendId] = useState();
  const [editNameId, setEditNameId] = useState();
  const [editName, setEditName] = useState("");
  const [portfolioNameError, setPortfolioNameError] = useState(false);
  const [portfolioBudgetError, setPortfolioBudgetError] = useState(false);
  const [portfolioNameErrorId, setPortfolioNameErrorId] = useState("");
  const [portfoliobudgetErrorId, setPortfolioBudgetErrorId] = useState("");
  const { expandTable } = useSelector((state) => state?.CommonReducer);
  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  let accountName = localStorage.getItem("savedAccounts");
  let val = JSON.parse(accountName);

  const [keywordBidId, setKeywordBidId] = useState({
    campaign_id: "",
    campaign_name: "",
    campaign_type: "",
    keyword_id: "",
    keyword_status: "",
    campaign_budget: "",
    ad_group_name: "",
    ad_group_id: "",
    keyword: "",
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

  let currency = localStorage.getItem("currency");
  const [selectedDate, setSelectedDate] = useState();
  const [keywordBidError, setKeywordBidError] = useState(false);

  const [campBudgetError, setCampBudgetError] = useState(false);
  const [adgroupBidError, setAdgroupBidError] = useState(false);
  const [minBid, setMinBid] = useState();
  const [currentBid, setCurrentBid] = useState();
  const [maxBid, setMaxBid] = useState();
  const [noBidError, setNoBidError] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [updateCampaignId, setUpdateCampaignId] = useState();

  const [placementId, setPlacementId] = useState({
    campaign_id: "",
    campaign_name: "",
    campaign_type: "",
    placement_type: "",
    bid: "",
  });
  let allTabSelectedCheckBox = selectedCheckBox;
  selectedCheckBox =
    selectedCheckBox &&
    Object.prototype.hasOwnProperty.call(selectedCheckBox, tabName)
      ? selectedCheckBox[tabName]
      : [];
  const dispatch = useDispatch();
  let bidAmount;
  const handleCheckBox = async (e, data) => {
    // checked state of the checkbox
    const isChecked = e.target.checked;
    let updatedIds = allTabSelectedCheckBox;
    // data["_id"]=
    // if the checkbox is selected, add the data to the previous selectedData array
    if (isChecked) {
      updatedIds[tabName] = [...selectedCheckBox, data];
      if (tabName === "portfolio") {
        updatedIds["campaign"] = [];
        updatedIds["adgroup"] = [];
        updatedIds["keyword"] = [];
        updatedIds["asin"] = [];
        updatedIds["placement"] = [];
      }
      if (tabName === "campaign") {
        updatedIds["adgroup"] = [];
        updatedIds["keyword"] = [];
        updatedIds["asin"] = [];
        updatedIds["placement"] = [];
      }
      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });
    } else {
      if (tabName === "portfolio") {
        updatedIds[tabName] = selectedCheckBox.filter(
          (item) => item.campaign_id !== data.campaign_id
        );
        updatedIds["campaign"] = [];
        updatedIds["adgroup"] = [];
        updatedIds["keyword"] = [];
        updatedIds["asin"] = [];
        updatedIds["placement"] = [];
      } else if (tabName === "campaign") {
        updatedIds[tabName] = selectedCheckBox.filter(
          (item) => item.campaign_id !== data.campaign_id
        );
        updatedIds["adgroup"] = [];
        updatedIds["keyword"] = [];
        updatedIds["asin"] = [];
        updatedIds["placement"] = [];
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

    //   if (updatedIds[tabName].length > 0) {
    //     let campPlacementIds = {
    //       campaign: [],
    //       portfolio: [],
    //     };
    //     updatedIds[tabName].map((item) => {
    //       if (tabName === "portfolio") {
    //         campPlacementIds[tabName].push(item.portfolio_id);
    //       } else {
    //         campPlacementIds[tabName].push(item.campaign_id);
    //       }
    //       // campPlacementIds.push(
    //       //   tabName === "portfolio" ? item.portfolio_id : item.campaign_id
    //       // );
    //     });

    //     // if (updatedIds[tabName].length > 0) {
    //     //   let setGroupByCampaign = false;
    //     //   let setGroupByAdgroup = false;
    //     //   headers?.map((item) => {
    //     //     if (item.value === "campaign_id" || item.value === "campaign_name") {
    //     //       // console.log("checkStatus", item.value, item.checked);
    //     //       setGroupByCampaign = item.checked;
    //     //     }
    //     //     if (item.value === "ad_group_name") {
    //     //       setGroupByAdgroup = item.checked;
    //     //     }
    //     //   });
    //     //   let payload = {
    //     //     data: updatedIds,
    //     //     tabName,
    //     //     startDate,
    //     //     endDate,
    //     //     account: platform_id,
    //     //     campaignGrouping: setGroupByCampaign,
    //     //     adgroupGrouping: setGroupByAdgroup,
    //     //   };

    //     //   let countData = await _POST(AMAZON_FUNNEL_COUNT, payload);
    //     //   dispatch({
    //     //     type: ActionType.AMAZON_CAMPAIGN_COUNT,
    //     //     payload: { ...countData.data.data },
    //     //   });
    //     // } else {
    //     //   dispatch({
    //     //     type: ActionType.AMAZON_CAMPAIGN_COUNT,
    //     //     payload: {},
    //     //   });
    //     // }
    //     // funnelCount(campPlacementIds);
    //   } else {
    //     // funnelCount([]);
    //   }
    // }
    // handleSelectedData(updatedIds);
  };

  useEffect(() => {
    if (!apiLoading) {
      setUpdateCampaignId();
    }
  }, [apiLoading]);

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
    } else {
      // if the checkbox is unselected, remove the data from the previous selectedData array
      updatedIds[tabName] = [];
      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });
      // dispatch({
      //   type: ActionType.AMAZON_CAMPAIGN_COUNT,
      //   payload: {},
      // });
    }

    // handleSelectedData(updatedIds);
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
      if (type === "newTag") {
        data = {
          tag_id: [...new Set(selectedTagIds)],
          platform: "amazon",
        };
      } else {
        data = {
          tag_id: [...new Set(addedTags)],
          platform: "amazon",
        };
      }
      setLoading(true);
      let result;
      if (tabName === "campaign") {
        result = await _PATCH(`${BLINKIT_ATTACH_TAG}/${campaignId}`, data);
      } else if (tabName === "adgroup") {
        const adgroupData = [
          {
            campaign_id: adgroupId.campaign_id,
            adgroup_id: adgroupId.adgroup_id,
            tag_id: data.tag_id,
          },
        ];
        result = await _POST(AMAZON_ADGROUP_BULK_TAG, adgroupData);
      }

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
        let foundIndex;
        if (tabName === "campaign") {
          foundIndex = tempData.findIndex((x) => x.campaign_id == campaignId);
        } else if (tabName === "adgroup") {
          foundIndex = tempData.findIndex(
            (x) =>
              x.campaign_id == adgroupId.campaign_id &&
              x.ad_group_id === adgroupId.adgroup_id
          );
        }
        tempData[foundIndex].tag_id = result?.data?.data?.result.tag_id;
        if (result?.data?.data?.result.tag_id.length < 1) {
          delete tempData[foundIndex].tag_id;
        }
        setBodyData([...tempData]);
      }

      setLoading(false);

      setSelectedTagIds([]);
    } catch (error) {
      console.error(error, "<<<<ERROR");
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };
  // useEffect(() => {
  //   // console.log(recallTags, "recall Camapign");
  // }, [recallTags]);

  React.useEffect(() => {
    if (recallCampaign === true) {
      setBodyData([]);
      setBudgetBody([]);
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
    if (bottom) {
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
  let textArr = ["cost_type", "end_date"];
  function ValueFormatter({ row, val, name }) {
    let value = row[val];
    if (floatArr?.indexOf(val) > -1) {
      value = row[val] || 0;
    } else if (textArr?.indexOf(val) > -1) {
      value = row[val] || "-";
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
    let value = row[val];
    return value != null ? value : null;
  }
  function EditCampaign({ row }) {
    return <>{row.campaign_name}</>;
  }

  const handleEditBudget = (e) => {
    setEditBudget(e.target.value);
    setPortfolioBudgetError(false);
  };
  // const handlePortfolioPin = (pinStatus, portfolio_id) => {
  //   setIsPortfolioHovered({ pinStatus, portfolio_id });
  // };
  const budgetBlock = (campaign_id, campaign_name, campaign_type) => {
    setEditBudgetId({ campaign_id, campaign_name, campaign_type });
    setUpdateCampaignId(campaign_id);
  };
  const suggestedBids = async (
    keyword_text,
    match_type,
    campaign_id,
    adgroup_id
  ) => {
    try {
      const data = {
        campaign_id: campaign_id,
        adgroup_id: adgroup_id,

        keyword_text: keyword_text,
        account_id: amazonProfile,
        account: val[0],
      };
      let keyword_type;
      if (match_type === "BROAD") {
        keyword_type = "KEYWORD_BROAD_MATCH";
      } else if (match_type === "PHRASE") {
        keyword_type = "KEYWORD_PHRASE_MATCH";
      } else if (match_type === "EXACT") {
        keyword_type = "KEYWORD_EXACT_MATCH";
      }

      data.keyword_type = keyword_type;

      const result = await _POST(AMAZON_KEYWORD_SUGGESTED_BIDS, data);
      if (result.status === 200) {
        if (result?.data?.status?.message === "No recommendation is provided") {
          setNoBidError(result?.data?.status?.message);
        } else {
          setMinBid(result.data.data.bids.min_bid);
          setCurrentBid(result.data.data.bids.bid);
          setMaxBid(result.data.data.bids.max_bid);
          setNoBidError(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const keywordBidBlock = (
    campaign_id,
    campaign_name,
    campaign_type,
    keyword_id,
    keyword_status,
    adgroup_id,
    match_type,
    keyword_text,
    campaign_budget,
    ad_group_name
  ) => {
    setUpdateCampaignId({ campaign_id: campaign_id, keyword_id: keyword_id });
    setKeywordBidId({
      campaign_id,
      campaign_name,
      campaign_type,
      keyword_id,
      keyword_status,
      campaign_budget,
      ad_group_name,
      adgroup_id,
      keyword_text,
      match_type,
    });
    suggestedBids(keyword_text, match_type, campaign_id, adgroup_id);
  };
  const defaultBidBlock = (
    campaign_id,
    campaign_name,
    campaign_type,
    ad_group_id,
    ad_group_name
  ) => {
    setUpdateCampaignId({
      campaign_id: campaign_id,
      ad_group_id: ad_group_id,
    });
    setEditAdroupId({
      campaign_id,
      campaign_name,
      campaign_type,
      ad_group_id,
      ad_group_name,
    });
  };
  const extendDateBlock = (campaign_id, campaign_name, campaign_type) => {
    setExtendDate({ campaign_id, campaign_name, campaign_type });
    setUpdateCampaignId(campaign_id);
  };

  const handleKeywordBid = () => {
    let data;
    let camp_budget = keywordBidId.campaign_budget
      .split(currency)[1]
      .replace(/,/g, "");
    if (keywordBid === undefined) {
      setKeywordBidError("Enter bid value");
    } else if (
      keywordBid < 1 ||
      parseFloat(keywordBid) > parseFloat(camp_budget)
    ) {
      setKeywordBidError(
        `Bid must be less than your daily budget of ${currency}${camp_budget}`
      );
    } else {
      data = [
        {
          campaign_id: [keywordBidId.campaign_id],
          campaign_name: [keywordBidId.campaign_name],
          keyword_id: keywordBidId.keyword_id,
          state: keywordBidId.keyword_status,
          action_type: "keyword",
          action: "bid",
          action_message: `Set bid to ${currency}${keywordBid}`,
          media_type: "Amazon",
          action_status: 10,
          segment: keywordBidId.campaign_type,
          ad_group_name: keywordBidId.ad_group_name,
          ad_group_id: keywordBidId.adgroup_id,
          account_id: amazonProfile,
          account: val[0],
          min_bid: parseFloat(keywordBid),
          keywords: keywordBidId.keyword_text,
          match_type: keywordBidId.match_type,
        },
      ];
      setKeywordBidError(false);
      handleKeywordAction({ data });
      setKeywordBidId({
        campaign_id: "",
        campaign_name: "",
        campaign_type: "",
        keyword_id: "",
        keyword_status: "",
        campaign_budget: "",
        ad_group_name: "",
        adgroup_id: "",
      });
    }
  };

  const handleBudget = () => {
    let data;
    if (tabName === "campaign") {
      if (editBudget === undefined || !editBudget) {
        setCampBudgetError("Enter budget value");
      } else if (editBudget < 50) {
        setCampBudgetError("Budget must be greater than ₹50");
      } else {
        const itemData = {
          campaign_id: [editBudgetId.campaign_id],
          campaign_name: [editBudgetId.campaign_name],
          action_type: "campaign",
          action: "set_budget",
          action_message: `Set budget to ${currency}${editBudget}`,
          media_type: "Amazon",
          action_status: 10,
          segment: editBudgetId.campaign_type,

          account_id: amazonProfile,
          account: val[0],
          set_value: parseFloat(editBudget),
        };

        data = [itemData];
        handleAction({ data });
        setCampBudgetError(false);
        setEditBudgetId({
          campaign_id: "",
          campaign_name: "",
          campaign_type: "",
        });
        setEditBudget("");
      }
    }

    if (tabName === "adgroup") {
      if (defaultBid === undefined || !defaultBid) {
        setAdgroupBidError("Enter bid value");
      } else {
        const itemData = {
          campaign_id: [editAdgroupId.campaign_id],
          campaign_name: [editAdgroupId.campaign_name],
          action_type: "adgroup",
          action: "default_bid",
          action_message: `Set default bid to ${currency}${defaultBid}`,
          media_type: "Amazon",
          action_status: 10,
          segment: editAdgroupId.campaign_type,

          account_id: amazonProfile,
          account: val[0],
          set_value: parseFloat(defaultBid),
          ad_group_id: editAdgroupId.ad_group_id,
          ad_group_name: editAdgroupId.ad_group_name,
        };

        const data = [itemData];
        setAdgroupBidError(false);
        handleAdgroupAction({ data });
        setEditAdroupId({
          campaign_id: "",
          campaign_name: "",
          campaign_type: "",
          ad_group_id: "",
          ad_group_name: "",
        });
        setDefaultBid();
      }
    }
  };

  const handlePortfolioExtendDate = () => {
    const formattedDate = moment(selectedDate).format("YYYYMMDD");
    let data;
    data = [
      {
        account_id: amazonProfile,
        account: val[0],
        portfolioId: editExtendId.portfolio_id,
        name: editExtendId.name,
        budget: {
          amount: editExtendId.budget_amount,
          currencyCode: editExtendId.budget_currency_code,
          policy: editExtendId.budget_policy,
          startDate: editExtendId.budget_start_date,
          endDate: formattedDate,
        },
        action_type: "portfolio",
        action: "extend_date",
        action_message: `Portfolio end date extended to ${formattedDate}`,
        media_type: "Amazon",
        action_status: 10,
        inBudget: true,
        state: editExtendId.state,
      },
    ];
    setEditPortfolioId(editExtendId.portfolio_id);
    handlePortfolioAction(data);
    setEditExtendId({});
    setEditBudget("");
  };

  const handlePortfolioBudget = () => {
    let data;
    if (editBudget < 1000) {
      setPortfolioBudgetError(true);
      setPortfolioBudgetErrorId(editBudgetId.portfolio_id);
      return;
    }
    data = [
      {
        profile_id: amazonProfile,
        account_id: amazonProfile,
        account: val[0],
        portfolioId: editBudgetId.portfolio_id,
        name: editBudgetId.name,
        budget: {
          amount: parseFloat(editBudget),
          currencyCode: editBudgetId.budget_currency_code,
          policy: editBudgetId.budget_policy,
          startDate: editBudgetId.budget_start_date,
          endDate:
            editBudgetId.budget_end_date == "-"
              ? null
              : editBudgetId.budget_end_date,
        },
        action_type: "portfolio",
        action: "set_budget",
        action_message: `Set budget to ${currency}${editBudget}`,
        media_type: "Amazon",
        action_status: 10,
        inBudget: true,
        state: editBudgetId.state,
      },
    ];
    setEditPortfolioId(editBudgetId.portfolio_id);
    handlePortfolioAction(data);
    setEditBudgetId({});
    setEditBudget("");
  };

  const handlePortfolioName = () => {
    let data;
    if (editName == "") {
      setPortfolioNameError(true);
      setPortfolioNameErrorId(editNameId.portfolio_id);
      return;
    }
    let findName = bodyContent.findIndex((item) => item.name == editName);
    if (findName > -1) {
      setPortfolioNameError(true);
      setPortfolioNameErrorId(editNameId.portfolio_id);
      return;
    }
    if (editName == "") {
      setPortfolioNameError(true);
      setPortfolioNameErrorId(editNameId.portfolio_id);
      return;
    }
    data = [
      {
        account_id: amazonProfile,
        account: val[0],
        portfolioId: editNameId.portfolio_id,
        name: editName,
        budget: {
          amount: editNameId.budget_amount,
          currencyCode: editNameId.budget_currency_code,
          policy: editNameId.budget_policy,
          startDate: editNameId.budget_start_date,
          endDate:
            editNameId.budget_end_date == "-"
              ? null
              : editNameId.budget_end_date,
        },
        action_type: "portfolio",
        action: "set_name",
        action_message: `Set name to ${editName}`,
        media_type: "Amazon",
        action_status: 10,
        inBudget: true,
        state: editNameId.state,
      },
    ];
    setEditPortfolioId(editNameId.portfolio_id);
    handlePortfolioAction(data);
    setEditNameId({});
    setEditName("");
  };

  const handleExtendDate = () => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    let data;
    data = [
      {
        campaign_id: [extendDate.campaign_id],
        campaign_name: [extendDate.campaign_name],
        action_type: "campaign",
        action: "extend_date",
        action_message: `Campaign end date updated to ${formattedDate}`,
        media_type: "Amazon",
        action_status: 10,
        segment: extendDate.campaign_type,
        end_date: formattedDate,

        account_id: amazonProfile,
        account: val[0],
      },
    ];

    handleAction({ data });
    setExtendDate({
      campaign_id: "",
      campaign_name: "",
      campaign_type: "",
    });
    setEditBudget("");
  };

  const handleStatus = ({ status, statusFlag }) => {
    let data = [];
    let message;

    if (
      tabName === "campaign" ||
      tabName === "adgroup" ||
      tabName === "keyword" ||
      tabName === "asin"
    ) {
      // let itemStatusFlag;
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
        case "keyword":
          // itemStatusFlag = keywordStatusFlag;
          itemType = "keyword";
          break;
        case "asin":
          // itemStatusFlag = asinStatusFlag;
          itemType = "asin";
          break;
        // default:
        //   itemStatusFlag = statusFlag;
        //   break;
      }

      message = `${status} ${itemType}`;

      data = [
        {
          campaign_id: [statusFlag?.campaign_id],
          campaign_name: [statusFlag.campaign_name],
          action_type: itemType,
          action: status,
          action_message: message,
          media_type: "Amazon",
          action_status: 10,
          segment: statusFlag?.campaign_type,

          account_id: amazonProfile,
          account: val[0],
          ad_group_id: ["adgroup", "asin", "keyword"].includes(tabName)
            ? statusFlag.ad_group_id
            : null,

          ad_group_name: ["adgroup", "asin", "keyword"].includes(tabName)
            ? statusFlag.ad_group_name
            : null,

          keyword_id: tabName === "keyword" ? statusFlag.keyword_id : null,
          keywords: tabName === "keyword" ? statusFlag.keywords : null,
          match_type: tabName === "keyword" ? statusFlag.match_type : null,
          fsn_id: tabName === "asin" ? statusFlag.ad_id || "123" : null,
          state: tabName === "keyword" ? statusFlag.state : null,
        },
      ];

      if (tabName === "campaign") {
        setUpdateCampaignId(statusFlag.campaign_id);
        handleAction({ data, statusFlag });
      } else if (tabName === "adgroup") {
        setUpdateCampaignId({
          campaign_id: statusFlag.campaign_id,
          ad_group_id: statusFlag.ad_group_id,
        });
        handleAdgroupAction({ data, adgroupStatusFlag: statusFlag });
      } else if (tabName === "keyword") {
        setUpdateCampaignId({
          campaign_id: statusFlag.campaign_id,
          keyword_id: statusFlag.keyword_id,
          // match_type: statusFlag.match_type,
        });

        handleKeywordAction({ data, keywordStatusFlag: statusFlag });
      } else if (tabName === "asin") {
        setUpdateCampaignId({
          campaign_id: statusFlag.campaign_id,
          ad_id: statusFlag.ad_id,
          asin: statusFlag.asin,
        });
        handleAsinAction({ data, asinStatusFlag: statusFlag });
      }
    }
  };

  const handleAsinAction = async ({ data, asinStatusFlag }) => {
    try {
      setApiLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setApiLoading(false);
      if (res.status === 200) {
        let tempBudget = bodyContent;
        dispatch(setToastMessageHandler(res?.data?.status?.message, true));
        if (res?.data?.status?.message === "Status updated successfully") {
          const index = tempBudget.findIndex(
            (x) => x.ad_id == asinStatusFlag.ad_id
          );
          tempBudget[index].state =
            res?.data?.data?.result[0]?.action === "enable"
              ? "ENABLED"
              : "PAUSED";
          tempBudget[index].updated_at = res?.data?.data?.result[0]?.updatedat;
          setBudgetBody([...tempBudget]);
        }
      } else {
        let errorMsg = res?.data?.status?.message?.error;
        dispatch(setToastMessageHandler(errorMsg, false));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleKeywordAction = async ({ data, keywordStatusFlag = null }) => {
    try {
      setApiLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setApiLoading(false);
      if (res?.status === 200) {
        let tempBudget = bodyContent;
        dispatch(setToastMessageHandler(res?.data?.status?.message, true));
        if (res?.data?.status?.message === "Status updated successfully") {
          const index = tempBudget.findIndex(
            (x) => x.keyword_id == keywordStatusFlag.keyword_id
          );
          tempBudget[index].status =
            res?.data?.data?.result[0]?.action === "enable"
              ? "ENABLED"
              : "PAUSED";
          tempBudget[index].updated_at = res?.data?.data?.result[0]?.updatedat;
          setBudgetBody([...tempBudget]);
        } else if (res?.data?.status?.message === "Bid updated successfully") {
          const index = tempBudget.findIndex(
            (x) => x.keyword_id == keywordBidId.keyword_id
          );
          tempBudget[index].bid = `₹${res?.data?.data?.result[0]?.min_bid}.00`;
          setBodyData([...tempBudget]);
        }
      } else {
        setToastMessageHandler(res?.data?.status?.message?.error, false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdgroupAction = async ({ data, adgroupStatusFlag = null }) => {
    try {
      setApiLoading(true);

      const res = await _POST(RPA_ACTION_EDIT, data);
      setApiLoading(false);
      if (res?.status === 200) {
        dispatch(setToastMessageHandler(res?.data?.status?.message, true));
        let tempBudget = bodyContent;
        if (res?.data?.status?.message === "Status updated successfully") {
          const index = tempBudget.findIndex(
            (x) =>
              x.campaign_id == adgroupStatusFlag.campaign_id &&
              x.ad_group_id === adgroupStatusFlag.ad_group_id
          );
          tempBudget[index].state =
            res?.data?.data?.result[0]?.action === "enable"
              ? "ENABLED"
              : "PAUSED";
          tempBudget[index].updated_at = res?.data?.data?.result[0]?.updatedat;

          setBudgetBody([...tempBudget]);
        } else if (
          res?.data?.status?.message === "Default bid updated sucessfully"
        ) {
          const index = tempBudget.findIndex(
            (x) =>
              x.campaign_id == editAdgroupId.campaign_id &&
              x.ad_group_id == editAdgroupId.ad_group_id
          );
          tempBudget[
            index
          ].default_bid = `₹${res?.data?.data?.result[0]?.set_value}`;
          tempBudget[index].updated_at = res?.data?.data?.result[0]?.updatedat;

          setBudgetBody([...tempBudget]);
        }
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAction = async ({ data, statusFlag = null }) => {
    try {
      setApiLoading(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setApiLoading(false);
      if (res?.status === 200) {
        let tempBudget = bodyContent;
        if (res?.data?.status?.message === "Status updated successfully") {
          const index = tempBudget.findIndex(
            (x) => x.campaign_id == statusFlag.campaign_id
          );
          tempBudget[index].state =
            res?.data?.data?.result[0]?.action === "enable"
              ? "ENABLED"
              : "PAUSED";

          // tempBudget[index]["amazon_campaign.updated_at"] =
          //   date.toLocaleDateString();
          tempBudget[index]["amazon_campaign.updated_at"] =
            res?.data?.data?.result[0]?.updatedat;

          setBudgetBody([...tempBudget]);
        } else if (
          res?.data?.status?.message === "Budget updated Successfully"
        ) {
          const index = tempBudget.findIndex(
            (x) => x.campaign_id == editBudgetId.campaign_id
          );

          tempBudget[
            index
          ].budget = `₹${res?.data?.data?.result[0]?.set_value}`;
          tempBudget[index]["amazon_campaign.updated_at"] =
            res?.data?.data?.result[0]?.updatedat;

          setBudgetBody([...tempBudget]);
        } else if (
          res?.data?.status?.message === "End date updated successfully"
        ) {
          const index = tempBudget.findIndex(
            (x) => x.campaign_id == extendDate.campaign_id
          );
          tempBudget[index].end_date = res?.data?.data?.result[0]?.end_date;

          tempBudget[index]["amazon_campaign.updated_at"] =
            res?.data?.data?.result[0]?.updatedat;

          setBudgetBody([...tempBudget]);
        } else if (
          res?.data?.status?.message === "Top of search updated successfully"
        ) {
          if (tabName === "campaign") {
            const index = tempBudget.findIndex(
              (x) => x.campaign_id == placementId.campaign_id
            );
            tempBudget[index].placement_top =
              res?.data?.data?.result[0]?.placement_bid;

            tempBudget[index]["amazon_campaign.updated_at"] =
              res?.data?.data?.result[0]?.updatedat;
          } else {
            const index = tempBudget.findIndex(
              (x) =>
                x.campaign_id == placementId.campaign_id &&
                x.placement == placementId.placement_type
            );

            tempBudget[index]["amazon_campaign.placement_top"] =
              res?.data?.data?.result[0]?.placement_bid;
          }
          setBudgetBody([...tempBudget]);
        } else if (
          res?.data?.status?.message === "Rest of search updated successfully"
        ) {
          const index = tempBudget.findIndex(
            (x) =>
              x.campaign_id == placementId.campaign_id &&
              x.placement == placementId.placement_type
          );

          tempBudget[index]["amazon_campaign.placement_rest_of_search"] =
            res?.data?.data?.result[0]?.placement_bid;

          setBudgetBody([...tempBudget]);
        } else if (
          res?.data?.status?.message ===
          "Placement product page updated successfully"
        ) {
          const index = tempBudget.findIndex(
            (x) =>
              x.campaign_id == placementId.campaign_id &&
              x.placement == placementId.placement_type
          );

          tempBudget[index]["amazon_campaign.placement_product_page"] =
            res?.data?.data?.result[0]?.placement_bid;

          setBudgetBody([...tempBudget]);
        }
        dispatch(setToastMessageHandler(res?.data?.status?.message, true));
      } else {
        dispatch(
          setToastMessageHandler(res?.data?.status?.message?.error, false)
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handlePortfolioAction = async (data) => {
    try {
      setLoading(true);
      setLoadingPOrtfolio(true);
      const res = await _POST(RPA_ACTION_EDIT, data);
      setLoading(false);
      if (res?.status === 200) {
        dispatch(setToastMessageHandler("Action performed successfully", true));
        // dispatch({
        //   type: ActionType.RECALLCAMPAIGNPAPI,
        //   payload: true,

        // });
        let tempData = bodyContent;
        if (data[0].action == "set_budget") {
          const foundIndex = tempData.findIndex(
            (x) => x.portfolio_id == editBudgetId.portfolio_id
          );

          tempData[foundIndex].budget_amount = editBudget;
        }
        if (data[0].action == "set_name") {
          const foundIndex = tempData.findIndex(
            (x) => x.portfolio_id == editNameId.portfolio_id
          );

          tempData[foundIndex].name = editName;
        }
        if (data[0].action == "extend_date") {
          const foundIndex = tempData.findIndex(
            (x) => x.portfolio_id == editExtendId.portfolio_id
          );

          tempData[foundIndex].budget_end_date =
            moment(selectedDate).format("YYYYMMDD");
        }
        setBodyData([...tempData]);
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
      setLoadingPOrtfolio(false);
    } catch (error) {
      console.error(error);
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleCampaignPin = async ({ pinStatus, campaignId }) => {
    const data = {
      campaign_id: [campaignId],
      pin_status: pinStatus,
    };

    const result = await _POST(AMAZON_CAMAPIGN_PIN, data);
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

  const handleAdgroupPinClick = async ({
    pinStatus,
    campaignId,
    adgroupId,
  }) => {
    const data = [
      {
        campaign_id: campaignId,
        pin_status: pinStatus,
        adgroup_id: adgroupId,
      },
    ];

    const result = await _POST(AMAZON_ADGROUP_PIN, data);
    if (result.status === 200) {
      let tempData = bodyContent;
      const foundIndex = tempData.findIndex((x) => x.campaign_id == campaignId);

      if (pinStatus) {
        tempData[foundIndex].pin = new Date();
      } else {
        tempData[foundIndex].pin = null;
      }
      setBodyData([...tempData]);
    }
  };
  const handlePortfolioPinClick = async ({ pinStatus, portfolioId }) => {
    const data = {
      portfolio_id: [portfolioId],
      pin_status: pinStatus,
    };

    const result = await _POST(AMAZON_PORTFOLIO_PIN, data);

    if (result.status == "200") {
      let tempData = bodyContent;
      const foundIndex = tempData.findIndex(
        (x) => x.portfolio_id == data.portfolio_id[0]
      );

      if (pinStatus) {
        tempData[foundIndex].pin = new Date();
      } else {
        tempData[foundIndex].pin = "-";
      }
      setBodyData([...tempData]);
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
  const handleEditName = (e) => {
    setEditName(e.target.value);
    setPortfolioNameError(false);
  };

  const latestPlacement = async (
    campaign_id,
    campaign_name,
    campaign_type,
    placement_type,
    bid
  ) => {
    setUpdateCampaignId(campaign_id);
    setPlacementId({
      campaign_id,
      campaign_name,
      campaign_type,
      placement_type,
      bid,
    });

    handleLatestPlacement(campaign_id, placement_type);
  };

  const handleLatestPlacement = async (campaign_id, placement_type) => {
    try {
      const data = {
        campaign_id: campaign_id,
      };

      const result = await _POST(AMAZON_TOP_OF_SEARCH, data);
      if (result?.status === 200) {
        let placementType;
        switch (placement_type) {
          case "PLACEMENT_TOP":
          case "Top of Search on-Amazon":
            placementType = "PLACEMENT_TOP";
            break;
          case "Detail Page on-Amazon":
            placementType = "PLACEMENT_PRODUCT_PAGE";
            break;
          case "Other on-Amazon":
            placementType = "PLACEMENT_REST_OF_SEARCH";
            break;
        }
        let placementTop = result?.data?.data?.details?.placementBidding.find(
          (x) => x.placement === placementType
        );

        setPlacementBidVal(placementTop?.percentage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(placementId, "<< placement id")
  const handleTopOfSearch = async () => {
    try {
      if (parseFloat(placementBidVal) > 900) {
        setPlacementError("Choose a percentage between 0 and 900");
      } else {
        let placementName;
        let actionName;
        switch (placementId.placement_type) {
          case "PLACEMENT_TOP":
          case "Top of Search on-Amazon":
            placementName = "PLACEMENT_TOP";
            actionName = "top_of_search";
            break;
          case "Detail Page on-Amazon":
            placementName = "PLACEMENT_PRODUCT_PAGE";
            actionName = "placement_product_page";
            break;
          case "Other on-Amazon":
            placementName = "PLACEMENT_REST_OF_SEARCH";
            actionName = "placement_rest_of_search";
            break;
        }

        let data = [
          {
            campaign_id: [placementId.campaign_id],
            campaign_name: [placementId.campaign_name],
            action_type: tabName,
            placement_bid: parseFloat(placementBidVal),
            action_message: `Update top of search for campaign ${placementId.campaign_name} from ${placementId.bid}% to ${placementBidVal}% `,
            media_type: "Amazon",
            action_status: 10,
            segment: placementId.campaign_type,

            account_id: amazonProfile,
            account: val[0],
            action: actionName,
            placement_name: [placementName],
          },
        ];
        handleAction({ data });
        setPlacementError(false);
        setPlacementId({
          campaign_id: "",
          campaign_name: "",
          campaign_type: "",
          placement_bid: "",
          bid: "",
        });
        setPlacementBidVal();
        // console.log(data, "<<< data");
      }
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  function TableCol({ row, name }) {
    let rows = [];
    let perArray = [
      "ctr",
      "acos",
      "total_ntb_orders_perc",
      "total_ntb_sales_perc",
    ];
    let rupeeArray = [
      "budget_amount",
      "total_spend",
      "cpc",
      "total_sales",
      "total_ntb_sales",
      "vcpm",
    ];
    headers.map((item, index) => {
      // eslint-disable-next-line no-console
      // console.warn(item)
      if (item.showCol) {
        if (
          Object.prototype.hasOwnProperty.call(row, item.value) &&
          ![
            "budget_amount",
            "state",
            "budget",
            "campaign_name",
            "ad_group_name",
            "budget_start_date",
            "budget_end_date",
            "end_date",
            "default_bid",
            "keyword_text",
            "status",
            "bid",
            "product_id",
            "placement_top",
            "placement",
            "availability",
          ].includes(item.value) &&
          !(item.value === "tag_id" && row[item.value]?.length === 0)
        ) {
          let init = (
            <td key={index} className="p-2 min-w-[150px] w-[150px]">
              <div>
                {" "}
                <div>
                  {" "}
                  <ValueFormatter row={row} val={item.value} name={name} />
                </div>
                {row?.compData &&
                  row?.compData != "-" &&
                  row?.compData[item?.value] != "-" &&
                  row?.compData[item?.value] !== "0.00%" &&
                  row?.compData[item?.value] !== "₹0" &&
                  row?.compData[item?.value] !== "0" &&
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
          //   if(!item.value) {let init = (
          //   <td className="p-2">
          //     <div> - </div>
          //   </td>
          // );}
          if (item.value === "name") {
            init = (
              <td className="p-2">
                <div className="text-[#EF880F]">
                  {" "}
                  <ValueFormatter row={row} val={item.value} name={name} />
                </div>
              </td>
            );
          }
          if (item.value === "name") {
            init = (
              <td
                className="min-w-[350px] w-[350px] cursor-pointer group"
                style={{ minWidth: "350px" }}
              >
                <div className="flex items-center gap-1">
                  <div
                    className={
                      tabName === "portfolio" &&
                      "text-[#EF880F] w-auto whitespace-nowrap"
                    }
                  >
                    {editNameId?.portfolio_id == row.portfolio_id ? (
                      <>
                        <div
                          className="flex"
                          onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget)) {
                              setPortfolioNameError(false);
                              setEditNameId({});
                              setEditName("");
                            }
                          }}
                        >
                          {" "}
                          <input
                            autoFocus="autoFocus"
                            type="text"
                            className="border rounded w-[70%] h-8 mr-2 pl-2  outline-orange-300"
                            defaultValue={row.name}
                            value={editName}
                            onChange={(e) => handleEditName(e)}
                          />
                          <button onClick={() => handlePortfolioName()}>
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
                              setPortfolioNameError(false);
                              setEditNameId({});
                              setEditName("");
                            }}
                          />
                        </div>
                        {portfolioNameError == true &&
                          portfolioNameErrorId == row.portfolio_id && (
                            <p className="text-red-500 text-[11px]">
                              Portfolio name cannot be empty and should be
                              unique.
                            </p>
                          )}
                      </>
                    ) : (
                      <div
                        className="select-none row  "
                        style={{
                          border:
                            row.budget_policy != "dateRange" ? "none" : "",
                        }}
                        onDoubleClick={() => {
                          if (!hasPermission) {
                            return;
                          }
                          if (row.budget_policy == "dateRange") {
                            setEditNameId(row);
                            setEditName(row.name);
                          }
                        }}
                      >
                        <div className="col_8">{row.name ? row.name : "-"}</div>
                      </div>
                    )}
                  </div>
                  {row.pin !== "-" && tabName === "portfolio" && (
                    <img
                      className="w-4"
                      src="/assets/images/pin.svg"
                      onClick={() => {
                        if (!hasPermission) {
                          return;
                        }
                        handlePortfolioPinClick({
                          pinStatus: false,
                          portfolioId: row.portfolio_id,
                        });
                      }}
                    />
                  )}
                </div>

                {tabName === "portfolio" && (
                  <WhenPermitted
                    platform="amazon"
                    permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                  >
                    <div className="flex group-hover:visible invisible ">
                      <PinMenu
                        handleDuplicate={false}
                        handlePin={() =>
                          handlePortfolioPinClick({
                            pinStatus: true,
                            portfolioId: row.portfolio_id,
                          })
                        }
                        handleHistory={false}
                        hidePin={row.pin !== "-"}
                      />
                    </div>
                  </WhenPermitted>
                )}
              </td>
            );
          }
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
                  <div className="flex items-center border rounded-e-3xl rounded-s-3xl w-fit px-2 py-1 border-[#D9D9D9] bg-[#FAFAFA]">
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
                        // setShowPopupTwo(row.id);
                        setAddedTags(row.tag_id);
                        // setShowPopupOne(undefined);
                        setShowNewTagPopup(false);
                        setSelectedTagIds([]);
                        tagPosition(e);
                        setShowSelectedTagPopup(true);
                        // Conditionally set the state based on tabName
                        if (tabName === "campaign") {
                          setCampaignId(row.campaign_id);
                        } else if (tabName === "adgroup") {
                          setAdgroupId({
                            adgroup_id: row.ad_group_id,
                            campaign_id: row.campaign_id,
                          });
                        }
                      }}
                    >
                      {tagNames[0]?.tag_name
                        ? tagNames[0]?.tag_name
                        : tagNames[1]?.tag_name}
                      <img
                        className="px-1"
                        src="/assets/images/chevron-down.svg"
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="relative">
                  {showPopupTwo === row?.id ? (
                    <div
                      className={`drop-shadow-md  p-4 rounded absolute ${
                        rowIndex < totalLength - 10 ? "top-0" : "bottom-0"
                      } bg-white w-max right-0 z-[10] border-gray-300`}
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
                                  className="mr-1 accent-orange-600/100"
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
                                  className="mr-1 accent-orange-600/100"
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
                            className="cancel_btn_ams"
                            onClick={() => {
                              setShowPopupTwo(undefined);
                              setSelectedTagIds([]);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="apply_btn_ams"
                            // disabled={
                            //   addedTags.length + selectedTagIds.length <= 0
                            // }
                            onClick={(e) => {
                              setShowPopupTwo(undefined);
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
                            className="cancel_btn_ams"
                            onClick={() => {
                              setShowPopupTwo(undefined);
                              setSelectedTagIds([]);
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  ) : null}
                </div> */}
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
          if (item.value === "availability") {
            init = (
              <td>
                <div className="cursor-pointer capitalize ">
                  {row.availability
                    ? row.availability.split("_").join(" ").toLowerCase()
                    : "NA"}
                </div>
              </td>
            );
          }
          if (
            (item.value == "budget_start_date" && tabName === "portfolio") ||
            (item.value == "budget_end_date" && tabName === "portfolio")
          ) {
            let date = "-";

            if (row[item.value] != "-") {
              let a = row[item?.value];

              const day = a?.slice(-2);
              var year = a?.slice(0, 4);
              var month = a?.slice(4, 6);
              if (day && year && month) {
                date = day + "/" + month + "/" + year;
              } else {
                date = "-";
              }
            }
            init = <td>{date}</td>;
          }
          if (item.value === "budget_amount") {
            init = (
              <td className="min-w-[150px] w-[200px]">
                {editBudgetId.portfolio_id == row.portfolio_id ? (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setEditBudgetId({});
                          setEditBudget("");
                          setPortfolioBudgetError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        autoFocus="autoFocus"
                        type="number"
                        className="border rounded w-[70%] h-8 mr-2 pl-2 outline-orange-300"
                        defaultValue={row.budget_amount}
                        value={editBudget}
                        min={0}
                        onChange={(e) => handleEditBudget(e)}
                      />
                      <button onClick={() => handlePortfolioBudget()}>
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
                          setPortfolioBudgetError(false);
                        }}
                      />
                    </div>
                    {portfolioBudgetError == true &&
                      portfoliobudgetErrorId == row.portfolio_id && (
                        <p className="text-red-500 text-[11px]">
                          Budget must be atleast 1000.
                        </p>
                      )}
                  </>
                ) : (
                  <div
                    className="cursor-pointer border w-[70%] p-1 rounded"
                    style={{
                      border: row.budget_policy != "dateRange" ? "none" : "",
                    }}
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      if (row.budget_policy == "dateRange") {
                        setEditBudgetId(row);
                        setEditBudget(row.budget_amount);
                      }
                    }}
                  >
                    <div className="col_8">
                      {row.budget_amount ? row.budget_amount : "-"}
                    </div>
                  </div>
                )}
              </td>
            );
          }

          if (item.value === "ad_group_name") {
            init = (
              <td className="group">
                <div className="flex items-center gap-1">
                  <div
                    className={
                      tabName === "adgroup" && "text-[#EF880F] cursor-pointer"
                    }
                  >
                    {row.ad_group_name}
                  </div>

                  {row.pin !== null &&
                    row.pin !== undefined &&
                    tabName === "adgroup" && (
                      <div>
                        <img
                          className="w-4 cursor-pointer"
                          src="/assets/images/pin.svg"
                          onClick={() => {
                            if (!hasPermission) {
                              return;
                            }
                            handleAdgroupPinClick({
                              pinStatus: false,
                              campaignId: row.campaign_id,
                              adgroupId: row.ad_group_id,
                            });
                          }}
                        />{" "}
                      </div>
                    )}
                </div>

                {tabName === "adgroup" && (
                  <WhenPermitted
                    platform="amazon"
                    permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                  >
                    <div className="flex group-hover:visible invisible ">
                      <PinMenu
                        handleDuplicate={false}
                        handlePin={() =>
                          handleAdgroupPinClick({
                            pinStatus: true,
                            campaignId: row.campaign_id,
                            adgroupId: row.ad_group_id,
                          })
                        }
                        handleHistory={false}
                        hidePin={row.pin !== null && row.pin !== undefined}
                      />
                    </div>
                  </WhenPermitted>
                )}
              </td>
            );
          }

          if (item.value === "campaign_name") {
            init = (
              <td className="group">
                <div className="flex items-center gap-1">
                  <div
                    className={
                      tabName === "campaign" && "text-[#EF880F]  cursor-pointer"
                    }
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

                {
                  tabName == "campaign" && (
                    <WhenPermitted
                      platform="amazon"
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
                  )
                  //       )}
                  // </>
                }
              </td>
            );
          }

          if (item.value === "state" && tabName === "campaign") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div className="relative">
                  <div className=" relative w-[140px] h-[55px]  py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex">
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
                        <StatusSelectDropdown
                          disabled={!hasPermission}
                          handleSuccess={handleStatus}
                          statusFlagObj={{
                            campaign_id: row.campaign_id,
                            // campaign_status: !statusFlag.campaign_status,
                            campaign_name: row.campaign_name,
                            campaign_type: row.campaign_type,
                          }}
                          state={row.state}
                          optionList={[
                            { name: "Pause", status: "pause" },
                            { name: "Enable", status: "enable" },
                          ]}
                        />

                        <div className="text-black text-opacity-75 text-[13px] font-normal">
                          Last Edited:{" "}
                          {row["amazon_campaign.updated_at"] !== null
                            ? new Date(
                                row["amazon_campaign.updated_at"]
                              )?.toLocaleDateString()
                            : "NA"}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </td>
            );
          }

          if (item.value === "status" && tabName === "keyword") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div
                  className={`relative w-[156px] h-[55px] py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex`}
                >
                  {updateCampaignId !== undefined &&
                  updateCampaignId.campaign_id === row.campaign_id &&
                  updateCampaignId.keyword_id === row.keyword_id &&
                  apiLoading ? (
                    <>
                      {" "}
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
                    </>
                  ) : (
                    <>
                      <StatusSelectDropdown
                        handleSuccess={handleStatus}
                        disabled={!hasPermission}
                        statusFlagObj={{
                          campaign_id: row.campaign_id,
                          campaign_name: row.campaign_name,
                          campaign_type: row.campaign_goal,
                          keyword_id: row.keyword_id,
                          ad_group_id: row.ad_group_id,
                          ad_group_name: row.ad_group_name,
                          keywords: row.keyword_text,
                          state: row.status || "enable",
                          match_type: row.match_type,
                          // match_type: row.match_type,
                          // keyword_status: !keywordStatusFlag.keyword_status,
                        }}
                        state={row.status}
                        optionList={[
                          { name: "Pause", status: "pause" },
                          { name: "Enable", status: "enable" },
                        ]}
                      />

                      <div className="text-black text-opacity-75 text-[13px] font-normal">
                        Last Edited:{" "}
                        {row.updated_at !== null
                          ? new Date(row.updated_at).toLocaleDateString()
                          : "NA"}
                      </div>
                    </>
                  )}
                </div>
              </td>
            );
          }

          if (item.value === "state" && tabName === "adgroup") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div
                  className={`relative realtive w-[156px] h-[55px] py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex`}
                >
                  {updateCampaignId !== undefined &&
                  updateCampaignId.campaign_id === row.campaign_id &&
                  updateCampaignId.ad_group_id === row.ad_group_id &&
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
                      <StatusSelectDropdown
                        handleSuccess={handleStatus}
                        disabled={!hasPermission}
                        statusFlagObj={{
                          campaign_id: row.campaign_id,
                          // campaign_status: !adgroupStatusFlag.campaign_status,
                          campaign_name: row.campaign_name,
                          campaign_type: row.campaign_type,
                          ad_group_id: row.ad_group_id,
                          ad_group_name: row.ad_group_name,
                        }}
                        state={row.state}
                        optionList={[
                          { name: "Pause", status: "pause" },
                          { name: "Enable", status: "enable" },
                        ]}
                      />

                      <div className="text-black text-opacity-75 text-[13px] font-normal">
                        Last Edited:{" "}
                        {row.updated_at !== null
                          ? new Date(row.updated_at).toLocaleDateString()
                          : "NA"}
                      </div>
                    </>
                  )}
                </div>
              </td>
            );
          }

          if (item.value === "state" && tabName === "asin") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div
                  className={`relative realtive w-[156px] h-[55px] py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex`}
                >
                  {updateCampaignId !== undefined &&
                  updateCampaignId.campaign_id === row.campaign_id &&
                  updateCampaignId.asin === row.product_id &&
                  updateCampaignId.ad_id === row.ad_id &&
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
                          // asin_status: !asinStatusFlag.asin_status,
                          campaign_name: row.campaign_name,
                          campaign_type: row.ad_type,
                          asin: row.product_id,
                          ad_id: row.ad_id,
                          ad_group_id: row?.ad_group_id,
                          ad_group_name: row?.ad_group_name,
                        }}
                        state={row.state}
                        optionList={[
                          { name: "Pause", status: "pause" },
                          { name: "Enable", status: "enable" },
                        ]}
                      />
                      <div className="text-black text-opacity-75 text-[13px] font-normal">
                        Last Edited:{" "}
                        {row.updated_at !== null
                          ? new Date(row.updated_at).toLocaleDateString()
                          : "NA"}
                      </div>
                    </>
                  )}
                </div>
              </td>
            );
          }

          if (item.value === "budget" && tabName === "campaign") {
            init = (
              <td className="min-w-[150px] w-[150px]">
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
                        row.campaign_type
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
                          setEditBudgetId({});
                          setEditBudget("");
                          setCampBudgetError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        type="number"
                        autoFocus="autoFocus"
                        className="border rounded w-[70%] h-8 mr-2 pl-2 outline-orange-300"
                        value={editBudget}
                        placeholder={row?.budget}
                        onChange={(e) =>
                          handleNonNegativeInput(e, setEditBudget)
                        }
                      />
                      <button>
                        {" "}
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                          onClick={() => handleBudget()}
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
                          });
                          setEditBudget("");
                          setCampBudgetError(false);
                        }}
                      />
                    </div>
                    {campBudgetError !== false && (
                      <p className="text-red-500 text-[10px]">
                        {campBudgetError}
                      </p>
                    )}
                  </>
                )}
              </td>
            );
          }

          if (item.value === "placement_top" && tabName === "campaign") {
            init = (
              <td className="min-w-[150px] w-[150px]">
                {placementId.campaign_id !== row.campaign_id ? (
                  <div
                    className="cursor-pointer border w-[70%] p-1 rounded"
                    onDoubleClick={() =>
                      latestPlacement(
                        row.campaign_id,
                        row.campaign_name,
                        row.campaign_type,
                        "PLACEMENT_TOP",
                        row?.placement_top
                      )
                    }
                  >
                    {" "}
                    {row?.placement_top || "0%"}
                  </div>
                ) : (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setPlacementId({
                            campaign_id: "",
                            campaign_name: "",
                            campaign_type: "",
                            placement_bid: "",
                            bid: "",
                          });
                          setPlacementBidVal("");
                          setPlacementError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        type="number"
                        autoFocus="autoFocus"
                        className="border rounded w-[70%] h-8 mr-2 pl-2 outline-orange-300"
                        value={placementBidVal}
                        // placeholder={row?.placement_top}
                        onChange={(e) =>
                          handleNonNegativeInput(e, setPlacementBidVal)
                        }
                      />
                      <button>
                        {" "}
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                          onClick={() => handleTopOfSearch()}
                        />
                      </button>
                      <img
                        src="/assets/images/x.svg"
                        className="cursor-pointer w-[10%]"
                        onClick={() => {
                          setPlacementId({
                            campaign_id: "",
                            campaign_name: "",
                            campaign_type: "",
                            placement_bid: "",
                            bid: "",
                          });
                          setPlacementBidVal();
                          setPlacementError(false);
                        }}
                      />
                    </div>
                    {placementError !== false && (
                      <p className="text-red-500 text-[10px]">
                        {placementError}
                      </p>
                    )}
                  </>
                )}
              </td>
            );
          }

          if (item.value === "placement_bid" && tabName === "placement") {
            switch (row.placement) {
              case "Top of Search on-Amazon":
                bidAmount = row["amazon_campaign.placement_top"];
                break;
              case "Detail Page on-Amazon":
                bidAmount = row["amazon_campaign.placement_product_page"];
                break;
              case "Other on-Amazon":
                bidAmount = row["amazon_campaign.placement_rest_of_search"];
                break;
            }

            init = (
              <td className="min-w-[150px] w-[150px]">
                {placementId.placement_type !== row.placement ||
                placementId.campaign_id !== row.campaign_id ? (
                  <>
                    <div
                      className="cursor-pointer border w-[70%] p-1 rounded"
                      onDoubleClick={() =>
                        latestPlacement(
                          row.campaign_id,
                          row.campaign_name,
                          row.campaign_type,
                          row.placement,
                          bidAmount
                        )
                      }
                    >
                      {" "}
                      {bidAmount || "0%"}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setPlacementId({
                            campaign_id: "",
                            campaign_name: "",
                            campaign_type: "",
                            placement_bid: "",
                            bid: "",
                          });
                          setPlacementBidVal("");
                          setPlacementError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        type="number"
                        autoFocus="autoFocus"
                        className="border rounded w-[70%] h-8 mr-2 pl-2 outline-orange-300"
                        value={placementBidVal}
                        placeholder={bidAmount}
                        onChange={(e) =>
                          handleNonNegativeInput(e, setPlacementBidVal)
                        }
                      />
                      <button>
                        {" "}
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                          onClick={() => handleTopOfSearch()}
                        />
                      </button>
                      <img
                        src="/assets/images/x.svg"
                        className="cursor-pointer w-[10%]"
                        onClick={() => {
                          setPlacementId({
                            campaign_id: "",
                            campaign_name: "",
                            campaign_type: "",
                            placement_bid: "",
                            bid: "",
                          });
                          setPlacementBidVal();
                          setPlacementError(false);
                        }}
                      />
                    </div>
                    {placementError !== false && (
                      <p className="text-red-500 text-[10px]">
                        {placementError}
                      </p>
                    )}
                  </>
                )}
              </td>
            );
          }

          if (item.value === "placement" && tabName === "placement") {
            let placementName;
            switch (row.placement) {
              case "Top of Search on-Amazon":
                placementName = "Top of search (first page)";
                break;
              case "Detail Page on-Amazon":
                placementName = "Product pages";
                break;
              case "Other on-Amazon":
                placementName = "Rest of search";
                break;
            }
            init = (
              <td>
                <div className={"text-[#EF880F]  cursor-pointer"}>
                  {placementName}
                </div>
              </td>
            );
          }

          if (item.value === "default_bid" && tabName === "adgroup") {
            init = (
              <td className="min-w-[150px] w-[150px]">
                {editAdgroupId.campaign_id !== row.campaign_id ||
                editAdgroupId.ad_group_id !== row.ad_group_id ? (
                  <div
                    className="cursor-pointer border w-[70%] p-1 rounded"
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      defaultBidBlock(
                        row.campaign_id,
                        row.campaign_name,
                        row.campaign_type,
                        row.ad_group_id,
                        row.ad_group_name
                      );
                    }}
                  >
                    {" "}
                    {row?.default_bid}
                  </div>
                ) : (
                  <>
                    {" "}
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setEditAdroupId({});
                          setDefaultBid("");
                          setAdgroupBidError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        type="number"
                        autoFocus="autoFocus"
                        className="border rounded w-[70%] h-8 mr-2 pl-2 outline-orange-300"
                        value={defaultBid}
                        placeholder={row?.default_bid}
                        onChange={(e) =>
                          handleNonNegativeInput(e, setDefaultBid)
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
                          setEditAdroupId({
                            campaign_id: "",
                            campaign_name: "",
                            campaign_type: "",
                            ad_group_id: "",
                            ad_group_name: "",
                          });
                          setDefaultBid("");
                          setAdgroupBidError(false);
                        }}
                      />
                    </div>
                    {adgroupBidError !== false && (
                      <p className="text-red-500">{adgroupBidError}</p>
                    )}
                  </>
                )}
              </td>
            );
          }

          if (item.value === "keyword_text" && tabName === "keyword") {
            init = (
              <td
                className={`${
                  tabName === "keyword" && "text-[#EF880F] cursor-poiter"
                }`}
              >
                {row.keyword_text}
              </td>
            );
          }

          if (item.value === "budget_end_date") {
            let date = "-";
            if (row[item.value] != "-") {
              let a = row[item?.value];

              const day = a?.slice(-2);
              const year = a?.slice(0, 4);
              const month = a?.slice(4, 6);
              if (day && year && month) {
                date = day + "/" + month + "/" + year;
              } else {
                date = "-";
              }
            }

            init = (
              <td className="min-w-[150px] w-[150px]">
                {editExtendId?.portfolio_id !== row.portfolio_id ? (
                  <div
                    className="cursor-pointer border w-[60%] p-1 rounded outline-orange-400"
                    style={{
                      border: row.budget_policy != "dateRange" ? "none" : "",
                    }}
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      if (row.budget_policy == "dateRange") {
                        setEditExtendId(row);
                        setSelectedDate(moment(row.budget_end_date)._d);
                      }
                    }}
                  >
                    {" "}
                    {date}
                  </div>
                ) : (
                  <div
                    className="flex gap-2"
                    // onBlur={(e) => {
                    //   if (!e.currentTarget.contains(e.relatedTarget)) {
                    //     setEditExtendId({});
                    //     setEditBudget("");
                    //   }
                    // }}
                  >
                    {" "}
                    {/* <input
                      className="border pl-1"
                      type="date"
                      value={selectedDate}
                      min={getTodayDate()}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      autoFocus
                    /> */}
                    <DatePicker
                      autoFocus={true}
                      className="border border-slate-400 w-[100%] py-1 outline-orange-400"
                      selected={selectedDate}
                      minDate={new Date()}
                      placeholderText="Select date"
                      closeOnScroll={() => {
                        return true;
                      }}
                      onChange={(date) => setSelectedDate(date)}
                    />
                    <img
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePortfolioExtendDate();
                      }}
                      src="/assets/images/tickmark.svg"
                      className="cursor-pointer w-[13px]"
                    />
                    <img
                      src="/assets/images/x.svg"
                      className="cursor-pointer w-[13px]"
                      onClick={() => {
                        setEditExtendId({});
                        setEditBudget("");
                      }}
                    />
                  </div>
                )}
              </td>
            );
          }

          if (item.value === "end_date" && tabName === "campaign") {
            init = (
              <td className="min-w-[150px] w-[150px]">
                {extendDate.campaign_id !== row.campaign_id ? (
                  <div
                    className="cursor-pointer "
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      extendDateBlock(
                        row.campaign_id,
                        row.campaign_name,
                        row.campaign_type
                      );
                    }}
                  >
                    {" "}
                    {row?.end_date || "-"}
                  </div>
                ) : (
                  <div
                    className="flex"
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setExtendDate({
                          campaign_id: "",
                          campaign_name: "",
                          campaign_type: "",
                        });
                        setEditBudget("");
                      }
                    }}
                  >
                    {" "}
                    {/* <input
                      className="border pl-1"
                      type="date"
                      value={selectedDate}
                      min={getTodayDate()}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    /> */}
                    <DatePicker
                      autoFocus={true}
                      className="border border-slate-400 w-[95%] py-1 px-1 outline-orange-300"
                      selected={selectedDate}
                      minDate={new Date()}
                      placeholderText="Select date"
                      closeOnScroll={() => {
                        return true;
                      }}
                      onChange={(date) => setSelectedDate(date)}
                    />
                    <img
                      src="/assets/images/tickmark.svg"
                      className="cursor-pointer mr-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExtendDate();
                      }}
                    />
                    <img
                      src="/assets/images/x.svg"
                      className="cursor-pointer w-[10%]"
                      onClick={() => {
                        extendDateBlock({
                          campaign_id: "",
                          campaign_name: "",
                          campaign_type: "",
                        });
                        setEditBudget("");
                      }}
                    />
                  </div>
                )}
              </td>
            );
          }
          if (item.value === "tag_id") {
            init = (
              <td className="">
                <div className="relative">
                  <div
                    onClick={(e) => {
                      if (!hasPermission) {
                        return;
                      }
                      // setShowPopupOne(row.campaign_id);
                      setShowNewTagPopup(true);
                      tagPosition(e);
                      // setShowPopupTwo(undefined);
                      setSelectedTagIds([]);
                      if (tabName === "campaign")
                        setCampaignId(row.campaign_id);
                      else if (tabName === "adgroup")
                        setAdgroupId({
                          adgroup_id: row.ad_group_id,
                          campaign_id: row.campaign_id,
                        });
                    }}
                    className=" cursor-pointer flex items-center border rounded-e-3xl rounded-s-3xl w-fit px-3 py-1 border-[#D9D9D9] bg-[#FAFAFA]"
                  >
                    {" "}
                    <p>Add Tag</p>
                    <WhenPermitted
                      platform="amazon"
                      permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                    >
                      <img className="" src="/assets/images/chevron-down.svg" />
                    </WhenPermitted>
                  </div>
                  {/* {showPopupOne === row.campaign_id ? (
                    <div
                      className={`drop-shadow-md card p-4 rounded absolute ${
                        rowIndex < totalLength - 10 ? "top-0" : "bottom-0"
                      } bg-white w-max right-0 ${
                        totalLength < 6 ? "z-[100]" : "z-[100]"
                      } border-gray-300`}
                    >
                      {tagData && tagData.length > 0 ? (
                        tagData.map((tags, index) => (
                          <li
                            key={index}
                            className="flex cursor-pointer mb-2  items-center  text-sm mt-1 "
                          >
                            <input
                              className="mr-1 accent-orange-600/100"
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
                            className="cancel_btn_ams"
                            onClick={() => {
                              setShowPopupOne(undefined);
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
                            className="cancel_btn_ams"
                            onClick={() => {
                              setShowPopupOne(undefined);
                              setSelectedTagIds([]);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="apply_btn_ams"
                            disabled={selectedTagIds.length <= 0}
                            onClick={(e) => {
                              setShowPopupOne(undefined);
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
          if (item.value === "state" && tabName === "portfolio") {
            init = (
              <td className="min-w-[150px] w-[200px]">
                <StatusSelectDropdown
                  statusFlagObj={row}
                  state={
                    editPortfolioId == row.portfolio_id && loadingPortfolio
                      ? "In Progress"
                      : row.state == "enabled"
                      ? "delivering"
                      : row.state
                  }
                  disabled={true}
                  // optionList={showOptionByStatus(
                  //   tabName === "campaign"
                  //     ? row.campaign_status
                  //     : tabName === "adgroup"
                  //     ? row.ad_group_status
                  //     : row.keyword_status
                  // )}
                />
                <div className="text-black text-opacity-75 text-[13px] font-normal">
                  Last Edited:{" "}
                  {row.last_edited != "-" ? row.last_edited : "No Activity"}
                </div>
              </td>
            );
          }
          if (item.value === "bid" && tabName === "keyword") {
            init = (
              <td className="min-w-[300px] w-[150px]">
                {keywordBidId.keyword_id !== row.keyword_id ? (
                  <div
                    className="cursor-pointer border px-1 w-[70%] py-1 rounded"
                    onDoubleClick={() => {
                      if (!hasPermission) {
                        return;
                      }
                      keywordBidBlock(
                        row.campaign_id,
                        row.campaign_name,
                        row.campaign_goal,
                        row.keyword_id,
                        row.status || "enable",
                        row.ad_group_id,
                        row.match_type,
                        row.keyword_text,
                        row.campaign_budget,
                        row.ad_group_name
                      );
                    }}
                  >
                    {" "}
                    {row.bid === "₹NaN" ? "-" : row.bid}
                  </div>
                ) : (
                  // </div>
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setKeywordBidId({});
                          setKeywordBid();
                          setMinBid();
                          setMaxBid();
                          setCurrentBid();
                          setNoBidError(false);
                          setKeywordBidError(false);
                        }
                      }}
                    >
                      {" "}
                      <input
                        type="number"
                        autoFocus="autoFocus"
                        className="border rounded w-[70%] h-8 mr-2 pl-2 outline-orange-300"
                        value={keywordBid}
                        placeholder={row?.bid === "₹NaN" ? 0 : row?.bid}
                        onChange={(e) =>
                          handleNonNegativeInput(e, setKeywordBid)
                        }
                      />
                      <button onClick={() => handleKeywordBid()}>
                        {" "}
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                        />
                      </button>
                      <img
                        src="/assets/images/x.svg"
                        className="cursor-pointer w-[14px]"
                        onClick={() => {
                          setKeywordBidId({
                            campaign_id: "",
                            campaign_name: "",
                            campaign_type: "",
                            keyword_id: "",
                            keyword_status: "",
                            campaign_budget: "",
                            adgroup_id: "",
                            ad_group_name: "",
                          });
                          setKeywordBid();
                          setMinBid();
                          setMaxBid();
                          setCurrentBid();
                          setNoBidError(false);
                          setKeywordBidError(false);
                        }}
                      />
                    </div>

                    {noBidError !== false ? (
                      <p className="text-red-500 ">{noBidError}</p>
                    ) : (
                      <div className="flex ">
                        <p className="mr-1">Suggested Bid:</p>
                        <p>
                          {currency}
                          {minBid} |
                        </p>
                        <p>
                          {currency}
                          {currentBid} |
                        </p>
                        <p>
                          {currency}
                          {maxBid}
                        </p>
                      </div>
                    )}
                    {keywordBidError !== false && (
                      <p className="text-red-500 ">{keywordBidError}</p>
                    )}
                  </>
                )}
              </td>
            );
          }

          if (item.value === "product_id" && tabName === "asin") {
            init = (
              <td>
                {row.product_id !== null ? (
                  <>
                    <div className="flex items-center min-w-80">
                      <p className="mr-3 text-[#EF880F]">{row.product_id}</p>
                      {row.media_url !== null ? (
                        <>
                          {" "}
                          <img src={row.media_url} alt="img" />
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <i
                      className="fa-solid fa-triangle-exclamation"
                      style={{ color: "#e7e4e4" }}
                    ></i>
                  </>
                )}
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
    headers.map((item, index) => {
      if (item.showCol) {
        if (Object.prototype.hasOwnProperty.call(row, item.value)) {
          let init = (
            <td key={index} className="p-2">
              <div className="w-max">
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
                  row?.summaryCompData != "-" &&
                  row?.summaryCompData[0][item?.value] != "-" &&
                  row?.summaryCompData[0][item?.value] != "0.00%" &&
                  row?.summaryCompData[0][item?.value] != "₹0" &&
                  row?.summaryCompData[0][item?.value] != "0" &&
                  row?.summaryCompData[0][item?.value] != "0" &&
                  row?.summaryCompData[0][item?.value] != "₹0.00" &&
                  row?.summaryCompData[0][item?.value] != "0%" &&
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
              ? `campaignreportcheckbox__table max-h-[640px] overflow-y-auto ${
                  bodyContent?.length === 0
                    ? "h-[200px]"
                    : expandTable
                    ? "!max-h-[550px]"
                    : ""
                }
                `
              : ` campaignreport__table max-h-[640px] overflow-y-auto ${
                  bodyContent?.length === 0
                    ? "h-[200px]"
                    : expandTable
                    ? "!max-h-[550px]"
                    : ""
                }`
          }
          onScroll={handleScroll}
        >
          <table className="h-full " style={{ width: "100%" }}>
            <thead
              className={
                isCheckBoxRequired
                  ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35] bold"
                  : "campaignreport__tablehead table-fixed sticky top-0 left-0 z-[35]"
              }
            >
              <tr className="">
                {isCheckBoxRequired === true && (
                  <th
                    className={
                      bodyContent &&
                      bodyContent.length > 0 &&
                      bodyContent[0]?.deltaObj &&
                      Object.keys(bodyContent[0]?.deltaObj).length > 0
                        ? "pl-[20px]"
                        : "pl-[20px]"
                    }
                  >
                    <input
                      className="h-16 accent-orange-600/100 "
                      type="checkbox"
                      checked={
                        bodyContent?.length > 0 &&
                        selectedCheckBox?.length === bodyContent?.length
                      }
                      onChange={(e) => handleAllCheckBox(e, bodyContent)}
                      // disabled={
                      //   bodyContent?.length > 0 && tabName != "placement"
                      //     ? false
                      //     : true
                      // }
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
                            style={thStyle(item.columnType, "amazon")}
                          >
                            {/* <div className="tableHead px-4"> */}
                            <div
                              className={
                                tabName !== "keyword"
                                  ? "tableHead px-4"
                                  : `tableHead px-4 ${
                                      index > 0 && index < 4 && "w-64"
                                    }`
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
                                      <img src="/assets/images/arrow-up-new.svg" />
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      className=" cursor-pointer"
                                      onClick={() => sortData(item?.value, -1)}
                                      style={{
                                        color:
                                          Object.keys(sort)[0] === item.value &&
                                          Object.values(sort)[0] === -1
                                            ? "black"
                                            : "grey",
                                      }}
                                    >
                                      <img src="/assets/images/arrow-down-new.svg" />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </th>
                        ) : (
                          <th rowSpan={3} className="multiCol">
                            <div className="graycol ">{item.title}</div>
                            {item.subTitles.map((v, i) => {
                              return (
                                <td key={i} className="graydirect ">
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
                  .filter((row) => row.pin !== null)
                  .sort((a, b) => b.pin - a.pin)
                  .filter((row) => row["pin"] !== "-")
                  .sort((a, b) => b["pin"] - a["pin"])
                  .map((row, i) => (
                    <tr
                      className={
                        isCheckBoxRequired
                          ? "tableContentCheckBox "
                          : "tablecontent"
                      }
                      key={i}
                    >
                      {isCheckBoxRequired && (
                        <td className="pl-2 text-center min-w-max ">
                          <input
                            className="h-16 accent-orange-600/100"
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
            </tbody>

            {(tabName === "campaign" || tabName === "adgroup") && (
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
                          <td className="pl-2 text-center min-w-max">
                            <input
                              className="h-16 accent-orange-600/100 "
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
            {tabName === "portfolio" && (
              <tbody>
                {/* Render remaining rows */}
                {bodyContent &&
                  bodyContent.length > 0 &&
                  bodyContent
                    .filter((row) => row["pin"] === "-")
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
                          <td className="text-center">
                            <input
                              className="h-16  accent-orange-600/100"
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
              </tbody>
            )}

            <tfoot
              className="sticky bottom-0 left-0 z-[35] flipkarttable__footer "
              style={{
                boxShadow: "rgb(206 200 200) 13px 5px 20px 1px",
              }}
            >
              {summaryData && summaryData.length > 0
                ? summaryData.map((row, i) => {
                    return (
                      <>
                        <tr key={i} className="font-semibold">
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
              <tfoot className="sticky bottom-0 z-[999] ">
                <tr>
                  {footer?.map((item, index) => {
                    return (
                      <div key={index}>
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
                      </div>
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
          platform="ams"
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
          platform="ams"
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

export default AmazonSearchTable;
