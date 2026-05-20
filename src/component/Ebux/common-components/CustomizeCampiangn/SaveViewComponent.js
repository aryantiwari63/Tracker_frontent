import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const SaveViewComponent = ({
  expanded = false,
  searchValue = "",
  platform,
  options,
  onSelect,
  onDelete,
  onSetDefault,
  selectedOptions,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [filterList, setFilterList] = useState([]);
  useEffect(() => {
    if (searchValue) {
      const newList = options?.filter((obj) => {
        return obj?.title?.toLowerCase()?.includes(searchValue?.toLowerCase());
      });
      setFilterList(newList);
      if (newList.length > 0) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    } else {
      setFilterList(options);
      setIsExpanded(expanded);
    }
  }, [searchValue, options]);
  return (
    <>
      <div
        className="flex gap-2 bg-[#e9ecef] py-2 px-3 items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="bg-white border border-[#d9d9d9]">
          {isExpanded ? <FiMinus size={13} /> : <FiPlus size={13} />}
        </div>
        <div className="mr-1 font-medium">{platform}</div>
        {/* <img src="/assets/images/imp.svg" className="w-[4px]" /> */}
      </div>

      {isExpanded && (
        <ul key={platform + "_ul"} className="space-y-3 px-3 py-2">
          {filterList.map((option, index) => (
            <li
              key={platform + index + option?.title}
              className="flex items-center "
            >
              <input
                id={`item${platform + index + option?.title}`}
                type="checkbox"
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                checked={selectedOptions === option?.title}
                onChange={() => onSelect(option)}
                disabled={option?.isDisabled}
              />
              <label
                htmlFor={`item${platform + index + option?.title}`}
                className="ml-3 text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap w-[calc(100%-52px)]"
                title={option?.title}
              >
                {option?.title}
              </label>
               {!option?.is_default && (
                <button
                  className="w-[130px] rounded-md font-semibold text-[12px] mr-2 text-gray-300 hover:bg-[#3b82f6] p-1 hover:text-[#fff] self-center transition"
                  onClick={() => onSetDefault(option)}
                >
                  Set As Default
                </button>
              )}

              {/* If already default, show a small label */}
              {option?.is_default && (
                <span className="cursor-not-allowed flex w-[113px] text-[12px] text-[#92c0f8] p-1 self-center font-semibold mr-2">
                  Default View
                </span>
              )}
              <img
                src={`/assets/images/trash-2.svg`}
                alt="cross"
                onClick={() => onDelete(option)}
                className="w-5 h-5 cursor-pointer"
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SaveViewComponent;
