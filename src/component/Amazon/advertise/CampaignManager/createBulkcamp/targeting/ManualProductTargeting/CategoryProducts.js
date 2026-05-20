import React, {  useState } from "react";
import Tooltip from "../../Tooltip";
import Suggested from "./Suggested";
import Search from "./Search";

const CategoryProducts = () => {
  const [activeTab, setActiveTab] = useState("suggested");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="">
        <div className="w-full max-w-screen-md mx-auto  ">
          <div className="row space-x-4 border-b pb-2 px-3">
            <button
              className={`tab-btn ${
                activeTab === "suggested" ? "active active-tab-underline" : ""
              }`}
              onClick={() => handleTabClick("suggested")}
            >
              Suggested
              <Tooltip />
            </button>
            <button
              className={`tab-btn ${
                activeTab === "search" ? "active active-tab-underline" : ""
              }`}
              onClick={() => handleTabClick("search")}
            >
              Search
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "suggested" && <Suggested />}
            {activeTab === "search" && <Search />}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryProducts;
