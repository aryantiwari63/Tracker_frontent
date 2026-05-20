import React, { useRef } from "react";
import SidePopup from "./SidePopup";
import HygieneBlock from "./HygienePopUp";
import { useCloseWhenClickOutside } from "../../../common-components/useCloseWhenClickOutside";

const IntentPopUp = ({
  closeSideBar,
  selectedRow,
  showSideBar,
  setShowSideBar,
}) => {
  // const [showTargetBlock, setShowTargetBlock] = React.useState("hygiene");
  const [catalogDetails, setCatalogDetails] = React.useState({});

  // const handleTabClick = (tabName) => {
  //   setShowTargetBlock(tabName);
  // };
  React.useEffect(() => {
    setCatalogDetails({ ...selectedRow[0] });
    // console.log("selectedRow111111", selectedRow);
  }, []);

  const sidebarOuterRef = useRef(null);
  useCloseWhenClickOutside(showSideBar, setShowSideBar, sidebarOuterRef);
  return (
    <div className="" ref={sidebarOuterRef}>
      <SidePopup
        title="Hygiene"
        className="sidepopup_title"
        footerless={true}
        close={closeSideBar}
      >
        <div className=" text-base px-24  py-2 tabs gap-4  ">
          <button
            className="text-[#1890FF] text-base font-normal"
            // className={showKeywordTarget === "keywords" ? "active" : ""}
            // onClick={() => handleTabClick("hygiene")}
          >
            Hygiene
          </button>

          {/* <button
            // className={showKeywordTarget === "excludeKeywords" ? "active" : ""}
            onClick={() => handleTabClick("Plagarism")}
          >
            Plagarism
          </button> */}
        </div>
        <div>
          <HygieneBlock catalogDetails={catalogDetails} />
          {/* {showTargetBlock === "hygiene" ? (
            <HygieneBlock catalogDetails={catalogDetails} />
          ) : (
            <PlagarismBlock selectedRow={selectedRow} />
          )} */}
        </div>
      </SidePopup>
    </div>
  );
};
export default IntentPopUp;
