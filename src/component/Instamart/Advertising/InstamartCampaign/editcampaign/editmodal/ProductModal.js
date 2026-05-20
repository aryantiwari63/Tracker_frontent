import React, { useState } from "react";
import Popup from "../../../../../common-components/Popups/Popup";
import ProductModalForm from "./ProductModalForm";

const ProductModal = () => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <Popup
        title="Product"
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
        ]}
      >
        <ProductModalForm />
      </Popup>
    </>
  );
};

export default ProductModal;
