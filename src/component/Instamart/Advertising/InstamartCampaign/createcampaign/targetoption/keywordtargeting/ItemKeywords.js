import React from "react";

const ItemKeyword = ({ item, searchvol, onClick }) => {
  return (
    <div className="px-2 pb-2" onClick={onClick}>
      <div className=" itemkeyword__content">{item} </div>
      <div className="bg-gray-100 py-1 px-2 text-[8px] text-gray-400 rounded-lg rounded-t-none">
        {searchvol} searches
      </div>
    </div>
  );
};
export default ItemKeyword;
