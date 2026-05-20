import React, { useState } from "react";
import Popup from "../Popups/Popup";
import CustomDropDownTable from "../customdropdowntable/CustomDropDownTable";

const CustomColOptionAms = ({
  title,
  showHeader,
  setShowFilter,
  showFilter,
  platform,
  activeTab,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [showPopup, setShowPopup] = useState(false);
  // const [showHeader, setShowHeader] = useState([...headers]);
  React.useEffect(() => {
    // console.log("showHeader", showHeader);
  }, [showHeader]);


  return (
    <>
      <button
        className={[
          "campaignreport__btn flex rounded",
          platform === "ams" && "campaignreport__btn--ams",
        ].join(" ")}
        onClick={() => {
          setShowFilter(!showFilter);
        }}
      >
        <img
          className="w-4 mr-1"
          src="/assets/images/table-columns.svg"
          alt=""
        />

        {title}
      </button>
      {showFilter && (
        <Popup
          title={"Customize campaign"}
          setShowPopup={setShowPopup}
          platform={"ams"}
         
        >
          <CustomDropDownTable platform={platform} activeTab={activeTab} />
        </Popup>
      )}
    </>
  );
};
export default CustomColOptionAms;
