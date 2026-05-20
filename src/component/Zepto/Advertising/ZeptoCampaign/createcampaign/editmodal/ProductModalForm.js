import React, { useRef, useState } from "react";
import CustomSelect from "../../../../../common-components/CustomSelect";

const ProductModalForm = () => {
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
  const statusfilter = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Pause",
      value: "pause",
    },
  ];
  return (
    <>
      <div className="mx-5">
        <div className="col pr-1 pt-4">
          <CustomSelect
            options={statusfilter}
            label={"Status"}
            onChange
            platform="blinkit"
          />
        </div>
        <div className=" py-4">15 Product selected</div>
        <div className=" ">
          <div className=" px-2 py-2 border outline-none rounded text-xs ">
            {selectedData?.map((item, i) => {
              return (
                <button key={i} className="border-black ml-2 border px-2 py-1 ">
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
                selectedData.length === 0 && " Enter products/Select products"
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
export default ProductModalForm;
