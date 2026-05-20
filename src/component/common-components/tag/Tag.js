/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { CompactPicker } from "react-color";
import { _GET, _PATCH, _POST } from "../../../services/axios.method";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  BLINKIT_TAGS,
  BLINKIT_ATTACH_MULTI_CAMP_TAG,
  AMAZON_ADGROUP_BULK_TAG,
  GET_ALL_TAGS,
} from "../../../utils/constants";
import { Headerbtn } from "../headerButton/headerButton";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import DialogBox from "../dialogBox.js";
import { useDispatch, useSelector } from "react-redux";
import ActionType from "../../../redux/types";

const Tag = ({ changeTagsData, platform, data_level, account }) => {
  let tagsApi = BLINKIT_TAGS;
  // const Tag = ({ changeTagsData }) => {
  // holds the state to make the modal visible
  const [visible, setVisible] = useState(false);
  // state to hold the position of the dialog box
  const [position, setPosition] = useState("center");
  // state to hold tag color
  const [tagColor, setTagColor] = useState("#fff");
  // flag for edit tag
  const [editTag, setEditTag] = useState(true);
  // state to hold the selected color
  const [selectedColor, setSelectedColor] = useState();

  // state to hold the list of all ths tags
  const [tagsList, setTagsList] = useState([]);
  // state to hold the newly created tag
  // eslint-disable-next-line no-unused-vars
  const [createNewTag, setCreateNewTag] = useState("");
  // state to hold the tag name
  const [tagName, setTagName] = useState("");
  // state to hold tag id
  const [tagId, setTagId] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [dialogTitle, setDialogTitle] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [dialogMessage, setDialogMessage] = useState("");
  const { tagData } = useSelector((state) => state?.TagReducer);
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);

  const [selectedTag, setSelectedTag] = useState([]);

  const dispatch = useDispatch();
  const [openTag, setOpenTag] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [error, setError] = useState("");
  const [compareTag, setCompareTag] = useState();
  const dropDownRef = useRef(null);

  // TAG APIs
  const fetchAllTagsApi = async () => {
    try {
      setLoading(true);
      // const response = await _GET(
      //   `${tagsApi}?platform=${platform}&data_level=${data_level}`
      // );
      const data = await _GET(
        `${GET_ALL_TAGS}?platform=${platform}&entity=${data_level}&account=${account}`
      );
      setLoading(false);
      setTagsList(data?.data?.data?.result);
      dispatch({
        type: ActionType.TAG,
        payload: data?.data?.data?.result,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTagByIdApi = async (id) => {
    try {
      setLoading(true);
      const response = await _GET(`${tagsApi}/${id}`);
      setLoading(false);
      setTagName(response?.data?.data?.result?.tag_name);
    } catch (error) {
      console.error(error);
    }
  };

  const createTagApi = async (data) => {
    try {
      setLoading(true);
      data.platform = platform;
      const response = await _POST(tagsApi, data);
      setLoading(false);
      // if status code is 400 show an alert box
      if (response?.data?.status?.code == 400) {
        const errorMessage = JSON.stringify(response?.data?.error?.message);
        dispatch(setToastMessageHandler(errorMessage, false));
      } else {
        let updatedTag = [];
        let responseData = response?.data?.data?.result;
        setCreateNewTag(response);
        setSelectedColor("#fff");
        fetchAllTagsApi();
        updatedTag = [...tagData, responseData];

        dispatch({
          type: ActionType.TAG,
          payload: updatedTag,
        });
        const successMessage = JSON.stringify(response?.data?.status?.message);
        dispatch(setToastMessageHandler(successMessage, true));
        setVisible(false);
      }
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const deleteTagApi = async (id) => {
    try {
      setLoading(true);
      let platform_name;
      if (platform === "flipkart") {
        platform_name = "flipkart_supermart";
      } else {
        platform_name = platform;
      }
      const data = { platform: platform_name };
      const response = await _PATCH(
        `${tagsApi}/delete/${id}?&data_level=${data_level}`,
        data
      );

      setLoading(false);
      let updatedTag = [];
      if (response?.data?.status?.code == 200) {
        const successMessage = JSON.stringify(response?.data?.status?.message);
        dispatch(setToastMessageHandler(successMessage, true));
      } else {
        dispatch(setToastMessageHandler("Unable to delete tag", false));
      }
      setTagId("");

      updatedTag = tagData.filter((tag) => tag?._id !== id);
      dispatch({
        type: ActionType.TAG,
        payload: updatedTag,
      });

      changeTagsData(false, id);
      fetchAllTagsApi();
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  const updateTagApi = async (data) => {
    try {
      setLoading(true);
      const response = await _PATCH(`${tagsApi}/${data.id}`, data);

      setLoading(false);
      if (response?.data?.status?.code == 400) {
        const errorMessage = JSON.stringify(response?.data?.error?.message);
        dispatch(setToastMessageHandler(errorMessage, false));
      } else {
        // setTagId("");
        setVisible(false);
        setTagName("");
        setSelectedColor("#fff");
        // setVisible(false);
        setEditTag(true);

        // const updatedTagData = tagData.map((tag) =>
        //   tag._id === responseData._id ? responseData : tag
        // );
        // console.log(updatedTagData, "<<<<< updated tag data");
        // dispatch({
        //   type: ActionType.TAG,
        //   payload: updatedTagData,
        // });

        fetchAllTagsApi();

        const successMessage = JSON.stringify(response?.data?.status?.message);
        dispatch(setToastMessageHandler(successMessage, true));
      }
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };
  useEffect(() => {
    fetchAllTagsApi();
  }, [account]);

  const handleAddTags = async () => {
    try {
      let campaign_id;
      let adgroupData = [];
      if (data_level === "campaign") {
        campaign_id = selectedCheckBox?.campaign.map(
          (item) => item.campaign_id
        );
      } else if (data_level === "adgroup") {
        adgroupData = selectedCheckBox?.adgroup.map((data) => {
          return {
            campaign_id: data?.campaign_id,
            adgroup_name: data?.ad_group_name,
            tag_id: selectedTag,
            adgroup_id: data?.ad_group_id,
          };
        });
      }

      let platformName;

      switch (platform) {
        case "blinkit":
          platformName = "blinkit";
          break;
        case "amazon":
          platformName = "amazon";
          break;
        case "zepto":
          platformName = "zepto";
          break;
        case "instamart":
          platformName = "instamart";
          break;
        default:
          platformName = "flipkart";
      }
      let data;
      if (data_level === "campaign") {
        data = {
          campaign_id: campaign_id,
          tag_id: selectedTag,
          platform: platformName,
        };
      }

      // setLoading(true);
      let result;
      if (data_level === "campaign") {
        result = await _POST(BLINKIT_ATTACH_MULTI_CAMP_TAG, data);
      } else if (data_level === "adgroup" && platform === "amazon") {
        result = await _POST(AMAZON_ADGROUP_BULK_TAG, adgroupData);
        // console.log(result, "<<<<< result");
      }

      if (result?.status === 200) {
        dispatch(setToastMessageHandler("Tag assigned successfully", true));
        changeTagsData(campaign_id, selectedTag);
        if (data_level === "adgroup") {
          dispatch({
            type: ActionType.RECALLCAMPAIGNPAPI,
            payload: true,
          });
        }
        setSelectedTag([]);
      } else {
        dispatch(setToastMessageHandler("Failed to assign tag", false));
      }
      setOpenTag(false);
      dispatch({
        type: ActionType.CHECKBOX,
        payload: [],
      });
    } catch (error) {
      dispatch(setToastMessageHandler("Something went wrong!", false));
    }
  };

  // create a new tag
  const handleTagNameChange = async (e) => {
    try {
      setTagName(e.target.value);

      setError("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTag = () => {
    try {
      const data = {
        tag_name: tagName,
        color: selectedColor,
        data_level: data_level,
      };
      if (editTag) {
        if (!tagName.trim()) {
          setError("Tag name cannot be empty");
        } else {
          createTagApi(data);
          setVisible(true);
        }
      } else {
        updateTagApi({ ...data, id: tagId });
      }
      // setVisible(false);
      setEditTag(true);
      setTagName("");
      setSelectedColor("#fff");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTag = () => {
    try {
      let compare_tag;

      if (!compareTag || compareTag == tagName) {
        compare_tag = true;
      } else {
        compare_tag = false;
      }
      const data = {
        tag_name: tagName,
        color: selectedColor,
        id: tagId,
        compare_tag: compare_tag,
      };
      if (!tagName.trim()) {
        setError("Tag name cannot be empty");
        setVisible(true);
      } else {
        updateTagApi(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTagDelete = () => {
    try {
      deleteTagApi(tagId);
      setTagName("");
      setSelectedColor("#fff");
      setVisible(false);
      setEditTag(true);
    } catch (error) {
      console.error(error);
    }
  };

  const show = (position) => {
    setPosition(position);
    setVisible(true);
  };

  // handles the change of color in the color picker
  const handleChangeComplete = (color) => {
    setTagColor(color.hex);
    setSelectedColor(color.hex);
    setOpenColorPicker(false);
  };

  const handleCreateTagColour = () => {
    show("top");
  };

  const handleEditTag = (color, id) => {
    fetchTagByIdApi(id);
    show("top");
    setSelectedColor(color);
    setTagId(id);
    setEditTag(false);
  };

  const handleCancelButton = () => {
    setVisible(false);
    setTagName("");
    setSelectedColor("#fff");
    setEditTag(true);
  };

  // Function to hide the dialog box
  const hideDialog = () => {
    setDialogVisible(false);
  };

  const handleCheckBox = (checked, tag) => {
    if (checked) {
      setSelectedTag((prevSelectedTag) => {
        if (!prevSelectedTag.includes(tag)) {
          return [...prevSelectedTag, tag];
        } else {
          return prevSelectedTag;
        }
      });
      // setSelectedTag([]);
    } else {
      setSelectedTag((prevSelectedTag) =>
        prevSelectedTag.filter((item) => item !== tag)
      );
    }
  };

  const handleClickOutside = (event) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(event.target) &&
      event.target.id !== "createTagCheckbox"
    ) {
      setOpenTag(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // contains all the footer buttons, constains cancel and create if the user is creating a new tag and cancel,
  // delete and save if the user is editing a tag
  const footerContent = (
    <div>
      <Button
        label="Cancel"
        onClick={() => handleCancelButton()}
        className="p-button"
        style={{
          backgroundColor: "#F8F8F8",
          color: "#5B5B5B",
          fontWeight: "400",
          borderRadius: "4px",
          font: "14px",
          borderColor: "#E3E3E3",
          padding: "10px",
          lineHeight: "22px",
        }}
      />
      {!editTag && (
        <Button
          label="Delete"
          onClick={() => handleTagDelete()}
          style={{
            backgroundColor: "red",
            color: "white",
            fontWeight: "400",
            borderRadius: "4px",
            font: "14px",
            borderColor: "#0081F7",
            lineHeight: "22px",
            padding: "10px",
            border: "none",
          }}
        />
      )}
      <Button
        label={editTag ? "Create" : "Save"}
        onClick={() => (editTag ? handleCreateTag() : handleUpdateTag())}
        style={{
          backgroundColor: "#0081F7",
          color: "white",
          fontWeight: "400",
          borderRadius: "4px",
          font: "14px",
          borderColor: "#0081F7",
          lineHeight: "22px",
          padding: "10px",
        }}
      />
    </div>
  );

  const CreateTag = () => (
    <div
      id="createTagCheckbox"
      onClick={(e) => handleCreateTagColour(e)}
      className="p-button-warning cursor-pointer text-sm flex items-center"
    >
      <h2 className="mr-2 text-lg">+</h2> Create tag
    </div>
  );

  useEffect(() => {
    setCompareTag(tagName);
  }, [openTag, !editTag]);

  const platformColors = {
    blinkit: "bg-[#11b07a] text-white",
    zepto: "bg-[#3c006b] text-white",
    flipkart: "bg-[#0081f7] text-white",
    amazon: "bg-[#EF880F] text-white",
  };

  const platformClass = platformColors[platform] || "bg-gray-500 text-white";

  const className = `border ${platformClass} px-3 py-1 rounded text-[13px] grid ml-9`;
  const disableButton = `border ${platformClass} cursor-not-allowed px-3 py-1 rounded text-[13px] grid ml-9 opacity-50`;
  return (
    <div className="relative" ref={dropDownRef}>
      <div></div>
      {/* tag button */}
      {/* <div className = "bg-red-100"> */}
      <Headerbtn
        title="Tag"
        imgsrc="/assets/images/tag.svg"
        hoverImgSrc="/assets/images/tag-white.svg"
        // onClick={(e) => op?.current?.toggle(e)}
        onClick={() => setOpenTag(!openTag)}
        id="tag_button"
      />
      {/* </div> */}
      {openTag === true && (
        <div className="rounded mt-2 py-2 px-4 drop-shadow-md card bg-white w-max absolute z-[100]">
          <div className="justify-content-center gap-2 mb-2 cursor-pointer">
            {/* {selectedCheckBox?.length === 0 || tagsList?.length === 0 ? (
              <CreateTag />
            ) : (
              selectedCheckBox?.campaign?.length === 0 && <CreateTag />
            )} */}

            {/* List of the tags */}
            {tagsList &&
              tagsList.length > 0 &&
              tagsList.map((tags, index) => (
                <li
                  key={index}
                  className="flex cursor-pointer mb-2 items-center hover:bg-blue-600 hover:text-white text-sm mt-1"
                >
                  {((selectedCheckBox?.campaign?.length > 0 &&
                    data_level === "campaign") ||
                    (selectedCheckBox?.adgroup?.length > 0 &&
                      data_level === "adgroup")) && (
                    <div>
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedTag.includes(tags._id)}
                        onChange={(e) =>
                          handleCheckBox(e.target.checked, tags._id)
                        }
                      />
                    </div>
                  )}

                  <ul
                    key={index}
                    style={{
                      backgroundColor: tags.color,
                      width: "16px",
                      height: "12px",
                      borderRadius: "100%",
                      marginRight: "5px",
                      borderColor: "green",
                    }}
                  ></ul>

                  <div className="flex w-full justify-between items-center">
                    <ul>{tags.tag_name}</ul>
                    {/* {selectedCheckBox.length === 0 && (
                      <div className="">
                        <img
                          className="right"
                          src="/assets/images/edit.svg"
                          alt="edit"
                          onClick={() => handleEditTag(tags.color, tags._id)}
                        />
                      </div>
                    )} */}
                    {/* {(selectedCheckBox?.campaign?.length === 0 ||
                      selectedCheckBox?.adgroup?.length === 0) && (
                      <div className="">
                        <img
                          className="right"
                          src="/assets/images/edit.svg"
                          alt="edit"
                          onClick={() => handleEditTag(tags.color, tags._id)}
                        />
                      </div>
                    )} */}
                  </div>
                </li>
              ))}
            {/* {console.log(
              selectedCheckBox?.adgroup?.length,
              "<< selectedCheckBox?.adgroup?.length"
            )} */}
            {(selectedCheckBox?.campaign?.length > 0 ||
              selectedCheckBox?.adgroup?.length > 0) &&
              tagData?.length > 0 && (
                <button
                  className={
                    selectedTag?.length > 0 ? className : disableButton
                  }
                  onClick={() => handleAddTags()}
                  disabled={selectedTag?.length === 0 && true}
                >
                  Add Tags
                </button>
              )}

            {(selectedCheckBox?.campaign?.length > 0 ||
              selectedCheckBox?.adgroup?.length > 0) &&
              tagData?.length === 0 && <CreateTag />}
          </div>
        </div>
      )}

      <Dialog
        header={editTag ? "Create new tag" : "Edit tag"}
        visible={visible}
        position={position}
        style={{ width: "40vw", padding: "0px" }}
        onHide={() => setVisible(false)}
        footer={footerContent}
        draggable={false}
        resizable={false}
      >
        <hr className="mb-5 border-gray-100 " />
        <p className="mt-2">Please enter the new tag name.</p>
        <div className="mt-2 mb-2 ">
          <input
            id="tag-input"
            className="w-full px-2 py-3 border rounded focus:border-sky-600"
            type="text"
            placeholder="Enter name"
            onChange={handleTagNameChange}
            value={tagName}
            autoComplete="off"
          />
          {error && <div className="text-red-600 text-[12px]">{error}</div>}
        </div>
        <div className="flex justify-between items-center ">
          <div className="text-sm mb-3">Color</div>

          <div
            className="bg-slate-100 w-10 h-10 flex items-center justify-center rounded cursor-pointer"
            onClick={() => setOpenColorPicker(!openColorPicker)}
          >
            <div
              className="w-5 h-5 bg-white rounded-full "
              style={{ backgroundColor: selectedColor }}
            >
              {}
            </div>
          </div>
        </div>
        {openColorPicker === true && (
          <div className=" rounded py-4 px-6 drop-shadow-md card bg-white w-max absolute  z-[100] right-0">
            <CompactPicker
              color={tagColor}
              onChangeComplete={handleChangeComplete}
            />
          </div>
        )}

        <hr className="mt-5 border-gray-100" />
      </Dialog>

      <div>
        {/* Render the dialog box when it's visible */}
        {dialogVisible && (
          <DialogBox
            title={dialogTitle}
            onAccept={hideDialog}
            buttonName="OK"
            platform={"zepto"}
          >
            {dialogMessage}
          </DialogBox>
        )}
      </div>
    </div>
  );
};

export default Tag;
