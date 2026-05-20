/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, useRef } from "react";
import Popup from "../../common-components/Popups/Popup";
import { useDispatch } from "react-redux";
import { _PATCH } from "../../../services/axios.method";
import { UPDATE_TAG } from "../../../utils/constants";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction";
import Toast from "../../common-components/toast";
import TagManagerContext from "../../../context/tagManagerContext";
import SelectBox from "./SelectBox";
import { CompactPicker } from "react-color";
import './TagStyles.css';
// import { SketchPicker } from "react-color";
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const EditTagPopup = ({
  setOpenState,
  initialData,
  platforms,
  flipkartAccounts,
  amazonAccounts,
  zeptoAccounts,
  instamartAccounts,
}) => {
  const [tagName, setTagName] = useState(initialData.tag_name);
  const [selectedColor, setSelectedColor] = useState(initialData.color);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    initialData.platforms.map((plat) => plat)
  );
  const [selectedAccounts, setSelectedAccounts] = useState(
    initialData.accounts.map((acc) => acc)
  );
  const [defaultSelectedPlatforms, setDefaultSelectedPlatforms] = useState(
    initialData.platforms.map((plat) => {
      return {
        label: capitalizeFirstLetter(plat),
        value: plat,
      };
    })
  );
  const [defaultSelectedAccounts, setDefaultSelectedAccounts] = useState(
    initialData.accounts.map((acc) => {
      return {
        label: acc,
        value: acc,
      };
    })
  );
  const [error, setError] = useState(false);
  const editRef = useRef(null);
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const { setIsCreatedOrUpdated } = useContext(TagManagerContext);
  const dispatch = useDispatch();

  function updateAvailableAccounts(selectedPlatforms) {
    let accounts = [];
    if (selectedPlatforms.map((e) => e.value).includes("flipkart")) {
      accounts = accounts.concat(flipkartAccounts);
    }
    if (selectedPlatforms.map((e) => e.value).includes("amazon")) {
      accounts = accounts.concat(amazonAccounts);
    }
    if (selectedPlatforms.map((e) => e.value).includes("zepto")) {
      accounts = accounts.concat(zeptoAccounts);
    }
    if (selectedPlatforms.map((e) => e.value).includes("instamart")) {
      accounts = accounts.concat(instamartAccounts);
    }
    if (selectedPlatforms.map((e) => e.value).includes("blinkit")) {
      accounts = accounts.concat([]);
    }
    const uniqueAccounts = removeDuplicates(accounts, "label");
    setAvailableAccounts(uniqueAccounts);
  }

  function removeDuplicates(array, key) {
    return array.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t[key] === item[key])
    );
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (editRef.current && !editRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editRef]);

  useEffect(() => {
    updateAvailableAccounts(defaultSelectedPlatforms);
  }, [defaultSelectedPlatforms]);

  // function selectPlatform(e, value) {
  //   setSelectedPlatforms(value);
  // }

  // function selectAccounts(event, value) {
  //   setSelectedAccounts(value);
  // }

  function handleTagNameChange(e) {
    setTagName(e.target.value);
  }

  async function createTag() {
    const filteredAccounts = selectedAccounts.filter((selected) =>
      availableAccounts.some((account) => account.value === selected)
    );
    if (!selectedPlatforms.length) {
      setError("Please select atleast one platform");
      return;
    }

    if (selectedPlatforms.length) {
      if (
        selectedPlatforms.length === 1 &&
        selectedPlatforms[0] === "blinkit"
      ) {
        //do nothing
      } else if (!filteredAccounts.length) {
        setError("Please select atleast one account");
        return;
      }
    }

    if (!tagName) {
      setError("Please enter the tag name");
      return;
    }
    const tag = {
      ...initialData,
      accounts: filteredAccounts,
      color: selectedColor,
      platforms: selectedPlatforms,
      tag_name: tagName,
    };

    const result = await _PATCH(UPDATE_TAG + "/" + initialData.tag_id, tag);
    setIsCreatedOrUpdated(true);
    if (result?.status === 200) {
      dispatch(setToastMessageHandler(result?.data?.status?.message, true));
      setTimeout(() => {
        setOpenState(false);
      }, 1000);
    } else {
      dispatch(setToastMessageHandler(result?.data?.error?.message, false));
      setOpenState(false);
    }
  }

  function selectAccounts(event, value) {
    setSelectedAccounts(value);
  }

  function selectPlatform(e, value) {
    setDefaultSelectedPlatforms(
      value.map((ele) => ({ label: capitalizeFirstLetter(ele), value: ele }))
    );
    setSelectedPlatforms(value);
    if (!value.length) {
      setSelectedAccounts([]);
    }
  }
  const isBlinkitOnly =
    selectedPlatforms.length === 1 && selectedPlatforms[0] === "blinkit";

  return (
    <>
      <Toast />
      <Popup
        title="Update Tag"
        setShowPopup={setOpenState}
        applyAction={createTag}
        customStyle={{ width: "26rem", overflow: "visible" }}
        notRequiredPopupContent
        button="update"
      >
        <div className="flex gap-5 p-4">
          <div>
            <div className="mb-2 font-semibold">Platform</div>
            <div style={{ width: "11rem" }}>
              <SelectBox
                label="Select Platforms"
                options={platforms}
                applyFilters={selectPlatform}
                filterName="platform"
                defaultSelected={defaultSelectedPlatforms}
                unSelectDefault={false}
                tagManagerDropdown
              />
            </div>
          </div>
          <div>
            <div className="mb-2 font-semibold">Account</div>
            <div style={{ width: "11rem" }}>
              <SelectBox
                label="Select Accounts"
                options={availableAccounts}
                applyFilters={selectAccounts}
                filterName="accounts"
                defaultSelected={defaultSelectedAccounts}
                unSelectDefault={false}
                disabled={isBlinkitOnly}
                tagManagerDropdown
              />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="grow">
            <div className="mb-2 font-semibold">Tag Name</div>
          </div>
          <div className="flex">
            <input
              id="tag-input"
              className="w-full px-2 py-3 border rounded focus:border-sky-600 focus:outline focus:outline-blue-600"
              type="text"
              placeholder="Enter Name"
              onChange={handleTagNameChange}
              value={tagName}
              autoComplete="off"
              maxLength="50"
            />
            <div className="border w-10 flex items-center justify-center cursor-pointer relative">
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: selectedColor, border: selectedColor === '#ffffff' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none' }}
                onClick={() => setShowColorPicker(true)}
              ></div>
              {showColorPicker && (
              <div className="tagColorPicker" ref={editRef} style={{right: 0}}>
                <CompactPicker
                  color={selectedColor}
                  onChangeComplete={(color) => {
                    setSelectedColor(color.hex);
                    setShowColorPicker(false);
                  }}
                />
              </div>
            )}
            </div>

            
          </div>
        </div>
        {error && (
          <div className="flex justify-center items-center text-red-500">
            {error}
          </div>
        )}
      </Popup>
    </>
  );
};
export default EditTagPopup;
