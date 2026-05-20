import React, { useContext } from "react";
import EventHandlerContext from "../../../../../../context/eventHAndlerContext";

const RightProductTabs = ({
  duplicateKeyword,
  // setNewKeyword,
  newKeyword,
}) => {
  const { handleDeleteItem, handleRemoveAllItems, selectedItems } =
    useContext(EventHandlerContext);
  // console.log("campaignData selectedItems",selectedItems,typeof(selectedItems));

  return (
    <>
      <div className="w-full max-w-screen-md px-4 mt-8 font-semibold">
        <div className="row items-center justify-between mb-4 border-b">
          <h2>
            Products (
            {selectedItems && selectedItems.length
              ? selectedItems.join().split(",").length
              : 0}
            )
          </h2>

          <div className="text-right">
            {" "}
            {/* <button className="text-blue-400 pr-3">
              Export
              <button className="text-gray-500">
                <Tooltip />
              </button>
            </button> */}
            {selectedItems.length > 0 && (
              <button
                className="text-blue-400  focus:outline-none"
                onClick={handleRemoveAllItems}
              >
                Remove All
              </button>
            )}
          </div>
        </div>
        <ul>
          {selectedItems && selectedItems.length
            ? selectedItems
                ?.join()
                ?.split(",")
                ?.map((item, index) => (
                  <li
                    key={index}
                    className="row items-center justify-between py-4 border-b"
                  >
                    <span
                      className={
                        duplicateKeyword &&
                        duplicateKeyword?.length &&
                        duplicateKeyword.find((data) => data === item)
                          ? "duplicateKeyword"
                          : newKeyword &&
                            newKeyword?.length &&
                            newKeyword
                              ?.join()
                              ?.split(",")
                              ?.find((data) => data === item)
                          ? "newKeyword"
                          : ""
                      }
                    >
                      {item}
                    </span>
                    {/* <button
                className={`ml-2 text-gray-500 focus:outline-none`}
                onClick={() => handleDeleteItem(item)}
                &#10006;
              </button> */}
                    <button
                      className="font-semibold"
                      onClick={() => {
                        handleDeleteItem(item);
                      }}
                    >
                      X
                    </button>
                  </li>
                ))
            : null}
        </ul>
        {selectedItems.length === 0 && (
          <div className="text-center text-gray-500">Add product</div>
        )}
      </div>
    </>
  );
};

export default RightProductTabs;
