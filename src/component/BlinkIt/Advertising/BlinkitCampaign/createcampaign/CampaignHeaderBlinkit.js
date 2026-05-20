/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Headerbtn } from "../../../../common-components/headerButton/headerButton";
import { AdGroupEdit } from "../../../../common-components/editButtonOptions/adGroupEdit";
import { FsnEdit } from "../../../../common-components/editButtonOptions/fsnEdit";
import { CreativeEdit } from "../../../../common-components/editButtonOptions/creativeEdit";
import { PlacementEdit } from "../../../../common-components/editButtonOptions/placementEdit";
import { useSelector } from "react-redux";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../../../redux/action-creator/commonAction";
import { _POST } from "../../../../../services/axios.method";
import DialogBox from "../../../../common-components/dialogBox.js";
import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
import {
  APPLICATION_ROUTES,
  PERMISSIONS,
  RPA_ACTION_EDIT,
} from "../../../../../utils/constants";
import EditModal from "./editmodal";
import ActionType from "../../../../../redux/types";
import { KeywordEditModal } from "./editmodal/KeywordEditModal";
import { useHistory } from "react-router-dom";
import BlinkitCampaignHeader from "../tabHeaders/BlinkitCampaignHeader.js";
import BlinkitMainHeader from "../tabHeaders/BlinkitMainHeader.js";
import BlinkitCategoryHeader from "../tabHeaders/BlinkitCategoryHeader.js";
import BlinkitKeywordHeader from "../tabHeaders/BlinkitKeywordHeader.js";
import WhenPermitted from "../../../../common-components/WhenPermitted.js";

