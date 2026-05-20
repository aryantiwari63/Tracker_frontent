import React, { useRef, useEffect, useState } from "react";
import moment from "moment";
import DateRangeCalender from "./dateRangeCalender";
import "./style.css";
import { useDateRangeContext } from "./context/dateRangeProvider";
import { closeButtonIcon, customButtonIcon, deleteButtonIcon } from "./utils/icons";
import { samePeriodAsCurrent, samePeriodLastMonth, samePeriodLastQuarter } from "./utils/helper";
import { deleteSaveDateRange, saveNewDateRange } from "./services/saveDateRange.service";
const DateInput=({minDate:defaultMinDate,maxDate:defaultMaxDate,value:defaultValue
  ,onChange=()=>{}
})=>{
  
  const [date,setDate]=useState(moment(defaultValue&&moment(defaultValue).isValid()?defaultValue:new Date()).format("DD/MM/YYYY"));
  const [minDate,setMinDate]=useState(defaultMinDate&&moment(defaultMinDate).isValid()?defaultMinDate:new Date("2000-01-01"));
  const [maxDate,setMaxDate]=useState(defaultMaxDate&&moment(defaultMaxDate).isValid()?defaultMaxDate:new Date());
  useEffect(() => {
    setMinDate(defaultMinDate&&moment(defaultMinDate).isValid()?defaultMinDate:new Date("2000-01-01"));  
  },[defaultMinDate])
  useEffect(() => {
    setMaxDate(defaultMaxDate&&moment(defaultMaxDate).isValid()?defaultMaxDate:new Date());  
  },[defaultMaxDate])
  useEffect(() => {
    setDate(moment(defaultValue&&moment(defaultValue).isValid()?defaultValue:new Date()).format("DD/MM/YYYY"));  
  },[defaultValue])
  useEffect(() => {      
    if (moment(date, "DD/MM/YYYY", true).isValid()){
      const parsed = moment(date, "DD/MM/YYYY", true);
      if(parsed.isSameOrAfter(minDate) && parsed.isSameOrBefore(maxDate)) {
        // console.log(
        //   {minDate},
        //   {maxDate},
        //   {defaultValue},
        //   {date},
        //   "isValid",parsed.isValid(),
        //   "isSameOrAfter",parsed.isSameOrAfter(minDate),
        //   "isSameOrBefore",parsed.isSameOrBefore(maxDate)
        // )
        onChange(new Date(parsed.format("YYYY-MM-DD")));
      }else{
        onChange(new Date(defaultValue));
      }
    } 
  },[date])
  return (
    <input
          type="text"
          maxLength={10}
          className="border rounded max-w-[90px]  px-1 py-1 text-[13px]"
          value={date}
          onChange={(e) => {
            let dateStr = e.target.value;
            dateStr = dateStr.replace(/[^0-9/]/g, "");
            if ((/^\d{2}$/.test(dateStr))||(/^\d{2}\/\d{2}$/.test(dateStr))){
              dateStr = dateStr + "/";
            }
            setDate(dateStr);            
          }}
          onBlur={(e) => {
            let dateStr = e.target.value;
            dateStr = dateStr.replace(/[^0-9/]/g, "");
            if (moment(dateStr, "DD/MM/YYYY", true).isValid()){
              setDate(dateStr);
            }else{
              setDate(defaultValue);
            }
          }}
        />
  )
}

