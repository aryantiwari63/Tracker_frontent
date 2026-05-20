import React, { useEffect, useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { trackDashboardClick } from "../../../analytics/EventController";
// import { useEbuxContext } from '../Context/EbuxProvider';


const CustomMultiSelect = ({
  tooltip = true,
  label,
  options,
  value,
  onChange,
  labelledBy,
  disabled = false,
  selectAllText = "Select All",
  toggleShowMoreTooltip = () => { },
  useMsl=false,
  selectedMsl='all',
  updateSelectedMSL,
}) => {
  console.log('optionsoptions',value)
//   const {
//     selectedFilters
// } = useEbuxContext();

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const customValueRenderer = (selected) => {
    console.log('selectedselected',selected)
    const alllable = selected?.map(({ label }) => label);
    if (alllable.length > 1) {
      return (
        <span>
          {/* <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> */}
          {alllable?.[0]?.substring(0, 5) + ((alllable?.[0]?.length > 5) ? "..." : "")}{" "}
          <span className="selectCount" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleShowMoreTooltip(e, label, (value?.map(({ label }) => label)?.join(", ") ?? "")) }} >+{alllable.length - 1} more</span>
        </span>
      );
    }


    return selected?.length ? alllable.join(", ") : labelledBy;
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Assuming you can identify the popover element by class or other means
      if (isDropdownVisible && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    if (isDropdownVisible) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownVisible]);
  // Function to show the dropdown

  // const getPfName = (pf_id) => {  
  //  return selectedFilters?.selectedPlatformKw.filter((item => item.value == pf_id))?.[0]?.label ?? '';
  // }
  return (
    <>
      <div
        className={`ebuxHeadBox  ${disabled ? "cursor-not-allowed opacity-40" : ""
          }`}

      >
        <div className="flex justify-between items-center w-full">
        <label>{label}</label>
        {label=='Product'&&useMsl&&updateSelectedMSL?
        <div className="flex space-x-4">
                <label className="flex items-center space-x-1">
                <input
                    type="radio"
                    name="option"
                    value="all"
                    checked={selectedMsl === "all"}
                    onChange={(e) => updateSelectedMSL(e.target.value)}
                    className="cursor-pointer"
                />
                <span>All</span>
                </label>
                <label className="flex items-center space-x-1">
                <input
                    type="radio"
                    name="option"
                    value="msl"
                    checked={selectedMsl === "msl"}
                    onChange={(e) => updateSelectedMSL(e.target.value)}
                    className="cursor-pointer"
                />
                <span>MSL</span>
                </label>
        </div>:<></>}
        </div>
        <div className="selectItemsListWrap"
          onClick={(e) => {
            trackDashboardClick({section:'Top filters',eventcategory:'',eventaction:e.type,eventlabel: label.toLowerCase()});
          }}
          > 
          {
           label=='Product'?
           <MultiSelect
            disabled={disabled}
            valueRenderer={customValueRenderer}
            options={options ?? []}
            value={value ?? []}
            onChange={onChange}
            // onClick={onClick}
            labelledBy={labelledBy}
            overrideStrings={{
              "selectAll": selectAllText,  // Change "Select All" text
              // "allItemsAreSelected": "All Items Picked",
              // "selectSomeItems": "Pick Items..."
            }}

            ItemRenderer={({ option, checked, onClick }) => (
              <div
                // onClick={onClick}
                style={{ padding: "0px 5px", cursor: "pointer" }}
              >
                <input type="checkbox" checked={value?.length ? checked : false} readOnly
                onClick={(e) => {
                  e.stopPropagation(); // ✅ prevent parent div click
                  onClick(); // ✅ call only once
                }} />
                <span style={{ marginLeft: "8px" }}>{`${option?.label??''} `}</span>
                {
                  option?.web_pid && option?.label?
                  <>
                  <br/>
                  <span>{`${option?.web_pid??''}`}</span>
                  </>
                  :
                  <></>
                }
                
              </div>
            )}

          />
           :

           label=='Keyword'?
           <MultiSelect
            disabled={disabled}
            valueRenderer={customValueRenderer}
            options={options ?? []}
            value={value ?? []}
            onChange={onChange}
            // onClick={onClick}
            labelledBy={labelledBy}
            overrideStrings={{
              "selectAll": selectAllText,  // Change "Select All" text
              // "allItemsAreSelected": "All Items Picked",
              // "selectSomeItems": "Pick Items..."
            }}

            ItemRenderer={({ option, checked, onClick }) => (
              <div
                // onClick={onClick}
                style={{ padding: "0px 5px", cursor: "pointer" }}
              >
               <input type="checkbox" checked={value?.length ? checked : false}
                readOnly
                onClick={(e) => {
                  e.stopPropagation(); // ✅ prevent parent div click
                  onClick(); // ✅ call only once
                }} />
                <span style={{ marginLeft: "8px" }}>{`${option?.label??''} `}</span>
                {/* {
                  option?.pf_id && option?.label?
                  
                
                  <span>{` - ${ getPfName(option?.pf_id)??''}`}</span>
                  
                  :
                  <></>
                } */}
                
              </div>
            )}

          />
           :
          <MultiSelect
            disabled={disabled}
            valueRenderer={customValueRenderer}
            options={options ?? []}
            value={value ?? []}
            onChange={onChange}
            // onClick={onClick}
            labelledBy={labelledBy}
            overrideStrings={{
              "selectAll": selectAllText,  // Change "Select All" text
              // "allItemsAreSelected": "All Items Picked",
              // "selectSomeItems": "Pick Items..."
            }}

          />
          }
          {/* <MultiSelect
            disabled={disabled}
            valueRenderer={customValueRenderer}
            options={options ?? []}
            value={value ?? []}
            onChange={onChange}
            // onClick={onClick}
            labelledBy={labelledBy}
            overrideStrings={{
              "selectAll": selectAllText,  // Change "Select All" text
              // "allItemsAreSelected": "All Items Picked",
              // "selectSomeItems": "Pick Items..."
            }}

            ItemRenderer={({ option, checked, onClick }) => (
              <div
                onClick={onClick}
                style={{ padding: "5px 10px", cursor: "pointer" }}
              >
                <input type="checkbox" checked={checked} readOnly />
                <span style={{ marginLeft: "8px" }}>{`${option?.web_pid}-${option?.label}`}</span>
              </div>
            )}

          /> */}
          {(!disabled) && (tooltip) && isDropdownVisible && (
            <div  >
              {value.length > 0 && (
                <div className="selectItemsList" ref={dropdownRef}>
                  {value.map(({ label }) => label).join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomMultiSelect;