const CampaigntableHeaderBlinkit = ({
  onEditButtonClick,
  tableData,
  tabName,
  showDropDown,
  setShowDropDown,
  changeTagsData,
}) => {
  // const [editValue, setEditValue] = useState(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [actionName, setActionName] = useState("");
  const [keywordErrorPopup, setKeywordErrorPopup] = useState(false);
  const [campaignHeader, setCampaignHeader] = useState(false);
  const [categoryHeader, setCategoryHeader] = useState(false);
  const [keywordHeader, setKeywordHeader] = useState(false);
  const [showBulkPopup, setShowBulkPopup] = useState(false);
  const { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);

  const editDropRef = useRef(null);
  const conatinerRef = useRef(null);
  // const [showDropDown, setShowDropDown] = useState(false);
  const isEditButtonDisabled = tableData.length === 0;

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
  useEffect(() => {}, [onEditButtonClick]);
  // eslint-disable-next-line no-unused-vars
  const [ShowTab, setShowTab] = useState("");

  const renderEditComponent = () => {
    if (tableData.length > 0) {
      switch (onEditButtonClick) {
        case "campaign":
          return <EditModal op={showDropDown} editRef={conatinerRef} />;
        case "adgroup":
          return <AdGroupEdit op={showDropDown} editRef={conatinerRef} />;
        case "fsn":
          return <FsnEdit op={showDropDown} editRef={conatinerRef} />;
        case "placement":
          return <PlacementEdit op={showDropDown} editRef={conatinerRef} />;
        case "creative":
          return <CreativeEdit op={showDropDown} editRef={conatinerRef} />;
        case "keyword":
          return <KeywordEditModal op={showDropDown} editRef={conatinerRef} />;
      }
    }
    return null; // Return null when tableData length is 0 or editValue is not set
  };
  const dispatch = useDispatch();
  const duplicateCampaignApi = async () => {
    try {
      const data = tableData.map((data) => ({
        campaign_name: data.campaign_name,
        campaign_id: "123",
        action_status: 1,
        action_type: "clone",
      }));
      setLoading(true);

      const res = await _POST(RPA_ACTION_EDIT, data);
      dispatch({
        type: ActionType.CHECKBOX,
        payload: [],
      });
      setLoading(false);
      if (res?.status === 200) {
        dispatch(setToastMessageHandler("Action performed successfully", true));
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const handleDuplicateButton = () => {
    setActionName("Are you sure you want to duplicate this campaign?");

    setShowDuplicateDialog(true);
  };

  const handleDialogApply = () => {
    duplicateCampaignApi();
    setShowDuplicateDialog(false);
  };
  const handleDialogCancel = () => {
    setShowDuplicateDialog(false);
  };
  const history = useHistory();

  // return (
  //   <>
  //     <div className="row">
  //       {/* <Link to={APPLICATION_ROUTES.BLINKITCREATENEWCAMPAIGN}> */}
  //       <Headerbtn
  //         imgsrc="/assets/images/plus1.svg"
  //         title="Create"
  //         active={true}
  //         onClick={() =>
  //           history.push(APPLICATION_ROUTES.BLINKITCREATENEWCAMPAIGN)
  //         }
  //       />
  //       {/* </Link> */}
  //       {tabName !== "category" && (
  //         <Headerbtn
  //           id={isEditButtonDisabled ? "disabled" : ""}
  //           imgsrc={
  //             ShowTab === "edit"
  //               ? "/assets/images/edit.svg"
  //               : "/assets/images/editblinkit.svg"
  //           }
  //           title="Edit"
  //           // onClick={() => setShowPopup(!showPopup)}

  //           onClick={() => {
  //             // handleEditButtonClick(e);
  //             setShowDropDown(!showDropDown);
  //           }}
  //           disabled={tableData.length === 0}
  //           editRef={editDropRef}
  //         />
  //       )}

  //       {/* {tabName === "keyword" && (
  //         <Headerbtn
  //           id={isEditButtonDisabled ? "disabled" : ""}
  //           imgsrc={
  //             ShowTab === "edit"
  //               ? "/assets/images/edit.svg"
  //               : "/assets/images/editblinkit.svg"
  //           }
  //           title="Edit"
  //           // onClick={() => setShowPopup(!showPopup)}

  //           onClick={(e) => {
  //             setKeywordPopup(!keywordPopup);
  //           }}
  //           disabled={tableData.length === 0}
  //           // editRef={editDropRef}
  //         />
  //       )} */}

  //       {tabName == "camapign" && (
  //         <Headerbtn
  //           imgsrc="/assets/images/duplicate.svg"
  //           title="Duplicate"
  //           disabled={tableData.length === 0}
  //           onClick={(e) => handleDuplicateButton(e)}
  //         />
  //       )}
  //       {tabName === "campaign" && (
  //         <Tag changeTagsData={changeTagsData} platform="blinkit" data_level={'campaign'}/>
  //       )}
  //     </div>
  //     {renderEditComponent()}

  //     {/* {showPopup && (
  //       <>
  //         {tabName === "campaign" && (
  //           <EditModal
  //             setShowPopup={setShowPopup}
  //             showPopup={showPopup}
  //             checkBox={tableData}
  //             platform={"blinkit"}
  //           />
  //         )}
  //         {tabName === "fsn" && <LocationModal setShowPopup={setShowPopup} />}
  //         {tabName === "keyword" && (
  //           <KeywordModal setShowPopup={setShowPopup} />
  //         )}
  //         {tabName === "adgroup" && (
  //           <CategoryModal setShowPopup={setShowPopup} />
  //         )}
  //         {tabName === "placement" && (
  //           <ProductModal setShowPopup={setShowPopup} />
  //         )}

  //       </>
  //     )} */}
  //     {showDuplicateDialog && (
  //       <DialogBox
  //         title="Confirmation"
  //         buttonName="Accept"
  //         onAccept={handleDialogApply}
  //         onCancel={handleDialogCancel}
  //       >
  //         {actionName}
  //       </DialogBox>
  //     )}

  //     {/* {keywordPopup && <KeywordModalForm setKeywordPopup={setKeywordPopup } />} */}
  //     {keywordErrorPopup && (
  //       <DialogBox
  //         buttonName="OK"
  //         title="Error"
  //         onAccept={() => setKeywordErrorPopup(false)}
  //       >
  //         Select atleast one campaign from Campaign tab
  //       </DialogBox>
  //     )}
  //   </>
  // );
  useEffect(() => {
    if (tabName === "campaign" && selectedCheckBox?.campaign?.length > 0) {
      setCampaignHeader(true);
    } else {
      setCampaignHeader(false);
    }
    if (tabName === "category" && selectedCheckBox?.category?.length > 0) {
      setCategoryHeader(true);
    } else {
      setCategoryHeader(false);
    }
    if (tabName === "keyword" && selectedCheckBox?.keyword?.length > 0) {
      setKeywordHeader(true);
    } else {
      setKeywordHeader(false);
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
    // setAdgroupHeader(data);

    const payload = {
      campaign: tabName === "campaign" ? [] : selectedCheckBox.campaign || [],
      keyword: tabName === "keyword" ? [] : selectedCheckBox.keyword || [],
      category: tabName === "category" ? [] : selectedCheckBox.category || [],
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
          <WhenPermitted permission={PERMISSIONS.CAMPAIGN_ACTIONS} platform="blinkit">
            <BlinkitCampaignHeader
              campaignCount={selectedCheckBox?.campaign?.length}
              campaignSelection={campaignSelection}
              changeTagsData={changeTagsData}
              selectedCheckBox={selectedCheckBox}
              setShowBulkPopup={setShowBulkPopup}
            />
            </WhenPermitted>
          </>
        ) : (
          <BlinkitMainHeader changeTagsData={changeTagsData} />
        ))}
      {tabName === "category" &&
        (categoryHeader ? (
          <>
          <WhenPermitted permission={PERMISSIONS.CAMPAIGN_ACTIONS} platform="blinkit">
            <BlinkitCategoryHeader
              campaignCount={selectedCheckBox?.category?.length}
              campaignSelection={campaignSelection}
              selectedCheckBox={selectedCheckBox}
              tabName={tabName}
              setShowBulkPopup={setShowBulkPopup}
            />
            </WhenPermitted>
          </>
        ) : (
          <BlinkitMainHeader changeTagsData={changeTagsData} />
        ))}
      {tabName === "keyword" &&
        (keywordHeader ? (
          <>
           <WhenPermitted permission={PERMISSIONS.CAMPAIGN_ACTIONS} platform="blinkit">
            <BlinkitKeywordHeader
              campaignCount={selectedCheckBox?.keyword?.length}
              campaignSelection={campaignSelection}
              selectedCheckBox={selectedCheckBox}
              tabName={tabName}
              setShowBulkPopup={setShowBulkPopup}
            />
           </WhenPermitted> 
          </>
        ) : (
          <BlinkitMainHeader changeTagsData={changeTagsData} />
        ))}
      {showBulkPopup && (
        <DialogBox
          title="ALERT"
          buttonName="OK"
          platform="blinkit"
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

export default CampaigntableHeaderBlinkit;
