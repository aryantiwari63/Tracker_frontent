import React from "react";

const ItemKeyword = ({ item, searchvol, onClick }) => {
  return (
    <div className="px-2 pb-2" onClick={onClick}>
      <div className="bg-white text-start border border-green-600 rounded-md px-2 py-0.5 cursor-pointer hover:bg-green-100 !text-black !font-semibold">
        {item}

        <div className="text-[10px] font-normal text-gray-400">
          {searchvol} {searchvol ? "searches" : ""}
        </div>
      </div>
    </div>
  );
};
export default ItemKeyword;
