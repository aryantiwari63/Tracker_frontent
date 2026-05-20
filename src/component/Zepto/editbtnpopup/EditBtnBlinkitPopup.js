import React from "react";
import Popup from "../../common-components/Popups/Popup";

const EditBtnBlinkitPopup = () => {
  return (
    <>
      <div>
        <Popup
          title={"Add Product"}
          extrasmall
          // setShowPopup={false}
          cutomButton={[
            {
              label: "Cancel",
              handleClick: () => {},
              style: "bg-[#E3E3E3] text-[]",
            },
            {
              label: "Save",
              handleClick: () => {},
              style: "bg-[#11B07A]",
            },
          ]}
        >
          <div className="px-[13px]">
            <div className="">
              Search for products, or enter a list of PIDs separated by comma?
            </div>
            <div className="">
              <input type="text" className="border w-full "></input>
            </div>
          </div>
        </Popup>
      </div>
    </>
  );
};

export default EditBtnBlinkitPopup;
