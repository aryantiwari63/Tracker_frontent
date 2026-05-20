import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const PerformanceTab = ({ listArr = [], setListArr, searchValue = "" , headerArray=false}) => {
  const [open, setOpen] = useState(true);
  const [filterList, setFilterList] = useState(listArr);
  const handleOnChange = (id) => {
    if(headerArray) {
    const newArr = headerArray.map((obj) => {
      return obj?.id === id ? { ...obj, checked: true, showCol: true } : obj;
    });
    setListArr(newArr); }
    else {
      const newArr = listArr.map((obj) => {
        return obj?.id === id ? { ...obj, checked: true, showCol: true } : obj;
      });
      setListArr(newArr);
    }
  };

  useEffect(() => {
    if (searchValue) {
      const newList = listArr?.filter((obj) => {
        return (
          !obj.checked &&
          obj?.title?.toLowerCase()?.includes(searchValue?.toLowerCase())
        );
      });
      setFilterList(newList);
      if (newList.length > 0) {
        setOpen(true);
      } else {
        setOpen(true);
      }
    } else {
      setFilterList(listArr);
    }
  }, [searchValue, listArr]);

  return (
    <div className="bg-white flex-1">
      <div
        className="flex gap-2 bg-[#e9ecef] py-2 px-3 items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="bg-white border border-[#d9d9d9]">
          {open ? <FiMinus size={13} /> : <FiPlus size={13} />}
        </div>
        <div className="mr-1 font-medium">Performance</div>
        {/* <img src="/assets/images/imp.svg" className="w-[4px]" /> */}
      </div>

      {open && (
        <div className="px-3 flex flex-col gap-2 py-2">
          {filterList?.map(
            (obj, index) =>
              !obj?.checked && (
                <div key={index} className="flex gap-2 ">
                  <input
                    type="checkbox"
                    id={obj?.title}
                    name={obj?.title}
                    className="accent-orange-600"
                    checked={obj?.checked}
                    onChange={() => handleOnChange(obj?.id)}
                    disabled={obj?.nonSelectable}
                  />
                  <label
                    htmlFor={obj?.title}
                    className="text-[15px] font-medium"
                  >
                    {obj?.title}
                  </label>
                </div>
              )
          )}
          {filterList?.every((obj) => obj?.checked) && (
            <div>All columns selected</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceTab;
