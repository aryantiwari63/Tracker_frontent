import React from "react";
import Popup from "../../../../../common-components/Popups/Popup";
import KeywordModalForm from "./KeywordModalForm";

const KeywordModal = ({ showPopup, setShowPopup }) => {
  return (
    <>
      <Popup
        title="Keyword"
        setShowPopup={setShowPopup}
        setOpenState={setShowPopup}
        platform="zepto"
        extrasmall
        cutomButton={[
          {
            handleClick: () => setShowPopup(!showPopup),
            label: "Cancel",
            style: "bg-white text-black border",
          },
          {
            handleClick: () => setShowPopup(!showPopup),
            label: "Remove",
            style: "bg-white text-black border",
          },
        ]}
      >
        <KeywordModalForm />
      </Popup>
    </>
  );
};

export default KeywordModal;
