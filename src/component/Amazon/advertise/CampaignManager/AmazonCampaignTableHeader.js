/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
// import CreateCampaignPopup from "../../../flipkart/Advertising/Campaign/CreateCampignPopup";
import Tag from "../../../common-components/tag/Tag";
import { Headerbtn } from "../../../common-components/headerButton/headerButton";
import { AiOutlineEdit } from "react-icons/ai";
import { setLoading } from "../../../../redux/action-creator/commonAction";
import DialogBox from "../../../common-components/dialogBox.js";
import { useDispatch, useSelector } from "react-redux";
import CreateRulePopup from "../../rules/CreateRulePopup";
import ActionType from "../../../../redux/types";
import AmsCreateCampaignPopup from "./AmsCreateCampaignPopup";
import { EditPopup } from "./AmazonRpaAction/editPopup";
import { AdGroupRpa } from "./AmazonRpaAction/adGroupRpa";
import { TargetingRpa } from "./AmazonRpaAction/targetingRpa";
import { duplicateAMSCampaign } from "../../../../redux/action-creator/amazon/campaignAction";
import AmsBulkCreateCampaignPopup from "./AmsBulkCreateCampaignPopup";
import AmsBulkCreateAdgroupPopup from "./AmsBulkCreateAdgroupPopup";
import AmazonMainHeader from "./Headers/AmazonMainHeader.js";
import AmazonActionHeader from "./Headers/AmazonActionHeader.js";
import AmazonAdgroupHeader from "./Headers/AmazonAdgroupHeader.js";
import AmazonAdgroupMainHeader from "./Headers/AmazonAdgroupMainHeader.js";
import AmazonPortfolioActionHeader from "./AmazonPortfolioActionHeader.js";
import AmazonPortfolioMainHeader from "./AmazonPortfolioMainHeader";
import AmazonKeywordActionHeader from "./Headers/AmazonKeywordActionHeader.js";
import AmazonKeywordMainHeader from "./Headers/AmazonKeywordMainHeader.js";
import AsinActionHeader from "./Headers/AsinActionHeader.js";
import AsinMainHeader from "./Headers/AsinMainHeader.js";
import Toast from "../../../common-components/toast/index.js";
import PlacementActionHeader from "./Headers/PlacementActionHeader.js";
import WhenPermitted from "../../../common-components/WhenPermitted.js";
import { PERMISSIONS } from "../../../../utils/constants.js";

