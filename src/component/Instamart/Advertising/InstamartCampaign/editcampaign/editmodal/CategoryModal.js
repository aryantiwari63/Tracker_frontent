import React, { useState } from "react";
import Popup from "../../../../../common-components/Popups/Popup";
import CategoryModalForm from "./CategoryModalForm";

const CategoryModal = () => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <Popup
        title="Category"
        setShowPopup={setShowPopup}
        setOpenState={setShowPopup}
        platform="blinkit"
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
          {
            handleClick: () => setShowPopup(!showPopup),
            label: "Apply",
            style: "bg-[#08AB67] text-white border",
          },
        ]}
      >
        <CategoryModalForm />
      </Popup>
    </>
  );
};

export default CategoryModal;
