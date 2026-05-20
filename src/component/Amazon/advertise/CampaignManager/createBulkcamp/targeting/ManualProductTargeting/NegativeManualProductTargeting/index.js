import React, { useState } from "react";
import EventHandlerContext from "../../../../../../../../context/eventHAndlerContext";
import BlockHeading from "../../../BlockHeading";
import {
  AiOutlineDown,
  AiOutlineUp,
} from "react-icons/ai";
import LeftProductTargetingManualNegative from "./LeftProductTargetingManualNegativ";
import RightProductTargetingManualNegative from "./RightProductTargetingManualNegative";




const NegativeManualProductTargeting = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showMore, setShowMore] = useState(true);

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
      <BlockHeading
        moreicon={
          <button
            className="pr-3 pt-2"
            onClick={() => {
              setShowMore(!showMore);
            }}
          >
            {showMore ? <AiOutlineUp /> : <AiOutlineDown />}
          </button>
        }
        heading={"Negative Product Targeting"}
        subheading={"How to choose negative products for targeting"}
      >
        {/* <Tooltip />
        <AiFillExclamationCircle /> */}
      </BlockHeading>
      {showMore && (
        <div className="row border">
          <div className="col_6 border-r-2 bg-white">
            <LeftProductTargetingManualNegative />
          </div>

          <div className="col"><RightProductTargetingManualNegative /></div>
        </div>
      )}
    </EventHandlerContext.Provider>
  );
};

export default NegativeManualProductTargeting;
