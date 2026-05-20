/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { _PATCH, _POST } from "../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import {
  BLINKIT_ATTACH_TAG,
  APPLICATION_ROUTES,
  BLINKIT_CAMPAIGN_PIN,
  RPA_ACTION_EDIT,
  // BLINKIT_FUNNEL_COUNT,
  BLINKIT_CATEGORY_STATUS,
  // BLINKIT_BID,
  BLINKIT_KEYWORD_STATUS,
  BLINKIT_ATTACH_ACCOUNT,
  PERMISSIONS,
} from "../../../utils/constants";
import LoaderSpinner from "../loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import ActionType from "../../../redux/types";
import { useHistory } from "react-router";
import StatusSelectDropdown from "../dropdown/StatusSelectDropdown";
// import ConfirmationPopup from "../Popups/ConfirmationPopup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import PinMenu from "../PinMenu/PinMenu";
import "./style.css";
import SelectedTagPopup from "../Popups/SelectedTagPopup";
import NewTagPopup from "../Popups/NewTagPopup";
import AccountModal from "./offscreenPages/AccountModal";
import WhenPermitted from "../WhenPermitted";
import { thStyle } from "../../../utils/helpers";

const BlinkItSearchTable = ({
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
  accounts,
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
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  let { recallCampaign } = useSelector((state) => state?.RecallCampaignReducer);
  //hold the tag data from the redux
  const { tagData } = useSelector((state) => state?.TagReducer);
  //holds the value of tags which are attached to a campaign
  const [addedTags, setAddedTags] = useState([]);
  // handles the tags to be attached to a campaign
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  // const [showPopupOne, setShowPopupOne] = useState(false);
  // const [showPopupTwo, setShowPopupTwo] = useState(undefined);
  // const [recallTags, setRecallTags] = useState({});
  const [bidError, setBidError] = useState(false);
  const userPermissions = useSelector(
    (state) => state?.permissionsReducer || []
  );
  const hasPermission = _.find(userPermissions, {
    permission_name: PERMISSIONS.CAMPAIGN_ACTIONS,
    platform: "blinkit",
  });
  // const [isHovered, setIsHovered] = useState({
  //   pinStatus: false,
  //   campaignId: "",
  // });

  // holds the camapign id for which budget is changed
  const [editBudgetId, setEditBudgetId] = useState({
    campaign_id: 0,
    campaign_name: "",
    campaign_type: "",
  });

  const [editCategoryId, setEditCategoryId] = useState({
    campaign_id: 0,
    category_id: 0,
    category_name: "",
    campaign_type: "",
    campaign_name: "",
    current_bid: "",
  });

  const [editKeywordId, setEditKeywordId] = useState({
    campaign_id: 0,
    keyword: "",
    match_type: "",
    campaign_type: "",
    campaign_name: "",
    current_bid: "",
    max_bid: "",
    min_bid: "",
  });

  const [statusFlag, setStatusFlag] = useState({
    campaign_id: "",
    campaign_status: false,
    campaign_name: "",
    campaign_type: "",
  });

  // const [categoryStatusFlag, setCategoryStatusFlag] = useState({
  //   campaign_id: "",
  //   category_status: false,
  //   category_name: "",
  //   history_data: "",
  //   campaign_type: "",
  //   status: "",
  // });

  // const [keywordStatusFlag, setKeywordStatusFlag] = useState({
  //   campaign_id: "",
  //   keyword_status: false,
  //   keyword: "",
  //   history_data: "",
  //   status: "",
  // });

  const [selectedDate, setSelectedDate] = useState();
  // const [statusVal, setStatusVal] = useState("");

  const [accountModalState, setAccountModalState] = useState({
    // isOpen: false,
    campaign_id: false,
    selectedOption: null,
    // optionSelected: false,
  });

  const [extendDate, setExtendDate] = useState({
    campaign_id: 0,
    campaign_name: "",
    campaign_type: "",
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

  // const [confirm, setConfirm] = useState(false);
  const [confirmBid, setConfirmBid] = useState(false);
  const [updateCampaignId, setUpdateCampaignId] = useState();
  const [error, setError] = useState(false);
  const [dateOption, setDateOption] = useState("selectDate");
  const [apiLoading, setApiLoading] = useState(false);
  // holds budget amount
  const [editBudget, setEditBudget] = useState();
  const [keywordBidError, setKeywordError] = useState(false);
  const [categoryBid, setCategoryBid] = useState();
  const [keywordBid, setKeywordBid] = useState();
  const [confirmPopup, setConfirmPopup] = useState({
    isOpen: false,
  });
  let allTabSelectedCheckBox = selectedCheckBox;
  selectedCheckBox =
    selectedCheckBox &&
    Object.prototype.hasOwnProperty.call(selectedCheckBox, tabName)
      ? selectedCheckBox[tabName]
      : [];
  const dispatch = useDispatch();
  const currency_format = localStorage.getItem("currency_format");
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
        updatedIds["category"] = [];
      }
      // console.log("etstesttststststtttttt", updatedIds);
      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });
    } else {
      // if the checkbox is unselected, remove the data from the previous selectedData array
      if (tabName === "campaign") {
        updatedIds[tabName] = selectedCheckBox.filter(
          (item) => item.campaign_id !== data.campaign_id
        );
        updatedIds["keyword"] = [];
        updatedIds["category"] = [];
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
    // if (updatedIds[tabName].length > 0) {
    //   // console.log(updatedIds, "<><<<<<<< updated ids");
    //   let payload = {
    //     data: updatedIds,
    //     tab_name: tabName,
    //     start_date: startDate,
    //     end_date: endDate,
    //   };
    //   let countData = await _POST(BLINKIT_FUNNEL_COUNT, payload);
    //   dispatch({
    //     type: ActionType.BLINKIT_FUNNEL_COUNT,
    //     payload: { ...countData.data.data },
    //   });
    // } else {
    //   dispatch({
    //     type: ActionType.BLINKIT_FUNNEL_COUNT,
    //     payload: {},
    //   });
    // }
    // handleSelectedData(updatedIds);
  };

  // useEffect(() => {
  //   if (tabName === "campaign") {
  //     dispatch({
  //       type: ActionType.TOTAL_CAMPAIGN,
  //       payload: totalData,
  //     });
  //   }

  //   if (tabName === "keyword") {
  //     dispatch({
  //       type: ActionType.TOTAL_KEYWORD_COUNT,
  //       payload: totalData,
  //     });
  //   }

  //   if (tabName === "category") {
  //     dispatch({
  //       type: ActionType.TOTAL_CATEGORY_COUNT,
  //       payload: totalData,
  //     });
  //   }
  // }, [tabName, totalData]);
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
        updatedIds["category"] = [];
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
        updatedIds["category"] = [];
      }
      dispatch({
        type: ActionType.CHECKBOX,
        payload: { ...updatedIds },
      });
    }
    // if (updatedIds[tabName].length > 0) {
    //   // console.log(updatedIds, "<><<<<<<< updated ids");
    //   let payload = {
    //     data: updatedIds,
    //     tab_name: tabName,
    //     start_date: startDate,
    //     end_date: endDate,
    //   };
    //   let countData = await _POST(BLINKIT_FUNNEL_COUNT, payload);
    //   dispatch({
    //     type: ActionType.BLINKIT_FUNNEL_COUNT,
    //     payload: { ...countData.data.data },
    //   });
    // } else {
    //   dispatch({
    //     type: ActionType.BLINKIT_FUNNEL_COUNT,
    //     payload: {},
    //   });
    // }
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
  //       `${BLINKIT_TAGS}?platform=blinkit&data_level=campaign`
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
  // const newFunc = () => {};
  const handleStatus = ({ status, statusFlag }) => {
    let data;
    if (tabName == "category") {
      setConfirmPopup({
        ...confirmPopup,
        isOpen: true,
        status: status,
        statusFlag: statusFlag,
      });
      setUpdateCampaignId({
        campaign_id: statusFlag.campaign_id,
        category_name: statusFlag.category_name,
      });
      // setConfirm(true);
    }
    if (tabName == "keyword") {
      setConfirmPopup({
        ...confirmPopup,
        isOpen: true,
        status: status,
        statusFlag: statusFlag,
      });
      setUpdateCampaignId({
        campaign_id: statusFlag.campaign_id,
        keyword_name: statusFlag.keyword_name,
        match_type: statusFlag.match_type,
      });
      // setConfirm(true);
    }
    if (tabName == "campaign") {
      data = [
        {
          campaign_id: [statusFlag?.campaign_id],
          campaign_name: [statusFlag.campaign_name],
          action_type: "campaign",
          action: status,
          action_message: `${status} campaign`,
          media_type: "Blinkit",
          action_status: 10,
          segment: statusFlag.campaign_type,
        },
      ];
      setUpdateCampaignId(statusFlag.campaign_id);
      handleAction({ data, statusFlag });
      setStatusFlag({
        campaign_id: "",
        campaign_status: status,
        campaign_name: "",
      });
    }
  };

  const handleCategoryStatus = async (bidApi = false) => {
    try {
      setLoading(true);
      setApiLoading(true);
      const data = {
        row: [
          {
            entity: tabName,
            campaign_name: confirmPopup.statusFlag?.campaign_name,
            segment: confirmPopup.statusFlag?.campaign_type,
            entity_type: confirmPopup.statusFlag?.campaign_type,
            entity_id: confirmPopup.statusFlag?.category_name,
            media_type: "Blinkit",
            // history_data: confirmPopup.statusFlag?.history_data,
            // status: true,
            set_value:
              confirmPopup.statusFlag?.cpm_bid >
              confirmPopup.statusFlag?.min_bid
                ? confirmPopup.statusFlag?.cpm_bid
                : confirmPopup.statusFlag?.min_bid,
            campaign_id: confirmPopup.statusFlag?.campaign_id,
            category_id: confirmPopup.statusFlag?.category_id,
          },
        ],
        status_type: confirmPopup.status,
        bidApi: bidApi,
      };
      data.client_id = localStorage.getItem("client_id");
      data.user_id = localStorage.getItem("user_id");
      data.action =
        confirmPopup.status == "stop" ? "pause_category" : "enable_category";
      data.action_type = "category";
      data.user_name = localStorage.getItem("name");
      data.action_message =
        confirmPopup.status == "stop" ? "pause category" : "enable category";
      data.action_status = 10;
      const res = await _POST(BLINKIT_CATEGORY_STATUS, data);
      // console.log(data,"dataaaaaa")
      setLoading(false);
      setApiLoading(false);
      if (res?.status === 200) {
        let tempInfo = bodyContent;
        const index = tempInfo.findIndex(
          (x) =>
            x.campaign_id == confirmPopup.statusFlag.campaign_id &&
            x.category_name == confirmPopup.statusFlag.category_name
        );
        tempInfo[index].status =
          res?.data?.data?.action === "restart" ? "Active" : "Stopped";
        tempInfo[index].updated_at = new Date();
        setBodyData([...tempInfo]);
        // setCategoryStatusFlag({
        //   campaign_id: "",
        //   category_status: false,
        //   campaign_name: "",
        //   category_name: "",
        //   campaign_type: "",
        // });
        setConfirmPopup({
          isOpen: false,
        });
        // setStatusVal("");
        console.error(res, "asdadadasdasd");
        dispatch(setToastMessageHandler("Status updated successfully", true));
      } else {
        console.error(res, "asdadadasdasd");
        dispatch(setToastMessageHandler("Something went wrong", false));
      }
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleCategoryAction = async (status, statusFlag) => {
    // const data = {
    //   row: [
    //     {
    //       entity: tabName,
    //       entity_type: statusFlag.campaign_type,
    //       entity_id: statusFlag?.category_name,
    //       media_type: "Blinkit",
    //       history_data: statusFlag?.history_data,
    //       status: true,
    //       // segment: categoryStatusFlag?.campaign_type,
    //       // campaign_name: categoryStatusFlag?.campaign_name,
    //       campaign_id: statusFlag?.campaign_id,
    //     },
    //   ],
    //   status_type: status,
    //   // bidApi: bidApi,
    // };

    if (status == "restart") {
      // let resp = await _POST(BLINKIT_BID, data);
      const check = statusFlag.cpm_bid >= statusFlag.min_bid;
      if (check) {
        handleCategoryStatus();
      } else {
        setConfirmBid(true);
      }
    } else {
      handleCategoryStatus();
    }
  };

  const handleKeywordStatus = async (bidApi = false) => {
    try {
      setLoading(true);
      setApiLoading(true);
      const data = {
        row: [
          {
            entity: tabName,
            // segment: keywordStatusFlag.campaign_type,
            campaign_name: confirmPopup.statusFlag?.campaign_name,
            entity_type: confirmPopup.statusFlag?.campaign_type,
            match_type: confirmPopup.statusFlag?.match_type,
            entity_id: confirmPopup.statusFlag?.keyword_name,
            media_type: "Blinkit",
            set_bid:
              confirmPopup.statusFlag?.cpm_bid >
              confirmPopup.statusFlag?.min_bid
                ? confirmPopup.statusFlag?.cpm_bid
                : confirmPopup.statusFlag?.min_bid,
            // history_data: confirmPopup.statusFlag?.history_data,
            // status: true,
            campaign_id: confirmPopup.statusFlag?.campaign_id,
          },
        ],
        status_type: confirmPopup.status,
        bidApi: bidApi,
      };
      data.client_id = localStorage.getItem("client_id");
      data.user_id = localStorage.getItem("user_id");
      data.action =
        confirmPopup.status == "stop" ? "pause_keyword" : "enable_keyword";
      data.action_type = "keyword";
      data.user_name = localStorage.getItem("name");
      data.action_message =
        confirmPopup.status == "stop" ? "pause keyword" : "enable keyword";
      data.action_status = 10;
      const res = await _POST(BLINKIT_KEYWORD_STATUS, data);
      setLoading(false);
      setApiLoading(false);
      // console.log(res,"rreesspp")
      if (res?.status === 200) {
        let tempInfo = bodyContent;

        let idx = [];

        res?.data?.data?.row.forEach((item) => {
          let index = tempInfo.findIndex(
            (x) =>
              x.campaign_id == item.campaign_id &&
              x.keyword == item.entity_id &&
              x.match_type == item.match_type
          );
          idx.push(index);
        });
        //  console.error(idx,"indexxxxxxx")
        idx.forEach((item) => {
          tempInfo[item].status =
            res?.data?.data?.action === "restart" ? "Active" : "Stopped";
          tempInfo[item].updated_at = new Date();
        });

        // const index = tempInfo.findIndex(
        //   (x) =>
        //     x.campaign_id == keywordStatusFlag.campaign_id &&
        //     x.keyword == keywordStatusFlag.keyword_name &&
        //     x.match_type == keywordStatusFlag.match_type
        // );
        // tempInfo[index].status =
        //   res?.data?.data?.action === "restart" ? "Active" : "Stopped";
        setBodyData([...tempInfo]);

        // setStatusVal("");
        dispatch(setToastMessageHandler("Status updated successfully", true));
      } else {
        dispatch(setToastMessageHandler("Something went wrong", false));
      }
      // setKeywordStatusFlag({
      //   campaign_id: "",
      //   keyword_status: false,
      //   campaign_name: "",
      //   keyword_name: "",
      //   campaign_type: "",
      // });
      setConfirmPopup({
        isOpen: false,
      });
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleKeywordAction = async (status, statusFlag) => {
    // const data = {
    //   row: [
    //     {
    //       entity: tabName,
    //       match_type: statusFlag.match_type,
    //       entity_type: statusFlag.campaign_type,
    //       entity_id: statusFlag?.keyword_name,
    //       media_type: "Blinkit",
    //       history_data: statusFlag?.history_data,
    //       status: true,
    //       min_bid: statusFlag.cpm_bid,
    //       campaign_id: statusFlag?.campaign_id,
    //     },
    //   ],
    //   status_type: status,
    //   // bidApi: bidApi,
    // };
    if (status == "restart") {
      const check = statusFlag.cpm_bid >= statusFlag.min_bid;
      // console.error(data, "data>>>>>>>");
      // let resp = await _POST(BLINKIT_BID, data);
      if (check) {
        handleKeywordStatus();
      } else {
        setConfirmBid(true);
      }
    } else {
      handleKeywordStatus();
    }
  };

  useEffect(() => {
    if (!apiLoading) {
      setUpdateCampaignId();
    }
  }, [apiLoading]);

  const handleAction = async ({ data, statusFlag = null }) => {
    try {
      setApiLoading(true);

      const res = await _POST(RPA_ACTION_EDIT, data);
      setApiLoading(false);
      if (res?.status === 200) {
        let tempInfo = bodyContent;
        if (res?.data?.status?.message === "Status updated successfully") {
          const index = tempInfo.findIndex(
            (x) => x.campaign_id == statusFlag.campaign_id
          );

          tempInfo[index].status =
            res?.data?.data?.result[0]?.action === "restart"
              ? "Active"
              : "Stopped";
          tempInfo[index].updated_at = date.toLocaleDateString();

          setBodyData([...tempInfo]);
        } else if (
          res?.data?.status?.message === "Budget updated successfully"
        ) {
          const index = tempInfo.findIndex(
            (x) => x.campaign_id == editBudgetId.campaign_id
          );
          tempInfo[
            index
          ].campaign_budget = `₹${res?.data?.data?.result[0]?.set_value}`;
          tempInfo[index].updated_at = date.toLocaleDateString();

          setBodyData([...tempInfo]);
        } else if (
          res?.data?.status?.message === "End date updated successfully"
        ) {
          const index = tempInfo.findIndex(
            (x) => x.campaign_id == extendDate.campaign_id
          );
          if (res?.data?.data?.result[0]?.end_date === null) {
            tempInfo[index].end_date = "onwards";
          } else {
            tempInfo[index].end_date = res?.data?.data?.result[0]?.end_date;
          }
          tempInfo[index].updated_at = date.toLocaleDateString();

          setBodyData([...tempInfo]);
        } else if (
          res?.data?.status?.message === "Category bid updated successfully"
        ) {
          const index = tempInfo.findIndex(
            (x) =>
              x.campaign_id == editCategoryId.campaign_id &&
              x.category_id === editCategoryId.category_id
          );

          tempInfo[index].cpm_bid = `₹${res?.data?.data?.result[0]?.set_value}`;
          tempInfo[index].updated_at = date.toLocaleDateString();

          setBodyData([...tempInfo]);
        } else if (
          res?.data?.status?.message === "Keyword Bid updated successfully"
        ) {
          const index = tempInfo.findIndex(
            (x) =>
              x.campaign_id == editKeywordId.campaign_id &&
              x.match_type === editKeywordId.match_type &&
              x.keyword === editKeywordId.keyword
          );
          tempInfo[index].cpm_bid = `₹${res?.data?.data?.result[0]?.set_value}`;
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
  // const handlePin = (pinStatus, campaignId) => {
  //   setIsHovered({ pinStatus, campaignId });
  // };

  // const StatusDropdown = () => {
  //   return (
  //     <>
  //       <div className="drop-shadow-md  p-1 rounded  bg-white w-max z-[50] border-gray-300 mb-12">
  //         <div
  //           className="hover:bg-[#11B07A] px-2 hover:text-white cursor-pointer rounded mb-1"
  //           onClick={() => {
  //             handleStatus("stop");
  //             // setStatusVal("stop");
  //           }}
  //         >
  //           Pause
  //         </div>
  //         <div
  //           className="hover:bg-[#11B07A] px-2 hover:text-white cursor-pointer rounded"
  //           onClick={() => {
  //             handleStatus("restart");
  //             // setStatusVal("restart");
  //           }}
  //         >
  //           Enable
  //         </div>
  //       </div>
  //     </>
  //   );
  // };

  const handlePinClick = async ({ pinStatus, campaignId }) => {
    const data = {
      campaign_id: [campaignId],
      pin_status: pinStatus,
    };
    const result = await _POST(BLINKIT_CAMPAIGN_PIN, data);
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
      setLoading(true);
      let data;
      if (type == "newTag") {
        data = {
          // tag_id: selectedTagIds,
          tag_id: [...new Set(selectedTagIds)],
          platform: "blinkit",
        };
      } else {
        data = {
          // tag_id: selectedTagIds,
          tag_id: [...new Set(addedTags)],
          platform: "blinkit",
        };
      }
      // const data = {
      //   // tag_id: selectedTagIds,
      //   tag_id: [...new Set(selectedTagIds)],
      //   platform: "blinkit",
      // };
      const result = await _PATCH(`${BLINKIT_ATTACH_TAG}/${campaignId}`, data);

      if (result?.status == 200) {
        dispatch(
          setToastMessageHandler("Tag action performed successfully", true)
        );
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
      // setRecallTags(result?.data?.data?.result);
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

  // useEffect(() => {
  //   // console.log(recallTags, "recall Camapign");
  // }, [recallTags]);

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
  };

  const handleNonNegativeInput = (e, setValueFunction) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue > 0) {
      setValueFunction(inputValue);
    } else {
      setValueFunction(0);
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
  const history = useHistory();

  function EditCampaign({ row }) {
    let campaign_id = row.campaign_id;
    return (
      <>
        {row.campaign_name}

        {row?.campaign_type === "Performance" &&
        row?.campaign_ad_asset === "Product Booster" ? (
          // &&
          // row?.status === "Active"
          <button
            onClick={() =>
              history.push(APPLICATION_ROUTES.BLINKITEDITCAMPAIGN, campaign_id)
            }
          >
            <div className="pr-1">
              <img
                className="header-buttons mr-2"
                src={"/assets/images/edit.svg"}
                alt=""
              />
            </div>
          </button>
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

  const budgetBlock = (campaign_id, campaign_name, campaign_type) => {
    setEditBudgetId({ campaign_id, campaign_name, campaign_type });
    setUpdateCampaignId(campaign_id);
  };

  const categoryBidBlock = (
    campaign_id,
    category_id,
    category_name,
    campaign_name,
    campaign_type,
    current_bid
  ) => {
    setEditCategoryId({
      campaign_id,
      category_id,
      category_name,
      campaign_name,
      campaign_type,
      current_bid,
    });
  };

  const keywordBidBlock = (
    campaign_id,
    campaign_type,
    keyword,
    match_type,
    current_bid,
    max_bid,
    min_bid,
    campaign_name
  ) => {
    setEditKeywordId({
      campaign_id,
      keyword,
      match_type,
      campaign_type,
      campaign_name,
      current_bid,
      max_bid,
      min_bid,
    });
  };

  const handleKeywordBid = () => {
    setUpdateCampaignId({
      campaign_id: editKeywordId.campaign_id,
      keyword_name: editKeywordId.keyword,
      match_type: editKeywordId.match_type,
    });
    if (keywordBid === undefined || !keywordBid) {
      setKeywordError("Enter bid value");
    } else if (
      parseFloat(keywordBid) < parseFloat(editKeywordId.min_bid) ||
      parseFloat(keywordBid) > parseFloat(editKeywordId.max_bid)
    ) {
      setKeywordError(
        `Enter bid between ${currency}${parseFloat(
          editKeywordId.min_bid
        ).toLocaleString(currency_format)} and ${currency}${parseFloat(
          editKeywordId.max_bid
        ).toLocaleString(currency_format)}`
      );
    } else {
      setKeywordError(false);
      const data = [
        {
          campaign_id: [editKeywordId.campaign_id],
          campaign_name: [editKeywordId.campaign_name],
          action_type: "keyword",
          action: "set_bid",
          action_message: `Set keyword bid from ${
            editKeywordId.current_bid
          } to ${currency}${parseFloat(keywordBid).toLocaleString(
            currency_format
          )}`,
          media_type: "Blinkit",
          action_status: 10,
          set_value: parseFloat(keywordBid),
          campaign_type: editKeywordId.campaign_type,
          keyword_name: editKeywordId.keyword,
          keywords: editKeywordId.keyword,
          match_type: editKeywordId.match_type,
          segment: editKeywordId.campaign_type,
        },
      ];

      handleAction({ data });
      setEditKeywordId({
        campaign_id: 0,
        keyword: "",
        match_type: "",
        campaign_type: "",
        campaign_name: "",
        current_bid: "",
        max_bid: "",
        min_bid: "",
      });
    }
  };
  const handleCategoryBid = () => {
    setUpdateCampaignId({
      campaign_id: editCategoryId.campaign_id,
      category_name: editCategoryId.category_name,
    });
    if (categoryBid === undefined || !categoryBid) {
      setBidError("Enter bid value");
    } else if (categoryBid < 200 || categoryBid > 10000) {
      setBidError("Enter bid between ₹200 and ₹10,000");
    } else {
      setBidError(false);
      const data = [
        {
          campaign_id: [editCategoryId.campaign_id],
          campaign_name: [editCategoryId.campaign_name],
          action_type: "category",
          action: "set_bid",
          action_message: `Set category bid from ${editCategoryId.current_bid} to ${currency}${categoryBid}`,
          media_type: "Blinkit",
          action_status: 10,
          set_value: parseFloat(categoryBid),
          campaign_type: editCategoryId.campaign_type,
          category_id: editCategoryId?.category_id,
          category_name: editCategoryId?.category_name,
          segment: editCategoryId.campaign_type,
        },
      ];
      handleAction({ data });
      setEditCategoryId({
        campaign_id: 0,
        category_id: 0,
        category_name: "",
        campaign_type: "",
        campaign_name: "",
      });
    }
  };
  const handleBudget = () => {
    if (editBudget === undefined || !editBudget) {
      setError("Enter budget value");
    } else if (
      editBudget < 200 &&
      editBudgetId.campaign_type === "Performance"
    ) {
      setError(`Min budget is ${currency}200 `);
    } else {
      const data = [
        {
          campaign_id: [editBudgetId.campaign_id],
          campaign_name: [editBudgetId.campaign_name],
          action_type: "campaign",
          action: "set_budget",
          action_message: `Set budget to ${currency}${editBudget}`,
          media_type: "Blinkit",
          action_status: 10,
          set_value: parseFloat(editBudget),
          segment: editBudgetId.campaign_type,
        },
      ];
      handleAction({ data });
      setEditBudgetId({
        campaign_id: "",
        campaign_name: "",
        campaign_type: "",
      });
    }
  };
  // const handleStatusFlag = (
  //   campaign_id,
  //   status,
  //   campaign_name,
  //   campaign_type
  // ) => {
  //   setUpdateCampaignId(campaign_id);
  //   if (status === true) {
  //     setStatusFlag({
  //       campaign_id: campaign_id,
  //       campaign_status: status,
  //       campaign_name: campaign_name,
  //       campaign_type: campaign_type,
  //     });
  //   } else {
  //     setStatusFlag({
  //       campaign_id: "",
  //       campaign_status: status,
  //       campaign_name: "",
  //       campaign_type: "",
  //     });
  //   }
  // };

  // const handleCategoryStatusFlag = (
  //   campaign_id,
  //   status,
  //   category_name,
  //   bid,
  //   campaign_type,
  //   campaign_name,
  // ) => {
  //   setUpdateCampaignId({campaign_id, category_name});
  //   if (status == true) {
  //     let history = {
  //       previous_bid: parseFloat(bid),
  //     };
  //     setCategoryStatusFlag({
  //       campaign_id: campaign_id,
  //       category_status: status,
  //       category_name: category_name,
  //       history_data: history,
  //       campaign_type: campaign_type,
  //       campaign_name: campaign_name,
  //       status,
  //     });
  //   } else {
  //     setCategoryStatusFlag({
  //       campaign_id: "",
  //       category_status: status,
  //       category_name: "",
  //       history_data: "",
  //       campaign_type: "",
  //       campaign_name: "",
  //       status,
  //     });
  //   }
  // };

  // const handleKeywordStatusFlag = (
  //   campaign_id,
  //   status,
  //   keyword_name,
  //   match_type,
  //   min_bid,
  //   campaign_type,
  //   campaign_name
  // ) => {
  //   setUpdateCampaignId({ campaign_id, keyword_name, match_type });
  //   if (status == true) {
  //     let history = {
  //       previous_bid: parseFloat(min_bid),
  //     };
  //     setKeywordStatusFlag({
  //       campaign_id: campaign_id,
  //       keyword_status: status,
  //       keyword_name: keyword_name,
  //       history_data: history,
  //       match_type: match_type,
  //       min_bid: min_bid,
  //       campaign_name: campaign_name,
  //       campaign_type: campaign_type,
  //       status,
  //     });
  //   } else {
  //     setKeywordStatusFlag({
  //       campaign_id: "",
  //       keyword_status: status,
  //       keyword_name: "",
  //       history_data: "",
  //       match_type: "",
  //       status,
  //     });
  //   }
  // };

  const handleExtendDate = () => {
    const formattedDate =
      dateOption === "selectDate"
        ? moment(selectedDate).format("YYYY-MM-DD")
        : null;

    let data;
    data = [
      {
        campaign_id: [extendDate.campaign_id],
        campaign_name: [extendDate.campaign_name],
        action_type: "campaign",
        action: "extend_end_date",
        action_message: `Campaign end date updated to ${
          formattedDate || "onwards"
        }`,
        media_type: "Blinkit",
        action_status: 10,
        segment: extendDate.campaign_type,
        infinite_campaign: dateOption === "selectDate" ? false : true,
        // end_date: dateOption === "selectDate" ? selectedDate : null, //Old code
        end_date: formattedDate, // react-datepicker
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
  const extendDateBlock = (campaign_id, campaign_name, campaign_type) => {
    setExtendDate({ campaign_id, campaign_name, campaign_type });
    setUpdateCampaignId(campaign_id);
  };
  // const getTodayDate = () => {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = (today.getMonth() + 1).toString().padStart(2, "0");
  //   const day = today.getDate().toString().padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };

  const handleDone = async (option) => {
    // console.log("option>>>>>>>>>",option)

    try {
      setLoading(true);
      // let data;

      const result = await _PATCH(
        `${BLINKIT_ATTACH_ACCOUNT}/${accountModalState.campaign_id}`,
        {
          account_name: option.label,
          account_id: option.value,
        }
      );

      if (result?.status == 200) {
        dispatch(
          setToastMessageHandler("Account action performed successfully", true)
        );
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
      // setRecallTags(result?.data?.data?.result);
      console.log(bodyContent, result?.data?.data?.updatedRecord[0]);
      if (
        result.data.status.code == 200 &&
        result?.data?.data?.updatedRecord.length > 0
      ) {
        let tempData = bodyContent;
        const foundIndex = tempData.findIndex(
          (x) => x.campaign_id == accountModalState.campaign_id
        );
        tempData[foundIndex].account_custom =
          result?.data?.data?.updatedRecord[0]?.account_name;

        setBodyData([...tempData]);
      }
      setAccountModalState({
        campaign_id: false,
        selectedOption: null,
      });
      setLoading(false);
      //
      // init();
      setSelectedTagIds([]);
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  function TableCol({ row, name }) {
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
            "category_name",
            "end_date",
            "cpm_bid",
            // "account_custom",
          ].includes(item.value) &&
          !(item.value === "tag_id" && row[item.value]?.length === 0)
        ) {
          let init = (
            <td className="p-2 min-w-[150px] w-[150px]">
              <div>
                {" "}
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
              </div>
            </td>
          );
          if (item.value === "account_custom") {
            // console.log("item.value>>>>>>>>>>>>", item.value);
            init = (
              <td className="!px-4">
                {/* {row[item.value] === null ? ( */}
                <div
                  className="flex cursor-pointer items-center border rounded-e-3xl rounded-s-3xl w-[7rem] px-2 py-1 border-[#D9D9D9] bg-[#FAFAFA] "
                  onClick={(e) => {
                    if (!hasPermission) {
                      return;
                    }
                    setAccountModalState((prevState) => ({
                      ...prevState,
                      campaign_id: row.campaign_id,
                      selectedOption: row[item.value],
                    }));
                    tagPosition(e);
                  }}
                >
                  <div className="flex cursor-pointer">
                    {row[item.value] === null ? "Add Account" : row[item.value]}
                    <WhenPermitted
                      platform="blinkit"
                      permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                    >
                      <img
                        className="px-1"
                        src="/assets/images/chevron-down.svg"
                      />
                    </WhenPermitted>
                  </div>
                </div>
                {/* ) : (
                  row[item.value]
                )} */}
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
                      className="flex cursor-pointer"
                      onClick={(e) => {
                        if (!hasPermission) {
                          return;
                        }
                        setAddedTags(row.tag_id);
                        setCampaignId(row.campaign_id);
                        // setShowPopupTwo(row.id);
                        // setShowPopupOne(undefined);
                        tagPosition(e);
                        setShowSelectedTagPopup(true);
                        setShowNewTagPopup(false);
                        setSelectedTagIds([]);
                      }}
                    >
                      {" "}
                      {tagNames[0]?.tag_name}
                      <WhenPermitted
                        permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                        platform="blinkit"
                      >
                        <img
                          className="px-1"
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
                      } drop-shadow-md  p-4 rounded absolute bg-white w-max right-0
                      z-[100] border-gray-300`}
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
                                  className="mr-1 accent-green-600"
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
                                  className="mr-1 accent-green-600"
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
              <td className="p-2">
                <div className="relative">
                  <div
                    className=" cursor-pointer flex items-center border rounded-e-3xl rounded-s-3xl  px-3 py-1 border-[#D9D9D9] bg-[#FAFAFA] min-w-[20px] max-w-max"
                    onClick={(e) => {
                      if (!hasPermission) {
                        return;
                      }
                      setCampaignId(row.campaign_id);
                      // setShowPopupOne(row.campaign_id);
                      // setShowPopupTwo(undefined);
                      tagPosition(e);
                      setShowNewTagPopup(true);
                      setShowSelectedTagPopup(false);
                      setSelectedTagIds([]);
                    }}
                  >
                    <p>Add Tag</p>
                    <WhenPermitted
                      platform="blinkit"
                      permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                    >
                      <img className="" src="/assets/images/chevron-down.svg" />
                    </WhenPermitted>
                  </div>
                  {/* {showPopupOne === row.campaign_id ? (
                    <div
                      className={` ${
                        rowIndex < totalLength - 10 ? "top-0" : "bottom-0"
                      } drop-shadow-md card p-4 rounded absolute bg-white w-max right-0 z-[100] border-gray-300`}
                    >
                      {tagData && tagData.length > 0 ? (
                        tagData.map((tags, index) => (
                          <li
                            key={index}
                            className="flex cursor-pointer mb-2  items-center  text-sm mt-1 "
                          >
                            <input
                              className="mr-1 accent-green-600"
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
          if (item.value === "status" && tabName === "campaign") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div
                  className={`relative realtive cursor-pointer w-[156px] h-[55px] py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex`}
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
                      <StatusSelectDropdown
                        handleSuccess={handleStatus}
                        statusFlagObj={{
                          campaign_id: row.campaign_id,
                          campaign_status: !statusFlag.campaign_status,
                          campaign_name: row.campaign_name,
                          campaign_type: row.campaign_type,
                        }}
                        disabled={!hasPermission}
                        state={row.status}
                        optionList={[
                          { name: "Pause", status: "stop" },
                          { name: "Enable", status: "restart" },
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
          if (item.value === "status" && tabName === "category") {
            init = (
              <td className="min-w-[150px] w-[150px] ">
                <div
                  className={`relative realtive cursor-pointer w-[156px] h-[55px] py-3  lack border-opacity-5 flex-col justify-center items-start gap-[3px] inline-flex`}
                >
                  {updateCampaignId !== undefined &&
                  updateCampaignId.campaign_id === row.campaign_id &&
                  updateCampaignId.category_name === row.category_name &&
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
                          campaign_name: row.campaign_name,
                          campaign_id: row.campaign_id,
                          // category_status: !categoryStatusFlag.category_status,
                          category_name: row.category_name,
                          category_id: row.category_id,
                          // history_data: {
                          //   previous_bid: parseFloat(row.cpm_bid),
                          // },
                          cpm_bid: row.cpm_bid,
                          min_bid: row.min_bid,
                          campaign_type: row.campaign_type,
                        }}
                        state={row.status}
                        optionList={[
                          { name: "Pause", status: "stop" },
                          { name: "Enable", status: "restart" },
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
                  {/* {categoryStatusFlag.category_name == row.category_name &&
                    categoryStatusFlag.campaign_id == row.campaign_id && (
                      <div>
                        <StatusDropdown />
                      </div>
                    )} */}
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
                  updateCampaignId.keyword_name === row.keyword &&
                  updateCampaignId.match_type === row.match_type &&
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
                      {/* <div
                        style={{
                          backgroundColor: stateClassName,
                          color: textColor,
                          borderColor: borderColor,
                        }}
                        onClick={() => {
                          handleKeywordStatusFlag(
                            row.campaign_id,
                            !keywordStatusFlag.keyword_status,
                            row.keyword,
                            row.match_type,
                            row.cpm_bid,
                            row.campaign_type,
                            row.campaign_name
                          );
                        }}
                        className={`h-[19px] px-2 py-px rounded-2xl border  justify-start items-center gap-[5px] inline-flex `}
                      >
                        <img
                          className={`${
                            stateText !== "Active" ? "w-1" : "w-3 h-3"
                          }`}
                          src={statusImg}
                        />
                        <div className="justify-start items-center gap-[3px] flex">
                          <div className="font-medium ">{stateText}</div>
                        </div>
                        <div>
                          <img src={arrowImg} className="cursor-pointer" />
                        </div>
                      </div> */}
                      <StatusSelectDropdown
                        handleSuccess={handleStatus}
                        disabled={!hasPermission}
                        statusFlagObj={{
                          campaign_name: row.campaign_name,
                          campaign_id: row.campaign_id,
                          keyword_name: row.keyword,
                          match_type: row.match_type,
                          // history_data: {
                          //   previous_bid: parseFloat(row.cpm_bid),
                          // },
                          min_bid: row.min_bid,
                          campaign_type: row.campaign_type,
                          cpm_bid: row.cpm_bid,
                        }}
                        state={row.status}
                        optionList={[
                          { name: "Pause", status: "stop" },
                          { name: "Enable", status: "restart" },
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
                  {/* {keywordStatusFlag.keyword_name == row.keyword &&
                    keywordStatusFlag.campaign_id == row.campaign_id &&
                    keywordStatusFlag.match_type == row.match_type && (
                      <div>
                        <StatusDropdown />
                      </div>
                    )} */}
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
                      tabName === "campaign" && "text-[#11B07A] cursor-pointer"
                    }
                  >
                    {row.campaign_name}
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
                            style={{ marginRight: 30 }}
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
                      platform="blinkit"
                      permission={PERMISSIONS.CAMPAIGN_ACTIONS}
                    >
                      <div className="flex group-hover:visible invisible">
                        <PinMenu
                          handleDuplicate={false}
                          handlePin={() => {
                            if (!hasPermission) {
                              return;
                            }
                            handlePinClick({
                              pinStatus: true,
                              campaignId: row.campaign_id,
                            });
                          }}
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

          if (item.value === "category_name") {
            init = (
              <td
                className=""
                // onMouseEnter={() => handlePin(true, row.campaign_id)}
                // onMouseLeave={() => handlePin(false, row.campaign_id)}
              >
                <div className="flex">
                  <div
                    className={
                      tabName === "category" && "text-[#11B07A] cursor-pointer"
                    }
                  >
                    {row.category_name}
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
                      tabName === "keyword" && "text-[#11B07A] cursor-pointer"
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

          if (item.value === "campaign_budget") {
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
                    {row?.campaign_budget}
                  </div>
                ) : (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setUpdateCampaignId();
                          setEditBudgetId({
                            campaign_id: 0,
                            campaign_name: "",
                            campaign_type: "",
                          });
                        }
                      }}
                    >
                      {" "}
                      <input
                        type="number"
                        autoFocus="autoFocus"
                        className="border rounded w-[70%] h-8 mr-2 pl-2 outline-green-700"
                        value={editBudget}
                        placeholder={row?.campaign_budget}
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
                          });
                          setEditBudget("");
                        }}
                      />
                    </div>

                    {error !== false && <p className="text-red-500">{error}</p>}
                  </>
                )}
              </td>
            );
          }

          if (item.value === "cpm_bid" && tabName === "keyword") {
            init = (
              <td className="min-w-[180px] w-[150px]">
                {editKeywordId.campaign_id !== row.campaign_id ||
                editKeywordId.match_type !== row.match_type ||
                editKeywordId.keyword !== row.keyword ? (
                  <>
                    {row.status === "Stopped" ? (
                      <div className="border px-1 w-[70%] py-1 rounded">
                        {" "}
                        {row?.cpm_bid}
                      </div>
                    ) : (
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
                            row.match_type,
                            row.cpm_bid,
                            row.max_bid,
                            row.min_bid,
                            row.campaign_name
                          );
                        }}
                      >
                        {" "}
                        {row?.cpm_bid}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div
                      className="flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setEditKeywordId({
                            campaign_id: 0,
                            keyword: "",
                            match_type: "",
                            campaign_type: "",
                            campaign_name: "",
                            current_bid: "",
                            max_bid: "",
                            min_bid: "",
                          });
                        }
                      }}
                    >
                      {" "}
                      <input
                        type="number"
                        autoFocus="autoFocus"
                        className="border rounded w-[65%] h-8 mr-2 pl-2 outline-green-700"
                        value={keywordBid}
                        placeholder={row?.cpm_bid}
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
                        className="cursor-pointer w-[8%]"
                        onClick={() => {
                          setEditKeywordId({
                            campaign_id: 0,
                            keyword: "",
                            match_type: "",
                            campaign_type: "",
                            campaign_name: "",
                            current_bid: "",
                            max_bid: "",
                            min_bid: "",
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
                      {parseFloat(row.suggested_min_bid).toLocaleString(
                        currency_format
                      )}
                    </p>
                    <p className="mx-1">|</p>
                    <p>
                      {currency}
                      {parseFloat(row.suggested_max_bid).toLocaleString(
                        currency_format
                      )}
                    </p>
                  </div>
                )}
              </td>
            );
          }
          if (item.value === "cpm_bid" && tabName === "category") {
            init = (
              <>
                <td className="min-w-[150px] w-[150px]">
                  {editCategoryId.campaign_id !== row.campaign_id ||
                  editCategoryId.category_id !== row.category_id ? (
                    <>
                      {row.status === "Stopped" ? (
                        <div className="border px-1 rounded w-[70%] py-1">
                          {" "}
                          {row?.cpm_bid}
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer border px-1 rounded w-[70%] py-1"
                          onDoubleClick={() => {
                            if (!hasPermission) {
                              return;
                            }
                            categoryBidBlock(
                              row.campaign_id,
                              row.category_id,
                              row.category_name,
                              row.campaign_name,
                              row.campaign_type,
                              row.cpm_bid
                            );
                          }}
                        >
                          {" "}
                          {row?.cpm_bid}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div
                        className="flex"
                        onBlur={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget)) {
                            setEditCategoryId({
                              campaign_id: 0,
                              category_id: 0,
                              category_name: "",
                              campaign_type: "",
                              campaign_name: "",
                              current_bid: "",
                            });
                          }
                        }}
                      >
                        {" "}
                        <input
                          type="number"
                          autoFocus="autoFocus"
                          className="border rounded w-[70%] h-8 mr-2 pl-2 outline-green-700"
                          value={categoryBid}
                          placeholder={row?.cpm_bid}
                          onChange={(e) =>
                            handleNonNegativeInput(e, setCategoryBid)
                          }
                        />
                        <button onClick={() => handleCategoryBid()}>
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
                            setEditCategoryId({
                              campaign_id: "",
                              category_id: "",
                              campaign_name: "",
                              campaign_type: "",
                              category_name: "",
                              current_bid: "",
                            });
                            setCategoryBid("");
                            setBidError(false);
                          }}
                        />
                      </div>
                      {bidError !== false && (
                        <p className="text-red-500">{bidError}</p>
                      )}
                    </>
                  )}

                  {row.suggested_min_bid && row.suggested_max_bid && (
                    <div className="flex text-xs">
                      <p className="mr-1">Suggested Bid: </p>
                      <p className="">
                        {currency}
                        {parseFloat(row.suggested_min_bid).toLocaleString(
                          currency_format
                        )}
                      </p>
                      <p className="mx-1">|</p>
                      <p>
                        {currency}
                        {parseFloat(row.suggested_max_bid).toLocaleString(
                          currency_format
                        )}
                      </p>
                    </div>
                  )}
                </td>
              </>
            );
          }

          if (item.value === "end_date" && tabName === "campaign") {
            init = (
              <td
                className={`${
                  extendDate.campaign_id === row.campaign_id
                    ? "min-w-[280px]"
                    : "min-w-[200px]"
                } w-[150px]`}
              >
                {extendDate.campaign_id !== row.campaign_id ? (
                  <div
                    className="cursor-pointer border w-[70%] p-1 rounded"
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
                    {row?.end_date}
                  </div>
                ) : (
                  <>
                    <div className="flex">
                      <div className="flex items-center">
                        <div>
                          <input
                            className="mr-1 ml-2"
                            type="radio"
                            id="selectDate"
                            name="dateOption"
                            value="selectDate"
                            checked={dateOption === "selectDate"}
                            onChange={() => setDateOption("selectDate")}
                          />
                          <label
                            htmlFor="selectDate"
                            className="text-[14px] mr-1"
                          >
                            Select End Date
                          </label>
                        </div>
                        <div>
                          <input
                            className="mr-1 ml-2"
                            type="radio"
                            id="noDate"
                            name="dateOption"
                            value="noDate"
                            checked={dateOption === "noDate"}
                            onChange={() => setDateOption("noDate")}
                          />
                          <label htmlFor="noDate" className="text-[14px] mr-2">
                            No End Date
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <img
                          src="/assets/images/tickmark.svg"
                          className="cursor-pointer mr-1"
                          onClick={() => handleExtendDate()}
                        />
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

                    {dateOption === "selectDate" && (
                      <div className="flex items-center">
                        {/* <input
                        className="border pl-1"
                        type="date"
                        value={selectedDate}
                        min={getTodayDate()}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      /> */}
                        <DatePicker
                          className="border border-slate-400 mt-1 ml-2 outline-green-700"
                          selected={selectedDate}
                          minDate={new Date()}
                          placeholderText="Select date"
                          closeOnScroll={() => {
                            return true;
                          }}
                          onChange={(date) => setSelectedDate(date)}
                        />
                      </div>
                    )}
                  </>
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
      "campaign_budget",
    ];
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
                  row?.summaryCompData[0][item.value] &&
                  !row?.summaryCompData[0][item.value].includes("undefined") &&
                  row?.summaryCompData[0][item.value] !== "0%" &&
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
              : `campaignreport__table max-h-[640px] overflow-y-auto ${
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
                      className="h-16  accent-green-600"
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
                  if (item.showCol) {
                    return (
                      <>
                        {item.type === "single" ? (
                          <th style={thStyle(item.columnType, "blinkit")}>
                            <div
                              className={
                                (i == 5 && tabName == "category") ||
                                (i == 4 && tabName == "keyword")
                                  ? "tableHead px-4  w-56 "
                                  : "tableHead px-4 w-28"
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
                      key={i} // Adding a key prop is recommended when using map
                    >
                      {isCheckBoxRequired && (
                        <td className="min-w-max ">
                          <input
                            className="h-16 accent-green-600"
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

              {loading && bodyContent?.length === 0 && (
                <tr>
                  <div className="p-2 !border-b-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {" "}
                    <LoaderSpinner />
                  </div>
                </tr>
              )}
              {/* If no data found and not loading */}
              {!loading && bodyContent && bodyContent.length === 0 && (
                <tr>
                  <div className="p-2 !border-b-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {" "}
                    No Data Found
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
                              className="h-16  accent-green-600"
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

                {/* Render loader */}
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

            {bodyContent && bodyContent.length > 0 && (
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
                          <tr key={i} className="font-semibold ">
                            <td
                              className="sticky flex flex-col min-w-max z-30 pt-2 left-0 !border-none"
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
            )}
            {footer && (
              <tfoot className="sticky bottom-0 z-[999] ">
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
                  {`Are you sure you want to ${confirmPopup.status} this ${tabName}?`}
                </div>
              </div>
            </div>
            <div className="font-inter justify-end items-start gap-4 inline-flex">
              <div
                onClick={() => {
                  // setConfirm(false);
                  switch (tabName) {
                    case "category":
                      // setCategoryStatusFlag({
                      //   campaign_id: "",
                      //   category_status: false,
                      //   campaign_name: "",
                      //   category_name: "",
                      //   campaign_type: "",
                      // });
                      setConfirmPopup({
                        isOpen: false,
                      });

                      break;
                    case "keyword":
                      // setKeywordStatusFlag({
                      //   campaign_id: "",
                      //   keyword_status: false,
                      //   keyword: "",
                      //   history_data: "",
                      //   status: "",
                      // });
                      setConfirmPopup({
                        isOpen: false,
                      });
                  }

                  // setStatusVal("");
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
                  switch (tabName) {
                    case "category":
                      handleCategoryAction(
                        confirmPopup.status,
                        confirmPopup.statusFlag
                      );

                      break;
                    case "keyword":
                      handleKeywordAction(
                        confirmPopup.status,
                        confirmPopup.statusFlag
                      );
                  }
                  // setConfirm(false);
                  setConfirmPopup({
                    ...confirmPopup,
                    isOpen: false,
                  });
                }}
                className="justify-start items-center gap-2 flex cursor-pointer"
              >
                <div className="font-inter px-[15px] py-1 bg-[#11B07A] rounded-sm shadow border border-[#11B07A] justify-center items-center gap-2 flex">
                  <div className="font-inter text-center text-white text-sm  leading-snug">
                    Confirm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {confirmDailog?.isOpen && (
        <ConfirmationPopup
          handleSuccess={confirmDailog?.handleSuccess}
          handleCancel={confirmDailog.handleCancel}
        />
      )} */}

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
                  {`“${
                    tabName.charAt(0).toUpperCase() + tabName.slice(1)
                  }” bid is below the minimum. Proceeding will update the CPM bid to the minimum bid.`}
                </div>
              </div>
            </div>
            <div className="font-inter justify-end items-start gap-4 inline-flex">
              <div
                onClick={() => {
                  // switch (tabName) {
                  //   case "category":
                  // setCategoryStatusFlag({
                  //   campaign_id: "",
                  //   category_status: false,
                  //   campaign_name: "",
                  //   category_name: "",
                  //   campaign_type: "",
                  // });
                  //   break;
                  // case "keyword":
                  // setKeywordStatusFlag({
                  //   campaign_id: "",
                  //   keyword_status: false,
                  //   keyword: "",
                  //   history_data: "",
                  //   status: "",
                  // });
                  // break;
                  // }
                  setConfirmBid(false);
                  // setStatusVal("");
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
                  switch (tabName) {
                    case "category":
                      handleCategoryStatus(true);
                      break;
                    case "keyword":
                      handleKeywordStatus(true);
                      break;
                  }
                  setConfirmBid(false);
                }}
                className="justify-start items-center gap-2 flex cursor-pointer"
              >
                <div className="font-inter px-[15px] py-1 bg-[#11B07A] rounded-sm shadow border border-[#11B07A] justify-center items-center gap-2 flex">
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
          platform="blinkit"
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
          platform="blinkit"
          tagData={tagData}
          schedulerPosition={schedulerPosition}
          selectedTagIds={selectedTagIds}
          handleTagCheckboxChange={handleTagCheckboxChange}
          setSelectedTagIds={setSelectedTagIds}
          handleAddButtonClick={handleAddButtonClick}
        />
      )}
      {accountModalState?.campaign_id && (
        <AccountModal
          isOpen={accountModalState.campaign_id}
          options={accounts}
          // onDone={handleDone}
          schedulerPosition={schedulerPosition}
          // onCancel={() =>
          //   setAccountModalState({
          //     campaign_name: false,
          //     selectedOption: null,
          //     optionSelected: false,
          //   })
          // }
          onOutsideClick={() => {
            // if (!accountModalState.optionSelected) {
            setAccountModalState((prevState) => ({
              ...prevState,
              campaign_id: false,
              selectedOption: null,
            }));
            // }
          }}
          selectedOption={accountModalState.selectedOption}
          setSelectedOption={handleDone}
          platform="blinkit"
        />
      )}
    </>
  );
};

export default BlinkItSearchTable;
