import React, { useRef, useState } from "react";

const LocationModalForm = () => {

  const [selectedData, setSelectedData] = useState([]);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const handleDeleteItem = (e) => {
    const { id } = e.target;
    setSelectedData((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };
  const handleAddKeyword = (e) => {
    const { value, id } = e.target;
    if (e.key === "Enter") {
      setSelectedData([...selectedData, { name: value, id: id }]);
      setValue("");
    }
  };
  return (
    <>
      <div className="mx-5">
        <div className=" py-4">20 Campaign selected</div>
        <div className=" ">
          <div className=" px-2 py-2 border outline-none rounded text-xs ">
            {selectedData?.map((item, i) => {
              return (
                <button key={i} className="border-gray-300 ml-2 border px-2 py-1 rounded mb-1 bg-gray-200">
                  {item.name}
                  <button
                    className="px-1"
                    id={item.id}
                    onClick={handleDeleteItem}
                  >
                    x
                  </button>
                </button>
              );
            })}
            <input
              className="outline-none pl-2"
              type="text"
              ref={inputRef}
              placeholder={
                selectedData.length === 0 && " Enter cities/Select citites"
              }
              value={value}
              id={value.trim}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleAddKeyword}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationModalForm;
