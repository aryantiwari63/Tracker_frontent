import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const MetricsTab = ({ searchValue = "" }) => {
  const [open, setOpen] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const listArr = [];
  const [checkedState, setCheckedState] = useState(
    new Array(listArr.length).fill(false)
  );

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  };

  useEffect(() => {
    if (searchValue) {
      const newList = listArr?.filter((obj) => {
        return (
          !obj.checked &&
          obj?.label?.toLowerCase()?.includes(searchValue?.toLowerCase())
        );
      });
      setFilterList(newList);
      if (newList.length > 0) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    } else {
      setFilterList(listArr);
    }
  }, [searchValue]);

  return (
    <div className="bg-white">
      <div
        className="flex gap-2 bg-[#e9ecef] py-2 px-3 items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="bg-white border border-[#d9d9d9]">
          {open ? <FiMinus size={13} /> : <FiPlus size={13} />}
        </div>
        <div className="mr-1 font-medium">Custom metric</div>
        {/* <img src="/assets/images/imp.svg" className="w-[4px]" /> */}
      </div>

      {open && (
        <div className="px-3 flex flex-col gap-2 py-2">
          {filterList?.map((obj, index) => (
            <div key={index} className="flex justify-between">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id={obj?.label}
                  name={obj?.label}
                  className="accent-orange-600"
                  checked={checkedState[index]}
                  onChange={() => handleOnChange(index)}
                />
                <label htmlFor={obj?.label} className="text-[15px] font-medium">
                  {obj?.label}
                </label>
              </div>

              <img
                src={`/assets/images/editCustom.svg`}
                alt="edit"
                className=" cursor-pointer size-3 mr-2"
              />
            </div>
          ))}
          {filterList?.length === 0 && <div>No Metrics Created</div>}
        </div>
      )}
    </div>
  );
};

export default MetricsTab;
