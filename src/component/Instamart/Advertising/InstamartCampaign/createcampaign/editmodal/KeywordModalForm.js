import React, { useState } from "react";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import Popup from "../../../../../common-components/Popups/Popup";
import {  useDispatch } from "react-redux";
import ActionType from "../../../../../../redux/types";
import DialogBox from "../../../../../common-components/dialogBox.js";
import "./styles.css";
const KeywordModalForm = ({ setKeywordPopup }) => {
  const [showDialog, setShowDialog] = useState(false);

  const dispatch = useDispatch();
  const percentage = [
    {
      label: "By Percent",
      value: "percent",
    },
    {
      label: "By Amount",
      value: "amount",
    },
  ];

  const handleDialogCancel = () => {
    setShowDialog(false);
    setKeywordPopup(false);
    dispatch({
      type: ActionType.CHECKBOX,
      payload: [],
    });
  };

  const handleDialogApply = () => {
    setShowDialog(false);
  };
  return (
    <>
      <Popup
        title="Keyword"
        platform="instamart"
        popup_id_container="popup-container-keyword"
        popup_content="popup_content"
        setShowPopup={setKeywordPopup}
        applyAction={() => {
          setShowDialog(true);
        }}
      >
        <div className="mx-5">
          <div className="my-2">
            <label className="flex">
              <input type="radio" name="optionSelection" />
              <p className="ml-1 text-[14px]">Delete 15 selected keywords</p>
            </label>
          </div>
          <div>
            <label className="flex">
              <input type="radio" name="optionSelection" />
              <p className="ml-1 text-[14px]"> Bid Strategy</p>
            </label>
          </div>
          <div className="row ml-3 mt-4">
            <div className=" pr-1 mr-2">
              <select className="w-full py-2 border rounded">
                {percentage.map((item, i) => {
                  return (
                    <option key={i} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="rounded border px-1 flex items-center mr-1">
              <BiSolidUpArrow className="text-green-600 w-full" />
            </div>
            <div className="rounded border px-1 flex items-center mr-2">
              <BiSolidDownArrow className="text-red-600" />
            </div>
            <div className="col ">
              <input
                type="number"
                placeholder="Enter amount"
                className="border px-2 py-2 mx-1 rounded"
              ></input>
            </div>
          </div>
        </div>
      </Popup>
      {showDialog && (
        <DialogBox
          buttonName="Accept"
          title="Confirmation"
          onAccept={handleDialogApply}
          onCancel={handleDialogCancel}
        >
          Are you sure you want change the bid?
        </DialogBox>
      )}
    </>
  );
};

export default KeywordModalForm;
