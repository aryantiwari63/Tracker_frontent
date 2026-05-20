import React, { useContext } from "react";
import EventHandlerContext from "../../../../../../../../context/eventHAndlerContext";

const BrandItemList = ({ label, data }) => {
  // const [isAdded, setIsAdded] = useState(false);
  const {
    handleAddItemClick,
    // handleDeleteItem,
    // handleRemoveAllItems,
    selectedItems,
  } = useContext(EventHandlerContext);

  return (
    <>
      <div className="row justify-between px-2 py-4">
        <div>{label}</div>
        <div>
          <div>
            <button
              className="text-blue-400  py-2 px-4"
              onClick={() => {
                handleAddItemClick(data);
                // console.log(
                //   selectedItems.some((item) => item.label === data.label),
                //   "selectedItems?.includes(data.label)"
                // );
              }}
              type="button"
              disabled={selectedItems.some((item) => item.label === data.label)}
            >
              {selectedItems.some((item) => item.label === data.label)
                ? "Excluded"
                : "Exclude"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandItemList;
