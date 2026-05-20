import React from "react";
import { useSelector } from "react-redux";
const Tabbtn = ({ title, imgsrc, onClick, active }) => {
  const { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  return (
    <>
      <div
        className={[
          "campaign__navtabli",
          active && "campaign__navtabli--active",
        ].join(" ")}
      >
        <button onClick={onClick}>
          <div className="row">
            <div>
              <img className="imgicon" src={imgsrc} alt="" />
            </div>

           
            <div className="text-lg font-medium"> {title}</div>
            {selectedCheckBox?.campaign?.length > 0 &&
              title !== "Campaign" &&
              title !== "Portfolio" && <div className="text-blue-500">* </div>}
          </div>
        </button>
      </div>
    </>
  );
};
export default Tabbtn;
