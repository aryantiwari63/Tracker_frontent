import React, { useState } from "react";

import EventHandlerContext from "../../../../../../context/eventHAndlerContext";
import LeftNegativeProductTargeting from "./LeftNegativeProductTargeting";
import RightNegativeProductTargeting from "./RightNegativeProductTargeting";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import BlockHeading from "../BlockHeading";
import Tooltip from "../Tooltip";

const NegativeProductTargeting = () => {
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
        <Tooltip />
        <label>Optional</label>
      </BlockHeading>
      {showMore && (
        <div className="row border">
          <div className="col_6 border-r-2 bg-white">
            <LeftNegativeProductTargeting />
          </div>

          <div className="col">
            <RightNegativeProductTargeting />
          </div>
        </div>
      )}
    </EventHandlerContext.Provider>
    //  <div className="text-red-400 px-2 py-2">{selectedItems?.length} Product selected</div>
  );
};
export default NegativeProductTargeting;
