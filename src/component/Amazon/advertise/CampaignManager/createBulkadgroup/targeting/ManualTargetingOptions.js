import React, { useState } from "react";
import "./styles.css";
// import { BiMessageSquareError } from "react-icons/bi";
// import KeywordTargeting from "./KeywordTargeting";
// import ProductTargeting from "./ProductTargeting";
import EventBulkHandlerContext from "../../../../../../context/eventBulkHandlerContext";
// import LeftKeywordTargetListPanel from "./KeywordTargeingLists/LeftKeywordTargetListPanel";
import KeywordTargetingLists from "./KeywordTargeingLists";
import Tooltip from "../Tooltip";

const ManualTargetingOptions = ({
  setCampaignData,
  campaignData,
  handleChange,
  formIndex,
  showAdgroup,
}) => {
  const [selectedOption, setSelectedOption] = useState("keyword");
  // const [defaultBid, setDefaultBid] = useState("");
  // const [targetingGroups, setTargetingGroups] = useState([
  //   { name: "Close match", active: true },
  //   { name: "Loose match", active: true },
  //   { name: "Substitute match", active: true },
  //   { name: "Complements", active: true },
  // ]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  React.useEffect(() => {
    // setCampaignData({
    //   ...campaignData,
    //   ManualTargeting: "keyword",
    // });
    let data = [...campaignData];
    if (data && data[formIndex]) {
      data[formIndex]["ManualTargeting"] = "keyword";
    }
  }, []);
  React.useEffect(() => {
    setSelectedOption("keyword");
  }, [formIndex]);

  // const handleDefaultBidChange = (e) => {
  //   setDefaultBid(e.target.value);
  // };

  // const handleTargetingGroupToggle = (index) => {
  //   const updatedGroups = [...targetingGroups];
  //   updatedGroups[index].active = !updatedGroups[index].active;
  //   // console.log(updatedGroups, "updatedGroups");
  //   setTargetingGroups(updatedGroups);
  // };
  // const [showTooltip, setShowTooltip] = useState(false);
  // const [showHelp, setShowHelp] = useState(false);
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

  // const toggleTooltip = () => {
  //   setShowTooltip(!showTooltip);
  // };

  return (
    <EventBulkHandlerContext.Provider
      value={{
        handleAddItemClick,
        handleDeleteItem,
        handleRemoveAllItems,
        selectedItems,
      }}
    >
      {!showAdgroup?.includes(formIndex) ? (
        <>
          <div className=" py-4 px-2 bg-white border">
            <div className="">
              <label>
                <input
                  type="checkbox"
                  name="ManualTargeting"
                  value={selectedOption}
                  checked={selectedOption === "keyword"}
                  onChange={handleOptionChange}
                />
                Keyword Targeting
                <Tooltip />
                <div className="px-3">
                  Choose keywors to help your products appear in shopper
                  searches.
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
        </>
      ) : null}
      {selectedOption === "keyword" ? (
        <KeywordTargetingLists
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
          formIndex={formIndex}
          showAdgroup={showAdgroup}
        />
      ) : null}
    </EventBulkHandlerContext.Provider>
  );
};

export default ManualTargetingOptions;
