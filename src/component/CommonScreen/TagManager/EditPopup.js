/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const EditPopup = ({
  options,
  onCancel,
  onApply,
  selectedPlatforms,
  title,
  error,
  schedulerPosition = false,
}) => {
  const [checkboxes, setCheckboxes] = useState({});
  const popupRef = useRef(null);

  useEffect(() => {
    const calculateModalPosition = () => {
      if (!popupRef.current) return;
      const modalHeight = popupRef.current.clientHeight;
      const buttonTop = schedulerPosition.top;

      var modalTop = Math.max(buttonTop - modalHeight, 0);
      popupRef.current.style.top = `${modalTop}px`;

      const modalWidth = popupRef.current.clientWidth;
      const buttonLeft = schedulerPosition.left;
      const windowWidth = window.innerWidth;
      const spaceRight = windowWidth - (buttonLeft + modalWidth);
      
      if (spaceRight < modalWidth) {
        const modalLeft = Math.min(
          buttonLeft - spaceRight,
          windowWidth - modalWidth + spaceRight
        );
        popupRef.current.style.left = `${modalLeft}px`;
      }
    };

    if (schedulerPosition) {
      calculateModalPosition();
      window.addEventListener("resize", calculateModalPosition);
    }

    return () => {
      window.removeEventListener("resize", calculateModalPosition);
    };
  }, [schedulerPosition,window]);

  useEffect(() => {
    const filteredSelectedPlatforms = selectedPlatforms.filter((platform) => {
      return options.some((option) => option.value === platform);
    });
    const initialCheckboxes = options.reduce(
      (acc, option) => {
        acc[option.value] = filteredSelectedPlatforms.includes(option.value);
        return acc;
      },
      { selectAll: filteredSelectedPlatforms.length === options.length }
    );
    setCheckboxes(initialCheckboxes);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onCancel(); // Close the popup if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  const handleCheckboxChange = (e) => {
    console.log("inside handle");
    const { name, checked } = e.target;
    console.log(e, name, checked);
    if (name === "selectAll") {
      const updatedCheckboxes = {};
      for (const option of options) {
        updatedCheckboxes[option.value] = checked;
      }
      setCheckboxes({ ...updatedCheckboxes, selectAll: checked });
    } else {
      const updatedCheckboxes = {
        ...checkboxes,
        [name]: checked,
      };

      const { selectAll, ...updatedCheckboxesWithoutSelectAll } =
        updatedCheckboxes;
      const allChecked = Object.values(updatedCheckboxesWithoutSelectAll).every(
        (value) => {
          if (value !== "selectAll") {
            return value;
          }
          return true;
        }
      );
      updatedCheckboxes.selectAll = allChecked;

      setCheckboxes(JSON.parse(JSON.stringify(updatedCheckboxes)));
    }
  };
  return createPortal(
    <div
      ref={popupRef}
      className="absolute w-64 p-4 bg-white shadow-lg border rounded-lg z-[100]"
      style={{
        left: `${schedulerPosition.left}px`,
      }}
    >
      {error && <div className="text-red-500">{error}</div>}
      {options.length > 0 && <div className="mb-2 font-semibold">{title}</div>}
      {options.length === 0 ? (
        <div className="text-gray-500">No options available</div>
      ) : (
        <>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              name="selectAll"
              checked={checkboxes.selectAll}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Select All</span>
          </label>
          {options.map((option) => (
            <label key={option.value} className="flex items-center mb-2">
              <input
                type="checkbox"
                name={option.value}
                checked={checkboxes[option.value]}
                onChange={handleCheckboxChange}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </>
      )}
      <div className="flex justify-end mt-4 space-x-2">
        <button className="border p-1 rounded w-16" onClick={onCancel}>
          Cancel
        </button>
        {options.length > 0 && (
          <button
            className="bg-blue-500 p-1 rounded w-16 text-white"
            onClick={() => onApply(checkboxes)}
          >
            Apply
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default EditPopup;