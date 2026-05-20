import React, { useMemo, useState } from "react";
import Popup from "../../../common-components/Popups/Popup";
// import Loader from "./Loader";

const SelectedItemPopupComponent = (
  {
    
                popupTitle="",
                values=[],
                selectedTableRows={},
                applyFilterValues=()=>{},
                closePopup=()=>{},
  }
) => {
  


  const [localSelectedValues, setLocalSelectedValues] = useState(selectedTableRows?.[popupTitle] ?? []);
  const handleCheckChange = (item) => {
    if (localSelectedValues.includes(item)) {
      setLocalSelectedValues(localSelectedValues.filter((selectedItem) => selectedItem !== item));
    } else {
      setLocalSelectedValues([...localSelectedValues, item]);
    }
  };

  const handleClearAll = () => {
    setLocalSelectedValues([]);
    if ((selectedTableRows?.[popupTitle] ?? []).length) {
      applyFilterValues([]);
    }
  };
  const handleApply = () => {
    applyFilterValues(localSelectedValues);
    closePopup();
  };
  const [keywordQuery, setkeywordQuery] = useState('');
  const filteredData = useMemo(() => {

    if (keywordQuery) {
      return values.filter(value => value?.item?.lable?.toLowerCase().includes(keywordQuery?.toLowerCase()));

    } else {
      return values;

    }
  }, [values, keywordQuery]);

  return (
    <>
      <Popup
        applyAction={handleApply}
        setShowPopup={closePopup}
        title={
          <>
            Selected {popupTitle}
            <span className="countTags">
              ({localSelectedValues.length})
            </span>
          </>
        }
        smallsize={"w-[300px]"}
      >

        <div className="flex items-center w-full px-4 py-4 gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              type="search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm h-[42px] rounded focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={`Search ${popupTitle}...`}
              value={keywordQuery}
              onChange={(e) => setkeywordQuery(e.target.value ?? '')}
            />
          </div>
          {(localSelectedValues.length > 0) &&
            <button
              type="button"
              onClick={handleClearAll}
              className="text-sm w-30 h-[42px] bg-white border border-gray-300 text-gray-600 px-3 rounded hover:bg-neonBlue hover:text-white hover:border-neonBlue"
            >
              Clear All
            </button>}
        </div>
        <div className="relative w-full">
          {/* {loading && <Loader show={loading} fullScreen={false}/>} */}
          <div className="flex flex-wrap gap-2 px-4">


            {filteredData.map((value, index) => (
              <button
                onClick={() => handleCheckChange(value?.item)}
                key={index}
                className={`categoryTagsBox ${localSelectedValues.includes(value?.item) ? 'selected' : 'disabled'} `}
              >
                <label >{value?.item?.lable}</label>
                {localSelectedValues.includes(value?.item) && (
                  <span>
                    <img src="assets/images/clear-icon-blue.svg" alt="clear" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </Popup>
    </>
  );
};

export default SelectedItemPopupComponent;
