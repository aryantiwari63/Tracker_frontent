import React from "react";
import "../../DatePicker/style.css";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { convertDateFormat } from "../../../utils/helpers";

const DatePickerModal = ({
  setDateRange,
  applyDate,
  dateRange,
  setQuickFilter,
  calendar,
  color,
  onCancel,
  component,
  // savedDates,
}) => {
  const getMaxDate = (date) => {
    if (!date) {
      return new Date(); // Return current date as default
    }
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year, month, day); // Set the date to the current day of the current month
  };

  const maxDate = React.useMemo(() => getMaxDate(new Date()), []);

  // useEffect(() => {
  //   // Select all elements with the class name 'target-class'
  //   const targetElements = document.querySelectorAll(".custom-date ");

  //   targetElements.forEach((targetElement, index) => {
  //     // Assign a unique ID to each target element
  //     console.log("targetElement>>>>>>>", targetElement.className);
  //     // targetElement.id = `custom-id-${index}`;
  //   });
  // }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg z-50">
        <div className="flex justify-between bg-[#f8f8f8] py-6 px-4">
          <div className="font-medium text-[16px]">Custom Date Range</div>
          <i
            className="fa fa-times cursor-pointer"
            onClick={() => {
              onCancel();
              setQuickFilter(calendar?.from);
            }}
          ></i>
        </div>
        <div className="border-t px-6">
          <div>
            <DateRangePicker
              className="custom-date"
              onChange={(item) => setDateRange(item)}
              moveRangeOnFirstSelection={false}
              editableDateInputs
              ranges={[dateRange]}
              direction="horizontal"
              months={2}
              showSelectionPreview={false}
              showMonthAndYearPickers={false}
              showDateDisplay={false}
              showMonthArrow={true}
              rangeColors={Array.from({ length: 3 }, () => color)}
              staticRanges={[...defaultStaticRanges]}
              maxDate={maxDate}
            />
          </div>
        </div>

        <div className="calenderBtnContainer p-6">
          <div className="calDate">
            {convertDateFormat(dateRange.startDate)} -{" "}
            {convertDateFormat(dateRange.endDate)}
          </div>
          <button
            className={[
              "calBtnCancel",
              component === "custom-report" && "calBtnCancel--customreport",
            ].join(" ")}
            onClick={() => {
              onCancel();
              setQuickFilter(calendar?.from);
            }}
          >
            Cancel
          </button>
          <button
            className="calBtnApply hover:!bg-black"
            style={{ backgroundColor: color }}
            onClick={() => applyDate(calendar?.from)}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePickerModal;
