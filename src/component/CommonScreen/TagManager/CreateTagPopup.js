import React, { useState, useEffect, useContext,useRef } from "react";
import Popup from "../../common-components/Popups/Popup";
import { useDispatch } from "react-redux";
import { _POST } from "../../../services/axios.method";
import { CREATE_ALL_TAGS } from "../../../utils/constants";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction";
import SelectBox from "./SelectBox";
import Toast from "../../common-components/toast";
import TagManagerContext from "../../../context/tagManagerContext";
import { CompactPicker } from "react-color";
import './TagStyles.css'

const CreateTagPopup = ({ setOpenState, platforms, flipkartAccounts, amazonAccounts,
    zeptoAccounts, instamartAccounts
}) => {
    const [tagName, setTagName] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [availableAccounts, setAvailableAccounts] = useState([]);
    const [openColorPicker, setOpenColorPicker] = useState(false);
    const { setIsCreatedOrUpdated } = useContext(TagManagerContext);
    const [selectedColor, setSelectedColor] = useState('#009ce0');
    const [error, setError] = useState(false);
    const editRef = useRef(null);
    const dispatch = useDispatch();

    const handleChangeComplete = (color) => {
        setSelectedColor(color.hex);
        setOpenColorPicker(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
          if (editRef.current && !editRef.current.contains(event.target)) {
            setOpenColorPicker(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [editRef]);

    function updateAvailableAccounts(selectedPlatforms) {
        let accounts = [];
        if (selectedPlatforms.includes("flipkart")) {
            accounts = accounts.concat(flipkartAccounts);
        }
        if (selectedPlatforms.includes("amazon")) {
            accounts = accounts.concat(amazonAccounts);
        }
        if (selectedPlatforms.includes("zepto")) {
            accounts = accounts.concat(zeptoAccounts);
        }
        if (selectedPlatforms.includes("instamart")) {
            accounts = accounts.concat(instamartAccounts);
        }
        if (selectedPlatforms.includes("blinkit")) {
            accounts = accounts.concat([]);
        }
        const uniqueAccounts = removeDuplicates(accounts, 'label');
        setAvailableAccounts(uniqueAccounts);
    }

    function removeDuplicates(array, key) {
        return array.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t[key] === item[key]
            ))
        );
    }

    useEffect(() => {
        updateAvailableAccounts(selectedPlatforms);
    }, [selectedPlatforms]);

    function selectPlatform(e, value) {
        setSelectedPlatforms(value);
        if (!value.length) {
            setSelectedAccounts([]);
        }
    }

    function selectAccounts(event, value) {
        setSelectedAccounts(value);
    }

    function handleTagNameChange(e) {
        setTagName(e.target.value);
    }

    async function createTag() {
        const filteredAccounts = selectedAccounts.filter(selected =>
            availableAccounts.some(account => account.value === selected)
        );

        if (!selectedPlatforms.length) {
            setError("Please select atleast one platform");
            return;
        }

        if (selectedPlatforms.length) {
            if (selectedPlatforms.length ===1 && selectedPlatforms[0]==='blinkit') {
                //do nothing
            }
            else if (!filteredAccounts.length) {
            setError("Please select atleast one account")
            return;
            }
        }

        if (!tagName) {
            setError("Please enter the tag name");
            return;
        }
        const tag = {
            accounts: filteredAccounts,
            platform: selectedPlatforms,
            tag_name: tagName,
            color: selectedColor
        };
        const result = await _POST(CREATE_ALL_TAGS, tag);
        if (result?.status === 200) {
            setIsCreatedOrUpdated(true);
            dispatch(setToastMessageHandler(result?.data?.status?.message, true));
            setTimeout(() => {
                setOpenState(false);
            }, 1000);

        } else {
            dispatch(setToastMessageHandler(result?.data?.error?.message, false));
            setOpenState(false);
        }
    }
    const isBlinkitOnly = selectedPlatforms.length === 1 && selectedPlatforms[0] === "blinkit";

    return (
        <>
            <Toast />
            <Popup
                title="Create Tag"
                setShowPopup={setOpenState}
                applyAction={createTag}
                button = 'create'
                customStyle={{ width: '26rem', overflow:'visible' }}
                notRequiredPopupContent
            >
                <div className="flex gap-5 p-4 relative">
                    <div>
                        <div className="mb-2 font-semibold">
                            Platform
                        </div>
                        <div style={{ width: '11rem' }}>
                            <SelectBox
                                label="Select Platforms"
                                options={platforms}
                                applyFilters={selectPlatform}
                                filterName="platform"
                                defaultSelected={platforms}
                                unSelectDefault={true}
                                tagManagerDropdown
                            />
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 font-semibold">
                            Account
                        </div>
                        <div style={{ width: '11rem' }}>
                            <SelectBox
                                label="Select Accounts"
                                options={availableAccounts}
                                applyFilters={selectAccounts}
                                filterName="accounts"
                                defaultSelected={isBlinkitOnly ? [] : availableAccounts}
                                unSelectDefault={isBlinkitOnly ? false : true}
                                disabled={isBlinkitOnly}
                                tagManagerDropdown
                            />
                        </div>
                    </div>
                </div>
                <div className="p-4 relative">
                    <div className="mb-2 font-semibold">
                        Tag Name
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
                            <div
                                className="border w-10 flex items-center justify-center cursor-pointer relative"
                                onClick={() => setOpenColorPicker(!openColorPicker)}
                            >
                                <div
                                    className="w-5 h-5 bg-white rounded-full "
                                    style={{ backgroundColor: selectedColor, border: selectedColor === '#ffffff' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none' }}
                                >
                                    { }
                                </div>
                            </div>
                    {openColorPicker === true && (
                        <div className="tagColorPicker" ref={editRef} style={{bottom: -5}}>
                            <CompactPicker
                                color={selectedColor}
                                onChangeComplete={handleChangeComplete}
                            />
                        </div>
                    )}

                </div>
                </div>
                {error && <div className="flex justify-center items-center text-red-500">{error}</div>}
            </Popup>
        </>
    );
};
export default CreateTagPopup;
