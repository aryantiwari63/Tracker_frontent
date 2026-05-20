import React, { useState, useEffect } from "react";
import { DateRangePicker, createStaticRanges } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { IoClose } from "react-icons/io5";
import { LuCalendarDays } from "react-icons/lu";

const CompareCalendar = ({ onChange, defaultSelected }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [previousDateRange, setPreviousDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [previousSelectedYear, setPreviousSelectedYear] = useState(new Date().getFullYear());
  const [previousSelectedMonth, setPreviousSelectedMonth] = useState(new Date().getMonth()); // Change to index (0-11)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Change to index (0-11)
  const [selectedRange, setSelectedRange] = useState(0);
  const [customMenu, setCustomMenu] = useState(true);
  const [filterType, setFilterType] = useState("customRange-custom");
  const [previousMenu, setPreviousMenu] = useState(false);
  const [compareToPrevious, setCompareToPrevious] = useState(false);
  const [showCalender, setShowCalender] = useState(false);

  const calculateCustomRange = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (days - 1));
    return { startDate, endDate };
  };

  const years = Array.from(
    { length: 50 },
    (v, i) => new Date().getFullYear() - i
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];  
  useEffect(() => {
    if (defaultSelected && [7, 15, 30].includes(defaultSelected)) {
      handleStaticRangeClick(defaultSelected,false);
    }
  }, [defaultSelected]);
  useEffect(() => {
    const date = new Date();
    const presentMonth = date.getUTCMonth();
    const presentYear = date.getFullYear();
    const today = date.getDate();
    if (
      selectedYear !== dateRange.startDate.getFullYear() ||
      selectedMonth !== dateRange.startDate.getMonth()
    ) {
      if (presentMonth === selectedMonth && selectedYear === presentYear) {
        setDateRange({
          startDate: new Date(selectedYear, selectedMonth, 1),
          endDate: new Date(selectedYear, selectedMonth, today),
          key: "selection",
        });
      } else {
        const newStartDate = new Date(selectedYear, selectedMonth, 1);
        const newEndDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day of the month
        setDateRange({
          startDate: newStartDate,
          endDate: newEndDate,
          key: "selection",
        });
      }
    }

  }, [selectedYear, selectedMonth]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setSelectedMonth(startDate.getMonth());
    setSelectedYear(startDate.getFullYear());
    setDateRange({ startDate, endDate, key: "selection" });
    setSelectedRange(0);
    setPreviousMenu(false);
    setCompareToPrevious(false);
  };
  const handleSelectPrevious = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setPreviousSelectedMonth(startDate.getMonth());
    setPreviousSelectedYear(startDate.getFullYear());
    setPreviousDateRange({ startDate, endDate, key: "selection" });
  };

  const customStaticRanges = createStaticRanges([
    {
      label: "Last 7 Days",
      value: 7,
      range: () => calculateCustomRange(7),
    },
    {
      label: "Last 15 Days",
      value: 15,
      range: () => calculateCustomRange(15),
    },
    {
      label: "Last 30 Days",
      value: 30,
      range: () => calculateCustomRange(30),
    },
  ]);

  const handleStaticRangeClick = (range,setAndApply=false) => {
    const { startDate, endDate } = calculateCustomRange(range);
    setDateRange({
      startDate,
      endDate,
      key: "selection",
    });
    setFilterType("customRange")
    setSelectedRange(range);
    setSelectedMonth(startDate.getMonth());
    setSelectedYear(startDate.getFullYear());
    setPreviousMenu(false);
    setCompareToPrevious(false);
    if(setAndApply){
      onChange({ customRange: {
        startDate,
        endDate,
        key: "selection",
      } });      
    }
  };
  const handlePreviousRangeClick = () => {
    const range = selectedRange + selectedRange;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - range);
    endDate.setDate(endDate.getDate() - selectedRange);
    setPreviousDateRange({
      startDate: startDate,
      endDate: endDate,
      key: "selection",
    });
    setFilterType("previousRange")
    setSelectedRange(1);
    setPreviousSelectedMonth(startDate.getMonth());
    setPreviousSelectedYear(startDate.getFullYear());
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    name === "month"
      ? setSelectedMonth(months.indexOf(value))
      : setSelectedYear(parseInt(value));
  };
  const getPlaceholder = () => {
    if ((compareToPrevious && previousDateRange)) {
      return 'Custom Ranges'
    }
    if (selectedRange > 1) {
      let selRangeLabel = customStaticRanges.find((item) => item.value === selectedRange)
      return selRangeLabel.label
    }
    else {
      let filterDate = `${dateRange.startDate.toLocaleString("en-GB", {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }
      )} - ${dateRange.endDate.toLocaleString("en-GB", {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }
      )}`
      return filterDate
    }
  }

  const handleClear = () => {
    setShowCalender(false)
    // onChange(dateRange)
    onChange({ customRange: dateRange })
  }
  const handleApplyFilter = () => {
    setShowCalender(false)
    if (compareToPrevious) {
      let payload = { customRange: dateRange, previousRange: previousDateRange }
      onChange(payload)
    } else {
      // onChange(dateRange)
      onChange({ customRange: dateRange });

    }
  }
  return (
    <div className="relative rmsc dropdown-container w-full">
      <div
        className="border h-3 w-full dropdown-heading"
        onClick={() => setShowCalender(!showCalender)}
      >
       <LuCalendarDays size={16}/> {getPlaceholder()}
      </div>
      {showCalender && (
        <div className="absolute top-full translate-y-1 right-0 z-[999] w-[700px]">
          <div className="header flex justify-between items-center p-2 border-b bg-[#F1F1F1]">
            <span className="text-base font-bold ">Select Date Range</span>
            <IoClose
              size={24}
              onClick={() => setShowCalender(false)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <>
            <div className="bg-white">
              <div className="grid grid-flow-col bg-white border">
                <div className="row-span-6 w-48 bg-white border-r-2 mt-1">
                  <ul className="space-y-2">
                    <li>
                      <div
                        onClick={() => setCustomMenu(!customMenu)}
                        className={`cursor-pointer flex items-center p-2 text-base font-normal text-gray-800 rounded-lg ${customMenu && "active-menu"
                          }`}
                      >
                        <span className={`ml-3`}>Current Date Range</span>
                        <i className="ml-2 fas fa-chevron-down"></i>
                      </div>
                      {customMenu && (
                        <ul
                          className="space-y-2 text-center w-full overflow-auto "
                          style={{ maxHeight: "250px" }}
                        >
                          {customStaticRanges.map((item, i) => (
                            <li
                              key={i}
                            >
                              <button
                                onClick={() =>
                                  handleStaticRangeClick(item.value)
                                }
                                className={`w-full py-2 hover:bg-gray-100 disabled:bg-gray-100 disabled:bg-opacity-60 disabled:cursor-not-allowed  ${selectedRange === item.value && "bg-gray-100"
                                  }`}
                                disabled={compareToPrevious}
                              >
                                <span className=" w-full text-sm font-normal ">
                                  {item.label}
                                </span>
                              </button>
                            </li>
                          ))}
                          <li
                          >
                            <button
                              onClick={() => {
                                setFilterType("customRange-custom");
                              }}
                              className={`w-full py-2 hover:bg-gray-100 disabled:bg-gray-100 disabled:bg-opacity-60 disabled:cursor-not-allowed  ${filterType === "customRange-custom" &&
                                "bg-gray-100"
                                }`}
                              disabled={compareToPrevious}
                            >
                              <span className=" w-full text-sm font-normal ">
                                Custom
                              </span>
                            </button>
                          </li>

                          <li>
                            <div>
                              <label className="ml-3">
                                <input
                                  type="checkbox"
                                  checked={compareToPrevious}
                                  onChange={(e) => {
                                    setCompareToPrevious(e.target.checked)
                                    if (!e.target.checked) {
                                      setPreviousDateRange({
                                        startDate: new Date(),
                                        endDate: new Date(),
                                        key: "selection",
                                      })
                                    }
                                  }
                                  }
                                />
                                <span className="text-base font-medium px-1">
                                  Compare to previous
                                </span>
                              </label>
                            </div>
                            {compareToPrevious && (
                              <li>
                                <div
                                  onClick={() =>
                                    setPreviousMenu(!previousMenu)
                                  }
                                  className={`cursor-pointer flex items-center p-2 text-base font-normal text-gray-800 rounded-lg ${filterType === "previousRange" &&
                                    "active-menu"
                                    }`}
                                >
                                  <span
                                    className={`ml-3 text-sm font-medium col`}
                                  >
                                    Previous Date Range
                                  </span>
                                  <i className="ml-2 fas fa-chevron-down"></i>
                                </div>
                                {previousMenu && (
                                  <ul
                                    className="space-y-2 text-center w-full overflow-auto "
                                    style={{ maxHeight: "250px" }}
                                  >
                                    <li
                                    >
                                      <button
                                        className={`w-full py-2 hover:bg-gray-100 disabled:cursor-not-allowed ${selectedRange === 1 && "bg-gray-100"
                                          }`}
                                        onClick={handlePreviousRangeClick}
                                        disabled={selectedRange <= 1}
                                      >
                                        <span className=" w-full text-sm font-normal">
                                          Previous Period
                                        </span>
                                      </button>
                                    </li>
                                    <li
                                      onClick={() => {
                                        setFilterType("previousRange-custom");
                                      }}
                                      className={`w-full py-2 hover:bg-gray-100 ${filterType ===
                                        "previousRange-custom" &&
                                        "bg-gray-100"
                                        }`}
                                    >
                                      <span className=" w-full text-sm font-normal cursor-pointer ">
                                        Custom
                                      </span>
                                    </li>
                                  </ul>
                                )}
                              </li>
                            )}
                          </li>
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
                {
                  compareToPrevious ?
                    <>
                      {/* Previous date range calender start */}
                      <div className="row w-full">
                        <div className="w-full flex  h-14 gap-2 bg-white mb-2">
                          <div className="rounded-sm m-2 px-2 py-2 border">
                            <select
                              value={previousSelectedYear}
                              onChange={handleFilterChange}
                              name="year"
                              disabled={!filterType.includes("-custom")}
                              className="disabled:cursor-not-allowed"
                            >
                              {years.map((year, index) => (
                                <option
                                  key={index}
                                  value={year}
                                  className="text-center"
                                >
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="rounded-sm m-2 px-2 py-2 border">
                            <select
                              value={months[previousSelectedMonth]}
                              onChange={handleFilterChange}
                              name="month"
                              disabled={!filterType.includes("-custom")}
                              className="disabled:cursor-not-allowed "
                            >
                              {months.map((month, index) => (
                                <option
                                  key={index}
                                  value={month}
                                  className="text-center "
                                >
                                  {month}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="border rounded-sm col m-2 px-2 py-2 text-center">
                            <div className="">
                              {previousDateRange.startDate
                                .toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "2-digit",
                                })
                                .replace(/\//g, "-")}
                            </div>
                          </div>
                          <div className="self-center">-</div>
                          <div className="border rounded-sm col m-2 px-2 py-2 text-center">
                            <div className="">
                              {previousDateRange.endDate
                                .toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "2-digit",
                                })
                                .replace(/\//g, "-")}
                            </div>
                          </div>
                        </div>

                        <div className="compareCalender">
                          <DateRangePicker
                            ranges={[previousDateRange]}
                            onChange={handleSelectPrevious}
                            months={1}
                            direction="vertical"
                            staticRanges={[]}
                            inputRanges={[]}
                            minDate={
                              filterType.includes("-custom")
                                ? null
                                : addDays(new Date(), 1)
                            }
                            maxDate={new Date()}
                          />
                        </div>
                      </div>
                      {/* Previous date range calender ends */}
                    </> :
                    <>
                      {/* Custom date range calender start */}
                      <div className="row w-full">
                        <div className="w-full flex  h-14 gap-2 bg-white mb-2">
                          <div className="rounded-sm m-2 px-2 py-2 border">
                            <select
                              value={selectedYear}
                              onChange={handleFilterChange}
                              name="year"
                              disabled={!filterType.includes("-custom")}
                              className="disabled:cursor-not-allowed"
                            >
                              {years.map((year, index) => (
                                <option
                                  key={index}
                                  value={year}
                                  className="text-center"
                                >
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="rounded-sm m-2 px-2 py-2 border">
                            <select
                              value={months[selectedMonth]}
                              onChange={handleFilterChange}
                              name="month"
                              disabled={!filterType.includes("-custom")}
                              className="disabled:cursor-not-allowed "
                            >
                              {months.map((month, index) => (
                                <option
                                  key={index}
                                  value={month}
                                  className="text-center "
                                >
                                  {month}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="border rounded-sm col m-2 px-2 py-2 text-center">
                            <div className="">
                              {dateRange.startDate
                                .toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "2-digit",
                                })
                                .replace(/\//g, "-")}
                            </div>
                          </div>
                          <div className="self-center">-</div>
                          <div className="border rounded-sm col m-2 px-2 py-2 text-center">
                            <div className="">
                              {dateRange.endDate
                                .toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "2-digit",
                                })
                                .replace(/\//g, "-")}
                            </div>
                          </div>
                        </div>

                        <div className="compareCalender">
                          <DateRangePicker
                            ranges={[dateRange]}
                            onChange={handleSelect}
                            months={1}
                            direction="vertical"
                            staticRanges={[]}
                            inputRanges={[]}
                            minDate={
                              filterType.includes("-custom")
                                ? null
                                : addDays(new Date(), 1)
                            }
                            maxDate={new Date()}
                          />
                        </div>
                      </div>
                      {/* Custom date range calender ends */}
                    </>
                }
              </div>
            </div>
            <div className="border bg-white flex justify-end gap-3 p-4">
              <button
                className="h-8 px-2 border rounded w-[78px]"
                onClick={handleClear}
              >
                Cancel
              </button>
              <button
                className="h-8 px-2 border rounded w-[78px] bg-[#0081F7] text-white"
                onClick={handleApplyFilter}
              >
                Apply
              </button>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default CompareCalendar;
