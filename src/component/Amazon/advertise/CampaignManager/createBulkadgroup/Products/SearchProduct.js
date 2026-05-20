import React, { useContext, useState } from "react";
import ItemList from "./ItemList";
import EventHandlerContext from "../../../../../../context/eventHAndlerContext";
const SearchProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const initialKeywordList = [
    {
      label: "Fabric Soften",
      added: false,
    },
    {
      label: "Jewel",
      added: false,
    },
    {
      label: "Jewellery",
      added: false,
    },
    {
      label: "Chocolate Box",
      added: false,
    },
    {
      label: "Fabric",
      added: false,
    },
    {
      label: "Brass Copper",
      added: false,
    },
    {
      label: "Chocolate Pack",
      added: false,
    },
    {
      label: "Bottle",
      added: false,
    },
    {
      label: "Bathroom",
      added: false,
    },
  ];

  const [keywordList] = useState(initialKeywordList);
  const {
    // handleAddItemClick,
    // handleDeleteItem,
    // handleRemoveAllItems,
    selectedItems,
    setSelectedItems,
  } = useContext(EventHandlerContext);
  return (
    <>
      <div className="p-4 ">
        <form className="relative border-b py-1">
          <div className=" ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="keyword__searchimg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by product name or ASIN"
              className="keywordtab__search rounded"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
        <div className="text-right py-2">
          <button
            className="text-blue-400 text-sm"
            disabled={searchTerm?.length === 0}
            onClick={() => {
              const newItemsToAdd = keywordList
                .filter((item) =>
                  item.label.toLowerCase().startsWith(searchTerm.toLowerCase())
                )
                .filter(
                  (item) =>
                    !selectedItems.some(
                      (selectedItem) => selectedItem.label === item.label
                    )
                );

              setSelectedItems([...selectedItems, ...newItemsToAdd]);
            }}
          >
            Add all on this page
          </button>
        </div>
        {searchTerm?.length > 0 && (
          <div className="col">
            <div className="keyword__seacrhitems ">
              {keywordList.map((value) => {
                return (
                  value.label
                    .toLowerCase()
                    .startsWith(searchTerm.toLowerCase()) && (
                    <ItemList label={value.label} data={value} />
                  )
                );
              })}
            </div>
          </div>
        )}
        <div className=" border-t text-center py-6 text-xs ">
          Enter a search term to find products sold on Amazon.
        </div>
      </div>
    </>
  );
};

export default SearchProduct;
