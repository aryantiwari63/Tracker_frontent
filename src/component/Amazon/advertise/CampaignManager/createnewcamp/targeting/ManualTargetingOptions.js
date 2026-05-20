import React, { useState } from "react";
import "./styles.css";
import EventHandlerContext from "../../../../../../context/eventHAndlerContext";
import KeywordTargetingLists from "./KeywordTargeingLists";
import Tooltip from "../Tooltip";

const ManualTargetingOptions = ({
  setCampaignData,
  campaignData,
  handleChange
}) => {
  const [selectedOption, setSelectedOption] = useState("keyword");
  // eslint-disable-next-line no-unused-vars
  const [defaultBid, setDefaultBid] = useState("");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  React.useEffect(()=>{
    setCampaignData({
      ...campaignData,
      ManualTargeting:"keyword"
    })
  },[])
  React.useEffect(()=>{
    setCampaignData({
      ...campaignData,
      ManualTargeting:selectedOption
    })
  },[selectedOption])

  const [selectedItems, setSelectedItems] = useState([]);

  const handleAddItemClick = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleDeleteItem = (index) => {
    setSelectedItems(
      selectedItems.filter((item) => item.label !== index.label)
    );
  };

  const handleRemoveAllItems = () => {
    setSelectedItems([]);
  };

  return (
    <EventHandlerContext.Provider
      value={{
        handleAddItemClick,
        handleDeleteItem,
        handleRemoveAllItems,
        selectedItems,
      }}
    >
      <div className=" py-4 px-2 bg-white border">
        <div className="">
          <label>
            <input
              type="radio"
              value="keyword"
            name="selectedKeywordOption"
              checked={selectedOption === "keyword"}
              onChange={handleOptionChange}
            />
            Keyword Targeting
            <Tooltip />
            <div className="px-3">
              Choose keywors to help your products appear in shopper searches.
            </div>
          </label>
        </div>
        {/* <div className="pt-4 ">
          <div className="row">
            <label>
              <input
                type="radio"
                value="product"
                checked={selectedOption === "product"}
                onChange={handleOptionChange}
              />
              Product Targeting
              <Tooltip />
              <div className="px-3">
                Choose specific products,categories,brands,or other product
                features to target your ads.
              </div>
            </label>
          </div>

          {targetingGroups.some((item) => item.active === false) && (
            <label>
              Consider lowering your bid instead of turning off the targeting
              group
            </label>
          )}
        </div> */}
      </div>
      <div className="pt-2"></div>
      {/* {selectedOption === "keyword" ? (
        <KeywordTargetingLists />
      ) : selectedOption === "product" ? (
        <ProductTargeting />
      ) : null} */}
      {selectedOption === "keyword" ? (
        <KeywordTargetingLists
        setCampaignData={setCampaignData}
        campaignData={campaignData}
        handleChange={handleChange}
        />
      ) : null}
    </EventHandlerContext.Provider>
  );
};

export default ManualTargetingOptions;
