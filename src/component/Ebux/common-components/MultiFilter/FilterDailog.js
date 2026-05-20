import FilterMenu from "./FilterMenu";
import { useEffect, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { HiOutlineTrash } from "react-icons/hi2";

const FilterDailog = ({
  openInRight = false,
  chips,
  listArr = [],
  searchText,
  savedSearch = {},
  handleDeleteSavedSearch,
  handleAction = false,
  handleSavedAction = false,
  handleRemoveSearch = false,
  selectedListObj = {},
  clearCheck = false,
  clearAllValues
}) => {
  const [showSavedList, setShowSavedList] = useState(false);
  const [filterListArr, setFilterListArr] = useState([]);
  const [savedSearchObj, setSavedSearchObj] = useState(savedSearch);

  const handleFilterSavedSearch = () => {
    const newArr = savedSearch?.children?.filter((obj) => {
      return obj?.label.toLowerCase().includes(searchText.toLowerCase());
    });
    setSavedSearchObj({ ...savedSearch, children: newArr });
  };

  const handleFilterListArr = () => {
    let newArr = [];
    for (let i = 0; i < listArr?.length; i++) {
      const childrenArr = listArr[i]?.children?.filter((obj) => {
        return obj?.label?.toLowerCase().includes(searchText?.toLowerCase());
      });
      if (childrenArr?.length > 0) {
        newArr.push({ ...listArr[i], children: childrenArr });
      }
    }
    setFilterListArr(newArr);
  };
  function checkAllSelected(key, children, selectedListObj) {
    if (!children || children.length === 0) {
      return true; // No children means it's selected by default
    }
    // console.log({key}, {children}, {selectedListObj});
    // Traverse children recursively
    return children.every((child) => {
      const childKey = child?.key;


      if (child?.children && child?.children.length > 0) {
        // Check nested children recursively
        return checkAllSelected(key, child?.children, selectedListObj);
      }

      // Check if the current child is selected
      return selectedListObj[key]?.[childKey] ?? false;
    });
  }

  useEffect(() => {
    handleFilterSavedSearch();
    handleFilterListArr();
    if (searchText?.length > 0) {
      setShowSavedList(true);
    } else {
      setShowSavedList(false);
    }
  }, [searchText]);

  useEffect(() => {
    setFilterListArr(listArr);
  }, [listArr]);

  console.log("filter Take", filterListArr)

  return (
    <div className={`absolute top-[2.2rem] ${openInRight ? `right-0` : `left-0`} bg-white border shadow-lg z-[100] rounded-xl px-1 py-2 `}>
      <div
        className="w-[300px] max-h-60 overflow-y-auto px-1"
        id="filter-scrollbar"
      >
        {savedSearchObj?.children?.length > 0 && (
          <div>
            <div
              className="font-semibold text-sm py-1 flex justify-between items-center cursor-pointer hover:bg-[#F5F6F7]"
              // onClick={() => setShowSavedList(!showSavedList)}
              onClick={(e) => {
                setShowSavedList(!showSavedList);
                e.stopPropagation();
              }}
            >
              Saved searches
              <div className="mr-2">
                {showSavedList ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </div>
            </div>
            {showSavedList &&
              savedSearchObj?.children?.map((obj) => {
                return (
                  <div
                    key={obj?.key}
                    onClick={
                      () => handleSavedAction(obj?.data) // Select option present if no chips selected
                    }
                    className={`font-medium group text-xs my-1 py-1 hover:bg-[#F5F6F7] cursor-pointer flex justify-between items-center
                `}
                  >
                    {obj?.label}
                    <div
                      className={`hidden group-hover:block mr-2`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSavedSearch({ show: true, obj });
                      }}
                    >
                      <HiOutlineTrash size={14} />
                    </div>
                  </div>
                );
              })}
            {savedSearchObj?.children?.length === 0 && (
              <div className="text-[#B9B9B9] font-medium text-[13px] mt-1 mb-2">
                No Saved Search
              </div>
            )}
          </div>
        )}

        <div className="mt-1 mb-2">
          <div className="flex justify-between items-center">
            <div className="font-semibold text-sm">Filters</div>
            {clearCheck && <button className="!text-xs font-normal underline " onClick={clearAllValues}>Clear All</button>}
          </div>
          {filterListArr?.length > 0 && (
            <div className="text-[#B9B9B9] font-medium text-[13px] my-1">
              Filter by row selection(s)
            </div>
          )}
          {filterListArr?.map((obj, index) => {
            return Array.isArray(obj?.children) ? (
              <FilterMenu
                key={index}
                obj={obj}
                chips={chips}
                isSearching={searchText.length > 0}
                handleAction={handleAction}
                handleRemoveSearch={handleRemoveSearch}
                selectedListObj={selectedListObj[obj?.key]}
                // isAllSelected={
                //   Object.keys(selectedListObj[obj?.key]).length > 0 &&
                //   Object.keys(selectedListObj[obj?.key]).length ===
                //     obj?.children?.length
                // }
                isAllSelected={checkAllSelected(obj?.key, obj?.children, selectedListObj)}
              />
            ) : (
              <div
                key={index}
                className={`font-medium text-xs my-1 hover:bg-[#F5F6F7]`}
                onClick={() => handleAction(obj)}
              >
                {obj?.label}
              </div>
            );
          })}
          {filterListArr?.length === 0 && (
            <div className="text-[#B9B9B9] font-medium text-[13px] mt-1 mb-2 py-1">
              No list
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterDailog;
