import React, { useState } from "react";
// import { HiDownload, HiUpload } from "react-icons/hi";
import "../styles.css";
// import EventHandlerContext from "../../../../../../../context/eventHAndlerContext";
import Tooltip from "../../Tooltip";
import CategoryProducts from "./CategoryProducts";
import IndividualProducts from "./IndividualProducts";
// import SearchProduct from "./SearchProduct";
// import EnterlistProduct from "./EnerlistProduct";
// import UploadListProduct from "./UploadListProduct";

const LeftProductTargetingPanel = () => {
  // const { selectedItems } = useContext(EventHandlerContext);
  const [activeTab, setActiveTab] = useState("categories");
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
              activeTab === "categories" ? "active active-tab-underline" : ""
            }`}
            onClick={() => handleTabClick("categories")}
          >
            Categories
            <Tooltip />
          </button>
          <button
            className={`tab-btn ${
              activeTab === "individualproducts"
                ? "active active-tab-underline"
                : ""
            }`}
            onClick={() => handleTabClick("individualproducts")}
          >
            Individual Products
            <Tooltip />
          </button>
        </div>
        <div className="tab-content min-h-[32rem]">
          {activeTab === "categories" && <CategoryProducts />}
          {activeTab === "individualproducts" && <IndividualProducts />}
        </div>
      </div>
    </div>
  );
};

export default LeftProductTargetingPanel;
