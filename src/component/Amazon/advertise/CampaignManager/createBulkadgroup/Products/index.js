import React, { useState } from "react";
import LeftProductTabs from "./LeftProductTabs";
import RightProductTabs from "./RightProductTabs";
import EventBulkHandlerContext from "../../../../../../context/eventBulkHandlerContext";
import BlockHeading from "../BlockHeading";
import Tooltip from "../Tooltip";

const Products = ({
  setCampaignData,
  campaignData,
  handleChange,
  formIndex,
  showAdgroup,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  // const [showTooltip, setShowTooltip] = useState(false);
  // const [showHelp, setShowHelp] = useState(false);
  const [duplicateKeyword, setDuplicateKeyword] = useState([]);
  const [newKeyword, setNewKeyword] = useState([]);

  // const toggleTooltip = () => {
  //   setShowTooltip(!showTooltip);
  // };

  const handleAddItemClick = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleDeleteItem = (item) => {
    // console.log("campaignData item", item);
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
    // setCampaignData({
    //   ...campaignData,
    //   asins: selectedItems,
    // });
    // console.log("campaignData selectedItems", selectedItems);
    let data = campaignData;
    if (data && data[formIndex]) {
      data[formIndex]["asins"] = selectedItems;
    }
    setTimeout(() => {
      setDuplicateKeyword([]);
      setNewKeyword([]);
    }, 3000);

    setCampaignData([...data]);
  }, [selectedItems]);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData[0] &&
      formIndex > 0 &&
      campaignData[0]?.asins
    ) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      setSelectedItems([...campaignData[0]?.asins]);
    }
  }, [formIndex]);

  return (
    <EventBulkHandlerContext.Provider
      value={{
        handleAddItemClick,
        handleDeleteItem,
        handleRemoveAllItems,
        selectedItems,
        setSelectedItems,
      }}
    >
      {!showAdgroup?.includes(formIndex) ? (
        <>
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
                formIndex={formIndex}
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
        </>
      ) : null}
    </EventBulkHandlerContext.Provider>
    //  <div className="text-red-400 px-2 py-2">{selectedItems?.length} Product selected</div>
  );
};
export default Products;
