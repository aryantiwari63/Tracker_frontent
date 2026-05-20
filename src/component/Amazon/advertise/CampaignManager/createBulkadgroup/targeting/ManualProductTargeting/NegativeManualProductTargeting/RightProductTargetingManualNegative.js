import React, { useContext } from "react";
import EventHandlerContext from "../../../../../../../../context/eventHAndlerContext";

const RightProductTargetingManualNegative = () => {
  const { handleDeleteItem, handleRemoveAllItems, selectedItems } =
    useContext(EventHandlerContext);
  return (
    <>
      <div className="w-full max-w-screen-md px-4 mt-8 font-semibold">
        <div className="row items-center justify-between mb-4">
          <h2>Products ({selectedItems.length})</h2>
          {/* <button className="text-blue-400">Export</button> */}
          {selectedItems.length > 0 && (
            <button
              className="text-blue-400 hover:text-red-800 focus:outline-none"
              onClick={handleRemoveAllItems}
            >
              Remove All
            </button>
          )}
        </div>
        <div className="border-t border-b border-gray-200 py-4 font-normal">
          Brands & products
        </div>
        <ul>
          {selectedItems?.map((item, index) => (
            <li key={index} className="row items-center justify-between py-4">
              <span>{item.label}</span>
              <button
                className={`ml-2 text-gray-500  focus:outline-none`}
                onClick={() => handleDeleteItem(item)}
              >
                &#10006;
              </button>
            </li>
          ))}
        </ul>
        {selectedItems.length === 0 && (
          <div className="text-center text-gray-500">Add product</div>
        )}
      </div>
    </>
  );
};

export default RightProductTargetingManualNegative;
