import React, { useState } from "react";
import "../styles.css";
import EnterlistProduct from "./EnerlistProduct";

const LeftProductTabs = ({
  setDuplicateKeyword,
  duplicateKeyword,
  campaignData,
  formIndex,
  setNewKeyword,
  newKeyword,
}) => {
  const [activeTab, setActiveTab] = useState("enterlist");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="">
      <div className="w-full max-w-screen-md mx-auto   ">
        <div className="row space-x-4 border-b pb-2 px-3 py-3">
          {/* <button
            className={`tab-btn ${
              activeTab === "search" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("search")}
          >
            Search
          </button> */}
          <button
            className={`tab-btn ${
              activeTab === "enterlist" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("enterlist")}
          >
            Enter List
          </button>
          {/* <button
            className={`tab-btn ${
              activeTab === "upload" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("upload")}
          >
            Upload
          </button> */}
        </div>
        <div className="min-h-[32rem]">
          {/* {activeTab === "search" && <SearchProduct />} */}
          {activeTab === "enterlist" && (
            <EnterlistProduct
              setDuplicateKeyword={setDuplicateKeyword}
              duplicateKeyword={duplicateKeyword}
              campaignData={campaignData}
              setNewKeyword={setNewKeyword}
              newKeyword={newKeyword}
              formIndex={formIndex}
            />
          )}
          {/* {activeTab === "upload" && <UploadListProduct/>} */}
        </div>
      </div>
    </div>
  );
};

export default LeftProductTabs;