const DateRangePeriod = ({ label = "Current Period", maxDate = new Date(), isDisabled = false, period = { startDate: new Date(), endDate: new Date() }, setPeriod = () => { }, setActiveFilters = () => { }, comparisonMode = true,activeDateRangePicker= true,setActiveDateRangePicker = () => { } }) => {
  const onDateChange = (newRange) => {
    if (newRange?.start && newRange?.end) {
      setPeriod((old) => ({ ...old, startDate: newRange?.start, endDate: newRange?.end }));
      setActiveFilters("Custom");
    }
  };
  const isFirstRender = useRef(true);
  useEffect(()=>{
    isFirstRender.current=true;
  },[period?.startDate,period?.endDate])
  return (
    <div className="relative">

      <h3 className="font-semibold">{label}</h3>
      <div className="flex items-center gap-1">
        <label className="text-[13px]">From:</label>
        <DateInput 
        // minDate={} 
        maxDate={maxDate} 
        value={period?.startDate} 
        
        onChange={(e) => {
            const dateStr = e;
            if (moment(dateStr, "DD/MM/YYYY", true).isValid()) {
              if(!isFirstRender.current&&!moment(dateStr, "DD/MM/YYYY", true).isSame(moment(period?.startDate, "DD/MM/YYYY", true), "day")){
                setActiveFilters("Custom");
              }
              
              const newStart = new Date(dateStr);
              setPeriod((old) => {
                const newEnd = newStart > old.endDate ? newStart : old.endDate;
                return { ...old, startDate: newStart, endDate: newEnd };
              });
            } else {
              console.error("Invalid date format:", dateStr);
            }
          }}
        />
        {/* <input
          type="date"
          max={moment(maxDate).format("YYYY-MM-DD")}
          className="border rounded  px-1 py-1 text-[13px]"
          value={moment(period?.startDate)?.format("YYYY-MM-DD")}
          onChange={(e) => {
            const dateStr = e.target.value;
            if (moment(dateStr, "YYYY-MM-DD", true).isValid()) {
              setActiveFilters("Custom");
              const newStart = new Date(dateStr);
              setPeriod((old) => {
                const newEnd = newStart > old.endDate ? newStart : old.endDate;
                return { ...old, startDate: newStart, endDate: newEnd };
              });
            } else {
              console.error("Invalid date format:", dateStr);
            }
          }}
        /> */}
        <label className="text-[13px]">To:</label>
        <DateInput 
        minDate={period?.startDate} 
        maxDate={maxDate} 
        value={period?.endDate} 
        onChange={(e) => {
            const dateStr = e;
            if (moment(dateStr, "DD/MM/YYYY", true).isValid()) {
              if(!isFirstRender.current&&!moment(dateStr, "DD/MM/YYYY", true).isSame(moment(period?.endDate, "DD/MM/YYYY", true), "day")){
                setActiveFilters("Custom");
              }
              const newEnd = new Date(dateStr);
              setPeriod((old) => {
                const newStart = newEnd < old.startDate ? newEnd : old.startDate;
                return { ...old, startDate: newStart, endDate: newEnd };
              });
              isFirstRender.current=false;
            } else {
              console.error("Invalid date format:", dateStr);
            }
          }}
        />
        {/* <input
          type="date"
          min={moment(period?.startDate).format("YYYY-MM-DD")}
          max={moment(maxDate).format("YYYY-MM-DD")}
          className="border rounded px-1 py-1 text-[13px]"
          value={moment(period?.endDate)?.format("YYYY-MM-DD")}
          onChange={(e) => {
            const dateStr = e.target.value;
            if (moment(dateStr, "YYYY-MM-DD", true).isValid()) {
              setActiveFilters("Custom");
              const newEnd = new Date(dateStr);
              setPeriod((old) => {
                const newStart = newEnd < old.startDate ? newEnd : old.startDate;
                return { ...old, startDate: newStart, endDate: newEnd };
              });
            } else {
              console.error("Invalid date format:", dateStr);
            }
          }}
        /> */}
      </div>
      <DateRangeCalender onChange={(newRange)=>onDateChange(newRange)} defaultStart={period?.startDate} defaultEnd={period?.endDate} monthsToShow={comparisonMode ? 1 : 2} maxDate={maxDate} />
      {isDisabled && (
        <div className="absolute top-0 z-2 left-0 rounded-lg p-1  right-0 bottom-0 items-center bg-white opacity-75 gap-2 cursor-not-allowed hover:cursor-pointer" onClick={()=>{setActiveDateRangePicker(!activeDateRangePicker)}}></div>
      )}
    </div>
  );
}

