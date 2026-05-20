import React, {  useState } from "react";
import ExcludeBrands from "./ExcludeBrands";
import ExcludeProducts from "./ExcludeProducts";

const LeftProductTargetingManualNegative=()=>{
    const [activeTab, setActiveTab] = useState("excludebrands");
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };
    return(
        <>
         <div className="w-full max-w-screen-md mx-auto ">
        {/* tab selector */}
        <div className="row space-x-4 border-b pb-2 px-3">
          <button
            className={`tab-btn ${
              activeTab === "excludebrands" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("excludebrands")}
          >
            Exclude Brands 
          </button>
          <button
            className={`tab-btn ${
              activeTab === "excludeproducts" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("excludeproducts")}
          >
           Exclude products 
          </button>
          
        </div>
       
        <div className="tab-content min-h-[32rem]">
          {activeTab === "excludebrands" && <ExcludeBrands />}
          {activeTab === "excludeproducts" && <ExcludeProducts />}
        
        </div> 
        
      </div>
        </>
    )
}

export default LeftProductTargetingManualNegative