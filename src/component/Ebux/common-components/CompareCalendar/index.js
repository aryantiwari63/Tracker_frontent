import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DateRangePicker, createStaticRanges } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { IoClose } from "react-icons/io5";
import moment from "moment";
import { trackDashboardClick } from "../../../../analytics/EventController";
import { useEbuxContext } from "../../Context/EbuxProvider";


const CompareCalendar = ({ onChange, defaultSelected, defaultValue, calendarPosition }) => {

  const {  activeClientProject} = useEbuxContext();
  
  const max_date = activeClientProject?.client_project_id == 17 ? "2025-05-13" : new Date(moment(new Date()).subtract(1, "days").format("YYYY-MM-DD"));
  const min_date = activeClientProject?.client_project_id == 17 ? "2025-05-01" : "2024-01-01";

  const [dateRange, setDateRange] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
    compare: {
      startDate: new Date(),
      endDate: addDays(new Date(), 3),
      key: "compare",
    },
  });

  const [previousDateRange, setPreviousDateRange] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
    compare: {
      startDate: new Date(),
      endDate: addDays(new Date(), 3),
      key: "compare",
    },
  });

  const [selectedRange, setSelectedRange] = useState(7);
  const [customMenu, setCustomMenu] = useState(true);
  const [filterType, setFilterType] = useState("customRange");
  const [previousMenu, setPreviousMenu] = useState(true);
  const [compareToPrevious, setCompareToPrevious] = useState(false);
  const [showCalender, setShowCalender] = useState(false);

  const refOne = useRef(null);

  const calculateCustomRange = (days) => {
    const endDate = new Date(max_date);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (days - 1));
    return { startDate, endDate };
  };


  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setShowCalender(false);
    }
  };

  useLayoutEffect(() => {
    if (defaultSelected > 1) {
      let { startDate, endDate } = calculateCustomRange(defaultSelected);
      setDateRange({
        ...dateRange,
        selection: {
          ...dateRange.selection,
          startDate: startDate,
          endDate: endDate,
        },
      });
    }
    if (defaultValue?.startDate) {
      // console.log("defaultValue------------",{defaultValue});

      setSelectedRange(0);
      setFilterType(`customRange-custom`);
      setDateRange((prev) => {
        return {
          ...prev,
          selection: {
            startDate: new Date(defaultValue.startDate),
            endDate: new Date(defaultValue.endDate),
            key: "selection",
          },
        };
      });
      if (defaultValue.isCompareToPrevious) {

        setSelectedRange(0);
        setFilterType(`previousRange-custom`);
        setCompareToPrevious(true);
        setPreviousDateRange((prev) => {
          return {
            ...prev,
            startDate: new Date(defaultValue.previousStartDate),
            endDate: new Date(defaultValue.previousEndDate),
            key: "selection",
            selection: {
              startDate: new Date(defaultValue.previousStartDate),
              endDate: new Date(defaultValue.previousEndDate),
              key: "selection"
            },
          };
        });
      } else {
        setCompareToPrevious(false);

      }
      // if (defaultValue?.selectedRange >= 0) {
      //   setSelectedRange(defaultValue.selectedRange);
      // }
    }
  }, [defaultValue]);
  // }, []);

  const handleSelect = (ranges) => {
    setDateRange({ ...dateRange, ...ranges });
    setSelectedRange(0);
    // setPreviousMenu(false);
    setCompareToPrevious(false);

  };
  const handleSelectPrevious = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setPreviousDateRange((prev) => {
      return {
        ...prev,
        selection: {
          startDate: startDate,
          endDate: endDate,
          key: "selection",
        },
      };
    });
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
    }
  ]);
  const customStaticMonth = createStaticRanges([
    {
      label: "Month-to-Date",
      value: 'this-month',
      days: 31,
      range: () => ({ startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), endDate: new Date() }),
    },
    {
      label: "Last Month",
      value: 'last-month',
      days: 32,
      range: () => { let currentMonth = new Date().getMonth(), currentYear = new Date().getFullYear(); return { startDate: new Date(currentMonth - 1 == 0 ? currentYear - 1 : currentYear, currentMonth - 1 == 0 ? 12 : currentMonth - 1, 1), endDate: new Date(currentYear, currentMonth, 0) } },
    },
  ]);
  const customStaticStartEnd = createStaticRanges([
    {
      label: "Yesterday",
      value: 'yesterday',
      days: 1,
      range: () => { let endDate = new Date(); endDate.setDate(endDate.getDate() - 1); return { startDate: endDate, endDate } },
    },
  ]);

  const handleStaticRangeClick = (range) => {
    const { startDate, endDate } = calculateCustomRange(range);
    setDateRange({
      ...dateRange,
      selection: {
        startDate,
        endDate,
        key: "selection",
      },
    });
    setFilterType("customRange");
    setSelectedRange(range);
    setPreviousMenu(false);
    setCompareToPrevious(false);
  };
  const handleStaticMonthClick = (item) => {
    const { startDate, endDate } = item.range();
    setDateRange({
      ...dateRange,
      selection: {
        startDate,
        endDate,
        key: "selection",
      },
    });
    setFilterType(`customRange-${item.value}`);
    setSelectedRange(item?.days ?? 0);
    setPreviousMenu(false);
    setCompareToPrevious(false);
  };
  const handlePreviousRangeClick = () => {
    if (filterType == "customRange") {
      // const range = selectedRange + selectedRange;
      // const endDate = new Date();
      // const startDate = new Date();
      // startDate.setDate(endDate.getDate() - (range - 1));
      // endDate.setDate(endDate.getDate() - selectedRange);
      // setPreviousDateRange((prev) => {
      //   return {
      //     ...prev,
      //     selection: {
      //       startDate: startDate,
      //       endDate: endDate,
      //       key: "selection",
      //     },
      //   };
      // });

      const currentStart = new Date(dateRange.selection.startDate);

      const previousEndDate = new Date(currentStart);
      previousEndDate.setDate(previousEndDate.getDate() - 1);

      const previousStartDate = new Date(previousEndDate);
      previousStartDate.setDate(previousStartDate.getDate() - (selectedRange - 1));

      setPreviousDateRange((prev) => ({
        ...prev,
        selection: {
          startDate: previousStartDate,
          endDate: previousEndDate,
          key: "selection",
        },
      }));
      
      setFilterType("previousRange");
    } else {
      // const range = selectedRange + selectedRange;
      // console.log({ selectedRange });
      // console.log(dateRange?.selection?.startDate);

      let endDate = dateRange?.selection?.startDate ? new Date(moment(new Date(dateRange?.selection?.startDate)).subtract((1), "days")) : new Date();
      let startDate = selectedRange > 30 ? new Date(moment(dateRange?.selection?.startDate).subtract((1), "months")) : endDate;
      setPreviousDateRange((prev) => {
        return {
          ...prev,
          selection: {
            startDate: startDate,
            endDate: endDate,
            key: "selection",
          },
        };
      });
      setFilterType("previousRange");
    }
    // setSelectedRange(1);
  };

  const getPlaceholder = () => {
    // if (compareToPrevious && (new Date(previousDateRange.selection.startDate).getDate() !== new Date(previousDateRange.selection.endDate).getDate() )) {
    //   return "Custom Ranges";
    // }
    if (compareToPrevious && previousDateRange) {
      if (filterType !== 'previousRange' && filterType == 'previousRange-custom' && filterType !== 'customRange') {
        return "Custom Ranges";
      }

    }

    if (selectedRange >= 1) {
      let selRangeLabel = customStaticRanges.find(
        (item) => item.value === selectedRange
      );
      if (!selRangeLabel?.label) {
        selRangeLabel = [...customStaticStartEnd, ...customStaticMonth].find(
          (item) => (filterType === `customRange-${item.value}` || selectedRange === item.days)
        );
      }
      return selRangeLabel?.label;
    } else {
      let selMonthLabel = customStaticMonth.find(
        (item) => filterType === `customRange-${item.value}`
      );
      if (selMonthLabel?.label) {
        return selMonthLabel?.label;
      } else {
        let filterDate = `${dateRange.selection.startDate.toLocaleString(
          "en-GB",
          {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }
        )} - ${dateRange.selection.endDate &&
        dateRange.selection.endDate.toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
          }`;
        return filterDate;

      }
    }
  };

  const handleClear = () => {
    setShowCalender(false);



    // for future use (to reset the value last applied)
    if (defaultValue?.startDate && defaultValue?.endDate) {
      // let payload;
      setDateRange((prev) => {
        return {
          ...prev,
          selection: {
            startDate: new Date(defaultValue.startDate),
            endDate: new Date(defaultValue.endDate),
            key: "selection",
          },
        };
      });

      setCompareToPrevious(defaultValue.isCompareToPrevious);
      if (defaultValue.isCompareToPrevious) {

        setPreviousDateRange((prev) => {
          return {
            ...prev,
            selection: {
              startDate: new Date(defaultValue?.previousStartDate),
              endDate: new Date(defaultValue?.previousEndDate),
              key: "selection",
            },
          };
        });
      }
      if (defaultValue?.selectedRange >= 0) {
        setSelectedRange(defaultValue.selectedRange);
      } else if (defaultSelected > 1) {
        setSelectedRange(defaultSelected)
      } else {
        setSelectedRange(7)
      }

      // onChange(payload);
    } else if (defaultSelected > 1) {
      let { startDate, endDate } = calculateCustomRange(defaultSelected);
      setDateRange({
        ...dateRange,
        selection: {
          ...dateRange.selection,
          startDate: startDate,
          endDate: endDate,
        },
      });
      setSelectedRange(defaultSelected)
    } else {
      let { startDate, endDate } = calculateCustomRange(7);
      setDateRange({
        ...dateRange,
        selection: {
          ...dateRange.selection,
          startDate: startDate,
          endDate: endDate,
        },
      });
      setSelectedRange(7)
    }
  };

  const handleApplyFilter = () => {
    setShowCalender(false);
    if (compareToPrevious) {
      let payload = {
        customRange: dateRange.selection,
        previousRange: previousDateRange.selection,
        selectedRange: selectedRange,
      };
      onChange(payload);
    } else {
      let payload = {
        ...dateRange,
        selectedRange: selectedRange,
      };
      onChange(payload);
    }
  };

  const handleComparetoPreviousCheckbox = (e) => {
    const { checked } = e.target;

    if (checked) {
      setPreviousDateRange((prev) => {
        return {
          ...prev,
          selection: {
            startDate: addDays(
              dateRange.selection.startDate,
              -1
            ),
            endDate: addDays(
              dateRange.selection.startDate,
              -1
            ),
            key: "selection",
          },
        };
      });
    } else {
      setPreviousDateRange((prev) => {
        return {
          ...prev,
          selection: {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
          },
        };
      });
    }
  };

  const handleClickOutside = (event) => {
    if (refOne.current && !refOne.current.contains(event.target)) {
      // console.log("Clicked outside the modal", selectedRange);
      // setShowCalender(false); // Close the modal
      if (selectedRange > 30 || selectedRange == 1) {
        const selectedItem = [...customStaticStartEnd, ...customStaticMonth].find(
          (item) => (filterType === `customRange-${item.value}` || selectedRange === item.days)
        );
        if (selectedItem) {
          handleStaticMonthClick(selectedItem)
        } else {
          handleStaticRangeClick(7)
        }
      } else {
        if (selectedRange == 0) {
          setShowCalender(false);
        } else {
          handleStaticRangeClick(selectedRange > 1 ? selectedRange : 7)
        }

      }
    }
  };

  useEffect(() => {
    if (showCalender) {
      // Add event listener when modal is open
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      // Cleanup event listener when modal is closed
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalender]);

  return (
    <div className="relative rmsc dropdown-container w-full">
      {/* <div
        className="border h-3 w-full dropdown-heading z-0"
        onClick={() => setShowCalender(!showCalender)}
      > */}
      <div className="relative">
        <div
          className="border h-3 w-full dropdown-heading z-0 rounded border-gray-300"
          onClick={(e) => {
            trackDashboardClick({ section: 'Top filters', eventcategory: '', eventaction: e.type, eventlabel: 'date range' })
            setShowCalender(!showCalender)
          }}
        >
          {getPlaceholder()}
        </div>
        <div className="absolute right-2 top-1 z-0 ">
          <img
            src="/chevron-down.svg"
            className={[
              showCalender
                ? "rotate-0 w-6 h-6 opacity-60 text-gray-300"
                : "rotate-180 w-6 h-6 opacity-60",
            ].join()}
          />
        </div>
      </div>
      {showCalender && (
        <div
          className={`absolute top-full translate-y-1 z-[999] w-[700px] ${calendarPosition == "left" ? "left-0" : "right-0"}`}
          ref={refOne}
        >
          <div className="header flex justify-between items-center p-2 border-b bg-[#F1F1F1]">
            <div className="flex w-[95%] gap-4">
              {/* current */}
              <button
                style={{
                  fontWeight: compareToPrevious ? 'normal' : 'bold',
                  backgroundColor: compareToPrevious ? '#eee' : '#2563eb',
                  color: compareToPrevious ? '#999' : '#fff',
                  padding: '6px 12px',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  cursor: compareToPrevious ? 'not-allowed' : 'pointer',
                }}
              >
                <strong>Current Period: </strong>
                {dateRange.selection?.startDate && dateRange.selection?.endDate && (() => {
                  const start = new Date(dateRange.selection.startDate);
                  const end = new Date(dateRange.selection.endDate);

                  const startMonth = start.toLocaleString('en-US', { month: 'short' });
                  const endMonth = end.toLocaleString('en-US', { month: 'short' });

                  const startDay = start.getDate();
                  const endDay = end.getDate();

                  const startYear = start.getFullYear();
                  const endYear = end.getFullYear();
                  if (startYear === endYear && startMonth === endMonth) {
                    return `${startMonth} ${startDay} – ${endDay}, ${endYear}`;
                  }
                  if (startYear === endYear) {
                    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${endYear}`;
                  }
                  return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
                })()}
              </button>
              {/* previous */}
              {compareToPrevious ?
                (<button
                  style={{
                    fontWeight: compareToPrevious ? 'bold' : 'normal',
                    backgroundColor: compareToPrevious ? '#2563eb' : '#eee',
                    color: compareToPrevious ? '#fff' : '#999',
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    cursor: compareToPrevious ? 'pointer' : 'not-allowed',
                  }}
                >
                  <strong>Previous Period: </strong>
                  {previousDateRange.selection?.startDate && previousDateRange.selection?.endDate && (() => {
                    const start = new Date(previousDateRange.selection.startDate);
                    const end = new Date(previousDateRange.selection.endDate);

                    const startMonth = start.toLocaleString('en-US', { month: 'short' });
                    const endMonth = end.toLocaleString('en-US', { month: 'short' });

                    const startDay = start.getDate();
                    const endDay = end.getDate();

                    const startYear = start.getFullYear();
                    const endYear = end.getFullYear();
                    if (startYear === endYear && startMonth === endMonth) {
                      return `${startMonth} ${startDay} - ${endDay}, ${endYear}`;
                    }
                    if (startYear === endYear) {
                      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
                    }
                    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
                  })()}
                </button>)
                : (<></>)}
            </div>
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
                  <ul className="space-y-2 h-[300px] overflow-auto">
                    <li>
                      <div
                        onClick={() => setCustomMenu(!customMenu)}
                        className={`cursor-pointer flex items-center p-2 text-sm font-normal  rounded-lg ${customMenu && " "
                          } ${compareToPrevious
                            ? "bg-[#F2F2F2]"
                            : "bg-[#F0F7FF] text-[#0081F7]"
                          }`}
                      >
                        <span className={`ml-3`}>Current Date Range</span>
                        <i className="ml-2 fas fa-chevron-down"></i>
                      </div>
                      {customMenu && (
                        <ul
                          className=" text-center w-full overflow-auto "
                        // style={{ maxHeight: "250px" }}
                        >
                          {customStaticStartEnd.map((item, i) => (
                            <li key={i}>
                              <button
                                onClick={() =>
                                  handleStaticMonthClick(item)
                                }
                                className={`w-full py-2    disabled:cursor-not-allowed   ${(filterType === `customRange-${item.value}` && selectedRange === item.days) &&
                                  "bg-[#0081F70F] text-[#0081F7]"
                                  }`}
                                disabled={compareToPrevious}
                              >
                                <span className=" w-full text-sm font-normal ">
                                  {item.label}
                                </span>
                              </button>
                            </li>
                          ))}
                          {customStaticRanges.map((item, i) => (
                            <li key={i}>
                              <button
                                onClick={() =>
                                  handleStaticRangeClick(item.value)
                                }
                                className={`w-full py-2    disabled:cursor-not-allowed   ${selectedRange === item.value &&
                                  "bg-[#0081F70F] text-[#0081F7]"
                                  }`}
                                disabled={compareToPrevious}
                              >
                                <span className=" w-full text-sm font-normal ">
                                  {item.label}
                                </span>
                              </button>
                            </li>
                          ))}
                          {customStaticMonth.map((item, i) => (
                            <li key={i}>
                              <button
                                onClick={() =>
                                  handleStaticMonthClick(item)
                                }
                                className={`w-full py-2    disabled:cursor-not-allowed   ${(filterType === `customRange-${item.value}` || selectedRange === item.days) &&
                                  "bg-[#0081F70F] text-[#0081F7]"
                                  }`}
                                disabled={compareToPrevious}
                              >
                                <span className=" w-full text-sm font-normal ">
                                  {item.label}
                                </span>
                              </button>
                            </li>
                          ))}
                          <li>
                            <button
                              onClick={() => {
                                setFilterType("customRange-custom");

                                // setSelectedRange(0);
                              }}
                              className={`w-full py-2    disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-black ${(filterType === "customRange-custom" || (selectedRange == 0)) ?
                                "bg-[#0081F70F] text-[#0081F7]" : ""
                                }`}
                              disabled={compareToPrevious}
                            >
                              <span className=" w-full text-sm font-normal ">
                                Custom
                              </span>
                            </button>
                          </li>

                          <li>
                            <div
                              className={`   ${compareToPrevious
                                ? " bg-[#F2F2F2] text-[#0081F7]" //"bg-[#F0F7FF] text-[#0081F7]"
                                : " bg-[#F2F2F2]"
                                }`}
                            >
                              <label className="px-2 flex gap-2 text-sm py-3">
                                <input
                                  className=""
                                  type="checkbox"
                                  checked={compareToPrevious}
                                  onChange={(e) => {
                                    // if (!e.target.checked && selectedRange == 0) {
                                    //   setFilterType("customRange-custom");
                                    // } else {
                                    //   setFilterType("previousRange-custom");
                                    // }

                                    setCompareToPrevious(e.target.checked);

                                    handleComparetoPreviousCheckbox(e);
                                  }}
                                />
                                <span>Compare to previous</span>
                              </label>
                            </div>
                            {compareToPrevious && (
                              <li>
                                <div
                                  onClick={() => setPreviousMenu(!previousMenu)}
                                  className={`cursor-pointer flex items-center p-2 text-sm font-normal text-gray-800  ${filterType.includes("previousRange") &&
                                    "bg-[#0081F70F] text-[#0081F7]"
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
                                    className=" text-center w-full overflow-auto "
                                  // style={{ maxHeight: "250px" }}
                                  >
                                    <li>
                                      <button
                                        className={`w-full py-2  disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-black ${filterType === "previousRange" &&
                                          "bg-[#0081F70F] text-[#0081F7]"
                                          }`}
                                        onClick={handlePreviousRangeClick}
                                        disabled={selectedRange < 1}
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
                                      className={`w-full py-2  ${filterType === "previousRange-custom" &&
                                        "bg-[#0081F70F] text-[#0081F7]"
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
                {compareToPrevious ? (
                  <>
                    {/* Previous date range calender start
                    {JSON.stringify(previousDateRange.selection.startDate)} */}
                    <div className="col-span-5 row w-full">
                      <div className="compareCalender w-full">
                        {filterType === "previousRange-custom" ? (
                          <div
                            className={[
                              "h-0 overflow-hidden",
                              filterType === "previousRange-custom" && "h-max",
                            ].join(" ")}
                          >
                            <DateRangePicker
                              ranges={[previousDateRange.selection]}
                              onChange={handleSelectPrevious}
                              months={1}
                              direction="vertical"
                              staticRanges={[]}
                              inputRanges={[]}
                              // maxDate={dateRange.selection.startDate}
                              maxDate={addDays(
                                dateRange.selection.startDate,
                                -1
                              )}
                              scroll={{ enabled: false }}
                            />
                          </div>
                        ) : (
                          <DateRangePicker
                            ranges={[previousDateRange.selection]}
                            onChange={handleSelectPrevious}
                            months={1}
                            direction="vertical"
                            staticRanges={[]}
                            inputRanges={[]}
                            maxDate={dateRange.selection.startDate}
                            minDate={addDays(new Date(), +1)}
                          />
                        )}
                      </div>
                    </div>
                    {/* Previous date range calender ends */}
                  </>
                ) : (
                  <>
                    {/* Custom date range calender start */}
                    <div className="col-span-5 row w-full">
                      <div className="compareCalender w-full">
                        {filterType === "customRange-custom" ? (
                          <div
                            className={[
                              "h-0 overflow-hidden",
                              filterType === "customRange-custom" && "h-max",
                            ].join(" ")}
                          >
                            <div className="calendar-scroll-area">
                              <DateRangePicker
                                ranges={[dateRange.selection]}
                                onChange={handleSelect}
                                months={1}
                                direction="vertical"
                                staticRanges={[]}
                                inputRanges={[]}
                                // maxDate={new Date()}
                                maxDate={new Date(max_date)}
                                minDate={new Date(min_date)}
                                scroll={{ enabled: false }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="calendar-scroll-area">
                            <DateRangePicker
                              ranges={[dateRange.selection]}
                              onChange={handleSelect}
                              months={1}
                              direction="vertical"
                              staticRanges={[]}
                              inputRanges={[]}
                              // maxDate={new Date()}
                              // minDate={addDays(new Date(), +1)}
                              maxDate={new Date(max_date)}
                              minDate={new Date(min_date)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Custom date range calender ends */}
                  </>
                )}
              </div>
            </div>
            <div className="border bg-white flex justify-end gap-3 p-1">
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