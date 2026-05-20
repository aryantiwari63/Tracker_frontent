/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useState, useContext, useRef, useEffect } from "react";
import _ from "lodash";
import { useDispatch } from "react-redux";
import TagManagerContext from "../../../context/tagManagerContext";
import moment from "moment";
import { _PATCH } from "../../../services/axios.method";
import { DELETE_BULK_TAGS, UPDATE_TAG, PERMISSIONS } from "../../../utils/constants";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction.js";
import DialogBox from "../../common-components/dialogBox.js";
import { headers } from "./utils";
import Toast from "../../common-components/toast/index.js";
import EditPopup from "./EditPopup.js";
import { CompactPicker } from "react-color";
import EditTagPopup from "./EditTagPopup.js";
import WhenPermitted from "../../common-components/WhenPermitted.js";
export default function TagManagerTable({
  platforms,
  blinkitAccounts,
  instamartAccounts,
  amazonAccounts,
  zeptoAccounts,
  flipkartAccounts,
}) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletedTagName, setDeletedTagName] = useState();
  const [deletedTagId, setDeletedTagId] = useState([]);
  const [isTagNameHovered, setIsTagNameHovered] = useState(false);
  const [platformHovered, setPlatformHovered] = useState(false);
  const [accountHovered, setAccountHovered] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [exisitngData, setExisitingData] = useState();
  const [editColor, setEditColor] = useState("");
  const [editColorID, setEditColorID] = useState(null);
  const [showEditTagPopup, setShowEditTagPopup] = useState(false);
  const [editTagData, setEditTagData] = useState(null);
  const [errorMesaage, setErrorMessage] = useState(false);

  const [showAccountEditPopup, setShowAccountEditPopup] = useState(false);
  const [schedulerPosition, setSchedulerPosition] = useState({
    top: 0,
    left: 0,
  });

  const {
    allTagsData,
    selectedCheckboxes,
    setSelectedCheckBoxes,
    setIsCreatedOrUpdated,
    orderBy,
    setOrderBy,
    loading,
    setDeletedData,
    deletedData,
  } = useContext(TagManagerContext);
  const editRef = useRef(null);
  const dispatch = useDispatch();
  const handleDelete = async () => {
    const result = await _PATCH(DELETE_BULK_TAGS, deletedTagId);
    setShowDeletePopup(false);
    setIsCreatedOrUpdated(true);
    if (result?.status === 200) {
      setSelectedCheckBoxes((prev) =>
        prev.filter((id) => id !== deletedTagId[0].tag_id)
      );
      setDeletedData((prev) =>
        prev.filter((ele) => ele.tag_id !== deletedTagId[0].tag_id)
      );
      dispatch(setToastMessageHandler(result?.data?.status?.message, true));
      setTimeout(() => {
        setDeletedTagName();
      }, 500);
    } else {
      dispatch(setToastMessageHandler(result?.data?.error?.message, false));
    }
  };

  const handleDeleteClose = () => {
    setShowDeletePopup(false);
    setDeletedTagName();
  };

  function selectAllCheckboxes(e) {
    if (e.target.checked) {
      const tag_id = allTagsData.map((ele) => ele.tag_id);
      setSelectedCheckBoxes(tag_id);
      setDeletedData(allTagsData);
    } else {
      setSelectedCheckBoxes([]);
      setDeletedData([]);
    }
  }

  function selectTagName(e, tagId) {
    if (e.target.checked) {
      setSelectedCheckBoxes((prev) => [...prev, tagId]);
      const selectedTagData = allTagsData.find((ele) => ele.tag_id === tagId);
      setDeletedData((prev) => [...prev, selectedTagData]);
    } else {
      const checkedBoxes = selectedCheckboxes.filter((ele) => ele !== tagId);
      const filterDeletedData = deletedData.filter(
        (ele) => ele.tag_id !== tagId
      );
      setSelectedCheckBoxes(checkedBoxes);
      setDeletedData(filterDeletedData);
    }
  }

  const handleCancel = () => {
    setShowEditPopup(false);
    setShowAccountEditPopup(false);
    setExisitingData();
    setErrorMessage();
  };

  const handleApply = async (selectedOptions, data, key) => {
    let selectedCheckboxes;
    if (key === "color") {
      if (data.color === selectedOptions) {
        return;
      }
    } else {
      selectedCheckboxes = Object.entries(selectedOptions)
        .filter(([key, value]) => value === true && key !== "selectAll")
        .map(([key, value]) => key);
      console.log("selected Check", selectedCheckboxes);

      if (!selectedCheckboxes.length) {
        setErrorMessage(
          `Please Select atleast 1 ${
            key === "platforms" ? "platform" : "account"
          }`
        );
        return;
      }
    }

    setErrorMessage();
    let filterAccounts = [];
    if (key === "platforms") {
      const getAllAccountOptions = getUniqueOptions(selectedCheckboxes);
      const accountValues = getAllAccountOptions?.map((ele) => ele.value);
      filterAccounts = data?.accounts?.filter((ele) =>
        accountValues.includes(ele)
      );
    }
    const result = await _PATCH(UPDATE_TAG + "/" + data.tag_id, {
      ...data,
      [key]: key === "color" ? selectedOptions : selectedCheckboxes,
      ...(key === "platforms" ? { accounts: filterAccounts } : {}),
    });

    if (result?.status === 200) {
      setIsCreatedOrUpdated(true);
      dispatch(setToastMessageHandler(result?.data?.status?.message, true));
    } else {
      dispatch(setToastMessageHandler(result?.data?.error?.message, false));
    }

    setShowEditPopup(false);
    setEditColor("");
    setEditColorID(null);
    setShowAccountEditPopup(false);
    setExisitingData();
  };

  const platformAccountsMap = {
    blinkit: blinkitAccounts,
    flipkart: flipkartAccounts,
    instamart: instamartAccounts,
    amazon: amazonAccounts,
    zepto: zeptoAccounts,
  };

  const getUniqueOptions = (platforms) => {
    const allOptions = platforms.flatMap(
      (platform) => platformAccountsMap[platform] || []
    );
    const uniqueItems = Array.from(
      new Map(allOptions.map((item) => [item.value, item])).values()
    );
    return uniqueItems;
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (editRef.current && !editRef.current.contains(event.target)) {
        setEditColor("");
        setEditColorID(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editRef]);

  const tagPosition = (e) => {
    // Calculate button position relative to the viewport
    const buttonRect = e.target.getBoundingClientRect();
    console.log("buttonRect>>>>>>>>>>", buttonRect);
    setSchedulerPosition({
      top: buttonRect.bottom,
      left: buttonRect.left,
    });
  };

  return (
    <>
      <Toast />
      <div className={`campaignreportcheckbox__table max-h-[400px] relative overflow-y-auto flipkartCampignDataTables ${allTagsData.length === 0 && "h-[150px]"}`}>
        <table className=" w-full">
          <thead className="campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35]">
            <tr>
              <WhenPermitted platform="dashboard" permission={PERMISSIONS.CREATE_EDIT_TAG}>
              <th className="">
                <input
                  className="h-16"
                  type="checkbox"
                  onChange={selectAllCheckboxes}
                  disabled={!allTagsData?.length}
                  checked={
                    allTagsData?.length &&
                    allTagsData?.length === selectedCheckboxes?.length
                  }
                />
              </th>
              </WhenPermitted>
              {headers.map((item, index) => {
                if (item.showCol) {
                  return (
                    <React.Fragment key={index}>
                      {item.type === "single" ? (
                        <th>
                          <div className="tableHead px-4 w-36 h-16">
                            <p style={{ fontSize: '14px' }}>{item.title}</p>
                            {item.sortIcon !== false && allTagsData.length > 0 && (
                              <div className="sortArrow cursor-pointer">
                                <div>
                                  <div
                                    onClick={() =>
                                      setOrderBy({
                                        key: item.sortKey,
                                        order: "1",
                                      })
                                    }
                                    style={{
                                      color:
                                        orderBy.key === item.sortKey &&
                                        orderBy.order === "1"
                                          ? "black"
                                          : "grey",
                                      marginBottom: -8,
                                    }}
                                  >
                                    ▲
                                  </div>
                                </div>
                                <div>
                                  <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      setOrderBy({
                                        key: item.sortKey,
                                        order: "-1",
                                      })
                                    }
                                    style={{
                                      color:
                                        orderBy.key === item.sortKey &&
                                        orderBy.order === "-1"
                                          ? "black"
                                          : "grey",
                                      marginBottom: 2,
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
                          {item.subTitles.map((v, i) => (
                            <td key={i} className="graydirect">
                              {v}
                            </td>
                          ))}
                        </th>
                      )}
                    </React.Fragment>
                  );
                }
                return null;
              })}
            </tr>
          </thead>
          <tbody>
            {allTagsData.map((data) => (
              <tr key={data._id} className="tableContentCheckBox tabStyle">
                <WhenPermitted permission={PERMISSIONS.CREATE_EDIT_TAG} platform="dashboard">
                <td className="checkboxPadding">
                  <input
                    className="h-16"
                    type="checkbox"
                    checked={selectedCheckboxes.includes(data.tag_id)}
                    onChange={(e) => selectTagName(e, data.tag_id)}
                  />
                </td>
                </WhenPermitted>
                <td
                  className="w-36 h-16"
                  onMouseEnter={() => setIsTagNameHovered(data.tag_name)}
                  onMouseLeave={() => setIsTagNameHovered(false)}
                >
                  <div className="text-blue-600">{data?.tag_name}</div>
                  <WhenPermitted platform="dashboard" permission={PERMISSIONS.CREATE_EDIT_TAG}>
                  {isTagNameHovered === data.tag_name && (
                    <div className="flex gap-2 mt-2">
                      <p
                        className="text-xs cursor-pointer"
                        onClick={() => {
                          setShowEditTagPopup(true);
                          setEditTagData(data);
                        }}
                      >
                        <i className="fal fa-edit mr-2"></i>Edit
                      </p>
                      <p
                        className="cursor-pointer text-xs"
                        onClick={(e) => {
                          setShowDeletePopup(true);
                          setDeletedTagId([data]);
                          setDeletedTagName(data.tag_name);
                        }}
                      >
                        <i className="fal fa-trash-alt mr-1"></i>Delete
                      </p>
                    </div>
                  )}
                 </WhenPermitted> 
                </td>
                <td className="w-36">{data?.entity}</td>
                <td
                  className="w-36"
                  onMouseEnter={() => setPlatformHovered(data.tag_name)}
                  onMouseLeave={() => setPlatformHovered(false)}
                >
                  <div className="flex flex-wrap relative">
                    <div>
                      {Array.isArray(data?.platforms) &&
                        data.platforms.map((platform, index) => (
                          <span key={index}>
                            {platform.toUpperCase()}
                            {index !== data.platforms.length - 1 ? ", " : ""}
                          </span>
                        ))}
                    </div>
                    <div>
                      <WhenPermitted platform="dashboard" permission={PERMISSIONS.CREATE_EDIT_TAG}>
                      {platformHovered === data?.tag_name && (
                        <>
                          <i
                            className="fal fa-edit ml-2 cursor-pointer"
                            onClick={(e) => {
                              setShowEditPopup(data.tag_id);
                              setExisitingData(data);
                              tagPosition(e);
                            }}
                          ></i>
                        </>
                      )}
                      </WhenPermitted>
                      {showEditPopup === data.tag_id && (
                        <EditPopup
                          schedulerPosition={schedulerPosition}
                          options={platforms}
                          selectedPlatforms={data.platforms}
                          onCancel={handleCancel}
                          onApply={(selectedOptions) => {
                            handleApply(selectedOptions, data, "platforms");
                          }}
                          title="Select Platforms"
                          error={errorMesaage}
                        />
                      )}
                    </div>
                  </div>
                </td>
                <td className="w-36 pl-10">
                  {editColorID === data.tag_id && editColor ? (
                    <div
                      ref={editRef}
                      className="relative flex"
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setEditColor("");
                          setEditColorID(null);
                        }
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full ml-4"
                        style={{ backgroundColor: data.color }}
                        onClick={(e) => {
                          setEditColor("");
                          setEditColorID(null);
                        }}
                      ></div>
                      <WhenPermitted platform="dashboard" permission={PERMISSIONS.CREATE_EDIT_TAG}>
                      <div className="absolute bottom-[10px] z-50">
                        <CompactPicker
                          color={editColor}
                          onChangeComplete={(color) =>
                            handleApply(color.hex, data, "color")
                          }
                        />
                      </div>
                      </WhenPermitted>
                    </div>
                  ) : (
                    <div
                    className="w-5 h-5 rounded-full ml-4"
                    style={{
                      backgroundColor: data.color,
                      border: data.color === '#ffffff' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                    }}
                    onDoubleClick={() => {
                      setEditColor(data.color);
                      setEditColorID(data.tag_id);
                    }}
                  ></div>
                  )}
                </td>
                <td className="w-36">
                  <div>{data?.updated_by}</div>
                  <div style={{ color: '#0000008C' }}>{moment(data?.updated_at).format("DD.MM.YY")}</div>
                </td>
                <td
                  className="w-36"
                  onMouseEnter={() => setAccountHovered(data.tag_name)}
                  onMouseLeave={() => setAccountHovered(false)}
                >
                  <div className="flex flex-wrap relative">
                    <div>
                      {Array.isArray(data?.accounts) && data.accounts.join(",")}
                    </div>
                    <div>
                      <WhenPermitted platform="dashboard" permission={PERMISSIONS.CREATE_EDIT_TAG}>
                      {accountHovered === data?.tag_name && (
                        <>
                          <i
                            className="fal fa-edit ml-2 cursor-pointer"
                            onClick={(e) => {
                              setShowAccountEditPopup(data.tag_id);
                              setExisitingData(data);
                              tagPosition(e)
                            }}
                          ></i>
                        </>
                      )}
                      </WhenPermitted>
                      {showAccountEditPopup === data.tag_id && (
                        <EditPopup
                          schedulerPosition={schedulerPosition}
                          options={getUniqueOptions(data.platforms)}
                          selectedPlatforms={data?.accounts}
                          onCancel={handleCancel}
                          onApply={(selectedOptions) => {
                            handleApply(selectedOptions, data, "accounts");
                          }}
                          title="Select Accounts"
                          error={errorMesaage}
                        />
                      )}
                    </div>
                  </div>
                </td>
                <td className="w-36">
                  <div>{data?.created_by}</div>
                  <div style={{ color: '#0000008C' }}>{moment(data?.created_at).format("DD.MM.YY")}</div>
                </td>
              </tr>
            ))}
            {allTagsData.length === 0 && !loading ? (
              <tr>
              <div className="p-2 !border-b-0 absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {" "}
                No Tag Found
              </div>
            </tr>
            ) : null}
          </tbody>
        </table>
        {showDeletePopup && (
          <DialogBox
            title="Confirmation"
            buttonName="OK"
            onAccept={handleDelete}
            onCancel={handleDeleteClose}
          >
            <i className="fal fa-times-circle text-red-500 text-lg mr-2"></i>
            <span className="text-base">
              Are you sure want to delete the tag &quot;{`${deletedTagName}`}
              &quot; ?
            </span>
          </DialogBox>
        )}
      </div>
      {showEditTagPopup && (
        <EditTagPopup
          setOpenState={setShowEditTagPopup}
          initialData={editTagData}
          platforms={platforms}
          blinkitAccounts={blinkitAccounts}
          instamartAccounts={instamartAccounts}
          amazonAccounts={amazonAccounts}
          zeptoAccounts={zeptoAccounts}
          flipkartAccounts={flipkartAccounts}
        />
      )}
    </>
  );
}