const AmazonCampaigntableHeader = ({
  onEditButtonClick,
  tableData,
  tabName,
  showDropDown,
  setShowDropDown,
  changeTagsData,
  selectedAccount,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showBulkPopup, setShowBulkPopup] = useState(false);
  const [showBulkAdgroupPopup, setShowBulkAdgroupPopup] = useState(false);

  // const [editValue, setEditValue] = useState(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [actionName, setActionName] = useState("");
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [keywordErrorPopup, setKeywordErrorPopup] = useState(false);
  const editDropRef = useRef(null);
  const conatinerRef = useRef(null);
  // const [showDropDown, setShowDropDown] = useState(false);
  const { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);

  const [campaignHeader, setCampaignHeader] = useState(false);
  const [portfolioHeader, setPortfolioHeader] = useState(false);
  const [adgroupHeader, setAdgroupHeader] = useState(false);
  const [keywordHeader, setKeywordHeader] = useState(false);
  const [asinHeader, setAsinHeader] = useState(false);
  const [placementHeader, setPlacementHeader] = useState(false);

  const isEditButtonDisabled =
    onEditButtonClick === "placement"
      ? tableData.length === 0 || tableData[0].min_bid === undefined
      : tableData.length === 0;
  const isBulkAdgroupDisabled =
    selectedCheckBox &&
    selectedCheckBox?.campaign?.length == 1 &&
    (selectedCheckBox?.campaign[0]?.state == "ARCHIVED" ||
      selectedCheckBox?.campaign[0]?.state == "archived")
      ? true
      : false;

  // const handleEditButtonClick = (e) => {
  //   // console.log(e, "handleCLick");
  //   // op?.current?.toggle(e);
  //   // setEditValue(onEditButtonClick);
  // };

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

  // useEffect(() => {
  //   setDisableDrop(isEditButtonDisabled);
  // }, [isEditButtonDisabled]);

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
        // case "campaign":
        //   return <CampaignRpa op={showDropDown} editRef={conatinerRef} />;
        case "adgroup":
          return <AdGroupRpa op={showDropDown} editRef={conatinerRef} />;
        // case "fsn":
        //   return <FsnEdit op={showDropDown} editRef={conatinerRef} />;
        // case "placement":
        //   return <PlacementEdit op={showDropDown} editRef={conatinerRef} />;
        // case "creative":
        //   return <CreativeEdit op={showDropDown} editRef={conatinerRef} />;

        case "keyword":
          return <TargetingRpa op={showDropDown} editRef={conatinerRef} />;
      }
    }
    return null; // Return null when tableData length is 0 or editValue is not set
  };
  const dispatch = useDispatch();
  const duplicateAMSCampaignApi = async (data) => {
    try {
      setLoading(true);
      dispatch(duplicateAMSCampaign(data));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDialogApply = () => {
    // console.log(tableData, 'table data');
    if (tableData.length > 0) {
      const data = {
        ids: tableData.map((item) => item.campaign_id),
      };
      duplicateAMSCampaignApi(data);
      // window.alert("Duplicate
      // window.alert("Duplicate successfull");successfull");
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

  useEffect(() => {
    if (tabName === "campaign" && selectedCheckBox?.campaign?.length > 0) {
      setCampaignHeader(true);
    } else {
      setCampaignHeader(false);
    }
    if (tabName === "portfolio" && selectedCheckBox?.portfolio?.length > 0) {
      setPortfolioHeader(true);
    } else {
      setPortfolioHeader(false);
    }
    if (tabName === "adgroup" && selectedCheckBox?.adgroup?.length > 0) {
      setAdgroupHeader(true);
    } else {
      setAdgroupHeader(false);
    }

    if (tabName === "keyword" && selectedCheckBox?.keyword?.length > 0) {
      setKeywordHeader(true);
    } else {
      setKeywordHeader(false);
    }

    if (tabName === "asin" && selectedCheckBox?.asin?.length > 0) {
      setAsinHeader(true);
    } else {
      setAsinHeader(false);
    }
    if (tabName === "placement" && selectedCheckBox?.placement?.length > 0) {
      setPlacementHeader(true);
    } else {
      setPlacementHeader(false);
    }
  }, [tabName, selectedCheckBox]);

  // console.log(tabName, "<< Tab Name");
  const campaignSelection = (data) => {
    setCampaignHeader(data);
    setAdgroupHeader(data);
    setKeywordHeader(data);
    setAsinHeader(data);
    setPlacementHeader(data);

    const payload = {
      campaign: tabName === "campaign" ? [] : selectedCheckBox.campaign || [],
      keyword: tabName === "keyword" ? [] : selectedCheckBox.keyword || [],
      adgroup: tabName === "adgroup" ? [] : selectedCheckBox.adgroup || [],
      asin: tabName === "asin" ? [] : selectedCheckBox.asin || [],
      category: tabName === "category" ? [] : selectedCheckBox.category || [],
      placement:
        tabName === "placement" ? [] : selectedCheckBox.placement || [],
    };

    dispatch({
      type: ActionType.CHECKBOX,
      payload,
    });
  };
  return (
    <>
      <div>
        <Toast />
        {tabName === "portfolio" &&
          (portfolioHeader ? (
            <>
            <WhenPermitted platform="amazon" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
              {" "}
              <AmazonPortfolioActionHeader
                campaignCount={selectedCheckBox?.portfolio?.length}
                campaignSelection={campaignSelection}
                changeTagsData={changeTagsData}
                selectedCheckBox={selectedCheckBox}
                tabName={tabName}
              />{" "}
              </WhenPermitted>
            </>
          ) : (
            <>
              <AmazonPortfolioMainHeader changeTagsData={changeTagsData} selectedAccount={selectedAccount}/>
            </>
          ))}
        {tabName === "campaign" &&
          (campaignHeader ? (
            <>
            <WhenPermitted platform="amazon" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
              {" "}
              <AmazonActionHeader
                campaignCount={selectedCheckBox?.campaign?.length}
                campaignSelection={campaignSelection}
                changeTagsData={changeTagsData}
                selectedCheckBox={selectedCheckBox}
                selectedAccount={selectedAccount}
                tabName={tabName}
              />{" "}
              </WhenPermitted>
            </>
          ) : (
            <>
              <AmazonMainHeader
                changeTagsData={changeTagsData}
                selectedAccount={selectedAccount}
              />
            </>
          ))}

        {tabName === "adgroup" && (
          <>
            {adgroupHeader ? (
              <>
              <WhenPermitted platform="amazon" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
                {" "}
                <AmazonAdgroupHeader
                  adgroupCount={selectedCheckBox?.adgroup?.length}
                  campaignSelection={campaignSelection}
                  selectedCheckBox={selectedCheckBox}
                  changeTagsData={changeTagsData}
                  tabName={tabName}
                />
                </WhenPermitted>
              </>
            ) : (
              <>
                <AmazonAdgroupMainHeader changeTagsData={changeTagsData} />
              </>
            )}
          </>
        )}
        {tabName === "keyword" && (
          <>
            {keywordHeader ? (
              <>
              <WhenPermitted platform="amazon" permission={PERMISSIONS.CAMPAIGN_ACTIONS}>
                <AmazonKeywordActionHeader
                  keywordCount={selectedCheckBox?.keyword?.length}
                  campaignSelection={campaignSelection}
                  tabName={tabName}
                  // selectedCheckBox={selectedCheckBox}
                />
                </WhenPermitted>
              </>
            ) : (
              <>
                <AmazonKeywordMainHeader />
              </>
            )}
          </>
        )}

        {tabName === "asin" && (
          <>
            {asinHeader ? (
              <>
                <AsinActionHeader
                  campaignSelection={campaignSelection}
                  tabName={tabName}
                />
              </>
            ) : (
              <>
                <AsinMainHeader />
              </>
            )}
          </>
        )}
        {tabName === "placement" && (
          <>
            {placementHeader ? (
              <>
                <PlacementActionHeader
                  campaignSelection={campaignSelection}
                  tabName={tabName}
                />
              </>
            ) : (
              <>
                <AsinMainHeader />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AmazonCampaigntableHeader;
