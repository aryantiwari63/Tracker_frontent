import React, { useState } from "react";
import Popup from "../../../../../common-components/Popups/Popup";
import LocationModalForm from "./LocationModalForm";

const LocationModal = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Popup
        title="Location"
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
        <LocationModalForm />
      </Popup>
    </>
  );
};

export default LocationModal;
