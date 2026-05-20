/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import Tag from "../../../../common-components/tag/Tag";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import { AdGroupEdit } from "../../../../common-components/editButtonOptions/adGroupEdit";
import { FsnEdit } from "../../../../common-components/editButtonOptions/fsnEdit";
import { CreativeEdit } from "../../../../common-components/editButtonOptions/creativeEdit";
import { PlacementEdit } from "../../../../common-components/editButtonOptions/placementEdit";
import AddKeywords from "./editmodal/KeywordModalForm";

import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../redux/action-creator/commonAction";
import { _POST } from "../../../../../services/axios.method";
import DialogBox from "../../../../common-components/dialogBox.js/index.js";
import { useDispatch } from "react-redux";
// import { AddKeywords } from "../../../../common-components/editButtonOptions/editPopups/addKeywords";
import { useSelector } from "react-redux";
import {
  APPLICATION_ROUTES,
  PERMISSIONS,
  RPA_ACTION_EDIT,
} from "../../../../../utils/constants";
import EditModal from "./editmodal";
import ActionType from "../../../../../redux/types";
import { KeywordEditModal } from "./editmodal/KeywordEditModal";
import { useHistory } from "react-router-dom";
import CampaignActionHeader from "./editmodal/tabHeaders/CampaignActionHeader.js";
import CampaignHeader from "./editmodal/tabHeaders/CampaignHeader.js";
import KeywordActionHeader from "./editmodal/tabHeaders/KeywordActionHeader.js";
import KeywordHeader from "./editmodal/tabHeaders/KeywordHeader.js";
import CategoryActionHeader from "./editmodal/tabHeaders/CategoryActionHeader.js";
import ProductHeader from "./editmodal/tabHeaders/CategoryHeader.js";
import ProductActionHeader from "./editmodal/tabHeaders/ProductActionHeader.js";
import WhenPermitted from "../../../../common-components/WhenPermitted.js";
const CampaigntableHeaderZepto = ({
  onEditButtonClick,
  tableData,
  tabName,
  showDropDown,
  setShowDropDown,
  changeTagsData,
  account,
}) => {
  // const [editValue, setEditValue] = useState(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [actionName, setActionName] = useState("");
  const [keywordPopup, setKeywordPopup] = useState(false);
  const [keywordErrorPopup, setKeywordErrorPopup] = useState(false);
  const editDropRef = useRef(null);
  const conatinerRef = useRef(null);
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  // const [showDropDown, setShowDropDown] = useState(false);
  const isEditButtonDisabled = tableData.length === 0;
  const [campaignHeader, setCampaignHeader] = useState(false);
  const [keywordHeader, setKeywordHeader] = useState(false);
  const [categoryHeader, setCategoryHeader] = useState(false);
  const [productHeader, setProductHeader] = useState(false);
  const [showBulkPopup, setShowBulkPopup] = useState(false);

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
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  // eslint-disable-next-line no-unused-vars

  const dispatch = useDispatch();
  // const duplicateCampaignApi = async () => {
  //   try {
  //     const data = tableData.map((data) => ({
  //       campaign_name: data.campaign_name,
  //       campaign_id: "123",
  //       action_status: 1,
  //       action_type: "clone",
  //     }));
  //     setLoading(true);

  //     const res = await _POST(RPA_ACTION_EDIT, data);
  //     dispatch({
  //       type: ActionType.CHECKBOX,
  //       payload: [],
  //     });
  //     setLoading(false);
  //     if (res?.status === 200) {
  //       dispatch(setToastMessageHandler("Action performed successfully", true));
  //     } else {
  //       dispatch(setToastMessageHandler("Failed to perform action", false));
  //     }
  //   } catch (error) {
  //     dispatch(setToastMessageHandler("Something went wrong!", false));
  //   }
  // };

  // const handleDuplicateButton = () => {
  //   setActionName("Are you sure you want to duplicate this campaign?");

  //   setShowDuplicateDialog(true);
  // };

  // const handleDialogApply = () => {
  //   duplicateCampaignApi();
  //   setShowDuplicateDialog(false);
  // };
  // const handleDialogCancel = () => {
  //   setShowDuplicateDialog(false);
  // };

  const handleAddKeyword = () => {
    if (
      selectedCheckBox?.campaign?.length === 0 ||
      selectedCheckBox?.campaign?.length === undefined
    ) {
      setKeywordErrorPopup(true);
    } else {
      setKeywordPopup(true);
    }
  };
  const history = useHistory();

  useEffect(() => {
    switch (tabName) {
      case "campaign":
        setCampaignHeader(selectedCheckBox?.campaign?.length > 0);
        break;
      case "keyword":
        setKeywordHeader(selectedCheckBox?.keyword?.length > 0);
        break;
      case "category":
        setCategoryHeader(selectedCheckBox?.category?.length > 0);
        break;
      case "product":
        setProductHeader(selectedCheckBox?.product?.length > 0);
        break;
      default:
        setCampaignHeader(selectedCheckBox?.campaign?.length > 0);
        break;
    }
  }, [tabName, selectedCheckBox]);
  const campaignSelection = (data) => {
    // dispatch({
    //   type: ActionType.CHECKBOX,
    //   payload: [],
    // });
    setCampaignHeader(data);
    setKeywordHeader(data);
    setCategoryHeader(data);
    setProductHeader(data);

    // setAdgroupHeader(data);

    const payload = {
      keyword: tabName === "keyword" ? [] : selectedCheckBox?.keyword || [],
      campaign: tabName === "campaign" ? [] : selectedCheckBox?.campaign || [],
      category: tabName === "category" ? [] : selectedCheckBox?.category || [],
      product: tabName === "product" ? [] : selectedCheckBox?.product || [],
    };

    dispatch({
      type: ActionType.CHECKBOX,
      payload,
    });
  };
  return (
    <>
      {tabName === "campaign" &&
        (campaignHeader ? (
          <>
           <WhenPermitted platform="zepto" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
            <CampaignActionHeader
              campaignSelection={campaignSelection}
              changeTagsData={changeTagsData}
              account={account}
              setShowBulkPopup={setShowBulkPopup}
            />
            </WhenPermitted>
          </>
        ) : (
          <CampaignHeader changeTagsData={changeTagsData} account={account} />
        ))}
      {tabName === "keyword" &&
        (keywordHeader ? (
          <>
          <WhenPermitted platform="zepto" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
            <KeywordActionHeader
              campaignSelection={campaignSelection}
              setShowBulkPopup={setShowBulkPopup}
            />
           </WhenPermitted> 
          </>
        ) : (
          <KeywordHeader />
        ))}
      {tabName === "category" &&
        (categoryHeader ? (
          <>
           <WhenPermitted platform="zepto" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
            <CategoryActionHeader
              campaignSelection={campaignSelection}
              setShowBulkPopup={setShowBulkPopup}
            />
           </WhenPermitted> 
          </>
        ) : (
          <CampaignHeader />
        ))}{" "}
      {tabName === "product" &&
        (productHeader ? (
          <>
            <WhenPermitted platform="zepto" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
            <ProductActionHeader
              campaignSelection={campaignSelection}
              setShowBulkPopup={setShowBulkPopup}
            />
            </WhenPermitted>
          </>
        ) : (
          <CampaignHeader />
          // <ProductHeader />
        ))}
      {showBulkPopup && (
        <DialogBox
          title="ALERT"
          buttonName="OK"
          platform="zepto"
          onAccept={() => {
            setShowBulkPopup(false);
          }}
        >
          {`Can't Perform Bulk Action on more than 50 ${tabName}`}
        </DialogBox>
      )}
    </>
  );
};

export default CampaigntableHeaderZepto;