export default function DateRangePicker({allowedMaxDate, onChange = () => { }, defaultCurrentFilters = "Last 7 days", defaultPreviousFilters = "Previous Period", defaultComparisonMode, defaultCurrentStart, defaultCurrentEnd, defaultPreviousStart, defaultPreviousEnd }) {
  const { loadSavedDateRanges,savedDateRanges,   setDisplayDateRangePicker, isOpenCurrentDateRangePicker } = useDateRangeContext();

  const [comparisonMode, setComparisonMode] = useState(defaultComparisonMode);

  const [currentPeriod, setCurrentPeriod] = useState({ startDate: defaultCurrentStart ?? allowedMaxDate, endDate: defaultCurrentEnd ?? allowedMaxDate });
  const [previousPeriod, setPreviousPeriod] = useState({ startDate: defaultPreviousStart ?? allowedMaxDate, endDate: defaultPreviousEnd ?? allowedMaxDate });

  const [activeCurrentFilters, setActiveCurrentFilters] = useState(defaultCurrentFilters);
  const [activePreviousFilters, setActivePreviousFilters] = useState(defaultPreviousFilters);

  const [activeDateRangePicker, setActiveDateRangePicker] = useState(true);


  useEffect(() => {
    if (isOpenCurrentDateRangePicker || !comparisonMode) {
      setActiveDateRangePicker(true);
    } else {
      setActiveDateRangePicker(false);
    }
  }, [isOpenCurrentDateRangePicker]);

  const isFirstload = useRef(true);
  useEffect(() => {    
    if (comparisonMode&&comparisonMode!=defaultComparisonMode) {
        // console.log("xxxxxxxxxxxxxxxxxxx");
      samePeriodAsCurrent(currentPeriod, setPreviousPeriod, "Previous Period", setActivePreviousFilters);
    }
  }, [comparisonMode]);
  useEffect(() => {
    if (isFirstload.current) {
      isFirstload.current = false;
      return;
    }else{
      if (comparisonMode
        // &&
        // (!moment(currentPeriod?.startDate,"YYYY-MM-DD",true).isSame(moment(defaultCurrentStart,"YYYY-MM-DD",true), "day")||
        // !moment(currentPeriod?.endDate,"YYYY-MM-DD",true).isSame(moment(defaultCurrentEnd,"YYYY-MM-DD",true), "day"))
      ) {
        // console.log("ffffffffffffffff",moment(currentPeriod?.startDate,"YYYY-MM-DD",true),);
        samePeriodAsCurrent(currentPeriod, setPreviousPeriod, "Previous Period", setActivePreviousFilters);
      }
    }
  }, [JSON.stringify({ ...currentPeriod })]);
  const quickCurrentFilters = [
    {
      label: "Custom", isDisabled: false, onClick: () => {
        setActiveCurrentFilters("Custom");
      }, icon: customButtonIcon
    },
    {
      label: "Yesterday", isDisabled: false, onClick: () => {
        setCurrentPeriod({ startDate: allowedMaxDate, endDate: allowedMaxDate });
        setActiveCurrentFilters("Yesterday");
      }
    },
    {
      label: "Last 7 days", isDisabled: false, onClick: () => {
        const startDate = moment(allowedMaxDate).subtract(6, 'day').toDate();
        setCurrentPeriod({ startDate, endDate: allowedMaxDate });
        setActiveCurrentFilters("Last 7 days");
      }
    },
    {
      label: "Last 15 days", isDisabled: false, onClick: () => {
        const startDate = moment(allowedMaxDate).subtract(14, 'day').toDate();
        setCurrentPeriod({ startDate, endDate: allowedMaxDate });
        setActiveCurrentFilters("Last 15 days");
      }
    },
    {
      label: "Last 30 days", isDisabled: false, onClick: () => {
        const startDate = moment(allowedMaxDate).subtract(29, 'day').toDate();
        setCurrentPeriod({ startDate, endDate: allowedMaxDate });
        setActiveCurrentFilters("Last 30 days");
      }
    },
    {
      label: "Month-to-Date", isDisabled: false, onClick: () => {
        const startDate = moment(allowedMaxDate).startOf('month').toDate();
        setCurrentPeriod({ startDate, endDate: allowedMaxDate });
        setActiveCurrentFilters("Month-to-Date");
      }
    },
    {
      label: "Last Month", isDisabled: false, onClick: () => {
        const startDate = moment(allowedMaxDate).subtract(1, 'month').startOf('month').toDate();
        const endDate = moment(startDate).endOf('month').toDate();
        setCurrentPeriod({ startDate, endDate });
        setActiveCurrentFilters("Last Month");
      }
    },
    {
      label: "Last 3 Months", isDisabled: false, onClick: () => {
        const startDate = moment(allowedMaxDate).subtract(3, 'month').toDate();
        setCurrentPeriod({ startDate, endDate: allowedMaxDate });
        setActiveCurrentFilters("Last 3 Months");
      }
    }
  ];
  const quickPreviousFilters = [
    {
      label: "Custom", isDisabled: false, onClick: () => {
        setActivePreviousFilters("Custom")
      }, icon: customButtonIcon
    },
    {
      label: "Previous Period", isDisabled: false, onClick: () => {
        samePeriodAsCurrent(currentPeriod, setPreviousPeriod, "Previous Period", setActivePreviousFilters);
      }
    },
    {
      label: "Same Period Last Month", isDisabled: false, onClick: () => {
        samePeriodLastMonth(currentPeriod, setPreviousPeriod, "Same Period Last Month", setActivePreviousFilters);
      }
    },
    {
      label: "Same Period Last Quarter", isDisabled: false, onClick: () => {
        samePeriodLastQuarter(currentPeriod, setPreviousPeriod, "Same Period Last Quarter", setActivePreviousFilters);
      }
    },
    { label: "Same Period Last Year", isDisabled: true, onClick: () => { } }
  ];
  const showDates = (startDate = new Date(), endDate = new Date()) => {
    const start = moment(startDate);
    const end = moment(endDate);

    if (start.year() === end.year()) {
      return `${start.format("MMM D")} – ${end.format("MMM D, YYYY")}`;
    }
    return `${start.format("MMM D, YYYY")} – ${end.format("MMM D, YYYY")}`;
  };
  const refOne = useRef(null);
  const handleClickOutside = (event) => {
    if (refOne.current && !refOne.current.contains(event.target)) {
      setDisplayDateRangePicker(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [newName, setNewName] = useState("");
  const [saveError, setSaveError] = useState(null);
  
  const _deleteSaveDateRange= async(id)=>{
    await deleteSaveDateRange(id);
    await loadSavedDateRanges();
  }
  const _saveNewDateRange= async(newRange)=>{
    const isSaved=await saveNewDateRange(newRange);
    setSaveError(null);
    if(isSaved){
      await loadSavedDateRanges();
      setNewName("");
      // alert(`Saved date range: ${newRange.label}`); 
    }else{
      setSaveError(`Name '${newRange.label}' alrady in use!`)
      // alert(`Error: Name '${newRange.label}' alrady in use!`); 
    }
            
            
            
  }
  return (
    <div ref={refOne} className=" max-w-2xl ml-auto mr-0 bg-white shadow rounded-lg border border-gray-200 items-end justify-end m-0">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-1  border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            className="text-gray-500 hover:text-black cursor-pointer"
            onClick={() => setDisplayDateRangePicker(false)}
          >
            {closeButtonIcon}
          </button>

          <span className="text-[14px] font-semibold">Date Range</span>
        </div>
        <label className="flex items-center space-x-2">
          <div className="flex items-center gap-1 p-1 rounded-full ">
            <span className="text-[14px] text-gray-800">Compare:</span>
            <button
              onClick={() => setComparisonMode((v) => !v)}
              aria-pressed={comparisonMode}
              className={`
          relative inline-flex h-[22px] w-[42px] items-center rounded-full transition
          ${comparisonMode ? "bg-blue-600" : "bg-neutral-300"}
          shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]
        `}
            >
              <span
                className={`
            pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white transform transition
            ${comparisonMode ? "translate-x-[22px]" : "translate-x-[4px]"}
            shadow-[0_1px_1px_rgba(0,0,0,0.2)]
          `}
              />
            </button>
          </div>
        </label>
      </div>
      {/* Date Range Period */}
      <div className="flex justify-between gap-2 w-full items-center  px-3 py-1">
        <div onClick={() => setActiveDateRangePicker(true)} className={`cursor-pointer flex-col gap-1 rounded-lg py-1 px-2 bg-gray-50  border ${comparisonMode && activeDateRangePicker ? "border-[#0085FF]" : "border-gray-200"} ${comparisonMode ? "flex-1" : "w-full"}`}>
          <div className="text-[12px] ">Current Period</div>
          <span className="text-[13px] font-semibold">
            {(showDates(currentPeriod?.startDate, currentPeriod?.endDate))}
          </span>
        </div>
        {comparisonMode && (
          <div onClick={() => setActiveDateRangePicker(false)} className={`cursor-pointer flex-1 flex-col gap-1 rounded-lg py-1  bg-gray-50  px-2  border ${comparisonMode && !activeDateRangePicker ? "border-[#0085FF]" : "border-gray-200"} `}>
            <div className="text-[12px] ">Compare Period</div>
            <span className="text-[13px] font-semibold">
              {(showDates(previousPeriod?.startDate, previousPeriod?.endDate))}
            </span>
          </div>
        )}


      </div>
      {/* Quick Filters */}
      <div className="flex gap-1 px-3  pt-0 pb-1 border-b flex-col">
        <span className="text-[13px]">Quick Filters</span>
        <div className="flex gap-1 overflow-x-auto scrollbarWrap">


          {(activeDateRangePicker ? quickCurrentFilters : quickPreviousFilters).map((filter, i) => (
            <button
              key={i}
              disabled={filter.isDisabled}
              className={`px-2 py-1 bg-gray-100  whitespace-nowrap  border rounded text-[12px] hover:bg-gray-100 ${filter.isDisabled ? "cursor-not-allowed bg-gray-200 opacity-50" : "cursor-pointer bg-white"} ${(activeDateRangePicker && filter.label == activeCurrentFilters) || (!activeDateRangePicker && filter.label == activePreviousFilters) ? "bg-blue-100 border-blue-500 text-blue-600" : "border-gray-300 text-gray-700"}`}
              onClick={() => filter.onClick()}
            >
              <div className="flex  whitespace-nowrap items-center  gap-1">
                {filter?.icon && (<span className="mr-1">{filter.icon}</span>)}
                {filter.label}
              </div>
            </button>
          ))}

        </div>
      </div>
      {/* Saved Date Ranges */}      
      {savedDateRanges.length ?(
        <div className="flex gap-1 px-3 py-1 border-b flex-col">
          <span className="text-[13px]">Saved Date Ranges</span>
          <div className="flex gap-1 overflow-x-auto scrollbarWrap">
            {/* {
              savedDateRanges.length === 0 && (
                <span className="text-gray-500 text-sm">No saved date ranges</span>
              )
            } */}

            {savedDateRanges?.map((filter, i) => {
              
              return(
              <button
                key={i}
                disabled={(!activeDateRangePicker)&&(moment(filter.startDate, "DD/MM/YYYY", true).isAfter(moment(currentPeriod?.startDate, "DD/MM/YYYY", true), "day")||moment(filter.endDate, "DD/MM/YYYY", true).isAfter(moment(currentPeriod?.startDate, "DD/MM/YYYY", true), "day"))}
                className={`px-2 py-1   whitespace-nowrap  border rounded text-[12px] hover:bg-gray-100 
                  ${
                    (moment(filter.startDate, "YYYY-MM-DD", true).isSame(
                      moment((activeDateRangePicker?currentPeriod:previousPeriod)?.startDate, "YYYY-MM-DD", true), "day")
                      &&moment(filter.endDate, "YYYY-MM-DD", true).isSame(
                        moment((activeDateRangePicker?currentPeriod:previousPeriod)?.endDate, "YYYY-MM-DD", true), "day")
                      )? "bg-blue-100 border-blue-500 text-blue-600" : "border-gray-300 text-gray-700"} 
                       ${(!activeDateRangePicker)&&(moment(filter.startDate).isAfter(moment(currentPeriod?.startDate), "day")||moment(filter.endDate).isAfter(moment(currentPeriod?.startDate), "day")) ? "cursor-not-allowed bg-gray-200 opacity-50" : "cursor-pointer bg-white"} `}
                onClick={() => {
                  if(activeDateRangePicker){
                    setCurrentPeriod({ startDate: filter.startDate, endDate: filter.endDate });
                    setActiveCurrentFilters("Custom");

                  }else{
                    setPreviousPeriod({ startDate: filter.startDate, endDate: filter.endDate });
                    setActivePreviousFilters("Custom");

                  }
                  // setComparisonMode(filter.comparisonMode);
                }}
              >
                <div className="flex  whitespace-nowrap items-center  gap-1">
                  {filter.label}
                  <span className="mr-1 text-gray-500 hover:text-red-700 cursor-pointer z-2" onClick={(e) => {
                    e.stopPropagation();
                    _deleteSaveDateRange(filter?.id??i)
                  }}>
                    {deleteButtonIcon}
                  </span>
                </div>
              </button>
            )})
            }

          </div>
        </div>
      ):(<></>)}

      {/* Date Inputs */}
      <div className={`px-3 py-1 grid gap-2 ${comparisonMode ? "grid-cols-2" : "grid-cols-1"}`} >
        {/* Current Period */}
        <div className={`border rounded-lg px-2 py-1 ${comparisonMode && activeDateRangePicker ? "border-[#0085FF]" : "border-gray-200"}`}>
          <DateRangePeriod label="Current Period" comparisonMode={comparisonMode} maxDate={allowedMaxDate} setActiveFilters={setActiveCurrentFilters} isDisabled={activeDateRangePicker == false} period={currentPeriod} setPeriod={setCurrentPeriod}  activeDateRangePicker={activeDateRangePicker} setActiveDateRangePicker={setActiveDateRangePicker}/>
        </div>

        {/* Previous Period */}
        {comparisonMode && (
          <div className={`border rounded-lg px-2 py-1 ${activeDateRangePicker ? "border-gray-200" : "border-[#0085FF]"}`}>
            <DateRangePeriod label="Compare Period" comparisonMode={comparisonMode} maxDate={moment(currentPeriod?.startDate)?.subtract(1, 'day').toDate()} setActiveFilters={setActivePreviousFilters} isDisabled={activeDateRangePicker} period={previousPeriod} setPeriod={setPreviousPeriod}  activeDateRangePicker={activeDateRangePicker} setActiveDateRangePicker={setActiveDateRangePicker}/>
          </div>
        )}
      </div>

      {/* Save A New Date Ranges */}
      <div className="px-3 py-1  flex items-center space-x-2 w-full max-w-3xl">
        <input

          type="text"
          placeholder="Set Date Range Name"
          value={newName}
          className="flex-1 text-[13px] border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          pattern="[A-Za-z0-9]*"
          onChange={(e) => setNewName(e.target.value.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, ' ').substring(0, 50).trimStart())}
          autoComplete="off"
          maxLength="50"
        />
        <button
          onClick={async() => {
            if (newName.trim() === "") {
              setSaveError(`Please enter a valid name for the date range.`)
              // alert("Please enter a valid name for the date range.");
              return;
            }
            const newRange = {
              label: newName,
              startDate: activeDateRangePicker?currentPeriod.startDate:previousPeriod.startDate,
              endDate: activeDateRangePicker?currentPeriod.endDate:previousPeriod.endDate,
              // previousStartDate: previousPeriod.startDate,
              // previousEndDate: previousPeriod.endDate,
              // comparisonMode
            };
            await _saveNewDateRange(newRange);
          }}
          className="bg-blue-600 text-[14px] hover:bg-blue-700 text-white px-2 py-1 rounded-md"
        >
          Save
        </button>
      </div>
      {saveError&&(<div className="px-3 py-0 text-[12px] text-red-500"><strong>Error:</strong> {saveError}</div>)}

      {/* Footer */}
      <div className="flex justify-end gap-2 px-2 py-1 border-t border-gray-200">
        <button onClick={() => setDisplayDateRangePicker(false)} className="px-3 py-1 text-[14px] border rounded hover:bg-gray-100">
          Cancel
        </button>
        <button className="px-3 py-1 bg-blue-600  text-[14px] text-white rounded hover:bg-blue-700"

          onClick={() => {
            onChange({ currentPeriod, previousPeriod, comparisonMode, activeCurrentFilters, activePreviousFilters });
            setDisplayDateRangePicker(false);
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
