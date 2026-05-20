import React, { useState } from "react";
// import { HiDownload, HiUpload } from "react-icons/hi";
import "../styles.css";
import EnterlistProduct from "../Products/EnerlistProduct";
import UploadListProduct from "../Products/UploadListProduct";
// import EventHandlerContext from "../../../../../../context/eventHAndlerContext";
import NegativeSearchProduct from "./NegativeSearchProduct";

const LeftNegativeProductTargeting = () => {
  // const { selectedItems } = useContext(EventHandlerContext);
  const [activeTab, setActiveTab] = useState("search");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="w-full max-w-screen-md mx-auto ">
        {/* tab selector */}
        <div className="row space-x-4 border-b pb-2 px-3">
          <button
            className={`tab-btn ${
              activeTab === "search" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("search")}
          >
            Search
          </button>
          <button
            className={`tab-btn ${
              activeTab === "enterlist" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("enterlist")}
          >
            Enter List
          </button>
          <button
            className={`tab-btn ${
              activeTab === "upload" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("upload")}
          >
            Upload
          </button>
        </div>
        {/* tab selector */}
        <div className="tab-content min-h-[32rem]">
          {activeTab === "search" && <NegativeSearchProduct />}
          {activeTab === "enterlist" && <EnterlistProduct />}
          {activeTab === "upload" && <UploadListProduct />}
        </div>
        {/* <div className=" border-t text-center py-6 text-xs h-80">
          Enter a search term to find products sold on Amazon.
        </div> */}
      </div>
    </>
  );
};

export default LeftNegativeProductTargeting;
