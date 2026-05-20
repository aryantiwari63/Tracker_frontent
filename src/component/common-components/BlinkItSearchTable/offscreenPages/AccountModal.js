import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
// import { applyBtnObj, cancelBtnObj } from "../../Popups/constant";
// import "./style.css"; // Ensure Tailwind CSS or custom styles are included

const AccountModal = ({
  isOpen,
  options,
  // onDone,
  // onCancel,
  onOutsideClick,
  selectedOption,
  setSelectedOption,
  // platform,
  schedulerPosition,
}) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const calculateModalPosition = (e) => {
      if (!popupRef.current) return;
      const modalHeight = popupRef.current.clientHeight;
      const buttonTop = e.top;

      var modalTop = Math.max(buttonTop - modalHeight, 0);
      popupRef.current.style.top = `${modalTop + 5}px`;

      const modalWidth = popupRef.current.clientWidth;
      const buttonLeft = e.left;
      const windowWidth = window.innerWidth;
      const spaceRight = windowWidth - (buttonLeft + modalWidth);
      if (spaceRight < modalWidth) {
        const modalLeft = Math.min(
          buttonLeft - spaceRight,
          windowWidth - modalWidth + spaceRight
        );
        popupRef.current.style.left = `${modalLeft}px`;
      } else {
        popupRef.current.style.left = `${e.left - 30}px`;
      }
    };

    if (schedulerPosition) {
      calculateModalPosition(schedulerPosition);
    }
  }, [schedulerPosition, window]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onOutsideClick();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onOutsideClick]);

  // if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={popupRef}
      className="absolute z-[100] drop-shadow-md  py-2 rounded bg-white min-w-max border-gray-300"
    >
      <ul>
        {options.map((option, index) => {
          if (index === 0) return null;
          return (
            <li
              key={index}
              className={`cursor-pointer text-[14px] px-4 py-1 ${
                selectedOption === option.value
                  ? "bg-[#13a976] text-[#fff]"
                  : "hover:bg-gray-100"
              }`}
              onClick={(e) => {
                setSelectedOption(option);
                e.stopPropagation();
              }}
            >
              {option.label}
            </li>
          );
        })}
      </ul>
      {/* <div className="flex justify-end space-x-2 mt-2 px-4">
        <button
          className={cancelBtnObj[platform]}
          onClick={onCancel}
          style={{ marginLeft: 0, padding: "6px 15px" }}
        >
          Cancel
        </button>
        <button
          className={applyBtnObj[platform]}
          onClick={() => onDone(selectedOption)}
          disabled={!selectedOption}
          // Disable Done if no option is selected
          style={{ padding: "6px 15px" }}
        >
          Done
        </button>
      </div> */}
    </div>,
    document.body
  );
};

export default AccountModal;
