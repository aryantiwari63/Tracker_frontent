import React, {  useState } from "react";
import "../styles.css";


import SuggestedInd from "./individual/SuggestedInd";
import Tooltip from "../../Tooltip";
import SearchListInd from "./individual/SearchListInd";
import EnterlistInd from "./individual/EnterListInd";
import UploadListInd from "./individual/UploadListInd";
// import SearchProduct from "./SearchProduct";
// import EnterlistProduct from "./EnerlistProduct";
// import UploadListProduct from "./UploadListProduct";


const IndividualProducts = () => {
  const [activeTab, setActiveTab] = useState("suggested");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="">
      <div className="w-full max-w-screen-md mx-auto  ">
        {/* tab selector */}
        <div className="row space-x-4 border-b pb-2 px-3">
          <button
            className={`tab-btn ${
              activeTab === "suggested" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("suggested")}
          >
            Suggested<Tooltip/>
          </button>
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
        <div className="tab-content h-80">
          {activeTab === "suggested" && <SuggestedInd />}
          {activeTab === "search" && <SearchListInd />}
          {activeTab === "enterlist" && <EnterlistInd />}
          {activeTab === "upload" && <UploadListInd />}
         
        </div>
        
      </div>
      
    </div>
    
  );
};


export default  IndividualProducts ;
