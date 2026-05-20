import React, { useEffect, useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { createPortal } from "react-dom";

const Tooltip = ({ infoTooltip, position }) => {
  if (!infoTooltip) return null;

  return createPortal(
    <div
      className="fixed bg-gray-800 text-white text-xs p-2 rounded-md whitespace-nowrap z-[1000]"
      style={{ top: position.top-10, left: position.left }}
    >
      <div
        className="absolute top-3 left-[-4px] transform -translate-y-1/2 w-0 h-0 
          border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"
      ></div>

      <ul>
        <li>web_pid - {infoTooltip?.web_pid}</li>
        <li>EAN Code - {infoTooltip?.ean_code}</li>
        <li>Brand Pack SKU - {infoTooltip?.brand_pack_sku}</li>
        <li>SKU Name - {infoTooltip?.sku_name}</li>
        <li>platform_id - {infoTooltip?.ebux_code_platform_id}</li>
      </ul>
    </div>,
    document.body 
  );
};
const CustomMultiSelectV2 = ({
  tooltip=true,
  label,
  options,
  value,
  onChange,
  labelledBy,
  disabled = false,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("all");
  const customValueRenderer = (selected) => {
    const alllable = selected?.map(({ label }) => label);
    if (alllable.length > 1) {
      return (
        <span>
        {/* <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> */}
          {alllable?.[0]?.substring(0, 5)+((alllable?.[0]?.length>5)?"...":"")}{" "}
          <span className="selectCount" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); if(isDropdownVisible){handleMouseLeave()}else{handleMouseEnter()} }} >+{alllable.length - 1} more</span>
        </span>
      );
    }


    return selected.length ? alllable.join(", ") : labelledBy;
  };
 useEffect(() => {
     const handleClickOutside = (event) => {
       if (isDropdownVisible && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
       }
     };
     if(isDropdownVisible){
      document.addEventListener("click", handleClickOutside);
     }else{
      document.removeEventListener("click", handleClickOutside);
     }
     return () => {
       document.removeEventListener("click", handleClickOutside);
     };
   }, [isDropdownVisible]);
  const handleMouseEnter = () => {
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownVisible(false);
  };
  const [infoTooltip, setInfoTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const toggleTooltip = (event, option) => {
    if (infoTooltip?._id === option?._id) {
      setInfoTooltip(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + window.scrollY + rect.height / 2, 
        left: rect.right + window.scrollX + 8, 
      });
      setInfoTooltip(option);
    }
  };
  const customLabel = (item) =>{  
    
    return (
      <div className="flex items-center relative overflow-visible">
        
        {item?.option?.web_pid ? (
          <>
          <span className="break-words max-w-[100px]">
            {item?.option?.web_pid}, {item?.option?.ebux_code_platform_id}, {item?.option?.label}
          </span>
          <button
            className="tooltip-button w-5 h-5 flex items-center justify-center rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-xs font-bold transition relative"
            onMouseEnter={(event) => toggleTooltip(event, item?.option)}
            onMouseLeave={() => setInfoTooltip(null)}
          >
            i
          </button>
              
              

            
          </>
        ):(
          <span>{item?.option?.label}</span>
        )
      }
       <Tooltip infoTooltip={infoTooltip} position={tooltipPosition} onClose={() => setInfoTooltip(null)} />
      </div>
    );
  } 
  const filterOptions = (options, search) => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
  
    return options?.filter(({web_pid,sku_name,ean_code,ebux_code_platform_id,brand_pack_sku}) =>
      Object.values({web_pid,sku_name,ean_code,ebux_code_platform_id,brand_pack_sku}).some((field) =>
        field?.toLowerCase()?.includes(searchLower)
      )
    );
  };
  return (
    <>
      <div 
        className={`ebuxHeadBox ${
          disabled ? "cursor-not-allowed opacity-40" : ""
        }`}
      >
        <div className="flex justify-between items-center w-full">
        <label>{label}</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="option"
                value="all"
                checked={selectedOption === "all"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="cursor-pointer"
              />
              <span>All</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="option"
                value="msl"
                checked={selectedOption === "msl"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="cursor-pointer"
              />
              <span>MSL</span>
            </label>
          </div>
        </div>
        <div className="selectItemsListWrap">
          <MultiSelect

            filterOptions={filterOptions}
            disabled={disabled}
            valueRenderer={customValueRenderer}
            options={options ?? []}
            value={value ?? []}
            onChange={onChange}
            labelledBy={labelledBy}
            ItemRenderer={(item) => (
              <div
            className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
            onClick={item.onClick}
          >
            <input type="checkbox" checked={item.checked} readOnly className="mr-2" />
                {customLabel(item)}
              </div>
            )}
          />
          {(!disabled)&&(tooltip)&&isDropdownVisible && (
            <div  >
              {value.length > 0 && (
                <div className="selectItemsList" ref={dropdownRef}>
                  <ul>{value.map(({ label },i) => <li key={i}>{label}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomMultiSelectV2;
