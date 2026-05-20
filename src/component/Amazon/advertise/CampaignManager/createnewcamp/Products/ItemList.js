import React, { useContext } from "react";
import EventHandlerContext from "../../../../../../context/eventHAndlerContext";

const ItemList = ({ label, data }) => {
  const {
    handleAddItemClick,
    selectedItems,
  } = useContext(EventHandlerContext);

  return (
    <>
      <div className="row justify-between px-2 py-4">
        <div>{label}</div>
        <div>
          <div>
            <button
            className="bg-gray-200 rounded-2xl py-2 px-4"
              onClick={() => {
                handleAddItemClick(data);
              }}
              type="button"
              disabled={selectedItems.some((item) => item.label === data.label)}
            >
              {selectedItems.some((item) => item.label === data.label)
                ? "Added"
                : "Add"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemList;
