import React, { useState } from "react";
import LeftProductTabs from "./LeftProductTabs";
import RightProductTabs from "./RightProductTabs";
import EventHandlerContext from "../../../../../../context/eventHAndlerContext";
import BlockHeading from "../BlockHeading";
import Tooltip from "../Tooltip";

const Products = ({ setCampaignData, campaignData, handleChange }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [duplicateKeyword, setDuplicateKeyword] = useState([]);
  const [newKeyword, setNewKeyword] = useState([]);

  const handleAddItemClick = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleDeleteItem = (item) => {
    setSelectedItems(
      selectedItems
        .join()
        .split(",")
        .filter((data) => data != item)
    );
  };

  const handleRemoveAllItems = () => {
    setSelectedItems([]);
  };
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      asins: selectedItems,
    });
    setTimeout(() => {
      setDuplicateKeyword([]);
      setNewKeyword([]);
    }, 2000);
  }, [selectedItems]);
  // React.useEffect(() => {}, [selectedItems]);

  return (
    <EventHandlerContext.Provider
      value={{
        handleAddItemClick,
        handleDeleteItem,
        handleRemoveAllItems,
        selectedItems,
        setSelectedItems,
      }}
    >
      <div className="row border">
        <BlockHeading
          heading={"Products"}
          subheading={"How to choose a targeting strategy"}
        >
          <Tooltip />
        </BlockHeading>
      </div>
      <div className="row border">
        <div className="col_6 border-r-2 bg-white">
          <LeftProductTabs
            setDuplicateKeyword={setDuplicateKeyword}
            duplicateKeyword={duplicateKeyword}
            campaignData={campaignData}
            setNewKeyword={setNewKeyword}
            newKeyword={newKeyword}
          />
        </div>
        <div className="col">
          <RightProductTabs
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            setDuplicateKeyword={setDuplicateKeyword}
            duplicateKeyword={duplicateKeyword}
            setNewKeyword={setNewKeyword}
            newKeyword={newKeyword}
          />
        </div>
      </div>
    </EventHandlerContext.Provider>
    //  <div className="text-red-400 px-2 py-2">{selectedItems?.length} Product selected</div>
  );
};
export default Products;
